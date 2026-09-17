import { GameEngine } from '../src/engine/GameEngine';
import { GameState, Card, ActivePokemon } from '../src/types';

// Setup state where Player active has 30 HP
const mockCard: Card = {
  id: 'test-card-1',
  name: 'Weepinbell',
  supertype: 'Pokémon',
  subtypes: ['Stage 1'],
  hp: 70,
  types: ['Grass'],
  attacks: [
    {
      name: 'Poisonpowder',
      cost: ['Grass'],
      convertedEnergyCost: 1,
      damage: 20,
      text: 'The Defending Pokémon is now Poisoned.'
    }
  ]
};

const mockDefendingCard: Card = {
  id: 'test-card-2',
  name: 'Pidgey',
  supertype: 'Pokémon',
  subtypes: ['Basic'],
  hp: 40,
  types: ['Colorless'],
  attacks: []
};

function createTestState(): GameState {
  return {
    player: {
      name: 'Player',
      active: {
        card: mockDefendingCard,
        currentHp: 30, // 30 HP remaining
        damage: 10, // 40 max - 10 damage = 30 currentHp
        energies: [],
        attachedEnergies: [],
        attachedEnergy: [],
        status: null,
        stage: 'Basic'
      } as unknown as ActivePokemon,
      bench: [],
      deck: [],
      hand: [],
      discard: [],
      prizes: [mockCard]
    },
    cpu: {
      name: 'Opponent',
      active: {
        card: mockCard,
        currentHp: 70,
        damage: 0,
        energies: ['Grass'],
        attachedEnergies: ['Grass'],
        attachedEnergy: [],
        status: null,
        stage: 'Stage 1'
      } as unknown as ActivePokemon,
      bench: [],
      deck: [],
      hand: [],
      discard: [],
      prizes: [mockCard]
    },
    turnPlayer: 'cpu',
    turn: 1,
    phase: 'attack',
    winner: null,
    logs: []
  } as unknown as GameState;
}

console.log('--- TEST: CPU uses 20 dmg + Poison attack against 30 HP player ---');
const state = createTestState();

// CPU attacks with attackIndex 0 (Poisonpowder: 20 dmg + Poisoned)
const next = GameEngine.executeAttack(state, 0, [true]);

console.log('Defending Pokémon final HP:', next.player.active?.currentHp);
console.log('Status ticks in next:', next.lastStatusTicks);
console.log('Logs:', next.logs);
console.log('Last attack result:', next.lastAttackResult);

// Check if lethal from poison tick
const tickDamage = (next.lastStatusTicks || []).reduce((sum, t) => sum + (t.amount || 0), 0);
const preTickHp = (next.player.active?.currentHp ?? 0) + tickDamage;

console.log('Pre-tick HP (after attack damage):', preTickHp);
console.log('Tick damage:', tickDamage);

if (preTickHp === 10 && tickDamage === 10 && next.player.active?.currentHp === 0) {
  console.log('SUCCESS: Attack does 20 dmg (leaving 10 HP), then poison tick does 10 dmg (leaving 0 HP).');
  console.log('This confirms our withheldTicks will show HP=10 first, then play poison animation, then drop to HP=0 and trigger knockout!');
} else {
  console.error('FAILED: Unexpected HP or tick calculation', { preTickHp, tickDamage, finalHp: next.player.active?.currentHp });
  process.exit(1);
}
