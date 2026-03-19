'use client';

import { useThemeSafe } from '@/app/context/ThemeContext';

const data = {
  originalSupply: 120000,
  reductionPct: 15,
  reducedSupply: 102000,
  consumption: 132000,
  importReqIncreasePct: 22,
  priceMovement: '+12–18%',
};

export default function RainfallShock() {
  const { theme } = useThemeSafe();
  const newGap = data.consumption - data.reducedSupply;
  const originalGap = data.consumption - data.originalSupply;

  const containerBg = theme === 'light' ? 'bg-white' : 'bg-[#091326]';
  const containerBorder = theme === 'light' ? 'border-yellow-300' : 'border-yellow-600/60';
  const headingText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const subtitleText = theme === 'light' ? 'text-yellow-600' : 'text-yellow-400';
  
  const cardBg = theme === 'light' ? 'bg-gray-50' : 'bg-[#0d1f38]';
  const cardBorder = theme === 'light' ? 'border-gray-200' : 'border-teal-400/20';
  const cardLabelText = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const cardValueText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const cardUnitText = theme === 'light' ? 'text-gray-500' : 'text-gray-500';
  
  const reducedSupplyBg = theme === 'light' ? 'bg-red-100' : 'bg-red-900/20';
  const reducedSupplyBorder = theme === 'light' ? 'border-red-300' : 'border-red-600';
  const reducedSupplyText = theme === 'light' ? 'text-red-700' : 'text-red-300';
  
  const newGapBg = theme === 'light' ? 'bg-red-100' : 'bg-red-900/30';
  const newGapBorder = theme === 'light' ? 'border-red-300' : 'border-red-500';
  const newGapText = theme === 'light' ? 'text-red-700' : 'text-red-400';
  
  const importBg = theme === 'light' ? 'bg-orange-100' : 'bg-orange-900/20';
  const importBorder = theme === 'light' ? 'border-orange-300' : 'border-orange-600';
  const importText = theme === 'light' ? 'text-orange-700' : 'text-orange-300';
  
  const priceBg = theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900/20';
  const priceBorder = theme === 'light' ? 'border-yellow-300' : 'border-yellow-600';
  const priceText = theme === 'light' ? 'text-yellow-700' : 'text-yellow-300';
  
  const progressBarBg = theme === 'light' ? 'bg-gray-200' : 'bg-gray-800';
  const progressBarFill = theme === 'light' ? 'bg-blue-600' : 'bg-cyan-600';
  const progressBarLabel = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const progressBarText = theme === 'light' ? 'text-gray-900' : 'text-white';
  
  const recommendationText = theme === 'light' ? 'text-yellow-700' : 'text-yellow-500/80';

  return (
    <div className={`rounded-xl p-6 border-2 ${containerBorder} ${containerBg} space-y-4 transition-colors`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">🌧️</span>
        <div>
          <h2 className={`${headingText} text-xl font-semibold transition-colors`}>
            Rainfall Shock Scenario
          </h2>
          <p className={`${subtitleText} text-lg font-medium transition-colors`}>
            Simulation: 15% harvest reduction due to below-average rainfall
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className={`${cardBg} rounded-lg p-4 border ${cardBorder} transition-colors`}>
          <p className={`${cardLabelText} text-lg mb-1 transition-colors`}>Original Supply</p>
          <p className={`${cardValueText} text-xl font-bold transition-colors`}>
            {data.originalSupply.toLocaleString()}
          </p>
          <p className={`${cardUnitText} text-lg transition-colors`}>tons</p>
        </div>

        <div className={`${reducedSupplyBg} rounded-lg p-4 border ${reducedSupplyBorder} transition-colors`}>
          <p className={`${cardLabelText} text-lg mb-1 transition-colors`}>Reduced Supply (−{data.reductionPct}%)</p>
          <p className={`${reducedSupplyText} text-xl font-bold transition-colors`}>
            {data.reducedSupply.toLocaleString()}
          </p>
          <p className={`${cardUnitText} text-lg transition-colors`}>tons — harvest shock applied</p>
        </div>

        <div className={`${newGapBg} rounded-lg p-4 border ${newGapBorder} transition-colors`}>
          <p className={`${cardLabelText} text-lg mb-1 transition-colors`}>New Supply Gap</p>
          <p className={`${newGapText} text-xl font-bold transition-colors`}>
            {newGap.toLocaleString()}
          </p>
          <p className={`${cardUnitText} text-lg transition-colors`}>
            tons (was {originalGap.toLocaleString()})
          </p>
        </div>

        <div className={`${importBg} rounded-lg p-4 border ${importBorder} transition-colors`}>
          <p className={`${cardLabelText} text-lg mb-1 transition-colors`}>Import Req. Increase</p>
          <p className={`${importText} text-xl font-bold transition-colors`}>
            +{data.importReqIncreasePct}%
          </p>
          <p className={`${cardUnitText} text-lg transition-colors`}>additional imports needed</p>
        </div>

        <div className={`${priceBg} rounded-lg p-4 border ${priceBorder} transition-colors`}>
          <p className={`${cardLabelText} text-lg mb-1 transition-colors`}>Wholesale Price Movement</p>
          <p className={`${priceText} text-xl font-bold transition-colors`}>
            {data.priceMovement}
          </p>
          <p className={`${cardUnitText} text-lg transition-colors`}>expected farm gate pressure</p>
        </div>

        <div className={`${cardBg} rounded-lg p-4 border ${cardBorder} transition-colors`}>
          <p className={`${cardLabelText} text-lg mb-1 transition-colors`}>Projected Consumption</p>
          <p className={`${cardValueText} text-xl font-bold transition-colors`}>
            {data.consumption.toLocaleString()}
          </p>
          <p className={`${cardUnitText} text-lg transition-colors`}>tons (unchanged)</p>
        </div>
      </div>

      <div className="space-y-1">
        <div className={`flex justify-between text-lg ${progressBarLabel} transition-colors`}>
          <span>Supply</span>
          <span>Consumption</span>
        </div>
        <div className={`relative h-6 ${progressBarBg} rounded-full overflow-hidden transition-colors`}>
          <div
            className={`absolute top-0 left-0 h-full ${progressBarFill} rounded-full transition-all`}
            style={{ width: `${(data.reducedSupply / data.consumption) * 100}%` }}
          />
          <div className={`absolute inset-0 flex items-center justify-center ${progressBarText} text-lg font-semibold transition-colors`}>
            {((data.reducedSupply / data.consumption) * 100).toFixed(1)}% supply coverage
          </div>
        </div>
      </div>

      <p className={`${recommendationText} text-lg transition-colors`}>
        ⚠️ Recommendation: Activate emergency import quota. Monitor Eldoret &amp; Kisumu farm gate prices weekly.
      </p>
    </div>
  );
}