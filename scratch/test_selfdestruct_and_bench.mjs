import { GameEngine } from '../.tmpverify/engine/GameEngine.js';
import fs from 'fs';

// Load cards
const cards = JSON.parse(fs.readFileSync('src/data/cards.json', 'utf-8'));

function getCard(name, set) {
  const c = cards.find(x => x.name.toLowerCase() === name.toLowerCase() && (!set || x.set.toLowerCase() === set.toLowerCase()));
  if (!c) throw new Error(`Card not found: ${name} (${set})`);
  return c;
}

function makeInPlay(card, currentHp = null, energy = []) {
  const hp = currentHp !== null ? currentHp : (card.hp || 50);
  return {
    instanceId: Math.random().toString(36).substring(2, 9),
    card,
    damage: (card.hp || hp) - hp,
    currentHp: hp,
    attachedEnergy: energy,
    status: 'None',
    turnsInPlay: 1,
    evolutionHistory: []
  };
}

function createTestState(attackerCard, defenderCard, attackerBenchCards = [], defenderBenchCards = [], energies = []) {
  const p1 = {
    id: 'player',
    name: 'Player',
    deck: [],
    hand: [],
    discard: [],
    prizes: [cards[0], cards[1]],
    active: makeInPlay(attackerCard, null, energies),
    bench: attackerBenchCards.map(c => makeInPlay(c))
  };

  const p2 = {
    id: 'cpu',
    name: 'CPU',
    deck: [],
    hand: [],
    discard: [],
    prizes: [cards[0], cards[1]],
    active: makeInPlay(defenderCard),
    bench: defenderBenchCards.map(c => makeInPlay(c))
  };

  return {
    turn: 1,
    turnPlayer: 'player',
    phase: 'TURN',
    player: p1,
    cpu: p2,
    logs: [],
    energyAttachedThisTurn: false
  };
}

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    console.log(`✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${msg}`);
    failed++;
  }
}

console.log("=== RUNNING SELFDESTRUCT & RECOIL / BENCH DAMAGE TESTS ===");

// 1. Golem Selfdestruct
{
  const golem = getCard('Golem', 'Fossil');
  const blastoise = getCard('Blastoise', 'Base Set');
  const squirtle = getCard('Squirtle', 'Base Set');
  const bulbasaur = getCard('Bulbasaur', 'Base Set');
  
  const state = createTestState(golem, blastoise, [squirtle], [bulbasaur]);
  const atkIdx = golem.attacks.findIndex(a => a.name.toLowerCase() === 'selfdestruct');
  
  const next = GameEngine.executeAttack(state, atkIdx, []);
  
  assert(next.cpu.active.damage >= 100, `Golem Selfdestruct dealt 100 base damage to defender (damage=${next.cpu.active.damage})`);
  assert(next.player.active.damage === 100, `Golem dealt 100 self-damage to itself (damage=${next.player.active.damage})`);
  assert(next.player.active.currentHp === 0, `Golem HP reduced to 0 (HP=${next.player.active.currentHp})`);
  assert(next.player.bench[0].damage === 20, `Player bench took 20 damage (damage=${next.player.bench[0].damage})`);
  assert(next.cpu.bench[0].damage === 20, `CPU bench took 20 damage (damage=${next.cpu.bench[0].damage})`);
  assert(next.lastAttackResult.benchHits?.length === 2, `benchHits recorded for both benches (length=${next.lastAttackResult.benchHits?.length})`);
  assert(next.lastAttackResult.benchHits?.every(h => h.amount === 20), `benchHits amounts are 20`);
}

// 2. Magneton (Fossil) Selfdestruct
{
  const magneton = getCard('Magneton', 'Fossil');
  const pidgeot = getCard('Pidgeot', 'Jungle');
  const state = createTestState(magneton, pidgeot, [getCard('Pikachu', 'Base Set')], [getCard('Rattata', 'Base Set')]);
  const atkIdx = magneton.attacks.findIndex(a => a.name.toLowerCase() === 'selfdestruct');
  
  const next = GameEngine.executeAttack(state, atkIdx, []);
  assert(next.player.active.damage === 100, `Magneton (Fossil) dealt 100 self-damage to itself (damage=${next.player.active.damage})`);
  assert(next.player.bench[0].damage === 20, `Player bench took 20 damage`);
  assert(next.cpu.bench[0].damage === 20, `CPU bench took 20 damage`);
}

// 3. Magneton (Base Set) Selfdestruct
{
  const magneton = getCard('Magneton', 'Base Set');
  const state = createTestState(magneton, getCard('Pidgeot', 'Jungle'), [getCard('Pikachu', 'Base Set')], [getCard('Rattata', 'Base Set')]);
  const atkIdx = magneton.attacks.findIndex(a => a.name.toLowerCase() === 'selfdestruct');
  
  const next = GameEngine.executeAttack(state, atkIdx, []);
  assert(next.player.active.damage === 80, `Magneton (Base Set) dealt 80 self-damage to itself (damage=${next.player.active.damage})`);
  assert(next.player.bench[0].damage === 20, `Player bench took 20 damage`);
  assert(next.cpu.bench[0].damage === 20, `CPU bench took 20 damage`);
}

// 4. Magnemite Selfdestruct
{
  const magnemite = getCard('Magnemite', 'Base Set');
  const state = createTestState(magnemite, getCard('Pidgeot', 'Jungle'), [getCard('Pikachu', 'Base Set')], [getCard('Rattata', 'Base Set')]);
  const atkIdx = magnemite.attacks.findIndex(a => a.name.toLowerCase() === 'selfdestruct');
  
  const next = GameEngine.executeAttack(state, atkIdx, []);
  assert(next.player.active.damage === 40, `Magnemite dealt 40 self-damage to itself (damage=${next.player.active.damage})`);
  assert(next.player.bench[0].damage === 10, `Player bench took 10 damage`);
  assert(next.cpu.bench[0].damage === 10, `CPU bench took 10 damage`);
}

// 5. Weezing Selfdestruct
{
  const weezing = getCard('Weezing', 'Fossil');
  const state = createTestState(weezing, getCard('Pidgeot', 'Jungle'), [getCard('Pikachu', 'Base Set')], [getCard('Rattata', 'Base Set')]);
  const atkIdx = weezing.attacks.findIndex(a => a.name.toLowerCase() === 'selfdestruct');
  
  const next = GameEngine.executeAttack(state, atkIdx, []);
  assert(next.player.active.damage === 60, `Weezing dealt 60 self-damage to itself (damage=${next.player.active.damage})`);
  assert(next.player.bench[0].damage === 10, `Player bench took 10 damage`);
  assert(next.cpu.bench[0].damage === 10, `CPU bench took 10 damage`);
}

// 6. Dugtrio Earthquake
{
  const dugtrio = getCard('Dugtrio', 'Base Set');
  const state = createTestState(dugtrio, getCard('Pidgeot', 'Jungle'), [getCard('Pikachu', 'Base Set')], [getCard('Rattata', 'Base Set')]);
  const atkIdx = dugtrio.attacks.findIndex(a => a.name.toLowerCase() === 'earthquake');
  
  const next = GameEngine.executeAttack(state, atkIdx, []);
  assert(next.player.bench[0].damage === 10, `Earthquake dealt 10 damage to player's own bench`);
  assert(next.cpu.bench[0].damage === 0, `Earthquake dealt 0 damage to CPU bench`);
  assert(next.lastAttackResult.benchHits?.length === 1, `Earthquake benchHits recorded 1 hit`);
  assert(next.lastAttackResult.benchHits?.[0].side === 'player', `Earthquake hit side is player`);
}

// 7. Rhydon Ram
{
  const rhydon = getCard('Rhydon', 'Jungle');
  const state = createTestState(rhydon, getCard('Pidgeot', 'Jungle'), [], [getCard('Rattata', 'Base Set')]);
  const atkIdx = rhydon.attacks.findIndex(a => a.name.toLowerCase() === 'ram');
  
  const next = GameEngine.executeAttack(state, atkIdx, []);
  assert(next.player.active.damage === 20, `Rhydon Ram dealt 20 self-damage (damage=${next.player.active.damage})`);
  assert(next.cpu.active.card.name === 'Rattata', `Opponent active switched to Rattata (active=${next.cpu.active.card.name})`);
}

// 8. Dark Jolteon Thunder Attack on tails
{
  const jolteon = getCard('Dark Jolteon', 'Team Rocket');
  const state = createTestState(jolteon, getCard('Pidgeot', 'Jungle'));
  const atkIdx = jolteon.attacks.findIndex(a => a.name.toLowerCase() === 'thunder attack');
  
  // Coin flip tails (false)
  const next = GameEngine.executeAttack(state, atkIdx, [false]);
  assert(next.player.active.damage === 10, `Dark Jolteon dealt exactly 10 self-damage on tails (damage=${next.player.active.damage})`);
}

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
