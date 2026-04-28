import { useState, useEffect, useRef } from 'react'
import TaigoSVG from './components/TaigoSVG.jsx'
import RouteAnimation from './components/RouteAnimation.jsx'
import Questions from './components/Questions.jsx'
import Games from './components/Games.jsx'
import {
  STOPS, DAYS, BOOKINGS, PHRASES, WEATHER_LOCS,
} from './data/trip.js'

const TRAVEL_JOKES = [
  '"If my mom had balls she would be my dad." - Max Verstappen',
  '"Sometimes maybe good, sometimes maybe shit." - Gennaro Gattuso',
  '"I know words. I have the best words." - Donald Trump',
  '"I am not superstitious, but I am a little stitious." - Michael Scott',
  '"I spent a lot of money on booze, birds, and fast cars. The rest I just squandered." - George Best',
  '"The problem with the world is that everyone is a few drinks behind." - Humphrey Bogart',
  '"People say nothing is impossible, but I do nothing every day." - A. A. Milne',
  '"I am on a seafood diet. I see food and I eat it." - Rodney Dangerfield',
  '"I cook with wine. Sometimes I even add it to the food." - W. C. Fields',
  '"Age is something that does not matter unless you are a cheese." - Luis Bunuel',
  '"I can resist everything except temptation." - Oscar Wilde',
  '"I refuse to join any club that would have me as a member." - Groucho Marx',
  '"I always wanted to be somebody, but now I realize I should have been more specific." - Lily Tomlin',
  '"I am not arguing, I am just explaining why I am right." - Anonymous',
  '"When life gives you lemons, squirt someone in the eye." - Cathy Guisewite',
  '"I love deadlines. I like the whooshing sound they make as they fly by." - Douglas Adams',
  '"There cannot be a crisis this week. My schedule is already full." - Henry Kissinger',
  '"Never put off till tomorrow what you can do the day after tomorrow." - Mark Twain',
  '"Behind every great man is a woman rolling her eyes." - Jim Carrey',
  '"If at first you do not succeed, then skydiving definitely is not for you." - Steven Wright',
  '"The road to success is dotted with many tempting parking spaces." - Will Rogers',
  '"I never forget a face, but in your case I will be glad to make an exception." - Groucho Marx',
  '"My fake plants died because I did not pretend to water them." - Mitch Hedberg',
  '"I used to think I was indecisive, but now I am not too sure." - Tommy Cooper',
  '"Hospitality is making your guests feel at home, even if you wish they were." - Anonymous',
  '"Common sense is like deodorant. The people who need it most never use it." - Anonymous',
  '"I am writing a book. I have got the page numbers done." - Steven Wright',
  '"The elevator to success is out of order. You have to use the stairs." - Joe Girard',
  '"To steal ideas from one person is plagiarism. To steal from many is research." - Wilson Mizner',
  '"I never feel more alone than when I am trying to put sunscreen on my back." - Jimmy Kimmel',
  '"Do not worry about the world ending today. It is already tomorrow in Australia." - Charles Schulz',
  '"My therapist says I have a preoccupation with vengeance. We will see about that." - Stewart Francis',
  '"Always borrow money from a pessimist. They will not expect it back." - Oscar Wilde',
  '"I am in shape. Round is a shape." - George Carlin',
  '"I generally avoid temptation unless I cannot resist it." - Mae West',
  '"I am not lazy. I am on energy-saving mode." - Anonymous',
  '"When in doubt, mumble. When in trouble, delegate." - Anonymous',
  '"I have had a perfectly wonderful evening, but this was not it." - Groucho Marx',
  '"I choose a lazy person to do a hard job because they will find an easy way." - Bill Gates',
  '"I am not short. I am concentrated awesome." - Anonymous',
  '"I thought I wanted a career. Turns out I just wanted paychecks." - Anonymous',
  '"The only mystery in life is why the kamikaze pilots wore helmets." - Al McGuire',
  '"A clear conscience is usually the sign of a bad memory." - Steven Wright',
  '"I am not weird. I am limited edition." - Anonymous',
  '"Knowledge is knowing a tomato is a fruit. Wisdom is not putting it in a fruit salad." - Miles Kington',
  '"If you think nobody cares if you are alive, miss a couple of car payments." - Earl Wilson',
  '"Do not take life too seriously. You will never get out alive." - Elbert Hubbard',
  '"If you are going through hell, keep going." - Winston Churchill',
  '"I am very brave generally, but today I am in my cowardly era." - Anonymous',
  '"To be sure of hitting the target, shoot first and call whatever you hit the target." - Ashleigh Brilliant',
]

const STOP_TIME_WINDOWS = {
  0: 'Morning',
  1: 'Late Morning',
  2: 'Evening',
  3: 'Morning',
  4: 'Lunch',
  5: 'Evening',
  6: 'Night',
  7: 'Morning',
  8: 'Lunch',
  9: 'Afternoon',
  10: 'Late Afternoon',
  11: 'Evening',
  12: 'Morning',
  13: 'Afternoon',
  14: 'Night',
}

const CAR_ANIMATION_PRESETS = [
  'idle',
  'bounce',
  'wiggle',
  'zoom',
  'float',
  'tilt',
  'pulse',
  'spin',
]

const KEY_TIPS_REFRESHED = [
  { icon: '🎟️', urgency: 'critical', title: 'Book Fuente De Cable Car', text: 'Reserve online before departure day. Mountain weather changes fast and slots can fill early.' },
  { icon: '🍳', urgency: 'critical', title: 'Bar Nestor Timing', text: 'Put your name down before 18:50 if tortilla is a must. The queue moves quickly and portions are limited.' },
  { icon: '⛽', urgency: 'important', title: 'Fuel Before Return', text: 'Top up before the airport on Day 4 so Avis return is smooth and penalty-free.' },
  { icon: '🧥', urgency: 'important', title: 'Layer Up For Peaks', text: 'Pack a light jacket in the car each day. Fuente De and high viewpoints get windy even in May.' },
  { icon: '🅿️', urgency: 'important', title: 'San Sebastian Parking', text: 'Use Parking Kursaal and walk in. Driving into old-town streets wastes time.' },
  { icon: '🐌', urgency: 'tip', title: 'N-621 Gorge Pace', text: 'Single-lane sections are normal. Keep calm, go steady, and use turnouts.' },
  { icon: '🧀', urgency: 'tip', title: 'Local Food Souvenirs', text: 'Grab anchoas, Cabrales cheese, and orujo as take-home gifts on route.' },
  { icon: '🌅', urgency: 'tip', title: 'Golden-Hour Stops', text: 'If timing slips, prioritize coast and mountain viewpoints around late afternoon for best light.' },
]

const TIP_PASTEL_SWATCHES = [
  { bg: '#FFF5D9', border: '#F3D48E' },
  { bg: '#FFE8EF', border: '#F4B5C9' },
  { bg: '#E8F8FF', border: '#A9DBF0' },
  { bg: '#F2EEFF', border: '#C8B9F4' },
  { bg: '#E8FAF1', border: '#A9DEC4' },
  { bg: '#FFF1E8', border: '#F1C3A7' },
  { bg: '#FDEEFE', border: '#E8B8EC' },
  { bg: '#EEF6FF', border: '#BDD8F7' },
]

const PHRASE_GROUPS = [
  {
    id: 'essentials',
    label: 'Essentials',
    emoji: '🧭',
    items: [
      { es: 'Hola, buenas', en: 'Hello there', phonetic: 'OH-lah BWEH-nas' },
      { es: 'La cuenta, por favor', en: 'The bill, please', phonetic: 'lah KWEN-tah por fah-BOR' },
      { es: '¿Dónde está el baño?', en: 'Where is the bathroom?', phonetic: 'DON-deh es-TAH el BAH-nyoh' },
      { es: '¿Aceptan tarjeta?', en: 'Do you take card?', phonetic: 'ah-sep-TAHN tar-HEH-tah' },
      { es: 'Un momento, por favor', en: 'One moment, please', phonetic: 'oon moh-MEN-toh por fah-BOR' },
      { es: 'Perdón, no hablo mucho español', en: 'Sorry, I do not speak much Spanish', phonetic: 'per-DON no AH-bloh MOO-cho es-pan-YOL' },
      { es: 'Gracias, muy amable', en: 'Thank you, very kind', phonetic: 'GRAH-syahs mwee ah-MAH-bleh' },
      { es: '¿Nos puede ayudar?', en: 'Can you help us?', phonetic: 'nos PWEH-deh ah-yoo-DAR' },
    ],
  },
  {
    id: 'food',
    label: 'Food',
    emoji: '🍤',
    items: [
      ...PHRASES,
      { es: '¿Qué recomienda hoy?', en: 'What do you recommend today?', phonetic: 'keh reh-koh-mee-EN-dah oy' },
      { es: 'Sin marisco, por favor', en: 'No shellfish, please', phonetic: 'seen mar-REE-skoh por fah-BOR' },
      { es: '¿La cocina sigue abierta?', en: 'Is the kitchen still open?', phonetic: 'lah koh-SEE-nah SEE-geh ah-BYER-tah' },
      { es: 'Otra ronda, por favor', en: 'Another round, please', phonetic: 'OH-trah RON-dah por fah-BOR' },
      { es: 'Está increíble', en: 'This is incredible', phonetic: 'es-TAH een-kreh-EE-bleh' },
    ],
  },
  {
    id: 'funny',
    label: 'Funny',
    emoji: '😄',
    items: [
      { es: 'Perdí al conductor otra vez', en: 'I lost the driver again', phonetic: 'per-DEE al kon-duk-TOR OH-trah ves' },
      { es: 'Mi mapa y yo estamos discutiendo', en: 'My map and I are arguing', phonetic: 'mee MAH-pah ee yo es-TAH-mos dee-skoo-tee-EN-doh' },
      { es: 'Solo venimos por el postre', en: 'We only came for dessert', phonetic: 'SO-loh veh-NEE-mos por el POS-treh' },
      { es: 'Prometo que esta es la salida correcta', en: 'I swear this is the correct exit', phonetic: 'pro-MEH-toh keh ES-tah es lah sah-LEE-dah koh-REK-tah' },
      { es: 'Una siesta y volvemos', en: 'One nap and we will return', phonetic: 'OO-nah see-ES-tah ee vol-VEH-mos' },
      { es: '¿Hay churros por aquí?', en: 'Any churros around here?', phonetic: 'eye CHOO-rros por ah-KEE' },
      { es: 'Hoy manejas tú', en: 'You drive today', phonetic: 'oy mah-NEH-has too' },
      { es: 'Necesitamos café urgente', en: 'We need coffee urgently', phonetic: 'neh-seh-see-TAH-mos kah-FEH oor-HEN-teh' },
    ],
  },
  {
    id: 'road',
    label: 'Road Trip',
    emoji: '🚗',
    items: [
      { es: '¿Esta carretera va a Potes?', en: 'Does this road go to Potes?', phonetic: 'ES-tah kah-reh-TEH-rah vah ah PO-tes' },
      { es: 'Buscamos un mirador', en: 'We are looking for a viewpoint', phonetic: 'boos-KAH-mos oon mee-rah-DOR' },
      { es: '¿Dónde podemos aparcar?', en: 'Where can we park?', phonetic: 'DON-deh po-DEH-mos ah-par-KAR' },
      { es: '¿Hay peaje en esta ruta?', en: 'Is there a toll on this route?', phonetic: 'eye peh-AH-heh en ES-tah ROO-tah' },
      { es: 'Vamos despacio por el desfiladero', en: 'We are going slow through the gorge', phonetic: 'VAH-mos des-PA-syo por el des-fee-lah-DEH-roh' },
      { es: 'Parada rápida para fotos', en: 'Quick stop for photos', phonetic: 'pah-RAH-dah RAH-pee-dah PAH-rah FO-tos' },
      { es: '¿Dónde está la gasolinera más cercana?', en: 'Where is the nearest fuel station?', phonetic: 'DON-deh es-TAH lah gah-soh-lee-NEH-rah mas ser-KAH-nah' },
      { es: 'Nos encanta esta ruta', en: 'We love this route', phonetic: 'nos en-KAN-tah ES-tah ROO-tah' },
    ],
  },
]

const DAY_MEAL_OPTIONS = {
  1: [
    {
      id: 'breakfast',
      label: 'Breakfast',
      title: 'Easy Start Near Santander',
      items: [
        { icon: '☕', time: '08:45', name: 'Panaderia El Machi', note: 'Coffee + tortilla pincho before collecting the car', maps: 'https://www.google.com/maps/search/Panaderia+Santander+Airport' },
        { icon: '🥐', time: '09:10', name: 'Cafe de Pombo', note: 'Classic pastries and a light breakfast set', maps: 'https://www.google.com/maps/search/Cafe+de+Pombo+Santander' },
      ],
    },
    {
      id: 'crawl',
      label: 'Pintxos Crawl',
      title: 'Evening Crawl Plan',
      items: [
        { icon: '📝', time: '18:50', name: 'Bar Nestor', note: 'Put your name on the tortilla list immediately', maps: 'https://www.google.com/maps/search/Bar+Nestor+San+Sebastian' },
        { icon: '🍄', time: '19:00', name: 'Ganbara', note: 'Mushroom + foie pintxos before it sells out', maps: 'https://www.google.com/maps/search/Ganbara+San+Sebastian' },
        { icon: '🐟', time: '19:30', name: 'Bar Txepetxa', note: 'Anchovy-focused pintxos and cider', maps: 'https://www.google.com/maps/search/Bar+Txepetxa+San+Sebastian' },
        { icon: '🔥', time: '20:30', name: 'Borda Berri', note: 'Hot pintxos: txistorra and rabo de toro', maps: 'https://www.google.com/maps/search/Borda+Berri+San+Sebastian' },
        { icon: '🍰', time: '21:00', name: 'La Vina', note: 'Finish with Basque burnt cheesecake', maps: 'https://www.google.com/maps/search/La+Vina+San+Sebastian' },
      ],
    },
    {
      id: 'sitdown',
      label: 'Sit-Down',
      title: 'Dinner Alternative',
      items: [
        { icon: '🍽️', time: '20:00', name: 'Narru', note: 'Modern Basque tasting menu, reserve in advance', maps: 'https://www.google.com/maps/search/Narru+San+Sebastian' },
        { icon: '🐟', time: '20:15', name: 'Kokotxa', note: 'Seafood-forward Basque classics in old town', maps: 'https://www.google.com/maps/search/Restaurante+Kokotxa+San+Sebastian' },
        { icon: '🥢', time: '20:30', name: 'Xiu', note: 'Asian-Basque fusion in Gros if you want variety', maps: 'https://maps.app.goo.gl/ztrjMn9jgCZLPZwe6' },
      ],
    },
  ],
  2: [
    {
      id: 'brunch',
      label: 'Brunch',
      title: 'On The Way To Zumaia',
      items: [
        { icon: '🥪', time: '09:15', name: 'Old Town San Sebastian Cafes', note: 'Quick sandwiches + coffee before checkout', maps: 'https://www.google.com/maps/search/breakfast+old+town+San+Sebastian' },
        { icon: '🍳', time: '10:00', name: 'Zumaia Seafront Bars', note: 'Light brunch near Itzurun beach', maps: 'https://www.google.com/maps/search/brunch+Zumaia+beach' },
      ],
    },
    {
      id: 'lunch',
      label: 'Lunch',
      title: 'Bilbao + Market Bites',
      items: [
        { icon: '🏛️', time: '13:00', name: 'Mercado de la Ribera', note: 'Pintxos and local produce stalls', maps: 'https://www.google.com/maps/search/Mercado+de+la+Ribera+Bilbao' },
        { icon: '🥘', time: '13:45', name: 'Cafe Iruña', note: 'Classic dining room, cod and tapas', maps: 'https://www.google.com/maps/search/Cafe+Iruna+Bilbao' },
      ],
    },
    {
      id: 'dinner',
      label: 'Dinner',
      title: 'Santander Before Chateau',
      items: [
        { icon: '🦑', time: '19:00', name: 'El Macho', note: 'Rabas and fish before heading to the hotel', maps: 'https://www.google.com/maps/search/El+Macho+Santander+Calle+Hernan+Cortes' },
        { icon: '🍷', time: '19:30', name: 'Bodega del Riojano', note: 'Traditional Cantabrian menu in central Santander', maps: 'https://www.google.com/maps/search/Bodega+del+Riojano+Santander' },
      ],
    },
  ],
  3: [
    {
      id: 'breakfast',
      label: 'Breakfast',
      title: 'Before The Mountains',
      items: [
        { icon: '🥐', time: '08:00', name: 'Santander Bakery Stop', note: 'Grab pastries to-go before heading inland', maps: 'https://www.google.com/maps/search/bakery+Sancibrian+Cantabria' },
        { icon: '☕', time: '09:40', name: 'Fuente De Base Cafe', note: 'Coffee at cable-car base while waiting', maps: 'https://www.google.com/maps/search/Fuente+De+cafe' },
      ],
    },
    {
      id: 'lunch',
      label: 'Lunch',
      title: 'Potes Comfort Food',
      items: [
        { icon: '🥘', time: '13:15', name: 'Casa Cayo', note: 'Cocido lebaniego + mountain views', maps: 'https://www.google.com/maps/search/Casa+Cayo+Potes+Spain' },
        { icon: '🧀', time: '13:45', name: 'Restaurante del Oso', note: 'Cheese tasting and local specialties', maps: 'https://www.google.com/maps/search/Restaurante+del+Oso+Potes' },
      ],
    },
    {
      id: 'dinner',
      label: 'Dinner',
      title: 'Asturian Night',
      items: [
        { icon: '🥩', time: '20:00', name: 'Sidreria La Caldera', note: 'Share one cachopo and sidra', maps: 'https://www.google.com/maps/search/Sidreria+La+Caldera+Cangas+de+Onis' },
        { icon: '🌾', time: '20:30', name: 'El Molin de Mingo', note: 'Fabada and cod in old mill setting', maps: 'https://www.google.com/maps/search/El+Molin+de+Mingo+Arriondas' },
      ],
    },
  ],
  4: [
    {
      id: 'coffee',
      label: 'Coffee',
      title: 'Comillas Morning',
      items: [
        { icon: '☕', time: '09:15', name: 'Comillas Plaza Cafes', note: 'Fast coffee before Gaudi stop', maps: 'https://www.google.com/maps/search/cafe+Comillas+Spain' },
        { icon: '🥯', time: '09:45', name: 'Panaderia De Comillas', note: 'Bakery grab-and-go for the road', maps: 'https://www.google.com/maps/search/panaderia+Comillas' },
      ],
    },
    {
      id: 'lunch',
      label: 'Lunch',
      title: 'Seafood Near Santillana',
      items: [
        { icon: '🦐', time: '13:00', name: 'El Carel', note: 'Rabas + shellfish with reliable execution', maps: 'https://www.google.com/maps/search/El+Carel+Comillas' },
        { icon: '🐟', time: '13:30', name: 'La Lonja', note: 'Sea-view fish lunch before airport stretch', maps: 'https://www.google.com/maps/search/La+Lonja+Comillas' },
      ],
    },
    {
      id: 'farewell',
      label: 'Farewell',
      title: 'Last Dinner In Santander',
      items: [
        { icon: '🥂', time: '18:30', name: 'El Macho - Farewell Round', note: 'Final seafood table before car return', maps: 'https://www.google.com/maps/search/El+Macho+Santander' },
        { icon: '🛍️', time: '19:15', name: 'Anchoas Gift Stop', note: 'Pick up tinned anchoas before airport', maps: 'https://www.google.com/maps/search/anchoas+Santander+deli' },
      ],
    },
  ],
}

const BOOKING_ORDER = ['spain-out', 'car', 'hotel1', 'hotel2', 'hotel3', 'spain-return']
const STORAGE_KEYS = {
  mood: 'spain-app-mood-theme',
  playlist: 'spain-app-collab-playlist',
  emergency: 'spain-app-emergency-checklist',
}

const MOOD_THEMES = [
  { id: 'postcard', name: 'Postcard', emoji: '🧳', line: 'Soft lilac and sea-glass calm.' },
  { id: 'sunset', name: 'Sunset Glow', emoji: '🌇', line: 'Warm coral evenings and golden light.' },
  { id: 'coast', name: 'Cantabrian Coast', emoji: '🌊', line: 'Sea breeze tones and bright skies.' },
  { id: 'nightdrive', name: 'Night Drive', emoji: '🌙', line: 'Deep twilight and neon route vibes.' },
]

const EMERGENCY_CONTACTS = [
  { label: 'Emergency services (Spain)', value: '112', href: 'tel:112' },
  { label: 'Police (Spain)', value: '091', href: 'tel:091' },
  { label: 'Roadside support (Avis Europe)', value: '+34 91 594 83 40', href: 'tel:+34915948340' },
  { label: 'UK emergency overseas support', value: '+44 20 7008 5000', href: 'tel:+442070085000' },
]

const EMERGENCY_ACTIONS = [
  { id: 'hospitals', label: 'Nearest hospital', href: 'https://www.google.com/maps/search/hospital+near+me' },
  { id: 'pharmacy', label: 'Open pharmacy', href: 'https://www.google.com/maps/search/farmacia+abierta+near+me' },
  { id: 'police', label: 'Nearest police station', href: 'https://www.google.com/maps/search/policia+near+me' },
  { id: 'service', label: 'Nearest fuel station', href: 'https://www.google.com/maps/search/gasolinera+near+me' },
]

const EMERGENCY_CHECKLIST_ITEMS = [
  { id: 'passports', label: 'Passports in day bag' },
  { id: 'insurance', label: 'Insurance policy screenshot saved' },
  { id: 'bookingRefs', label: 'Key booking refs available offline' },
  { id: 'carDocs', label: 'Car rental papers + return details ready' },
  { id: 'meds', label: 'Essential meds packed in carry bag' },
]

function readStorageJSON(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeStorageJSON(key, value) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore write failures (private mode / storage disabled)
  }
}

function isValidUrl(value) {
  if (!value) return false
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function buildGoogleSearchLink(query) {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`
}

function getStopFoodOptions(stop) {
  const existing = stop.food.filter(item => item && item.name)
  if (existing.length >= 2) return existing

  const fallbacks = [
    {
      name: `${stop.name} Market Stop`,
      note: 'Quick local bites and coffee nearby.',
      icon: '🥪',
      maps: buildGoogleSearchLink(`${stop.name} market Spain`),
    },
    {
      name: `${stop.name} Casual Restaurant`,
      note: 'Reliable sit-down option with local dishes.',
      icon: '🍽️',
      maps: buildGoogleSearchLink(`${stop.name} restaurant Spain`),
    },
  ]

  return [...existing, ...fallbacks].slice(0, 2)
}

function randomOtherIndex(current, total) {
  if (total <= 1) return 0
  let next = current
  while (next === current) {
    next = Math.floor(Math.random() * total)
  }
  return next
}

function wmoLabel(code) {
  if (code === 0) return { icon: '☀️', label: 'Sunny' }
  if (code <= 3) return { icon: '⛅', label: 'Partly cloudy' }
  if (code <= 48) return { icon: '🌫️', label: 'Foggy' }
  if (code <= 55) return { icon: '🌦️', label: 'Drizzle' }
  if (code <= 65) return { icon: '🌧️', label: 'Rain' }
  if (code <= 75) return { icon: '❄️', label: 'Snow' }
  if (code <= 82) return { icon: '🌦️', label: 'Showers' }
  if (code <= 99) return { icon: '⛈️', label: 'Storm' }
  return { icon: '🌤️', label: '' }
}

const FLOAT_ITEMS = [
  { content: '🇸🇬', size: 1.1 },
  { content: '🇬🇧', size: 1.1 },
  { content: '✈️', size: 1.0 },
  { content: '🚗', size: 0.9 },
  { content: '🗺️', size: 1.0 },
  { content: '🇪🇸', size: 0.85 },
  { content: '●', size: 0.7, color: '#86BC24' },
  { content: '🇬🇧', size: 0.9 },
  { content: '✈️', size: 0.85 },
  { content: '🚗', size: 1.0 },
  { content: '●', size: 0.6, color: '#86BC24' },
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
            left: `${(i * 8.2 + 3) % 97}%`,
            animationDuration: `${9 + (i * 1.81) % 9}s`,
            animationDelay: `${(i * 1.37) % 12}s`,
            fontSize: `${item.size}rem`,
            color: item.color ?? undefined,
          }}
        >
          {item.content}
        </span>
      ))}
    </div>
  )
}

function Splash({ onEnter }) {
  const stars = Array.from({ length: 34 }, (_, i) => ({
    left: `${(i * 2.9 + 3) % 95}%`,
    top: `${(i * 5.7 + 2) % 92}%`,
    dur: `${1.3 + (i * 0.31) % 2.5}s`,
    delay: `${(i * 0.27) % 4}s`,
    size: `${1.5 + (i % 5) * 0.4}px`,
  }))

  return (
    <div className="splash">
      <div className="splash-stars" aria-hidden="true">
        {stars.map((s, i) => (
          <div
            key={i}
            className="splash-star"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDuration: s.dur,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>

      <div className="splash-cake">🥘</div>
      <h1 className="splash-title"><em>España</em> ✈</h1>
      <div className="splash-sub">northern spain road trip</div>
      <div className="splash-date">5 - 8 May 2026</div>

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

function HomeScreen({ onJumpToDay }) {
  const { d, h, m, s, gone } = useCountdown('2026-05-05T06:00:00Z')
  const [weather, setWeather] = useState(null)
  const [wxError, setWxError] = useState(false)
  const [jokeIndex, setJokeIndex] = useState(() => Math.floor(Math.random() * TRAVEL_JOKES.length))

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
              day: loc.day,
              name: loc.name,
              max: Math.round(j.daily.temperature_2m_max[0]),
              min: Math.round(j.daily.temperature_2m_min[0]),
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
  const cycleJoke = () => setJokeIndex(prev => randomOtherIndex(prev, TRAVEL_JOKES.length))

  return (
    <div className="screen">
      <div className="home-hero">
        <div className="home-hero-hand">road trip · northern spain</div>
        <div className="home-hero-title"><em>España</em> ✈</div>
        <div className="home-hero-date">5 - 8 May 2026</div>
      </div>

      <div className="screen-body">
        <div className="countdown-card">
          <div className="countdown-label">
            {gone ? '🎉 trip in progress!' : '✈️ RK2612 departs Stansted in...'}
          </div>
          {!gone && (
            <div className="countdown-blocks">
              <div className="cnt-block"><div className="cnt-num">{d}</div><div className="cnt-label">days</div></div>
              <div className="cnt-colon">:</div>
              <div className="cnt-block"><div className="cnt-num">{pad(h)}</div><div className="cnt-label">hrs</div></div>
              <div className="cnt-colon">:</div>
              <div className="cnt-block"><div className="cnt-num">{pad(m)}</div><div className="cnt-label">min</div></div>
              <div className="cnt-colon">:</div>
              <div className="cnt-block"><div className="cnt-num">{pad(s)}</div><div className="cnt-label">sec</div></div>
            </div>
          )}
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.05rem', color: 'var(--teal)', marginBottom: 9 }}>
            🌤️ May forecast
          </div>
          {wxError ? (
            <div className="weather-loading">could not load forecast - check back online</div>
          ) : !weather ? (
            <div className="weather-loading">fetching the forecast... ✦</div>
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

        <button className="trip-note trip-joke-box" onClick={cycleJoke}>
          <div className="trip-note-text">“{TRAVEL_JOKES[jokeIndex]}”</div>
          <div className="trip-note-sign">tap for another random celebrity quote ✦</div>
        </button>

        <div className="card">
          <div className="card-header">
            <div className="card-label">the plan</div>
            <div className="card-title">4 days · 15 stops · Northern Spain</div>
            <div className="card-note">Basque Country → Cantabria → Picos de Europa → Asturias</div>
          </div>
          <div className="card-body">
            {DAYS.map((day, i) => (
              <button
                key={day.id}
                onClick={() => onJumpToDay(day.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '8px 0',
                  width: '100%',
                  textAlign: 'left',
                  borderBottom: i < DAYS.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
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
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function RouteScreen({
  currentStop,
  setCurrentStop,
  driverByStop,
  setDriverForStop,
}) {
  const stop = STOPS[currentStop]
  const nextStop = currentStop < STOPS.length - 1 ? STOPS[currentStop + 1] : null
  const dayData = DAYS.find(d => d.id === stop.day)
  const driver = driverByStop[stop.id] ?? 'boy'
  const [randomizingDriver, setRandomizingDriver] = useState(false)
  const [arrowDirection, setArrowDirection] = useState('right')
  const [animationPreset, setAnimationPreset] = useState(0)
  const touchStartX = useRef(null)
  const swipeThreshold = 40

  const goPrev = () => {
    if (currentStop > 0) setCurrentStop(c => c - 1)
  }
  const goNext = () => {
    if (currentStop < STOPS.length - 1) setCurrentStop(c => c + 1)
  }

  const handleSwipeStart = e => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null
  }
  const handleSwipeEnd = e => {
    if (touchStartX.current == null) return
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current
    const delta = endX - touchStartX.current
    if (Math.abs(delta) > swipeThreshold) {
      if (delta < 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
  }

  const driverLabel = () => {
    if (randomizingDriver) return <>choosing driver...</>
    if (driver === 'boy') return <><strong style={{ color: 'var(--teal)' }}>his</strong> turn to drive</>
    return <><strong style={{ color: 'var(--lilac)' }}>her</strong> turn to drive</>
  }

  const randomizeDriver = () => {
    setRandomizingDriver(true)
    let count = 0
    const intervalId = setInterval(() => {
      count += 1
      setArrowDirection(prev => (prev === 'right' ? 'left' : 'right'))
      if (count > 9) {
        clearInterval(intervalId)
      }
    }, 90)

    setTimeout(() => {
      setDriverForStop(stop.id, Math.random() < 0.5 ? 'boy' : 'girl')
      setRandomizingDriver(false)
    }, 950)
  }

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowRight' && currentStop < STOPS.length - 1) setCurrentStop(c => c + 1)
      if (e.key === 'ArrowLeft' && currentStop > 0) setCurrentStop(c => c - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentStop, setCurrentStop])

  const foods = getStopFoodOptions(stop)
  const stopTime = STOP_TIME_WINDOWS[stop.id] ?? 'Anytime'
  const animationClass = `car-anim-${CAR_ANIMATION_PRESETS[animationPreset]}`

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-eyebrow">the journey</div>
        <div className="screen-title">Our <em>Route</em></div>
      </div>

      <div className="screen-body">
        <div
          onTouchStart={handleSwipeStart}
          onTouchEnd={handleSwipeEnd}
          onKeyDown={e => {
            if (e.key === 'ArrowRight') goNext()
            if (e.key === 'ArrowLeft') goPrev()
          }}
          tabIndex={0}
          className="route-swipe-zone"
        >
          <div className="route-svg-container">
            <RouteAnimation currentStop={currentStop} />
          </div>
          <div className="route-banner">
            <span className="route-banner-stop">{stop.emoji} <strong>{stop.name}</strong></span>
            <span className="route-time-pill">{stopTime}</span>
            {nextStop && (
              <>
                <span className="route-banner-arrow">→</span>
                <span className="route-banner-stop">{nextStop.emoji} {nextStop.name}</span>
              </>
            )}
            {!nextStop && <span style={{ fontFamily: 'var(--font-hand)', color: 'var(--muted)' }}>Hasta luego! 🎉</span>}
          </div>
        </div>

        <div className="stop-nav-bar">
          <button className="stop-btn" onClick={goPrev} disabled={currentStop === 0} aria-label="Previous stop">◀</button>
          <div className="stop-nav-center">
            <div className="stop-counter">Stop {currentStop + 1} of {STOPS.length}</div>
            <div className="stop-day-pill" style={{ background: dayData?.colorLight, color: dayData?.color }}>
              {dayData?.date}
            </div>
            <div className="stop-dots">
              {STOPS.map(s => (
                <button
                  key={s.id}
                  className={`stop-dot${s.id === currentStop ? ' active' : s.id < currentStop ? ' visited' : ''}`}
                  style={s.id === currentStop ? { background: dayData?.color, borderColor: dayData?.color } : {}}
                  onClick={() => setCurrentStop(s.id)}
                  aria-label={s.name}
                />
              ))}
            </div>
          </div>
          <button className="stop-btn" onClick={goNext} disabled={currentStop === STOPS.length - 1} aria-label="Next stop">▶</button>
        </div>

        <div className={`car-panel ${animationClass}`} onClick={() => setAnimationPreset(prev => (prev + 1) % CAR_ANIMATION_PRESETS.length)}>
          <TaigoSVG driver={driver} />
          <div className="driver-strip">
            <button
              className={`driver-face driver-picker ${driver === 'girl' ? 'driving' : ''}`}
              onClick={e => { e.stopPropagation(); setDriverForStop(stop.id, 'girl') }}
              title="Set her as driver"
            >
              👩🏽
            </button>
            <button
              className={`driver-random ${randomizingDriver ? 'busy' : ''}`}
              onClick={e => { e.stopPropagation(); randomizeDriver() }}
              title="Randomly choose driver"
            >
              <span className={`driver-random-arrow ${arrowDirection}`}>↔</span>
              Random
            </button>
            <button
              className={`driver-face driver-picker ${driver === 'boy' ? 'driving' : ''}`}
              onClick={e => { e.stopPropagation(); setDriverForStop(stop.id, 'boy') }}
              title="Set him as driver"
            >
              👨🏽
            </button>
          </div>
          <div className="driver-label-text">{driverLabel()}</div>
          <div className="car-panel-hint">tap car box to cycle animations</div>
        </div>

        <div
          className="stop-detail-card route-swipe-zone"
          onTouchStart={handleSwipeStart}
          onTouchEnd={handleSwipeEnd}
          onKeyDown={e => {
            if (e.key === 'ArrowRight') goNext()
            if (e.key === 'ArrowLeft') goPrev()
          }}
          tabIndex={0}
        >
          <div className="stop-detail-header">
            <div className="stop-emoji-big">{stop.emoji}</div>
            <div className="stop-region-tag">{stop.region} · Day {stop.day} · {stopTime}</div>
            <div className="stop-name-big">{stop.name}</div>
            <div className="stop-desc-text">{stop.desc}</div>
          </div>

          <div className="stop-detail-body">
            {stop.detail && <div className="stop-tip-block">💡 {stop.detail}</div>}

            <div>
              <div className="food-section-label">🍽 eat &amp; drink nearby</div>
              <div className="food-items">
                {foods.map((f, i) => (
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

            <a href={stop.gmaps} target="_blank" rel="noopener noreferrer" className="maps-btn">
              🗺 Navigate to {stop.name}
            </a>

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

function DaysScreen({ openDay, setOpenDay }) {
  const [mealTabByDay, setMealTabByDay] = useState(() => (
    Object.fromEntries(DAYS.map(day => [day.id, DAY_MEAL_OPTIONS[day.id]?.[0]?.id ?? 'default']))
  ))

  const setMealTab = (dayId, tabId) => {
    setMealTabByDay(prev => ({ ...prev, [dayId]: tabId }))
  }

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
            const dayStops = day.stopIds.map(id => STOPS[id])
            const mapsRoute = 'https://www.google.com/maps/dir/' + dayStops.map(s => encodeURIComponent(`${s.name}, Spain`)).join('/')
            const mealTabs = DAY_MEAL_OPTIONS[day.id] ?? []
            const activeMealId = mealTabByDay[day.id] ?? mealTabs[0]?.id
            const activeMeal = mealTabs.find(tab => tab.id === activeMealId) ?? mealTabs[0]

            return (
              <div key={day.id} className={`day-big-card${isOpen ? ' open' : ''}`}>
                <div
                  className="day-card-top"
                  onClick={() => setOpenDay(isOpen ? null : day.id)}
                  role="button"
                  aria-expanded={isOpen}
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
                    <a href={mapsRoute} target="_blank" rel="noopener noreferrer" className="day-route-btn" style={{ marginTop: 14 }}>
                      🗺 Open full day route in Maps
                    </a>

                    <div style={{ marginTop: 10 }}>
                      {day.stopIds.map(id => {
                        const s = STOPS[id]
                        const stopTime = STOP_TIME_WINDOWS[s.id] ?? 'Anytime'
                        return (
                          <div key={id} className="day-stop-row">
                            <span className="day-stop-emoji">{s.emoji}</span>
                            <div style={{ flex: 1 }}>
                              <div className="day-stop-name">{s.name}</div>
                              <div className="day-stop-desc">{s.desc}</div>
                            </div>
                            <span className="day-stop-time-pill">{stopTime}</span>
                            <a
                              href={s.gmaps}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: '1.1rem', flexShrink: 0, opacity: 0.6, paddingTop: 2 }}
                              title="Directions"
                            >
                              📍
                            </a>
                          </div>
                        )
                      })}
                    </div>

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

                    {mealTabs.length > 0 && (
                      <div className="pintxos-block">
                        <div className="pintxos-mode-toggle">
                          {mealTabs.map(tab => (
                            <button
                              key={tab.id}
                              className={`pintxos-mode-btn${activeMeal?.id === tab.id ? ' active' : ''}`}
                              onClick={() => setMealTab(day.id, tab.id)}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {activeMeal && (
                          <>
                            <div className="pintxos-title">{activeMeal.title}</div>
                            {activeMeal.items.map((item, i) => (
                              <div key={i} className="pintxos-item">
                                <div className="pintxos-time">{item.time}</div>
                                <div style={{ flex: 1 }}>
                                  <div className="pintxos-bar">{item.name}</div>
                                  <div className="pintxos-order">{item.note}</div>
                                  {item.maps && (
                                    <a href={item.maps} target="_blank" rel="noopener noreferrer" className="food-maps-link">
                                      📍 open in maps
                                    </a>
                                  )}
                                </div>
                                <span className="pintxos-icon">{item.icon}</span>
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

function InfoScreen() {
  const [phraseTab, setPhraseTab] = useState(PHRASE_GROUPS[0].id)
  const activePhrases = PHRASE_GROUPS.find(group => group.id === phraseTab) ?? PHRASE_GROUPS[0]
  const orderedBookings = [...BOOKINGS].sort((a, b) => BOOKING_ORDER.indexOf(a.id) - BOOKING_ORDER.indexOf(b.id))

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-eyebrow">the practicalities</div>
        <div className="screen-title">Trip <em>Info</em></div>
      </div>

      <div className="info-section">
        <div className="info-section-title">✈️ bookings &amp; refs</div>
        <div className="screen-body" style={{ paddingTop: 0, gap: 9 }}>
          {orderedBookings.map((b, i) => (
            <div
              key={b.id}
              className="booking-card"
              style={{ borderLeft: `4px solid ${i % 2 === 0 ? 'var(--lilac)' : 'var(--teal)'}` }}
            >
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

      <div className="info-section">
        <div className="info-section-title">💡 key tips</div>
        <div className="screen-body" style={{ paddingTop: 0 }}>
          <div className="tips-grid">
            {KEY_TIPS_REFRESHED.map((t, i) => (
              <div
                key={i}
                className="tip-chip"
                style={{
                  background: TIP_PASTEL_SWATCHES[i % TIP_PASTEL_SWATCHES.length].bg,
                  borderColor: TIP_PASTEL_SWATCHES[i % TIP_PASTEL_SWATCHES.length].border,
                }}
              >
                {(t.urgency === 'critical' || t.urgency === 'important') && (
                  <div className="tip-critical-badge">{t.urgency === 'critical' ? 'must do' : 'important'}</div>
                )}
                <div className="tip-chip-icon">{t.icon}</div>
                <div className="tip-chip-title">{t.title}</div>
                <div className="tip-chip-text">{t.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="info-section" style={{ paddingBottom: 32 }}>
        <div className="info-section-title">🗣️ spanish phrases</div>
        <div className="screen-body" style={{ paddingTop: 0 }}>
          <div className="pintxos-mode-toggle" style={{ marginTop: 0 }}>
            {PHRASE_GROUPS.map(group => (
              <button
                key={group.id}
                className={`pintxos-mode-btn${phraseTab === group.id ? ' active' : ''}`}
                onClick={() => setPhraseTab(group.id)}
              >
                {group.emoji} {group.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {activePhrases.items.map((p, i) => (
              <div key={i} className="phrase-card">
                <div className="phrase-es">{p.es}</div>
                <div className="phrase-en">{p.en}</div>
                <div className="phrase-phonetic">{p.phonetic}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ExtrasScreen({
  moodTheme,
  setMoodTheme,
  playlistUrl,
  setPlaylistUrl,
  emergencyChecks,
  onOpenEmergency,
}) {
  const completedChecks = Object.values(emergencyChecks).filter(Boolean).length

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-eyebrow">companion tools</div>
        <div className="screen-title">Trip <em>Extras</em></div>
      </div>

      <div className="screen-body">
        <section className="extras-block">
          <div className="extras-block-title">Mood themes</div>
          <div className="theme-grid">
            {MOOD_THEMES.map(theme => (
              <button
                key={theme.id}
                className={`theme-tile${moodTheme === theme.id ? ' active' : ''}`}
                onClick={() => setMoodTheme(theme.id)}
              >
                <div className="theme-tile-emoji">{theme.emoji}</div>
                <div className="theme-tile-name">{theme.name}</div>
                <div className="theme-tile-line">{theme.line}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="extras-block">
          <div className="extras-block-title">Collaborative playlist</div>
          <div className="playlist-card">
            <div className="playlist-line">
              Drop your Spotify collaborative playlist link here. It stays saved offline on this device.
            </div>
            <input
              className="extras-input"
              value={playlistUrl}
              placeholder="https://open.spotify.com/playlist/..."
              onChange={e => setPlaylistUrl(e.target.value)}
            />
            <div className="playlist-row">
              <button
                className="extras-btn"
                onClick={() => setPlaylistUrl('')}
              >
                Clear
              </button>
              <button
                className={`extras-btn open${isValidUrl(playlistUrl) ? '' : ' disabled'}`}
                disabled={!isValidUrl(playlistUrl)}
                onClick={() => window.open(playlistUrl, '_blank', 'noopener,noreferrer')}
              >
                Open playlist
              </button>
            </div>
          </div>
        </section>

        <section className="extras-block">
          <div className="extras-block-title">Emergency tools</div>
          <div className="playlist-card">
            <div className="playlist-line">
              Keep emergency essentials one tap away while driving.
            </div>
            <button className="extras-emergency-btn" onClick={onOpenEmergency}>
              Open SOS quick panel
            </button>
            <div className="extras-emergency-progress">
              Checklist done: {completedChecks}/{EMERGENCY_CHECKLIST_ITEMS.length}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function EmergencyPanel({
  open,
  onClose,
  playlistUrl,
  checks,
  onToggleCheck,
}) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = e => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="emergency-overlay" onClick={onClose} role="presentation">
      <div className="emergency-panel" onClick={e => e.stopPropagation()} role="dialog" aria-label="Emergency quick panel">
        <div className="emergency-head">
          <div>
            <div className="emergency-title">Emergency quick panel</div>
            <div className="emergency-sub">Offline-ready essentials for the road.</div>
          </div>
          <button className="emergency-close" onClick={onClose} aria-label="Close emergency panel">Close</button>
        </div>

        <div className="emergency-section">
          <div className="emergency-section-title">Call now</div>
          <div className="emergency-contacts">
            {EMERGENCY_CONTACTS.map(contact => (
              <a key={contact.label} href={contact.href} className="emergency-contact-row">
                <span>{contact.label}</span>
                <strong>{contact.value}</strong>
              </a>
            ))}
          </div>
        </div>

        <div className="emergency-section">
          <div className="emergency-section-title">Quick actions</div>
          <div className="emergency-actions">
            {EMERGENCY_ACTIONS.map(action => (
              <a key={action.id} href={action.href} target="_blank" rel="noopener noreferrer" className="emergency-action-btn">
                {action.label}
              </a>
            ))}
            <button
              className={`emergency-action-btn${isValidUrl(playlistUrl) ? '' : ' disabled'}`}
              disabled={!isValidUrl(playlistUrl)}
              onClick={() => window.open(playlistUrl, '_blank', 'noopener,noreferrer')}
            >
              Open collab playlist
            </button>
          </div>
        </div>

        <div className="emergency-section">
          <div className="emergency-section-title">Before you step out</div>
          <div className="emergency-checks">
            {EMERGENCY_CHECKLIST_ITEMS.map(item => (
              <label key={item.id} className="emergency-check-item">
                <input
                  type="checkbox"
                  checked={Boolean(checks[item.id])}
                  onChange={() => onToggleCheck(item.id)}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'route', icon: '🗺️', label: 'Route' },
  { id: 'days', icon: '📅', label: 'Days' },
  { id: 'qs', icon: '💬', label: '36 Qs' },
  { id: 'info', icon: '📋', label: 'Info' },
  { id: 'extras', icon: '✨', label: 'Extras' },
  { id: 'games', icon: '🎮', label: 'Games' },
]

export default function App() {
  const [splash, setSplash] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [currentStop, setCurrentStop] = useState(0)
  const [openDay, setOpenDay] = useState(1)
  const [driverByStop, setDriverByStop] = useState(() => (
    Object.fromEntries(STOPS.map(stop => [stop.id, stop.driver === 'girl' ? 'girl' : 'boy']))
  ))
  const [moodTheme, setMoodTheme] = useState(() => {
    const stored = readStorageJSON(STORAGE_KEYS.mood, 'postcard')
    return MOOD_THEMES.some(theme => theme.id === stored) ? stored : 'postcard'
  })
  const [playlistUrl, setPlaylistUrl] = useState(() => (
    readStorageJSON(STORAGE_KEYS.playlist, '')
  ))
  const [emergencyChecks, setEmergencyChecks] = useState(() => (
    readStorageJSON(STORAGE_KEYS.emergency, {})
  ))
  const [emergencyOpen, setEmergencyOpen] = useState(false)

  useEffect(() => {
    writeStorageJSON(STORAGE_KEYS.mood, moodTheme)
  }, [moodTheme])

  useEffect(() => {
    writeStorageJSON(STORAGE_KEYS.playlist, playlistUrl)
  }, [playlistUrl])

  useEffect(() => {
    writeStorageJSON(STORAGE_KEYS.emergency, emergencyChecks)
  }, [emergencyChecks])

  const setDriverForStop = (stopId, driver) => {
    setDriverByStop(prev => ({ ...prev, [stopId]: driver }))
  }

  const toggleEmergencyCheck = itemId => {
    setEmergencyChecks(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const jumpToDay = dayId => {
    setActiveTab('days')
    setOpenDay(dayId)
  }

  return (
    <div className="app" data-theme={moodTheme}>
      <FloatingItems />

      {splash && <Splash onEnter={() => setSplash(false)} />}

      {!splash && (
        <>
          <div className="app-desktop-layout">
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
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: 20,
                  fontFamily: 'var(--font-hand)',
                  fontSize: '0.8rem',
                  color: 'var(--muted)',
                  lineHeight: 1.65,
                }}
              >
                SG to UK to ES<br />
                5-8 May 2026
              </div>
            </aside>

            <main className="desktop-main">
              <div className="app-inner">
                <div className={`screen-pane${activeTab === 'home' ? ' active' : ''}`}>
                  <HomeScreen onJumpToDay={jumpToDay} />
                </div>
                <div className={`screen-pane${activeTab === 'route' ? ' active' : ''}`}>
                  <RouteScreen
                    currentStop={currentStop}
                    setCurrentStop={setCurrentStop}
                    driverByStop={driverByStop}
                    setDriverForStop={setDriverForStop}
                  />
                </div>
                <div className={`screen-pane${activeTab === 'days' ? ' active' : ''}`}>
                  <DaysScreen openDay={openDay} setOpenDay={setOpenDay} />
                </div>
                <div className={`screen-pane${activeTab === 'qs' ? ' active' : ''}`}><Questions /></div>
                <div className={`screen-pane${activeTab === 'info' ? ' active' : ''}`}><InfoScreen /></div>
                <div className={`screen-pane${activeTab === 'extras' ? ' active' : ''}`}>
                  <ExtrasScreen
                    moodTheme={moodTheme}
                    setMoodTheme={setMoodTheme}
                    playlistUrl={playlistUrl}
                    setPlaylistUrl={setPlaylistUrl}
                    emergencyChecks={emergencyChecks}
                    onOpenEmergency={() => setEmergencyOpen(true)}
                  />
                </div>
                <div className={`screen-pane${activeTab === 'games' ? ' active' : ''}`}><Games /></div>
              </div>
            </main>
          </div>

          <EmergencyPanel
            open={emergencyOpen}
            onClose={() => setEmergencyOpen(false)}
            playlistUrl={playlistUrl}
            checks={emergencyChecks}
            onToggleCheck={toggleEmergencyCheck}
          />

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
