import { GameEngine } from '../src/engine/GameEngine';
import { GameState, Card, InPlayCard } from '../src/types/game';

function createMockCard(name: string, supertype: 'Pokemon' | 'Energy' | 'Trainer', subtype?: string): Card {
  return {
    id: `mock-${name}-${Math.random()}`,
    name,
    supertype,
    subtype,
    set: 'Base Set',
    number: '1',
    image: '',
    types: ['Colorless'],
    hp: 60,
  };
}

function createMockInPlay(card: Card, attachedEnergy: Card[] = [], evolutionHistory: Card[] = []): InPlayCard {
  return {
    card,
    damage: 0,
    attachedEnergy,
    status: 'Normal',
    evolutionHistory,
    instanceId: `inst-${Math.random()}`
  };
}

function createBaseState(): GameState {
  const pActive = createMockInPlay(createMockCard('Rattata', 'Pokemon'));
  const oppActive = createMockInPlay(createMockCard('Pikachu', 'Pokemon'));
  return {
    turn: 1,
    turnPlayer: 'player',
    winner: null,
    phase: 'main',
    step: 'idle',
    selectedCard: null,
    selectedHandIndex: null,
    player: {
      name: 'Red',
      active: pActive,
      bench: [],
      hand: [],
      deck: [],
      discard: [],
      prizes: [createMockCard('Prize1', 'Energy'), createMockCard('Prize2', 'Energy')]
    },
    cpu: {
      name: 'Blue',
      active: oppActive,
      bench: [],
      hand: [],
      deck: [],
      discard: [],
      prizes: [createMockCard('OppPrize1', 'Energy')]
    },
    logs: []
  };
}

console.log('=== TEST 1: Pokédex ===');
{
  const state = createBaseState();
  const c1 = createMockCard('Card 1', 'Pokemon');
  const c2 = createMockCard('Card 2', 'Energy');
  const c3 = createMockCard('Card 3', 'Trainer');
  const c4 = createMockCard('Card 4', 'Pokemon');
  const c5 = createMockCard('Card 5', 'Energy');
  const c6 = createMockCard('Card 6', 'Pokemon');
  state.player.deck = [c1, c2, c3, c4, c5, c6];
  
  const pokedexCard = createMockCard('Pokédex', 'Trainer');
  state.player.hand = [pokedexCard];
  
  // Player rearranges top 5: c5, c4, c3, c2, c1
  const rearranged = [c5, c4, c3, c2, c1];
  const next = GameEngine.playTrainer(state, 'player', 0, { rearrangedDeckTop: rearranged });
  
  const passed = next.player.deck[0].name === 'Card 5' &&
                 next.player.deck[1].name === 'Card 4' &&
                 next.player.deck[4].name === 'Card 1' &&
                 next.player.deck[5].name === 'Card 6';
  console.log('Pokédex rearrangement result:', passed ? 'PASS' : 'FAIL');
}

console.log('=== TEST 2: Here Comes Team Rocket! ===');
{
  const state = createBaseState();
  const rocketCard = createMockCard('Here Comes Team Rocket!', 'Trainer');
  state.player.hand = [rocketCard];
  
  const next = GameEngine.playTrainer(state, 'player', 0);
  console.log('prizesFaceUp set:', next.prizesFaceUp === true ? 'PASS' : 'FAIL');
}

console.log('=== TEST 3: Goop Gas Attack ===');
{
  const state = createBaseState();
  const goopCard = createMockCard('Goop Gas Attack', 'Trainer');
  state.player.hand = [goopCard];
  
  const next = GameEngine.playTrainer(state, 'player', 0);
  const isBlocked = next.pokemonPowersBlockedUntilTurn === 3;
  const powerDisabled = GameEngine.isPowerDisabled(next.player.active, next.turn, next);
  console.log('Goop Gas blocked until turn 3:', isBlocked ? 'PASS' : 'FAIL');
  console.log('isPowerDisabled respects Goop Gas:', powerDisabled ? 'PASS' : 'FAIL');
}

console.log('=== TEST 4: Rocket\'s Sneak Attack ===');
{
  const state = createBaseState();
  const rsa = createMockCard("Rocket's Sneak Attack", 'Trainer');
  state.player.hand = [rsa];
  
  const oppT1 = createMockCard('Bill', 'Trainer');
  const oppP1 = createMockCard('Charmander', 'Pokemon');
  state.cpu.hand = [oppP1, oppT1]; // index 1 is Trainer Bill
  
  const next = GameEngine.playTrainer(state, 'player', 0, { chosenOppTrainerIndex: 1 });
  const trainerRemoved = next.cpu.hand.length === 1 && next.cpu.hand[0].name === 'Charmander';
  const trainerInDeck = next.cpu.deck.some(c => c.name === 'Bill');
  console.log('Opponent trainer removed from hand:', trainerRemoved ? 'PASS' : 'FAIL');
  console.log('Opponent trainer shuffled into deck:', trainerInDeck ? 'PASS' : 'FAIL');
}

console.log('=== TEST 5: Nightly Garbage Run ===');
{
  const state = createBaseState();
  const ngr = createMockCard('Nightly Garbage Run', 'Trainer');
  state.player.hand = [ngr];
  
  const d1 = createMockCard('Squirtle', 'Pokemon');
  const d2 = createMockCard('Water Energy', 'Energy', 'Basic');
  const d3 = createMockCard('Professor Oak', 'Trainer');
  const d4 = createMockCard('Poliwag', 'Pokemon');
  state.player.discard = [d1, d2, d3, d4];
  
  // Pick indices 0 (Squirtle), 1 (Water Energy), 3 (Poliwag)
  const next = GameEngine.playTrainer(state, 'player', 0, { chosenDiscardIndices: [0, 1, 3] });
  const remainingInDiscard = next.player.discard.map(c => c.name);
  const recycledInDeck = next.player.deck.map(c => c.name);
  
  console.log('Discard only has Oak and NGR:', remainingInDiscard.includes('Professor Oak') && remainingInDiscard.includes('Nightly Garbage Run') ? 'PASS' : 'FAIL');
  console.log('Deck received 3 chosen cards:', recycledInDeck.length === 3 && recycledInDeck.includes('Squirtle') && recycledInDeck.includes('Water Energy') && recycledInDeck.includes('Poliwag') ? 'PASS' : 'FAIL');
}

console.log('=== TEST 6: Imposter Oak\'s Revenge ===');
{
  const state = createBaseState();
  const ior = createMockCard("Imposter Oak's Revenge", 'Trainer');
  const fodder = createMockCard('Extra Energy', 'Energy');
  state.player.hand = [ior, fodder]; // player will discard index 1
  
  state.cpu.hand = [createMockCard('C1', 'Pokemon'), createMockCard('C2', 'Pokemon'), createMockCard('C3', 'Pokemon'), createMockCard('C4', 'Pokemon'), createMockCard('C5', 'Pokemon')];
  state.cpu.deck = [createMockCard('D1', 'Pokemon'), createMockCard('D2', 'Pokemon'), createMockCard('D3', 'Pokemon'), createMockCard('D4', 'Pokemon'), createMockCard('D5', 'Pokemon')];
  
  const next = GameEngine.playTrainer(state, 'player', 0, { chosenDiscardHandIndex: 1 });
  console.log('Fodder discarded:', next.player.discard.some(c => c.name === 'Extra Energy') ? 'PASS' : 'FAIL');
  console.log('Opponent hand count is 4:', next.cpu.hand.length === 4 ? 'PASS' : 'FAIL');
}

console.log('=== TEST 7: Devolution Spray ===');
{
  const state = createBaseState();
  const spray = createMockCard('Devolution Spray', 'Trainer');
  state.player.hand = [spray];
  
  const basicCard = createMockCard('Charmander', 'Pokemon');
  const stage1Card = createMockCard('Charmeleon', 'Pokemon', 'Stage 1');
  state.player.active = createMockInPlay(stage1Card, [], [basicCard]);
  
  const next = GameEngine.playTrainer(state, 'player', 0, { targetPokemon: state.player.active });
  console.log('Active devolved to Charmander:', next.player.active?.card.name === 'Charmander' ? 'PASS' : 'FAIL');
  console.log('Charmeleon sent to discard:', next.player.discard.some(c => c.name === 'Charmeleon') ? 'PASS' : 'FAIL');
}

console.log('=== TEST 8: Scoop Up ===');
{
  const state = createBaseState();
  const scoop = createMockCard('Scoop Up', 'Trainer');
  state.player.hand = [scoop];
  
  const basicCard = createMockCard('Pikachu', 'Pokemon');
  const energy1 = createMockCard('Lightning Energy', 'Energy');
  state.player.active = createMockInPlay(basicCard, [energy1]);
  
  const next = GameEngine.playTrainer(state, 'player', 0, { targetPokemon: state.player.active });
  console.log('Active scooped up (became null):', next.player.active === null ? 'PASS' : 'FAIL');
  console.log('Pikachu returned to hand:', next.player.hand.some(c => c.name === 'Pikachu') ? 'PASS' : 'FAIL');
  console.log('Lightning Energy discarded:', next.player.discard.some(c => c.name === 'Lightning Energy') ? 'PASS' : 'FAIL');
}
