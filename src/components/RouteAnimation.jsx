import { useEffect, useRef } from 'react'
import { STOPS, DAYS, SVG_ROUTES } from '../data/trip.js'

const VB_W = 380
const VB_H = 210
const OVERSCAN = 72

const COAST = 'M 8,92 Q 28,80 52,82 Q 72,75 100,77 Q 126,72 155,74 Q 186,70 215,74 Q 246,70 270,73 Q 302,68 330,71 Q 352,69 372,72'

const MOUNTAINS = [
  { x: 66, y: 128, w: 19 },
  { x: 82, y: 123, w: 24 },
  { x: 101, y: 129, w: 18 },
  { x: 116, y: 124, w: 16 },
  { x: 132, y: 130, w: 14 },
]

const CLOUDS = [
  { x: 58, y: 30, s: 1 },
  { x: 140, y: 28, s: 0.9 },
  { x: 238, y: 25, s: 1.05 },
  { x: 322, y: 33, s: 0.88 },
]

function MountainPeak({ x, y, w }) {
  return (
    <g>
      <polygon
        points={`${x - w / 2},${y} ${x},${y - w * 0.85} ${x + w / 2},${y}`}
        fill="#A9CD8E"
        stroke="#6F9A58"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <polygon
        points={`${x - w * 0.16},${y - w * 0.53} ${x},${y - w * 0.84} ${x + w * 0.16},${y - w * 0.53}`}
        fill="rgba(255,255,255,0.88)"
      />
    </g>
  )
}

function Cloud({ x, y, s = 1, i }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} style={{ animation: `floatCloud ${9 + i * 1.5}s ease-in-out infinite` }}>
      <ellipse cx="0" cy="0" rx="14" ry="7" fill="rgba(255,255,255,0.58)" />
      <ellipse cx="-9" cy="1" rx="8" ry="5.5" fill="rgba(255,255,255,0.58)" />
      <ellipse cx="10" cy="1" rx="8.5" ry="5.8" fill="rgba(255,255,255,0.58)" />
    </g>
  )
}

function RoutePath({ d, color, active, delay = 0 }) {
  const pathRef = useRef(null)

  useEffect(() => {
    const el = pathRef.current
    if (!el) return undefined
    const len = el.getTotalLength()
    el.style.transition = 'none'
    el.style.strokeDasharray = `${len}`
    el.style.strokeDashoffset = active ? `${len}` : '0'
    if (active) {
      const tid = setTimeout(() => {
        el.style.transition = `stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`
        el.style.strokeDashoffset = '0'
      }, 50)
      return () => clearTimeout(tid)
    }
    return undefined
  }, [active, d, delay])

  return (
    <path
      ref={pathRef}
      d={d}
      stroke={color}
      strokeWidth={active ? 4 : 2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity={active ? 1 : 0.35}
      strokeDasharray={active ? undefined : '5 4'}
    />
  )
}

export default function RouteAnimation({
  currentStop,
  onSelectStop,
  zoomTargetStopId,
  restStops = [],
  carEmoji = '🚗',
  villainMode = false,
  toneMode = 'day',
}) {
  const stop = STOPS[currentStop]
  const isNight = toneMode === 'night'
  const zoomFocus = zoomTargetStopId != null ? (STOPS[zoomTargetStopId] ?? stop) : null
  const zoomScale = zoomFocus ? 1.12 : 1
  const rawTx = zoomFocus ? VB_W / 2 - zoomFocus.svgX * zoomScale : 0
  const rawTy = zoomFocus ? VB_H / 2 - zoomFocus.svgY * zoomScale : 0
  const minTx = VB_W - (VB_W + OVERSCAN) * zoomScale
  const maxTx = OVERSCAN * zoomScale
  const minTy = VB_H - (VB_H + OVERSCAN) * zoomScale
  const maxTy = OVERSCAN * zoomScale
  const zoomTx = Math.min(maxTx, Math.max(minTx, rawTx))
  const zoomTy = Math.min(maxTy, Math.max(minTy, rawTy))
  const zoomTransform = `translate(${zoomTx} ${zoomTy}) scale(${zoomScale})`

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="route-svg"
      preserveAspectRatio="xMidYMid meet"
      aria-label="Route map of Northern Spain"
    >
        <defs>
          <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isNight ? '#0D254A' : '#8ED3F7'} />
            <stop offset="100%" stopColor={isNight ? '#163866' : '#BFE7FF'} />
          </linearGradient>
          <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isNight ? '#1E3656' : '#CEEAAE'} />
            <stop offset="100%" stopColor={isNight ? '#2A4D73' : '#A4D37C'} />
          </linearGradient>
          <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={isNight ? '#DCE8FF' : '#FFE58A'} />
            <stop offset="100%" stopColor={isNight ? '#9CB4D8' : '#FFC65C'} />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodOpacity="0.25" />
          </filter>
        </defs>

        <g className="route-zoom-layer" transform={zoomTransform} style={{ transition: 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)' }}>
          <rect x={-OVERSCAN} y={-OVERSCAN} width={VB_W + OVERSCAN * 2} height={VB_H + OVERSCAN * 2} fill="url(#seaGrad)" />

          {[26, 41, 58].map((y, i) => (
            <path
              key={y}
              d={`M 14,${y} Q 42,${y - 4} 70,${y} Q 98,${y + 4} 126,${y} Q 152,${y - 4} 180,${y} Q 208,${y + 4} 236,${y} Q 264,${y - 4} 292,${y} Q 320,${y + 4} 350,${y}`}
              stroke="rgba(255,255,255,0.20)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="7 6"
              style={{ animation: `waveShift ${6 + i}s linear infinite` }}
            />
          ))}

          <circle cx="336" cy="34" r="15" fill="url(#sunGrad)" style={{ animation: 'sunPulse 5s ease-in-out infinite' }} />
          {isNight ? (
            <g transform="translate(336,34)">
              <circle cx="0" cy="0" r="9" fill="rgba(11, 27, 55, 0.9)" />
              <text x="-24" y="-10" fontSize="8" fill="rgba(227, 238, 255, 0.85)">✦</text>
              <text x="18" y="-8" fontSize="7" fill="rgba(227, 238, 255, 0.7)">✧</text>
            </g>
          ) : (
            <g transform="translate(336,34)">
              {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                <line
                  key={a}
                  x1={Math.cos(a * Math.PI / 180) * 21}
                  y1={Math.sin(a * Math.PI / 180) * 21}
                  x2={Math.cos(a * Math.PI / 180) * 28}
                  y2={Math.sin(a * Math.PI / 180) * 28}
                  stroke="rgba(255,206,98,0.75)"
                  strokeWidth="1.5"
                />
              ))}
            </g>
          )}

          {CLOUDS.map((c, i) => <Cloud key={i} {...c} i={i} />)}

          {[{ x: 44, y: 18 }, { x: 170, y: 20 }, { x: 286, y: 17 }].map((s, i) => (
            <g key={`spark-${i}`} transform={`translate(${s.x},${s.y})`} style={{ animation: `sparkle ${1.8 + i * 0.6}s ease-in-out infinite` }}>
              <line x1="-2" y1="0" x2="2" y2="0" stroke="rgba(255,255,255,0.78)" strokeWidth="1" />
              <line x1="0" y1="-2" x2="0" y2="2" stroke="rgba(255,255,255,0.78)" strokeWidth="1" />
            </g>
          ))}

          <g transform="translate(58,66)" style={{ animation: 'boatDrift 12s linear infinite' }}>
            <path d="M-8,2 L10,2 L6,7 L-6,7 Z" fill="#F8F8FF" stroke="#86B6D4" strokeWidth="0.7" />
            <polygon points="0,-10 0,2 7,2" fill="#FFE7A0" />
            <line x1="0" y1="-11" x2="0" y2="2" stroke="#6D96B8" strokeWidth="0.9" />
          </g>
          <g transform="translate(284,63)" style={{ animation: 'boatDriftReverse 10s linear infinite' }}>
            <path d="M-7,2 L9,2 L5,6 L-5,6 Z" fill="#FFFFFF" stroke="#86B6D4" strokeWidth="0.7" />
            <polygon points="0,-9 0,2 -6,2" fill="#FFD7C7" />
            <line x1="0" y1="-10" x2="0" y2="2" stroke="#6D96B8" strokeWidth="0.9" />
          </g>

          <path d={`${COAST} L 372,${VB_H} L 8,${VB_H} Z`} fill="url(#landGrad)" />
          <path d={COAST} stroke="#6FA458" strokeWidth="1.2" fill="none" />

          <g filter="url(#shadow)">
            {MOUNTAINS.map((m, i) => <MountainPeak key={i} {...m} />)}
          </g>
          <text x="99" y="172" textAnchor="middle" fontSize="7" fill={isNight ? '#C6D8F2' : '#5A7848'} fontFamily="Caveat, cursive" fontStyle="italic">
            {villainMode ? 'Project Peaks' : 'Picos de Europa'}
          </text>

          <g transform="translate(30,104)">
            <rect x="-10" y="-7" width="22" height="10" rx="3" fill="#FFFFFFA0" />
            <polygon points="-10,3 12,3 1,11" fill="#FFFFFFA0" />
          </g>
          <text x="29" y="122" textAnchor="middle" fontSize="6.5" fill={isNight ? '#A7BFE0' : '#4E7E5D'} fontFamily="Caveat, cursive">
            {villainMode ? 'Project Area' : 'Atlantic'}
          </text>

          <text x="358" y="50" textAnchor="middle" fontSize="7" fill="rgba(80,120,180,0.68)" fontFamily="Caveat, cursive">
            France
          </text>
          <line x1="330" y1="69" x2="372" y2="62" stroke="rgba(80,120,180,0.35)" strokeWidth="0.8" strokeDasharray="3 3" />

          <text x="346" y="110" fontSize="13" style={{ animation: 'stickerBob 2.4s ease-in-out infinite' }}>{villainMode ? '📊' : '🌶️'}</text>
          <text x="20" y="172" fontSize="13" style={{ animation: 'stickerBob 2s ease-in-out infinite' }}>{villainMode ? '🧾' : '🌊'}</text>
          <text x="332" y="176" fontSize="13" style={{ animation: 'stickerBob 2.8s ease-in-out infinite' }}>{villainMode ? '📈' : '🏔️'}</text>

          {Object.entries(SVG_ROUTES).map(([day, route]) => (
            <RoutePath key={day} d={route.d} color={route.color} active={Number(day) === stop.day} />
          ))}

          {restStops.map(rest => (
            <g key={rest.id} transform={`translate(${rest.svgX},${rest.svgY})`}>
              <circle cx="0" cy="0" r="6.5" fill="#fff" stroke="#E7AF58" strokeWidth="1.3" />
              <text x="0" y="2.5" textAnchor="middle" fontSize="8">☕</text>
              <text x="8" y="-6" fontSize="6" fill="#7F5D2F" fontFamily="Caveat, cursive">{rest.name}</text>
            </g>
          ))}

          {STOPS.map(s => {
            const isCurrent = s.id === currentStop
            const isPast = s.id < currentStop
            const dayColor = DAYS.find(d => d.id === s.day)?.color ?? '#888'
            const isHotelStop = /hotel|chateau|rooms/i.test(s.name)
            return (
              <g key={s.id} style={{ cursor: 'pointer' }} onClick={() => onSelectStop?.(s.id)}>
                <circle
                  cx={s.svgX}
                  cy={s.svgY}
                  r={isCurrent ? 7.2 : 5}
                  fill={isCurrent ? dayColor : isHotelStop ? '#86BC25' : isPast ? dayColor : 'rgba(255,255,255,0.78)'}
                  stroke={isCurrent ? 'white' : dayColor}
                  strokeWidth={isCurrent ? 2.5 : 1}
                  opacity={isCurrent ? 1 : isPast ? 0.78 : 0.62}
                />
                <text
                  x={s.svgX}
                  y={s.svgY + 2}
                  textAnchor="middle"
                  fontSize={isCurrent ? '5.3' : '4.2'}
                  fontWeight="700"
                  fill={isCurrent ? '#ffffff' : '#1f2f46'}
                >
                  {s.id + 1}
                </text>
                {isCurrent && (
                  <circle
                    cx={s.svgX}
                    cy={s.svgY}
                    r="10"
                    fill="none"
                    stroke={dayColor}
                    strokeWidth="1.4"
                    opacity="0.35"
                    style={{ animation: 'stopPulse 1.4s ease-in-out infinite' }}
                  />
                )}
                {(isCurrent || Math.abs(s.id - currentStop) <= 1) && (
                  <text
                    x={s.svgX + (s.svgX > 300 ? -8 : 8)}
                    y={s.svgY - 8}
                    textAnchor={s.svgX > 300 ? 'end' : 'start'}
                    fontSize="7"
                    fontFamily="Caveat, cursive"
                    fill={isCurrent ? dayColor : 'rgba(30,15,24,0.58)'}
                    fontWeight={isCurrent ? '700' : '500'}
                  >
                    {s.emoji} {s.name}
                  </text>
                )}
              </g>
            )
          })}

          <g
            filter="url(#shadow)"
            style={{
              transform: `translate(${stop.svgX - 12}px, ${stop.svgY - 24}px)`,
              transition: 'transform 1.15s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <text
              x="12"
              y="18"
              textAnchor="middle"
              fontSize="21"
              style={{ animation: 'carBounce 1.2s ease-in-out infinite' }}
            >
              {carEmoji}
            </text>
          </g>

          <g transform="translate(350,179)">
            <circle cx="0" cy="0" r="11" fill="rgba(255,255,255,0.62)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.6" />
            <text x="0" y="-5" textAnchor="middle" fontSize="6" fill="#5A7848" fontWeight="bold">N</text>
            <line x1="0" y1="-3" x2="0" y2="3" stroke="#5A7848" strokeWidth="0.8" />
            <line x1="-3" y1="0" x2="3" y2="0" stroke="#5A7848" strokeWidth="0.8" opacity="0.5" />
          </g>
        </g>

        <style>{`
          @keyframes stopPulse {
            0%, 100% { r: 9; opacity: 0.5; }
            50% { r: 13; opacity: 0.2; }
          }
          @keyframes carBounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }
          @keyframes sunPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.06); }
          }
          @keyframes floatCloud {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          @keyframes waveShift {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -26; }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0.35; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.25); }
          }
          @keyframes boatDrift {
            0% { transform: translateX(-6px); }
            50% { transform: translateX(9px); }
            100% { transform: translateX(-6px); }
          }
          @keyframes boatDriftReverse {
            0% { transform: translateX(6px); }
            50% { transform: translateX(-8px); }
            100% { transform: translateX(6px); }
          }
          @keyframes stickerBob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
        `}</style>
    </svg>
  )
}

