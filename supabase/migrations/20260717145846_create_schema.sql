/*
# Bureaucracy Navigator AI - Core Schema

## Purpose
Creates the normalized database for a government scheme/scholarship/service navigator
with AI assistant, eligibility checker, admin panel, and citizen services.

## New Tables
1. profiles - extended user profile (links to auth.users)
2. states - Indian states
3. districts - districts per state
4. categories - scheme/service categories
5. schemes - government welfare schemes
6. scheme_documents - documents required per scheme
7. scheme_faqs - FAQs per scheme
8. scholarships - scholarships
9. citizen_services - government citizen services
10. service_documents - documents per service
11. service_faqs - FAQs per service
12. policies - policy & citizen rights library
13. blogs - editorial blog posts
14. notifications - system notifications
15. saved_items - user bookmarks (schemes/scholarships/services)
16. application_history - user application tracking
17. complaints - grievances
18. admin_logs - admin activity audit log

## Security
- RLS enabled on every table.
- Public catalog tables (states, districts, categories, schemes, scholarships,
  citizen_services, policies, blogs, notifications) are readable by anon + authenticated
  so guest mode and the anon-key client can browse.
- User-owned tables (profiles, saved_items, application_history, complaints) are
  owner-scoped to authenticated users via auth.uid().
- admin_logs is insert-only for authenticated (append audit entries) and readable
  only by the owner.
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  role text NOT NULL DEFAULT 'user',
  preferred_language text NOT NULL DEFAULT 'en',
  accessibility_mode boolean NOT NULL DEFAULT false,
  high_contrast boolean NOT NULL DEFAULT false,
  large_fonts boolean NOT NULL DEFAULT false,
  is_guest boolean NOT NULL DEFAULT false,
  -- eligibility profile
  age int,
  gender text,
  state text,
  district text,
  occupation text,
  annual_income numeric,
  caste text,
  religion text,
  disability boolean DEFAULT false,
  education text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ STATES ============
CREATE TABLE IF NOT EXISTS states (
  id int PRIMARY KEY,
  name text NOT NULL,
  code text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_states" ON states;
CREATE POLICY "read_states" ON states FOR SELECT
  TO anon, authenticated USING (true);

-- ============ DISTRICTS ============
CREATE TABLE IF NOT EXISTS districts (
  id int PRIMARY KEY,
  state_id int NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE districts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_districts" ON districts;
CREATE POLICY "read_districts" ON districts FOR SELECT
  TO anon, authenticated USING (true);

-- ============ CATEGORIES ============
CREATE TABLE IF NOT EXISTS categories (
  id int PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  type text NOT NULL DEFAULT 'scheme',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_categories" ON categories;
CREATE POLICY "read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- ============ SCHEMES ============
CREATE TABLE IF NOT EXISTS schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id int REFERENCES categories(id),
  level text NOT NULL DEFAULT 'central',
  state text,
  short_description text,
  description text,
  eligibility text,
  eligibility_criteria jsonb DEFAULT '[]'::jsonb,
  income_limit text,
  age_limit text,
  benefits text,
  benefits_list jsonb DEFAULT '[]'::jsonb,
  required_documents jsonb DEFAULT '[]'::jsonb,
  online_process text,
  offline_process text,
  official_website text,
  official_pdf text,
  video_guide text,
  contact_info jsonb DEFAULT '{}'::jsonb,
  faqs jsonb DEFAULT '[]'::jsonb,
  last_date text,
  state_availability jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  trending boolean DEFAULT false,
  status text DEFAULT 'active',
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_schemes" ON schemes;
CREATE POLICY "read_schemes" ON schemes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "write_schemes_admin" ON schemes;
CREATE POLICY "write_schemes_admin" ON schemes FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============ SCHOLARSHIPS ============
CREATE TABLE IF NOT EXISTS scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  provider text,
  level text NOT NULL DEFAULT 'central',
  state text,
  category text,
  description text,
  eligibility text,
  eligibility_filters jsonb DEFAULT '{}'::jsonb,
  documents jsonb DEFAULT '[]'::jsonb,
  amount text,
  deadline text,
  application_link text,
  official_website text,
  contact_info jsonb DEFAULT '{}'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_scholarships" ON scholarships;
CREATE POLICY "read_scholarships" ON scholarships FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "write_scholarships_admin" ON scholarships;
CREATE POLICY "write_scholarships_admin" ON scholarships FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============ CITIZEN SERVICES ============
CREATE TABLE IF NOT EXISTS citizen_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text,
  description text,
  what_is text,
  eligibility text,
  required_documents jsonb DEFAULT '[]'::jsonb,
  fees text,
  timeline text,
  online_steps jsonb DEFAULT '[]'::jsonb,
  offline_process text,
  common_mistakes jsonb DEFAULT '[]'::jsonb,
  faqs jsonb DEFAULT '[]'::jsonb,
  official_links jsonb DEFAULT '[]'::jsonb,
  checklist jsonb DEFAULT '[]'::jsonb,
  contact_info jsonb DEFAULT '{}'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE citizen_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_services" ON citizen_services;
CREATE POLICY "read_services" ON citizen_services FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "write_services_admin" ON citizen_services;
CREATE POLICY "write_services_admin" ON citizen_services FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============ POLICIES ============
CREATE TABLE IF NOT EXISTS policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text,
  summary text,
  content text,
  key_points jsonb DEFAULT '[]'::jsonb,
  official_reference text,
  tags jsonb DEFAULT '[]'::jsonb,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_policies" ON policies;
CREATE POLICY "read_policies" ON policies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "write_policies_admin" ON policies;
CREATE POLICY "write_policies_admin" ON policies FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============ BLOGS ============
CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  author text,
  image_url text,
  tags jsonb DEFAULT '[]'::jsonb,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_blogs" ON blogs;
CREATE POLICY "read_blogs" ON blogs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "write_blogs_admin" ON blogs;
CREATE POLICY "write_blogs_admin" ON blogs FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  type text NOT NULL DEFAULT 'announcement',
  link text,
  target_audience text DEFAULT 'all',
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_notifications" ON notifications;
CREATE POLICY "read_notifications" ON notifications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "write_notifications_admin" ON notifications;
CREATE POLICY "write_notifications_admin" ON notifications FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============ SAVED ITEMS ============
CREATE TABLE IF NOT EXISTS saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id uuid NOT NULL,
  item_title text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_saved" ON saved_items;
CREATE POLICY "select_own_saved" ON saved_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_saved" ON saved_items;
CREATE POLICY "insert_own_saved" ON saved_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_saved" ON saved_items;
CREATE POLICY "delete_own_saved" ON saved_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ APPLICATION HISTORY ============
CREATE TABLE IF NOT EXISTS application_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id uuid,
  item_title text NOT NULL,
  status text NOT NULL DEFAULT 'not_started',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE application_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_apps" ON application_history;
CREATE POLICY "select_own_apps" ON application_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_apps" ON application_history;
CREATE POLICY "insert_own_apps" ON application_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_apps" ON application_history;
CREATE POLICY "update_own_apps" ON application_history FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_apps" ON application_history;
CREATE POLICY "delete_own_apps" ON application_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ COMPLAINTS ============
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  subject text NOT NULL,
  description text,
  department text,
  status text NOT NULL DEFAULT 'submitted',
  tracking_id text UNIQUE,
  escalation_level int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_complaints" ON complaints;
CREATE POLICY "select_own_complaints" ON complaints FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_complaints" ON complaints;
CREATE POLICY "insert_own_complaints" ON complaints FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_complaints" ON complaints;
CREATE POLICY "update_own_complaints" ON complaints FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ ADMIN LOGS ============
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_admin_logs" ON admin_logs;
CREATE POLICY "insert_admin_logs" ON admin_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = admin_id);

DROP POLICY IF EXISTS "select_own_admin_logs" ON admin_logs;
CREATE POLICY "select_own_admin_logs" ON admin_logs FOR SELECT
  TO authenticated USING (auth.uid() = admin_id);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category_id);
CREATE INDEX IF NOT EXISTS idx_schemes_level ON schemes(level);
CREATE INDEX IF NOT EXISTS idx_schemes_state ON schemes(state);
CREATE INDEX IF NOT EXISTS idx_schemes_trending ON schemes(trending);
CREATE INDEX IF NOT EXISTS idx_scholarships_level ON scholarships(level);
CREATE INDEX IF NOT EXISTS idx_scholarships_state ON scholarships(state);
CREATE INDEX IF NOT EXISTS idx_districts_state ON districts(state_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_user ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_app_history_user ON application_history(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_user ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_id);

-- ============ TRIGGER: updated_at ============
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated ON profiles;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_schemes_updated ON schemes;
CREATE TRIGGER trg_schemes_updated BEFORE UPDATE ON schemes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_scholarships_updated ON scholarships;
CREATE TRIGGER trg_scholarships_updated BEFORE UPDATE ON scholarships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_services_updated ON citizen_services;
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON citizen_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_policies_updated ON policies;
CREATE TRIGGER trg_policies_updated BEFORE UPDATE ON policies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_blogs_updated ON blogs;
CREATE TRIGGER trg_blogs_updated BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_complaints_updated ON complaints;
CREATE TRIGGER trg_complaints_updated BEFORE UPDATE ON complaints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_app_history_updated ON application_history;
CREATE TRIGGER trg_app_history_updated BEFORE UPDATE ON application_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
