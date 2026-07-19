import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import { languages } from '../i18n/translations';
import { useStates, useDistricts } from '../hooks/useData';
import { supabase } from '../lib/supabase';
import { User, Save, CheckCircle2 } from 'lucide-react';

export function ProfilePage() {
  const { t } = useTranslation();
  const { profile, refreshProfile, user, isGuest } = useAuth();
  const { states } = useStates();
  const selectedState = states.find((s) => s.name === profile?.state);
  const { districts } = useDistricts(selectedState?.id ?? null);

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    age: '',
    gender: '',
    state: '',
    district: '',
    occupation: '',
    annual_income: '',
    caste: '',
    religion: '',
    disability: false,
    education: '',
    preferred_language: 'en' as string,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        state: profile.state || '',
        district: profile.district || '',
        occupation: profile.occupation || '',
        annual_income: profile.annual_income?.toString() || '',
        caste: profile.caste || '',
        religion: profile.religion || '',
        disability: profile.disability,
        education: profile.education || '',
        preferred_language: profile.preferred_language,
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({
      full_name: form.full_name || null,
      phone: form.phone || null,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender || null,
      state: form.state || null,
      district: form.district || null,
      occupation: form.occupation || null,
      annual_income: form.annual_income ? parseInt(form.annual_income) : null,
      caste: form.caste || null,
      religion: form.religion || null,
      disability: form.disability,
      education: form.education || null,
      preferred_language: form.preferred_language,
    }).eq('id', user.id);
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (isGuest) {
    return (
      <div className="max-w-2xl mx-auto glass-card p-8 text-center animate-fade-in">
        <User className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
        <h2 className="font-display font-bold text-lg text-charcoal-900 dark:text-white mb-2">Guest Mode</h2>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Sign in to create a profile and get personalized scheme recommendations.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-600/20">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">{t('profile')}</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{t('fillProfileForBetter')}</p>
        </div>
      </div>

      {saved && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" /> Profile saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('fullName')}</label>
            <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('phone')}</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('age')}</label>
            <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('gender')}</label>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input">
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('state')}</label>
            <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value, district: '' })} className="input">
              <option value="">Select</option>
              {states.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('district')}</label>
            <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="input">
              <option value="">Select</option>
              {districts.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('occupation')}</label>
            <select value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} className="input">
              <option value="">Select</option>
              <option value="Student">Student</option>
              <option value="Farmer">Farmer</option>
              <option value="Business">Business</option>
              <option value="Employed">Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Self Employed">Self Employed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('income')} (Rs)</label>
            <input type="number" value={form.annual_income} onChange={(e) => setForm({ ...form, annual_income: e.target.value })} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('caste')}</label>
            <select value={form.caste} onChange={(e) => setForm({ ...form, caste: e.target.value })} className="input">
              <option value="">Select</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC">OBC</option>
              <option value="General">General</option>
              <option value="EWS">EWS</option>
              <option value="Minority">Minority</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('education')}</label>
            <select value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} className="input">
              <option value="">Select</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="Higher Secondary">Higher Secondary</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="Not Studying">Not Studying</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('disability')}</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setForm({ ...form, disability: true })}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${form.disability ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 border border-charcoal-200 dark:border-charcoal-700'}`}>Yes</button>
              <button type="button" onClick={() => setForm({ ...form, disability: false })}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${!form.disability ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 border border-charcoal-200 dark:border-charcoal-700'}`}>No</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('language')}</label>
            <select value={form.preferred_language} onChange={(e) => setForm({ ...form, preferred_language: e.target.value })} className="input">
              {languages.map((l) => (
                <option key={l.code} value={l.code}>{l.nativeName} ({l.name})</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full">
          <Save className="w-4 h-4" /> {saving ? t('loading') : t('saveProfile')}
        </button>
      </form>
    </div>
  );
}
