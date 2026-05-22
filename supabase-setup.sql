-- ============================================================
-- Webforyou Agency Site - Complete Supabase Database Setup
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name     text NOT NULL,
  business_name   text NOT NULL,
  description     text,
  branding_colors text,
  deadline        text,
  google_maps_link text,
  passkey         text NOT NULL UNIQUE,
  status          text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'ongoing', 'completed')),
  investment_cost numeric(12, 2) DEFAULT 0,
  amount_paid     numeric(12, 2) DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. MILESTONES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS milestones (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ongoing', 'completed')),
  "order"     integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS milestones_project_id_idx ON milestones(project_id);

-- ============================================================
-- 3. MAINTENANCE REQUESTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  message     text NOT NULL,
  attachments text[] DEFAULT '{}',
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'failed')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS maintenance_requests_project_id_idx ON maintenance_requests(project_id);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_maintenance_requests_updated_at ON maintenance_requests;
CREATE TRIGGER set_maintenance_requests_updated_at
  BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 4. CONTACT SUBMISSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  message    text NOT NULL,
  status     text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. PLAN REQUESTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS plan_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  business_name   text NOT NULL,
  mobile_number   text NOT NULL,
  plan_name       text NOT NULL,
  status          text NOT NULL DEFAULT 'new',
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- All data access goes through server-side API routes using the
-- service_role key, which bypasses RLS. We still enable RLS for
-- safety and add a policy that allows the service role full access.
-- ============================================================
ALTER TABLE projects              ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones            ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_requests         ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by Next.js API routes)
CREATE POLICY "service_role_all" ON projects
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON milestones
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON maintenance_requests
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON contact_submissions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON plan_requests
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- 7. STORAGE BUCKET for maintenance attachments
-- Run this AFTER the tables above. Then go to Storage in the
-- Supabase dashboard and confirm the bucket exists.
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('maintenance-attachments', 'maintenance-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Allow service role to upload/read files
CREATE POLICY "service_role_storage" ON storage.objects
  FOR ALL TO service_role USING (bucket_id = 'maintenance-attachments') WITH CHECK (bucket_id = 'maintenance-attachments');

-- Allow public read of attachments (so clients can view their uploaded files)
CREATE POLICY "public_read_attachments" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'maintenance-attachments');

-- ============================================================
-- DONE! All tables and storage are ready.
-- ============================================================
