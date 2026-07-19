import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { RouterProvider, useRouter } from './router/Router';
import { AppShell } from './components/AppShell';
import { FloatingAssistant } from './components/FloatingAssistant';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssistantPage } from './pages/AssistantPage';
import { EligibilityPage } from './pages/EligibilityPage';
import { SchemesPage } from './pages/SchemesPage';
import { SchemeDetailPage } from './pages/SchemeDetailPage';
import { ScholarshipsPage } from './pages/ScholarshipsPage';
import { ScholarshipDetailPage } from './pages/ScholarshipDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { PolicyDetailPage } from './pages/PolicyDetailPage';
import { FormsPage } from './pages/FormsPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SearchPage } from './pages/SearchPage';
import { AdminPage } from './pages/AdminPage';
import { StatesPage } from './pages/StatesPage';
import { StateDetailPage } from './pages/StateDetailPage';
import { CentralSchemesPage } from './pages/CentralSchemesPage';
import { AboutPage } from './pages/AboutPage';
import { isSupabaseConfigured } from './lib/supabase';

function AppContent() {
  const { loading, user, isGuest } = useAuth();
  const { path } = useRouter();

  // Parse route
  const cleanPath = path.split('?')[0];
  const segments = cleanPath.split('/').filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-50 dark:bg-charcoal-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center animate-pulse-soft">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div className="w-8 h-8 border-3 border-emerald-200 dark:border-emerald-900 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Not authenticated and not guest -> show landing page (with /auth route showing the auth form)
  if (!user && !isGuest) {
    if (cleanPath === '/auth') return <AuthPage />;
    return <LandingPage />;
  }

  let page: React.ReactNode;
  let activePath = '/dashboard';

  if (cleanPath === '/' || cleanPath === '') {
    page = <DashboardPage />;
    activePath = '/dashboard';
  } else if (cleanPath === '/dashboard') {
    page = <DashboardPage />;
    activePath = '/dashboard';
  } else if (cleanPath === '/assistant' || cleanPath === '/ai-assistant') {
    page = <AssistantPage />;
    activePath = '/assistant';
  } else if (cleanPath === '/eligibility') {
    page = <EligibilityPage />;
    activePath = '/eligibility';
  } else if (cleanPath === '/schemes' || cleanPath.startsWith('/schemes?')) {
    page = <SchemesPage />;
    activePath = '/schemes';
  } else if (segments[0] === 'schemes' && segments[1]) {
    page = <SchemeDetailPage slug={segments[1]} />;
    activePath = '/schemes';
  } else if (cleanPath === '/scholarships') {
    page = <ScholarshipsPage />;
    activePath = '/scholarships';
  } else if (segments[0] === 'scholarships' && segments[1]) {
    page = <ScholarshipDetailPage slug={segments[1]} />;
    activePath = '/scholarships';
  } else if (cleanPath === '/services') {
    page = <ServicesPage />;
    activePath = '/services';
  } else if (segments[0] === 'services' && segments[1]) {
    page = <ServiceDetailPage slug={segments[1]} />;
    activePath = '/services';
  } else if (cleanPath === '/documents') {
    page = <DocumentsPage />;
    activePath = '/documents';
  } else if (cleanPath === '/policies') {
    page = <PoliciesPage />;
    activePath = '/policies';
  } else if (segments[0] === 'policies' && segments[1]) {
    page = <PolicyDetailPage slug={segments[1]} />;
    activePath = '/policies';
  } else if (cleanPath === '/forms') {
    page = <FormsPage />;
    activePath = '/forms';
  } else if (cleanPath === '/complaints') {
    page = <ComplaintsPage />;
    activePath = '/complaints';
  } else if (cleanPath === '/notifications') {
    page = <NotificationsPage />;
    activePath = '/notifications';
  } else if (cleanPath === '/states') {
    page = <StatesPage />;
    activePath = '/states';
  } else if (segments[0] === 'states' && segments[1]) {
    page = <StateDetailPage slug={segments[1]} />;
    activePath = '/states';
  } else if (cleanPath === '/central-schemes') {
    page = <CentralSchemesPage />;
    activePath = '/schemes';
  } else if (cleanPath === '/about') {
    page = <AboutPage />;
    activePath = '/about';
  } else if (cleanPath === '/profile') {
    page = <ProfilePage />;
    activePath = '/profile';
  } else if (cleanPath === '/settings') {
    page = <ProfilePage />;
    activePath = '/profile';
  } else if (cleanPath === '/admin') {
    page = <AdminPage />;
    activePath = '/admin';
  } else if (cleanPath.startsWith('/search')) {
    page = <SearchPage />;
    activePath = '/schemes';
  } else {
    page = (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="font-display font-extrabold text-3xl text-charcoal-900 dark:text-white mb-2">404</h1>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Page not found.</p>
      </div>
    );
    activePath = '/dashboard';
  }

  return (
    <>
      <AppShell activePath={activePath}>{page}</AppShell>
      <FloatingAssistant />
    </>
  );
}

function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-900 text-white p-6 font-sans">
        <div className="max-w-md w-full bg-charcoal-800 rounded-3xl p-8 border border-charcoal-700/50 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h1 className="font-extrabold text-xl">Setup Required</h1>
              <p className="text-xs text-charcoal-400">JanMitra Environment Configuration</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-charcoal-300">
            <p>
              JanMitra is running, but it cannot connect to the database because the environment variables are not configured.
            </p>
            <div className="bg-charcoal-950 p-4 rounded-xl font-mono text-xs text-orange-400 border border-charcoal-800 space-y-1">
              <div>• VITE_SUPABASE_URL is missing</div>
              <div>• VITE_SUPABASE_ANON_KEY is missing</div>
            </div>
            <p className="text-xs text-charcoal-400">
              If deploying on Render, please go to your service dashboard, open the <strong>Environment</strong> tab, and add these keys with their correct values, then save.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SettingsProvider>
      <AuthProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
