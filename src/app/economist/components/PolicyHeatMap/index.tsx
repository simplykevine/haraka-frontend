'use client';

const months = ['March', 'April', 'May', 'June'];
const heatMapData: Record<string, string[]> = {
  'Domestic Supply':       ['green', 'red',    'red',    'yellow'],
  'Projected Consumption': ['green', 'yellow', 'yellow', 'green'],
  'Import Arrivals':       ['green', 'red',    'green',  'green'],
  'Rainfall Forecast':     ['green', 'yellow', 'red',    'yellow'],
  'Farm Gate Price Trend': ['green', 'yellow', 'red',    'green'],
};

const cellStyle: Record<string, string> = {
  green:  'bg-green-900/40 text-green-400 border border-green-700',
  yellow: 'bg-yellow-900/40 text-yellow-400 border border-yellow-700',
  red:    'bg-red-900/40 text-red-400 border border-red-700',
};
const cellLabel: Record<string, string> = {
  green: 'Stable', yellow: 'Tightening', red: 'Shock',
};

function isCollisionMonth(monthIdx: number): boolean {
  return heatMapData['Import Arrivals'][monthIdx] === 'red' &&
         heatMapData['Domestic Supply'][monthIdx] === 'red';
}

export default function PolicyHeatMap() {
  return (
    <div className="rounded-xl p-6 border border-teal-400/30 bg-[#091326] space-y-4">
      <h2 className="text-white text-lg font-semibold">🗓️ Policy Timing Heat Map — 4-Month Forward</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-gray-400 py-2 pr-4 font-medium w-48">Indicator</th>
              {months.map((m, i) => (
                <th key={m} className={`text-center py-2 px-4 font-semibold rounded-t
                  ${isCollisionMonth(i)
                    ? 'text-red-400 animate-pulse bg-red-900/20'
                    : 'text-gray-300'
                  }`}>
                  {m}
                  {isCollisionMonth(i) && <span className="block text-[10px] text-red-400">⚠️ Collision</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(heatMapData).map(([row, colors]) => (
              <tr key={row} className="border-t border-white/5">
                <td className="text-gray-300 py-3 pr-4 font-medium">{row}</td>
                {colors.map((color, i) => (
                  <td key={i} className="py-2 px-2 text-center">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${cellStyle[color]}`}>
                      {cellLabel[color]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg px-4 py-2 text-yellow-300 text-sm">
        ⚠️ April: Collision detected — imports landing during supply trough. Recommend policy review.
      </div>

      <div className="flex gap-4 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-700 inline-block" /> Stable</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-700 inline-block" /> Tightening</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-700 inline-block" /> Shock</span>
      </div>
    </div>
  );
}