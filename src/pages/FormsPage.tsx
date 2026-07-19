import { useState, useMemo } from 'react';
import { useSchemes, useServices } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter } from '../router/Router';
import { ClipboardList, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { EmptyState } from '../components/ui';

export function FormsPage() {
  const { t } = useTranslation();
  const { path } = useRouter();
  const { schemes } = useSchemes();
  const { services } = useServices();

  const urlParams = new URLSearchParams(path.split('?')[1] || '');
  const schemeId = urlParams.get('scheme');
  const serviceId = urlParams.get('service');

  const [selectedType, setSelectedType] = useState<'scheme' | 'service'>(schemeId ? 'scheme' : 'service');
  const [selectedId, setSelectedId] = useState(schemeId || serviceId || '');
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>([]);

  const selectedScheme = useMemo(() => schemes.find((s) => s.id === selectedId), [schemes, selectedId]);
  const selectedService = useMemo(() => services.find((s) => s.id === selectedId), [services, selectedId]);

  const steps: string[] = useMemo(() => {
    if (selectedType === 'scheme' && selectedScheme) {
      const s = selectedScheme;
      const stepsArr: string[] = [];
      if (s.online_process) stepsArr.push('Read the eligibility criteria carefully and confirm you qualify.');
      stepsArr.push('Gather all required documents: ' + s.required_documents.join(', '));
      if (s.online_process) stepsArr.push(s.online_process);
      if (s.official_website) stepsArr.push(`Visit the official website: ${s.official_website}`);
      stepsArr.push('Fill in your personal details, address, and contact information accurately.');
      stepsArr.push('Upload scanned copies of all required documents in the specified format.');
      stepsArr.push('Review your application thoroughly before submission.');
      stepsArr.push('Submit the application and note down any reference/application number.');
      stepsArr.push('Track your application status regularly using the reference number.');
      return stepsArr;
    }
    if (selectedType === 'service' && selectedService) {
      return selectedService.online_steps.length > 0
        ? ['Read the eligibility criteria and confirm you qualify.', 'Gather all required documents.', ...selectedService.online_steps, 'Note down any reference number for tracking.']
        : ['Read the eligibility criteria.', 'Gather required documents.', 'Visit the official portal or office.', 'Submit the application.'];
    }
    return [];
  }, [selectedType, selectedScheme, selectedService]);

  const toggleStep = (i: number) => {
    setCompleted((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const progress = steps.length > 0 ? Math.round((completed.filter(Boolean).length / steps.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-600/20">
          <ClipboardList className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">{t('formAssistant')}</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Step-by-step guidance through government forms.</p>
        </div>
      </div>

      <div className="glass-card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">Type</label>
            <div className="flex gap-2">
              <button onClick={() => { setSelectedType('scheme'); setSelectedId(''); setCompleted([]); setCurrentStep(0); }}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${selectedType === 'scheme' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 border border-charcoal-200 dark:border-charcoal-700'}`}>Scheme</button>
              <button onClick={() => { setSelectedType('service'); setSelectedId(''); setCompleted([]); setCurrentStep(0); }}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${selectedType === 'service' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 border border-charcoal-200 dark:border-charcoal-700'}`}>Service</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">Select {selectedType}</label>
            <select value={selectedId} onChange={(e) => { setSelectedId(e.target.value); setCompleted([]); setCurrentStep(0); }} className="input">
              <option value="">-- Select --</option>
              {selectedType === 'scheme'
                ? schemes.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)
                : services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      {!selectedId ? (
        <EmptyState title="Select a scheme or service" description="Choose above to get step-by-step form filling guidance." icon={<ClipboardList className="w-8 h-8" />} />
      ) : steps.length === 0 ? (
        <EmptyState title="No steps available" />
      ) : (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">{selectedScheme?.title || selectedService?.title}</h2>
            <span className="badge-emerald">{progress}% complete</span>
          </div>

          <div className="w-full h-2 bg-charcoal-100 dark:bg-charcoal-800 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          <div className="space-y-3">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-4 rounded-xl transition-all cursor-pointer ${
                  completed[i] ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-charcoal-50 dark:bg-charcoal-800/50 border border-transparent'
                } ${currentStep === i ? 'ring-2 ring-emerald-500/30' : ''}`}
                onClick={() => setCurrentStep(i)}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toggleStep(i); }}
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    completed[i] ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-charcoal-700 border border-charcoal-300 dark:border-charcoal-600 text-charcoal-400'
                  }`}
                >
                  {completed[i] ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                </button>
                <p className={`text-sm pt-1 ${completed[i] ? 'text-charcoal-500 dark:text-charcoal-400 line-through' : 'text-charcoal-900 dark:text-white'}`}>{step}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-charcoal-200/50 dark:border-charcoal-800/50">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="btn-ghost"
            >
              <ArrowLeft className="w-4 h-4" /> {t('previous')}
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="btn-primary"
            >
              {t('next')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
