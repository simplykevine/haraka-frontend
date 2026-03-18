'use client';

const sources = [
  { name: 'Kenya (Eldoret)',         price: 28, logistics: 2,  landed: 30 },
  { name: 'Uganda (Kampala)',        price: 18, logistics: 5,  landed: 23 },
  { name: 'Tanzania (Arusha)',       price: 20, logistics: 6,  landed: 26 },
  { name: 'Russia/Ukraine (Import)', price: 22, logistics: 9,  landed: 31 },
];

const kenyaLanded = sources.find(s => s.name.includes('Kenya'))!.landed;
const globalLanded = sources.find(s => s.name.includes('Russia'))!.landed;

export default function RegionalArbitrageMap() {
  const ugandaLanded = sources.find(s => s.name.includes('Uganda'))!.landed;
  const regionalShift = ((globalLanded - ugandaLanded) / globalLanded) * 100;

  return (
    <div className="rounded-xl p-6 border border-teal-400/30 bg-[#091326] space-y-4">
      <h2 className="text-white text-lg font-semibold">🌍 Regional Market Attractiveness</h2>

      {regionalShift >= 15 && (
        <div className="bg-green-900/20 border border-green-500 rounded-lg px-4 py-2 text-green-300 text-sm font-medium">
          🟢 Regional Shift Alert: Uganda sourcing {regionalShift.toFixed(0)}% cheaper than global imports. Recommend regional procurement.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 py-2 font-medium">Source</th>
              <th className="text-right text-gray-400 py-2 font-medium">Price</th>
              <th className="text-right text-gray-400 py-2 font-medium">Logistics</th>
              <th className="text-right text-gray-400 py-2 font-medium">Landed</th>
              <th className="text-right text-gray-400 py-2 font-medium">Comp. Index</th>
              <th className="text-center text-gray-400 py-2 font-medium">Signal</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => {
              const compIndex = ((kenyaLanded - s.landed) / kenyaLanded) * 100;
              const isKenya = s.name.includes('Kenya');
              return (
                <tr key={s.name} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 text-white font-medium">{s.name}</td>
                  <td className="text-right text-gray-300">${s.price}</td>
                  <td className="text-right text-gray-300">${s.logistics}</td>
                  <td className="text-right font-semibold text-white">${s.landed}</td>
                  <td className="text-right font-semibold">
                    {isKenya ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      <span className={compIndex > 0 ? 'text-green-400' : 'text-red-400'}>
                        {compIndex > 0 ? '+' : ''}{compIndex.toFixed(1)}%
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    {isKenya ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 border border-blue-700">Baseline</span>
                    ) : compIndex > 20 ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-300 border border-green-700">✅ Arbitrage</span>
                    ) : compIndex < 0 ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/40 text-red-300 border border-red-700">🔴 Inefficient</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-300 border border-yellow-700">⚠️ Watch</span>
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
          <div key={s.name} className="flex flex-col items-center gap-1">
            <div
              className="rounded-full flex items-center justify-center font-bold text-white border-2 border-teal-400/40"
              style={{
                width: `${40 + s.landed * 2}px`,
                height: `${40 + s.landed * 2}px`,
                background: `radial-gradient(circle, #1e3a5f, #091326)`,
                fontSize: `${10 + s.landed / 6}px`,
              }}
            >
              ${s.landed}
            </div>
            <span className="text-gray-400 text-[10px] text-center leading-tight max-w-[60px]">{s.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-xs">Bubble size = landed cost per 90kg bag (USD)</p>
    </div>
  );
}