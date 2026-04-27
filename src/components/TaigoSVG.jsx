// Pastel Taigo SVG — side view, car faces RIGHT.
// Front window (right side, near headlights) = driver seat.
// Rear window (left side) = passenger seat.
// driver prop: "boy" | "girl" | "anyone"

const SKIN  = '#C49A6C'   // warm light-brown skin
const SKIN2 = '#D4AA7C'   // highlight
const SKIN3 = '#A87848'   // shadow/nose

// ── Boy face with wavy dark hair ────────────────────────────────
function BoyFace({ cx, cy, r = 11, isDriver }) {
  return (
    <g>
      {/* Neck */}
      <rect x={cx - r * 0.25} y={cy + r * 0.72} width={r * 0.5} height={r * 0.5} rx={r * 0.12} fill={SKIN} />
      {/* Head */}
      <circle cx={cx} cy={cy} r={r} fill={SKIN} />
      {/* Hair — wavy dark brown covering top and sides */}
      <path
        d={`M${cx - r},${cy - r * 0.1}
            Q${cx - r * 1.05},${cy - r * 0.6}
             ${cx - r * 0.7},${cy - r * 1.0}
            Q${cx - r * 0.3},${cy - r * 1.35}
             ${cx},${cy - r * 1.3}
            Q${cx + r * 0.4},${cy - r * 1.35}
             ${cx + r * 0.75},${cy - r * 1.05}
            Q${cx + r * 1.05},${cy - r * 0.7}
             ${cx + r},${cy - r * 0.1}
            Q${cx + r * 0.95},${cy - r * 0.55}
             ${cx + r * 0.6},${cy - r * 0.8}
            Q${cx + r * 0.2},${cy - r * 1.1}
             ${cx},${cy - r * 1.05}
            Q${cx - r * 0.2},${cy - r * 1.1}
             ${cx - r * 0.55},${cy - r * 0.85}
            Q${cx - r * 0.92},${cy - r * 0.55}
             ${cx - r},${cy - r * 0.1} Z`}
        fill="#2C1A0A"
      />
      {/* Hair highlight */}
      <path
        d={`M${cx - r * 0.3},${cy - r * 1.15} Q${cx + r * 0.1},${cy - r * 1.28} ${cx + r * 0.45},${cy - r * 1.08}`}
        stroke="#4A2E10" strokeWidth={r * 0.12} fill="none" strokeLinecap="round"
      />
      {/* Ears */}
      <ellipse cx={cx - r} cy={cy + r * 0.05} rx={r * 0.17} ry={r * 0.22} fill={SKIN2} />
      <ellipse cx={cx + r} cy={cy + r * 0.05} rx={r * 0.17} ry={r * 0.22} fill={SKIN2} />
      {/* Eyes */}
      <ellipse cx={cx - r * 0.3} cy={cy - r * 0.08} rx={r * 0.15} ry={r * 0.13} fill="#2C1A08" />
      <ellipse cx={cx + r * 0.3} cy={cy - r * 0.08} rx={r * 0.15} ry={r * 0.13} fill="#2C1A08" />
      {/* Eye shine */}
      <circle cx={cx - r * 0.23} cy={cy - r * 0.14} r={r * 0.055} fill="white" />
      <circle cx={cx + r * 0.37} cy={cy - r * 0.14} r={r * 0.055} fill="white" />
      {/* Eyebrows */}
      <path d={`M${cx - r * 0.45},${cy - r * 0.28} Q${cx - r * 0.3},${cy - r * 0.36} ${cx - r * 0.14},${cy - r * 0.28}`}
        stroke="#2C1A08" strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />
      <path d={`M${cx + r * 0.14},${cy - r * 0.28} Q${cx + r * 0.3},${cy - r * 0.36} ${cx + r * 0.45},${cy - r * 0.28}`}
        stroke="#2C1A08" strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />
      {/* Nose */}
      <path d={`M${cx - r * 0.1},${cy + r * 0.1} Q${cx},${cy + r * 0.22} ${cx + r * 0.1},${cy + r * 0.1}`}
        stroke={SKIN3} strokeWidth={r * 0.09} fill="none" strokeLinecap="round" />
      {/* Smile */}
      <path d={`M${cx - r * 0.26},${cy + r * 0.3} Q${cx},${cy + r * 0.48} ${cx + r * 0.26},${cy + r * 0.3}`}
        stroke="#8B4820" strokeWidth={r * 0.12} fill="none" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx={cx - r * 0.5} cy={cy + r * 0.2} r={r * 0.14} fill="#D4886A" opacity="0.4" />
      <circle cx={cx + r * 0.5} cy={cy + r * 0.2} r={r * 0.14} fill="#D4886A" opacity="0.4" />
      {/* Steering wheel */}
      {isDriver && (
        <g transform={`translate(${cx + r * 0.9}, ${cy + r * 0.75})`}>
          <circle cx="0" cy="0" r={r * 0.62} stroke="#5A3820" strokeWidth={r * 0.18} fill="none" />
          <line x1={-r * 0.62} y1="0" x2={r * 0.62} y2="0" stroke="#5A3820" strokeWidth={r * 0.12} />
          <line x1="0" y1={-r * 0.62} x2="0" y2={r * 0.62} stroke="#5A3820" strokeWidth={r * 0.12} />
          <circle cx="0" cy="0" r={r * 0.2} fill="#5A3820" />
        </g>
      )}
    </g>
  )
}

// ── Girl face with cute buns + bow ───────────────────────────────
function GirlFace({ cx, cy, r = 11, isDriver }) {
  const hairColor = '#3C2010'
  const bowColor  = '#B88AC8' // lilac bow
  return (
    <g>
      {/* Neck */}
      <rect x={cx - r * 0.25} y={cy + r * 0.72} width={r * 0.5} height={r * 0.5} rx={r * 0.12} fill={SKIN} />
      {/* Hair base — back layer */}
      <ellipse cx={cx} cy={cy + r * 0.2} rx={r * 1.1} ry={r * 0.85} fill={hairColor} />
      {/* Head */}
      <circle cx={cx} cy={cy} r={r} fill={SKIN} />
      {/* Top hair */}
      <ellipse cx={cx} cy={cy - r * 0.78} rx={r * 0.92} ry={r * 0.42} fill={hairColor} />
      {/* Side hair strands */}
      <path d={`M${cx - r},${cy - r * 0.2} Q${cx - r * 1.2},${cy + r * 0.4} ${cx - r * 0.85},${cy + r * 0.8}`}
        fill={hairColor} />
      <path d={`M${cx + r},${cy - r * 0.2} Q${cx + r * 1.2},${cy + r * 0.4} ${cx + r * 0.85},${cy + r * 0.8}`}
        fill={hairColor} />
      {/* Buns */}
      <circle cx={cx - r * 0.62} cy={cy - r * 1.08} r={r * 0.3} fill={hairColor} />
      <circle cx={cx + r * 0.62} cy={cy - r * 1.08} r={r * 0.3} fill={hairColor} />
      {/* Bun highlights */}
      <circle cx={cx - r * 0.7} cy={cy - r * 1.18} r={r * 0.1} fill="#6A3820" opacity="0.5" />
      <circle cx={cx + r * 0.7} cy={cy - r * 1.18} r={r * 0.1} fill="#6A3820" opacity="0.5" />
      {/* Bow on right bun */}
      <path d={`M${cx + r * 0.38},${cy - r * 1.1} Q${cx + r * 0.5},${cy - r * 1.28} ${cx + r * 0.65},${cy - r * 1.2}`}
        fill={bowColor} />
      <path d={`M${cx + r * 0.65},${cy - r * 1.2} Q${cx + r * 0.8},${cy - r * 1.1} ${cx + r * 0.65},${cy - r * 0.98}`}
        fill={bowColor} />
      <path d={`M${cx + r * 0.65},${cy - r * 0.98} Q${cx + r * 0.5},${cy - r * 0.9} ${cx + r * 0.38},${cy - r * 1.1}`}
        fill={bowColor} />
      <circle cx={cx + r * 0.62} cy={cy - r * 1.1} r={r * 0.1} fill="#D4A8E8" />
      {/* Ears */}
      <ellipse cx={cx - r} cy={cy + r * 0.05} rx={r * 0.17} ry={r * 0.22} fill={SKIN2} />
      <ellipse cx={cx + r} cy={cy + r * 0.05} rx={r * 0.17} ry={r * 0.22} fill={SKIN2} />
      {/* Eyes */}
      <ellipse cx={cx - r * 0.3} cy={cy - r * 0.08} rx={r * 0.16} ry={r * 0.15} fill="#2C1A08" />
      <ellipse cx={cx + r * 0.3} cy={cy - r * 0.08} rx={r * 0.16} ry={r * 0.15} fill="#2C1A08" />
      {/* Eye shine */}
      <circle cx={cx - r * 0.23} cy={cy - r * 0.15} r={r * 0.065} fill="white" />
      <circle cx={cx + r * 0.37} cy={cy - r * 0.15} r={r * 0.065} fill="white" />
      {/* Eyelashes */}
      <line x1={cx - r * 0.44} y1={cy - r * 0.2} x2={cx - r * 0.52} y2={cy - r * 0.36} stroke="#2C1A08" strokeWidth={r * 0.1} strokeLinecap="round" />
      <line x1={cx - r * 0.28} y1={cy - r * 0.24} x2={cx - r * 0.28} y2={cy - r * 0.4} stroke="#2C1A08" strokeWidth={r * 0.1} strokeLinecap="round" />
      <line x1={cx + r * 0.14} y1={cy - r * 0.24} x2={cx + r * 0.1} y2={cy - r * 0.4} stroke="#2C1A08" strokeWidth={r * 0.1} strokeLinecap="round" />
      <line x1={cx + r * 0.3} y1={cy - r * 0.24} x2={cx + r * 0.3} y2={cy - r * 0.4} stroke="#2C1A08" strokeWidth={r * 0.1} strokeLinecap="round" />
      <line x1={cx + r * 0.44} y1={cy - r * 0.2} x2={cx + r * 0.52} y2={cy - r * 0.36} stroke="#2C1A08" strokeWidth={r * 0.1} strokeLinecap="round" />
      {/* Eyebrows */}
      <path d={`M${cx - r * 0.48},${cy - r * 0.3} Q${cx - r * 0.3},${cy - r * 0.4} ${cx - r * 0.12},${cy - r * 0.32}`}
        stroke="#3C2010" strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />
      <path d={`M${cx + r * 0.12},${cy - r * 0.32} Q${cx + r * 0.3},${cy - r * 0.4} ${cx + r * 0.48},${cy - r * 0.3}`}
        stroke="#3C2010" strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />
      {/* Nose */}
      <path d={`M${cx - r * 0.1},${cy + r * 0.1} Q${cx},${cy + r * 0.22} ${cx + r * 0.1},${cy + r * 0.1}`}
        stroke={SKIN3} strokeWidth={r * 0.09} fill="none" strokeLinecap="round" />
      {/* Smile */}
      <path d={`M${cx - r * 0.28},${cy + r * 0.3} Q${cx},${cy + r * 0.5} ${cx + r * 0.28},${cy + r * 0.3}`}
        stroke="#8B4820" strokeWidth={r * 0.12} fill="none" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx={cx - r * 0.52} cy={cy + r * 0.22} r={r * 0.17} fill="#D4886A" opacity="0.45" />
      <circle cx={cx + r * 0.52} cy={cy + r * 0.22} r={r * 0.17} fill="#D4886A" opacity="0.45" />
      {/* Steering wheel */}
      {isDriver && (
        <g transform={`translate(${cx + r * 0.9}, ${cy + r * 0.75})`}>
          <circle cx="0" cy="0" r={r * 0.62} stroke="#5A3820" strokeWidth={r * 0.18} fill="none" />
          <line x1={-r * 0.62} y1="0" x2={r * 0.62} y2="0" stroke="#5A3820" strokeWidth={r * 0.12} />
          <line x1="0" y1={-r * 0.62} x2="0" y2={r * 0.62} stroke="#5A3820" strokeWidth={r * 0.12} />
          <circle cx="0" cy="0" r={r * 0.2} fill="#5A3820" />
        </g>
      )}
    </g>
  )
}

// ── Main component ───────────────────────────────────────────────
export default function TaigoSVG({ driver }) {
  // driver: 'boy' | 'girl' | 'anyone'
  const boyDrives  = driver === 'boy'
  const girlDrives = driver === 'girl'
  // anyone = neither is marked as driver (picking up keys)

  const driverCx    = 178  // front window (right side, near headlights)
  const passengerCx = 90   // rear window
  const faceY       = 44

  // Car body color — pastel mint-teal
  const body    = '#9ED4CC'
  const bodyHi  = '#B8E4DC'
  const bodyMid = '#82BCBA'
  const glass   = '#C8E8F8'

  return (
    <svg
      viewBox="0 0 280 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="taigo-wrap"
      style={{ filter: 'drop-shadow(0 6px 18px rgba(42,24,16,0.15))' }}
      aria-label={`Cute car with ${driver === 'anyone' ? 'both travellers' : driver === 'boy' ? 'him driving' : 'her driving'}`}
    >
      {/* ── Ground shadow ── */}
      <ellipse cx="142" cy="117" rx="108" ry="7" fill="rgba(42,24,16,0.12)" />

      {/* ── Wheel arches ── */}
      <path d="M40 89 Q70 75 100 89" stroke={bodyMid} strokeWidth="2.5" fill={body} />
      <path d="M168 89 Q198 75 228 89" stroke={bodyMid} strokeWidth="2.5" fill={body} />

      {/* ── Car body ── */}
      <path
        d="M24 89 L24 62 Q28 48 54 36 L90 26 L158 24 Q192 24 212 40 L238 56 L246 62 L246 89 Z"
        fill={body}
      />
      {/* Top surface highlight */}
      <path
        d="M32 62 Q36 50 58 38 L90 28 L156 26 Q188 26 208 42 L232 58 L32 62 Z"
        fill={bodyHi}
      />
      {/* Lower panel */}
      <rect x="28" y="80" width="214" height="11" rx="3" fill={bodyMid} />

      {/* ── Windshield ── */}
      <path
        d="M150 28 Q188 26 208 42 L226 58 L146 58 Z"
        fill={glass} opacity="0.9"
      />
      <path d="M158 30 Q184 28 204 43 L197 50 Q177 36 160 34 Z" fill="white" opacity="0.2" />

      {/* ── Rear window ── */}
      <rect x="54" y="30" width="84" height="29" rx="7" fill={glass} opacity="0.88" />
      <rect x="58" y="32" width="34" height="9" rx="4" fill="white" opacity="0.18" />

      {/* ── B-pillar ── */}
      <rect x="140" y="27" width="6" height="33" rx="3" fill={bodyMid} />

      {/* ── Headlights — rounded modern ── */}
      <rect x="234" y="52" width="16" height="10" rx="5" fill="#FFF5A0" stroke="#DFC040" strokeWidth="0.8" />
      {/* DRL strip */}
      <rect x="233" y="50" width="16" height="3" rx="1.5" fill="#FFE050" opacity="0.7" />

      {/* ── Taillights ── */}
      <rect x="22" y="54" width="10" height="12" rx="4" fill="#FF8888" stroke="#CC3040" strokeWidth="0.8" />

      {/* ── Front bumper ── */}
      <path d="M238 82 Q252 81 254 72 L246 67 L240 72 Z" fill={bodyMid} />
      {/* Rear bumper */}
      <path d="M24 82 Q12 81 10 72 L18 67 L24 72 Z" fill={bodyMid} />

      {/* ── Door handles ── */}
      <rect x="86" y="71" width="18" height="4" rx="2" fill={bodyMid} />
      <rect x="170" y="71" width="18" height="4" rx="2" fill={bodyMid} />

      {/* ── Wheel rims — cuter with 5 rounded spokes ── */}
      {[70, 200].map(wx => (
        <g key={wx}>
          <circle cx={wx} cy="98" r="22" fill="#2C2C2C" />
          <circle cx={wx} cy="98" r="16" fill="#3C3C3C" />
          {/* 5 spokes */}
          {[0, 72, 144, 216, 288].map(a => (
            <line key={a}
              x1={wx + 5 * Math.cos(a * Math.PI / 180)}
              y1={98  + 5 * Math.sin(a * Math.PI / 180)}
              x2={wx + 15 * Math.cos(a * Math.PI / 180)}
              y2={98  + 15 * Math.sin(a * Math.PI / 180)}
              stroke="#6A6A6A" strokeWidth="2.5" strokeLinecap="round"
            />
          ))}
          <circle cx={wx} cy="98" r="5" fill="#888" />
          <circle cx={wx} cy="98" r="2.5" fill="#AAAAAA" />
        </g>
      ))}

      {/* ── Antenna ── */}
      <line x1="186" y1="24" x2="183" y2="9" stroke={bodyMid} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="183" cy="8" r="2.5" fill={body} />

      {/* ── Faces in windows ── */}
      {/* Rear window = passenger seat */}
      {boyDrives
        ? <GirlFace cx={passengerCx} cy={faceY} r={11} isDriver={false} />
        : <BoyFace  cx={passengerCx} cy={faceY} r={11} isDriver={false} />
      }
      {/* Front window = driver seat */}
      {boyDrives
        ? <BoyFace  cx={driverCx} cy={faceY} r={11} isDriver={true} />
        : girlDrives
          ? <GirlFace cx={driverCx} cy={faceY} r={11} isDriver={true} />
          : (
            <>
              {/* 'anyone' — boy in front, girl in back, neither driving yet */}
              <BoyFace  cx={driverCx}    cy={faceY} r={11} isDriver={false} />
              <GirlFace cx={passengerCx} cy={faceY} r={11} isDriver={false} />
              {/* Key icon above car */}
              <text x="140" y="16" textAnchor="middle" fontSize="11"
                style={{ animation: 'carBounce 1.8s ease-in-out infinite' }}>
                🔑
              </text>
            </>
          )
      }

      {/* ── Speed lines ── */}
      <line x1="2"  y1="70" x2="16" y2="70" stroke={bodyMid} strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      <line x1="4"  y1="77" x2="14" y2="77" stroke={bodyMid} strokeWidth="1"   strokeLinecap="round" opacity="0.35" />
      <line x1="6"  y1="84" x2="12" y2="84" stroke={bodyMid} strokeWidth="1"   strokeLinecap="round" opacity="0.25" />

      {/* Inline animation for key bounce */}
      <style>{`
        @keyframes carBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-2px); }
        }
      `}</style>
    </svg>
  )
}
