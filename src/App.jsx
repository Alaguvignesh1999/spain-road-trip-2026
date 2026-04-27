import { useState, useEffect, useRef } from 'react'
import RouteMap   from './components/RouteMap.jsx'
import TaigoSVG   from './components/TaigoSVG.jsx'
import { STOPS, DAYS, TIPS } from './data/trip.js'

/* ── Countdown helper ─────────────────────────────────────────── */
function useCountdown(target) {
  const [diff, setDiff] = useState(target - Date.now())
  useEffect(() => {
    const t = setInterval(() => setDiff(target - Date.now()), 1000)
    return () => clearInterval(t)
  }, [target])
  const total = Math.max(0, diff)
  return {
    days:    Math.floor(total / 86400000),
    hours:   Math.floor((total % 86400000) / 3600000),
    minutes: Math.floor((total % 3600000)  / 60000),
    seconds: Math.floor((total % 60000)    / 1000),
  }
}

/* ── Nav ──────────────────────────────────────────────────────── */
function Nav() {
  return (
    <nav className="nav">
      <div className="nav-logo">🇪🇸 Northern Spain</div>
      <div className="nav-links">
        <a href="#journey">Journey</a>
        <a href="#days">Days</a>
        <a href="#pintxos">Pintxos</a>
        <a href="#tips">Tips</a>
      </div>
      <div className="nav-badge">5–8 May 2026</div>
    </nav>
  )
}

/* ── Hero ──────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero">
      <div className="hero-tag">🚗 Road Trip · May 2026</div>
      <h1 className="hero-title serif">
        4 Days in<br /><em>Northern Spain</em>
      </h1>
      <p className="hero-subtitle">
        Basque Country · Cantabria · Asturias<br />
        Two people, one pastel Taigo, endless pintxos.
      </p>
      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-num">4</div>
          <div className="hero-stat-label">Days</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">15</div>
          <div className="hero-stat-label">Stops</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">3</div>
          <div className="hero-stat-label">Regions</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">~600</div>
          <div className="hero-stat-label">km</div>
        </div>
      </div>
      <a href="#journey" className="hero-scroll">
        <div className="hero-scroll-arrow">↓</div>
        <span>scroll to explore</span>
      </a>
    </section>
  )
}

/* ── Journey (map + car + stop card) ─────────────────────────── */
function Journey() {
  const [current, setCurrent] = useState(0)
  const [prevDriver, setPrevDriver] = useState(null)
  const cardKey = useRef(0)

  const stop    = STOPS[current]
  const dayData = DAYS.find(d => d.id === stop.day)

  function goNext() {
    if (current < STOPS.length - 1) {
      setPrevDriver(stop.driver)
      cardKey.current++
      setCurrent(c => c + 1)
    }
  }
  function goPrev() {
    if (current > 0) {
      setPrevDriver(stop.driver)
      cardKey.current++
      setCurrent(c => c - 1)
    }
  }

  // Keyboard nav
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current])

  const driverChanged = prevDriver && prevDriver !== stop.driver

  return (
    <section className="journey" id="journey">
      <p className="section-label">Interactive Route</p>
      <h2 className="section-title serif">Follow the Journey</h2>
      <p className="section-sub">Click through all 15 stops — the Taigo drives itself (well, almost).</p>

      {/* Map */}
      <RouteMap currentStop={current} />

      {/* Stop navigation */}
      <div className="stop-nav">
        <button className="stop-nav-btn" onClick={goPrev} disabled={current === 0}>
          ← Prev
        </button>

        <div className="stop-nav-center">
          <div className="stop-counter mono">Stop {current + 1} of {STOPS.length}</div>
          <div className="stop-day-badge" style={{ background: dayData.colorLight, color: '#2C1810' }}>
            {dayData.emoji} {dayData.date} · {stop.region}
          </div>
          <div className="stop-dots">
            {STOPS.map((s, i) => (
              <button
                key={s.id}
                className={`stop-dot ${i === current ? 'active' : i < current ? 'visited' : ''}`}
                style={i === current ? { background: dayData.color } : {}}
                onClick={() => { cardKey.current++; setCurrent(i) }}
                title={s.name}
                aria-label={s.name}
              />
            ))}
          </div>
        </div>

        <button className="stop-nav-btn" onClick={goNext} disabled={current === STOPS.length - 1}>
          Next →
        </button>
      </div>

      {/* Car + Stop card */}
      <div className="stop-grid">
        {/* Car panel */}
        <div className="car-panel">
          <div className="taigo-enter" key={`car-${current}`}>
            <TaigoSVG driver={stop.driver} />
          </div>

          <div className="driver-label">
            <div className={`driver-avatar ${stop.driver === 'girl' ? 'active' : ''}`}>👧</div>
            <div className="driver-swap">
              {driverChanged
                ? <><span className="swap-arrow">⇄</span> driver swap!</>
                : stop.driver === 'girl' ? 'She\'s driving' : 'He\'s driving'}
            </div>
            <div className={`driver-avatar ${stop.driver === 'boy' ? 'active' : ''}`}>👦</div>
          </div>

          <div style={{ marginTop: 16, fontSize: '0.75rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
            Use ← → keys or the dots above<br />to navigate between stops
          </div>
        </div>

        {/* Stop detail card */}
        <div className="stop-card fade-in" key={`card-${cardKey.current}`}>
          <div className="stop-emoji">{stop.emoji}</div>
          <div className="stop-region">{stop.region} · Day {stop.day}</div>
          <h3 className="stop-name serif">{stop.name}</h3>
          <p className="stop-desc">{stop.desc}</p>
          <div className="stop-detail">💡 {stop.detail}</div>
          <a
            href={stop.gmaps}
            target="_blank"
            rel="noopener noreferrer"
            className="stop-gmaps-btn"
          >
            🗺️ Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}

/* ── Days Overview ─────────────────────────────────────────────── */
function DaysSection() {
  return (
    <section className="days-section" id="days">
      <div className="days-section-inner">
        <p className="section-label">The Full Plan</p>
        <h2 className="section-title serif">4 Days, 3 Regions</h2>
        <p className="section-sub">Hover any card to feel the depth.</p>

        <div className="days-grid">
          {DAYS.map(day => (
            <div className="day-card" key={day.id}>
              <div
                className="day-card-header"
                style={{ '--day-color': day.color }}
              >
                <div
                  className="day-card-header"
                  style={{
                    margin: -24,
                    marginBottom: 0,
                    padding: '24px 28px 20px',
                    borderBottom: '2px solid var(--border)',
                    borderTop: `4px solid ${day.color}`,
                  }}
                >
                  <div className="day-card-num" style={{ color: day.color }}>
                    Day {day.id} · {day.date}
                  </div>
                  <div className="day-card-title">{day.emoji} {day.title}</div>
                  <div className="day-card-sub">{day.subtitle}</div>
                  <div className="day-card-meta">
                    <span className="day-meta-tag">🚗 {day.drive}</span>
                    <span className="day-meta-tag">📍 {day.region}</span>
                  </div>
                </div>
              </div>

              <div className="day-card-body">
                <ul className="day-stops-list">
                  {STOPS.filter(s => s.day === day.id).map(s => (
                    <li className="day-stop-item" key={s.id}>
                      <span className="day-stop-icon">{s.emoji}</span>
                      <span>{s.name}</span>
                    </li>
                  ))}
                </ul>

                <div className="day-hotel">
                  <span className="day-hotel-icon">🏨</span>
                  <div>
                    <strong>{day.hotel.name}</strong><br />
                    <span style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>
                      {day.hotel.area} · Check-in {day.hotel.checkin}
                      {day.hotel.note && <><br /><em style={{ color: 'var(--terracotta)' }}>⚠️ {day.hotel.note}</em></>}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Pintxos Crawl (Day 1 highlight) ─────────────────────────── */
function PintxosSection() {
  const day1 = DAYS.find(d => d.id === 1)
  return (
    <section className="pintxos-section" id="pintxos">
      <div className="pintxos-inner">
        <p className="section-label">Day 1 Evening · San Sebastián</p>
        <h2 className="section-title serif">The Pintxos Crawl</h2>
        <p className="section-sub">
          The greatest concentration of extraordinary food per square metre on earth.
          Follow this route in order — the timing matters.
        </p>

        <div className="pintxos-timeline">
          {day1.pintxos.map((item, i) => (
            <div className="pintxos-item" key={i}>
              <div className="pintxos-time">{item.time}</div>
              <div className="pintxos-card">
                <div className="pintxos-bar">{item.bar}</div>
                <div className="pintxos-order">{item.order}</div>
              </div>
              <div className="pintxos-icon">{item.icon}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 36,
          background: 'var(--cream-mid)', borderRadius: 16,
          border: '2px solid var(--border)',
          padding: '20px 24px', fontSize: '0.88rem',
          color: 'var(--text-mid)', lineHeight: 1.7,
        }}>
          <strong style={{ color: 'var(--terracotta)' }}>💡 Pintxos Rules:</strong>{' '}
          Pay at each bar as you go. Stand at the bar — it's the way.
          Budget ~€25–35pp all in. Txakoli wine at each stop.
          Avoid Plaza de la Constitución bars — tourist pricing, lower quality.
        </div>
      </div>
    </section>
  )
}

/* ── Tips ──────────────────────────────────────────────────────── */
function TipsSection() {
  return (
    <section className="tips-section" id="tips">
      <div className="tips-inner">
        <p className="section-label">Field Notes</p>
        <h2 className="section-title serif">Don't Forget These</h2>
        <p className="section-sub">The things that make or break the trip.</p>

        <div className="tips-grid">
          {TIPS.map((tip, i) => (
            <div className={`tip-card ${tip.urgency}`} key={i}>
              {tip.urgency === 'critical' && (
                <div className="tip-urgent-badge">Critical</div>
              )}
              <div className="tip-icon">{tip.icon}</div>
              <div className="tip-title">{tip.title}</div>
              <div className="tip-text">{tip.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Logistics ─────────────────────────────────────────────────── */
function Logistics() {
  return (
    <section className="logistics">
      <div className="logistics-inner">
        <p className="section-label">Logistics</p>
        <h2 className="section-title serif">The Essentials</h2>

        <div className="logistics-grid">
          <div className="logistics-card">
            <div className="logistics-card-icon">✈️</div>
            <div className="logistics-card-title">Flights</div>
            <div className="logistics-card-sub">Ryanair STN ↔ SDR</div>
            <div className="logistics-detail">
              <strong>Out:</strong> RK2612 · LTN → SDR<br />
              Tue 5 May · dep 07:00 · arr 10:00<br />
              Booking <span className="mono">K1L7KJ</span><br /><br />
              <strong>Return:</strong> FR2613 · SDR → STN<br />
              Fri 8 May · dep 21:40 · arr 22:30<br />
              Booking <span className="mono">V3WLPG</span>
            </div>
          </div>

          <div className="logistics-card">
            <div className="logistics-card-icon">🚗</div>
            <div className="logistics-card-title">Car Rental</div>
            <div className="logistics-card-sub">Avis · Santander Airport</div>
            <div className="logistics-detail">
              <strong>Vehicle:</strong> VW Taigo (Automatic)<br />
              <strong>Pick-up:</strong> Tue 5 May · 10:30<br />
              <strong>Drop-off:</strong> Fri 8 May · 20:00<br />
              Booking <span className="mono">759481618</span><br /><br />
              ⚠️ Fill the tank before return
            </div>
          </div>

          <div className="logistics-card">
            <div className="logistics-card-icon">🏨</div>
            <div className="logistics-card-title">3 Hotels</div>
            <div className="logistics-card-sub">All confirmed ✅</div>
            <div className="logistics-detail">
              <strong>Night 1:</strong> Talo Urban Rooms, San Sebastián<br />
              <strong>Night 2:</strong> Chateau La Roca, Sancibrián<br />
              <em style={{ fontSize: '0.76rem', color: 'var(--terracotta)' }}>No dinner — eat in Santander</em><br />
              <strong>Night 3:</strong> Hotel Cerro La Nina, Beceña<br />
              <em style={{ fontSize: '0.76rem', color: 'var(--terracotta)' }}>Checkout 11:00 FIRM</em>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Footer with countdown ─────────────────────────────────────── */
function Footer() {
  const departure = new Date('2026-05-05T07:00:00').getTime()
  const { days, hours, minutes, seconds } = useCountdown(departure)
  const gone = Date.now() >= departure

  return (
    <footer className="footer">
      <div className="footer-title serif">🇪🇸 Bon Voyage</div>
      <p style={{ fontSize: '0.9rem', marginTop: 8 }}>Santander · San Sebastián · Bilbao · Picos de Europa · Asturias</p>

      {!gone && (
        <>
          <p style={{ fontSize: '0.8rem', marginTop: 24, marginBottom: 4, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Departing in
          </p>
          <div className="countdown">
            <div className="count-block">
              <div className="count-num serif">{days}</div>
              <div className="count-label">Days</div>
            </div>
            <div className="count-block" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '2rem', alignSelf: 'flex-start', paddingTop: 4 }}>:</div>
            <div className="count-block">
              <div className="count-num serif">{String(hours).padStart(2, '0')}</div>
              <div className="count-label">Hours</div>
            </div>
            <div className="count-block" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '2rem', alignSelf: 'flex-start', paddingTop: 4 }}>:</div>
            <div className="count-block">
              <div className="count-num serif">{String(minutes).padStart(2, '0')}</div>
              <div className="count-label">Mins</div>
            </div>
            <div className="count-block" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '2rem', alignSelf: 'flex-start', paddingTop: 4 }}>:</div>
            <div className="count-block">
              <div className="count-num serif">{String(seconds).padStart(2, '0')}</div>
              <div className="count-label">Secs</div>
            </div>
          </div>
        </>
      )}
      {gone && (
        <p style={{ fontSize: '1.1rem', marginTop: 24, color: '#FFD580' }}>¡Buen viaje! 🎉</p>
      )}

      <div className="footer-divider" />
      <p className="footer-note">Built with ♥ for the May 2026 road trip · SQ314 → RK2612 → FR2613 → SQ317</p>
    </footer>
  )
}

/* ── Root App ──────────────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Journey />
      <DaysSection />
      <PintxosSection />
      <TipsSection />
      <Logistics />
      <Footer />
    </>
  )
}
