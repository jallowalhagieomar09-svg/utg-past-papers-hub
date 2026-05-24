import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

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

function getPublicSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error("Missing public backend environment variables for papers.");
  }

  return createClient(supabaseUrl, publishableKey, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const listPapers = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("papers")
    .select("id,drive_file_id,storage_path,title,course_code,faculty_slug,department,year,semester,downloads,added_at")
    .order("added_at", { ascending: false });
  if (error) throw new Error(error.message);
  const papers: DbPaper[] = (data ?? []).map((p) => {
    let fileUrl = "";
    if (p.storage_path) {
      fileUrl = supabase.storage.from("papers").getPublicUrl(p.storage_path).data.publicUrl;
    } else if (p.drive_file_id) {
      fileUrl = `/api/public/paper-image/${p.drive_file_id}`;
    }
    return {
      id: p.id,
      code: p.course_code ?? "—",
      title: p.title,
      faculty: p.faculty_slug ?? "",
      department: p.department ?? "",
      semester: (p.semester as DbPaper["semester"]) ?? "First",
      year: p.year ?? 0,
      downloads: p.downloads ?? 0,
      addedAt: p.added_at,
      fileUrl,
    };
  });
  return { papers };
});
