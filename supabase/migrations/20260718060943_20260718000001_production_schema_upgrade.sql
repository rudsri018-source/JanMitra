/*
# Production Schema Upgrade - JanMitra (fixed)

Adds structured eligibility rules, ministry links, date columns, version history,
data sync jobs, document master tables, and full-text search indexes.
Casts jsonb tags to text for full-text search.
*/

-- ============ MINISTRIES ============
CREATE TABLE IF NOT EXISTS ministries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  level text NOT NULL DEFAULT 'central',
  state text,
  website text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_ministries" ON ministries;
CREATE POLICY "read_ministries" ON ministries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "write_ministries_admin" ON ministries;
CREATE POLICY "write_ministries_admin" ON ministries FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============ DOCUMENTS MASTER ============
CREATE TABLE IF NOT EXISTS documents_master (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents_master ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_documents_master" ON documents_master;
CREATE POLICY "read_documents_master" ON documents_master FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "write_documents_master_admin" ON documents_master;
CREATE POLICY "write_documents_master_admin" ON documents_master FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============ SCHEME <-> DOCUMENTS RELATION ============
CREATE TABLE IF NOT EXISTS scheme_documents_rel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id uuid NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES documents_master(id) ON DELETE CASCADE,
  mandatory boolean NOT NULL DEFAULT true,
  state_specific text,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(scheme_id, document_id)
);

ALTER TABLE scheme_documents_rel ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_scheme_documents_rel" ON scheme_documents_rel;
CREATE POLICY "read_scheme_documents_rel" ON scheme_documents_rel FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "write_scheme_documents_rel_admin" ON scheme_documents_rel;
CREATE POLICY "write_scheme_documents_rel_admin" ON scheme_documents_rel FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============ SCHOLARSHIP <-> DOCUMENTS RELATION ============
CREATE TABLE IF NOT EXISTS scholarship_documents_rel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id uuid NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES documents_master(id) ON DELETE CASCADE,
  mandatory boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(scholarship_id, document_id)
);

ALTER TABLE scholarship_documents_rel ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_scholarship_documents_rel" ON scholarship_documents_rel;
CREATE POLICY "read_scholarship_documents_rel" ON scholarship_documents_rel FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "write_scholarship_documents_rel_admin" ON scholarship_documents_rel;
CREATE POLICY "write_scholarship_documents_rel_admin" ON scholarship_documents_rel FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============ SERVICE <-> DOCUMENTS RELATION ============
CREATE TABLE IF NOT EXISTS service_documents_rel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES citizen_services(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES documents_master(id) ON DELETE CASCADE,
  mandatory boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(service_id, document_id)
);

ALTER TABLE service_documents_rel ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_service_documents_rel" ON service_documents_rel;
CREATE POLICY "read_service_documents_rel" ON service_documents_rel FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "write_service_documents_rel_admin" ON service_documents_rel;
CREATE POLICY "write_service_documents_rel_admin" ON service_documents_rel FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============ CONTENT VERSIONS ============
CREATE TABLE IF NOT EXISTS content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity text NOT NULL,
  entity_id uuid NOT NULL,
  version int NOT NULL DEFAULT 1,
  snapshot jsonb NOT NULL,
  changed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  change_summary text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_content_versions_admin" ON content_versions;
CREATE POLICY "read_content_versions_admin" ON content_versions FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "insert_content_versions" ON content_versions;
CREATE POLICY "insert_content_versions" ON content_versions FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============ DATA SYNC JOBS ============
CREATE TABLE IF NOT EXISTS data_sync_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  source text NOT NULL,
  source_type text NOT NULL DEFAULT 'api',
  endpoint text,
  entity text NOT NULL,
  schedule text NOT NULL DEFAULT 'weekly',
  last_run timestamptz,
  next_run timestamptz,
  enabled boolean NOT NULL DEFAULT true,
  config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE data_sync_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_sync_jobs_admin" ON data_sync_jobs;
CREATE POLICY "read_sync_jobs_admin" ON data_sync_jobs FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "write_sync_jobs_admin" ON data_sync_jobs;
CREATE POLICY "write_sync_jobs_admin" ON data_sync_jobs FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============ SYNC LOG ============
CREATE TABLE IF NOT EXISTS sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES data_sync_jobs(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'running',
  records_imported int DEFAULT 0,
  records_updated int DEFAULT 0,
  errors int DEFAULT 0,
  error_details jsonb DEFAULT '[]'::jsonb,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_sync_log_admin" ON sync_log;
CREATE POLICY "read_sync_log_admin" ON sync_log FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "insert_sync_log" ON sync_log;
CREATE POLICY "insert_sync_log" ON sync_log FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_sync_log_admin" ON sync_log;
CREATE POLICY "update_sync_log_admin" ON sync_log FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============ ADD COLUMNS TO EXISTING TABLES ============

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schemes' AND column_name='ministry_id') THEN
    ALTER TABLE schemes ADD COLUMN ministry_id uuid REFERENCES ministries(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schemes' AND column_name='open_date') THEN
    ALTER TABLE schemes ADD COLUMN open_date date;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schemes' AND column_name='close_date') THEN
    ALTER TABLE schemes ADD COLUMN close_date date;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schemes' AND column_name='last_verified_at') THEN
    ALTER TABLE schemes ADD COLUMN last_verified_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schemes' AND column_name='eligibility_rules') THEN
    ALTER TABLE schemes ADD COLUMN eligibility_rules jsonb DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schemes' AND column_name='gender_restriction') THEN
    ALTER TABLE schemes ADD COLUMN gender_restriction text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schemes' AND column_name='category_requirement') THEN
    ALTER TABLE schemes ADD COLUMN category_requirement text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schemes' AND column_name='education_requirement') THEN
    ALTER TABLE schemes ADD COLUMN education_requirement text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schemes' AND column_name='disability_criteria') THEN
    ALTER TABLE schemes ADD COLUMN disability_criteria text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schemes' AND column_name='faq_list') THEN
    ALTER TABLE schemes ADD COLUMN faq_list jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scholarships' AND column_name='ministry_id') THEN
    ALTER TABLE scholarships ADD COLUMN ministry_id uuid REFERENCES ministries(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scholarships' AND column_name='open_date') THEN
    ALTER TABLE scholarships ADD COLUMN open_date date;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scholarships' AND column_name='close_date') THEN
    ALTER TABLE scholarships ADD COLUMN close_date date;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scholarships' AND column_name='last_verified_at') THEN
    ALTER TABLE scholarships ADD COLUMN last_verified_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scholarships' AND column_name='eligibility_rules') THEN
    ALTER TABLE scholarships ADD COLUMN eligibility_rules jsonb DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scholarships' AND column_name='renewal_conditions') THEN
    ALTER TABLE scholarships ADD COLUMN renewal_conditions text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scholarships' AND column_name='official_pdf') THEN
    ALTER TABLE scholarships ADD COLUMN official_pdf text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scholarships' AND column_name='faq_list') THEN
    ALTER TABLE scholarships ADD COLUMN faq_list jsonb DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scholarships' AND column_name='online_process') THEN
    ALTER TABLE scholarships ADD COLUMN online_process text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scholarships' AND column_name='offline_process') THEN
    ALTER TABLE scholarships ADD COLUMN offline_process text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='citizen_services' AND column_name='ministry_id') THEN
    ALTER TABLE citizen_services ADD COLUMN ministry_id uuid REFERENCES ministries(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='citizen_services' AND column_name='last_verified_at') THEN
    ALTER TABLE citizen_services ADD COLUMN last_verified_at timestamptz;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='policies' AND column_name='last_verified_at') THEN
    ALTER TABLE policies ADD COLUMN last_verified_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='policies' AND column_name='official_reference_url') THEN
    ALTER TABLE policies ADD COLUMN official_reference_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='policies' AND column_name='faq_list') THEN
    ALTER TABLE policies ADD COLUMN faq_list jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='veteran') THEN
    ALTER TABLE profiles ADD COLUMN veteran boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='farmer') THEN
    ALTER TABLE profiles ADD COLUMN farmer boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='student') THEN
    ALTER TABLE profiles ADD COLUMN student boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='business_owner') THEN
    ALTER TABLE profiles ADD COLUMN business_owner boolean DEFAULT false;
  END IF;
END $$;

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_schemes_ministry ON schemes(ministry_id);
CREATE INDEX IF NOT EXISTS idx_schemes_open_date ON schemes(open_date);
CREATE INDEX IF NOT EXISTS idx_schemes_close_date ON schemes(close_date);
CREATE INDEX IF NOT EXISTS idx_schemes_status ON schemes(status);
CREATE INDEX IF NOT EXISTS idx_schemes_published ON schemes(published);
CREATE INDEX IF NOT EXISTS idx_scholarships_ministry ON scholarships(ministry_id);
CREATE INDEX IF NOT EXISTS idx_scholarships_open_date ON scholarships(open_date);
CREATE INDEX IF NOT EXISTS idx_scholarships_close_date ON scholarships(close_date);
CREATE INDEX IF NOT EXISTS idx_scholarships_published ON scholarships(published);
CREATE INDEX IF NOT EXISTS idx_services_ministry ON citizen_services(ministry_id);
CREATE INDEX IF NOT EXISTS idx_scheme_documents_scheme ON scheme_documents_rel(scheme_id);
CREATE INDEX IF NOT EXISTS idx_scheme_documents_doc ON scheme_documents_rel(document_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_documents_sch ON scholarship_documents_rel(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_service_documents_svc ON service_documents_rel(service_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_entity ON content_versions(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_sync_log_job ON sync_log(job_id);
CREATE INDEX IF NOT EXISTS idx_ministries_slug ON ministries(slug);
CREATE INDEX IF NOT EXISTS idx_documents_master_slug ON documents_master(slug);

-- ============ FULL-TEXT SEARCH (cast jsonb tags to text) ============
CREATE INDEX IF NOT EXISTS idx_schemes_search ON schemes USING gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(short_description,'') || ' ' || coalesce(description,'') || ' ' || coalesce(tags::text,'')));
CREATE INDEX IF NOT EXISTS idx_scholarships_search ON scholarships USING gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(tags::text,'')));
CREATE INDEX IF NOT EXISTS idx_services_search ON citizen_services USING gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(tags::text,'')));
CREATE INDEX IF NOT EXISTS idx_policies_search ON policies USING gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(summary,'') || ' ' || coalesce(content,'') || ' ' || coalesce(tags::text,'')));

-- ============ TRIGGER ============
DROP TRIGGER IF EXISTS trg_sync_jobs_updated ON data_sync_jobs;
CREATE TRIGGER trg_sync_jobs_updated BEFORE UPDATE ON data_sync_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
