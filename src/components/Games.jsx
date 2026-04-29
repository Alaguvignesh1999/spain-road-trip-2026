import { useEffect, useMemo, useRef, useState } from 'react'

const BINGO_ITEMS = [
  { icon: '🚗', text: 'Red car' },
  { icon: '🔔', text: 'Church bell tower' },
  { icon: '🐄', text: 'Cow' },
  { icon: '🕳️', text: 'Tunnel entrance' },
  { icon: '🚴', text: 'Cyclist' },
  { icon: '🚜', text: 'Tractor' },
  { icon: '⛽', text: 'Petrol station' },
  { icon: '🔵', text: 'Blue motorway sign' },
  { icon: '🐴', text: 'Horse' },
  { icon: '🚓', text: 'Police car' },
  { icon: '🌈', text: 'Rainbow' },
  { icon: '💨', text: 'Wind turbine' },
  { icon: '🏎️', text: 'Vintage car' },
  { icon: '☕', text: 'Rest stop' },
  { icon: '🌉', text: 'Bridge' },
  { icon: '⛰️', text: 'Mountain peak' },
]

const TRIVIA = [
  { q: 'Gaztelugatxe island appeared in which TV show?', opts: ['The Crown', 'Game of Thrones', 'Narcos', 'Peaky Blinders'], ans: 1 },
  { q: 'How many steps lead up to Gaztelugatxe hermitage?', opts: ['100', '175', '241', '310'], ans: 2 },
  { q: "What material covers the exterior of Bilbao's Guggenheim?", opts: ['Marble', 'Copper', 'Titanium', 'Aluminium'], ans: 2 },
  { q: 'What is txakoli?', opts: ['A type of sausage', 'A fizzy dry white wine', 'A pintxo topping', 'A dessert'], ans: 1 },
  { q: 'What is escanciado?', opts: ['A Basque greeting', 'Pouring cider from height into a small glass', 'A type of cheese', 'A folk dance'], ans: 1 },
  { q: 'Which cable car goes up 753 metres in about 4 minutes on Day 3?', opts: ['Covadonga', 'Fuente Dé', 'Bilbao', 'Picos Alta'], ans: 1 },
  { q: 'What is a cachopo?', opts: ['A Galician stew', 'An Asturian drink', 'Two veal fillets stuffed with ham and cheese', 'A Basque dessert'], ans: 2 },
  { q: 'What language (besides Spanish) is spoken in the Basque Country?', opts: ['Catalan', 'Galician', 'Basque (Euskara)', 'Occitan'], ans: 2 },
  { q: 'What is special about Santillana del Mar?', opts: ["It's by the sea", 'No cars in the old town', 'It has a famous castle', "It's Europe's oldest town"], ans: 1 },
  { q: 'Queso Cabrales is...', opts: ['A soft fresh cheese', 'A blue cheese aged in mountain caves', 'A Basque goat cheese', 'A mild cheddar'], ans: 1 },
  { q: "Jeff Koons' giant sculpture outside the Guggenheim is shaped like...?", opts: ['A dog covered in flowers', 'A large spider', 'A tulip vase', 'A chrome rabbit'], ans: 0 },
  { q: 'What are pintxos?', opts: ['A type of wine', 'Seafood tapas only', 'Small snacks, often on bread', 'A fried dish'], ans: 2 },
]

const WYR_PACKS = {
  funny: [
    ['Only travel with squeaky shoes', 'Only travel with one sock from each pair'],
    ['Narrate every turn like a documentary', 'Sing every turn like a musical'],
    ['Only selfies all day', 'Only dramatic food closeups all day'],
    ['Coffee first, words later', 'Churros first, words later'],
    ['Only window seats', 'Only aisle seats'],
  ],
  deep: [
    ['Plan everything', 'Improvise everything'],
    ['One place, more depth', 'Many places, more variety'],
    ['Comfort over adventure', 'Adventure over comfort'],
    ['Choose certainty', 'Choose surprise'],
    ['Return to favorites', 'Only new places'],
  ],
  random: [
    ['Coin flip route', 'Color based route'],
    ['Only songs from one decade', 'Only podcasts all day'],
    ['Talk nonstop for 20 minutes', 'Travel in silence for 20 minutes'],
    ['One long stop', 'Many short stops'],
    ['One photo each hour', 'One photo at end of day'],
  ],
  roadtrip: [
    ['Pintxos crawl for 3 hours', 'One exceptional sit-down dinner'],
    ['Window seat', 'Aisle seat'],
    ['Drive mountain roads first', 'Cruise coastal roads first'],
    ['Strict schedule', 'Flexible schedule'],
    ['Fuel early', 'Fuel late'],
  ],
  consulting: [
    ['Escalate now', 'Take one more alignment call'],
    ['Ship a one-pager', 'Ship a 53-slide deck'],
    ['Own one workstream deeply', 'Own five workstreams lightly'],
    ['Cut scope', 'Extend timeline'],
    ['Quant first', 'Narrative first'],
    ['Client workshop at 8am', 'Debrief at 11pm'],
  ],
}

const TRUTHS = [
  "What's one thing you're secretly nervous about on this trip?",
  'Rate your sense of direction from 1-10.',
  "What's the strangest thing you've eaten while travelling?",
  "What's your worst travel habit?",
  "Describe a travel disaster you've never told anyone about.",
  'What food do you pretend to like but actually do not?',
]

const DARES = [
  'Say one full sentence in Spanish to the next person you meet.',
  'Let your partner pick your next meal with no complaints.',
  'Take the most dramatic selfie possible right now.',
  'Do your best GPS navigation voice impression.',
  'Text someone at home using only food emojis.',
  'Order at the next café using gestures only.',
]

const EMOJI_PUZZLES = [
  { emojis: '🪨 2️⃣4️⃣1️⃣ 🔔', answer: 'Gaztelugatxe - 241 steps and ring the bell at the top.' },
  { emojis: '🎨 🏛️ 🌸 🐶', answer: "Guggenheim Bilbao + Jeff Koons' flower dog." },
  { emojis: '🚠 ⛰️ 7️⃣5️⃣3️⃣', answer: 'Fuente Dé cable car, about 753m up.' },
  { emojis: '🍢 🍷 🌊', answer: 'Pintxos + wine in the Basque coast area.' },
  { emojis: '🧀 🐄 🕳️', answer: 'Queso Cabrales, cave-aged blue cheese.' },
  { emojis: '🏘️ 🚫🚗 🪨', answer: 'Santillana del Mar old town, no cars and cobblestones.' },
]

const SONG_BANK = [
  { id: '1rIKgCH4H52lrvDcz50hS8', title: 'Lush Life', artist: 'Zara Larsson', year: 2017, popularity: 94 },
  { id: '0lYBSQXN6rCTvUZvg9S0lU', title: 'Let Me Love You', artist: 'DJ Snake, Justin Bieber', year: 2016, popularity: 92 },
  { id: '1zi7xx7UVEFkmKfv06H8x0', title: 'One Dance', artist: 'Drake, Wizkid, Kyla', year: 2016, popularity: 92 },
  { id: '0KKkJNfGyhkQ5aFogxQAPU', title: "That's What I Like", artist: 'Bruno Mars', year: 2016, popularity: 92 },
  { id: '50kpGaPAhYJ3sGmk6vplg0', title: 'Love Yourself', artist: 'Justin Bieber', year: 2015, popularity: 92 },
  { id: '09CtPGIpYB4BrO8qb1RGsF', title: 'Sorry', artist: 'Justin Bieber', year: 2015, popularity: 92 },
  { id: '7MXVkk9YMctZqd1Srtv4MB', title: 'Starboy', artist: 'The Weeknd, Daft Punk', year: 2016, popularity: 91 },
  { id: '4B0JvthVoAAuygILe3n4Bs', title: 'What Do You Mean?', artist: 'Justin Bieber', year: 2015, popularity: 89 },
  { id: '7BKLCZ1jbUBVqRi2FVlTVw', title: 'Closer', artist: 'The Chainsmokers, Halsey', year: 2016, popularity: 89 },
  { id: '0UHB9METy4VCXNgkcGqHqS', title: 'Kiss It Better', artist: 'Rihanna', year: 2016, popularity: 89 },
  { id: '3xKsf9qdS1CyvXSMEid6g8', title: 'Pink + White', artist: 'Frank Ocean', year: 2016, popularity: 88 },
  { id: '7eqoqGkKwgOaWNNHx90uEZ', title: 'Nights', artist: 'Frank Ocean', year: 2016, popularity: 88 },
  { id: '69uxyAqqPIsUyTO8txoP2M', title: 'Adventure of a Lifetime', artist: 'Coldplay', year: 2015, popularity: 88 },
  { id: '3CRDbSIZ4r5MsZ0YwxuEkn', title: 'Stressed Out', artist: 'Twenty One Pilots', year: 2015, popularity: 88 },
  { id: '7fBv7CLKzipRk6EC6TWHOB', title: 'The Hills', artist: 'The Weeknd', year: 2015, popularity: 88 },
  { id: '7JJmb5XwzOO8jgpou264Ml', title: "There's Nothing Holdin' Me Back", artist: 'Shawn Mendes', year: 2017, popularity: 88 },
  { id: '5oO3drDxtziYU2H1X23ZIp', title: 'Love On The Brain', artist: 'Rihanna', year: 2016, popularity: 88 },
  { id: '3QGsuHI8jO1Rx4JWLUh9jd', title: 'Treat You Better', artist: 'Shawn Mendes', year: 2017, popularity: 88 },
  { id: '32OlwWuMpZ6b0aN2RZOeMS', title: 'Uptown Funk (feat. Bruno Mars)', artist: 'Mark Ronson, Bruno Mars', year: 2015, popularity: 87 },
  { id: '6b8Be6ljOzmkOmFslEb23P', title: '24K Magic', artist: 'Bruno Mars', year: 2016, popularity: 86 },
  { id: '2Z8WuEywRWYTKe1NybPQEW', title: 'Ride', artist: 'Twenty One Pilots', year: 2015, popularity: 86 },
  { id: '61uyGDPJ06MkxJtHgPmuyO', title: 'Company', artist: 'Justin Bieber', year: 2015, popularity: 86 },
  { id: '1i1fxkWeaMmKEB4T7zqbzK', title: "Don't Let Me Down", artist: 'The Chainsmokers, Daya', year: 2016, popularity: 86 },
  { id: '66hayvUbTotekKU3H4ta1f', title: 'Where Are Ü Now (with Justin Bieber)', artist: 'Jack Ü, Skrillex, Diplo, Justin Bieber', year: 2015, popularity: 86 },
  { id: '0vbtURX4qv1l7besfwmnD8', title: 'I Took A Pill In Ibiza - Seeb Remix', artist: 'Mike Posner, Seeb', year: 2016, popularity: 86 },
  { id: '0wwPcA6wtMf6HUMpIRdeP7', title: 'Hotline Bling', artist: 'Drake', year: 2016, popularity: 85 },
  { id: '3RiPr603aXAoi4GHyXx0uy', title: 'Hymn for the Weekend', artist: 'Coldplay', year: 2015, popularity: 85 },
  { id: '2JzZzZUQj3Qff7wapcbKjc', title: 'See You Again (feat. Charlie Puth)', artist: 'Wiz Khalifa, Charlie Puth', year: 2015, popularity: 85 },
  { id: '2ZWlPOoWh0626oTaHrnl2a', title: 'Ivy', artist: 'Frank Ocean', year: 2016, popularity: 85 },
  { id: '5kqIPrATaCc2LqxVWzQGbk', title: '7 Years', artist: 'Lukas Graham', year: 2016, popularity: 85 },
  { id: '6gBFPUFcJLzWGx4lenP6h2', title: 'goosebumps', artist: 'Travis Scott', year: 2016, popularity: 85 },
  { id: '5uCax9HTNlzGybIStD3vDh', title: "Say You Won't Let Go", artist: 'James Arthur', year: 2016, popularity: 85 },
  { id: '4pAl7FkDMNBsjykPXo91B3', title: 'Needed Me', artist: 'Rihanna', year: 2016, popularity: 84 },
  { id: '6fujklziTHa8uoM5OQSfIo', title: 'Black Beatles', artist: 'Rae Sremmurd, Gucci Mane', year: 2016, popularity: 84 },
  { id: '7vFoFDWqTX0mHzLfrF1Cfy', title: 'Cheerleader (Felix Jaehn Remix) - Radio Edit', artist: 'OMI, Felix Jaehn', year: 2015, popularity: 84 },
  { id: '3vv9phIu6Y1vX3jcqaGz5Z', title: 'Roses', artist: 'The Chainsmokers, ROZES', year: 2015, popularity: 84 },
  { id: '6i0V12jOa3mr6uu4WYhUBr', title: 'Heathens', artist: 'Twenty One Pilots', year: 2016, popularity: 84 },
  { id: '76hfruVvmfQbw0eYn1nmeC', title: 'Cake By The Ocean', artist: 'DNCE', year: 2016, popularity: 84 },
  { id: '22VdIZQfgXJea34mQxlt81', title: "Can't Feel My Face", artist: 'The Weeknd', year: 2015, popularity: 84 },
  { id: '2iuZJX9X9P0GKaE93xcPjk', title: 'Sugar', artist: 'Maroon 5', year: 2014, popularity: 83 },
  { id: '7EiZI6JVHllARrX9PUvAdX', title: 'Low Life (feat. The Weeknd)', artist: 'Future, The Weeknd', year: 2016, popularity: 83 },
  { id: '37F0uwRSrdzkBiuj0D5UHI', title: 'Reminder', artist: 'The Weeknd', year: 2016, popularity: 83 },
  { id: '7x5xYW5W42OGPAdHUyyguy', title: 'Locked Away (feat. Adam Levine)', artist: 'R. City, Adam Levine', year: 2015, popularity: 83 },
  { id: '0PDUDa38GO8lMxLCRc4lL1', title: 'PILLOWTALK', artist: 'ZAYN', year: 2016, popularity: 83 },
  { id: '3NLnwwAQbbFKcEcV8hDItk', title: 'Perfect', artist: 'One Direction', year: 2015, popularity: 83 },
  { id: '5tf1VVWniHgryyumXyJM7w', title: 'Sugar (feat. Francesco Yates)', artist: 'Robin Schulz, Francesco Yates', year: 2015, popularity: 82 },
  { id: '23L5CiUhw2jV1OIMwthR3S', title: 'In the Name of Love', artist: 'Martin Garrix, Bebe Rexha', year: 2016, popularity: 82 },
  { id: '40YcuQysJ0KlGQTeGUosTC', title: 'Me, Myself & I', artist: 'G-Eazy, Bebe Rexha', year: 2015, popularity: 82 },
  { id: '6eT7xZZlB2mwyzJ2sUKG6w', title: 'White Iverson', artist: 'Post Malone', year: 2016, popularity: 82 },
  { id: '72TFWvU3wUYdUuxejTTIzt', title: 'Work', artist: 'Rihanna, Drake', year: 2016, popularity: 82 },
  { id: '4KW1lqgSr8TKrvBII0Brf8', title: 'Father Stretch My Hands Pt. 1', artist: 'Kanye West', year: 2016, popularity: 82 },
  { id: '0AS63m1wHv9n4VVRizK6Hc', title: 'Mercy', artist: 'Shawn Mendes', year: 2017, popularity: 82 },
  { id: '3a1lNhkSLSkpJE4MSHpDu9', title: 'Congratulations', artist: 'Post Malone, Quavo', year: 2016, popularity: 82 },
  { id: '1A8j067qyiNwQnZT0bzUpZ', title: "This Girl (Kungs Vs. Cookin' On 3 Burners)", artist: "Kungs, Cookin' On 3 Burners", year: 2016, popularity: 81 },
  { id: '6hmhG1b4LEyNuashVvuIAo', title: 'Never Forget You', artist: 'Zara Larsson, MNEK', year: 2017, popularity: 81 },
  { id: '0azC730Exh71aQlOt9Zj3y', title: 'This Is What You Came For', artist: 'Calvin Harris, Rihanna', year: 2016, popularity: 81 },
  { id: '0g5EKLgdKvNlln7TNqBByK', title: 'Middle', artist: 'DJ Snake, Bipolar Sunshine', year: 2016, popularity: 81 },
  { id: '1I8tHoNBFTuoJAlh4hfVVE', title: 'Firestone', artist: 'Kygo, Conrad Sewell', year: 2016, popularity: 81 },
  { id: '4tCtwWceOPWzenK2HAIJSb', title: 'Work from Home (feat. Ty Dolla $ign)', artist: 'Fifth Harmony, Ty Dolla $ign', year: 2016, popularity: 81 },
  { id: '06KyNuuMOX1ROXRhj787tj', title: "We Don't Talk Anymore (feat. Selena Gomez)", artist: 'Charlie Puth, Selena Gomez', year: 2016, popularity: 81 },
  { id: '6JV2JOEocMgcZxYSZelKcc', title: "CAN'T STOP THE FEELING!", artist: 'Justin Timberlake', year: 2016, popularity: 78 },
  { id: '4dASQiO1Eoo3RJvt74FtXB', title: 'Sucker for Pain', artist: 'Lil Wayne, Wiz Khalifa, Imagine Dragons, Logic', year: 2016, popularity: 79 },
  { id: '3zHq9ouUJQFQRf3cm1rRLu', title: 'Love Me Like You Do', artist: 'Ellie Goulding', year: 2015, popularity: 80 },
]

const SONG_CATEGORIES = [
  { id: 'zillennial_mix', name: '🔥 Zillennial Mix', filter: song => song.popularity >= 82 },
  { id: 'hits_2016', name: '🏆 2016 Mega Hits', filter: song => song.year === 2016 },
  { id: 'early_2010s', name: '📼 Early 2010s', filter: song => song.year <= 2015 },
  { id: 'pop_icons', name: '🎤 Pop Icons', filter: song => /Justin Bieber|Rihanna|The Weeknd|Shawn Mendes|Selena Gomez|Bruno Mars|One Direction/.test(song.artist) },
  { id: 'dance_party', name: '💃 Dance Party', filter: song => /Chainsmokers|DJ Snake|Calvin Harris|Kygo|Kungs|Skrillex|Zara Larsson/.test(song.artist) },
  { id: 'rap_rnb', name: '🎧 Rap & RnB', filter: song => /Drake|Post Malone|Travis Scott|Future|Kanye West|Rae Sremmurd|Frank Ocean/.test(song.artist) },
  { id: 'movie_energy', name: '🎬 Movie Energy', filter: song => /See You Again|Heathens|Sucker for Pain|CAN'T STOP THE FEELING|Love Me Like You Do/.test(song.title) },
]

const PLAYER_META = {
  V: { label: 'V', emoji: '👨🏽' },
  M: { label: 'M', emoji: '👩🏽' },
}

function buildGameList(villainMode) {
  return [
    {
      id: 'bingo',
      emoji: villainMode ? '🟢' : '🎯',
      title: villainMode ? 'Stakeholder Bingo' : 'Road Trip Bingo',
      sub: villainMode ? 'Buzzword cell pool and alignment chaos.' : 'Pastel squares, quick taps, lucky lines.',
    },
    {
      id: 'trivia',
      emoji: '🧠',
      title: villainMode ? 'Competency Assessment' : 'Trivia Duel',
      sub: villainMode ? 'Consulting-flavored questions + steal mechanics.' : 'Pick who answers first, then fight for steals.',
    },
    {
      id: 'wyr',
      emoji: '😄',
      title: villainMode ? 'Prioritisation Matrix' : 'Would You Rather',
      sub: villainMode ? 'Consulting dilemmas plus normal categories.' : 'Funny, deep, random, and roadtrip moods.',
    },
    {
      id: 'song',
      emoji: '🎧',
      title: villainMode ? 'Brand Anthem Challenge' : 'Song Guess Battle',
      sub: 'Play a track and race to name it.',
    },
    { id: 'td', emoji: '🎲', title: 'Truth or Dare', sub: 'Travel edition, quick chaos.' },
    { id: 'emoji', emoji: '🎭', title: 'Emoji Decode', sub: 'Guess Spain moments from emoji clues.' },
  ]
}

function shuffle(items) {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

function BingoGame({ onBack }) {
  const [marked, setMarked] = useState(() => new Set())
  const [won, setWon] = useState(false)

  const toggle = index => {
    setMarked(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)

      const hasLine =
        Array.from({ length: 4 }).some((_, r) => [0, 1, 2, 3].every(c => next.has(r * 4 + c))) ||
        Array.from({ length: 4 }).some((_, c) => [0, 1, 2, 3].every(r => next.has(r * 4 + c))) ||
        [0, 5, 10, 15].every(i => next.has(i)) ||
        [3, 6, 9, 12].every(i => next.has(i))

      if (hasLine) setWon(true)
      return next
    })
  }

  return (
    <div className="game-view">
      <button className="game-back-btn" onClick={onBack}>← Games</button>
      <div className="game-title">🎯 Road Trip Bingo</div>
      <div className="game-subtitle">Spot these during the drive and get 4 in a row.</div>
      {won && <div className="game-win-banner">🎉 Bingo! Nice spotting.</div>}

      <div className="bingo-board">
        <div className="bingo-grid">
          {BINGO_ITEMS.map((item, i) => (
            <button
              key={item.text}
              className={`bingo-cell bingo-cell-fancy${marked.has(i) ? ' marked' : ''}`}
              onClick={() => toggle(i)}
            >
              <span className="bingo-cell-icon">{item.icon}</span>
              <span className="bingo-cell-text">{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      <button className="game-reset-btn" onClick={() => { setMarked(new Set()); setWon(false) }}>
        ↺ New Card
      </button>
    </div>
  )
}

function TriviaGame({ onBack }) {
  const [qIdx, setQIdx] = useState(0)
  const [scores, setScores] = useState([0, 0])
  const [chosen, setChosen] = useState(null)
  const [done, setDone] = useState(false)
  const [turn, setTurn] = useState(0)

  const q = TRIVIA[qIdx]

  const pick = i => {
    if (chosen !== null) return
    setChosen(i)
    if (i === q.ans) {
      setScores(prev => {
        const next = [...prev]
        next[turn] += 1
        return next
      })
    }
  }

  const next = () => {
    if (qIdx === TRIVIA.length - 1) {
      setDone(true)
      return
    }
    setQIdx(v => v + 1)
    setChosen(null)
    setTurn(v => 1 - v)
  }

  const restart = () => {
    setQIdx(0)
    setScores([0, 0])
    setChosen(null)
    setDone(false)
    setTurn(0)
  }

  if (done) {
    const tie = scores[0] === scores[1]
    const p1Wins = scores[0] > scores[1]

    return (
      <div className="game-view">
        <button className="game-back-btn" onClick={onBack}>← Games</button>
        <div className="game-title">🧠 Spain Trivia - Final</div>
        <div className="trivia-scores">
          <div className={`trivia-score-card${p1Wins ? ' winner' : ''}`}>
            <div className="trivia-score-label">{PLAYER_META.V.emoji} {PLAYER_META.V.label}</div>
            <div className="trivia-score-num">{scores[0]}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--muted)' }}>vs</div>
          <div className={`trivia-score-card${!tie && !p1Wins ? ' winner' : ''}`}>
            <div className="trivia-score-label">{PLAYER_META.M.emoji} {PLAYER_META.M.label}</div>
            <div className="trivia-score-num">{scores[1]}</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-hand)', color: 'var(--muted)', marginBottom: 16 }}>
          {tie ? 'Tie game 🤝' : p1Wins ? `${PLAYER_META.V.label} wins 🎉` : `${PLAYER_META.M.label} wins 🎉`}
        </div>
        <button className="game-reset-btn" onClick={restart}>Play Again</button>
      </div>
    )
  }

  return (
    <div className="game-view">
      <button className="game-back-btn" onClick={onBack}>← Games</button>
      <div className="game-title">🧠 Spain Trivia</div>
      <div className="trivia-scores" style={{ marginBottom: 12 }}>
        <div className={`trivia-score-card${turn === 0 ? ' active' : ''}`}>
          <div className="trivia-score-label">{PLAYER_META.V.emoji} {PLAYER_META.V.label}</div>
          <div className="trivia-score-num">{scores[0]}</div>
        </div>
        <div style={{ fontFamily: 'var(--font-hand)', color: 'var(--muted)' }}>Q{qIdx + 1}/{TRIVIA.length}</div>
        <div className={`trivia-score-card${turn === 1 ? ' active' : ''}`}>
          <div className="trivia-score-label">{PLAYER_META.M.emoji} {PLAYER_META.M.label}</div>
          <div className="trivia-score-num">{scores[1]}</div>
        </div>
      </div>

      <div className="trivia-question">{q.q}</div>
      <div className="trivia-opts">
        {q.opts.map((opt, i) => (
          <button
            key={opt}
            className={`trivia-opt${chosen !== null ? (i === q.ans ? ' correct' : i === chosen ? ' wrong' : '') : ''}`}
            onClick={() => pick(i)}
          >
            {String.fromCharCode(65 + i)}. {opt}
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

function SongGuessGame({ onBack, villainMode = false }) {
  const [category, setCategory] = useState('zillennial_mix')
  const [round, setRound] = useState(0)
  const [scores, setScores] = useState([0, 0])
  const [revealed, setRevealed] = useState(false)
  const [status, setStatus] = useState('Press play, then tap who guessed first.')
  const audioRef = useRef(null)
  const previewCacheRef = useRef({})

  const deck = useMemo(() => {
    const selected = SONG_CATEGORIES.find(c => c.id === category)
    const filtered = selected ? SONG_BANK.filter(selected.filter) : SONG_BANK
    return shuffle(filtered).slice(0, Math.min(20, filtered.length))
  }, [category])

  const song = deck[round]
  const roundsTotal = deck.length
  const ended = roundsTotal === 0 || round >= roundsTotal

  useEffect(() => () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
  }, [])

  const cleanupAudio = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
  }

  const normalize = value => (value || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()

  const resolvePreviewUrl = async currentSong => {
    if (previewCacheRef.current[currentSong.id] !== undefined) {
      return previewCacheRef.current[currentSong.id]
    }
    const leadArtist = currentSong.artist.split(',')[0].trim()
    const term = encodeURIComponent(`${currentSong.title} ${leadArtist}`)

    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=8`)
      if (!res.ok) throw new Error('search failed')
      const data = await res.json()
      const titleNeedle = normalize(currentSong.title)
      const artistNeedle = normalize(leadArtist)
      const candidates = Array.isArray(data.results) ? data.results : []

      const strictMatch = candidates.find(item => {
        const track = normalize(item.trackName)
        const artist = normalize(item.artistName)
        return track.includes(titleNeedle.split(' ')[0]) && artist.includes(artistNeedle.split(' ')[0]) && item.previewUrl
      })
      const fallbackMatch = candidates.find(item => item.previewUrl)
      const previewUrl = strictMatch?.previewUrl ?? fallbackMatch?.previewUrl ?? null
      previewCacheRef.current[currentSong.id] = previewUrl
      return previewUrl
    } catch {
      previewCacheRef.current[currentSong.id] = null
      return null
    }
  }

  const playClip = async () => {
    if (!song || !audioRef.current) return
    const previewUrl = await resolvePreviewUrl(song)
    if (!previewUrl) {
      setStatus('Preview clip unavailable. Use Open in Spotify.')
      return
    }
    audioRef.current.src = previewUrl
    audioRef.current.currentTime = 0
    try {
      await audioRef.current.play()
      setStatus('Playing preview clip. Tap who guessed first.')
    } catch {
      setStatus('Playback blocked on this device. Tap Open in Spotify.')
    }
  }

  const pauseClip = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setStatus('Clip paused.')
  }

  const awardPoint = playerIdx => {
    setScores(prev => {
      const next = [...prev]
      next[playerIdx] += 1
      return next
    })
    setStatus(`${playerIdx === 0 ? `${PLAYER_META.V.emoji} ${PLAYER_META.V.label}` : `${PLAYER_META.M.emoji} ${PLAYER_META.M.label}`} got this one.`)
  }

  const nextTrack = () => {
    cleanupAudio()
    setRound(prev => prev + 1)
    setRevealed(false)
    setStatus('Press play, then tap who guessed first.')
  }

  const reset = () => {
    cleanupAudio()
    setRound(0)
    setScores([0, 0])
    setRevealed(false)
    setStatus('Press play, then tap who guessed first.')
  }

  const switchCategory = id => {
    cleanupAudio()
    setCategory(id)
    setRound(0)
    setScores([0, 0])
    setRevealed(false)
    setStatus('Press play, then tap who guessed first.')
  }

  if (ended) {
    const tie = scores[0] === scores[1]
    const p1Wins = scores[0] > scores[1]

    return (
      <div className="game-view">
        <button className="game-back-btn" onClick={onBack}>← Games</button>
        <div className="game-title">{villainMode ? '🎵 Brand Anthem Challenge - Final' : '🎵 Song Guess Battle - Final'}</div>
        <div className="game-subtitle">Category: {SONG_CATEGORIES.find(c => c.id === category)?.name}</div>

        <div className="trivia-scores">
          <div className={`trivia-score-card${p1Wins ? ' winner' : ''}`}>
            <div className="trivia-score-label">{PLAYER_META.V.emoji} {PLAYER_META.V.label}</div>
            <div className="trivia-score-num">{scores[0]}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--muted)' }}>vs</div>
          <div className={`trivia-score-card${!tie && !p1Wins ? ' winner' : ''}`}>
            <div className="trivia-score-label">{PLAYER_META.M.emoji} {PLAYER_META.M.label}</div>
            <div className="trivia-score-num">{scores[1]}</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontFamily: 'var(--font-hand)', color: 'var(--muted)', marginBottom: 14 }}>
          {tie ? 'Tie game 🤝' : p1Wins ? `${PLAYER_META.V.label} wins 🎉` : `${PLAYER_META.M.label} wins 🎉`}
        </div>

        <button className="game-reset-btn" onClick={reset}>Replay Same Category</button>
        <button className="game-reset-btn" style={{ marginTop: 10, background: 'var(--teal)' }} onClick={() => onBack()}>
          Choose Another Game
        </button>
      </div>
    )
  }

  return (
    <div className="game-view">
      <button className="game-back-btn" onClick={onBack}>← Games</button>
      <div className="game-title">{villainMode ? '🎵 Brand Anthem Challenge' : '🎧 Song Guess Battle'}</div>
      <div className="game-subtitle">Play or pause from buttons below, then award the point.</div>

      <div className="pintxos-mode-toggle" style={{ marginTop: 0, marginBottom: 12 }}>
        {SONG_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => switchCategory(cat.id)}
            className={`pintxos-mode-btn${cat.id === category ? ' active' : ''}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="trivia-scores" style={{ marginTop: 4, marginBottom: 12 }}>
        <div className="trivia-score-card">
          <div className="trivia-score-label">{PLAYER_META.V.emoji} {PLAYER_META.V.label}</div>
          <div className="trivia-score-num">{scores[0]}</div>
        </div>
        <div style={{ fontFamily: 'var(--font-hand)', color: 'var(--muted)' }}>
          Round {round + 1}/{roundsTotal}
        </div>
        <div className="trivia-score-card">
          <div className="trivia-score-label">{PLAYER_META.M.emoji} {PLAYER_META.M.label}</div>
          <div className="trivia-score-num">{scores[1]}</div>
        </div>
      </div>

      <div style={{ fontFamily: 'var(--font-hand)', color: 'var(--muted)', textAlign: 'center', marginBottom: 8 }}>
        Track {round + 1}/{roundsTotal}
      </div>
      <audio ref={audioRef} preload="none" style={{ display: 'none' }} />

      <div className={`spotify-clip spotify-clip-masked${revealed ? ' player-revealed' : ''}`}>
        {!revealed && <div className="spotify-hard-mask">Hidden for guessing · use Play Clip below</div>}
        <iframe
          src={`https://open.spotify.com/embed/track/${song.id}?utm_source=generator`}
          title={`Spotify preview ${song.title}`}
          width="100%"
          height="232"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
        <button className="game-reset-btn" onClick={playClip}>Play clip</button>
        <button className="game-reset-btn" onClick={pauseClip}>Pause clip</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
        <button className="game-reset-btn" onClick={() => awardPoint(0)}>{PLAYER_META.V.emoji} {PLAYER_META.V.label} got it</button>
        <button className="game-reset-btn" onClick={() => awardPoint(1)}>{PLAYER_META.M.emoji} {PLAYER_META.M.label} got it</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
        <button className="game-reset-btn" onClick={() => setStatus('No points this round.')}>Nobody got it</button>
        <button className="game-reset-btn" onClick={nextTrack}>Next track</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
        <button className="game-reset-btn" onClick={() => setRevealed(v => !v)}>
          {revealed ? 'Hide player' : 'Reveal player'}
        </button>
        <button
          className="game-reset-btn"
          onClick={() => window.open(`https://open.spotify.com/track/${song.id}`, '_blank', 'noopener,noreferrer')}
        >
          Open in Spotify
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center' }}>
        {status}
      </div>
    </div>
  )
}

function WYRGame({ onBack, villainMode = false }) {
  const categoryOrder = villainMode ? ['consulting', 'funny', 'deep', 'random', 'roadtrip'] : ['funny', 'deep', 'random', 'roadtrip']
  const [category, setCategory] = useState(categoryOrder[0])
  const [reshuffleTick, setReshuffleTick] = useState(0)
  const [idx, setIdx] = useState(0)
  const [p1Pick, setP1Pick] = useState(null)
  const [p2Pick, setP2Pick] = useState(null)
  const [phase, setPhase] = useState('p1')
  const [matches, setMatches] = useState(0)
  const [total, setTotal] = useState(0)

  const deck = useMemo(() => shuffle(WYR_PACKS[category] || []), [category, reshuffleTick])
  const current = deck[idx] || ['Option A', 'Option B']

  const pickP1 = i => {
    setP1Pick(i)
    setPhase('p2')
  }

  const pickP2 = i => {
    setP2Pick(i)
    setPhase('reveal')
    setTotal(v => v + 1)
    if (i === p1Pick) setMatches(v => v + 1)
  }

  const next = () => {
    if (!deck.length) return
    setIdx(v => (v + 1) % deck.length)
    setP1Pick(null)
    setP2Pick(null)
    setPhase('p1')
  }

  const switchCategory = nextCategory => {
    setCategory(nextCategory)
    setIdx(0)
    setP1Pick(null)
    setP2Pick(null)
    setPhase('p1')
  }

  return (
    <div className="game-view">
      <button className="game-back-btn" onClick={onBack}>← Games</button>
      <div className="game-title">{villainMode ? '😄 Prioritisation Matrix' : '😄 Would You Rather'}</div>
      <div className="game-subtitle">Switch categories whenever you want and reshuffle anytime.</div>
      <div className="pintxos-mode-toggle" style={{ marginTop: 0 }}>
        {categoryOrder.map(key => (
          <button
            key={key}
            className={`pintxos-mode-btn${category === key ? ' active' : ''}`}
            onClick={() => switchCategory(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', fontFamily: 'var(--font-hand)', color: 'var(--muted)', marginBottom: 10 }}>
        ✓ {matches} matches / {total} rounds • Q{idx + 1}/{deck.length}
      </div>
      <div style={{ marginBottom: 10 }}>
        <button className="game-reset-btn" onClick={() => setReshuffleTick(v => v + 1)}>Reshuffle This Category</button>
      </div>

      {phase !== 'reveal' && (
        <div className="wyr-phase-label">
          {phase === 'p1'
            ? `${PLAYER_META.V.emoji} ${PLAYER_META.V.label} chooses first`
            : `${PLAYER_META.M.emoji} ${PLAYER_META.M.label} chooses now`}
        </div>
      )}

      {phase === 'p1' && <div className="wyr-opts">{current.map((o, i) => <button key={o} className="wyr-opt" onClick={() => pickP1(i)}>{o}</button>)}</div>}
      {phase === 'p2' && <div className="wyr-opts">{current.map((o, i) => <button key={o} className="wyr-opt" onClick={() => pickP2(i)}>{o}</button>)}</div>}

      {phase === 'reveal' && (
        <>
          <div className={`wyr-result ${p1Pick === p2Pick ? 'match' : 'diff'}`}>
            {p1Pick === p2Pick ? '🎉 Match!' : '🤔 Different choices!'}
          </div>
          <div className="wyr-reveal-grid">
            <div className="wyr-reveal-card">
              <div className="wyr-reveal-who">{PLAYER_META.V.emoji} {PLAYER_META.V.label}</div>
              <div className="wyr-reveal-ans">{current[p1Pick]}</div>
            </div>
            <div className="wyr-reveal-card">
              <div className="wyr-reveal-who">{PLAYER_META.M.emoji} {PLAYER_META.M.label}</div>
              <div className="wyr-reveal-ans">{current[p2Pick]}</div>
            </div>
          </div>
          <button className="game-reset-btn" onClick={next}>Next →</button>
        </>
      )}
    </div>
  )
}

function TruthDareGame({ onBack }) {
  const [mode, setMode] = useState(null)
  const [card, setCard] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const draw = nextMode => {
    const list = nextMode === 'truth' ? TRUTHS : DARES
    setCard(list[Math.floor(Math.random() * list.length)])
    setMode(nextMode)
    setRevealed(false)
  }

  return (
    <div className="game-view">
      <button className="game-back-btn" onClick={onBack}>← Games</button>
      <div className="game-title">🎲 Truth or Dare</div>
      <div className="game-subtitle">Travel edition.</div>

      <div className="td-btns">
        <button className="td-truth-btn" onClick={() => draw('truth')}>🤔 Truth</button>
        <button className="td-dare-btn" onClick={() => draw('dare')}>😈 Dare</button>
      </div>

      {card && (
        <div className={`td-card ${mode}`} onClick={() => setRevealed(v => !v)}>
          {!revealed ? (
            <div className="td-card-front">
              <div className="td-card-type">{mode === 'truth' ? '🤔 Truth' : '😈 Dare'}</div>
              <div className="td-card-tap">tap to reveal</div>
            </div>
          ) : (
            <div className="td-card-back">{card}</div>
          )}
        </div>
      )}

      {card && revealed && (
        <button className="game-reset-btn" style={{ marginTop: 12 }} onClick={() => { setCard(null); setMode(null); setRevealed(false) }}>
          Next Card
        </button>
      )}
    </div>
  )
}

function EmojiGame({ onBack }) {
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  const puzzle = EMOJI_PUZZLES[idx]

  const next = gotIt => {
    if (gotIt) setScore(v => v + 1)
    setTotal(v => v + 1)
    setIdx(v => (v + 1) % EMOJI_PUZZLES.length)
    setRevealed(false)
  }

  return (
    <div className="game-view">
      <button className="game-back-btn" onClick={onBack}>← Games</button>
      <div className="game-title">🎭 Emoji Decode</div>
      <div className="game-subtitle">Guess the place, food, or moment.</div>
      <div style={{ textAlign: 'center', fontFamily: 'var(--font-hand)', color: 'var(--muted)', marginBottom: 12 }}>
        ✓ {score} / {total} correct • Puzzle {idx + 1}/{EMOJI_PUZZLES.length}
      </div>

      <div className="emoji-puzzle-card">
        <div className="emoji-puzzle-emojis">{puzzle.emojis}</div>
        {!revealed ? (
          <button className="game-reset-btn" style={{ marginTop: 14 }} onClick={() => setRevealed(true)}>
            Reveal Answer
          </button>
        ) : (
          <>
            <div className="emoji-puzzle-answer">{puzzle.answer}</div>
            <div className="emoji-got-it-btns">
              <button className="emoji-got-btn yes" onClick={() => next(true)}>✓ Got it</button>
              <button className="emoji-got-btn no" onClick={() => next(false)}>✕ Missed</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Games({ villainMode = false }) {
  const [active, setActive] = useState(null)
  const gameList = useMemo(() => buildGameList(villainMode), [villainMode])

  if (active === 'bingo') return <BingoGame onBack={() => setActive(null)} />
  if (active === 'trivia') return <TriviaGame onBack={() => setActive(null)} />
  if (active === 'song') return <SongGuessGame onBack={() => setActive(null)} villainMode={villainMode} />
  if (active === 'wyr') return <WYRGame onBack={() => setActive(null)} villainMode={villainMode} />
  if (active === 'td') return <TruthDareGame onBack={() => setActive(null)} />
  if (active === 'emoji') return <EmojiGame onBack={() => setActive(null)} />

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-eyebrow">{villainMode ? 'team simulation lab' : 'entertainment'}</div>
        <div className="screen-title">
          {villainMode ? <>Team <em>Building</em></> : <>Mini <em>Games</em></>}
        </div>
      </div>
      <div className="screen-body">
        <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: 'var(--muted)', marginBottom: 6 }}>
          {villainMode
            ? 'Wrapped classics plus Deloitte-only cringe simulators.'
            : 'Tap into playful modes whenever you have waiting time.'}
        </div>
        <div className="games-grid">
          {gameList.map(game => (
            <button key={game.id} className="game-card" onClick={() => setActive(game.id)}>
              <div className="game-card-emoji">{game.emoji}</div>
              <div>
                <div className="game-card-title">{game.title}</div>
                <div className="game-card-sub">{game.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
