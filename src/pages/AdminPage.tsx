import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import { supabase } from '../lib/supabase';
import type { Scheme, Scholarship, CitizenService, Policy, Blog, Notification, Category, AdminLog } from '../types';
import { Shield, BarChart3, ListChecks, Award, FileText, BookOpen, FileEdit, Bell, FolderTree, Activity, Plus, Edit2, Trash2, X, Save, RefreshCw } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '../components/ui';

type AdminTab = 'overview' | 'schemes' | 'scholarships' | 'services' | 'policies' | 'blogs' | 'notifications' | 'categories' | 'ministries' | 'sync' | 'logs';

export function AdminPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [tab, setTab] = useState<AdminTab>('overview');

  if (profile?.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto glass-card p-8 text-center animate-fade-in">
        <Shield className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
        <h2 className="font-display font-bold text-lg text-charcoal-900 dark:text-white mb-2">Admin Access Required</h2>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-400">You need admin privileges to access this panel. Contact your administrator.</p>
      </div>
    );
  }

  const tabs: { key: AdminTab; label: string; icon: typeof Shield }[] = [
    { key: 'overview', label: t('overview'), icon: BarChart3 },
    { key: 'schemes', label: t('manageSchemes'), icon: ListChecks },
    { key: 'scholarships', label: t('manageScholarships'), icon: Award },
    { key: 'services', label: t('manageServices'), icon: FileText },
    { key: 'policies', label: t('managePolicies'), icon: BookOpen },
    { key: 'blogs', label: t('manageBlogs'), icon: FileEdit },
    { key: 'notifications', label: t('manageNotifications'), icon: Bell },
    { key: 'categories', label: t('manageCategories'), icon: FolderTree },
    { key: 'ministries', label: 'Ministries', icon: FolderTree },
    { key: 'sync', label: 'Data Sync', icon: RefreshCw },
    { key: 'logs', label: t('activityLogs'), icon: Activity },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-charcoal-700 to-charcoal-900 flex items-center justify-center shadow-lg">
          <Shield className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">Admin Panel</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Manage content without touching code.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              tab === tb.key ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'glass text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800'
            }`}
          >
            <tb.icon className="w-4 h-4" /> {tb.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab />}
      {tab === 'schemes' && <SchemesAdmin />}
      {tab === 'scholarships' && <ScholarshipsAdmin />}
      {tab === 'services' && <ServicesAdmin />}
      {tab === 'policies' && <PoliciesAdmin />}
      {tab === 'blogs' && <BlogsAdmin />}
      {tab === 'notifications' && <NotificationsAdmin />}
      {tab === 'categories' && <CategoriesAdmin />}
      {tab === 'ministries' && <MinistriesAdmin />}
      {tab === 'sync' && <SyncAdmin />}
      {tab === 'logs' && <LogsAdmin />}
    </div>
  );
}

function useLog() {
  const { user } = useAuth();
  return useCallback(async (action: string, entity: string, entityId?: string, details?: Record<string, unknown>) => {
    if (!user) return;
    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action,
      entity,
      entity_id: entityId || null,
      details: details || {},
    });
  }, [user]);
}

function OverviewTab() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('schemes').select('*', { count: 'exact', head: true }),
      supabase.from('scholarships').select('*', { count: 'exact', head: true }),
      supabase.from('citizen_services').select('*', { count: 'exact', head: true }),
      supabase.from('policies').select('*', { count: 'exact', head: true }),
      supabase.from('blogs').select('*', { count: 'exact', head: true }),
      supabase.from('notifications').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('complaints').select('*', { count: 'exact', head: true }),
    ]).then((results) => {
      const s: Record<string, number> = {};
      ['schemes', 'scholarships', 'services', 'policies', 'blogs', 'notifications', 'users', 'complaints'].forEach((key, i) => {
        s[key] = results[i].count || 0;
      });
      setStats(s);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { label: 'Schemes', value: stats.schemes, color: 'from-emerald-500 to-emerald-700' },
    { label: 'Scholarships', value: stats.scholarships, color: 'from-gold-400 to-gold-600' },
    { label: 'Services', value: stats.services, color: 'from-teal-500 to-emerald-700' },
    { label: 'Policies', value: stats.policies, color: 'from-emerald-600 to-emerald-800' },
    { label: 'Blogs', value: stats.blogs, color: 'from-gold-500 to-amber-600' },
    { label: 'Notifications', value: stats.notifications, color: 'from-emerald-500 to-green-700' },
    { label: 'Users', value: stats.users, color: 'from-charcoal-600 to-charcoal-800' },
    { label: 'Complaints', value: stats.complaints, color: 'from-gold-400 to-gold-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="glass-card p-5">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} mb-3`} />
          <p className="text-3xl font-display font-extrabold text-charcoal-900 dark:text-white">{c.value}</p>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

function SchemesAdmin() {
  const log = useLog();
  const [items, setItems] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Scheme | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    supabase.from('schemes').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setItems((data as Scheme[]) || []);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this scheme?')) return;
    await supabase.from('schemes').delete().eq('id', id);
    log('delete', 'scheme', id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">{items.length} Schemes</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="w-4 h-4" /> Add New</button>
      </div>
      {showForm && <SchemeForm scheme={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); load(); }} />}
      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-charcoal-900 dark:text-white truncate">{s.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={s.level === 'central' ? 'badge-emerald' : 'badge-gold'}>{s.level}</span>
                <span className={`badge ${s.published ? 'badge-emerald' : 'badge-charcoal'}`}>{s.published ? 'Published' : 'Draft'}</span>
                {s.trending && <span className="badge-gold">Trending</span>}
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(s); setShowForm(true); }} className="btn-ghost p-2"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(s.id)} className="btn-ghost p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SchemeForm({ scheme, onClose, onSaved }: { scheme: Scheme | null; onClose: () => void; onSaved: () => void }) {
  const log = useLog();
  const [form, setForm] = useState({
    title: scheme?.title || '',
    slug: scheme?.slug || '',
    level: scheme?.level || 'central',
    state: scheme?.state || '',
    short_description: scheme?.short_description || '',
    description: scheme?.description || '',
    eligibility: scheme?.eligibility || '',
    income_limit: scheme?.income_limit || '',
    age_limit: scheme?.age_limit || '',
    benefits: scheme?.benefits || '',
    online_process: scheme?.online_process || '',
    offline_process: scheme?.offline_process || '',
    official_website: scheme?.official_website || '',
    last_date: scheme?.last_date || '',
    trending: scheme?.trending || false,
    published: scheme?.published ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const payload = { ...form, slug, state: form.level === 'state' ? form.state : null };
    if (scheme) {
      await supabase.from('schemes').update(payload).eq('id', scheme.id);
      log('update', 'scheme', scheme.id);
    } else {
      const { data } = await supabase.from('schemes').insert(payload).select().single();
      if (data) log('create', 'scheme', data.id);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-charcoal-900 dark:text-white">{scheme ? 'Edit Scheme' : 'New Scheme'}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
            <input type="text" placeholder="Slug (auto)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input" />
            <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as 'central' | 'state' })} className="input">
              <option value="central">Central</option>
              <option value="state">State</option>
            </select>
            {form.level === 'state' && <input type="text" placeholder="State name" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input" />}
          </div>
          <textarea placeholder="Short description" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} rows={2} className="input" />
          <textarea placeholder="Full description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input" />
          <textarea placeholder="Eligibility" value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} rows={2} className="input" />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Income limit" value={form.income_limit} onChange={(e) => setForm({ ...form, income_limit: e.target.value })} className="input" />
            <input type="text" placeholder="Age limit" value={form.age_limit} onChange={(e) => setForm({ ...form, age_limit: e.target.value })} className="input" />
          </div>
          <textarea placeholder="Benefits" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} rows={2} className="input" />
          <textarea placeholder="Online process" value={form.online_process} onChange={(e) => setForm({ ...form, online_process: e.target.value })} rows={2} className="input" />
          <textarea placeholder="Offline process" value={form.offline_process} onChange={(e) => setForm({ ...form, offline_process: e.target.value })} rows={2} className="input" />
          <input type="text" placeholder="Official website URL" value={form.official_website} onChange={(e) => setForm({ ...form, official_website: e.target.value })} className="input" />
          <input type="text" placeholder="Last date" value={form.last_date} onChange={(e) => setForm({ ...form, last_date: e.target.value })} className="input" />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} /> Trending</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ScholarshipsAdmin() {
  const log = useLog();
  const [items, setItems] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Scholarship | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    supabase.from('scholarships').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setItems((data as Scholarship[]) || []);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this scholarship?')) return;
    await supabase.from('scholarships').delete().eq('id', id);
    log('delete', 'scholarship', id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">{items.length} Scholarships</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="w-4 h-4" /> Add New</button>
      </div>
      {showForm && <SimpleForm
        title={editing ? 'Edit Scholarship' : 'New Scholarship'}
        fields={['title', 'slug', 'provider', 'level', 'state', 'category', 'description', 'eligibility', 'amount', 'deadline', 'application_link', 'official_website']}
        item={editing as unknown as Record<string, unknown> | null}
        table="scholarships"
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSaved={() => { setShowForm(false); setEditing(null); load(); }}
        onLog={log}
      />}
      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-charcoal-900 dark:text-white truncate">{s.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="badge-emerald">{s.level}</span>
                {s.category && <span className="badge-charcoal">{s.category}</span>}
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(s); setShowForm(true); }} className="btn-ghost p-2"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(s.id)} className="btn-ghost p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesAdmin() {
  const log = useLog();
  const [items, setItems] = useState<CitizenService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CitizenService | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    supabase.from('citizen_services').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setItems((data as CitizenService[]) || []);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await supabase.from('citizen_services').delete().eq('id', id);
    log('delete', 'service', id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">{items.length} Services</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="w-4 h-4" /> Add New</button>
      </div>
      {showForm && <SimpleForm
        title={editing ? 'Edit Service' : 'New Service'}
        fields={['title', 'slug', 'category', 'what_is', 'description', 'eligibility', 'fees', 'timeline', 'offline_process']}
        item={editing as unknown as Record<string, unknown> | null}
        table="citizen_services"
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSaved={() => { setShowForm(false); setEditing(null); load(); }}
        onLog={log}
      />}
      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-charcoal-900 dark:text-white truncate">{s.title}</h3>
              {s.category && <span className="badge-emerald mt-1">{s.category}</span>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(s); setShowForm(true); }} className="btn-ghost p-2"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(s.id)} className="btn-ghost p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PoliciesAdmin() {
  const log = useLog();
  const [items, setItems] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Policy | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    supabase.from('policies').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setItems((data as Policy[]) || []);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this policy?')) return;
    await supabase.from('policies').delete().eq('id', id);
    log('delete', 'policy', id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">{items.length} Policies</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="w-4 h-4" /> Add New</button>
      </div>
      {showForm && <SimpleForm
        title={editing ? 'Edit Policy' : 'New Policy'}
        fields={['title', 'slug', 'category', 'summary', 'content', 'official_reference']}
        item={editing as unknown as Record<string, unknown> | null}
        table="policies"
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSaved={() => { setShowForm(false); setEditing(null); load(); }}
        onLog={log}
      />}
      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-charcoal-900 dark:text-white truncate">{s.title}</h3>
              {s.category && <span className="badge-gold mt-1">{s.category}</span>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(s); setShowForm(true); }} className="btn-ghost p-2"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(s.id)} className="btn-ghost p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogsAdmin() {
  const log = useLog();
  const [items, setItems] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    supabase.from('blogs').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setItems((data as Blog[]) || []);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog?')) return;
    await supabase.from('blogs').delete().eq('id', id);
    log('delete', 'blog', id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">{items.length} Blogs</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="w-4 h-4" /> Add New</button>
      </div>
      {showForm && <SimpleForm
        title={editing ? 'Edit Blog' : 'New Blog'}
        fields={['title', 'slug', 'excerpt', 'content', 'author', 'image_url']}
        item={editing as unknown as Record<string, unknown> | null}
        table="blogs"
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSaved={() => { setShowForm(false); setEditing(null); load(); }}
        onLog={log}
      />}
      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-charcoal-900 dark:text-white truncate">{s.title}</h3>
              <p className="text-xs text-charcoal-500">{s.author}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(s); setShowForm(true); }} className="btn-ghost p-2"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(s.id)} className="btn-ghost p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsAdmin() {
  const log = useLog();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Notification | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    supabase.from('notifications').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setItems((data as Notification[]) || []);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this notification?')) return;
    await supabase.from('notifications').delete().eq('id', id);
    log('delete', 'notification', id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">{items.length} Notifications</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="w-4 h-4" /> Add New</button>
      </div>
      {showForm && <SimpleForm
        title={editing ? 'Edit Notification' : 'New Notification'}
        fields={['title', 'body', 'type', 'link', 'target_audience']}
        item={editing as unknown as Record<string, unknown> | null}
        table="notifications"
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSaved={() => { setShowForm(false); setEditing(null); load(); }}
        onLog={log}
      />}
      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-charcoal-900 dark:text-white truncate">{s.title}</h3>
              <span className="badge-charcoal mt-1">{s.type}</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(s); setShowForm(true); }} className="btn-ghost p-2"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(s.id)} className="btn-ghost p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesAdmin() {
  const log = useLog();
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    supabase.from('categories').select('*').order('id', { ascending: true }).then(({ data }) => {
      setItems((data as Category[]) || []);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    await supabase.from('categories').delete().eq('id', id);
    log('delete', 'category', id.toString());
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">{items.length} Categories</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="w-4 h-4" /> Add New</button>
      </div>
      {showForm && <CategoryForm category={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); load(); }} onLog={log} />}
      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="glass-card p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-charcoal-900 dark:text-white">{s.name}</h3>
              <p className="text-xs text-charcoal-500">{s.slug} · {s.type}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(s); setShowForm(true); }} className="btn-ghost p-2"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(s.id)} className="btn-ghost p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryForm({ category, onClose, onSaved, onLog }: { category: Category | null; onClose: () => void; onSaved: () => void; onLog: (a: string, e: string, id?: string) => void }) {
  const [form, setForm] = useState({ name: category?.name || '', slug: category?.slug || '', icon: category?.icon || '', type: category?.type || 'scheme' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const payload = { ...form, slug };
    if (category) {
      await supabase.from('categories').update(payload).eq('id', category.id);
      onLog('update', 'category', category.id.toString());
    } else {
      const { data } = await supabase.from('categories').insert(payload).select().single();
      if (data) onLog('create', 'category', data.id.toString());
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-charcoal-900 dark:text-white">{category ? 'Edit Category' : 'New Category'}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-3">
          <input type="text" required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          <input type="text" placeholder="Slug (auto)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input" />
          <input type="text" placeholder="Icon name (Lucide)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input">
            <option value="scheme">Scheme</option>
            <option value="service">Service</option>
          </select>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1"><Save className="w-4 h-4" /> Save</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LogsAdmin() {
  const [items, setItems] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(50).then(({ data }) => {
      setItems((data as AdminLog[]) || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;
  if (items.length === 0) return <EmptyState title="No activity logs yet" icon={<Activity className="w-8 h-8" />} />;

  return (
    <div className="space-y-2">
      {items.map((l) => (
        <div key={l.id} className="glass-card p-3 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${l.action === 'delete' ? 'bg-red-100 dark:bg-red-900/30' : l.action === 'create' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gold-100 dark:bg-gold-900/30'}`}>
            <Activity className={`w-4 h-4 ${l.action === 'delete' ? 'text-red-600' : l.action === 'create' ? 'text-emerald-600' : 'text-gold-600'}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-charcoal-900 dark:text-white"><span className="font-semibold capitalize">{l.action}</span> {l.entity}</p>
            <p className="text-xs text-charcoal-500">{new Date(l.created_at).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Generic simple form for scholarships, services, policies, blogs, notifications
function SimpleForm({ title, fields, item, table, onClose, onSaved, onLog }: {
  title: string;
  fields: string[];
  item: Record<string, unknown> | null;
  table: string;
  onClose: () => void;
  onSaved: () => void;
  onLog: (a: string, e: string, id?: string) => void;
}) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach((f) => { init[f] = (item?.[f] as string) || ''; });
    return init;
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || (form.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const payload = { ...form, slug };
    if (item) {
      await supabase.from(table).update(payload).eq('id', item.id);
      onLog('update', table, item.id as string);
    } else {
      const { data } = await supabase.from(table).insert(payload).select().single();
      if (data) onLog('create', table, data.id as string);
    }
    setSaving(false);
    onSaved();
  };

  const isTextarea = (field: string) => ['description', 'eligibility', 'content', 'body', 'what_is', 'excerpt', 'offline_process', 'summary'].includes(field);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-charcoal-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-3">
          {fields.map((field) => (
            isTextarea(field) ? (
              <textarea key={field} placeholder={field.replace(/_/g, ' ')} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} rows={3} className="input" />
            ) : field === 'level' ? (
              <select key={field} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="input">
                <option value="central">Central</option>
                <option value="state">State</option>
                <option value="private">Private</option>
              </select>
            ) : (
              <input key={field} type="text" placeholder={field.replace(/_/g, ' ')} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="input" />
            )
          ))}
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MinistriesAdmin() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    supabase.from('ministries').select('*').order('name').then(({ data }) => {
      setItems(data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const { id, ...rest } = editing;
    if (id) {
      await supabase.from('ministries').update(rest).eq('id', id);
    } else {
      await supabase.from('ministries').insert(rest);
    }
    setEditing(null);
    load();
  };

  if (loading) return <LoadingSpinner label="Loading ministries..." />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Ministries & Departments</h2>
        <button onClick={() => setEditing({ name: '', slug: '', level: 'central', state: null, website: '' })} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Ministry
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((m) => (
          <div key={m.id as string} className="glass-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-sm text-charcoal-900 dark:text-white">{m.name as string}</h3>
                <p className="text-xs text-charcoal-500">{m.level as string} · {m.state as string || 'All India'}</p>
                {m.website && <a href={m.website as string} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline">{m.website as string}</a>}
              </div>
              <button onClick={() => setEditing(m)} className="btn-ghost p-1.5">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditing(null)}>
          <div className="glass-card p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-bold text-lg mb-4">{editing.id ? 'Edit' : 'Add'} Ministry</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <input className="input" placeholder="Name" value={(editing.name as string) || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
              <input className="input" placeholder="Slug" value={(editing.slug as string) || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} required />
              <select className="input" value={(editing.level as string) || 'central'} onChange={(e) => setEditing({ ...editing, level: e.target.value })}>
                <option value="central">Central</option>
                <option value="state">State</option>
              </select>
              <input className="input" placeholder="State (optional)" value={(editing.state as string) || ''} onChange={(e) => setEditing({ ...editing, state: e.target.value || null })} />
              <input className="input" placeholder="Website URL" value={(editing.website as string) || ''} onChange={(e) => setEditing({ ...editing, website: e.target.value })} />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1"><Save className="w-4 h-4" /> Save</button>
                <button type="button" onClick={() => setEditing(null)} className="btn-ghost"><X className="w-4 h-4" /></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SyncAdmin() {
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      supabase.from('data_sync_jobs').select('*').order('created_at', { ascending: false }),
      supabase.from('sync_log').select('*').order('started_at', { ascending: false }).limit(20),
    ]).then(([jobsRes, logsRes]) => {
      setJobs(jobsRes.data || []);
      setLogs(logsRes.data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingSpinner label="Loading sync jobs..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title mb-4">Data Synchronization Jobs</h2>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">
          Automated sync jobs import data from official government portals like myScheme.gov.in and scholarships.gov.in. Jobs run on a schedule and mark imported data with last-verified timestamps.
        </p>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id as string} className="glass-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <RefreshCw className={`w-4 h-4 ${job.enabled ? 'text-emerald-500' : 'text-charcoal-400'}`} />
                    <h3 className="font-semibold text-sm text-charcoal-900 dark:text-white">{job.name as string}</h3>
                    <span className={`badge ${job.enabled ? 'badge-emerald' : 'badge-charcoal'}`}>{job.enabled ? 'Active' : 'Disabled'}</span>
                  </div>
                  <p className="text-xs text-charcoal-500 mb-2">Source: {job.source as string} · Schedule: {job.schedule as string} · Entity: {job.entity as string}</p>
                  {job.endpoint && <p className="text-xs text-charcoal-400 font-mono break-all">{job.endpoint as string}</p>}
                  {job.last_run && <p className="text-xs text-charcoal-400 mt-1">Last run: {new Date(job.last_run as string).toLocaleString('en-IN')}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="section-title mb-4">Recent Sync Activity</h2>
        {logs.length === 0 ? (
          <EmptyState title="No sync activity yet" description="Sync logs will appear here when jobs run." icon={<Activity className="w-8 h-8" />} />
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id as string} className="glass-card p-3 flex items-center justify-between">
                <div>
                  <span className={`badge ${log.status === 'completed' ? 'badge-emerald' : log.status === 'failed' ? 'badge-charcoal' : 'badge-gold'}`}>
                    {log.status as string}
                  </span>
                  <span className="text-xs text-charcoal-500 ml-2">
                    {log.records_imported as number} imported · {log.records_updated as number} updated · {log.errors as number} errors
                  </span>
                </div>
                <span className="text-xs text-charcoal-400">{new Date(log.started_at as string).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
