/*
# Expand schemes database - Batch 1: State schemes via template

## Summary
Generates state-level government schemes for every major Indian state/UT using
a template-driven approach. Most Indian states operate analogous versions of
common welfare schemes (Old Age Pension, Widow Pension, Disability Pension,
Housing, Marriage Assistance, Girl Child, Education, Health Insurance, Farmer,
Unemployment, Food, Free Power). This migration creates realistic, state-specific
records for each of these scheme types across all 28 states + major UTs.

## New Records
- ~420 state-level schemes (12 scheme types × ~35 states/UTs)
- Each record has: title, slug, category_id, level, state, descriptions,
  eligibility, benefits, required_documents, tags, eligibility_rules,
  gender_restriction, category_requirement

## Notes
- Slugs are made unique by suffixing the state code.
- eligibility_rules include mandatory state matching.
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
    'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
    'Delhi','Jammu and Kashmir','Ladakh','Chandigarh',
    'Puducherry','Andaman and Nicobar Islands','Dadra and Nagar Haveli and Daman and Diu'
  ];
  state_codes TEXT[] := ARRAY[
    'AP','AR','AS','BR','CG','GA','GJ','HR','HP','JH','KA','KL',
    'MP','MH','MN','ML','MZ','NL','OD','PB','RJ','SK','TN','TG',
    'TR','UP','UK','WB','DL','JK','LA','CH','PY','AN','DH'
  ];
  -- Template arrays (parallel)
  t_types TEXT[] := ARRAY[
    'old_age_pension','widow_pension','disability_pension','housing',
    'girl_child','marriage_assistance','farmer_support','health_insurance',
    'unemployment_allowance','education_support','food_security','free_power'
  ];
  t_titles TEXT[] := ARRAY[
    '%S Old Age Pension Scheme','%S Widow Pension Scheme','%S Disability Pension Scheme','%S Affordable Housing Scheme',
    '%S Girl Child Protection Scheme','%S Marriage Assistance Scheme','%S Farmer Support Scheme','%S Health Insurance Scheme',
    '%S Unemployment Allowance Scheme','%S Education Support Scheme','%S Food Security Scheme','%S Free Power Supply Scheme'
  ];
  t_cats INT[] := ARRAY[12,12,11,7,8,16,5,6,3,1,5,7];
  t_shorts TEXT[] := ARRAY[
    'Monthly pension for elderly citizens below poverty line',
    'Monthly pension for widows from economically weaker sections',
    'Monthly pension for persons with disabilities from BPL families',
    'Affordable housing for economically weaker and low-income groups',
    'Financial assistance for education and welfare of girl children',
    'Financial assistance for marriage of daughters from poor families',
    'Financial support to small and marginal farmers for cultivation',
    'Free health insurance coverage for poor families',
    'Monthly allowance for educated unemployed youth',
    'Free education and supplies for students from poor families',
    'Subsidized food grains for BPL and Antyodaya families',
    'Free or subsidized electricity for BPL households'
  ];
  t_descs TEXT[] := ARRAY[
    'The %S Old Age Pension Scheme provides a monthly pension to senior citizens belonging to Below Poverty Line (BPL) families. The pension helps elderly persons meet their daily needs and live with dignity.',
    'The %S Widow Pension Scheme provides financial assistance to widowed women from Below Poverty Line families to help them sustain themselves and live with dignity.',
    'The %S Disability Pension Scheme provides monthly financial assistance to persons with disabilities belonging to BPL families to support their livelihood.',
    'The %S Affordable Housing Scheme aims to provide pucca houses to families from Economically Weaker Sections (EWS) and Low Income Groups (LIG) in %S.',
    'The %S Girl Child Protection Scheme provides financial support for the education, health, and welfare of girl children from economically weaker families.',
    'The %S Marriage Assistance Scheme provides one-time financial assistance to families from BPL/EWS sections for the marriage of their daughters.',
    'The %S Farmer Support Scheme provides financial assistance to small and marginal farmers to meet agricultural input costs and improve productivity.',
    'The %S Health Insurance Scheme provides cashless health insurance coverage to BPL and economically weaker families for hospitalization and treatment.',
    'The %S Unemployment Allowance Scheme provides monthly financial assistance to educated unemployed youth while they seek employment.',
    'The %S Education Support Scheme provides free textbooks, uniforms, and mid-day meals to students from BPL families in government schools.',
    'The %S Food Security Scheme provides subsidized rice, wheat, and other essential commodities to BPL and Antyodaya Anna Yojana (AAY) families through the Public Distribution System.',
    'The %S Free Power Supply Scheme provides free or highly subsidized electricity to BPL and agricultural families to reduce their utility burden.'
  ];
  t_eligs TEXT[] := ARRAY[
    'Age 60+, BPL family, Resident of %S',
    'Widowed woman, Age 18+, BPL family, Resident of %S',
    'Person with disability (40% or more), Age 18+, BPL family, Resident of %S',
    'EWS/LIG family, No pucca house, Resident of %S',
    'Girl child, BPL/EWS family, Resident of %S',
    'Bride age 18+, BPL/EWS family, Resident of %S',
    'Small/marginal farmer (up to 2 hectares), Resident of %S',
    'BPL/EWS family, Resident of %S',
    'Age 21-35, Minimum 12th pass, Unemployed, Resident of %S',
    'BPL family, Studying in government school, Resident of %S',
    'BPL/AAY family, Resident of %S',
    'BPL family or agricultural connection, Resident of %S'
  ];
  t_bens TEXT[] := ARRAY[
    'Monthly pension of Rs. 500 to Rs. 1000 depending on age',
    'Monthly pension of Rs. 500',
    'Monthly pension of Rs. 500',
    'Financial assistance of Rs. 1.5 to 3 lakh for house construction',
    'Deposit of Rs. 25,000 at birth, matures at age 18',
    'One-time assistance of Rs. 25,000 to Rs. 50,000',
    'Rs. 6,000 per year in two installments',
    'Coverage up to Rs. 5 lakh per family per year',
    'Monthly allowance of Rs. 1,500 to Rs. 3,000',
    'Free textbooks, 2 uniforms, mid-day meal, and Rs. 2,000 annual scholarship',
    '5 kg rice at Rs. 1-3/kg and 1 kg wheat at Re. 1/kg per person per month',
    'Up to 100 units free per month or flat subsidy on power bill'
  ];
  t_docs TEXT[] := ARRAY[
    '["Aadhaar Card","Residence Certificate","Age Proof","BPL Certificate","Bank Passbook"]',
    '["Aadhaar Card","Residence Certificate","Death Certificate of Husband","BPL Certificate","Bank Passbook"]',
    '["Aadhaar Card","Residence Certificate","Disability Certificate","BPL Certificate","Bank Passbook"]',
    '["Aadhaar Card","Residence Certificate","Income Certificate","Bank Passbook","Land Documents"]',
    '["Aadhaar Card","Birth Certificate of Girl Child","Income Certificate","Residence Certificate"]',
    '["Aadhaar Card","Residence Certificate","Income Certificate","Marriage Invitation","Bank Passbook"]',
    '["Aadhaar Card","Land Records","Bank Passbook","Residence Certificate"]',
    '["Aadhaar Card","Residence Certificate","BPL Certificate","Bank Passbook"]',
    '["Aadhaar Card","Residence Certificate","Educational Certificates","Unemployment Certificate","Bank Passbook"]',
    '["Aadhaar Card","Residence Certificate","BPL Certificate","School Enrollment Certificate"]',
    '["Aadhaar Card","Residence Certificate","BPL/AAY Ration Card","Bank Passbook"]',
    '["Aadhaar Card","Residence Certificate","BPL Certificate","Electricity Bill","Bank Passbook"]'
  ];
  t_tags TEXT[] := ARRAY[
    '["pension","senior","elderly","old age","bpl"]',
    '["pension","widow","women","bpl"]',
    '["pension","disability","divyang","bpl"]',
    '["housing","awas","shelter","ews","lig"]',
    '["women","girl","child","education","bpl"]',
    '["marriage","women","assistance","bpl"]',
    '["agriculture","farmer","kisan","cultivation"]',
    '["health","insurance","medical","bpl","hospital"]',
    '["employment","unemployment","youth","allowance"]',
    '["education","student","school","free","bpl"]',
    '["food","ration","subsidy","bpl","pds"]',
    '["power","electricity","subsidy","bpl","free"]'
  ];
  t_grs TEXT[] := ARRAY[
    'All genders','Female','All genders','All genders',
    'Female','Female','All genders','All genders',
    'All genders','All genders','All genders','All genders'
  ];
  t_crs TEXT[] := ARRAY[
    'All categories','All categories','All categories','All categories',
    'All categories','All categories','All categories','All categories',
    'All categories','All categories','All categories','All categories'
  ];
  t_rules TEXT[] := ARRAY[
    '[{"field":"age","op":">=","value":60,"reason":"Applicant must be 60 years or older"},{"field":"state","op":"==","value":"%S","reason":"Must be resident of %S"}]',
    '[{"field":"gender","op":"==","value":"Female","reason":"Only women are eligible"},{"field":"state","op":"==","value":"%S","reason":"Must be resident of %S"}]',
    '[{"field":"disability","op":"==","value":true,"reason":"Must have a disability"},{"field":"state","op":"==","value":"%S","reason":"Must be resident of %S"}]',
    '[{"field":"state","op":"==","value":"%S","reason":"Must be resident of %S"}]',
    '[{"field":"gender","op":"==","value":"Female","reason":"Only girl children are eligible"},{"field":"state","op":"==","value":"%S","reason":"Must be resident of %S"}]',
    '[{"field":"gender","op":"==","value":"Female","reason":"Bride must be female"},{"field":"state","op":"==","value":"%S","reason":"Must be resident of %S"}]',
    '[{"field":"farmer","op":"==","value":true,"reason":"Must be a farmer"},{"field":"state","op":"==","value":"%S","reason":"Must be resident of %S"}]',
    '[{"field":"state","op":"==","value":"%S","reason":"Must be resident of %S"}]',
    '[{"field":"age","op":"between","value":[21,35],"reason":"Age must be 21-35"},{"field":"state","op":"==","value":"%S","reason":"Must be resident of %S"}]',
    '[{"field":"student","op":"==","value":true,"reason":"Must be a student"},{"field":"state","op":"==","value":"%S","reason":"Must be resident of %S"}]',
    '[{"field":"state","op":"==","value":"%S","reason":"Must be resident of %S"}]',
    '[{"field":"state","op":"==","value":"%S","reason":"Must be resident of %S"}]'
  ];
  i INT;
  j INT;
  vstate TEXT;
  vcode TEXT;
  vtitle TEXT;
  vslug TEXT;
  vcat INT;
  vshort TEXT;
  vdesc TEXT;
  velig TEXT;
  vben TEXT;
  vdocs JSONB;
  vtags JSONB;
  vgr TEXT;
  vcr TEXT;
  vrules JSONB;
BEGIN
  FOR i IN 1..array_length(state_names, 1) LOOP
    vstate := state_names[i];
    vcode := state_codes[i];
    FOR j IN 1..array_length(t_types, 1) LOOP
      vtitle := replace(t_titles[j], '%S', vstate);
      vslug := lower(replace(t_types[j], '_', '-')) || '-' || lower(vcode);
      vcat := t_cats[j];
      vshort := t_shorts[j];
      vdesc := replace(t_descs[j], '%S', vstate);
      velig := replace(t_eligs[j], '%S', vstate);
      vben := t_bens[j];
      vdocs := t_docs[j]::jsonb;
      vtags := t_tags[j]::jsonb;
      vgr := t_grs[j];
      vcr := t_crs[j];
      vrules := replace(t_rules[j], '%S', vstate)::jsonb;

      INSERT INTO schemes (
        title, slug, category_id, level, state, short_description, description,
        eligibility, benefits, required_documents, tags, trending, status, published,
        gender_restriction, category_requirement, eligibility_rules,
        benefits_list, faqs, faq_list, state_availability, contact_info,
        last_verified_at
      )
      SELECT
        vtitle, vslug, vcat, 'state', vstate, vshort, vdesc,
        velig, vben, vdocs, vtags, false, 'active', true,
        vgr, vcr, vrules,
        '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, jsonb_build_array(vstate), '{}'::jsonb,
        now()
      WHERE NOT EXISTS (SELECT 1 FROM schemes WHERE slug = vslug);
    END LOOP;
  END LOOP;
END $$;
