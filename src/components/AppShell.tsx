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

const NAV_ITEMS = [
  { to: '/dashboard', labelKey: 'dashboard' as const, icon: LayoutDashboard },
  { to: '/assistant', labelKey: 'aiAssistant' as const, icon: Sparkles },
  { to: '/eligibility', labelKey: 'eligibilityChecker' as const, icon: ListChecks },
  { to: '/schemes', labelKey: 'schemes' as const, icon: Search },
  { to: '/scholarships', labelKey: 'scholarships' as const, icon: Award },
  { to: '/services', labelKey: 'citizenServices' as const, icon: FileText },
  { to: '/documents', labelKey: 'documentAssistant' as const, icon: FileCheck },
  { to: '/policies', labelKey: 'policyLibrary' as const, icon: BookOpen },
  { to: '/forms', labelKey: 'formAssistant' as const, icon: ClipboardList },
  { to: '/complaints', labelKey: 'complaints' as const, icon: Scale },
  { to: '/notifications', labelKey: 'notifications' as const, icon: Bell },
];

export function AppShell({ children, activePath }: { children: React.ReactNode; activePath: string }) {
  const { t } = useTranslation();
  const { profile, isGuest, signOut } = useAuth();
  const { theme, toggleTheme, lang, setLang, highContrast, toggleHighContrast, largeFonts, toggleLargeFonts, accessibilityMode, toggleAccessibility } = useSettings();
  const { navigate } = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';
  const navItems = isAdmin ? [...NAV_ITEMS, { to: '/admin', labelKey: 'admin' as const, icon: Shield }] : NAV_ITEMS;

  const isActive = (path: string) => activePath === path || (path !== '/dashboard' && activePath.startsWith(path));

  return (
    <div className="min-h-screen flex bg-charcoal-50 dark:bg-charcoal-950">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 glass-nav border-r border-charcoal-200/50 dark:border-charcoal-800/50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-3 p-5 border-b border-charcoal-200/50 dark:border-charcoal-800/50">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white leading-tight">{t('appName')}</h1>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">{t('poweredBy')}</p>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto btn-ghost p-1.5">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.to)
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{t(item.labelKey)}</span>
              </Link>
            ))}
          </nav>

          {/* Settings panel */}
          <div className="p-3 border-t border-charcoal-200/50 dark:border-charcoal-800/50">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-all"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>{t('settings')}</span>
              <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
            </button>
            {settingsOpen && (
              <div className="mt-2 space-y-1 animate-fade-in">
                <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-all">
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{theme === 'dark' ? t('light') : t('dark')} {t('theme')}</span>
                </button>
                <div className="relative">
                  <button onClick={() => setLangMenuOpen(!langMenuOpen)} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-all">
                    <Globe className="w-4 h-4" />
                    <span>{languages.find(l => l.code === lang)?.nativeName || 'English'}</span>
                    <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {langMenuOpen && (
                    <div className="mt-1 ml-2 w-48 glass rounded-xl p-1 max-h-72 overflow-y-auto z-50 animate-scale-in">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { setLang(l.code); setLangMenuOpen(false); }}
                          className={`flex items-center justify-between px-3 py-2 w-full rounded-lg text-sm transition-all ${lang === l.code ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold' : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800'}`}
                        >
                          <span>{l.nativeName}</span>
                          <span className="text-xs text-charcoal-400">{l.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={toggleAccessibility} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-all">
                  <Accessibility className={`w-4 h-4 ${accessibilityMode ? 'text-emerald-600' : ''}`} />
                  <span>{t('accessibility')}</span>
                </button>
                <button onClick={toggleHighContrast} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-all">
                  <Contrast className={`w-4 h-4 ${highContrast ? 'text-emerald-600' : ''}`} />
                  <span>{t('highContrast')}</span>
                </button>
                <button onClick={toggleLargeFonts} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-all">
                  <Type className={`w-4 h-4 ${largeFonts ? 'text-emerald-600' : ''}`} />
                  <span>{t('largeFonts')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 glass-nav border-b border-charcoal-200/50 dark:border-charcoal-800/50 px-4 lg:px-8 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden btn-ghost p-1.5">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 max-w-xl">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2">
            <Link to="/notifications" className="btn-ghost p-2 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full animate-pulse-soft" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 btn-ghost p-1.5"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-semibold">
                  {profile?.full_name?.[0]?.toUpperCase() || (isGuest ? 'G' : 'U')}
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {profile?.full_name || (isGuest ? t('guest') : t('user'))}
                </span>
                <ChevronDown className="w-4 h-4 hidden md:block" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 glass rounded-2xl p-2 z-40 animate-scale-in">
                    <div className="px-3 py-2 border-b border-charcoal-200/50 dark:border-charcoal-800/50 mb-1">
                      <p className="text-sm font-semibold text-charcoal-900 dark:text-white truncate">
                        {profile?.full_name || (isGuest ? t('guestMode') : t('user'))}
                      </p>
                      <p className="text-xs text-charcoal-500 dark:text-charcoal-400 truncate">
                        {profile?.email || (isGuest ? t('guestNotice') : '')}
                      </p>
                      {isGuest && <span className="badge-gold mt-1">{t('guestMode')}</span>}
                      {isAdmin && <span className="badge-emerald mt-1">Admin</span>}
                    </div>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-all">
                      <User className="w-4 h-4" /> {t('profile')}
                    </Link>
                    <Link to="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-all">
                      <SettingsIcon className="w-4 h-4" /> {t('settings')}
                    </Link>
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut(); navigate('/'); }}
                      className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <LogOut className="w-4 h-4" /> {t('signOut')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Guest notice */}
        {isGuest && (
          <div className="bg-gold-50 dark:bg-gold-900/20 border-b border-gold-200 dark:border-gold-800/50 px-4 lg:px-8 py-2 text-center">
            <p className="text-sm text-gold-800 dark:text-gold-200">
              {t('guestNotice')}{' '}
              <Link to="/" className="font-semibold underline">{t('signIn')}</Link>
            </p>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-charcoal-200/50 dark:border-charcoal-800/50 px-4 lg:px-8 py-6 text-center text-xs text-charcoal-500 dark:text-charcoal-400">
          <p>&copy; {new Date().getFullYear()} {t('appName')}. {t('poweredBy')}.</p>
        </footer>
      </div>
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
