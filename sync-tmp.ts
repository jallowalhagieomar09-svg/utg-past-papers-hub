import { createClient } from "@supabase/supabase-js";

const FOLDER_ID = "17kwqUjb4HQxD0phDEnOxJUDKYAJltwem";
const GW = "https://connector-gateway.lovable.dev/google_drive/drive/v3";
const AI = "https://ai.gateway.lovable.dev/v1/chat/completions";
const FACULTIES = ["agriculture","arts-sciences","engineering","education","journalism","business","ict","medicine","law"];

const lov = process.env.LOVABLE_API_KEY!;
const gd = process.env.GOOGLE_DRIVE_API_KEY!;
const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function listAll() {
  const files: any[] = [];
  let token: string | undefined;
  do {
    const p = new URLSearchParams({ q: `'${FOLDER_ID}' in parents and trashed=false`, pageSize: "1000", fields: "nextPageToken,files(id,name,mimeType,size,webViewLink)" });
    if (token) p.set("pageToken", token);
    const r = await fetch(`${GW}/files?${p}`, { headers: { Authorization: `Bearer ${lov}`, "X-Connection-Api-Key": gd } });
    if (!r.ok) throw new Error(`list ${r.status}: ${await r.text()}`);
    const d: any = await r.json();
    files.push(...(d.files ?? []));
    token = d.nextPageToken;
  } while (token);
  return files;
}

async function extract(id: string, mime: string) {
  const ir = await fetch(`${GW}/files/${id}?alt=media`, { headers: { Authorization: `Bearer ${lov}`, "X-Connection-Api-Key": gd } });
  if (!ir.ok) throw new Error(`dl ${ir.status}`);
  const buf = Buffer.from(await ir.arrayBuffer());
  const b64 = buf.toString("base64");
  const body = {
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: "Extract metadata from UTG exam paper photos. Be conservative." },
      { role: "user", content: [
        { type: "text", text: "Extract metadata from this exam paper photo." },
        { type: "image_url", image_url: { url: `data:${mime};base64,${b64}` } },
      ]},
    ],
    tools: [{ type: "function", function: { name: "save_paper", parameters: { type: "object", properties: {
      title: { type: "string" }, course_code: { type: "string" }, year: { type: "integer" },
      semester: { type: "string" }, faculty_slug: { type: "string", enum: [...FACULTIES, ""] },
      department: { type: "string" }, is_paper: { type: "boolean" },
    }, required: ["title","course_code","year","semester","faculty_slug","department","is_paper"] }}}],
    tool_choice: { type: "function", function: { name: "save_paper" } },
  };
  const r = await fetch(AI, { method: "POST", headers: { Authorization: `Bearer ${lov}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`ai ${r.status}: ${await r.text()}`);
  const d: any = await r.json();
  return JSON.parse(d.choices[0].message.tool_calls[0].function.arguments);
}

const files = await listAll();
const imgs = files.filter((f) => f.mimeType?.startsWith("image/"));
const { data: existing } = await supa.from("papers").select("drive_file_id");
const have = new Set((existing ?? []).map((r: any) => r.drive_file_id));
const news = imgs.filter((f) => !have.has(f.id));
console.log(`Drive: ${files.length} files, ${imgs.length} images. DB has ${have.size}. New: ${news.length}`);

let inserted = 0, skipped = 0;
const errors: string[] = [];
for (const f of news) {
  try {
    const m = await extract(f.id, f.mimeType);
    if (!m.is_paper) { skipped++; console.log(`skip not-paper: ${f.name}`); continue; }
    const { error } = await supa.from("papers").insert({
      drive_file_id: f.id, title: m.title || f.name, course_code: m.course_code || null,
      year: m.year || null, semester: m.semester || null, faculty_slug: m.faculty_slug || null,
      department: m.department || null, mime_type: f.mimeType,
      size_bytes: f.size ? Number(f.size) : null, web_view_link: f.webViewLink ?? null,
    });
    if (error) { errors.push(`${f.id}: ${error.message}`); console.log(`err ${f.name}: ${error.message}`); }
    else { inserted++; console.log(`+ ${m.course_code || ""} ${m.title}`); }
  } catch (e: any) {
    errors.push(`${f.id}: ${e.message}`); console.log(`err ${f.name}: ${e.message}`);
  }
}
await supa.from("drive_folders").update({ last_synced_at: new Date().toISOString() }).eq("folder_id", FOLDER_ID);
console.log(`\nDone. inserted=${inserted} skipped=${skipped} errors=${errors.length}`);
