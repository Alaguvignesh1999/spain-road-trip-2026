const SKIN = '#C49A6C'
const SKIN2 = '#D4AA7C'
const SKIN3 = '#A87848'

function SteeringWheel({ r }) {
  return (
    <g>
      <circle cx="0" cy="0" r={r * 0.62} stroke="#5A3820" strokeWidth={r * 0.18} fill="none" />
      <line x1={-r * 0.62} y1="0" x2={r * 0.62} y2="0" stroke="#5A3820" strokeWidth={r * 0.12} />
      <line x1="0" y1={-r * 0.62} x2="0" y2={r * 0.62} stroke="#5A3820" strokeWidth={r * 0.12} />
      <circle cx="0" cy="0" r={r * 0.2} fill="#5A3820" />
    </g>
  )
}

function BoyFace({ cx, cy, r = 11, isDriver }) {
  return (
    <g>
      <rect x={cx - r * 0.24} y={cy + r * 0.72} width={r * 0.48} height={r * 0.5} rx={r * 0.12} fill={SKIN} />
      <circle cx={cx} cy={cy} r={r} fill={SKIN} />

      <path
        d={`M${cx - r * 1.05},${cy - r * 0.08}
            Q${cx - r * 1.0},${cy - r * 0.78} ${cx - r * 0.55},${cy - r * 1.18}
            Q${cx - r * 0.1},${cy - r * 1.42} ${cx + r * 0.34},${cy - r * 1.25}
            Q${cx + r * 0.8},${cy - r * 1.0} ${cx + r * 1.02},${cy - r * 0.45}
            Q${cx + r * 1.0},${cy + r * 0.0} ${cx + r * 0.8},${cy + r * 0.12}
            Q${cx + r * 0.38},${cy - r * 0.3} ${cx},${cy - r * 0.36}
            Q${cx - r * 0.35},${cy - r * 0.31} ${cx - r * 0.8},${cy + r * 0.12} Z`}
        fill="#1B120E"
      />
      <path
        d={`M${cx - r * 0.38},${cy - r * 1.04} Q${cx},${cy - r * 1.22} ${cx + r * 0.34},${cy - r * 1.02}`}
        stroke="#2C1D14"
        strokeWidth={r * 0.1}
        fill="none"
        strokeLinecap="round"
      />

      <ellipse cx={cx - r * 0.98} cy={cy + r * 0.05} rx={r * 0.16} ry={r * 0.2} fill={SKIN2} />
      <ellipse cx={cx + r * 0.98} cy={cy + r * 0.05} rx={r * 0.16} ry={r * 0.2} fill={SKIN2} />

      <circle cx={cx - r * 0.3} cy={cy - r * 0.06} r={r * 0.13} fill="#1F1208" />
      <circle cx={cx + r * 0.3} cy={cy - r * 0.06} r={r * 0.13} fill="#1F1208" />
      <circle cx={cx - r * 0.25} cy={cy - r * 0.13} r={r * 0.045} fill="#fff" />
      <circle cx={cx + r * 0.34} cy={cy - r * 0.13} r={r * 0.045} fill="#fff" />

      <path d={`M${cx - r * 0.45},${cy - r * 0.31} Q${cx - r * 0.3},${cy - r * 0.38} ${cx - r * 0.14},${cy - r * 0.32}`} stroke="#2B190E" strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />
      <path d={`M${cx + r * 0.14},${cy - r * 0.32} Q${cx + r * 0.3},${cy - r * 0.38} ${cx + r * 0.45},${cy - r * 0.31}`} stroke="#2B190E" strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />

      <path d={`M${cx - r * 0.1},${cy + r * 0.1} Q${cx},${cy + r * 0.2} ${cx + r * 0.1},${cy + r * 0.1}`} stroke={SKIN3} strokeWidth={r * 0.08} fill="none" strokeLinecap="round" />
      <path d={`M${cx - r * 0.34},${cy + r * 0.21} Q${cx},${cy + r * 0.31} ${cx + r * 0.34},${cy + r * 0.21}`} stroke="#704020" strokeWidth={r * 0.09} fill="none" strokeLinecap="round" />
      <path d={`M${cx - r * 0.24},${cy + r * 0.34} Q${cx},${cy + r * 0.47} ${cx + r * 0.24},${cy + r * 0.34}`} stroke="#82441D" strokeWidth={r * 0.11} fill="none" strokeLinecap="round" />

      <circle cx={cx - r * 0.5} cy={cy + r * 0.2} r={r * 0.13} fill="#D4886A" opacity="0.35" />
      <circle cx={cx + r * 0.5} cy={cy + r * 0.2} r={r * 0.13} fill="#D4886A" opacity="0.35" />

      {isDriver && (
        <g transform={`translate(${cx + r * 0.9}, ${cy + r * 0.75})`}>
          <SteeringWheel r={r} />
        </g>
      )}
    </g>
  )
}

function GirlFace({ cx, cy, r = 11, isDriver, bowColor = '#B88AC8' }) {
  const hairColor = '#1B120E'

  return (
    <g>
      <rect x={cx - r * 0.25} y={cy + r * 0.72} width={r * 0.5} height={r * 0.5} rx={r * 0.12} fill={SKIN} />
      <ellipse cx={cx} cy={cy + r * 0.2} rx={r * 1.1} ry={r * 0.85} fill={hairColor} />
      <circle cx={cx} cy={cy} r={r} fill={SKIN} />

      <ellipse cx={cx} cy={cy - r * 0.78} rx={r * 0.92} ry={r * 0.42} fill={hairColor} />
      <path d={`M${cx - r},${cy - r * 0.2} Q${cx - r * 1.2},${cy + r * 0.4} ${cx - r * 0.85},${cy + r * 0.8}`} fill={hairColor} />
      <path d={`M${cx + r},${cy - r * 0.2} Q${cx + r * 1.2},${cy + r * 0.4} ${cx + r * 0.85},${cy + r * 0.8}`} fill={hairColor} />

      <circle cx={cx - r * 0.62} cy={cy - r * 1.08} r={r * 0.3} fill={hairColor} />
      <circle cx={cx + r * 0.62} cy={cy - r * 1.08} r={r * 0.3} fill={hairColor} />
      <circle cx={cx - r * 0.7} cy={cy - r * 1.18} r={r * 0.1} fill="#6A3820" opacity="0.5" />
      <circle cx={cx + r * 0.7} cy={cy - r * 1.18} r={r * 0.1} fill="#6A3820" opacity="0.5" />

      <path d={`M${cx + r * 0.38},${cy - r * 1.1} Q${cx + r * 0.5},${cy - r * 1.28} ${cx + r * 0.65},${cy - r * 1.2}`} fill={bowColor} />
      <path d={`M${cx + r * 0.65},${cy - r * 1.2} Q${cx + r * 0.8},${cy - r * 1.1} ${cx + r * 0.65},${cy - r * 0.98}`} fill={bowColor} />
      <path d={`M${cx + r * 0.65},${cy - r * 0.98} Q${cx + r * 0.5},${cy - r * 0.9} ${cx + r * 0.38},${cy - r * 1.1}`} fill={bowColor} />
      <circle cx={cx + r * 0.62} cy={cy - r * 1.1} r={r * 0.1} fill="#D4A8E8" />

      <ellipse cx={cx - r} cy={cy + r * 0.05} rx={r * 0.17} ry={r * 0.22} fill={SKIN2} />
      <ellipse cx={cx + r} cy={cy + r * 0.05} rx={r * 0.17} ry={r * 0.22} fill={SKIN2} />

      <ellipse cx={cx - r * 0.3} cy={cy - r * 0.08} rx={r * 0.16} ry={r * 0.15} fill="#2C1A08" />
      <ellipse cx={cx + r * 0.3} cy={cy - r * 0.08} rx={r * 0.16} ry={r * 0.15} fill="#2C1A08" />
      <circle cx={cx - r * 0.23} cy={cy - r * 0.15} r={r * 0.065} fill="white" />
      <circle cx={cx + r * 0.37} cy={cy - r * 0.15} r={r * 0.065} fill="white" />

      <rect x={cx - r * 0.58} y={cy - r * 0.23} width={r * 0.46} height={r * 0.28} rx={r * 0.09} fill="none" stroke="#2B190E" strokeWidth={r * 0.09} />
      <rect x={cx + r * 0.12} y={cy - r * 0.23} width={r * 0.46} height={r * 0.28} rx={r * 0.09} fill="none" stroke="#2B190E" strokeWidth={r * 0.09} />
      <line x1={cx - r * 0.12} y1={cy - r * 0.1} x2={cx + r * 0.12} y2={cy - r * 0.1} stroke="#2B190E" strokeWidth={r * 0.08} />

      <line x1={cx - r * 0.44} y1={cy - r * 0.2} x2={cx - r * 0.52} y2={cy - r * 0.36} stroke="#2C1A08" strokeWidth={r * 0.1} strokeLinecap="round" />
      <line x1={cx - r * 0.28} y1={cy - r * 0.24} x2={cx - r * 0.28} y2={cy - r * 0.4} stroke="#2C1A08" strokeWidth={r * 0.1} strokeLinecap="round" />
      <line x1={cx + r * 0.14} y1={cy - r * 0.24} x2={cx + r * 0.1} y2={cy - r * 0.4} stroke="#2C1A08" strokeWidth={r * 0.1} strokeLinecap="round" />
      <line x1={cx + r * 0.3} y1={cy - r * 0.24} x2={cx + r * 0.3} y2={cy - r * 0.4} stroke="#2C1A08" strokeWidth={r * 0.1} strokeLinecap="round" />
      <line x1={cx + r * 0.44} y1={cy - r * 0.2} x2={cx + r * 0.52} y2={cy - r * 0.36} stroke="#2C1A08" strokeWidth={r * 0.1} strokeLinecap="round" />

      <path d={`M${cx - r * 0.48},${cy - r * 0.3} Q${cx - r * 0.3},${cy - r * 0.4} ${cx - r * 0.12},${cy - r * 0.32}`} stroke="#3C2010" strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />
      <path d={`M${cx + r * 0.12},${cy - r * 0.32} Q${cx + r * 0.3},${cy - r * 0.4} ${cx + r * 0.48},${cy - r * 0.3}`} stroke="#3C2010" strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />

      <path d={`M${cx - r * 0.1},${cy + r * 0.1} Q${cx},${cy + r * 0.22} ${cx + r * 0.1},${cy + r * 0.1}`} stroke={SKIN3} strokeWidth={r * 0.09} fill="none" strokeLinecap="round" />
      <path d={`M${cx - r * 0.28},${cy + r * 0.3} Q${cx},${cy + r * 0.5} ${cx + r * 0.28},${cy + r * 0.3}`} stroke="#8B4820" strokeWidth={r * 0.12} fill="none" strokeLinecap="round" />

      <circle cx={cx - r * 0.52} cy={cy + r * 0.22} r={r * 0.17} fill="#D4886A" opacity="0.45" />
      <circle cx={cx + r * 0.52} cy={cy + r * 0.22} r={r * 0.17} fill="#D4886A" opacity="0.45" />

      {isDriver && (
        <g transform={`translate(${cx + r * 0.9}, ${cy + r * 0.75})`}>
          <SteeringWheel r={r} />
        </g>
      )}
    </g>
  )
}

export default function TaigoSVG({ driver, villainMode = false, toneMode = 'day', moodTheme = 'postcard' }) {
  const boyDrives = driver === 'boy'
  const girlDrives = driver === 'girl'

  const driverCx = 178
  const passengerCx = 90
  const faceY = 44

  const paletteByTheme = {
    postcard: { body: '#9ED4CC', bodyHi: '#B8E4DC', bodyMid: '#82BCBA' },
    sunset: { body: '#E7B08D', bodyHi: '#F1C5A8', bodyMid: '#CD8B63' },
    coast: { body: '#87C4D6', bodyHi: '#A9D8E6', bodyMid: '#5F9BB5' },
    fiesta: { body: '#EBA3C4', bodyHi: '#F4BCD6', bodyMid: '#C6759C' },
  }
  const deloitteDay = { body: '#C8D0DA', bodyHi: '#E5EAF0', bodyMid: '#9AA9BC' }
  const deloitteNight = { body: '#35507A', bodyHi: '#4A678E', bodyMid: '#233C62' }
  const selectedPalette = villainMode
    ? toneMode === 'night'
      ? deloitteNight
      : deloitteDay
    : (paletteByTheme[moodTheme] ?? paletteByTheme.postcard)
  const body = selectedPalette.body
  const bodyHi = selectedPalette.bodyHi
  const bodyMid = selectedPalette.bodyMid
  const glass = toneMode === 'night' ? '#8CB1D0' : '#C8E8F8'

  return (
    <svg
      viewBox="0 0 280 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="taigo-wrap"
      style={{ filter: 'drop-shadow(0 6px 18px rgba(42,24,16,0.15))' }}
      aria-label={`Cute car with ${boyDrives ? 'him driving' : girlDrives ? 'her driving' : 'both travellers'}`}
    >
      <ellipse cx="142" cy="117" rx="108" ry="7" fill="rgba(42,24,16,0.12)" />

      <path d="M40 89 Q70 75 100 89" stroke={bodyMid} strokeWidth="2.5" fill={body} />
      <path d="M168 89 Q198 75 228 89" stroke={bodyMid} strokeWidth="2.5" fill={body} />

      <path d="M24 89 L24 62 Q28 48 54 36 L90 26 L158 24 Q192 24 212 40 L238 56 L246 62 L246 89 Z" fill={body} />
      <path d="M32 62 Q36 50 58 38 L90 28 L156 26 Q188 26 208 42 L232 58 L32 62 Z" fill={bodyHi} />
      <rect x="28" y="80" width="214" height="11" rx="3" fill={bodyMid} />

      <path d="M150 28 Q188 26 208 42 L226 58 L146 58 Z" fill={glass} opacity="0.9" />
      <path d="M158 30 Q184 28 204 43 L197 50 Q177 36 160 34 Z" fill="white" opacity="0.2" />

      <rect x="54" y="30" width="84" height="29" rx="7" fill={glass} opacity="0.88" />
      <rect x="58" y="32" width="34" height="9" rx="4" fill="white" opacity="0.18" />
      <rect x="140" y="27" width="6" height="33" rx="3" fill={bodyMid} />

      <rect x="234" y="52" width="16" height="10" rx="5" fill="#FFF5A0" stroke="#DFC040" strokeWidth="0.8" />
      <rect x="233" y="50" width="16" height="3" rx="1.5" fill="#FFE050" opacity="0.7" />
      <rect x="22" y="54" width="10" height="12" rx="4" fill="#FF8888" stroke="#CC3040" strokeWidth="0.8" />

      <path d="M238 82 Q252 81 254 72 L246 67 L240 72 Z" fill={bodyMid} />
      <path d="M24 82 Q12 81 10 72 L18 67 L24 72 Z" fill={bodyMid} />

      <rect x="86" y="71" width="18" height="4" rx="2" fill={bodyMid} />
      <rect x="170" y="71" width="18" height="4" rx="2" fill={bodyMid} />

      {[70, 200].map(wx => (
        <g key={wx}>
          <circle cx={wx} cy="98" r="22" fill="#2C2C2C" />
          <circle cx={wx} cy="98" r="16" fill="#3C3C3C" />
          {[0, 72, 144, 216, 288].map(a => (
            <line
              key={a}
              x1={wx + 5 * Math.cos(a * Math.PI / 180)}
              y1={98 + 5 * Math.sin(a * Math.PI / 180)}
              x2={wx + 15 * Math.cos(a * Math.PI / 180)}
              y2={98 + 15 * Math.sin(a * Math.PI / 180)}
              stroke="#6A6A6A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
          <circle cx={wx} cy="98" r="5" fill="#888" />
          <circle cx={wx} cy="98" r="2.5" fill="#AAAAAA" />
        </g>
      ))}

      <line x1="186" y1="24" x2="183" y2="9" stroke={bodyMid} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="183" cy="8" r="2.5" fill={body} />

      {boyDrives ? <GirlFace cx={passengerCx} cy={faceY} r={11} isDriver={false} bowColor={villainMode ? '#86BC25' : '#B88AC8'} /> : <BoyFace cx={passengerCx} cy={faceY} r={11} isDriver={false} />}

      {boyDrives ? (
        <BoyFace cx={driverCx} cy={faceY} r={11} isDriver={true} />
      ) : girlDrives ? (
        <GirlFace cx={driverCx} cy={faceY} r={11} isDriver={true} bowColor={villainMode ? '#86BC25' : '#B88AC8'} />
      ) : (
        <>
          <BoyFace cx={driverCx} cy={faceY} r={11} isDriver={false} />
          <GirlFace cx={passengerCx} cy={faceY} r={11} isDriver={false} bowColor={villainMode ? '#86BC25' : '#B88AC8'} />
          <text x="140" y="16" textAnchor="middle" fontSize="11" style={{ animation: 'carBounce 1.8s ease-in-out infinite' }}>
            🎲
          </text>
        </>
      )}

      <line x1="2" y1="70" x2="16" y2="70" stroke={bodyMid} strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      <line x1="4" y1="77" x2="14" y2="77" stroke={bodyMid} strokeWidth="1" strokeLinecap="round" opacity="0.35" />
      <line x1="6" y1="84" x2="12" y2="84" stroke={bodyMid} strokeWidth="1" strokeLinecap="round" opacity="0.25" />

      <style>{`
        @keyframes carBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
    </svg>
  )
}
