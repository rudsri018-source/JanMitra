import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import { Mail, Lock, User, Phone, Chrome, UserCircle2, Sparkles, Shield, Globe, Zap } from 'lucide-react';
import { Link } from '../router/Router';

export function AuthPage() {
  const { t } = useTranslation();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithPhone, verifyPhoneOtp, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'phone'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = mode === 'signup'
      ? await signUpWithEmail(email, password, fullName)
      : await signInWithEmail(email, password);
    if (result.error) setError(result.error);
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signInWithPhone(phone);
    if (result.error) setError(result.error);
    else setOtpSent(true);
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await verifyPhoneOtp(phone, otp);
    if (result.error) setError(result.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - branding */}
      <div className="lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 dark:from-emerald-900 dark:via-charcoal-950 dark:to-emerald-950 flex items-center justify-center p-8 lg:p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative z-10 max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-2xl">{t('appName')}</h1>
              <p className="text-emerald-100 text-sm">{t('tagline')}</p>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            {[
              { icon: Zap, title: 'AI-Powered Search', desc: 'Find schemes and services instantly with natural language' },
              { icon: Shield, title: 'Smart Eligibility Checker', desc: 'Get personalized scheme recommendations in seconds' },
              { icon: Globe, title: 'Complete Scheme Database', desc: 'Central, State, and private schemes in one place' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{f.title}</h3>
                  <p className="text-emerald-100 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-emerald-100/80 text-xs">
            Trusted by citizens across India to navigate government services with confidence.
          </p>
        </div>
      </div>

      {/* Right side - auth form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-charcoal-50 dark:bg-charcoal-950">
        <div className="w-full max-w-md">
          <div className="glass-card p-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-display font-extrabold text-lg text-charcoal-900 dark:text-white">{t('appName')}</h1>
            </div>

            <h2 className="font-display font-bold text-2xl text-charcoal-900 dark:text-white mb-1">
              {mode === 'signin' && t('signIn')}
              {mode === 'signup' && t('signUp')}
              {mode === 'phone' && t('phoneOtp')}
            </h2>
            <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-6">
              {mode === 'signin' && 'Welcome back! Sign in to access your dashboard.'}
              {mode === 'signup' && 'Create an account to get started.'}
              {mode === 'phone' && 'Enter your phone number to receive an OTP.'}
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 animate-fade-in">
                {error}
              </div>
            )}

            {mode !== 'phone' && (
              <form onSubmit={handleEmail} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('fullName')}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="input pl-10"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input pl-10"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? t('loading') : mode === 'signin' ? t('signIn') : t('signUp')}
                </button>
              </form>
            )}

            {mode === 'phone' && !otpSent && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">{t('phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="input pl-10"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? t('loading') : t('sendOtp')}
                </button>
              </form>
            )}

            {mode === 'phone' && otpSent && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">Enter OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="input text-center text-2xl tracking-widest"
                  />
                  <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-2">OTP sent to {phone}</p>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? t('loading') : t('verifyOtp')}
                </button>
                <button type="button" onClick={() => { setOtpSent(false); setOtp(''); }} className="btn-ghost w-full">
                  {t('back')}
                </button>
              </form>
            )}

            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-charcoal-200 dark:bg-charcoal-700" />
              <span className="text-xs text-charcoal-400">or</span>
              <div className="flex-1 h-px bg-charcoal-200 dark:bg-charcoal-700" />
            </div>

            {mode !== 'phone' && (
              <button onClick={handleGoogle} disabled={loading} className="btn-secondary w-full">
                <Chrome className="w-4 h-4" />
                {t('google')}
              </button>
            )}

            <button
              onClick={() => setMode(mode === 'phone' ? 'signin' : 'phone')}
              className="btn-secondary w-full mt-3"
            >
              <Phone className="w-4 h-4" />
              {mode === 'phone' ? t('email') : t('phoneOtp')}
            </button>

            <button onClick={continueAsGuest} className="btn-ghost w-full mt-3">
              <UserCircle2 className="w-4 h-4" />
              {t('continueAsGuest')}
            </button>

            <p className="text-center text-sm text-charcoal-500 dark:text-charcoal-400 mt-5">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                {mode === 'signin' ? t('signUp') : t('signIn')}
              </button>
            </p>
          </div>

          <p className="text-center text-xs text-charcoal-400 mt-4">
            By continuing, you agree to our{' '}
            <Link to="/privacy" className="text-emerald-600 dark:text-emerald-400 hover:underline">Privacy Policy</Link>
            {' '}and{' '}
            <Link to="/terms" className="text-emerald-600 dark:text-emerald-400 hover:underline">Terms</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
