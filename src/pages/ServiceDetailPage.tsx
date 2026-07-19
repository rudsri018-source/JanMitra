import { useEffect } from 'react';
import { useService } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter, Link } from '../router/Router';
import { useRecentlyViewed } from '../hooks/useSaved';
import { SaveButton, ShareButton, PrintButton, LoadingSpinner, EmptyState } from '../components/ui';
import {
  CheckCircle2, FileText, Phone, Mail, HelpCircle, ArrowRight, AlertTriangle,
  ListChecks, FileCheck, ClipboardList, ExternalLink, Clock, Wallet,
} from 'lucide-react';

export function ServiceDetailPage({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const { service, loading } = useService(slug);
  const { navigate } = useRouter();
  const { addRecent } = useRecentlyViewed();

  useEffect(() => {
    if (service) addRecent('service', service.id, service.title, service.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service?.id]);

  if (loading) return <LoadingSpinner label={t('loading')} />;
  if (!service) return <EmptyState title="Service not found" icon={<FileText className="w-8 h-8" />} />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button onClick={() => navigate('/services')} className="btn-ghost mb-4">
        <ArrowRight className="w-4 h-4 rotate-180" /> {t('backToServices')}
      </button>

      <div className="glass-card p-6 mb-6">
        {service.category && <span className="badge-emerald mb-3">{service.category}</span>}
        <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white mb-2">{service.title}</h1>
        <div className="flex flex-wrap gap-2">
          <SaveButton itemType="service" itemId={service.id} itemTitle={service.title} />
          <ShareButton title={service.title} />
          <PrintButton />
          <Link to={`/documents?service=${service.id}`} className="btn-ghost">
            <FileCheck className="w-4 h-4" /> {t('documentChecklist')}
          </Link>
          <Link to={`/forms?service=${service.id}`} className="btn-ghost">
            <ClipboardList className="w-4 h-4" /> {t('formSteps')}
          </Link>
        </div>
      </div>

      {service.what_is && (
        <Section title={t('whatIs')}>
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">{service.what_is}</p>
        </Section>
      )}

      {service.eligibility && (
        <Section title={t('eligibility')} icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}>
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">{service.eligibility}</p>
        </Section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {service.fees && (
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-gold-500" />
              <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400">{t('fees')}</p>
            </div>
            <p className="text-sm text-charcoal-900 dark:text-white">{service.fees}</p>
          </div>
        )}
        {service.timeline && (
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400">{t('timeline')}</p>
            </div>
            <p className="text-sm text-charcoal-900 dark:text-white">{service.timeline}</p>
          </div>
        )}
      </div>

      {service.required_documents.length > 0 && (
        <Section title={t('requiredDocuments')} icon={<FileText className="w-5 h-5 text-emerald-500" />}>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {service.required_documents.map((doc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-charcoal-600 dark:text-charcoal-300 p-3 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                <FileText className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {service.online_steps.length > 0 && (
        <Section title={t('onlineSteps')} icon={<ListChecks className="w-5 h-5 text-emerald-500" />}>
          <ol className="space-y-3">
            {service.online_steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <p className="text-sm text-charcoal-600 dark:text-charcoal-300 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {service.offline_process && (
        <Section title={t('offlineProcess')}>
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">{service.offline_process}</p>
        </Section>
      )}

      {service.common_mistakes.length > 0 && (
        <Section title={t('commonMistakes')} icon={<AlertTriangle className="w-5 h-5 text-gold-500" />}>
          <ul className="space-y-2">
            {service.common_mistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-charcoal-600 dark:text-charcoal-300 p-3 rounded-xl bg-gold-50 dark:bg-gold-900/20">
                <AlertTriangle className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {service.faqs.length > 0 && (
        <Section title={t('faqs')} icon={<HelpCircle className="w-5 h-5 text-emerald-500" />}>
          <div className="space-y-3">
            {service.faqs.map((faq, i) => (
              <div key={i} className="p-4 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                <p className="font-semibold text-sm text-charcoal-900 dark:text-white mb-1">Q: {faq.q}</p>
                <p className="text-sm text-charcoal-600 dark:text-charcoal-300">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {service.official_links.length > 0 && (
        <Section title={t('officialLinks')}>
          <div className="flex flex-wrap gap-3">
            {service.official_links.map((link, i) => (
              <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                <ExternalLink className="w-4 h-4" /> {link.replace(/^https?:\/\//, '').split('/')[0]}
              </a>
            ))}
          </div>
        </Section>
      )}

      {(service.contact_info.helpline || service.contact_info.email) && (
        <Section title={t('contact')}>
          <div className="flex flex-wrap gap-4">
            {service.contact_info.helpline && (
              <div className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                <Phone className="w-4 h-4 text-emerald-500" /> {service.contact_info.helpline}
              </div>
            )}
            {service.contact_info.email && (
              <div className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                <Mail className="w-4 h-4 text-emerald-500" /> {service.contact_info.email}
              </div>
            )}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="glass-card p-6 mb-4">
      <h2 className="font-display font-bold text-lg text-charcoal-900 dark:text-white mb-3 flex items-center gap-2">
        {icon}{title}
      </h2>
      {children}
    </div>
  );
}
