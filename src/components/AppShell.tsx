import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from '../i18n/useTranslation';
import { languages } from '../i18n/translations';
import { Link, useRouter } from '../router/Router';
import {
  Sparkles, Search, ListChecks, Award, FileText, BookOpen, FileCheck,
  Scale, ClipboardList, Bell, Shield, Menu, X, Moon, Sun, Globe,
  Accessibility, Contrast, Type, User, LogOut, ChevronDown, Settings as SettingsIcon, LayoutDashboard,
} from 'lucide-react';

const HEADER_NAV_ITEMS = [
  { to: '/dashboard', labelKey: 'dashboard' as const, icon: LayoutDashboard },
  { to: '/schemes', labelKey: 'schemes' as const, icon: Search },
  { to: '/services', labelKey: 'citizenServices' as const, icon: FileText },
  { to: '/states', label: 'States', toOverride: '/states', icon: Globe },
  { to: '/eligibility', labelKey: 'eligibilityChecker' as const, icon: ListChecks },
  { to: '/assistant', labelKey: 'aiAssistant' as const, icon: Sparkles },
  { to: '/about', label: 'About', toOverride: '/about', icon: BookOpen },
];

export function JanMitraLogo() {
  return (
    <svg className="w-10 h-10 filter drop-shadow-sm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#0B1F3A" />
      {/* Dynamic saffron-white-green tricolor swooshes representing digital connection */}
      <path d="M25 45 C 35 30, 65 30, 75 45" stroke="#FF9933" strokeWidth="6" strokeLinecap="round" />
      <path d="M30 52 C 40 40, 60 40, 70 52" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      <path d="M35 59 C 42 50, 58 50, 65 59" stroke="#138808" strokeWidth="6" strokeLinecap="round" />
      {/* Central yellow core star / sparkle */}
      <path d="M50 25 L53 35 L63 38 L53 41 L50 51 L47 41 L37 38 L47 35 Z" fill="#FDBA74" />
    </svg>
  );
}

export function AppShell({ children, activePath }: { children: React.ReactNode; activePath: string }) {
  const { t } = useTranslation();
  const { profile, isGuest, signOut } = useAuth();
  const { theme, toggleTheme, lang, setLang, highContrast, toggleHighContrast, largeFonts, toggleLargeFonts, accessibilityMode, toggleAccessibility } = useSettings();
  const { navigate } = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isActive = (path: string) => activePath === path || (path !== '/dashboard' && activePath.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col bg-charcoal-50 dark:bg-charcoal-950">
      {/* Tricolor Accent Bar */}
      <div className="h-1.5 w-full flex sticky top-0 z-50">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-[#FFFFFF]"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Sticky Top Header */}
      <header className="sticky top-1.5 z-40 bg-white/95 dark:bg-[#0F172A]/95 border-b border-charcoal-200/50 dark:border-charcoal-800/50 shadow-md backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden btn-ghost p-1.5 -ml-2 mr-1">
              <Menu className="w-6 h-6 text-charcoal-800 dark:text-white" />
            </button>
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <JanMitraLogo />
              </div>
              <div>
                <h1 className="font-display font-extrabold text-base lg:text-lg text-charcoal-900 dark:text-white leading-tight tracking-tight">
                  JanMitra
                </h1>
                <p className="text-[10px] lg:text-xs text-charcoal-600 dark:text-[#CBD5E1] truncate font-medium">
                  {t('tagline')}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {HEADER_NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                  isActive(item.to)
                    ? 'bg-[#0B1F3A] text-white dark:bg-[#FDBA74] dark:text-[#07111F] shadow-sm'
                    : 'text-charcoal-700 dark:text-[#CBD5E1] hover:bg-charcoal-100 dark:hover:bg-charcoal-800/60'
                }`}
              >
                {item.label ? item.label : t(item.labelKey!)}
              </Link>
            ))}
          </nav>

          {/* Header Controls & Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="btn-ghost p-2 flex items-center gap-1 text-charcoal-700 dark:text-[#CBD5E1] font-semibold"
                aria-label="Language Selector"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-semibold">
                  {languages.find((l) => l.code === lang)?.nativeName || 'English'}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setLangMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0F172A] border border-charcoal-200 dark:border-charcoal-700 shadow-2xl rounded-2xl p-1.5 max-h-72 overflow-y-auto z-40 animate-scale-in">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangMenuOpen(false); }}
                        className={`flex items-center justify-between px-3 py-2 w-full rounded-xl text-xs transition-all ${lang === l.code ? 'bg-[#FF9933]/15 text-[#FF9933] font-bold' : 'text-charcoal-700 dark:text-[#CBD5E1] hover:bg-charcoal-100 dark:hover:bg-charcoal-800/60'}`}
                      >
                        <span>{l.nativeName}</span>
                        <span className="text-[10px] opacity-75">{l.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost p-2 text-charcoal-700 dark:text-[#CBD5E1]"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FDBA74]" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <Link to="/notifications" className="btn-ghost p-2 relative text-charcoal-700 dark:text-[#CBD5E1]">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF9933] rounded-full" />
            </Link>

            {/* Accessibility Settings Toggle */}
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="btn-ghost p-2 text-charcoal-700 dark:text-[#CBD5E1]"
              aria-label="Accessibility Settings"
            >
              <Accessibility className="w-4 h-4" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 btn-ghost p-1"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B1F3A] to-[#FF9933] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {profile?.full_name?.[0]?.toUpperCase() || (isGuest ? 'G' : 'U')}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 hidden sm:block" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0F172A] border border-charcoal-200 dark:border-charcoal-700 shadow-2xl rounded-2xl p-2 z-40 animate-scale-in">
                    <div className="px-3 py-2 border-b border-charcoal-200/50 dark:border-charcoal-800/50 mb-1">
                      <p className="text-xs font-bold text-charcoal-900 dark:text-white truncate">
                        {profile?.full_name || (isGuest ? t('guestMode') : t('user'))}
                      </p>
                      <p className="text-[10px] text-charcoal-500 dark:text-charcoal-400 truncate">
                        {profile?.email || (isGuest ? t('guestNotice') : '')}
                      </p>
                      {isGuest && <span className="badge-gold mt-1.5 text-[10px]">{t('guestMode')}</span>}
                    </div>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-all">
                      <User className="w-3.5 h-3.5" /> {t('profile')}
                    </Link>
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut(); navigate('/'); }}
                      className="flex items-center gap-2 px-3 py-2 w-full rounded-xl text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" /> {t('signOut')}
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Accessibility Panel Overlay */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0F172A] border border-charcoal-200 dark:border-charcoal-700 shadow-2xl rounded-3xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4 border-b border-charcoal-200/50 dark:border-charcoal-800/50 pb-2">
              <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-[#FF9933]" /> Accessibility Panel
              </h3>
              <button onClick={() => setSettingsOpen(false)} className="btn-ghost p-1"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <button onClick={toggleAccessibility} className="flex items-center justify-between px-3 py-2 w-full rounded-xl bg-charcoal-50 dark:bg-charcoal-800 hover:bg-charcoal-100 text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
                <span>Screen Reader Optimization</span>
                <span className={accessibilityMode ? "text-[#138808]" : "text-charcoal-400"}>{accessibilityMode ? "ON" : "OFF"}</span>
              </button>
              <button onClick={toggleHighContrast} className="flex items-center justify-between px-3 py-2 w-full rounded-xl bg-charcoal-50 dark:bg-charcoal-800 hover:bg-charcoal-100 text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
                <span>High Contrast Text</span>
                <span className={highContrast ? "text-[#138808]" : "text-charcoal-400"}>{highContrast ? "ON" : "OFF"}</span>
              </button>
              <button onClick={toggleLargeFonts} className="flex items-center justify-between px-3 py-2 w-full rounded-xl bg-charcoal-50 dark:bg-charcoal-800 hover:bg-charcoal-100 text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
                <span>Large Typography</span>
                <span className={largeFonts ? "text-[#138808]" : "text-charcoal-400"}>{largeFonts ? "ON" : "OFF"}</span>
              </button>
            </div>
            <button onClick={() => setSettingsOpen(false)} className="btn-primary w-full mt-4 text-xs font-semibold">Done</button>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-[#0F172A] shadow-2xl flex flex-col animate-slide-in-right lg:hidden">
            {/* Header in mobile drawer */}
            <div className="flex items-center justify-between p-5 border-b border-charcoal-200/50 dark:border-charcoal-800/50">
              <div className="flex items-center gap-2">
                <JanMitraLogo />
                <span className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white">JanMitra</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="btn-ghost p-1.5"><X className="w-5 h-5" /></button>
            </div>

            {/* Mobile links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {HEADER_NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive(item.to)
                      ? 'bg-[#0B1F3A] text-white dark:bg-[#FDBA74] dark:text-[#07111F]'
                      : 'text-charcoal-700 dark:text-[#CBD5E1] hover:bg-charcoal-100 dark:hover:bg-charcoal-800/60'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label ? item.label : t(item.labelKey!)}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-charcoal-200/50 dark:border-charcoal-800/50 space-y-2">
              <button onClick={() => { setSidebarOpen(false); signOut(); navigate('/'); }} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Guest Notice Banner */}
      {isGuest && (
        <div className="bg-[#FF9933]/15 border-b border-[#FF9933]/25 px-4 py-2.5 text-center z-10 animate-fade-in shadow-sm">
          <p className="text-xs lg:text-sm text-charcoal-800 dark:text-[#FDBA74] font-semibold tracking-wide">
            {t('guestNotice')}{' '}
            <Link to="/" className="font-bold underline text-[#0B1F3A] dark:text-white hover:text-[#FF9933] ml-1">{t('signIn')}</Link>
          </p>
        </div>
      )}

      {/* Page Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-charcoal-200/50 dark:border-charcoal-800/50 px-4 lg:px-8 py-8 text-center text-xs text-charcoal-600 dark:text-[#CBD5E1]">
        <div className="h-1.5 w-24 flex gap-1 mx-auto mb-4">
          <div className="flex-1 bg-[#FF9933]"></div>
          <div className="flex-1 bg-charcoal-300"></div>
          <div className="flex-1 bg-[#138808]"></div>
        </div>
        <p className="font-semibold">&copy; {new Date().getFullYear()} JanMitra. {t('poweredBy')}.</p>
      </footer>
    </div>
  );
}

function SearchBar() {
  const { t } = useTranslation();
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('search')}
        className="input pl-10 py-2"
        aria-label="Search"
      />
    </form>
  );
}
