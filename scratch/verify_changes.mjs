import { GameEngine } from '../.tmpverify/engine/GameEngine.js';
import { readFileSync } from 'fs';

const cardsData = JSON.parse(readFileSync(new URL('../src/data/cards.json', import.meta.url), 'utf8'));

console.log('--- Testing Thunderpunch Heads & Tails in GameEngine ---');

// Find Electabuzz
const electabuzzCard = cardsData.find(c => c.name === 'Electabuzz' && c.attacks?.some(a => a.name === 'Thunderpunch'));
const machopCard = cardsData.find(c => c.name === 'Machop');

if (!electabuzzCard || !machopCard) {
  console.error('Could not find Electabuzz or Machop in cards data');
  process.exit(1);
}

const tpIndex = electabuzzCard.attacks.findIndex(a => a.name === 'Thunderpunch');

// Initial state
const baseState = {
  player: {
    id: 'player',
    name: 'Player',
    active: {
      card: electabuzzCard,
      currentHp: 70,
      damage: 0,
      attachedEnergy: [
        { id: 'e1', name: 'Lightning Energy', types: ['Lightning'], supertype: 'Energy' },
        { id: 'e2', name: 'Lightning Energy', types: ['Lightning'], supertype: 'Energy' }
      ]
    },
    bench: [],
    hand: [],
    deck: [],
    discard: [],
    prizes: [1, 2, 3, 4]
  },
  cpu: {
    id: 'cpu',
    name: 'Opponent',
    active: {
      card: machopCard,
      currentHp: 50,
      damage: 0,
      attachedEnergy: []
    },
    bench: [],
    hand: [],
    deck: [],
    discard: [],
    prizes: [1, 2, 3, 4]
  },
  logs: [],
  turnPlayer: 'player',
  turn: 1
};

// 1. Test Thunderpunch with HEADS (coinResult = [true])
console.log('\n[1] Testing Thunderpunch HEADS:');
const headsState = GameEngine.executeAttack(baseState, tpIndex, [true]);
const headsRes = headsState.lastAttackResult;
console.log('Damage dealt:', headsRes.damage, '(Expected: 40)');
console.log('fxIntensity:', headsRes.fxIntensity, '(Expected: 1.3)');
console.log('selfDamage:', headsRes.selfDamage, '(Expected: undefined)');
console.log('Electabuzz HP:', headsState.player.active.currentHp, '(Expected: 70)');

if (headsRes.damage !== 40 || headsRes.fxIntensity !== 1.3 || headsRes.selfDamage !== undefined || headsState.player.active.currentHp !== 70) {
  console.error('FAIL on Thunderpunch HEADS');
  process.exit(1);
}
console.log('PASS Thunderpunch HEADS');

// 2. Test Thunderpunch with TAILS (coinResult = [false])
console.log('\n[2] Testing Thunderpunch TAILS:');
const tailsState = GameEngine.executeAttack(baseState, tpIndex, [false]);
const tailsRes = tailsState.lastAttackResult;
console.log('Damage dealt:', tailsRes.damage, '(Expected: 30)');
console.log('selfDamage:', tailsRes.selfDamage, '(Expected: 10)');
console.log('Electabuzz HP:', tailsState.player.active.currentHp, '(Expected: 60)');
console.log('Electabuzz damage counters:', tailsState.player.active.damage, '(Expected: 10)');

if (tailsRes.damage !== 30 || tailsRes.selfDamage !== 10 || tailsState.player.active.currentHp !== 60 || tailsState.player.active.damage !== 10) {
  console.error('FAIL on Thunderpunch TAILS');
  process.exit(1);
}
console.log('PASS Thunderpunch TAILS');

// 3. Test Pikachu Thunder Jolt with TAILS
console.log('\n[3] Testing Pikachu Thunder Jolt TAILS:');
const pikachuCard = cardsData.find(c => c.name === 'Pikachu' && c.attacks?.some(a => a.name === 'Thunder Jolt'));
if (pikachuCard) {
  const tjIdx = pikachuCard.attacks.findIndex(a => a.name === 'Thunder Jolt');
  const tjBase = JSON.parse(JSON.stringify(baseState));
  tjBase.player.active.card = pikachuCard;
  tjBase.player.active.currentHp = 40;
  tjBase.player.active.damage = 0;
  const tjState = GameEngine.executeAttack(tjBase, tjIdx, [false]);
  console.log('Thunder Jolt selfDamage:', tjState.lastAttackResult.selfDamage, '(Expected: 10)');
  console.log('Pikachu HP:', tjState.player.active.currentHp, '(Expected: 30)');
  if (tjState.lastAttackResult.selfDamage !== 10 || tjState.player.active.currentHp !== 30) {
    console.error('FAIL on Thunder Jolt');
    process.exit(1);
  }
  console.log('PASS Thunder Jolt TAILS');
}

// 4. Test Chansey Double-Edge
console.log('\n[4] Testing Chansey Double-edge:');
const chanseyCard = cardsData.find(c => c.name === 'Chansey' && c.attacks?.some(a => a.name === 'Double-edge'));
if (chanseyCard) {
  const deIdx = chanseyCard.attacks.findIndex(a => a.name === 'Double-edge');
  const deBase = JSON.parse(JSON.stringify(baseState));
  deBase.player.active.card = chanseyCard;
  deBase.player.active.currentHp = 120;
  deBase.player.active.damage = 0;
  const deState = GameEngine.executeAttack(deBase, deIdx);
  console.log('Double-edge selfDamage:', deState.lastAttackResult.selfDamage, '(Expected: 80)');
  console.log('Chansey HP:', deState.player.active.currentHp, '(Expected: 40)');
  if (deState.lastAttackResult.selfDamage !== 80 || deState.player.active.currentHp !== 40) {
    console.error('FAIL on Double-edge');
    process.exit(1);
  }
  console.log('PASS Double-edge');
}

// 5. Test Machoke Submission
console.log('\n[5] Testing Machoke Submission:');
const machokeCard = cardsData.find(c => c.name === 'Machoke' && c.attacks?.some(a => a.name === 'Submission'));
if (machokeCard) {
  const subIdx = machokeCard.attacks.findIndex(a => a.name === 'Submission');
  const subBase = JSON.parse(JSON.stringify(baseState));
  subBase.player.active.card = machokeCard;
  subBase.player.active.currentHp = 80;
  subBase.player.active.damage = 0;
  const subState = GameEngine.executeAttack(subBase, subIdx);
  console.log('Submission selfDamage:', subState.lastAttackResult.selfDamage, '(Expected: 20)');
  console.log('Machoke HP:', subState.player.active.currentHp, '(Expected: 60)');
  if (subState.lastAttackResult.selfDamage !== 20 || subState.player.active.currentHp !== 60) {
    console.error('FAIL on Submission');
    process.exit(1);
  }
  console.log('PASS Submission');
}

console.log('\nALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
