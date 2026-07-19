import { useNotifications } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { Link } from '../router/Router';
import { Bell, ArrowRight, ExternalLink, Calendar, Info } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '../components/ui';

export function NotificationsPage() {
  const { t } = useTranslation();
  const { notifications, loading } = useNotifications();

  // Filter out notifications older than 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const currentNotifications = notifications.filter((n) => new Date(n.created_at) > sixMonthsAgo);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-600/20">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">{t('notifications')}</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Latest government announcements, scheme updates, and deadlines.</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label={t('loading')} />
      ) : currentNotifications.length === 0 ? (
        <EmptyState
          title="No recent verified updates available"
          description="There are no current government announcements to display. Please check back later or browse our schemes and services directly."
          icon={<Info className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-3">
          {currentNotifications.map((n) => (
            <Link key={n.id} to={n.link || '#'} className="block">
              <div className="glass-card p-5 hover:scale-[1.01] transition-transform">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    n.type === 'reminder' ? 'bg-gold-100 dark:bg-gold-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'
                  }`}>
                    <Bell className={`w-5 h-5 ${n.type === 'reminder' ? 'text-gold-600 dark:text-gold-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`badge ${n.type === 'reminder' ? 'badge-gold' : n.type === 'scholarship' ? 'badge-emerald' : 'badge-charcoal'}`}>
                        {n.type === 'reminder' ? 'Reminder' : n.type === 'scholarship' ? 'Scholarship' : n.type === 'scheme' ? 'Scheme' : 'Announcement'}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-charcoal-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {n.target_audience && n.target_audience !== 'all' && (
                        <span className="badge-charcoal">{n.target_audience}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-charcoal-900 dark:text-white mb-1">{n.title}</h3>
                    {n.body && <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{n.body}</p>}
                    {n.link && (
                      <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                        {t('viewDetails')} <ExternalLink className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
