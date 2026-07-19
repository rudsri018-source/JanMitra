import { useState, useMemo } from 'react';
import { useStates, useSchemes } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter, Link } from '../router/Router';
import { Globe, Search, ArrowRight } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '../components/ui';

export function StatesPage() {
  const { t } = useTranslation();
  const { states, loading } = useStates();
  const { schemes } = useSchemes();
  const [query, setQuery] = useState('');

  const filteredStates = useMemo(() => {
    return states.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  }, [states, query]);

  // Compute scheme count per state
  const stateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    schemes.forEach((s) => {
      if (s.level === 'state' && s.state) {
        counts[s.state] = (counts[s.state] || 0) + 1;
      }
    });
    return counts;
  }, [schemes]);

  if (loading) return <LoadingSpinner label={t('loading')} />;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Title */}
      <div className="border-b border-charcoal-200/50 dark:border-charcoal-800/50 pb-4">
        <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white mb-1">States & Union Territories</h1>
        <p className="text-xs text-charcoal-500 dark:text-charcoal-400">Browse state-specific welfare benefits and localized government portals.</p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search state or union territory..."
          className="input pl-10 py-2.5 text-xs"
        />
      </div>

      {/* States Grid */}
      {filteredStates.length === 0 ? (
        <EmptyState title="No States Found" icon={<Globe className="w-8 h-8 text-charcoal-400" />} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredStates.map((s) => {
            const count = stateCounts[s.name] || 0;
            return (
              <Link key={s.id} to={`/states/${s.slug}`} className="glass-card p-5 block group hover:border-[#FF9933]">
                <div className="w-10 h-10 rounded-xl bg-charcoal-100 dark:bg-charcoal-800 flex items-center justify-center mb-4 text-[#FF9933]">
                  <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </div>
                <h2 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-1">{s.name}</h2>
                <p className="text-xs text-charcoal-400 mb-4">{count} {count === 1 ? 'Scheme' : 'Schemes'} Available</p>
                <span className="text-[10px] font-bold text-[#FF9933] flex items-center gap-1">
                  View Schemes <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
