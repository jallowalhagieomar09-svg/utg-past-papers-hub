
-- 1. profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. app_role enum + user_roles
CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- 3. has_role security definer fn
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. paper_uploads (pending submissions)
CREATE TABLE public.paper_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  course_code text,
  year integer,
  semester text,
  faculty_slug text,
  department text,
  storage_path text,
  mime_type text,
  uploader_email text,
  uploader_name text,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id)
);
ALTER TABLE public.paper_uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit uploads" ON public.paper_uploads
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view uploads" ON public.paper_uploads
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update uploads" ON public.paper_uploads
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- 6. papers: support non-Drive sources
ALTER TABLE public.papers ADD COLUMN IF NOT EXISTS storage_path text;
ALTER TABLE public.papers ALTER COLUMN drive_file_id DROP NOT NULL;

-- 7. storage bucket
INSERT INTO storage.buckets (id, name, public)
  VALUES ('papers', 'papers', true)
  ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Paper files are publicly viewable"
  ON storage.objects FOR SELECT USING (bucket_id = 'papers');
CREATE POLICY "Anyone can upload paper files"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'papers');
CREATE POLICY "Admins can delete paper files"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'papers' AND public.has_role(auth.uid(), 'admin')
  );
