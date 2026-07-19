import { useMemo, useState } from 'react';
import { useSchemes } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter } from '../router/Router';
import { Building2, Search, SlidersHorizontal, BookOpen } from 'lucide-react';
import { SchemeCard, LoadingSpinner, EmptyState } from '../components/ui';

const MINISTRIES = [
  'Ministry of Agriculture and Farmers Welfare',
  'Ministry of Education',
  'Ministry of Health and Family Welfare',
  'Ministry of Women and Child Development',
  'Ministry of Social Justice and Empowerment',
  'Ministry of Rural Development',
  'Ministry of Labour and Employment',
  'Ministry of Minority Affairs',
  'Ministry of Tribal Affairs',
  'Ministry of Housing and Urban Affairs',
  'Ministry of Finance',
  'Ministry of Road Transport and Highways',
  'Ministry of Electronics and IT'
];

export function CentralSchemesPage() {
  const { t } = useTranslation();
  const { schemes, loading } = useSchemes();
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [query, setQuery] = useState('');

  const centralSchemes = useMemo(() => {
    return schemes.filter((s) => s.level === 'central');
  }, [schemes]);

  const groupedSchemes = useMemo(() => {
    const groups: Record<string, typeof schemes> = {};
    MINISTRIES.forEach((m) => { groups[m] = []; });
    groups['Other Ministries'] = [];

    centralSchemes.forEach((s) => {
      // Simple text matching
      if (query && !s.title.toLowerCase().includes(query.toLowerCase()) && !(s.description || '').toLowerCase().includes(query.toLowerCase())) {
        return;
      }
      if (selectedMinistry && s.ministry !== selectedMinistry) {
        return;
      }

      let matched = false;
      for (const m of MINISTRIES) {
        if (s.ministry && s.ministry.toLowerCase().includes(m.replace('Ministry of ', '').toLowerCase())) {
          groups[m].push(s);
          matched = true;
          break;
        }
      }
      if (!matched) {
        groups['Other Ministries'].push(s);
      }
    });

    return groups;
  }, [centralSchemes, selectedMinistry, query]);

  const totalFilteredCount = useMemo(() => {
    return Object.values(groupedSchemes).reduce((acc, curr) => acc + curr.length, 0);
  }, [groupedSchemes]);

  if (loading) return <LoadingSpinner label={t('loading')} />;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Title */}
      <div className="border-b border-charcoal-200/50 dark:border-charcoal-800/50 pb-4">
        <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white mb-1">Central Government Schemes</h1>
        <p className="text-xs text-charcoal-500 dark:text-charcoal-400">Browse national welfare programs and schemes administered by Union Ministries.</p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search central schemes..."
            className="input pl-10 py-2.5 text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-charcoal-400" />
          <select value={selectedMinistry} onChange={(e) => setSelectedMinistry(e.target.value)} className="input py-2 text-xs max-w-xs">
            <option value="">All Ministries</option>
            {MINISTRIES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Ministries Groups list */}
      {totalFilteredCount === 0 ? (
        <EmptyState title="No Schemes Found" icon={<BookOpen className="w-8 h-8 text-charcoal-400" />} />
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedSchemes).map(([ministry, list]) => {
            if (list.length === 0) return null;
            return (
              <div key={ministry} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-charcoal-200 dark:border-charcoal-800 pb-2">
                  <Building2 className="w-5 h-5 text-[#FF9933]" />
                  <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider">{ministry}</h2>
                  <span className="badge-emerald text-[10px] ml-2">{list.length} {list.length === 1 ? 'Scheme' : 'Schemes'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {list.map((scheme) => (
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
