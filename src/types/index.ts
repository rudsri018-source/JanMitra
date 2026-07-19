export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  preferred_language: string;
  accessibility_mode: boolean;
  high_contrast: boolean;
  large_fonts: boolean;
  is_guest: boolean;
  age: number | null;
  gender: string | null;
  state: string | null;
  district: string | null;
  occupation: string | null;
  annual_income: number | null;
  caste: string | null;
  religion: string | null;
  disability: boolean;
  education: string | null;
  veteran: boolean;
  farmer: boolean;
  student: boolean;
  business_owner: boolean;
  created_at: string;
  updated_at: string;
}

export interface Ministry {
  id: string;
  name: string;
  slug: string;
  level: string;
  state: string | null;
  website: string | null;
}

export interface DocumentMaster {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
}

export interface EligibilityRule {
  field: string;
  op: '>=' | '<=' | '>' | '<' | '==' | '!=' | 'in' | 'not_in' | 'between' | 'exists';
  value: number | string | boolean | number[] | string[];
  reason: string;
}

export interface Scheme {
  id: string;
  title: string;
  slug: string;
  category_id: number | null;
  level: 'central' | 'state';
  state: string | null;
  short_description: string | null;
  description: string | null;
  eligibility: string | null;
  income_limit: string | null;
  age_limit: string | null;
  benefits: string | null;
  benefits_list: string[];
  required_documents: string[];
  online_process: string | null;
  offline_process: string | null;
  official_website: string | null;
  official_pdf: string | null;
  video_guide: string | null;
  contact_info: { helpline?: string; email?: string };
  faqs: { q: string; a: string }[];
  last_date: string | null;
  state_availability: string[];
  tags: string[];
  trending: boolean;
  status: string;
  published: boolean;
  ministry_id: string | null;
  open_date: string | null;
  close_date: string | null;
  last_verified_at: string | null;
  gender_restriction: string | null;
  category_requirement: string | null;
  education_requirement: string | null;
  disability_criteria: string | null;
  eligibility_rules: EligibilityRule[];
  faq_list: { q: string; a: string }[];
  created_at: string;
  updated_at: string;
}

export interface Scholarship {
  id: string;
  title: string;
  slug: string;
  provider: string | null;
  level: 'central' | 'state' | 'private';
  state: string | null;
  category: string | null;
  description: string | null;
  eligibility: string | null;
  eligibility_filters: Record<string, Json>;
  documents: string[];
  amount: string | null;
  deadline: string | null;
  application_link: string | null;
  official_website: string | null;
  contact_info: { helpline?: string; email?: string };
  tags: string[];
  published: boolean;
  ministry_id: string | null;
  open_date: string | null;
  close_date: string | null;
  last_verified_at: string | null;
  eligibility_rules: EligibilityRule[];
  renewal_conditions: string | null;
  official_pdf: string | null;
  faq_list: { q: string; a: string }[];
  online_process: string | null;
  offline_process: string | null;
  created_at: string;
  updated_at: string;
}

export interface CitizenService {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  description: string | null;
  what_is: string | null;
  eligibility: string | null;
  required_documents: string[];
  fees: string | null;
  timeline: string | null;
  online_steps: string[];
  offline_process: string | null;
  common_mistakes: string[];
  faqs: { q: string; a: string }[];
  official_links: string[];
  checklist: string[];
  contact_info: { helpline?: string; email?: string };
  tags: string[];
  published: boolean;
  ministry_id: string | null;
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Policy {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  summary: string | null;
  content: string | null;
  key_points: string[];
  official_reference: string | null;
  official_reference_url: string | null;
  tags: string[];
  published: boolean;
  last_verified_at: string | null;
  faq_list: { q: string; a: string }[];
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  image_url: string | null;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string | null;
  type: string;
  link: string | null;
  target_audience: string;
  published: boolean;
  created_at: string;
}

export interface SavedItem {
  id: string;
  user_id: string;
  item_type: 'scheme' | 'scholarship' | 'service' | 'policy';
  item_id: string;
  item_title: string;
  created_at: string;
}

export interface ApplicationHistory {
  id: string;
  user_id: string;
  item_type: string;
  item_id: string | null;
  item_title: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: string;
  user_id: string;
  category: string;
  subject: string;
  description: string | null;
  department: string | null;
  status: string;
  tracking_id: string | null;
  escalation_level: number;
  created_at: string;
  updated_at: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  details: Record<string, Json>;
  created_at: string;
}

export interface ContentVersion {
  id: string;
  entity: string;
  entity_id: string;
  version: number;
  snapshot: Record<string, Json>;
  changed_by: string | null;
  change_summary: string | null;
  created_at: string;
}

export interface DataSyncJob {
  id: string;
  name: string;
  source: string;
  source_type: string;
  endpoint: string | null;
  entity: string;
  schedule: string;
  last_run: string | null;
  next_run: string | null;
  enabled: boolean;
  config: Record<string, Json>;
  created_at: string;
  updated_at: string;
}

export interface SyncLog {
  id: string;
  job_id: string;
  status: string;
  records_imported: number;
  records_updated: number;
  errors: number;
  error_details: Json[];
  started_at: string;
  completed_at: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  type: string;
}

export interface State {
  id: number;
  name: string;
  code: string;
}

export interface District {
  id: number;
  state_id: number;
  name: string;
}

export interface EligibilityProfile {
  age: number | null;
  gender: string | null;
  state: string | null;
  district: string | null;
  occupation: string | null;
  annual_income: number | null;
  caste: string | null;
  religion: string | null;
  disability: boolean;
  education: string | null;
  veteran: boolean;
  farmer: boolean;
  student: boolean;
  business_owner: boolean;
}

export interface EligibilityResult {
  scheme: Scheme;
  score: number;
  reasons: string[];
  matchedCriteria: number;
  totalCriteria: number;
  eligible: boolean;
  blockingReasons: string[];
}

export interface SearchFilters {
  query: string;
  state: string;
  ministry: string;
  category: string;
  gender: string;
  income: string;
  education: string;
  occupation: string;
  disability: string;
  caste: string;
  age: string;
  status: string;
}
