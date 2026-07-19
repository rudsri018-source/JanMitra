import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Share2, Printer, Download, BadgeCheck, Building2, FileText, Clock, ExternalLink, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSavedItems } from '../hooks/useSaved';
import { useAuth } from '../context/AuthContext';
import { Link } from '../router/Router';

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
}

export function getSchemeCategory(title: string, description: string, tags: string[] = []): string {
  const text = (title + ' ' + (description || '') + ' ' + tags.join(' ')).toLowerCase();
  
  if (text.includes('kisan') || text.includes('farmer') || text.includes('krishi') || text.includes('agriculture') || text.includes('crop') || text.includes('soil') || text.includes('pesticide') || text.includes('fertilizer') || text.includes('land')) {
    return 'agriculture';
  }
  if (text.includes('scholarship') || text.includes('matric') || text.includes('student') || text.includes('education') || text.includes('school') || text.includes('college') || text.includes('study') || text.includes('university') || text.includes('learning')) {
    return 'education';
  }
  if (text.includes('health') || text.includes('arogya') || text.includes('insurance') || text.includes('hospital') || text.includes('medical') || text.includes('medicine') || text.includes('treatment') || text.includes('jay') || text.includes('clinic')) {
    return 'health';
  }
  if (text.includes('awas') || text.includes('housing') || text.includes('home') || text.includes('house') || text.includes('shelter') || text.includes('pucca') || text.includes('residential')) {
    return 'housing';
  }
  if (text.includes('pension') || text.includes('elderly') || text.includes('senior') || text.includes('old age') || text.includes('social security')) {
    return 'pensions';
  }
  if (text.includes('women') || text.includes('female') || text.includes('girl') || text.includes('child') || text.includes('mother') || text.includes('beti') || text.includes('pregnancy') || text.includes('maternal')) {
    return 'women-child';
  }
  if (text.includes('skill') || text.includes('kaushal') || text.includes('employment') || text.includes('job') || text.includes('training') || text.includes('entrepreneur') || text.includes('business') || text.includes('startup') || text.includes('livelihood')) {
    return 'business';
  }
  return 'default';
}

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
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave(itemType, itemId, itemTitle); }}
      className={`btn-ghost hover:scale-105 active:scale-95 transition-transform ${saved ? 'text-[#138808] font-bold' : ''}`}
      aria-label={saved ? 'Unsave' : 'Save'}
    >
      {saved ? <BookmarkCheck className="w-4 h-4 text-[#138808]" /> : <Bookmark className="w-4 h-4" />}
      <span>{saved ? 'Saved' : 'Save'}</span>
    </button>
  );
}

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <button onClick={handleShare} className="btn-ghost hover:scale-105 active:scale-95 transition-transform" aria-label="Share">
      <Share2 className="w-4 h-4" />
      <span>{copied ? 'Copied!' : 'Share'}</span>
    </button>
  );
}

export function PrintButton() {
  return (
    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.print(); }} className="btn-ghost hover:scale-105 active:scale-95 transition-transform" aria-label="Print">
      <Printer className="w-4 h-4" />
      <span>Print</span>
    </button>
  );
}

export function DownloadButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick(); }} className="btn-ghost hover:scale-105 active:scale-95 transition-transform" aria-label="Download">
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

export function SchemeCategoryIllustration({ category, size = 'large' }: { category: string; size?: 'small' | 'large' }) {
  const isLarge = size === 'large';
  const sizeClasses = isLarge ? 'w-full h-36' : 'w-16 h-16 rounded-2xl';

  switch (category) {
    case 'agriculture':
      return (
        <div className={`${sizeClasses} bg-gradient-to-br from-amber-500/10 via-[#138808]/5 to-transparent flex items-center justify-center overflow-hidden relative flex-shrink-0`}>
          <svg className={isLarge ? "w-24 h-24 text-[#138808]" : "w-10 h-10 text-[#138808]"} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Green crops / field */}
            <path d="M10 75 Q 30 65, 50 75 T 90 75" stroke="#138808" strokeWidth="4.5" fill="#138808" fillOpacity="0.1" />
            <path d="M10 82 Q 35 75, 50 82 T 90 82" stroke="#138808" strokeWidth="3" fill="#138808" fillOpacity="0.15" />
            {/* Rising Saffron Sun */}
            <circle cx="50" cy="40" r="18" fill="#FF9933" fillOpacity="0.8" />
            {/* Sprout emerging from ground */}
            <path d="M50 70 V42" stroke="#138808" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M50 42 C 55 34, 65 34, 70 42 C 65 47, 55 47, 50 42 Z" fill="#138808" />
            <path d="M50 52 C 45 44, 35 44, 30 52 C 35 57, 45 57, 50 52 Z" fill="#138808" />
            <path d="M15 80 H85" stroke="#0B1F3A" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'education':
    case 'youth':
      return (
        <div className={`${sizeClasses} bg-gradient-to-br from-blue-500/10 to-transparent flex items-center justify-center overflow-hidden relative flex-shrink-0`}>
          <svg className={isLarge ? "w-24 h-24 text-[#0B1F3A]" : "w-10 h-10 text-[#0B1F3A]"} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Open Book */}
            <path d="M20 70 C 35 65, 50 70, 50 70 C 50 70, 65 65, 80 70 V 40 C 65 35, 50 40, 50 40 C 50 40, 35 35, 20 40 Z" fill="#2563EB" fillOpacity="0.15" stroke="#2563EB" strokeWidth="3" />
            {/* Graduation Cap */}
            <path d="M50 20 L82 34 L50 48 L18 34 Z" fill="#0B1F3A" />
            <path d="M32 40 V58 C32 63, 68 63, 68 58 V40" stroke="#0B1F3A" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M82 34 V55" stroke="#FF9933" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="82" cy="55" r="3" fill="#FF9933" />
          </svg>
        </div>
      );
    case 'health':
      return (
        <div className={`${sizeClasses} bg-gradient-to-br from-red-500/10 to-transparent flex items-center justify-center overflow-hidden relative flex-shrink-0`}>
          <svg className={isLarge ? "w-24 h-24 text-[#DC2626]" : "w-10 h-10 text-[#DC2626]"} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15 L80 25 V50 C80 65, 50 82, 50 82 C 50 82, 20 65, 20 50 V25 Z" fill="#DC2626" fillOpacity="0.08" stroke="#DC2626" strokeWidth="3.5" />
            <path d="M50 25 C58 17, 78 22, 73 42 C68 58, 50 72, 50 72 C50 72, 32 58, 27 42 C22 22, 42 17, 50 25 Z" fill="#DC2626" fillOpacity="0.8" />
            <path d="M50 37 V53 M42 45 H58" stroke="#FFFFFF" strokeWidth="6.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'housing':
      return (
        <div className={`${sizeClasses} bg-gradient-to-br from-emerald-500/10 to-transparent flex items-center justify-center overflow-hidden relative flex-shrink-0`}>
          <svg className={isLarge ? "w-24 h-24 text-[#138808]" : "w-10 h-10 text-[#138808]"} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="75" cy="60" r="12" fill="#138808" fillOpacity="0.2" />
            <path d="M15 50 L50 20 L85 50" stroke="#0B1F3A" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M25 45 V75 H75 V45" stroke="#0B1F3A" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="44" y="55" width="12" height="20" fill="#FF9933" rx="1.5" />
            <rect x="32" y="50" width="8" height="8" fill="#2563EB" fillOpacity="0.2" stroke="#0B1F3A" strokeWidth="2" />
            <rect x="60" y="50" width="8" height="8" fill="#2563EB" fillOpacity="0.2" stroke="#0B1F3A" strokeWidth="2" />
          </svg>
        </div>
      );
    case 'business':
      return (
        <div className={`${sizeClasses} bg-gradient-to-br from-purple-500/10 to-transparent flex items-center justify-center overflow-hidden relative flex-shrink-0`}>
          <svg className={isLarge ? "w-24 h-24 text-[#7C3AED]" : "w-10 h-10 text-[#7C3AED]"} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="32" width="60" height="42" rx="8" stroke="#0B1F3A" strokeWidth="5.5" fill="#7C3AED" fillOpacity="0.1" />
            <path d="M38 32 V24 C38 20, 62 20, 62 24 V32" stroke="#0B1F3A" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M50 40 L56 50 H44 Z" fill="#FF9933" />
            <path d="M50 50 V62" stroke="#FF9933" strokeWidth="3" />
            <circle cx="50" cy="45" r="2.5" fill="#FFFFFF" />
          </svg>
        </div>
      );
    case 'pensions':
      return (
        <div className={`${sizeClasses} bg-gradient-to-br from-pink-500/10 to-transparent flex items-center justify-center overflow-hidden relative flex-shrink-0`}>
          <svg className={isLarge ? "w-24 h-24 text-[#E1306C]" : "w-10 h-10 text-[#E1306C]"} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="32" fill="#E1306C" fillOpacity="0.08" />
            <path d="M25 45 C40 30, 60 30, 75 45" stroke="#FF9933" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M50 35 C53 35, 58 40, 58 45 C58 55, 50 65, 50 65 C50 65, 42 55, 42 45 C42 40, 47 35, 50 35 Z" fill="#E1306C" fillOpacity="0.8" />
            <path d="M30 65 Q 50 55, 70 65" stroke="#138808" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'women-child':
      return (
        <div className={`${sizeClasses} bg-gradient-to-br from-[#FF9933]/10 to-[#E1306C]/10 flex items-center justify-center overflow-hidden relative flex-shrink-0`}>
          <svg className={isLarge ? "w-24 h-24 text-[#FF9933]" : "w-10 h-10 text-[#FF9933]"} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="32" fill="#FF9933" fillOpacity="0.08" />
            <path d="M50 30 C55 20, 75 22, 70 42 C65 58, 50 72, 50 72 C50 72, 35 58, 30 42 C25 22, 45 20, 50 30 Z" stroke="#FF9933" strokeWidth="4" fill="#E1306C" fillOpacity="0.7" />
            <circle cx="50" cy="42" r="5" fill="#FFFFFF" />
            <path d="M45 52 C48 48, 52 48, 55 52" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={`${sizeClasses} bg-gradient-to-br from-[#0B1F3A]/10 to-transparent flex items-center justify-center overflow-hidden relative flex-shrink-0`}>
          <svg className={isLarge ? "w-24 h-24 text-[#0B1F3A]" : "w-10 h-10 text-[#0B1F3A]"} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="28" width="60" height="44" rx="6" stroke="#0B1F3A" strokeWidth="4.5" fill="#0B1F3A" fillOpacity="0.05" />
            <rect x="28" y="36" width="14" height="18" rx="2" fill="#FF9933" fillOpacity="0.8" />
            <line x1="48" y1="40" x2="72" y2="40" stroke="#0B1F3A" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="48" y1="48" x2="68" y2="48" stroke="#0B1F3A" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="48" y1="56" x2="60" y2="56" stroke="#138808" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        </div>
      );
  }
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
  layoutMode?: 'grid' | 'list';
}

export function SchemeCard({ title, slug, description, level, state, benefits, trending, tags, score, reasons, compact, requiredDocuments, officialWebsite, openDate, closeDate, status, lastVerifiedAt, layoutMode = 'grid' }: SchemeCardProps) {
  const isList = layoutMode === 'list';
  
  // Resolve category dynamically based on keywords in title, description, and tags!
  const categoryName = getSchemeCategory(title, description || '', tags || []);

  return (
    <Link to={`/schemes/${slug}`} className="block group w-full hover-lift transition-all">
      <div className={`glass-card h-full flex overflow-hidden hover:border-[#FF9933]/50 transition-colors shadow-sm hover:shadow-md ${isList ? 'flex-col sm:flex-row sm:items-center justify-between gap-4 p-5' : 'flex-col !p-0'}`}>
        
        {/* Render large illustration at top of Grid Cards */}
        {!isList && (
          <div className="relative w-full border-b border-charcoal-200/50 dark:border-charcoal-800/50 overflow-hidden">
            <SchemeCategoryIllustration category={categoryName} size="large" />
            {trending && <span className="absolute top-3 left-3 badge-gold z-10 animate-pulse-soft">Trending</span>}
            <span className={`absolute top-3 right-3 z-10 ${level === 'central' ? 'badge-emerald' : 'badge-gold'}`}>
              {level === 'central' ? 'Central' : state || 'State'}
            </span>
          </div>
        )}

        <div className={`flex-1 ${isList ? 'min-w-0' : 'p-5 flex flex-col h-full'}`}>
          
          {/* Horizontal layout has graphic avatar on the left */}
          <div className="flex gap-4 items-start">
            {isList && (
              <div className="flex-shrink-0 shadow-sm border border-charcoal-200/20 dark:border-charcoal-800/20 rounded-2xl overflow-hidden">
                <SchemeCategoryIllustration category={categoryName} size="small" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                {isList && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={level === 'central' ? 'badge-emerald' : 'badge-gold'}>
                      {level === 'central' ? 'Central' : state || 'State'}
                    </span>
                    {trending && <span className="badge-gold">Trending</span>}
                    {getStatusBadge(openDate, closeDate, status)}
                  </div>
                )}
                {!isList && getStatusBadge(openDate, closeDate, status)}
                
                <div className="flex items-center gap-1">
                  {lastVerifiedAt && (
                    <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400" title={`Verified: ${formatDate(lastVerifiedAt)}`}>
                      <BadgeCheck className="w-3 h-3 text-[#138808]" /> Verified
                    </span>
                  )}
                  {score !== undefined && (
                    <span className={`badge ${score >= 75 ? 'badge-emerald' : score >= 50 ? 'badge-gold' : 'badge-charcoal'}`}>
                      {score}% match
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-display font-bold text-sm lg:text-base text-charcoal-900 dark:text-white group-hover:text-[#FF9933] transition-colors mb-1.5 line-clamp-2">
                {title}
              </h3>
              
              {!compact && <p className="text-xs lg:text-sm text-charcoal-600 dark:text-[#CBD5E1] line-clamp-2 mb-3 leading-relaxed">{description}</p>}
              
              {benefits && (
                <p className="text-xs lg:text-sm text-charcoal-700 dark:text-charcoal-300 line-clamp-2 mb-3">
                  <span className="font-semibold text-charcoal-900 dark:text-white">Benefits:</span> {benefits}
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
            </div>
          </div>
        </div>
        
        {/* Actions panel */}
        <div className={`flex flex-col gap-3 justify-end items-end ${isList ? 'sm:border-l sm:border-charcoal-200 dark:sm:border-charcoal-800 sm:pl-4 flex-shrink-0' : 'p-5 pt-0 mt-auto border-t border-charcoal-100 dark:border-charcoal-800/60 pt-3'}`}>
          {requiredDocuments && requiredDocuments.length > 0 && !compact && (
            <div className={`${isList ? 'text-right hidden sm:block' : 'hidden'}`}>
              <p className="text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mb-1 flex items-center gap-1 justify-end">
                <FileText className="w-3 h-3" /> Documents
              </p>
              <div className="flex flex-wrap gap-1 justify-end">
                {requiredDocuments.slice(0, 2).map((doc, i) => (
                  <span key={i} className="text-[10px] bg-charcoal-100 dark:bg-charcoal-800 rounded px-1.5 py-0.5 text-charcoal-600 dark:text-charcoal-300 line-clamp-1">{doc}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 w-full justify-between">
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="badge-charcoal text-[9px]">{tag}</span>
                ))}
              </div>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF9933] group-hover:translate-x-0.5 transition-transform ml-auto">
              Details <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
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
    <Link to={`/scholarships/${slug}`} className="block group hover-lift transition-all">
      <div className="glass-card h-full flex flex-col hover:border-[#FF9933]/50 transition-colors shadow-sm">
        <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={level === 'central' ? 'badge-emerald' : level === 'state' ? 'badge-gold' : 'badge-charcoal'}>
              {level === 'central' ? 'Central' : level === 'state' ? state || 'State' : 'Private'}
            </span>
            {category && <span className="badge-charcoal">{category}</span>}
            {getStatusBadge(openDate, closeDate)}
          </div>
          {lastVerifiedAt && (
            <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400" title={`Verified: ${formatDate(lastVerifiedAt)}`}>
              <BadgeCheck className="w-3 h-3 text-[#138808]" /> Verified
            </span>
          )}
        </div>
        <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white group-hover:text-[#FF9933] transition-colors mb-1.5 line-clamp-2">
          {title}
        </h3>
        {provider && <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-2">By {provider}</p>}
        <div className="mt-auto space-y-1 pt-3 border-t border-charcoal-100 dark:border-charcoal-800/60">
          {amount && (
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{amount}</p>
          )}
          {deadline && (
            <p className="text-xs text-charcoal-500 dark:text-charcoal-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Deadline: {formatDate(deadline)}
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
    <Link to={`/services/${slug}`} className="block group hover-lift transition-all">
      <div className="glass-card h-full flex flex-col hover:border-[#FF9933]/50 transition-colors shadow-sm">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            {category && <span className="badge-emerald self-start">{category}</span>}
            <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 flex items-center gap-0.5">
              <Building2 className="w-3 h-3" /> Service
            </span>
          </div>
          {lastVerifiedAt && (
            <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400" title={`Verified: ${formatDate(lastVerifiedAt)}`}>
              <BadgeCheck className="w-3 h-3 text-[#138808]" /> Verified
            </span>
          )}
        </div>
        <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white group-hover:text-[#FF9933] transition-colors mb-1.5 line-clamp-2">
          {title}
        </h3>
        {description && <p className="text-sm text-charcoal-500 dark:text-charcoal-400 line-clamp-2 mt-auto pt-3 border-t border-charcoal-100 dark:border-charcoal-800/60">{description}</p>}
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
    <Link to={`/policies/${slug}`} className="block group hover-lift transition-all">
      <div className="glass-card h-full flex flex-col hover:border-[#FF9933]/50 transition-colors shadow-sm">
        <div className="flex items-start justify-between gap-2 mb-2">
          {category && <span className="badge-gold self-start">{category}</span>}
          {lastVerifiedAt && (
            <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400" title={`Verified: ${formatDate(lastVerifiedAt)}`}>
              <BadgeCheck className="w-3 h-3 text-[#138808]" /> Verified
            </span>
          )}
        </div>
        <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white group-hover:text-[#FF9933] transition-colors mb-1.5 line-clamp-2">
          {title}
        </h3>
        {summary && <p className="text-sm text-charcoal-500 dark:text-charcoal-400 line-clamp-3 mt-auto pt-3 border-t border-charcoal-100 dark:border-charcoal-800/60">{summary}</p>}
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
