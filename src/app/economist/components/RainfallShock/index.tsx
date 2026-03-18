'use client';

const data = {
  originalSupply: 120000,
  reductionPct: 15,
  reducedSupply: 102000,
  consumption: 132000,
  importReqIncreasePct: 22,
  priceMovement: '+12–18%',
};

export default function RainfallShock() {
  const newGap = data.consumption - data.reducedSupply;
  const originalGap = data.consumption - data.originalSupply;

  return (
    <div className="rounded-xl p-6 border-2 border-yellow-600/60 bg-[#091326] space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🌧️</span>
        <div>
          <h2 className="text-white text-lg font-semibold">Rainfall Shock Scenario</h2>
          <p className="text-yellow-400 text-xs font-medium">Simulation: 15% harvest reduction due to below-average rainfall</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-[#0d1f38] rounded-lg p-4 border border-teal-400/20">
          <p className="text-gray-400 text-xs mb-1">Original Supply</p>
          <p className="text-white text-xl font-bold">{data.originalSupply.toLocaleString()}</p>
          <p className="text-gray-500 text-xs">tons</p>
        </div>

        <div className="bg-red-900/20 rounded-lg p-4 border border-red-600">
          <p className="text-gray-400 text-xs mb-1">Reduced Supply (−{data.reductionPct}%)</p>
          <p className="text-red-300 text-xl font-bold">{data.reducedSupply.toLocaleString()}</p>
          <p className="text-gray-500 text-xs">tons — harvest shock applied</p>
        </div>

        <div className="bg-red-900/30 rounded-lg p-4 border border-red-500">
          <p className="text-gray-400 text-xs mb-1">New Supply Gap</p>
          <p className="text-red-400 text-xl font-bold">{newGap.toLocaleString()}</p>
          <p className="text-gray-500 text-xs">tons (was {originalGap.toLocaleString()})</p>
        </div>

        <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-600">
          <p className="text-gray-400 text-xs mb-1">Import Req. Increase</p>
          <p className="text-orange-300 text-xl font-bold">+{data.importReqIncreasePct}%</p>
          <p className="text-gray-500 text-xs">additional imports needed</p>
        </div>

        <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-600">
          <p className="text-gray-400 text-xs mb-1">Wholesale Price Movement</p>
          <p className="text-yellow-300 text-xl font-bold">{data.priceMovement}</p>
          <p className="text-gray-500 text-xs">expected farm gate pressure</p>
        </div>

        <div className="bg-[#0d1f38] rounded-lg p-4 border border-teal-400/20">
          <p className="text-gray-400 text-xs mb-1">Projected Consumption</p>
          <p className="text-white text-xl font-bold">{data.consumption.toLocaleString()}</p>
          <p className="text-gray-500 text-xs">tons (unchanged)</p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Supply</span>
          <span>Consumption</span>
        </div>
        <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-cyan-600 rounded-full transition-all"
            style={{ width: `${(data.reducedSupply / data.consumption) * 100}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
            {((data.reducedSupply / data.consumption) * 100).toFixed(1)}% supply coverage
          </div>
        </div>
      </div>

      <p className="text-yellow-500/80 text-xs">
        ⚠️ Recommendation: Activate emergency import quota. Monitor Eldoret &amp; Kisumu farm gate prices weekly.
      </p>
    </div>
  );
}