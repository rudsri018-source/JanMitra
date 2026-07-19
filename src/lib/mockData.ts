import type { Scheme, Scholarship, CitizenService, Policy, Category, State, District, Ministry, DocumentMaster } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Agriculture & Farmers Welfare', slug: 'agriculture', icon: 'sprout', type: 'scheme' },
  { id: 2, name: 'Business & Self-Employment', slug: 'business', icon: 'briefcase', type: 'scheme' },
  { id: 3, name: 'Education & Scholarships', slug: 'education', icon: 'graduation-cap', type: 'scheme' },
  { id: 4, name: 'Health & Family Welfare', slug: 'health', icon: 'heart-pulse', type: 'scheme' },
  { id: 5, name: 'Housing & Urban Development', slug: 'housing', icon: 'home', type: 'scheme' },
  { id: 6, name: 'Social Security & Pensions', slug: 'pensions', icon: 'users', type: 'scheme' },
  { id: 7, name: 'Women & Child Development', slug: 'women-child', icon: 'baby', type: 'scheme' },
  { id: 8, name: 'Youth & Skills', slug: 'youth', icon: 'award', type: 'scheme' },
  { id: 9, name: 'Utility & Energy', slug: 'utility', icon: 'zap', type: 'scheme' },
];

export const MOCK_STATES: State[] = [
  { id: 1, name: 'Madhya Pradesh', code: 'MP' },
  { id: 2, name: 'Uttar Pradesh', code: 'UP' },
  { id: 3, name: 'Maharashtra', code: 'MH' },
  { id: 4, name: 'Delhi', code: 'DL' },
  { id: 5, name: 'Rajasthan', code: 'RJ' },
  { id: 6, name: 'Bihar', code: 'BR' },
  { id: 7, name: 'Karnataka', code: 'KA' },
  { id: 8, name: 'Tamil Nadu', code: 'TN' },
];

export const MOCK_DISTRICTS: District[] = [
  // Madhya Pradesh (state_id: 1)
  { id: 101, state_id: 1, name: 'Bhopal' },
  { id: 102, state_id: 1, name: 'Indore' },
  { id: 103, state_id: 1, name: 'Gwalior' },
  { id: 104, state_id: 1, name: 'Jabalpur' },
  // Uttar Pradesh (state_id: 2)
  { id: 201, state_id: 2, name: 'Lucknow' },
  { id: 202, state_id: 2, name: 'Kanpur' },
  { id: 203, state_id: 2, name: 'Agra' },
  { id: 204, state_id: 2, name: 'Varanasi' },
  // Maharashtra (state_id: 3)
  { id: 301, state_id: 3, name: 'Mumbai' },
  { id: 302, state_id: 3, name: 'Pune' },
  { id: 303, state_id: 3, name: 'Nagpur' },
  // Delhi (state_id: 4)
  { id: 401, state_id: 4, name: 'New Delhi' },
  { id: 402, state_id: 4, name: 'South Delhi' },
  // Rajasthan (state_id: 5)
  { id: 501, state_id: 5, name: 'Jaipur' },
  { id: 502, state_id: 5, name: 'Jodhpur' },
];

export const MOCK_MINISTRIES: Ministry[] = [
  { id: 'm1', name: 'Ministry of Agriculture and Farmers Welfare', slug: 'agriculture', level: 'central', state: null, website: 'https://agricoop.nic.in' },
  { id: 'm2', name: 'Ministry of Health and Family Welfare', slug: 'health', level: 'central', state: null, website: 'https://mohfw.gov.in' },
  { id: 'm3', name: 'Ministry of Housing and Urban Affairs', slug: 'housing', level: 'central', state: null, website: 'https://mohua.gov.in' },
  { id: 'm4', name: 'Ministry of Finance', slug: 'finance', level: 'central', state: null, website: 'https://finmin.nic.in' },
  { id: 'm5', name: 'Ministry of Education', slug: 'education', level: 'central', state: null, website: 'https://education.gov.in' },
];

export const MOCK_DOCUMENTS: DocumentMaster[] = [
  { id: 'd1', name: 'Aadhaar Card', slug: 'aadhaar', description: 'Unique 12-digit identity card', category: 'Identity' },
  { id: 'd2', name: 'PAN Card', slug: 'pan', description: 'Permanent Account Number card for taxes', category: 'Identity' },
  { id: 'd3', name: 'Income Certificate', slug: 'income', description: 'Proof of annual family income', category: 'Income' },
  { id: 'd4', name: 'Caste Certificate', slug: 'caste', description: 'Proof of SC/ST/OBC category status', category: 'Category' },
  { id: 'd5', name: 'Domicile Certificate', slug: 'domicile', description: 'Proof of state residency', category: 'Address' },
];

export const MOCK_SCHEMES: Scheme[] = [
  {
    id: 's1',
    title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    slug: 'pm-kisan',
    category_id: 1,
    level: 'central',
    state: null,
    short_description: 'Direct financial support of Rs. 6,000 per year to small and marginal farmers.',
    description: 'PM-KISAN is a central sector scheme that aims to supplement the financial needs of small and marginal farmers in purchasing various inputs related to agriculture and allied activities as well as domestic needs. Under the scheme, income support of Rs. 6,000 per year is provided in three equal installments of Rs. 2,000 each, directly into the bank accounts of the beneficiaries.',
    eligibility: 'All small and marginal landholding farmer families who have cultivable landholding up to 2 hectares in their names. Families of institutional landholders, government employees, income tax payers, or retired pensioners drawing Rs. 10,000+ monthly are excluded.',
    income_limit: 'No direct income limit, but income tax payers are excluded.',
    age_limit: 'Age 18 to 70 years',
    benefits: 'Rs. 6,000 per year, paid in 3 equal installments of Rs. 2,000 every 4 months.',
    benefits_list: [
      'Income support of Rs. 6,000 annually.',
      'Direct benefit transfer (DBT) to bank accounts.',
      'Cashless financial relief for agricultural seeds and fertilizers.'
    ],
    required_documents: ['Aadhaar Card', 'Land holding papers (Khatauni/Patta)', 'Bank Account Passbook', 'Mobile Number linked with Aadhaar'],
    online_process: '1. Visit pmkisan.gov.in.\n2. Click on "New Farmer Registration".\n3. Enter Aadhaar number and fill the application form.\n4. Upload land records and bank details.\n5. Submit for verification by local authorities.',
    offline_process: 'Visit your local Common Service Center (CSC), Patwari, or local Agricultural Officer to submit the physical application form with documents.',
    official_website: 'https://pmkisan.gov.in',
    official_pdf: null,
    video_guide: null,
    contact_info: { helpline: '155261 / 1800115526', email: 'pmkisan-ict@gov.in' },
    faqs: [
      { q: 'Is land ownership mandatory?', a: 'Yes, cultivable land must be registered in the name of the applicant.' },
      { q: 'Can tenants apply?', a: 'No, tenant farmers are not eligible for this scheme.' }
    ],
    last_date: null,
    state_availability: ['All States'],
    tags: ['farmer', 'agriculture', 'financial support', 'central scheme', 'trending'],
    trending: true,
    status: 'open',
    published: true,
    ministry_id: 'm1',
    open_date: '2019-02-01',
    close_date: null,
    last_verified_at: '2026-01-01',
    gender_restriction: 'All genders',
    category_requirement: 'All categories',
    education_requirement: 'All',
    disability_criteria: 'All',
    eligibility_rules: [
      { field: 'farmer', op: '==', value: true, reason: 'Must be a registered farmer' }
    ],
    faq_list: [
      { q: 'Is land ownership mandatory?', a: 'Yes, cultivable land must be registered in the name of the applicant.' }
    ],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 's2',
    title: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    slug: 'pm-jay',
    category_id: 4,
    level: 'central',
    state: null,
    short_description: 'Cashless health insurance coverage of up to Rs. 5 Lakh per family per year.',
    description: 'PM-JAY is the largest health assurance scheme in the world which aims to provide a health cover of Rs. 5 Lakh per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families (approximately 55 crore beneficiaries). The scheme provides cashless and paperless access to services for the beneficiary at both public and empanelled private hospitals.',
    eligibility: 'Identified households under the Socio-Economic Caste Census (SECC 2011). Families living in one-room kutcha houses, female-headed households, landless households, and manual scavenger families are prioritised.',
    income_limit: 'Below Rs. 1.2 Lakh per annum preferred, or listed in BPL/SECC database.',
    age_limit: 'All ages eligible.',
    benefits: 'Health insurance cover of up to Rs. 5,00,000 per family per year for secondary/tertiary hospitalisation.',
    benefits_list: [
      'Cashless hospital treatment at empanelled hospitals.',
      'Rs. 5,00,000 annual cover per family.',
      'Pre-existing diseases covered from day one.',
      'Covers up to 3 days of pre-hospitalisation and 15 days post-hospitalisation expenses.'
    ],
    required_documents: ['Aadhaar Card', 'Ration Card', 'SECC Letter / HHID Number', 'BPL Card'],
    online_process: '1. Go to pmjay.gov.in and click "Am I Eligible".\n2. Log in using mobile number and search via name/Ration card.\n3. If your family is listed, download the Ayushman Card through the portal or PMJAY mobile app.',
    offline_process: 'Visit your nearest empanelled hospital or Ayushman Mitra center to get verified and receive your physical Ayushman Card.',
    official_website: 'https://pmjay.gov.in',
    official_pdf: null,
    video_guide: null,
    contact_info: { helpline: '14555 / 1800111565' },
    faqs: [
      { q: 'Is there a limit on family size?', a: 'No, there is no limit on family size or age of family members.' }
    ],
    last_date: null,
    state_availability: ['All States'],
    tags: ['health', 'insurance', 'hospitalization', 'BPL welfare', 'trending'],
    trending: true,
    status: 'open',
    published: true,
    ministry_id: 'm2',
    open_date: '2018-09-23',
    close_date: null,
    last_verified_at: '2026-01-01',
    gender_restriction: 'All genders',
    category_requirement: 'All categories',
    education_requirement: 'All',
    disability_criteria: 'All',
    eligibility_rules: [
      { field: 'annual_income', op: '<=', value: 120000, reason: 'Income must be below Rs 1,20,000 for eligibility check' }
    ],
    faq_list: [
      { q: 'Is there a limit on family size?', a: 'No, there is no limit on family size or age of family members.' }
    ],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 's3',
    title: 'Pradhan Mantri Awas Yojana (PMAY-Gramin)',
    slug: 'pmay-g',
    category_id: 5,
    level: 'central',
    state: null,
    short_description: 'Financial assistance of up to Rs. 1.2 Lakh to build a permanent (pucca) house.',
    description: 'PMAY-G aims to provide a pucca house with basic amenities to all houseless householders and those households living in dilapidated and kutcha houses in rural areas. The scheme provides financial assistance of Rs. 1.2 Lakh in plains and Rs. 1.3 Lakh in hilly/difficult areas, alongside additional support from MGNREGS for toilet construction and labour costs.',
    eligibility: 'Houseless families, households living in zero, one or two-room houses with kutcha walls and kutcha roof. Excludes families owning motorized vehicles, agricultural equipment, or government jobs.',
    income_limit: 'Below Rs. 3 Lakh per annum.',
    age_limit: 'Age 18+ (head of the family)',
    benefits: 'Rs. 1,20,000 financial grant in plains and Rs. 1,30,000 in hilly regions for house construction.',
    benefits_list: [
      'Financial grant of Rs. 1.2 Lakh to 1.3 Lakh.',
      'MGNREGS support for 90-95 days of unskilled labor.',
      'Rs. 12,000 additional subsidy for toilet construction.'
    ],
    required_documents: ['Aadhaar Card', 'Ration Card', 'Bank Account Details', 'Job Card Number (MGNREGA)', 'Affidavit of no pucca house'],
    online_process: 'PMAY-G applications are primarily initiated by local village panchayats based on the housing deprivation list. Beneficiaries can check their names on the PMAY-G portal using their SECC registration number.',
    offline_process: 'Apply through your Gram Panchayat or block office by submitting the physical application form alongside required documents.',
    official_website: 'https://pmayg.nic.in',
    official_pdf: null,
    video_guide: null,
    contact_info: { helpline: '1800116446' },
    faqs: [
      { q: 'Is the money given as a loan?', a: 'No, it is a 100% financial grant. You do not need to pay it back.' }
    ],
    last_date: null,
    state_availability: ['All States'],
    tags: ['housing', 'home', 'rural development', 'BPL welfare'],
    trending: false,
    status: 'open',
    published: true,
    ministry_id: 'm3',
    open_date: '2016-04-01',
    close_date: null,
    last_verified_at: '2026-01-01',
    gender_restriction: 'All genders',
    category_requirement: 'All categories',
    education_requirement: 'All',
    disability_criteria: 'All',
    eligibility_rules: [
      { field: 'annual_income', op: '<=', value: 300000, reason: 'Income must be below Rs. 3 Lakhs' }
    ],
    faq_list: [
      { q: 'Is the money given as a loan?', a: 'No, it is a 100% financial grant. You do not need to pay it back.' }
    ],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 's4',
    title: 'Madhya Pradesh Old Age Pension Scheme',
    slug: 'mp-old-age-pension',
    category_id: 6,
    level: 'state',
    state: 'Madhya Pradesh',
    short_description: 'Monthly pension of Rs. 600 for senior citizens below the poverty line.',
    description: 'This is a state-sponsored pension scheme by the Social Justice Department of Madhya Pradesh which provides financial assistance to senior citizens aged 60 or above who live below the poverty line (BPL) to secure their livelihood and support their essential medical and daily expenses.',
    eligibility: 'Must be a permanent resident of Madhya Pradesh. Age 60 years or above, and family must belong to BPL category.',
    income_limit: 'BPL family income limits (typically below Rs. 1 Lakh per annum).',
    age_limit: '60 years and above',
    benefits: 'Monthly pension of Rs. 600 directly transferred to the bank account.',
    benefits_list: [
      'Rs. 600 monthly pension.',
      'Secured livelihood support for elderly.'
    ],
    required_documents: ['Aadhaar Card', 'Domicile Certificate of MP', 'BPL Ration Card', 'Age Proof (Birth Cert/School LC/PAN)', 'Bank Account Passbook'],
    online_process: '1. Visit MP e-District portal (edistrict.mp.gov.in) or Samagra Social Security Portal.\n2. Choose "Old Age Pension Scheme".\n3. Fill in details and Samagra ID.\n4. Upload documents and submit.',
    offline_process: 'Submit the application at the nearest Jan Sunwai, Lok Seva Kendra, or Ward/Panchayat office in Madhya Pradesh.',
    official_website: 'http://socialsecurity.mp.gov.in',
    official_pdf: null,
    video_guide: null,
    contact_info: { helpline: '0755-2556916' },
    faqs: [
      { q: 'Can government pensioners apply?', a: 'No, individuals receiving any other government pension are excluded.' }
    ],
    last_date: null,
    state_availability: ['Madhya Pradesh'],
    tags: ['pension', 'senior citizen', 'BPL welfare', 'state scheme'],
    trending: true,
    status: 'open',
    published: true,
    ministry_id: null,
    open_date: '2013-01-01',
    close_date: null,
    last_verified_at: '2026-01-01',
    gender_restriction: 'All genders',
    category_requirement: 'All categories',
    education_requirement: 'All',
    disability_criteria: 'All',
    eligibility_rules: [
      { field: 'state', op: '==', value: 'Madhya Pradesh', reason: 'Must reside in Madhya Pradesh' },
      { field: 'age', op: '>=', value: 60, reason: 'Must be 60 years or older' }
    ],
    faq_list: [],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }
];

export const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sc1',
    title: 'Post Matric Scholarship Scheme for SC Students',
    slug: 'post-matric-sc',
    provider: 'Ministry of Social Justice and Empowerment',
    level: 'central',
    state: null,
    category: 'SC',
    description: 'Provides financial support to Scheduled Caste (SC) students studying at post-matric or post-secondary stages.',
    eligibility: 'Must be an Indian national belonging to Scheduled Caste (SC). Family annual income must not exceed Rs. 2.5 Lakhs. Studying in a recognized post-matric course.',
    eligibility_filters: {},
    documents: ['Aadhaar Card', 'Caste Certificate (SC)', 'Income Certificate', 'Mark sheets of last qualifying exam', 'Fee receipt'],
    amount: 'Covers 100% of non-refundable fees + monthly maintenance allowance up to Rs. 1,200.',
    deadline: '2026-11-30',
    application_link: 'https://scholarships.gov.in',
    official_website: 'https://scholarships.gov.in',
    contact_info: { helpline: '0120-6619540' },
    tags: ['scholarship', 'student', 'SC category', 'higher education'],
    published: true,
    ministry_id: 'm5',
    open_date: '2026-07-01',
    close_date: '2026-11-30',
    last_verified_at: '2026-01-01',
    eligibility_rules: [
      { field: 'student', op: '==', value: true, reason: 'Must be a student' },
      { field: 'caste', op: '==', value: 'SC', reason: 'Must belong to SC category' },
      { field: 'annual_income', op: '<=', value: 250000, reason: 'Annual income must not exceed Rs. 2.5 Lakhs' }
    ],
    renewal_conditions: 'Must pass the previous class with minimum 50% attendance and clear all examinations.',
    official_pdf: null,
    faq_list: [],
    online_process: '1. Visit National Scholarship Portal (NSP) at scholarships.gov.in.\n2. Complete registration and log in.\n3. Fill in academic, personal, and bank details.\n4. Upload caste, income, and fee documents.\n5. Submit application.',
    offline_process: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }
];

export const MOCK_SERVICES: CitizenService[] = [
  {
    id: 'cs1',
    title: 'Aadhaar Enrollment and Update',
    slug: 'aadhaar-card',
    category: 'Citizen Services & Certificates',
    description: 'Apply for a new 12-digit Aadhaar unique identity card or update details like name, phone, address, and biometrics.',
    what_is: 'Aadhaar is a 12-digit unique identity number issued by UIDAI to all residents of India based on their biometric and demographic data.',
    eligibility: 'Any resident of India of any age (including children under Bal Aadhaar) can enroll.',
    required_documents: ['Proof of Identity (PAN, Voter ID, Passport)', 'Proof of Address (Utility bill, bank statement, driving license)', 'Proof of Date of Birth (Birth certificate, school leaving certificate)'],
    fees: 'Free for first-time enrollment. Rs. 50 for demographic updates (name, address, phone), and Rs. 100 for biometric updates.',
    timeline: '7-90 days for the Aadhaar card to generate and deliver by post.',
    online_steps: [
      'Visit uidai.gov.in and select "Book an Appointment" to enroll or update offline.',
      'For address updates only, select "Update Address in your Aadhaar" online.',
      'Log in using Aadhaar number and OTP.',
      'Upload valid address proof document.',
      'Pay Rs. 50 fee online and note down the SRN number for tracking.'
    ],
    offline_process: 'Visit any authorized Aadhaar Seva Kendra or bank/post office branch with original documents. Fill the enrollment form, capture your biometric data (fingerprints, iris, photo), pay the fee, and collect the acknowledgment receipt.',
    common_mistakes: ['Not linking a mobile number during enrollment', 'Uploading blurred scans of document proofs', 'Name spelling not matching exactly across proofs'],
    faqs: [
      { q: 'Can I update my phone number online?', a: 'No, phone number updates require biometric verification and must be done in-person at an Aadhaar Kendra.' },
      { q: 'Is e-Aadhaar equally valid?', a: 'Yes, downloaded e-Aadhaar is a fully valid and legally accepted identity proof.' }
    ],
    official_links: ['https://uidai.gov.in', 'https://myaadhaar.uidai.gov.in'],
    checklist: ['Verify spelling of name on ID proof matches the form.', 'Ensure mobile number is working to receive OTP.', 'Carry original documents for offline verification.'],
    contact_info: { helpline: '1947', email: 'help@uidai.gov.in' },
    tags: ['identity', 'Aadhaar', 'UIDAI', 'essential card'],
    published: true,
    ministry_id: null,
    last_verified_at: '2026-01-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'cs2',
    title: 'PAN Card (New & Update)',
    slug: 'pan-card',
    category: 'Citizen Services & Certificates',
    description: 'Apply for a new Permanent Account Number (PAN) card for financial transactions or modify details on your current card.',
    what_is: 'PAN Card is a 10-character alphanumeric identifier issued by the Income Tax Department to track financial transactions and file income tax returns.',
    eligibility: 'All Indian citizens, partnerships, trusts, and business entities.',
    required_documents: ['Proof of Identity (Aadhaar, Voter ID, Passport)', 'Proof of Address (Aadhaar, utility bill, bank account statement)', 'Proof of Date of Birth (Birth certificate, Matriculation certificate)'],
    fees: 'Rs. 107 for a physical card sent to an address in India. Rs. 72 for e-PAN card copy only.',
    timeline: '15-20 days for physical delivery. 3-5 days for e-PAN delivery via email.',
    online_steps: [
      'Visit NSDL TIN website (onlineservices.nsdl.com) or UTIITSL portal.',
      'Select Application Type: "New PAN - Indian Citizen (Form 49A)".',
      'Fill in personal details, source of income, and address.',
      'Select e-KYC option to sign digitally using Aadhaar OTP (no document uploads needed).',
      'Pay fee online and submit to download the 15-digit acknowledgment receipt.'
    ],
    offline_process: 'Download Form 49A, fill it manually, attach two passport-size photographs, and submit with documents at any NSDL/UTIITSL TIN-FC center.',
    common_mistakes: ['Submitting mismatched photographs', 'Signature crossing into the text blocks', 'Aadhaar and PAN details not matching during linking'],
    faqs: [
      { q: 'Is Aadhaar mandatory for PAN?', a: 'Yes, Aadhaar card is mandatory for filing new PAN applications.' },
      { q: 'Can a minor apply?', a: 'Yes, parents can apply on behalf of a minor child.' }
    ],
    official_links: ['https://www.onlineservices.nsdl.com', 'https://www.pan.utiitsl.com'],
    checklist: ['Keep Aadhaar linked with your current mobile number.', 'Have soft copies of photograph and signature ready if choosing non-eKYC path.'],
    contact_info: { helpline: '18001801961' },
    tags: ['tax', 'finance', 'PAN', 'NSDL'],
    published: true,
    ministry_id: null,
    last_verified_at: '2026-01-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }
];

export const MOCK_POLICIES: Policy[] = [
  {
    id: 'p1',
    title: 'National Education Policy (NEP 2020)',
    slug: 'nep-2020',
    category: 'Consumer Rights & Law',
    summary: 'The new educational framework introducing a 5+3+3+4 structure and multi-disciplinary academic programs.',
    content: 'The National Education Policy 2020 outlines the vision of India\'s new education system. Key highlights include replacing the traditional 10+2 schooling system with a 5+3+3+4 design covering ages 3 to 18, introducing teaching in mother tongue/regional languages up to grade 5, vocational education integration starting from grade 6, and a flexible, multi-disciplinary undergraduate program with multiple entry and exit points.',
    key_points: [
      '5+3+3+4 school structure replacing 10+2.',
      'Emphasis on maternal or regional language instruction up to Class 5.',
      'Introduction of coding and vocational skills from Class 6.',
      'Undergraduate degrees with multiple entry/exit certifications.'
    ],
    official_reference: 'Ministry of Education NEP Policy Document',
    official_reference_url: 'https://www.education.gov.in/nep-2020',
    tags: ['policy', 'education', 'NEP', 'schooling reform'],
    published: true,
    last_verified_at: '2026-01-01',
    faq_list: [
      { q: 'Will board exams be eliminated?', a: 'No, board exams for grades 10 and 12 will continue, but they will be redesigned to test core concepts and competencies instead of rote learning.' }
    ],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }
];

export const MOCK_BLOGS: Blog[] = [
  {
    id: 'b1',
    title: 'How to Check your eligibility for Government Schemes Online',
    slug: 'how-to-check-eligibility',
    excerpt: 'A comprehensive step-by-step guide explaining how Indian citizens can quickly scan, check, and filter schemes they are eligible for.',
    content: 'Finding the right government scheme can be difficult due to the large number of departments and complex criteria. This guide walks you through using official directories like myScheme.gov.in and JanMitra. By inputting details like age, occupation, income, and state, you can immediately filter down to the exact subsidies, grants, and support structures meant for your profile.',
    author: 'JanMitra Editorial',
    image_url: null,
    tags: ['guide', 'eligibility', 'services'],
    published: true,
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'PM Kisan 17th Installment Released',
    body: 'The central government has released the 17th installment of PM Kisan. Check your bank status online.',
    type: 'alert',
    link: '/schemes/pm-kisan',
    target_audience: 'farmers',
    published: true,
    created_at: '2026-07-15T00:00:00Z'
  }
];
