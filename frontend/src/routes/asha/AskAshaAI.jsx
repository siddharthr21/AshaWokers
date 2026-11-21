import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuthStore } from '../../stores/authStore';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { useTx } from '../../context/TranslationContext';
import { useLanguageStore } from '../../stores/languageStore';
import { apiFetch } from '../../utils/api';
import AiScreeningDisclaimer from '../../components/AiScreeningDisclaimer';

const QUICK_QUESTIONS = [
  { label: 'SAM Signs?', q: 'What are the signs of Severe Acute Malnutrition in a child?' },
  { label: 'ANC Schedule', q: 'What is the ANC schedule for a pregnant woman?' },
  { label: 'Vaccination', q: 'What vaccines does a 6-week-old baby need?' },
  { label: 'Danger Signs', q: 'What are the danger signs in a newborn baby?' },
];

function TypingDots() {
  return (
    <div className="flex items-start">
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
        <div className="w-2 h-2 bg-[#02343F] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-[#02343F] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-[#02343F] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

export default function AskAshaAI() {
  const { user } = useAuthStore();
  const tx = useTx();
  const { currentLanguage } = useLanguageStore();
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Namaste! I am Asha Vaani — your health assistant. Ask me about malnutrition, ANC, vaccination, danger signs, or any health protocol.',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages, isTyping]);

  // ── Core send function ───────────────────────────────────────────────────────
  const sendToChatAPI = async (text) => {
    setIsTyping(true);
    setErrorState(null);

    // Build conversation history (exclude error messages)
    const history = messages
      .filter(m => !m.isError)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const data = await apiFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: text,
          language: currentLanguage || 'en',
          conversation_history: history,
        }),
      });

      let replyContent = 'No response received. Please try again.';
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          replyContent = parsed.response || parsed.message || parsed.reply || data;
        } catch {
          replyContent = data;
        }
      } else if (data && typeof data === 'object') {
        replyContent = data.response || data.message || data.reply || (data.detail ? String(data.detail) : JSON.stringify(data));
      }

      setMessages(prev => [
        ...prev,
        { role: 'ai', content: replyContent, timestamp: Date.now() },
      ]);
    } catch (err) {
      console.error('[AskAshaAI] chat error:', err);
      setErrorState(text);
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: `Could not reach Asha Vaani. ${err.message || 'Check your connection.'}`,
          isError: true,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSendText = () => {
    const text = inputText.trim();
    if (!text || isTyping) return;
    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: Date.now() }]);
    setInputText('');
    sendToChatAPI(text);
    inputRef.current?.focus();
  };

  const handleQuickQuestion = (q) => {
    if (isTyping) return;
    setMessages(prev => [...prev, { role: 'user', content: q, timestamp: Date.now() }]);
    sendToChatAPI(q);
  };

  const handleRetry = () => {
    if (errorState) {
      setMessages(prev => prev.filter(m => !m.isError));
      sendToChatAPI(errorState);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  // ── Voice ─────────────────────────────────────────────────────────────────────
  const onVoiceTranscription = (_fields, transcript) => {
    if (transcript?.trim()) {
      setMessages(prev => [
        ...prev,
        { role: 'user', content: transcript, isVoice: true, timestamp: Date.now() },
      ]);
      sendToChatAPI(transcript);
    }
  };

  const { isRecording, isProcessing, startRecording, stopRecording } =
    useVoiceRecorder('chat', onVoiceTranscription);

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', background: '#F5F4EF', borderRadius: '20px', overflow: 'hidden', border: '1px solid #D3D1C7' }}>

      {/* ── Header ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #D8D4B0', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #F0EDCC, #E5E0BC)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #D8D4B0' }}>
          <span className="material-symbols-outlined" style={{ color: '#02343F', fontSize: '22px' }}>smart_toy</span>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: '800', color: '#02343F', fontSize: '15px', lineHeight: 1.2 }}>Ask Asha Vaani</h2>
          <p style={{ fontSize: '11px', color: '#02343F', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
            <span style={{ width: '7px', height: '7px', background: '#02343F', borderRadius: '50%', display: 'inline-block' }} />
            {tx('Powered by Gemini')} · {tx('Always online')}
          </p>
        </div>
      </div>

      <div style={{ padding: '8px 16px 0' }}>
        <AiScreeningDisclaimer />
      </div>

      {/* ── Quick Questions (show only at start) ── */}
      {messages.length === 1 && (
        <div style={{ padding: '14px 16px 4px', display: 'flex', gap: '8px', flexWrap: 'wrap', flexShrink: 0 }}>
          {QUICK_QUESTIONS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleQuickQuestion(item.q)}
              disabled={isTyping}
              style={{
                background: '#FAF8EA', border: '1.5px solid #02343F', color: '#02343F',
                borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: '700',
                cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'ai' ? 'flex-start' : 'flex-end' }}>
            <div
              style={{
                maxWidth: '85%', borderRadius: '18px', padding: '12px 16px', fontSize: '14px', lineHeight: '1.6',
                ...(m.role === 'ai'
                  ? m.isError
                    ? { background: '#FCEBEB', border: '1px solid #E24B4A', color: '#791F1F', borderTopLeftRadius: '4px' }
                    : { background: '#fff', border: '1px solid #D8D4B0', color: '#02343F', borderTopLeftRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }
                  : { background: '#02343F', color: '#F0EDCC', borderTopRightRadius: '4px', boxShadow: '0 2px 8px rgba(2,52,63,0.3)' }
                ),
              }}
            >
              {/* AI icon + voice tag */}
              {m.role === 'ai' && !m.isError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#02343F' }}>smart_toy</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#02343F', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asha Vaani</span>
                </div>
              )}
              {m.isVoice && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>mic</span> Voice
                </span>
              )}
              {/* Message content — render markdown for AI, plain text for user */}
              {m.role === 'ai' && !m.isError ? (
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                </div>
              ) : (
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
              )}
              {m.isError && (
                <button
                  onClick={handleRetry}
                  style={{ marginTop: '8px', fontSize: '12px', fontWeight: '700', color: '#E24B4A', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>refresh</span> Retry
                </button>
              )}
            </div>
            <span style={{ fontSize: '10px', color: '#AAA', marginTop: '4px', paddingInline: '4px' }}>
              {formatTime(m.timestamp)}
            </span>
          </div>
        ))}

        {isTyping && <TypingDots />}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ── */}
      <div style={{ background: '#fff', borderTop: '1px solid #E8E7E0', padding: '12px 14px', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: '#F5F4EF',
            border: '1.5px solid #D3D1C7', borderRadius: '20px', padding: '6px 8px',
            transition: 'border-color 0.2s',
          }}
          onFocus={() => {}}
        >
          {/* Voice button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing || isTyping}
            style={{
              width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'all 0.2s',
              background: isRecording ? '#E24B4A' : isProcessing ? '#D8D4B0' : '#FAF8EA',
              color: isRecording ? '#fff' : '#02343F',
              animation: isRecording ? 'pulse 1s infinite' : 'none',
              border: isRecording ? 'none' : '1px solid #D8D4B0',
            }}
          >
            {isProcessing
              ? <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>refresh</span>
              : <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{isRecording ? 'stop_circle' : 'mic'}</span>
            }
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? tx('Listening…') : tx('Ask about health protocols…')}
            disabled={isRecording || isProcessing}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: '14px', color: '#02343F',
            }}
          />

          {/* Send button */}
          <button
            onClick={handleSendText}
            disabled={!inputText.trim() || isTyping || isRecording || isProcessing}
            style={{
              width: '36px', height: '36px', borderRadius: '50%', border: 'none', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              background: inputText.trim() && !isTyping ? '#02343F' : '#D8D4B0',
              color: '#F0EDCC', transition: 'background 0.2s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '10px', color: '#AAA', marginTop: '8px' }}>
          {tx('Asha Vaani provides guidance based on official protocols. Always refer emergencies to PHC.')}
        </p>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        `}</style>
      </div>
    </div>
  );
}
