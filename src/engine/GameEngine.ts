export const STAGE_2_TO_BASIC_MAP: Record<string, string> = {
  'Blastoise': 'Squirtle',
  'Charizard': 'Charmander',
  'Venusaur': 'Bulbasaur',
  'Beedrill': 'Weedle',
  'Butterfree': 'Caterpie',
  'Pidgeot': 'Pidgey',
  'Nidoqueen': 'Nidoran Female',
  'Nidoking': 'Nidoran Male',
  'Vileplume': 'Oddish',
  'Poliwrath': 'Poliwag',
  'Alakazam': 'Abra',
  'Machamp': 'Machop',
  'Victreebel': 'Bellsprout',
  'Golem': 'Geodude',
  'Gengar': 'Gastly',
  'Dragonite': 'Dratini',
  'Kabutops': 'Mysterious Fossil',
  'Omastar': 'Mysterious Fossil',
  'Dark Alakazam': 'Abra',
  'Dark Blastoise': 'Squirtle',
  'Dark Charizard': 'Charmander',
  'Dark Dragonite': 'Dratini',
  'Dark Machamp': 'Machop',
  'Dark Vileplume': 'Oddish'
};

import { GameState, PlayerState, Card, InPlayCard, Attack, GameLogEntry, EnergyType, AIDifficulty, StatusTick, AttackEffectChoices, AttackBlockReason, BenchHit } from '../types/game';
import cardsData from '../data/cards.json';

const allCards: Card[] = cardsData as Card[];

export interface TrainerEffectParams {
  targetPokemon?: InPlayCard;
  [key: string]: any;
}

export class GameEngine {
  static getDeckTheme(deck: Card[], fallbackName = 'Custom Deck'): { name: string; types: EnergyType[] } {
    const typeCounts: Record<string, number> = {};
    deck.forEach(c => {
      if (c && c.supertype === 'Energy' && c.types) {
        c.types.forEach(t => {
          typeCounts[t] = (typeCounts[t] || 0) + 3;
        });
      } else if (c && c.supertype === 'Pokemon' && c.types) {
        c.types.forEach(t => {
          if (t !== 'Colorless') {
            typeCounts[t] = (typeCounts[t] || 0) + 1;
          }
        });
      }
    });

    const sortedTypes = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a]) as EnergyType[];
    const topTypes = sortedTypes.slice(0, 2);
    if (topTypes.length === 0) topTypes.push('Colorless');

    return {
      name: fallbackName,
      types: topTypes
    };
  }

  static initGame(
    playerDeck: Card[],
    cpuDeck: Card[],
    prizeCount = 4,
    difficulty: AIDifficulty = 'medium',
    playerDeckName?: string,
    cpuDeckName?: string,
    playerDeckTypes?: EnergyType[],
    cpuDeckTypes?: EnergyType[]
  ): GameState {
    const pTheme = GameEngine.getDeckTheme(playerDeck, playerDeckName || 'Overgrowth');
    const cTheme = GameEngine.getDeckTheme(cpuDeck, cpuDeckName || 'Brushfire');

    const pName = playerDeckName || pTheme.name;
    const pTypes = playerDeckTypes && playerDeckTypes.length > 0 ? playerDeckTypes : pTheme.types;
    const cName = cpuDeckName || cTheme.name;
    const cTypes = cpuDeckTypes && cpuDeckTypes.length > 0 ? cpuDeckTypes : cTheme.types;

    const d1 = GameEngine.shuffle([...playerDeck]);
    const d2 = GameEngine.shuffle([...cpuDeck]);

    const playerHand = d1.splice(0, 7);
    const cpuHand = d2.splice(0, 7);

    const playerPrizes = d1.splice(0, prizeCount);
    const cpuPrizes = d2.splice(0, prizeCount);

    const state: GameState = {
      turn: 1,
      turnPlayer: 'player',
      phase: 'SETUP_ACTIVE',
      winner: null,
      difficulty,
      player: {
        id: 'player',
        name: 'Player',
        deck: d1,
        hand: playerHand,
        discard: [],
        prizes: playerPrizes,
        active: null,
        bench: [],
        energyAttachedThisTurn: false,
        hasRetreatedThisTurn: false,
        trainerPlayedThisTurn: false,
        deckName: pName,
        deckTypes: pTypes
      },
      cpu: {
        id: 'cpu',
        name: difficulty === 'expert' ? 'Champion Gary' : difficulty === 'hard' ? 'Gym Leader Gary' : 'Opponent (Gary)',
        deck: d2,
        hand: cpuHand,
        discard: [],
        prizes: cpuPrizes,
        active: null,
        bench: [],
        energyAttachedThisTurn: false,
        hasRetreatedThisTurn: false,
        trainerPlayedThisTurn: false,
        deckName: cName,
        deckTypes: cTypes
      },
      logs: []
    };

    GameEngine.addLog(state, 'Welcome to the 1999 Pokémon TCG Arena!', 'system');
    GameEngine.addLog(state, `Each player drew 7 cards and placed ${prizeCount} Prize Cards. [Difficulty: ${difficulty.toUpperCase()}]`, 'system');

    // Auto-setup CPU active (or mulligan if no basics)
    let cpuBasicIdx = state.cpu.hand.findIndex(c => c.supertype === 'Pokemon' && c.subtype === 'Basic');
    let cpuMulligans = 0;
    while (cpuBasicIdx === -1 && cpuMulligans < 5) {
      state.cpu.deck.push(...state.cpu.hand);
      state.cpu.deck = GameEngine.shuffle(state.cpu.deck);
      state.cpu.hand = state.cpu.deck.splice(0, 7);
      cpuBasicIdx = state.cpu.hand.findIndex(c => c.supertype === 'Pokemon' && c.subtype === 'Basic');
      cpuMulligans++;
    }

    if (cpuBasicIdx !== -1) {
      const cpuBasic = state.cpu.hand.splice(cpuBasicIdx, 1)[0];
      state.cpu.active = GameEngine.createInPlayCard(cpuBasic);
      GameEngine.addLog(state, `${state.cpu.name} placed ${cpuBasic.name} as Active Pokémon.`, 'ai');
    }

    return state;
  }

  static initMultiplayerGame(
    playerDeck: Card[],
    opponentDeck: Card[],
    prizeCount = 4,
    initialFirstPlayer: 'player' | 'cpu' = 'player',
    p1Name = 'Player',
    p2Name = 'Opponent',
    p1DeckName?: string,
    p2DeckName?: string,
    p1DeckTypes?: EnergyType[],
    p2DeckTypes?: EnergyType[]
  ): GameState {
    const p1Theme = GameEngine.getDeckTheme(playerDeck, p1DeckName || 'Custom Deck');
    const p2Theme = GameEngine.getDeckTheme(opponentDeck, p2DeckName || 'Custom Deck');

    const p1DName = p1DeckName || p1Theme.name;
    const p1DTypes = p1DeckTypes && p1DeckTypes.length > 0 ? p1DeckTypes : p1Theme.types;
    const p2DName = p2DeckName || p2Theme.name;
    const p2DTypes = p2DeckTypes && p2DeckTypes.length > 0 ? p2DeckTypes : p2Theme.types;

    const d1 = GameEngine.shuffle([...playerDeck]);
    const d2 = GameEngine.shuffle([...opponentDeck]);

    const playerHand = d1.splice(0, 7);
    const opponentHand = d2.splice(0, 7);

    const playerPrizes = d1.splice(0, prizeCount);
    const opponentPrizes = d2.splice(0, prizeCount);

    const state: GameState = {
      turn: 1,
      turnPlayer: initialFirstPlayer,
      phase: 'SETUP_ACTIVE',
      winner: null,
      player: {
        id: 'player',
        name: p1Name,
        deck: d1,
        hand: playerHand,
        discard: [],
        prizes: playerPrizes,
        active: null,
        bench: [],
        energyAttachedThisTurn: false,
        hasRetreatedThisTurn: false,
        trainerPlayedThisTurn: false,
        deckName: p1DName,
        deckTypes: p1DTypes
      },
      cpu: {
        id: 'cpu',
        name: p2Name,
        deck: d2,
        hand: opponentHand,
        discard: [],
        prizes: opponentPrizes,
        active: null,
        bench: [],
        energyAttachedThisTurn: false,
        hasRetreatedThisTurn: false,
        trainerPlayedThisTurn: false,
        deckName: p2DName,
        deckTypes: p2DTypes
      },
      logs: []
    };

    GameEngine.addLog(state, 'Multiplayer Match Started!', 'system');
    GameEngine.addLog(state, `Each player placed ${prizeCount} Prize Cards.`, 'system');
    return state;
  }

  static mulliganHand(state: GameState, playerId: 'player' | 'cpu'): GameState {
    const next = { ...state };
    const player = next[playerId];

    player.deck.push(...player.hand);
    player.hand = [];
    player.deck = GameEngine.shuffle(player.deck);
    player.hand = player.deck.splice(0, 7);

    GameEngine.addLog(next, `🔄 Mulligan! ${player.name} reshuffled hand into deck and drew 7 new cards.`, 'action');
    return next;
  }

  static createInitialState(deck1Cards?: Card[], deck2Cards?: Card[], p1Name = 'Player', p2Name = 'Opponent (Gary)'): GameState {
    const defaultDeck1 = GameEngine.createStandardDeck('Haymaker');
    const defaultDeck2 = GameEngine.createStandardDeck('RainDance');

    const state = GameEngine.initGame(deck1Cards || defaultDeck1, deck2Cards || defaultDeck2, 4);
    state.player.name = p1Name;
    state.cpu.name = p2Name;
    return state;
  }

  static createStandardDeck(theme: 'Haymaker' | 'RainDance' | 'FireStorm'): Card[] {
    const deck: Card[] = [];
    const getCard = (num: number) => allCards.find(c => c.number === num)!;

    if (theme === 'Haymaker') {
      for (let i = 0; i < 4; i++) deck.push(getCard(70));
      for (let i = 0; i < 4; i++) deck.push(getCard(28));
      for (let i = 0; i < 3; i++) deck.push(getCard(58));
      for (let i = 0; i < 2; i++) deck.push(getCard(14));
      for (let i = 0; i < 14; i++) deck.push(getCard(97));
      for (let i = 0; i < 14; i++) deck.push(getCard(100));
      for (let i = 0; i < 4; i++) deck.push(getCard(96));
      for (let i = 0; i < 4; i++) deck.push(getCard(94));
      for (let i = 0; i < 3; i++) deck.push(getCard(93));
      for (let i = 0; i < 4; i++) deck.push(getCard(91));
      for (let i = 0; i < 4; i++) deck.push(getCard(92));
    } else if (theme === 'RainDance') {
      for (let i = 0; i < 4; i++) deck.push(getCard(63));
      for (let i = 0; i < 3; i++) deck.push(getCard(42));
      for (let i = 0; i < 2; i++) deck.push(getCard(2));
      for (let i = 0; i < 3; i++) deck.push(getCard(64));
      for (let i = 0; i < 4; i++) deck.push(getCard(65));
      for (let i = 0; i < 20; i++) deck.push(getCard(102));
      for (let i = 0; i < 4; i++) deck.push(getCard(91));
      for (let i = 0; i < 4; i++) deck.push(getCard(94));
      for (let i = 0; i < 4; i++) deck.push(getCard(95));
      for (let i = 0; i < 2; i++) deck.push(getCard(73));
    } else {
      for (let i = 0; i < 4; i++) deck.push(getCard(46));
      for (let i = 0; i < 3; i++) deck.push(getCard(24));
      for (let i = 0; i < 2; i++) deck.push(getCard(4));
      for (let i = 0; i < 4; i++) deck.push(getCard(55));
      for (let i = 0; i < 3; i++) deck.push(getCard(6));
      for (let i = 0; i < 20; i++) deck.push(getCard(98));
      for (let i = 0; i < 4; i++) deck.push(getCard(91));
      for (let i = 0; i < 4; i++) deck.push(getCard(94));
      for (let i = 0; i < 3; i++) deck.push(getCard(93));
      for (let i = 0; i < 3; i++) deck.push(getCard(95));
    }
    return deck;
  }

  static shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  static createInPlayCard(card: Card): InPlayCard {
    return {
      instanceId: Math.random().toString(36).substring(2, 9),
      card,
      currentHp: card.hp || 0,
      damage: 0,
      status: 'None',
      attachedEnergy: [],
      evolutionHistory: [],
      turnsInPlay: 0,
      defendersAttached: 0,
      plusPowersAttached: 0
    };
  }

  static addLog(state: GameState, message: string, type: 'action' | 'damage' | 'status' | 'system' | 'ai' = 'action') {
    state.logs.unshift({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      text: message,
      type
    });
    if (state.logs.length > 80) state.logs.pop();
  }

  static selectStartingActive(state: GameState, handIndex: number): GameState {
    const next: GameState = {
      ...state,
      player: {
        ...state.player,
        hand: [...state.player.hand]
      }
    };
    const player = next.player;
    const card = player.hand[handIndex];
    const isBasicPkmn = (card?.supertype === 'Pokemon' && card?.subtype === 'Basic') || card?.name === 'Mysterious Fossil' || card?.name === 'Clefairy Doll';
    if (!card || !isBasicPkmn) return next;

    player.hand.splice(handIndex, 1);
    if (card.name === 'Mysterious Fossil' || card.name === 'Clefairy Doll') {
      const mockCard: Card = {
        ...card,
        id: `${card.id}_inplay_${Math.random()}`,
        number: card.number,
        name: card.name,
        supertype: 'Pokemon',
        subtype: 'Basic',
        types: ['Colorless'],
        hp: 10,
        retreatCost: 0,
        rarity: card.rarity,
        set: card.set,
        image: card.image,
        originalImageUrl: card.originalImageUrl || card.image,
        attacks: []
      };
      const inPlay = GameEngine.createInPlayCard(mockCard);
      inPlay.isClefairyDoll = true;
      player.active = inPlay;
    } else {
      player.active = GameEngine.createInPlayCard(card);
    }
    GameEngine.addLog(next, `You placed ${card.name} as your Active Pokémon.`, 'action');

    if (next.cpu.active) {
      next.phase = 'SETUP_ACTIVE';
    }
    return next;
  }

  static benchPokemon(state: GameState, playerId: 'player' | 'cpu', handIndex: number, directCard?: Card): GameState {
    const next: GameState = {
      ...state,
      [playerId]: {
        ...state[playerId],
        hand: [...state[playerId].hand],
        bench: [...state[playerId].bench]
      }
    };
    const player = next[playerId];
    const card = directCard || player.hand[handIndex];
    const isBasicPkmn = (card?.supertype === 'Pokemon' && card?.subtype === 'Basic') || card?.name === 'Mysterious Fossil' || card?.name === 'Clefairy Doll';

    if (!card || !isBasicPkmn) return next;
    if (player.bench.length >= 5) return next;

    const removeIdx = directCard ? player.hand.findIndex(c => c === directCard || (c.id && directCard.id && c.id === directCard.id)) : handIndex;
    if (removeIdx !== -1 && removeIdx < player.hand.length) {
      player.hand.splice(removeIdx, 1);
    }
    if (card.name === 'Mysterious Fossil' || card.name === 'Clefairy Doll') {
      const mockCard: Card = {
        ...card,
        id: `${card.id}_inplay_${Math.random()}`,
        number: card.number,
        name: card.name,
        supertype: 'Pokemon',
        subtype: 'Basic',
        types: ['Colorless'],
        hp: 10,
        retreatCost: 0,
        rarity: card.rarity,
        set: card.set,
        image: card.image,
        originalImageUrl: card.originalImageUrl || card.image,
        attacks: []
      };
      const inPlay = GameEngine.createInPlayCard(mockCard);
      inPlay.isClefairyDoll = true;
      player.bench.push(inPlay);
    } else {
      const inPlay = GameEngine.createInPlayCard(card);
      player.bench.push(inPlay);
    }

    GameEngine.addLog(next, `${player.name} put ${card.name} on the bench.`, playerId === 'cpu' ? 'ai' : 'action');
    return next;
  }

  static attachEnergy(
    state: GameState,
    playerId: 'player' | 'cpu',
    handIndex: number,
    targetInstanceId?: string,
    ignoreTurnLimit = false,
    directCard?: Card,
    targetIsActive = true,
    benchIndex = 0
  ): GameState {
    const next: GameState = {
      ...state,
      [playerId]: {
        ...state[playerId],
        hand: [...state[playerId].hand],
        bench: state[playerId].bench.map(b => ({ ...b, attachedEnergy: [...b.attachedEnergy] })),
        active: state[playerId].active ? { ...state[playerId].active!, attachedEnergy: [...state[playerId].active!.attachedEnergy] } : null
      }
    };
    const player = next[playerId];
    const card = directCard || player.hand[handIndex];

    if (!card || card.supertype !== 'Energy') return next;

    let target: InPlayCard | null = null;
    if (targetInstanceId) {
      if (player.active && player.active.instanceId === targetInstanceId) target = player.active;
      else target = player.bench.find(b => b.instanceId === targetInstanceId) || null;
    } else {
      target = targetIsActive ? player.active : player.bench[benchIndex] || null;
    }

    if (!target) return next;

    const hasRainDance = [player.active, ...player.bench].some(
      p => p && (p.card.power?.name === 'Rain Dance' || p.card.pokemonPower?.name === 'Rain Dance') &&
      p.status !== 'Asleep' && p.status !== 'Paralyzed' && p.status !== 'Confused' &&
      !GameEngine.isPowerDisabled(p, next.turn)
    );
    const isWaterEnergyToWaterPokemon = hasRainDance && (card.types?.includes('Water') || card.name.includes('Water')) && (target.card.types?.includes('Water'));

    if (!ignoreTurnLimit && !isWaterEnergyToWaterPokemon && player.energyAttachedThisTurn) return next;

    const removeIdx = directCard ? player.hand.findIndex(c => c === directCard || (c.id && directCard.id && c.id === directCard.id)) : handIndex;
    if (removeIdx !== -1 && removeIdx < player.hand.length) {
      player.hand.splice(removeIdx, 1);
    }

    target.attachedEnergy.push(card);
    if (!ignoreTurnLimit && !isWaterEnergyToWaterPokemon) player.energyAttachedThisTurn = true;

    GameEngine.addLog(next, `${player.name} attached ${card.name} to ${target.card.name}.`, playerId === 'cpu' ? 'ai' : 'action');
    return next;
  }

  
    static playComputerSearch(
    state: GameState,
    playerId: 'player' | 'cpu',
    searchCardHandIndex: number,
    discardHandIndices: number[],
    chosenDeckCardIndex: number,
    directCard?: Card
  ): GameState {
    const next = { ...state };
    const player = next[playerId];
    const searchCard = directCard || player.hand[searchCardHandIndex];
    if (!searchCard) return next;

    // 1. Remove Computer Search card and the 2 discarded cards from hand
    const allIndices = [
      directCard ? player.hand.findIndex(c => c === directCard || c.id === directCard.id) : searchCardHandIndex,
      ...discardHandIndices
    ].filter(i => i !== -1);

    const uniqueSortedIndices = Array.from(new Set(allIndices)).sort((a, b) => b - a);

    const discardedCards: Card[] = [];
    uniqueSortedIndices.forEach(idx => {
      if (idx < player.hand.length) {
        const removed = player.hand.splice(idx, 1)[0];
        player.discard.push(removed);
        if (removed !== searchCard) discardedCards.push(removed);
      }
    });

    // 2. Extract chosen card from deck and put into hand
    let chosenCard: Card | null = null;
    if (chosenDeckCardIndex >= 0 && chosenDeckCardIndex < player.deck.length) {
      chosenCard = player.deck.splice(chosenDeckCardIndex, 1)[0];
      player.hand.push(chosenCard);
    } else if (player.deck.length > 0) {
      chosenCard = player.deck.shift()!;
      player.hand.push(chosenCard);
    }

    // 3. Shuffle deck
    player.deck = GameEngine.shuffle(player.deck);
    player.trainerPlayedThisTurn = true;

    GameEngine.addLog(
      next,
      `💻 ${player.name} played Computer Search! Discarded 2 cards and retrieved ${chosenCard ? chosenCard.name : 'a card'} from deck!`,
      playerId === 'cpu' ? 'ai' : 'action'
    );

    return next;
  }

      static playEnergyRetrieval(
    state: GameState,
    playerId: 'player' | 'cpu',
    retrievalHandIndex: number,
    discardHandIndex: number,
    chosenDiscardEnergyIndices: number[]
  ): GameState {
    const next: GameState = {
      ...state,
      [playerId]: {
        ...state[playerId],
        hand: [...state[playerId].hand],
        discard: [...state[playerId].discard]
      }
    };
    const player = next[playerId];

    // 1. Retrieve the Energy Retrieval card
    const playedCard = player.hand[retrievalHandIndex];
    if (!playedCard) return next;

    // 2. Discard the chosen hand card
    const discardCard = player.hand[discardHandIndex];
    if (!discardCard) return next;

    // Remove played card and discarded card from hand
    const cardsToRemove = [playedCard.id, discardCard.id];
    player.hand = player.hand.filter(c => !cardsToRemove.includes(c.id));

    // Place both into discard
    player.discard.push(playedCard, discardCard);

    // 3. Move selected basic energy cards from discard to hand
    const selectedEnergies: Card[] = [];
    chosenDiscardEnergyIndices.forEach(dIdx => {
      const eCard = state[playerId].discard[dIdx];
      if (eCard && eCard.supertype === 'Energy') {
        selectedEnergies.push(eCard);
      }
    });

    const energyIds = selectedEnergies.map(e => e.id);
    player.discard = player.discard.filter(c => !energyIds.includes(c.id));
    player.hand.push(...selectedEnergies);

    player.trainerPlayedThisTurn = true;
    const names = selectedEnergies.map(e => e.name).join(', ');
    GameEngine.addLog(
      next,
      `⚡ ${player.name} played ${playedCard.name}, traded ${discardCard.name} from hand and recovered ${selectedEnergies.length} Basic Energy (${names}) from discard pile!`,
      'action'
    );
    return next;
  }

  static playMaintenance(
    state: GameState,
    playerId: 'player' | 'cpu',
    maintenanceHandIndex: number,
    chosenHandIndices: number[]
  ): GameState {
    const next: GameState = {
      ...state,
      [playerId]: {
        ...state[playerId],
        hand: [...state[playerId].hand],
        deck: [...state[playerId].deck],
        discard: [...state[playerId].discard]
      }
    };
    const player = next[playerId];

    const playedCard = player.hand[maintenanceHandIndex];
    if (!playedCard) return next;

    const cardsToShuffle: Card[] = [];
    chosenHandIndices.forEach(hIdx => {
      const c = state[playerId].hand[hIdx];
      if (c && c.id !== playedCard.id) {
        cardsToShuffle.push(c);
      }
    });

    const removeIds = [playedCard.id, ...cardsToShuffle.map(c => c.id)];
    player.hand = player.hand.filter(c => !removeIds.includes(c.id));
    player.discard.push(playedCard);

    player.deck.push(...cardsToShuffle);
    player.deck = GameEngine.shuffle(player.deck);

    // Draw 1 card
    let drawnCardName = '';
    if (player.deck.length > 0) {
      const drawn = player.deck.shift()!;
      player.hand.push(drawn);
      drawnCardName = drawn.name;
    }

    player.trainerPlayedThisTurn = true;
    const shuffledNames = cardsToShuffle.map(c => c.name).join(', ');
    GameEngine.addLog(
      next,
      `🔄 ${player.name} played Maintenance, shuffled 2 cards (${shuffledNames}) into deck and drew 1 card (${drawnCardName})!`,
      'action'
    );
    return next;
  }

  static playItemFinder(
    state: GameState,
    playerId: 'player' | 'cpu',
    itemFinderHandIndex: number,
    discardHandIndices: number[],
    chosenDiscardCardIndex: number,
    directCard?: Card
  ): GameState {
    const next = { ...state };
    const player = next[playerId];
    const itemFinderCard = directCard || player.hand[itemFinderHandIndex];
    if (!itemFinderCard) return next;

    // 1. Remove Item Finder and 2 discarded hand cards
    const allIndices = [
      directCard ? player.hand.findIndex(c => c === directCard || c.id === directCard.id) : itemFinderHandIndex,
      ...discardHandIndices
    ].filter(i => i !== -1);

    const uniqueSortedIndices = Array.from(new Set(allIndices)).sort((a, b) => b - a);

    uniqueSortedIndices.forEach(idx => {
      if (idx < player.hand.length) {
        const removed = player.hand.splice(idx, 1)[0];
        player.discard.push(removed);
      }
    });

    // 2. Retrieve chosen Trainer card from discard pile (excluding the Item Finder just played)
    const availableTrainers = player.discard.filter(c => c.supertype === 'Trainer' && c !== itemFinderCard);
    let chosenCard: Card | null = null;
    if (chosenDiscardCardIndex >= 0 && chosenDiscardCardIndex < availableTrainers.length) {
      const target = availableTrainers[chosenDiscardCardIndex];
      const realDiscardIdx = player.discard.findIndex(c => c === target);
      if (realDiscardIdx !== -1) {
        chosenCard = player.discard.splice(realDiscardIdx, 1)[0];
        player.hand.push(chosenCard);
      }
    }

    player.trainerPlayedThisTurn = true;

    GameEngine.addLog(
      next,
      `🔍 ${player.name} played Item Finder! Discarded 2 cards and retrieved ${chosenCard ? chosenCard.name : 'a Trainer'} from discard pile!`,
      playerId === 'cpu' ? 'ai' : 'action'
    );

    return next;
  }

  static playPokemonBreeder(
    state: GameState,
    playerId: 'player' | 'cpu',
    breederHandIndex: number,
    stage2HandIndex: number,
    targetInstanceId: string
  ): GameState {
    const next = { ...state };
    const player = next[playerId];
    const breederCard = player.hand[breederHandIndex];
    const stage2Card = player.hand[stage2HandIndex];

    if (!breederCard || !stage2Card) return next;

    let target: InPlayCard | null = null;
    if (player.active && player.active.instanceId === targetInstanceId) target = player.active;
    else target = player.bench.find(b => b.instanceId === targetInstanceId) || null;

    if (!target) return next;

    // Check matching basic
    const expectedBasic = STAGE_2_TO_BASIC_MAP[stage2Card.name];
    if (!expectedBasic || target.card.name !== expectedBasic) {
      return next;
    }

    if (next.turn === 1) {
      GameEngine.addLog(next, 'Cannot evolve on Turn 1 of the game!', 'system');
      return next;
    }

    if (target.turnsInPlay < 1) {
      GameEngine.addLog(next, `Cannot evolve ${target.card.name} on the turn it entered play! Must wait 1 turn.`, 'system');
      return next;
    }

    // Remove breeder and stage 2 card from hand
    // Remove higher index first to maintain correct index
    const indices = [breederHandIndex, stage2HandIndex].sort((a, b) => b - a);
    indices.forEach(idx => {
      const removed = player.hand.splice(idx, 1)[0];
      if (removed.name === 'Pokemon Breeder' || removed.name === 'Pokémon Breeder') {
        player.discard.push(removed);
      }
    });

    const oldCard = target.card;
    const oldMaxHp = oldCard.hp || 0;
    const newMaxHp = stage2Card.hp || 0;
    const hpDiff = newMaxHp - oldMaxHp;

    target.evolutionHistory.push(oldCard);
    target.card = stage2Card;
    target.currentHp = Math.max(1, target.currentHp + Math.max(0, hpDiff));
    target.status = 'None';
    target.poisonType = undefined;
    target.turnsInPlay = 0;
    player.trainerPlayedThisTurn = true;

    GameEngine.addLog(
      next,
      `▲ ${player.name} used Pokémon Breeder! Evolved ${oldCard.name} directly into ${stage2Card.name}! (Status cured, HP: ${target.currentHp}/${newMaxHp})`,
      playerId === 'cpu' ? 'ai' : 'action'
    );

    return next;
  }

  static evolvePokemon(
    state: GameState,
    playerId: 'player' | 'cpu',
    handIndex: number,
    targetInstanceId?: string,
    directCard?: Card,
    targetIsActive = true,
    benchIndex = 0
  ): GameState {
    const next: GameState = {
      ...state,
      [playerId]: {
        ...state[playerId],
        hand: [...state[playerId].hand],
        bench: state[playerId].bench.map(b => ({ ...b, evolutionHistory: [...b.evolutionHistory] })),
        active: state[playerId].active ? { ...state[playerId].active!, evolutionHistory: [...state[playerId].active!.evolutionHistory] } : null
      }
    };
    const player = next[playerId];
    const card = directCard || player.hand[handIndex];

    if (!card || card.supertype !== 'Pokemon' || !card.evolvesFrom) return next;

    let target: InPlayCard | null = null;
    if (targetInstanceId) {
      if (player.active && player.active.instanceId === targetInstanceId) target = player.active;
      else target = player.bench.find(b => b.instanceId === targetInstanceId) || null;
    } else {
      target = targetIsActive ? player.active : player.bench[benchIndex] || null;
    }

    if (!target || target.card.name !== card.evolvesFrom) return next;

    const isToxicGasInPlay = [state.player.active, ...state.player.bench, state.cpu.active, ...state.cpu.bench].some(
      p => p && p.card.name === 'Muk' && p.status !== 'Asleep' && p.status !== 'Paralyzed' && p.status !== 'Confused'
    );
    const isAerodactylActive = !isToxicGasInPlay && [state.player.active, ...state.player.bench, state.cpu.active, ...state.cpu.bench].some(
      p => p && p.card.name === 'Aerodactyl' && p.status !== 'Asleep' && p.status !== 'Paralyzed' && p.status !== 'Confused'
    );
    if (isAerodactylActive) {
      GameEngine.addLog(next, `🦖 Aerodactyl's Prehistoric Power prevents Evolution cards from being played!`, 'system');
      return next;
    }

    if (next.turn === 1) {
      GameEngine.addLog(next, `Cannot evolve ${target.card.name} on Turn 1 of the game!`, 'system');
      return next;
    }

    if (target.turnsInPlay < 1) {
      GameEngine.addLog(next, `Cannot evolve ${target.card.name} on the turn it entered play! Must wait at least 1 turn.`, 'system');
      return next;
    }

    const removeIdx = directCard ? player.hand.findIndex(c => c === directCard || (c.id && directCard.id && c.id === directCard.id)) : handIndex;
    if (removeIdx !== -1 && removeIdx < player.hand.length) {
      player.hand.splice(removeIdx, 1);
    }

    const oldCard = target.card;
    const oldMaxHp = oldCard.hp || 0;
    const newMaxHp = card.hp || 0;
    const hpDiff = newMaxHp - oldMaxHp;

    target.evolutionHistory.push(oldCard);
    target.card = card;
    target.currentHp = Math.max(1, target.currentHp + Math.max(0, hpDiff));
    target.status = 'None';
    target.poisonType = undefined;
    target.turnsInPlay = 0;
    delete (target as any).isClefairyDoll;

    GameEngine.addLog(next, `▲ ${player.name} evolved ${oldCard.name} into ${card.name}! (Status cured, HP: ${target.currentHp}/${newMaxHp})`, playerId === 'cpu' ? 'ai' : 'action');
    return next;
  }

  static canRetreat(inPlay: InPlayCard, hasRetreatedThisTurn = false): boolean {
    if (hasRetreatedThisTurn) return false;
    if (inPlay.preventRetreatNextTurn) return false;
    if (inPlay.status === 'Paralyzed' || inPlay.status === 'Asleep') return false;
    if (inPlay.card.name === 'Mysterious Fossil' || inPlay.card.name === 'Clefairy Doll' || inPlay.isClefairyDoll) return false;

    const retreatCost = inPlay.card.retreatCost || 0;
    if (retreatCost === 0) return true;

    let energyAvailable = 0;
    inPlay.attachedEnergy.forEach(e => {
      const isDce = e.name.includes('Double Colorless') || e.number === 96 || e.number === 124;
      energyAvailable += (isDce ? 2 : 1);
    });

    return energyAvailable >= retreatCost;
  }

  static discardFossilFromPlay(state: GameState, playerId: 'player' | 'cpu', instanceId: string): GameState {
    const next: GameState = {
      ...state,
      [playerId]: {
        ...state[playerId],
        hand: [...state[playerId].hand],
        bench: [...state[playerId].bench],
        discard: [...state[playerId].discard]
      }
    };
    const player = next[playerId];
    if (player.active && player.active.instanceId === instanceId) {
      const activeCard = player.active;
      const isFossil = activeCard.card.name === 'Mysterious Fossil' || activeCard.card.name === 'Clefairy Doll' || activeCard.isClefairyDoll;
      if (!isFossil) return next;
      player.discard.push(activeCard.card, ...activeCard.attachedEnergy, ...activeCard.evolutionHistory);
      player.active = null;
      GameEngine.addLog(next, `🧸 ${player.name} discarded ${activeCard.card.name} from Active spot!`, 'action');

      if (player.bench.length > 0) {
        if (playerId === 'player') {
          next.phase = 'SELECT_BENCH_REPLACEMENT';
        } else {
          player.active = player.bench.shift()!;
        }
      } else {
        const opponent = next[playerId === 'player' ? 'cpu' : 'player'];
        next.winner = opponent.id;
        next.winReason = `${player.name} has no remaining Pokémon in play!`;
        next.phase = 'GAME_OVER';
      }
      return next;
    }

    const bIdx = player.bench.findIndex(b => b.instanceId === instanceId);
    if (bIdx !== -1) {
      const bCard = player.bench[bIdx];
      const isFossil = bCard.card.name === 'Mysterious Fossil' || bCard.card.name === 'Clefairy Doll' || bCard.isClefairyDoll;
      if (!isFossil) return next;
      player.bench.splice(bIdx, 1);
      player.discard.push(bCard.card, ...bCard.attachedEnergy, ...bCard.evolutionHistory);
      GameEngine.addLog(next, `🧸 ${player.name} discarded ${bCard.card.name} from the Bench!`, 'action');
      return next;
    }

    return next;
  }

  static retreatPokemon(state: GameState, playerId: 'player' | 'cpu', benchIndex: number): GameState {
    const next = { ...state };
    const player = next[playerId];
    if (!player.active || player.hasRetreatedThisTurn) return next;
    if (benchIndex < 0 || benchIndex >= player.bench.length) return next;

    if (!GameEngine.canRetreat(player.active, player.hasRetreatedThisTurn)) {
      GameEngine.addLog(next, `${player.active.card.name} cannot retreat!`, 'system');
      return next;
    }

    const retreatCost = player.active.card.retreatCost || 0;
    let discarded = 0;
    while (discarded < retreatCost && player.active.attachedEnergy.length > 0) {
      const removed = player.active.attachedEnergy.pop()!;
      player.discard.push(removed);
      const isDce = removed.name.includes('Double Colorless') || removed.number === 96 || removed.number === 124;
      discarded += (isDce ? 2 : 1);
    }

    const oldActive = player.active;
    const newActive = player.bench.splice(benchIndex, 1)[0];
    oldActive.status = 'None';
    oldActive.poisonType = undefined;
    oldActive.sandAttackedNextTurn = false;
    GameEngine.clearAttackBlock(oldActive);
    oldActive.preventDamageNextTurn = false;
    oldActive.preventAllEffectsNextTurn = false;
    oldActive.hardenActiveNextTurn = false;
    oldActive.swordsDanceActiveNextTurn = false;
    oldActive.plusPowersAttached = 0;
    oldActive.defendersAttached = 0;

    newActive.status = 'None';
    newActive.poisonType = undefined;
    newActive.sandAttackedNextTurn = false;
    GameEngine.clearAttackBlock(newActive);
    newActive.preventDamageNextTurn = false;
    newActive.preventAllEffectsNextTurn = false;
    newActive.hardenActiveNextTurn = false;
    newActive.swordsDanceActiveNextTurn = false;
    newActive.plusPowersAttached = 0;
    newActive.defendersAttached = 0;

    player.bench.push(oldActive);
    player.active = newActive;
    player.hasRetreatedThisTurn = true;
    // "(Benching either Pokémon ends this effect.)" - retreating the Tail Wag / Leer user frees
    // the marked opponent straight away instead of leaving a dead mark on the board.
    GameEngine.pruneAttackBlocks(next);

    GameEngine.addLog(next, `🔄 ${player.name} retreated ${oldActive.card.name} and sent out ${newActive.card.name}!`, playerId === 'cpu' ? 'ai' : 'action');
    return next;
  }

  static sendOutBenchedPokemon(state: GameState, playerId: 'player' | 'cpu', benchIndex: number): GameState {
    const next: GameState = {
      ...state,
      player: { ...state.player, bench: [...state.player.bench], discard: [...state.player.discard], hand: [...state.player.hand], prizes: [...state.player.prizes], deck: [...state.player.deck] },
      cpu: { ...state.cpu, bench: [...state.cpu.bench], discard: [...state.cpu.discard], hand: [...state.cpu.hand], prizes: [...state.cpu.prizes], deck: [...state.cpu.deck] },
      logs: [...state.logs]
    };
    const player = next[playerId];
    if (benchIndex < 0 || benchIndex >= player.bench.length) return next;

    const newActive = player.bench.splice(benchIndex, 1)[0];
    newActive.status = 'None';
    newActive.sandAttackedNextTurn = false;
    GameEngine.clearAttackBlock(newActive);
    newActive.preventDamageNextTurn = false;
    newActive.preventAllEffectsNextTurn = false;
    newActive.hardenActiveNextTurn = false;
    newActive.swordsDanceActiveNextTurn = false;
    newActive.plusPowersAttached = 0;
    newActive.defendersAttached = 0;
    player.active = newActive;
    GameEngine.pruneAttackBlocks(next);
    GameEngine.addLog(next, `${player.name} sent out ${newActive.card.name} from the bench!`, playerId === 'cpu' ? 'ai' : 'action');

    if (next.phase === 'SELECT_BENCH_REPLACEMENT' && playerId === 'player') {
      next.phase = 'MAIN_PHASE';
      return GameEngine.advanceTurn(next);
    }

    return next;
  }

  /**
   * Removes one attached Energy from a Pokémon. When the caller (a human through the
   * selection modal) picked an index that one is used; otherwise it falls back to the
   * last attached Energy so the AI and legacy callers keep working.
   */
  static discardAttachedEnergy(pokemon: InPlayCard, index?: number): Card | null {
    if (!pokemon || pokemon.attachedEnergy.length === 0) return null;
    const idx = (index !== undefined && Number.isInteger(index) && index >= 0 && index < pokemon.attachedEnergy.length)
      ? index
      : pokemon.attachedEnergy.length - 1;
    return pokemon.attachedEnergy.splice(idx, 1)[0];
  }

  static playTrainer(state: GameState, playerId: 'player' | 'cpu', handIndex: number, params?: TrainerEffectParams, directCard?: Card): GameState {
    const next = { ...state };
    const player = next[playerId];
    const opponent = next[playerId === 'player' ? 'cpu' : 'player'];
    const card = directCard || player.hand[handIndex];

    if (!card || card.supertype !== 'Trainer') return next;

    if (player.trainerBlockedNextTurn) {
      GameEngine.addLog(next, `🚫 Psyduck's Headache is active! You cannot play Trainer cards this turn!`, 'system');
      return next;
    }

    const isToxicGasInPlay = [state.player.active, ...state.player.bench, state.cpu.active, ...state.cpu.bench].some(
      p => p && p.card.name === 'Muk' && p.status !== 'Asleep' && p.status !== 'Paralyzed' && p.status !== 'Confused'
    );
    const isDarkVileplumeActive = !isToxicGasInPlay && [state.player.active, ...state.player.bench, state.cpu.active, ...state.cpu.bench].some(
      p => p && p.card.name === 'Dark Vileplume' && p.status !== 'Asleep' && p.status !== 'Paralyzed' && p.status !== 'Confused'
    );
    if (isDarkVileplumeActive) {
      GameEngine.addLog(next, `🌸 Dark Vileplume's Hay Fever prevents Trainer cards from being played!`, 'system');
      return next;
    }

    if (player.trainerPlayedThisTurn) {
      GameEngine.addLog(next, `You have already played a Trainer card this turn (1 per turn limit)!`, 'system');
      return next;
    }

    const removeIdx = directCard ? player.hand.findIndex(c => c === directCard || c.id === directCard.id) : handIndex;
    if (removeIdx !== -1 && removeIdx < player.hand.length) {
      player.hand.splice(removeIdx, 1);
    }
    player.discard.push(card);
    player.trainerPlayedThisTurn = true;

    GameEngine.addLog(next, `✨ ${player.name} played Trainer card: ${card.name}!`, playerId === 'cpu' ? 'ai' : 'action');

    if (card.name === 'Bill') {
      for (let i = 0; i < 2 && player.deck.length > 0; i++) {
        player.hand.push(player.deck.shift()!);
      }
      GameEngine.addLog(next, `${player.name} drew 2 cards with Bill.`, 'action');
    } else if (card.name === 'Professor Oak') {
      while (player.hand.length > 0) player.discard.push(player.hand.pop()!);
      for (let i = 0; i < 7 && player.deck.length > 0; i++) player.hand.push(player.deck.shift()!);
      GameEngine.addLog(next, `${player.name} discarded hand and drew 7 cards with Professor Oak.`, 'action');
    } else if (card.name === 'Potion') {
      const target = params?.targetPokemon || player.active;
      if (target) {
        if ((target.damage || 0) <= 0 || target.currentHp >= (target.card.hp || 0)) {
          GameEngine.addLog(next, `${target.card.name} already has full HP! Potion had no effect.`, 'status');
        } else {
          target.damage = Math.max(0, target.damage - 20);
          target.currentHp = Math.min(target.card.hp || 0, target.currentHp + 20);
          GameEngine.addLog(next, `${target.card.name} recovered 20 HP with Potion (${target.currentHp}/${target.card.hp} HP)!`, 'status');
        }
      }
    } else if (card.name === 'Super Potion') {
      const target = params?.targetPokemon || player.active;
      if (target && target.attachedEnergy.length > 0) {
        if ((target.damage || 0) <= 0 || target.currentHp >= (target.card.hp || 0)) {
          GameEngine.addLog(next, `${target.card.name} already has full HP! Super Potion had no effect.`, 'status');
        } else {
          // The player picks which attached Energy pays for the heal.
          const paid = GameEngine.discardAttachedEnergy(target, params?.chosenEnergyIndex)!;
          player.discard.push(paid);
          target.damage = Math.max(0, target.damage - 40);
          target.currentHp = Math.min(target.card.hp || 0, target.currentHp + 40);
          GameEngine.addLog(next, `${target.card.name} discarded ${paid.name} and recovered 40 HP!`, 'status');
        }
      }
    } else if (card.name === 'Full Heal') {
      if (player.active) {
        player.active.status = 'None';
        player.active.poisonType = undefined;
        GameEngine.addLog(next, `${player.active.card.name} was healed of all status conditions!`, 'status');
      }
    } else if (card.name === 'Switch') {
      if (player.bench.length > 0 && player.active) {
        const bIdx = (params?.targetBenchIndex !== undefined && params.targetBenchIndex >= 0 && params.targetBenchIndex < player.bench.length)
          ? params.targetBenchIndex
          : 0;
        const oldActive = player.active;
        const newActive = player.bench.splice(bIdx, 1)[0];
        oldActive.status = 'None';
        oldActive.poisonType = undefined;
        oldActive.sandAttackedNextTurn = false;
        GameEngine.clearAttackBlock(oldActive);
        oldActive.preventDamageNextTurn = false;
        oldActive.preventAllEffectsNextTurn = false;
        oldActive.hardenActiveNextTurn = false;

        newActive.status = 'None';
        newActive.poisonType = undefined;
        newActive.sandAttackedNextTurn = false;
        GameEngine.clearAttackBlock(newActive);
        newActive.preventDamageNextTurn = false;
        newActive.preventAllEffectsNextTurn = false;
        newActive.hardenActiveNextTurn = false;

        player.bench.push(oldActive);
        player.active = newActive;
        GameEngine.addLog(next, `${player.name} switched ${oldActive.card.name} with ${newActive.card.name}!`, 'action');
      }
    } else if (card.name === 'Gust of Wind') {
      if (opponent.bench.length > 0 && opponent.active) {
        const bIdx = (params?.targetBenchIndex !== undefined && params.targetBenchIndex >= 0 && params.targetBenchIndex < opponent.bench.length)
          ? params.targetBenchIndex
          : 0;
        const oldActive = opponent.active;
        const newActive = opponent.bench.splice(bIdx, 1)[0];
        oldActive.status = 'None';
        oldActive.poisonType = undefined;
        oldActive.sandAttackedNextTurn = false;
        GameEngine.clearAttackBlock(oldActive);
        oldActive.preventDamageNextTurn = false;
        oldActive.preventAllEffectsNextTurn = false;
        oldActive.hardenActiveNextTurn = false;

        newActive.status = 'None';
        newActive.poisonType = undefined;
        newActive.sandAttackedNextTurn = false;
        GameEngine.clearAttackBlock(newActive);
        newActive.preventDamageNextTurn = false;
        newActive.preventAllEffectsNextTurn = false;
        newActive.hardenActiveNextTurn = false;

        opponent.bench.push(oldActive);
        opponent.active = newActive;
        GameEngine.addLog(next, `💨 Gust of Wind forced ${opponent.name}'s ${newActive.card.name} into the Active position!`, 'action');
      }
    } else if (card.name === 'Energy Removal') {
      // "Choose 1 Energy card attached to 1 of your opponent's Pokémon and discard it."
      const target = params?.oppTargetPokemon || opponent.active;
      if (target && target.attachedEnergy.length > 0) {
        const removed = GameEngine.discardAttachedEnergy(target, params?.chosenEnergyIndex)!;
        opponent.discard.push(removed);
        GameEngine.addLog(next, `${opponent.name}'s ${target.card.name} lost its ${removed.name} to Energy Removal!`, 'action');
      }
    } else if (card.name === 'PlusPower') {
      if (player.active) {
        player.active.plusPowersAttached = (player.active.plusPowersAttached || 0) + 1;
        GameEngine.addLog(next, `Attached PlusPower to ${player.active.card.name} (+10 attack damage this turn)!`, 'action');
      }
    } else if (card.name === 'Energy Retrieval') {
      const otherCards = player.hand.filter(c => c.id !== card.id);
      if (otherCards.length > 0) {
        const discarded = player.hand.splice(player.hand.findIndex(c => c.id === otherCards[0].id), 1)[0];
        player.discard.push(discarded);
      }
      const energiesInDiscard = player.discard.filter(c => c.supertype === 'Energy');
      const count = Math.min(2, energiesInDiscard.length);
      const retrieved: Card[] = [];
      for (let i = 0; i < count; i++) {
        const idx = player.discard.findIndex(c => c.supertype === 'Energy');
        if (idx !== -1) {
          const e = player.discard.splice(idx, 1)[0];
          player.hand.push(e);
          retrieved.push(e);
        }
      }
      GameEngine.addLog(next, `⚡ ${player.name} played Energy Retrieval, recovering ${retrieved.length} Basic Energy cards from discard!`, 'action');
    } else if (card.name === 'Super Energy Removal') {
      // "Discard 1 Energy card attached to your Active Pokémon in order to discard up to
      // 2 Energy cards attached to 1 of your opponent's Pokémon." Both are player choices.
      const oppTarget = params?.oppTargetPokemon || opponent.active;
      const canPay = !!(player.active && player.active.attachedEnergy.length > 0);
      const canStrip = !!(oppTarget && oppTarget.attachedEnergy.length > 0);
      if (canPay && canStrip) {
        const paid = GameEngine.discardAttachedEnergy(player.active!, params?.chosenEnergyIndex)!;
        player.discard.push(paid);

        const maxStrip = Math.min(2, oppTarget!.attachedEnergy.length);
        const picked: number[] = (params?.chosenOppEnergyIndices || [])
          .filter((i: number) => Number.isInteger(i) && i >= 0 && i < oppTarget!.attachedEnergy.length)
          .slice(0, maxStrip);
        const stripped: Card[] = [];
        // Splice from the highest index down so the remaining indices stay valid.
        [...picked].sort((a, b) => b - a).forEach(i => stripped.unshift(oppTarget!.attachedEnergy.splice(i, 1)[0]));
        while (stripped.length < maxStrip && oppTarget!.attachedEnergy.length > 0) {
          stripped.push(oppTarget!.attachedEnergy.pop()!);
        }
        opponent.discard.push(...stripped);
        GameEngine.addLog(next, `${player.name} paid ${paid.name} with Super Energy Removal and stripped ${stripped.map(e => e.name).join(' + ')} from ${oppTarget!.card.name}!`, 'action');
      }
    } else if (card.name === 'Maintenance') {
      if (player.hand.length >= 2) {
        for (let i = 0; i < 2; i++) {
          player.deck.push(player.hand.pop()!);
        }
        if (player.deck.length > 0) {
          player.hand.push(player.deck.shift()!);
        }
        GameEngine.addLog(next, `${player.name} used Maintenance, shuffled 2 cards and drew 1 card.`, 'action');
      }
    } else if (card.name === 'Lass') {
      const playerTrainers = player.hand.filter(c => c.supertype === 'Trainer');
      player.hand = player.hand.filter(c => c.supertype !== 'Trainer');
      player.deck.push(...playerTrainers);

      const cpuTrainers = opponent.hand.filter(c => c.supertype === 'Trainer');
      opponent.hand = opponent.hand.filter(c => c.supertype !== 'Trainer');
      opponent.deck.push(...cpuTrainers);

      GameEngine.addLog(next, `${player.name} used Lass! All Trainer cards in both hands were shuffled into decks.`, 'action');
    } else if (card.name === 'Revive') {
      // "choose 1 Basic Pokémon card from your discard pile"
      const wantedIdx = params?.chosenDiscardIndex;
      const basicInDiscardIdx = (wantedIdx !== undefined && wantedIdx >= 0 && wantedIdx < player.discard.length
        && player.discard[wantedIdx].supertype === 'Pokemon' && player.discard[wantedIdx].subtype === 'Basic')
        ? wantedIdx
        : player.discard.findIndex(c => c.supertype === 'Pokemon' && c.subtype === 'Basic');
      if (basicInDiscardIdx !== -1 && player.bench.length < 5) {
        const basicCard = player.discard.splice(basicInDiscardIdx, 1)[0];
        const halfHp = Math.floor((basicCard.hp || 50) / 2);
        const inPlay: InPlayCard = {
          card: basicCard,
          instanceId: Math.random().toString(36).substring(2, 9),
          damage: halfHp,
          currentHp: Math.max(10, (basicCard.hp || 50) - halfHp),
          status: 'None',
          attachedEnergy: [],
          evolutionHistory: [],
          turnsInPlay: 0
        };
        player.bench.push(inPlay);
        GameEngine.addLog(next, `${player.name} revived ${basicCard.name} to the bench!`, 'action');
      }
    } else if (card.name === 'Scoop Up') {
      const target = params?.targetPokemon || player.active;
      if (target) {
        player.hand.push(target.card);
        player.discard.push(...target.attachedEnergy, ...target.evolutionHistory);
        if (target === player.active) {
          player.active = null;
        } else {
          player.bench = player.bench.filter(b => b.instanceId !== target.instanceId);
        }
        GameEngine.addLog(next, `${player.name} scooped up ${target.card.name} back to hand.`, 'action');
      }
    } else if (card.name === 'Devolution Spray') {
      const target = params?.targetPokemon || player.active;
      if (target && target.evolutionHistory.length > 0) {
        const prevCard = target.evolutionHistory.pop()!;
        player.discard.push(target.card);
        target.card = prevCard;
        target.status = 'None';
        target.poisonType = undefined;
        target.currentHp = Math.min(prevCard.hp || 50, target.currentHp);
        GameEngine.addLog(next, `${player.name} devolved ${target.card.name} with Devolution Spray!`, 'action');
      }
    } else if (card.name === 'Defender') {
      if (player.active) {
        player.active.defendersAttached = (player.active.defendersAttached || 0) + 1;
        GameEngine.addLog(next, `Attached Defender to ${player.active.card.name} (-20 damage received next turn)!`, 'action');
      }
    } else if (card.name === 'Gambler') {
      const flip = (params?.coinResults && params.coinResults.length > 0) ? params.coinResults[0] : (Math.random() >= 0.5);
      const handCards = [...player.hand];
      player.hand = [];
      player.deck.push(...handCards);
      player.deck = GameEngine.shuffle(player.deck);
      const drawCount = flip ? 8 : 1;
      for (let i = 0; i < drawCount && player.deck.length > 0; i++) {
        player.hand.push(player.deck.shift()!);
      }
      GameEngine.addLog(next, `🎰 Gambler coin flip: ${flip ? 'HEADS' : 'TAILS'}! ${player.name} shuffled hand into deck and drew ${player.hand.length} card(s)!`, 'action');
    } else if (card.name === 'Energy Search') {
      let foundIdx = params?.chosenDeckIndex;
      if (foundIdx === undefined || foundIdx < 0 || foundIdx >= player.deck.length) {
        foundIdx = player.deck.findIndex(c => 
          c.supertype === 'Energy' && 
          (!c.subtype || c.subtype.includes('Basic')) && 
          !c.name.includes('Double Colorless') && 
          !c.name.includes('Rainbow')
        );
      }
      if (foundIdx !== -1) {
        const found = player.deck.splice(foundIdx, 1)[0];
        player.hand.push(found);
        player.deck = GameEngine.shuffle(player.deck);
        GameEngine.addLog(next, `⚡ Energy Search! ${player.name} found ${found.name} in deck and added it to hand!`, 'action');
      } else {
        player.deck = GameEngine.shuffle(player.deck);
        GameEngine.addLog(next, `Energy Search: No basic Energy cards found in deck.`, 'action');
      }
    } else if (card.name === 'Poké Ball' || card.name === 'Poke Ball') {
      const flip = (params?.coinResults && params.coinResults.length > 0) ? params.coinResults[0] : (Math.random() >= 0.5);
      if (flip) {
        let pokeIdx = params?.chosenDeckIndex;
        if (pokeIdx === undefined || pokeIdx < 0 || pokeIdx >= player.deck.length) {
          pokeIdx = player.deck.findIndex(c => c.supertype === 'Pokemon');
        }
        if (pokeIdx !== -1) {
          const found = player.deck.splice(pokeIdx, 1)[0];
          player.hand.push(found);
          player.deck = GameEngine.shuffle(player.deck);
          GameEngine.addLog(next, `🔴 Poké Ball coin flip: HEADS! Found ${found.name} in deck and added it to hand!`, 'action');
        } else {
          player.deck = GameEngine.shuffle(player.deck);
          GameEngine.addLog(next, `Poké Ball: No Pokémon found in deck.`, 'action');
        }
      } else {
        GameEngine.addLog(next, `🔴 Poké Ball coin flip: TAILS! Failed to catch a Pokémon.`, 'action');
      }
    } else if (card.name === 'Recycle') {
      const flip = (params?.coinResults && params.coinResults.length > 0) ? params.coinResults[0] : (Math.random() >= 0.5);
      if (flip && player.discard.length > 0) {
        const discardIdx = (params?.targetDiscardIndex !== undefined && params.targetDiscardIndex >= 0 && params.targetDiscardIndex < player.discard.length)
          ? params.targetDiscardIndex
          : player.discard.length - 1;
        const recycled = player.discard.splice(discardIdx, 1)[0];
        player.deck.unshift(recycled);
        GameEngine.addLog(next, `♻️ Recycle coin flip: HEADS! Placed ${recycled.name} from discard pile on top of deck!`, 'action');
      } else if (!flip) {
        GameEngine.addLog(next, `♻️ Recycle coin flip: TAILS! Recycle failed.`, 'action');
      }
    } else if (card.name === 'Mr. Fuji' || card.name === 'Mr Fuji') {
      if (player.bench.length > 0) {
        const bIdx = (params?.targetBenchIndex !== undefined && params.targetBenchIndex >= 0 && params.targetBenchIndex < player.bench.length) ? params.targetBenchIndex : 0;
        const benched = player.bench.splice(bIdx, 1)[0];
        player.deck.push(benched.card, ...benched.attachedEnergy, ...benched.evolutionHistory);
        player.deck = GameEngine.shuffle(player.deck);
        GameEngine.addLog(next, `🏔️ Mr. Fuji! Returned ${benched.card.name} and all attached cards to the deck!`, 'action');
      }
    } else if (card.name === 'Mysterious Fossil' || card.name === 'Clefairy Doll') {
      if (player.bench.length < 5) {
        const mockCard: Card = {
          ...card,
          id: `${card.id}_inplay_${Math.random()}`,
          number: card.number,
          name: card.name,
          supertype: 'Pokemon',
          subtype: 'Basic',
          types: ['Colorless'],
          hp: 10,
          retreatCost: 0,
          rarity: card.rarity,
          set: card.set,
          image: card.image,
          originalImageUrl: card.originalImageUrl || card.image,
          attacks: []
        };
        const inPlay = GameEngine.createInPlayCard(mockCard);
        inPlay.isClefairyDoll = true;
        player.bench.push(inPlay);
        GameEngine.addLog(next, `🧸 ${player.name} played ${card.name} as a Basic Pokémon on the Bench (10 HP)!`, 'action');
      }
    } else if (card.name.includes('Impostor Professor Oak') || card.name.includes('Imposter Professor Oak')) {
      const oppHand = [...opponent.hand];
      opponent.hand = [];
      opponent.deck.push(...oppHand);
      opponent.deck = GameEngine.shuffle(opponent.deck);
      for (let i = 0; i < 7 && opponent.deck.length > 0; i++) {
        opponent.hand.push(opponent.deck.shift()!);
      }
      GameEngine.addLog(next, `🥸 Imposter Professor Oak! ${opponent.name} shuffled hand into deck and drew 7 cards!`, 'action');
    } else if (card.name.includes('Here Comes Team Rocket')) {
      GameEngine.addLog(next, `🚀 Here Comes Team Rocket! All Prize cards are revealed face-up!`, 'action');
    } else if (card.name.includes("Rocket's Sneak Attack") || card.name.includes("Rocket’s Sneak Attack")) {
      const oppTrainerIdx = opponent.hand.findIndex(c => c.supertype === 'Trainer');
      if (oppTrainerIdx !== -1) {
        const removed = opponent.hand.splice(oppTrainerIdx, 1)[0];
        opponent.deck.push(removed);
        opponent.deck = GameEngine.shuffle(opponent.deck);
        GameEngine.addLog(next, `🕵️ Rocket's Sneak Attack! Shuffled ${removed.name} from ${opponent.name}'s hand into their deck!`, 'action');
      } else {
        GameEngine.addLog(next, `Rocket's Sneak Attack: No Trainer cards found in ${opponent.name}'s hand.`, 'action');
      }
    } else if (card.name.includes("The Boss's Way") || card.name.includes("The Boss’s Way")) {
      const darkEvoIdx = player.deck.findIndex(c => c.name.includes('Dark') && (c.subtype === 'Stage 1' || c.subtype === 'Stage 2'));
      if (darkEvoIdx !== -1) {
        const found = player.deck.splice(darkEvoIdx, 1)[0];
        player.hand.push(found);
        player.deck = GameEngine.shuffle(player.deck);
        GameEngine.addLog(next, `👑 The Boss's Way! Found ${found.name} in deck and added it to hand!`, 'action');
      } else {
        player.deck = GameEngine.shuffle(player.deck);
        GameEngine.addLog(next, `The Boss's Way: No Dark Evolution cards found in deck.`, 'action');
      }
    } else if (card.name === 'Challenge!') {
      for (let i = 0; i < 2 && player.deck.length > 0; i++) {
        player.hand.push(player.deck.shift()!);
      }
      GameEngine.addLog(next, `⚔️ Challenge! ${player.name} played Challenge and drew 2 cards!`, 'action');
    } else if (card.name === 'Digger') {
      const flip = (params?.coinResults && params.coinResults.length > 0) ? params.coinResults[0] : (Math.random() >= 0.5);
      if (flip && opponent.bench.length > 0) {
        // "choose 1 of your opponent's Benched Pokémon"
        const wantedIdx = params?.chosenOppBenchIndex;
        const bIdx = (wantedIdx !== undefined && wantedIdx >= 0 && wantedIdx < opponent.bench.length) ? wantedIdx : 0;
        const returned = opponent.bench.splice(bIdx, 1)[0];
        opponent.hand.push(returned.card, ...returned.attachedEnergy, ...returned.evolutionHistory);
        GameEngine.addLog(next, `⛏️ Digger coin flip: HEADS! Returned ${opponent.name}'s ${returned.card.name} and cards to their hand!`, 'action');
      } else if (!flip) {
        GameEngine.addLog(next, `⛏️ Digger coin flip: TAILS! Digger failed.`, 'action');
      }
    } else if (card.name.includes("Imposter Oak's Revenge") || card.name.includes("Imposter Oak’s Revenge")) {
      const oppHand = [...opponent.hand];
      opponent.hand = [];
      opponent.deck.push(...oppHand);
      opponent.deck = GameEngine.shuffle(opponent.deck);
      for (let i = 0; i < 4 && opponent.deck.length > 0; i++) {
        opponent.hand.push(opponent.deck.shift()!);
      }
      GameEngine.addLog(next, `😈 Imposter Oak's Revenge! ${opponent.name} shuffled hand into deck and drew 4 cards!`, 'action');
    } else if (card.name.includes('Nightly Garbage Run')) {
      const eligible = player.discard.filter(c => c.supertype === 'Pokemon' || c.supertype === 'Energy');
      const count = Math.min(3, eligible.length);
      for (let i = 0; i < count; i++) {
        const idx = player.discard.findIndex(c => c.supertype === 'Pokemon' || c.supertype === 'Energy');
        if (idx !== -1) {
          player.deck.push(player.discard.splice(idx, 1)[0]);
        }
      }
      player.deck = GameEngine.shuffle(player.deck);
      GameEngine.addLog(next, `🗑️ Nightly Garbage Run! Recycled ${count} Pokémon/Energy cards into the deck!`, 'action');
    } else if (card.name.includes('Goop Gas Attack')) {
      GameEngine.addLog(next, `💨 Goop Gas Attack! All Pokémon Powers are disabled until the end of next turn!`, 'action');
    } else if (card.name === 'Sleep!') {
      const flip = (params?.coinResults && params.coinResults.length > 0) ? params.coinResults[0] : (Math.random() >= 0.5);
      if (flip && opponent.active) {
        opponent.active.status = 'Asleep';
        GameEngine.addLog(next, `💤 Sleep! coin flip: HEADS! ${opponent.active.card.name} is now Asleep!`, 'status');
      } else {
        GameEngine.addLog(next, `💤 Sleep! coin flip: TAILS! ${opponent.active ? opponent.active.card.name : 'Opponent'} avoided Sleep.`, 'action');
      }
    } else if (card.name.includes('Pokémon Center') || card.name.includes('Pokemon Center')) {
      [player.active, ...player.bench].forEach(p => {
        if (p) {
          p.status = 'None';
          p.poisonType = undefined;
          p.damage = 0;
          p.currentHp = p.card.hp || 50;
          player.discard.push(...p.attachedEnergy);
          p.attachedEnergy = [];
        }
      });
      GameEngine.addLog(next, `🏥 Pokémon Center! Fully healed all Pokémon and discarded all attached Energy cards!`, 'status');
    } else if (card.name.includes('Pokémon Flute') || card.name.includes('Pokemon Flute')) {
      // "choose 1 Basic Pokémon card from your opponent's discard pile"
      const wantedIdx = params?.chosenOppDiscardIndex;
      const oppBasicIdx = (wantedIdx !== undefined && wantedIdx >= 0 && wantedIdx < opponent.discard.length
        && opponent.discard[wantedIdx].supertype === 'Pokemon' && opponent.discard[wantedIdx].subtype === 'Basic')
        ? wantedIdx
        : opponent.discard.findIndex(c => c.supertype === 'Pokemon' && c.subtype === 'Basic');
      if (oppBasicIdx !== -1 && opponent.bench.length < 5) {
        const basicCard = opponent.discard.splice(oppBasicIdx, 1)[0];
        const inPlay = GameEngine.createInPlayCard(basicCard);
        opponent.bench.push(inPlay);
        GameEngine.addLog(next, `🎶 Pokémon Flute! Revived ${opponent.name}'s ${basicCard.name} to their Bench!`, 'action');
      }
    } else if (card.name.includes('Pokédex') || card.name.includes('Pokedex')) {
      GameEngine.addLog(next, `📱 Pokédex! Examined and rearranged top 5 cards of the deck!`, 'action');
    } else if (card.name.includes('Pokémon Trader') || card.name.includes('Pokemon Trader')) {
      // "Discard a Pokémon card in your hand and put a Pokémon card from your deck into your hand"
      const wantHand = params?.chosenTraderHandIndex;
      const wantDeck = params?.chosenTraderDeckIndex;
      const pokeInHandIdx = (wantHand !== undefined && player.hand[wantHand]?.supertype === 'Pokemon')
        ? wantHand : player.hand.findIndex(c => c.supertype === 'Pokemon');
      const pokeInDeckIdx = (wantDeck !== undefined && player.deck[wantDeck]?.supertype === 'Pokemon')
        ? wantDeck : player.deck.findIndex(c => c.supertype === 'Pokemon');
      if (pokeInHandIdx !== -1 && pokeInDeckIdx !== -1) {
        const handPoke = player.hand.splice(pokeInHandIdx, 1)[0];
        const deckPoke = player.deck.splice(pokeInDeckIdx, 1)[0];
        player.hand.push(deckPoke);
        player.deck.push(handPoke);
        player.deck = GameEngine.shuffle(player.deck);
        GameEngine.addLog(next, `🤝 Pokémon Trader! Traded ${handPoke.name} for ${deckPoke.name} from the deck!`, 'action');
      }
    }

    return next;
  }

  static canPayAttackCost(inPlay: InPlayCard, attack: Attack): boolean {
    const cost = [...attack.cost];
    const availableEnergy = [...inPlay.attachedEnergy];

    let colorlessCount = 0;
    const specificCosts: EnergyType[] = [];

    cost.forEach(c => {
      if (c === 'Colorless') colorlessCount++;
      else specificCosts.push(c);
    });

    const hasEnergyBurn = inPlay.card.name === 'Charizard' && inPlay.status !== 'Asleep' && inPlay.status !== 'Paralyzed' && inPlay.status !== 'Confused';

    for (const reqType of specificCosts) {
      const idx = availableEnergy.findIndex(e => {
        if (hasEnergyBurn) return true;
        if (e.types && e.types.includes(reqType)) return true;
        if (e.energy && e.energy.type === reqType) return true;
        if (e.name === 'Rainbow Energy') return true;
        if (e.name.includes(reqType)) return true;
        return false;
      });
      if (idx === -1) return false;
      availableEnergy.splice(idx, 1);
    }

    let remainingPower = 0;
    availableEnergy.forEach(e => {
      if (e.name.includes('Double Colorless') || (e.energy && e.energy.amount === 2) || e.number === 96 || e.number === 124) {
        remainingPower += 2;
      } else {
        remainingPower += 1;
      }
    });

    return remainingPower >= colorlessCount;
  }

  /**
   * Single source of truth for "this Pokémon is not allowed to use this attack right now".
   *
   * Two kinds of move switch the opponent's attacks off for exactly one turn:
   *   - Tail Wag (Eevee) / Leer (Rhyhorn): the Defending Pokémon cannot attack at all.
   *   - Amnesia (Poliwhirl): only the one chosen attack is unusable.
   *
   * Anything that offers, scores or resolves an attack has to ask this helper. Otherwise the
   * player watches a coin flip and the full move animation for an attack the engine then
   * silently drops, which reads as "the block did nothing". `currentTurn` also covers a mark
   * that was never consumed because its owner's turn ended without an attack: those moves say
   * "during your opponent's next turn", never "until it is spent".
   */
  static getAttackBlockReason(
    pokemon: InPlayCard | null | undefined,
    attack: Attack | null | undefined,
    currentTurn?: number
  ): AttackBlockReason | null {
    if (!pokemon || !attack) return null;
    const stillMarked =
      pokemon.attackBlockExpiresOnTurn === undefined ||
      currentTurn === undefined ||
      currentTurn <= pokemon.attackBlockExpiresOnTurn;
    if (!stillMarked) return null;
    if (pokemon.preventAttackNextTurn) return 'prevent_attack';
    const blocked = pokemon.amnesiaBlockedAttackName;
    if (blocked && blocked.trim().toLowerCase() === (attack.name || '').trim().toLowerCase()) {
      return 'amnesia';
    }
    return null;
  }

  static canUseAttack(
    pokemon: InPlayCard | null | undefined,
    attack: Attack | null | undefined,
    currentTurn?: number
  ): boolean {
    return GameEngine.getAttackBlockReason(pokemon, attack, currentTurn) === null;
  }

  /** Tail Wag / Leer: the marked Pokémon cannot attack during the opponent's next turn. */
  static applyAttackBlock(
    pokemon: InPlayCard,
    moveName: string,
    sourceInstanceId: string | undefined,
    currentTurn: number
  ): void {
    pokemon.preventAttackNextTurn = true;
    pokemon.attackBlockMoveName = moveName;
    pokemon.attackBlockSourceInstanceId = sourceInstanceId;
    pokemon.attackBlockExpiresOnTurn = currentTurn + 1;
  }

  /** Amnesia: one named attack of the marked Pokémon is unusable during the opponent's next turn. */
  static applyAmnesiaBlock(
    pokemon: InPlayCard,
    blockedAttackName: string,
    moveName: string,
    currentTurn: number
  ): void {
    pokemon.amnesiaBlockedAttackName = blockedAttackName;
    pokemon.attackBlockMoveName = moveName;
    pokemon.attackBlockExpiresOnTurn = currentTurn + 1;
  }

  /**
   * Drops an attack block. Card text for Tail Wag / Leer reads "(Benching either Pokémon ends
   * this effect.)", so every route that moves a Pokémon to or from the Active spot calls this.
   */
  static clearAttackBlock(pokemon: InPlayCard | null | undefined): void {
    if (!pokemon) return;
    pokemon.preventAttackNextTurn = false;
    pokemon.amnesiaBlockedAttackName = undefined;
    pokemon.attackBlockMoveName = undefined;
    pokemon.attackBlockSourceInstanceId = undefined;
    pokemon.attackBlockExpiresOnTurn = undefined;
  }

  /**
   * Enforces the "(Benching either Pokémon ends this effect.)" clause. A Tail Wag / Leer block
   * is tied to the two Pokémon that were Active when it landed, so as soon as the attacker that
   * imposed it is no longer in the Active spot the mark is worthless and has to go. Amnesia is
   * deliberately untouched here - its text carries no benching clause.
   */
  static pruneAttackBlocks(state: GameState): void {
    const activeIds = [state.player.active?.instanceId, state.cpu.active?.instanceId];
    [state.player, state.cpu].forEach(side => {
      [side.active, ...side.bench].forEach(p => {
        if (!p || !p.preventAttackNextTurn) return;
        const source = p.attackBlockSourceInstanceId;
        if (source && !activeIds.includes(source)) GameEngine.clearAttackBlock(p);
      });
    });
  }

  /**
   * Moves whose coin flip belongs to the OPPONENT'S next turn rather than to the
   * moment the attack is declared: Sand-attack, Smokescreen, Lightning Flash.
   * Their text reads "If tails, that attack does nothing" — the attack referred to
   * is the defender's *next* turn, not this move. So these moves always land their
   * printed damage, never consume a coin at declaration time, and must never be
   * classified as fail-on-tails attacks.
   */
  static readonly DELAYED_ACCURACY_CHECK_MOVES = ['sand-attack', 'smokescreen', 'lightning flash'];

  static usesDelayedAccuracyCheck(attackName: string): boolean {
    return GameEngine.DELAYED_ACCURACY_CHECK_MOVES.includes((attackName || '').toLowerCase());
  }

  /**
   * How many coins an attack flips at declaration time. The UI turns this number into the
   * coin modal, and the engine consumes exactly this many entries from the supplied coin
   * list, so it lives beside the rules it describes instead of being re-derived in a
   * component where the two can drift apart.
   *
   * Classification is driven by the card text, never by a damage multiplier: "×" / "+" only
   * says the damage VARIES — Kingler's Flail scales with its own damage counters, Mewtwo's
   * Psychic with the defender's Energy — it says nothing about a coin. Treating "×" as a
   * flip opened a modal for Flail and Mass Explosion, whose text never mentions one.
   */
  static getAttackCoinFlipCount(
    attacker: InPlayCard,
    attack: Attack,
    defender?: InPlayCard | null,
    defenderBenchCount = 0
  ): number {
    const attackName = (attack.name || '').toLowerCase();
    const text = (attack.text || '').toLowerCase();
    const energies = attacker?.attachedEnergy || [];

    // The flip for these belongs to the defender's next turn, not to this attack.
    if (GameEngine.usesDelayedAccuracyCheck(attackName)) return 0;
    // One coin per head until tails — the modal asks for a single "keep flipping" coin.
    if (attackName === 'stone barrage' || text.includes('until you get tails') || text.includes('until you get a tails')) return 1;
    if (attackName === 'big eggsplosion') return energies.length;
    if (attackName === 'continuous fireball') return energies.filter(e => e.types && e.types.includes('Fire')).length;
    // These two flip once per opposing Benched Pokémon, so the count is a board property.
    if (attackName === 'bench manipulation' || attackName === 'thunderstorm') return defenderBenchCount;
    if (text.includes('flip 4 coins') || attackName === 'comet punch') return 4;
    if (text.includes('flip 3 coins') || attackName === 'fury swipes' || attackName === 'triple kick' || attackName === 'petal dance') return 3;
    if (text.includes('flip 2 coins') || ['twineedle', 'double kick', 'doubleslap', 'slam', 'bonemerang', 'fury attack', 'spike cannon'].includes(attackName)) return 2;
    if (text.includes('flip a coin') || text.includes('if tails') || text.includes('if heads')) return 1;
    return 0;
  }

  /**
   * Damage a move inflicts on its own user, read straight off the card text
   * ("...Raichu does 30 damage to itself"). Recoil amounts used to be hardcoded per
   * attack name, which meant a printing with a different number silently got the wrong
   * recoil — or none at all.
   */
  static getSelfDamageFromText(attack: Attack): number {
    const match = /does (\d+) damage to itself/i.exec(attack?.text || '');
    const amount = match ? Number(match[1]) : 0;
    return Number.isFinite(amount) ? amount : 0;
  }

  /**
   * Does this move negate its OWN damage on tails? The wording distinction is the entire
   * rule: "THIS attack does nothing" is self-negating, while "THAT attack does nothing"
   * belongs to the Sand-attack family and describes the defender's NEXT attack.
   *
   * Exposed as a predicate because the mistake stopped being visible in the damage: now
   * that the coin plan keeps the delayed family off the coin list altogether, primaryFlip
   * never goes false for them, so re-introducing the loose "does nothing" substring would
   * silently un-break the tests unless the classification itself is asserted.
   */
  static readonly SELF_NEGATING_MOVES = [
    'clamp', 'horn hazard', 'leek slap', 'giant tail',
    'hyper fang', 'dive bomb', 'fickle attack', 'fireball',
  ];

  static failsOnTails(attack: Attack): boolean {
    const attackName = (attack?.name || '').toLowerCase();
    const attackText = (attack?.text || '').toLowerCase();
    return GameEngine.SELF_NEGATING_MOVES.includes(attackName)
      || attackText.includes('this attack does nothing');
  }

  static calculatePreviewAttackDamage(
    attacker: InPlayCard,
    attack: Attack,
    defender?: InPlayCard | null
  ): {
    baseDamage: number;
    bonusDamage: number;
    totalDamage: number;
    multiplierText?: string;
    isVariable: boolean;
    displayDamage: string;
  } {
    const attackName = attack.name.toLowerCase();
    let baseDamage = attack.damage || 0;
    let bonusDamage = 0;
    let multiplierText: string | undefined = undefined;
    let isVariable = false;

    // Swords Dance boost: Scyther's Slash base damage is 60 instead of 30
    if (attackName === 'slash' && attacker.swordsDanceActiveNextTurn) {
      baseDamage = 60;
    }

    // 1. Water Gun & Hydro Pump (Extra Water Energy attached beyond cost, up to +20)
    if (attackName === 'water gun' || attackName === 'hydro pump') {
      const waterEnergies = attacker.attachedEnergy.filter(e => e.types && e.types.includes('Water')).length;
      const baseCost = attack.cost.filter(c => c === 'Water').length;
      const extraWater = Math.max(0, Math.min(2, waterEnergies - baseCost));
      if (extraWater > 0) {
        bonusDamage += extraWater * 10;
      }
    }

    // 2. PlusPower attached (+10 per PlusPower)
    if (attacker.plusPowersAttached && attacker.plusPowersAttached > 0 && baseDamage > 0) {
      bonusDamage += attacker.plusPowersAttached * 10;
    }

    // 3. Psychic (10 + 10 per opponent energy)
    if (attackName === 'psychic' && attacker.card.number === 10) {
      if (defender && defender.attachedEnergy) {
        bonusDamage = defender.attachedEnergy.length * 10;
      } else {
        isVariable = true;
      }
    }

    // 4. Meditate (20 + 10 per defender damage counter)
    if (attackName === 'meditate') {
      if (defender && defender.damage > 0) {
        bonusDamage = defender.damage;
      }
    }

    // 4b. Flitter (Dark Golbat), Dig Under (Diglett), Coin Hurl (Meowth):
    // card data stores damage: 0 because the hit goes to a *chosen* Pokémon, but the
    // amount itself is fixed. The preview must show the real number, not "effect".
    if (attackName === 'flitter') baseDamage = 20;
    else if (attackName === 'dig under') baseDamage = 10;
    else if (attackName === 'coin hurl') baseDamage = 20;

    // 5. Karate Chop (50 - attacker damage taken)
    if (attackName === 'karate chop') {
      if (attacker.damage > 0) {
        bonusDamage = -Math.min(50, attacker.damage);
      }
    }

    // 6. Flail (Damage equal to damage taken)
    // 7. Multi-coin attacks & multipliers
    if (attackName === 'stone barrage' || (attack.text || '').toLowerCase().includes('until you get tails')) {
      multiplierText = '0-∞×';
      isVariable = true;
    } else if (attackName === 'twineedle' || attackName === 'double kick' || attackName === 'doubleslap' || attackName === 'slam' || attackName === 'bonemerang' || (attack.text || '').toLowerCase().includes('flip 2 coins')) {
      multiplierText = '0-2×';
    } else if (attackName === 'fury swipes' || attackName === 'triple kick' || attackName === 'petal dance' || (attack.text || '').toLowerCase().includes('flip 3 coins')) {
      multiplierText = '0-3×';
    } else if (attackName === 'spike cannon' || attackName === 'fury attack' || attackName === 'comet punch' || (attack.text || '').toLowerCase().includes('flip 4 coins')) {
      multiplierText = '0-4×';
    } else if (attack.damageMultiplier === '×') {
      multiplierText = '0-N×';
      isVariable = true;
    }

    const totalDamage = Math.max(0, baseDamage + bonusDamage);

    let displayDamage = '';
    if (multiplierText) {
      displayDamage = `${baseDamage} (${multiplierText})`;
    } else if (bonusDamage > 0) {
      displayDamage = `${baseDamage} (+${bonusDamage})`;
    } else if (bonusDamage < 0) {
      displayDamage = `${baseDamage} (${bonusDamage})`;
    } else if (baseDamage > 0) {
      displayDamage = `${baseDamage}`;
    } else {
      displayDamage = '0';
    }

    return {
      baseDamage,
      bonusDamage,
      totalDamage,
      multiplierText,
      isVariable,
      displayDamage
    };
  }

  /** The Pokémon Power printed on a card. The data uses two different keys for it. */
  static powerOf(pokemon: InPlayCard | null | undefined): { name: string; text: string } | null {
    return pokemon?.card?.power || pokemon?.card?.pokemonPower || null;
  }

  /**
   * True while a Pokémon Power has been shut down. Dark Arbok's Stare is the only move that does
   * this today: "that power stops working until the end of your opponent's next turn".
   */
  static isPowerDisabled(pokemon: InPlayCard | null | undefined, turn: number): boolean {
    if (!pokemon || pokemon.powerDisabledUntilTurn === undefined) return false;
    return turn <= pokemon.powerDisabledUntilTurn;
  }

  /**
   * Stare's target: 0 is the Defending Pokémon, n > 0 is defenderPlayer.bench[n - 1].
   *
   * A human answers through the target picker, so this only decides for the AI and for callers
   * that resolve the attack without a choice. It plays the move the way a player would: take the
   * free Prize if 10 finishes something off, otherwise silence a Pokémon Power (the Active one
   * first, since that is the body attacking), otherwise the weakest body on the field.
   */
  static pickStareTargetIndex(defenderPlayer: PlayerState, turn: number, choice?: number): number {
    const candidates: (InPlayCard | null)[] = [defenderPlayer.active, ...defenderPlayer.bench];
    if (choice !== undefined && Number.isInteger(choice) && choice >= 0 && choice < candidates.length && candidates[choice]) {
      return choice;
    }

    let bestIndex = 0;
    let bestScore = -Infinity;
    candidates.forEach((p, i) => {
      if (!p || p.currentHp <= 0) return;
      let score = 0;
      if (p.currentHp <= 10) score += 1000;
      if (GameEngine.powerOf(p) && !GameEngine.isPowerDisabled(p, turn)) score += 120;
      if (i === 0) score += 40;
      score += Math.max(0, (p.card.hp || 0) - p.currentHp) / 10;
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    });
    return bestIndex;
  }

  // --- EXECUTE ATTACK WITH COIN FLIP RESULTS & ATTACHED EFFECTS ---
  static executeAttack(state: GameState, attackIndex: number, coinResults?: boolean[], effectChoices?: AttackEffectChoices): GameState {
    const next = JSON.parse(JSON.stringify(state)) as GameState;
    // lastStatusTicks still holds the ticks recorded by the PREVIOUS turn's endTurn (already
    // shown on that turn). Wipe them so they cannot leak into this resolution: when the attack
    // itself scores a KO we return early (pendingKnockout) without calling endTurn, and a
    // leftover tick on the fainted Pokémon would make the UI misread a clean attack-KO as a
    // poison-tick-KO (holding damage back on the HP bar and replaying a phantom poison FX).
    // endTurn repopulates this field whenever it actually runs.
    next.lastStatusTicks = [];
    const isPlayer = next.turnPlayer === 'player';
    const attackerPlayer = isPlayer ? next.player : next.cpu;
    const defenderPlayer = isPlayer ? next.cpu : next.player;
    const attacker = attackerPlayer.active;
    const defender = defenderPlayer.active;

    if (!attacker || !defender) return next;

    const attack = attacker.card.attacks?.[attackIndex];
    if (!attack) return next;

    let coinIdx = 0;

    /**
     * Several attacks say "choose 1 of your opponent's Benched Pokémon". A human picks it in
     * the choice modal (benchTargetIndex); the AI and any caller that does not pass a choice
     * keep the previous default so nothing else changes for them.
     */
    const pickBenchIndex = (list: InPlayCard[], fallback: 'first' | 'random' = 'first'): number => {
      const chosen = effectChoices?.benchTargetIndex;
      if (chosen !== undefined && Number.isInteger(chosen) && chosen >= 0 && chosen < list.length) return chosen;
      return fallback === 'random' ? Math.floor(Math.random() * list.length) : 0;
    };

    // 0. Pre-attack blocked checks (Tail Wag, Leer, Amnesia). These switch the move off before
    //    anything else happens: no coin flip, no damage and none of the attack's side effects
    //    (Poisoned / Asleep / Confused / Paralyzed), which is what the card text asks for.
    const blockReason = GameEngine.getAttackBlockReason(attacker, attack, next.turn);
    if (blockReason === 'prevent_attack') {
      // The blocker's name has to be read BEFORE the mark is wiped, otherwise the log and the
      // UI banner fall back to the attack that was refused and say "blocked by Poison Sting".
      const blockedBy = attacker.attackBlockMoveName || 'the opponent';
      GameEngine.clearAttackBlock(attacker);
      GameEngine.addLog(next, `🚫 ${attacker.card.name} was prevented from attacking this turn by ${blockedBy}!`, 'action');
      next.lastAttackResult = {
        damage: 0,
        isWeakness: false,
        isResistance: false,
        attackName: attack.name,
        attackBlocked: { reason: blockReason, moveName: blockedBy }
      };
      return GameEngine.endTurn(next);
    }
    if (blockReason === 'amnesia') {
      // Only the named attack is spent. Trying a different move must not wipe the mark, and the
      // mark itself lapses through advanceTurn / the turn stamp instead.
      const blockedName = attacker.amnesiaBlockedAttackName || attack.name;
      const blockedBy = attacker.attackBlockMoveName || 'Amnesia';
      GameEngine.clearAttackBlock(attacker);
      GameEngine.addLog(next, `⏳ Amnesia: ${attacker.card.name} cannot use ${blockedName} this turn!`, 'action');
      next.lastAttackResult = {
        damage: 0,
        isWeakness: false,
        isResistance: false,
        attackName: attack.name,
        attackBlocked: { reason: blockReason, moveName: blockedBy }
      };
      return GameEngine.endTurn(next);
    }

    // 1. Sand-attack / Smokescreen accuracy check
    if (attacker.sandAttackedNextTurn || attacker.accuracyDebuffMoveName) {
      const accuracyFlip = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      const debuffName = attacker.accuracyDebuffMoveName || 'Sand-attack';
      attacker.sandAttackedNextTurn = false;
      attacker.accuracyDebuffMoveName = undefined;

      if (!accuracyFlip) {
        GameEngine.addLog(next, `💨 ${debuffName} effect triggered: TAILS! ${attacker.card.name}'s attack failed due to reduced accuracy.`, 'action');
        return GameEngine.endTurn(next);
      }
      GameEngine.addLog(next, `💨 ${debuffName} accuracy check: HEADS! ${attacker.card.name} landed the attack through the smokescreen.`, 'action');
    }

    // 2. Confusion self-harm check
    if (attacker.status === 'Confused') {
      const confusionFlip = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      if (!confusionFlip) {
        const CONFUSION_SELF_DAMAGE = 20;
        attacker.damage += CONFUSION_SELF_DAMAGE;
        attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
        const selfHitTarget: 'player' | 'cpu' = attackerPlayer.id === 'player' ? 'player' : 'cpu';
        const causedKnockout = attacker.currentHp <= 0;
        GameEngine.addLog(next, `😵 Confusion check: TAILS! ${attacker.card.name} hurt itself in confusion for ${CONFUSION_SELF_DAMAGE} damage (${attacker.currentHp}/${attacker.card.hp} HP remaining)!`, 'status');
        // The attack never reaches the defender, so lastAttackResult is not written further
        // down. Record the self-hit here: the UI reads it to keep the move animation on the
        // opponent's card (delayed) and put the impact + damage on the attacker itself.
        next.lastAttackResult = {
          damage: 0,
          isWeakness: false,
          isResistance: false,
          attackName: attack.name,
          confusionSelfHit: {
            damage: CONFUSION_SELF_DAMAGE,
            target: selfHitTarget,
            attackName: attack.name,
            causedKnockout
          }
        };
        if (causedKnockout) {
          next.pendingKnockout = { faintedName: attacker.card.name, isPlayer: selfHitTarget === 'player' };
          return next;
        }
        return GameEngine.endTurn(next);
      }
      GameEngine.addLog(next, `😵 Confusion check: HEADS! ${attacker.card.name} overcame confusion.`, 'status');
    }

    // --- ATTACK DAMAGE CALCULATION ---
    let baseDamage = attack.damage || 0;
    const attackText = (attack.text || '').toLowerCase();
    const attackName = attack.name.toLowerCase();
    /** Move-specific FX intensity — set only by energy-dependent enhancer/multiplier moves. */
    let fxIntensity: number | undefined;
    /** Number of successful hits in a multi-coin-flip attack — drives sequential FX beats in the UI. */
    let multiHitCount: number | undefined;
    /** Per-coin results so the UI can show a beat per coin (whiffed on tails). */
    let multiHitSequence: boolean[] | undefined;

    /**
     * Stare names its own victim: "Choose 1 of your opponent's Pokémon. This attack does 10
     * damage to that Pokémon." Everything below that used to speak of "the Defending Pokémon"
     * has to speak of the chosen one instead - otherwise a Benched pick takes the hit while the
     * Active Pokémon stands there untouched, which is the exact opposite of the card.
     */
    // Flitter, Dig Under and Coin Hurl share Stare's wording: "Choose 1 of your
    // opponent's Pokémon. This attack does N damage to that Pokémon." They all
    // resolve through the same target-pick pipeline.
    const CHOOSE_TARGET_MOVES = ['stare', 'flitter', 'dig under', 'coin hurl'];
    const stareTargetIndex = CHOOSE_TARGET_MOVES.includes(attackName)
      ? GameEngine.pickStareTargetIndex(defenderPlayer, next.turn, effectChoices?.stareTargetIndex)
      : 0;
    const damageTarget: InPlayCard = stareTargetIndex > 0
      ? (defenderPlayer.bench[stareTargetIndex - 1] || defender)
      : defender;
    const hitsBench = damageTarget !== defender;

    // 1. Multi-coin & Multiplier attacks
    let primaryFlip = true;
    if (attackName === 'stone barrage' || attackText.includes('until you get tails') || attackText.includes('until you get a tails')) {
      let heads = 0;
      if (coinResults && coinResults.length > coinIdx) {
        while (coinIdx < coinResults.length) {
          if (coinResults[coinIdx++]) {
            heads++;
          } else {
            break;
          }
        }
      } else {
        while (Math.random() >= 0.5) {
          heads++;
          if (heads >= 10) break;
        }
      }
      const multiplier = attack.damage || 10;
      baseDamage = heads * multiplier;
      multiHitCount = heads;
      // Only heads produce rocks; the terminating tails is not a thrown rock.
      multiHitSequence = Array(heads).fill(true);
      GameEngine.addLog(next, `🗿 ${attack.name}: ${heads} HEADS before Tails (${baseDamage} damage)!`, 'action');
    } else if (attackName === 'big eggsplosion') {
      const energyCount = attacker.attachedEnergy ? attacker.attachedEnergy.length : 0;
      let heads = 0;
      for (let i = 0; i < energyCount; i++) {
        const c = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
        if (c) heads++;
      }
      baseDamage = heads * (attack.damage || 20);
      // Multiplier intensity: coin count equals total energy attached → same formula as Continuous Fireball
      fxIntensity = 1.0 + heads * 0.10;
      GameEngine.addLog(next, `🥚 Big Eggsplosion: Flipped ${energyCount} coins -> ${heads} HEADS (${baseDamage} damage)!`, 'action');
    } else if (attackName === 'continuous fireball') {
      const fireEnergies = attacker.attachedEnergy ? attacker.attachedEnergy.filter(e => e.types && e.types.includes('Fire')) : [];
      const coinCount = fireEnergies.length;
      let heads = 0;
      for (let i = 0; i < coinCount; i++) {
        const c = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
        if (c) heads++;
      }
      baseDamage = heads * (attack.damage || 50);
      // Multiplier intensity: each heads adds 10% visual strength (1 head → 1.1, 2 → 1.2, …)
      fxIntensity = 1.0 + heads * 0.10;
      const toDiscard = Math.min(heads, fireEnergies.length);
      for (let i = 0; i < toDiscard; i++) {
        const idx = attacker.attachedEnergy.findIndex(e => e.types && e.types.includes('Fire'));
        if (idx !== -1) attackerPlayer.discard.push(attacker.attachedEnergy.splice(idx, 1)[0]);
      }
      GameEngine.addLog(next, `🔥 Continuous Fireball: Flipped ${coinCount} coins -> ${heads} HEADS (${baseDamage} damage, discarded ${toDiscard} Fire Energy)!`, 'action');
    } else if (attackName === 'bench manipulation') {
      const benchCount = defenderPlayer.bench.length;
      let tails = 0;
      for (let i = 0; i < benchCount; i++) {
        const c = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
        if (!c) tails++;
      }
      baseDamage = tails * (attack.damage || 20);
      GameEngine.addLog(next, `🌀 Bench Manipulation: Flipped ${benchCount} coins -> ${tails} TAILS (${baseDamage} damage)!`, 'action');
    } else if (attackName === 'petal dance') {
      const c1 = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      const c2 = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      const c3 = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      const heads = (c1 ? 1 : 0) + (c2 ? 1 : 0) + (c3 ? 1 : 0);
      baseDamage = heads * (attack.damage || 40);
      attacker.status = 'Confused';
      GameEngine.addLog(next, `🌸 Petal Dance: ${heads} HEADS (${baseDamage} damage)! ${attacker.card.name} became Confused!`, 'action');
    } else if (attackName === 'twineedle' || attackName === 'double kick' || attackName === 'doubleslap' || attackName === 'slam' || attackName === 'bonemerang' || (attackName === 'fury attack' && attackText.includes('2 coins')) || (attackName === 'spike cannon' && attackText.includes('2 coins')) || attackText.includes('flip 2 coins')) {
      const c1 = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      const c2 = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      const heads = (c1 ? 1 : 0) + (c2 ? 1 : 0);
      const multiplier = attack.damage || (attackName === 'doubleslap' ? 10 : 30);
      baseDamage = heads * multiplier;
      GameEngine.addLog(next, `Flipped 2 coins: ${heads} HEADS (${baseDamage} damage)! [Flips: ${c1 ? 'H' : 'T'}, ${c2 ? 'H' : 'T'}]`, 'action');
      multiHitCount = heads;
      multiHitSequence = [c1, c2];
    } else if (attackName === 'fury swipes' || attackName === 'triple kick' || attackText.includes('flip 3 coins')) {
      const c1 = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      const c2 = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      const c3 = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      const heads = (c1 ? 1 : 0) + (c2 ? 1 : 0) + (c3 ? 1 : 0);
      const multiplier = attack.damage || 10;
      baseDamage = heads * multiplier;
      GameEngine.addLog(next, `Flipped 3 coins: ${heads} HEADS (${baseDamage} damage)!`, 'action');
      multiHitCount = heads;
      multiHitSequence = [c1, c2, c3];
    } else if (attackName === 'spike cannon' || attackName === 'fury attack' || attackName === 'comet punch' || attackText.includes('flip 4 coins')) {
      const c1 = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      const c2 = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      const c3 = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      const c4 = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      const heads = (c1 ? 1 : 0) + (c2 ? 1 : 0) + (c3 ? 1 : 0) + (c4 ? 1 : 0);
      const multiplier = attack.damage || (attackName === 'spike cannon' ? 20 : 10);
      baseDamage = heads * multiplier;
      GameEngine.addLog(next, `Flipped 4 coins: ${heads} HEADS (${baseDamage} damage)!`, 'action');
      multiHitCount = heads;
      multiHitSequence = [c1, c2, c3, c4];
    } else if (attackName === 'thunderstorm') {
      // Flips one coin per opposing Benched Pokémon further down, so it must not also
      // draw a declaration-time coin here: that extra read shifted the coin list by one,
      // so the modal's coins landed on the wrong checks.
    } else if (GameEngine.getAttackCoinFlipCount(attacker, attack, defender, defenderPlayer.bench.length) > 0) {
      // Ordinary coin-flip attacks spend their declaration-time flip here.
      // The delayed-accuracy family deliberately has no such flip: the UI hands us an
      // empty coin list for it, so consuming one here would fall through to
      // Math.random() and silently randomise damage that is supposed to be fixed.
      primaryFlip = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
    }
    // Anything else flips no coin, so primaryFlip stays true. This matters: roughly
    // twenty effects below are written as `attackName === 'x' && primaryFlip`, and for
    // moves whose text never mentions a coin (Hypnosis, Spore, Whirlpool, Whirlwind,
    // Fling, Nightmare, Poison Gas) that used to draw an invisible Math.random() flip
    // and quietly fail the effect half the time without the player ever seeing a coin.

    // 2. Attacks that fail or do 0 damage on TAILS.
    // See GameEngine.failsOnTails for why this is a shared predicate rather than an
    // inline substring test.
    const isFailOnTails = GameEngine.failsOnTails(attack);

    if (isFailOnTails) {
      if (!primaryFlip) {
        baseDamage = 0;
        GameEngine.addLog(next, `Coin flip: TAILS! ${attack.name} failed (0 damage, does nothing).`, 'action');
      } else {
        if (attackName === 'clamp') {
          defender.status = 'Paralyzed';
          GameEngine.addLog(next, `🔒 Clamp check: HEADS! ${defender.card.name} is now Paralyzed (${baseDamage} damage)!`, 'action');
        } else if (attackName === 'fireball') {
          const rIdx = attacker.attachedEnergy.findIndex(e => e.types && e.types.includes('Fire'));
          if (rIdx !== -1) attackerPlayer.discard.push(attacker.attachedEnergy.splice(rIdx, 1)[0]);
          GameEngine.addLog(next, `🔥 Fireball: HEADS! Discarded 1 Fire Energy (${baseDamage} damage)!`, 'action');
        } else {
          GameEngine.addLog(next, `Coin flip: HEADS! ${attack.name} succeeded (${baseDamage} damage)!`, 'action');
        }
      }
    } else if (attackName === 'thunderpunch') {
      if (primaryFlip) {
        baseDamage = 40;
        GameEngine.addLog(next, `⚡ Thunderpunch check: HEADS! +10 damage (40 damage)!`, 'action');
      } else {
        baseDamage = 30;
        attacker.damage += 10;
        attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
        GameEngine.addLog(next, `⚡ Thunderpunch check: TAILS! Electabuzz dealt 10 damage to itself (${attacker.currentHp}/${attacker.card.hp} HP remaining).`, 'damage');
      }
    } else if (attackName === 'thunder attack' && attacker.card.name.includes('Dark Jolteon')) {
      if (primaryFlip) {
        defender.status = 'Paralyzed';
        GameEngine.addLog(next, `⚡ Thunder Attack: HEADS! ${defender.card.name} is now Paralyzed!`, 'action');
      } else {
        attacker.damage += 10;
        attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
        GameEngine.addLog(next, `⚡ Thunder Attack: TAILS! Dark Jolteon dealt 10 damage to itself (${attacker.currentHp}/${attacker.card.hp} HP remaining).`, 'damage');
      }
    } else if (attackName === 'water gun' || attackName === 'hydro pump') {
      const waterEnergies = attacker.attachedEnergy.filter(e => e.types && e.types.includes('Water')).length;
      const baseCost = attack.cost.filter(c => c === 'Water').length;
      const extraWater = Math.max(0, Math.min(2, waterEnergies - baseCost));
      baseDamage += extraWater * 10;
      if (attackName === 'hydro pump') {
        // Blastoise Hydro Pump: dedicated twin-cannon FX, intensity scales with bonus Water Energy.
        // Base (40 dmg) → 1.0; +1 Water (50) → 1.1; +2 Water (60) → 1.2.
        fxIntensity = 1.0 + extraWater * 0.1;
      } else {
        // Enhancer intensity: damage-proportional with baseline 10 (lowest Water Gun base = Poliwag/Lapras).
        // Always set so higher-base Pokémon (Vaporeon 30, Omastar 20) render stronger even at base cost.
        fxIntensity = 1.0 + Math.max(0, baseDamage - 10) * 0.01;
      }
      if (extraWater > 0) {
        GameEngine.addLog(next, `💧 Extra Water Energy: +${extraWater * 10} damage (${baseDamage} total)!`, 'action');
      }
    } else if (attackName === 'super fang') {
      baseDamage = Math.ceil(defender.currentHp / 20) * 10;
      GameEngine.addLog(next, `🐭 Super Fang dealt half of defender's HP: ${baseDamage} damage!`, 'action');
    } else if (attackName === 'karate chop') {
      baseDamage = Math.max(0, 50 - attacker.damage);
      GameEngine.addLog(next, `🥋 Karate Chop: ${baseDamage} damage (reduced by damage taken)!`, 'action');
    } else if (attackName === 'flail') {
      baseDamage = attacker.damage;
      GameEngine.addLog(next, `🐟 Flail dealt damage equal to damage taken: ${baseDamage} damage!`, 'action');
    } else if (attackName === 'psychic' && attacker.card.number === 10) {
      const oppEnergyCount = defender.attachedEnergy.length;
      baseDamage = 10 + oppEnergyCount * 10;
    } else if (attackName === 'meditate') {
      baseDamage = 20 + defender.damage;
    } else if (attackName === 'rage') {
      baseDamage = 10 + Math.floor(attacker.damage / 10) * 10;
      GameEngine.addLog(next, `💢 Rage dealt ${baseDamage} damage (increased by damage taken)!`, 'action');
    } else if (attackName === 'hydrocannon') {
      const waterEnergies = attacker.attachedEnergy.filter(e => e.types && e.types.includes('Water')).length;
      const baseCost = attack.cost.filter(c => c === 'Water').length;
      const extraWater = Math.max(0, Math.min(2, waterEnergies - baseCost));
      baseDamage = 30 + extraWater * 20;
      // Enhancer intensity: damage-proportional, baseline 10 (same water_gun_stream pool).
      fxIntensity = 1.0 + Math.max(0, baseDamage - 10) * 0.01;
      if (extraWater > 0) {
        GameEngine.addLog(next, `💧 Extra Water Energy: +${extraWater * 20} damage (${baseDamage} total)!`, 'action');
      }
    } else if (attackName === 'boyfriends') {
      const nidokingCount = [...attackerPlayer.bench, attacker].filter(p => p && p.card.name.includes('Nidoking')).length;
      baseDamage = 20 + nidokingCount * 20;
      GameEngine.addLog(next, `👑 Boyfriends dealt ${baseDamage} damage (+${nidokingCount * 20} for Nidoking in play)!`, 'action');
    } else if (attackName === 'mass explosion') {
      const allKoffings = [attacker, ...attackerPlayer.bench, defender, ...defenderPlayer.bench].filter(p => p && (p.card.name.includes('Koffing') || p.card.name.includes('Weezing'))).length;
      baseDamage = allKoffings * 20;
      GameEngine.addLog(next, `💣 Mass Explosion dealt ${baseDamage} damage (${allKoffings} Koffings/Weezings in play)!`, 'action');
    } else if (attackName === 'magnetism') {
      const magnetsOnBench = attackerPlayer.bench.filter(b => b.card.name.includes('Magnemite') || b.card.name.includes('Magneton')).length;
      baseDamage = 10 + magnetsOnBench * 10;
    } else if (attackName === 'stomp') {
      if (primaryFlip) {
        baseDamage = 30;
        GameEngine.addLog(next, `⚡ Stomp: HEADS! +10 damage (30 damage total)!`, 'action');
      } else {
        baseDamage = 20;
      }
    } else if (attackName === 'quick attack') {
      if (primaryFlip) {
        baseDamage += (attacker.card.name.includes('Rattata') ? 10 : 20);
        GameEngine.addLog(next, `⚡ Quick Attack: HEADS! bonus damage (${baseDamage} damage total)!`, 'action');
      }
    } else if (attackName === 'rampage') {
      const extra = Math.floor(attacker.damage / 10) * 10;
      baseDamage = 20 + extra;
      GameEngine.addLog(next, `💢 Rampage dealt ${baseDamage} damage (+${extra} from damage taken)!`, 'action');
    } else if (attackName === 'tail strike' || attackName === 'anger' || attackName === 'knock down') {
      if (primaryFlip) {
        baseDamage += 20;
        GameEngine.addLog(next, `Coin flip: HEADS! +20 damage (${baseDamage} damage total)!`, 'action');
      }
    } else if (attackName === 'sticky hands') {
      if (primaryFlip) {
        baseDamage = 30; // 10 + 20
        GameEngine.addLog(next, `⚡ Sticky Hands: HEADS! +20 damage (30 damage total)!`, 'action');
      } else {
        baseDamage = 10;
      }
    } else if (attackName === 'stare' || attackName === 'dig under') {
      baseDamage = 10;
    } else if (attackName === 'flitter') {
      baseDamage = 20;
    } else if (attackName === 'coin hurl') {
      baseDamage = primaryFlip ? 20 : 0;
      if (primaryFlip) {
        GameEngine.addLog(next, `🪙 Coin Hurl: HEADS! 20 damage dealt to ${defender.card.name}!`, 'action');
      } else {
        GameEngine.addLog(next, `🪙 Coin Hurl: TAILS! 0 damage dealt.`, 'action');
      }
    } else if (attackName === 'dream eater') {
      if (defender.status === 'Asleep') {
        baseDamage = 50;
        GameEngine.addLog(next, `💤 Dream Eater consumed dreams of Asleep ${defender.card.name} for 50 damage!`, 'action');
      } else {
        baseDamage = 0;
        GameEngine.addLog(next, `💤 Dream Eater failed: ${defender.card.name} is not Asleep! (0 damage dealt)`, 'action');
      }
    } else if (attackName === 'do the wave') {
      baseDamage = 10 + attackerPlayer.bench.length * 10;
      GameEngine.addLog(next, `🌊 Do the Wave dealt ${baseDamage} damage (+${attackerPlayer.bench.length * 10} for ${attackerPlayer.bench.length} benched Pokémon)!`, 'action');
    } else if (attackName === 'thrash') {
      if (primaryFlip) {
        baseDamage = 40;
        GameEngine.addLog(next, `⚡ Thrash: HEADS! +10 damage (40 damage total)!`, 'action');
      } else {
        baseDamage = 30;
        attacker.damage += 10;
        attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
        GameEngine.addLog(next, `⚡ Thrash: TAILS! ${attacker.card.name} dealt 10 recoil damage to itself!`, 'damage');
      }
    } else if (attackName === 'playing with fire') {
      const rIdx = attacker.attachedEnergy.findIndex(e => e.types && e.types.includes('Fire'));
      if (rIdx !== -1 && primaryFlip) {
        attackerPlayer.discard.push(attacker.attachedEnergy.splice(rIdx, 1)[0]);
        baseDamage = 50;
        GameEngine.addLog(next, `🔥 Playing with Fire: HEADS! Discarded 1 Fire Energy for +20 damage (50 damage)!`, 'action');
      } else {
        baseDamage = 30;
      }
    } else if (attackName === 'fire spin') {
      const fireEnergies = attacker.attachedEnergy.filter(e => e.types && e.types.includes('Fire'));
      const discardCount = Math.min(2, fireEnergies.length);
      for (let i = 0; i < discardCount; i++) {
        const idx = attacker.attachedEnergy.findIndex(e => e.types && e.types.includes('Fire'));
        if (idx !== -1) attackerPlayer.discard.push(attacker.attachedEnergy.splice(idx, 1)[0]);
      }
      GameEngine.addLog(next, `🔥 Fire Spin: Discarded ${discardCount} Fire Energy cards!`, 'action');
    } else if (attackName === 'rock throw') {
      // Onix's Rock Throw (10 dmg) shares Graveler's big_boulder animation but at 0.4 intensity.
      // Graveler (40 dmg) keeps the default 1.0 scale.
      if (attacker.card.name.includes('Onix')) {
        fxIntensity = 0.4;
      }
    }

    // Capture Swords Dance state before consumption — the UI needs it for the X-slash visual.
    const swordsDanceWasActive = attackName === 'slash' && Boolean(attacker.swordsDanceActiveNextTurn);
    // Swords Dance boost: Scyther's Slash base damage is 60 instead of 30
    if (attackName === 'slash' && attacker.swordsDanceActiveNextTurn) {
      baseDamage = 60;
      GameEngine.addLog(next, `⚔️ Swords Dance active! Slash base damage boosted from 30 to 60!`, 'action');
    }
    // Consume the Swords Dance flag on any attack (it only lasts one turn)
    if (attacker.swordsDanceActiveNextTurn) {
      attacker.swordsDanceActiveNextTurn = false;
    }

    let finalDamage = baseDamage;

    // PlusPower reads "If this Pokémon's attack does damage to the Defending Pokémon", so a move
    // that picked a Benched Pokémon instead (Stare) does not get the bonus.
    if (attacker.plusPowersAttached && attacker.plusPowersAttached > 0 && finalDamage > 0 && !hitsBench) {
      finalDamage += attacker.plusPowersAttached * 10;
    }

    const ignoreWeaknessResistance = [
      'mind shock',
      'sonicboom',
      'stare',
      'flitter',
      'dig under',
      'coin hurl',
      'bench manipulation'
    ].includes(attackName);

    let isWeaknessTriggered = false;
    let isResistanceTriggered = false;

    if (!ignoreWeaknessResistance) {
      const attackerType = attacker.card.types?.[0];
      if (damageTarget.card.weakness && attackerType && damageTarget.card.weakness.type === attackerType && finalDamage > 0) {
        let mult = 2;
        if (typeof damageTarget.card.weakness.value === 'number') mult = damageTarget.card.weakness.value;
        else if (typeof damageTarget.card.weakness.value === 'string') {
          const m = (damageTarget.card.weakness.value as string).match(/\d+/);
          if (m) mult = parseInt(m[0], 10);
        }
        finalDamage = Math.round(finalDamage * mult);
        isWeaknessTriggered = true;
        GameEngine.addLog(next, `💥 Weakness triggered! (${damageTarget.card.weakness.type} x${mult}) -> ${finalDamage} damage!`, 'damage');
      }

      if (damageTarget.card.resistance && attackerType && damageTarget.card.resistance.type === attackerType && finalDamage > 0) {
        let reduction = 30;
        if (typeof damageTarget.card.resistance.value === 'number') reduction = Math.abs(damageTarget.card.resistance.value);
        else if (typeof damageTarget.card.resistance.value === 'string') {
          const m = (damageTarget.card.resistance.value as string).match(/\d+/);
          if (m) reduction = parseInt(m[0], 10);
        }
        finalDamage = Math.max(0, finalDamage - reduction);
        isResistanceTriggered = true;
        GameEngine.addLog(next, `🛡️ Resistance triggered! (${damageTarget.card.resistance.type} -${reduction}) -> ${finalDamage} damage!`, 'damage');
      }
    }

    if (damageTarget.defendersAttached && damageTarget.defendersAttached > 0 && finalDamage > 0) {
      finalDamage = Math.max(0, finalDamage - damageTarget.defendersAttached * 20);
    }

    // Defensive shield checks and passive Pokemon powers on the struck Pokémon. Toxic Gas is a
    // Pokémon Power itself, so a Muk that has been Stared stops smothering everything else.
    const isToxicGasInPlay = [attacker, ...attackerPlayer.bench, defender, ...defenderPlayer.bench].some(
      p => p && p.card.name === 'Muk' && p.status !== 'Asleep' && p.status !== 'Paralyzed' && p.status !== 'Confused'
        && !GameEngine.isPowerDisabled(p, next.turn)
    );

    const powerWorksOn = (pokemon: InPlayCard, name: string) => {
      if (isToxicGasInPlay) return false;
      if (GameEngine.isPowerDisabled(pokemon, next.turn)) return false;
      const power = GameEngine.powerOf(pokemon);
      if (!power || power.name.toLowerCase() !== name.toLowerCase()) return false;
      return pokemon.status !== 'Asleep' && pokemon.status !== 'Paralyzed' && pokemon.status !== 'Confused';
    };

    const defenderHasActivePower = (name: string) => powerWorksOn(damageTarget, name);

    /**
     * Damage a Benched Pokémon the way the rules ask for. "Don't apply Weakness and Resistance
     * for Benched Pokémon" only drops those two steps - a Defender, a Harden or Kabuto Armor
     * still fold the hit. Returns the damage that actually landed so the caller can record it
     * for the animation.
     */
    const hitBench = (b: InPlayCard, amount: number): number => {
      let dealt = amount;
      if (b.defendersAttached && b.defendersAttached > 0) dealt = Math.max(0, dealt - b.defendersAttached * 20);
      if (dealt > 0 && powerWorksOn(b, 'Kabuto Armor')) dealt = Math.floor((dealt / 2) / 10) * 10;
      if (dealt > 0 && (b.preventDamageNextTurn || b.preventAllEffectsNextTurn)) dealt = 0;
      else if (dealt > 0 && b.hardenActiveNextTurn && dealt <= 30) dealt = 0;
      if (dealt > 0 && b.minimizeActiveNextTurn) dealt = Math.max(0, dealt - 20);
      if (dealt > 0 && b.pounceActiveNextTurn) dealt = Math.max(0, dealt - 10);
      if (dealt > 0) {
        b.damage += dealt;
        b.currentHp = Math.max(0, (b.card.hp || 0) - b.damage);
      }
      return dealt;
    };

    /** Benched Pokémon damaged on top of the main target - the UI animates each of them. */
    const benchHits: BenchHit[] = [];
    const recordBenchHit = (side: 'player' | 'cpu', b: InPlayCard, benchIndex: number, amount: number) => {
      if (amount <= 0) return;
      benchHits.push({ side, instanceId: b.instanceId, benchIndex, pokemonName: b.card.name, amount });
    };

    // Kabuto Armor: Whenever an attack does damage to Kabuto, it does half the damage rounded down to nearest 10
    if (defenderHasActivePower('Kabuto Armor') && finalDamage > 0) {
      const halved = Math.floor((finalDamage / 2) / 10) * 10;
      GameEngine.addLog(next, `🛡️ Kabuto Armor halved the damage taken (${finalDamage} -> ${halved})!`, 'status');
      finalDamage = halved;
    }

    // Invisible Wall (Mr. Mime): If damage is 30 or more, prevent all damage!
    if (defenderHasActivePower('Invisible Wall') && finalDamage >= 30) {
      finalDamage = 0;
      GameEngine.addLog(next, `🧱 Invisible Wall prevented all damage (30 or more damage)!`, 'status');
    }

    // Transparency (Haunter - Fossil): Flip a coin. If heads, prevent all damage!
    if (defenderHasActivePower('Transparency')) {
      const transparencyFlip = Math.random() >= 0.5;
      if (transparencyFlip) {
        finalDamage = 0;
        GameEngine.addLog(next, `👻 Transparency check: HEADS! Prevented all attack damage to Haunter!`, 'status');
      } else {
        GameEngine.addLog(next, `👻 Transparency check: TAILS! Transparency failed.`, 'action');
      }
    }

    if (damageTarget.preventDamageNextTurn || damageTarget.preventAllEffectsNextTurn) {
      finalDamage = 0;
      GameEngine.addLog(next, `🛡️ ${damageTarget.card.name} protected itself and prevented all attack damage!`, 'status');
    } else if (damageTarget.hardenActiveNextTurn && finalDamage <= 30) {
      finalDamage = 0;
      GameEngine.addLog(next, `🪨 ${damageTarget.card.name}'s Harden prevented all damage (30 or less damage)!`, 'status');
    }

    if (damageTarget.minimizeActiveNextTurn && finalDamage > 0) {
      finalDamage = Math.max(0, finalDamage - 20);
      GameEngine.addLog(next, `🛡️ Minimize / Snivel reduced damage by 20 -> ${finalDamage} damage!`, 'status');
    }

    if (damageTarget.pounceActiveNextTurn && finalDamage > 0) {
      finalDamage = Math.max(0, finalDamage - 10);
      GameEngine.addLog(next, `🐾 Pounce reduced damage by 10 -> ${finalDamage} damage!`, 'status');
    }

    damageTarget.damage += finalDamage;
    damageTarget.currentHp = Math.max(0, (damageTarget.card.hp || 0) - damageTarget.damage);

    // Machamp Strikes Back: Deals 10 recoil damage to attacker when damaged by attack
    if (defenderHasActivePower('Strikes Back') && finalDamage > 0) {
      attacker.damage += 10;
      attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
      GameEngine.addLog(next, `🥊 Strikes Back: Machamp dealt 10 recoil damage to ${attacker.card.name}!`, 'damage');
    }

    // Destiny Bond: If the struck Pokémon with an active Destiny Bond is knocked out, the attacker is knocked out too
    if (damageTarget.destinyBondActiveNextTurn) {
      if (damageTarget.currentHp <= 0) {
        attacker.damage += attacker.currentHp;
        attacker.currentHp = 0;
        GameEngine.addLog(next, `👻 Destiny Bond activated! ${attacker.card.name} is Knocked Out along with ${damageTarget.card.name}!`, 'damage');
      }
      damageTarget.destinyBondActiveNextTurn = false;
    }

    next.lastAttackResult = {
      damage: finalDamage,
      isWeakness: isWeaknessTriggered,
      isResistance: isResistanceTriggered,
      attackName: attack.name,
      // Where the hit landed. The UI animates the struck card, so a Stare that picked the Bench
      // must not shake the Active one.
      damageTarget: hitsBench ? 'bench' : 'active',
      damageTargetBenchIndex: hitsBench ? stareTargetIndex - 1 : undefined,
      fxIntensity,
      multiHitCount,
      multiHitSequence,
      swordsDanceBoosted: swordsDanceWasActive
    };

    GameEngine.addLog(next, `⚔️ ${attackerPlayer.name}'s ${attacker.card.name} used ${attack.name} for ${finalDamage} damage! (${damageTarget.card.name}: ${damageTarget.currentHp}/${damageTarget.card.hp} HP remaining)`, 'damage');

    // --- SPECIAL PASSIVE & SECONDARY MOVE EFFECTS ---

    // Leech Life (Golbat, Venonat, Zubat)
    if (attackName === 'leech life' && finalDamage > 0) {
      const healAmt = finalDamage;
      attacker.damage = Math.max(0, attacker.damage - healAmt);
      attacker.currentHp = Math.min(attacker.card.hp || 50, (attacker.card.hp || 50) - attacker.damage);
      GameEngine.addLog(next, `🩸 ${attacker.card.name} drained ${healAmt} HP with Leech Life (${attacker.currentHp}/${attacker.card.hp} HP)!`, 'status');
    }

    // Mega Drain / Absorb (Butterfree, Kabutops)
    if ((attackName === 'mega drain' || attackName === 'absorb') && finalDamage > 0) {
      const healAmt = Math.ceil((finalDamage / 2) / 10) * 10;
      attacker.damage = Math.max(0, attacker.damage - healAmt);
      attacker.currentHp = Math.min(attacker.card.hp || 50, (attacker.card.hp || 50) - attacker.damage);
      GameEngine.addLog(next, `🩸 ${attacker.card.name} drained ${healAmt} HP with ${attack.name} (${attacker.currentHp}/${attacker.card.hp} HP)!`, 'status');
    }

    // Poison Vapor (Dark Arbok): "The Defending Pokémon is now Poisoned. This attack does 10
    // damage to each of your opponent's Benched Pokémon." The bench hits are recorded so the
    // animation can roll across every one of them instead of stopping on the Active card.
    if (attackName === 'poison vapor') {
      defenderPlayer.bench.forEach((b, bIdx) => {
        recordBenchHit(defenderPlayer.id, b, bIdx, hitBench(b, 10));
      });
      defender.poisonType = 'Poisoned';
      GameEngine.addLog(next, `☠️ Poison Vapor: Poisoned ${defender.card.name} and dealt 10 damage to each opponent benched Pokémon!`, 'status');
    }

    // Stare (Dark Arbok). The damage step above already landed on the Pokémon the player chose;
    // what is left is the second sentence: "If that Pokémon has a Pokémon Power, that power stops
    // working until the end of your opponent's next turn." It is applied AFTER the damage so this
    // very hit still runs into Strikes Back / Kabuto Armor - the card keeps every effect that
    // would happen after Weakness and Resistance.
    if (attackName === 'stare') {
      const staredPower = GameEngine.powerOf(damageTarget);
      if (staredPower) {
        damageTarget.powerDisabledUntilTurn = next.turn + 1;
        if (next.lastAttackResult) next.lastAttackResult.powerDisabledName = staredPower.name;
        GameEngine.addLog(next, `👁️ Dark Arbok's Stare shut down ${damageTarget.card.name}'s ${staredPower.name} until the end of ${defenderPlayer.name}'s next turn!`, 'status');
      } else {
        GameEngine.addLog(next, `👁️ Dark Arbok stared down ${damageTarget.card.name} - no Pokémon Power to silence!`, 'action');
      }
    }

    // Blizzard (Articuno)
    if (attackName === 'blizzard') {
      if (primaryFlip) {
        defenderPlayer.bench.forEach((b, bIdx) => {
          recordBenchHit(defenderPlayer.id, b, bIdx, hitBench(b, 10));
        });
        GameEngine.addLog(next, `❄️ Blizzard: HEADS! 10 damage dealt to each opponent benched Pokémon!`, 'damage');
      } else {
        attackerPlayer.bench.forEach((b, bIdx) => {
          recordBenchHit(attackerPlayer.id, b, bIdx, hitBench(b, 10));
        });
        GameEngine.addLog(next, `❄️ Blizzard: TAILS! 10 damage dealt to each of your own benched Pokémon!`, 'damage');
      }
    }

    // Gigaspark (Raichu - Fossil)
    if (attackName === 'gigaspark') {
      if (primaryFlip) {
        defender.status = 'Paralyzed';
        defenderPlayer.bench.forEach(b => {
          b.damage += 10;
          b.currentHp = Math.max(0, (b.card.hp || 0) - b.damage);
        });
        GameEngine.addLog(next, `⚡ Gigaspark: HEADS! ${defender.card.name} is now Paralyzed and 10 damage dealt to each opponent benched Pokémon!`, 'damage');
      } else {
        GameEngine.addLog(next, `⚡ Gigaspark: TAILS! No bench damage or paralysis applied.`, 'action');
      }
    }

    // Thunderstorm (Zapdos - Fossil)
    if (attackName === 'thunderstorm') {
      let tailsCount = 0;
      defenderPlayer.bench.forEach(b => {
        const bFlip = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
        if (bFlip) {
          b.damage += 20;
          b.currentHp = Math.max(0, (b.card.hp || 0) - b.damage);
        } else {
          tailsCount++;
        }
      });
      if (tailsCount > 0) {
        attacker.damage += tailsCount * 10;
        attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
        GameEngine.addLog(next, `⚡ Thunderstorm: ${tailsCount} tails! Zapdos dealt ${tailsCount * 10} recoil damage to itself!`, 'damage');
      }
      GameEngine.addLog(next, `⚡ Thunderstorm struck opponent's bench!`, 'damage');
    }

    // Thunder Attack (Dark Jolteon)
    if (attackName === 'thunder attack') {
      if (primaryFlip) {
        defender.status = 'Paralyzed';
        GameEngine.addLog(next, `⚡ Thunder Attack: HEADS! ${defender.card.name} is now Paralyzed!`, 'status');
      } else {
        attacker.damage += 10;
        attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
        GameEngine.addLog(next, `⚡ Thunder Attack: TAILS! Dark Jolteon dealt 10 damage to itself!`, 'damage');
      }
    }

    // Rampage (Tauros)
    if (attackName === 'rampage') {
      if (!primaryFlip) {
        attacker.status = 'Confused';
        GameEngine.addLog(next, `😵 Rampage: TAILS! Tauros became Confused!`, 'status');
      }
    }

    // Surprise Thunder (Dark Raichu)
    if (attackName === 'surprise thunder') {
      const c1 = primaryFlip;
      const c2 = (coinResults && coinResults[coinIdx] !== undefined) ? coinResults[coinIdx++] : (Math.random() >= 0.5);
      if (c1) {
        const benchDmg = c2 ? 20 : 10;
        defenderPlayer.bench.forEach(b => {
          b.damage += benchDmg;
          b.currentHp = Math.max(0, (b.card.hp || 0) - b.damage);
        });
        GameEngine.addLog(next, `⚡ Surprise Thunder: HEADS! Dealt ${benchDmg} damage to each opponent benched Pokémon!`, 'damage');
      }
    }

    // Flame Pillar (Dark Rapidash) - "choose 1 of them"
    if (attackName === 'flame pillar' && defenderPlayer.bench.length > 0) {
      const target = defenderPlayer.bench[pickBenchIndex(defenderPlayer.bench)];
      target.damage += 10;
      target.currentHp = Math.max(0, (target.card.hp || 0) - target.damage);
      GameEngine.addLog(next, `🔥 Flame Pillar dealt 10 damage to ${target.card.name} on the Bench!`, 'damage');
    }

    // Rocket Tackle (Dark Blastoise)
    if (attackName === 'rocket tackle') {
      attacker.damage += 10;
      attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
      if (primaryFlip) {
        attacker.preventDamageNextTurn = true;
        GameEngine.addLog(next, `🚀 Rocket Tackle: HEADS! Protected from all damage next turn, dealt 10 self-damage!`, 'status');
      }
    }

    // Stiffen, Withdraw, Scrunch, Hide in Shell
    if (attackName === 'stiffen' || attackName === 'withdraw' || attackName === 'scrunch' || attackName === 'hide in shell') {
      if (primaryFlip) {
        attacker.preventDamageNextTurn = true;
        GameEngine.addLog(next, `🛡️ ${attack.name}: HEADS! ${attacker.card.name} will prevent all damage done to it during opponent's next turn!`, 'status');
      } else {
        GameEngine.addLog(next, `Coin flip: TAILS! ${attack.name} failed to protect ${attacker.card.name}.`, 'action');
      }
    }

    // Hurricane (Pidgeot)
    if (attackName === 'hurricane' && defender.currentHp > 0) {
      defenderPlayer.hand.push(defender.card, ...defender.attachedEnergy, ...defender.evolutionHistory);
      defender.attachedEnergy = [];
      defender.evolutionHistory = [];
      if (defenderPlayer.bench.length > 0) {
        defenderPlayer.active = defenderPlayer.bench.shift()!;
      } else {
        defenderPlayer.active = null;
      }
      GameEngine.addLog(next, `🌪️ Hurricane! Returned ${defender.card.name} and all attached cards to ${defenderPlayer.name}'s hand!`, 'action');
    }

    // Fling (Dark Machamp)
    if (attackName === 'fling' && defenderPlayer.bench.length > 0) {
      defenderPlayer.deck.push(defender.card, ...defender.attachedEnergy, ...defender.evolutionHistory);
      defenderPlayer.deck = GameEngine.shuffle(defenderPlayer.deck);
      defenderPlayer.active = defenderPlayer.bench.shift()!;
      GameEngine.addLog(next, `🤾 Fling! Shuffled ${defender.card.name} and all attached cards into ${defenderPlayer.name}'s deck!`, 'action');
    }

    // Drag Off / Knock Back / Fascinate - "choose 1 of your opponent's Benched Pokémon"
    if ((attackName === 'drag off' || attackName === 'knock back' || (attackName === 'fascinate' && primaryFlip)) && defenderPlayer.bench.length > 0) {
      const oldActive = defender;
      defenderPlayer.active = defenderPlayer.bench.splice(pickBenchIndex(defenderPlayer.bench), 1)[0];
      defenderPlayer.bench.push(oldActive);
      GameEngine.addLog(next, `🔄 ${attack.name} switched ${oldActive.card.name} with ${defenderPlayer.active.card.name}!`, 'action');
    }

    // Stun Gas (Dark Weezing)
    if (attackName === 'stun gas') {
      if (primaryFlip) {
        defender.poisonType = 'Poisoned';
        GameEngine.addLog(next, `☠️ Stun Gas: HEADS! ${defender.card.name} is now Poisoned!`, 'status');
      } else {
        defender.status = 'Paralyzed';
        GameEngine.addLog(next, `⚡ Stun Gas: TAILS! ${defender.card.name} is now Paralyzed!`, 'status');
      }
    }

    // Petal Whirlpool (Dark Vileplume)
    if (attackName === 'petal whirlpool') {
      if (primaryFlip) {
        attacker.status = 'Asleep';
        GameEngine.addLog(next, `💤 Petal Whirlpool: HEADS! Dark Vileplume is now Asleep!`, 'status');
      } else {
        attacker.status = 'Confused';
        GameEngine.addLog(next, `😵 Petal Whirlpool: TAILS! Dark Vileplume is now Confused!`, 'status');
      }
    }

    // Sludge Punch / Poison Claws / Poison Gas / Psybeam / Sticky Hands
    if (attackName === 'sludge punch' || (attackName === 'poison claws' && primaryFlip)) {
      defender.poisonType = 'Poisoned';
      GameEngine.addLog(next, `☠️ ${defender.card.name} is now Poisoned!`, 'status');
    } else if (attackName === 'poison gas') {
      defender.status = 'Asleep';
      GameEngine.addLog(next, `💤 Poison Gas: ${defender.card.name} is now Asleep!`, 'status');
    } else if (attackName === 'psybeam' && primaryFlip) {
      defender.status = 'Confused';
      GameEngine.addLog(next, `😵 Psybeam: HEADS! ${defender.card.name} is now Confused!`, 'status');
    } else if (attackName === 'sticky hands' && primaryFlip) {
      defender.status = 'Paralyzed';
      GameEngine.addLog(next, `⚡ Sticky Hands: HEADS! ${defender.card.name} is now Paralyzed!`, 'status');
    }

    // 1. Ninetales #12 - Lure ("choose 1 of them and switch it with his or her Active Pokémon")
    if (attackName === 'lure') {
      if (defenderPlayer.bench.length > 0 && defenderPlayer.active) {
        let chosenBenchIdx = 0;
        if (attackerPlayer.id === 'cpu') {
          let bestScore = -999;
          defenderPlayer.bench.forEach((b, i) => {
            let score = 100 - b.currentHp;
            if (b.card.weakness?.type === 'Fire') score += 50;
            if (score > bestScore) {
              bestScore = score;
              chosenBenchIdx = i;
            }
          });
        } else if (effectChoices?.benchTargetIndex !== undefined
          && effectChoices.benchTargetIndex >= 0
          && effectChoices.benchTargetIndex < defenderPlayer.bench.length) {
          chosenBenchIdx = effectChoices.benchTargetIndex;
        }
        const oldDefender = defenderPlayer.active;
        const newDefender = defenderPlayer.bench.splice(chosenBenchIdx, 1)[0];
        oldDefender.status = 'None';
        oldDefender.poisonType = undefined;
        defenderPlayer.bench.push(oldDefender);
        defenderPlayer.active = newDefender;
        GameEngine.addLog(next, `✨ ${attackerPlayer.name}'s Ninetales used Lure! Dragged ${newDefender.card.name} into the Active position!`, 'action');
      }
    }

    // 2. Pidgeot & Pidgeotto - Whirlwind ("switch the Defending Pokémon with 1 of your
    // opponent's Benched Pokémon" - the attacker chooses, it is not a random pick)
    if (attackName === 'whirlwind') {
      if (defenderPlayer.bench.length > 0 && defenderPlayer.active) {
        const oldDefender = defenderPlayer.active;
        const newDefender = defenderPlayer.bench.splice(pickBenchIndex(defenderPlayer.bench, 'random'), 1)[0];
        oldDefender.status = 'None';
        oldDefender.poisonType = undefined;
        defenderPlayer.bench.push(oldDefender);
        defenderPlayer.active = newDefender;
        GameEngine.addLog(next, `💨 Whirlwind forced ${defenderPlayer.name}'s ${newDefender.card.name} into the Active position!`, 'action');
      }
    }

    // Arbok - Terror Strike: the same forced switch as Whirlwind, but only if the coin
    // came up heads. The move had no implementation at all, so the board asked for a
    // flip that changed nothing and the defending Pokémon never moved.
    if (attackName === 'terror strike' && primaryFlip) {
      if (defenderPlayer.bench.length > 0 && defenderPlayer.active) {
        const oldDefender = defenderPlayer.active;
        const newDefender = defenderPlayer.bench.splice(pickBenchIndex(defenderPlayer.bench, 'random'), 1)[0];
        oldDefender.status = 'None';
        oldDefender.poisonType = undefined;
        defenderPlayer.bench.push(oldDefender);
        defenderPlayer.active = newDefender;
        GameEngine.addLog(next, `🐍 Terror Strike: HEADS! Forced ${defenderPlayer.name}'s ${newDefender.card.name} into the Active position!`, 'action');
      }
    }

    // 3. Flamethrower (Charmeleon, Arcanine, Magmar, Flareon)
    if (attackName === 'flamethrower') {
      const fireIdx = attacker.attachedEnergy.findIndex(e => e.types && e.types.includes('Fire'));
      if (fireIdx !== -1) {
        const discarded = attacker.attachedEnergy.splice(fireIdx, 1)[0];
        attackerPlayer.discard.push(discarded);
        GameEngine.addLog(next, `🔥 Flamethrower: Discarded 1 Fire Energy (${discarded.name}) from ${attacker.card.name}!`, 'action');
      } else if (attacker.attachedEnergy.length > 0) {
        const discarded = attacker.attachedEnergy.pop()!;
        attackerPlayer.discard.push(discarded);
        GameEngine.addLog(next, `🔥 Flamethrower: Discarded 1 Energy (${discarded.name}) from ${attacker.card.name}!`, 'action');
      }
    }

    // 4. Ember (Charmander, Ponyta)
    if (attackName === 'ember') {
      const fireIdx = attacker.attachedEnergy.findIndex(e => e.types && e.types.includes('Fire'));
      if (fireIdx !== -1) {
        const discarded = attacker.attachedEnergy.splice(fireIdx, 1)[0];
        attackerPlayer.discard.push(discarded);
        GameEngine.addLog(next, `🔥 Ember: Discarded 1 Fire Energy (${discarded.name}) from ${attacker.card.name}!`, 'action');
      } else if (attacker.attachedEnergy.length > 0) {
        const discarded = attacker.attachedEnergy.pop()!;
        attackerPlayer.discard.push(discarded);
        GameEngine.addLog(next, `🔥 Ember: Discarded 1 Energy (${discarded.name}) from ${attacker.card.name}!`, 'action');
      }
    }

    // 5. Fire Blast (Ninetales)
    if (attackName === 'fire blast') {
      const fireIdx = attacker.attachedEnergy.findIndex(e => e.types && e.types.includes('Fire'));
      if (fireIdx !== -1) {
        const discarded = attacker.attachedEnergy.splice(fireIdx, 1)[0];
        attackerPlayer.discard.push(discarded);
        GameEngine.addLog(next, `🔥 Fire Blast: Discarded 1 Fire Energy (${discarded.name}) from ${attacker.card.name}!`, 'action');
      } else if (attacker.attachedEnergy.length > 0) {
        const discarded = attacker.attachedEnergy.pop()!;
        attackerPlayer.discard.push(discarded);
        GameEngine.addLog(next, `🔥 Fire Blast: Discarded 1 Energy (${discarded.name}) from ${attacker.card.name}!`, 'action');
      }
    }

    // 6. Thunderbolt (Zapdos)
    if (attackName === 'thunderbolt') {
      const count = attacker.attachedEnergy.length;
      attackerPlayer.discard.push(...attacker.attachedEnergy);
      attacker.attachedEnergy = [];
      GameEngine.addLog(next, `⚡ Thunderbolt: Discarded all (${count}) Energy cards attached to ${attacker.card.name}!`, 'action');
    }

    // 7. Recover (Kadabra, Starmie)
    if (attackName === 'recover') {
      const reqType = attacker.card.name.includes('Starmie') ? 'Water' : 'Psychic';
      let energyIdx = attacker.attachedEnergy.findIndex(e => e.types && e.types.includes(reqType));
      if (energyIdx === -1 && attacker.attachedEnergy.length > 0) energyIdx = 0;
      if (energyIdx !== -1) {
        const discarded = attacker.attachedEnergy.splice(energyIdx, 1)[0];
        attackerPlayer.discard.push(discarded);
        attacker.damage = 0;
        attacker.currentHp = attacker.card.hp || 0;
        GameEngine.addLog(next, `✨ ${attacker.card.name} used Recover! Discarded 1 ${reqType} Energy and fully restored HP (${attacker.currentHp}/${attacker.card.hp} HP)!`, 'status');
      }
    }

    // 8. Hyper Beam (Dragonair, Golduck) & Whirlpool (Poliwrath, Dark Vaporeon)
    // "choose 1 of them and discard it" - the attacker picks which Energy goes.
    if (attackName === 'hyper beam' || (attackName === 'whirlpool' && primaryFlip)) {
      if (defender.attachedEnergy.length > 0) {
        const removed = GameEngine.discardAttachedEnergy(defender, effectChoices?.defenderEnergyIndex)!;
        defenderPlayer.discard.push(removed);
        GameEngine.addLog(next, `💫 ${attack.name}: Discarded ${removed.name} from ${defender.card.name}!`, 'action');
      }
    }

    // 9. Wildfire (Moltres) - "You may discard any number of {R} Energy cards"
    if (attackName === 'wildfire') {
      const fireEnergies = attacker.attachedEnergy.filter(e => e.types && e.types.includes('Fire'));
      const requested = effectChoices?.energyDiscardCount;
      const discardCount = (Number.isInteger(requested) && requested! >= 0 && requested! <= fireEnergies.length)
        ? requested!
        : fireEnergies.length;
      for (let i = 0; i < discardCount; i++) {
        const idx = attacker.attachedEnergy.findIndex(e => e.types && e.types.includes('Fire'));
        if (idx !== -1) attackerPlayer.discard.push(attacker.attachedEnergy.splice(idx, 1)[0]);
      }
      const milled = [];
      for (let i = 0; i < discardCount && defenderPlayer.deck.length > 0; i++) {
        milled.push(defenderPlayer.deck.shift()!);
      }
      defenderPlayer.discard.push(...milled);
      GameEngine.addLog(next, `🔥 Wildfire: Discarded ${discardCount} Fire Energy and discarded ${milled.length} cards from opponent's deck!`, 'action');
    }

    // 10. Third Eye (Dark Golduck) - "Discard 1 Energy card attached to Dark Golduck"
    if (attackName === 'third eye') {
      if (attacker.attachedEnergy.length > 0) {
        const discarded = GameEngine.discardAttachedEnergy(attacker, effectChoices?.ownEnergyIndex)!;
        attackerPlayer.discard.push(discarded);
        let drawn = 0;
        for (let i = 0; i < 3 && attackerPlayer.deck.length > 0; i++) {
          attackerPlayer.hand.push(attackerPlayer.deck.shift()!);
          drawn++;
        }
        GameEngine.addLog(next, `👁️ Third Eye: Discarded ${discarded.name} and drew ${drawn} cards!`, 'action');
      }
    }

    // 11. Energy Bomb (Dark Electrode) - "attach them to your Benched Pokémon (in any way
    // you choose)": the player picks the receiving Benched Pokémon instead of slot #1.
    if (attackName === 'energy bomb') {
      if (attackerPlayer.bench.length > 0) {
        const count = attacker.attachedEnergy.length;
        const chosenOwn = effectChoices?.ownBenchTargetIndex;
        const recipientIdx = (Number.isInteger(chosenOwn) && chosenOwn! >= 0 && chosenOwn! < attackerPlayer.bench.length)
          ? chosenOwn!
          : 0;
        const recipient = attackerPlayer.bench[recipientIdx];
        while (attacker.attachedEnergy.length > 0) {
          recipient.attachedEnergy.push(attacker.attachedEnergy.pop()!);
        }
        GameEngine.addLog(next, `💣 Energy Bomb: Moved all (${count}) Energy cards to ${recipient.card.name}!`, 'action');
      } else {
        const count = attacker.attachedEnergy.length;
        attackerPlayer.discard.push(...attacker.attachedEnergy);
        attacker.attachedEnergy = [];
        GameEngine.addLog(next, `💣 Energy Bomb: Discarded all (${count}) Energy cards (No bench)!`, 'action');
      }
    }

    // 12. Energy Conversion (Gastly - Fossil)
    if (attackName === 'energy conversion') {
      let recovered = 0;
      for (let i = attackerPlayer.discard.length - 1; i >= 0 && recovered < 2; i--) {
        if (attackerPlayer.discard[i].supertype === 'Energy') {
          attackerPlayer.hand.push(attackerPlayer.discard.splice(i, 1)[0]);
          recovered++;
        }
      }
      attacker.damage += 10;
      attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
      GameEngine.addLog(next, `🔮 Energy Conversion: Recovered ${recovered} Energy cards from discard pile! (Gastly took 10 recoil damage)`, 'action');
    }

    // 13. Frenzied Attack (Dark Primeape)
    if (attackName === 'frenzied attack') {
      attacker.status = 'Confused';
      GameEngine.addLog(next, `💢 Frenzied Attack: ${attacker.card.name} is now Confused!`, 'status');
    }

    // 14. Mewtwo - Barrier
    if (attackName === 'barrier') {
      const psychicIdx = attacker.attachedEnergy.findIndex(e => e.types && e.types.includes('Psychic'));
      if (psychicIdx !== -1) {
        attackerPlayer.discard.push(attacker.attachedEnergy.splice(psychicIdx, 1)[0]);
        attacker.preventDamageNextTurn = true;
        GameEngine.addLog(next, `🛡️ Mewtwo formed a Barrier! Discarded 1 Psychic Energy to prevent all damage and effects next turn.`, 'status');
      }
    }

    // 15. Raichu - Gigashock (10 damage to up to 3 benched Pokemon)
    if (attackName === 'gigashock' && defenderPlayer.bench.length > 0) {
      const targets = defenderPlayer.bench.slice(0, 3);
      targets.forEach(b => {
        b.damage += 10;
        b.currentHp = Math.max(0, (b.card.hp || 0) - b.damage);
      });
      GameEngine.addLog(next, `⚡ Gigashock dealt 10 damage to ${targets.length} benched Pokémon!`, 'damage');
    }

    // 16. Gengar - Dark Mind / Pikachu - Spark ("choose 1 of them")
    if ((attackName === 'dark mind' || attackName === 'spark') && defenderPlayer.bench.length > 0) {
      const b = defenderPlayer.bench[pickBenchIndex(defenderPlayer.bench)];
      b.damage += 10;
      b.currentHp = Math.max(0, (b.card.hp || 0) - b.damage);
      GameEngine.addLog(next, `⚡ ${attack.name} dealt 10 damage to benched ${b.card.name}!`, 'damage');
    }

    // 17. Hitmonlee - Stretch Kick ("choose 1 of them")
    if (attackName === 'stretch kick' && defenderPlayer.bench.length > 0) {
      const b = defenderPlayer.bench[pickBenchIndex(defenderPlayer.bench)];
      b.damage += 20;
      b.currentHp = Math.max(0, (b.card.hp || 0) - b.damage);
      GameEngine.addLog(next, `🥋 Stretch Kick dealt 20 damage to benched ${b.card.name}!`, 'damage');
    }

    // 18. Electrode - Chain Lightning
    if (attackName === 'chain lightning') {
      const defType = defender.card.types?.[0];
      if (defType && defType !== 'Colorless') {
        [...attackerPlayer.bench, ...defenderPlayer.bench].forEach(b => {
          if (b && b.card.types && b.card.types.includes(defType)) {
            b.damage += 10;
            b.currentHp = Math.max(0, (b.card.hp || 0) - b.damage);
          }
        });
        GameEngine.addLog(next, `⚡ Chain Lightning dealt 10 damage to each ${defType} benched Pokémon!`, 'damage');
      }
    }

    // 19. Primeape - Tantrum
    if (attackName === 'tantrum' && !primaryFlip) {
      attacker.status = 'Confused';
      GameEngine.addLog(next, `😵 Tantrum: TAILS! ${attacker.card.name} is now Confused!`, 'status');
    }

    // 20. Gloom - Foul Odor
    if (attackName === 'foul odor') {
      defender.status = 'Confused';
      attacker.status = 'Confused';
      GameEngine.addLog(next, `🌸 Foul Odor! Both ${defender.card.name} and ${attacker.card.name} are now Confused!`, 'status');
    }

    // 21. Dark Alakazam - Teleport Blast / Exeggutor - Teleport
    if ((attackName === 'teleport blast' || attackName === 'teleport') && attackerPlayer.bench.length > 0 && attackerPlayer.active) {
      const oldActive = attackerPlayer.active;
      const newActive = attackerPlayer.bench.shift()!;
      attackerPlayer.bench.push(oldActive);
      attackerPlayer.active = newActive;
      GameEngine.addLog(next, `🌀 ${attack.name}! Switched ${oldActive.card.name} with benched ${newActive.card.name}!`, 'action');
    }

    // 22. Porygon - Conversion 1
    if (attackName === 'conversion 1') {
      const types: EnergyType[] = ['Grass', 'Fire', 'Water', 'Lightning', 'Psychic', 'Fighting'];
      const chosen = (effectChoices?.conversionType as EnergyType) || types[Math.floor(Math.random() * types.length)];
      defender.card.weakness = { type: chosen, value: 2 };
      GameEngine.addLog(next, `🔮 Conversion 1: Changed ${defender.card.name}'s Weakness to ${chosen}!`, 'status');
    }

    // 23. Porygon - Conversion 2
    if (attackName === 'conversion 2') {
      const types: EnergyType[] = ['Grass', 'Fire', 'Water', 'Lightning', 'Psychic', 'Fighting'];
      const chosen = (effectChoices?.conversionType as EnergyType) || types[Math.floor(Math.random() * types.length)];
      attacker.card.resistance = { type: chosen, value: -30 };
      GameEngine.addLog(next, `🔮 Conversion 2: Changed Porygon's Resistance to ${chosen}!`, 'status');
    }

    // 24. Poliwhirl - Amnesia
    if (attackName === 'amnesia') {
      const targetAttack = effectChoices?.amnesiaTarget || defender.card.attacks?.[0]?.name || '';
      GameEngine.applyAmnesiaBlock(defender, targetAttack, attack.name, next.turn);
      GameEngine.addLog(next, `⏳ Amnesia: ${defender.card.name} cannot use ${targetAttack} during the opponent's next turn!`, 'status');
    }

    // 24b. Clefairy/Clefable - Metronome
    if (attackName === 'metronome') {
      const targetIdx = effectChoices?.metronomeTarget ?? 0;
      const copiedAttack = defender.card.attacks?.[targetIdx];
      if (copiedAttack) {
        baseDamage = copiedAttack.damage || 0;
        GameEngine.addLog(next, `🎵 Metronome: ${attacker.card.name} copied ${defender.card.name}'s ${copiedAttack.name}!`, 'action');
      }
    }

    // 25. Hypno - Prophecy
    if (attackName === 'prophecy') {
      defenderPlayer.deck = GameEngine.shuffle(defenderPlayer.deck);
      GameEngine.addLog(next, `🔮 Prophecy: Hypno rearranged the cards of the deck!`, 'action');
    }

    // 26. Minimize (Grimer / Clefable) / Snivel (Cubone)
    if (attackName === 'minimize') {
      attacker.minimizeActiveNextTurn = true;
      GameEngine.addLog(next, `🛡️ Minimize: Any damage done to ${attacker.card.name} next turn is reduced by 20!`, 'status');
    }
    if (attackName === 'snivel') {
      attacker.minimizeActiveNextTurn = true;
      GameEngine.addLog(next, `😢 Snivel: Any damage done to Cubone next turn is reduced by 20!`, 'status');
    }

    // 27. Persian - Pounce
    if (attackName === 'pounce') {
      attacker.pounceActiveNextTurn = true;
      GameEngine.addLog(next, `🐾 Pounce: Any damage done to Persian next turn is reduced by 10!`, 'status');
    }

    // 27b. Scyther - Swords Dance (next turn Slash base damage 60 instead of 30)
    if (attackName === 'swords dance') {
      attacker.swordsDanceActiveNextTurn = true;
      GameEngine.addLog(next, `⚔️ Swords Dance: ${attacker.card.name}'s Slash attack will deal 60 base damage next turn!`, 'status');
    }

    // 28. Tail Wag (Eevee) / Leer (Rhyhorn)
    //     "the Defending Pokémon can't attack <this Pokémon> during your opponent's next turn"
    //     - so the whole move is off, side effects included, and the mark is tied to both
    //     Active Pokémon ("Benching either Pokémon ends this effect").
    if ((attackName === 'tail wag' || attackName === 'leer') && primaryFlip) {
      GameEngine.applyAttackBlock(defender, attack.name, attacker.instanceId, next.turn);
      GameEngine.addLog(next, `✨ ${attack.name}: HEADS! ${defender.card.name} cannot attack next turn!`, 'status');
    }

    // 29. Victreebel - Acid
    if (attackName === 'acid' && primaryFlip) {
      defender.preventRetreatNextTurn = true;
      GameEngine.addLog(next, `🧪 Acid: HEADS! ${defender.card.name} cannot retreat next turn!`, 'status');
    }

    // 7. Raichu / Pidgeot - Agility
    if (attackName === 'agility') {
      if (primaryFlip) {
        attacker.preventAllEffectsNextTurn = true;
        GameEngine.addLog(next, `⚡ Coin flip: HEADS! ${attacker.card.name} is super agile and will prevent all damage and effects next turn!`, 'status');
      } else {
        GameEngine.addLog(next, `Coin flip: TAILS! Agility failed to evade next turn's attack.`, 'action');
      }
    }

    // 8. Onix - Harden
    if (attackName === 'harden') {
      attacker.hardenActiveNextTurn = true;
      GameEngine.addLog(next, `🪨 Onix hardened its body! Will prevent 30 or less damage next turn.`, 'status');
    }

    // 9. Sand-attack, Smokescreen, Lightning Flash — the penalty lands on the defender
    // and is paid by THEIR next attack, so this move's own damage is never at stake.
    if (GameEngine.usesDelayedAccuracyCheck(attackName)) {
      defender.sandAttackedNextTurn = true;
      defender.accuracyDebuffMoveName = attack.name;
      GameEngine.addLog(next, `⏳ ${attack.name}: Applied accuracy penalty to ${defender.card.name}! (Must flip heads next turn to attack)`, 'action');
    }

    // 10. Dugtrio - Earthquake
    if (attackName === 'earthquake') {
      attackerPlayer.bench.forEach(b => {
        b.damage += 10;
        b.currentHp = Math.max(0, (b.card.hp || 0) - b.damage);
      });
      GameEngine.addLog(next, `🌋 Earthquake dealt 10 damage to each benched Pokémon on ${attackerPlayer.name}'s side!`, 'damage');
    }

    // 11. Magnemite - Selfdestruct
    if (attackName === 'selfdestruct') {
      attackerPlayer.bench.forEach(b => {
        b.damage += 10;
        b.currentHp = Math.max(0, (b.card.hp || 0) - b.damage);
      });
      defenderPlayer.bench.forEach(b => {
        b.damage += 10;
        b.currentHp = Math.max(0, (b.card.hp || 0) - b.damage);
      });
      attacker.damage += 40;
      attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
      GameEngine.addLog(next, `💥 Selfdestruct exploded! 10 damage to all benched Pokémon, 40 to ${attacker.card.name}!`, 'damage');
    }

    // 12. Gastly - Destiny Bond
    if (attackName === 'destiny bond') {
      const pIdx = attacker.attachedEnergy.findIndex(e => e.types && e.types.includes('Psychic'));
      if (pIdx !== -1) {
        attackerPlayer.discard.push(attacker.attachedEnergy.splice(pIdx, 1)[0]);
        attacker.destinyBondActiveNextTurn = true;
        GameEngine.addLog(next, `👻 Gastly formed a Destiny Bond! If knocked out next turn, the attacker is knocked out too!`, 'status');
      }
    }

    // Leech Seed recovery
    if (attackName === 'leech seed' && finalDamage > 0) {
      attacker.damage = Math.max(0, attacker.damage - 10);
      attacker.currentHp = Math.min(attacker.card.hp || 0, attacker.currentHp + 10);
      GameEngine.addLog(next, `🌱 Bulbasaur recovered 10 HP from Leech Seed (${attacker.currentHp}/${attacker.card.hp} HP)!`, 'status');
    }

    // 13. Call for Family / Call for Friend / Sprout / Friendship Song
    if (attackName === 'call for family' || attackName === 'call for friend' || attackName === 'sprout' || attackName === 'friendship song') {
      if (attackName === 'friendship song' && !primaryFlip) {
        GameEngine.addLog(next, `Coin flip: TAILS! Friendship Song failed to call a friend.`, 'action');
      } else if (attackerPlayer.bench.length >= 5) {
        GameEngine.addLog(next, `⚠️ ${attackerPlayer.name}'s Bench is full! Cannot place a Pokémon from the deck.`, 'action');
      } else {
        const foundIdx = attackerPlayer.deck.findIndex(c => {
          if (c.supertype !== 'Pokemon') return false;
          if (attackName === 'call for friend') {
            return c.subtype === 'Basic' && c.types && c.types.includes('Fighting');
          }
          if (attackName === 'sprout') {
            return c.name === 'Oddish';
          }
          if (attackName === 'friendship song') {
            return c.name === 'Jigglypuff';
          }
          if (attacker.card.name === 'Krabby') {
            return c.name === 'Krabby';
          }
          if (attacker.card.name === 'Bellsprout') {
            return c.name === 'Bellsprout';
          }
          if (attacker.card.name.includes('Nidoran')) {
            return c.name === 'Nidoran Female' || c.name === 'Nidoran Male';
          }
          return c.subtype === 'Basic' && c.name === attacker.card.name;
        });

        if (foundIdx !== -1) {
          const foundCard = attackerPlayer.deck.splice(foundIdx, 1)[0];
          const newBenched = GameEngine.createInPlayCard(foundCard);
          attackerPlayer.bench.push(newBenched);
          attackerPlayer.deck = GameEngine.shuffle(attackerPlayer.deck);
          GameEngine.addLog(next, `🌟 ${attackerPlayer.name}'s ${attacker.card.name} used ${attack.name}! Called ${foundCard.name} from the deck and placed it onto the Bench!`, 'action');
        } else {
          attackerPlayer.deck = GameEngine.shuffle(attackerPlayer.deck);
          GameEngine.addLog(next, `🔍 ${attackerPlayer.name}'s ${attacker.card.name} searched the deck with ${attack.name}, but found no matching Basic Pokémon.`, 'action');
        }
      }
    }

    // 14. Fetch / Dizziness (Draw 1 card)
    if (attackName === 'fetch' || attackName === 'dizziness') {
      if (attackerPlayer.deck.length > 0) {
        const drawn = attackerPlayer.deck.shift()!;
        attackerPlayer.hand.push(drawn);
        GameEngine.addLog(next, `🃏 ${attackerPlayer.name}'s ${attacker.card.name} used ${attack.name} and drew 1 card!`, 'action');
      }
    }

    // 15. Pay Day
    if (attackName === 'pay day') {
      if (primaryFlip) {
        if (attackerPlayer.deck.length > 0) {
          const drawn = attackerPlayer.deck.shift()!;
          attackerPlayer.hand.push(drawn);
          GameEngine.addLog(next, `💰 Coin flip: HEADS! ${attackerPlayer.name} drew 1 card with Pay Day!`, 'action');
        }
      } else {
        GameEngine.addLog(next, `Coin flip: TAILS! Pay Day did not draw a card.`, 'action');
      }
    }

    // 16. Psyduck - Headache
    if (attackName === 'headache') {
      defenderPlayer.trainerBlockedNextTurn = true;
      GameEngine.addLog(next, `🧠 Psyduck gave ${defenderPlayer.name} a massive Headache! ${defenderPlayer.name} cannot play Trainer cards during their next turn!`, 'status');
    }

    // 17. Slowpoke - Afternoon Nap
    if (attackName === 'afternoon nap') {
      const pIdx = attackerPlayer.deck.findIndex(c => c.supertype === 'Energy' && (c.name.includes('Psychic') || (c.types && c.types.includes('Psychic'))));
      if (pIdx !== -1) {
        const pEnergy = attackerPlayer.deck.splice(pIdx, 1)[0];
        attacker.attachedEnergy.push(pEnergy);
        attackerPlayer.deck = GameEngine.shuffle(attackerPlayer.deck);
        GameEngine.addLog(next, `💤 Slowpoke took an Afternoon Nap! Attached 1 Psychic Energy directly from the deck!`, 'action');
      } else {
        attackerPlayer.deck = GameEngine.shuffle(attackerPlayer.deck);
        GameEngine.addLog(next, `Slowpoke searched the deck, but found no Psychic Energy cards.`, 'action');
      }
    }

    // 18. Magikarp - Rapid Evolution
    if (attackName === 'rapid evolution') {
      const gIdx = attackerPlayer.deck.findIndex(c => c.name === 'Gyarados' || c.name === 'Dark Gyarados');
      if (gIdx !== -1) {
        const evoCard = attackerPlayer.deck.splice(gIdx, 1)[0];
        attacker.evolutionHistory.push(attacker.card);
        attacker.card = evoCard;
        attacker.currentHp += Math.max(0, (evoCard.hp || 100) - 30);
        attacker.status = 'None';
        attacker.poisonType = undefined;
        attackerPlayer.deck = GameEngine.shuffle(attackerPlayer.deck);
        GameEngine.addLog(next, `🌊 Rapid Evolution! Magikarp evolved into ${evoCard.name} directly from the deck!`, 'action');
      } else {
        attackerPlayer.deck = GameEngine.shuffle(attackerPlayer.deck);
        GameEngine.addLog(next, `Magikarp searched the deck, but found no Gyarados to evolve into.`, 'action');
      }
    }

    // 19. Slowpoke - Spacing Out
    if (attackName === 'spacing out') {
      if (primaryFlip) {
        attacker.damage = Math.max(0, attacker.damage - 10);
        attacker.currentHp = Math.min(attacker.card.hp || 50, attacker.currentHp + 10);
        GameEngine.addLog(next, `💤 Coin flip: HEADS! Slowpoke healed 10 HP with Spacing Out!`, 'status');
      } else {
        attacker.status = 'Asleep';
        GameEngine.addLog(next, `💤 Coin flip: TAILS! Slowpoke spaced out and fell Asleep!`, 'status');
      }
    }

    // 20. Slowpoke - Scavenge
    if (attackName === 'scavenge') {
      const pIdx = attacker.attachedEnergy.findIndex(e => e.types && e.types.includes('Psychic'));
      const tIdx = attackerPlayer.discard.findIndex(c => c.supertype === 'Trainer');
      if (pIdx !== -1 && tIdx !== -1) {
        attackerPlayer.discard.push(attacker.attachedEnergy.splice(pIdx, 1)[0]);
        const recoveredTrainer = attackerPlayer.discard.splice(tIdx, 1)[0];
        attackerPlayer.hand.push(recoveredTrainer);
        GameEngine.addLog(next, `♻️ Slowpoke scavenged ${recoveredTrainer.name} from the discard pile!`, 'action');
      }
    }

    // 21. Abra - Vanish
    if (attackName === 'vanish') {
      attacker.attachedEnergy.forEach(e => attackerPlayer.discard.push(e));
      attacker.attachedEnergy = [];
      attackerPlayer.deck.push(attacker.card);
      attackerPlayer.deck = GameEngine.shuffle(attackerPlayer.deck);
      if (attackerPlayer.bench.length > 0) {
        const newActive = attackerPlayer.bench.shift()!;
        attackerPlayer.active = newActive;
      }
      GameEngine.addLog(next, `💨 Abra used Vanish and shuffled itself into the deck!`, 'action');
    }

    // 22. Mankey - Mischief
    if (attackName === 'mischief') {
      defenderPlayer.deck = GameEngine.shuffle(defenderPlayer.deck);
      GameEngine.addLog(next, `🐒 Mankey caused Mischief and shuffled ${defenderPlayer.name}'s deck!`, 'action');
    }

    // Recoil checks
    if (attackName === 'double-edge') {
      attacker.damage += 80;
      attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
      GameEngine.addLog(next, `💥 Double-edge recoil: ${attacker.card.name} dealt 80 damage to itself (${attacker.currentHp}/${attacker.card.hp} HP remaining)!`, 'damage');
    } else if (attackName === 'take down') {
      attacker.damage += 30;
      attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
      GameEngine.addLog(next, `💥 Take Down recoil: ${attacker.card.name} dealt 30 damage to itself (${attacker.currentHp}/${attacker.card.hp} HP remaining)!`, 'damage');
    } else if (attackName === 'submission') {
      attacker.damage += 20;
      attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
      GameEngine.addLog(next, `💥 Submission recoil: ${attacker.card.name} dealt 20 damage to itself (${attacker.currentHp}/${attacker.card.hp} HP remaining)!`, 'damage');
    } else if (attackName === 'thunder jolt') {
      if (!primaryFlip) {
        attacker.damage += 10;
        attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
        GameEngine.addLog(next, `⚡ Thunder Jolt recoil: TAILS! ${attacker.card.name} dealt 10 damage to itself (${attacker.currentHp}/${attacker.card.hp} HP remaining)!`, 'damage');
      }
    } else if (attackName === 'thunder' && GameEngine.getSelfDamageFromText(attack) > 0) {
      // Reads "Flip a coin. If tails, {this Pokémon} does 30 damage to itself." The old
      // check keyed on card numbers 14 and 16, which covered Raichu and one Zapdos and
      // silently skipped the rest — so on those printings the coin was shown, the tails
      // branch was taken, and no recoil ever arrived.
      const recoil = GameEngine.getSelfDamageFromText(attack);
      if (!primaryFlip) {
        attacker.damage += recoil;
        attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
        GameEngine.addLog(next, `⚡ Thunder recoil: TAILS! ${attacker.card.name} dealt ${recoil} damage to itself!`, 'damage');
      }
    } else if (attackName === 'electric shock') {
      if (!primaryFlip) {
        attacker.damage += 10;
        attacker.currentHp = Math.max(0, (attacker.card.hp || 0) - attacker.damage);
        GameEngine.addLog(next, `⚡ Electric Shock recoil: TAILS! ${attacker.card.name} dealt 10 damage to itself!`, 'damage');
      }
    }

    // Status conditions applied to defender
    // Stun Gas reads "If heads, Poisoned; if tails, Paralyzed" and is resolved in full
    // further up. Without this exclusion the branch below matched on the word
    // "Paralyzed" in its text and overwrote both outcomes with Paralyzed, which made the
    // coin look like it decided nothing.
    if (attackName !== 'stun gas' && (attackText.includes('paralyzed') || attackName === 'thundershock' || attackName === 'thunder wave' || attackName === 'psyshock' || attackName === 'string shot' || attackName === 'ice beam' || attackName === 'star freeze' || attackName === 'bubble')) {
      if (attackText.includes('flip a coin') || attackName === 'thundershock' || attackName === 'bubble' || attackName === 'ice beam' || attackName === 'star freeze') {
        if (primaryFlip) {
          defender.status = 'Paralyzed';
          GameEngine.addLog(next, `⚡ Coin flip: HEADS! ${defender.card.name} is now Paralyzed (Cannot attack or retreat next turn)!`, 'status');
        } else {
          GameEngine.addLog(next, `Coin flip: TAILS! ${defender.card.name} avoided Paralysis.`, 'action');
        }
      } else {
        defender.status = 'Paralyzed';
        GameEngine.addLog(next, `⚡ ${defender.card.name} is now Paralyzed!`, 'status');
      }
    } else if (attackText.includes('poisoned') || attackName === 'toxic' || attackName === 'poison sting' || attackName === 'poisonpowder' || attackName === 'poison vapor' || attackName === 'sludge punch' || attackName === 'jellyfish sting' || attackName === 'poison fang') {
      if (attackName === 'toxic') {
        defender.poisonType = 'Toxic';
        GameEngine.addLog(next, `☠️ ${defender.card.name} is badly Poisoned (Takes 20 damage between turns)!`, 'status');
      } else if (attackText.includes('flip a coin')) {
        if (primaryFlip) {
          defender.poisonType = 'Poisoned';
          GameEngine.addLog(next, `☠️ Coin flip: HEADS! ${defender.card.name} is now Poisoned!`, 'status');
        } else {
          GameEngine.addLog(next, `Coin flip: TAILS! ${defender.card.name} avoided Poison.`, 'action');
        }
      } else {
        defender.poisonType = 'Poisoned';
        GameEngine.addLog(next, `☠️ ${defender.card.name} is now Poisoned!`, 'status');
      }
    } else if (attackText.includes('asleep') || attackName === 'hypnosis' || attackName === 'sleep powder' || attackName === 'sing' || attackName === 'lullaby') {
      if (attackText.includes('flip a coin')) {
        if (primaryFlip) {
          defender.status = 'Asleep';
          GameEngine.addLog(next, `💤 Coin flip: HEADS! ${defender.card.name} is now Asleep!`, 'status');
        } else {
          GameEngine.addLog(next, `Coin flip: TAILS! ${defender.card.name} avoided Sleep.`, 'action');
        }
      } else {
        defender.status = 'Asleep';
        GameEngine.addLog(next, `💤 ${defender.card.name} is now Asleep!`, 'status');
      }
    } else if (attackText.includes('confused') || attackName === 'confuse ray' || attackName === 'foul gas' || attackName === 'venom powder') {
      if (attackName === 'foul gas') {
        if (primaryFlip) {
          defender.poisonType = 'Poisoned';
          GameEngine.addLog(next, `☠️ Coin flip: HEADS! ${defender.card.name} is now Poisoned!`, 'status');
        } else {
          defender.status = 'Confused';
          GameEngine.addLog(next, `😵 Coin flip: TAILS! ${defender.card.name} is now Confused!`, 'status');
        }
      } else if (attackName === 'venom powder') {
        if (primaryFlip) {
          defender.status = 'Confused';
          defender.poisonType = 'Poisoned';
          GameEngine.addLog(next, `😵 Coin flip: HEADS! ${defender.card.name} is now Confused and Poisoned!`, 'status');
        }
      } else if (attackText.includes('flip a coin')) {
        if (primaryFlip) {
          defender.status = 'Confused';
          GameEngine.addLog(next, `😵 Coin flip: HEADS! ${defender.card.name} is now Confused!`, 'status');
        } else {
          GameEngine.addLog(next, `Coin flip: TAILS! ${defender.card.name} avoided Confusion.`, 'action');
        }
      } else {
        defender.status = 'Confused';
        GameEngine.addLog(next, `😵 ${defender.card.name} is now Confused!`, 'status');
      }
    }

    // Mysterious Fossil & Clefairy Doll are immune to all special conditions (Asleep, Confused, Paralyzed, Poisoned, Toxic)
    if (defender.card.name === 'Mysterious Fossil' || defender.card.name === 'Clefairy Doll' || defender.isClefairyDoll) {
      defender.status = 'None';
      defender.poisonType = undefined;
    }
    if (attacker.card.name === 'Mysterious Fossil' || attacker.card.name === 'Clefairy Doll' || attacker.isClefairyDoll) {
      attacker.status = 'None';
      attacker.poisonType = undefined;
    }

    // Hand the UI the list of Benched Pokémon this attack damaged on top of its main target.
    // Poison Vapor and Blizzard both read as a field-wide effect, and an animation that stops on
    // the Active card makes the move look like it did nothing at all to the Bench.
    if (benchHits.length > 0 && next.lastAttackResult) {
      next.lastAttackResult.benchHits = benchHits;
    }

    const hasAnyKnockout =
      (defender.currentHp === 0) ||
      (attacker.currentHp === 0) ||
      defenderPlayer.bench.some(b => b.currentHp <= 0) ||
      attackerPlayer.bench.some(b => b.currentHp <= 0);

    if (hasAnyKnockout) {
      let fName = defender.card.name;
      let isPlyr = defenderPlayer.id === 'player';
      if (defender.currentHp === 0) {
        fName = defender.card.name;
        isPlyr = defenderPlayer.id === 'player';
      } else if (attacker.currentHp === 0) {
        fName = attacker.card.name;
        isPlyr = attackerPlayer.id === 'player';
      } else {
        const fBenchDef = defenderPlayer.bench.find(b => b.currentHp <= 0);
        if (fBenchDef) {
          fName = fBenchDef.card.name;
          isPlyr = defenderPlayer.id === 'player';
        } else {
          const fBenchAtk = attackerPlayer.bench.find(b => b.currentHp <= 0);
          if (fBenchAtk) {
            fName = fBenchAtk.card.name;
            isPlyr = attackerPlayer.id === 'player';
          }
        }
      }

      next.pendingKnockout = {
        faintedName: fName,
        isPlayer: isPlyr
      };
      GameEngine.addLog(next, `💀 ${fName} was Knocked Out!`, 'damage');
      return next;
    }

    return GameEngine.endTurn(next);
  }

  static resolveKnockout(state: GameState): GameState {
    // Deep copy to prevent mutation of the original state objects
    const next: GameState = {
      ...state,
      player: { ...state.player, bench: [...state.player.bench], discard: [...state.player.discard], hand: [...state.player.hand], prizes: [...state.player.prizes], deck: [...state.player.deck] },
      cpu: { ...state.cpu, bench: [...state.cpu.bench], discard: [...state.cpu.discard], hand: [...state.cpu.hand], prizes: [...state.cpu.prizes], deck: [...state.cpu.deck] },
      logs: [...state.logs],
      pendingKnockout: undefined
    };
    if (next.winner) return next;

    const current = next[next.turnPlayer];
    const opponent = next[next.turnPlayer === 'player' ? 'cpu' : 'player'];

    // SAFETY: If a side has no active and no bench at all, declare winner immediately
    if (!current.active && current.bench.length === 0) {
      next.winner = opponent.id;
      next.winReason = `${current.name} has no remaining Pokémon in play!`;
      next.phase = 'GAME_OVER';
      return next;
    }
    if (!opponent.active && opponent.bench.length === 0) {
      next.winner = current.id;
      next.winReason = `${opponent.name} has no remaining Pokémon in play!`;
      next.phase = 'GAME_OVER';
      return next;
    }

    // SAFETY: If a side has no active but HAS bench Pokemon, force replacement selection
    // (handles edge case where knockout was partially processed but phase wasn't set)
    if (!current.active && current.bench.length > 0 && next.phase !== 'SELECT_BENCH_REPLACEMENT') {
      if (current.id === 'player') {
        next.phase = 'SELECT_BENCH_REPLACEMENT';
        GameEngine.addLog(next, 'Choose your next Active Pokémon from the bench!', 'system');
        return next;
      } else {
        let bestIdx = 0;
        let bestHp = -1;
        current.bench.forEach((b, i) => { if (b.currentHp > bestHp) { bestHp = b.currentHp; bestIdx = i; } });
        const newActive = current.bench.splice(bestIdx, 1)[0];
        newActive.status = 'None';
        newActive.poisonType = undefined;
        current.active = newActive;
        GameEngine.addLog(next, `${current.name} sent out ${newActive.card.name} from the bench!`, 'ai');
      }
    }
    if (!opponent.active && opponent.bench.length > 0 && next.phase !== 'SELECT_BENCH_REPLACEMENT') {
      if (opponent.id === 'player') {
        next.phase = 'SELECT_BENCH_REPLACEMENT';
        GameEngine.addLog(next, 'Choose your next Active Pokémon from the bench!', 'system');
        return next;
      } else {
        let bestIdx = 0;
        let bestHp = -1;
        opponent.bench.forEach((b, i) => { if (b.currentHp > bestHp) { bestHp = b.currentHp; bestIdx = i; } });
        const newActive = opponent.bench.splice(bestIdx, 1)[0];
        newActive.status = 'None';
        newActive.poisonType = undefined;
        opponent.active = newActive;
        GameEngine.addLog(next, `${opponent.name} sent out ${newActive.card.name} from the bench!`, 'ai');
      }
    }

    // Early return if no knockouts to process (prevents accidental turn advancement from stale watchdog calls)
    const hasAnyFainted =
      (current.active && current.active.currentHp <= 0) ||
      (opponent.active && opponent.active.currentHp <= 0) ||
      current.bench.some(b => b.currentHp <= 0) ||
      opponent.bench.some(b => b.currentHp <= 0);
    if (!hasAnyFainted) {
      // If we get here with no active on a side but bench exists, handle replacement
      if (!current.active && current.bench.length > 0) {
        if (current.id === 'player') {
          next.phase = 'SELECT_BENCH_REPLACEMENT';
          return next;
        }
      }
      if (!opponent.active && opponent.bench.length > 0) {
        if (opponent.id === 'player') {
          next.phase = 'SELECT_BENCH_REPLACEMENT';
          return next;
        }
      }
      return next;
    }

    // 1. Process Benched Pokémon Knockouts FIRST
    const handleBenchKnockoutsFor = (faintedPlayer: PlayerState, enemyPlayer: PlayerState): boolean => {
      let i = 0;
      while (i < faintedPlayer.bench.length) {
        const benched = faintedPlayer.bench[i];
        if (benched.currentHp <= 0) {
          faintedPlayer.bench.splice(i, 1);
          faintedPlayer.discard.push(benched.card, ...benched.attachedEnergy, ...benched.evolutionHistory);
          const isFossilOrDoll = benched.card.name === 'Mysterious Fossil' || benched.card.name === 'Clefairy Doll' || benched.isClefairyDoll;

          if (!isFossilOrDoll) {
            GameEngine.addLog(next, `💀 ${faintedPlayer.name}'s Benched ${benched.card.name} was Knocked Out and sent to the Discard Pile!`, 'damage');
            if (enemyPlayer.prizes.length > 0) {
              const prize = enemyPlayer.prizes.shift()!;
              enemyPlayer.hand.push(prize);
              GameEngine.addLog(next, `🎁 ${enemyPlayer.name} drew 1 Prize Card (${enemyPlayer.prizes.length} remaining)! [Obtained ${prize.name}]`, 'action');
            }

            if (enemyPlayer.prizes.length === 0) {
              next.winner = enemyPlayer.id;
              next.winReason = `${enemyPlayer.name} took all Prize Cards!`;
              next.phase = 'GAME_OVER';
              return true;
            }
          } else {
            GameEngine.addLog(next, `🧸 ${benched.card.name} on the Bench was Knocked Out (Does NOT award a Prize Card!).`, 'system');
          }

          if (!faintedPlayer.active && faintedPlayer.bench.length === 0) {
            next.winner = enemyPlayer.id;
            next.winReason = `${faintedPlayer.name} has no remaining Pokémon in play!`;
            next.phase = 'GAME_OVER';
            return true;
          }
        } else {
          i++;
        }
      }
      return false;
    };

    const bGameOver1 = handleBenchKnockoutsFor(opponent, current);
    if (bGameOver1 || next.winner) return next;

    const bGameOver2 = handleBenchKnockoutsFor(current, opponent);
    if (bGameOver2 || next.winner) return next;

    // 2. Process Active Pokémon Knockouts
    const handleActiveKnockoutFor = (faintedPlayer: PlayerState, enemyPlayer: PlayerState): boolean => {
      if (faintedPlayer.active && faintedPlayer.active.currentHp <= 0) {
        const fainted = faintedPlayer.active;
        faintedPlayer.discard.push(fainted.card, ...fainted.attachedEnergy, ...fainted.evolutionHistory);
        faintedPlayer.active = null;
        const isFossilOrDoll = fainted.card.name === 'Mysterious Fossil' || fainted.card.name === 'Clefairy Doll' || fainted.isClefairyDoll;

        if (!isFossilOrDoll) {
          if (enemyPlayer.prizes.length > 0) {
            const prize = enemyPlayer.prizes.shift()!;
            enemyPlayer.hand.push(prize);
            GameEngine.addLog(next, `🎁 ${enemyPlayer.name} drew 1 Prize Card (${enemyPlayer.prizes.length} remaining)! [Obtained ${prize.name}]`, 'action');
          }

          if (enemyPlayer.prizes.length === 0) {
            next.winner = enemyPlayer.id;
            next.winReason = `${enemyPlayer.name} took all Prize Cards!`;
            next.phase = 'GAME_OVER';
            return true;
          }
        } else {
          GameEngine.addLog(next, `🧸 ${fainted.card.name} was Knocked Out (Does NOT award a Prize Card!).`, 'system');
        }

        if (faintedPlayer.bench.length === 0) {
          next.winner = enemyPlayer.id;
          next.winReason = `${faintedPlayer.name} has no remaining Pokémon in play!`;
          next.phase = 'GAME_OVER';
          return true;
        }

        if (faintedPlayer.id === 'player') {
          next.phase = 'SELECT_BENCH_REPLACEMENT';
          GameEngine.addLog(next, 'Choose your next Active Pokémon from the bench!', 'system');
          return true;
        } else {
          let bestIdx = 0;
          let bestHp = -1;
          faintedPlayer.bench.forEach((b, i) => {
            if (b.currentHp > bestHp) {
              bestHp = b.currentHp;
              bestIdx = i;
            }
          });
          const newActive = faintedPlayer.bench.splice(bestIdx, 1)[0];
          newActive.status = 'None';
          newActive.poisonType = undefined;
          newActive.sandAttackedNextTurn = false;
          GameEngine.clearAttackBlock(newActive);
          newActive.preventDamageNextTurn = false;
          newActive.preventAllEffectsNextTurn = false;
          newActive.hardenActiveNextTurn = false;
          newActive.swordsDanceActiveNextTurn = false;
          newActive.plusPowersAttached = 0;
          newActive.defendersAttached = 0;
          faintedPlayer.active = newActive;
          GameEngine.addLog(next, `${faintedPlayer.name} sent out ${newActive.card.name} from the bench!`, 'ai');
        }
      }
      return false;
    };

    const gameOver1 = handleActiveKnockoutFor(opponent, current);
    if (gameOver1 || next.winner) return next;

    const gameOver2 = handleActiveKnockoutFor(current, opponent);
    if (gameOver2 || next.winner) return next;

    if (next.phase === 'SELECT_BENCH_REPLACEMENT') return next;

    return GameEngine.advanceTurn(next);
  }

  static endTurn(state: GameState): GameState {
    const next = { ...state };
    const current = next[next.turnPlayer];
    const opponent = next[next.turnPlayer === 'player' ? 'cpu' : 'player'];

    if (current.active) current.active.plusPowersAttached = 0;
    if (opponent.active) opponent.active.defendersAttached = 0;

    // Record every between-turns status damage event so the UI can play the
    // poison_tick FX on the right Pokémon instance at the exact moment the HP
    // bar drops (instead of guessing from the post-endTurn status afterwards).
    const statusTicks: StatusTick[] = [];
    const sideOf = (pokemon: InPlayCard): 'player' | 'cpu' =>
      pokemon === current.active ? next.turnPlayer : (next.turnPlayer === 'player' ? 'cpu' : 'player');

    [current.active, opponent.active].forEach(pokemon => {
      if (!pokemon) return;

      if (pokemon.poisonType === 'Poisoned') {
        pokemon.damage += 10;
        pokemon.currentHp = Math.max(0, (pokemon.card.hp || 0) - pokemon.damage);
        statusTicks.push({ target: sideOf(pokemon), instanceId: pokemon.instanceId, pokemonName: pokemon.card.name, amount: 10, kind: 'Poisoned' });
        GameEngine.addLog(next, `☠️ ${pokemon.card.name} took 10 Poison damage (${pokemon.currentHp}/${pokemon.card.hp} HP remaining).`, 'status');
      } else if (pokemon.poisonType === 'Toxic') {
        pokemon.damage += 20;
        pokemon.currentHp = Math.max(0, (pokemon.card.hp || 0) - pokemon.damage);
        statusTicks.push({ target: sideOf(pokemon), instanceId: pokemon.instanceId, pokemonName: pokemon.card.name, amount: 20, kind: 'Toxic' });
        GameEngine.addLog(next, `☠️ ${pokemon.card.name} took 20 Toxic damage!`, 'status');
      }

      if (pokemon.status === 'Asleep') {
        if (Math.random() >= 0.5) {
          pokemon.status = 'None';
          GameEngine.addLog(next, `💤 Sleep check: HEADS! ${pokemon.card.name} woke up!`, 'status');
        } else {
          GameEngine.addLog(next, `💤 Sleep check: TAILS! ${pokemon.card.name} is still asleep.`, 'status');
        }
      }

      if (pokemon.status === 'Paralyzed' && pokemon === current.active) {
        pokemon.status = 'None';
        GameEngine.addLog(next, `⚡ ${pokemon.card.name} is no longer Paralyzed.`, 'status');
      }
    });

    next.lastStatusTicks = statusTicks;

    // Ensure all bench Pokémon have clean status
    [next.player.bench, next.cpu.bench].forEach(bList => {
      bList.forEach(p => { if (p) { p.status = 'None'; p.poisonType = undefined; } });
    });

    const hasAnyKnockout =
      (current.active && current.active.currentHp <= 0) ||
      (opponent.active && opponent.active.currentHp <= 0) ||
      current.bench.some(b => b.currentHp <= 0) ||
      opponent.bench.some(b => b.currentHp <= 0);

    if (hasAnyKnockout) {
      // Do NOT resolve the knockout here. Return the state with the 0-HP Pokémon still
      // in play so the UI can display the fainted animation (grayscale + knockout banner)
      // before calling resolveKnockout() explicitly — matching the attack-KO flow.
      return next;
    }

    return GameEngine.advanceTurn(next);
  }

  static advanceTurn(state: GameState): GameState {
    const next = { ...state };
    next.turnPlayer = next.turnPlayer === 'player' ? 'cpu' : 'player';
    next.turn += 1;
    const newActivePlayer = next[next.turnPlayer];

    newActivePlayer.energyAttachedThisTurn = false;
    newActivePlayer.hasRetreatedThisTurn = false;
    newActivePlayer.trainerPlayedThisTurn = false;
    newActivePlayer.trainerBlockedNextTurn = false;

    if (newActivePlayer.active) {
      newActivePlayer.active.turnsInPlay += 1;
      newActivePlayer.active.preventDamageNextTurn = false;
      newActivePlayer.active.preventAllEffectsNextTurn = false;
      newActivePlayer.active.hardenActiveNextTurn = false;
      newActivePlayer.active.powerUsedThisTurn = false;
      newActivePlayer.active.minimizeActiveNextTurn = false;
      newActivePlayer.active.pounceActiveNextTurn = false;
      newActivePlayer.active.preventRetreatNextTurn = false;
      newActivePlayer.active.powerBlockedNextTurn = false;
      newActivePlayer.active.destinyBondActiveNextTurn = false;
    }
    newActivePlayer.bench.forEach(p => {
      p.turnsInPlay += 1;
      p.status = 'None';
      p.poisonType = undefined;
      p.preventDamageNextTurn = false;
      p.preventAllEffectsNextTurn = false;
      p.hardenActiveNextTurn = false;
      p.powerUsedThisTurn = false;
      p.minimizeActiveNextTurn = false;
      p.pounceActiveNextTurn = false;
      p.preventRetreatNextTurn = false;
      p.powerBlockedNextTurn = false;
    });

    // Attack blocks (Tail Wag / Leer / Amnesia) last exactly one opposing turn. They cannot ride
    // on the "spent it by attacking" path alone: if the marked player retreats instead, or simply
    // ends the turn without attacking, nothing ever consumed the mark and it would silently
    // switch off a second turn as well. The turn stamp plus the benching clause are settled here.
    [next.player, next.cpu].forEach(side => {
      [side.active, ...side.bench].forEach(p => {
        if (!p || p.attackBlockExpiresOnTurn === undefined) return;
        if (next.turn > p.attackBlockExpiresOnTurn) GameEngine.clearAttackBlock(p);
      });
    });
    GameEngine.pruneAttackBlocks(next);

    [next.player.bench, next.cpu.bench].forEach(bList => {
      bList.forEach(p => { if (p) { p.status = 'None'; p.poisonType = undefined; } });
    });


    // SAFETY: If the new active player has no Pokémon in play at all, opponent wins
    if (!newActivePlayer.active && newActivePlayer.bench.length === 0) {
      const otherPlayer = next[next.turnPlayer === 'player' ? 'cpu' : 'player'];
      next.winner = otherPlayer.id;
      next.winReason = `${newActivePlayer.name} has no remaining Pokémon in play!`;
      next.phase = 'GAME_OVER';
      GameEngine.addLog(next, `${newActivePlayer.name} has no remaining Pokémon in play!`, 'system');
      return next;
    }

    if (newActivePlayer.deck.length === 0) {
      next.winner = next.turnPlayer === 'player' ? 'cpu' : 'player';
      next.winReason = `${newActivePlayer.name} has no cards left in deck to draw!`;
      next.phase = 'GAME_OVER';
      GameEngine.addLog(next, `Deck out! ${newActivePlayer.name} cannot draw a card.`, 'system');
      return next;
    }

    const drawn = newActivePlayer.deck.shift()!;
    newActivePlayer.hand.push(drawn);

    GameEngine.addLog(next, `--- Turn ${next.turn}: ${newActivePlayer.name}'s Turn ---`, 'system');
    GameEngine.addLog(next, `${newActivePlayer.name} drew a card (${newActivePlayer.hand.length} in hand, ${newActivePlayer.deck.length} in deck).`, 'action');

    return next;
  }

  static playDeckSearchTrainer(state: GameState, playerId: 'player' | 'cpu', handIndex: number, chosenDeckIndex: number, card: Card): GameState {
    const next = { ...state };
    const player = next[playerId];
    if (!card || card.supertype !== 'Trainer') return next;

    const removeIdx = player.hand.findIndex(c => c === card || c.id === card.id);
    if (removeIdx !== -1) {
      player.hand.splice(removeIdx, 1);
    }
    player.discard.push(card);
    player.trainerPlayedThisTurn = true;

    if (chosenDeckIndex >= 0 && chosenDeckIndex < player.deck.length) {
      const found = player.deck.splice(chosenDeckIndex, 1)[0];
      player.hand.push(found);
      player.deck = GameEngine.shuffle(player.deck);
      GameEngine.addLog(next, `🔍 ${player.name} used ${card.name} to find ${found.name} and added it to hand!`, 'action');
    } else {
      player.deck = GameEngine.shuffle(player.deck);
      GameEngine.addLog(next, `${player.name} searched the deck with ${card.name}.`, 'action');
    }

    return next;
  }

  static executePokemonPower(
    state: GameState,
    playerId: 'player' | 'cpu',
    instanceId: string,
    powerName: string,
    params?: {
      discardHandIndex?: number;
      chosenDeckIndex?: number;
      targetInstanceId?: string;
      coinResults?: boolean[];
    }
  ): GameState {
    const next = { ...state };
    const player = next[playerId];
    const opponent = next[playerId === 'player' ? 'cpu' : 'player'];

    const pokemon = [player.active, ...player.bench].find(p => p && p.instanceId === instanceId);
    if (!pokemon) return next;

    // Muk's Toxic Gas check. Stare can silence that Pokémon Power, and doing so is the only way
    // to get a power through while a Muk is on the board, so the shutdown has to be honoured here.
    const isMukInPlay = [player.active, ...player.bench, opponent.active, ...opponent.bench].some(
      p => p && p.card.name === 'Muk' && p.status !== 'Asleep' && p.status !== 'Paralyzed' && p.status !== 'Confused'
        && !GameEngine.isPowerDisabled(p, next.turn)
    );
    if (isMukInPlay && pokemon.card.name !== 'Muk') {
      GameEngine.addLog(next, `🚫 Muk's Toxic Gas is active! Pokémon Powers cannot be used!`, 'status');
      return next;
    }

    if (GameEngine.isPowerDisabled(pokemon, next.turn)) {
      GameEngine.addLog(next, `👁️ ${pokemon.card.name}'s ${powerName} is shut down by Dark Arbok's Stare until the end of the opponent's next turn!`, 'status');
      return next;
    }

    if (pokemon.status === 'Asleep' || pokemon.status === 'Paralyzed' || pokemon.status === 'Confused') {
      GameEngine.addLog(next, `⚡ ${pokemon.card.name} is ${pokemon.status} and cannot use its Pokémon Power!`, 'status');
      return next;
    }

    const normPower = powerName.toLowerCase().trim();

    // 1. Matter Exchange (Dark Kadabra / Dark Alakazam)
    if (normPower === 'matter exchange') {
      if (player.hand.length === 0) {
        GameEngine.addLog(next, `Cannot use Matter Exchange: Hand is empty!`, 'system');
        return next;
      }
      const discardIdx = (params?.discardHandIndex !== undefined && params.discardHandIndex >= 0 && params.discardHandIndex < player.hand.length)
        ? params.discardHandIndex
        : 0;
      const discarded = player.hand.splice(discardIdx, 1)[0];
      player.discard.push(discarded);

      if (player.deck.length > 0) {
        const drawn = player.deck.shift()!;
        player.hand.push(drawn);
        GameEngine.addLog(next, `🔮 Matter Exchange! ${player.name} discarded ${discarded.name} and drew 1 card!`, 'action');
      } else {
        GameEngine.addLog(next, `🔮 Matter Exchange! Discarded ${discarded.name}, but deck is empty.`, 'action');
      }
      pokemon.powerUsedThisTurn = true;
    }

    // 2. Evolutionary Light (Dark Dragonair)
    else if (normPower === 'evolutionary light') {
      let evoIdx = params?.chosenDeckIndex;
      if (evoIdx === undefined || evoIdx < 0 || evoIdx >= player.deck.length) {
        evoIdx = player.deck.findIndex(c => c.supertype === 'Pokemon' && (c.subtype === 'Stage 1' || c.subtype === 'Stage 2'));
      }
      if (evoIdx !== -1) {
        const found = player.deck.splice(evoIdx, 1)[0];
        player.hand.push(found);
        player.deck = GameEngine.shuffle(player.deck);
        GameEngine.addLog(next, `🌟 Evolutionary Light! Found ${found.name} and added it to hand!`, 'action');
      } else {
        player.deck = GameEngine.shuffle(player.deck);
        GameEngine.addLog(next, `Evolutionary Light: No Evolution cards found in deck.`, 'action');
      }
      pokemon.powerUsedThisTurn = true;
    }

    // 2b. Sneak Attack (Dark Golbat)
    // "When you play Dark Golbat from your hand, you may choose 1 of your
    // opponent's Pokémon. If you do, Dark Golbat does 10 damage to that Pokémon.
    // Apply Weakness and Resistance."
    else if (normPower === 'sneak attack') {
      const candidates: (InPlayCard | null)[] = [opponent.active, ...opponent.bench];
      const targetIdx = (params?.targetInstanceId !== undefined)
        ? candidates.findIndex(p => p && p.instanceId === params.targetInstanceId)
        : 0;
      const idx = (targetIdx !== -1 && candidates[targetIdx]) ? targetIdx : 0;
      const target = candidates[idx]!;

      let dmg = 10;
      const attackerType = pokemon.card.types?.[0];
      // Apply Weakness and Resistance (unlike Flitter / Stare)
      if (attackerType && target.card.weakness && target.card.weakness.type === attackerType) {
        let mult = 2;
        if (typeof target.card.weakness.value === 'number') mult = target.card.weakness.value;
        else if (typeof target.card.weakness.value === 'string') {
          const m = (target.card.weakness.value as string).match(/\d+/);
          if (m) mult = parseInt(m[0], 10);
        }
        dmg = Math.round(dmg * mult);
      }
      if (attackerType && target.card.resistance && target.card.resistance.type === attackerType) {
        let reduction = 30;
        if (typeof target.card.resistance.value === 'number') reduction = Math.abs(target.card.resistance.value);
        else if (typeof target.card.resistance.value === 'string') {
          const m = (target.card.resistance.value as string).match(/\d+/);
          if (m) reduction = parseInt(m[0], 10);
        }
        dmg = Math.max(0, dmg - reduction);
      }

      target.damage += dmg;
      target.currentHp = Math.max(0, (target.card.hp || 0) - target.damage);
      GameEngine.addLog(next, `🦇 Sneak Attack! Dark Golbat dealt ${dmg} damage to ${target.card.name} (${target.currentHp}/${target.card.hp} HP)!`, 'action');

      if (target.currentHp <= 0) {
        next.pendingKnockout = { faintedName: target.card.name, isPlayer: playerId !== 'player' };
      }
      pokemon.powerUsedThisTurn = true;
    }

    // 3. Pollen Stench (Dark Gloom)
    else if (normPower === 'pollen stench') {
      const flip = (params?.coinResults && params.coinResults.length > 0) ? params.coinResults[0] : (Math.random() >= 0.5);
      if (flip) {
        if (opponent.active) {
          opponent.active.status = 'Confused';
          GameEngine.addLog(next, `🌸 Pollen Stench: HEADS! Defending ${opponent.active.card.name} is now Confused!`, 'status');
        }
      } else {
        if (player.active) {
          player.active.status = 'Confused';
          GameEngine.addLog(next, `🌸 Pollen Stench: TAILS! Active ${player.active.card.name} is now Confused!`, 'status');
        }
      }
      pokemon.powerUsedThisTurn = true;
    }

    // 4. Long-Distance Hypnosis (Drowzee)
    else if (normPower === 'long-distance hypnosis') {
      const flip = (params?.coinResults && params.coinResults.length > 0) ? params.coinResults[0] : (Math.random() >= 0.5);
      if (flip) {
        if (opponent.active) {
          opponent.active.status = 'Asleep';
          GameEngine.addLog(next, `💤 Long-Distance Hypnosis: HEADS! Defending ${opponent.active.card.name} fell Asleep!`, 'status');
        }
      } else {
        if (player.active) {
          player.active.status = 'Asleep';
          GameEngine.addLog(next, `💤 Long-Distance Hypnosis: TAILS! Active ${player.active.card.name} fell Asleep!`, 'status');
        }
      }
      pokemon.powerUsedThisTurn = true;
    }

    // 5. Trickery (Rattata)
    else if (normPower === 'trickery') {
      if (player.prizes.length > 0 && player.deck.length > 0) {
        const prizeCard = player.prizes.pop()!;
        const topDeck = player.deck.shift()!;
        player.prizes.push(topDeck);
        player.deck.unshift(prizeCard);
        GameEngine.addLog(next, `🐭 Trickery! Swapped 1 Prize card with the top card of the deck!`, 'action');
      }
      pokemon.powerUsedThisTurn = true;
    }

    // 6. Gather Fire (Charmander)
    else if (normPower === 'gather fire') {
      const otherBenched = player.bench.find(b => b.instanceId !== pokemon.instanceId && b.attachedEnergy.some(e => e.types?.includes('Fire') || e.name.includes('Fire')));
      if (otherBenched) {
        const fireIdx = otherBenched.attachedEnergy.findIndex(e => e.types?.includes('Fire') || e.name.includes('Fire'));
        if (fireIdx !== -1) {
          const fireEnergy = otherBenched.attachedEnergy.splice(fireIdx, 1)[0];
          pokemon.attachedEnergy.push(fireEnergy);
          GameEngine.addLog(next, `🔥 Gather Fire! Moved 1 Fire Energy from ${otherBenched.card.name} to Charmander!`, 'action');
        }
      } else {
        GameEngine.addLog(next, `Gather Fire: No other Pokémon with Fire Energy attached.`, 'system');
      }
      pokemon.powerUsedThisTurn = true;
    }

    // 7. Energy Burn (Charizard)
    else if (normPower === 'energy burn') {
      GameEngine.addLog(next, `🔥 Energy Burn! All energy attached to ${pokemon.card.name} counts as Fire Energy for this turn!`, 'status');
      pokemon.powerUsedThisTurn = true;
    }

    // 8. Rain Dance (Blastoise)
    else if (normPower === 'rain dance') {
      GameEngine.addLog(next, `💧 Rain Dance is active! You can attach unlimited Water Energy cards to Water Pokémon from your hand!`, 'status');
    }

    // 9. Damage Swap (Alakazam)
    else if (normPower === 'damage swap') {
      const source = [player.active, ...player.bench].find(p => p && p.damage >= 10);
      const target = [player.active, ...player.bench].find(p => p && p.instanceId !== source?.instanceId && p.currentHp > 10);
      if (source && target && source.damage >= 10) {
        source.damage -= 10;
        source.currentHp = (source.card.hp || 50) - source.damage;
        target.damage += 10;
        target.currentHp = (target.card.hp || 50) - target.damage;
        GameEngine.addLog(next, `✨ ${powerName}! Moved 1 damage counter from ${source.card.name} to ${target.card.name}!`, 'action');
      } else {
        GameEngine.addLog(next, `Cannot use ${powerName}: No valid damage counters to move without knocking out Pokémon.`, 'system');
      }
    }

    // 10. Curse (Gengar)
    else if (normPower === 'curse') {
      const oppDamaged = [opponent.active, ...opponent.bench].find(p => p && p.damage >= 10);
      const oppTarget = [opponent.active, ...opponent.bench].find(p => p && p.instanceId !== oppDamaged?.instanceId);
      if (oppDamaged && oppTarget) {
        oppDamaged.damage -= 10;
        oppDamaged.currentHp = (oppDamaged.card.hp || 50) - oppDamaged.damage;
        oppTarget.damage += 10;
        oppTarget.currentHp = Math.max(0, (oppTarget.card.hp || 50) - oppTarget.damage);
        GameEngine.addLog(next, `👻 Curse! Moved 1 damage counter from opponent's ${oppDamaged.card.name} to ${oppTarget.card.name}!`, 'action');
        pokemon.powerUsedThisTurn = true;
      }
    }

    // 11. Shift (Venomoth)
    else if (normPower === 'shift') {
      if (opponent.active && opponent.active.card.types && opponent.active.card.types[0]) {
        pokemon.card = { ...pokemon.card, types: [opponent.active.card.types[0]] };
        GameEngine.addLog(next, `🦋 Shift! Venomoth shifted its type to ${opponent.active.card.types[0]}!`, 'status');
        pokemon.powerUsedThisTurn = true;
      }
    }

    // 12. Buzzap (Electrode)
    else if (normPower === 'buzzap') {
      pokemon.damage = pokemon.card.hp || 80;
      pokemon.currentHp = 0;
      const target = [player.active, ...player.bench].find(p => p && p.instanceId !== pokemon.instanceId);
      if (target) {
        target.attachedEnergy.push({
          ...pokemon.card,
          supertype: 'Energy',
          subtype: 'Special Energy',
          energy: { type: 'Colorless', amount: 2 }
        });
        GameEngine.addLog(next, `⚡ Buzzap! Electrode knocked itself out and attached as 2 Energy to ${target.card.name}!`, 'action');
      }
    }

    // 13. Step In (Dragonite - Fossil)
    else if (normPower === 'step in') {
      if (player.bench.some(b => b.instanceId === pokemon.instanceId) && player.active) {
        const oldActive = player.active;
        const bIdx = player.bench.findIndex(b => b.instanceId === pokemon.instanceId);
        player.active = player.bench.splice(bIdx, 1, oldActive)[0];
        GameEngine.addLog(next, `🐉 Step In! Dragonite stepped in to become the Active Pokémon!`, 'action');
        pokemon.powerUsedThisTurn = true;
      }
    }

    // 14. Cowardice (Tentacool - Fossil)
    else if (normPower === 'cowardice') {
      if (pokemon.turnsInPlay < 1) {
        GameEngine.addLog(next, `Cowardice cannot be used on the turn Tentacool entered play!`, 'system');
        return next;
      }
      player.discard.push(...pokemon.attachedEnergy, ...pokemon.evolutionHistory);
      player.hand.push(pokemon.card);
      if (player.active && player.active.instanceId === pokemon.instanceId) {
        player.active = null;
        if (player.bench.length > 0) {
          if (playerId === 'player') next.phase = 'SELECT_BENCH_REPLACEMENT';
          else player.active = player.bench.shift()!;
        } else {
          next.winner = opponent.id;
          next.winReason = `${player.name} has no remaining Pokémon in play!`;
          next.phase = 'GAME_OVER';
        }
      } else {
        const bIdx = player.bench.findIndex(b => b.instanceId === pokemon.instanceId);
        if (bIdx !== -1) player.bench.splice(bIdx, 1);
      }
      GameEngine.addLog(next, `🦑 Cowardice! Tentacool returned to hand (discarded attached cards)!`, 'action');
    }

    // 15. Strange Behavior (Slowbro - Fossil)
    else if (normPower === 'strange behavior') {
      const otherDamaged = [player.active, ...player.bench].find(p => p && p.instanceId !== pokemon.instanceId && p.damage >= 10);
      if (otherDamaged && pokemon.currentHp > 10) {
        otherDamaged.damage -= 10;
        otherDamaged.currentHp = (otherDamaged.card.hp || 50) - otherDamaged.damage;
        pokemon.damage += 10;
        pokemon.currentHp = (pokemon.card.hp || 60) - pokemon.damage;
        GameEngine.addLog(next, `🧠 Strange Behavior! Moved 10 damage from ${otherDamaged.card.name} to Slowbro!`, 'action');
      } else {
        GameEngine.addLog(next, `Cannot use Strange Behavior: No damage to move or moving damage would Knock Out Slowbro.`, 'system');
      }
    }

    // 16. Energy Trans (Venusaur - Base Set)
    else if (normPower === 'energy trans') {
      const source = [player.active, ...player.bench].find(p => p && p.instanceId !== pokemon.instanceId && p.attachedEnergy.some(e => e.types?.includes('Grass') || e.name.includes('Grass')));
      if (source) {
        const gIdx = source.attachedEnergy.findIndex(e => e.types?.includes('Grass') || e.name.includes('Grass'));
        if (gIdx !== -1) {
          const grassEnergy = source.attachedEnergy.splice(gIdx, 1)[0];
          pokemon.attachedEnergy.push(grassEnergy);
          GameEngine.addLog(next, `🌿 Energy Trans! Moved 1 Grass Energy from ${source.card.name} to Venusaur!`, 'action');
        }
      } else {
        GameEngine.addLog(next, `Energy Trans: No other Pokémon with Grass Energy attached.`, 'system');
      }
    }

    // 17. Heal (Vileplume - Jungle / Slowbro - Base Set)
    // Both print "Flip a coin. If heads, remove 1 damage counter...", but Slowbro may only take
    // the counter off itself, while Vileplume picks any of your Pokémon that is hurt.
    else if (normPower === 'heal') {
      const flip = (params?.coinResults && params.coinResults.length > 0) ? params.coinResults[0] : (Math.random() >= 0.5);
      if (flip) {
        const pool = pokemon.card.name === 'Slowbro' ? [pokemon] : [player.active, ...player.bench];
        const damaged = pool.find(p => p && p.damage >= 10);
        if (damaged) {
          damaged.damage = Math.max(0, damaged.damage - 10);
          damaged.currentHp = (damaged.card.hp || 50) - damaged.damage;
          GameEngine.addLog(next, `🌸 Heal coin flip: HEADS! Removed 10 damage from ${damaged.card.name}!`, 'action');
        } else {
          GameEngine.addLog(next, `🌸 Heal coin flip: HEADS! But no Pokémon have damage to heal.`, 'action');
        }
      } else {
        GameEngine.addLog(next, `🌸 Heal coin flip: TAILS! Heal failed.`, 'action');
      }
      pokemon.powerUsedThisTurn = true;
    }

    return next;
  }
}
