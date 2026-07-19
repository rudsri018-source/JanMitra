import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import { Link, useRouter } from '../router/Router';
import {
  Sparkles, Shield, Zap, Globe, ArrowRight, CheckCircle2,
  Users, FileText, Award, BookOpen, Scale, Bot, MessageSquare,
  TrendingUp, Lock, Search, ChevronRight, Star, HelpCircle,
} from 'lucide-react';
import { MOCK_SCHEMES, MOCK_CATEGORIES, MOCK_STATES, MOCK_SERVICES } from '../lib/mockData';
import { JanMitraLogo } from '../components/AppShell';

export function LandingPage() {
  const { t } = useTranslation();
  const { continueAsGuest } = useAuth();
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schemes?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/schemes');
    }
  };

  const handleStatClick = (type: string) => {
    if (type === 'central') navigate('/schemes?level=central');
    else if (type === 'state') navigate('/schemes?level=state');
    else if (type === 'categories') navigate('/schemes');
    else if (type === 'official') navigate('/services');
  };

  const categories = MOCK_CATEGORIES.slice(0, 6);
  const popularServices = MOCK_SERVICES.slice(0, 4);
  const states = MOCK_STATES.slice(0, 6);
  const latestSchemes = MOCK_SCHEMES.slice(0, 3);
  const centralSchemes = MOCK_SCHEMES.filter(s => s.level === 'central').slice(0, 3);
  const stateSchemes = MOCK_SCHEMES.filter(s => s.level === 'state').slice(0, 3);

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-950 flex flex-col">
      {/* Tricolor Accent Bar */}
      <div className="h-1.5 w-full flex sticky top-0 z-50">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-[#FFFFFF]"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Top Header */}
      <header className="sticky top-1.5 z-40 bg-white/95 dark:bg-[#0F172A]/95 border-b border-charcoal-200/50 dark:border-charcoal-800/50 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 scale-90">
              <JanMitraLogo />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-sm lg:text-base text-charcoal-900 dark:text-white leading-tight">
                JanMitra
              </h1>
              <p className="text-[10px] text-charcoal-500 dark:text-charcoal-300 font-medium">
                {t('tagline')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={continueAsGuest} className="btn-ghost text-xs font-semibold hidden sm:flex">
              {t('continueAsGuest')}
            </button>
            <Link to="/auth" className="btn-primary text-xs font-bold flex items-center gap-1.5 shadow-md">
              {t('signIn')} / {t('signUp')}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0B1F3A] dark:bg-[#07111F] py-20 lg:py-28 text-white border-b border-[#E2E8F0] dark:border-[#334155]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0F172A]/90 to-[#07111F]/80" />
        {/* Subtle tricolor background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF9933]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#138808]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#FF9933] animate-pulse-soft" />
            <span className="text-xs font-semibold text-emerald-50">Powered by Secure AI Technology</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-6 text-balance leading-tight">
            Discover Every Government Scheme in India
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-[#CBD5E1] max-w-3xl mx-auto mb-10 text-balance leading-relaxed">
            Search Central and State Government schemes, benefits, services, documents, eligibility, required documents, and official application links — all in one place.
          </p>

          {/* Search-First Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 flex gap-2 p-2 bg-white dark:bg-[#0F172A] rounded-2xl border border-charcoal-200 dark:border-charcoal-700 shadow-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Aadhaar, PM Kisan, scholarships, pension, ration card..."
                className="w-full bg-transparent pl-10 pr-4 py-3 text-sm text-charcoal-900 dark:text-white placeholder-charcoal-400 outline-none"
              />
            </div>
            <button type="submit" className="btn-primary text-xs font-bold px-6 bg-[#FF9933] text-white hover:bg-[#FF9933]/90">
              Search
            </button>
          </form>

          {/* Hero Navigation Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate('/schemes')} className="btn-primary text-xs font-bold bg-[#FF9933] hover:bg-[#FF9933]/90">
              Explore Schemes
            </button>
            <button onClick={() => navigate('/eligibility')} className="btn-secondary text-xs font-bold">
              Check Eligibility
            </button>
            <button onClick={() => navigate('/assistant')} className="btn-secondary text-xs font-bold">
              Ask AI Assistant
            </button>
            <button onClick={() => navigate('/states')} className="btn-secondary text-xs font-bold">
              Browse by State
            </button>
          </div>

          {/* Quick Stats Cards */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <button onClick={() => handleStatClick('central')} className="glass-card bg-white/5 backdrop-blur-md border-white/10 hover:border-[#FF9933] p-4 text-center group transition-all">
              <p className="text-xl font-extrabold text-[#FF9933]">{MOCK_SCHEMES.filter(s => s.level === 'central').length}+</p>
              <p className="text-xs text-[#CBD5E1] font-semibold mt-1">Central Schemes</p>
            </button>
            <button onClick={() => handleStatClick('state')} className="glass-card bg-white/5 backdrop-blur-md border-white/10 hover:border-[#138808] p-4 text-center group transition-all">
              <p className="text-xl font-extrabold text-[#4ADE80]">{MOCK_SCHEMES.filter(s => s.level === 'state').length}+</p>
              <p className="text-xs text-[#CBD5E1] font-semibold mt-1">State Schemes</p>
            </button>
            <button onClick={() => handleStatClick('categories')} className="glass-card bg-white/5 backdrop-blur-md border-white/10 hover:border-white p-4 text-center group transition-all">
              <p className="text-xl font-extrabold text-white">{MOCK_CATEGORIES.length}</p>
              <p className="text-xs text-[#CBD5E1] font-semibold mt-1">Categories</p>
            </button>
            <button onClick={() => handleStatClick('official')} className="glass-card bg-white/5 backdrop-blur-md border-white/10 hover:border-[#60A5FA] p-4 text-center group transition-all">
              <p className="text-xl font-extrabold text-[#60A5FA]">{MOCK_SERVICES.length}</p>
              <p className="text-xs text-[#CBD5E1] font-semibold mt-1">Official Links</p>
            </button>
          </div>

        </div>
      </section>

      {/* Homepage Sections */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12 flex-1 space-y-16">
        
        {/* Popular Services */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-charcoal-200/50 dark:border-charcoal-800/50 pb-2">
            <h2 className="font-display font-extrabold text-xl text-charcoal-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF9933]" /> Popular Citizen Services
            </h2>
            <Link to="/services" className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularServices.map((s) => (
              <Link key={s.id} to={`/services/${s.slug}`} className="glass-card p-5 block group">
                <div className="w-10 h-10 rounded-xl bg-charcoal-100 dark:bg-charcoal-800 flex items-center justify-center mb-4 text-[#FF9933] group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-1">{s.title}</h3>
                <p className="text-xs text-charcoal-500 dark:text-[#CBD5E1] line-clamp-2">{s.what_is}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Category */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-charcoal-200/50 dark:border-charcoal-800/50 pb-2">
            <h2 className="font-display font-extrabold text-xl text-charcoal-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#138808]" /> Browse by Category
            </h2>
            <Link to="/schemes" className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((c) => (
              <Link key={c.id} to={`/schemes?category=${c.id}`} className="glass-card p-4 text-center block group hover:border-[#138808]">
                <div className="w-10 h-10 rounded-xl bg-charcoal-100 dark:bg-charcoal-800 flex items-center justify-center mx-auto mb-3 text-[#138808] group-hover:rotate-6 transition-transform">
                  <Star className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-charcoal-900 dark:text-white leading-tight">{c.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by State */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-charcoal-200/50 dark:border-charcoal-800/50 pb-2">
            <h2 className="font-display font-extrabold text-xl text-charcoal-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#FF9933]" /> Browse Schemes by State
            </h2>
            <Link to="/states" className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {states.map((s) => (
              <Link key={s.id} to={`/states/${s.slug}`} className="glass-card p-4 text-center block group hover:border-[#FF9933]">
                <div className="w-10 h-10 rounded-xl bg-charcoal-100 dark:bg-charcoal-800 flex items-center justify-center mx-auto mb-3 text-[#FF9933]">
                  <Globe className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-charcoal-900 dark:text-white leading-tight">{s.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Schemes for You */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-charcoal-200/50 dark:border-charcoal-800/50 pb-2">
            <h2 className="font-display font-extrabold text-xl text-charcoal-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#138808]" /> Schemes for You
            </h2>
            <Link to="/eligibility" className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline">Personalize</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestSchemes.map((s) => (
              <Link key={s.id} to={`/schemes/${s.slug}`} className="glass-card p-6 block group hover:border-[#FF9933]">
                <span className="badge-gold text-[10px] mb-2">{s.category}</span>
                <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-2 group-hover:text-[#FF9933] transition-colors">{s.title}</h3>
                <p className="text-xs text-charcoal-500 dark:text-[#CBD5E1] line-clamp-3 mb-4 leading-relaxed">{s.description}</p>
                <div className="flex items-center justify-between text-[10px] font-semibold text-charcoal-400">
                  <span>{s.level === 'central' ? 'Central Government' : 'State Government'}</span>
                  <span>Active</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Central Government Schemes */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-charcoal-200/50 dark:border-charcoal-800/50 pb-2">
            <h2 className="font-display font-extrabold text-xl text-charcoal-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#0B1F3A] dark:text-white" /> Central Government Schemes
            </h2>
            <Link to="/schemes?level=central" className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {centralSchemes.map((s) => (
              <Link key={s.id} to={`/schemes/${s.slug}`} className="glass-card p-6 block group hover:border-[#0B1F3A]">
                <span className="badge-emerald text-[10px] mb-2">{s.category}</span>
                <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-2 group-hover:text-[#2563EB] transition-colors">{s.title}</h3>
                <p className="text-xs text-charcoal-500 dark:text-[#CBD5E1] line-clamp-3 mb-4 leading-relaxed">{s.description}</p>
                <div className="flex items-center justify-between text-[10px] font-semibold text-charcoal-400">
                  <span>{s.ministry}</span>
                  <span>Active</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* State Government Schemes */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-charcoal-200/50 dark:border-charcoal-800/50 pb-2">
            <h2 className="font-display font-extrabold text-xl text-charcoal-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#138808]" /> State Government Schemes
            </h2>
            <Link to="/schemes?level=state" className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stateSchemes.map((s) => (
              <Link key={s.id} to={`/schemes/${s.slug}`} className="glass-card p-6 block group hover:border-[#138808]">
                <span className="badge-gold text-[10px] mb-2">{s.category}</span>
                <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-2 group-hover:text-[#138808] transition-colors">{s.title}</h3>
                <p className="text-xs text-charcoal-500 dark:text-[#CBD5E1] line-clamp-3 mb-4 leading-relaxed">{s.description}</p>
                <div className="flex items-center justify-between text-[10px] font-semibold text-charcoal-400">
                  <span>{s.state}</span>
                  <span>Active</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How JanMitra Works */}
        <section className="py-12 bg-white dark:bg-[#0F172A] border border-charcoal-200 dark:border-charcoal-800 rounded-3xl p-8">
          <h2 className="font-display font-extrabold text-xl text-charcoal-900 dark:text-white mb-6 text-center">
            How JanMitra Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF9933]/15 text-[#FF9933] flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white">1. Ask in Natural Language</h3>
              <p className="text-xs text-charcoal-500 dark:text-[#CBD5E1] leading-relaxed">
                Type your question or query in English, Hindi, or any Indian regional language.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white">2. Automatic Eligibility Match</h3>
              <p className="text-xs text-charcoal-500 dark:text-[#CBD5E1] leading-relaxed">
                Our checker evaluates your demographic profile to filter out irrelevant options instantly.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#138808]/15 text-[#138808] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-sm text-[#0B1F3A] dark:text-white">3. Apply with Confidence</h3>
              <p className="text-xs text-charcoal-500 dark:text-[#CBD5E1] leading-relaxed">
                Review document checklists, read step-by-step guides, and apply through verified official portals.
              </p>
            </div>
          </div>
        </section>

        {/* AI Assistant Preview */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 mb-4">
              <Bot className="w-3.5 h-3.5 text-gold-600" />
              <span className="text-xs font-semibold text-gold-700 dark:text-gold-300">AI Assistant Preview</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white mb-4">
              Ask anything. Get instant answers.
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 dark:text-[#CBD5E1] leading-relaxed mb-6">
              Our AI assistant is connected to a comprehensive database of central and state services. It explains benefits, translates complicated jargon into simple points, and highlights common application mistakes.
            </p>
            <Link to="/assistant" className="btn-primary text-xs font-bold inline-flex">
              Open AI Assistant
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="glass-card p-6 bg-white dark:bg-[#0F172A] max-w-md w-full mx-auto">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-charcoal-200/50 dark:border-charcoal-800/50">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B1F3A] to-[#FF9933] flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-xs text-charcoal-900 dark:text-white">JanMitra AI Assistant</p>
                <p className="text-[10px] text-emerald-600">Online & Verified</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="bg-[#FF9933] text-white rounded-2xl rounded-tr-sm px-3.5 py-2 text-xs max-w-[80%]">
                  How can I check if I am eligible for PM Kisan?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-[#CBD5E1] rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs max-w-[85%] leading-relaxed">
                  You are eligible if you are a landholding farmer family with cultivable land in your name. PM Kisan pays ₹6,000/year in three equal installments directly to your bank account. Go to the Eligibility Checker tab to run a personalized match!
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safety and Privacy Notice */}
        <section className="glass-card p-6 border-l-4 border-[#FF9933] bg-[#FF9933]/5">
          <div className="flex items-start gap-4">
            <Lock className="w-6 h-6 text-[#FF9933] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-1">Safety & Privacy Notice</h3>
              <p className="text-xs text-charcoal-600 dark:text-[#CBD5E1] leading-relaxed">
                Never share sensitive documents (such as physical copies of your Aadhaar card, PAN card, or bank credentials) on unofficial channels. JanMitra will never ask you for passwords, bank details, or OTPs. Always submit documents only on official `.gov.in` domain portals.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="text-center max-w-3xl mx-auto text-[10px] sm:text-xs text-charcoal-400">
          <p className="leading-relaxed">
            <strong>Disclaimer:</strong> JanMitra is an independent, non-official information aggregation platform. All information displayed here is collected from official department websites (such as myscheme.gov.in and india.gov.in) and other public information listings. We are not associated with any government department, ministry, or authority.
          </p>
        </section>

      </main>

    </div>
  );
}
