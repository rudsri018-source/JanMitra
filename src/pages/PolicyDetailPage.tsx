import { useEffect } from 'react';
import { usePolicy } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter } from '../router/Router';
import { SaveButton, ShareButton, PrintButton, LoadingSpinner, EmptyState, formatDate } from '../components/ui';
import { ArrowRight, CheckCircle2, Scale, HelpCircle, ExternalLink } from 'lucide-react';

export function PolicyDetailPage({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const { policy, loading } = usePolicy(slug);
  const { navigate } = useRouter();

  useEffect(() => {
    if (policy) {
      const stored = localStorage.getItem('janmitra_recent');
      const recent = stored ? JSON.parse(stored) : [];
      const updated = [{ type: 'policy', id: policy.id, title: policy.title, slug: policy.slug }, ...recent.filter((r: { id: string }) => r.id !== policy.id)].slice(0, 8);
      localStorage.setItem('janmitra_recent', JSON.stringify(updated));
    }
  }, [policy?.id]);

  if (loading) return <LoadingSpinner label={t('loading')} />;
  if (!policy) return <EmptyState title="Policy not found" icon={<Scale className="w-8 h-8" />} />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button onClick={() => navigate('/policies')} className="btn-ghost mb-4">
        <ArrowRight className="w-4 h-4 rotate-180" /> {t('backToPolicies')}
      </button>

      <div className="glass-card p-6 mb-6">
        {policy.category && <span className="badge-gold mb-3">{policy.category}</span>}
        <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white mb-2">{policy.title}</h1>
        {policy.summary && <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">{policy.summary}</p>}
        <div className="flex flex-wrap gap-2 mt-4">
          <SaveButton itemType="policy" itemId={policy.id} itemTitle={policy.title} />
          <ShareButton title={policy.title} />
          <PrintButton />
        </div>
      </div>

      {policy.key_points.length > 0 && (
        <div className="glass-card p-6 mb-4">
          <h2 className="font-display font-bold text-lg text-charcoal-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Key Points
          </h2>
          <ul className="space-y-2">
            {policy.key_points.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {policy.content && (
        <div className="glass-card p-6 mb-4">
          <h2 className="font-display font-bold text-lg text-charcoal-900 dark:text-white mb-3">Detailed Explanation</h2>
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed whitespace-pre-wrap">{policy.content}</p>
        </div>
      )}

      {policy.official_reference && (
        <div className="glass-card p-6 mb-4">
          <h2 className="font-display font-bold text-lg text-charcoal-900 dark:text-white mb-3">Official Reference</h2>
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300">{policy.official_reference}</p>
          {policy.official_reference_url && (
            <a href={policy.official_reference_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
              <ExternalLink className="w-3.5 h-3.5" /> Visit official portal
            </a>
          )}
        </div>
      )}

      {policy.faq_list && policy.faq_list.length > 0 && (
        <div className="glass-card p-6 mb-4">
          <h2 className="font-display font-bold text-lg text-charcoal-900 dark:text-white mb-3 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-500" /> FAQs
          </h2>
          <div className="space-y-3">
            {policy.faq_list.map((faq, i) => (
              <div key={i} className="p-4 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                <p className="font-semibold text-sm text-charcoal-900 dark:text-white mb-1">Q: {faq.q}</p>
                <p className="text-sm text-charcoal-600 dark:text-charcoal-300">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {policy.last_verified_at && (
        <div className="text-xs text-charcoal-400 dark:text-charcoal-500 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Last verified: {formatDate(policy.last_verified_at)}
        </div>
      )}
    </div>
  );
}
