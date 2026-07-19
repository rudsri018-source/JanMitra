import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import { Link } from '../router/Router';
import {
  Sparkles, Shield, Zap, Globe, ArrowRight, CheckCircle2,
  Users, FileText, Award, BookOpen, Scale, Bot, MessageSquare,
  TrendingUp, Lock, Search, ChevronRight, Star,
} from 'lucide-react';

export function LandingPage() {
  const { t } = useTranslation();
  const { signInWithGoogle, continueAsGuest } = useAuth();

  const features = [
    { icon: Bot, title: 'AI-Powered Assistant', desc: 'Ask questions in plain English or Hindi. Our Gemini-powered AI understands natural language and gives instant, accurate answers.', color: 'from-emerald-500 to-teal-600' },
    { icon: Search, title: 'Smart Scheme Search', desc: 'Search across hundreds of Central and State government schemes, scholarships, and services with intelligent matching.', color: 'from-gold-400 to-amber-600' },
    { icon: Shield, title: 'Eligibility Checker', desc: 'Get personalized scheme recommendations based on your profile — age, income, caste, state, occupation and more.', color: 'from-teal-500 to-emerald-700' },
    { icon: FileText, title: 'Citizen Services', desc: 'Step-by-step guides for Aadhaar, PAN, Passport, Driving Licence, Voter ID, Birth Certificate and more.', color: 'from-emerald-600 to-green-700' },
    { icon: BookOpen, title: 'Policy Library', desc: 'Browse and understand government policies in simple language with official references.', color: 'from-gold-500 to-amber-700' },
    { icon: Scale, title: 'Grievance Filing', desc: 'File and track complaints related to government services with a simple guided process.', color: 'from-teal-600 to-emerald-800' },
  ];

  const stats = [
    { value: '500+', label: 'Government Schemes', icon: TrendingUp },
    { value: '100+', label: 'Citizen Services', icon: FileText },
    { value: '50+', label: 'Scholarships', icon: Award },
    { value: '24/7', label: 'AI Assistance', icon: Bot },
  ];

  const steps = [
    { num: '01', title: 'Ask Your Question', desc: 'Type your question in any language — English, Hindi, or Hinglish. No need for exact keywords.', icon: MessageSquare },
    { num: '02', title: 'AI Searches Database', desc: 'Our AI searches the verified government database and finds relevant schemes, services, or policies.', icon: Search },
    { num: '03', title: 'Get Clear Answers', desc: 'Receive a simple, structured answer with eligibility, documents needed, application process, and official links.', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-charcoal-900/80 border-b border-charcoal-200/50 dark:border-charcoal-800/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-lg text-charcoal-900 dark:text-white leading-tight">{t('appName')}</h1>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">{t('tagline')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={continueAsGuest} className="btn-ghost text-sm hidden sm:flex">
              {t('continueAsGuest')}
            </button>
            <Link to="/auth" className="btn-primary text-sm">
              {t('signIn')} / {t('signUp')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-900 dark:via-charcoal-950 dark:to-emerald-950" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.8s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-gold-300" />
            <span className="text-sm font-medium text-emerald-50">Powered by Google Gemini AI</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl lg:text-6xl mb-6 text-balance animate-slide-up">
            Your AI Guide to <br className="hidden lg:block" />
            <span className="text-gold-300">Government Schemes</span> & Services
          </h1>

          <p className="text-lg lg:text-xl text-emerald-100 max-w-2xl mx-auto mb-10 text-balance animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Find government schemes, scholarships, and citizen services instantly. Ask questions in plain English or Hindi — our AI understands and gives you clear, verified answers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link to="/auth" className="inline-flex items-center gap-2 rounded-xl bg-white text-emerald-700 px-8 py-3.5 text-base font-semibold hover:bg-emerald-50 transition-all active:scale-95 hover:shadow-2xl hover:shadow-white/20">
              Get Started — It's Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button onClick={continueAsGuest} className="inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-xl border border-white/30 text-white px-8 py-3.5 text-base font-semibold hover:bg-white/25 transition-all active:scale-95">
              Explore as Guest
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-gold-300 mx-auto mb-2" />
                <p className="text-3xl font-display font-extrabold text-white">{stat.value}</p>
                <p className="text-sm text-emerald-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 mb-4">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Features</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-charcoal-900 dark:text-white mb-4">
            Everything you need to navigate government services
          </h2>
          <p className="text-lg text-charcoal-500 dark:text-charcoal-400 max-w-2xl mx-auto">
            From finding the right scheme to filing your application — JanMitra makes government services simple and accessible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card p-7 hover:scale-[1.02] transition-transform group">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-bold text-lg text-charcoal-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-white dark:bg-charcoal-900 border-y border-charcoal-200/50 dark:border-charcoal-800/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-charcoal-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-charcoal-500 dark:text-charcoal-400 max-w-2xl mx-auto">
              Get answers in three simple steps — no paperwork, no queues, no confusion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={step.num} className="relative">
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full">
                    <ChevronRight className="w-8 h-8 text-emerald-300 dark:text-emerald-700" />
                  </div>
                )}
                <div className="glass-card p-8 text-center relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg mx-auto mb-5">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-xs font-bold text-emerald-500 mb-2">STEP {step.num}</div>
                  <h3 className="font-display font-bold text-lg text-charcoal-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Preview */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 mb-4">
              <Bot className="w-3.5 h-3.5 text-gold-600" />
              <span className="text-xs font-semibold text-gold-700 dark:text-gold-300">AI Assistant</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-charcoal-900 dark:text-white mb-4">
              Ask anything. Get instant answers.
            </h2>
            <p className="text-lg text-charcoal-500 dark:text-charcoal-400 mb-6">
              Our AI assistant understands natural language — English, Hindi, or Hinglish. It searches our verified government database and explains results in simple language. If a record isn't in our database, it provides general guidance based on standard government procedures.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Understands natural language, spelling mistakes, and Hinglish',
                'Searches verified government database of schemes and services',
                'Explains eligibility, documents, process, fees, and timelines',
                'Provides official website links for every answer',
                'Never invents government schemes — only verified information',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-charcoal-700 dark:text-charcoal-300">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/auth" className="btn-primary inline-flex">
              Try the AI Assistant
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="glass-card p-6 max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-charcoal-200/50 dark:border-charcoal-800/50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-charcoal-900 dark:text-white">JanMitra AI</p>
                  <p className="text-xs text-emerald-600">Powered by Gemini</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[80%]">
                    How to apply for Aadhaar card?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-charcoal-100 dark:bg-charcoal-800 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm max-w-[85%] text-charcoal-700 dark:text-charcoal-200">
                    Here's how to apply for Aadhaar:
                    <br /><br />
                    <strong>Eligibility:</strong> Any resident of India
                    <br />
                    <strong>Documents:</strong> Proof of Identity, Address, DOB
                    <br />
                    <strong>Process:</strong> Visit Aadhaar Seva Kendra with documents
                    <br />
                    <strong>Fees:</strong> Free for first enrollment
                    <br />
                    <strong>Timeline:</strong> 7-90 days
                    <br />
                    <strong>Website:</strong> uidai.gov.in
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Security */}
      <section className="py-16 bg-white dark:bg-charcoal-900 border-y border-charcoal-200/50 dark:border-charcoal-800/50">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Lock className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-charcoal-900 dark:text-white mb-1">Secure & Private</h3>
              <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Your data is protected with industry-standard encryption.</p>
            </div>
            <div>
              <Shield className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-charcoal-900 dark:text-white mb-1">Verified Data</h3>
              <p className="text-sm text-charcoal-500 dark:text-charcoal-400">All scheme information comes from official government sources.</p>
            </div>
            <div>
              <Users className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-charcoal-900 dark:text-white mb-1">For All Citizens</h3>
              <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Available in English, Hindi, Marathi, Gujarati and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-800 dark:via-charcoal-900 dark:to-emerald-950 p-10 lg:p-16 text-center text-white">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="relative z-10">
            <Star className="w-10 h-10 text-gold-300 mx-auto mb-4" />
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl mb-4">
              Ready to find your schemes?
            </h2>
            <p className="text-lg text-emerald-100 max-w-xl mx-auto mb-8">
              Join thousands of citizens who use JanMitra to navigate government services with confidence.
            </p>
            <Link to="/auth" className="inline-flex items-center gap-2 rounded-xl bg-white text-emerald-700 px-8 py-3.5 text-base font-semibold hover:bg-emerald-50 transition-all active:scale-95 hover:shadow-2xl">
              Sign Up — It's Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-charcoal-200/50 dark:border-charcoal-800/50 py-8 text-center text-sm text-charcoal-500 dark:text-charcoal-400">
        <p>&copy; {new Date().getFullYear()} {t('appName')}. {t('tagline')}.</p>
      </footer>
    </div>
  );
}
