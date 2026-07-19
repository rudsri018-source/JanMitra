import { useState, useMemo } from 'react';
import { useSchemes, useServices } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { useRouter } from '../router/Router';
import { FileCheck, Download, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { EmptyState } from '../components/ui';

interface DocItem {
  name: string;
  format: string;
  maxSize: string;
  validity: string;
  sampleUrl: string;
}

const DOC_LIBRARY: Record<string, DocItem> = {
  'Aadhaar card': { name: 'Aadhaar Card', format: 'PDF/JPG', maxSize: '2 MB', validity: 'Lifetime', sampleUrl: 'https://uidai.gov.in' },
  'PAN card': { name: 'PAN Card', format: 'PDF/JPG', maxSize: '2 MB', validity: 'Lifetime', sampleUrl: 'https://www.protean-tinpan.com' },
  'Bank account details': { name: 'Bank Passbook/Statement', format: 'PDF/JPG', maxSize: '2 MB', validity: 'Recent (6 months)', sampleUrl: '#' },
  'Income certificate': { name: 'Income Certificate', format: 'PDF', maxSize: '2 MB', validity: '1-3 years', sampleUrl: '#' },
  'Caste certificate': { name: 'Caste Certificate', format: 'PDF', maxSize: '2 MB', validity: 'Lifetime (SC/ST)', sampleUrl: '#' },
  'Birth certificate': { name: 'Birth Certificate', format: 'PDF', maxSize: '2 MB', validity: 'Lifetime', sampleUrl: 'https://crsorgi.gov.in' },
  'Land ownership documents (patta/khata)': { name: 'Land Records (Patta/Khata)', format: 'PDF', maxSize: '2 MB', validity: 'Current', sampleUrl: '#' },
  'Mobile number': { name: 'Mobile Number (Linked)', format: 'Active SIM', maxSize: 'N/A', validity: 'Active', sampleUrl: '#' },
  'Photograph': { name: 'Passport Photo', format: 'JPG/PNG', maxSize: '500 KB', validity: 'Recent', sampleUrl: '#' },
  'Address proof': { name: 'Address Proof', format: 'PDF/JPG', maxSize: '2 MB', validity: 'Current', sampleUrl: '#' },
};

export function DocumentsPage() {
  const { t } = useTranslation();
  const { path } = useRouter();
  const { schemes } = useSchemes();
  const { services } = useServices();

  const urlParams = new URLSearchParams(path.split('?')[1] || '');
  const schemeId = urlParams.get('scheme');
  const serviceId = urlParams.get('service');

  const [selectedType, setSelectedType] = useState<'scheme' | 'service'>(schemeId ? 'scheme' : serviceId ? 'service' : 'scheme');
  const [selectedId, setSelectedId] = useState(schemeId || serviceId || '');

  const selectedScheme = useMemo(() => schemes.find((s) => s.id === selectedId), [schemes, selectedId]);
  const selectedService = useMemo(() => services.find((s) => s.id === selectedId), [services, selectedId]);

  const documents: string[] = useMemo(() => {
    if (selectedType === 'scheme' && selectedScheme) return selectedScheme.required_documents;
    if (selectedType === 'service' && selectedService) return selectedService.required_documents;
    return [];
  }, [selectedType, selectedScheme, selectedService]);

  const checklist: DocItem[] = useMemo(() => {
    return documents.map((doc) => {
      const key = Object.keys(DOC_LIBRARY).find((k) => doc.toLowerCase().includes(k.toLowerCase()));
      return key ? DOC_LIBRARY[key] : { name: doc, format: 'PDF/JPG', maxSize: '2 MB', validity: 'Current', sampleUrl: '#' };
    });
  }, [documents]);

  const handleDownload = () => {
    const content = `Document Checklist\n\n${selectedScheme?.title || selectedService?.title || ''}\n\n${checklist.map((d, i) => `${i + 1}. ${d.name} - Format: ${d.format}, Max Size: ${d.maxSize}, Validity: ${d.validity}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document-checklist.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-600/20">
          <FileCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">{t('documentAssistant')}</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400">AI-generated personalized document checklist with formats and validity.</p>
        </div>
      </div>

      <div className="glass-card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => { setSelectedType('scheme'); setSelectedId(''); }}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  selectedType === 'scheme' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 border border-charcoal-200 dark:border-charcoal-700'
                }`}
              >Scheme</button>
              <button
                onClick={() => { setSelectedType('service'); setSelectedId(''); }}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  selectedType === 'service' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 border border-charcoal-200 dark:border-charcoal-700'
                }`}
              >Service</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1.5">Select {selectedType}</label>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="input">
              <option value="">-- Select --</option>
              {selectedType === 'scheme'
                ? schemes.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)
                : services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      {!selectedId ? (
        <EmptyState title="Select a scheme or service" description="Choose a scheme or service above to generate a personalized document checklist." icon={<FileText className="w-8 h-8" />} />
      ) : checklist.length === 0 ? (
        <EmptyState title="No documents required" icon={<CheckCircle2 className="w-8 h-8" />} />
      ) : (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">{t('documentChecklist')}</h2>
            <button onClick={handleDownload} className="btn-primary text-sm">
              <Download className="w-4 h-4" /> {t('downloadChecklist')}
            </button>
          </div>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">
            For: <span className="font-semibold text-charcoal-900 dark:text-white">{selectedScheme?.title || selectedService?.title}</span>
          </p>
          <div className="space-y-3">
            {checklist.map((doc, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-charcoal-50 dark:bg-charcoal-800/50">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-charcoal-900 dark:text-white">{doc.name}</h3>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                    <span><strong>Format:</strong> {doc.format}</span>
                    <span><strong>Max Size:</strong> {doc.maxSize}</span>
                    <span><strong>Validity:</strong> {doc.validity}</span>
                  </div>
                </div>
                {doc.sampleUrl && doc.sampleUrl !== '#' && (
                  <a href={doc.sampleUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs">
                    Sample <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
