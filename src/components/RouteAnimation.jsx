import { useEffect, useRef } from 'react'
import { STOPS, DAYS, SVG_ROUTES } from '../data/trip.js'

// SVG viewBox: 0 0 380 195
// Geographic bounds: lon -5.4→-1.9, lat 43.0→43.6
// x = (lon + 5.4) / 3.5 * 340 + 20
// y = (43.6 - lat) / 0.6 * 150 + 30

const VB_W = 380, VB_H = 195

// Rough Cantabrian coastline path
const COAST = 'M 10,78 Q 30,67 50,70 Q 75,64 100,66 Q 125,62 155,62 Q 185,60 215,62 Q 245,59 270,62 Q 300,58 325,60 Q 348,58 370,61'

// Mountain range (Picos de Europa) — small triangles
const MOUNTAINS = [
  { x: 65, y: 112, w: 18 },
  { x: 80, y: 108, w: 22 },
  { x: 96, y: 113, w: 16 },
  { x: 108, y: 110, w: 14 },
]

function MountainPeak({ x, y, w }) {
  return (
    <polygon
      points={`${x - w / 2},${y} ${x},${y - w * 0.8} ${x + w / 2},${y}`}
      fill="#A8C890" stroke="#7A9E68" strokeWidth="0.8" strokeLinejoin="round"
    />
  )
}

// Animated route path that draws itself
function RoutePath({ d, color, active, delay = 0 }) {
  const pathRef = useRef(null)

  useEffect(() => {
    const el = pathRef.current
    if (!el) return
    const len = el.getTotalLength()
    el.style.transition = 'none'
    el.style.strokeDasharray = len
    el.style.strokeDashoffset = active ? len : 0
    if (active) {
      const tid = setTimeout(() => {
        el.style.transition = `stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`
        el.style.strokeDashoffset = 0
      }, 60)
      return () => clearTimeout(tid)
    }
  }, [active, d, delay])

  return (
    <path
      ref={pathRef}
      d={d}
      stroke={color}
      strokeWidth={active ? 3.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity={active ? 1 : 0.35}
      strokeDasharray={active ? undefined : '5 4'}
    />
  )
}

export default function RouteAnimation({ currentStop }) {
  const stop    = STOPS[currentStop]
  const prevRef = useRef(null)

  // Car animation position
  const carRef = useRef(null)
  useEffect(() => {
    const el = carRef.current
    if (!el) return
    el.style.transition = 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
  }, [])

  return (
    <div className="route-svg-container">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="route-svg"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Route map of Northern Spain"
      >
        <defs>
          <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8EC8F0" />
            <stop offset="100%" stopColor="#B8DDF8" />
          </linearGradient>
          <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#C8E4A0" />
            <stop offset="100%" stopColor="#A8D280" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* ── Sea ── */}
        <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#seaGrad)" />

        {/* ── Sea texture lines ── */}
        {[20, 35, 48].map(y => (
          <line key={y} x1="10" y1={y} x2={VB_W - 10} y2={y}
            stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" strokeDasharray="8 6" />
        ))}

        {/* ── Land mass ── */}
        <path
          d={`${COAST} L 370,${VB_H} L 10,${VB_H} Z`}
          fill="url(#landGrad)"
        />

        {/* ── Coastline border ── */}
        <path d={COAST} stroke="#6FA858" strokeWidth="1.2" fill="none" />

        {/* ── Mountain range (Picos) ── */}
        <g>
          {MOUNTAINS.map((m, i) => <MountainPeak key={i} {...m} />)}
          {/* Snow caps */}
          {MOUNTAINS.map((m, i) => (
            <polygon key={`snow-${i}`}
              points={`${m.x - m.w * 0.18},${m.y - m.w * 0.5} ${m.x},${m.y - m.w * 0.8} ${m.x + m.w * 0.18},${m.y - m.w * 0.5}`}
              fill="rgba(255,255,255,0.85)"
            />
          ))}
          {/* Label */}
          <text x="87" y="155" textAnchor="middle" fontSize="6.5"
            fill="#5A7848" fontFamily="Caveat, cursive" fontStyle="italic">Picos de Europa</text>
        </g>

        {/* ── France label ── */}
        <text x="358" y="28" textAnchor="middle" fontSize="6.5"
          fill="rgba(80,120,180,0.7)" fontFamily="Caveat, cursive">France</text>
        <line x1="330" y1="52" x2="370" y2="45" stroke="rgba(80,120,180,0.3)" strokeWidth="0.8" strokeDasharray="3 3" />

        {/* ── Route paths (all 4 days) ── */}
        {Object.entries(SVG_ROUTES).map(([day, route]) => (
          <RoutePath
            key={day}
            d={route.d}
            color={route.color}
            active={Number(day) === stop.day}
            delay={0}
          />
        ))}

        {/* ── All stop dots ── */}
        {STOPS.map(s => {
          const isCurrent = s.id === currentStop
          const isPast    = s.id < currentStop
          const dayColor  = DAYS.find(d => d.id === s.day)?.color ?? '#888'
          return (
            <g key={s.id}>
              <circle
                cx={s.svgX} cy={s.svgY}
                r={isCurrent ? 6 : 3.5}
                fill={isCurrent ? dayColor : isPast ? dayColor : 'rgba(255,255,255,0.7)'}
                stroke={isCurrent ? 'white' : dayColor}
                strokeWidth={isCurrent ? 2.5 : 1}
                opacity={isCurrent ? 1 : isPast ? 0.8 : 0.6}
              />
              {/* Pulse ring on current stop */}
              {isCurrent && (
                <circle
                  cx={s.svgX} cy={s.svgY} r="10"
                  fill="none" stroke={dayColor}
                  strokeWidth="1.5" opacity="0.4"
                  style={{ animation: 'stopPulse 1.5s ease-in-out infinite' }}
                />
              )}
              {/* Label for current + nearby stops */}
              {(isCurrent || Math.abs(s.id - currentStop) <= 1) && (
                <text
                  x={s.svgX + (s.svgX > 300 ? -8 : 8)}
                  y={s.svgY - 8}
                  textAnchor={s.svgX > 300 ? 'end' : 'start'}
                  fontSize="7"
                  fontFamily="Caveat, cursive"
                  fill={isCurrent ? dayColor : 'rgba(30,15,24,0.6)'}
                  fontWeight={isCurrent ? '700' : '400'}
                  style={{ pointerEvents: 'none' }}
                >
                  {s.emoji} {s.name}
                </text>
              )}
            </g>
          )
        })}

        {/* ── Animated car marker ── */}
        <g
          ref={carRef}
          style={{
            transform: `translate(${stop.svgX - 12}px, ${stop.svgY - 22}px)`,
            transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          filter="url(#shadow)"
        >
          <text
            x="12" y="18"
            textAnchor="middle"
            fontSize="20"
            style={{ animation: 'carBounce 1.4s ease-in-out infinite' }}
          >
            🚗
          </text>
        </g>

        {/* ── Compass rose ── */}
        <g transform="translate(352, 165)">
          <circle cx="0" cy="0" r="10" fill="rgba(255,255,255,0.6)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
          <text x="0" y="-5" textAnchor="middle" fontSize="6" fill="#5A7848" fontWeight="bold">N</text>
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#5A7848" strokeWidth="0.8" />
          <line x1="-3" y1="0" x2="3" y2="0" stroke="#5A7848" strokeWidth="0.8" opacity="0.5" />
        </g>

        {/* Inline CSS for SVG animations */}
        <style>{`
          @keyframes stopPulse {
            0%, 100% { r: 9; opacity: 0.5; }
            50%       { r: 13; opacity: 0.2; }
          }
          @keyframes carBounce {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-3px); }
          }
        `}</style>
      </svg>
    </div>
  )
}
