import { useEffect, useState, useMemo } from 'react';
import { useScheme, useMinistries } from '../hooks/useData';
import { getSchemeStatus } from '../lib/eligibility';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter, Link } from '../router/Router';
import { useRecentlyViewed } from '../hooks/useSaved';
import { SaveButton, ShareButton, PrintButton, LoadingSpinner, EmptyState } from '../components/ui';
import {
  CheckCircle2, FileText, Globe, Youtube, Phone, Mail, Calendar, MapPin,
  HelpCircle, ArrowRight, ListChecks, FileCheck, ClipboardList, Award,
  Info, ExternalLink, Bookmark, Shield, AlertTriangle
} from 'lucide-react';

export function SchemeDetailPage({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const { scheme, loading } = useScheme(slug);
  const { ministries } = useMinistries();
  const { navigate } = useRouter();
  const { addRecent } = useRecentlyViewed();
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (scheme) {
      addRecent('scheme', scheme.id, scheme.title, scheme.slug);
    }
  }, [scheme?.id]);

  // Define sections with their labels and presence conditions
  const sections = useMemo(() => {
    if (!scheme) return [];
    return [
      { id: 'overview', label: 'Overview', show: true },
      { id: 'benefits', label: 'Benefits', show: !!scheme.benefits },
      { id: 'eligibility', label: 'Eligibility', show: !!scheme.eligibility },
      { id: 'income', label: 'Income Limit', show: !!scheme.income_limit },
      { id: 'age', label: 'Age Limit', show: !!scheme.age_limit },
      { id: 'gender', label: 'Gender Restriction', show: !!scheme.gender_restriction },
      { id: 'caste', label: 'Category / Caste', show: !!scheme.category_requirement },
      { id: 'education', label: 'Education', show: !!scheme.education_requirement },
      { id: 'disability', label: 'Disability Criteria', show: !!scheme.disability_criteria },
      { id: 'documents', label: 'Required Documents', show: scheme.required_documents.length > 0 },
      { id: 'online', label: 'Online Process', show: !!scheme.online_process },
      { id: 'offline', label: 'Offline Process', show: !!scheme.offline_process },
      { id: 'fees', label: 'Application Fees', show: true }, // Defaults to free unless specified
      { id: 'timeline', label: 'Timeline & Deadlines', show: !!scheme.open_date || !!scheme.close_date },
      { id: 'faqs', label: 'FAQs', show: scheme.faqs.length > 0 || (scheme.faq_list && scheme.faq_list.length > 0) },
      { id: 'official-links', label: 'Official Links', show: !!scheme.official_website || !!scheme.official_pdf },
      { id: 'contact', label: 'Contact Helpline', show: !!scheme.contact_info?.helpline || !!scheme.contact_info?.email },
    ].filter(s => s.show);
  }, [scheme]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return <LoadingSpinner label={t('loading')} />;
  if (!scheme) return <EmptyState title="Scheme not found" description="The scheme you are looking for doesn't exist or has been removed." icon={<FileText className="w-8 h-8" />} />;

  return (
    <div className="animate-fade-in relative max-w-7xl mx-auto">
      {/* Back button */}
      <button onClick={() => navigate('/schemes')} className="btn-ghost mb-6 flex items-center gap-1.5">
        <ArrowRight className="w-4 h-4 rotate-180" /> {t('backToSchemes')}
      </button>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start mb-24">
        
        {/* Desktop Left Sticky Navigation Menu */}
        <aside className="hidden lg:block lg:col-span-1 bg-white dark:bg-[#0F172A] border border-charcoal-200 dark:border-charcoal-800 rounded-3xl p-5 shadow-sm sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto">
          <h3 className="font-display font-extrabold text-[10px] text-charcoal-400 dark:text-[#CBD5E1] uppercase tracking-wider mb-4 border-b border-charcoal-200 dark:border-charcoal-800 pb-2">Scheme Sections</h3>
          <nav className="space-y-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === sec.id
                    ? 'bg-[#FF9933]/15 text-[#FF9933]'
                    : 'text-charcoal-600 dark:text-[#CBD5E1] hover:bg-charcoal-50 dark:hover:bg-charcoal-800'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Scheme Detail Main Content Panel */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          
          {/* Header Card */}
          <div className="glass-card p-6">
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
            <h1 className="font-display font-extrabold text-xl lg:text-2xl text-charcoal-900 dark:text-white mb-2">{scheme.title}</h1>
            <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1] leading-relaxed mb-4">{scheme.short_description}</p>
            {scheme.ministry_id && (() => {
              const ministry = ministries.find((m) => m.id === scheme.ministry_id);
              return ministry ? (
                <div className="flex items-center gap-2 text-xs text-charcoal-400 mb-4">
                  <span className="font-bold">Ministry:</span> {ministry.name}
                </div>
              ) : null;
            })()}
            
            {/* Header Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-charcoal-200/50 dark:border-charcoal-800/50">
              <SaveButton itemType="scheme" itemId={scheme.id} itemTitle={scheme.title} />
              <ShareButton title={scheme.title} />
              <PrintButton />
              <Link to="/eligibility" className="btn-ghost text-xs">
                <ListChecks className="w-4 h-4" /> Verify Eligibility
              </Link>
            </div>
          </div>

          {/* 1. Overview */}
          <section id="overview" className="glass-card p-6 scroll-mt-28">
            <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Info className="w-4.5 h-4.5 text-[#FF9933]" /> Description / Overview
            </h2>
            <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1] leading-relaxed">{scheme.description || 'No description available.'}</p>
          </section>

          {/* 2. Benefits */}
          {scheme.benefits && (
            <section id="benefits" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-[#138808]" /> Benefits
              </h2>
              <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1] mb-4">{scheme.benefits}</p>
              {scheme.benefits_list && scheme.benefits_list.length > 0 && (
                <ul className="space-y-2">
                  {scheme.benefits_list.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* 3. Eligibility Criteria */}
          {scheme.eligibility && (
            <section id="eligibility" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <ListChecks className="w-4.5 h-4.5 text-[#FF9933]" /> Eligibility Details
              </h2>
              <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1] leading-relaxed mb-4">{scheme.eligibility}</p>
            </section>
          )}

          {/* 4. Income Limit */}
          {scheme.income_limit && (
            <section id="income" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-[#138808]" /> Income Limit
              </h2>
              <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1]">{scheme.income_limit}</p>
            </section>
          )}

          {/* 5. Age Limit */}
          {scheme.age_limit && (
            <section id="age" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-[#FF9933]" /> Age Limit
              </h2>
              <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1]">{scheme.age_limit}</p>
            </section>
          )}

          {/* 6. Gender Restriction */}
          {scheme.gender_restriction && (
            <section id="gender" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Info className="w-4.5 h-4.5 text-[#138808]" /> Gender Restrictions
              </h2>
              <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1]">{scheme.gender_restriction}</p>
            </section>
          )}

          {/* 7. Caste / Category */}
          {scheme.category_requirement && (
            <section id="caste" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-[#FF9933]" /> Caste / Category Requirements
              </h2>
              <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1]">{scheme.category_requirement}</p>
            </section>
          )}

          {/* 8. Education */}
          {scheme.education_requirement && (
            <section id="education" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-[#138808]" /> Educational Qualifications
              </h2>
              <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1]">{scheme.education_requirement}</p>
            </section>
          )}

          {/* 9. Disability */}
          {scheme.disability_criteria && (
            <section id="disability" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Info className="w-4.5 h-4.5 text-[#FF9933]" /> Disability Criteria
              </h2>
              <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1]">{scheme.disability_criteria}</p>
            </section>
          )}

          {/* 10. Required Documents */}
          {scheme.required_documents.length > 0 && (
            <section id="documents" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#138808]" /> Required Documents
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {scheme.required_documents.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1] p-3 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                    <FileText className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 11. Online Process */}
          {scheme.online_process && (
            <section id="online" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Globe className="w-4.5 h-4.5 text-[#FF9933]" /> Online Application Process
              </h2>
              <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1] leading-relaxed whitespace-pre-line">{scheme.online_process}</p>
            </section>
          )}

          {/* 12. Offline Process */}
          {scheme.offline_process && (
            <section id="offline" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#138808]" /> Offline Application Process
              </h2>
              <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1] leading-relaxed whitespace-pre-line">{scheme.offline_process}</p>
            </section>
          )}

          {/* 13. Application Fees */}
          <section id="fees" className="glass-card p-6 scroll-mt-28">
            <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-[#FF9933]" /> Application Fees
            </h2>
            <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1]">
              {scheme.application_fees || 'No application fee is charged by the department for this scheme. It is completely free.'}
            </p>
          </section>

          {/* 14. Timeline & Deadlines */}
          {(scheme.open_date || scheme.close_date) && (
            <section id="timeline" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-[#138808]" /> Important Dates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scheme.open_date && (
                  <div className="p-3 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                    <p className="text-xs text-charcoal-400 font-semibold mb-1">Open Date</p>
                    <p className="text-xs lg:text-sm font-bold text-charcoal-900 dark:text-white">
                      {new Date(scheme.open_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                )}
                {scheme.close_date && (
                  <div className="p-3 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                    <p className="text-xs text-charcoal-400 font-semibold mb-1">Closing Date</p>
                    <p className="text-xs lg:text-sm font-bold text-red-600 dark:text-red-400">
                      {new Date(scheme.close_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 15. FAQs */}
          {(scheme.faqs.length > 0 || (scheme.faq_list && scheme.faq_list.length > 0)) && (
            <section id="faqs" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <HelpCircle className="w-4.5 h-4.5 text-[#FF9933]" /> FAQs
              </h2>
              <div className="space-y-3">
                {(scheme.faq_list.length > 0 ? scheme.faq_list : scheme.faqs).map((faq, i) => (
                  <div key={i} className="p-4 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                    <p className="font-semibold text-xs lg:text-sm text-charcoal-900 dark:text-white mb-1">Q: {faq.q}</p>
                    <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1]">A: {faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 16. Official Links */}
          {(scheme.official_website || scheme.official_pdf) && (
            <section id="official-links" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Globe className="w-4.5 h-4.5 text-[#138808]" /> Official Resources
              </h2>
              <div className="flex flex-wrap gap-3">
                {scheme.official_website && (
                  <a href={scheme.official_website} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> Official Website
                  </a>
                )}
                {scheme.official_pdf && (
                  <a href={scheme.official_pdf} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Download PDF Guidelines
                  </a>
                )}
              </div>
            </section>
          )}

          {/* 17. Helpline & Contact */}
          {(scheme.contact_info?.helpline || scheme.contact_info?.email) && (
            <section id="contact" className="glass-card p-6 scroll-mt-28">
              <h2 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Phone className="w-4.5 h-4.5 text-[#FF9933]" /> Helpline and Contact
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                {scheme.contact_info.helpline && (
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1]">
                    <Phone className="w-4 h-4 text-emerald-500" /> Helpline: {scheme.contact_info.helpline}
                  </div>
                )}
                {scheme.contact_info.email && (
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1]">
                    <Mail className="w-4 h-4 text-emerald-500" /> Email: {scheme.contact_info.email}
                  </div>
                )}
              </div>
            </section>
          )}

        </div>

      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 dark:bg-[#0F172A]/95 border-t border-charcoal-200 dark:border-charcoal-800 p-4 shadow-xl backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <SaveButton itemType="scheme" itemId={scheme.id} itemTitle={scheme.title} />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Link to="/eligibility" className="btn-secondary text-xs font-bold py-2.5 flex-1 text-center flex items-center justify-center gap-1">
            <ListChecks className="w-3.5 h-3.5" /> Check Match
          </Link>
          {scheme.official_website && (
            <a
              href={scheme.official_website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-[#FF9933] text-white text-xs font-bold py-2.5 flex-1 text-center flex items-center justify-center gap-1"
            >
              Apply <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

    </div>
  );
}
