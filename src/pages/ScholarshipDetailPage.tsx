import { useEffect } from 'react';
import { useScholarship } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter } from '../router/Router';
import { useRecentlyViewed } from '../hooks/useSaved';
import { SaveButton, ShareButton, PrintButton, LoadingSpinner, EmptyState, formatDate } from '../components/ui';
import { CheckCircle2, FileText, Globe, Phone, Mail, Calendar, ArrowRight, Award, ExternalLink } from 'lucide-react';

export function ScholarshipDetailPage({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const { scholarship, loading } = useScholarship(slug);
  const { navigate } = useRouter();
  const { addRecent } = useRecentlyViewed();

  useEffect(() => {
    if (scholarship) addRecent('scholarship', scholarship.id, scholarship.title, scholarship.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scholarship?.id]);

  if (loading) return <LoadingSpinner label={t('loading')} />;
  if (!scholarship) return <EmptyState title="Scholarship not found" icon={<Award className="w-8 h-8" />} />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button onClick={() => navigate('/scholarships')} className="btn-ghost mb-4">
        <ArrowRight className="w-4 h-4 rotate-180" /> {t('backToScholarships')}
      </button>

      <div className="glass-card p-6 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={scholarship.level === 'central' ? 'badge-emerald' : scholarship.level === 'state' ? 'badge-gold' : 'badge-charcoal'}>
            {scholarship.level === 'central' ? 'Central' : scholarship.level === 'state' ? scholarship.state || 'State' : 'Private'}
          </span>
          {scholarship.category && <span className="badge-charcoal">{scholarship.category}</span>}
        </div>
        <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white mb-2">{scholarship.title}</h1>
        {scholarship.provider && <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-3">By {scholarship.provider}</p>}
        <div className="flex flex-wrap gap-2">
          <SaveButton itemType="scholarship" itemId={scholarship.id} itemTitle={scholarship.title} />
          <ShareButton title={scholarship.title} />
          <PrintButton />
        </div>
      </div>

      {scholarship.description && (
        <Section title="Description">
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">{scholarship.description}</p>
        </Section>
      )}

      {scholarship.eligibility && (
        <Section title={t('eligibility')} icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}>
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">{scholarship.eligibility}</p>
        </Section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {scholarship.amount && (
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-gold-500" />
              <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400">{t('amount')}</p>
            </div>
            <p className="text-sm text-charcoal-900 dark:text-white">{scholarship.amount}</p>
          </div>
        )}
        {scholarship.deadline && (
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gold-500" />
              <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400">{t('deadline')}</p>
            </div>
            <p className="text-sm text-charcoal-900 dark:text-white">{formatDate(scholarship.deadline)}</p>
          </div>
        )}
      </div>

      {scholarship.documents.length > 0 && (
        <Section title={t('requiredDocuments')} icon={<FileText className="w-5 h-5 text-emerald-500" />}>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {scholarship.documents.map((doc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-charcoal-600 dark:text-charcoal-300 p-3 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                <FileText className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Apply">
        <div className="flex flex-wrap gap-3">
          {scholarship.application_link && (
            <a href={scholarship.application_link} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
              <ExternalLink className="w-4 h-4" /> {t('applyNow')}
            </a>
          )}
          {scholarship.official_website && (
            <a href={scholarship.official_website} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
              <Globe className="w-4 h-4" /> {t('officialWebsite')}
            </a>
          )}
        </div>
      </Section>

      {(scholarship.contact_info.helpline || scholarship.contact_info.email) && (
        <Section title={t('contact')}>
          <div className="flex flex-wrap gap-4">
            {scholarship.contact_info.helpline && (
              <div className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                <Phone className="w-4 h-4 text-emerald-500" /> {scholarship.contact_info.helpline}
              </div>
            )}
            {scholarship.contact_info.email && (
              <div className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                <Mail className="w-4 h-4 text-emerald-500" /> {scholarship.contact_info.email}
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
