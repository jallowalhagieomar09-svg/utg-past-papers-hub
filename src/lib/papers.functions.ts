import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type DbPaper = {
  id: string;
  code: string;
  title: string;
  faculty: string;
  department: string;
  semester: "First" | "Second" | "Resit";
  year: number;
  downloads: number;
  addedAt: string;
  fileUrl: string;
};

export const listPapers = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("papers")
    .select("id,drive_file_id,title,course_code,faculty_slug,department,year,semester,downloads,added_at")
    .order("added_at", { ascending: false });
  if (error) throw new Error(error.message);
  const papers: DbPaper[] = (data ?? []).map((p) => ({
    id: p.id,
    code: p.course_code ?? "—",
    title: p.title,
    faculty: p.faculty_slug ?? "",
    department: p.department ?? "",
    semester: (p.semester as DbPaper["semester"]) ?? "First",
    year: p.year ?? 0,
    downloads: p.downloads ?? 0,
    addedAt: p.added_at,
    fileUrl: `/api/public/paper-image/${p.drive_file_id}`,
  }));
  return { papers };
});
