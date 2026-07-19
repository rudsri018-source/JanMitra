import { useEffect } from 'react';
import { useScheme, useMinistries } from '../hooks/useData';
import { getSchemeStatus } from '../lib/eligibility';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter, Link } from '../router/Router';
import { useRecentlyViewed } from '../hooks/useSaved';
import { SaveButton, ShareButton, PrintButton, LoadingSpinner, EmptyState } from '../components/ui';
import {
  CheckCircle2, FileText, Globe, Youtube, Phone, Mail, Calendar, MapPin,
  HelpCircle, ArrowRight, ListChecks, FileCheck, ClipboardList, Award,
} from 'lucide-react';

export function SchemeDetailPage({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const { scheme, loading } = useScheme(slug);
  const { ministries } = useMinistries();
  const { navigate } = useRouter();
  const { addRecent } = useRecentlyViewed();

  useEffect(() => {
    if (scheme) {
      addRecent('scheme', scheme.id, scheme.title, scheme.slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheme?.id]);

  if (loading) return <LoadingSpinner label={t('loading')} />;
  if (!scheme) return <EmptyState title="Scheme not found" description="The scheme you're looking for doesn't exist or has been removed." icon={<FileText className="w-8 h-8" />} />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button onClick={() => navigate('/schemes')} className="btn-ghost mb-4">
        <ArrowRight className="w-4 h-4 rotate-180" /> {t('backToSchemes')}
      </button>

      {/* Header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={scheme.level === 'central' ? 'badge-emerald' : 'badge-gold'}>
            {scheme.level === 'central' ? 'Central Scheme' : `${scheme.state} State Scheme`}
          </span>
          {scheme.trending && <span className="badge-gold">Trending</span>}
          {(() => {
            const status = getSchemeStatus(scheme);
            const statusConfig: Record<string, { label: string; cls: string }> = {
              open: { label: 'Open', cls: 'badge-emerald' },
              closing_soon: { label: 'Closing Soon', cls: 'badge-gold' },
              closed: { label: 'Closed', cls: 'badge-charcoal' },
              upcoming: { label: 'Upcoming', cls: 'badge-charcoal' },
            };
            const sc = statusConfig[status] || statusConfig.open;
            return <span className={`badge ${sc.cls}`}>{sc.label}</span>;
          })()}
        </div>
        <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white mb-2">{scheme.title}</h1>
        <p className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-4">{scheme.short_description}</p>
        {scheme.ministry_id && (() => {
          const ministry = ministries.find((m) => m.id === scheme.ministry_id);
          return ministry ? (
            <div className="flex items-center gap-2 text-xs text-charcoal-500 dark:text-charcoal-400 mb-3">
              <span className="font-semibold">Ministry:</span> {ministry.name}
            </div>
          ) : null;
        })()}
        <div className="flex flex-wrap gap-2">
          <SaveButton itemType="scheme" itemId={scheme.id} itemTitle={scheme.title} />
          <ShareButton title={scheme.title} />
          <PrintButton />
          <Link to={`/eligibility`} className="btn-ghost">
            <ListChecks className="w-4 h-4" /> {t('checkEligibility')}
          </Link>
          <Link to={`/documents?scheme=${scheme.id}`} className="btn-ghost">
            <FileCheck className="w-4 h-4" /> {t('documentChecklist')}
          </Link>
          <Link to={`/forms?scheme=${scheme.id}`} className="btn-ghost">
            <ClipboardList className="w-4 h-4" /> {t('formSteps')}
          </Link>
        </div>
      </div>

      {/* Description */}
      {scheme.description && (
        <Section title="Description">
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">{scheme.description}</p>
        </Section>
      )}

      {/* Eligibility */}
      {scheme.eligibility && (
        <Section title={t('eligibility')} icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}>
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">{scheme.eligibility}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {scheme.income_limit && (
              <div className="p-3 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 mb-1">Income Limit</p>
                <p className="text-sm text-charcoal-900 dark:text-white">{scheme.income_limit}</p>
              </div>
            )}
            {scheme.age_limit && (
              <div className="p-3 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 mb-1">Age Limit</p>
                <p className="text-sm text-charcoal-900 dark:text-white">{scheme.age_limit}</p>
              </div>
            )}
            {scheme.gender_restriction && (
              <div className="p-3 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 mb-1">Gender</p>
                <p className="text-sm text-charcoal-900 dark:text-white">{scheme.gender_restriction}</p>
              </div>
            )}
            {scheme.category_requirement && (
              <div className="p-3 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 mb-1">Category</p>
                <p className="text-sm text-charcoal-900 dark:text-white">{scheme.category_requirement}</p>
              </div>
            )}
            {scheme.education_requirement && (
              <div className="p-3 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 mb-1">Education</p>
                <p className="text-sm text-charcoal-900 dark:text-white">{scheme.education_requirement}</p>
              </div>
            )}
            {scheme.disability_criteria && (
              <div className="p-3 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 mb-1">Disability</p>
                <p className="text-sm text-charcoal-900 dark:text-white">{scheme.disability_criteria}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Benefits */}
      {scheme.benefits && (
        <Section title={t('benefits')} icon={<Award className="w-5 h-5 text-gold-500" />}>
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-3">{scheme.benefits}</p>
          {scheme.benefits_list.length > 0 && (
            <ul className="space-y-2">
              {scheme.benefits_list.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {/* Required Documents */}
      {scheme.required_documents.length > 0 && (
        <Section title={t('requiredDocuments')} icon={<FileText className="w-5 h-5 text-emerald-500" />}>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {scheme.required_documents.map((doc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-charcoal-600 dark:text-charcoal-300 p-3 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                <FileText className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Online Process */}
      {scheme.online_process && (
        <Section title={t('onlineProcess')}>
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">{scheme.online_process}</p>
        </Section>
      )}

      {/* Offline Process */}
      {scheme.offline_process && (
        <Section title={t('offlineProcess')}>
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">{scheme.offline_process}</p>
        </Section>
      )}

      {/* Official Links */}
      <Section title="Official Resources">
        <div className="flex flex-wrap gap-3">
          {scheme.official_website && (
            <a href={scheme.official_website} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
              <Globe className="w-4 h-4" /> {t('officialWebsite')}
            </a>
          )}
          {scheme.official_pdf && (
            <a href={scheme.official_pdf} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
              <FileText className="w-4 h-4" /> {t('officialPdf')}
            </a>
          )}
          {scheme.video_guide && (
            <a href={scheme.video_guide} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
              <Youtube className="w-4 h-4" /> {t('videoGuide')}
            </a>
          )}
        </div>
      </Section>

      {/* Contact */}
      {(scheme.contact_info.helpline || scheme.contact_info.email) && (
        <Section title={t('contact')}>
          <div className="flex flex-wrap gap-4">
            {scheme.contact_info.helpline && (
              <div className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                <Phone className="w-4 h-4 text-emerald-500" /> {scheme.contact_info.helpline}
              </div>
            )}
            {scheme.contact_info.email && (
              <div className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                <Mail className="w-4 h-4 text-emerald-500" /> {scheme.contact_info.email}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Dates + State Availability */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {scheme.open_date && (
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400">Opening Date</p>
            </div>
            <p className="text-sm text-charcoal-900 dark:text-white">{new Date(scheme.open_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        )}
        {scheme.close_date && (
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gold-500" />
              <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400">Closing Date</p>
            </div>
            <p className="text-sm text-charcoal-900 dark:text-white">{new Date(scheme.close_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        )}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400">{t('stateAvailability')}</p>
          </div>
          <p className="text-sm text-charcoal-900 dark:text-white">
            {scheme.level === 'central' ? 'All States & UTs' : scheme.state || 'All States'}
          </p>
        </div>
      </div>
      {scheme.last_verified_at && (
        <div className="text-xs text-charcoal-400 dark:text-charcoal-500 mb-6 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Last verified: {new Date(scheme.last_verified_at).toLocaleDateString('en-IN')}
        </div>
      )}

      {/* FAQs */}
      {(scheme.faqs.length > 0 || (scheme.faq_list && scheme.faq_list.length > 0)) && (
        <Section title={t('faqs')} icon={<HelpCircle className="w-5 h-5 text-emerald-500" />}>
          <div className="space-y-3">
            {(scheme.faq_list.length > 0 ? scheme.faq_list : scheme.faqs).map((faq, i) => (
              <div key={i} className="p-4 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                <p className="font-semibold text-sm text-charcoal-900 dark:text-white mb-1">Q: {faq.q}</p>
                <p className="text-sm text-charcoal-600 dark:text-charcoal-300">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* CTA */}
      <div className="glass-card p-6 text-center bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-charcoal-900">
        <h3 className="font-display font-bold text-lg text-charcoal-900 dark:text-white mb-2">Ready to apply?</h3>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">Check your eligibility and get a personalized document checklist.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/eligibility" className="btn-primary">{t('checkEligibility')}</Link>
          {scheme.official_website && (
            <a href={scheme.official_website} target="_blank" rel="noopener noreferrer" className="btn-gold">
              {t('applyNow')} <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
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
