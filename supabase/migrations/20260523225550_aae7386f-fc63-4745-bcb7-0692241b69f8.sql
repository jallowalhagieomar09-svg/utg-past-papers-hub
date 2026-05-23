
-- Papers table
CREATE TABLE public.papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drive_file_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  course_code TEXT,
  faculty_slug TEXT,
  department TEXT,
  year INTEGER,
  semester TEXT,
  mime_type TEXT,
  size_bytes BIGINT,
  web_view_link TEXT,
  download_link TEXT,
  downloads INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_papers_faculty ON public.papers(faculty_slug);
CREATE INDEX idx_papers_course ON public.papers(course_code);
CREATE INDEX idx_papers_year ON public.papers(year);

ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Papers are publicly viewable"
  ON public.papers FOR SELECT
  USING (true);

-- Drive folders to sync
CREATE TABLE public.drive_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  folder_id TEXT NOT NULL UNIQUE,
  label TEXT,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.drive_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drive folders are publicly viewable"
  ON public.drive_folders FOR SELECT
  USING (true);

-- Paper requests
CREATE TABLE public.paper_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code TEXT,
  title TEXT NOT NULL,
  faculty_slug TEXT,
  year INTEGER,
  semester TEXT,
  notes TEXT,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.paper_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create paper requests"
  ON public.paper_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Paper requests are publicly viewable"
  ON public.paper_requests FOR SELECT
  USING (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_papers_updated_at
  BEFORE UPDATE ON public.papers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
