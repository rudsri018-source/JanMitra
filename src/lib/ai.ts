import type { Scheme, EligibilityProfile } from '../types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  followUps?: string[];
  results?: { title: string; slug: string; score: number; reasons: string[]; type: string; confidence: number }[];
  geminiUsed?: boolean;
  geminiError?: string | null;
}

export interface RagResult {
  type: string;
  title: string;
  slug: string;
  description: string;
  benefits: string | null;
  eligibility: string | null;
  official_website: string | null;
  score: number;
  confidence: number;
}

const GOVERNMENT_KEYWORDS = [
  'scheme', 'schemes', 'yojana', 'yojna', 'government', 'govt', 'sarkari',
  'scholarship', 'scholar', 'pension', 'loan', 'subsidy', 'insurance',
  'farmer', 'kisan', 'student', 'education', 'health', 'ayushman',
  'housing', 'awas', 'women', 'girl', 'senior', 'elderly', 'disability',
  'divyang', 'sc', 'st', 'obc', 'minority', 'mudra', 'startup', 'msme',
  'ev', 'electric', 'vehicle', 'ration', 'aadhaar', 'pan', 'passport',
  'voter', 'driving', 'licence', 'license', 'certificate', 'income', 'caste',
  'domicile', 'birth', 'death', 'marriage', 'property', 'land',
  'cyber', 'complaint', 'grievance', 'rti', 'rights', 'policy', 'law',
  'tax', 'gst', 'inheritance', 'gratuity', 'labour', 'employment',
  'job', 'skill', 'agriculture', 'crop', 'pm-kisan', 'pmjay', 'pmay',
  'nsp', 'help', 'eligible', 'eligibility', 'apply', 'application',
  'documents', 'process', 'how to', 'what is', 'transport', 'disaster',
  'relief', 'digital', 'military', 'army', 'ex-servicemen', 'children', 'welfare',
  'benefit', 'benefits', 'amount', 'deadline', 'central', 'state',
  'fund', 'funding', 'grant', 'free', 'subsidized', 'concession',
  'fee', 'fees', 'online', 'offline', 'portal', 'website', 'link',
  'register', 'registration', 'form', 'check', 'status', 'track',
  'helpline', 'contact', 'number', 'service', 'services', 'citizen',
  'public', 'national', 'india', 'indian', 'ministry', 'department',
  'widow', 'veteran', 'capf', 'police', 'defence', 'udyam',
  'आधार', 'योजना', 'छात्रवृत्ति', 'किसान', 'पेंशन', 'महिला', 'शिक्षा', 'स्वास्थ्य',
];

const NON_GOVERNMENT_KEYWORDS = [
  'movie', 'song', 'game', 'cricket', 'football', 'recipe', 'cook',
  'travel', 'hotel', 'restaurant', 'shopping', 'fashion', 'beauty',
  'celebrity', 'gossip', 'entertainment', 'joke', 'dating', 'love',
  'relationship', 'weather', 'horoscope', 'astrology', 'lottery',
  'casino', 'betting', 'stock market', 'share market', 'crypto',
];

export function isGovernmentRelated(query: string): boolean {
  const lower = query.toLowerCase();
  if (NON_GOVERNMENT_KEYWORDS.some((k) => lower.includes(k))) return false;
  return GOVERNMENT_KEYWORDS.some((k) => lower.includes(k));
}

const FOLLOW_UP_FIELDS = [
  { key: 'age', question: 'What is your age?', options: ['18-25', '26-35', '36-45', '46-60', '60+'] },
  { key: 'gender', question: 'What is your gender?', options: ['Male', 'Female', 'Other'] },
  { key: 'state', question: 'Which state do you live in?', options: ['Madhya Pradesh', 'Uttar Pradesh', 'Maharashtra', 'Delhi', 'Rajasthan', 'Other'] },
  { key: 'occupation', question: 'What is your occupation?', options: ['Student', 'Farmer', 'Business', 'Employed', 'Unemployed', 'Self Employed'] },
  { key: 'annual_income', question: 'What is your annual family income?', options: ['Below 1 Lakh', '1-3 Lakh', '3-6 Lakh', '6-12 Lakh', 'Above 12 Lakh'] },
  { key: 'caste', question: 'Which category do you belong to?', options: ['SC', 'ST', 'OBC', 'General', 'EWS', 'Minority'] },
  { key: 'disability', question: 'Do you have any disability?', options: ['Yes', 'No'] },
  { key: 'education', question: 'What is your education level?', options: ['Primary', 'Secondary', 'Higher Secondary', 'Graduate', 'Post Graduate', 'Not Studying'] },
];

export function getNextFollowUp(profile: Partial<EligibilityProfile>): { key: string; question: string; options: string[] } | null {
  for (const field of FOLLOW_UP_FIELDS) {
    const val = (profile as Record<string, unknown>)[field.key];
    if (val === undefined || val === null || val === '') {
      return field;
    }
  }
  return null;
}

export interface HistoryEntry {
  role: 'user' | 'assistant';
  content: string;
}

export async function queryRagEndpoint(
  query: string,
  profile: Partial<EligibilityProfile> | null,
  history?: HistoryEntry[],
): Promise<{ results: RagResult[]; response: string; intent: string; geminiUsed: boolean; geminiError: string | null }> {
  try {
    const apiUrl = `/api/chat`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, profile, limit: 6, history }),
    });
    if (!response.ok) throw new Error(`Chat request failed (${response.status})`);
    const data = await response.json();
    return {
      results: data.results || [],
      response: data.response || '',
      intent: data.intent || 'general',
      geminiUsed: data.geminiUsed !== undefined ? !!data.geminiUsed : true,
      geminiError: data.geminiError || null,
    };
  } catch (err) {
    return {
      results: [],
      response: '',
      intent: 'general',
      geminiUsed: false,
      geminiError: err instanceof Error ? err.message : String(err),
    };
  }
}

export function generateResponse(
  query: string,
  _schemes: Scheme[],
  profile: Partial<EligibilityProfile>,
  collectedProfile: EligibilityProfile | null,
  ragResults?: RagResult[],
  ragResponse?: string,
): ChatMessage {
  const lower = query.toLowerCase();

  // GEMINI IS THE PRIMARY ENGINE — always use its response when available.
  // The edge function searches the database first, then sends records to Gemini
  // as context. Gemini explains the records in simple language, or answers general
  // citizen-service questions when no records are found.
  if (ragResponse) {
    return {
      role: 'assistant',
      content: ragResponse,
      results: ragResults && ragResults.length > 0
        ? ragResults.map((r) => ({
            title: r.title,
            slug: r.slug,
            score: Math.min(100, 60 + r.score),
            reasons: [r.description?.slice(0, 120) + '...'],
            type: r.type,
            confidence: r.confidence,
          }))
        : undefined,
      suggestions: ragResults && ragResults.length > 0
        ? ['Tell me more about these', 'Am I eligible?', 'What documents do I need?']
        : ['Find schemes for me', 'Scholarships', 'Citizen services', 'Government policies'],
    };
  }

  // --- Fallbacks below: only used when Gemini is unavailable ---

  // Greeting fallback
  if (/\b(hi|hello|hey|namaste|namaskar)\b/.test(lower)) {
    return {
      role: 'assistant',
      content: "Namaste! I'm JanMitra, your AI Government Assistant. I can help you with government schemes, scholarships, citizen services, and policies in simple language. What would you like help with?",
      suggestions: ['Find schemes for me', 'Scholarships for students', 'How to get a PAN card?', 'Explain consumer rights'],
    };
  }

  // Eligibility flow fallback (only when Gemini is down)
  if (lower.includes('eligible') || lower.includes('recommend') || (lower.includes('scheme') && lower.includes('for me'))) {
    if (!collectedProfile) {
      const next = getNextFollowUp(profile);
      if (next) {
        return {
          role: 'assistant',
          content: `To recommend the most suitable schemes for you, I need a few details. ${next.question}`,
          followUps: [next.key],
          suggestions: next.options,
        };
      }
    }
  }

  // Database results fallback (Gemini unavailable)
  if (ragResults && ragResults.length > 0) {
    return {
      role: 'assistant',
      content: `I found ${ragResults.length} relevant result(s) from our verified government database. AI assistance is temporarily unavailable, so here are the direct links:`,
      results: ragResults.map((r) => ({
        title: r.title,
        slug: r.slug,
        score: Math.min(100, 60 + r.score),
        reasons: [r.description?.slice(0, 120) + '...'],
        type: r.type,
        confidence: r.confidence,
      })),
      suggestions: ['Find schemes for me', 'Scholarships', 'Citizen services', 'Government policies'],
    };
  }

  // Final fallback — non-government query when Gemini is down
  if (!isGovernmentRelated(lower)) {
    return {
      role: 'assistant',
      content: "I'm JanMitra, a government assistant. I can help with government schemes, scholarships, citizen services (Aadhaar, PAN, Passport, etc.), policies, pensions, documents, and grievances. Could you ask me something about government services?",
      suggestions: ['How to apply for Aadhaar?', 'Scholarships for SC students', 'PM Kisan scheme', 'How to report cybercrime?'],
    };
  }

  return {
    role: 'assistant',
    content: "I can help you with government schemes, scholarships, citizen services, and policies. Try asking:\n\n• 'How to apply for Aadhaar?'\n• 'Scholarships for SC students'\n• 'PM Kisan scheme details'\n• 'How to get a birth certificate?'",
    suggestions: ['Find schemes for me', 'Scholarships', 'Citizen services', 'Government policies'],
  };
}

export function parseFollowUpAnswer(key: string, answer: string): Partial<EligibilityProfile> {
  const update: Partial<EligibilityProfile> = {};
  switch (key) {
    case 'age': {
      const match = answer.match(/(\d+)/);
      if (match) update.age = parseInt(match[1]);
      else if (answer.includes('18-25')) update.age = 22;
      else if (answer.includes('26-35')) update.age = 30;
      else if (answer.includes('36-45')) update.age = 40;
      else if (answer.includes('46-60')) update.age = 53;
      else if (answer.includes('60+')) update.age = 65;
      break;
    }
    case 'gender':
      update.gender = answer;
      break;
    case 'state':
      update.state = answer;
      break;
    case 'occupation':
      update.occupation = answer;
      if (answer === 'Farmer') update.farmer = true;
      if (answer === 'Student') update.student = true;
      if (answer === 'Business' || answer === 'Self Employed') update.business_owner = true;
      break;
    case 'annual_income': {
      if (answer.includes('Below 1')) update.annual_income = 80000;
      else if (answer.includes('1-3')) update.annual_income = 200000;
      else if (answer.includes('3-6')) update.annual_income = 450000;
      else if (answer.includes('6-12')) update.annual_income = 900000;
      else if (answer.includes('Above 12')) update.annual_income = 1500000;
      break;
    }
    case 'caste':
      update.caste = answer;
      break;
    case 'disability':
      update.disability = answer.toLowerCase() === 'yes';
      break;
    case 'education':
      update.education = answer;
      break;
  }
  return update;
}
