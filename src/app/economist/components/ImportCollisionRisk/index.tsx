'use client';

const harvestStart = new Date('2026-03-15');
const harvestEnd = new Date('2026-05-30');
const expectedArrival = new Date('2026-04-10');

function getRiskLevel() {
  if (expectedArrival >= harvestStart && expectedArrival <= harvestEnd) return 'HIGH';
  const daysBeforeHarvest = (harvestStart.getTime() - expectedArrival.getTime()) / (1000 * 60 * 60 * 24);
  if (daysBeforeHarvest >= 0 && daysBeforeHarvest <= 30) return 'MEDIUM';
  return 'LOW';
}

const riskStyles: Record<string, { label: string; color: string; bg: string; border: string; gauge: string }> = {
  HIGH:   { label: 'HIGH',   color: 'text-red-400',    bg: 'bg-red-900/20',    border: 'border-red-500',    gauge: 'bg-red-500' },
  MEDIUM: { label: 'MEDIUM', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500', gauge: 'bg-yellow-500' },
  LOW:    { label: 'LOW',    color: 'text-green-400',  bg: 'bg-green-900/20',  border: 'border-green-500',  gauge: 'bg-green-500' },
};

const rangeStart = new Date('2026-02-01');
const rangeEnd   = new Date('2026-07-01');
const totalMs    = rangeEnd.getTime() - rangeStart.getTime();

function pct(date: Date) {
  return ((date.getTime() - rangeStart.getTime()) / totalMs) * 100;
}

export default function ImportCollisionRisk() {
  const risk = getRiskLevel();
  const style = riskStyles[risk];

  const harvestLeft   = pct(harvestStart);
  const harvestWidth  = pct(harvestEnd) - harvestLeft;
  const arrivalLeft   = pct(expectedArrival);

  return (
    <div className="rounded-xl p-6 border border-teal-400/30 bg-[#091326] space-y-5">
      <h2 className="text-white text-lg font-semibold">⚡ Import Collision Risk</h2>

      {risk === 'HIGH' && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg px-4 py-2 text-white-300 text-lg font-bold">
          ⚠️ Collision Alert: Imports risk suppressing domestic farm prices. Consider delaying arrival by 45+ days.
        </div>
      )}

      <div className={`rounded-xl p-5 border ${style.border} ${style.bg} flex flex-col items-center gap-2`}>
        <p className="text-gray-400 text-lg uppercase tracking-widest">Collision Risk Level</p>
        <div className="flex gap-3 items-center">
          <div className={`w-5 h-5 rounded-full ${style.gauge} shadow-lg`} />
          <span className={`text-3xl font-extrabold ${style.color}`}>{style.label}</span>
        </div>
        <div className="flex gap-4 mt-1">
          {['LOW', 'MEDIUM', 'HIGH'].map((lvl) => (
            <span key={lvl} className={`text-lg px-3 py-1 rounded-full border font-semibold
              ${risk === lvl ? `${riskStyles[lvl].color} ${riskStyles[lvl].bg} ${riskStyles[lvl].border}` : 'text-gray-500 border-gray-700'}`}>
              {lvl}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-gray-200 text-lg uppercase tracking-widest">Timeline (Feb – Jul 2026)</p>
        <div className="relative h-8 bg-gray-800 rounded-full overflow-visible">
          <div
            className="absolute top-0 h-full bg-green-600/50 border border-green-500 rounded"
            style={{ left: `${harvestLeft}%`, width: `${harvestWidth}%` }}
          >
            <span className="absolute -top-5 left-1 text-green-400 text-[18px] whitespace-nowrap">🌾 Harvest</span>
          </div>
          <div
            className="absolute top-0 h-full w-0.5 bg-red-500"
            style={{ left: `${arrivalLeft}%` }}
          >
            <span className="absolute -top-5 -left-4 text-red-400 text-[18px] whitespace-nowrap">🚢 Arrival</span>
          </div>
        </div>
        <div className="flex justify-between text-gray-500 text-[15px]">
          <span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-lg">
        <div className="bg-[#0d1f38] rounded-lg p-3 border border-teal-400/20">
          <p className="text-gray-100 text-lg">Harvest Window</p>
          <p className="text-white font-medium">Mar 15 – May 30, 2026</p>
        </div>
        <div className="bg-[#0d1f38] rounded-lg p-3 border border-teal-400/20">
          <p className="text-gray-100 text-lg">Expected Arrival</p>
          <p className="text-red-300 font-medium">Apr 10, 2026</p>
        </div>
      </div>
    </div>
  );
}