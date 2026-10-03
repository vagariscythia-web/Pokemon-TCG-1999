import fs from 'fs';
import { getSpecificAttackFX } from './getSpecificAttackFX.mjs';

const cards = JSON.parse(fs.readFileSync('src/data/cards.json', 'utf8'));
const bfxContent = fs.readFileSync('src/components/BattleFXOverlay.tsx', 'utf8');

// Parse STOCK_IMAGE_FX_TYPES
const stockSetMatch = bfxContent.match(/const STOCK_IMAGE_FX_TYPES = new Set<string>\(\[([\s\S]*?)\]\);/);
const stockTypes = new Set(
  stockSetMatch[1]
    .split(',')
    .map(s => s.trim().replace(/['"]/g, ''))
    .filter(Boolean)
);

// Map of all attacks
const pokemonCards = cards.filter(c => c.supertype === 'Pokemon');

const results = [];
const fxTypeCounts = {};

for (const card of pokemonCards) {
  for (const atk of card.attacks || []) {
    const fxType = getSpecificAttackFX(atk, card);
    fxTypeCounts[fxType] = (fxTypeCounts[fxType] || 0) + 1;
    results.push({
      pokemon: card.name,
      set: card.set,
      type: (card.types && card.types[0]) || 'Colorless',
      attack: atk.name,
      damage: atk.damage,
      text: atk.text || '',
      fxType: fxType,
      isStock: stockTypes.has(fxType)
    });
  }
}

console.log(`Audited ${results.length} total attack instances across ${pokemonCards.length} Pokemon cards.`);
console.log(`Total distinct FX types dispatched: ${Object.keys(fxTypeCounts).length}`);

// Group by FX type
const byFxType = {};
for (const r of results) {
  if (!byFxType[r.fxType]) {
    byFxType[r.fxType] = {
      fxType: r.fxType,
      isStock: r.isStock,
      attacks: []
    };
  }
  byFxType[r.fxType].attacks.push(`${r.pokemon} (${r.attack})`);
}

// Let's categorize:
// 1. Generic fallbacks: tackle, punch, kick_strike, kick_low, kick_smash, physical_charge, flamethrower_blaze, water_gun_stream, thunder_wave, poisonpowder_shower, psyshock_waves, wing_slash, defensive_harden, recover_heal, pay_day_coins, selfdestruct_shockwave, whirlwind_cyclone, toxic_corrosion, etc.
const genericFxTypes = [
  'tackle', 'physical_charge', 'punch', 'kick_strike', 'kick_low', 'kick_smash',
  'flamethrower_blaze', 'water_gun_stream', 'thunder_wave', 'poisonpowder_shower',
  'psyshock_waves', 'wing_slash', 'defensive_harden', 'recover_heal', 'pay_day_coins',
  'selfdestruct_shockwave', 'whirlwind_cyclone', 'toxic_corrosion', 'poison_sting',
  'sing_lullaby', 'bite', 'claw_pinch', 'palm_strike', 'drain_life', 'meditate_zen',
  'psychic_distortion', 'slash', 'bubblebeam', 'razor_leaf', 'smokescreen_cloud',
  'gust', 'supersonic_waves', 'sonic_boom', 'horn_gore', 'horn_thrust',
  'rock_barrage', 'ember_spark', 'mud_slap_throw'
];

const genericStats = [];
const customSvgStats = [];
const stockStats = [];

for (const [fxType, data] of Object.entries(byFxType)) {
  if (data.isStock) {
    stockStats.push(data);
  } else if (genericFxTypes.includes(fxType)) {
    genericStats.push(data);
  } else {
    customSvgStats.push(data);
  }
}

console.log('\n--- SUMMARY STATS ---');
console.log(`Stock Image FX Types: ${stockStats.length} (covering ${stockStats.reduce((acc, s) => acc + s.attacks.length, 0)} attacks)`);
console.log(`Custom Signature SVG/Canvas FX Types: ${customSvgStats.length} (covering ${customSvgStats.reduce((acc, s) => acc + s.attacks.length, 0)} attacks)`);
console.log(`Generic / Fallback FX Types: ${genericStats.length} (covering ${genericStats.reduce((acc, s) => acc + s.attacks.length, 0)} attacks)`);

fs.writeFileSync('scratch/audit_results.json', JSON.stringify({
  stockStats,
  customSvgStats,
  genericStats,
  byFxType
}, null, 2));

console.log('Saved detailed results to scratch/audit_results.json');
