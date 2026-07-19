import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SearchResult {
  type: 'scheme' | 'scholarship' | 'service' | 'policy';
  id: string;
  title: string;
  slug: string;
  description: string;
  benefits: string | null;
  eligibility: string | null;
  official_website: string | null;
  level: string | null;
  state: string | null;
  tags: string[];
  required_documents: string[];
  online_process: string | null;
  offline_process: string | null;
  fees: string | null;
  timeline: string | null;
  score: number;
  confidence: number;
}

// ─── Local knowledge base for common citizen services ───
// Used as fallback when Gemini API is unavailable AND no database record matches.
const LOCAL_KNOWLEDGE: { keywords: string[]; title: string; content: string }[] = [
  {
    keywords: ['aadhaar', 'adhar', 'aadhar', 'adhaar', 'uid', 'uidai'],
    title: 'Aadhaar Card',
    content: `**Aadhaar Card**

Aadhaar is a 12-digit unique identity number issued by UIDAI to all residents of India.

**Eligibility:** Any resident of India of any age can enroll.

**Required Documents:**
• Proof of Identity (PAN, Voter ID, etc.)
• Proof of Address (Utility bill, Bank statement, etc.)
• Proof of Date of Birth (Birth certificate, SSLC certificate, etc.)

**Application Process (Offline):**
1. Visit any Aadhaar Seva Kendra or enrollment center
2. Fill the enrollment form with your details
3. Submit biometric data (fingerprints, iris scan, photograph)
4. Collect the acknowledgment slip with your enrollment ID
5. Track status online at uidai.gov.in using the enrollment ID

**Fees:** Free for first-time enrollment. Rs 100 for updates/corrections.

**Timeline:** 7-90 days for the Aadhaar letter to arrive by post.

**Official Website:** https://uidai.gov.in

**Important Notes:**
• Link your mobile number to Aadhaar for OTP-based authentication
• You can download a digital copy (e-Aadhaar) from the UIDAI website
• Biometric updates are required for children at ages 5 and 15`,
  },
  {
    keywords: ['pan', 'pancard', 'permanent account', 'income tax'],
    title: 'PAN Card',
    content: `**PAN Card**

Permanent Account Number (PAN) is a 10-character alphanumeric identifier issued by the Income Tax Department.

**Eligibility:** Any individual, company, firm, or entity can apply. It's mandatory for financial transactions above Rs 50,000.

**Required Documents:**
• Proof of Identity (Aadhaar, Voter ID, Passport, etc.)
• Proof of Address (Aadhaar, Utility bill, Bank statement, etc.)
• Proof of Date of Birth (Birth certificate, SSLC certificate, etc.)
• 2 Passport-size photographs

**Application Process (Online):**
1. Visit https://www.onlineservices.nsdl.com or https://www.utitsl.co.in
2. Select the application type (Form 49A for Indian citizens)
3. Fill in personal details, contact info, and other details
4. Upload documents and photograph
5. Pay the fee online (Rs 107 for physical card, Rs 72 for e-PAN)
6. Submit and note the 15-digit acknowledgment number
7. Track status at https://www.trackpan.utiitsl.com

**Application Process (Offline):**
1. Download Form 49A from the NSDL website
2. Fill the form and attach documents and photos
3. Submit at any NSDL or UTIITSL TIN-FC center
4. Pay the fee and collect the acknowledgment

**Fees:** Rs 107 (physical PAN card) or Rs 72 (e-PAN only).

**Timeline:** 15-20 days for physical card, e-PAN in 3-5 days.

**Official Website:** https://www.incometaxindia.gov.in

**Important Notes:**
• Link your PAN with your bank account and Aadhaar
• Quote PAN for all high-value financial transactions
• You can apply for an instant e-PAN using Aadhaar at https://www.onlineservices.nsdl.com`,
  },
  {
    keywords: ['passport', 'pasporth', 'पासपोर्ट'],
    title: 'Passport',
    content: `**Passport Application**

An Indian passport is an official travel document issued by the Ministry of External Affairs.

**Eligibility:** Any Indian citizen. For a fresh passport, you must not already hold a valid passport.

**Required Documents:**
• Proof of Identity (Aadhaar, Voter ID, PAN, etc.)
• Proof of Address (Aadhaar, Utility bill, Bank statement, etc.)
• Proof of Date of Birth (Birth certificate, SSLC certificate, PAN, etc.)
• Passport-size photographs
• Old passport (for renewal)

**Application Process (Online):**
1. Register at https://www.passportindia.gov.in
2. Fill the application form and submit
3. Pay the fee online
4. Schedule an appointment at a Passport Seva Kendra (PSK)
5. Visit the PSK on the appointment date with original documents
6. Complete biometric capture and document verification
7. Police verification will be initiated
8. Passport is dispatched after verification

**Fees:**
• 36-page booklet (10 years): Rs 1,500
• 60-page booklet (10 years): Rs 2,000
• Tatkal (expedited): Rs 3,500 additional

**Timeline:** 25-45 days normally, 1-3 days under Tatkal scheme.

**Official Website:** https://www.passportindia.gov.in

**Important Notes:**
• Apply under Tatkal for urgent travel (extra fee)
• Police verification is mandatory for first-time applicants
• Keep your appointment — rescheduling incurs a fee`,
  },
  {
    keywords: ['driving', 'driving license', 'dl', 'license', 'chal', 'चालन', 'राइडिंग'],
    title: 'Driving Licence',
    content: `**Driving Licence (DL)**

A driving licence is an official document authorizing an individual to operate a motor vehicle in India.

**Eligibility:**
• Learner's Licence: 16 years (for 50cc gearless vehicles) or 18 years (for all vehicles)
• Permanent Licence: Must hold a Learner's Licence for at least 30 days

**Required Documents:**
• Proof of Age (Birth certificate, SSLC, PAN, Aadhaar)
• Proof of Address (Aadhaar, Utility bill, Bank statement)
• Learner's Licence (for permanent DL)
• Passport-size photographs
• Medical certificate (for transport vehicles and applicants over 40)

**Application Process (Online):**
1. Visit https://parivahan.gov.in
2. Select your state and "Driving Licence" service
3. Fill the application form
4. Upload documents and photo/signature
5. Pay the fee online
6. Schedule a slot for the driving test at the RTO
7. Pass the test to receive your DL by post

**Fees:**
• Learner's Licence: Rs 200 (per vehicle class)
• Permanent Licence: Rs 200 (per vehicle class) + Rs 300 test fee
• International DL: Rs 1,000

**Timeline:** Learner's Licence same day, Permanent Licence 2-4 weeks after test.

**Official Website:** https://parivahan.gov.in

**Important Notes:**
• A Learner's Licence is valid for 6 months
• Carry your DL while driving — digital DL in DigiLocker is also valid
• Renew your DL before expiry (grace period of 30 days)`,
  },
  {
    keywords: ['voter', 'matdata', 'voter id', 'epic', 'मतदाता'],
    title: 'Voter ID Card',
    content: `**Voter ID Card (EPIC)**

The Elector's Photo Identity Card (EPIC) is issued by the Election Commission of India.

**Eligibility:** Indian citizens aged 18 years and above on the qualifying date (Jan 1, Apr 1, Jul 1, or Oct 1).

**Required Documents:**
• Proof of Age (Birth certificate, SSLC, PAN, Aadhaar)
• Proof of Address (Aadhaar, Utility bill, Bank statement)
• Passport-size photograph

**Application Process (Online):**
1. Visit https://voters.eci.gov.in
2. Register/login using your mobile number
3. Fill Form 6 (for new voter registration)
4. Upload documents and photograph
5. Submit the application and note the application ID
6. Track status online

**Application Process (Offline):**
1. Visit your nearest Electoral Registration Officer (ERO) office
2. Collect and fill Form 6
3. Submit with documents and photo
4. Collect the acknowledgment receipt

**Fees:** Free of cost.

**Timeline:** 2-4 weeks for the voter ID card to be delivered.

**Official Website:** https://voters.eci.gov.in

**Important Notes:**
• Check your name on the electoral roll at electoralsearch.eci.gov.in
• You can correct details using Form 8
• You can transfer your registration using Form 8A`,
  },
  {
    keywords: ['birth certificate', 'janm', 'जन्म'],
    title: 'Birth Certificate',
    content: `**Birth Certificate**

A birth certificate is a vital record that establishes a person's date and place of birth.

**Eligibility:** Any person born in India. Registration should be done within 21 days of birth.

**Required Documents:**
• Hospital discharge summary or letter from the medical institution
• Proof of identity of parents (Aadhaar, etc.)
• Marriage certificate of parents (if applicable)
• Proof of address

**Application Process (Online):**
1. Visit your state's civil registration portal (e.g., crsorgi.gov.in for many states)
2. Register and login
3. Fill the birth registration form
4. Upload required documents
5. Submit and pay any applicable fee
6. Download the certificate after verification

**Application Process (Offline):**
1. Visit the Municipal Corporation / Gram Panchayat office
2. Collect the birth registration form
3. Fill and submit with documents
4. Collect the certificate after verification (7-15 days)

**Fees:** Free if registered within 21 days. Late fee applies after 21 days.

**Timeline:** 7-30 days depending on the state.

**Official Website:** https://crsorgi.gov.in

**Important Notes:**
• Register within 21 days to avoid late fees
• Birth certificates are essential for school admissions, passport, and Aadhaar`,
  },
  {
    keywords: ['income certificate', 'आय प्रमाण', 'aay praman'],
    title: 'Income Certificate',
    content: `**Income Certificate**

An income certificate is an official document certifying a person's annual income from all sources.

**Eligibility:** Any resident of the state where they are applying.

**Required Documents:**
• Aadhaar Card
• Proof of Address
• Salary slips (if salaried) or ITR (if self-employed)
• Bank statements (last 6 months)
• Affidavit of income (if no formal income proof)
• Caste certificate (if applicable)

**Application Process (Online):**
1. Visit your state's e-District / CSC portal (e.g., edistrict.up.nic.in, aaplesarkar.maha.gov.in)
2. Register/login with your details
3. Select "Income Certificate" service
4. Fill the application form
5. Upload documents
6. Pay the fee (if applicable) and submit
7. Track status online

**Application Process (Offline):**
1. Visit the Tehsil / Taluka office or CSC center
2. Collect and fill the application form
3. Submit with documents
4. Collect the certificate after verification

**Fees:** Rs 10-40 depending on the state.

**Timeline:** 7-15 days.

**Official Website:** Visit your state's e-District portal.

**Important Notes:**
• Income certificates are required for scholarships, EWS reservations, and subsidies
• Valid for 1-3 years depending on the purpose`,
  },
  {
    keywords: ['caste certificate', 'जाति प्रमाण', 'jati praman'],
    title: 'Caste Certificate',
    content: `**Caste Certificate**

A caste certificate is an official document certifying a person's caste, used for reservations and benefits.

**Eligibility:** Persons belonging to SC/ST/OBC categories as per the state's list.

**Required Documents:**
• Aadhaar Card
• Proof of Address
• School leaving certificate / birth certificate showing caste
• Father's or mother's caste certificate (if available)
• Affidavit of caste (in some states)
• Documents proving residence in the state for the required period

**Application Process (Online):**
1. Visit your state's e-District / CSC portal
2. Register/login
3. Select "Caste Certificate" service
4. Fill the application form with caste details
5. Upload documents
6. Pay the fee and submit
7. Track status online

**Application Process (Offline):**
1. Visit the Tehsil / Taluka / SDM office or CSC center
2. Collect and fill the application form
3. Submit with documents
4. Collect the certificate after verification

**Fees:** Rs 10-50 depending on the state.

**Timeline:** 15-30 days.

**Official Website:** Visit your state's e-District portal.

**Important Notes:**
• Caste certificates are required for education reservations, government jobs, and scholarships
• For central government benefits, you may need a central caste certificate format`,
  },
  {
    keywords: ['domicile', 'निवास', 'nivas', 'niwas', 'residence certificate'],
    title: 'Domicile Certificate',
    content: `**Domicile / Residence Certificate**

A domicile certificate establishes a person's residence in a particular state.

**Eligibility:** A person who has resided in the state for a minimum period (usually 3-10 years depending on the state).

**Required Documents:**
• Aadhaar Card
• Proof of Address (Utility bill, Rent agreement, etc.)
• School leaving certificate / birth certificate
• Employment proof or business proof
• Affidavit of residence

**Application Process (Online):**
1. Visit your state's e-District / CSC portal
2. Register/login
3. Select "Domicile/Residence Certificate" service
4. Fill the application form
5. Upload documents
6. Pay the fee and submit
7. Track status online

**Application Process (Offline):**
1. Visit the Tehsil / Taluka / SDM office
2. Collect and fill the application form
3. Submit with documents
4. Collect the certificate after verification

**Fees:** Rs 10-50 depending on the state.

**Timeline:** 7-15 days.

**Official Website:** Visit your state's e-District portal.

**Important Notes:**
• Required for state government jobs, state scholarships, and state quotas
• A person can only have one domicile certificate`,
  },
  {
    keywords: ['cyber', 'cybercrime', 'online fraud', 'internet fraud', 'साइबर'],
    title: 'Reporting Cybercrime',
    content: `**Reporting Cybercrime and Online Fraud**

India's national cybercrime reporting portal handles online fraud, hacking, and cyberstalking complaints.

**What to Report:**
• Online financial fraud (UPI, card, net banking)
• Social media related crimes
• Cyberstalking / harassment
• Hacking / identity theft
• ransomware attacks

**How to Report (Online):**
1. Visit https://cybercrime.gov.in
2. Click "Report Cyber Crime"
3. Select "Report Cyber Crime against Women/Child" or "Report Other Cyber Crime"
4. Register with your mobile number and email
5. Fill the complaint form with details
6. Upload evidence (screenshots, transaction details)
7. Submit and note the complaint reference number

**How to Report (Phone):**
• Call the National Cyber Crime Helpline: 1930 (toll-free, 9 AM to 6 PM)
• For immediate financial fraud, call 1930 to attempt to freeze the transaction

**Required Information:**
• Details of the incident (date, time, platform)
• Screenshots of conversations / fraudulent messages
• Transaction reference numbers (for financial fraud)
• Suspect details (if known)

**Fees:** Free.

**Timeline:** Complaints are forwarded to state police within 24 hours.

**Official Website:** https://cybercrime.gov.in

**Important Notes:**
• Report financial fraud immediately — faster reporting increases chances of recovery
• Preserve all evidence (screenshots, messages, transaction IDs)
• Don't delete the fraudulent messages or block the suspect until evidence is saved`,
  },
];

function findLocalKnowledge(query: string): { title: string; content: string } | null {
  const lower = query.toLowerCase();
  for (const entry of LOCAL_KNOWLEDGE) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) return entry;
    }
  }
  return null;
}

// ─── Search helpers ───

const SYNONYM_MAP: Record<string, string[]> = {
  'aadhaar': ['adhar', 'aadhar', 'adhaar', 'adharcard', 'aadharcard', 'आधार', 'uid'],
  'pan': ['pancard', 'पैन', 'permanentaccount', 'incometax'],
  'passport': ['पासपोर्ट', 'pasporth'],
  'voter': ['matdata', 'मतदाता', 'voterid', 'epic'],
  'driving': ['chal', 'चालन', 'drivinglicense', 'dl', 'license'],
  'scholarship': ['छात्रवृत्ति', 'chhatravritti', 'scholar', 'fellowship', 'stipend'],
  'scheme': ['yojna', 'yojana', 'योजना', 'sarkari', 'government'],
  'pension': ['पेंशन', 'pensan', 'retirement'],
  'farmer': ['kisan', 'किसान', 'kishan', 'krishi', 'कृषि'],
  'education': ['शिक्षा', 'shiksha', 'school', 'college', 'student', 'छात्र'],
  'health': ['स्वास्थ्य', 'swasthya', 'medical', 'hospital', 'ayushman', 'pmjay'],
  'women': ['mahila', 'महिला', 'girl', 'बालिका', 'ladki', 'beti'],
  'housing': ['awas', 'आवास', 'ghar', 'मकान', 'pmay'],
  'certificate': ['praman', 'प्रमाण', 'pramaan', 'patra'],
  'income': ['आय', 'aay', 'salary'],
  'caste': ['जाति', 'jati', 'jaati'],
  'domicile': ['निवास', 'nivas', 'niwas', 'residence'],
  'birth': ['जन्म', 'janm'],
  'death': ['मृत्यु', 'mrityu'],
  'marriage': ['विवाह', 'vivaah', 'shadi', 'शादी'],
  'senior': ['vridh', 'वृद्ध', 'buzurg', 'elderly', 'oldage', 'वृद्धावस्था'],
  'disability': ['divyang', 'दिव्यांग', 'viklang', 'विकलांग', 'handicap'],
  'military': ['army', 'सेना', 'senaa', 'defence', 'defense', 'veteran', 'exservicemen', 'capf', 'crpf', 'bsf'],
  'business': ['vyapar', 'व्यापार', 'udyam', 'उद्यम', 'msme', 'startup', 'mudra'],
  'agriculture': ['krishi', 'कृषि', 'farming', 'crop'],
  'widow': ['vidhwa', 'विधवा'],
  'insurance': ['बीमा', 'bima'],
  'loan': ['karja', 'कर्ज़', 'ऋण', 'rin'],
  'complaint': ['shikayat', 'शिकायत', 'grievance'],
  'ration': ['राशन', 'rashan', 'food'],
  'police': ['पुलिस', 'pulis'],
  'cyber': ['साइबर', 'cybercrime', 'onlinefraud'],
};

function normalize(s: string): string {
  return s.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u0900-\u097f\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function expandQuery(query: string): string[] {
  const lower = query.toLowerCase();
  const expansions = new Set<string>();
  for (const [canonical, synonyms] of Object.entries(SYNONYM_MAP)) {
    if (lower.includes(canonical)) {
      for (const s of synonyms) expansions.add(s);
    }
    for (const s of synonyms) {
      if (lower.includes(s.toLowerCase())) {
        expansions.add(canonical);
        for (const s2 of synonyms) expansions.add(s2);
      }
    }
  }
  return Array.from(expansions);
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[n];
}

function scoreField(queryNorm: string, queryTerms: string[], expandedTerms: string[], field: string): number {
  if (!field) return 0;
  const fieldNorm = normalize(field);
  if (!fieldNorm) return 0;
  let score = 0;
  if (fieldNorm.includes(queryNorm)) score += 15;
  if (fieldNorm === queryNorm) score += 25;
  const allTerms = [...queryTerms, ...expandedTerms];
  for (const term of allTerms) {
    if (term.length < 2) continue;
    if (fieldNorm.includes(term)) {
      score += 3;
      continue;
    }
    if (term.length >= 4) {
      const words = fieldNorm.split(' ');
      for (const w of words) {
        if (w.length < 3) continue;
        const dist = levenshtein(term, w);
        const threshold = Math.max(1, Math.floor(term.length / 4));
        if (dist <= threshold) { score += 1.5; break; }
      }
    }
  }
  return score;
}

function scoreRecord(queryNorm: string, queryTerms: string[], expandedTerms: string[], fields: string[], isTitle: boolean): number {
  let score = 0;
  for (let i = 0; i < fields.length; i++) {
    score += scoreField(queryNorm, queryTerms, expandedTerms, fields[i]) * (i === 0 ? 3 : 1);
  }
  if (isTitle && normalize(fields[0]).includes(queryNorm)) score += 20;
  return score;
}

function buildContext(results: SearchResult[]): string {
  if (results.length === 0) return '';
  const lines: string[] = ['VERIFIED GOVERNMENT RECORDS FROM DATABASE:'];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    lines.push(`\n--- Record ${i + 1} (${r.type}) ---`);
    lines.push(`Title: ${r.title}`);
    lines.push(`Type: ${r.type}`);
    if (r.level) lines.push(`Level: ${r.level}`);
    if (r.state) lines.push(`State: ${r.state}`);
    if (r.description) lines.push(`Description: ${r.description}`);
    if (r.eligibility) lines.push(`Eligibility: ${r.eligibility}`);
    if (r.benefits) lines.push(`Benefits/Amount: ${r.benefits}`);
    if (r.required_documents && r.required_documents.length > 0) lines.push(`Required Documents: ${r.required_documents.join(', ')}`);
    if (r.online_process) lines.push(`Online Process: ${r.online_process}`);
    if (r.offline_process) lines.push(`Offline Process: ${r.offline_process}`);
    if (r.fees) lines.push(`Fees: ${r.fees}`);
    if (r.timeline) lines.push(`Timeline: ${r.timeline}`);
    if (r.official_website) lines.push(`Official Website: ${r.official_website}`);
    if (r.tags && r.tags.length > 0) lines.push(`Tags: ${r.tags.join(', ')}`);
  }
  return lines.join('\n');
}

// ─── Gemini API call with multi-model fallback ───

const GEMINI_MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3-flash-preview'];

async function callGemini(prompt: string, systemInstruction: string, log: (l: string, m: string, m2?: Record<string, unknown>) => void): Promise<string> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { temperature: 0.4, topP: 0.9, topK: 40, maxOutputTokens: 2048 },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  };

  let lastError = '';
  const allErrors: string[] = [];
  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        log('INFO', `Calling Gemini model: ${model}`, { attempt: attempt + 1 });
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000);
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
          const errText = await response.text();
          const errSummary = `${model} (${response.status}): ${errText.slice(0, 150)}`;
          allErrors.push(errSummary);
          log('WARN', `Model ${model} failed`, { status: response.status, attempt: attempt + 1 });
          // 404 = model not available, try next model immediately
          if (response.status === 404) break;
          // 429 = quota exceeded, try next model
          if (response.status === 429) break;
          // For other errors, retry once then try next model
          if (attempt < 1) continue;
          break;
        }

        const data = await response.json();
        const candidates = data?.candidates;
        if (!candidates || candidates.length === 0) {
          const feedback = data?.promptFeedback;
          if (feedback?.blockReason) {
            allErrors.push(`${model} blocked: ${feedback.blockReason}`);
            log('WARN', `Content blocked by ${model}`, { reason: feedback.blockReason });
            break;
          }
          allErrors.push(`${model} returned no candidates`);
          break;
        }
        const parts = candidates[0]?.content?.parts;
        if (!parts || parts.length === 0) {
          allErrors.push(`${model} returned no content`);
          break;
        }
        const text = parts.map((p: { text?: string }) => p.text || '').join('').trim();
        if (!text) {
          allErrors.push(`${model} returned empty text`);
          break;
        }
        log('INFO', `Gemini success with model: ${model}`, { length: text.length });
        return text;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        allErrors.push(`${model}: ${errMsg}`);
        log('WARN', `Model ${model} error`, { error: errMsg, attempt: attempt + 1 });
        if (attempt < 1) continue;
        break;
      }
    }
  }
  throw new Error(allErrors.join(' | ') || "All Gemini models failed");
}

const SYSTEM_INSTRUCTION = `You are JanMitra, an AI Government Assistant for Indian citizens. You help users find government schemes, scholarships, citizen services, and policies.

You understand natural language, spelling mistakes, Hindi-English mixed queries (Hinglish), abbreviations, and conversational questions.

RESPONSE FORMAT:
Always structure your answer with these sections when applicable:
1. **Summary** - A brief 1-2 line overview
2. **Eligibility** - Who can apply
3. **Required Documents** - List of documents needed
4. **Application Process** - Step-by-step how to apply (online and offline)
5. **Fees** - If any
6. **Timeline** - How long it takes
7. **Official Website** - Link to official portal
8. **Important Notes** - Key tips or warnings

CRITICAL RULES:
1. When verified database records are provided, use them as the primary source. Summarize, explain, and present the information in simple, helpful language. Do NOT just repeat raw database text.
2. When NO database records are found, use your knowledge of Indian government procedures to provide a helpful answer. Start with: "This is general guidance based on standard government procedures. For exact details, please verify on the official portal."
3. NEVER say "No verified government record found." Always provide a helpful answer.
4. NEVER invent specific scheme names, benefit amounts, or deadlines that aren't in the database records. For general knowledge answers, keep information general.
5. Respond in the same language the user used (English, Hindi, or Hinglish).
6. For non-government topics, politely redirect to government-related questions.
7. When the user profile is provided, personalize the answer and mention which schemes they may be eligible for.
8. Always provide official website links when known (e.g., uidai.gov.in for Aadhaar, incometaxindia.gov.in for PAN, etc.).
9. Keep answers concise but complete. Use bullet points for lists.
10. For application processes, give clear step-by-step instructions.`;

// ─── Build a high-quality response from database records (no "AI unavailable" text) ───

function buildResponseFromResults(results: SearchResult[]): string {
  if (results.length === 0) return '';

  const r = results[0];
  const parts: string[] = [];
  parts.push(`**${r.title}**`);
  if (r.description) parts.push(`\n${r.description}`);
  if (r.eligibility) parts.push(`\n**Eligibility:** ${r.eligibility}`);
  if (r.benefits) parts.push(`\n**Benefits:** ${r.benefits}`);
  if (r.required_documents && r.required_documents.length > 0) {
    parts.push(`\n**Required Documents:**`);
    for (const doc of r.required_documents) parts.push(`• ${doc}`);
  }
  if (r.online_process) parts.push(`\n**Online Process:** ${r.online_process}`);
  if (r.offline_process) parts.push(`\n**Offline Process:** ${r.offline_process}`);
  if (r.fees) parts.push(`\n**Fees:** ${r.fees}`);
  if (r.timeline) parts.push(`\n**Timeline:** ${r.timeline}`);
  if (r.official_website) parts.push(`\n**Official Website:** ${r.official_website}`);

  // Add additional results as "See also"
  if (results.length > 1) {
    parts.push(`\n\n**See also:**`);
    for (let i = 1; i < Math.min(results.length, 4); i++) {
      parts.push(`• ${results[i].title}${results[i].description ? ' — ' + results[i].description.slice(0, 80) + '...' : ''}`);
    }
  }

  return parts.join('\n');
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const startTime = Date.now();
  const log = (level: 'INFO' | 'WARN' | 'ERROR', message: string, meta?: Record<string, unknown>) => {
    const ts = new Date().toISOString();
    const payload = meta ? ` ${JSON.stringify(meta)}` : '';
    console.log(`[${ts}] [${level}] [ai-assistant] ${message}${payload}`);
  };

  log('INFO', 'Request received', { method: req.method });

  try {
    const { query, profile, limit, history } = await req.json();
    const rawQuery = (query || '').trim();
    const queryNorm = normalize(rawQuery);
    const queryTerms = queryNorm.split(' ').filter((t) => t.length >= 2);
    const expandedTerms = expandQuery(rawQuery);
    const maxResults = limit || 6;

    if (!queryNorm) {
      log('WARN', 'Empty query received');
      return new Response(
        JSON.stringify({ results: [], response: "Please ask a question about government schemes, scholarships, or services.", intent: 'general', geminiUsed: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    log('INFO', 'Processing query', { query: rawQuery, terms: queryTerms.length, expanded: expandedTerms.length });

    // Search ALL tables
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!supabaseUrl || !supabaseKey) {
      log('ERROR', 'Missing Supabase credentials');
      throw new Error('Server configuration error');
    }
    const headers = {
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    };

    const fetches: Promise<Response>[] = [];
    const tableOrder: ('scheme' | 'scholarship' | 'service' | 'policy')[] = [];

    fetches.push(fetch(`${supabaseUrl}/rest/v1/schemes?select=id,title,slug,short_description,description,benefits,eligibility,official_website,level,state,tags,required_documents,online_process,offline_process,open_date,close_date,status&published=eq.true&limit=1000`, { headers }));
    tableOrder.push('scheme');
    fetches.push(fetch(`${supabaseUrl}/rest/v1/scholarships?select=id,title,slug,description,eligibility,amount,official_website,level,state,tags,deadline,documents,online_process&published=eq.true&limit=500`, { headers }));
    tableOrder.push('scholarship');
    fetches.push(fetch(`${supabaseUrl}/rest/v1/citizen_services?select=id,title,slug,description,what_is,eligibility,official_links,tags,required_documents,online_steps,offline_process,fees,timeline&published=eq.true&limit=300`, { headers }));
    tableOrder.push('service');
    fetches.push(fetch(`${supabaseUrl}/rest/v1/policies?select=id,title,slug,summary,content,category,tags,official_reference,official_reference_url&published=eq.true&limit=200`, { headers }));
    tableOrder.push('policy');

    const responses = await Promise.all(fetches);
    const dataArrays: Record<string, unknown>[][] = await Promise.all(responses.map((r) => r.json()));

    const results: SearchResult[] = [];

    for (let t = 0; t < tableOrder.length; t++) {
      const table = tableOrder[t];
      const records = dataArrays[t] as Record<string, unknown>[];
      for (const s of records) {
        let fields: string[];
        let isTitle = false;
        let desc = '';
        let benefits: string | null = null;
        let eligibility: string | null = null;
        let officialWebsite: string | null = null;
        let level: string | null = null;
        let state: string | null = null;
        let tags: string[] = [];
        let requiredDocuments: string[] = [];
        let onlineProcess: string | null = null;
        let offlineProcess: string | null = null;
        let fees: string | null = null;
        let timeline: string | null = null;

        if (table === 'scheme') {
          fields = [String(s.title || ''), String(s.short_description || ''), String(s.description || ''), String(s.eligibility || ''), String(s.benefits || ''), ((s.tags as string[]) || []).join(' ')];
          isTitle = true;
          desc = String(s.short_description || s.description || '');
          benefits = (s.benefits || null) as string | null;
          eligibility = (s.eligibility || null) as string | null;
          officialWebsite = (s.official_website || null) as string | null;
          level = (s.level || null) as string | null;
          state = (s.state || null) as string | null;
          tags = (s.tags || []) as string[];
          requiredDocuments = (s.required_documents || []) as string[];
          onlineProcess = (s.online_process || null) as string | null;
          offlineProcess = (s.offline_process || null) as string | null;
        } else if (table === 'scholarship') {
          fields = [String(s.title || ''), String(s.description || ''), String(s.eligibility || ''), String(s.amount || ''), ((s.tags as string[]) || []).join(' ')];
          isTitle = true;
          desc = String(s.description || '');
          benefits = (s.amount || null) as string | null;
          eligibility = (s.eligibility || null) as string | null;
          officialWebsite = (s.official_website || null) as string | null;
          level = (s.level || null) as string | null;
          state = (s.state || null) as string | null;
          tags = (s.tags || []) as string[];
          requiredDocuments = (s.documents || []) as string[];
          onlineProcess = (s.online_process || null) as string | null;
        } else if (table === 'service') {
          fields = [String(s.title || ''), String(s.description || ''), String(s.what_is || ''), String(s.eligibility || ''), ((s.tags as string[]) || []).join(' ')];
          isTitle = true;
          desc = String(s.description || '');
          eligibility = (s.eligibility || null) as string | null;
          officialWebsite = ((s.official_links as string[]) || [])[0] || null;
          tags = (s.tags || []) as string[];
          requiredDocuments = (s.required_documents || []) as string[];
          offlineProcess = (s.offline_process || null) as string | null;
          fees = (s.fees || null) as string | null;
          timeline = (s.timeline || null) as string | null;
        } else {
          fields = [String(s.title || ''), String(s.summary || ''), String(s.content || ''), String(s.category || ''), ((s.tags as string[]) || []).join(' ')];
          isTitle = true;
          desc = String(s.summary || '');
          officialWebsite = (s.official_reference_url || null) as string | null;
          tags = (s.tags || []) as string[];
        }

        const score = scoreRecord(queryNorm, queryTerms, expandedTerms, fields, isTitle);
        if (score > 0) {
          results.push({
            type: table, id: s.id as string, title: s.title as string, slug: s.slug as string,
            description: desc, benefits, eligibility, official_website: officialWebsite,
            level, state, tags, required_documents: requiredDocuments,
            online_process: onlineProcess, offline_process: offlineProcess, fees, timeline,
            score, confidence: 0,
          });
        }
      }
    }

    // Profile-based boosting
    if (profile && profile.state) {
      for (const r of results) {
        if (r.type === 'scheme' && r.state) {
          if (r.state.toLowerCase() === profile.state.toLowerCase()) r.score += 8;
          else if (r.level === 'state') r.score -= 15;
        }
      }
    }

    results.sort((a, b) => b.score - a.score);
    // Filter out low-relevance results — only keep results with a meaningful score
    const MIN_SCORE_THRESHOLD = 5;
    const relevantResults = results.filter((r) => r.score >= MIN_SCORE_THRESHOLD);
    const topResults = relevantResults.slice(0, maxResults);
    const maxScore = topResults.length > 0 ? topResults[0].score : 0;
    for (const r of topResults) {
      r.confidence = maxScore > 0 ? Math.min(100, Math.round((r.score / maxScore) * 100)) : 0;
    }

    log('INFO', 'Database search complete', { totalRecords: results.length, relevantResults: relevantResults.length, topResults: topResults.length });

    // Build Gemini prompt
    const context = buildContext(topResults);
    const profileInfo = profile ? `\n\nUSER PROFILE: Age ${profile.age || 'N/A'}, Gender ${profile.gender || 'N/A'}, State ${profile.state || 'N/A'}, Occupation ${profile.occupation || 'N/A'}, Income ${profile.annual_income || 'N/A'}, Caste ${profile.caste || 'N/A'}, Education ${profile.education || 'N/A'}, Disability ${profile.disability ? 'Yes' : 'No'}, Farmer ${profile.farmer ? 'Yes' : 'No'}, Student ${profile.student ? 'Yes' : 'No'}, Veteran ${profile.veteran ? 'Yes' : 'No'}, Business Owner ${profile.business_owner ? 'Yes' : 'No'}` : '';

    let historyContext = '';
    if (history && Array.isArray(history) && history.length > 0) {
      const recent = history.slice(-4);
      historyContext = '\n\nCONVERSATION HISTORY:\n' + recent.map((h: { role: string; content: string }) => `${h.role}: ${h.content}`).join('\n');
    }

    const prompt = `User Question: ${rawQuery}${profileInfo}${historyContext}\n\n${context}\n\n${topResults.length > 0 ? 'Based on the verified government records above, provide a clear, structured answer to the user\'s question. Summarize the relevant records, explain eligibility, required documents, application process, and provide official links. If the user profile is provided, mention which schemes they are likely eligible for.' : 'No matching records were found in our database. Use your knowledge of Indian government procedures to answer this question. Start with: "This is general guidance based on standard government procedures. For exact details, please verify on the official portal." Then provide a helpful answer with eligibility, documents, process, and official websites.'}`;

    // Call Gemini with multi-model fallback
    let geminiResponse = '';
    let geminiError: string | null = null;
    try {
      geminiResponse = await callGemini(prompt, SYSTEM_INSTRUCTION, log);
      log('INFO', 'Gemini response received', { length: geminiResponse.length });
    } catch (err) {
      geminiError = err instanceof Error ? err.message : String(err);
      log('ERROR', 'All Gemini models failed', { error: geminiError });
    }

    // Build response — always provide a useful answer, never "AI unavailable"
    let responseText = '';
    if (geminiResponse) {
      responseText = geminiResponse;
    } else if (topResults.length > 0) {
      // Gemini failed but we have DB results — build a clean structured response
      responseText = buildResponseFromResults(topResults);
      log('INFO', 'Using database fallback response');
    } else {
      // No DB results and Gemini failed — check local knowledge base
      const local = findLocalKnowledge(rawQuery);
      if (local) {
        responseText = local.content;
        log('INFO', 'Using local knowledge base', { topic: local.title });
      } else {
        responseText = "I can help you with government schemes, scholarships, citizen services (Aadhaar, PAN, Passport, Driving Licence, Voter ID, Birth Certificate, etc.), and government policies. Please ask me a specific question, for example:\n\n• \"How to apply for Aadhaar?\"\n• \"What is PM Kisan scheme?\"\n• \"Scholarships for SC students\"\n• \"How to report cybercrime?\"";
        log('INFO', 'Using generic fallback');
      }
    }

    const elapsed = Date.now() - startTime;
    log('INFO', 'Request completed', { geminiUsed: !!geminiResponse, elapsedMs: elapsed });

    return new Response(
      JSON.stringify({
        results: topResults,
        response: responseText,
        totalFound: relevantResults.length,
        intent: 'general',
        geminiUsed: !!geminiResponse,
        geminiError,
        elapsedMs: elapsed,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const elapsed = Date.now() - startTime;
    log('ERROR', 'Unhandled error', { error: err.message, elapsedMs: elapsed });
    return new Response(
      JSON.stringify({
        error: err.message,
        results: [],
        response: "I'm currently unable to process your request. Please try again in a moment, or browse our schemes and services directly.",
        intent: 'general',
        geminiUsed: false,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
