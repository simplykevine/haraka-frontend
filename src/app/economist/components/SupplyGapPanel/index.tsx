'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const months = ['March', 'April', 'May', 'June'];
const supply = [120000, 105000, 98000, 115000];
const consumption = [130000, 132000, 135000, 128000];

function getStatus(supply: number[], consumption: number[]) {
  const maxDeficit = Math.max(...supply.map((s, i) => (consumption[i] - s) / consumption[i]));
  if (maxDeficit > 0.10) return { label: 'Critical Deficit', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500' };
  if (maxDeficit > 0.05) return { label: 'Moderate Risk', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500' };
  return { label: 'Stable', color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500' };
}

export default function SupplyGapPanel() {
  const status = getStatus(supply, consumption);
  const maxDeficitPct = Math.max(...supply.map((s, i) => ((consumption[i] - s) / consumption[i]) * 100));
  const totalGap = supply.reduce((acc, s, i) => acc + Math.max(0, consumption[i] - s), 0);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Projected Domestic Supply',
        data: supply,
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34,211,238,0.1)',
        tension: 0.4,
        fill: false,
        pointRadius: 5,
      },
      {
        label: 'Projected Consumption',
        data: consumption,
        borderColor: '#f87171',
        backgroundColor: 'rgba(248,113,113,0.15)',
        tension: 0.4,
        fill: '-1',
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#e2e8f0' } },
      tooltip: {
        callbacks: {
          afterBody: () => ['', 'Assumptions: harvest forecast, carryover stocks, imports'],
        },
        backgroundColor: '#1e3a5f',
        titleColor: '#fff',
        bodyColor: '#94a3b8',
      },
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  return (
    <div className="rounded-xl p-6 border border-teal-400/30 bg-[#091326] space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-semibold">📈 Projected Supply Gap</h2>
        <span className={`text-lg font-bold px-3 py-1 rounded-full border ${status.color} ${status.bg} ${status.border}`}>
          {status.label}
        </span>
      </div>

      {maxDeficitPct > 12 && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg px-4 py-2 text-white-300 text-lg font-bold ">
          🚨 Emergency: Projected deficit exceeds 12% — recommend immediate import quota review
        </div>
      )}

      <Line data={chartData} options={options} />

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="rounded-lg border border-teal-400/30 p-4 bg-[#0d1f38]">
          <p className="text-gray-400 text-lg mb-1">Total Supply Gap</p>
          <p className="text-white text-2xl font-bold">{totalGap.toLocaleString()} <span className="text-lg text-gray-400">tons</span></p>
        </div>
        <div className="rounded-lg border border-teal-400/30 p-4 bg-[#0d1f38]">
          <p className="text-gray-400 text-lg mb-1">Max Monthly Deficit</p>
          <p className={`text-2xl font-bold ${status.color}`}>{maxDeficitPct.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}