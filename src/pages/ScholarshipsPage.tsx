import { useState, useMemo } from 'react';
import { useScholarships, useStates } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter } from '../router/Router';
import { ScholarshipCard, LoadingSpinner, EmptyState } from '../components/ui';
import { Search, SlidersHorizontal, X, Award } from 'lucide-react';

export function ScholarshipsPage() {
  const { t } = useTranslation();
  const { path } = useRouter();
  const { scholarships, loading } = useScholarships();
  const { states } = useStates();

  const urlParams = new URLSearchParams(path.split('?')[1] || '');
  const initialQuery = urlParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [level, setLevel] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    scholarships.forEach((s) => { if (s.category) cats.add(s.category); });
    return Array.from(cats).sort();
  }, [scholarships]);

  const filtered = useMemo(() => {
    return scholarships.filter((s) => {
      if (query) {
        const text = (s.title + ' ' + (s.description || '') + ' ' + (s.tags || []).join(' ')).toLowerCase();
        if (!text.includes(query.toLowerCase())) return false;
      }
      if (level && s.level !== level) return false;
      if (state) {
        if (s.level === 'central' || s.level === 'private') return true;
        if (s.state !== state) return false;
      }
      if (category && s.category !== category) return false;
      return true;
    });
  }, [scholarships, query, level, state, category]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white mb-1">{t('scholarships')}</h1>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Central, State, and Private scholarships with advanced filters.</p>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('search')} className="input pl-10" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`btn-secondary ${showFilters ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700' : ''}`}>
          <SlidersHorizontal className="w-4 h-4" /> {t('filters')}
        </button>
      </div>

      {showFilters && (
        <div className="glass-card p-4 mb-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('level')}</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="input">
                <option value="">{t('allLevels')}</option>
                <option value="central">Central</option>
                <option value="state">State</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('state')}</label>
              <select value={state} onChange={(e) => setState(e.target.value)} className="input">
                <option value="">{t('allStates')}</option>
                {states.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('category')}</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                <option value="">{t('allCategories')}</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button onClick={() => { setLevel(''); setState(''); setCategory(''); setQuery(''); }} className="btn-ghost text-sm">
              <X className="w-4 h-4" /> {t('clearFilters')}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner label={t('loading')} />
      ) : filtered.length === 0 ? (
        <EmptyState title={t('noResults')} description="Try adjusting your filters." icon={<Award className="w-8 h-8" />} />
      ) : (
        <>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">{filtered.length} {t('resultsFound')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <ScholarshipCard
                key={s.id}
                title={s.title}
                slug={s.slug}
                provider={s.provider}
                level={s.level}
                state={s.state}
                amount={s.amount}
                deadline={s.deadline}
                category={s.category}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
