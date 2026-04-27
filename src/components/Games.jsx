import { useState, useEffect, useRef } from 'react'

// ─── GAME 1: Road Trip Bingo ─────────────────────────────────────
const BINGO_ITEMS = [
  'Red car 🚗','Church bell tower ⛪','Cow 🐄','Tunnel entrance 🕳️',
  'Cyclist 🚴','Tractor 🚜','Petrol station ⛽','Blue motorway sign 🔵',
  'Horse 🐴','Police car 🚓','Rainbow 🌈','Wind turbine 💨',
  'Vintage car 🏎️','Rest stop ☕','Bridge 🌉','Mountain peak ⛰️',
]
function BingoGame({ onBack }) {
  const [marked, setMarked] = useState(() => new Set())
  const [won, setWon]       = useState(false)
  const toggle = i => {
    setMarked(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      // Check win: row, col, or diagonal in 4×4
      const check = s => {
        for (let r = 0; r < 4; r++) if ([0,1,2,3].every(c => s.has(r*4+c))) return true
        for (let c = 0; c < 4; c++) if ([0,1,2,3].every(r => s.has(r*4+c))) return true
        if ([0,5,10,15].every(x => s.has(x))) return true
        if ([3,6,9,12].every(x => s.has(x))) return true
        return false
      }
      if (check(next)) setWon(true)
      return next
    })
  }
  return (
    <div className="game-view">
      <button className="game-back-btn" onClick={onBack}>← Games</button>
      <div className="game-title">🎯 Road Trip Bingo</div>
      <div className="game-subtitle">Spot these during the drive — get 4 in a row!</div>
      {won && (
        <div className="game-win-banner">🎉 BINGO! You spotted a line!</div>
      )}
      <div className="bingo-grid">
        {BINGO_ITEMS.map((item, i) => (
          <button key={i}
            className={`bingo-cell${marked.has(i) ? ' marked' : ''}`}
            onClick={() => toggle(i)}
          >
            {item}
          </button>
        ))}
      </div>
      <button className="game-reset-btn" onClick={() => { setMarked(new Set()); setWon(false) }}>
        ↺ New Card
      </button>
    </div>
  )
}

// ─── GAME 2: Spain Trivia ────────────────────────────────────────
const TRIVIA = [
  { q: 'Gaztelugatxe island appeared in which TV show?',
    opts: ['The Crown', 'Game of Thrones', 'Narcos', 'Peaky Blinders'], ans: 1 },
  { q: 'How many steps lead up to Gaztelugatxe hermitage?',
    opts: ['100', '175', '241', '310'], ans: 2 },
  { q: 'What material covers the exterior of Bilbao\'s Guggenheim?',
    opts: ['Marble', 'Copper', 'Titanium', 'Aluminium'], ans: 2 },
  { q: 'What is txakoli?',
    opts: ['A type of sausage', 'A fizzy dry white wine', 'A pintxo topping', 'A dessert'], ans: 1 },
  { q: 'What is "escanciado"?',
    opts: ['A Basque greeting', 'Pouring cider from height into a small glass', 'A type of cheese', 'A folk dance'], ans: 1 },
  { q: 'Which mountain cable car goes up 753 metres in 4 minutes on Day 3?',
    opts: ['Covadonga', 'Fuente Dé', 'Bilbao', 'Picos Alta'], ans: 1 },
  { q: 'What is a cachopo?',
    opts: ['A Galician stew', 'An Asturian drink', 'Two veal fillets stuffed with ham and cheese', 'A Basque dessert'], ans: 2 },
  { q: 'What language (besides Spanish) is spoken in the Basque Country?',
    opts: ['Catalan', 'Galician', 'Basque (Euskara)', 'Occitan'], ans: 2 },
  { q: 'What is special about Santillana del Mar?',
    opts: ['It\'s by the sea', 'No cars — all medieval cobblestones', 'It has a famous castle', 'It\'s Europe\'s oldest town'], ans: 1 },
  { q: 'What is the Queso Cabrales?',
    opts: ['A soft fresh cheese', 'A blue cheese aged in mountain caves', 'A Basque goat cheese', 'A mild Cantabrian cheddar'], ans: 1 },
  { q: 'Jeff Koons\' giant sculpture outside the Guggenheim is shaped like…?',
    opts: ['A dog covered in flowers', 'A large spider', 'A tulip vase', 'A chrome rabbit'], ans: 0 },
  { q: 'What are "pintxos" exactly?',
    opts: ['A type of wine', 'Seafood tapas only', 'Small snacks served on bread, often with a toothpick', 'A fried dish'], ans: 2 },
]
function TriviaGame({ onBack }) {
  const [qIdx, setQIdx]   = useState(0)
  const [scores, setScores] = useState([0, 0])
  const [chosen, setChosen] = useState(null)
  const [done, setDone]   = useState(false)
  const [whose, setWhose] = useState(0) // 0=P1, 1=P2

  const q = TRIVIA[qIdx]

  const pick = i => {
    if (chosen !== null) return
    setChosen(i)
    if (i === q.ans) {
      setScores(s => { const n = [...s]; n[whose]++; return n })
    }
  }
  const next = () => {
    if (qIdx === TRIVIA.length - 1) { setDone(true); return }
    setQIdx(x => x + 1)
    setChosen(null)
    setWhose(w => 1 - w)
  }
  const restart = () => { setQIdx(0); setScores([0,0]); setChosen(null); setDone(false); setWhose(0) }

  if (done) return (
    <div className="game-view">
      <button className="game-back-btn" onClick={onBack}>← Games</button>
      <div className="game-title">🧠 Spain Trivia — Done!</div>
      <div className="trivia-scores">
        <div className={`trivia-score-card${scores[0] > scores[1] ? ' winner' : ''}`}>
          <div className="trivia-score-label">👨 Player 1</div>
          <div className="trivia-score-num">{scores[0]}</div>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--muted)' }}>vs</div>
        <div className={`trivia-score-card${scores[1] > scores[0] ? ' winner' : ''}`}>
          <div className="trivia-score-label">👩 Player 2</div>
          <div className="trivia-score-num">{scores[1]}</div>
        </div>
      </div>
      <div style={{ textAlign: 'center', fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: 'var(--muted)', marginBottom: 20 }}>
        {scores[0] === scores[1] ? "It's a tie! 🤝" : scores[0] > scores[1] ? '👨 Player 1 wins! 🎉' : '👩 Player 2 wins! 🎉'}
      </div>
      <button className="game-reset-btn" onClick={restart}>Play Again</button>
    </div>
  )

  return (
    <div className="game-view">
      <button className="game-back-btn" onClick={onBack}>← Games</button>
      <div className="game-title">🧠 Spain Trivia</div>
      <div className="trivia-scores" style={{ marginBottom: 12 }}>
        <div className={`trivia-score-card${whose === 0 ? ' active' : ''}`}>
          <div className="trivia-score-label">👨 P1</div>
          <div className="trivia-score-num">{scores[0]}</div>
        </div>
        <div style={{ fontFamily: 'var(--font-hand)', fontSize: '0.9rem', color: 'var(--muted)', alignSelf: 'center' }}>
          Q{qIdx + 1}/{TRIVIA.length}
        </div>
        <div className={`trivia-score-card${whose === 1 ? ' active' : ''}`}>
          <div className="trivia-score-label">👩 P2</div>
          <div className="trivia-score-num">{scores[1]}</div>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-hand)', fontSize: '0.9rem', color: 'var(--lilac)', textAlign: 'center', marginBottom: 10 }}>
        {whose === 0 ? '👨 Player 1\'s turn' : '👩 Player 2\'s turn'}
      </div>
      <div className="trivia-question">{q.q}</div>
      <div className="trivia-opts">
        {q.opts.map((o, i) => (
          <button key={i}
            className={`trivia-opt${chosen !== null ? (i === q.ans ? ' correct' : i === chosen ? ' wrong' : '') : ''}`}
            onClick={() => pick(i)}
          >
            {String.fromCharCode(65 + i)}. {o}
          </button>
        ))}
      </div>
      {chosen !== null && (
        <button className="game-reset-btn" style={{ marginTop: 12 }} onClick={next}>
          {qIdx === TRIVIA.length - 1 ? 'See Results →' : 'Next Question →'}
        </button>
      )}
    </div>
  )
}

// ─── GAME 3: Would You Rather ────────────────────────────────────
const WYR = [
  ['Pintxos crawl for 3 hours 🍢', 'One exceptional sit-down dinner 🍽️'],
  ['Window seat ✈️', 'Aisle seat 🚶'],
  ['Eat a mystery tapas dish 🤔', 'Stick to what you know 😌'],
  ['Drive the mountain roads 🏔️', 'Cruise the coastal highway 🌊'],
  ['Visit one famous landmark 🏛️', 'Explore a random unknown village 🗺️'],
  ['Wild swim in the Cantabrian Sea 🌊', 'Hike up to mountain views ⛰️'],
  ['Only eat tapas-style forever 🍢', 'Only eat one big meal a day 🍖'],
  ['Learn the local language 🗣️', 'Get by with smiles and pointing 😄'],
  ['Sleep in a luxury hotel 🏨', 'Stay in a cool hostel 🛏️'],
  ['Drive the whole trip 🚗', 'Be the navigator the whole trip 🗺️'],
  ['Visit every museum 🎨', 'Skip museums, only food + nature 🌿'],
  ['Travel with 0 plans 🎲', 'Have a fully planned itinerary 📋'],
  ['Cachopo (giant Asturian steak) 🥩', 'Burnt Basque cheesecake 🍮'],
  ['Cable car 753m up the mountain 🚡', 'Hike all the way down 🥾'],
  ['Speak Spanish with locals 🇪🇸', 'Let someone else handle it 🙈'],
  ['Buy all the local food to take home 🧀', 'Just enjoy it there, no luggage drama 😂'],
  ['Morning person on this trip ☀️', 'Night owl for pintxos & late dinners 🌙'],
  ['Siesta every afternoon 😴', 'Power through with more coffee ☕'],
  ['Try txakoli wine 🍾', 'Stick to the local cider 🍺'],
  ['Take 0 photos and just be present 📵', 'Document everything obsessively 📸'],
]
function WYRGame({ onBack }) {
  const [idx, setIdx]     = useState(0)
  const [p1pick, setP1]   = useState(null)
  const [p2pick, setP2]   = useState(null)
  const [phase, setPhase] = useState('p1') // 'p1' | 'p2' | 'reveal'
  const [matches, setMatches] = useState(0)
  const [total, setTotal]    = useState(0)

  const q = WYR[idx]

  const pickP1 = i => { setP1(i); setPhase('p2') }
  const pickP2 = i => {
    setP2(i); setPhase('reveal')
    setTotal(t => t + 1)
    if (i === p1pick) setMatches(m => m + 1)
  }
  const next = () => {
    setIdx(x => (x + 1) % WYR.length)
    setP1(null); setP2(null); setPhase('p1')
  }

  return (
    <div className="game-view">
      <button className="game-back-btn" onClick={onBack}>← Games</button>
      <div className="game-title">😄 Would You Rather</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 14 }}>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-hand)', fontSize: '0.9rem', color: 'var(--muted)' }}>
          ✓ {matches} matches / {total} rounds
        </div>
        <div style={{ fontFamily: 'var(--font-hand)', fontSize: '0.85rem', color: 'var(--muted)' }}>
          Q{idx + 1}/{WYR.length}
        </div>
      </div>

      {phase !== 'reveal' && (
        <div className="wyr-phase-label">
          {phase === 'p1' ? '👨 Player 1 — choose one (cover from partner!)' : '👩 Player 2 — your turn!'}
        </div>
      )}

      {phase === 'p1' && (
        <div className="wyr-opts">
          {q.map((o, i) => <button key={i} className="wyr-opt" onClick={() => pickP1(i)}>{o}</button>)}
        </div>
      )}
      {phase === 'p2' && (
        <>
          <div className="wyr-hint">Player 1 has chosen — now Player 2 picks!</div>
          <div className="wyr-opts">
            {q.map((o, i) => <button key={i} className="wyr-opt" onClick={() => pickP2(i)}>{o}</button>)}
          </div>
        </>
      )}
      {phase === 'reveal' && (
        <>
          <div className={`wyr-result ${p1pick === p2pick ? 'match' : 'diff'}`}>
            {p1pick === p2pick ? '🎉 You both chose the same!' : '🤔 Different choices!'}
          </div>
          <div className="wyr-reveal-grid">
            <div className="wyr-reveal-card">
              <div className="wyr-reveal-who">👨 P1</div>
              <div className="wyr-reveal-ans">{q[p1pick]}</div>
            </div>
            <div className="wyr-reveal-card">
              <div className="wyr-reveal-who">👩 P2</div>
              <div className="wyr-reveal-ans">{q[p2pick]}</div>
            </div>
          </div>
          <button className="game-reset-btn" onClick={next}>Next →</button>
        </>
      )}
    </div>
  )
}

// ─── GAME 4: Truth or Dare (Travel Edition) ──────────────────────
const TRUTHS = [
  "What's one thing you're secretly nervous about on this trip?",
  "Rate your sense of direction 1–10, honestly.",
  "What's the strangest thing you've eaten while travelling?",
  "What's a destination you'd never want to go back to, and why?",
  "What's your worst travel habit?",
  "Describe a travel disaster you've never told anyone about.",
  "If you could only visit one country for the rest of your life, which would it be?",
  "What's a travel expectation you had that completely failed?",
  "How do you really feel about travelling light?",
  "What country do you think you'd move to if you had to leave Singapore?",
  "What's the most embarrassing thing that's happened to you on a plane?",
  "What's a food you pretend to like but actually hate?",
]
const DARES = [
  "Say a full sentence in Spanish to the next person you encounter.",
  "Let your travel partner pick your entire next meal with no complaints.",
  "Take the most dramatic possible selfie right now and save it.",
  "Do your best impression of the GPS navigation voice giving directions.",
  "Text someone at home describing your trip entirely in food emojis.",
  "Describe the view in front of you as if you were a travel writer.",
  "Try to haggle or negotiate something in the next shop you enter.",
  "Take a photo that could genuinely fool someone into thinking you're famous.",
  "Re-enact what the GPS would say if it had opinions about your route.",
  "Spend 2 minutes describing your perfect holiday entirely in Spanish words you know.",
  "Do the most tourist-y pose at the next landmark you visit.",
  "Order something at the next café using only hand gestures and emojis.",
]
function TruthDareGame({ onBack }) {
  const [mode, setMode]     = useState(null)   // 'truth' | 'dare' | null
  const [card, setCard]     = useState(null)
  const [flipped, setFlipped] = useState(false)

  const draw = m => {
    const list = m === 'truth' ? TRUTHS : DARES
    setCard(list[Math.floor(Math.random() * list.length)])
    setMode(m)
    setFlipped(false)
  }

  return (
    <div className="game-view">
      <button className="game-back-btn" onClick={onBack}>← Games</button>
      <div className="game-title">🎲 Truth or Dare</div>
      <div className="game-subtitle">Travel edition — decide together, then draw!</div>

      <div className="td-btns">
        <button className="td-truth-btn" onClick={() => draw('truth')}>🤔 Truth</button>
        <button className="td-dare-btn"  onClick={() => draw('dare')}>😈 Dare</button>
      </div>

      {card && (
        <div className={`td-card ${mode}`} onClick={() => setFlipped(f => !f)}>
          {!flipped ? (
            <div className="td-card-front">
              <div className="td-card-type">{mode === 'truth' ? '🤔 Truth' : '😈 Dare'}</div>
              <div className="td-card-tap">tap to reveal</div>
            </div>
          ) : (
            <div className="td-card-back">{card}</div>
          )}
        </div>
      )}

      {card && flipped && (
        <button className="game-reset-btn" style={{ marginTop: 14 }}
          onClick={() => { setCard(null); setMode(null); setFlipped(false) }}>
          Done ✓
        </button>
      )}
    </div>
  )
}

// ─── GAME 5: Emoji Decode ─────────────────────────────────────────
const EMOJI_PUZZLES = [
  { emojis: '⛪ 🪨 241 🔔', answer: 'Gaztelugatxe — 241 steps, ring the bell 3x at the top' },
  { emojis: '🎨 🦴 🌸 🐕', answer: 'Guggenheim Bilbao — with Jeff Koons\' giant flower dog' },
  { emojis: '🚡 🏔️ 🧊 753m', answer: 'Fuente Dé cable car — 753m up in 4 minutes' },
  { emojis: '🦀 🍷 🌊 🍢', answer: 'Pintxos bar in the Basque Country' },
  { emojis: '🧀 🌄 🐄 🕳️', answer: 'Queso Cabrales — blue cheese aged in mountain caves' },
  { emojis: '🥚 📝 18:50 ⚠️', answer: 'Bar Nestor — put your name on the tortilla list at 18:50 SHARP' },
  { emojis: '🏰 🌿 🪨 🌙', answer: 'Chateau La Roca — your Night 2 stay' },
  { emojis: '🍺 🎋 💧 📐', answer: 'Asturian sidra — escanciado (poured from height)' },
  { emojis: '🏘️ 🐎 🚫🚗', answer: 'Santillana del Mar — no cars, all medieval cobbles' },
  { emojis: '⛪ 🩷 🌿 ⭐', answer: 'Covadonga basilica — pink neo-Romanesque in the mountains' },
  { emojis: '🦑 🐟 🧂 Cantabria', answer: 'Rabas + anchoas de Santoña — Cantabrian seafood' },
  { emojis: '🗺️ 🪨 💀 📺', answer: 'Zumaia flysch — 60M years of geology, seen on TV (Game of Thrones)' },
]
function EmojiGame({ onBack }) {
  const [idx, setIdx]       = useState(0)
  const [revealed, setRev]  = useState(false)
  const [score, setScore]   = useState(0)
  const [total, setTotal]   = useState(0)

  const q = EMOJI_PUZZLES[idx]

  const next = got => {
    if (got) setScore(s => s + 1)
    setTotal(t => t + 1)
    setIdx(x => (x + 1) % EMOJI_PUZZLES.length)
    setRev(false)
  }

  return (
    <div className="game-view">
      <button className="game-back-btn" onClick={onBack}>← Games</button>
      <div className="game-title">🎭 Emoji Decode</div>
      <div className="game-subtitle">Guess the place, food, or moment from the emojis!</div>
      <div style={{ textAlign: 'center', fontFamily: 'var(--font-hand)', color: 'var(--muted)', marginBottom: 14 }}>
        ✓ {score} / {total} correct · Puzzle {idx + 1}/{EMOJI_PUZZLES.length}
      </div>

      <div className="emoji-puzzle-card">
        <div className="emoji-puzzle-emojis">{q.emojis}</div>
        {!revealed
          ? <button className="game-reset-btn" style={{ marginTop: 16 }} onClick={() => setRev(true)}>Reveal Answer</button>
          : (
            <>
              <div className="emoji-puzzle-answer">{q.answer}</div>
              <div className="emoji-got-it-btns">
                <button className="emoji-got-btn yes" onClick={() => next(true)}>✓ Got it!</button>
                <button className="emoji-got-btn no"  onClick={() => next(false)}>✗ Nope</button>
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}

// ─── Games Hub ────────────────────────────────────────────────────
const GAME_LIST = [
  { id: 'bingo',  emoji: '🎯', title: 'Road Trip Bingo',     sub: 'Spot things during the drive',      players: '1–2 players' },
  { id: 'trivia', emoji: '🧠', title: 'Spain Trivia',        sub: 'How well do you know the north?',   players: '1 vs 1' },
  { id: 'wyr',    emoji: '😄', title: 'Would You Rather',    sub: 'Travel & food edition — do you match?', players: '2 players' },
  { id: 'td',     emoji: '🎲', title: 'Truth or Dare',       sub: 'Travel edition — be honest!',       players: '2 players' },
  { id: 'emoji',  emoji: '🎭', title: 'Emoji Decode',        sub: 'Guess the Spain moment from emojis', players: '1–2 players' },
]

export default function Games() {
  const [active, setActive] = useState(null)

  if (active === 'bingo')  return <BingoGame  onBack={() => setActive(null)} />
  if (active === 'trivia') return <TriviaGame onBack={() => setActive(null)} />
  if (active === 'wyr')    return <WYRGame    onBack={() => setActive(null)} />
  if (active === 'td')     return <TruthDareGame onBack={() => setActive(null)} />
  if (active === 'emoji')  return <EmojiGame  onBack={() => setActive(null)} />

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-eyebrow">entertainment</div>
        <div className="screen-title">Mini <em>Games</em></div>
      </div>
      <div className="screen-body">
        <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: 'var(--muted)', marginBottom: 4 }}>
          Play on one phone together — or compete head to head ✦
        </div>
        <div className="games-grid">
          {GAME_LIST.map(g => (
            <button key={g.id} className="game-card" onClick={() => setActive(g.id)}>
              <div className="game-card-emoji">{g.emoji}</div>
              <div className="game-card-title">{g.title}</div>
              <div className="game-card-sub">{g.sub}</div>
              <div className="game-card-players">{g.players}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
