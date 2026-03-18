'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
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

const API_URL = process.env.BASE_URL 

export default function EconomistChatbot() {
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
          content: '⚠️ Could not reach the Zeno backend. Make sure it is running on port 8080.',
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

  return (
    <div className="rounded-xl border border-teal-400/30 bg-[#091326] flex flex-col overflow-hidden">

      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
        <Image
          src="/images/zeno-logo-icon.png"
          alt="Zeno AI Logo"
          width={32}
          height={32}
        />
        <div>
          <h2 className="text-white font-semibold">Dr. Zeno — Economist AI</h2>
          <p className="text-gray-400 text-xs">Ask questions about any dashboard panel above</p>
        </div>
        <select
          value={activePanel}
          onChange={e => setActivePanel(e.target.value)}
          className="ml-auto bg-[#0d1f38] text-gray-300 text-xs border border-teal-400/30 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
        >
          <option value="supply_gap">Supply Gap</option>
          <option value="import_collision">Import Collision</option>
          <option value="policy_heatmap">Policy Heatmap</option>
          <option value="regional_arbitrage">Regional Arbitrage</option>
          <option value="rainfall_shock">Rainfall Shock</option>
          <option value="logistics">Logistics</option>
        </select>
      </div>

      <div className="flex gap-2 flex-wrap px-6 py-3 border-b border-white/5 bg-[#0a1628]">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => handleSuggestion(s)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full bg-teal-900/30 text-teal-300 border border-teal-600/40 hover:bg-teal-800/40 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-[#0B182F]"
        style={{ minHeight: '300px', maxHeight: '480px' }}
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10 space-y-2">
            <Image
              src="/images/zeno-logo-icon.png"
              alt="Zeno"
              width={48}
              height={48}
              className="mx-auto opacity-30"
            />
            <p className="text-sm">Click a suggestion above or type a question below.</p>
            <p className="text-xs text-gray-600">
              Dr. Zeno has full access to all dashboard panels and East African trade data.
            </p>
          </div>
        )}

        {messages.map((m, i) => {
          if (m.role === 'user') {
            return (
              <div key={i}>
                {m.panel && (
                  <div className="flex justify-end mb-1">
                    <span className="text-[10px] text-teal-400 uppercase tracking-widest font-semibold">
                      📊 {m.panel.replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
                <UserMessage text={m.content} files={[]} />
              </div>
            );
          }
          return (
            <div key={i}>
              <AgentMessage text={m.content} />
            </div>
          );
        })}

        {loading && (
          <AgentMessage
            loading={true}
            progressMessages={progressMessages}
          />
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-6 py-4 border-t border-white/10 bg-[#091326]">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center w-full bg-blue-900/70 border border-cyan-400/50 rounded-full shadow-lg overflow-hidden py-1 pl-4 pr-1"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Dr. Zeno about any dashboard panel..."
            disabled={loading}
            className="flex-1 bg-transparent text-white placeholder-cyan-300 px-2 py-2 focus:outline-none text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="mr-2 bg-cyan-500 rotate-45 hover:bg-cyan-400 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
        <div className="text-sm text-gray-400 mt-2 text-center">
          Zeno AI can hallucinate, so double-check it
        </div>
      </div>
    </div>
  );
}