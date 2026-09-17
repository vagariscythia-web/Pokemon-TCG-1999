import { GameEngine } from '../src/engine/GameEngine';
import { Card, InPlayCard } from '../src/types/game';
import fs from 'fs';

const cards: Card[] = JSON.parse(fs.readFileSync('src/data/cards.json', 'utf-8'));

function findCard(name: string, set?: string): Card {
  const found = cards.find(c => c.name.toLowerCase() === name.toLowerCase() && (!set || c.set?.toLowerCase() === set.toLowerCase()));
  if (!found) throw new Error(`Card not found: ${name} (${set})`);
  return found;
}

function makeInPlay(card: Card, hp?: number): InPlayCard {
  return {
    card,
    damage: 0,
    currentHp: hp !== undefined ? hp : (card.hp || 60),
    attachedEnergy: [],
    status: 'None',
    statusTurns: 0,
    effects: []
  };
}

console.log('=== TEST 1: Hitmonlee - Stretch Kick ===');
const hitmonleeCard = findCard('Hitmonlee', 'Fossil');
const stretchKickAttack = hitmonleeCard.attacks?.find(a => a.name === 'Stretch Kick')!;
console.assert(stretchKickAttack !== undefined, 'Stretch Kick must exist');
console.assert(stretchKickAttack.damage === 20, `Stretch Kick attack in cards.json must have damage: 20, got ${stretchKickAttack.damage}`);

const hitmonleeInPlay = makeInPlay(hitmonleeCard);
const defenderInPlay = makeInPlay(findCard('Squirtle', 'Base Set'), 60);

const stretchKickPreview = GameEngine.calculatePreviewAttackDamage(hitmonleeInPlay, stretchKickAttack, defenderInPlay);
console.log('Stretch Kick preview:', stretchKickPreview);
console.assert(stretchKickPreview.baseDamage === 20, `Expected baseDamage 20, got ${stretchKickPreview.baseDamage}`);
console.assert(stretchKickPreview.totalDamage === 20, `Expected totalDamage 20, got ${stretchKickPreview.totalDamage}`);
console.assert(stretchKickPreview.displayDamage === '20', `Expected displayDamage "20", got "${stretchKickPreview.displayDamage}"`);

console.log('=== TEST 2: Hitmonlee with PlusPower attached ===');
hitmonleeInPlay.plusPowersAttached = 1;
const stretchKickWithPlusPower = GameEngine.calculatePreviewAttackDamage(hitmonleeInPlay, stretchKickAttack, defenderInPlay);
console.log('Stretch Kick with PlusPower:', stretchKickWithPlusPower);
console.assert(stretchKickWithPlusPower.totalDamage === 20, `Stretch Kick must NOT get PlusPower boost because it hits bench only! Got ${stretchKickWithPlusPower.totalDamage}`);
console.assert(stretchKickWithPlusPower.bonusDamage === 0, `bonusDamage must be 0, got ${stretchKickWithPlusPower.bonusDamage}`);

const highJumpKickAttack = hitmonleeCard.attacks?.find(a => a.name === 'High Jump Kick')!;
const highJumpWithPlusPower = GameEngine.calculatePreviewAttackDamage(hitmonleeInPlay, highJumpKickAttack, defenderInPlay);
console.log('High Jump Kick with PlusPower:', highJumpWithPlusPower);
console.assert(highJumpWithPlusPower.bonusDamage === 10, `High Jump Kick MUST get PlusPower boost! Got ${highJumpWithPlusPower.bonusDamage}`);
console.assert(highJumpWithPlusPower.totalDamage === 60, `High Jump Kick totalDamage must be 60! Got ${highJumpWithPlusPower.totalDamage}`);

console.log('=== TEST 3: Raticate - Super Fang ===');
const raticateCard = findCard('Raticate', 'Base Set');
const superFangAttack = raticateCard.attacks?.find(a => a.name === 'Super Fang')!;
const raticateInPlay = makeInPlay(raticateCard);

// Defender with 60 HP -> Super Fang deals 30
const superFangPreview60 = GameEngine.calculatePreviewAttackDamage(raticateInPlay, superFangAttack, defenderInPlay);
console.log('Super Fang against 60 HP defender:', superFangPreview60);
console.assert(superFangPreview60.baseDamage === 30, `Expected 30, got ${superFangPreview60.baseDamage}`);
console.assert(superFangPreview60.displayDamage === '30', `Expected "30", got "${superFangPreview60.displayDamage}"`);

// Defender with 70 HP -> Super Fang deals 40 (half 70 is 35, rounded up to nearest 10 is 40)
const defender70 = makeInPlay(findCard('Hitmonlee', 'Fossil'), 70);
const superFangPreview70 = GameEngine.calculatePreviewAttackDamage(raticateInPlay, superFangAttack, defender70);
console.log('Super Fang against 70 HP defender:', superFangPreview70);
console.assert(superFangPreview70.baseDamage === 40, `Expected 40, got ${superFangPreview70.baseDamage}`);

// Defender is null (e.g. no active defender)
const superFangPreviewNoDef = GameEngine.calculatePreviewAttackDamage(raticateInPlay, superFangAttack, null);
console.log('Super Fang with no defender:', superFangPreviewNoDef);
console.assert(superFangPreviewNoDef.isVariable === true, 'Expected isVariable true');
console.assert(superFangPreviewNoDef.displayDamage === '½ HP', `Expected "½ HP", got "${superFangPreviewNoDef.displayDamage}"`);

console.log('=== TEST 4: Dark Golbat (Flitter), Diglett (Dig Under), Meowth (Coin Hurl) ===');
const darkGolbatCard = findCard('Dark Golbat', 'Team Rocket');
const flitterAttack = darkGolbatCard.attacks?.find(a => a.name === 'Flitter')!;
console.assert(flitterAttack.damage === 20, `Flitter in cards.json must have damage: 20, got ${flitterAttack.damage}`);
const flitterPreview = GameEngine.calculatePreviewAttackDamage(makeInPlay(darkGolbatCard), flitterAttack, defenderInPlay);
console.assert(flitterPreview.displayDamage === '20', `Flitter displayDamage must be "20", got "${flitterPreview.displayDamage}"`);

const diglettCard = findCard('Diglett', 'Team Rocket');
const digUnderAttack = diglettCard.attacks?.find(a => a.name === 'Dig Under')!;
console.assert(digUnderAttack.damage === 10, `Dig Under in cards.json must have damage: 10, got ${digUnderAttack.damage}`);
const digUnderPreview = GameEngine.calculatePreviewAttackDamage(makeInPlay(diglettCard), digUnderAttack, defenderInPlay);
console.assert(digUnderPreview.displayDamage === '10', `Dig Under displayDamage must be "10", got "${digUnderPreview.displayDamage}"`);

const meowthCard = findCard('Meowth', 'Team Rocket');
const coinHurlAttack = meowthCard.attacks?.find(a => a.name === 'Coin Hurl')!;
console.assert(coinHurlAttack.damage === 20, `Coin Hurl in cards.json must have damage: 20, got ${coinHurlAttack.damage}`);
const coinHurlPreview = GameEngine.calculatePreviewAttackDamage(makeInPlay(meowthCard), coinHurlAttack, defenderInPlay);
console.assert(coinHurlPreview.displayDamage === '20', `Coin Hurl displayDamage must be "20", got "${coinHurlPreview.displayDamage}"`);

console.log('=== TEST 5: Pure Effect Moves remain 0 totalDamage ===');
const haunterCard = findCard('Haunter', 'Base Set');
const hypnosisAttack = haunterCard.attacks?.find(a => a.name === 'Hypnosis')!;
const hypnosisPreview = GameEngine.calculatePreviewAttackDamage(makeInPlay(haunterCard), hypnosisAttack, defenderInPlay);
console.assert(hypnosisPreview.totalDamage === 0, `Hypnosis must have totalDamage 0, got ${hypnosisPreview.totalDamage}`);
console.assert(hypnosisPreview.displayDamage === '0', `Hypnosis must have displayDamage "0", got "${hypnosisPreview.displayDamage}"`);

const squirtleCard = findCard('Squirtle', 'Base Set');
const withdrawAttack = squirtleCard.attacks?.find(a => a.name === 'Withdraw')!;
const withdrawPreview = GameEngine.calculatePreviewAttackDamage(makeInPlay(squirtleCard), withdrawAttack, defenderInPlay);
console.assert(withdrawPreview.totalDamage === 0, `Withdraw must have totalDamage 0, got ${withdrawPreview.totalDamage}`);

console.log('ALL PREVIEW TESTS PASSED! 🎉');
