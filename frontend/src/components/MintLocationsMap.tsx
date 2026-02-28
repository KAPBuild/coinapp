// Simplified SVG map of the contiguous United States highlighting
// the five historic US Mint locations relevant to numismatic collecting.

interface MintCity {
  id: string
  label: string
  state: string
  mark: string
  x: number
  y: number
  labelAnchor: 'start' | 'middle' | 'end'
  labelOffsetX: number
  labelOffsetY: number
  yearsActive: string
  delay: string
}

const MINTS: MintCity[] = [
  {
    id: 'sf',
    label: 'San Francisco',
    state: 'California',
    mark: 'S',
    x: 97,
    y: 222,
    labelAnchor: 'end',
    labelOffsetX: -16,
    labelOffsetY: 0,
    yearsActive: '1854 – present',
    delay: '0s',
  },
  {
    id: 'cc',
    label: 'Carson City',
    state: 'Nevada',
    mark: 'CC',
    x: 142,
    y: 194,
    labelAnchor: 'end',
    labelOffsetX: -16,
    labelOffsetY: -14,
    yearsActive: '1870 – 1893',
    delay: '0.4s',
  },
  {
    id: 'denver',
    label: 'Denver',
    state: 'Colorado',
    mark: 'D',
    x: 350,
    y: 200,
    labelAnchor: 'middle',
    labelOffsetX: 0,
    labelOffsetY: -18,
    yearsActive: '1906 – present',
    delay: '0.8s',
  },
  {
    id: 'no',
    label: 'New Orleans',
    state: 'Louisiana',
    mark: 'O',
    x: 558,
    y: 352,
    labelAnchor: 'middle',
    labelOffsetX: 0,
    labelOffsetY: 22,
    yearsActive: '1838 – 1909',
    delay: '1.2s',
  },
  {
    id: 'philly',
    label: 'Philadelphia',
    state: 'Pennsylvania',
    mark: 'P',
    x: 768,
    y: 190,
    labelAnchor: 'start',
    labelOffsetX: 16,
    labelOffsetY: 0,
    yearsActive: '1792 – present',
    delay: '1.6s',
  },
]

// Very simplified contiguous US outline path (approximate geographic shape)
const US_PATH = `
  M 60,52
  L 140,46 L 240,42 L 340,44 L 440,46 L 520,44 L 600,46 L 680,48 L 740,44 L 800,52 L 856,58
  L 858,80 L 870,110 L 878,140 L 882,170 L 874,200 L 868,220
  L 850,240 L 840,260 L 842,290 L 820,300 L 810,330 L 826,360
  L 838,390 L 824,416 L 800,430 L 770,440 L 750,420 L 730,408
  L 710,400 L 690,406 L 670,400 L 650,398 L 630,406 L 614,418
  L 600,430 L 580,440 L 558,436 L 536,420 L 510,418 L 490,400
  L 468,402 L 446,420 L 426,438 L 402,448 L 380,444 L 354,432
  L 326,418 L 304,404 L 278,400 L 250,390 L 220,380 L 196,370
  L 170,376 L 148,380 L 120,368 L 100,350 L 84,324 L 70,296
  L 58,264 L 54,234 L 52,200 L 56,170 L 58,130 L 60,90 Z
`

export function MintLocationsMap() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-700/60">
      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-amber-950/10 pointer-events-none rounded-2xl" />

      <svg
        viewBox="0 0 940 500"
        className="w-full h-auto"
        aria-label="Map of historic US Mint locations"
      >
        {/* Grid lines (lat/lon style) */}
        {[100, 200, 300, 400].map(y => (
          <line key={`h${y}`} x1="40" y1={y} x2="900" y2={y} stroke="#1e293b" strokeWidth="1" />
        ))}
        {[150, 300, 450, 600, 750].map(x => (
          <line key={`v${x}`} x1={x} y1="30" x2={x} y2="480" stroke="#1e293b" strokeWidth="1" />
        ))}

        {/* US map outline — filled very subtly, border in slate */}
        <path
          d={US_PATH}
          fill="rgba(30,41,59,0.7)"
          stroke="#334155"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Connection lines between mints (faint amber dashes) */}
        {MINTS.slice(0, -1).map((mint, i) => (
          <line
            key={`conn-${mint.id}`}
            x1={mint.x}
            y1={mint.y}
            x2={MINTS[i + 1].x}
            y2={MINTS[i + 1].y}
            stroke="rgba(251,191,36,0.12)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        ))}

        {/* Mint location dots */}
        {MINTS.map((mint) => (
          <g key={mint.id}>
            {/* Pulsing outer ring */}
            <circle
              cx={mint.x}
              cy={mint.y}
              r="14"
              fill="none"
              stroke="rgba(251,191,36,0.4)"
              strokeWidth="1.5"
              className="mint-pulse"
              style={{ animationDelay: mint.delay }}
            />
            {/* Secondary ring */}
            <circle
              cx={mint.x}
              cy={mint.y}
              r="9"
              fill="none"
              stroke="rgba(251,191,36,0.6)"
              strokeWidth="1"
              className="mint-pulse"
              style={{ animationDelay: `${parseFloat(mint.delay) + 0.6}s` }}
            />
            {/* Core dot */}
            <circle
              cx={mint.x}
              cy={mint.y}
              r="5"
              fill="#fbbf24"
              filter="url(#mintGlow)"
            />

            {/* Mint mark badge */}
            <g transform={`translate(${mint.x + mint.labelOffsetX}, ${mint.y + mint.labelOffsetY})`}>
              <rect
                x={mint.labelAnchor === 'end' ? -34 : mint.labelAnchor === 'start' ? 0 : -17}
                y="-11"
                width="34"
                height="20"
                rx="4"
                fill="#1e293b"
                stroke="#fbbf24"
                strokeWidth="1"
                opacity="0.9"
              />
              <text
                x={mint.labelAnchor === 'end' ? -17 : mint.labelAnchor === 'start' ? 17 : 0}
                y="4"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fontFamily="monospace"
                fill="#fbbf24"
              >
                {mint.mark}
              </text>
            </g>

            {/* City label */}
            <text
              x={mint.x + (mint.labelAnchor === 'end' ? -48 : mint.labelAnchor === 'start' ? 48 : 0)}
              y={mint.y + (mint.labelOffsetY > 0 ? mint.labelOffsetY + 26 : mint.labelOffsetY - 28)}
              textAnchor={mint.labelAnchor}
              fontSize="11"
              fontWeight="600"
              fill="#e2e8f0"
              fontFamily="sans-serif"
            >
              {mint.label}
            </text>
            <text
              x={mint.x + (mint.labelAnchor === 'end' ? -48 : mint.labelAnchor === 'start' ? 48 : 0)}
              y={mint.y + (mint.labelOffsetY > 0 ? mint.labelOffsetY + 40 : mint.labelOffsetY - 16)}
              textAnchor={mint.labelAnchor}
              fontSize="9"
              fill="#64748b"
              fontFamily="sans-serif"
            >
              {mint.yearsActive}
            </text>
          </g>
        ))}

        {/* Glow filter for mint dots */}
        <defs>
          <filter id="mintGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Stat bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 px-6 py-4 border-t border-slate-800">
        {[
          { value: '5', label: 'Historic Mints' },
          { value: '1792', label: 'First Mint (Philadelphia)' },
          { value: '1893', label: 'Last Carson City Strike' },
          { value: '96+', label: 'Morgan Varieties Tracked' },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <p className="text-amber-400 font-bold text-lg leading-none">{stat.value}</p>
            <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
