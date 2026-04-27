import { useState, useEffect, useRef } from 'react'
import { QUESTIONS } from '../data/trip.js'

export default function Questions() {
  const sets = QUESTIONS.sets
  const [setIdx, setSetIdx]       = useState(0)
  const [qIdx, setQIdx]           = useState(0)
  const [flipped, setFlipped]     = useState(false)
  const [timerSec, setTimerSec]   = useState(240)
  const [timerOn, setTimerOn]     = useState(false)
  const intervalRef               = useRef(null)

  const currentSet = sets[setIdx]
  const currentQ   = currentSet.questions[qIdx]
  const hasTimer   = !!currentQ.timer

  // reset flip + timer when question changes
  useEffect(() => {
    setFlipped(false)
    setTimerSec(240)
    setTimerOn(false)
    clearInterval(intervalRef.current)
  }, [setIdx, qIdx])

  // ticker
  useEffect(() => {
    clearInterval(intervalRef.current)
    if (timerOn) {
      intervalRef.current = setInterval(() => {
        setTimerSec(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setTimerOn(false)
            return 0
          }
          return s - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [timerOn])

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const switchSet = i => { setSetIdx(i); setQIdx(0) }
  const goPrev    = () => { if (qIdx > 0) setQIdx(q => q - 1) }
  const goNext    = () => { if (qIdx < currentSet.questions.length - 1) setQIdx(q => q + 1) }

  // percentage through all 36 questions
  const globalIdx = sets.slice(0, setIdx).reduce((a, s) => a + s.questions.length, 0) + qIdx
  const pct = Math.round((globalIdx / 36) * 100)

  return (
    <div className="screen q-screen">
      {/* Header */}
      <div className="q-header">
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
        }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: 2, height: 2,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.5)',
              left: `${(i * 5.1 + 3) % 95}%`,
              top:  `${(i * 7.3 + 5) % 88}%`,
              animation: `twinkle ${1.5 + (i % 3) * 0.6}s ${(i * 0.3) % 3}s ease-in-out infinite`,
            }} />
          ))}
        </div>
        <div className="q-header-title">
          The 36 Questions<br />
          <em style={{ fontStyle: 'italic', color: '#C8B8F0', fontSize: '82%' }}>
            ask each other. be honest. go deep.
          </em>
        </div>
        <div className="q-header-sub">✦ one question at a time ✦</div>

        {/* Global progress bar */}
        <div style={{
          marginTop: 16, height: 4, borderRadius: 4,
          background: 'rgba(255,255,255,0.15)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #F4C0D0, #FFD580)',
            borderRadius: 4,
            transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>
        <div style={{
          fontFamily: 'var(--font-hand)', fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.5)', marginTop: 5, textAlign: 'right',
        }}>
          {globalIdx + 1} / 36
        </div>
      </div>

      {/* Set selector tabs */}
      <div className="q-set-tabs">
        {sets.map((set, i) => (
          <button
            key={set.id}
            className={`q-set-tab${setIdx === i ? ' active' : ''}`}
            style={setIdx === i ? { borderColor: set.color, background: set.color + '15' } : {}}
            onClick={() => switchSet(i)}
          >
            <div className="q-set-tab-title" style={setIdx === i ? { color: set.color } : {}}>
              {set.emoji} {set.title}
            </div>
            <div className="q-set-tab-sub">{set.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Card area */}
      <div className="q-card-area">
        <div className="q-progress">
          {currentSet.emoji} {currentSet.title} · {qIdx + 1} of {currentSet.questions.length}
        </div>

        {/* Flip card */}
        <div
          className={`q-flipper${flipped ? ' flipped' : ''}`}
          onClick={() => setFlipped(f => !f)}
          role="button"
          aria-label="Flip card to reveal question"
        >
          <div className="q-card-inner">
            {/* Front — number */}
            <div
              className="q-face"
              style={{
                background: `linear-gradient(145deg, ${currentSet.color} 0%, #1A0912 100%)`,
              }}
            >
              <div className="q-face-num">{currentQ.n}</div>
              <div className="q-face-set">{currentSet.emoji} {currentSet.title}</div>
              {currentQ.timer && (
                <div style={{
                  fontFamily: 'var(--font-hand)', fontSize: '0.82rem',
                  color: 'rgba(255,255,255,0.6)', marginBottom: 8,
                }}>
                  ⏱ 4-minute timer included
                </div>
              )}
              <div className="q-face-tap">tap to reveal ✦</div>
            </div>

            {/* Back — question text */}
            <div className="q-back">
              <div className="q-back-question">
                {currentQ.text}
              </div>
              <div className="q-back-tap">tap to flip back</div>
            </div>
          </div>
        </div>

        {/* Q11 — 4-minute story timer */}
        {hasTimer && flipped && (
          <div className="q-timer" onClick={e => e.stopPropagation()}>
            <div className="q-timer-label">⏱ tell your life story — 4 minutes</div>
            <div
              className="q-timer-display"
              style={{ color: timerSec < 30 ? '#E83030' : timerSec < 60 ? 'var(--gold)' : undefined }}
            >
              {fmt(timerSec)}
            </div>
            {timerSec === 0 && (
              <div style={{
                fontFamily: 'var(--font-hand)', fontSize: '1rem',
                color: 'var(--rose)', marginBottom: 6,
              }}>
                ✨ time's up!
              </div>
            )}
            <div className="q-timer-btns">
              <button
                className="q-timer-btn start"
                onClick={() => setTimerOn(r => !r)}
                disabled={timerSec === 0}
              >
                {timerOn ? '⏸ Pause' : '▶ Start'}
              </button>
              <button
                className="q-timer-btn reset"
                onClick={() => { setTimerOn(false); setTimerSec(240) }}
              >
                ↺ Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation row */}
      <div className="q-nav-row">
        <button
          className="q-nav-btn"
          onClick={goPrev}
          disabled={qIdx === 0 && setIdx === 0}
        >
          {qIdx === 0 && setIdx > 0 ? `← ${sets[setIdx - 1].emoji} Set ${setIdx}` : '← Prev'}
        </button>
        <button
          className="q-nav-btn"
          onClick={() => {
            if (qIdx < currentSet.questions.length - 1) {
              goNext()
            } else if (setIdx < sets.length - 1) {
              switchSet(setIdx + 1)
            }
          }}
          disabled={qIdx === currentSet.questions.length - 1 && setIdx === sets.length - 1}
        >
          {qIdx === currentSet.questions.length - 1 && setIdx < sets.length - 1
            ? `${sets[setIdx + 1].emoji} Set ${setIdx + 2} →`
            : 'Next →'}
        </button>
      </div>
      <div className="q-tap-hint">tap the card to reveal · tap again to flip back</div>

      {/* Completion message */}
      {globalIdx === 35 && flipped && (
        <div style={{
          margin: '0 20px 20px',
          background: 'linear-gradient(135deg, var(--petal-deep), var(--gold-pale))',
          border: '1px solid var(--gold)',
          borderRadius: 20, padding: '20px 20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>✦</div>
          <div style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.2rem',
            fontWeight: 600, color: 'var(--ink)', marginBottom: 6,
          }}>
            All 36 questions complete ✦
          </div>
          <div style={{
            fontFamily: 'var(--font-hand)', fontSize: '1rem',
            color: 'var(--muted)', lineHeight: 1.6,
          }}>
            Based on Dr. Arthur Aron's research at SUNY Stony Brook — these questions create genuine closeness between two people. You made it through all 36.
          </div>
        </div>
      )}
    </div>
  )
}
