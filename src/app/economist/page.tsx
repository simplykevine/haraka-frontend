'use client';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/app/sharedComponents/ThemeToggle';
import SupplyGapPanel from './components/SupplyGapPanel';
import ImportCollisionRisk from './components/ImportCollisionRisk';
import PolicyHeatMap from './components/PolicyHeatMap';
import RegionalArbitrageMap from './components/RegionalArbitrageMap';
import LogisticsComparison from './components/LogisticsComparison';
import RainfallShock from './components/RainfallShock';
export default function EconomistPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#091326] text-white px-1 py-8 space-y-2">
      <div className="flex justify-end gap-5">
        <ThemeToggle />
        
      </div>
 

      <div className="border-b border-teal-400/20 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          📊 Economist Intelligence Dashboard
        </h1>
        <p className="text-teal-400 text-lg mt-1 font-medium">
          East African Agricultural Trade Intelligence — Live
        </p>
        <p className="text-gray-100 text-lg mt-0.5">
          Maize · Coffee · Tea in  Kenya · Rwanda · Tanzania · Uganda and Ethiopia
        </p>
      </div>

      <div
        onClick={() => router.push('/chat')}
        className="relative cursor-pointer group overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#0d2137] via-[#0a3a4a] to-[#091326] p-[1px] shadow-[0_0_40px_rgba(0,255,255,0.07)]"
      >
        <div className="relative rounded-2xl bg-gradient-to-br from-[#0d2137] via-[#0a3a4a] to-[#091326] px-8 py-7 overflow-hidden transition-all duration-300 group-hover:from-[#102a45] group-hover:via-[#0d4a5e] group-hover:to-[#0d2137]">

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top_left,rgba(0,255,200,0.06),transparent_60%)]" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />

          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity duration-300 select-none pointer-events-none">
            <span className="text-[96px] leading-none"></span>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex-shrink-0 w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-2xl shadow-inner">
                ✨
              </div>
              <div>
                <p className="text-lg font-semibold tracking-widest text-cyan-400 uppercase mb-1">
                  AI-Powered Economic Reasoning
                </p>
                <h2 className="text-xl lg:text-2xl font-extrabold text-white leading-snug">
                  Ask Zeno — Your Economic Intelligence Agent
                </h2>
                <p className="text-gray-200 text-lg mt-1.5 max-w-xl leading-relaxed">
                  Forecast commodity prices, analyze trade corridors, stress-test policy scenarios and get instant insights from live East African market data.
                </p>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-bold text-lg shadow-[0_0_20px_rgba(0,220,200,0.3)] group-hover:shadow-[0_0_30px_rgba(0,220,200,0.5)] transition-all duration-300 whitespace-nowrap">
                <span>Chat with Zeno</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>

              <p className="text-center text-[18px] text-gray-300 mt-2 tracking-wide">
                Powered by Zeno AI · No setup needed
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-5 flex flex-wrap gap-2">
            {['Price Forecasting', 'Trade Analysis', 'Policy Simulation', 'Scenario Planning', 'Market Intelligence'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-[15px] font-medium border border-teal-500/20 bg-teal-500/5 text-teal-400 tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SupplyGapPanel />
        <ImportCollisionRisk />
      </div>

      <PolicyHeatMap />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RegionalArbitrageMap />
        <LogisticsComparison />
      </div>

      <RainfallShock />

    </div>
  );
}
