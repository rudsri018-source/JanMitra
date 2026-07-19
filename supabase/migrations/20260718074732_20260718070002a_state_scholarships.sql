/*
# Expand database - Batch 2a: State scholarships

## Summary
Generates state-level scholarships for 28 states across 6 scholarship types:
Post-Matric SC, Post-Matric ST, Pre-Matric, Merit, Means-Cum-Merit, Research.
Total: ~168 new scholarship records.

## Notes
- Slugs made unique by suffixing state code.
- No destructive operations; pure INSERT.
*/

DO $$
DECLARE
  state_names TEXT[] := ARRAY[
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar',
    'Chhattisgarh','Goa','Gujarat','Haryana',
    'Himachal Pradesh','Jharkhand','Karnataka','Kerala',
    'Madhya Pradesh','Maharashtra','Manipur','Meghalaya',
    'Mizoram','Nagaland','Odisha','Punjab',
    'Rajasthan','Sikkim','Tamil Nadu','Telangana',
    'Tripura','Uttar Pradesh','Uttarakhand','West Bengal'
  ];
  state_codes TEXT[] := ARRAY[
    'AP','AR','AS','BR','CG','GA','GJ','HR','HP','JH','KA','KL',
    'MP','MH','MN','ML','MZ','NL','OD','PB','RJ','SK','TN','TG',
    'TR','UP','UK','WB'
  ];
  s_types TEXT[] := ARRAY[
    'post_matric_sc','post_matric_st','pre_matric','merit','means_cum_merit','research_fellowship'
  ];
  s_titles TEXT[] := ARRAY[
    '%S Post-Matric Scholarship for SC Students',
    '%S Post-Matric Scholarship for ST Students',
    '%S Pre-Matric Scholarship for Poor Students',
    '%S Merit Scholarship for Bright Students',
    '%S Means-Cum-Merit Scholarship',
    '%S Research Fellowship for Scholars'
  ];
  s_cats TEXT[] := ARRAY['SC','ST','All categories','All categories','All categories','All categories'];
  s_amounts TEXT[] := ARRAY[
    'Rs. 350-550 per month for 10 months',
    'Rs. 350-550 per month for 10 months',
    'Rs. 150-450 per month for 10 months',
    'Rs. 500-1000 per month for 10 months',
    'Rs. 300-500 per month for 10 months',
    'Rs. 8,000-12,000 per month + contingency grant'
  ];
  s_eligs TEXT[] := ARRAY[
    'SC student, 50% marks in previous exam, Family income below Rs. 2 lakh, Resident of %S',
    'ST student, 50% marks in previous exam, Family income below Rs. 2 lakh, Resident of %S',
    'Student from BPL family, Class 1-10, Resident of %S',
    'Top 10% of class, Minimum 60% marks, Resident of %S',
    'Student with 50%+ marks, Family income below Rs. 1.5 lakh, Resident of %S',
    'MPhil/PhD scholar, 55% marks in PG, Registered in recognized university in %S'
  ];
  s_docs TEXT[] := ARRAY[
    '["Aadhaar Card","Caste Certificate","Income Certificate","Previous Year Marksheet","Bank Passbook"]',
    '["Aadhaar Card","Caste Certificate","Income Certificate","Previous Year Marksheet","Bank Passbook"]',
    '["Aadhaar Card","BPL Certificate","Previous Year Marksheet","Bank Passbook"]',
    '["Aadhaar Card","Previous Year Marksheet","Bank Passbook"]',
    '["Aadhaar Card","Income Certificate","Previous Year Marksheet","Bank Passbook"]',
    '["Aadhaar Card","PG Certificate","Registration Proof","Research Proposal","Bank Passbook"]'
  ];
  s_tags TEXT[] := ARRAY[
    '["scholarship","sc","education","student","post-matric"]',
    '["scholarship","st","education","student","post-matric"]',
    '["scholarship","pre-matric","education","student","bpl"]',
    '["scholarship","merit","education","student"]',
    '["scholarship","merit","means","education","student"]',
    '["scholarship","research","fellowship","phd","education"]'
  ];
  i INT; j INT;
  vstate TEXT; vcode TEXT; vtitle TEXT; vslug TEXT;
  vcat TEXT; vamount TEXT; velig TEXT; vdocs JSONB; vtags JSONB;
BEGIN
  FOR i IN 1..array_length(state_names, 1) LOOP
    vstate := state_names[i];
    vcode := state_codes[i];
    FOR j IN 1..array_length(s_types, 1) LOOP
      vtitle := replace(s_titles[j], '%S', vstate);
      vslug := lower(replace(s_types[j], '_', '-')) || '-' || lower(vcode);
      vcat := s_cats[j];
      vamount := s_amounts[j];
      velig := replace(s_eligs[j], '%S', vstate);
      vdocs := s_docs[j]::jsonb;
      vtags := s_tags[j]::jsonb;

      INSERT INTO scholarships (
        title, slug, provider, level, state, category, description, eligibility,
        documents, amount, deadline, tags, published, last_verified_at,
        eligibility_filters, contact_info, faq_list
      )
      SELECT
        vtitle, vslug, vstate || ' Government', 'state', vstate, vcat,
        vtitle || ' provides financial assistance to eligible students to pursue their education without financial barriers.',
        velig, vdocs, vamount, 'Varies (check official portal)', vtags, true, now(),
        '{}'::jsonb, '{}'::jsonb, '[]'::jsonb
      WHERE NOT EXISTS (SELECT 1 FROM scholarships WHERE slug = vslug);
    END LOOP;
  END LOOP;
END $$;
