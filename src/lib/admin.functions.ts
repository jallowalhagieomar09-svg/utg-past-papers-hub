import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

export const listPendingUploads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("paper_uploads")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const uploads = (data ?? []).map((u) => ({
      ...u,
      file_url: u.storage_path
        ? supabaseAdmin.storage.from("papers").getPublicUrl(u.storage_path).data.publicUrl
        : null,
    }));
    return { uploads };
  });

const paperInputSchema = z.object({
  title: z.string().min(1).max(300),
  course_code: z.string().max(50).optional().nullable(),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  semester: z.string().max(30).optional().nullable(),
  faculty_slug: z.string().max(50).optional().nullable(),
  department: z.string().max(200).optional().nullable(),
  storage_path: z.string().max(500).optional().nullable(),
  mime_type: z.string().max(100).optional().nullable(),
});

export const addPaperDirect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => paperInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("papers")
      .insert({
        title: data.title,
        course_code: data.course_code || null,
        year: data.year || null,
        semester: data.semester || null,
        faculty_slug: data.faculty_slug || null,
        department: data.department || null,
        storage_path: data.storage_path || null,
        mime_type: data.mime_type || null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const approveUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: upload, error: uErr } = await supabaseAdmin
      .from("paper_uploads")
      .select("*")
      .eq("id", data.id)
      .single();
    if (uErr) throw new Error(uErr.message);
    if (upload.status !== "pending") throw new Error("Already reviewed");

    const { error: insErr } = await supabaseAdmin.from("papers").insert({
      title: upload.title,
      course_code: upload.course_code,
      year: upload.year,
      semester: upload.semester,
      faculty_slug: upload.faculty_slug,
      department: upload.department,
      storage_path: upload.storage_path,
      mime_type: upload.mime_type,
    });
    if (insErr) throw new Error(insErr.message);

    await supabaseAdmin
      .from("paper_uploads")
      .update({ status: "approved", reviewed_at: new Date().toISOString(), reviewed_by: context.userId })
      .eq("id", data.id);
    return { ok: true };
  });

export const rejectUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("paper_uploads")
      .update({ status: "rejected", reviewed_at: new Date().toISOString(), reviewed_by: context.userId })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
