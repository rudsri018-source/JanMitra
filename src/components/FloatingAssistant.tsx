import { useState } from 'react';
import { useSchemes } from '../hooks/useData';
import { useTranslation } from '../i18n/useTranslation';
import { generateResponse, queryRagEndpoint, type ChatMessage } from '../lib/ai';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import { Link } from '../router/Router';

export function FloatingAssistant() {
  const { t } = useTranslation();
  const { schemes } = useSchemes();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm your AI Government Assistant. Ask me about schemes, scholarships, or services.", suggestions: ['Find schemes for me', 'Scholarships', 'How to get Aadhaar?'] },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-4)
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
      const rag = await queryRagEndpoint(text, {}, history);
      const response = generateResponse(text, schemes, {}, null, rag.results, rag.response);
      setMessages((prev) => [...prev, response]);
    } catch {
      const response = generateResponse(text, schemes, {}, null);
      setMessages((prev) => [...prev, response]);
    }
    setLoading(false);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 lg:right-8 z-50 w-96 max-w-[calc(100vw-2rem)] glass rounded-2xl shadow-2xl flex flex-col animate-scale-in" style={{ maxHeight: '70vh' }}>
          <div className="flex items-center justify-between p-4 border-b border-charcoal-200/50 dark:border-charcoal-800/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white">{t('aiAssistant')}</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'assistant' && <Bot className="w-6 h-6 text-emerald-500 flex-shrink-0" />}
                <div className={`max-w-[80%] rounded-xl p-2.5 text-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-900 dark:text-charcoal-100'}`}>
                  {msg.content}
                  {msg.results && msg.results.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.results.slice(0, 3).map((r, j) => (
                        <Link key={j} to={`/schemes/${r.slug}`} onClick={() => setOpen(false)} className="block text-xs underline">
                          {r.title} ({r.score}%)
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <Bot className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <div className="bg-charcoal-100 dark:bg-charcoal-800 rounded-xl p-2.5 text-xs text-charcoal-500">
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}
          </div>
          {messages.length > 0 && messages[messages.length - 1].suggestions && (
            <div className="px-4 pb-2 flex flex-wrap gap-1">
              {messages[messages.length - 1].suggestions!.slice(0, 3).map((s, i) => (
                <button key={i} onClick={() => handleSend(s)} className="text-xs rounded-full px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100">
                  {s}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="p-3 border-t border-charcoal-200/50 dark:border-charcoal-800/50 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask..." className="input flex-1 text-sm" />
            <button type="submit" className="btn-primary p-2"><Send className="w-4 h-4" /></button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-4 lg:right-8 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-xl shadow-emerald-600/30 flex items-center justify-center hover:scale-110 transition-transform animate-float"
        aria-label="AI Assistant"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
      </button>
    </>
  );
}
