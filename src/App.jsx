import { useState, useEffect, useRef } from 'react'
import TaigoSVG      from './components/TaigoSVG.jsx'
import RouteAnimation from './components/RouteAnimation.jsx'
import Questions      from './components/Questions.jsx'
import Games          from './components/Games.jsx'
import {
  STOPS, DAYS, BOOKINGS, PHRASES, TIPS, WEATHER_LOCS,
} from './data/trip.js'

// ── WMO code → icon + label ───────────────────────────────────────
function wmoLabel(code) {
  if (code === 0)  return { icon: '☀️',  label: 'Sunny' }
  if (code <= 3)   return { icon: '⛅',  label: 'Partly cloudy' }
  if (code <= 48)  return { icon: '🌫️', label: 'Foggy' }
  if (code <= 55)  return { icon: '🌦️', label: 'Drizzle' }
  if (code <= 65)  return { icon: '🌧️', label: 'Rain' }
  if (code <= 75)  return { icon: '❄️',  label: 'Snow' }
  if (code <= 82)  return { icon: '🌦️', label: 'Showers' }
  if (code <= 99)  return { icon: '⛈️', label: 'Storm' }
  return { icon: '🌤️', label: '' }
}

// ── Floating items (flags + travel emojis + Deloitte dot) ─────────
const FLOAT_ITEMS = [
  { content: '🇸🇬', size: 1.1 },
  { content: '🇬🇧', size: 1.1 },
  { content: '✈️',  size: 1.0 },
  { content: '🚗',  size: 0.9 },
  { content: '🗺️', size: 1.0 },
  { content: '🇸🇬', size: 0.85 },
  { content: '●',   size: 0.7, color: '#86BC24' }, // Deloitte dot
  { content: '🇬🇧', size: 0.9 },
  { content: '✈️',  size: 0.85 },
  { content: '🚗',  size: 1.0 },
  { content: '●',   size: 0.6, color: '#86BC24' },
  { content: '🗺️', size: 0.9 },
]
function FloatingItems() {
  return (
    <div className="petals-layer" aria-hidden="true">
      {FLOAT_ITEMS.map((item, i) => (
        <span
          key={i}
          className="petal-piece"
          style={{
            left:              `${(i * 8.2 + 3) % 97}%`,
            animationDuration: `${9 + (i * 1.81) % 9}s`,
            animationDelay:    `${(i * 1.37) % 12}s`,
            fontSize:          `${item.size}rem`,
            color:             item.color ?? undefined,
          }}
        >
          {item.content}
        </span>
      ))}
    </div>
  )
}

// ── Splash screen ─────────────────────────────────────────────────
function Splash({ onEnter }) {
  const stars = Array.from({ length: 34 }, (_, i) => ({
    left:  `${(i * 2.9 + 3) % 95}%`,
    top:   `${(i * 5.7 + 2) % 92}%`,
    dur:   `${1.3 + (i * 0.31) % 2.5}s`,
    delay: `${(i * 0.27) % 4}s`,
    size:  `${1.5 + (i % 5) * 0.4}px`,
  }))

  return (
    <div className="splash">
      <div className="splash-stars" aria-hidden="true">
        {stars.map((s, i) => (
          <div key={i} className="splash-star"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size,
              animationDuration: s.dur, animationDelay: s.delay }} />
        ))}
      </div>

      <div className="splash-cake">🎂</div>
      <h1 className="splash-title"><em>España</em> ✈</h1>
      <div className="splash-sub">northern spain road trip</div>
      <div className="splash-date">5 – 8 May 2026</div>

      <div className="splash-taigo">
        <TaigoSVG driver="boy" />
      </div>

      <div className="splash-btn">
        <button className="wax-seal" onClick={onEnter} aria-label="Open trip guide">
          <span className="wax-seal-icon">✦</span>
          <span className="wax-seal-label">Open</span>
        </button>
        <div className="splash-hint">tap to open the guide</div>
      </div>
    </div>
  )
}

// ── Countdown hook ────────────────────────────────────────────────
function useCountdown(isoTarget) {
  const target = useRef(new Date(isoTarget).getTime())
  const [diff, setDiff] = useState(() => Math.max(0, target.current - Date.now()))
  useEffect(() => {
    const id = setInterval(() => setDiff(Math.max(0, target.current - Date.now())), 1000)
    return () => clearInterval(id)
  }, [])
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff % 86_400_000) / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1_000),
    gone: diff === 0,
  }
}

// ── HOME SCREEN ───────────────────────────────────────────────────
function HomeScreen() {
  const { d, h, m, s, gone } = useCountdown('2026-05-05T06:00:00Z') // RK2612 07:00 BST

  const [weather, setWeather] = useState(null)
  const [wxError, setWxError] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.all(
          WEATHER_LOCS.map(async loc => {
            const url =
              `https://api.open-meteo.com/v1/forecast` +
              `?latitude=${loc.lat}&longitude=${loc.lon}` +
              `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
              `&timezone=Europe%2FMadrid` +
              `&start_date=${loc.date}&end_date=${loc.date}`
            const r = await fetch(url)
            const j = await r.json()
            return {
              day:  loc.day,
              name: loc.name,
              max:  Math.round(j.daily.temperature_2m_max[0]),
              min:  Math.round(j.daily.temperature_2m_min[0]),
              ...wmoLabel(j.daily.weathercode[0]),
            }
          })
        )
        setWeather(results)
      } catch {
        setWxError(true)
      }
    }
    load()
  }, [])

  const pad = n => String(n).padStart(2, '0')

  return (
    <div className="screen">
      <div className="home-hero">
        <div className="home-hero-hand">road trip · northern spain</div>
        <div className="home-hero-title"><em>España</em> ✈</div>
        <div className="home-hero-date">5 – 8 May 2026</div>
      </div>

      <div className="screen-body">
        {/* Countdown to Spain flight */}
        <div className="countdown-card">
          <div className="countdown-label">
            {gone ? '🎉 trip in progress!' : '✈️ RK2612 departs Stansted in…'}
          </div>
          {!gone && (
            <div className="countdown-blocks">
              <div className="cnt-block">
                <div className="cnt-num">{d}</div>
                <div className="cnt-label">days</div>
              </div>
              <div className="cnt-colon">:</div>
              <div className="cnt-block">
                <div className="cnt-num">{pad(h)}</div>
                <div className="cnt-label">hrs</div>
              </div>
              <div className="cnt-colon">:</div>
              <div className="cnt-block">
                <div className="cnt-num">{pad(m)}</div>
                <div className="cnt-label">min</div>
              </div>
              <div className="cnt-colon">:</div>
              <div className="cnt-block">
                <div className="cnt-num">{pad(s)}</div>
                <div className="cnt-label">sec</div>
              </div>
            </div>
          )}
        </div>

        {/* Weather */}
        <div>
          <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.05rem', color: 'var(--teal)', marginBottom: 9 }}>
            🌤️ May forecast
          </div>
          {wxError ? (
            <div className="weather-loading">couldn't load forecast — check back online</div>
          ) : !weather ? (
            <div className="weather-loading">fetching the forecast… ✦</div>
          ) : (
            <div className="weather-strip">
              {weather.map(w => (
                <div key={w.day} className="weather-day-card">
                  <div className="weather-day-name">Day {w.day}</div>
                  <div className="weather-day-icon">{w.icon}</div>
                  <div className="weather-day-temp">{w.max}° / {w.min}°</div>
                  <div className="weather-day-desc">{w.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trip note */}
        <div className="trip-note">
          <div className="trip-note-text">
            Four days along the Cantabrian coast — the Game of Thrones island,
            the world's greatest pintxos, mountains that touch clouds, a medieval
            village frozen in time. <em>Just us and the Taigo.</em>
          </div>
          <div className="trip-note-sign">— a little road trip ✦</div>
        </div>

        {/* Day overview */}
        <div className="card">
          <div className="card-header">
            <div className="card-label">the plan</div>
            <div className="card-title">4 days · 15 stops · Northern Spain</div>
            <div className="card-note">Basque Country → Cantabria → Picos de Europa → Asturias</div>
          </div>
          <div className="card-body">
            {DAYS.map((day, i) => (
              <div key={day.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '8px 0',
                borderBottom: i < DAYS.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: '1.15rem', flexShrink: 0 }}>{day.emoji}</span>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: day.color }}>
                    {day.date}
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--ink)', marginTop: 1 }}>
                    {day.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{day.drive}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── ROUTE SCREEN ──────────────────────────────────────────────────
function RouteScreen({ currentStop, setCurrentStop }) {
  const stop     = STOPS[currentStop]
  const nextStop = currentStop < STOPS.length - 1 ? STOPS[currentStop + 1] : null
  const dayData  = DAYS.find(d => d.id === stop.day)

  const driverLabel = () => {
    if (stop.driver === 'anyone') return <>🔑 <strong style={{ color: 'var(--teal)' }}>picking up keys!</strong></>
    if (stop.driver === 'boy')    return <><strong style={{ color: 'var(--teal)' }}>his</strong> turn to drive</>
    return <><strong style={{ color: 'var(--lilac)' }}>her</strong> turn to drive</>
  }

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowRight' && currentStop < STOPS.length - 1) setCurrentStop(c => c + 1)
      if (e.key === 'ArrowLeft'  && currentStop > 0)                setCurrentStop(c => c - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentStop, setCurrentStop])

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-eyebrow">the journey</div>
        <div className="screen-title">Our <em>Route</em></div>
      </div>

      <div className="screen-body">
        {/* Animated SVG map */}
        <div>
          <div className="route-svg-container">
            <RouteAnimation currentStop={currentStop} />
          </div>
          {/* Route banner */}
          <div className="route-banner">
            <span className="route-banner-stop">{stop.emoji} <strong>{stop.name}</strong></span>
            {nextStop && (
              <>
                <span className="route-banner-arrow">→</span>
                <span className="route-banner-stop">{nextStop.emoji} {nextStop.name}</span>
              </>
            )}
            {!nextStop && <span style={{ fontFamily: 'var(--font-hand)', color: 'var(--muted)' }}>¡Hasta luego! 🎉</span>}
          </div>
        </div>

        {/* Stop navigation */}
        <div className="stop-nav-bar">
          <button className="stop-btn" onClick={() => setCurrentStop(c => c - 1)} disabled={currentStop === 0} aria-label="Previous stop">◀</button>
          <div className="stop-nav-center">
            <div className="stop-counter">Stop {currentStop + 1} of {STOPS.length}</div>
            <div className="stop-day-pill" style={{ background: dayData?.colorLight, color: dayData?.color }}>
              {dayData?.date}
            </div>
            <div className="stop-dots">
              {STOPS.map(s => (
                <button key={s.id}
                  className={`stop-dot${s.id === currentStop ? ' active' : s.id < currentStop ? ' visited' : ''}`}
                  style={s.id === currentStop ? { background: dayData?.color, borderColor: dayData?.color } : {}}
                  onClick={() => setCurrentStop(s.id)}
                  aria-label={s.name}
                />
              ))}
            </div>
          </div>
          <button className="stop-btn" onClick={() => setCurrentStop(c => c + 1)} disabled={currentStop === STOPS.length - 1} aria-label="Next stop">▶</button>
        </div>

        {/* Taigo car panel */}
        <div className="car-panel">
          <TaigoSVG driver={stop.driver} />
          <div className="driver-strip">
            <div className={`driver-face${stop.driver === 'girl' ? ' driving' : ''}`}>👩</div>
            <div className="driver-label-text">{driverLabel()}</div>
            <div className={`driver-face${stop.driver === 'boy' ? ' driving' : ''}`}>👨</div>
          </div>
        </div>

        {/* Stop detail card */}
        <div className="stop-detail-card">
          <div className="stop-detail-header">
            <div className="stop-emoji-big">{stop.emoji}</div>
            <div className="stop-region-tag">{stop.region} · Day {stop.day}</div>
            <div className="stop-name-big">{stop.name}</div>
            <div className="stop-desc-text">{stop.desc}</div>
          </div>

          <div className="stop-detail-body">
            {stop.detail && <div className="stop-tip-block">💡 {stop.detail}</div>}

            {stop.food.length > 0 && (
              <div>
                <div className="food-section-label">🍽 eat &amp; drink nearby</div>
                <div className="food-items">
                  {stop.food.map((f, i) => (
                    <div key={i} className="food-item">
                      <span className="food-icon">{f.icon}</span>
                      <div className="food-text">
                        <div className="food-name">{f.name}</div>
                        <div className="food-note">{f.note}</div>
                        {f.maps && (
                          <a href={f.maps} target="_blank" rel="noopener noreferrer" className="food-maps-link">
                            📍 open in maps
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigate to this stop */}
            <a href={stop.gmaps} target="_blank" rel="noopener noreferrer" className="maps-btn">
              🗺 Navigate to {stop.name}
            </a>

            {/* Navigate to NEXT stop */}
            {nextStop && (
              <a href={nextStop.gmaps} target="_blank" rel="noopener noreferrer" className="maps-btn-next">
                ▶ Continue → {nextStop.emoji} {nextStop.name}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── DAYS SCREEN ───────────────────────────────────────────────────
function DaysScreen() {
  const [openDay, setOpenDay]       = useState(1)
  const [pintxosMode, setPintxos]   = useState('crawl') // 'crawl' | 'dinner'

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-eyebrow">day by day</div>
        <div className="screen-title">The <em>Itinerary</em></div>
      </div>

      <div className="screen-body">
        <div className="day-cards-list">
          {DAYS.map(day => {
            const isOpen = openDay === day.id
            // Build full-day Google Maps route URL
            const dayStops = day.stopIds.map(id => STOPS[id])
            const mapsRoute = 'https://www.google.com/maps/dir/' +
              dayStops.map(s => encodeURIComponent(s.name + ', Spain')).join('/')

            return (
              <div key={day.id} className={`day-big-card${isOpen ? ' open' : ''}`}>
                <div className="day-card-top"
                  onClick={() => setOpenDay(isOpen ? null : day.id)}
                  role="button" aria-expanded={isOpen}
                >
                  <div className="day-card-accent-bar" style={{ background: day.color }} />
                  <div className="day-card-top-text">
                    <div className="day-card-day" style={{ color: day.color }}>
                      {day.emoji} {day.date} · {day.region}
                    </div>
                    <div className="day-card-title-big">{day.title}</div>
                    <div className="day-card-sub-text">{day.subtitle} · {day.drive}</div>
                  </div>
                  <span className="day-card-chevron" aria-hidden="true">▼</span>
                </div>

                <div className="day-card-body-wrap">
                  <div className="day-card-inner">

                    {/* Open full day in Google Maps */}
                    <a href={mapsRoute} target="_blank" rel="noopener noreferrer"
                      className="day-route-btn" style={{ marginTop: 14 }}>
                      🗺 Open full day route in Maps
                    </a>

                    {/* Stops */}
                    <div style={{ marginTop: 10 }}>
                      {day.stopIds.map(id => {
                        const s = STOPS[id]
                        return (
                          <div key={id} className="day-stop-row">
                            <span className="day-stop-emoji">{s.emoji}</span>
                            <div style={{ flex: 1 }}>
                              <div className="day-stop-name">{s.name}</div>
                              <div className="day-stop-desc">{s.desc}</div>
                            </div>
                            <a href={s.gmaps} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: '1.1rem', flexShrink: 0, opacity: 0.6, paddingTop: 2 }}
                              title="Directions">📍</a>
                          </div>
                        )
                      })}
                    </div>

                    {/* Hotel badge */}
                    {day.hotel && (
                      <div className="day-hotel-badge">
                        <span className="day-hotel-icon">{day.id === 4 ? '✈️' : '🏨'}</span>
                        <div>
                          <div className="day-hotel-name">{day.hotel.name}</div>
                          <div className="day-hotel-area">{day.hotel.area}</div>
                          {day.hotel.checkin && (
                            <div className="day-hotel-area">
                              Check-in {day.hotel.checkin} · Checkout {day.hotel.checkout}
                            </div>
                          )}
                          {day.hotel.note && <div className="day-hotel-note">{day.hotel.note}</div>}
                        </div>
                      </div>
                    )}

                    {/* Day 1 evening plan — pintxos crawl or dinner */}
                    {day.id === 1 && day.pintxos && day.pintxos.length > 0 && (
                      <div className="pintxos-block">
                        <div className="pintxos-mode-toggle">
                          <button
                            className={`pintxos-mode-btn${pintxosMode === 'crawl' ? ' active' : ''}`}
                            onClick={() => setPintxos('crawl')}
                          >
                            🍢 Pintxos Crawl
                          </button>
                          <button
                            className={`pintxos-mode-btn${pintxosMode === 'dinner' ? ' active' : ''}`}
                            onClick={() => setPintxos('dinner')}
                          >
                            🍽️ Sit-Down Dinner
                          </button>
                        </div>

                        {pintxosMode === 'crawl' ? (
                          <>
                            <div className="pintxos-title">🍢 pintxos crawl plan</div>
                            {day.pintxos.map((p, i) => (
                              <div key={i} className="pintxos-item">
                                <div className="pintxos-time">{p.time}</div>
                                <div style={{ flex: 1 }}>
                                  <div className="pintxos-bar">{p.bar}</div>
                                  <div className="pintxos-order">{p.order}</div>
                                </div>
                                <span className="pintxos-icon">{p.icon}</span>
                              </div>
                            ))}
                            <div className="pintxos-note">
                              💡 Pay at each bar as you go · ~€25–35pp all in ·
                              Txakoli at each stop · Avoid Plaza de la Constitución bars
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="pintxos-title">🍽️ dinner options</div>
                            {day.dinnerAlt.map((r, i) => (
                              <div key={i} className="food-item" style={{ marginBottom: 6 }}>
                                <span className="food-icon">{r.icon}</span>
                                <div className="food-text">
                                  <div className="food-name">{r.name}</div>
                                  <div className="food-note">{r.note}</div>
                                  {r.maps && (
                                    <a href={r.maps} target="_blank" rel="noopener noreferrer" className="food-maps-link">
                                      📍 open in maps
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── INFO SCREEN ───────────────────────────────────────────────────
function InfoScreen() {
  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-eyebrow">the practicalities</div>
        <div className="screen-title">Trip <em>Info</em></div>
      </div>

      {/* Bookings */}
      <div className="info-section">
        <div className="info-section-title">✈️ bookings &amp; refs</div>
        <div className="screen-body" style={{ paddingTop: 0, gap: 9 }}>
          {BOOKINGS.map(b => (
            <div key={b.id} className={`booking-card${b.urgent ? ' urgent' : ''}`}>
              <span className="booking-icon">{b.icon}</span>
              <div className="booking-body">
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                  <span className="booking-title">{b.title}</span>
                  <span className="booking-ref">{b.ref}</span>
                </div>
                <div className="booking-line">{b.line1}</div>
                <div className="booking-line2">{b.line2}</div>
                {b.alert && <div className="booking-alert">{b.alert}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="info-section">
        <div className="info-section-title">💡 key tips</div>
        <div className="screen-body" style={{ paddingTop: 0 }}>
          <div className="tips-grid">
            {TIPS.map((t, i) => (
              <div key={i} className={`tip-chip ${t.urgency}`}>
                {t.urgency === 'critical' && <div className="tip-critical-badge">must do</div>}
                <div className="tip-chip-icon">{t.icon}</div>
                <div className="tip-chip-title">{t.title}</div>
                <div className="tip-chip-text">{t.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phrases */}
      <div className="info-section" style={{ paddingBottom: 32 }}>
        <div className="info-section-title">🗣️ spanish phrases</div>
        <div className="screen-body" style={{ paddingTop: 0, gap: 7 }}>
          {PHRASES.map((p, i) => (
            <div key={i} className="phrase-card">
              <div className="phrase-es">{p.es}</div>
              <div className="phrase-en">{p.en}</div>
              <div className="phrase-phonetic">{p.phonetic}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Tab config ────────────────────────────────────────────────────
const TABS = [
  { id: 'home',   icon: '🏠',  label: 'Home'   },
  { id: 'route',  icon: '🗺️', label: 'Route'  },
  { id: 'days',   icon: '📅',  label: 'Days'   },
  { id: 'qs',     icon: '✦',   label: '36 Qs'  },
  { id: 'info',   icon: '📋',  label: 'Info'   },
  { id: 'games',  icon: '🎮',  label: 'Games'  },
]

// ── Root App ──────────────────────────────────────────────────────
export default function App() {
  const [splash,      setSplash]      = useState(true)
  const [activeTab,   setActiveTab]   = useState('home')
  // Lifted state for persistence across tab switches
  const [currentStop, setCurrentStop] = useState(0)

  return (
    <div className="app">
      <FloatingItems />

      {splash && <Splash onEnter={() => setSplash(false)} />}

      {!splash && (
        <>
          <div className="app-desktop-layout">
            {/* Desktop sidebar */}
            <aside className="desktop-sidebar">
              <div className="desktop-logo">España ✈</div>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`desktop-nav-item${activeTab === tab.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="desktop-nav-icon">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
              <div style={{
                marginTop: 'auto', paddingTop: 20,
                fontFamily: 'var(--font-hand)', fontSize: '0.8rem',
                color: 'var(--muted)', lineHeight: 1.65,
              }}>
                🇸🇬 → 🇬🇧 → 🇪🇸<br />
                5–8 May 2026
              </div>
            </aside>

            {/* Main content — all screens always mounted for state persistence */}
            <main className="desktop-main">
              <div className="app-inner">
                <div className={`screen-pane${activeTab === 'home'  ? ' active' : ''}`}><HomeScreen /></div>
                <div className={`screen-pane${activeTab === 'route' ? ' active' : ''}`}>
                  <RouteScreen currentStop={currentStop} setCurrentStop={setCurrentStop} />
                </div>
                <div className={`screen-pane${activeTab === 'days'  ? ' active' : ''}`}><DaysScreen /></div>
                <div className={`screen-pane${activeTab === 'qs'    ? ' active' : ''}`}><Questions /></div>
                <div className={`screen-pane${activeTab === 'info'  ? ' active' : ''}`}><InfoScreen /></div>
                <div className={`screen-pane${activeTab === 'games' ? ' active' : ''}`}><Games /></div>
              </div>
            </main>
          </div>

          {/* Mobile bottom nav */}
          <nav className="bottom-nav" aria-label="Main navigation">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <span className="nav-tab-icon" aria-hidden="true">{tab.icon}</span>
                <span className="nav-tab-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </>
      )}
    </div>
  )
}
