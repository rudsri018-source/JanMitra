import { useState, useMemo, useEffect } from 'react';
import { useSchemes, useScholarships, useServices, usePolicies, useStates, useMinistries, useCategories } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter } from '../router/Router';
import { SchemeCard, ScholarshipCard, ServiceCard, PolicyCard, EmptyState } from '../components/ui';
import { normalizeText, expandQuery, scoreRecord } from '../lib/search';
import { Search as SearchIcon, ListChecks, Award, FileText, BookOpen, SlidersHorizontal, X } from 'lucide-react';

export function SearchPage() {
  const { t } = useTranslation();
  const { path } = useRouter();
  const { schemes } = useSchemes();
  const { scholarships } = useScholarships();
  const { services } = useServices();
  const { policies } = usePolicies();
  const { states } = useStates();
  const { ministries } = useMinistries();
  const { categories } = useCategories();

  const urlParams = new URLSearchParams(path.split('?')[1] || '');
  const [query, setQuery] = useState(urlParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(urlParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<'all' | 'schemes' | 'scholarships' | 'services' | 'policies'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    state: '',
    ministry: '',
    category: '',
    gender: '',
    income: '',
    education: '',
    occupation: '',
    disability: '',
    caste: '',
    age: '',
    status: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const queryNorm = normalizeText(debouncedQuery);
  const queryTerms = queryNorm.split(' ').filter((t) => t.length >= 2);
  const expandedTerms = expandQuery(debouncedQuery).filter((e) => !queryTerms.includes(e) && normalizeText(e) !== queryNorm);

  const parseIncome = (val: string): number | null => {
    if (!val) return null;
    if (val.includes('Below 1')) return 100000;
    if (val.includes('1-3')) return 300000;
    if (val.includes('3-6')) return 600000;
    if (val.includes('6-12')) return 1200000;
    if (val.includes('Above 12')) return 1500000;
    return null;
  };

  const parseAge = (val: string): [number, number] | null => {
    if (!val) return null;
    if (val === '18-25') return [18, 25];
    if (val === '26-35') return [26, 35];
    if (val === '36-45') return [36, 45];
    if (val === '46-60') return [46, 60];
    if (val === '60+') return [60, 120];
    return null;
  };

  const matchesFilters = (item: {
    state?: string | null;
    level?: string;
    ministry_id?: string | null;
    category_id?: number | null;
    category?: string | null;
    gender_restriction?: string | null;
    income_limit?: string | null;
    age_limit?: string | null;
    education_requirement?: string | null;
    disability_criteria?: string | null;
    category_requirement?: string | null;
    tags?: string[];
    open_date?: string | null;
    close_date?: string | null;
    status?: string;
  }) => {
    if (filters.state) {
      if (item.level === 'central') {
        // central schemes available everywhere
      } else if (item.state !== filters.state) return false;
    }
    if (filters.ministry && item.ministry_id !== filters.ministry) return false;
    if (filters.category) {
      if (item.category_id !== undefined) {
        const cat = categories.find((c) => c.slug === filters.category);
        if (cat && item.category_id !== cat.id) return false;
      } else if (item.category !== filters.category) return false;
    }
    if (filters.gender && item.gender_restriction) {
      if (!['All genders', 'All'].includes(item.gender_restriction)) {
        const restriction = item.gender_restriction.toLowerCase();
        const filterGender = filters.gender.toLowerCase();
        if (restriction.includes('female') && filterGender !== 'female') return false;
        if (restriction.includes('male') && !restriction.includes('female') && filterGender !== 'male') return false;
      }
    }
    if (filters.income && item.income_limit) {
      const incomeVal = parseIncome(filters.income);
      if (incomeVal) {
        const limitMatch = item.income_limit.toLowerCase().match(/rs\.?\s*([\d,.]+)\s*(lakh|lac|crore|k)?/);
        if (limitMatch) {
          let limit = parseFloat(limitMatch[1].replace(/,/g, ''));
          if (limitMatch[2] === 'lakh' || limitMatch[2] === 'lac') limit *= 100000;
          else if (limitMatch[2] === 'crore') limit *= 10000000;
          if (incomeVal > limit) return false;
        }
      }
    }
    if (filters.age && item.age_limit) {
      const ageRange = parseAge(filters.age);
      if (ageRange) {
        const ageMatch = item.age_limit.match(/(\d+)/);
        if (ageMatch) {
          const schemeAge = parseInt(ageMatch[1]);
          if (ageRange[1] < schemeAge) return false;
        }
      }
    }
    if (filters.education && item.education_requirement) {
      if (!item.education_requirement.toLowerCase().includes(filters.education.toLowerCase())) return false;
    }
    if (filters.disability === 'yes' && item.disability_criteria) {
      if (item.disability_criteria.toLowerCase().includes('not required')) return false;
    }
    if (filters.caste && item.category_requirement) {
      if (!['All categories', 'All'].includes(item.category_requirement)) {
        if (!item.category_requirement.toLowerCase().includes(filters.caste.toLowerCase())) return false;
      }
    }
    if (filters.status) {
      const now = new Date();
      let computedStatus = 'open';
      if (item.close_date) {
        const close = new Date(item.close_date);
        if (close < now) computedStatus = 'closed';
        else if (Math.ceil((close.getTime() - now.getTime()) / 86400000) <= 15) computedStatus = 'closing_soon';
      }
      if (item.open_date) {
        const open = new Date(item.open_date);
        if (open > now) computedStatus = 'upcoming';
      }
      if (filters.status === 'open' && computedStatus !== 'open') return false;
      if (filters.status === 'closing_soon' && computedStatus !== 'closing_soon') return false;
      if (filters.status === 'closed' && computedStatus !== 'closed') return false;
      if (filters.status === 'upcoming' && computedStatus !== 'upcoming') return false;
    }
    return true;
  };

  type Scored<T> = T & { _score: number };

  const scoreAndFilter = <T extends Record<string, unknown>>(
    items: T[],
    getFields: (item: T) => string[],
  ): Scored<T>[] => {
    const scored = items
      .map((item) => {
        let score = 0;
        if (queryNorm) {
          score = scoreRecord(queryNorm, queryTerms, expandedTerms, getFields(item), true);
        }
        return { ...item, _score: score } as Scored<T>;
      })
      .filter((item) => (queryNorm ? item._score > 0 : true))
      .filter((item) => matchesFilters(item as unknown as Parameters<typeof matchesFilters>[0]));
    scored.sort((a, b) => b._score - a._score);
    return scored;
  };

  const matchedSchemes = useMemo(
    () => scoreAndFilter(schemes, (s) => [s.title, s.short_description || '', s.description || '', (s.tags || []).join(' ')]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schemes, queryNorm, queryTerms, expandedTerms, filters, categories],
  );

  const matchedScholarships = useMemo(
    () => scoreAndFilter(scholarships, (s) => [s.title, s.description || '', (s.tags || []).join(' ')]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scholarships, queryNorm, queryTerms, expandedTerms, filters],
  );

  const matchedServices = useMemo(
    () => scoreAndFilter(services, (s) => [s.title, s.description || '', s.what_is || '', (s.tags || []).join(' ')]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [services, queryNorm, queryTerms, expandedTerms, filters],
  );

  const matchedPolicies = useMemo(
    () => scoreAndFilter(policies, (s) => [s.title, s.summary || '', s.content || '', (s.tags || []).join(' ')]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [policies, queryNorm, queryTerms, expandedTerms, filters],
  );

  const total = matchedSchemes.length + matchedScholarships.length + matchedServices.length + matchedPolicies.length;
  const activeFilterCount = Object.values(filters).filter((v) => v).length;

  const tabs = [
    { key: 'all' as const, label: `All (${total})`, icon: SearchIcon },
    { key: 'schemes' as const, label: `Schemes (${matchedSchemes.length})`, icon: ListChecks },
    { key: 'scholarships' as const, label: `Scholarships (${matchedScholarships.length})`, icon: Award },
    { key: 'services' as const, label: `Services (${matchedServices.length})`, icon: FileText },
    { key: 'policies' as const, label: `Policies (${matchedPolicies.length})`, icon: BookOpen },
  ];

  const show = (tab: typeof activeTab) => activeTab === 'all' || activeTab === tab;
  const clearFilters = () => setFilters({ state: '', ministry: '', category: '', gender: '', income: '', education: '', occupation: '', disability: '', caste: '', age: '', status: '' });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white mb-1">Search Results</h1>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{total} results{debouncedQuery && ` for "${debouncedQuery}"`}{activeFilterCount > 0 && ` · ${activeFilterCount} filter(s) applied`}</p>
      </div>

      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('search')} className="input pl-10" autoFocus />
        <button onClick={() => setShowFilters(!showFilters)} className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 transition-all ${showFilters ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'text-charcoal-400 hover:text-charcoal-600'}`}>
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {showFilters && (
        <div className="glass-card p-4 mb-4 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">{t('state')}</label>
              <select value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })} className="input text-sm py-2">
                <option value="">{t('allStates')}</option>
                {states.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">Ministry</label>
              <select value={filters.ministry} onChange={(e) => setFilters({ ...filters, ministry: e.target.value })} className="input text-sm py-2">
                <option value="">All Ministries</option>
                {ministries.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">{t('category')}</label>
              <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="input text-sm py-2">
                <option value="">{t('allCategories')}</option>
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">{t('gender')}</label>
              <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })} className="input text-sm py-2">
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">Income</label>
              <select value={filters.income} onChange={(e) => setFilters({ ...filters, income: e.target.value })} className="input text-sm py-2">
                <option value="">Any Income</option>
                <option value="Below 1 Lakh">Below 1 Lakh</option>
                <option value="1-3 Lakh">1-3 Lakh</option>
                <option value="3-6 Lakh">3-6 Lakh</option>
                <option value="6-12 Lakh">6-12 Lakh</option>
                <option value="Above 12 Lakh">Above 12 Lakh</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">{t('age')}</label>
              <select value={filters.age} onChange={(e) => setFilters({ ...filters, age: e.target.value })} className="input text-sm py-2">
                <option value="">Any Age</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46-60">46-60</option>
                <option value="60+">60+</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">{t('caste')}</label>
              <select value={filters.caste} onChange={(e) => setFilters({ ...filters, caste: e.target.value })} className="input text-sm py-2">
                <option value="">All Categories</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
                <option value="General">General</option>
                <option value="EWS">EWS</option>
                <option value="Minority">Minority</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">Status</label>
              <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="input text-sm py-2">
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="closing_soon">Closing Soon</option>
                <option value="closed">Closed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="mt-3 flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
              <X className="w-3 h-3" /> Clear all filters
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.key ? 'bg-emerald-600 text-white' : 'glass text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {total === 0 ? (
        <EmptyState title={t('noResults')} description="Try different keywords, check spelling, or use Hindi terms. E.g. 'आधार', 'kisan', 'scholarship'." icon={<SearchIcon className="w-8 h-8" />} />
      ) : (
        <div className="space-y-8">
          {show('schemes') && matchedSchemes.length > 0 && (
            <section>
              <h2 className="section-title mb-4">Schemes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
                {matchedSchemes.map((s) => <SchemeCard key={s.id} title={s.title} slug={s.slug} description={s.short_description || ''} level={s.level} state={s.state} benefits={s.benefits} trending={s.trending} tags={s.tags} score={queryNorm ? Math.min(99, Math.round(s._score)) : undefined} />)}
              </div>
            </section>
          )}
          {show('scholarships') && matchedScholarships.length > 0 && (
            <section>
              <h2 className="section-title mb-4">Scholarships</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
                {matchedScholarships.map((s) => <ScholarshipCard key={s.id} title={s.title} slug={s.slug} provider={s.provider} level={s.level} state={s.state} amount={s.amount} deadline={s.deadline} category={s.category} />)}
              </div>
            </section>
          )}
          {show('services') && matchedServices.length > 0 && (
            <section>
              <h2 className="section-title mb-4">Citizen Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
                {matchedServices.map((s) => <ServiceCard key={s.id} title={s.title} slug={s.slug} category={s.category} description={s.what_is} />)}
              </div>
            </section>
          )}
          {show('policies') && matchedPolicies.length > 0 && (
            <section>
              <h2 className="section-title mb-4">Policies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
                {matchedPolicies.map((s) => <PolicyCard key={s.id} title={s.title} slug={s.slug} category={s.category} summary={s.summary} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
