'use client';
import SupplyGapPanel from './components/SupplyGapPanel';
import ImportCollisionRisk from './components/ImportCollisionRisk';
import PolicyHeatMap from './components/PolicyHeatMap';
import RegionalArbitrageMap from './components/RegionalArbitrageMap';
import LogisticsComparison from './components/LogisticsComparison';
import RainfallShock from './components/RainfallShock';
import EconomistChatbot from './components/EconomistChatbot';

export default function EconomistPage() {
  return (
    <div className="min-h-screen bg-[#091326] text-white px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-teal-400/20 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          📊 Economist Intelligence Dashboard
        </h1>
        <p className="text-teal-400 text-sm mt-1 font-medium">
          East African Agricultural Trade Intelligence — Live
        </p>
        <p className="text-gray-500 text-xs mt-0.5">
          Maize · Coffee · Tea — Kenya · Rwanda · Tanzania · Uganda · Ethiopia
        </p>
      </div>

      {/* Row 1: Supply Gap + Import Collision */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SupplyGapPanel />
        <ImportCollisionRisk />
      </div>

      {/* Row 2: Policy Heat Map */}
      <PolicyHeatMap />

      {/* Row 3: Regional Arbitrage + Logistics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RegionalArbitrageMap />
        <LogisticsComparison />
      </div>

      {/* Row 4: Rainfall Shock */}
      <RainfallShock />

      {/* Row 5: AI Chatbot */}
      <EconomistChatbot />
    </div>
  );
}