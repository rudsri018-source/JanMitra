import { useState, useRef, useEffect } from 'react';
import { useSchemes } from '../hooks/useData';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import { generateResponse, parseFollowUpAnswer, queryRagEndpoint, type ChatMessage, type HistoryEntry, type RagResult } from '../lib/ai';
import type { EligibilityProfile } from '../types';
import { Sparkles, Send, Mic, Bot, User as UserIcon, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Link } from '../router/Router';

export function AssistantPage() {
  const { t } = useTranslation();
  const { schemes } = useSchemes();
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [partialProfile, setPartialProfile] = useState<Partial<EligibilityProfile>>({});
  const [collectedProfile, setCollectedProfile] = useState<EligibilityProfile | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: "Namaste! I'm JanMitra, your AI Government Assistant powered by Gemini. I can help you with government schemes, scholarships, citizen services, and policies.\n\nAsk me anything — I understand English, Hindi, and Hinglish!",
      },
    ]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (profile) {
      setPartialProfile({
        age: profile.age,
        gender: profile.gender,
        state: profile.state,
        district: profile.district,
        occupation: profile.occupation,
        annual_income: profile.annual_income,
        caste: profile.caste,
        religion: profile.religion,
        disability: profile.disability,
        education: profile.education,
        veteran: profile.veteran,
        farmer: profile.farmer,
        student: profile.student,
        business_owner: profile.business_owner,
      });
    }
  }, [profile]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    let updatedProfile = { ...partialProfile };

    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.followUps && lastMsg.followUps.length > 0) {
      const key = lastMsg.followUps[0];
      const parsed = parseFollowUpAnswer(key, text);
      updatedProfile = { ...updatedProfile, ...parsed };
      setPartialProfile(updatedProfile);
    }

    const requiredFields = ['age', 'gender', 'state', 'occupation', 'annual_income', 'caste', 'disability', 'education'];
    const isComplete = requiredFields.every((f) => {
      const val = (updatedProfile as Record<string, unknown>)[f];
      return val !== undefined && val !== null && val !== '';
    });

    const profileForQuery = isComplete ? (updatedProfile as EligibilityProfile) : collectedProfile;
    if (isComplete) setCollectedProfile(updatedProfile as EligibilityProfile);

    // Query RAG endpoint with conversation history
    let ragResults: RagResult[] = [];
    let ragResponse = '';
    let geminiUsed = false;
    let geminiError: string | null = null;
    try {
      const history: HistoryEntry[] = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-6)
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
      const rag = await queryRagEndpoint(text, profileForQuery || updatedProfile, history);
      ragResults = rag.results;
      ragResponse = rag.response;
      geminiUsed = rag.geminiUsed;
      geminiError = rag.geminiError;
    } catch {
      ragResults = [];
    }

    const response = generateResponse(text, schemes, updatedProfile, profileForQuery, ragResults, ragResponse);
    if (ragResponse) {
      response.content = ragResponse;
    }
    response.geminiUsed = geminiUsed;
    response.geminiError = geminiError;
    setMessages((prev) => [...prev, response]);
    setLoading(false);
  };

  const handleVoice = () => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is not supported in your browser. Please use Chrome or Edge.');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognition as any)();
    recognition.lang = 'en-IN';
    recognition.onresult = (event: { results: { 0: { transcript: string } }[] }) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };
    recognition.start();
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-600/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-xl text-charcoal-900 dark:text-white">{t('aiAssistant')}</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{t('askAbout')}</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto glass rounded-2xl p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              msg.role === 'assistant' ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-charcoal-200 dark:bg-charcoal-700'
            }`}>
              {msg.role === 'assistant' ? <Bot className="w-5 h-5 text-white" /> : <UserIcon className="w-5 h-5 text-charcoal-600 dark:text-charcoal-300" />}
            </div>
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`rounded-2xl p-4 ${
                msg.role === 'assistant'
                  ? 'glass rounded-tl-sm'
                  : 'bg-emerald-600 text-white rounded-tr-sm'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.geminiUsed && (
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-emerald-100 dark:border-emerald-900/30">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Powered by Gemini</span>
                  </div>
                )}
                {msg.geminiError && !msg.geminiUsed && (
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-amber-100 dark:border-amber-900/30">
                    <ShieldCheck className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] text-amber-600 dark:text-amber-400">Verified government data</span>
                  </div>
                )}
              </div>
              {msg.results && msg.results.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.results.map((r, j) => (
                    <Link key={j} to={`/${r.type === 'scheme' ? 'schemes' : r.type === 'scholarship' ? 'scholarships' : r.type === 'service' ? 'services' : 'policies'}/${r.slug}`} className="block">
                      <div className="glass-card p-3 text-left hover:scale-[1.01] transition-transform">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-charcoal-900 dark:text-white line-clamp-1">{r.title}</h4>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {r.confidence !== undefined && (
                              <span className={`flex items-center gap-0.5 text-[10px] font-medium ${r.confidence >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} title="Confidence score">
                                {r.confidence >= 70 ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                                {r.confidence}%
                              </span>
                            )}
                            <span className={`badge ${r.score >= 75 ? 'badge-emerald' : 'badge-gold'}`}>{r.score}%</span>
                          </div>
                        </div>
                        {r.reasons.length > 0 && (
                          <ul className="text-xs text-charcoal-500 dark:text-charcoal-400 space-y-0.5">
                            {r.reasons.slice(0, 2).map((reason, k) => (
                              <li key={k} className="flex items-start gap-1">
                                <span className="text-emerald-500">•</span>
                                <span className="line-clamp-1">{reason}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                          {t('viewDetails')} <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.suggestions.map((s, j) => (
                    <button
                      key={j}
                      onClick={() => handleSend(s)}
                      className="rounded-full px-3 py-1.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="glass rounded-2xl rounded-tl-sm p-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce-soft" />
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce-soft" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce-soft" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
        className="mt-4 flex items-center gap-2"
      >
        <button type="button" onClick={handleVoice} className="btn-ghost p-2.5" aria-label={t('startVoice')}>
          <Mic className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('askQuestion')}
          className="input flex-1"
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary p-2.5">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
