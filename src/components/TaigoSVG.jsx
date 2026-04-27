// Pastel VW Taigo SVG — side view, car faces right.
// Driver seat = front (right side of SVG), passenger = rear (left side).
// driver prop: "boy" | "girl"

function BoyFace({ cx, cy, r = 11, isDriver }) {
  return (
    <g>
      {/* Head */}
      <circle cx={cx} cy={cy} r={r} fill="#F5C9A0" />
      {/* Beanie hat */}
      <ellipse cx={cx} cy={cy - r * 0.55} rx={r * 0.92} ry={r * 0.45} fill="#1E3A5F" />
      <rect x={cx - r * 0.92} y={cy - r} width={r * 1.84} height={r * 0.42} rx="2" fill="#2A4E80" />
      {/* Hat pom */}
      <circle cx={cx} cy={cy - r * 1.05} r={r * 0.18} fill="#4A7AB8" />
      {/* Eyes */}
      <circle cx={cx - r * 0.32} cy={cy - r * 0.05} r={r * 0.13} fill="#3C1F0A" />
      <circle cx={cx + r * 0.32} cy={cy - r * 0.05} r={r * 0.13} fill="#3C1F0A" />
      {/* Eye shine */}
      <circle cx={cx - r * 0.27} cy={cy - r * 0.1}  r={r * 0.05} fill="white" />
      <circle cx={cx + r * 0.37} cy={cy - r * 0.1}  r={r * 0.05} fill="white" />
      {/* Nose */}
      <circle cx={cx} cy={cy + r * 0.12} r={r * 0.08} fill="#D4967A" />
      {/* Smile */}
      <path d={`M${cx - r * 0.28},${cy + r * 0.28} Q${cx},${cy + r * 0.48} ${cx + r * 0.28},${cy + r * 0.28}`}
        stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Rosy cheeks */}
      <circle cx={cx - r * 0.52} cy={cy + r * 0.18} r={r * 0.15} fill="#E0A080" opacity="0.4" />
      <circle cx={cx + r * 0.52} cy={cy + r * 0.18} r={r * 0.15} fill="#E0A080" opacity="0.4" />
      {/* Steering wheel if driving */}
      {isDriver && (
        <g transform={`translate(${cx + r * 0.85}, ${cy + r * 0.7})`}>
          <circle cx="0" cy="0" r="7" stroke="#4A4A4A" strokeWidth="2" fill="none" />
          <line x1="-7" y1="0" x2="7" y2="0" stroke="#4A4A4A" strokeWidth="1.5" />
          <line x1="0" y1="-7" x2="0" y2="7" stroke="#4A4A4A" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="2.5" fill="#4A4A4A" />
        </g>
      )}
    </g>
  )
}

function GirlFace({ cx, cy, r = 11, isDriver }) {
  return (
    <g>
      {/* Head */}
      <circle cx={cx} cy={cy} r={r} fill="#F9C4A8" />
      {/* Hair — side bits */}
      <path d={`M${cx - r},${cy - r * 0.2} Q${cx - r * 1.3},${cy + r * 0.6} ${cx - r * 0.7},${cy + r * 0.9}`}
        fill="#E87878" />
      <path d={`M${cx + r},${cy - r * 0.2} Q${cx + r * 1.3},${cy + r * 0.6} ${cx + r * 0.7},${cy + r * 0.9}`}
        fill="#E87878" />
      {/* Top hair */}
      <ellipse cx={cx} cy={cy - r * 0.85} rx={r * 0.95} ry={r * 0.45} fill="#E87878" />
      {/* Hair buns */}
      <circle cx={cx - r * 0.65} cy={cy - r * 1.1} r={r * 0.28} fill="#E87878" />
      <circle cx={cx + r * 0.65} cy={cy - r * 1.1} r={r * 0.28} fill="#E87878" />
      {/* Bun highlight */}
      <circle cx={cx - r * 0.72} cy={cy - r * 1.18} r={r * 0.1} fill="#F0A0A0" opacity="0.6" />
      <circle cx={cx + r * 0.72} cy={cy - r * 1.18} r={r * 0.1} fill="#F0A0A0" opacity="0.6" />
      {/* Eyes */}
      <circle cx={cx - r * 0.3} cy={cy - r * 0.05} r={r * 0.15} fill="#3C1F0A" />
      <circle cx={cx + r * 0.3} cy={cy - r * 0.05} r={r * 0.15} fill="#3C1F0A" />
      {/* Eye shine */}
      <circle cx={cx - r * 0.24} cy={cy - r * 0.11} r={r * 0.06} fill="white" />
      <circle cx={cx + r * 0.36} cy={cy - r * 0.11} r={r * 0.06} fill="white" />
      {/* Eyelashes */}
      <line x1={cx - r * 0.44} y1={cy - r * 0.18} x2={cx - r * 0.52} y2={cy - r * 0.32} stroke="#3C1F0A" strokeWidth="1.2" strokeLinecap="round" />
      <line x1={cx - r * 0.3}  y1={cy - r * 0.22} x2={cx - r * 0.3}  y2={cy - r * 0.38} stroke="#3C1F0A" strokeWidth="1.2" strokeLinecap="round" />
      <line x1={cx + r * 0.16} y1={cy - r * 0.22} x2={cx + r * 0.12} y2={cy - r * 0.38} stroke="#3C1F0A" strokeWidth="1.2" strokeLinecap="round" />
      <line x1={cx + r * 0.3}  y1={cy - r * 0.22} x2={cx + r * 0.3}  y2={cy - r * 0.38} stroke="#3C1F0A" strokeWidth="1.2" strokeLinecap="round" />
      <line x1={cx + r * 0.44} y1={cy - r * 0.18} x2={cx + r * 0.52} y2={cy - r * 0.32} stroke="#3C1F0A" strokeWidth="1.2" strokeLinecap="round" />
      {/* Nose */}
      <circle cx={cx} cy={cy + r * 0.12} r={r * 0.08} fill="#D4967A" />
      {/* Smile */}
      <path d={`M${cx - r * 0.3},${cy + r * 0.28} Q${cx},${cy + r * 0.5} ${cx + r * 0.3},${cy + r * 0.28}`}
        stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx={cx - r * 0.55} cy={cy + r * 0.18} r={r * 0.18} fill="#F0A0A0" opacity="0.5" />
      <circle cx={cx + r * 0.55} cy={cy + r * 0.18} r={r * 0.18} fill="#F0A0A0" opacity="0.5" />
      {/* Steering wheel if driving */}
      {isDriver && (
        <g transform={`translate(${cx + r * 0.85}, ${cy + r * 0.7})`}>
          <circle cx="0" cy="0" r="7" stroke="#4A4A4A" strokeWidth="2" fill="none" />
          <line x1="-7" y1="0" x2="7" y2="0" stroke="#4A4A4A" strokeWidth="1.5" />
          <line x1="0" y1="-7" x2="0" y2="7" stroke="#4A4A4A" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="2.5" fill="#4A4A4A" />
        </g>
      )}
    </g>
  )
}

export default function TaigoSVG({ driver }) {
  // In the SVG the car faces RIGHT. Front = right side.
  // Front window (closer to headlights) = driver seat.
  // Rear window (closer to taillights) = passenger seat.
  const boyDriving  = driver === 'boy'
  const girlDriving = driver === 'girl'

  // Driver is in front seat (right window area: cx ≈ 178)
  // Passenger is in rear seat (left window area:  cx ≈ 90)
  const driverCx    = 176
  const passengerCx = 90
  const faceY       = 44

  return (
    <svg
      viewBox="0 0 280 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="taigo-wrap"
      style={{ filter: 'drop-shadow(0 8px 20px rgba(44,24,16,0.18))' }}
    >
      {/* ── Shadow under car ── */}
      <ellipse cx="142" cy="116" rx="110" ry="9" fill="rgba(44,24,16,0.14)" />

      {/* ── Wheel arches (background) ── */}
      <path d="M38 88 Q70 74 102 88" stroke="#8DC4B4" strokeWidth="3" fill="#A8D4C4" />
      <path d="M168 88 Q200 74 232 88" stroke="#8DC4B4" strokeWidth="3" fill="#A8D4C4" />

      {/* ── Main car body ── */}
      <path
        d="M22 88 L22 62 Q26 48 52 36 L88 26 L160 24 Q192 24 212 40 L240 56 L248 62 L248 88 Z"
        fill="#A8D4C4"
      />
      {/* Body highlight (top surface) */}
      <path
        d="M30 62 Q34 50 56 38 L88 28 L158 26 Q188 26 208 42 L234 58 L30 62 Z"
        fill="#BAE0D4"
      />
      {/* Lower door panel */}
      <rect x="26" y="80" width="218" height="12" rx="3" fill="#8DC4B4" />

      {/* ── Windshield (front, right) ── */}
      <path
        d="M152 28 Q188 26 208 42 L228 58 L148 58 Z"
        fill="#C8E8F8"
        opacity="0.92"
      />
      {/* Windshield glare */}
      <path d="M160 30 Q185 28 205 43 L198 50 Q178 35 160 34 Z" fill="white" opacity="0.22" />

      {/* ── Rear window (left) ── */}
      <rect x="52" y="30" width="88" height="30" rx="6" fill="#C8E8F8" opacity="0.88" />
      {/* Rear window glare */}
      <rect x="56" y="32" width="38" height="10" rx="4" fill="white" opacity="0.2" />

      {/* ── B-pillar (window divider) ── */}
      <rect x="142" y="26" width="6" height="34" rx="3" fill="#8DC4B4" />

      {/* ── Headlights ── */}
      <ellipse cx="244" cy="58" rx="8" ry="6" fill="#FFF3A0" stroke="#E0C040" strokeWidth="1" />
      <ellipse cx="244" cy="65" rx="6" ry="4" fill="#FFD040" opacity="0.5" />
      {/* DRL line */}
      <line x1="238" y1="54" x2="250" y2="54" stroke="#FFE060" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── Taillights ── */}
      <ellipse cx="24" cy="60" rx="7" ry="5" fill="#FF7070" stroke="#CC3030" strokeWidth="1" />
      <ellipse cx="24" cy="67" rx="5" ry="3" fill="#FF4040" opacity="0.4" />

      {/* ── Front bumper ── */}
      <path d="M240 80 Q252 80 254 72 L248 68 L242 72 Z" fill="#9ECABB" />
      {/* Rear bumper */}
      <path d="M22 80 Q12 80 10 72 L18 68 L24 72 Z" fill="#9ECABB" />

      {/* ── VW badge ── */}
      <circle cx="240" cy="50" r="7" fill="rgba(255,255,255,0.85)" />
      <text x="240" y="54" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#1C1C3C">VW</text>

      {/* ── Door handles ── */}
      <rect x="84" y="70" width="20" height="4" rx="2" fill="#8DC4B4" />
      <rect x="168" y="70" width="20" height="4" rx="2" fill="#8DC4B4" />

      {/* ── Wheels ── */}
      {/* Rear wheel */}
      <circle cx="70" cy="98" r="22" fill="#2C2C2C" />
      <circle cx="70" cy="98" r="15" fill="#484848" />
      <circle cx="70" cy="98" r="7"  fill="#888" />
      <circle cx="70" cy="98" r="3"  fill="#AAA" />
      {/* Rear wheel spokes */}
      {[0,60,120,180,240,300].map(a => (
        <line key={a}
          x1={70 + 7 * Math.cos(a * Math.PI/180)}
          y1={98 + 7 * Math.sin(a * Math.PI/180)}
          x2={70 + 14 * Math.cos(a * Math.PI/180)}
          y2={98 + 14 * Math.sin(a * Math.PI/180)}
          stroke="#666" strokeWidth="2" />
      ))}

      {/* Front wheel */}
      <circle cx="200" cy="98" r="22" fill="#2C2C2C" />
      <circle cx="200" cy="98" r="15" fill="#484848" />
      <circle cx="200" cy="98" r="7"  fill="#888" />
      <circle cx="200" cy="98" r="3"  fill="#AAA" />
      {/* Front wheel spokes */}
      {[0,60,120,180,240,300].map(a => (
        <line key={a}
          x1={200 + 7 * Math.cos(a * Math.PI/180)}
          y1={98  + 7 * Math.sin(a * Math.PI/180)}
          x2={200 + 14 * Math.cos(a * Math.PI/180)}
          y2={98  + 14 * Math.sin(a * Math.PI/180)}
          stroke="#666" strokeWidth="2" />
      ))}

      {/* ── Characters in windows ── */}
      {/* REAR window: passenger */}
      {boyDriving
        ? <GirlFace cx={passengerCx} cy={faceY} r={12} isDriver={false} />
        : <BoyFace  cx={passengerCx} cy={faceY} r={12} isDriver={false} />
      }
      {/* FRONT window: driver */}
      {boyDriving
        ? <BoyFace  cx={driverCx} cy={faceY} r={12} isDriver={true} />
        : <GirlFace cx={driverCx} cy={faceY} r={12} isDriver={true} />
      }

      {/* ── Antenna ── */}
      <line x1="190" y1="24" x2="186" y2="10" stroke="#8DC4B4" strokeWidth="2" strokeLinecap="round" />
      <circle cx="186" cy="9" r="2.5" fill="#A8D4C4" />

      {/* ── Speed lines (always moving!) ── */}
      <line x1="0" y1="70" x2="14" y2="70" stroke="#8DC4B4" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="2" y1="77" x2="12" y2="77" stroke="#8DC4B4" strokeWidth="1"   strokeLinecap="round" opacity="0.4" />
      <line x1="4" y1="84" x2="10" y2="84" stroke="#8DC4B4" strokeWidth="1"   strokeLinecap="round" opacity="0.3" />
    </svg>
  )
}
