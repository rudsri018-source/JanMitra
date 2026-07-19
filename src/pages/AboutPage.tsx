import { useTranslation } from '../i18n/useTranslation';
import { Sparkles, Shield, Lock, Globe, Mail, Phone, ExternalLink } from 'lucide-react';

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-charcoal-200/50 dark:border-charcoal-800/50 pb-4 text-center">
        <h1 className="font-display font-extrabold text-3xl text-charcoal-900 dark:text-white mb-2">About JanSeva Bharat</h1>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Simplifying access to welfare schemes and citizen services across India.</p>
      </div>

      {/* Main Mission Card */}
      <div className="glass-card p-6 md:p-8 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF9933] to-[#138808] flex items-center justify-center text-white mb-4 shadow-md">
          <Sparkles className="w-6 h-6 animate-pulse-soft" />
        </div>
        <h2 className="font-display font-bold text-lg text-charcoal-900 dark:text-white">Our Mission</h2>
        <p className="text-sm text-charcoal-600 dark:text-[#CBD5E1] leading-relaxed">
          JanSeva Bharat is a modern AI-powered platform designed to close the information gap between the government and the citizens of India. Finding welfare schemes, scholarships, and public services can often feel overwhelming due to complicated terminology and fragmented websites. Our goal is to consolidate this information into one central, easy-to-use search engine equipped with natural language processing.
        </p>
      </div>

      {/* Highlights grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-[#138808] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white">Secure and Private</h3>
          <p className="text-xs text-charcoal-500 dark:text-[#CBD5E1] leading-relaxed">
            We prioritize citizen privacy. JanSeva Bharat does not save or prompt you for private numbers, passwords, OTPs, or financial records. All documents are only submitted on verified official websites.
          </p>
        </div>

        <div className="glass-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-gold-50 dark:bg-gold-950/30 text-[#FF9933] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white">Independent Aggregation</h3>
          <p className="text-xs text-charcoal-500 dark:text-[#CBD5E1] leading-relaxed">
            We are an independent repository. We crawl and parse public notices from official ministries and state gazettes to translate policy texts into simple, citizen-friendly highlights.
          </p>
        </div>
      </div>

      {/* Safety Notice Panel */}
      <div className="glass-card p-6 border-l-4 border-red-500 bg-red-500/5">
        <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-2">Important Security Disclaimer</h3>
        <p className="text-xs text-charcoal-600 dark:text-[#CBD5E1] leading-relaxed mb-4">
          JanSeva Bharat is NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with the Government of India or any state administration. The official government portals can be accessed at:
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#FF9933] hover:underline">
            india.gov.in <ExternalLink className="w-3 h-3" />
          </a>
          <a href="https://myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#FF9933] hover:underline">
            myscheme.gov.in <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Contact Section */}
      <div className="glass-card p-6 text-center space-y-4">
        <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white">Need Assistance?</h3>
        <p className="text-xs text-charcoal-500 dark:text-[#CBD5E1] max-w-md mx-auto leading-relaxed">
          If you have questions about the platform or noticed an out-of-date scheme reference, please contact our support team.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-xs font-semibold text-charcoal-600 dark:text-[#CBD5E1]">
          <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-[#FF9933]" /> support@jansevabharat.gov.in (Mock)</span>
          <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-[#138808]" /> Toll-free: 1800-XXX-XXXX (Mock)</span>
        </div>
      </div>
    </div>
  );
}
