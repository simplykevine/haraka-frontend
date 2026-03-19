'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useThemeSafe } from '@/app/context/ThemeContext'; // ✅ Changed to useThemeSafe
import UserMessage from '@/app/chat/ChatMessages/components/UserMessageCard';
import AgentMessage from '@/app/chat/ChatMessages/components/AgentMessageCard';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  panel?: string;
  loading?: boolean;
}

const SUGGESTIONS = [
  { label: 'Analyze the projected maize supply gap',              panel: 'supply_gap' },
  { label: 'Evaluate import collision risk for April',            panel: 'import_collision' },
  { label: 'Compare maize sourcing: Uganda vs Tanzania vs Russia', panel: 'regional_arbitrage' },
  { label: 'Simulate 15% harvest reduction impact',               panel: 'rainfall_shock' },
  { label: 'Analyze the 4-month policy outlook',                  panel: 'policy_heatmap' },
  { label: 'Compare logistics: Mombasa port vs Busia border',     panel: 'logistics' },
];

const API_URL = 'https://zeno-tool-de589388395a.herokuapp.com';

export default function EconomistChatbot() {
  const { theme } = useThemeSafe(); // ✅ Changed to useThemeSafe
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePanel, setActivePanel] = useState<string>('supply_gap');
  const [progressMessages, setProgressMessages] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string, panel?: string) => {
    if (!text.trim() || loading) return;

    const resolvedPanel = panel || activePanel;

    setMessages(prev => [...prev, { role: 'user', content: text, panel: resolvedPanel }]);
    setInput('');
    setLoading(true);

    setProgressMessages(['Fetching dashboard data...']);
    setTimeout(() => setProgressMessages(prev => [...prev, 'Running economic analysis...']), 800);
    setTimeout(() => setProgressMessages(prev => [...prev, 'Generating insights...']), 1600);

    try {
      const res = await fetch(`${API_URL}/dashboard/economist/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, panel: resolvedPanel }),
      });
      const data = await res.json();
      const analysis = data.analysis || data.response || data.error || 'No response received.';

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: analysis, panel: resolvedPanel },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Could not reach the Zeno backend.',
          panel: resolvedPanel,
        },
      ]);
    } finally {
      setLoading(false);
      setProgressMessages([]);
    }
  };

  const handleSuggestion = (s: typeof SUGGESTIONS[0]) => {
    setActivePanel(s.panel);
    sendMessage(s.label, s.panel);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input, activePanel);
  };

  // Theme-aware styles
  const containerBg = theme === 'light' ? 'bg-white' : 'bg-[#091326]';
  const headerBg = theme === 'light' ? 'bg-blue-50' : 'bg-[#0a1628]';
  const borderColor = theme === 'light' ? 'border-blue-200' : 'border-teal-400/30';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const selectBg = theme === 'light' ? 'bg-blue-50' : 'bg-[#0d1f38]';
  const selectText = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const selectBorder = theme === 'light' ? 'border-blue-300' : 'border-teal-400/30';
  const suggestionBg = theme === 'light' ? 'bg-blue-100' : 'bg-teal-900/30';
  const suggestionText = theme === 'light' ? 'text-blue-700' : 'text-teal-300';
  const suggestionBorder = theme === 'light' ? 'border-blue-300' : 'border-teal-600/40';
  const suggestionHover = theme === 'light' ? 'hover:bg-blue-200' : 'hover:bg-teal-800/40';
  const messageAreaBg = theme === 'light' ? 'bg-gray-50' : 'bg-[#0B182F]';
  const messageAreaBorder = theme === 'light' ? 'border-gray-200' : 'border-white/10';
  const inputBg = theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/70';
  const inputBorder = theme === 'light' ? 'border-blue-300' : 'border-cyan-400/50';
  const inputText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const inputPlaceholder = theme === 'light' ? 'placeholder-blue-500' : 'placeholder-cyan-300';
  const buttonBg = theme === 'light' ? 'bg-blue-600' : 'bg-cyan-500';
  const buttonHover = theme === 'light' ? 'hover:bg-blue-700' : 'hover:bg-cyan-400';
  const panelBadgeText = theme === 'light' ? 'text-blue-600' : 'text-teal-400';
  const emptyStateText = theme === 'light' ? 'text-gray-500' : 'text-gray-500';
  const emptyStateSmallText = theme === 'light' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`rounded-xl border ${borderColor} ${containerBg} flex flex-col overflow-hidden`}>

      {/* Header */}
      <div className={`flex items-center gap-3 px-6 py-4 border-b ${messageAreaBorder} ${headerBg}`}>
        <Image
          src="/images/zeno-logo-icon.png"
          alt="Zeno AI Logo"
          width={32}
          height={32}
        />
        <div>
          <h2 className={`${textPrimary} font-semibold`}>Dr. Zeno — Economist AI</h2>
          <p className={`${textSecondary} text-xs`}>Ask questions about any dashboard panel above</p>
        </div>
        
        {/* Panel Selector */}
        <select
          value={activePanel}
          onChange={e => setActivePanel(e.target.value)}
          className={`ml-auto ${selectBg} ${selectText} text-xs border ${selectBorder} rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer transition-all`}
        >
          <option value="supply_gap">Supply Gap</option>
          <option value="import_collision">Import Collision</option>
          <option value="policy_heatmap">Policy Heatmap</option>
          <option value="regional_arbitrage">Regional Arbitrage</option>
          <option value="rainfall_shock">Rainfall Shock</option>
          <option value="logistics">Logistics</option>
        </select>
      </div>

      {/* Suggestions */}
      <div className={`flex gap-2 flex-wrap px-6 py-3 border-b ${messageAreaBorder} ${headerBg}`}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => handleSuggestion(s)}
            disabled={loading}
            className={`text-xs px-3 py-1.5 rounded-full ${suggestionBg} ${suggestionText} border ${suggestionBorder} ${suggestionHover} transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Messages Area */}
      <div
        className={`flex-1 overflow-y-auto px-6 py-4 space-y-4 ${messageAreaBg}`}
        style={{ minHeight: '300px', maxHeight: '480px' }}
      >
        {messages.length === 0 && (
          <div className={`text-center ${emptyStateText} mt-10 space-y-2`}>
            <Image
              src="/images/zeno-logo-icon.png"
              alt="Zeno"
              width={48}
              height={48}
              className="mx-auto opacity-30"
            />
            <p className="text-sm">Click a suggestion above or type a question below.</p>
            <p className={`text-xs ${emptyStateSmallText}`}>
              Dr. Zeno has full access to all dashboard panels and East African trade data.
            </p>
          </div>
        )}

        {messages.map((m, i) => {
          if (m.role === 'user') {
            return (
              <div key={i}>
                {/* Panel badge above user message */}
                {m.panel && (
                  <div className="flex justify-end mb-1">
                    <span className={`text-[10px] ${panelBadgeText} uppercase tracking-widest font-semibold`}>
                      📊 {m.panel.replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
                {/* User Message */}
                <UserMessage text={m.content} files={[]} />
              </div>
            );
          }
          return (
            <div key={i}>
              {/* Agent Message */}
              <AgentMessage text={m.content} />
            </div>
          );
        })}

        {/* Loading state */}
        {loading && (
          <AgentMessage
            loading={true}
            progressMessages={progressMessages}
          />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Section */}
      <div className={`px-6 py-4 border-t ${messageAreaBorder} ${containerBg}`}>
        <form
          onSubmit={handleSubmit}
          className={`relative flex items-center w-full ${inputBg} border ${inputBorder} rounded-full shadow-lg overflow-hidden py-1 pl-4 pr-1 transition-all`}
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Dr. Zeno about any dashboard panel..."
            disabled={loading}
            className={`flex-1 bg-transparent ${inputText} ${inputPlaceholder} px-2 py-2 focus:outline-none text-sm disabled:opacity-50`}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`mr-2 ${buttonBg} rotate-45 ${buttonHover} text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
            title="Send"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin -rotate-45" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
        <div className={`text-sm ${textSecondary} mt-2 text-center`}>
          Zeno AI can hallucinate, so double-check it
        </div>
      </div>
    </div>
  );
}