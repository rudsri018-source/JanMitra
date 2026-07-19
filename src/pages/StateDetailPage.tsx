import { useState, useMemo } from 'react';
import { useStates, useSchemes, useCategories } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter, Link } from '../router/Router';
import { Globe, ArrowRight, ExternalLink, SlidersHorizontal, BookOpen } from 'lucide-react';
import { SchemeCard, LoadingSpinner, EmptyState } from '../components/ui';

export function StateDetailPage({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const { navigate } = useRouter();
  const { states, loading: statesLoading } = useStates();
  const { schemes, loading: schemesLoading } = useSchemes();
  const { categories } = useCategories();

  const [category, setCategory] = useState('');

  const stateInfo = useMemo(() => {
    return states.find((s) => s.slug === slug);
  }, [states, slug]);

  const stateSchemes = useMemo(() => {
    if (!stateInfo) return [];
    return schemes.filter((s) => s.level === 'state' && s.state === stateInfo.name);
  }, [schemes, stateInfo]);

  const departments = useMemo(() => {
    const deps = new Set<string>();
    stateSchemes.forEach((s) => { if (s.department || s.ministry) deps.add(s.department || s.ministry || ''); });
    return Array.from(deps).sort();
  }, [stateSchemes]);

  const filteredSchemes = useMemo(() => {
    return stateSchemes.filter((s) => {
      if (category) {
        const cat = categories.find((c) => c.slug === category || c.id === category);
        if (cat && s.category_id !== cat.id) return false;
      }
      return true;
    });
  }, [stateSchemes, category, categories]);

  if (statesLoading || schemesLoading) return <LoadingSpinner label={t('loading')} />;
  if (!stateInfo) return <EmptyState title="State not found" icon={<Globe className="w-8 h-8 text-charcoal-400" />} />;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Back button */}
      <button onClick={() => navigate('/states')} className="btn-ghost mb-2 flex items-center gap-1">
        <ArrowRight className="w-4 h-4 rotate-180" /> Back to States
      </button>

      {/* Header Info */}
      <div className="glass-card p-6 border-l-4 border-[#FF9933] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="badge-gold mb-2">State Government</span>
          <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white mb-2">{stateInfo.name}</h1>
          <p className="text-xs text-charcoal-500 dark:text-[#CBD5E1]">
            Access welfare schemes and citizen services administered directly by the Government of {stateInfo.name}.
          </p>
        </div>
        <a
          href={`https://${stateInfo.slug}.gov.in`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-xs font-bold self-start md:self-auto flex items-center gap-1 bg-[#0B1F3A]"
        >
          <ExternalLink className="w-4 h-4" /> Official Portal
        </a>
      </div>

      {/* Filters and Scheme Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-charcoal-400" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input py-2 text-xs max-w-xs">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <p className="text-xs font-semibold text-charcoal-400">{filteredSchemes.length} schemes available</p>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <EmptyState title="No Schemes Found" description="Try selecting a different category." icon={<BookOpen className="w-8 h-8 text-charcoal-400" />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
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
      )}

      {/* Departments list */}
      {departments.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white mb-4 uppercase tracking-wider">Active Departments</h3>
          <div className="flex flex-wrap gap-2">
            {departments.map((d) => (
              <span key={d} className="badge-charcoal text-xs px-3 py-1 font-semibold">{d}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
