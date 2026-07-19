import { useState } from 'react';
import { useSchemes, useStates, useDistricts } from '../hooks/useData';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import { checkEligibility, getSchemeStatus } from '../lib/eligibility';
import type { EligibilityProfile, EligibilityResult } from '../types';
import { ListChecks, CheckCircle2, XCircle, FileText, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { Link } from '../router/Router';
import { LoadingSpinner } from '../components/ui';

export function EligibilityPage() {
  const { t } = useTranslation();
  const { schemes, loading } = useSchemes();
  const { states } = useStates();
  const { profile } = useAuth();

  const [form, setForm] = useState<EligibilityProfile>({
    age: profile?.age ?? null,
    gender: profile?.gender ?? '',
    state: profile?.state ?? '',
    district: profile?.district ?? '',
    occupation: profile?.occupation ?? '',
    annual_income: profile?.annual_income ?? null,
    caste: profile?.caste ?? '',
    religion: profile?.religion ?? '',
    disability: profile?.disability ?? false,
    education: profile?.education ?? '',
    veteran: profile?.veteran ?? false,
    farmer: profile?.farmer ?? false,
    student: profile?.student ?? false,
    business_owner: profile?.business_owner ?? false,
  });

  const [results, setResults] = useState<EligibilityResult[] | null>(null);
  const [checking, setChecking] = useState(false);

  const selectedState = states.find((s) => s.name === form.state);
  const { districts } = useDistricts(selectedState?.id ?? null);

  const handleCheck = () => {
    setChecking(true);
    setTimeout(() => {
      const res = checkEligibility(schemes, form).filter((r) => r.score >= 30);
      setResults(res);
      setChecking(false);
    }, 600);
  };

  const scoreBg = (score: number) =>
    score >= 75 ? 'from-emerald-500 to-emerald-600' : score >= 50 ? 'from-gold-400 to-gold-500' : 'from-charcoal-400 to-charcoal-500';

  const statusBadge = (status: string) => {
    const config: Record<string, { label: string; class: string }> = {
      open: { label: 'Open', class: 'badge-emerald' },
      closing_soon: { label: 'Closing Soon', class: 'badge-gold' },
      closed: { label: 'Closed', class: 'badge-charcoal' },
      upcoming: { label: 'Upcoming', class: 'badge-charcoal' },
    };
    const c = config[status] || config.open;
    return <span className={`badge ${c.class}`}>{c.label}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
          <ListChecks className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">{t('eligibilityChecker')}</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Enter your details and instantly see eligible schemes with match scores and exact reasons.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="glass-card p-6 space-y-4 sticky top-24">
            <h2 className="font-display font-bold text-lg text-charcoal-900 dark:text-white">Your Profile</h2>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('age')}</label>
              <input type="number" value={form.age ?? ''} onChange={(e) => setForm({ ...form, age: e.target.value ? parseInt(e.target.value) : null })} placeholder="e.g. 25" className="input" />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('gender')}</label>
              <select value={form.gender ?? ''} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input">
                <option value="">{t('selectGender')}</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('state')}</label>
              <select value={form.state ?? ''} onChange={(e) => setForm({ ...form, state: e.target.value, district: '' })} className="input">
                <option value="">{t('selectState')}</option>
                {states.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('district')}</label>
              <select value={form.district ?? ''} onChange={(e) => setForm({ ...form, district: e.target.value })} className="input">
                <option value="">{t('selectDistrict2')}</option>
                {districts.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('occupation')}</label>
              <select value={form.occupation ?? ''} onChange={(e) => {
                const occ = e.target.value;
                setForm({ ...form, occupation: occ, farmer: occ === 'Farmer', student: occ === 'Student', business_owner: occ === 'Business' || occ === 'Self Employed' });
              }} className="input">
                <option value="">{t('selectOccupation')}</option>
                <option value="Student">Student</option>
                <option value="Farmer">Farmer</option>
                <option value="Business">Business</option>
                <option value="Employed">Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Self Employed">Self Employed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('income')} (Rs)</label>
              <input type="number" value={form.annual_income ?? ''} onChange={(e) => setForm({ ...form, annual_income: e.target.value ? parseInt(e.target.value) : null })} placeholder="e.g. 300000" className="input" />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('caste')}</label>
              <select value={form.caste ?? ''} onChange={(e) => setForm({ ...form, caste: e.target.value })} className="input">
                <option value="">{t('selectCaste')}</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
                <option value="General">General</option>
                <option value="EWS">EWS</option>
                <option value="Minority">Minority</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('education')}</label>
              <select value={form.education ?? ''} onChange={(e) => setForm({ ...form, education: e.target.value })} className="input">
                <option value="">{t('selectEducation')}</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Higher Secondary">Higher Secondary</option>
                <option value="Graduate">Graduate</option>
                <option value="Post Graduate">Post Graduate</option>
                <option value="Not Studying">Not Studying</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('disability')}</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setForm({ ...form, disability: true })} className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${form.disability ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 border border-charcoal-200 dark:border-charcoal-700'}`}>Yes</button>
                <button type="button" onClick={() => setForm({ ...form, disability: false })} className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${!form.disability ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 border border-charcoal-200 dark:border-charcoal-700'}`}>No</button>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-charcoal-200/50 dark:border-charcoal-800/50">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.veteran} onChange={(e) => setForm({ ...form, veteran: e.target.checked })} className="w-4 h-4 rounded text-emerald-600" />
                <span className="text-charcoal-700 dark:text-charcoal-300">Ex-Servicemen / Veteran</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.farmer} onChange={(e) => setForm({ ...form, farmer: e.target.checked })} className="w-4 h-4 rounded text-emerald-600" />
                <span className="text-charcoal-700 dark:text-charcoal-300">Farmer</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.student} onChange={(e) => setForm({ ...form, student: e.target.checked })} className="w-4 h-4 rounded text-emerald-600" />
                <span className="text-charcoal-700 dark:text-charcoal-300">Student</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.business_owner} onChange={(e) => setForm({ ...form, business_owner: e.target.checked })} className="w-4 h-4 rounded text-emerald-600" />
                <span className="text-charcoal-700 dark:text-charcoal-300">Business Owner</span>
              </label>
            </div>

            <button onClick={handleCheck} disabled={checking || loading} className="btn-primary w-full">
              {checking ? t('loading') : t('getRecommendations')}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {checking || loading ? (
            <LoadingSpinner label="Checking eligibility..." />
          ) : results === null ? (
            <div className="glass-card p-12 text-center">
              <ListChecks className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg text-charcoal-900 dark:text-white mb-2">{t('eligibleSchemes')}</h3>
              <p className="text-sm text-charcoal-500 dark:text-charcoal-400 max-w-md mx-auto">
                Fill in your details on the left and click "{t('getRecommendations')}" to see all central and state schemes you're eligible for, with match scores and exact reasons.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <XCircle className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg text-charcoal-900 dark:text-white mb-2">No matches found</h3>
              <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Try adjusting your profile details for better matches.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="section-title">{results.length} {t('eligibleSchemes')}</h2>
                <span className="text-xs text-charcoal-500">{results.filter((r) => r.eligible).length} fully eligible</span>
              </div>
              {results.map((r) => {
                const status = getSchemeStatus(r.scheme);
                return (
                  <div key={r.scheme.id} className={`glass-card p-5 ${r.eligible ? 'ring-2 ring-emerald-500/30' : ''}`}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <Link to={`/schemes/${r.scheme.slug}`} className="flex-1">
                        <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2">
                          {r.scheme.title}
                        </h3>
                      </Link>
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${scoreBg(r.score)} flex items-center justify-center shadow-lg`}>
                          <span className="text-white font-display font-extrabold text-lg">{r.score}</span>
                        </div>
                        <span className="text-xs text-charcoal-500 mt-1">{t('eligibilityScore')}</span>
                      </div>
                    </div>

                    <p className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-3 line-clamp-2">{r.scheme.short_description}</p>

                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className={r.scheme.level === 'central' ? 'badge-emerald' : 'badge-gold'}>
                        {r.scheme.level === 'central' ? 'Central' : r.scheme.state || 'State'}
                      </span>
                      {statusBadge(status)}
                      {r.eligible && <span className="badge badge-emerald">Eligible</span>}
                      <span className="badge-charcoal">{r.matchedCriteria}/{r.totalCriteria} matched</span>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <p className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">{t('reasons')}:</p>
                      {r.reasons.map((reason, i) => {
                        const isBlocking = r.blockingReasons.includes(reason);
                        return (
                          <div key={i} className="flex items-start gap-2 text-xs text-charcoal-600 dark:text-charcoal-400">
                            {isBlocking ? (
                              <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            )}
                            <span>{reason}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-3 border-t border-charcoal-200/50 dark:border-charcoal-800/50">
                      <Link to={`/schemes/${r.scheme.slug}`} className="btn-primary text-xs px-3 py-1.5">
                        {t('viewDetails')} <ArrowRight className="w-3 h-3" />
                      </Link>
                      <Link to={`/documents?scheme=${r.scheme.id}`} className="btn-secondary text-xs px-3 py-1.5">
                        <FileText className="w-3 h-3" /> {t('documentChecklist')}
                      </Link>
                      <Link to={`/forms?scheme=${r.scheme.id}`} className="btn-ghost text-xs px-3 py-1.5">
                        {t('formSteps')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
