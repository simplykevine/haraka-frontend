'use client';

import { useThemeSafe } from '@/app/context/ThemeContext';

const sources = [
  { name: 'Kenya (Eldoret)',         price: 28, logistics: 2,  landed: 30 },
  { name: 'Uganda (Kampala)',        price: 18, logistics: 5,  landed: 23 },
  { name: 'Tanzania (Arusha)',       price: 20, logistics: 6,  landed: 26 },
  { name: 'Russia/Ukraine (Import)', price: 22, logistics: 9,  landed: 31 },
];

const kenyaLanded = sources.find(s => s.name.includes('Kenya'))!.landed;
const globalLanded = sources.find(s => s.name.includes('Russia'))!.landed;

export default function RegionalArbitrageMap() {
  const { theme } = useThemeSafe();
  const ugandaLanded = sources.find(s => s.name.includes('Uganda'))!.landed;
  const regionalShift = ((globalLanded - ugandaLanded) / globalLanded) * 100;

  const containerBg = theme === 'light' ? 'bg-white' : 'bg-[#091326]';
  const containerBorder = theme === 'light' ? 'border-blue-200' : 'border-teal-400/30';
  const headingText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const alertBg = theme === 'light' ? 'bg-green-100' : 'bg-green-900/20';
  const alertBorder = theme === 'light' ? 'border-green-400' : 'border-green-500';
  const alertText = theme === 'light' ? 'text-green-700' : 'text-green-300';
  const tableHeaderBorder = theme === 'light' ? 'border-gray-300' : 'border-white/10';
  const tableHeaderText = theme === 'light' ? 'text-gray-700' : 'text-gray-400';
  const tableRowBorder = theme === 'light' ? 'border-gray-200' : 'border-white/5';
  const tableRowHover = theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-white/5';
  const tableCellText = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const tableCellPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  
  const baselineSignalBg = theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/40';
  const baselineSignalText = theme === 'light' ? 'text-blue-700' : 'text-blue-300';
  const baselineSignalBorder = theme === 'light' ? 'border-blue-400' : 'border-blue-700';
  
  const arbitrageSignalBg = theme === 'light' ? 'bg-green-100' : 'bg-green-900/40';
  const arbitrageSignalText = theme === 'light' ? 'text-green-700' : 'text-green-300';
  const arbitrageSignalBorder = theme === 'light' ? 'border-green-400' : 'border-green-700';
  
  const inefficientSignalBg = theme === 'light' ? 'bg-red-100' : 'bg-red-900/40';
  const inefficientSignalText = theme === 'light' ? 'text-red-700' : 'text-red-300';
  const inefficientSignalBorder = theme === 'light' ? 'border-red-400' : 'border-red-700';
  
  const watchSignalBg = theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900/40';
  const watchSignalText = theme === 'light' ? 'text-yellow-700' : 'text-yellow-300';
  const watchSignalBorder = theme === 'light' ? 'border-yellow-400' : 'border-yellow-700';
  
  const positiveText = theme === 'light' ? 'text-green-600' : 'text-green-400';
  const negativeText = theme === 'light' ? 'text-red-600' : 'text-red-400';
  
  const bubbleGradient = theme === 'light' 
    ? 'radial-gradient(circle, #dbeafe, #eff6ff)'
    : 'radial-gradient(circle, #1e3a5f, #091326)';
  const bubbleBorder = theme === 'light' ? 'border-blue-300' : 'border-teal-400/40';
  const bubbleText = theme === 'light' ? 'text-gray-700' : 'text-gray-400';
  const footerText = theme === 'light' ? 'text-gray-600' : 'text-gray-500';

  return (
    <div className={`rounded-xl p-6 border ${containerBorder} ${containerBg} space-y-4 transition-colors`}>
      <h2 className={`${headingText} text-lg font-semibold transition-colors`}>
        🌍 Regional Market Attractiveness
      </h2>

      {regionalShift >= 15 && (
        <div className={`${alertBg} border ${alertBorder} rounded-lg px-4 py-2 ${alertText} text-lg font-medium transition-colors`}>
          🟢 Regional Shift Alert: Uganda sourcing {regionalShift.toFixed(0)}% cheaper than global imports. Recommend regional procurement.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-lg transition-colors">
          <thead>
            <tr className={`border-b ${tableHeaderBorder} transition-colors`}>
              <th className={`text-left ${tableHeaderText} py-2 font-medium transition-colors`}>Source</th>
              <th className={`text-right ${tableHeaderText} py-2 font-medium transition-colors`}>Price</th>
              <th className={`text-right ${tableHeaderText} py-2 font-medium transition-colors`}>Logistics</th>
              <th className={`text-right ${tableHeaderText} py-2 font-medium transition-colors`}>Landed</th>
              <th className={`text-right ${tableHeaderText} py-2 font-medium transition-colors`}>Comp. Index</th>
              <th className={`text-center ${tableHeaderText} py-2 font-medium transition-colors`}>Signal</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => {
              const compIndex = ((kenyaLanded - s.landed) / kenyaLanded) * 100;
              const isKenya = s.name.includes('Kenya');
              return (
                <tr key={s.name} className={`border-t ${tableRowBorder} ${tableRowHover} transition-colors `}>
                  <td className={`py-3 ${tableCellPrimary} font-medium transition-colors`}>{s.name}</td>
                  <td className={`text-right ${tableCellText} transition-colors`}>${s.price}</td>
                  <td className={`text-right ${tableCellText} transition-colors`}>${s.logistics}</td>
                  <td className={`text-right font-semibold ${tableCellPrimary} transition-colors`}>${s.landed}</td>
                  <td className={`text-right font-semibold transition-colors`}>
                    {isKenya ? (
                      <span className={`${tableCellText} transition-colors`}>—</span>
                    ) : (
                      <span className={compIndex > 0 ? positiveText : negativeText}>
                        {compIndex > 0 ? '+' : ''}{compIndex.toFixed(1)}%
                      </span>
                    )}
                  </td>
                  <td className="text-center transition-colors">
                    {isKenya ? (
                      <span className={`text-lg px-2 py-0.5 rounded-full ${baselineSignalBg} ${baselineSignalText} border ${baselineSignalBorder} transition-colors`}>
                        Baseline
                      </span>
                    ) : compIndex > 20 ? (
                      <span className={`text-lg px-2 py-0.5 rounded-full ${arbitrageSignalBg} ${arbitrageSignalText} border ${arbitrageSignalBorder} transition-colors`}>
                        ✅ Arbitrage
                      </span>
                    ) : compIndex < 0 ? (
                      <span className={`text-lg px-2 py-0.5 rounded-full ${inefficientSignalBg} ${inefficientSignalText} border ${inefficientSignalBorder} transition-colors`}>
                        🔴 Inefficient
                      </span>
                    ) : (
                      <span className={`text-lg px-2 py-0.5 rounded-full ${watchSignalBg} ${watchSignalText} border ${watchSignalBorder} transition-colors`}>
                        ⚠️ Watch
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-2 flex-wrap">
        {sources.map((s) => (
          <div key={s.name} className="flex flex-col items-center gap-1 ">
            <div
              className={`rounded-full flex items-center justify-center font-bold border-2 ${bubbleBorder} transition-all`}
              style={{
                width: `${40 + s.landed * 2}px`,
                height: `${40 + s.landed * 2}px`,
                background: bubbleGradient,
                fontSize: `${10 + s.landed / 6}px`,
                color: theme === 'light' ? '#1f2937' : '#ffffff',
              }}
            >
              ${s.landed}
            </div>
            <span className={`${bubbleText} text-[17px] text-center leading-tight max-w-[60px] transition-colors`}>
              {s.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
      
      <p className={`${footerText} text-lg transition-colors`}>
        Bubble size = landed cost per 90kg bag (USD)
      </p>
    </div>
  );
}