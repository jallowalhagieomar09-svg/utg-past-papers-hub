import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { listPendingUploads, approveUpload, rejectUpload, addPaperDirect, listPaperRequests, updateRequestStatus } from "@/lib/admin.functions";
import { FACULTIES, SEMESTERS, YEARS } from "@/lib/papers-data";
import { toast } from "sonner";
import { Check, X, LogOut, Loader2, Plus, FileText, Inbox, MessageSquare, Mail } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — UTGSU Academic Resource Hub" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"pending" | "add">("pending");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="container mx-auto max-w-4xl px-4 py-16 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }
  if (!isAdmin) {
    return (
      <section className="container mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-serif text-2xl">Not an admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You're signed in as {user.email}, but you don't have admin access. Ask an administrator to grant your account access.
        </p>
        <button
          onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/login" }))}
          className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-accent"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Admin</div>
          <h1 className="mt-1 font-serif text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {user.email}</p>
        </div>
        <button
          onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/login" }))}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-accent"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-6 inline-flex rounded-xl border border-white/20 bg-white/10 p-1.5 backdrop-blur-xl shadow-elegant dark:border-white/10 dark:bg-white/5">
        <TabBtn active={tab === "pending"} onClick={() => setTab("pending")} icon={<Inbox className="h-4 w-4" />}>
          Pending uploads
        </TabBtn>
        <TabBtn active={tab === "add"} onClick={() => setTab("add")} icon={<Plus className="h-4 w-4" />}>
          Add paper
        </TabBtn>
      </div>

      <div className="mt-6">
        {tab === "pending" ? <PendingList /> : <AddPaperForm />}
      </div>
    </section>
  );
}

function TabBtn({ active, onClick, icon, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${active ? "bg-white/25 text-white shadow-sm backdrop-blur-md dark:bg-white/20" : "text-white/80 hover:bg-white/15 hover:text-white dark:text-white/70 dark:hover:bg-white/10"}`}
    >
      {icon}{children}
    </button>
  );
}

function PendingList() {
  const queryClient = useQueryClient();
  const fetchPending = useServerFn(listPendingUploads);
  const approveFn = useServerFn(approveUpload);
  const rejectFn = useServerFn(rejectUpload);
  const { data, isLoading } = useQuery({ queryKey: ["pending-uploads"], queryFn: () => fetchPending() });

  const approve = useMutation({
    mutationFn: (id: string) => approveFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Approved — added to library");
      queryClient.invalidateQueries({ queryKey: ["pending-uploads"] });
      queryClient.invalidateQueries({ queryKey: ["papers"] });
    },
    onError: (e: any) => toast.error(e.message),
  });
  const reject = useMutation({
    mutationFn: (id: string) => rejectFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Rejected");
      queryClient.invalidateQueries({ queryKey: ["pending-uploads"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const uploads = data?.uploads ?? [];
  if (uploads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">No pending uploads. You're all caught up.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      {uploads.map((u: any) => (
        <div key={u.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {u.course_code && <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-primary">{u.course_code}</span>}
                {u.year ? <span>{u.year}</span> : null}
                {u.semester ? <span>· {u.semester}</span> : null}
                {u.faculty_slug ? <span>· {u.faculty_slug}</span> : null}
              </div>
              <h3 className="mt-1 font-medium text-foreground">{u.title}</h3>
              {u.department && <p className="mt-0.5 text-xs text-muted-foreground">{u.department}</p>}
              {(u.uploader_name || u.uploader_email) && (
                <p className="mt-2 text-xs text-muted-foreground">
                  From: {u.uploader_name || "Anonymous"}{u.uploader_email ? ` · ${u.uploader_email}` : ""}
                </p>
              )}
              {u.notes && <p className="mt-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">{u.notes}</p>}
              {u.file_url && (
                <a href={u.file_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-primary underline">
                  View file
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => approve.mutate(u.id)}
                disabled={approve.isPending}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" /> Approve
              </button>
              <button
                onClick={() => reject.mutate(u.id)}
                disabled={reject.isPending}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-accent disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" /> Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddPaperForm() {
  const queryClient = useQueryClient();
  const addFn = useServerFn(addPaperDirect);
  const [form, setForm] = useState({
    title: "",
    course_code: "",
    year: "",
    semester: "",
    faculty_slug: "",
    department: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    setSubmitting(true);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `papers/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("papers").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (upErr) throw upErr;

      await addFn({
        data: {
          title: form.title,
          course_code: form.course_code || null,
          year: form.year ? Number(form.year) : null,
          semester: form.semester || null,
          faculty_slug: form.faculty_slug || null,
          department: form.department || null,
          storage_path: path,
          mime_type: file.type,
        },
      });
      toast.success("Paper added to library");
      setForm({ title: "", course_code: "", year: "", semester: "", faculty_slug: "", department: "" });
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["papers"] });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to add paper");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Course code" value={form.course_code} onChange={(v) => setForm({ ...form, course_code: v })} placeholder="e.g. CSC101" />
        <Field label="Title" required value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="e.g. Intro to CS" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="Faculty" value={form.faculty_slug} onChange={(v) => setForm({ ...form, faculty_slug: v })}
          options={FACULTIES.map((f) => ({ value: f.slug, label: f.short }))} />
        <Select label="Semester" value={form.semester} onChange={(v) => setForm({ ...form, semester: v })}
          options={SEMESTERS.map((s) => ({ value: s, label: s }))} />
        <Select label="Year" value={form.year} onChange={(v) => setForm({ ...form, year: v })}
          options={YEARS.map((y) => ({ value: String(y), label: String(y) }))} />
      </div>
      <Field label="Department (optional)" value={form.department} onChange={(v) => setForm({ ...form, department: v })} />
      <label className="block">
        <span className="text-xs font-medium">File (PDF or image)</span>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1.5 block w-full text-sm"
          required
        />
      </label>
      <button
        disabled={submitting}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Add paper
      </button>
      <p className="text-xs text-muted-foreground">
        Or <Link to="/" className="underline">browse the library</Link>.
      </p>
    </form>
  );
}

function Field({ label, value, onChange, required, placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium">{label}{required && " *"}</span>
      <input
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="block">
      <span className="text-xs font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
