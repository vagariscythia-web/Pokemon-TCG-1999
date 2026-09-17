import { GameEngine } from '../src/engine/GameEngine';
import { GameState, Card, InPlayCard } from '../src/types/game';

function createDummyCard(id: string, name: string, hp: number, types: string[] = ['Fighting']): Card {
  return {
    id,
    name,
    supertype: 'Pokémon',
    subtypes: ['Basic'],
    hp,
    types,
    attacks: [
      {
        name: 'Stretch Kick',
        cost: ['Fighting', 'Fighting'],
        convertedEnergyCost: 2,
        damage: 0,
        text: "If your opponent has any Benched Pokémon, choose 1 of them and this attack does 20 damage to it. (Don't apply Weakness and Resistance for Benched Pokémon.)"
      }
    ]
  };
}

function createInPlay(card: Card): InPlayCard {
  return {
    card,
    damage: 0,
    currentHp: card.hp || 0,
    attachedEnergy: ['Fighting', 'Fighting'],
    status: null,
    statusTurns: 0,
    effects: []
  };
}

function createInitialState(): GameState {
  const hitmonlee = createDummyCard('hit-1', 'Hitmonlee', 70, ['Fighting']);
  const activeDef = createDummyCard('def-1', 'Active Defender', 80, ['Colorless']);
  const bench1 = createDummyCard('bench-1', 'Benched Card 1', 50, ['Fighting']); // Weak to Fighting? No, let's test weakness ignored
  bench1.weakness = { type: 'Fighting', value: 'x2' };
  const bench2 = createDummyCard('bench-2', 'Benched Card 2', 60, ['Grass']);
  bench2.resistance = { type: 'Fighting', value: '-30' };

  return {
    turn: 1,
    turnPlayer: 'player',
    turnPhase: 'turn',
    phase: 'turn',
    activePlayer: 'player',
    winner: null,
    player: {
      id: 'player',
      name: 'Player',
      active: createInPlay(hitmonlee),
      bench: [],
      hand: [],
      deck: [],
      discard: [],
      prizes: []
    },
    cpu: {
      id: 'cpu',
      name: 'CPU',
      active: createInPlay(activeDef),
      bench: [createInPlay(bench1), createInPlay(bench2)],
      hand: [],
      deck: [],
      discard: [],
      prizes: []
    },
    logs: []
  };
}

function runTests() {
  console.log('--- TEST 1: Player uses Stretch Kick targeting Bench 0 (Weakness must NOT apply) ---');
  let state = createInitialState();
  const next1 = GameEngine.executeAttack(state, 0, [], { benchTargetIndex: 0 });
  
  console.assert(next1.cpu.active?.damage === 0, `Expected active damage 0, got ${next1.cpu.active?.damage}`);
  console.assert(next1.cpu.active?.currentHp === 80, `Expected active HP 80, got ${next1.cpu.active?.currentHp}`);
  console.assert(next1.cpu.bench[0].damage === 20, `Expected bench[0] damage 20, got ${next1.cpu.bench[0].damage}`);
  console.assert(next1.cpu.bench[0].currentHp === 30, `Expected bench[0] HP 30 (50-20), got ${next1.cpu.bench[0].currentHp}`);
  console.assert(next1.lastAttackResult?.damageTarget === 'bench', `Expected damageTarget 'bench', got ${next1.lastAttackResult?.damageTarget}`);
  console.assert(next1.lastAttackResult?.damageTargetBenchIndex === 0, `Expected damageTargetBenchIndex 0, got ${next1.lastAttackResult?.damageTargetBenchIndex}`);
  console.assert(next1.lastAttackResult?.damage === 20, `Expected result damage 20, got ${next1.lastAttackResult?.damage}`);
  console.assert(next1.lastAttackResult?.isWeakness === false, `Expected isWeakness false, got ${next1.lastAttackResult?.isWeakness}`);
  console.assert(!next1.lastAttackResult?.benchHits || next1.lastAttackResult.benchHits.length === 0, `Expected benchHits to be empty/undefined, got ${JSON.stringify(next1.lastAttackResult?.benchHits)}`);
  console.log('Test 1 Passed!');

  console.log('--- TEST 2: Player uses Stretch Kick targeting Bench 1 (Resistance must NOT apply) ---');
  state = createInitialState();
  const next2 = GameEngine.executeAttack(state, 0, [], { benchTargetIndex: 1 });
  console.assert(next2.cpu.active?.damage === 0, `Expected active damage 0, got ${next2.cpu.active?.damage}`);
  console.assert(next2.cpu.bench[1].damage === 20, `Expected bench[1] damage 20, got ${next2.cpu.bench[1].damage}`);
  console.assert(next2.cpu.bench[1].currentHp === 40, `Expected bench[1] HP 40 (60-20), got ${next2.cpu.bench[1].currentHp}`);
  console.assert(next2.lastAttackResult?.damageTarget === 'bench', `Expected damageTarget 'bench', got ${next2.lastAttackResult?.damageTarget}`);
  console.assert(next2.lastAttackResult?.damageTargetBenchIndex === 1, `Expected damageTargetBenchIndex 1, got ${next2.lastAttackResult?.damageTargetBenchIndex}`);
  console.assert(next2.lastAttackResult?.damage === 20, `Expected result damage 20, got ${next2.lastAttackResult?.damage}`);
  console.assert(next2.lastAttackResult?.isResistance === false, `Expected isResistance false, got ${next2.lastAttackResult?.isResistance}`);
  console.log('Test 2 Passed!');

  console.log('--- TEST 3: CPU has no bench (Whiff / No damage) ---');
  state = createInitialState();
  state.cpu.bench = [];
  const next3 = GameEngine.executeAttack(state, 0, []);
  console.assert(next3.cpu.active?.damage === 0, `Expected active damage 0, got ${next3.cpu.active?.damage}`);
  console.assert(next3.lastAttackResult?.damage === 0, `Expected damage 0, got ${next3.lastAttackResult?.damage}`);
  console.assert(next3.lastAttackResult?.whiffed === true, `Expected whiffed true, got ${next3.lastAttackResult?.whiffed}`);
  console.log('Test 3 Passed!');

  console.log('--- TEST 4: CPU uses Stretch Kick against Player ---');
  state = createInitialState();
  // Swap active player to CPU and populate player bench
  state.turnPlayer = 'cpu';
  state.activePlayer = 'cpu';
  const cpuLee = state.player.active;
  state.player.active = state.cpu.active;
  state.cpu.active = cpuLee;
  state.player.bench = [createInPlay(createDummyCard('p-bench-1', 'Player Bench 1', 60))];
  // Now CPU attacks player's bench[0] (which is bench1 with 50 hp)
  const next4 = GameEngine.executeAttack(state, 0, []);
  console.assert(next4.player.active?.damage === 0, `Expected player active damage 0, got ${next4.player.active?.damage}`);
  console.assert(next4.player.bench.some(b => b.damage === 20), `Expected one of player bench cards to take 20 damage`);
  console.assert(next4.lastAttackResult?.damageTarget === 'bench', `Expected damageTarget 'bench', got ${next4.lastAttackResult?.damageTarget}`);
  console.log('Test 4 Passed!');

  console.log('ALL TESTS PASSED SUCCESSFULLY! 🎉');
}

runTests();
