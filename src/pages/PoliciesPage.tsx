import { useState, useMemo } from 'react';
import { usePolicies } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { PolicyCard, LoadingSpinner, EmptyState } from '../components/ui';
import { BookOpen, Search } from 'lucide-react';

export function PoliciesPage() {
  const { t } = useTranslation();
  const { policies, loading } = usePolicies();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    policies.forEach((p) => { if (p.category) cats.add(p.category); });
    return Array.from(cats).sort();
  }, [policies]);

  const filtered = useMemo(() => {
    return policies.filter((p) => {
      if (query) {
        const text = (p.title + ' ' + (p.summary || '') + ' ' + (p.content || '') + ' ' + (p.tags || []).join(' ')).toLowerCase();
        if (!text.includes(query.toLowerCase())) return false;
      }
      if (category && p.category !== category) return false;
      return true;
    });
  }, [policies, query, category]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-600/20">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">{t('policyLibrary')}</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Important laws and policies explained in simple language.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('search')} className="input pl-10" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input max-w-48">
          <option value="">{t('allCategories')}</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner label={t('loading')} />
      ) : filtered.length === 0 ? (
        <EmptyState title={t('noResults')} icon={<BookOpen className="w-8 h-8" />} />
      ) : (
        <>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">{filtered.length} {t('resultsFound')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <PolicyCard key={p.id} title={p.title} slug={p.slug} category={p.category} summary={p.summary} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
