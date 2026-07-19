// Search utilities: normalization, fuzzy matching, typo tolerance, Hindi/Hinglish support

// Normalize text: lowercase, remove diacritics, keep Devanagari, collapse whitespace
export function normalizeText(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u0900-\u097f\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Levenshtein distance for typo tolerance
export function levenshtein(a: string, b: string): number {
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
      dp[j] = Math.min(
        dp[j] + 1,
        dp[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      prev = tmp;
    }
  }
  return dp[n];
}

// Common Hindi/Hinglish transliteration mappings for search
const HINGLISH_MAP: Record<string, string[]> = {
  'aadhaar': ['adhar', 'aadhar', 'adhaar', 'adhar', 'आधार'],
  'pan': ['पैन'],
  'scholarship': ['छात्रवृत्ति', 'chhatravritti'],
  'scheme': ['yojna', 'yojana', 'योजना'],
  'pension': ['पेंशन', 'pensan'],
  'farmer': ['kisan', 'किसान', 'kishan'],
  'education': ['शिक्षा', 'shiksha'],
  'health': ['स्वास्थ्य', 'swasthya'],
  'women': ['mahila', 'महिला', 'girl', 'बालिका'],
  'housing': ['awas', 'आवास', 'ghar', 'मकान'],
  'certificate': ['praman', 'प्रमाण', 'pramaan'],
  'income': ['आय', 'aay'],
  'caste': ['जाति', 'jati'],
  'domicile': ['निवास', 'nivas'],
  'driving': ['chal', 'चालन'],
  'voter': ['matdata', 'मतदाता'],
  'passport': ['पासपोर्ट'],
  'ration': ['राशन', 'rashan'],
  'police': ['पुलिस', 'pulis'],
  'complaint': ['shikayat', 'शिकायत'],
  'senior': ['vridh', 'वृद्ध', 'buzurg', 'elderly'],
  'disability': ['divyang', 'दिव्यांग', 'viklang'],
  'military': ['army', 'senaa', 'सेना', 'defence', 'defense'],
  'business': ['vyapar', 'व्यापार', 'udyam', 'उद्यम'],
  'agriculture': ['krishi', 'कृषि', 'agriculture'],
  'student': ['chhatr', 'छात्र', 'vidyarthi'],
  'widow': ['vidhwa', 'विधवा'],
  'insurance': ['बीमा', 'bima'],
  'loan': ['karja', 'कर्ज़', 'ऋण'],
  'subsidy': ['subsidy', 'रियायत'],
};

// Expand query with Hinglish/Hindi synonyms
export function expandQuery(query: string): string[] {
  const lower = query.toLowerCase();
  const expansions = new Set<string>([lower]);
  for (const [eng, hindi] of Object.entries(HINGLISH_MAP)) {
    if (lower.includes(eng)) {
      for (const h of hindi) expansions.add(h);
    }
    for (const h of hindi) {
      if (lower.includes(h)) {
        expansions.add(eng);
        for (const h2 of hindi) expansions.add(h2);
      }
    }
  }
  return Array.from(expansions);
}

// Score a record against query with semantic + fuzzy matching
export function scoreRecord(
  queryNorm: string,
  queryTerms: string[],
  expandedTerms: string[],
  fields: string[],
  isTitle = false,
): number {
  let score = 0;
  const allTerms = [...queryTerms, ...expandedTerms];

  for (let i = 0; i < fields.length; i++) {
    const fieldNorm = normalizeText(fields[i]);
    if (!fieldNorm) continue;
    const weight = i === 0 ? 3 : 1; // title gets 3x weight

    // Exact phrase match
    if (fieldNorm.includes(queryNorm)) score += 15 * weight;

    for (const term of allTerms) {
      if (term.length < 2) continue;
      if (fieldNorm.includes(term)) {
        score += 3 * weight;
        continue;
      }
      // Fuzzy match for terms >= 4 chars
      if (term.length >= 4) {
        const words = fieldNorm.split(' ');
        for (const w of words) {
          if (w.length < 3) continue;
          const dist = levenshtein(term, w);
          const threshold = Math.max(1, Math.floor(term.length / 4));
          if (dist <= threshold) {
            score += 1.5 * weight;
            break;
          }
        }
      }
    }
  }

  if (isTitle && normalizeText(fields[0]).includes(queryNorm)) score += 20;
  return score;
}

// Debounce utility
export function debounce<T extends (...args: never[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Simple in-memory cache for search results
export class SearchCache {
  private cache = new Map<string, { results: unknown[]; timestamp: number }>();
  private ttl: number;

  constructor(ttlMs = 60000) {
    this.ttl = ttlMs;
  }

  get(key: string): unknown[] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.results;
  }

  set(key: string, results: unknown[]): void {
    this.cache.set(key, { results, timestamp: Date.now() });
    // Limit cache size
    if (this.cache.size > 100) {
      const oldest = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      if (oldest) this.cache.delete(oldest[0]);
    }
  }

  clear(): void {
    this.cache.clear();
  }
}
