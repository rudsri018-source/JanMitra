import { useState, useMemo } from 'react';
import { useServices } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter } from '../router/Router';
import { ServiceCard, LoadingSpinner, EmptyState } from '../components/ui';
import { Search, FileText } from 'lucide-react';

export function ServicesPage() {
  const { t } = useTranslation();
  const { path } = useRouter();
  const { services, loading } = useServices();

  const urlParams = new URLSearchParams(path.split('?')[1] || '');
  const initialQuery = urlParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    services.forEach((s) => { if (s.category) cats.add(s.category); });
    return Array.from(cats).sort();
  }, [services]);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      if (query) {
        const text = (s.title + ' ' + (s.description || '') + ' ' + (s.tags || []).join(' ')).toLowerCase();
        if (!text.includes(query.toLowerCase())) return false;
      }
      if (category && s.category !== category) return false;
      return true;
    });
  }, [services, query, category]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white mb-1">{t('citizenServices')}</h1>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Aadhaar, PAN, Passport, Driving Licence, certificates and more.</p>
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
        <EmptyState title={t('noResults')} icon={<FileText className="w-8 h-8" />} />
      ) : (
        <>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">{filtered.length} {t('resultsFound')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <ServiceCard key={s.id} title={s.title} slug={s.slug} category={s.category} description={s.what_is} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
