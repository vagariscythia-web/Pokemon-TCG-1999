import { Card } from '../types/game';

// Exact canonical printed levels from the original 1999/2000 Wizards of the Coast cards
// (Base Set, Jungle, Fossil, Base Set 2, Team Rocket)
const POKEMON_LEVELS_BY_ID: Record<string, number> = {
  // --- BASE SET ---
  'bs-1': 42,  // Alakazam
  'bs-2': 52,  // Blastoise
  'bs-3': 55,  // Chansey
  'bs-4': 76,  // Charizard
  'bs-5': 14,  // Clefairy
  'bs-6': 41,  // Gyarados
  'bs-7': 33,  // Hitmonchan
  'bs-8': 67,  // Machamp
  'bs-9': 28,  // Magneton
  'bs-10': 53, // Mewtwo
  'bs-11': 48, // Nidoking
  'bs-12': 32, // Ninetales
  'bs-13': 48, // Poliwrath
  'bs-14': 40, // Raichu
  'bs-15': 67, // Venusaur
  'bs-16': 64, // Zapdos
  'bs-17': 32, // Beedrill
  'bs-18': 33, // Dragonair
  'bs-19': 36, // Dugtrio
  'bs-20': 35, // Electabuzz
  'bs-21': 40, // Electrode
  'bs-22': 36, // Pidgeotto
  'bs-23': 45, // Arcanine
  'bs-24': 32, // Charmeleon
  'bs-25': 24, // Dewgong
  'bs-26': 10, // Dratini
  'bs-27': 20, // Farfetch'd
  'bs-28': 18, // Growlithe
  'bs-29': 22, // Haunter
  'bs-30': 20, // Ivysaur
  'bs-31': 23, // Jynx
  'bs-32': 38, // Kadabra
  'bs-33': 23, // Kakuna
  'bs-34': 40, // Machoke
  'bs-35': 8,  // Magikarp
  'bs-36': 24, // Magmar
  'bs-37': 25, // Nidorino
  'bs-38': 28, // Poliwhirl
  'bs-39': 12, // Porygon
  'bs-40': 41, // Raticate
  'bs-41': 12, // Seel
  'bs-42': 22, // Wartortle
  'bs-43': 10, // Abra
  'bs-44': 13, // Bulbasaur
  'bs-45': 13, // Caterpie
  'bs-46': 10, // Charmander
  'bs-47': 8,  // Diglett
  'bs-48': 10, // Doduo
  'bs-49': 12, // Drowzee
  'bs-50': 8,  // Gastly
  'bs-51': 13, // Koffing
  'bs-52': 20, // Machop
  'bs-53': 13, // Magnemite
  'bs-54': 21, // Metapod
  'bs-55': 20, // Nidoran M
  'bs-56': 12, // Onix
  'bs-57': 8,  // Pidgey
  'bs-58': 12, // Pikachu
  'bs-59': 13, // Poliwag
  'bs-60': 10, // Ponyta
  'bs-61': 9,  // Rattata
  'bs-62': 12, // Sandshrew
  'bs-63': 8,  // Squirtle
  'bs-64': 28, // Starmie
  'bs-65': 15, // Staryu
  'bs-66': 8,  // Tangela
  'bs-67': 10, // Voltorb
  'bs-68': 11, // Vulpix
  'bs-69': 12, // Weedle

  // --- JUNGLE ---
  'ju-1': 34,  // Clefable
  'ju-2': 42,  // Electrode
  'ju-3': 28,  // Flareon
  'ju-4': 29,  // Jolteon
  'ju-5': 40,  // Kangaskhan
  'ju-6': 28,  // Mr. Mime
  'ju-7': 43,  // Nidoqueen
  'ju-8': 40,  // Pidgeot
  'ju-9': 24,  // Pinsir
  'ju-10': 25, // Scyther
  'ju-11': 20, // Snorlax
  'ju-12': 42, // Vaporeon
  'ju-13': 28, // Venomoth
  'ju-14': 42, // Victreebel
  'ju-15': 35, // Vileplume
  'ju-16': 36, // Wigglytuff
  'ju-17': 34, // Clefable (Non-Holo)
  'ju-18': 42, // Electrode (Non-Holo)
  'ju-19': 28, // Flareon (Non-Holo)
  'ju-20': 29, // Jolteon (Non-Holo)
  'ju-21': 40, // Kangaskhan (Non-Holo)
  'ju-22': 28, // Mr. Mime (Non-Holo)
  'ju-23': 43, // Nidoqueen (Non-Holo)
  'ju-24': 40, // Pidgeot (Non-Holo)
  'ju-25': 24, // Pinsir (Non-Holo)
  'ju-26': 25, // Scyther (Non-Holo)
  'ju-27': 20, // Snorlax (Non-Holo)
  'ju-28': 42, // Vaporeon (Non-Holo)
  'ju-29': 28, // Venomoth (Non-Holo)
  'ju-30': 42, // Victreebel (Non-Holo)
  'ju-31': 35, // Vileplume (Non-Holo)
  'ju-32': 36, // Wigglytuff (Non-Holo)
  'ju-33': 28, // Butterfree
  'ju-34': 28, // Dodrio
  'ju-35': 35, // Exeggutor
  'ju-36': 27, // Fearow
  'ju-37': 22, // Gloom
  'ju-38': 26, // Lickitung
  'ju-39': 26, // Marowak
  'ju-40': 24, // Nidorina
  'ju-41': 28, // Parasect
  'ju-42': 16, // Persian
  'ju-43': 35, // Primeape
  'ju-44': 33, // Rapidash
  'ju-45': 37, // Rhydon
  'ju-46': 28, // Seaking
  'ju-47': 32, // Tauros
  'ju-48': 28, // Weepinbell
  'ju-49': 11, // Bellsprout
  'ju-50': 13, // Cubone
  'ju-51': 12, // Eevee
  'ju-52': 14, // Exeggcute
  'ju-53': 12, // Goldeen
  'ju-54': 14, // Jigglypuff
  'ju-55': 7,  // Mankey
  'ju-56': 13, // Meowth
  'ju-57': 13, // Nidoran F
  'ju-58': 8,  // Oddish
  'ju-59': 8,  // Paras
  'ju-60': 14, // Pikachu
  'ju-61': 18, // Rhyhorn
  'ju-62': 13, // Spearow
  'ju-63': 12, // Venonat

  // --- FOSSIL ---
  'fo-1': 28,  // Aerodactyl
  'fo-2': 35,  // Articuno
  'fo-3': 19,  // Ditto
  'fo-4': 45,  // Dragonite
  'fo-5': 38,  // Gengar
  'fo-6': 17,  // Haunter
  'fo-7': 30,  // Hitmonlee
  'fo-8': 36,  // Hypno
  'fo-9': 30,  // Kabutops
  'fo-10': 31, // Lapras
  'fo-11': 35, // Magneton
  'fo-12': 35, // Moltres
  'fo-13': 34, // Muk
  'fo-14': 45, // Raichu
  'fo-15': 40, // Zapdos
  'fo-16': 28, // Aerodactyl (Non-Holo)
  'fo-17': 35, // Articuno (Non-Holo)
  'fo-18': 19, // Ditto (Non-Holo)
  'fo-19': 45, // Dragonite (Non-Holo)
  'fo-20': 38, // Gengar (Non-Holo)
  'fo-21': 17, // Haunter (Non-Holo)
  'fo-22': 30, // Hitmonlee (Non-Holo)
  'fo-23': 36, // Hypno (Non-Holo)
  'fo-24': 30, // Kabutops (Non-Holo)
  'fo-25': 31, // Lapras (Non-Holo)
  'fo-26': 35, // Magneton (Non-Holo)
  'fo-27': 35, // Moltres (Non-Holo)
  'fo-28': 34, // Muk (Non-Holo)
  'fo-29': 45, // Raichu (Non-Holo)
  'fo-30': 40, // Zapdos (Non-Holo)
  'fo-31': 27, // Arbok
  'fo-32': 25, // Cloyster
  'fo-33': 25, // Golbat
  'fo-34': 27, // Golduck
  'fo-35': 36, // Golem
  'fo-36': 29, // Graveler
  'fo-37': 27, // Kingler
  'fo-38': 31, // Magmar
  'fo-39': 32, // Omastar
  'fo-40': 33, // Sandslash
  'fo-41': 23, // Seadra
  'fo-42': 26, // Slowbro
  'fo-43': 21, // Tentacruel
  'fo-44': 27, // Weezing
  'fo-45': 15, // Ekans
  'fo-46': 16, // Geodude
  'fo-47': 17, // Grimer
  'fo-48': 19, // Horsea
  'fo-49': 9,  // Kabuto
  'fo-50': 20, // Krabby
  'fo-51': 19, // Omanyte
  'fo-52': 15, // Psyduck
  'fo-53': 8,  // Shellder
  'fo-54': 18, // Slowpoke
  'fo-55': 10, // Tentacool
  'fo-56': 10, // Zubat

  // --- TEAM ROCKET ---
  'tr-1': 30,  // Dark Alakazam
  'tr-2': 25,  // Dark Arbok
  'tr-3': 27,  // Dark Blastoise
  'tr-4': 38,  // Dark Charizard
  'tr-5': 33,  // Dark Dragonite
  'tr-6': 18,  // Dark Dugtrio
  'tr-7': 25,  // Dark Golbat
  'tr-8': 31,  // Dark Gyarados
  'tr-9': 26,  // Dark Hypno
  'tr-10': 30, // Dark Machamp
  'tr-11': 26, // Dark Magneton
  'tr-12': 27, // Dark Slowbro
  'tr-13': 29, // Dark Vileplume
  'tr-14': 24, // Dark Weezing
  'tr-18': 30, // Dark Alakazam (Non-Holo)
  'tr-19': 25, // Dark Arbok (Non-Holo)
  'tr-20': 27, // Dark Blastoise (Non-Holo)
  'tr-21': 38, // Dark Charizard (Non-Holo)
  'tr-22': 33, // Dark Dragonite (Non-Holo)
  'tr-23': 18, // Dark Dugtrio (Non-Holo)
  'tr-24': 25, // Dark Golbat (Non-Holo)
  'tr-25': 31, // Dark Gyarados (Non-Holo)
  'tr-26': 26, // Dark Hypno (Non-Holo)
  'tr-27': 30, // Dark Machamp (Non-Holo)
  'tr-28': 26, // Dark Magneton (Non-Holo)
  'tr-29': 27, // Dark Slowbro (Non-Holo)
  'tr-30': 29, // Dark Vileplume (Non-Holo)
  'tr-31': 24, // Dark Weezing (Non-Holo)
  'tr-32': 32, // Dark Charmeleon
  'tr-33': 28, // Dark Dragonair
  'tr-34': 24, // Dark Electrode
  'tr-35': 23, // Dark Flareon
  'tr-36': 21, // Dark Gloom
  'tr-37': 23, // Dark Golduck
  'tr-38': 23, // Dark Jolteon
  'tr-39': 24, // Dark Kadabra
  'tr-40': 28, // Dark Machoke
  'tr-41': 25, // Dark Muk
  'tr-42': 28, // Dark Persian
  'tr-43': 23, // Dark Primeape
  'tr-44': 24, // Dark Rapidash
  'tr-45': 25, // Dark Raticate
  'tr-46': 28, // Dark Vaporeon
  'tr-47': 21, // Dark Wartortle
  'tr-48': 10, // Porygon
  'tr-49': 14, // Abra
  'tr-50': 9,  // Charmander
  'tr-51': 12, // Dark Raticate
  'tr-52': 15, // Diglett
  'tr-53': 12, // Dratini
  'tr-54': 10, // Drowzee
  'tr-55': 9,  // Eevee
  'tr-56': 10, // Ekans
  'tr-57': 10, // Grimer
  'tr-58': 12, // Koffing
  'tr-59': 24, // Machop
  'tr-60': 12, // Magnemite
  'tr-61': 14, // Mankey
  'tr-62': 10, // Meowth
  'tr-63': 21, // Oddish
  'tr-64': 15, // Ponyta
  'tr-65': 16, // Psyduck
  'tr-66': 12, // Rattata
  'tr-67': 9,  // Slowpoke
  'tr-68': 15, // Squirtle
  'tr-69': 13, // Voltorb
  'tr-70': 9   // Zubat
};

const POKEMON_NAME_TO_LEVEL: Record<string, number> = {
  'Alakazam': 42,
  'Blastoise': 52,
  'Chansey': 55,
  'Charizard': 76,
  'Clefairy': 14,
  'Gyarados': 41,
  'Hitmonchan': 33,
  'Machamp': 67,
  'Magneton': 28,
  'Mewtwo': 53,
  'Nidoking': 48,
  'Ninetales': 32,
  'Poliwrath': 48,
  'Raichu': 40,
  'Venusaur': 67,
  'Zapdos': 64,
  'Beedrill': 32,
  'Dragonair': 33,
  'Dugtrio': 36,
  'Electabuzz': 35,
  'Electrode': 40,
  'Pidgeotto': 36,
  'Arcanine': 45,
  'Charmeleon': 32,
  'Dewgong': 24,
  'Dratini': 10,
  'Farfetch\'d': 20,
  'Growlithe': 18,
  'Haunter': 22,
  'Ivysaur': 20,
  'Jynx': 23,
  'Kadabra': 38,
  'Kakuna': 23,
  'Machoke': 40,
  'Magikarp': 8,
  'Magmar': 24,
  'Nidorino': 25,
  'Poliwhirl': 28,
  'Porygon': 12,
  'Raticate': 41,
  'Seel': 12,
  'Wartortle': 22,
  'Abra': 10,
  'Bulbasaur': 13,
  'Caterpie': 13,
  'Charmander': 10,
  'Diglett': 8,
  'Doduo': 10,
  'Drowzee': 12,
  'Gastly': 8,
  'Koffing': 13,
  'Machop': 20,
  'Magnemite': 13,
  'Metapod': 21,
  'Nidoran ♂': 20,
  'Nidoran M': 20,
  'Onix': 12,
  'Pidgey': 8,
  'Pikachu': 12,
  'Poliwag': 13,
  'Ponyta': 10,
  'Rattata': 9,
  'Sandshrew': 12,
  'Squirtle': 8,
  'Starmie': 28,
  'Staryu': 15,
  'Tangela': 8,
  'Voltorb': 10,
  'Vulpix': 11,
  'Weedle': 12,
  'Clefable': 34,
  'Flareon': 28,
  'Jolteon': 29,
  'Kangaskhan': 40,
  'Mr. Mime': 28,
  'Nidoqueen': 43,
  'Pidgeot': 40,
  'Pinsir': 24,
  'Scyther': 25,
  'Snorlax': 20,
  'Vaporeon': 42,
  'Venomoth': 28,
  'Victreebel': 42,
  'Vileplume': 35,
  'Wigglytuff': 36,
  'Butterfree': 28,
  'Dodrio': 28,
  'Exeggutor': 35,
  'Fearow': 27,
  'Gloom': 22,
  'Lickitung': 26,
  'Marowak': 26,
  'Nidorina': 24,
  'Parasect': 28,
  'Persian': 16,
  'Primeape': 35,
  'Rapidash': 33,
  'Rhydon': 37,
  'Seaking': 28,
  'Tauros': 32,
  'Weepinbell': 28,
  'Bellsprout': 11,
  'Cubone': 13,
  'Eevee': 12,
  'Exeggcute': 14,
  'Goldeen': 12,
  'Jigglypuff': 14,
  'Mankey': 7,
  'Meowth': 13,
  'Nidoran ♀': 13,
  'Nidoran F': 13,
  'Oddish': 8,
  'Paras': 8,
  'Rhyhorn': 18,
  'Spearow': 13,
  'Venonat': 12,
  'Aerodactyl': 28,
  'Articuno': 35,
  'Ditto': 19,
  'Dragonite': 45,
  'Gengar': 38,
  'Hitmonlee': 30,
  'Hypno': 36,
  'Kabutops': 30,
  'Lapras': 31,
  'Moltres': 35,
  'Muk': 34,
  'Arbok': 27,
  'Cloyster': 25,
  'Golbat': 25,
  'Golduck': 27,
  'Golem': 36,
  'Graveler': 29,
  'Kingler': 27,
  'Omastar': 32,
  'Sandslash': 33,
  'Seadra': 23,
  'Slowbro': 26,
  'Tentacruel': 21,
  'Weezing': 27,
  'Ekans': 15,
  'Geodude': 16,
  'Grimer': 17,
  'Horsea': 19,
  'Kabuto': 9,
  'Krabby': 20,
  'Omanyte': 19,
  'Psyduck': 15,
  'Shellder': 8,
  'Slowpoke': 18,
  'Tentacool': 10,
  'Zubat': 10
};

/**
 * Returns the canonical printed Level for a Pokémon card (e.g. 67 for Venusaur, 41 for Gyarados).
 * If the card is not a Pokémon, returns 0.
 */
export function getCardLevel(card?: Card | null): number {
  if (!card || card.supertype !== 'Pokemon') return 0;

  // Direct lookup by ID
  if (card.id && POKEMON_LEVELS_BY_ID[card.id] !== undefined) {
    return POKEMON_LEVELS_BY_ID[card.id];
  }

  // Lookup by Name
  if (card.name && POKEMON_NAME_TO_LEVEL[card.name] !== undefined) {
    return POKEMON_NAME_TO_LEVEL[card.name];
  }

  return card.hp ? Math.floor(card.hp / 2) : 10;
}
