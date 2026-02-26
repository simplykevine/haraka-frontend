'use client';

const TONS = 50000;
const BAG_KG = 90;
const BAGS = (TONS * 1000) / BAG_KG;

const routes = [
  {
    name: 'Port of Mombasa',
    icon: '🚢',
    freight: 8, clearing: 3, transport: 4, storage: 2,
    stability: 'High' as const,
  },
  {
    name: 'Busia Border',
    icon: '🛣️',
    freight: 3, clearing: 2, transport: 6, storage: 3,
    stability: 'Medium' as const,
  },
];

const stabilityStyle: Record<string, string> = {
  High:   'text-green-400 bg-green-900/20 border border-green-700',
  Medium: 'text-yellow-400 bg-yellow-900/20 border border-yellow-700',
  Low:    'text-red-400 bg-red-900/20 border border-red-700',
};

export default function LogisticsComparison() {
  const costs = routes.map(r => ({
    ...r,
    total: r.freight + r.clearing + r.transport + r.storage,
    totalShipment: (r.freight + r.clearing + r.transport + r.storage) * BAGS,
  }));
  const cheaper = costs[0].total < costs[1].total ? costs[0] : costs[1];

  return (
    <div className="rounded-xl p-6 border border-teal-400/30 bg-[#091326] space-y-4">
      <h2 className="text-white text-lg font-semibold">🚚 Logistics Cost Comparison</h2>
      <p className="text-gray-400 text-xs">Simulation: 50,000 tons to Nairobi</p>

      <div className="bg-green-900/20 border border-green-600 rounded-lg px-4 py-2 text-green-300 text-sm font-medium">
        ✅ {cheaper.name} is the cheaper route — saves ${((Math.max(...costs.map(c => c.total)) - cheaper.total) * BAGS).toLocaleString()} total
      </div>

      <div className="grid grid-cols-2 gap-4">
        {costs.map((r) => {
          const isWinner = r.name === cheaper.name;
          return (
            <div key={r.name} className={`rounded-xl p-5 border space-y-3 ${isWinner ? 'border-green-500 bg-green-900/10' : 'border-teal-400/30 bg-[#0d1f38]'}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{r.icon}</span>
                <h3 className="text-white font-semibold text-sm">{r.name}</h3>
                {isWinner && <span className="text-xs px-2 py-0.5 bg-green-800 text-green-200 rounded-full ml-auto">Cheaper</span>}
              </div>

              {[
                { label: 'Freight Cost', value: r.freight },
                { label: 'Clearing Cost', value: r.clearing },
                { label: 'Transport to Nairobi', value: r.transport },
                { label: 'Storage Cost', value: r.storage },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-gray-200">${value}/bag</span>
                </div>
              ))}

              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-gray-300 text-sm font-semibold">Landed Cost/bag</span>
                <span className={`text-xl font-extrabold ${isWinner ? 'text-green-400' : 'text-white'}`}>${r.total}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total (50k tons)</span>
                <span className="text-gray-200">${r.totalShipment.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Price Stability</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${stabilityStyle[r.stability]}`}>{r.stability}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}