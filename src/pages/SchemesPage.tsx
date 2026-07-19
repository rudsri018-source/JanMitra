import { useState, useMemo } from 'react';
import { useSchemes, useCategories, useStates } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter } from '../router/Router';
import { SchemeCard, LoadingSpinner, EmptyState } from '../components/ui';
import { Search, SlidersHorizontal, X, Grid, List, ArrowUpDown } from 'lucide-react';

export function SchemesPage() {
  const { t } = useTranslation();
  const { path } = useRouter();
  const { schemes, loading } = useSchemes();
  const { categories } = useCategories();
  const { states } = useStates();

  const urlParams = new URLSearchParams(path.split('?')[1] || '');
  const initialCategory = urlParams.get('category') || '';
  const initialQuery = urlParams.get('q') || '';
  const initialLevel = urlParams.get('level') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [level, setLevel] = useState(initialLevel);
  const [state, setState] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [appMode, setAppMode] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredAndSorted = useMemo(() => {
    // 1. Filter
    let result = schemes.filter((s) => {
      if (query) {
        const text = (s.title + ' ' + (s.description || '') + ' ' + (s.tags || []).join(' ')).toLowerCase();
        if (!text.includes(query.toLowerCase())) return false;
      }
      if (category) {
        const cat = categories.find((c) => c.slug === category || c.id === category);
        if (cat && s.category_id !== cat.id) return false;
      }
      if (level && s.level !== level) return false;
      if (state) {
        if (s.level === 'central') return true;
        if (s.state !== state) return false;
      }
      if (beneficiary) {
        const text = (s.description || '').toLowerCase() + ' ' + (s.eligibility_criteria || '').toLowerCase();
        if (!text.includes(beneficiary.toLowerCase())) return false;
      }
      if (appMode) {
        const mode = String(s.application_mode || '').toLowerCase();
        if (mode && !mode.includes(appMode.toLowerCase())) return false;
      }
      if (status && s.status !== status) return false;
      return true;
    });

    // 2. Sort
    result.sort((a, b) => {
      if (sortBy === 'a-z') return a.title.localeCompare(b.title);
      if (sortBy === 'z-a') return b.title.localeCompare(a.title);
      if (sortBy === 'newest') return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      // Default: popular / trending
      const aVal = a.trending ? 1 : 0;
      const bVal = b.trending ? 1 : 0;
      return bVal - aVal;
    });

    return result;
  }, [schemes, query, category, level, state, beneficiary, appMode, status, sortBy, categories]);

  const clearFilters = () => {
    setQuery('');
    setCategory('');
    setLevel('');
    setState('');
    setBeneficiary('');
    setAppMode('');
    setStatus('');
    setSortBy('popular');
  };

  const SidebarContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-charcoal-200 dark:border-charcoal-800 pb-2">
        <h3 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider">Filters</h3>
        <button onClick={clearFilters} className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1">
          <X className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 mb-1.5 uppercase tracking-wider">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input text-xs">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      {/* Level Filter */}
      <div>
        <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 mb-1.5 uppercase tracking-wider">Level</label>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="input text-xs">
          <option value="">All Levels</option>
          <option value="central">Central Government</option>
          <option value="state">State Government</option>
        </select>
      </div>

      {/* State Filter */}
      <div>
        <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 mb-1.5 uppercase tracking-wider">State / UT</label>
        <select value={state} onChange={(e) => setState(e.target.value)} className="input text-xs">
          <option value="">All States</option>
          {states.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
      </div>

      {/* Beneficiary Filter */}
      <div>
        <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 mb-1.5 uppercase tracking-wider">Beneficiary Type</label>
        <select value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} className="input text-xs">
          <option value="">All Beneficiaries</option>
          <option value="student">Student</option>
          <option value="farmer">Farmer</option>
          <option value="women">Women</option>
          <option value="senior">Senior Citizen</option>
          <option value="disabled">Disabled Person</option>
          <option value="bpl">BPL Card Holders</option>
        </select>
      </div>

      {/* Application Mode */}
      <div>
        <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 mb-1.5 uppercase tracking-wider">Application Mode</label>
        <select value={appMode} onChange={(e) => setAppMode(e.target.value)} className="input text-xs">
          <option value="">Online & Offline</option>
          <option value="online">Online Only</option>
          <option value="offline">Offline Only</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 mb-1.5 uppercase tracking-wider">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input text-xs">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Title */}
      <div className="mb-6 border-b border-charcoal-200/50 dark:border-charcoal-800/50 pb-4">
        <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white mb-1">Government Schemes</h1>
        <p className="text-xs text-charcoal-500 dark:text-charcoal-400">Search and filter central and state welfare benefits for Indian citizens.</p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Desktop Sidebar Filter Panel */}
        <aside className="hidden lg:block w-64 flex-shrink-0 bg-white dark:bg-[#0F172A] border border-charcoal-200 dark:border-charcoal-800 rounded-3xl p-6 shadow-sm sticky top-28">
          <SidebarContent />
        </aside>

        {/* Schemes List & Filters */}
        <div className="flex-1 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by keywords..."
                className="input pl-10 py-2.5 text-xs"
              />
            </div>

            {/* Quick settings controls */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
              </button>

              {/* Sorting */}
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-charcoal-400" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input py-2 text-xs max-w-36">
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest Added</option>
                  <option value="a-z">A - Z</option>
                  <option value="z-a">Z - A</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="border border-charcoal-200 dark:border-charcoal-800 rounded-xl p-1 flex bg-white dark:bg-[#0F172A]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-charcoal-100 dark:bg-charcoal-800 text-[#FF9933]' : 'text-charcoal-400 hover:text-charcoal-600'}`}
                  aria-label="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-charcoal-100 dark:bg-charcoal-800 text-[#FF9933]' : 'text-charcoal-400 hover:text-charcoal-600'}`}
                  aria-label="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* List Display */}
          {loading ? (
            <LoadingSpinner label={t('loading')} />
          ) : filteredAndSorted.length === 0 ? (
            <EmptyState title="No Schemes Found" description="Try refining your query or resetting filters." icon={<Search className="w-8 h-8 text-charcoal-400" />} />
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-charcoal-400">{filteredAndSorted.length} schemes found</p>
              
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredAndSorted.map((scheme) => (
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
                    layoutMode={viewMode}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setShowMobileFilters(false)} />
          <aside className="fixed right-0 top-0 z-50 h-screen w-72 bg-white dark:bg-[#0F172A] shadow-2xl p-6 flex flex-col animate-slide-in-right lg:hidden">
            <div className="flex items-center justify-between border-b border-charcoal-200 dark:border-charcoal-800 pb-3 mb-4">
              <h3 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="btn-ghost p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              <SidebarContent />
            </div>
            <button onClick={() => setShowMobileFilters(false)} className="btn-primary w-full mt-4 text-xs font-bold">Apply Filters</button>
          </aside>
        </>
      )}

    </div>
  );
}
