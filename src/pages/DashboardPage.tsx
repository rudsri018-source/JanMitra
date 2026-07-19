import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import { useSchemes, useScholarships, useNotifications, useCategories } from '../hooks/useData';
import { useSavedItems, useRecentlyViewed } from '../hooks/useSaved';
import { getRecommendedSchemes } from '../lib/eligibility';
import { Link } from '../router/Router';
import { SchemeCard } from '../components/ui';
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-800 dark:via-charcoal-900 dark:to-emerald-950 p-8 lg:p-10 text-white animate-slide-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-teal-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.8s' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-gold-300" />
            <span className="text-xs font-medium text-emerald-50">{t('poweredBy')}</span>
          </div>
          <p className="text-emerald-100 text-sm mb-1">{greeting()},</p>
          <h1 className="font-display font-extrabold text-3xl lg:text-4xl mb-2 text-balance">
            {profile?.full_name || (isGuest ? t('guest') : t('user'))}!
          </h1>
          <p className="text-emerald-100 max-w-lg mb-6 text-balance">
            {t('tagline')}. {eligibilityProfile ? 'Your profile is set — recommendations are personalized.' : 'Complete your profile for personalized scheme recommendations.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/assistant" className="inline-flex items-center gap-2 rounded-xl bg-white text-emerald-700 px-5 py-2.5 text-sm font-semibold hover:bg-emerald-50 transition-all active:scale-95 hover:shadow-lg hover:shadow-white/20">
              <Sparkles className="w-4 h-4" /> {t('aiAssistant')}
            </Link>
            <Link to="/eligibility" className="inline-flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 text-white px-5 py-2.5 text-sm font-semibold hover:bg-white/30 transition-all active:scale-95">
              <ListChecks className="w-4 h-4" /> {t('checkEligibility')}
            </Link>
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
                  <p className="text-xs text-charcoal-400 mt-2">{new Date(n.created_at).toLocaleDateString()}</p>
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
