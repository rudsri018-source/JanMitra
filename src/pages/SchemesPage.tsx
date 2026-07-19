import { useState, useMemo } from 'react';
import { useSchemes, useCategories, useStates } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter } from '../router/Router';
import { SchemeCard, LoadingSpinner, EmptyState } from '../components/ui';
import { Search, SlidersHorizontal, X, Search as SearchIcon } from 'lucide-react';

export function SchemesPage() {
  const { t } = useTranslation();
  const { path } = useRouter();
  const { schemes, loading } = useSchemes();
  const { categories } = useCategories();
  const { states } = useStates();

  const urlParams = new URLSearchParams(path.split('?')[1] || '');
  const initialCategory = urlParams.get('category') || '';
  const initialQuery = urlParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [level, setLevel] = useState('');
  const [state, setState] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return schemes.filter((s) => {
      if (query) {
        const text = (s.title + ' ' + (s.description || '') + ' ' + (s.tags || []).join(' ')).toLowerCase();
        if (!text.includes(query.toLowerCase())) return false;
      }
      if (category) {
        const cat = categories.find((c) => c.slug === category);
        if (cat && s.category_id !== cat.id) return false;
      }
      if (level && s.level !== level) return false;
      if (state) {
        if (s.level === 'central') return true;
        if (s.state !== state) return false;
      }
      return true;
    });
  }, [schemes, query, category, level, state, categories]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white mb-1">{t('schemes')}</h1>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Browse all government welfare schemes across categories.</p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search')}
            className="input pl-10"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary ${showFilters ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700' : ''}`}
        >
          <SlidersHorizontal className="w-4 h-4" /> {t('filters')}
        </button>
      </div>

      {showFilters && (
        <div className="glass-card p-4 mb-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('category')}</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                <option value="">{t('allCategories')}</option>
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('level')}</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="input">
                <option value="">{t('allLevels')}</option>
                <option value="central">Central</option>
                <option value="state">State</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('state')}</label>
              <select value={state} onChange={(e) => setState(e.target.value)} className="input">
                <option value="">{t('allStates')}</option>
                {states.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button onClick={() => { setCategory(''); setLevel(''); setState(''); setQuery(''); }} className="btn-ghost text-sm">
              <X className="w-4 h-4" /> {t('clearFilters')}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner label={t('loading')} />
      ) : filtered.length === 0 ? (
        <EmptyState title={t('noResults')} description="Try adjusting your filters or search query." icon={<SearchIcon className="w-8 h-8" />} />
      ) : (
        <>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">{filtered.length} {t('resultsFound')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                title={scheme.title}
                slug={scheme.slug}
                description={scheme.short_description || ''}
                level={scheme.level}
                state={scheme.state}
                benefits={scheme.benefits}
                trending={scheme.trending}
                tags={scheme.tags}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
