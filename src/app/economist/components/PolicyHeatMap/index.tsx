'use client';

import { useThemeSafe } from '@/app/context/ThemeContext';

const months = ['March', 'April', 'May', 'June'];
const heatMapData: Record<string, string[]> = {
  'Domestic Supply':       ['green', 'red',    'red',    'yellow'],
  'Projected Consumption': ['green', 'yellow', 'yellow', 'green'],
  'Import Arrivals':       ['green', 'red',    'green',  'green'],
  'Rainfall Forecast':     ['green', 'yellow', 'red',    'yellow'],
  'Farm Gate Price Trend': ['green', 'yellow', 'red',    'green'],
};

const cellStyleDark: Record<string, string> = {
  green:  'bg-green-900/40 text-green-400 border border-green-700',
  yellow: 'bg-yellow-900/40 text-yellow-400 border border-yellow-700',
  red:    'bg-red-900/40 text-red-400 border border-red-700',
};

const cellStyleLight: Record<string, string> = {
  green:  'bg-green-100 text-green-700 border border-green-400',
  yellow: 'bg-yellow-100 text-yellow-700 border border-yellow-400',
  red:    'bg-red-100 text-red-700 border border-red-400',
};

const cellLabel: Record<string, string> = {
  green: 'Stable', yellow: 'Tightening', red: 'Shock',
};

function isCollisionMonth(monthIdx: number): boolean {
  return heatMapData['Import Arrivals'][monthIdx] === 'red' &&
         heatMapData['Domestic Supply'][monthIdx] === 'red';
}

export default function PolicyHeatMap() {
  const { theme } = useThemeSafe();

  const containerBg = theme === 'light' ? 'bg-white' : 'bg-[#091326]';
  const containerBorder = theme === 'light' ? 'border-blue-200' : 'border-teal-400/30';
  const headingText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const tableHeaderText = theme === 'light' ? 'text-gray-700' : 'text-gray-400';
  const collisionHeaderBg = theme === 'light' ? 'bg-red-100' : 'bg-red-900/20';
  const collisionHeaderText = theme === 'light' ? 'text-red-700' : 'text-red-400';
  const collisionWarningBg = theme === 'light' ? 'bg-red-100' : 'bg-red-900/20';
  const collisionWarningBorder = theme === 'light' ? 'border-red-400' : 'border-red-600';
  const collisionWarningText = theme === 'light' ? 'text-red-700' : 'text-red-300';
  const rowBorder = theme === 'light' ? 'border-gray-200' : 'border-white/5';
  const rowLabelText = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const legendBg = theme === 'light' ? 'bg-gray-100' : 'bg-transparent';
  const legendText = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const cellStyles = theme === 'light' ? cellStyleLight : cellStyleDark;
  
  const legendGreen = theme === 'light' ? 'bg-green-400' : 'bg-green-700';
  const legendYellow = theme === 'light' ? 'bg-yellow-400' : 'bg-yellow-700';
  const legendRed = theme === 'light' ? 'bg-red-400' : 'bg-red-700';

  return (
    <div className={`rounded-xl p-6 border ${containerBorder} ${containerBg} space-y-4 transition-colors`}>
      <h2 className={`${headingText} text-lg font-semibold transition-colors`}>
        🗓️ Policy Timing Heat Map — 4-Month Forward
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-lg transition-colors">
          <thead>
            <tr>
              <th className={`text-left ${tableHeaderText} py-2 pr-4 font-medium w-48 transition-colors`}>
                Indicator
              </th>
              {months.map((m, i) => (
                <th
                  key={m}
                  className={`text-center py-2 px-4 font-semibold rounded-t transition-colors ${
                    isCollisionMonth(i)
                      ? `${collisionHeaderBg} ${collisionHeaderText} animate-pulse`
                      : `${tableHeaderText}`
                  }`}
                >
                  {m}
                  {isCollisionMonth(i) && (
                    <span className={`block text-[10px] ${collisionHeaderText}`}>
                      ⚠️ Collision
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(heatMapData).map(([row, colors]) => (
              <tr key={row} className={`border-t ${rowBorder} transition-colors`}>
                <td className={`${rowLabelText} py-3 pr-4 font-medium transition-colors`}>
                  {row}
                </td>
                {colors.map((color, i) => (
                  <td key={i} className="py-2 px-2 text-center">
                    <span className={`inline-block px-3 py-1 rounded-lg text-lg font-semibold transition-colors ${cellStyles[color]}`}>
                      {cellLabel[color]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`${collisionWarningBg} border ${collisionWarningBorder} rounded-lg px-4 py-2 ${collisionWarningText} text-lg transition-colors`}>
        ⚠️ April: Collision detected — imports landing during supply trough. Recommend policy review.
      </div>

      <div className={`flex gap-4 text-lg ${legendBg} p-3 rounded-lg transition-colors`}>
        <span className={`flex items-center gap-1 ${legendText} transition-colors`}>
          <span className={`w-3 h-3 rounded ${legendGreen} inline-block transition-colors`} /> Stable
        </span>
        <span className={`flex items-center gap-1 ${legendText} transition-colors`}>
          <span className={`w-3 h-3 rounded ${legendYellow} inline-block transition-colors`} /> Tightening
        </span>
        <span className={`flex items-center gap-1 ${legendText} transition-colors`}>
          <span className={`w-3 h-3 rounded ${legendRed} inline-block transition-colors`} /> Shock
        </span>
      </div>
    </div>
  );
}