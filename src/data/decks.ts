import cardsData from './cards.json';
import { Card } from '../types/game';

export interface PrebuiltDeckCard {
  id?: string;
  number?: number;
  count: number;
}

export interface PrebuiltDeck {
  id: string;
  name: string;
  set: 'Base Set' | 'Jungle' | 'Fossil' | 'Base Set 2' | 'Team Rocket';
  description: string;
  type: string;
  cards: PrebuiltDeckCard[];
}

export const PREBUILT_DECKS: PrebuiltDeck[] = [
  // ==========================================
  // BASE SET THEME DECKS
  // ==========================================
  {
    id: 'overgrowth',
    name: 'Overgrowth (Base Set)',
    set: 'Base Set',
    description: 'Classic Grass & Water theme deck featuring Gyarados, Ivysaur, Bulbasaur, Weedle and Starmie.',
    type: 'Grass / Water',
    cards: [
      { id: 'bs-6', count: 1 },  // Gyarados
      { id: 'bs-30', count: 2 }, // Ivysaur
      { id: 'bs-44', count: 4 }, // Bulbasaur
      { id: 'bs-33', count: 1 }, // Kakuna
      { id: 'bs-69', count: 4 }, // Weedle
      { id: 'bs-64', count: 2 }, // Starmie
      { id: 'bs-65', count: 4 }, // Staryu
      { id: 'bs-35', count: 2 }, // Magikarp
      { id: 'bs-66', count: 2 }, // Tangela
      { id: 'bs-91', count: 2 }, // Bill
      { id: 'bs-93', count: 2 }, // Gust of Wind
      { id: 'bs-94', count: 3 }, // Potion
      { id: 'bs-95', count: 1 }, // Switch
      { id: 'bs-89', count: 1 }, // Revive
      { id: 'bs-99', count: 16 }, // Grass Energy
      { id: 'bs-102', count: 13 } // Water Energy
    ]
  },
  {
    id: 'brushfire',
    name: 'Brushfire (Base Set)',
    set: 'Base Set',
    description: 'Blistering Fire & Grass deck featuring Ninetales, Charmeleon, Charmander, Arcanine and Beedrill.',
    type: 'Fire / Grass',
    cards: [
      { id: 'bs-12', count: 1 }, // Ninetales
      { id: 'bs-68', count: 4 }, // Vulpix
      { id: 'bs-24', count: 2 }, // Charmeleon
      { id: 'bs-46', count: 4 }, // Charmander
      { id: 'bs-23', count: 1 }, // Arcanine
      { id: 'bs-28', count: 2 }, // Growlithe
      { id: 'bs-60', count: 4 }, // Ponyta
      { id: 'bs-33', count: 2 }, // Kakuna
      { id: 'bs-69', count: 4 }, // Weedle
      { id: 'bs-91', count: 2 }, // Bill
      { id: 'bs-92', count: 2 }, // Energy Removal
      { id: 'bs-93', count: 1 }, // Gust of Wind
      { id: 'bs-94', count: 3 }, // Potion
      { id: 'bs-95', count: 1 }, // Switch
      { id: 'bs-98', count: 18 }, // Fire Energy
      { id: 'bs-99', count: 9 }  // Grass Energy
    ]
  },
  {
    id: 'zap',
    name: 'Zap! (Base Set)',
    set: 'Base Set',
    description: 'Electric & Psychic deck with Mewtwo, Pikachu, Raichu, Gastly, Haunter, Jynx and Drowzee.',
    type: 'Lightning / Psychic',
    cards: [
      { id: 'bs-10', count: 1 }, // Mewtwo
      { id: 'bs-14', count: 1 }, // Raichu
      { id: 'bs-58', count: 4 }, // Pikachu
      { id: 'bs-29', count: 2 }, // Haunter
      { id: 'bs-50', count: 4 }, // Gastly
      { id: 'bs-31', count: 2 }, // Jynx
      { id: 'bs-49', count: 4 }, // Drowzee
      { id: 'bs-53', count: 4 }, // Magnemite
      { id: 'bs-88', count: 1 }, // Professor Oak
      { id: 'bs-91', count: 2 }, // Bill
      { id: 'bs-92', count: 2 }, // Energy Removal
      { id: 'bs-93', count: 1 }, // Gust of Wind
      { id: 'bs-94', count: 3 }, // Potion
      { id: 'bs-95', count: 1 }, // Switch
      { id: 'bs-100', count: 16 }, // Lightning Energy
      { id: 'bs-101', count: 12 }  // Psychic Energy
    ]
  },
  {
    id: 'blackout',
    name: 'Blackout (Base Set)',
    set: 'Base Set',
    description: 'Hard-hitting Fighting & Water deck featuring Hitmonchan, Machop, Machoke, Squirtle and Wartortle.',
    type: 'Fighting / Water',
    cards: [
      { id: 'bs-7', count: 1 },  // Hitmonchan
      { id: 'bs-34', count: 2 }, // Machoke
      { id: 'bs-52', count: 4 }, // Machop
      { id: 'bs-42', count: 2 }, // Wartortle
      { id: 'bs-63', count: 4 }, // Squirtle
      { id: 'bs-56', count: 2 }, // Onix
      { id: 'bs-62', count: 4 }, // Sandshrew
      { id: 'bs-91', count: 2 }, // Bill
      { id: 'bs-92', count: 2 }, // Energy Removal
      { id: 'bs-93', count: 1 }, // Gust of Wind
      { id: 'bs-94', count: 3 }, // Potion
      { id: 'bs-95', count: 1 }, // Switch
      { id: 'bs-88', count: 1 }, // Professor Oak
      { id: 'bs-97', count: 16 }, // Fighting Energy
      { id: 'bs-102', count: 15 } // Water Energy
    ]
  },
  {
    id: 'haymaker',
    name: 'Classic Haymaker (Competitive)',
    set: 'Base Set',
    description: 'Tournament-winning 1999 speed beatdown with Hitmonchan, Electabuzz, and Scyther.',
    type: 'Fighting / Lightning',
    cards: [
      { id: 'bs-7', count: 4 },  // Hitmonchan
      { id: 'bs-20', count: 4 }, // Electabuzz
      { id: 'ju-10', count: 4 }, // Scyther
      { id: 'bs-84', count: 4 }, // PlusPower
      { id: 'bs-88', count: 4 }, // Professor Oak
      { id: 'bs-91', count: 4 }, // Bill
      { id: 'bs-71', count: 4 }, // Computer Search
      { id: 'bs-74', count: 2 }, // Item Finder
      { id: 'bs-92', count: 4 }, // Energy Removal
      { id: 'bs-79', count: 3 }, // Super Energy Removal
      { id: 'bs-93', count: 3 }, // Gust of Wind
      { id: 'bs-95', count: 3 }, // Switch
      { id: 'bs-97', count: 9 }, // Fighting Energy
      { id: 'bs-100', count: 8 } // Lightning Energy
    ]
  },

  // ==========================================
  // JUNGLE THEME DECKS
  // ==========================================
  {
    id: 'power-reserve',
    name: 'Power Reserve (Jungle)',
    set: 'Jungle',
    description: 'Grass & Psychic deck packed with status effects, featuring Kangaskhan, Weepinbell, Nidorino, Gloom, and Bellsprout.',
    type: 'Grass / Psychic',
    cards: [
      { id: 'ju-5', count: 1 },  // Kangaskhan
      { id: 'ju-48', count: 2 }, // Weepinbell
      { id: 'ju-49', count: 4 }, // Bellsprout
      { id: 'ju-41', count: 2 }, // Nidorino
      { id: 'bs-55', count: 4 }, // Nidoran♂
      { id: 'ju-37', count: 2 }, // Gloom
      { id: 'ju-58', count: 4 }, // Oddish
      { id: 'bs-49', count: 4 }, // Drowzee
      { id: 'bs-43', count: 2 }, // Abra
      { id: 'bs-91', count: 2 }, // Bill
      { id: 'bs-93', count: 1 }, // Gust of Wind
      { id: 'ju-64', count: 2 }, // Poké Ball
      { id: 'bs-94', count: 3 }, // Potion
      { id: 'bs-95', count: 1 }, // Switch
      { id: 'bs-99', count: 17 }, // Grass Energy
      { id: 'bs-101', count: 11 } // Psychic Energy
    ]
  },
  {
    id: 'water-blast',
    name: 'Water Blast (Jungle)',
    set: 'Jungle',
    description: 'Relentless Water & Grass surge featuring Vaporeon, Eevee, Wartortle, Poliwhirl, and Seaking.',
    type: 'Water / Grass',
    cards: [
      { id: 'ju-12', count: 1 }, // Vaporeon
      { id: 'ju-51', count: 3 }, // Eevee
      { id: 'bs-42', count: 2 }, // Wartortle
      { id: 'bs-63', count: 4 }, // Squirtle
      { id: 'bs-38', count: 2 }, // Poliwhirl
      { id: 'bs-59', count: 4 }, // Poliwag
      { id: 'ju-46', count: 1 }, // Seaking
      { id: 'ju-53', count: 3 }, // Goldeen
      { id: 'ju-56', count: 2 }, // Meowth
      { id: 'bs-91', count: 2 }, // Bill
      { id: 'bs-92', count: 2 }, // Energy Removal
      { id: 'bs-93', count: 1 }, // Gust of Wind
      { id: 'ju-64', count: 2 }, // Poké Ball
      { id: 'bs-94', count: 3 }, // Potion
      { id: 'bs-90', count: 1 }, // Super Potion
      { id: 'bs-95', count: 1 }, // Switch
      { id: 'bs-102', count: 18 }, // Water Energy
      { id: 'bs-99', count: 8 }   // Grass Energy
    ]
  },

  // ==========================================
  // FOSSIL THEME DECKS
  // ==========================================
  {
    id: 'bodyguard',
    name: 'BodyGuard (Fossil)',
    set: 'Fossil',
    description: 'Toxic Grass & Water defensive fortress powered by Muk, Weezing, Golduck, and Golbat.',
    type: 'Grass / Water',
    cards: [
      { id: 'fo-13', count: 1 }, // Muk
      { id: 'fo-48', count: 4 }, // Grimer
      { id: 'fo-45', count: 2 }, // Weezing
      { id: 'tr-57', count: 4 }, // Koffing
      { id: 'fo-34', count: 1 }, // Golbat
      { id: 'fo-57', count: 4 }, // Zubat
      { id: 'fo-35', count: 1 }, // Golduck
      { id: 'fo-53', count: 4 }, // Psyduck
      { id: 'fo-51', count: 3 }, // Krabby
      { id: 'fo-59', count: 2 }, // Energy Search
      { id: 'fo-60', count: 1 }, // Gambler
      { id: 'bs-93', count: 1 }, // Gust of Wind
      { id: 'bs-94', count: 3 }, // Potion
      { id: 'fo-61', count: 1 }, // Recycle
      { id: 'bs-95', count: 1 }, // Switch
      { id: 'bs-99', count: 16 }, // Grass Energy
      { id: 'bs-102', count: 11 } // Water Energy
    ]
  },
  {
    id: 'lockdown',
    name: 'LockDown (Fossil)',
    set: 'Fossil',
    description: 'Oppressive Fire & Water battlefield control with Lapras, Magmar, Kingler, and Seadra.',
    type: 'Fire / Water',
    cards: [
      { id: 'fo-10', count: 1 }, // Lapras
      { id: 'fo-39', count: 2 }, // Magmar
      { id: 'bs-60', count: 4 }, // Ponyta
      { id: 'ju-44', count: 1 }, // Rapidash
      { id: 'fo-49', count: 4 }, // Horsea
      { id: 'fo-43', count: 2 }, // Seadra
      { id: 'fo-51', count: 3 }, // Krabby
      { id: 'fo-38', count: 1 }, // Kingler
      { id: 'bs-68', count: 2 }, // Vulpix
      { id: 'fo-59', count: 2 }, // Energy Search
      { id: 'fo-60', count: 1 }, // Gambler
      { id: 'bs-93', count: 1 }, // Gust of Wind
      { id: 'bs-94', count: 3 }, // Potion
      { id: 'fo-61', count: 1 }, // Recycle
      { id: 'bs-95', count: 1 }, // Switch
      { id: 'bs-98', count: 16 }, // Fire Energy
      { id: 'bs-102', count: 12 } // Water Energy
    ]
  },
  {
    id: 'overcast',
    name: 'Overcast (Fossil)',
    set: 'Fossil',
    description: 'Blizzard and Rock avalanche featuring legendary Articuno, Cloyster, Graveler, and prehistoric Kabuto.',
    type: 'Water / Fighting',
    cards: [
      { id: 'fo-2', count: 1 },  // Articuno
      { id: 'fo-32', count: 1 }, // Cloyster
      { id: 'fo-54', count: 4 }, // Shellder
      { id: 'ju-53', count: 4 }, // Goldeen
      { id: 'ju-46', count: 1 }, // Seaking
      { id: 'fo-47', count: 4 }, // Geodude
      { id: 'fo-37', count: 2 }, // Graveler
      { id: 'fo-50', count: 2 }, // Kabuto
      { id: 'fo-62', count: 4 }, // Mysterious Fossil
      { id: 'fo-59', count: 2 }, // Energy Search
      { id: 'fo-60', count: 1 }, // Gambler
      { id: 'bs-93', count: 1 }, // Gust of Wind
      { id: 'bs-94', count: 3 }, // Potion
      { id: 'fo-61', count: 1 }, // Recycle
      { id: 'bs-95', count: 1 }, // Switch
      { id: 'bs-102', count: 16 }, // Water Energy
      { id: 'bs-97', count: 12 }  // Fighting Energy
    ]
  },

  // ==========================================
  // TEAM ROCKET THEME DECKS
  // ==========================================
  {
    id: 'devastation',
    name: 'Devastation (Team Rocket)',
    set: 'Team Rocket',
    description: 'Poisonous Team Rocket assault led by Dark Weezing, Dark Arbok, Dark Golbat, and Dark Golduck.',
    type: 'Grass / Water',
    cards: [
      { id: 'tr-14', count: 1 }, // Dark Weezing
      { id: 'tr-57', count: 4 }, // Koffing
      { id: 'tr-2', count: 1 },  // Dark Arbok
      { id: 'tr-55', count: 4 }, // Ekans
      { id: 'tr-7', count: 1 },  // Dark Golbat
      { id: 'tr-69', count: 4 }, // Zubat
      { id: 'tr-56', count: 4 }, // Grimer
      { id: 'tr-64', count: 3 }, // Psyduck
      { id: 'tr-37', count: 1 }, // Dark Golduck
      { id: 'tr-53', count: 2 }, // Drowzee
      { id: 'bs-91', count: 2 }, // Bill
      { id: 'bs-81', count: 1 }, // Energy Retrieval
      { id: 'tr-76', count: 1 }, // Nightly Garbage Run
      { id: 'bs-94', count: 3 }, // Potion
      { id: 'tr-79', count: 2 }, // Sleep!
      { id: 'tr-73', count: 1 }, // The Boss's Way
      { id: 'bs-99', count: 16 }, // Grass Energy
      { id: 'bs-102', count: 9 }  // Water Energy
    ]
  },
  {
    id: 'trouble',
    name: 'Trouble (Team Rocket)',
    set: 'Team Rocket',
    description: 'Villainous Psychic & Grass sabotage deck with Dark Arbok, Dark Muk, Dark Hypno, and Dark Kadabra.',
    type: 'Psychic / Grass',
    cards: [
      { id: 'tr-2', count: 1 },  // Dark Arbok
      { id: 'tr-55', count: 4 }, // Ekans
      { id: 'tr-41', count: 1 }, // Dark Muk
      { id: 'tr-56', count: 4 }, // Grimer
      { id: 'tr-9', count: 1 },  // Dark Hypno
      { id: 'tr-53', count: 4 }, // Drowzee
      { id: 'bs-50', count: 4 }, // Gastly
      { id: 'bs-43', count: 3 }, // Abra
      { id: 'tr-39', count: 1 }, // Dark Kadabra
      { id: 'bs-91', count: 2 }, // Bill
      { id: 'tr-74', count: 1 }, // Challenge!
      { id: 'tr-78', count: 1 }, // Goop Gas Attack
      { id: 'tr-76', count: 1 }, // Nightly Garbage Run
      { id: 'bs-94', count: 3 }, // Potion
      { id: 'tr-73', count: 1 }, // The Boss's Way
      { id: 'bs-101', count: 17 }, // Psychic Energy
      { id: 'bs-99', count: 11 }  // Grass Energy
    ]
  },

  // ==========================================
  // BASE SET 2 THEME DECKS
  // ==========================================
  {
    id: 'psych-out',
    name: 'Psych Out (Base Set 2)',
    set: 'Base Set 2',
    description: 'Psychic mastery featuring Alakazam, Kadabra, Gastly, Haunter, and Jynx.',
    type: 'Psychic / Water',
    cards: [
      { id: 'b2-1', count: 1 },  // Alakazam
      { id: 'b2-46', count: 2 }, // Kadabra
      { id: 'b2-65', count: 4 }, // Abra
      { id: 'b2-76', count: 4 }, // Gastly
      { id: 'b2-43', count: 2 }, // Haunter
      { id: 'b2-73', count: 3 }, // Drowzee
      { id: 'b2-45', count: 2 }, // Jynx
      { id: 'b2-95', count: 4 }, // Staryu
      { id: 'bs-64', count: 2 }, // Starmie
      { id: 'b2-116', count: 2 }, // Bill
      { id: 'b2-118', count: 2 }, // Gust of Wind
      { id: 'b2-120', count: 3 }, // Potion
      { id: 'b2-121', count: 2 }, // Switch
      { id: 'b2-115', count: 1 }, // Super Potion
      { id: 'b2-129', count: 18 }, // Psychic Energy
      { id: 'b2-130', count: 8 }  // Water Energy
    ]
  },
  {
    id: 'grass-chopper',
    name: 'Grass Chopper (Base Set 2)',
    set: 'Base Set 2',
    description: 'Lightning-fast aggressive Grass & Fighting beats with Scyther, Pinsir, Machoke, and Dugtrio.',
    type: 'Grass / Fighting',
    cards: [
      { id: 'b2-17', count: 1 }, // Scyther
      { id: 'b2-29', count: 1 }, // Pinsir
      { id: 'b2-83', count: 4 }, // Nidoran♀
      { id: 'b2-53', count: 2 }, // Nidorina
      { id: 'b2-79', count: 4 }, // Machop
      { id: 'b2-49', count: 2 }, // Machoke
      { id: 'b2-71', count: 4 }, // Diglett
      { id: 'b2-23', count: 1 }, // Dugtrio
      { id: 'b2-116', count: 2 }, // Bill
      { id: 'b2-117', count: 2 }, // Energy Removal
      { id: 'b2-118', count: 1 }, // Gust of Wind
      { id: 'b2-120', count: 3 }, // Potion
      { id: 'b2-121', count: 1 }, // Switch
      { id: 'b2-127', count: 16 }, // Grass Energy
      { id: 'b2-125', count: 16 }  // Fighting Energy
    ]
  },
  {
    id: 'hotfoot',
    name: 'HotFoot (Base Set 2)',
    set: 'Base Set 2',
    description: 'Electrifying Fire & Lightning assault with Electabuzz, Raichu, Charmeleon, and Arcanine.',
    type: 'Fire / Lightning',
    cards: [
      { id: 'b2-24', count: 1 }, // Electabuzz
      { id: 'b2-88', count: 4 }, // Pikachu
      { id: 'b2-16', count: 1 }, // Raichu
      { id: 'b2-98', count: 4 }, // Voltorb
      { id: 'b2-69', count: 4 }, // Charmander
      { id: 'b2-35', count: 2 }, // Charmeleon
      { id: 'b2-42', count: 3 }, // Growlithe
      { id: 'b2-33', count: 1 }, // Arcanine
      { id: 'b2-116', count: 2 }, // Bill
      { id: 'b2-117', count: 2 }, // Energy Removal
      { id: 'b2-118', count: 1 }, // Gust of Wind
      { id: 'b2-120', count: 3 }, // Potion
      { id: 'b2-121', count: 1 }, // Switch
      { id: 'b2-126', count: 16 }, // Fire Energy
      { id: 'b2-128', count: 15 }  // Lightning Energy
    ]
  }
];

export function buildDeckFromList(deckList: PrebuiltDeckCard[]): Card[] {
  const deck: Card[] = [];
  const allCards = cardsData as Card[];
  const idMap = new Map<string, Card>();
  const numMap = new Map<number, Card>();

  allCards.forEach(c => {
    idMap.set(c.id, c);
    if (!numMap.has(c.number)) {
      numMap.set(c.number, c);
    }
  });

  for (const item of deckList) {
    let card: Card | undefined;
    if (item.id) {
      card = idMap.get(item.id);
    }
    if (!card && item.number !== undefined) {
      card = numMap.get(item.number);
    }
    if (card) {
      for (let i = 0; i < item.count; i++) {
        deck.push({ ...card });
      }
    }
  }

  // If less than 60 cards, pad with basic energy
  while (deck.length < 60) {
    const energy = idMap.get('bs-97') || idMap.get('bs-102') || allCards.find(c => c.supertype === 'Energy');
    if (energy) deck.push({ ...energy });
    else break;
  }

  return deck.slice(0, 60);
}
