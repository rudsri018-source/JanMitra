import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Share2, Printer, Download, BadgeCheck, Building2, FileText, Clock, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useSavedItems } from '../hooks/useSaved';
import { useAuth } from '../context/AuthContext';
import { Link } from '../router/Router';

interface SaveButtonProps {
  itemType: string;
  itemId: string;
  itemTitle: string;
}

export function SaveButton({ itemType, itemId, itemTitle }: SaveButtonProps) {
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSavedItems();
  const saved = isSaved(itemType, itemId);

  if (!user) return null;

  return (
    <button
      onClick={() => toggleSave(itemType, itemId, itemTitle)}
      className={`btn-ghost ${saved ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
      aria-label={saved ? 'Unsave' : 'Save'}
    >
      {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
      <span>{saved ? 'Saved' : 'Save'}</span>
    </button>
  );
}

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <button onClick={handleShare} className="btn-ghost" aria-label="Share">
      <Share2 className="w-4 h-4" />
      <span>{copied ? 'Copied!' : 'Share'}</span>
    </button>
  );
}

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-ghost" aria-label="Print">
      <Printer className="w-4 h-4" />
      <span>Print</span>
    </button>
  );
}

export function DownloadButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn-ghost" aria-label="Download">
      <Download className="w-4 h-4" />
      <span>Download</span>
    </button>
  );
}

// Status badge helper - computes status from dates
function getStatusBadge(openDate?: string | null, closeDate?: string | null, status?: string) {
  if (status && status !== 'open') {
    const statusMap: Record<string, { label: string; class: string }> = {
      closed: { label: 'Closed', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
      upcoming: { label: 'Upcoming', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    };
    if (statusMap[status]) return <span className={`badge ${statusMap[status].class}`}>{statusMap[status].label}</span>;
  }
  const now = new Date();
  if (closeDate) {
    const close = new Date(closeDate);
    if (close < now) return <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Closed</span>;
    const daysLeft = Math.ceil((close.getTime() - now.getTime()) / 86400000);
    if (daysLeft <= 15) return <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Closing in {daysLeft}d</span>;
  }
  if (openDate) {
    const open = new Date(openDate);
    if (open > now) return <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Upcoming</span>;
  }
  return <span className="badge badge-emerald">Open</span>;
}

interface SchemeCardProps {
  title: string;
  slug: string;
  description: string;
  level: string;
  state?: string | null;
  benefits?: string | null;
  trending?: boolean;
  tags?: string[];
  score?: number;
  reasons?: string[];
  compact?: boolean;
  requiredDocuments?: string[];
  officialWebsite?: string | null;
  openDate?: string | null;
  closeDate?: string | null;
  status?: string;
  lastVerifiedAt?: string | null;
}

export function SchemeCard({ title, slug, description, level, state, benefits, trending, tags, score, reasons, compact, requiredDocuments, officialWebsite, openDate, closeDate, status, lastVerifiedAt }: SchemeCardProps) {
  return (
    <Link to={`/schemes/${slug}`} className="block group">
      <div className="glass-card h-full flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={level === 'central' ? 'badge-emerald' : 'badge-gold'}>
              {level === 'central' ? 'Central' : state || 'State'}
            </span>
            {trending && <span className="badge-gold">Trending</span>}
            {getStatusBadge(openDate, closeDate, status)}
          </div>
          <div className="flex items-center gap-1">
            {lastVerifiedAt && (
              <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400" title={`Verified: ${new Date(lastVerifiedAt).toLocaleDateString()}`}>
                <BadgeCheck className="w-3 h-3" /> Verified
              </span>
            )}
            {score !== undefined && (
              <span className={`badge ${score >= 75 ? 'badge-emerald' : score >= 50 ? 'badge-gold' : 'badge-charcoal'}`}>
                {score}% match
              </span>
            )}
          </div>
        </div>
        <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1.5 line-clamp-2">
          {title}
        </h3>
        {!compact && <p className="text-sm text-charcoal-500 dark:text-charcoal-400 line-clamp-2 mb-3">{description}</p>}
        {benefits && (
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300 line-clamp-2 mb-3">
            <span className="font-semibold">Benefits:</span> {benefits}
          </p>
        )}
        {reasons && reasons.length > 0 && (
          <ul className="text-xs text-charcoal-500 dark:text-charcoal-400 space-y-0.5 mb-3">
            {reasons.slice(0, 2).map((r, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span className="line-clamp-1">{r}</span>
              </li>
            ))}
          </ul>
        )}
        {requiredDocuments && requiredDocuments.length > 0 && !compact && (
          <div className="mb-3">
            <p className="text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Documents
            </p>
            <div className="flex flex-wrap gap-1">
              {requiredDocuments.slice(0, 3).map((doc, i) => (
                <span key={i} className="text-[10px] bg-charcoal-100 dark:bg-charcoal-800 rounded px-1.5 py-0.5 text-charcoal-600 dark:text-charcoal-300 line-clamp-1">{doc}</span>
              ))}
              {requiredDocuments.length > 3 && <span className="text-[10px] text-charcoal-400">+{requiredDocuments.length - 3} more</span>}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag) => (
                <span key={tag} className="badge-charcoal">{tag}</span>
              ))}
            </div>
          )}
          {officialWebsite && (
            <span className="flex items-center gap-0.5 text-xs text-emerald-600 dark:text-emerald-400 ml-auto">
              <ExternalLink className="w-3 h-3" /> Apply
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ScholarshipCard({ title, slug, provider, level, state, amount, deadline, category, openDate, closeDate, lastVerifiedAt }: {
  title: string;
  slug: string;
  provider?: string | null;
  level: string;
  state?: string | null;
  amount?: string | null;
  deadline?: string | null;
  category?: string | null;
  openDate?: string | null;
  closeDate?: string | null;
  lastVerifiedAt?: string | null;
}) {
  return (
    <Link to={`/scholarships/${slug}`} className="block group">
      <div className="glass-card h-full flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={level === 'central' ? 'badge-emerald' : level === 'state' ? 'badge-gold' : 'badge-charcoal'}>
              {level === 'central' ? 'Central' : level === 'state' ? state || 'State' : 'Private'}
            </span>
            {category && <span className="badge-charcoal">{category}</span>}
            {getStatusBadge(openDate, closeDate)}
          </div>
          {lastVerifiedAt && (
            <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400" title={`Verified: ${new Date(lastVerifiedAt).toLocaleDateString()}`}>
              <BadgeCheck className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
        <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1.5 line-clamp-2">
          {title}
        </h3>
        {provider && <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-2">By {provider}</p>}
        <div className="mt-auto space-y-1">
          {amount && (
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{amount}</p>
          )}
          {deadline && (
            <p className="text-xs text-charcoal-500 dark:text-charcoal-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Deadline: {deadline}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ServiceCard({ title, slug, category, description, lastVerifiedAt }: {
  title: string;
  slug: string;
  category?: string | null;
  description?: string | null;
  lastVerifiedAt?: string | null;
}) {
  return (
    <Link to={`/services/${slug}`} className="block group">
      <div className="glass-card h-full flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            {category && <span className="badge-emerald self-start">{category}</span>}
            <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 flex items-center gap-0.5">
              <Building2 className="w-3 h-3" /> Service
            </span>
          </div>
          {lastVerifiedAt && (
            <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400" title={`Verified: ${new Date(lastVerifiedAt).toLocaleDateString()}`}>
              <BadgeCheck className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
        <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1.5 line-clamp-2">
          {title}
        </h3>
        {description && <p className="text-sm text-charcoal-500 dark:text-charcoal-400 line-clamp-2 mt-auto">{description}</p>}
      </div>
    </Link>
  );
}

export function PolicyCard({ title, slug, category, summary, lastVerifiedAt }: {
  title: string;
  slug: string;
  category?: string | null;
  summary?: string | null;
  lastVerifiedAt?: string | null;
}) {
  return (
    <Link to={`/policies/${slug}`} className="block group">
      <div className="glass-card h-full flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          {category && <span className="badge-gold self-start">{category}</span>}
          {lastVerifiedAt && (
            <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400" title={`Verified: ${new Date(lastVerifiedAt).toLocaleDateString()}`}>
              <BadgeCheck className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
        <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1.5 line-clamp-2">
          {title}
        </h3>
        {summary && <p className="text-sm text-charcoal-500 dark:text-charcoal-400 line-clamp-3 mt-auto">{summary}</p>}
      </div>
    </Link>
  );
}

export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-10 h-10 border-3 border-emerald-200 dark:border-emerald-900 border-t-emerald-600 rounded-full animate-spin" />
      {label && <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{label}</p>}
    </div>
  );
}

export function EmptyState({ title, description, icon }: { title: string; description?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
      {icon && <div className="w-16 h-16 rounded-full bg-charcoal-100 dark:bg-charcoal-800 flex items-center justify-center text-charcoal-400">{icon}</div>}
      <h3 className="font-display font-bold text-lg text-charcoal-900 dark:text-white">{title}</h3>
      {description && <p className="text-sm text-charcoal-500 dark:text-charcoal-400 max-w-md">{description}</p>}
    </div>
  );
}

// Document checklist component for detail pages
export function DocumentChecklist({ documents }: { documents: string[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  return (
    <div className="space-y-2">
      {documents.map((doc, i) => {
        const isChecked = checked.has(doc);
        return (
          <button
            key={i}
            onClick={() => {
              const next = new Set(checked);
              if (isChecked) next.delete(doc);
              else next.add(doc);
              setChecked(next);
            }}
            className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-charcoal-50 dark:hover:bg-charcoal-800 transition-colors"
          >
            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isChecked ? 'text-emerald-600' : 'text-charcoal-300 dark:text-charcoal-600'}`} />
            <span className={`text-sm ${isChecked ? 'text-charcoal-400 line-through dark:text-charcoal-500' : 'text-charcoal-700 dark:text-charcoal-300'}`}>{doc}</span>
          </button>
        );
      })}
      {documents.length > 0 && (
        <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-2">
          {checked.size}/{documents.length} documents ready
        </p>
      )}
    </div>
  );
}

// Step-by-step process component for detail pages
export function ProcessSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-bold">
            {i + 1}
          </span>
          <span className="text-sm text-charcoal-700 dark:text-charcoal-300 pt-1">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function useTheme() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);
  return isDark;
}
