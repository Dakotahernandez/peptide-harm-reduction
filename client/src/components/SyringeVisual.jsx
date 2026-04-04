import { formatNumber } from '@/lib/calculations';

export default function SyringeVisual({ selectedSyringeProfile, syringeUnits, syringeUnitsRaw }) {
  if (syringeUnits === null || syringeUnitsRaw === null) return null;

  const width = 160;
  const height = 420;
  const barrelWidth = 36;
  const fillInset = 4;
  const barrelX = (width - barrelWidth) / 2;
  const barrelTop = 80;
  const barrelHeight = 220;
  const hubHeight = 18;
  const hubWidth = barrelWidth - 6;
  const fillRatio = Math.min(Math.max(syringeUnits / selectedSyringeProfile.max_units, 0), 1);
  const stopperHeight = 10;
  const stopperY = barrelTop + fillRatio * barrelHeight;
  const liquidHeight = stopperY - barrelTop;
  const thumbTop = height - 30;
  const rodTop = stopperY + stopperHeight;
  const rodHeight = Math.max(thumbTop - rodTop, 8);
  const barrelCenterX = barrelX + barrelWidth / 2;
  const ticks = Array.from(
    { length: Math.floor(selectedSyringeProfile.max_units / 5) + 1 },
    (_, i) => i * 5,
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Pull to ${formatNumber(syringeUnitsRaw, 1)} insulin units on ${selectedSyringeProfile.label}`}
      className="syringe-svg"
    >
      <defs>
        <linearGradient id="syringe-fill-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <clipPath id="barrel-clip">
          <rect x={barrelX} y={barrelTop} width={barrelWidth} height={barrelHeight} rx="8" />
        </clipPath>
      </defs>
      <line x1={barrelCenterX} y1="6" x2={barrelCenterX} y2={barrelTop - hubHeight} className="syringe-needle" />
      <rect
        x={barrelCenterX - hubWidth / 2}
        y={barrelTop - hubHeight}
        width={hubWidth}
        height={hubHeight}
        rx="3"
        className="syringe-hub"
      />
      <rect x={barrelX} y={barrelTop} width={barrelWidth} height={barrelHeight} rx="8" className="syringe-barrel" />
      <rect
        x={barrelX + fillInset}
        y={barrelTop}
        width={barrelWidth - fillInset * 2}
        height={Math.max(liquidHeight, 0)}
        rx="8"
        className="syringe-fill-rect syringe-anim"
      />
      <rect
        x={barrelX + fillInset - 2}
        y={stopperY}
        width={barrelWidth - fillInset * 2 + 4}
        height={stopperHeight}
        rx="4"
        className="syringe-stopper syringe-anim"
      />
      {ticks.map((tick) => {
        const y = barrelTop + (tick / selectedSyringeProfile.max_units) * barrelHeight;
        const isMajor = tick % selectedSyringeProfile.major_tick_units === 0;
        return (
          <g key={tick}>
            <line x1={barrelX - 10} y1={y} x2={barrelX - 14 - (isMajor ? 6 : 0)} y2={y} className="syringe-tick" />
            {isMajor && (
              <text x={barrelX - 22} y={y + 4} textAnchor="end" className="syringe-tick-label">
                {tick}
              </text>
            )}
          </g>
        );
      })}
      <g transform={`translate(${barrelX + barrelWidth + 16}, ${stopperY})`} className="syringe-anim">
        <circle cx="0" cy="0" r="8" className="syringe-marker-bubble" />
        <text x="12" y="4" textAnchor="start" className="syringe-marker-label">
          {formatNumber(syringeUnitsRaw, 1)} u
        </text>
      </g>
      <rect x={barrelCenterX - 6} y={rodTop} width="12" height={rodHeight} rx="4" className="syringe-rod syringe-anim" />
      <rect x={barrelCenterX - 18} y={thumbTop} width="36" height="22" rx="8" className="syringe-thumb" />
    </svg>
  );
}
