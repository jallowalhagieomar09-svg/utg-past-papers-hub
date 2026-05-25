import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const FOLDER_ID = "17kwqUjb4HQxD0phDEnOxJUDKYAJltwem";
const GW = "https://connector-gateway.lovable.dev/google_drive/drive/v3";
const AI = "https://ai.gateway.lovable.dev/v1/chat/completions";
const FACULTIES = ["agriculture", "arts-sciences", "engineering", "education", "journalism", "business", "ict", "medicine", "law"];
const MAX_PER_RUN = 10;
const THROTTLE_MS = 5 * 60 * 1000; // 5 minutes

type DriveFile = { id: string; name: string; mimeType: string; size?: string; webViewLink?: string };

async function listAllFiles(lovableKey: string, driveKey: string): Promise<DriveFile[]> {
  const files: DriveFile[] = [];
  let pageToken: string | undefined;
  do {
    const params = new URLSearchParams({
      q: `'${FOLDER_ID}' in parents and trashed=false`,
      pageSize: "1000",
      fields: "nextPageToken,files(id,name,mimeType,size,webViewLink)",
    });
    if (pageToken) params.set("pageToken", pageToken);
    const r = await fetch(`${GW}/files?${params}`, {
      headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": driveKey },
    });
    if (!r.ok) throw new Error(`Drive list ${r.status}: ${await r.text()}`);
    const data: any = await r.json();
    files.push(...(data.files ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return files;
}

async function extractMetadata(fileId: string, mime: string, lovableKey: string, driveKey: string) {
  const imgRes = await fetch(`${GW}/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": driveKey },
  });
  if (!imgRes.ok) throw new Error(`Drive download ${imgRes.status}`);
  const buf = new Uint8Array(await imgRes.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
  const b64 = btoa(bin);

  const body = {
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: "You extract metadata from photographs of University of The Gambia (UTG) exam papers. Be conservative — leave fields empty if uncertain." },
      { role: "user", content: [
        { type: "text", text: "Extract metadata from this exam paper photo." },
        { type: "image_url", image_url: { url: `data:${mime};base64,${b64}` } },
      ]},
    ],
    tools: [{
      type: "function",
      function: {
        name: "save_paper",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string" },
            course_code: { type: "string" },
            year: { type: "integer" },
            semester: { type: "string" },
            faculty_slug: { type: "string", enum: [...FACULTIES, ""] },
            department: { type: "string" },
            is_paper: { type: "boolean" },
          },
          required: ["title", "course_code", "year", "semester", "faculty_slug", "department", "is_paper"],
        },
      },
    }],
    tool_choice: { type: "function", function: { name: "save_paper" } },
  };
  const r = await fetch(AI, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`AI ${r.status}: ${await r.text()}`);
  const data: any = await r.json();
  const args = data.choices[0].message.tool_calls[0].function.arguments;
  return JSON.parse(args);
}

async function runSync(opts: { force?: boolean; max?: number } = {}) {
  const lovableKey = process.env.LOVABLE_API_KEY!;
  const driveKey = process.env.GOOGLE_DRIVE_API_KEY!;
  const maxPerRun = Math.min(Math.max(opts.max ?? MAX_PER_RUN, 1), 200);

  // Throttle
  const { data: folder } = await supabaseAdmin
    .from("drive_folders")
    .select("id,last_synced_at")
    .eq("folder_id", FOLDER_ID)
    .maybeSingle();
  if (!opts.force && folder?.last_synced_at) {
    const age = Date.now() - new Date(folder.last_synced_at).getTime();
    if (age < THROTTLE_MS) return { skipped: true, reason: "throttled", ageMs: age };
  }

  const files = await listAllFiles(lovableKey, driveKey);
  const imageFiles = files.filter((f) => f.mimeType?.startsWith("image/"));

  const { data: existing } = await supabaseAdmin.from("papers").select("drive_file_id");
  const existingIds = new Set((existing ?? []).map((r) => r.drive_file_id));

  const newFiles = imageFiles.filter((f) => !existingIds.has(f.id)).slice(0, MAX_PER_RUN);

  let inserted = 0;
  const errors: string[] = [];
  for (const f of newFiles) {
    try {
      const m = await extractMetadata(f.id, f.mimeType, lovableKey, driveKey);
      if (!m.is_paper) continue;
      const { error } = await supabaseAdmin.from("papers").insert({
        drive_file_id: f.id,
        title: m.title || f.name,
        course_code: m.course_code || null,
        year: m.year || null,
        semester: m.semester || null,
        faculty_slug: m.faculty_slug || null,
        department: m.department || null,
        mime_type: f.mimeType,
        size_bytes: f.size ? Number(f.size) : null,
        web_view_link: f.webViewLink ?? null,
      });
      if (error) errors.push(`${f.id}: ${error.message}`);
      else inserted++;
    } catch (e: any) {
      errors.push(`${f.id}: ${e.message}`);
    }
  }

  await supabaseAdmin
    .from("drive_folders")
    .update({ last_synced_at: new Date().toISOString() })
    .eq("folder_id", FOLDER_ID);

  return {
    totalDriveFiles: files.length,
    totalImages: imageFiles.length,
    alreadyInDb: existingIds.size,
    pendingBefore: imageFiles.length - existingIds.size,
    processedThisRun: newFiles.length,
    inserted,
    errors,
  };
}

export const Route = createFileRoute("/api/public/sync-drive")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const result = await runSync();
          return Response.json(result);
        } catch (e: any) {
          return Response.json({ error: e.message }, { status: 500 });
        }
      },
    },
  },
});
