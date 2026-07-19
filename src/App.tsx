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

function AppContent() {
  const { loading, user, isGuest } = useAuth();
  const { path } = useRouter();

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

  // Parse route
  const cleanPath = path.split('?')[0];
  const segments = cleanPath.split('/').filter(Boolean);

  let page: React.ReactNode;
  let activePath = '/dashboard';

  if (cleanPath === '/' || cleanPath === '') {
    page = <DashboardPage />;
    activePath = '/dashboard';
  } else if (cleanPath === '/dashboard') {
    page = <DashboardPage />;
    activePath = '/dashboard';
  } else if (cleanPath === '/assistant') {
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
