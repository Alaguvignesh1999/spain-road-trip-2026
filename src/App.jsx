import { useState, useEffect, useRef } from 'react'
import TaigoSVG from './components/TaigoSVG.jsx'
import RouteAnimation from './components/RouteAnimation.jsx'
import RouteMap from './components/RouteMap.jsx'
import Questions from './components/Questions.jsx'
import Games from './components/Games.jsx'
import {
  STOPS, DAYS, BOOKINGS, PHRASES, WEATHER_LOCS,
} from './data/trip.js'

const TRAVEL_JOKES = [
  '"Whoever established the high road and how high it should be should be fired." - Sandra Bullock',
  '"Have you ever noticed that anybody driving slower than you is an idiot, and anyone going faster than you is a maniac?" - George Carlin',
  '"If I am not back in five minutes, just wait longer." - Ace Ventura, "Ace Ventura: Pet Detective"',
  '"I like my money where I can see it: hanging in my closet." - Carrie Bradshaw, "Sex and the City"',
  '"The suspense is terrible. I hope it will last." - Willy Wonka, "Willy Wonka & the Chocolate Factory"',
  '"Why do they call it rush hour when nothing moves?" - Robin Williams',
  '"Do not be so humble - you are not that great." - Golda Meir',
  '"If you cannot be kind, at least be vague." - Judith Martin',
  '"There is only one thing in the world worse than being talked about, and that is not being talked about." - Oscar Wilde, "The Picture of Dorian Gray"',
  '"Always forgive your enemies; nothing annoys them so much." - Oscar Wilde',
  '"Candy is dandy, but liquor is quicker." - Ogden Nash, "Reflections on Ice Breaking"',
  '"In real life, I assure you, there is no such thing as algebra." - Fran Lebowitz',
  '"Instant gratification takes too long." - Carrie Fisher',
  '"Accept who you are. Unless you are a serial killer." - Ellen DeGeneres',
  '"Whoever said that money cannot buy happiness, simply did not know where to go shopping." - Bo Derek',
  '"Before you criticize someone, walk a mile in their shoes. That way, you will be a mile from them, and you will have their shoes." - Jack Handey',
  '"I am not great at advice - can I interest you in a sarcastic comment?" - Chandler Bing, "Friends"',
  '"I am sick of following my dreams, man. I am just going to ask where they are going and hook up with them later." - Mitch Hedberg',
  '"I would love to stand here and talk with you ... but I am not going to." - Phil Connors, "Groundhog Day"',
  '"All you need is love. But a little chocolate now and then does not hurt." - Charles M. Schulz',
  '"People say that money is not the key to happiness, but I always figured if you have enough money, you can have a key made." - Joan Rivers',
  '"I am not offended by blonde jokes because I know I am not dumb ... and I also know that I am not blonde." - Dolly Parton',
  '"It is useless to try to hold a person to anything he says while he is madly in love, drunk, or running for office." - Shirley MacLaine',
  '"I remember it like it was yesterday. Of course, I do not really remember yesterday all that well." - Dory, "Finding Dory"',
  '"The trouble with having an open mind, of course, is that people will insist on coming along and trying to put things in it." - Terry Pratchett, "Diggers"',
  '"To call you stupid would be an insult to stupid people! I have known sheep that could outwit you. I have worn dresses with higher IQs." - Wanda, "A Fish Called Wanda"',
  '"Those people who think they know everything are a great annoyance to those of us who do." - Isaac Asimov',
  '"The reason I talk to myself is because I am the only one whose answers I accept." - George Carlin',
  '"I am not superstitious ... but I am a little stitious." - Michael Scott, "The Office"',
  '"Just taught my kids about taxes by eating 38% of their ice cream." - Conan OBrien',
  '"I am sure wherever my Dad is, he is looking down on us. He is not dead, just very condescending." - Jack Whitehall',
  '"Before you marry a person, you should first make them use a computer with slow Internet to see who they really are." - Will Ferrell',
  '"I would like to have a kid, but I am not sure I am ready to spend 10 years of my life constantly asking someone where his shoes are." - Damien Fahey',
  '"I want my children to have all the things I could not afford. Then I want to move in with them." - Phyllis Diller',
  '"My husband and I fell in love at first sight. Maybe I should have taken a second look." - Halley Reed, "Crimes and Misdemeanors"',
  '"When my kids become wild and unruly, I use a nice, safe playpen. When they are finished, I climb out." - Erma Bombeck',
  '"When I was a kid my parents moved a lot, but I always found them." - Rodney Dangerfield',
  '"As I learned from growing up, you do not mess with your grandmother." - Prince William',
  '"I am not insane. My mother had me tested." - Sheldon Cooper, "The Big Bang Theory"',
  '"I love being married. It is so great to find that one special person you want to annoy for the rest of your life." - Rita Rudner',
  '"Good parenting means investing in your childs future, which is why I am saving to buy mine a hoverboard someday." - Lin-Manuel Miranda',
  '"Everybody knows how to raise children, except the people who have them." - P. J. ORourke',
  '"When your children are teenagers, it is important to have a dog so that someone in the house is happy to see you." - Nora Ephron',
  '"You can kid the world, but not your sister." - Charlotte Gray',
  '"I generally avoid temptation unless I cannot resist it." - Mae West',
  '"There is no such thing as fun for the whole family." - Jerry Seinfeld',
  '"If you cannot get rid of the family skeleton, you may as well make it dance." - George Bernard Shaw, "Immaturity"',
  '"The other night I ate at a real nice family restaurant. Every table had an argument going." - George Carlin',
  '"The man who says his wife cannot take a joke, forgets that she took him." - Oscar Wilde',
  '"Love is blind but marriage is a real eye-opener." - Pauline Thomason',
  '"Happiness is having a large, loving, caring, close-knit family in another city." - George Burns',
  '"Everybody wants to save the Earth; nobody wants to help Mom do the dishes." - P. J. ORourke, "All the Trouble in the World"',
  '"The best way to get most husbands to do something is to suggest that perhaps they are too old to do it." - Shirley MacLaine',
  '"Love the trees until their leaves fall off, then encourage them to try again next year." - Chad Sugg',
  '"Death is natures way of saying, Your table is ready." - Robin Williams',
  '"Earth. You do not have to be crazy to live here, but it helps." - Ryan Howard, "The Office"',
  '"There is so much pollution in the air now that if it were not for our lungs there would be no place to put it all." - Robert Orben',
  '"For years, I thought the sun was a monster. I am here to tell you that it is not a monster. IT IS NOT A MONSTER!" - Howie, "The Benchwarmers"',
  '"Mother Nature does not care if you are having fun." - Larry Niven',
  '"There is no sunrise so beautiful that it is worth waking me up to see it." - Mindy Kaling, "Is Everyone Hanging Out Without Me?"',
  '"A day without sunshine is like, you know, night." - Steve Martin',
  '"Someone asked me, if I were stranded on a desert island what book would I bring: How to Build a Boat." - Steven Wright',
  '"I like long walks, especially when they are taken by people who annoy me." - Noel Coward',
  '"Never follow anyone elses path. Unless you are in the woods and you are lost and you see a path. Then by all means follow that path." - Ellen DeGeneres',
  '"It was so beautiful today that I only watched four hours of Law and Order in my apartment." - John Mulaney',
  '"My ability to turn good news into anxiety is rivaled only by my ability to turn anxiety into chin acne." - Tina Fey, "Bossypants"',
  '"Reality continues to ruin my life." - Bill Watterson, "The Complete Calvin and Hobbes"',
  '"Even if I wanted to go, my schedule would not allow it. 4:00, wallow in self pity; 4:30, stare into the abyss; 5:00, solve world hunger, tell no one; 5:30, Jazzercise; 6:30, dinner with me - I cannot cancel that again; 7:00, wrestle with my self-loathing... I am booked." - The Grinch, "How the Grinch Stole Christmas"',
  '"Sometimes you lie in bed at night and you do not have a single thing to worry about. That always worries me!" - Charlie Brown',
  '"When I am in social situations, I always hold onto my glass. It makes me feel comfortable and secure, and I do not have to shake hands." - Larry David',
  '"My friends tell me I have an intimacy problem. But they do not really know me." - Garry Shandling',
  '"People cannot drive you crazy if you do not give them the keys." - Mike Bechtle',
  '"People waste their time pondering whether a glass is half empty or half full. Me, I just drink whatever is in the glass." - Sophia Petrillo, "The Golden Girls"',
  '"Spend some time this weekend on home improvement; improve your attitude toward your family." - Bo Bennett',
  '"From the ages of 8-18, me and my family moved around a lot. Mostly we would just stretch, but occasionally one of us would actually get up to go to the fridge." - Jarod Kintz',
]

const DELOITTE_CEO_QUOTES = [
  '"Lets take a step back and look at the bigger picture."',
  '"We need to double-click into that."',
  '"Can we zoom out for a second?"',
  '"Lets align on this offline."',
  '"I want to pressure test that assumption."',
  '"Were solving for the client here."',
  '"Lets not boil the ocean."',
  '"We need a north star metric."',
  '"Lets ladder up to the strategic objective."',
  '"How does this tie back to value creation?"',
  '"Whats the data telling us?"',
  '"Do we have a clean cut of the data?"',
  '"Lets triangulate across sources."',
  '"We need a single source of truth."',
  '"Is that statistically significant?"',
  '"Whats the baseline here?"',
  '"Lets sense-check that number."',
  '"Can we normalize this?"',
  '"Whats driving the variance?"',
  '"We should benchmark against peers."',
  '"Lets circle back."',
  '"Can you take that as an action item?"',
  '"Lets take this offline."',
  '"Ill ping you on this."',
  '"Lets sync up quickly."',
  '"Can we park this for now?"',
  '"Just looping you in."',
  '"Adding you for visibility."',
  '"Lets close the loop."',
  '"Can you own this?"',
  '"We need to tell a compelling story."',
  '"Whats the narrative here?"',
  '"How do we position this?"',
  '"This needs to land well with the client."',
  '"Lets make it client-ready."',
  '"We need to sharpen the messaging."',
  '"Is this boardroom-ready?"',
  '"Whats the headline takeaway?"',
  '"We should lead with impact."',
  '"Lets make it more digestible."',
  '"Can we tighten this slide?"',
  '"This feels too wordy."',
  '"We need more white space."',
  '"Lets make the headline punchier."',
  '"Can we turn this into a visual?"',
  '"This chart is not landing."',
  '"We need a waterfall here."',
  '"Can we make it more MECE?"',
  '"The slide needs a clear takeaway."',
  '"Whats the so what?"',
  '"Lets break this down."',
  '"What are the key drivers?"',
  '"Lets structure the problem."',
  '"We should bucket this."',
  '"Lets take a hypothesis-driven approach."',
  '"What are the key levers?"',
  '"Lets map this out."',
  '"Whats the root cause?"',
  '"Lets unpack that."',
  '"Can we simplify this?"',
  '"Were under a tight timeline."',
  '"Lets move fast on this."',
  '"We need a quick turnaround."',
  '"Can we get a draft by EOD?"',
  '"Lets push this forward."',
  '"We need to accelerate."',
  '"This is high priority."',
  '"Lets keep the momentum going."',
  '"Were a bit behind here."',
  '"Lets hustle on this."',
  '"Ill give you back some time."',
  '"Lets be mindful of everyones time."',
  '"Any burning questions?"',
  '"Lets go around the room."',
  '"I want to open it up."',
  '"Lets take a temperature check."',
  '"Are we aligned?"',
  '"Does this resonate?"',
  '"Any pushback?"',
  '"Lets land this."',
  '"Theres something here."',
  '"This feels directionally right."',
  '"Were onto something."',
  '"Lets explore that further."',
  '"Theres an opportunity here."',
  '"Lets lean into this."',
  '"This could be powerful."',
  '"We should think about this more."',
  '"This is interesting."',
  '"Lets keep that in mind."',
  '"Lets circle back on that synergy."',
  '"We need to operationalize this."',
  '"Lets drive alignment across stakeholders."',
  '"We should socialize this internally."',
  '"Lets take a bottoms-up view."',
  '"We need to stress test the model."',
  '"Lets not lose sight of the north star."',
  '"Can we future-proof this?"',
  '"We need to unlock value here."',
  '"Lets make sure this is best-in-class."',
]

const QUOTE_PASTELS = [
  { bg: '#FDF2FF', border: '#E8C0F2' },
  { bg: '#FFF2E8', border: '#F4C4A1' },
  { bg: '#EEF7FF', border: '#B9D8F7' },
  { bg: '#ECFFF5', border: '#B7E7CD' },
  { bg: '#FFF8E6', border: '#F0D190' },
  { bg: '#F4F1FF', border: '#D0C0F7' },
  { bg: '#FFEFF4', border: '#F6BFD0' },
  { bg: '#EAFBFF', border: '#A7DAEA' },
  { bg: '#F1FFE9', border: '#C7E8A8' },
  { bg: '#FFF0EE', border: '#F1BEB7' },
  { bg: '#F0F9FF', border: '#B8E1F8' },
  { bg: '#F8F2EA', border: '#E2CBA9' },
  { bg: '#F0F5FF', border: '#BECDF7' },
  { bg: '#FAF0FF', border: '#DDBAF1' },
  { bg: '#ECFFF0', border: '#B5E6BE' },
  { bg: '#FFF4DB', border: '#EEC889' },
  { bg: '#EAF2FF', border: '#AFC4EE' },
  { bg: '#FFF0F9', border: '#EFC2DF' },
  { bg: '#EFFFEA', border: '#C6E5B1' },
  { bg: '#F2F0FF', border: '#C8BEF1' },
]

const QUOTE_PASTELS_NIGHT = [
  { bg: '#213149', border: '#3A577E' },
  { bg: '#2B2A3F', border: '#4A4670' },
  { bg: '#1F3646', border: '#3B627A' },
  { bg: '#2A3A34', border: '#4A685D' },
  { bg: '#3C321F', border: '#67562F' },
  { bg: '#2F2B47', border: '#51477A' },
  { bg: '#3E2737', border: '#6A4662' },
  { bg: '#1E3A43', border: '#3C6775' },
  { bg: '#2A3A2B', border: '#4F7051' },
  { bg: '#402A29', border: '#6E4A46' },
]

const QUOTE_PASTELS_DELOITTE_DAY = [
  { bg: '#F7F8FA', border: '#CAD3E0' },
  { bg: '#F2F7ED', border: '#86BC25' },
  { bg: '#EFF7FC', border: '#00A3E0' },
  { bg: '#F5F7FB', border: '#9FB4D6' },
  { bg: '#F2F4F7', border: '#AEB7C6' },
  { bg: '#F7FAF3', border: '#A3CD57' },
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
  { icon: '\u{1F39F}\uFE0F', urgency: 'critical', title: 'Book Fuente De Cable Car', text: 'Reserve online before departure day. Mountain weather changes fast and slots can fill early.' },
  { icon: '\u{1F373}', urgency: 'critical', title: 'Bar Nestor Timing', text: 'Put your name down before 18:50 if tortilla is a must. The queue moves quickly and portions are limited.' },
  { icon: '\u26FD', urgency: 'important', title: 'Fuel Before Return', text: 'Top up before the airport on Day 4 so Avis return is smooth and penalty-free.' },
  { icon: '\u{1F9E5}', urgency: 'important', title: 'Layer Up For Peaks', text: 'Pack a light jacket in the car each day. Fuente De and high viewpoints get windy even in May.' },
  { icon: '\u{1F17F}\uFE0F', urgency: 'important', title: 'San Sebastian Parking', text: 'Use Parking Kursaal and walk in. Driving into old-town streets wastes time.' },
  { icon: '\u{1F40C}', urgency: 'tip', title: 'N-621 Gorge Pace', text: 'Single-lane sections are normal. Keep calm, go steady, and use turnouts.' },
  { icon: '\u{1F9C0}', urgency: 'tip', title: 'Local Food Souvenirs', text: 'Grab anchoas, Cabrales cheese, and orujo as take-home gifts on route.' },
  { icon: '\u{1F307}', urgency: 'tip', title: 'Golden-Hour Stops', text: 'If timing slips, prioritize coast and mountain viewpoints around late afternoon for best light.' },
  { icon: '\u{1F4B3}', urgency: 'tip', title: 'Small Cash + Card', text: 'Most places take cards, but keep some euros for parking meters and tiny bars.' },
  { icon: '\u{1F6BB}', urgency: 'tip', title: 'Restroom Timing', text: 'At mountain sections, stop when you can. Facilities are sparse between villages.' },
  { icon: '\u{1F4F6}', urgency: 'important', title: 'Offline Maps Backup', text: 'Pre-download Santander, Picos, and San Sebastian zones in Google Maps.' },
  { icon: '\u{1F6D2}', urgency: 'tip', title: 'Supermarket Buffer', text: 'Grab water and snacks before long legs so hunger never dictates route choices.' },
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

const TIP_SWATCHES_NIGHT = [
  { bg: '#3C321F', border: '#7B6332' },
  { bg: '#3A2430', border: '#70435D' },
  { bg: '#203A49', border: '#3F6F86' },
  { bg: '#2C2847', border: '#514687' },
  { bg: '#233C31', border: '#48745E' },
  { bg: '#3F2B25', border: '#775243' },
  { bg: '#3A2443', border: '#6D4A80' },
  { bg: '#23354B', border: '#4E688A' },
]

const QUOTE_PASTELS_DELOITTE_NIGHT = [
  { bg: '#0E234C', border: '#00A3E0' },
  { bg: '#122952', border: '#86BC25' },
  { bg: '#10213F', border: '#4A5D85' },
  { bg: '#0B1B37', border: '#6E89B8' },
  { bg: '#132746', border: '#AAC0E1' },
  { bg: '#0F2747', border: '#5AC7EC' },
]

const TIP_SWATCHES_DELOITTE_DAY = [
  { bg: '#F8FAFD', border: '#00A3E0' },
  { bg: '#F3F8EE', border: '#86BC25' },
  { bg: '#F3F5F9', border: '#9EB4D6' },
  { bg: '#F7F8FA', border: '#BCC8D8' },
]

const TIP_SWATCHES_DELOITTE_NIGHT = [
  { bg: '#0E2245', border: '#86BC25' },
  { bg: '#112B57', border: '#00A3E0' },
  { bg: '#13284B', border: '#6A86B2' },
  { bg: '#0C1B36', border: '#9EB4D6' },
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

const DELOITTE_PHRASE_GROUPS = [
  {
    id: 'meeting',
    label: 'Meeting',
    emoji: '🧑‍💼',
    items: [
      { es: 'Empecemos la reunión', en: 'Let us start the meeting', phonetic: 'em-peh-SEH-mos lah reh-oo-nee-ON' },
      { es: '¿Podemos alinear objetivos?', en: 'Can we align on objectives?', phonetic: 'po-DEH-mos ah-lee-NEAR ob-heh-TEE-bos' },
      { es: 'Necesitamos una decisión hoy', en: 'We need a decision today', phonetic: 'neh-seh-see-TAH-mos OO-nah deh-see-SYON oy' },
      { es: 'Lo dejamos en el parking lot', en: 'Let us put this in the parking lot', phonetic: 'lo deh-HA-mos en el PAR-king lot' },
      { es: '¿Quién es el dueño de esta tarea?', en: 'Who owns this action item?', phonetic: 'kyen es el DWEH-nyo deh ES-tah tah-REH-ah' },
      { es: 'Volvemos a esto mañana', en: 'We will circle back tomorrow', phonetic: 'vol-BEH-mos ah ES-to ma-NYA-nah' },
      { es: '¿Puedes compartir la versión final?', en: 'Can you share the final version?', phonetic: 'PWEH-des kom-par-TEER lah ver-SYON fee-NAL' },
      { es: 'Buena síntesis ejecutiva', en: 'Great executive summary', phonetic: 'BWEH-nah SEEN-teh-sees eh-heh-koo-TEE-bah' },
    ],
  },
  {
    id: 'client',
    label: 'Client',
    emoji: '🤝',
    items: [
      { es: 'Gracias por su tiempo', en: 'Thank you for your time', phonetic: 'GRAH-syahs por soo tee-EM-po' },
      { es: 'Esto genera valor rápido', en: 'This creates value quickly', phonetic: 'ES-to heh-NEH-rah bah-LOR RAH-pee-doh' },
      { es: 'Nuestro enfoque es pragmático', en: 'Our approach is pragmatic', phonetic: 'NWES-tro en-FO-keh es prag-MAH-tee-koh' },
      { es: '¿Cuál es su principal riesgo?', en: 'What is your biggest risk?', phonetic: 'kwal es soo preen-see-PAL RYES-go' },
      { es: 'Podemos priorizar por impacto', en: 'We can prioritize by impact', phonetic: 'po-DEH-mos pree-oh-ree-SAR por eem-PAK-toh' },
      { es: 'Traemos una recomendación clara', en: 'We are bringing a clear recommendation', phonetic: 'trah-EH-mos OO-nah reh-koh-men-dah-SYON KLAH-rah' },
      { es: '¿Quieren una versión de una página?', en: 'Would you like a one-page version?', phonetic: 'KYEH-ren OO-nah ver-SYON deh OO-nah PA-hee-nah' },
      { es: 'Cerramos con próximos pasos', en: 'Let us close with next steps', phonetic: 'seh-RRA-mos kon PROK-see-mos PA-sos' },
    ],
  },
  {
    id: 'deck',
    label: 'Deck',
    emoji: '📊',
    items: [
      { es: 'Necesita más rigor', en: 'It needs more rigor', phonetic: 'neh-seh-SEE-tah mas ree-GOR' },
      { es: 'Simplifica el mensaje', en: 'Simplify the message', phonetic: 'seem-plee-FEE-kah el men-SAH-heh' },
      { es: 'Esa diapositiva está cargada', en: 'That slide is overloaded', phonetic: 'EH-sah dee-ah-poh-see-TEE-bah es-TAH kar-GAH-dah' },
      { es: 'Falta una historia clara', en: 'It needs a clearer storyline', phonetic: 'FAL-tah OO-nah ees-TO-ree-ah KLAH-rah' },
      { es: 'Añade una tabla resumen', en: 'Add a summary table', phonetic: 'ah-NYA-deh OO-nah TAH-blah reh-SOO-men' },
      { es: 'Esta versión ya está lista para comité', en: 'This version is ready for committee', phonetic: 'ES-tah ver-SYON yah es-TAH LEES-tah PA-rah koh-mee-TEH' },
      { es: '¿Tenemos una fuente para ese dato?', en: 'Do we have a source for that data?', phonetic: 'teh-NEH-mos OO-nah FWEN-teh PA-rah EH-seh DA-toh' },
      { es: 'Perfecto, lo mandamos al cliente', en: 'Perfect, we send it to the client', phonetic: 'per-FEK-toh lo man-DAH-mos al KLEE-en-teh' },
    ],
  },
  {
    id: 'travel',
    label: 'Travel Ops',
    emoji: '🛫',
    items: [
      { es: 'Vamos al hotel y retomamos temprano', en: 'Let us go to the hotel and restart early', phonetic: 'VAH-mos al oh-TEL ee reh-toh-MAH-mos tem-PRAH-noh' },
      { es: '¿Dónde está el recibo?', en: 'Where is the receipt?', phonetic: 'DON-deh es-TAH el reh-SEE-boh' },
      { es: 'Necesito Wi-Fi para mandar el deck', en: 'I need Wi-Fi to send the deck', phonetic: 'neh-seh-SEE-toh wee-fai PA-rah man-DAR el dek' },
      { es: 'Cinco minutos de pausa y seguimos', en: 'Five-minute break and then we continue', phonetic: 'SEEN-koh mee-NOO-tos deh PAW-sah ee seh-GEE-mos' },
      { es: '¿Hay un lugar tranquilo para una llamada?', en: 'Is there a quiet place for a call?', phonetic: 'eye oon loo-GAR tran-KEE-loh PA-rah OO-nah yah-MAH-dah' },
      { es: 'Subo esto al drive ahora', en: 'I will upload this to drive now', phonetic: 'SOO-boh ES-toh al DRAIV ah-OH-rah' },
      { es: 'Tomamos un café y seguimos con el plan', en: 'Coffee, then back to plan', phonetic: 'toh-MAH-mos oon kah-FEH ee seh-GEE-mos kon el plan' },
      { es: 'Buen cierre hoy, mañana ejecutamos', en: 'Strong close today, execution tomorrow', phonetic: 'bwen SYEH-rreh oy ma-NYA-nah eh-heh-koo-TAH-mos' },
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
  pitBest: 'spain-app-pit-stop-best',
  areWeThere: 'spain-app-are-we-there-count',
}

const MOOD_THEMES = [
  { id: 'postcard', name: 'Postcard', emoji: '\u{1F9F3}', line: 'Soft lilac and sea-glass calm.' },
  { id: 'sunset', name: 'Sunset Glow', emoji: '\u{1F307}', line: 'Warm coral evenings and golden light.' },
  { id: 'coast', name: 'Cantabrian Coast', emoji: '\u{1F30A}', line: 'Sea breeze tones and bright skies.' },
  { id: 'fiesta', name: 'Fiesta Pop', emoji: '\u{1F389}', line: 'Playful color bursts with bright energy.' },
]

const BASE_TABS = [
  { id: 'home', icon: '\u{1F3E0}', label: 'Home' },
  { id: 'route', icon: '\u{1F5FA}\uFE0F', label: 'Route' },
  { id: 'days', icon: '\u{1F4C5}', label: 'Days' },
  { id: 'qs', icon: '\u{1F4AC}', label: '36 Qs' },
  { id: 'info', icon: '\u{1F4CB}', label: 'Info' },
  { id: 'extras', icon: '\u2728', label: 'Extras' },
  { id: 'games', icon: '\u{1F3AE}', label: 'Games' },
]

const DELOITTE_TAB_LABELS = {
  home: 'Brief',
  route: 'Deploy',
  days: 'Plan',
  qs: 'Disco',
  info: 'Intel',
  extras: 'Ops',
  games: 'T-Build',
}

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

const FLIGHT_PASS_CARDS = [
  {
    id: 'london-spain',
    title: 'London to Spain',
    line: 'SQ317 LHR to SAN',
    departureIso: '2026-05-05T07:00:00+01:00',
    boarding: '06:20',
    terminal: 'LHR T2',
    gate: 'B12',
  },
  {
    id: 'spain-london',
    title: 'Spain to London',
    line: 'FR2613 SDR to STN',
    departureIso: '2026-05-08T21:40:00+02:00',
    boarding: '21:00',
    terminal: 'SDR T1',
    gate: 'A06',
  },
]

const ROUTE_REST_STOPS = [
  { id: 'rs-01', from: 0, to: 1, name: 'Castro Urdiales', svgX: 214, svgY: 66, note: 'Coffee + quick stretch' },
  { id: 'rs-12', from: 1, to: 2, name: 'Zarautz', svgX: 315, svgY: 84, note: 'Promenade espresso stop' },
  { id: 'rs-67', from: 6, to: 7, name: 'Panes', svgX: 124, svgY: 108, note: 'River valley fuel + break' },
  { id: 'rs-1112', from: 11, to: 12, name: 'Llanes', svgX: 80, svgY: 78, note: 'Beachside cafe pause' },
]

const LEG_DRIVE_HOURS = {
  '0-1': 1.8,
  '1-2': 1.7,
  '2-3': 0.7,
  '3-4': 0.8,
  '4-5': 1.3,
  '5-6': 0.3,
  '6-7': 2.0,
  '7-8': 0.3,
  '8-9': 0.4,
  '9-10': 0.8,
  '10-11': 0.5,
  '11-12': 1.8,
  '12-13': 0.4,
  '13-14': 0.5,
}

const DAY_ACCOMMODATION_DETAILS = {
  1: {
    name: 'Talo Urban Rooms',
    checkin: '15:00',
    address: 'Antonio Maria Labaien Kalea 14, 20009 Donostia',
    maps: 'https://www.google.com/maps/search/Talo+Urban+Rooms+San+Sebastian',
  },
  2: {
    name: 'Chateau La Roca',
    checkin: '21:00',
    address: 'Jose Maria de Pereda 6, Sancibrian, Cantabria',
    maps: 'https://www.google.com/maps/search/Chateau+La+Roca+Sancibrian',
  },
  3: {
    name: 'Hotel Cerro La Nina',
    checkin: '15:30',
    address: 'Calle Cerro La Nina s/n, 33556 Becena, Asturias',
    maps: 'https://www.google.com/maps/search/Hotel+Cerro+La+Nina+Becena',
  },
  4: {
    name: 'Airport transfer night',
    checkin: 'By 21:00',
    address: 'Santander Airport departure terminal',
    maps: 'https://www.google.com/maps/search/Santander+Airport+Departures',
  },
}

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

function getThemeCarEmoji({ villainMode, toneMode, moodTheme }) {
  if (villainMode) return toneMode === 'night' ? '\u{1F68C}' : '\u{1F695}'
  if (moodTheme === 'coast') return '\u{1F6E5}\uFE0F'
  if (moodTheme === 'sunset') return '\u{1F69A}'
  if (moodTheme === 'fiesta') return '\u{1F697}'
  return '\u{1F697}'
}

function wmoLabel(code) {
  if (code === 0) return { icon: '\u2600\uFE0F', label: 'Sunny' }
  if (code <= 3) return { icon: '\u26C5', label: 'Partly cloudy' }
  if (code <= 48) return { icon: '\u{1F32B}\uFE0F', label: 'Foggy' }
  if (code <= 55) return { icon: '\u{1F326}\uFE0F', label: 'Drizzle' }
  if (code <= 65) return { icon: '\u{1F327}\uFE0F', label: 'Rain' }
  if (code <= 75) return { icon: '\u2744\uFE0F', label: 'Snow' }
  if (code <= 82) return { icon: '\u{1F326}\uFE0F', label: 'Showers' }
  if (code <= 99) return { icon: '\u26C8\uFE0F', label: 'Storm' }
  return { icon: '\u{1F324}\uFE0F', label: '' }
}

function getDriveLegUrl(stopId) {
  if (stopId <= 0 || !STOPS[stopId - 1] || !STOPS[stopId]) return STOPS[stopId]?.gmaps ?? '#'
  const from = STOPS[stopId - 1].coords.join(',')
  const to = STOPS[stopId].coords.join(',')
  return `https://www.google.com/maps/dir/?api=1&origin=${from}&destination=${to}&travelmode=driving&dir_action=navigate`
}

async function fetchJSONWithTimeout(url, timeoutMs = 6000) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timeoutId)
  }
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

const VILLAIN_FLOAT_ITEMS = [
  { content: 'Deloitte.', size: 0.8, color: '#86BC24' },
  { content: 'synergy', size: 0.72, color: '#00A3E0' },
  { content: 'per the deck', size: 0.72, color: '#86BC24' },
  { content: '💻', size: 1.0 },
  { content: '📊', size: 1.0 },
  { content: '📈', size: 0.95 },
  { content: '🧾', size: 0.9 },
  { content: 'circle back', size: 0.68, color: '#00A3E0' },
  { content: 'bandwidth', size: 0.68, color: '#86BC24' },
  { content: '📎', size: 0.85 },
  { content: '🗂️', size: 0.9 },
  { content: '🖥️', size: 0.95 },
  { content: 'action item', size: 0.68, color: '#00A3E0' },
  { content: 'deep dive', size: 0.68, color: '#86BC24' },
  { content: 'pivot', size: 0.68, color: '#00A3E0' },
  { content: '📋', size: 0.9 },
  { content: '✏️', size: 0.85 },
  { content: '🧮', size: 0.86 },
]

function FloatingItems({ villainMode }) {
  const items = villainMode ? VILLAIN_FLOAT_ITEMS : FLOAT_ITEMS

  return (
    <div className="petals-layer" aria-hidden="true">
      {items.map((item, i) => (
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

function Splash({ onEnter, villainMode, moodTheme, toneMode }) {
  const stars = Array.from({ length: 34 }, (_, i) => ({
    left: `${(i * 2.9 + 3) % 95}%`,
    top: `${(i * 5.7 + 2) % 92}%`,
    dur: `${1.3 + (i * 0.31) % 2.5}s`,
    delay: `${(i * 0.27) % 4}s`,
    size: `${1.5 + (i % 5) * 0.4}px`,
  }))
  const confetti = Array.from({ length: 42 }, (_, i) => ({
    left: `${(i * 7.4 + 9) % 96}%`,
    delay: `${(i * 0.05).toFixed(2)}s`,
    dur: `${1.2 + (i % 5) * 0.16}s`,
    glyph: i % 2 === 0 ? '\u2B50' : '\u2665',
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

      <div className="splash-confetti" aria-hidden="true">
        {confetti.map((piece, i) => (
          <span
            key={i}
            className="splash-confetti-piece"
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              animationDuration: piece.dur,
            }}
          >
            {piece.glyph}
          </span>
        ))}
      </div>

      <div className="splash-cake">{villainMode ? '\u{1F4BC}' : '\u{1F958}'}</div>
      <h1 className="splash-title">
        <em>{villainMode ? 'Project' : 'Espana'}</em> {villainMode ? 'Espana' : '\u2708'}
      </h1>
      <div className="splash-sub">{villainMode ? 'deloitte engagement itinerary' : 'northern spain road trip'}</div>
      <div className="splash-date">5 - 8 May 2026</div>

      <div className="splash-taigo">
        <TaigoSVG
          driver="boy"
          villainMode={villainMode}
          toneMode={toneMode}
          moodTheme={moodTheme}
        />
      </div>

      <div className="splash-btn">
        <button className="wax-seal" onClick={onEnter} aria-label="Open trip guide">
          <span className="wax-seal-icon">{'\u2726'}</span>
          <span className="wax-seal-label">{villainMode ? 'Open deck' : 'Open'}</span>
        </button>
        <div className="splash-hint">{villainMode ? 'tap to open the engagement brief' : 'tap to open the guide'}</div>
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

function HomeScreen({ onJumpToDay, toneMode, villainMode }) {
  const { d, h, m, s, gone } = useCountdown('2026-05-05T06:00:00Z')
  const [weather, setWeather] = useState(null)
  const [wxError, setWxError] = useState(false)
  const quotePool = villainMode ? DELOITTE_CEO_QUOTES : TRAVEL_JOKES
  const [jokeIndex, setJokeIndex] = useState(() => Math.floor(Math.random() * quotePool.length))
  const [quoteToneIndex, setQuoteToneIndex] = useState(() => Math.floor(Math.random() * QUOTE_PASTELS.length))
  const [santanderNow, setSantanderNow] = useState(null)
  const [santanderNowError, setSantanderNowError] = useState(false)
  const quoteIntervalRef = useRef(null)

  useEffect(() => {
    async function loadForecast() {
      try {
        const results = await Promise.all(
          WEATHER_LOCS.map(async loc => {
            const url =
              `https://api.open-meteo.com/v1/forecast` +
              `?latitude=${loc.lat}&longitude=${loc.lon}` +
              `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
              `&timezone=Europe%2FMadrid` +
              `&start_date=${loc.date}&end_date=${loc.date}`
            const j = await fetchJSONWithTimeout(url, 6000)
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
    loadForecast()
  }, [])

  useEffect(() => {
    async function loadCurrentSantander() {
      try {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=43.4623&longitude=-3.8099&current_weather=true&timezone=Europe%2FMadrid'
        const j = await fetchJSONWithTimeout(url, 6000)
        if (!j.current_weather) return
        setSantanderNow({
          temp: Math.round(j.current_weather.temperature),
          code: j.current_weather.weathercode,
          ...wmoLabel(j.current_weather.weathercode),
        })
      } catch {
        setSantanderNowError(true)
      }
    }
    loadCurrentSantander()
  }, [])

  const quoteSwatches = villainMode
    ? toneMode === 'night'
      ? QUOTE_PASTELS_DELOITTE_NIGHT
      : QUOTE_PASTELS_DELOITTE_DAY
    : toneMode === 'night'
    ? QUOTE_PASTELS_NIGHT
    : QUOTE_PASTELS

  const pad = n => String(n).padStart(2, '0')
  const cycleJoke = (resetTimer = false) => {
    setJokeIndex(prev => randomOtherIndex(prev, quotePool.length))
    setQuoteToneIndex(prev => randomOtherIndex(prev, quoteSwatches.length))
    if (resetTimer && quoteIntervalRef.current) {
      clearInterval(quoteIntervalRef.current)
      quoteIntervalRef.current = setInterval(() => cycleJoke(false), 7000)
    }
  }

  useEffect(() => {
    setJokeIndex(prev => prev % quotePool.length)
    setQuoteToneIndex(prev => prev % quoteSwatches.length)
    if (quoteIntervalRef.current) clearInterval(quoteIntervalRef.current)
    quoteIntervalRef.current = setInterval(() => cycleJoke(false), 7000)
    return () => {
      if (quoteIntervalRef.current) clearInterval(quoteIntervalRef.current)
    }
  }, [quotePool.length, quoteSwatches.length])

  return (
    <div className="screen">
        <div className="home-hero">
        <div className="home-hero-hand">{villainMode ? 'engagement sprint · northern spain' : 'road trip · northern spain'}</div>
        <div className="home-hero-title"><em>{villainMode ? 'Project' : 'Espana'}</em> {villainMode ? 'Espana' : '✈'}</div>
        <div className="home-hero-date">5 - 8 May 2026</div>
      </div>

      <div className="screen-body">
        <div className="countdown-card">
          <div className="countdown-label">
            {gone ? '🎉 trip in progress!' : '✈ RK2612 departs Stansted in...'}
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

        <div className="flight-pass-grid">
          {FLIGHT_PASS_CARDS.map(flight => (
            <div key={flight.id} className="flight-pass-card">
              <div className="flight-pass-head">{flight.title}</div>
              <div className="flight-pass-route">{flight.line}</div>
              <div className="flight-pass-meta">Boarding {flight.boarding} · {flight.terminal} · Gate {flight.gate}</div>
            </div>
          ))}
        </div>

        <div className="weather-now-card">
          <div className="weather-now-title">Santander right now</div>
          {santanderNow ? (
            <div className="weather-now-body">
              <span className="weather-now-icon">{santanderNow.icon}</span>
              <div><strong>{santanderNow.temp}°C</strong> · {santanderNow.label}</div>
            </div>
          ) : santanderNowError ? (
            <div className="weather-now-body">Weather unavailable right now</div>
          ) : (
            <div className="weather-now-body">Fetching current weather...</div>
          )}
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.05rem', color: 'var(--teal)', marginBottom: 9 }}>
            May forecast
          </div>
          {wxError ? (
            <div className="weather-loading">could not load forecast - check back online</div>
          ) : !weather ? (
            <div className="weather-loading">fetching the forecast...</div>
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

        <button
          className="trip-note trip-joke-box"
          onClick={() => cycleJoke(true)}
          style={{
            background: quoteSwatches[quoteToneIndex % quoteSwatches.length].bg,
            borderColor: quoteSwatches[quoteToneIndex % quoteSwatches.length].border,
          }}
        >
          <div className="trip-note-text">{quotePool[jokeIndex % quotePool.length]}</div>
        </button>

        <div className="card">
          <div className="card-header">
            <div className="card-label">the plan</div>
            <div className="card-title">4 days · 15 stops · Northern Spain</div>
            <div className="card-note">Basque Country · Cantabria · Picos de Europa · Asturias</div>
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
  isActive,
  villainMode,
  toneMode,
  moodTheme,
}) {
  const stop = STOPS[currentStop]
  const nextStop = currentStop < STOPS.length - 1 ? STOPS[currentStop + 1] : null
  const dayData = DAYS.find(d => d.id === stop.day)
  const dayStops = dayData?.stopIds.map(id => STOPS[id]).filter(Boolean) ?? []
  const isCrossDayBoundary = nextStop ? nextStop.day !== stop.day : false
  const driver = driverByStop[stop.id] ?? 'boy'
  const [randomizingDriver, setRandomizingDriver] = useState(false)
  const [arrowDirection, setArrowDirection] = useState('right')
  const [animationPreset, setAnimationPreset] = useState(0)
  const [driverBurnout, setDriverBurnout] = useState(false)
  const [mapMode, setMapMode] = useState('cute')
  const [zoomTargetStopId, setZoomTargetStopId] = useState(null)
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

  const assignDriver = picked => {
    setDriverForStop(stop.id, picked)
    setDriverBurnout(true)
    window.setTimeout(() => setDriverBurnout(false), 740)
  }

  const randomizeDriver = () => {
    setRandomizingDriver(true)
    let count = 0
    const intervalId = setInterval(() => {
      count += 1
      setArrowDirection(prev => (prev === 'right' ? 'left' : 'right'))
      if (count > 9) clearInterval(intervalId)
    }, 90)

    setTimeout(() => {
      assignDriver(Math.random() < 0.5 ? 'boy' : 'girl')
      setRandomizingDriver(false)
    }, 950)
  }

  const selectStop = stopId => {
    setCurrentStop(stopId)
    setZoomTargetStopId(stopId)
    window.setTimeout(() => setZoomTargetStopId(null), 1100)
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
  const carEmoji = getThemeCarEmoji({ villainMode, toneMode, moodTheme })
  const driveLegUrl = getDriveLegUrl(stop.id)
  const legKey = stop.id > 0 ? `${stop.id - 1}-${stop.id}` : null
  const legHours = legKey ? LEG_DRIVE_HOURS[legKey] : null
  const legRest = legKey ? ROUTE_REST_STOPS.find(item => item.from === stop.id - 1 && item.to === stop.id) : null

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-eyebrow">{villainMode ? 'client delivery route' : 'the journey'}</div>
        <div className="screen-title">{villainMode ? <>Engagement <em>Route</em></> : <>Our <em>Route</em></>}</div>
      </div>

      <div className="screen-body">
        <div className="route-day-jump-tabs">
          {DAYS.map(day => {
            const startStopId = day.stopIds[0]
            const active = day.id === stop.day
            return (
              <button
                key={day.id}
                className={`route-day-jump-btn${active ? ' active' : ''}`}
                onClick={() => selectStop(startStopId)}
              >
                Day {day.id}
              </button>
            )
          })}
        </div>

        <div className="map-mode-toggle">
          <button className={`map-mode-btn${mapMode === 'cute' ? ' active' : ''}`} onClick={() => setMapMode('cute')}>Map</button>
          <button className={`map-mode-btn${mapMode === 'real' ? ' active' : ''}`} onClick={() => setMapMode('real')}>Real map</button>
        </div>

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
            {mapMode === 'cute' ? (
              <RouteAnimation
                currentStop={currentStop}
                onSelectStop={selectStop}
                zoomTargetStopId={zoomTargetStopId}
                restStops={ROUTE_REST_STOPS}
                carEmoji={carEmoji}
                villainMode={villainMode}
                toneMode={toneMode}
              />
            ) : (
              <RouteMap
                currentStop={currentStop}
                onSelectStop={selectStop}
                isActive={isActive}
                toneMode={toneMode}
                villainMode={villainMode}
                moodTheme={moodTheme}
                carEmoji={carEmoji}
              />
            )}
          </div>

          <div className="route-banner">
            <span className="route-banner-stop">{stop.emoji} <strong>{stop.name}</strong></span>
            <span className="route-time-pill">{stopTime}</span>
            {nextStop && !isCrossDayBoundary && (
              <>
                <span className="route-banner-arrow">→</span>
                <span className="route-banner-stop">{nextStop.emoji} {nextStop.name}</span>
              </>
            )}
            {isCrossDayBoundary && (
              <span style={{ fontFamily: 'var(--font-hand)', color: 'var(--muted)' }}>
                Day {stop.day} complete at {dayData?.hotel?.name ?? stop.name}
              </span>
            )}
            {!nextStop && <span style={{ fontFamily: 'var(--font-hand)', color: 'var(--muted)' }}>Hasta luego!</span>}
          </div>
        </div>

        <div className="stop-nav-bar">
          <button className="stop-btn" onClick={goPrev} disabled={currentStop === 0} aria-label="Previous stop">‹</button>
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
                  onClick={() => selectStop(s.id)}
                  aria-label={s.name}
                />
              ))}
            </div>
          </div>
          <button className="stop-btn" onClick={goNext} disabled={currentStop === STOPS.length - 1} aria-label="Next stop">›</button>
        </div>

        <div className="route-checklist-card">
          <div className="route-checklist-title">Day {stop.day} stop coverage check</div>
          <div className="route-checklist-items">
            {dayStops.map(s => (
              <button
                key={s.id}
                className={`route-checklist-item${s.id === currentStop ? ' active' : ''}`}
                onClick={() => selectStop(s.id)}
              >
                <span className="route-checklist-num">{s.id + 1}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`car-panel ${animationClass}`} onClick={() => setAnimationPreset(prev => (prev + 1) % CAR_ANIMATION_PRESETS.length)}>
          <TaigoSVG
            driver={driver}
            villainMode={villainMode}
            toneMode={toneMode}
            moodTheme={moodTheme}
          />
          <div className="driver-strip">
            <button
              className={`driver-face driver-picker ${driver === 'girl' ? 'driving' : ''}`}
              onClick={e => { e.stopPropagation(); assignDriver('girl') }}
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
              onClick={e => { e.stopPropagation(); assignDriver('boy') }}
              title="Set him as driver"
            >
              👨🏽
            </button>
          </div>
          <div className="driver-label-text">{driverLabel()}</div>
          <div className={`driver-burnout${driverBurnout ? ' active' : ''}`}>💨</div>
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
            {stop.id > 0 && (
              <a href={driveLegUrl} target="_blank" rel="noopener noreferrer" className="maps-btn drive-leg-btn">
                🚗 Drive this leg now
              </a>
            )}

            {legHours && (
              <div className="leg-meta-line">
                Approx drive: <strong>{legHours.toFixed(1)}h</strong>
                {legRest && <> · Rest stop: <strong>{legRest.name}</strong> ({legRest.note})</>}
              </div>
            )}

            {stop.detail && <div className="stop-tip-block">💡 {stop.detail}</div>}

            <div>
              <div className="food-section-label">🍴 eat &amp; drink nearby</div>
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
              🧭 Navigate to {stop.name}
            </a>

            {nextStop && !isCrossDayBoundary && (
              <a href={nextStop.gmaps} target="_blank" rel="noopener noreferrer" className="maps-btn-next">
                Continue → {nextStop.emoji} {nextStop.name}
              </a>
            )}
            {isCrossDayBoundary && dayData?.hotel?.name && (
              <div className="route-day-end-note">
                Day {stop.day} wrap-up: hotel stay at {dayData.hotel.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DaysScreen({ openDays, setOpenDays, villainMode, toneMode, moodTheme }) {
  const [mealTabByDay, setMealTabByDay] = useState(() => (
    Object.fromEntries(DAYS.map(day => [day.id, DAY_MEAL_OPTIONS[day.id]?.[0]?.id ?? 'default']))
  ))

  const setMealTab = (dayId, tabId) => {
    setMealTabByDay(prev => ({ ...prev, [dayId]: tabId }))
  }

  const toggleDayOpen = dayId => {
    setOpenDays(prev => (
      prev.includes(dayId) ? prev.filter(id => id !== dayId) : [...prev, dayId]
    ))
  }

  const getDayHeaderPalette = day => {
    if (villainMode) {
      return toneMode === 'night'
        ? { accent: '#86BC25', text: '#DFF0BF', bg: '#0C2344' }
        : { accent: '#002D72', text: '#0D2D58', bg: '#F2F6FB' }
    }

    if (toneMode === 'night') {
      const nightByTheme = {
        postcard: { accent: '#B79CFF', text: '#E5D9FF', bg: '#1D153C' },
        sunset: { accent: '#F4A772', text: '#FFD7B8', bg: '#2E1409' },
        coast: { accent: '#7ACBF4', text: '#D7EEFF', bg: '#0C2035' },
        fiesta: { accent: '#F49AC5', text: '#FFE0F1', bg: '#2A1021' },
      }
      return nightByTheme[moodTheme] ?? { accent: '#9EC6FF', text: '#E8F1FF', bg: '#1A2740' }
    }

    return { accent: day.color, text: day.color, bg: day.colorLight }
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-eyebrow">day by day</div>
        <div className="screen-title">{villainMode ? <>Delivery <em>Plan</em></> : <>The <em>Itinerary</em></>}</div>
      </div>

      <div className="screen-body">
        <div className="day-cards-list">
          {DAYS.map(day => {
            const isOpen = openDays.includes(day.id)
            const dayStops = day.stopIds.map(id => STOPS[id])
            const mapsRoute = 'https://www.google.com/maps/dir/' + dayStops.map(s => encodeURIComponent(`${s.name}, Spain`)).join('/')
            const mealTabs = DAY_MEAL_OPTIONS[day.id] ?? []
            const activeMealId = mealTabByDay[day.id] ?? mealTabs[0]?.id
            const activeMeal = mealTabs.find(tab => tab.id === activeMealId) ?? mealTabs[0]

            return (
              <div key={day.id} className={`day-big-card${isOpen ? ' open' : ''}`}>
                {(() => {
                  const palette = getDayHeaderPalette(day)
                  return (
                <div
                  className="day-card-top"
                  style={{ background: palette.bg }}
                  onClick={() => toggleDayOpen(day.id)}
                  role="button"
                  aria-expanded={isOpen}
                >
                  <div className="day-card-accent-bar" style={{ background: palette.accent }} />
                  <div className="day-card-top-text">
                    <div className="day-card-day" style={{ color: palette.text }}>
                      {day.emoji} {day.date} · {day.region}
                    </div>
                    <div className="day-card-title-big">{day.title}</div>
                    <div className="day-card-sub-text">{day.subtitle} · {day.drive}</div>
                  </div>
                  <span className="day-card-chevron" aria-hidden="true">▼</span>
                </div>
                  )
                })()}

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


                    {DAY_ACCOMMODATION_DETAILS[day.id] && (
                      <div className="day-accom-card">
                        <div className="day-accom-title">Night stay</div>
                        <div className="day-accom-name">{DAY_ACCOMMODATION_DETAILS[day.id].name}</div>
                        <div className="day-accom-line">Check-in: {DAY_ACCOMMODATION_DETAILS[day.id].checkin}</div>
                        <div className="day-accom-line">{DAY_ACCOMMODATION_DETAILS[day.id].address}</div>
                        <a className="day-accom-map" href={DAY_ACCOMMODATION_DETAILS[day.id].maps} target="_blank" rel="noopener noreferrer">
                          📍 View stay on map
                        </a>
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

function InfoScreen({ toneMode, villainMode }) {
  const [infoTab, setInfoTab] = useState('bookings')
  const phraseGroups = villainMode ? DELOITTE_PHRASE_GROUPS : PHRASE_GROUPS
  const [phraseTab, setPhraseTab] = useState(phraseGroups[0].id)
  useEffect(() => {
    setPhraseTab(phraseGroups[0].id)
  }, [villainMode])
  const activePhrases = phraseGroups.find(group => group.id === phraseTab) ?? phraseGroups[0]
  const orderedBookings = [...BOOKINGS].sort((a, b) => BOOKING_ORDER.indexOf(a.id) - BOOKING_ORDER.indexOf(b.id))
  const tipSwatches = villainMode
    ? toneMode === 'night'
      ? TIP_SWATCHES_DELOITTE_NIGHT
      : TIP_SWATCHES_DELOITTE_DAY
    : toneMode === 'night'
    ? TIP_SWATCHES_NIGHT
    : TIP_PASTEL_SWATCHES

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-eyebrow">{villainMode ? 'engagement details' : 'the practicalities'}</div>
        <div className="screen-title">{villainMode ? <>Project <em>Intel</em></> : <>Trip <em>Info</em></>}</div>
      </div>

      <div className="screen-body" style={{ paddingTop: 12, paddingBottom: 8 }}>
        <div className="pintxos-mode-toggle" style={{ marginTop: 0 }}>
          <button className={`pintxos-mode-btn${infoTab === 'bookings' ? ' active' : ''}`} onClick={() => setInfoTab('bookings')}>
            ✈️ Bookings & refs
          </button>
          <button className={`pintxos-mode-btn${infoTab === 'tips' ? ' active' : ''}`} onClick={() => setInfoTab('tips')}>
            💡 Key tips
          </button>
          <button className={`pintxos-mode-btn${infoTab === 'phrases' ? ' active' : ''}`} onClick={() => setInfoTab('phrases')}>
            🗣️ Spanish phrases
          </button>
        </div>
      </div>

      {infoTab === 'bookings' && (
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
      )}

      {infoTab === 'tips' && (
        <div className="info-section">
          <div className="info-section-title">💡 key tips</div>
          <div className="screen-body" style={{ paddingTop: 0 }}>
            <div className="tips-grid">
              {KEY_TIPS_REFRESHED.map((t, i) => (
                <div
                  key={i}
                  className="tip-chip"
                  style={{
                    background: tipSwatches[i % tipSwatches.length].bg,
                    borderColor: tipSwatches[i % tipSwatches.length].border,
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
      )}

      {infoTab === 'phrases' && (
        <div className="info-section" style={{ paddingBottom: 32 }}>
          <div className="info-section-title">🗣️ spanish phrases</div>
          <div className="screen-body" style={{ paddingTop: 0 }}>
            <div className="pintxos-mode-toggle" style={{ marginTop: 0 }}>
              {phraseGroups.map(group => (
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
      )}
    </div>
  )
}

function ExtrasScreen({
  moodTheme,
  setMoodTheme,
  toneMode,
  setToneMode,
  villainMode,
  setVillainMode,
  playlistUrl,
  setPlaylistUrl,
  areWeThereCount,
  setAreWeThereCount,
  onLost,
  lostPulse,
}) {
  const [fxFrom, setFxFrom] = useState('EUR')
  const [fxTo, setFxTo] = useState('SGD')
  const [fxAmount, setFxAmount] = useState('100')
  const [fxRates, setFxRates] = useState(null)
  const [fxDate, setFxDate] = useState('')
  const [fxLoading, setFxLoading] = useState(false)
  const [fxError, setFxError] = useState(false)
  const [pitRunning, setPitRunning] = useState(false)
  const [pitElapsedMs, setPitElapsedMs] = useState(0)
  const pitStartRef = useRef(null)
  const [pitBestTimes, setPitBestTimes] = useState(() => readStorageJSON(STORAGE_KEYS.pitBest, []))

  useEffect(() => {
    writeStorageJSON(STORAGE_KEYS.pitBest, pitBestTimes)
  }, [pitBestTimes])

  const loadFxRates = async () => {
    setFxLoading(true)
    setFxError(false)
    try {
      try {
        const res = await fetchJSONWithTimeout('https://api.frankfurter.app/latest?from=EUR&to=SGD,GBP', 7000)
        if (!res?.rates?.SGD || !res?.rates?.GBP) throw new Error('Invalid Frankfurter payload')
        setFxRates({ EUR: 1, SGD: res.rates.SGD, GBP: res.rates.GBP })
        setFxDate(res.date ?? '')
        return
      } catch {
        // fall through
      }

      const alt = await fetchJSONWithTimeout('https://open.er-api.com/v6/latest/EUR', 7000)
      if (alt?.result !== 'success' || !alt?.rates?.SGD || !alt?.rates?.GBP) throw new Error('Invalid fallback payload')
      setFxRates({ EUR: 1, SGD: alt.rates.SGD, GBP: alt.rates.GBP })
      setFxDate((alt.time_last_update_utc ?? '').toString().slice(0, 16))
    } catch {
      setFxError(true)
    } finally {
      setFxLoading(false)
    }
  }

  useEffect(() => {
    loadFxRates()
  }, [])

  useEffect(() => {
    if (!pitRunning) return undefined
    const id = setInterval(() => {
      if (pitStartRef.current) {
        setPitElapsedMs(Date.now() - pitStartRef.current)
      }
    }, 100)
    return () => clearInterval(id)
  }, [pitRunning])

  const fxNum = Number.parseFloat(fxAmount) || 0
  const toEur = (amount, currency, rates) => {
    if (currency === 'EUR') return amount
    if (!rates?.[currency]) return 0
    return amount / rates[currency]
  }
  const fromEur = (amount, currency, rates) => {
    if (currency === 'EUR') return amount
    if (!rates?.[currency]) return 0
    return amount * rates[currency]
  }
  const fxConverted = fxRates ? fromEur(toEur(fxNum, fxFrom, fxRates), fxTo, fxRates) : 0
  const fmtTimer = ms => {
    const totalTenths = Math.floor(ms / 100)
    const mins = Math.floor(totalTenths / 600)
    const secs = Math.floor((totalTenths % 600) / 10)
    const tenths = totalTenths % 10
    return `${mins}:${String(secs).padStart(2, '0')}.${tenths}`
  }

  const togglePitRunning = () => {
    if (pitRunning) {
      setPitRunning(false)
      if (pitStartRef.current) setPitElapsedMs(Date.now() - pitStartRef.current)
      return
    }
    pitStartRef.current = Date.now() - pitElapsedMs
    setPitRunning(true)
  }

  const resetPit = () => {
    setPitRunning(false)
    pitStartRef.current = null
    setPitElapsedMs(0)
  }

  const savePitTime = () => {
    if (pitElapsedMs <= 0) return
    const next = [...pitBestTimes, pitElapsedMs].sort((a, b) => a - b).slice(0, 8)
    setPitBestTimes(next)
    resetPit()
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-eyebrow">companion tools</div>
        <div className="screen-title">{villainMode ? <>Control <em>Tower</em></> : <>Trip <em>Extras</em></>}</div>
      </div>

      <div className="screen-body">
        <section className="extras-block">
          <div className="extras-block-title">Display modes</div>
          <div className="extras-toggle-row" style={{ marginBottom: 10 }}>
            <button className={`extras-btn${toneMode === 'day' ? ' open' : ''}`} onClick={() => setToneMode('day')}>☀️ Day</button>
            <button className={`extras-btn${toneMode === 'night' ? ' open' : ''}`} onClick={() => setToneMode('night')}>🌙 Night</button>
          </div>
          <div className="playlist-line" style={{ marginBottom: 10 }}>
            Default is night from 7:00 PM to 4:00 AM unless you switch it manually.
          </div>
          <div className="extras-toggle-row" style={{ marginTop: 10, marginBottom: 10 }}>
            <button className={`extras-btn${!villainMode ? ' open' : ''}`} onClick={() => setVillainMode(false)}>
              🙂 Leisure mode
            </button>
            <button className={`extras-btn${villainMode ? ' open' : ''}`} onClick={() => setVillainMode(true)}>
              🟢 Deloitte mode
            </button>
          </div>
          {!villainMode ? (
            <>
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
            </>
          ) : (
            <div className="playlist-line" style={{ marginBottom: 8 }}>
              Deloitte Mode uses one fixed brand identity. Only Day/Night can be switched.
            </div>
          )}
        </section>

        <section className="extras-block">
          <div className="extras-block-title">Collaborative playlist</div>
          <div className="playlist-card">
            <div className="playlist-line">
              Drop a shared playlist link here (Spotify or any music link). It stays saved on this device.
            </div>
            <input
              className="extras-input"
              value={playlistUrl}
              placeholder="https://open.spotify.com/playlist/..."
              onChange={e => setPlaylistUrl(e.target.value)}
            />
            <div className="playlist-row">
              <button className="extras-btn" onClick={() => setPlaylistUrl('')}>Clear</button>
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
          <div className="extras-block-title">Travel mini tools</div>
          <div className="playlist-card" style={{ marginBottom: 10 }}>
            <div className="playlist-line">Live currency converter (EUR, SGD, GBP)</div>
            <div className="playlist-row" style={{ marginBottom: 8 }}>
              <select className="extras-input" value={fxFrom} onChange={e => setFxFrom(e.target.value)}>
                <option value="EUR">EUR</option>
                <option value="SGD">SGD</option>
                <option value="GBP">GBP</option>
              </select>
              <button
                className="extras-btn"
                onClick={() => {
                  setFxFrom(fxTo)
                  setFxTo(fxFrom)
                }}
              >
                Swap
              </button>
              <select className="extras-input" value={fxTo} onChange={e => setFxTo(e.target.value)}>
                <option value="EUR">EUR</option>
                <option value="SGD">SGD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="playlist-row">
              <input className="extras-input" value={fxAmount} onChange={e => setFxAmount(e.target.value)} />
              <div className="extras-calc-output">
                {fxLoading
                  ? 'Loading...'
                  : fxError
                  ? 'Rate unavailable'
                  : `${fxTo} ${fxConverted.toFixed(2)}`}
              </div>
            </div>
            <div className="playlist-row">
              <button className="extras-btn" onClick={loadFxRates}>Refresh rates</button>
            </div>
            {!fxError && fxDate && (
              <div className="playlist-line" style={{ marginTop: 7, fontSize: '0.68rem' }}>
                Rates date: {fxDate}
              </div>
            )}
          </div>

          <div className="playlist-card" style={{ marginBottom: 10 }}>
            <div className="playlist-line">Peestop timer and leaderboard</div>
            <div className="pit-stop-time">{fmtTimer(pitElapsedMs)}</div>
            <div className="playlist-row">
              <button className="extras-btn" onClick={togglePitRunning}>{pitRunning ? 'Pause' : 'Start'}</button>
              <button className="extras-btn" onClick={resetPit}>Reset</button>
              <button className="extras-btn open" onClick={savePitTime}>Save time</button>
            </div>
            {pitBestTimes.length > 0 && (
              <div className="pit-best-list">
                {pitBestTimes.map((t, i) => <div key={i}>#{i + 1} · {fmtTimer(t)}</div>)}
              </div>
            )}
          </div>

          <div className="playlist-card">
            <div className="playlist-line">{villainMode ? 'Pure stakeholder management energy.' : 'No purpose. Pure chaos.'}</div>
            <button className="extras-counter-btn" onClick={() => setAreWeThereCount(prev => prev + 1)}>
              {villainMode ? `Are we aligned yet? (${areWeThereCount})` : `Are we there yet? (${areWeThereCount})`}
            </button>
          </div>
        </section>

        <section className="extras-block">
          <div className="extras-block-title">Emergency tools</div>
          <div className="playlist-card">
            <div className="playlist-line">
              Keep emergency essentials one tap away while driving.
            </div>
            <button className={`extras-lost-btn${lostPulse ? ' alerting' : ''}`} onClick={onLost}>
              🚨 HELP
            </button>
            {lostPulse && (
              <div className="extras-emergency-progress" style={{ color: '#9b1515', fontWeight: 700, marginTop: 8 }}>
                Emergency panel opened.
              </div>
            )}
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

      </div>
    </div>
  )
}

export default function App() {
  const [splash, setSplash] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [currentStop, setCurrentStop] = useState(0)
  const [openDays, setOpenDays] = useState([1])
  const [driverByStop, setDriverByStop] = useState(() => (
    Object.fromEntries(STOPS.map(stop => [stop.id, stop.driver === 'girl' ? 'girl' : 'boy']))
  ))
  const [moodTheme, setMoodTheme] = useState(() => {
    const stored = readStorageJSON(STORAGE_KEYS.mood, 'postcard')
    return MOOD_THEMES.some(theme => theme.id === stored) ? stored : 'postcard'
  })
  const [toneMode, setToneMode] = useState(() => {
    const hour = new Date().getHours()
    return hour >= 19 || hour < 4 ? 'night' : 'day'
  })
  const [playlistUrl, setPlaylistUrl] = useState(() => (
    readStorageJSON(STORAGE_KEYS.playlist, '')
  ))
  const [villainMode, setVillainMode] = useState(false)
  const [areWeThereCount, setAreWeThereCount] = useState(() => (
    readStorageJSON(STORAGE_KEYS.areWeThere, 0)
  ))
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const [lostPulse, setLostPulse] = useState(false)
  const tabs = villainMode
    ? BASE_TABS.map(tab => ({ ...tab, label: DELOITTE_TAB_LABELS[tab.id] ?? tab.label }))
    : BASE_TABS

  useEffect(() => {
    writeStorageJSON(STORAGE_KEYS.mood, moodTheme)
  }, [moodTheme])
  useEffect(() => {
    writeStorageJSON(STORAGE_KEYS.playlist, playlistUrl)
  }, [playlistUrl])

  useEffect(() => {
    writeStorageJSON(STORAGE_KEYS.areWeThere, areWeThereCount)
  }, [areWeThereCount])

  const setDriverForStop = (stopId, driver) => {
    setDriverByStop(prev => ({ ...prev, [stopId]: driver }))
  }

  const jumpToDay = dayId => {
    setActiveTab('days')
    setOpenDays(prev => (prev.includes(dayId) ? prev : [...prev, dayId]))
  }

  const switchTab = tabId => {
    if (tabId === activeTab) return
    setActiveTab(tabId)
  }

  const triggerLostAlarm = () => {
    setEmergencyOpen(true)
    setLostPulse(true)
    window.setTimeout(() => setLostPulse(false), 2800)
  }

  return (
    <div className="app" data-theme={villainMode ? 'deloitte' : moodTheme} data-tone={toneMode} data-villain={villainMode ? 'on' : 'off'}>
      <FloatingItems villainMode={villainMode} />

      {splash && (
        <Splash
          onEnter={() => setSplash(false)}
          villainMode={villainMode}
          moodTheme={moodTheme}
          toneMode={toneMode}
        />
      )}

      {!splash && (
        <>
          <div className="app-desktop-layout">
            <aside className="desktop-sidebar">
              <div className="desktop-logo">{villainMode ? 'Deloitte.' : 'Espana Trip'}</div>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`desktop-nav-item${activeTab === tab.id ? ' active' : ''}`}
                  onClick={() => switchTab(tab.id)}
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
                  <HomeScreen onJumpToDay={jumpToDay} toneMode={toneMode} villainMode={villainMode} />
                </div>
                <div className={`screen-pane${activeTab === 'route' ? ' active' : ''}`}>
                  <RouteScreen
                    currentStop={currentStop}
                    setCurrentStop={setCurrentStop}
                    driverByStop={driverByStop}
                    setDriverForStop={setDriverForStop}
                    isActive={activeTab === 'route'}
                    villainMode={villainMode}
                    toneMode={toneMode}
                    moodTheme={moodTheme}
                  />
                </div>
                <div className={`screen-pane${activeTab === 'days' ? ' active' : ''}`}>
                  <DaysScreen openDays={openDays} setOpenDays={setOpenDays} villainMode={villainMode} toneMode={toneMode} moodTheme={moodTheme} />
                </div>
                <div className={`screen-pane${activeTab === 'qs' ? ' active' : ''}`}>
                  <Questions villainMode={villainMode} toneMode={toneMode} />
                </div>
                <div className={`screen-pane${activeTab === 'info' ? ' active' : ''}`}><InfoScreen toneMode={toneMode} villainMode={villainMode} /></div>
                <div className={`screen-pane${activeTab === 'extras' ? ' active' : ''}`}>
                  <ExtrasScreen
                    moodTheme={moodTheme}
                    setMoodTheme={setMoodTheme}
                    toneMode={toneMode}
                    setToneMode={setToneMode}
                    villainMode={villainMode}
                    setVillainMode={setVillainMode}
                    playlistUrl={playlistUrl}
                    setPlaylistUrl={setPlaylistUrl}
                    areWeThereCount={areWeThereCount}
                    setAreWeThereCount={setAreWeThereCount}
                    onLost={triggerLostAlarm}
                    lostPulse={lostPulse}
                  />
                </div>
                <div className={`screen-pane${activeTab === 'games' ? ' active' : ''}`}>
                  <Games villainMode={villainMode} toneMode={toneMode} moodTheme={moodTheme} />
                </div>
              </div>
            </main>
          </div>

          <EmergencyPanel
            open={emergencyOpen}
            onClose={() => setEmergencyOpen(false)}
            playlistUrl={playlistUrl}
          />

          <nav className="bottom-nav" aria-label="Main navigation">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => switchTab(tab.id)}
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

