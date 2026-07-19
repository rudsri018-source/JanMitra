import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import { supabase } from '../lib/supabase';
import type { Complaint } from '../types';
import { Scale, Phone, FileText, AlertCircle } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '../components/ui';

const COMPLAINT_CATEGORIES = [
  'Corruption', 'Delay in Service', 'Document Issue', 'Scheme Application', 'Scholarship Issue',
  'Pension Issue', 'Ration Card', 'Aadhaar Issue', 'Police Complaint', 'Cybercrime',
  'Tax Grievance', 'Municipal Service', 'Electricity', 'Water', 'Other',
];

const HELPLINES = [
  { name: 'Citizen Helpline', number: '1912' },
  { name: 'Anti-Corruption', number: '1064' },
  { name: 'Cyber Crime', number: '1930' },
  { name: 'Women Helpline', number: '1091' },
  { name: 'Child Helpline', number: '1098' },
  { name: 'Senior Citizens', number: '14567' },
  { name: 'PM-KISAN Helpline', number: '1800110002' },
  { name: 'Ayushman Bharat', number: '14555' },
];

const ESCALATION = [
  { level: 1, title: 'Department', desc: 'File complaint with the concerned department.' },
  { level: 2, title: 'Nodal Officer', desc: 'Escalate to the department nodal officer if no response in 30 days.' },
  { level: 3, title: 'Appellate Authority', desc: 'Approach the appellate authority under RTI or department rules.' },
  { level: 4, title: 'Ombudsman', desc: 'File with the relevant Ombudsman (Banking, Insurance, Electricity, etc.).' },
];

export function ComplaintsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: '', subject: '', description: '', department: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    supabase
      .from('complaints')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setComplaints(data as Complaint[]);
        setLoading(false);
      });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const trackingId = `BN${Date.now().toString().slice(-8)}`;
    const { data, error } = await supabase
      .from('complaints')
      .insert({ user_id: user.id, ...form, tracking_id: trackingId, status: 'submitted' })
      .select()
      .single();
    if (!error && data) {
      setComplaints((prev) => [data as Complaint, ...prev]);
      setSuccess(true);
      setForm({ category: '', subject: '', description: '', department: '' });
      setTimeout(() => { setSuccess(false); setShowForm(false); }, 2000);
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
          <Scale className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">{t('complaints')}</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400">File complaints, track status, and view escalation matrix.</p>
        </div>
        {user && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? t('cancel') : t('fileComplaint')}
          </button>
        )}
      </div>

      {!user ? (
        <EmptyState title="Sign in required" description="Please sign in to file and track complaints." icon={<AlertCircle className="w-8 h-8" />} />
      ) : (
        <>
          {showForm && (
            <div className="glass-card p-6 mb-6 animate-fade-in">
              {success && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-300">
                  Complaint filed successfully! Your tracking ID has been generated.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">Category</label>
                  <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                    <option value="">Select category</option>
                    {COMPLAINT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">Subject</label>
                  <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input" placeholder="Brief subject of complaint" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">Department (optional)</label>
                  <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input" placeholder="Concerned department" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">Description</label>
                  <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="input" placeholder="Describe your complaint in detail" />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? t('loading') : t('submit')}
                </button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="section-title mb-4">My Complaints</h2>
              {loading ? (
                <LoadingSpinner />
              ) : complaints.length === 0 ? (
                <EmptyState title="No complaints filed" description="File a complaint to track its status here." icon={<FileText className="w-8 h-8" />} />
              ) : (
                <div className="space-y-3">
                  {complaints.map((c) => (
                    <div key={c.id} className="glass-card p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-sm text-charcoal-900 dark:text-white">{c.subject}</h3>
                        <span className={`badge ${c.status === 'resolved' ? 'badge-emerald' : c.status === 'submitted' ? 'badge-gold' : 'badge-charcoal'}`}>{c.status}</span>
                      </div>
                      <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mb-2">{c.category}</p>
                      {c.tracking_id && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">Tracking ID: {c.tracking_id}</p>}
                      <p className="text-xs text-charcoal-400 mt-1">{new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="section-title mb-4 flex items-center gap-2"><Phone className="w-5 h-5 text-emerald-500" /> {t('helplineNumbers')}</h2>
              <div className="space-y-2 mb-6">
                {HELPLINES.map((h) => (
                  <div key={h.name} className="glass-card p-3 flex items-center justify-between">
                    <span className="text-sm text-charcoal-700 dark:text-charcoal-300">{h.name}</span>
                    <a href={`tel:${h.number}`} className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{h.number}</a>
                  </div>
                ))}
              </div>

              <h2 className="section-title mb-4">{t('escalationMatrix')}</h2>
              <div className="space-y-2">
                {ESCALATION.map((e) => (
                  <div key={e.level} className="glass-card p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-gold-500 text-white text-xs font-bold flex items-center justify-center">{e.level}</span>
                      <span className="text-sm font-semibold text-charcoal-900 dark:text-white">{e.title}</span>
                    </div>
                    <p className="text-xs text-charcoal-500 dark:text-charcoal-400 pl-8">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
