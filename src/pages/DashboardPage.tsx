import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import { useSchemes, useScholarships, useNotifications, useCategories } from '../hooks/useData';
import { useSavedItems, useRecentlyViewed } from '../hooks/useSaved';
import { getRecommendedSchemes } from '../lib/eligibility';
import { Link } from '../router/Router';
import { SchemeCard, formatDate } from '../components/ui';
import {
  Sparkles, ListChecks, FileText, Award, Bell, TrendingUp, Clock,
  Bookmark, BarChart3, ChevronRight, ArrowRight, BookOpen, Scale, FileCheck,
} from 'lucide-react';

export function DashboardPage() {
  const { t } = useTranslation();
  const { profile, isGuest } = useAuth();
  const { schemes } = useSchemes();
  const { scholarships } = useScholarships();
  const { notifications } = useNotifications();
  const { categories } = useCategories();
  const { savedItems } = useSavedItems();
  const { recent } = useRecentlyViewed();

  const eligibilityProfile = useMemo(() => {
    if (!profile) return null;
    return {
      age: profile.age,
      gender: profile.gender,
      state: profile.state,
      district: profile.district,
      occupation: profile.occupation,
      annual_income: profile.annual_income,
      caste: profile.caste,
      religion: profile.religion,
      disability: profile.disability,
      education: profile.education,
    };
  }, [profile]);

  const recommended = useMemo(() => getRecommendedSchemes(schemes, eligibilityProfile), [schemes, eligibilityProfile]);
  const trending = useMemo(() => schemes.filter((s) => s.trending).slice(0, 4), [schemes]);

  const quickActions = [
    { to: '/assistant', label: t('aiAssistant'), icon: Sparkles, color: 'from-emerald-500 to-emerald-700' },
    { to: '/eligibility', label: t('eligibilityChecker'), icon: ListChecks, color: 'from-gold-400 to-gold-600' },
    { to: '/schemes', label: t('schemes'), icon: BarChart3, color: 'from-emerald-600 to-teal-700' },
    { to: '/scholarships', label: t('scholarships'), icon: Award, color: 'from-gold-500 to-amber-600' },
    { to: '/services', label: t('citizenServices'), icon: FileText, color: 'from-emerald-500 to-green-700' },
    { to: '/documents', label: t('documentAssistant'), icon: FileCheck, color: 'from-teal-500 to-emerald-700' },
    { to: '/policies', label: t('policyLibrary'), icon: BookOpen, color: 'from-emerald-600 to-emerald-800' },
    { to: '/complaints', label: t('complaints'), icon: Scale, color: 'from-gold-400 to-gold-600' },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1F3A] via-[#0D2E5C] to-[#138808] dark:from-[#07111F] dark:via-[#0F172A] dark:to-[#09351C] p-8 lg:p-10 text-white animate-slide-up shadow-xl shadow-emerald-950/10">
        {/* Glowing floating decorative spheres */}
        <div className="absolute top-[-80px] right-[-80px] w-96 h-96 bg-[#FF9933]/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[-100px] left-[20%] w-96 h-96 bg-[#138808]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-[35%] w-64 h-64 bg-[#60A5FA]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.8s' }} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left panel text contents */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-sm animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-[#FDBA74] animate-pulse" />
              <span className="text-xs font-bold tracking-wide text-white/90">Powered by JanMitra AI</span>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl sm:text-2xl animate-bounce-soft">👋</span>
                <p className="text-white/80 text-sm font-semibold tracking-wide uppercase">{greeting()},</p>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-tight mb-2 tracking-tight text-white drop-shadow-sm">
                {profile?.full_name || (isGuest ? t('guest') : t('user'))}!
              </h1>
              <p className="text-white/95 text-xs sm:text-sm max-w-xl leading-relaxed font-medium">
                {t('tagline')}. {eligibilityProfile ? 'Your profile is set — recommendations are personalized.' : 'Complete your profile for personalized scheme recommendations.'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3.5 pt-2">
              <Link to="/assistant" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#FDBA74] text-white px-6 py-3 text-xs sm:text-sm font-bold hover:brightness-110 transition-all hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-[#FF9933]/30">
                <Sparkles className="w-4 h-4" /> {t('aiAssistant')}
              </Link>
              <Link to="/eligibility" className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 hover:shadow-md">
                <ListChecks className="w-4 h-4" /> {t('checkEligibility')}
              </Link>
            </div>
          </div>

          {/* Right panel interactive chatbot graphic */}
          <div className="lg:col-span-4 hidden lg:flex justify-center relative scale-95">
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Outer rotating dash borders */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FDBA74]/35 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute inset-3 rounded-full border border-dashed border-[#4ADE80]/30 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
              
              {/* Concentric aura */}
              <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-[#FF9933]/10 to-[#138808]/10 backdrop-blur-sm animate-pulse-soft" />

              {/* Glowing core logo */}
              <div className="w-40 h-40 rounded-full bg-[#0B1F3A] border-4 border-white/25 flex flex-col items-center justify-center shadow-2xl relative group">
                <svg className="w-20 h-20 filter drop-shadow-md animate-pulse-soft" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* National swooshes */}
                  <path d="M25 45 C 35 30, 65 30, 75 45" stroke="#FF9933" strokeWidth="6" strokeLinecap="round" />
                  <path d="M30 52 C 40 40, 60 40, 70 52" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
                  <path d="M35 59 C 42 50, 58 50, 65 59" stroke="#138808" strokeWidth="6" strokeLinecap="round" />
                  <path d="M50 25 L53 35 L63 38 L53 41 L50 51 L47 41 L37 38 L47 35 Z" fill="#FDBA74" />
                </svg>
                <span className="text-[10px] uppercase tracking-widest text-[#FDBA74] font-black absolute bottom-4">JANMITRA</span>
              </div>

              {/* Orbiting Icons */}
              <div className="absolute top-1 right-2 bg-gradient-to-tr from-amber-500 to-[#FF9933] p-2.5 rounded-2xl shadow-lg border border-white/20 animate-float">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <div className="absolute bottom-2 left-1 bg-gradient-to-tr from-emerald-500 to-[#138808] p-2.5 rounded-2xl shadow-lg border border-white/20 animate-float" style={{ animationDelay: '1.5s' }}>
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div className="absolute top-28 -right-6 bg-gradient-to-tr from-blue-500 to-indigo-600 p-2.5 rounded-2xl shadow-lg border border-white/20 animate-float" style={{ animationDelay: '0.8s' }}>
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {[
          { label: t('totalSchemes'), value: schemes.length, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: t('totalScholarships'), value: scholarships.length, icon: Award, color: 'text-gold-600', bg: 'bg-gold-50 dark:bg-gold-900/20' },
          { label: t('savedSchemes'), value: savedItems.length, icon: Bookmark, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: t('governmentNotifications'), value: notifications.length, icon: Bell, color: 'text-gold-600', bg: 'bg-gold-50 dark:bg-gold-900/20' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5 hover:scale-[1.02] transition-transform">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.bg} mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-display font-extrabold text-charcoal-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">{t('quickActions')}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to} className="group">
              <div className="glass-card p-5 flex flex-col items-center text-center gap-3 hover:scale-[1.03] transition-transform">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-charcoal-900 dark:text-white">{action.label}</p>
                <ArrowRight className="w-4 h-4 text-charcoal-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Schemes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">{t('recommendedSchemes')}</h2>
          <Link to="/schemes" className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1">
            {t('viewAll')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommended.map((scheme) => (
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
      </section>

      {/* Trending + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-500" /> {t('trendingSchemes')}
            </h2>
            <Link to="/schemes" className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              {t('viewAll')}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trending.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                title={scheme.title}
                slug={scheme.slug}
                description={scheme.short_description || ''}
                level={scheme.level}
                state={scheme.state}
                benefits={scheme.benefits}
                trending
                tags={scheme.tags}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-500" /> {t('governmentNotifications')}
            </h2>
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((n) => (
              <Link key={n.id} to={n.link || '/notifications'} className="block">
                <div className="glass-card p-4 hover:scale-[1.01] transition-transform">
                  <div className="flex items-start gap-2">
                    <span className={`badge ${n.type === 'reminder' ? 'badge-gold' : 'badge-emerald'} flex-shrink-0`}>
                      {n.type === 'reminder' ? 'Reminder' : n.type === 'scholarship' ? 'Scholarship' : 'Update'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-charcoal-900 dark:text-white mt-2 line-clamp-1">{n.title}</h3>
                  <p className="text-xs text-charcoal-500 dark:text-charcoal-400 line-clamp-2 mt-1">{n.body}</p>
                  <p className="text-xs text-charcoal-400 mt-2">{formatDate(n.created_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Saved + Recently Viewed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-emerald-500" /> {t('savedSchemes')}
            </h2>
          </div>
          {savedItems.length === 0 ? (
            <div className="glass-card p-6 text-center text-sm text-charcoal-500 dark:text-charcoal-400">
              No saved items yet. Browse schemes and save them for later.
            </div>
          ) : (
            <div className="space-y-3">
              {savedItems.slice(0, 4).map((item) => (
                <Link key={item.id} to={`/${item.item_type === 'scheme' ? 'schemes' : item.item_type === 'scholarship' ? 'scholarships' : 'services'}/${item.item_id}`}>
                  <div className="glass-card p-4 flex items-center gap-3">
                    <Bookmark className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-charcoal-900 dark:text-white line-clamp-1">{item.item_title}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold-500" /> {t('recentlyViewed')}
            </h2>
          </div>
          {recent.length === 0 ? (
            <div className="glass-card p-6 text-center text-sm text-charcoal-500 dark:text-charcoal-400">
              No recently viewed items.
            </div>
          ) : (
            <div className="space-y-3">
              {recent.slice(0, 4).map((r) => (
                <Link key={r.id} to={`/${r.type === 'scheme' ? 'schemes' : r.type === 'scholarship' ? 'scholarships' : 'services'}/${r.slug}`}>
                  <div className="glass-card p-4 flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-charcoal-900 dark:text-white line-clamp-1">{r.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Categories */}
      <section>
        <h2 className="section-title mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/schemes?category=${cat.slug}`}>
              <div className="glass-card p-4 text-center hover:scale-[1.03] transition-transform">
                <p className="text-sm font-semibold text-charcoal-900 dark:text-white line-clamp-1">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
