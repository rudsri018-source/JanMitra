import type { Scheme, EligibilityProfile, EligibilityResult, EligibilityRule } from '../types';

export function computeEligibility(scheme: Scheme, profile: EligibilityProfile): EligibilityResult {
  const reasons: string[] = [];
  const blockingReasons: string[] = [];
  let matched = 0;
  let total = 0;
  let mandatoryFailed = 0;
  let mandatoryTotal = 0;

  const rules = Array.isArray(scheme.eligibility_rules) ? scheme.eligibility_rules : [];

  // State matching — mandatory for state-level schemes
  if (scheme.level === 'state' && scheme.state) {
    mandatoryTotal++;
    total++;
    if (profile.state && scheme.state.toLowerCase() === profile.state.toLowerCase()) {
      matched++;
      reasons.push(`This is a ${scheme.state} state scheme and you are from ${profile.state}.`);
    } else if (profile.state) {
      blockingReasons.push(`This scheme is only for ${scheme.state} residents, but you are from ${profile.state}.`);
      reasons.push(`This scheme is only for ${scheme.state} residents, but you are from ${profile.state}.`);
      mandatoryFailed++;
    } else {
      reasons.push(`This is a ${scheme.state} state scheme. Select your state to check eligibility.`);
      mandatoryFailed++;
    }
  } else if (scheme.level === 'central') {
    matched++;
    total++;
    reasons.push('This is a central scheme available across all states.');
  }

  // If no structured rules, fall back to text-based matching
  if (rules.length === 0) {
    return fallbackEligibility(scheme, profile, reasons, matched, total, blockingReasons);
  }

  // Evaluate each structured rule
  for (const rule of rules) {
    const result = evaluateRule(rule, profile);
    total++;
    const isMandatory = result.blocking;
    if (isMandatory) mandatoryTotal++;

    if (result.passed) {
      matched++;
      reasons.push(rule.reason);
    } else {
      if (isMandatory) {
        blockingReasons.push(rule.reason);
        mandatoryFailed++;
      }
      reasons.push(`${rule.reason} (Not met: ${result.detail})`);
    }
  }

  // Score calculation: mandatory failures drastically reduce score
  // Score = (matched/total) * 100, but if any mandatory rule fails, cap at 40
  const baseScore = total > 0 ? Math.round((matched / total) * 100) : 50;
  let score = baseScore;
  if (mandatoryFailed > 0) {
    // Each mandatory failure reduces score significantly
    score = Math.min(40, Math.round(baseScore * (1 - mandatoryFailed * 0.3)));
    if (score < 0) score = 0;
  }

  // Never show 100 unless every mandatory condition is satisfied AND all rules pass
  if (mandatoryFailed > 0) {
    score = Math.min(score, 35);
  } else if (matched < total) {
    // Some non-mandatory rules not met — cap at 85
    score = Math.min(score, 85);
  }

  const eligible = blockingReasons.length === 0 && mandatoryFailed === 0 && score >= 60;

  return {
    scheme,
    score,
    reasons,
    matchedCriteria: matched,
    totalCriteria: total,
    eligible,
    blockingReasons,
  };
}

function evaluateRule(
  rule: EligibilityRule,
  profile: EligibilityProfile,
): { passed: boolean; blocking: boolean; detail: string } {
  const value = (profile as unknown as Record<string, unknown>)[rule.field];

  switch (rule.op) {
    case 'exists': {
      const has = value !== undefined && value !== null && value !== '';
      return { passed: has, blocking: false, detail: `${rule.field} not provided` };
    }
    case '>=': {
      if (value === null || value === undefined || value === '') return { passed: false, blocking: false, detail: `${rule.field} not provided` };
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      const target = typeof rule.value === 'number' ? rule.value : parseFloat(String(rule.value));
      if (isNaN(num)) return { passed: false, blocking: true, detail: `invalid ${rule.field}` };
      return { passed: num >= target, blocking: true, detail: `${rule.field} is ${num}, needs >= ${target}` };
    }
    case '<=': {
      if (value === null || value === undefined || value === '') return { passed: false, blocking: false, detail: `${rule.field} not provided` };
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      const target = typeof rule.value === 'number' ? rule.value : parseFloat(String(rule.value));
      if (isNaN(num)) return { passed: false, blocking: false, detail: `invalid ${rule.field}` };
      return { passed: num <= target, blocking: true, detail: `${rule.field} is ${num}, needs <= ${target}` };
    }
    case '>': {
      if (value === null || value === undefined || value === '') return { passed: false, blocking: false, detail: `${rule.field} not provided` };
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      const target = typeof rule.value === 'number' ? rule.value : parseFloat(String(rule.value));
      return { passed: num > target, blocking: true, detail: `${rule.field} is ${num}, needs > ${target}` };
    }
    case '<': {
      if (value === null || value === undefined || value === '') return { passed: false, blocking: false, detail: `${rule.field} not provided` };
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      const target = typeof rule.value === 'number' ? rule.value : parseFloat(String(rule.value));
      return { passed: num < target, blocking: true, detail: `${rule.field} is ${num}, needs < ${target}` };
    }
    case '==': {
      if (value === null || value === undefined || value === '') return { passed: false, blocking: false, detail: `${rule.field} not provided` };
      const target = rule.value;
      if (typeof target === 'boolean') {
        const boolVal = value === true || value === 'true' || value === 'True' || value === 'yes' || value === 'Yes';
        return { passed: boolVal === target, blocking: true, detail: `${rule.field} is ${boolVal}, needs ${target}` };
      }
      return { passed: String(value).toLowerCase() === String(target).toLowerCase(), blocking: true, detail: `${rule.field} is ${value}, needs ${target}` };
    }
    case '!=': {
      if (value === null || value === undefined || value === '') return { passed: true, blocking: false, detail: `${rule.field} not provided (passes !=)` };
      const target = rule.value;
      return { passed: String(value).toLowerCase() !== String(target).toLowerCase(), blocking: false, detail: `${rule.field} is ${value}` };
    }
    case 'in': {
      if (value === null || value === undefined || value === '') return { passed: false, blocking: false, detail: `${rule.field} not provided` };
      const arr = Array.isArray(rule.value) ? rule.value.map((v) => String(v).toLowerCase()) : [String(rule.value).toLowerCase()];
      return { passed: arr.includes(String(value).toLowerCase()), blocking: true, detail: `${rule.field} is ${value}, needs one of ${arr.join(', ')}` };
    }
    case 'not_in': {
      if (value === null || value === undefined || value === '') return { passed: true, blocking: false, detail: `${rule.field} not provided (passes not_in)` };
      const arr = Array.isArray(rule.value) ? rule.value.map((v) => String(v).toLowerCase()) : [String(rule.value).toLowerCase()];
      return { passed: !arr.includes(String(value).toLowerCase()), blocking: false, detail: `${rule.field} is ${value}` };
    }
    case 'between': {
      if (value === null || value === undefined || value === '') return { passed: false, blocking: false, detail: `${rule.field} not provided` };
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      if (!Array.isArray(rule.value) || rule.value.length !== 2) return { passed: false, blocking: true, detail: 'invalid rule' };
      const min = Number(rule.value[0]);
      const max = Number(rule.value[1]);
      return { passed: num >= min && num <= max, blocking: true, detail: `${rule.field} is ${num}, needs ${min}-${max}` };
    }
    default:
      return { passed: false, blocking: false, detail: `unknown operator ${rule.op}` };
  }
}

function fallbackEligibility(
  scheme: Scheme,
  profile: EligibilityProfile,
  reasons: string[],
  matched: number,
  total: number,
  blockingReasons: string[],
): EligibilityResult {
  const tags = (scheme.tags || []).map((t) => t.toLowerCase());
  let mandatoryFailed = 0;
  let mandatoryTotal = 0;

  // Income
  if (scheme.income_limit) {
    const limit = parseIncomeLimit(scheme.income_limit);
    if (limit !== null && profile.annual_income !== null) {
      total++;
      mandatoryTotal++;
      if (profile.annual_income <= limit) {
        matched++;
        reasons.push(`Your income (Rs ${profile.annual_income.toLocaleString()}) is within the limit.`);
      } else {
        blockingReasons.push(`Your income exceeds the limit of Rs ${limit.toLocaleString()}.`);
        reasons.push(`Your income (Rs ${profile.annual_income.toLocaleString()}) exceeds the limit of Rs ${limit.toLocaleString()}.`);
        mandatoryFailed++;
      }
    }
  }

  // Age
  if (scheme.age_limit) {
    const ageNum = parseAgeLimit(scheme.age_limit);
    if (ageNum !== null && profile.age !== null) {
      total++;
      mandatoryTotal++;
      if (scheme.age_limit.includes('+') && profile.age >= ageNum) {
        matched++;
        reasons.push(`You are ${profile.age}, meeting the ${ageNum}+ requirement.`);
      } else if (profile.age >= ageNum) {
        matched++;
        reasons.push(`You are ${profile.age}, meeting the age requirement.`);
      } else {
        blockingReasons.push(`You are ${profile.age}, but the scheme requires ${scheme.age_limit}.`);
        reasons.push(`You are ${profile.age}, but the scheme requires ${scheme.age_limit}.`);
        mandatoryFailed++;
      }
    }
  }

  // Gender
  if (scheme.gender_restriction && scheme.gender_restriction !== 'All genders') {
    total++;
    mandatoryTotal++;
    if (profile.gender) {
      const restriction = scheme.gender_restriction.toLowerCase();
      const userGender = profile.gender.toLowerCase();
      if (restriction.includes('female') && (userGender === 'female' || userGender === 'women')) {
        matched++;
        reasons.push('This scheme is for women and you qualify.');
      } else if (restriction.includes('male') && userGender === 'male') {
        matched++;
        reasons.push('This scheme is for men and you qualify.');
      } else {
        blockingReasons.push(`This scheme is for ${scheme.gender_restriction}.`);
        reasons.push(`This scheme is for ${scheme.gender_restriction}, but you are ${profile.gender}.`);
        mandatoryFailed++;
      }
    }
  }

  // Category/caste
  if (scheme.category_requirement && !['All categories', 'All'].includes(scheme.category_requirement)) {
    total++;
    mandatoryTotal++;
    if (profile.caste) {
      const req = scheme.category_requirement.toLowerCase();
      const user = profile.caste.toLowerCase();
      if (req.includes(user) || user.includes(req)) {
        matched++;
        reasons.push(`Your category (${profile.caste}) matches the requirement.`);
      } else {
        blockingReasons.push(`This scheme requires ${scheme.category_requirement} category.`);
        reasons.push(`This scheme requires ${scheme.category_requirement}, but you are ${profile.caste}.`);
        mandatoryFailed++;
      }
    }
  }

  // Tags-based fallback — these are MANDATORY checks
  if (tags.some((t) => ['farmer', 'agriculture', 'kisan'].includes(t))) {
    total++;
    mandatoryTotal++;
    if (profile.farmer || (profile.occupation && profile.occupation.toLowerCase() === 'farmer')) {
      matched++;
      reasons.push('This scheme is for farmers and you are a farmer.');
    } else {
      blockingReasons.push('This scheme is for farmers only.');
      reasons.push('This scheme is for farmers only.');
      mandatoryFailed++;
    }
  }

  if (tags.some((t) => ['disability', 'divyang'].includes(t))) {
    total++;
    mandatoryTotal++;
    if (profile.disability) {
      matched++;
      reasons.push('This scheme is for persons with disabilities and you qualify.');
    } else {
      blockingReasons.push('This scheme is for persons with disabilities only.');
      reasons.push('This scheme is specifically for persons with disabilities.');
      mandatoryFailed++;
    }
  }

  if (tags.some((t) => ['veteran', 'ex-servicemen', 'military', 'defence', 'army'].includes(t))) {
    total++;
    mandatoryTotal++;
    if (profile.veteran) {
      matched++;
      reasons.push('This scheme is for ex-servicemen and you qualify.');
    } else {
      blockingReasons.push('This scheme is for ex-servicemen/military personnel only.');
      reasons.push('This scheme is for ex-servicemen/military personnel only.');
      mandatoryFailed++;
    }
  }

  if (tags.some((t) => ['capf', 'crpf', 'bsf', 'itbp', 'cisf', 'nsg', 'assam rifles'].includes(t))) {
    total++;
    mandatoryTotal++;
    // CAPF is not veteran — it's paramilitary under MHA. Check occupation or veteran flag as proxy.
    if (profile.veteran || (profile.occupation && ['capf', 'police', 'military'].includes(profile.occupation.toLowerCase()))) {
      matched++;
      reasons.push('This scheme is for CAPF/paramilitary personnel and you qualify.');
    } else {
      blockingReasons.push('This scheme is for CAPF/paramilitary personnel only.');
      reasons.push('This scheme is for CAPF/paramilitary personnel only.');
      mandatoryFailed++;
    }
  }

  if (tags.some((t) => ['police', 'capf welfare'].includes(t))) {
    total++;
    mandatoryTotal++;
    if (profile.veteran || (profile.occupation && ['police', 'capf'].includes(profile.occupation.toLowerCase()))) {
      matched++;
      reasons.push('This scheme is for police/CAPF personnel and you qualify.');
    } else {
      blockingReasons.push('This scheme is for police/CAPF personnel only.');
      reasons.push('This scheme is for police/CAPF personnel only.');
      mandatoryFailed++;
    }
  }

  // Student — non-mandatory (preference)
  if (tags.some((t) => ['student', 'scholarship', 'education'].includes(t))) {
    total++;
    if (profile.student || (profile.occupation && profile.occupation.toLowerCase() === 'student')) {
      matched++;
      reasons.push('This scheme is for students and you are a student.');
    }
  }

  // Business — non-mandatory
  if (tags.some((t) => ['business', 'msme', 'startup', 'entrepreneur'].includes(t))) {
    total++;
    if (profile.business_owner || (profile.occupation && ['business', 'self employed'].includes(profile.occupation.toLowerCase()))) {
      matched++;
      reasons.push('This scheme supports businesses and you are a business owner.');
    }
  }

  // Senior citizen
  if (tags.some((t) => ['senior', 'elderly', 'old age'].includes(t))) {
    total++;
    mandatoryTotal++;
    if (profile.age !== null && profile.age >= 60) {
      matched++;
      reasons.push('This scheme is for senior citizens and you qualify.');
    } else {
      blockingReasons.push('This scheme is for senior citizens (60+) only.');
      reasons.push('This scheme is for senior citizens (60+) only.');
      mandatoryFailed++;
    }
  }

  // Widow
  if (tags.some((t) => ['widow'].includes(t))) {
    total++;
    mandatoryTotal++;
    // We don't have a widow field; check gender + occupation as proxy is unreliable
    // Mark as mandatory but pass if no info
    if (profile.gender && profile.gender.toLowerCase() === 'female') {
      matched++;
      reasons.push('This scheme is for widows. Eligibility subject to verification.');
    } else {
      blockingReasons.push('This scheme is for widows only.');
      reasons.push('This scheme is for widows only.');
      mandatoryFailed++;
    }
  }

  // Score calculation with mandatory enforcement
  const baseScore = total > 0 ? Math.round((matched / total) * 100) : 50;
  let score = baseScore;
  if (mandatoryFailed > 0) {
    score = Math.min(35, Math.round(baseScore * (1 - mandatoryFailed * 0.3)));
    if (score < 0) score = 0;
  } else if (matched < total) {
    score = Math.min(score, 85);
  }

  const eligible = blockingReasons.length === 0 && mandatoryFailed === 0 && score >= 60;

  return { scheme, score, reasons, matchedCriteria: matched, totalCriteria: total, eligible, blockingReasons };
}

function parseIncomeLimit(limit: string): number | null {
  const lower = limit.toLowerCase();
  const match = lower.match(/rs\.?\s*([\d,.]+)\s*(lakh|lac|crore|k)?/);
  if (!match) return null;
  let value = parseFloat(match[1].replace(/,/g, ''));
  const unit = match[2];
  if (unit === 'lakh' || unit === 'lac') value *= 100000;
  else if (unit === 'crore') value *= 10000000;
  else if (unit === 'k') value *= 1000;
  return value;
}

function parseAgeLimit(limit: string): number | null {
  const match = limit.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

export function checkEligibility(schemes: Scheme[], profile: EligibilityProfile): EligibilityResult[] {
  return schemes
    .map((s) => computeEligibility(s, profile))
    .sort((a, b) => b.score - a.score);
}

export function getRecommendedSchemes(schemes: Scheme[], profile: EligibilityProfile | null): Scheme[] {
  if (!profile) return schemes.filter((s) => s.trending).slice(0, 6);
  const results = checkEligibility(schemes, profile);
  // Only return eligible schemes (mandatory rules passed)
  return results.filter((r) => r.eligible).slice(0, 6).map((r) => r.scheme);
}

export function getSchemeStatus(scheme: Scheme): 'open' | 'closing_soon' | 'closed' | 'upcoming' {
  const now = new Date();
  if (scheme.close_date) {
    const close = new Date(scheme.close_date);
    const daysUntilClose = Math.ceil((close.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilClose < 0) return 'closed';
    if (daysUntilClose <= 15) return 'closing_soon';
  }
  if (scheme.open_date) {
    const open = new Date(scheme.open_date);
    if (open.getTime() > now.getTime()) return 'upcoming';
  }
  return 'open';
}
