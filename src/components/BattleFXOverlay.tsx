import React, { useEffect, useState } from 'react';
import { Card, Attack } from '../types/game';
import { Language } from '../i18n/translations';

export interface ActiveFX {
  id: string;
  type: 
    | 'sleeping_gas'
    | 'psyshock_waves'
    | 'doubleslap'
    | 'bite'
    | 'bite_jaw'
    | 'poison_sting'
    | 'poison_gas'
    | 'foul_gas'
    | 'stun_gas'
    | 'foul_odor'
    | 'stun_spore'
    | 'sing_lullaby'
    | 'sludge_bomb'
    | 'smog_haze'
    | 'destiny_bond_curse'
    | 'nightmare_spook'
    | 'lick_tongue'
    | 'meditate_zen'
    | 'psychic_distortion'
    | 'slash'
    | 'punch'
    | 'thunder_wave'
    | 'thunder_punch'
    | 'flamethrower_blaze'
    | 'water_gun_stream'
    | 'ice_beam_frost'
    | 'star_freeze'
    | 'blizzard_storm'
    | 'psybeam_kaleidoscope'
    | 'solar_beam_charge_blast'
    | 'drill_peck_spiral'
    | 'pin_missile_volley'
    | 'bubblebeam'
    | 'leech_seed_vines'
    | 'vine_whip_lash'
    | 'string_shot_cocoon'
    | 'whirlwind_cyclone'
    | 'smokescreen_cloud'
    | 'seismic_slam'
    | 'guillotine_snap'
    | 'crab_hammer_slam'
    | 'pay_day_coins'
    | 'selfdestruct_shockwave'
    | 'poisonpowder_shower'
    | 'sleep_powder_drift'
    | 'potion'
    | 'super_potion'
    | 'gust'
    | 'energy_removal'
    | 'pluspower'
    | 'defender'
    | 'barrier'
    | 'tackle'
    | 'physical_charge'
    | 'defensive_harden'
    | 'recover_heal'
    | 'rock_barrage'
    | 'stone_barrage_single'
    | 'big_boulder'
    | 'wing_slash'
    | 'swords_dance_buff'
    | 'supersonic_waves'
    | 'nasty_goo'
    | 'sonic_boom'
    | 'hyper_beam_laser'
    | 'horn_gore'
    | 'horn_thrust'
    | 'kick_strike'
    | 'kick_low'
    | 'kick_smash'
    | 'claw_pinch'
    | 'palm_strike'
    | 'drain_life'
    | 'dragon_rage'
    | 'scyther_blade_dance'
    | 'nidoran_horn_charge'
    | 'sand_attack_throw'
    | 'sand_attack_dust'
    | 'poison_tick'
    | 'confusion_self_hit'
    | 'confuse_ray_spiral'
    | 'cobra_stare'
    | 'poison_vapor'
    | 'poison_vapor_bench'
    | 'tail_wag'
    | 'agility_dash'
    | 'glare_leer'
    | 'dizziness_swirl'
    | 'stomp_hoof'
    | 'fire_take_down'
    | 'ember_spark'
    | 'flamethrower_stream'
    | 'flare_burst'
    | 'flame_tail_whip'
    | 'fire_blast_star'
    | 'fire_spin_vortex'
    | 'fire_punch_blaze'
    | 'flame_pillar'
    | 'wildfire_scorch'
    | 'fireball_barrage'
    | 'playing_with_fire'
    | 'starfish_slap'
    | 'quick_attack_dash'
    | 'mud_slap_throw'
    | 'fish_flail'
    | 'cloyster_clamp'
    | 'cloyster_spike_cannon'
    | 'waterfall_surf'
    | 'avalanche_cascade'
    | 'hitmonchan_jab'
    | 'hitmonchan_special_punch';
  target: 'player' | 'cpu';
  /**
   * Which slot of `target` this beat belongs to. Attacks that name their own victim (Stare) or
   * sweep the whole Bench (Poison Vapor) have to animate on the card they actually touched, so
   * the overlay can no longer assume "the opponent's Active Pokémon".
   */
  slot?: 'active' | 'bench';
  /** Index into the side's bench when slot is 'bench'. */
  benchIndex?: number;
  damageText?: string;
  isWeakness?: boolean;
  isResistance?: boolean;
  isBlocked?: boolean;
  pokemonName?: string;
  isSelfTarget?: boolean;
  /**
   * Hold the animation this many ms before it starts. Used by the confusion self-hit beat so
   * the attempted move still plays on the opponent's card, but visibly after the attacker's own
   * impact - the two never overlap and stay easy to tell apart.
   */
  delayMs?: number;
  /** Shake the card this FX sits on. Lets one beat shake only the struck Pokémon. */
  shake?: boolean;
  /**
   * Name of the Pokémon Power this attack just shut down (Dark Arbok's Stare). Shown under the
   * damage number: the shutdown lasts a full opposing turn, so the player has to be told it
   * happened rather than find out two turns later when a power does nothing.
   */
  powerDisabledName?: string;
  /**
   * The move was attempted but never connected (a confused attacker rolled TAILS). The animation
   * still plays on the intended target, but without the impact flash, shockwave or particles -
   * otherwise it would read as the opponent taking the hit.
   */
  whiffed?: boolean;
  /**
   * Move-specific visual intensity multiplier, set only by energy-dependent attacks:
   *   Enhancers  (Water Gun, Hydro Pump, Hydrocannon): 1.0 + max(0, damage − 10) × 0.01
   *   Multipliers (Continuous Fireball, Big Eggsplosion): 1.0 + heads × 0.10
   * Undefined for all other moves → FX renders at its static baseline.
   */
  intensity?: number;
  /**
   * Play the mirrored variant of the animation (right-to-left instead of left-to-right).
   * Multi-hit coin-flip attacks alternate normal / mirrored beats so consecutive strikes
   * read as left-hand, right-hand, left-hand… instead of one static repeat.
   */
  mirrored?: boolean;
  /**
   * Swords Dance boosted this Slash: render the normal and mirrored slash simultaneously
   * so both scythe-arms strike at once, forming an X across the target.
   */
  swordsDanceBoosted?: boolean;
  /**
   * Seed that picks which landing spot a sequential projectile (Stone Barrage single rock)
   * aims at, so consecutive rocks scatter across the card instead of hitting one point.
   */
  variantSeed?: number;
}

/**
 * Build an Archimedean spiral as an SVG path string. Confuse Ray's swirl is generated instead of
 * hand-typed so the pitch, turn count and radius can be tuned from one place.
 */
const spiralArm = (turns: number, rStart: number, rEnd: number, phase: number, steps = 140): string => {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const theta = phase + t * turns * Math.PI * 2;
    const r = rStart + (rEnd - rStart) * t;
    d += `${i ? 'L' : 'M'}${(50 + r * Math.cos(theta)).toFixed(1)} ${(50 + r * Math.sin(theta)).toFixed(1)}`;
  }
  return d;
};

/** Two arms 180 degrees apart read as the classic GBA double-swirl confusion graphic. */
const CONFUSE_RAY_ARM_A = spiralArm(2.75, 3, 45, 0);
const CONFUSE_RAY_ARM_B = spiralArm(2.75, 3, 45, Math.PI);
// Looser pitch and a quarter-turn offset so the inner swirl is not a plain scaled copy of the outer.
const CONFUSE_RAY_INNER_A = spiralArm(1.75, 5, 43, Math.PI * 0.25);
const CONFUSE_RAY_INNER_B = spiralArm(1.75, 5, 43, Math.PI * 1.25);

export function getSpecificAttackFX(attack: Attack, pokemonCard: Card): ActiveFX['type'] {
  const name = attack.name.toLowerCase().trim();
  const pkm = pokemonCard.name.toLowerCase();

  // 0. POKÉMON-SPECIFIC OVERRIDES (anatomy-aware GBA-style variants)
  // Bite: Ekans/Arbok get jaw-teeth variant; others keep star-fang
  if ((name === 'bite' || name.includes('bite') || name.includes('fang') || name === 'super fang' || name === 'hyper fang')) {
    if (pkm.includes('ekans') || pkm.includes('arbok')) return 'bite_jaw';
    return 'bite';
  }
  // Vine Whip: Ivysaur gets lash variant; others keep generic vine
  if (name.includes('vine whip')) {
    if (pkm.includes('ivysaur') || pkm.includes('venusaur')) return 'vine_whip_lash';
    return 'leech_seed_vines';
  }
  // Smokescreen: dedicated smoke cloud instead of whirlwind
  if (name.includes('smokescreen')) return 'smokescreen_cloud';
  // Thunderpunch: Electabuzz gets fist+lightning variant
  if (name.includes('thunderpunch') || name.includes('thunder punch')) return 'thunder_punch';
  // Blizzard vs Freeze-Dry distinction
  if (name.includes('blizzard')) return 'blizzard_storm';
  // Crabhammer: Kingler gets claw-hammer variant
  if (name.includes('crabhammer') || name.includes('crab hammer')) return 'crab_hammer_slam';
  // Horn Attack: Goldeen gets single-horn thrust
  if (name.includes('horn attack')) {
    if (pkm.includes('goldeen') || pkm.includes('seaking')) return 'horn_thrust';
    if (pkm.includes('nidoran')) return 'nidoran_horn_charge';
    return 'horn_gore';
  }
  // Stare: Dark Arbok rears up and opens its hood over the chosen Pokémon
  if (name.includes('stare')) {
    if (pkm.includes('arbok')) return 'cobra_stare';
    return 'glare_leer';
  }
  // Low Kick: Machop gets specific variant
  if (name.includes('low kick')) {
    if (pkm.includes('machop') || pkm.includes('machoke') || pkm.includes('machamp')) return 'kick_low';
    return 'kick_strike';
  }
  // Smash Kick: Ponyta gets hoof variant
  if (name.includes('smash kick')) {
    if (pkm.includes('ponyta') || pkm.includes('rapidash')) return 'kick_smash';
    return 'kick_strike';
  }
  // Irongrip: Krabby gets claw pinch
  if (name.includes('irongrip') || name.includes('iron grip')) {
    if (pkm.includes('krabby') || pkm.includes('kingler')) return 'claw_pinch';
    return 'punch';
  }
  // Pound: Drowzee gets palm strike instead of boxing glove
  if (name.includes('pound')) {
    if (pkm.includes('drowzee') || pkm.includes('hypno')) return 'palm_strike';
    return 'punch';
  }
  // Jab / Special Punch: Hitmonchan gets red boxing-glove variants
  if (name.includes('jab')) {
    if (pkm.includes('hitmonchan')) return 'hitmonchan_jab';
    return 'punch';
  }
  if (name.includes('special punch')) {
    if (pkm.includes('hitmonchan')) return 'hitmonchan_special_punch';
    return 'punch';
  }
  // Stone Barrage / Rock Throw — per-Pokémon variants:
  //  Geodude's Stone Barrage is an until-tails multi-coin move: each heads throws ONE small
  //  rock at a varying spot; the UI plays sequential single-rock beats.
  //  Graveler's Rock Throw (40 dmg) is a flat-damage Stage 1 move: one BIG boulder at full intensity.
  //  Onix's Rock Throw (10 dmg) shares the same big_boulder animation but scaled to 0.4 intensity.
  //  Everything else (Avalanche, Bonemerang…) keeps the classic three-rock volley.
  if (name.includes('stone barrage')) return 'stone_barrage_single';
  if (name.includes('rock throw')) {
    if (pkm.includes('graveler') || pkm.includes('onix')) return 'big_boulder';
    return 'rock_barrage';
  }
  // Stomp: a hoof/foot slamming down, never a boxing glove
  if (name.includes('stomp')) return 'stomp_hoof';
  // Tail Wag: Eevee wags its tail - a sway, not crossed swords
  if (name.includes('tail wag')) return 'tail_wag';
  // Agility: a blinding speed dash, never a sword dance
  if (name.includes('agility')) return 'agility_dash';
  // Leer: an intimidating glare, not a weapon buff
  if (name.includes('leer')) return 'glare_leer';
  // Dizziness: dizzy sparkles around the user, not a sword dance
  if (name.includes('dizziness')) return 'dizziness_swirl';

  // 1. EXACT HIGH-PRIORITY GBA SIGNATURE MATCHES
  if (name === 'sleeping gas' || name.includes('sleeping gas')) return 'sleeping_gas';
  if (name === 'psyshock' || name.includes('psyshock') || name === 'mind shock' || name.includes('mind shock') || name === 'psypunch') return 'psyshock_waves';
  if (name.includes('doubleslap') || name.includes('double slap')) return 'doubleslap';
  // Poison Vapor (Dark Arbok) is a field-wide venom mist, not a stinger: it has to read as the
  // whole opposing Bench being swallowed, which is exactly what its text does. Sharing the
  // Poison Sting animation made the bench damage invisible.
  if (name.includes('poison vapor')) return 'poison_vapor';
  if (name.includes('poison sting') || name.includes('poison fang') || name.includes('spit poison')) return 'poison_sting';
  if (name === 'poison gas' || name.includes('poison gas')) return 'poison_gas';
  if (name === 'foul gas' || name.includes('foul gas')) return 'foul_gas';
  if (name === 'stun gas' || name.includes('stun gas')) return 'stun_gas';
  if (name === 'foul odor' || name.includes('foul odor')) return 'foul_odor';
  if (name === 'stun spore' || name.includes('stun spore')) return 'stun_spore';
  if (name === 'lullaby' || name.includes('lullaby') || name === 'sing' || name.includes('sing')) return 'sing_lullaby';
  if (name.includes('sludge')) return 'sludge_bomb';
  if (name.includes('smog')) return 'smog_haze';
  if (name.includes('destiny bond')) return 'destiny_bond_curse';
  if (name.includes('nightmare') || name.includes('dark mind')) return 'nightmare_spook';
  if (name.includes('lick')) return 'lick_tongue';
  if (name.includes('meditate')) return 'meditate_zen';

  // 2. Spores, Powders & Showers
  if (name.includes('poison powder') || name.includes('poisonpowder') || name.includes('toxic powder') || name.includes('venom powder')) return 'poisonpowder_shower';
  if (name.includes('sleep powder') || name.includes('sleeppowder') || name.includes('lullaby powder') || name.includes('spore') || name.includes('afternoon nap')) return 'sleep_powder_drift';

  // 3. Electric & Shocks
  if (name.includes('thunder wave') || name.includes('thunderwave') || name.includes('thundershock') || name.includes('thunder') || name.includes('spark') || name.includes('shock') || name.includes('bolt') || name.includes('gigashock')) return 'thunder_wave';

  // 4. Fire Streams & Blazes — diversified per-move
  if (name.includes('fire blast')) return 'fire_blast_star';
  if (name.includes('fire spin')) return 'fire_spin_vortex';
  if (name.includes('fire punch')) return 'fire_punch_blaze';
  if (name.includes('flame pillar')) return 'flame_pillar';
  if (name.includes('wildfire')) return 'wildfire_scorch';
  if (name.includes('continuous fireball') || name.includes('fireball')) return 'fireball_barrage';
  if (name.includes('playing with fire')) return 'playing_with_fire';
  if (name.includes('ember')) return 'ember_spark';
  if (name.includes('flame tail') || name.includes('fire tail')) return 'flame_tail_whip';
  if (name.includes('flamethrower')) return 'flamethrower_stream';
  if (name.includes('fire') || name.includes('flame') || name.includes('burn')) return 'flamethrower_blaze';

  // 5. Water & Ice
  if (name.includes('waterfall')) return 'waterfall_surf';
  if (name.includes('hydro pump') || name.includes('water gun') || name.includes('surf') || name.includes('tsunami') || name.includes('hydro') || name.includes('aqua')) return 'water_gun_stream';
  if (name.includes('bubble') || name.includes('bubblebeam')) return 'bubblebeam';
  if (name.includes('star freeze') || name.includes('freeze star')) return 'star_freeze';
  if (name.includes('ice beam') || name.includes('blizzard') || name.includes('freeze') || name.includes('frost') || name.includes('aurora beam')) return 'ice_beam_frost';

  // 6. Psychic & Mind
  if (name.includes('psybeam') || name.includes('kaleidoscope')) return 'psybeam_kaleidoscope';
  // Confuse Ray gets its own beat: a confusion swirl that SPINS in place. The expanding concentric
  // rings of psychic_distortion read as a psychic wave hitting the target, not as something that
  // scrambles its head.
  if (name.includes('confuse ray') || name.includes('confusion ray') || name.includes('eerie light')) return 'confuse_ray_spiral';
  if (name.includes('psychic') || name.includes('super psy') || name.includes('hypnosis') || name.includes('dream eater') || name.includes('night shade')) return 'psychic_distortion';

  // 7. Grass & Nature
  if (name.includes('solar beam') || name.includes('solarbeam')) return 'solar_beam_charge_blast';
  if (name.includes('leech seed') || name.includes('vine whip') || name.includes('razor leaf') || name.includes('petal') || name.includes('absorb') || name.includes('giga drain')) return 'leech_seed_vines';
  if (name.includes('string shot') || name.includes('web') || name.includes('wrap') || name.includes('constrict') || name.includes('bind')) return 'string_shot_cocoon';

  // 8. Martial Arts, Slashing, Punching
  if (name.includes('slash') || name.includes('fury swipes') || name.includes('scratch') || name.includes('cut') || name.includes('claw') || name.includes('sharp sickle') || name.includes('gnaw') || name.includes('nail flick')) return 'slash';
  if (name.includes('punch') || name.includes('karate chop') || name.includes('cross chop') || name.includes('comet punch') || name.includes('mega punch') || name.includes('pound') || name.includes('jab') || name.includes('irongrip')) return 'punch';
  if (name.includes('kick') || name.includes('submission') || name.includes('smash kick') || name.includes('stretch kick') || name.includes('high jump kick') || name.includes('low kick') || name.includes('rear kick') || name.includes('double kick')) return 'kick_strike';
  if (name.includes('seismic toss') || name.includes('slam') || name.includes('body slam') || name.includes('rock slide') || name.includes('fissure') || name.includes('earthquake') || name.includes('dig') || name.includes('pot smash')) return 'seismic_slam';
  // Clamp: Cloyster gets anatomical shell-clamp; others keep guillotine blade
  if (name.includes('clamp')) {
    if (pkm.includes('cloyster')) return 'cloyster_clamp';
    return 'guillotine_snap';
  }
  if (name.includes('guillotine') || name.includes('crabhammer') || name.includes('vice grip') || name.includes('vise grip')) return 'guillotine_snap';

  // 9. Projectiles & Flight
  if (name.includes('drill peck') || name.includes('peck') || name.includes('drill run') || name.includes('horn drill')) return 'drill_peck_spiral';
  // Spike Cannon: Cloyster fires anatomical shell spikes; others keep generic pin volley
  if (name.includes('spike cannon')) {
    if (pkm.includes('cloyster')) return 'cloyster_spike_cannon';
    return 'pin_missile_volley';
  }
  if (name.includes('pin missile') || name.includes('twineedle')) return 'pin_missile_volley';
  if (name.includes('sand attack') || name.includes('sand-attack')) {
    if (pkm.includes('eevee')) return 'sand_attack_dust';
    return 'sand_attack_throw';
  }
  if (name.includes('whirlwind') || name.includes('gust') || name.includes('tornado') || name.includes('cyclone') || name.includes('whirlpool') || name.includes('hurricane')) return 'whirlwind_cyclone';
  if (name.includes('wing attack') || name.includes('dive bomb')) return 'wing_slash';
  if (name.includes('pay day') || name.includes('scavenge') || name.includes('coin hurl') || name.includes('fetch')) return 'pay_day_coins';
  if (name.includes('selfdestruct') || name.includes('explosion') || name.includes('mass explosion') || name.includes('big eggsplosion')) return 'selfdestruct_shockwave';
  if (name.includes('hyper beam') || name.includes('energy bomb') || name.includes('speed ball') || name.includes('sonicboom')) return 'hyper_beam_laser';
  if (name.includes('horn attack') || name.includes('horn hazard')) return 'horn_gore';

  // 10. Dragon, Charge & Physical
  if (name.includes('dragon rage')) return 'dragon_rage';

  // 10a. Specific physical attacks with unique, thematic animations
  if (name.includes('mud slap')) return 'mud_slap_throw';
  if (name === 'quick attack') return 'quick_attack_dash';
  if ((name.includes('take down') || name.includes('double-edge')) && (pokemonCard.types?.[0] === 'Fire')) return 'fire_take_down';
  if ((name.includes('flail') || name.includes('flop')) && (pokemonCard.types?.[0] === 'Water')) return 'fish_flail';
  if (name === 'slap' && (pkm.includes('staryu') || pkm.includes('starmie'))) return 'starfish_slap';

  // 10b. Generic physical charge (remaining body-slam style moves)
  if (name.includes('headbutt') || name.includes('ram') || name.includes('take down') || name.includes('double-edge') || name.includes('quick attack') || name.includes('flail') || name.includes('thrash') || name.includes('pounce') || name.includes('knock back') || name.includes('knock down') || name.includes('fury attack') || name.includes('tail slap') || name.includes('tail strike') || name.includes('giant tail') || name.includes('rolling tackle') || name.includes('rocket tackle') || name.includes('flop') || name.includes('leek slap') || name.includes('slap') || name.includes('frenzied attack')) return 'physical_charge';

  // 11. Defensive, Healing & Buff
  if (name.includes('harden') || name.includes('withdraw') || name.includes('minimize') || name.includes('stiffen') || name.includes('scrunch') || name.includes('hide in shell') || name.includes('shell attack') || name.includes('mirror shell') || name === 'barrier') return 'defensive_harden';
  if (name.includes('recover') || name.includes('spacing out') || name.includes('rapid evolution')) return 'recover_heal';
  if (name.includes('swords dance')) {
    if (pkm.includes('scyther')) return 'scyther_blade_dance';
    return 'swords_dance_buff';
  }
  if (name.includes('supersonic')) return 'supersonic_waves';
  if (name.includes('avalanche')) return 'avalanche_cascade';
  if (name.includes('bonemerang')) return 'rock_barrage';
  if (name.includes('leech life') || name.includes('mega drain')) return 'drain_life';

  // 12. Additional poison / misc mappings
  if (name.includes('acid') || name.includes('poison claws') || name.includes('toxic') || name.includes('jellyfish sting')) return 'poison_sting';
  if (name.includes('nasty goo') || name.includes('sticky hands')) return 'nasty_goo';
  if (name.includes('flitter') || name.includes('vanish') || name.includes('mischief')) return 'whirlwind_cyclone';
  if (name.includes('magnetic lines') || name.includes('magnetism') || name.includes('lightning flash') || name.includes('chain lightning') || name.includes('electric shock') || name.includes('thunder jolt') || name.includes('thunder attack') || name.includes('surprise thunder') || name.includes('thunderbolt')) return 'thunder_wave';
  if (name.includes('flare')) return 'flare_burst';
  if (name.includes('wildfire')) return 'wildfire_scorch';
  if (name.includes('continuous fireball') || name.includes('fireball')) return 'fireball_barrage';
  if (name.includes('playing with fire')) return 'playing_with_fire';
  if (name.includes('do the wave') || name.includes('hydrocannon')) return 'water_gun_stream';
  if (name.includes('metronome') || name.includes('mirror move') || name.includes('teleport') || name.includes('amnesia') || name.includes('headache') || name.includes('transform attack') || name.includes('conversion')) return 'psychic_distortion';
  if (name.includes('third eye') || name.includes('prophecy')) return 'meditate_zen';
  if (name.includes('fascinate') || name.includes('boyfriends') || name.includes('lure') || name.includes('snivel') || name.includes('call for family') || name.includes('call for friend')) return 'sing_lullaby';
  if (name.includes('tongue wrap')) return 'lick_tongue';

  // 13. Fallbacks by Energy Type
  const primaryType = pokemonCard.types?.[0] || 'Colorless';
  if (primaryType === 'Fire') return 'flamethrower_blaze';
  if (primaryType === 'Water') return 'water_gun_stream';
  if (primaryType === 'Lightning') return 'thunder_wave';
  if (primaryType === 'Grass') return 'poisonpowder_shower';
  if (primaryType === 'Fighting') return 'punch';
  if (primaryType === 'Psychic') return 'psyshock_waves';
  return 'tackle';
}

/**
 * Returns true if the move is purely self-targeting (defensive, buff, heal, or passive draw/search)
 * and does NOT directly affect or restrict the opponent.
 * Exception: moves like Leer/Tail Wag that prevent the opponent from attacking are NOT self-targeting.
 * Exception: Destiny Bond restricts the opponent's KO outcome, so it is NOT self-targeting.
 */
export function isSelfTargetingMove(attackName: string): boolean {
  const name = attackName.toLowerCase().trim();
  // Defensive / protective (Harden, Withdraw, Minimize, Stiffen, Barrier, etc.)
  if (name.includes('harden') || name.includes('withdraw') || name.includes('minimize') || name.includes('stiffen') || name.includes('scrunch') || name.includes('hide in shell') || name.includes('shell attack') || name.includes('mirror shell') || name === 'barrier') return true;
  // Healing (Recover, Spacing Out, Rapid Evolution)
  if (name.includes('recover') || name.includes('spacing out') || name.includes('rapid evolution')) return true;
  // Self-buffs (Swords Dance, Agility) — NOT Leer/Tail Wag which debuff opponent
  if (name.includes('swords dance') || name.includes('agility')) return true;
  // Passive draw / search (Fetch, Dizziness, Call for Family/Friend, Sprout, Third Eye)
  if (name === 'fetch' || name === 'dizziness') return true;
  if (name.includes('call for family') || name.includes('call for friend') || name.includes('sprout') || name.includes('friendship song')) return true;
  if (name.includes('third eye')) return true;
  if (name.includes('teleport')) return true;
  return false;
}

interface SingleFXProps {
  fx: ActiveFX;
  onComplete: () => void;
  lang?: Language;
}

export const SingleFX: React.FC<SingleFXProps> = ({ fx, onComplete, lang = 'tr' }) => {
  const delayMs = fx.delayMs ?? 0;
  const [started, setStarted] = useState(delayMs === 0);
  // Poliwhirl's artwork shows round white boxing-glove hands, so its Doubleslap FX tints the
  // slap hands white instead of the default skin-tone palette every other user gets.
  const isPoliwhirl = !!fx.pokemonName && fx.pokemonName.toLowerCase().includes('poliwhirl');

  // Delayed FX (the confusion self-hit beat) stay mounted but render nothing until their
  // cue, so the beat they follow is never cut short by the list being replaced.
  useEffect(() => {
    if (delayMs === 0) return;
    const cue = setTimeout(() => setStarted(true), delayMs);
    return () => clearTimeout(cue);
  }, [delayMs]);

  useEffect(() => {
    // poison_tick animations run ~1.4s; give them enough time before removing
    const base = fx.type === 'poison_tick' ? 1600 : 1300;
    const timer = setTimeout(() => {
      onComplete();
    }, base + delayMs);
    return () => clearTimeout(timer);
  }, [onComplete, fx.type, delayMs]);

  if (!started) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-50 overflow-visible"
      style={{
        // Multi-hit coin-flip attacks alternate normal / mirrored beats so consecutive
        // strikes read as left-hand, right-hand, left-hand… For types with a hand-tuned
        // mirrored variant (slash) the flag is handled inside the render block; everything
        // else gets a cheap horizontal flip which reverses any directional motion.
        transform: fx.mirrored && fx.type !== 'slash' ? 'scaleX(-1)' : undefined
      }}
    >
      {/* Cinematic Impact Flash (skipped for poison_tick and for moves that never connected) */}
      {fx.type !== 'poison_tick' && !fx.whiffed && (
        <>
          <div className="absolute inset-0 rounded-xl animate-impact-flash pointer-events-none z-[51]" />
          {/* Shockwave Ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[51]">
            <div className="w-24 h-24 rounded-full border-4 border-white/60 animate-fx-shockwave" />
          </div>
          {/* Particle Burst - 8 directional glowing dots */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[51]">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="absolute" style={{ transform: `rotate(${i * 45}deg)` }}>
                <div
                  className="w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_8px_#fde047] animate-particle-burst"
                  style={{ animationDelay: `${0.35 + i * 0.05}s` }}
                />
              </div>
            ))}
          </div>
        </>
      )}
      {/* 1. GASTLY SLEEPING GAS */}
      {fx.type === 'sleeping_gas' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaSleepingGasSwirl 1.2s ease-out forwards' }}
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-950/95 via-purple-900/85 to-indigo-600/80 blur-sm flex items-center justify-center shadow-[0_0_30px_#818cf8]">
              <span className="text-4xl animate-spin" style={{ animationDuration: '6s' }}>🌀</span>
            </div>
          </div>
          <div
            className="absolute flex items-center justify-center -top-3 right-2"
            style={{ animation: 'gbaSleepZzzFloat 1.15s ease-out 0.1s forwards' }}
          >
            <div className="flex items-center gap-1.5 bg-indigo-950/90 border-2 border-indigo-400 px-2.5 py-1 rounded-full shadow-2xl">
              <span className="text-lg select-none">🌙</span>
              <span className="text-base font-black text-indigo-300 tracking-widest font-mono">Zzz</span>
            </div>
          </div>

        </div>
      )}

      {/* 2. EKANS / ARBOK BITE (GBA white star-fang impact) */}
      {fx.type === 'bite' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="absolute flex gap-3 items-center justify-center"
            style={{ animation: 'gbaBiteSnapTop 1.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
          >
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[22px] border-t-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[28px] border-t-slate-100 drop-shadow-[0_0_12px_rgba(255,255,255,1)]" />
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[22px] border-t-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
          </div>
          <div
            className="absolute flex gap-3 items-center justify-center"
            style={{ animation: 'gbaBiteSnapBottom 1.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
          >
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[22px] border-b-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[28px] border-b-slate-100 drop-shadow-[0_0_12px_rgba(255,255,255,1)]" />
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[22px] border-b-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
          </div>
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaBiteStarFang 1.15s ease-out forwards' }}
          >
            <span className="text-4xl text-yellow-200 select-none drop-shadow-[0_0_15px_#fef08a]">✦</span>
            <span className="absolute text-2xl text-white select-none drop-shadow-[0_0_10px_#ffffff]" style={{ animationDelay: '0.1s' }}>✧</span>
          </div>
        </div>
      )}

      {/* 2b. EKANS/ARBOK BITE JAW (GBA-style upper/lower teeth snapping shut) */}
      {fx.type === 'bite_jaw' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Upper jaw - 3 fangs pointing down */}
          <div
            className="absolute flex gap-1.5 items-end"
            style={{ animation: 'gbaJawSnapTop 1.2s cubic-bezier(0.15, 0.95, 0.3, 1) forwards' }}
          >
            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[20px] border-t-white drop-shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
            <div className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[30px] border-t-slate-50 drop-shadow-[0_0_10px_rgba(255,255,255,1)]" />
            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[20px] border-t-white drop-shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
          </div>
          {/* Lower jaw - 3 fangs pointing up */}
          <div
            className="absolute flex gap-1.5 items-start"
            style={{ animation: 'gbaJawSnapBottom 1.2s cubic-bezier(0.15, 0.95, 0.3, 1) forwards' }}
          >
            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[18px] border-b-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
            <div className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[26px] border-b-slate-100 drop-shadow-[0_0_10px_rgba(255,255,255,1)]" />
            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[18px] border-b-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
          </div>
          {/* Jaw outline arc */}
          <div
            className="absolute w-28 h-14 border-t-4 border-b-4 border-purple-300/70 rounded-[50%] opacity-0"
            style={{ animation: 'gbaJawOutline 1.2s ease-out forwards' }}
          />
          {/* Impact spark on snap */}
          <div className="absolute flex items-center justify-center" style={{ animation: 'gbaBiteStarFang 1.2s ease-out 0.4s forwards', opacity: 0 }}>
            <span className="text-3xl text-yellow-100 select-none drop-shadow-[0_0_12px_#fef9c3]">✦</span>
          </div>
        </div>
      )}

      {/* 3. ABRA PSYSHOCK */}
      {fx.type === 'psyshock_waves' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="absolute w-36 h-36 rounded-full border-4 border-amber-400/90 flex items-center justify-center shadow-[0_0_25px_#f59e0b]"
            style={{ animation: 'gbaPsyshockRing1 1.15s ease-out forwards' }}
          >
            <div className="w-full h-full rounded-full border-2 border-dashed border-yellow-200/60" />
          </div>
          <div
            className="absolute w-28 h-28 rounded-full border-4 border-fuchsia-500/95 flex items-center justify-center shadow-[0_0_28px_#d946ef]"
            style={{ animation: 'gbaPsyshockRing2 1.15s ease-out forwards' }}
          >
            <span className="text-3xl text-fuchsia-300 animate-spin" style={{ animationDuration: '1.5s' }}>🌀</span>
          </div>
          <div
            className="absolute w-20 h-20 rounded-full border-4 border-purple-400/90 bg-purple-950/70 backdrop-blur-sm flex items-center justify-center shadow-[0_0_35px_#a855f7]"
            style={{ animation: 'gbaPsyshockRing3 1.15s ease-out forwards' }}
          >
            <span className="text-2xl text-yellow-300 font-black animate-ping">⚡</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-purple-600/25 to-fuchsia-500/20 rounded-3xl animate-pulse" />
        </div>
      )}

      {/* 4. DOUBLESLAP — per-Pokémon hand colour: Poliwhirl slaps with its white gloves,
            every other Doubleslap user (Jynx, Clefairy…) keeps the skin-tone palette. */}
      {fx.type === 'doubleslap' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          {/* Left slap hand (open palm). Drawn as an SVG glove so Poliwhirl can render white
              hands matching its artwork while other users keep the skin-tone palette. */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaDoubleSlapLeft 1.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
          >
            <div className="relative">
              <svg width="40" height="44" viewBox="0 0 40 44" className="overflow-visible">
                {/* Glove cuff */}
                <rect x="10" y="34" width="20" height="8" rx="3"
                  fill={isPoliwhirl ? '#e2e8f0' : '#fbbf24'}
                  stroke={isPoliwhirl ? '#94a3b8' : '#d97706'} strokeWidth="1.5" />
                {/* Open palm */}
                <path d="M20 2 C 12 2 6 8 6 16 L 6 30 C 6 36 12 40 20 40 C 28 40 34 36 34 30 L 34 16 C 34 8 28 2 20 2 Z"
                  fill={isPoliwhirl ? '#ffffff' : '#fcd34d'}
                  stroke={isPoliwhirl ? '#cbd5e1' : '#d97706'} strokeWidth="1.5" />
                {/* Finger separations */}
                <path d="M12 2 L 12 12 M20 1 L 20 11 M28 2 L 28 12"
                  stroke={isPoliwhirl ? '#cbd5e1' : '#d97706'} strokeWidth="1" fill="none" />
              </svg>
              {!fx.whiffed && (
                <div className="absolute -top-1 -right-1 text-2xl text-yellow-300 animate-ping">💥</div>
              )}
            </div>
          </div>
          {/* Right slap hand (back of hand) — same tint rule */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaDoubleSlapRight 1.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
          >
            <div className="relative">
              <svg width="40" height="44" viewBox="0 0 40 44" className="overflow-visible" style={{ transform: 'scaleX(-1)' }}>
                <rect x="10" y="34" width="20" height="8" rx="3"
                  fill={isPoliwhirl ? '#e2e8f0' : '#f87171'}
                  stroke={isPoliwhirl ? '#94a3b8' : '#dc2626'} strokeWidth="1.5" />
                <path d="M20 2 C 12 2 6 8 6 16 L 6 30 C 6 36 12 40 20 40 C 28 40 34 36 34 30 L 34 16 C 34 8 28 2 20 2 Z"
                  fill={isPoliwhirl ? '#f8fafc' : '#fca5a5'}
                  stroke={isPoliwhirl ? '#cbd5e1' : '#dc2626'} strokeWidth="1.5" />
                <path d="M12 2 L 12 12 M20 1 L 20 11 M28 2 L 28 12"
                  stroke={isPoliwhirl ? '#cbd5e1' : '#dc2626'} strokeWidth="1" fill="none" />
              </svg>
              {!fx.whiffed && (
                <div className="absolute -top-1 -left-1 text-2xl text-rose-400 animate-ping">✨</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. DRATINI WRAP / STRING SHOT COCOON */}
      {fx.type === 'string_shot_cocoon' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="relative flex items-center justify-center"
            style={{ animation: 'gbaSilkWrapSpiral 1.2s ease-out forwards' }}
          >
            <div className="w-32 h-32 rounded-full border-4 border-dashed border-white/90 shadow-[0_0_25px_#ffffff] flex items-center justify-center">
              <span className="text-4xl filter drop-shadow-[0_0_15px_#e2e8f0]">🕸️</span>
            </div>
            <div className="absolute w-24 h-24 rounded-full border-2 border-slate-200 animate-spin" style={{ animationDuration: '1.2s' }} />
          </div>
        </div>
      )}

      {/* 6. TACKLE / NORMAL SLAM (GBA-style white impact flash with expanding rings) */}
      {fx.type === 'tackle' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* White flash core */}
          <div className="absolute" style={{ animation: 'gbaTackleFlash 1.15s ease-out forwards' }}>
            <div className="w-20 h-20 rounded-full bg-white/80 blur-sm shadow-[0_0_30px_#ffffff]" />
          </div>
          {/* Expanding impact ring 1 */}
          <div className="absolute" style={{ animation: 'gbaTackleRing 1.15s ease-out 0.1s forwards', opacity: 0 }}>
            <div className="w-24 h-24 rounded-full border-3 border-white/70" />
          </div>
          {/* Expanding impact ring 2 */}
          <div className="absolute" style={{ animation: 'gbaTackleRing 1.15s ease-out 0.25s forwards', opacity: 0 }}>
            <div className="w-16 h-16 rounded-full border-2 border-yellow-200/60" />
          </div>
          {/* Star burst particles */}
          <div className="absolute" style={{ animation: 'gbaTackleStars 1.15s ease-out 0.2s forwards', opacity: 0 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
              <polygon points="30,5 33,22 50,22 36,32 40,48 30,38 20,48 24,32 10,22 27,22" fill="#fef9c3" stroke="#fde047" strokeWidth="1" opacity="0.9" />
            </svg>
          </div>
          {/* Motion trail from left */}
          <div className="absolute -left-8" style={{ animation: 'gbaTackleTrail 1.15s ease-out forwards', opacity: 0 }}>
            <svg width="35" height="20" viewBox="0 0 35 20">
              <line x1="0" y1="5" x2="25" y2="5" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <line x1="3" y1="10" x2="32" y2="10" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <line x1="0" y1="15" x2="22" y2="15" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 7. POISON STING (Weedle/Ekans - venomous needle stinger, GBA-style) */}
      {fx.type === 'poison_sting' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Venomous needle thrust */}
          <div
            className="absolute"
            style={{ animation: 'gbaStingerStrike 1.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
          >
            <svg width="70" height="90" viewBox="0 0 70 90">
              {/* Needle shaft - tapered stinger */}
              <path d="M35 4 L42 30 L40 62 L35 84 L30 62 L28 30 Z" fill="url(#stingerGrad)" stroke="#6b21a8" strokeWidth="1.5" strokeLinejoin="round" />
              {/* Segment ridges on stinger */}
              <line x1="30" y1="26" x2="40" y2="26" stroke="#7e22ce" strokeWidth="1.5" opacity="0.8" />
              <line x1="30.5" y1="38" x2="39.5" y2="38" stroke="#7e22ce" strokeWidth="1.5" opacity="0.7" />
              <line x1="31.5" y1="50" x2="38.5" y2="50" stroke="#7e22ce" strokeWidth="1.5" opacity="0.6" />
              {/* Highlight edge */}
              <path d="M33 8 L36 30 L35 60" fill="none" stroke="#e9d5ff" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
              {/* Venom droplet at tip */}
              <circle cx="35" cy="86" r="3.5" fill="#a855f7" opacity="0.95" />
              <circle cx="35" cy="86" r="6" fill="none" stroke="#c084fc" strokeWidth="1" opacity="0.6" />
              <defs>
                <linearGradient id="stingerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d8b4fe" />
                  <stop offset="45%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7e22ce" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Venom drips trailing behind */}
          <div className="absolute -top-4" style={{ animation: 'gbaVenomDripFall 1.15s ease-out 0.25s forwards', opacity: 0 }}>
            <svg width="20" height="26" viewBox="0 0 20 26">
              <path d="M10 2 Q13 8, 13 13 A5 5 0 1 1 7 13 Q7 8, 10 2 Z" fill="#a855f7" opacity="0.85" />
            </svg>
          </div>
          <div className="absolute top-2 left-6" style={{ animation: 'gbaVenomDripFall 1.15s ease-out 0.4s forwards', opacity: 0 }}>
            <svg width="14" height="20" viewBox="0 0 14 20">
              <path d="M7 1 Q9 6, 9 9 A3.5 3.5 0 1 1 5 9 Q5 6, 7 1 Z" fill="#c084fc" opacity="0.7" />
            </svg>
          </div>
          {/* Poison splash on impact */}
          <div className="absolute bottom-2" style={{ animation: 'gbaVenomSplash 1.15s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="50" height="24" viewBox="0 0 50 24">
              <path d="M25 20 Q18 12, 10 16" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
              <path d="M25 20 Q32 10, 40 14" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
              <circle cx="8" cy="12" r="2" fill="#a855f7" />
              <circle cx="42" cy="10" r="2" fill="#c084fc" />
              <circle cx="25" cy="6" r="2.5" fill="#e9d5ff" />
            </svg>
          </div>
        </div>
      )}

      {/* 7b. POISON VAPOR (Dark Arbok) - a venom mist that rolls off the Active card and keeps
           going across the Bench. Three cloud bands travel at different speeds over the card so
           the mass reads as drifting gas instead of one flat decal, and the bench beat below
           carries the same cloud onto every benched Pokémon the attack damaged. */}
      {fx.type === 'poison_vapor' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* The hiss escaping before the cloud: a thin jet angled up from the attacker's side */}
          <div className="absolute left-[-6px] bottom-1" style={{ animation: 'gbaVaporJet 1.25s ease-out forwards', opacity: 0 }}>
            <svg width="70" height="46" viewBox="0 0 70 46" className="overflow-visible">
              <path d="M2 44 C 18 38, 34 26, 62 8" fill="none" stroke="#bbf7d0" strokeWidth="7" strokeLinecap="round" opacity="0.5" />
              <path d="M4 44 C 20 38, 36 26, 62 10" fill="none" stroke="#86efac" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            </svg>
          </div>

          {/* Sickly haze that sits over the whole card while the gas rolls through */}
          <div
            className="absolute inset-[-10px] rounded-2xl backdrop-blur-[1.5px]"
            style={{
              animation: 'gbaVaporHaze 1.25s ease-in-out forwards',
              opacity: 0,
              background: 'radial-gradient(ellipse at 30% 62%, rgba(132,204,22,0.30) 0%, rgba(21,128,61,0.22) 45%, rgba(88,28,135,0.20) 75%, rgba(0,0,0,0) 100%)'
            }}
          />

          {/* Cloud band 1 - the widest, slowest layer, drifting left to right */}
          <div className="absolute" style={{ animation: 'gbaVaporRollA 1.25s cubic-bezier(0.22, 0.8, 0.3, 1) forwards', opacity: 0 }}>
            <svg width="190" height="80" viewBox="0 0 190 80" className="overflow-visible">
              <defs>
                <linearGradient id="vaporGradA" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#14532d" stopOpacity="0.15" />
                  <stop offset="35%" stopColor="#4d7c0f" stopOpacity="0.85" />
                  <stop offset="65%" stopColor="#7e22ce" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#3b0764" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="vaporGradB" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a3e635" stopOpacity="0.1" />
                  <stop offset="45%" stopColor="#a3e635" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
                </linearGradient>
              </defs>
              <path
                d="M6 58 C 6 34, 30 22, 52 30 C 60 10, 92 8, 104 26 C 126 16, 152 28, 152 46 C 176 44, 186 60, 176 70 C 150 82, 40 82, 6 70 Z"
                fill="url(#vaporGradA)"
              />
            </svg>
          </div>

          {/* Cloud band 2 - brighter, smaller, runs the other way on top of band 1 */}
          <div className="absolute" style={{ animation: 'gbaVaporRollB 1.25s cubic-bezier(0.22, 0.8, 0.3, 1) 0.08s forwards', opacity: 0 }}>
            <svg width="150" height="60" viewBox="0 0 150 60" className="overflow-visible">
              <path
                d="M8 44 C 4 26, 26 16, 44 24 C 54 8, 84 8, 92 24 C 114 18, 134 30, 128 44 C 108 56, 30 56, 8 44 Z"
                fill="url(#vaporGradB)"
              />
            </svg>
          </div>

          {/* Cloud band 3 - the pale top edge that lags behind and thins out last */}
          <div className="absolute" style={{ animation: 'gbaVaporRollC 1.25s cubic-bezier(0.22, 0.8, 0.3, 1) 0.18s forwards', opacity: 0 }}>
            <svg width="170" height="40" viewBox="0 0 170 40" className="overflow-visible">
              <path d="M4 30 C 20 12, 44 20, 62 12 C 84 2, 108 14, 126 10 C 150 6, 166 18, 164 30 Z" fill="#d9f99d" opacity="0.35" />
            </svg>
          </div>

          {/* Tendrils curling up out of the mass once it has covered the card */}
          <div className="absolute left-[-18px] bottom-2" style={{ animation: 'gbaVaporTendril 1.25s ease-out 0.3s forwards', opacity: 0 }}>
            <svg width="30" height="54" viewBox="0 0 30 54">
              <path d="M15 52 C 4 40, 26 32, 14 20 C 6 12, 20 4, 16 2" fill="none" stroke="#bef264" strokeWidth="2.6" strokeLinecap="round" opacity="0.8" />
            </svg>
          </div>
          <div className="absolute right-[-10px] bottom-4" style={{ animation: 'gbaVaporTendril 1.25s ease-out 0.42s forwards', opacity: 0 }}>
            <svg width="26" height="46" viewBox="0 0 26 46">
              <path d="M13 44 C 24 34, 4 26, 14 16 C 20 10, 10 4, 13 2" fill="none" stroke="#d8b4fe" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>

          {/* The venom spread: concentric pulse rings expanding outward from the cloud core,
              reading as the toxin seeping into everything it touches */}
          {[0, 1, 2].map(i => (
            <div key={`vspread-${i}`} className="absolute" style={{ animation: `gbaVaporSpread 1.25s ease-out ${0.12 + i * 0.16}s forwards`, opacity: 0 }}>
              <svg width={72 + i * 26} height={72 + i * 26} viewBox={`0 0 ${72 + i * 26} ${72 + i * 26}`}>
                <circle
                  cx={(72 + i * 26) / 2} cy={(72 + i * 26) / 2} r={(72 + i * 26) / 2 - 3}
                  fill="none"
                  stroke={i === 0 ? '#a3e635' : i === 1 ? '#86efac' : '#c084fc'}
                  strokeWidth={i === 0 ? 2.5 : 1.5}
                  strokeDasharray={i === 2 ? '5 4' : undefined}
                  opacity={0.75 - i * 0.15}
                />
              </svg>
            </div>
          ))}
          {/* Rising venom wisps curling up out of the spreading mass */}
          <div className="absolute" style={{ animation: 'gbaVaporRise 1.25s ease-out 0.32s forwards', opacity: 0 }}>
            <svg width="44" height="52" viewBox="0 0 44 52" className="overflow-visible">
              <path d="M22 50 C 20 40, 26 36, 22 28 C 18 20, 26 16, 22 6" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <path d="M12 46 C 12 38, 16 34, 12 26 C 8 18, 14 12, 12 4" fill="none" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M32 48 C 34 38, 30 34, 34 24 C 38 16, 32 10, 34 2" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
            </svg>
          </div>

          {/* Heavy droplets falling out of the bottom of the cloud */}
          <div className="absolute left-2 top-3" style={{ animation: 'gbaVaporDroplet 1.25s ease-in 0.45s forwards', opacity: 0 }}>
            <svg width="12" height="18" viewBox="0 0 12 18"><path d="M6 1 Q9 7, 9 11 A4 4 0 1 1 3 11 Q3 7, 6 1 Z" fill="#a3e635" opacity="0.85" /></svg>
          </div>
          <div className="absolute right-4 top-1" style={{ animation: 'gbaVaporDroplet 1.25s ease-in 0.62s forwards', opacity: 0 }}>
            <svg width="10" height="15" viewBox="0 0 10 15"><path d="M5 1 Q8 6, 8 9 A3.2 3.2 0 1 1 2 9 Q2 6, 5 1 Z" fill="#c084fc" opacity="0.8" /></svg>
          </div>
        </div>
      )}

      {/* 7c. POISON VAPOR - BENCH (the same gas, one beat later, on each Benched Pokémon) */}
      {fx.type === 'poison_vapor_bench' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div className="absolute" style={{ animation: 'gbaVaporBenchPuff 1.1s ease-out forwards', opacity: 0 }}>
            <svg width="96" height="60" viewBox="0 0 96 60" className="overflow-visible">
              <path
                d="M6 44 C 2 28, 22 18, 38 26 C 46 10, 74 12, 80 28 C 94 30, 94 46, 82 50 C 58 60, 20 58, 6 44 Z"
                fill="#3f6212" opacity="0.72"
              />
              <path
                d="M14 42 C 12 30, 28 24, 40 30 C 50 18, 70 22, 74 34 C 84 38, 80 48, 70 50 C 46 56, 24 52, 14 42 Z"
                fill="#7e22ce" opacity="0.45"
              />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaVaporBenchWisp 1.1s ease-out 0.15s forwards', opacity: 0 }}>
            <svg width="60" height="34" viewBox="0 0 60 34" className="overflow-visible">
              <path d="M4 26 C 10 10, 30 16, 38 8 C 48 0, 58 10, 56 24 Z" fill="#d9f99d" opacity="0.4" />
            </svg>
          </div>
          {/* Mini venom pulse marking the gas reaching this benched Pokémon */}
          <div className="absolute" style={{ animation: 'gbaVaporBenchSpread 1.1s ease-out 0.2s forwards', opacity: 0 }}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="18" fill="none" stroke="#a3e635" strokeWidth="2" opacity="0.8" />
              <circle cx="24" cy="24" r="11" fill="none" stroke="#86efac" strokeWidth="1.5" opacity="0.6" />
              <circle cx="24" cy="24" r="5" fill="#a3e635" opacity="0.35" />
            </svg>
          </div>
        </div>
      )}

      {/* 8. POISON GAS / FOUL GAS */}
      {(fx.type === 'poison_gas' || fx.type === 'foul_gas') && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="absolute flex flex-col items-center"
            style={{ animation: 'gbaPoisonGasCloud 1.2s ease-out forwards' }}
          >
            <div className="flex gap-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-950/90 to-fuchsia-600/80 blur-sm flex items-center justify-center shadow-[0_0_20px_#c084fc]">
                <span className="text-2xl animate-pulse">☠️</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-950/90 to-purple-500/80 blur-sm -ml-4 -mt-2 shadow-[0_0_15px_#a855f7]">
                <span className="text-lg opacity-80">🫧</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-purple-950/30 rounded-2xl animate-pulse border border-purple-500/40" />
        </div>
      )}

      {/* 9. SLASH / FURY SWIPES / CLAW
          Three variants:
          – normal:    top-left → bottom-right (left-hand swipe)
          – mirrored:  top-right → bottom-left (right-hand swipe), used for alternating multi-hits
          – X-slash:   both at once when Swords Dance doubled the strike */}
      {fx.type === 'slash' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {fx.swordsDanceBoosted ? (
            <>
              {/* Normal slash (left scythe-arm) */}
              <div
                className="absolute flex flex-col items-center gap-1"
                style={{ animation: 'gbaClawSlashDiagonal 1.15s ease-out forwards' }}
              >
                <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-red-500 to-white rounded-full rotate-45 shadow-[0_0_12px_#ef4444]" />
                <div className="w-28 h-2 bg-gradient-to-r from-transparent via-rose-400 to-white rounded-full rotate-45 shadow-[0_0_15px_#f43f5e] -mt-1" />
                <div className="w-20 h-1.5 bg-gradient-to-r from-transparent via-red-500 to-white rounded-full rotate-45 shadow-[0_0_12px_#ef4444] -mt-1" />
              </div>
              {/* Mirrored slash (right scythe-arm) — simultaneous, forming an X */}
              <div
                className="absolute flex flex-col items-center gap-1"
                style={{ animation: 'gbaClawSlashDiagonalMirror 1.15s ease-out forwards' }}
              >
                <div className="w-24 h-1.5 bg-gradient-to-l from-transparent via-red-500 to-white rounded-full -rotate-45 shadow-[0_0_12px_#ef4444]" />
                <div className="w-28 h-2 bg-gradient-to-l from-transparent via-rose-400 to-white rounded-full -rotate-45 shadow-[0_0_15px_#f43f5e] -mt-1" />
                <div className="w-20 h-1.5 bg-gradient-to-l from-transparent via-red-500 to-white rounded-full -rotate-45 shadow-[0_0_12px_#ef4444] -mt-1" />
              </div>
            </>
          ) : fx.mirrored ? (
            <div
              className="flex flex-col items-center gap-1"
              style={{ animation: 'gbaClawSlashDiagonalMirror 1.15s ease-out forwards' }}
            >
              <div className="w-24 h-1.5 bg-gradient-to-l from-transparent via-red-500 to-white rounded-full -rotate-45 shadow-[0_0_12px_#ef4444]" />
              <div className="w-28 h-2 bg-gradient-to-l from-transparent via-rose-400 to-white rounded-full -rotate-45 shadow-[0_0_15px_#f43f5e] -mt-1" />
              <div className="w-20 h-1.5 bg-gradient-to-l from-transparent via-red-500 to-white rounded-full -rotate-45 shadow-[0_0_12px_#ef4444] -mt-1" />
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-1"
              style={{ animation: 'gbaClawSlashDiagonal 1.15s ease-out forwards' }}
            >
              <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-red-500 to-white rounded-full rotate-45 shadow-[0_0_12px_#ef4444]" />
              <div className="w-28 h-2 bg-gradient-to-r from-transparent via-rose-400 to-white rounded-full rotate-45 shadow-[0_0_15px_#f43f5e] -mt-1" />
              <div className="w-20 h-1.5 bg-gradient-to-r from-transparent via-red-500 to-white rounded-full rotate-45 shadow-[0_0_12px_#ef4444] -mt-1" />
            </div>
          )}
        </div>
      )}

      {/* 10. PUNCH / KARATE CHOP (GBA-style fist lunge with impact star) */}
      {fx.type === 'punch' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Fist shape lunging forward */}
          <div
            className="absolute"
            style={{ animation: 'gbaPunchSlam 1.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
          >
            <svg width="48" height="44" viewBox="0 0 48 44" className="drop-shadow-[0_0_16px_#f59e0b]">
              {/* Fist body */}
              <rect x="12" y="10" width="28" height="24" rx="8" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              {/* Knuckle bumps */}
              <circle cx="18" cy="12" r="4" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
              <circle cx="26" cy="11" r="4" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
              <circle cx="34" cy="12" r="4" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
              {/* Thumb */}
              <ellipse cx="12" cy="28" rx="5" ry="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
              {/* Wrist */}
              <rect x="20" y="34" width="14" height="8" rx="3" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
            </svg>
          </div>
          {/* Speed lines behind fist */}
          <div className="absolute -left-6" style={{ animation: 'gbaPunchSpeedLines 1.15s ease-out forwards', opacity: 0 }}>
            <svg width="40" height="30" viewBox="0 0 40 30">
              <line x1="0" y1="8" x2="30" y2="8" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <line x1="5" y1="15" x2="38" y2="15" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <line x1="0" y1="22" x2="28" y2="22" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          {/* Impact star burst on contact */}
          <div className="absolute" style={{ animation: 'gbaPunchImpactStar 1.15s ease-out 0.35s forwards', opacity: 0 }}>
            <svg width="50" height="50" viewBox="0 0 50 50">
              <polygon points="25,2 30,18 48,18 34,28 38,45 25,35 12,45 16,28 2,18 20,18" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />
              <circle cx="25" cy="25" r="8" fill="#ffffff" opacity="0.8" />
            </svg>
          </div>
        </div>
      )}

      {/* 10b. HITMONCHAN JAB (red boxing glove — quick straight punch with small impact) */}
      {fx.type === 'hitmonchan_jab' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Red boxing glove lunging forward */}
          <div className="absolute" style={{ animation: 'gbaHitmonchanJab 1.1s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="44" height="40" viewBox="0 0 44 40" className="drop-shadow-[0_0_12px_#dc2626]">
              {/* Glove body */}
              <ellipse cx="22" cy="18" rx="16" ry="14" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
              {/* Glove highlight */}
              <ellipse cx="18" cy="14" rx="8" ry="6" fill="#ef4444" opacity="0.6" />
              {/* Lacing */}
              <path d="M16 24 L20 22 L24 24 L28 22" fill="none" stroke="#fef2f2" strokeWidth="1.5" strokeLinecap="round" />
              {/* Wrist/cuff */}
              <rect x="14" y="30" width="16" height="8" rx="3" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
              {/* Knuckle ridge */}
              <path d="M10 12 Q22 6, 34 12" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          {/* Speed lines */}
          <div className="absolute -left-5" style={{ animation: 'gbaPunchSpeedLines 1.1s ease-out forwards', opacity: 0 }}>
            <svg width="36" height="26" viewBox="0 0 36 26">
              <line x1="0" y1="7" x2="26" y2="7" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <line x1="4" y1="13" x2="34" y2="13" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <line x1="0" y1="19" x2="24" y2="19" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          {/* Small impact star */}
          {!fx.whiffed && (
            <div className="absolute" style={{ animation: 'gbaPunchImpactStar 1.1s ease-out 0.35s forwards', opacity: 0 }}>
              <svg width="40" height="40" viewBox="0 0 40 40">
                <polygon points="20,2 24,14 38,14 27,22 30,36 20,28 10,36 13,22 2,14 16,14" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.2" />
                <circle cx="20" cy="20" r="6" fill="#ffffff" opacity="0.8" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* 10c. HITMONCHAN SPECIAL PUNCH (red boxing glove — heavy haymaker with large impact
            star, screen shake and dramatic wind-up for 2x damage differentiation) */}
      {fx.type === 'hitmonchan_special_punch' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Screen shake wrapper */}
          <div className="absolute inset-0" style={{ animation: 'gbaHitmonchanScreenShake 1.3s ease-out 0.4s forwards' }}>
            {/* Large red boxing glove — bigger than Jab, with wind-up rotation */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ animation: 'gbaHitmonchanSpecialPunch 1.3s cubic-bezier(0.15, 0.9, 0.25, 1) forwards' }}>
              <svg width="60" height="54" viewBox="0 0 60 54" className="drop-shadow-[0_0_18px_#dc2626]">
                {/* Glove body — larger */}
                <ellipse cx="30" cy="24" rx="22" ry="19" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2.5" />
                {/* Glove highlight */}
                <ellipse cx="24" cy="18" rx="11" ry="8" fill="#ef4444" opacity="0.6" />
                {/* Lacing */}
                <path d="M20 33 L26 30 L32 33 L38 30" fill="none" stroke="#fef2f2" strokeWidth="2" strokeLinecap="round" />
                {/* Wrist/cuff */}
                <rect x="18" y="41" width="24" height="10" rx="4" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
                {/* Knuckle ridge — more pronounced */}
                <path d="M12 15 Q30 7, 48 15" fill="none" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />
                {/* Impact glow ring */}
                <circle cx="30" cy="24" r="24" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.4" />
              </svg>
            </div>
            {/* Heavy speed lines — thicker, more numerous */}
            <div className="absolute -left-8" style={{ animation: 'gbaPunchSpeedLines 1.3s ease-out forwards', opacity: 0 }}>
              <svg width="50" height="36" viewBox="0 0 50 36">
                <line x1="0" y1="8" x2="38" y2="8" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
                <line x1="5" y1="14" x2="48" y2="14" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
                <line x1="0" y1="20" x2="42" y2="20" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
                <line x1="3" y1="27" x2="36" y2="27" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              </svg>
            </div>
            {/* Large impact star — significantly bigger than Jab */}
            {!fx.whiffed && (
              <div className="absolute" style={{ animation: 'gbaHitmonchanImpactStar 1.3s ease-out 0.45s forwards', opacity: 0 }}>
                <svg width="70" height="70" viewBox="0 0 70 70">
                  <polygon points="35,2 42,24 66,24 47,38 53,62 35,48 17,62 23,38 4,24 28,24" fill="#fef08a" stroke="#f59e0b" strokeWidth="2" />
                  <polygon points="35,12 39,28 54,28 42,37 46,52 35,43 24,52 28,37 16,28 31,28" fill="#fbbf24" opacity="0.6" />
                  <circle cx="35" cy="35" r="10" fill="#ffffff" opacity="0.9" />
                </svg>
              </div>
            )}
            {/* Secondary impact ring */}
            {!fx.whiffed && (
              <div className="absolute" style={{ animation: 'gbaExplosionRing 1.3s ease-out 0.5s forwards', opacity: 0 }}>
                <div className="w-16 h-16 rounded-full border-2 border-red-400/60" />
              </div>
            )}
          </div>
        </div>
      )}


      {/* 11. THUNDER WAVE / THUNDERSHOCK (lightning bolt striking down onto target) */}
      {fx.type === 'thunder_wave' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Main lightning bolt striking from above */}
          <div className="absolute" style={{ animation: 'gbaThunderStrikeBolt 1.2s ease-out forwards' }}>
            <svg width="50" height="120" viewBox="0 0 50 120" className="drop-shadow-[0_0_20px_#fde047]">
              {/* Outer glow layer */}
              <path d="M25 0 L18 35 L30 30 L15 65 L28 58 L10 95 L22 85 L20 120 L32 80 L24 88 L38 55 L26 60 L35 28 L22 33 L30 0 Z" fill="#fef08a" opacity="0.5" />
              {/* Main bolt */}
              <path d="M25 0 L19 33 L29 29 L16 62 L27 56 L12 90 L23 82 L21 115 L31 78 L24 84 L36 53 L26 57 L33 27 L23 31 L29 0 Z" fill="#fde047" stroke="#facc15" strokeWidth="1" />
              {/* White core */}
              <path d="M25 5 L21 30 L27 28 L19 55 L25 52 L16 80 L23 75 L22 105 L29 74 L25 78 L33 52 L26 55 L31 28 L24 30 L28 5 Z" fill="#ffffff" opacity="0.8" />
            </svg>
          </div>
          {/* Impact flash at strike point */}
          <div className="absolute bottom-0" style={{ animation: 'gbaThunderStrikeFlash 1.2s ease-out 0.25s forwards', opacity: 0 }}>
            <div className="w-24 h-24 rounded-full bg-gradient-to-t from-yellow-300 via-yellow-100 to-transparent blur-md" />
          </div>
          {/* Star burst at impact */}
          <div className="absolute bottom-2" style={{ animation: 'gbaThunderStrikeStar 1.2s ease-out 0.3s forwards', opacity: 0 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
              <polygon points="30,2 35,22 55,22 39,34 44,54 30,42 16,54 21,34 5,22 25,22" fill="#fef08a" stroke="#f59e0b" strokeWidth="1" />
              <circle cx="30" cy="30" r="10" fill="#ffffff" opacity="0.9" />
            </svg>
          </div>
          {/* Spark particles scattering */}
          <div className="absolute bottom-4 -left-2" style={{ animation: 'gbaThunderSpark 1.2s ease-out 0.35s forwards', opacity: 0 }}>
            <span className="text-lg text-yellow-300 select-none">✦</span>
          </div>
          <div className="absolute bottom-3 right-0" style={{ animation: 'gbaThunderSpark 1.2s ease-out 0.45s forwards', opacity: 0 }}>
            <span className="text-sm text-yellow-200 select-none">✦</span>
          </div>
          <div className="absolute bottom-6 left-3" style={{ animation: 'gbaThunderSpark 1.2s ease-out 0.5s forwards', opacity: 0 }}>
            <span className="text-xs text-amber-200 select-none">✦</span>
          </div>
        </div>
      )}

      {/* 11b. THUNDERPUNCH (Electabuzz - yellow fist with lightning streaks) */}
      {fx.type === 'thunder_punch' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Camouflage spark burst — masks the reference image's built-in electricity
              during the initial small/transparent spawn phase at the right-back origin */}
          <div className="absolute" style={{ transform: 'translate(38%, -18%)', animation: 'gbaThunderPunchCamouflage 0.45s ease-out forwards', opacity: 0 }}>
            <svg width="52" height="52" viewBox="0 0 52 52" className="drop-shadow-[0_0_14px_#fef08a]">
              <path d="M26 2 L22 16 L26 14 L20 30 L28 20 L24 24 L30 6 Z" fill="#fef9c3" stroke="#fde047" strokeWidth="0.6" />
              <path d="M40 12 L34 22 L38 20 L32 34 L38 26 L36 28 L42 14 Z" fill="#fde047" stroke="#facc15" strokeWidth="0.5" opacity="0.85" />
              <path d="M10 16 L14 26 L11 24 L16 36 L12 28 L13 30 L8 18 Z" fill="#fef9c3" stroke="#fde047" strokeWidth="0.5" opacity="0.8" />
              <circle cx="26" cy="26" r="8" fill="none" stroke="#fef08a" strokeWidth="1.5" opacity="0.6" />
              <circle cx="26" cy="26" r="14" fill="none" stroke="#fde047" strokeWidth="1" opacity="0.4" />
            </svg>
          </div>
          <div className="absolute" style={{ transform: 'translate(42%, -22%)', animation: 'gbaThunderPunchCamouflage 0.4s ease-out 0.06s forwards', opacity: 0 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" className="drop-shadow-[0_0_10px_#fef9c3]">
              <path d="M18 3 L15 14 L18 12 L13 26 L20 16 L17 19 L22 5 Z" fill="#ffffff" stroke="#fef08a" strokeWidth="0.5" opacity="0.9" />
              <path d="M28 10 L24 18 L27 16 L22 28 L27 21 L25 23 L30 12 Z" fill="#fde047" stroke="#facc15" strokeWidth="0.4" opacity="0.7" />
            </svg>
          </div>
          {/* Electabuzz fist + arm — reference image with approach trajectory.
              Spawns small at right-back, grows while sweeping left-front with
              angular rotation, accelerating into a dead-on frontal impact.
              Final width = 60% of card (40% margin from horizontal edge). */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: 'gbaThunderPunchApproach 1.0s cubic-bezier(0.3, 0.0, 0.85, 0.35) forwards' }}
          >
            <img
              src="/assets/ThunderPunch_Fist.png"
              alt=""
              className="select-none pointer-events-none drop-shadow-[0_0_22px_#facc15]"
              style={{ width: '60%', maxWidth: '60%', height: 'auto', objectFit: 'contain' }}
              draggable={false}
            />
          </div>
          {/* Impact glow flash behind the fist — soft outer halo + tighter hot core for cleaner falloff */}
          <div className="absolute" style={{ animation: 'gbaThunderPunchGlow 1.0s ease-out forwards', opacity: 0 }}>
            <div className="w-32 h-32 rounded-full bg-gradient-to-t from-yellow-300 via-amber-200/60 to-transparent blur-md" />
            <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-t from-yellow-100 via-yellow-200/70 to-transparent blur-sm" />
          </div>
          {/* Rotating electric aura ring wrapping the fist */}
          <div className="absolute w-32 h-32" style={{ animation: 'gbaThunderPunchAura 0.9s linear 0.1s forwards', opacity: 0 }}>
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_#fde047]">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#fde047" strokeWidth="2.5" strokeDasharray="10 6" opacity="0.85" />
              <circle cx="50" cy="50" r="36" fill="none" stroke="#fef9c3" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.7" />
            </svg>
          </div>
          {/* Radial lightning bolts bursting outward from the fist (tip-up bolts, rotated per direction) */}
          <div className="absolute" style={{ transform: 'translate(-48px, -50px) rotate(-40deg)' }}>
            <div style={{ animation: 'gbaThunderPunchSpark 0.7s ease-out 0.35s forwards', opacity: 0 }}>
              <svg width="26" height="44" viewBox="0 0 26 44" className="drop-shadow-[0_0_12px_#fef08a]">
                <path d="M13 2 L8 20 L13 18 L6 40 L16 22 L11 25 L17 4 Z" fill="#fde047" stroke="#facc15" strokeWidth="0.8" />
                <path d="M13 6 L10 18 L13 17 L9 33 L14 22 L12 24 L15 6 Z" fill="#ffffff" opacity="0.7" />
              </svg>
            </div>
          </div>
          <div className="absolute" style={{ transform: 'translate(26px, -52px) rotate(40deg)' }}>
            <div style={{ animation: 'gbaThunderPunchSpark 0.7s ease-out 0.4s forwards', opacity: 0 }}>
              <svg width="26" height="44" viewBox="0 0 26 44" className="drop-shadow-[0_0_12px_#fef08a]">
                <path d="M13 2 L8 20 L13 18 L6 40 L16 22 L11 25 L17 4 Z" fill="#fde047" stroke="#facc15" strokeWidth="0.8" />
                <path d="M13 6 L10 18 L13 17 L9 33 L14 22 L12 24 L15 6 Z" fill="#ffffff" opacity="0.7" />
              </svg>
            </div>
          </div>
          <div className="absolute" style={{ transform: 'translate(44px, -14px) rotate(90deg)' }}>
            <div style={{ animation: 'gbaThunderPunchSpark 0.7s ease-out 0.45s forwards', opacity: 0 }}>
              <svg width="22" height="38" viewBox="0 0 26 44" className="drop-shadow-[0_0_10px_#fde047]">
                <path d="M13 2 L8 20 L13 18 L6 40 L16 22 L11 25 L17 4 Z" fill="#fef9c3" stroke="#fde047" strokeWidth="0.8" />
              </svg>
            </div>
          </div>
          <div className="absolute" style={{ transform: 'translate(-64px, -14px) rotate(-90deg)' }}>
            <div style={{ animation: 'gbaThunderPunchSpark 0.7s ease-out 0.5s forwards', opacity: 0 }}>
              <svg width="22" height="38" viewBox="0 0 26 44" className="drop-shadow-[0_0_10px_#fde047]">
                <path d="M13 2 L8 20 L13 18 L6 40 L16 22 L11 25 L17 4 Z" fill="#fef9c3" stroke="#fde047" strokeWidth="0.8" />
              </svg>
            </div>
          </div>
          {/* Jagged crackle arcs zapping across the fist surface */}
          <div className="absolute" style={{ animation: 'gbaElectricFlicker 0.7s linear 0.3s forwards', opacity: 0 }}>
            <svg width="76" height="54" viewBox="0 0 76 54">
              <path d="M4 28 L14 20 L12 28 L24 16 L22 26 L36 12" fill="none" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              <path d="M72 32 L60 38 L63 30 L50 42" fill="none" stroke="#fef9c3" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            </svg>
          </div>
          {/* Flickering spark particles scattering */}
          <div className="absolute -top-6 left-1" style={{ animation: 'gbaElectricFlicker 0.6s linear 0.35s forwards', opacity: 0 }}>
            <span className="text-lg text-yellow-200 select-none drop-shadow-[0_0_8px_#fef08a]">✦</span>
          </div>
          <div className="absolute bottom-0 -right-4" style={{ animation: 'gbaElectricFlicker 0.6s linear 0.42s forwards', opacity: 0 }}>
            <span className="text-sm text-yellow-300 select-none drop-shadow-[0_0_6px_#fde047]">✦</span>
          </div>
          <div className="absolute top-1 -left-5" style={{ animation: 'gbaElectricFlicker 0.6s linear 0.48s forwards', opacity: 0 }}>
            <span className="text-xs text-amber-200 select-none drop-shadow-[0_0_5px_#fde047]">✦</span>
          </div>
          <div className="absolute -bottom-4 -left-2" style={{ animation: 'gbaElectricFlicker 0.6s linear 0.52s forwards', opacity: 0 }}>
            <span className="text-sm text-yellow-200 select-none drop-shadow-[0_0_6px_#fef08a]">✦</span>
          </div>
          {/* Double impact rings — fire the moment the fist reaches full size
              (0.82s / 0.88s ≈ fist at 94-100% scale) so the impact reads as
              the hit itself; short durations finish before the 1300ms cleanup */}
          <div className="absolute w-24 h-24 rounded-full border-3 border-yellow-300/80" style={{ animation: 'gbaThunderPunchRing 0.45s ease-out 0.82s forwards', opacity: 0 }} />
          <div className="absolute w-16 h-16 rounded-full border-2 border-yellow-100/90" style={{ animation: 'gbaThunderPunchRing 0.4s ease-out 0.88s forwards', opacity: 0 }} />
        </div>
      )}

      {/* 12. FLAMETHROWER_BLAZE (generic fire fallback)
          Static baseline rendering. Fire moves never scale their FX visually; intensity
          information is carried by fxIntensity on AttackResult for Continuous Fireball
          only (heads × 0.10), but the animation itself stays at fixed size. */}
      {fx.type === 'flamethrower_blaze' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <div
            className="flex items-center justify-center"
            style={{ animation: 'gbaFlamethrowerStream 1.2s ease-out forwards' }}
          >
            <div
              className="rounded-full bg-gradient-to-tr from-red-600 via-orange-500 to-yellow-400 blur-sm flex items-center justify-center"
              style={{
                width: 128,
                height: 128,
                boxShadow: '0 0 35px #ea580c'
              }}
            >
              <span className="select-none" style={{ fontSize: '48px' }}>🔥</span>
            </div>
          </div>
        </div>
      )}


      {/* 12a0. FLAMETHROWER STREAM (Arcanine/Charmeleon/Magmar/Flareon Flamethrower)
            Thick, turbulent horizontal fire-breath cone with multiple organic flame tongues,
            wavering wisps above and below, and a scorch glow at the impact point.
            GBA Flamethrower: sustained directional stream with visible heat turbulence. */}
      {fx.type === 'flamethrower_stream' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Main cone — thick turbulent fire breath body with multiple flame tongues */}
          <div className="absolute" style={{ animation: 'gbaFlameStreamCone 1.2s ease-out forwards' }}>
            <svg width="140" height="80" viewBox="0 0 140 80" className="drop-shadow-[0_0_22px_#ea580c]">
              <defs>
                <linearGradient id="ftsGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fef3c7" />
                  <stop offset="25%" stopColor="#fbbf24" />
                  <stop offset="55%" stopColor="#f97316" />
                  <stop offset="80%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="ftsInner" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#fef3c7" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              {/* Outer flame body — thick, irregular cone */}
              <path d="M4 40 Q10 22, 30 18 Q45 12, 60 20 Q75 14, 95 22 Q110 18, 125 28 Q136 34, 138 40 Q136 46, 125 52 Q110 62, 95 58 Q75 66, 60 60 Q45 68, 30 62 Q10 58, 4 40 Z" fill="url(#ftsGrad)" opacity="0.92" />
              {/* Upper flame tongue */}
              <path d="M20 28 Q35 18, 55 22 Q70 16, 88 24 Q100 20, 112 28 Q118 32, 115 35 Q100 30, 85 32 Q65 28, 48 32 Q32 30, 20 28 Z" fill="#f97316" opacity="0.8" />
              {/* Lower flame tongue */}
              <path d="M22 52 Q38 62, 56 58 Q72 64, 90 56 Q104 60, 114 52 Q118 48, 114 45 Q102 50, 88 48 Q70 52, 52 48 Q36 50, 22 52 Z" fill="#ef4444" opacity="0.75" />
              {/* Mid hot core */}
              <path d="M12 40 Q25 30, 50 33 Q75 28, 100 34 Q120 36, 130 40 Q120 44, 100 46 Q75 52, 50 47 Q25 50, 12 40 Z" fill="url(#ftsInner)" opacity="0.85" />
              {/* Flickering tips at the cone edge */}
              <path d="M120 30 Q126 26, 132 30 Q136 34, 133 37 Q128 34, 124 36 Q120 33, 120 30 Z" fill="#fbbf24" opacity="0.9" />
              <path d="M122 44 Q128 48, 134 45 Q137 42, 134 39 Q130 42, 126 41 Q122 42, 122 44 Z" fill="#f97316" opacity="0.85" />
              <path d="M110 24 Q114 20, 118 24 Q120 28, 116 29 Q112 27, 110 24 Z" fill="#fef3c7" opacity="0.8" />
              <path d="M112 54 Q116 58, 120 55 Q122 52, 119 50 Q115 52, 112 54 Z" fill="#fbbf24" opacity="0.75" />
            </svg>
          </div>
          {/* Turbulent wisps riding above the stream */}
          <div className="absolute" style={{ animation: 'gbaFlameStreamWisp1 1.2s ease-out 0.08s forwards', opacity: 0 }}>
            <svg width="34" height="28" viewBox="0 0 34 28">
              <path d="M3 22 Q8 12, 14 16 Q18 6, 24 12 Q29 8, 32 14 Q34 20, 28 23 Q18 26, 8 24 Q4 23, 3 22 Z" fill="#f97316" opacity="0.85" />
              <path d="M8 19 Q12 13, 17 16 Q21 11, 25 15 Q28 18, 24 20 Q16 22, 8 19 Z" fill="#fbbf24" opacity="0.7" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaFlameStreamWisp4 1.2s ease-out 0.15s forwards', opacity: 0 }}>
            <svg width="28" height="24" viewBox="0 0 28 24">
              <path d="M2 18 Q6 10, 12 14 Q16 6, 22 10 Q26 14, 24 18 Q18 22, 8 20 Q3 19, 2 18 Z" fill="#ef4444" opacity="0.8" />
              <path d="M7 16 Q10 11, 15 14 Q19 10, 22 14 Q23 17, 19 18 Q12 19, 7 16 Z" fill="#fbbf24" opacity="0.65" />
            </svg>
          </div>
          {/* Turbulent wisps below the stream */}
          <div className="absolute" style={{ animation: 'gbaFlameStreamWisp2 1.2s ease-out 0.12s forwards', opacity: 0 }}>
            <svg width="30" height="26" viewBox="0 0 30 26">
              <path d="M2 14 Q7 6, 13 10 Q17 3, 23 8 Q28 12, 26 17 Q20 22, 10 20 Q4 18, 2 14 Z" fill="#ef4444" opacity="0.8" />
              <path d="M7 13 Q10 8, 15 11 Q19 7, 23 11 Q25 15, 20 16 Q12 17, 7 13 Z" fill="#f97316" opacity="0.7" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaFlameStreamWisp5 1.2s ease-out 0.22s forwards', opacity: 0 }}>
            <svg width="26" height="22" viewBox="0 0 26 22">
              <path d="M2 14 Q6 7, 11 10 Q14 4, 19 8 Q23 12, 21 16 Q16 19, 8 17 Q3 16, 2 14 Z" fill="#f97316" opacity="0.75" />
            </svg>
          </div>
          {/* Central wisp riding the core */}
          <div className="absolute" style={{ animation: 'gbaFlameStreamWisp3 1.2s ease-out 0.18s forwards', opacity: 0 }}>
            <svg width="32" height="20" viewBox="0 0 32 20">
              <path d="M2 12 Q8 5, 14 9 Q18 3, 24 7 Q29 10, 27 14 Q22 18, 10 16 Q4 14, 2 12 Z" fill="#fbbf24" opacity="0.8" />
              <path d="M8 11 Q12 7, 17 10 Q21 6, 25 10 Q26 13, 22 14 Q14 15, 8 11 Z" fill="#fef3c7" opacity="0.6" />
            </svg>
          </div>
          {/* Scorch glow at the impact point — organic flame burst */}
          <div className="absolute translate-x-[50px]" style={{ animation: 'gbaFlameStreamScorch 1.2s ease-out 0.3s forwards', opacity: 0 }}>
            <svg width="56" height="56" viewBox="0 0 56 56">
              <path d="M28 4 Q34 12, 32 20 Q38 16, 40 24 Q46 20, 44 30 Q50 28, 46 38 Q52 40, 44 46 Q48 52, 38 50 Q36 56, 28 52 Q20 56, 18 50 Q8 52, 12 46 Q4 40, 10 38 Q6 28, 12 30 Q10 20, 16 24 Q18 16, 24 20 Q22 12, 28 4 Z" fill="#dc2626" opacity="0.5" />
              <path d="M28 12 Q32 18, 30 24 Q36 22, 36 28 Q42 28, 38 34 Q42 40, 34 40 Q34 46, 28 44 Q22 46, 22 40 Q14 40, 18 34 Q14 28, 20 28 Q20 22, 26 24 Q24 18, 28 12 Z" fill="#f97316" opacity="0.55" />
              <circle cx="28" cy="28" r="8" fill="#fbbf24" opacity="0.6" />
              <circle cx="28" cy="28" r="4" fill="#fef3c7" opacity="0.7" />
            </svg>
          </div>
        </div>
      )}

      {/* 12a. EMBER SPARK (Charmander, Ponyta — small rising flame pops, GBA-style)
            Tiny fire motes that pop upward. Deliberately small and brief: low-damage starter move. */}
      {fx.type === 'ember_spark' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div className="absolute" style={{ animation: 'gbaEmberSparkRise 1.2s ease-out forwards' }}>
            <svg width="36" height="40" viewBox="0 0 36 40" className="drop-shadow-[0_0_10px_#f97316]">
              <path d="M18 38 Q14 28, 16 20 Q13 14, 18 6 Q23 14, 20 20 Q22 28, 18 38 Z" fill="#f97316" opacity="0.9" />
              <path d="M18 34 Q16 26, 17 20 Q15 15, 18 10 Q21 15, 19 20 Q20 26, 18 34 Z" fill="#fbbf24" opacity="0.8" />
              <path d="M18 28 Q17 23, 18 16 Q19 23, 18 28 Z" fill="#fef3c7" opacity="0.9" />
            </svg>
          </div>
          {[0, 1, 2].map(i => (
            <div key={`ember-p-${i}`} className="absolute" style={{ animation: `gbaEmberSparkP${i + 1} 1.2s ease-out ${0.15 + i * 0.12}s forwards`, opacity: 0 }}>
              <svg width="10" height="10" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r={3.5 - i * 0.5} fill={i === 0 ? '#fbbf24' : i === 1 ? '#f97316' : '#ef4444'} opacity="0.9" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 12b. FLARE BURST (Growlithe — quick organic flash of flame tongues, GBA Flare style) */}
      {fx.type === 'flare_burst' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Central organic flame cluster — overlapping tongues, not a perfect circle */}
          <div className="absolute" style={{ animation: 'gbaFlareBurstCore 1.2s ease-out forwards' }}>
            <svg width="68" height="68" viewBox="0 0 68 68" className="drop-shadow-[0_0_22px_#fbbf24]">
              <defs>
                <linearGradient id="fbCoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef3c7" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              {/* Organic flame burst shape — irregular, not circular */}
              <path d="M34 6 Q40 14, 38 22 Q44 16, 46 26 Q52 22, 50 32 Q56 30, 52 40 Q58 44, 48 46 Q52 54, 42 52 Q40 60, 34 56 Q28 60, 26 52 Q16 54, 20 46 Q10 44, 16 40 Q12 30, 18 32 Q16 22, 22 26 Q24 16, 30 22 Q28 14, 34 6 Z" fill="url(#fbCoreGrad)" opacity="0.9" />
              <path d="M34 16 Q38 22, 36 28 Q42 24, 42 32 Q46 30, 44 38 Q48 42, 40 42 Q42 48, 34 46 Q26 48, 28 42 Q20 42, 24 38 Q22 30, 26 32 Q26 24, 32 28 Q30 22, 34 16 Z" fill="#fef3c7" opacity="0.7" />
              <circle cx="34" cy="34" r="6" fill="#ffffff" opacity="0.6" />
            </svg>
          </div>
          {/* 6 organic flame tongues radiating at irregular angles */}
          {[
            { dx: '22px', dy: '-16px', r: -25 }, { dx: '-20px', dy: '-18px', r: 20 },
            { dx: '26px', dy: '10px', r: 15 }, { dx: '-24px', dy: '12px', r: -18 },
            { dx: '8px', dy: '-26px', r: 5 }, { dx: '-6px', dy: '24px', r: -8 }
          ].map((p, i) => (
            <div key={`fb-tongue-${i}`} className="absolute" style={{ '--ray-dx': p.dx, '--ray-dy': p.dy, '--ray-rot': `${p.r}deg`, animation: `gbaFlareBurstRay 1.2s ease-out ${0.06 + i * 0.04}s forwards`, opacity: 0 } as React.CSSProperties}>
              <svg width="22" height="26" viewBox="0 0 22 26">
                <path d="M11 26 Q7 18, 8 12 Q5 6, 11 1 Q17 6, 14 12 Q15 18, 11 26 Z" fill={i % 2 === 0 ? '#f97316' : '#fbbf24'} opacity="0.85" />
                <path d="M11 20 Q9 15, 10 11 Q8 7, 11 4 Q14 7, 12 11 Q13 15, 11 20 Z" fill="#fef3c7" opacity="0.7" />
              </svg>
            </div>
          ))}
          {/* Soft expanding glow — organic, not a CSS border ring */}
          <div className="absolute" style={{ animation: 'gbaFlareBurstRing 1.2s ease-out 0.15s forwards', opacity: 0 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <path d="M36 4 Q44 12, 42 20 Q50 16, 52 26 Q60 24, 56 34 Q64 36, 56 44 Q60 52, 50 50 Q52 58, 42 54 Q40 62, 36 58 Q32 62, 30 54 Q20 58, 22 50 Q12 52, 16 44 Q8 36, 16 34 Q12 24, 20 26 Q22 16, 30 20 Q28 12, 36 4 Z" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}


      {/* 12c. FLAME TAIL WHIP (Ponyta Flame Tail / Charmander Fire Tail — arcing fire trail)
            The Pokémon whips its burning tail: a curved flame arc sweeps across with trailing sparks. */}
      {fx.type === 'flame_tail_whip' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div className="absolute" style={{ animation: 'gbaFlameTailArc 1.2s cubic-bezier(0.2, 0.8, 0.4, 1) forwards' }}>
            <svg width="70" height="30" viewBox="0 0 70 30" className="drop-shadow-[0_0_16px_#f97316]">
              <defs>
                <linearGradient id="ftwGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                  <stop offset="40%" stopColor="#f97316" />
                  <stop offset="75%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#fef3c7" />
                </linearGradient>
              </defs>
              <path d="M4 15 Q20 8, 35 12 Q50 16, 66 10 Q70 14, 66 18 Q50 22, 35 18 Q20 22, 4 15 Z" fill="url(#ftwGrad)" opacity="0.9" />
              <path d="M16 15 Q35 12, 55 14 Q62 15, 55 16 Q35 18, 16 15 Z" fill="#fef3c7" opacity="0.7" />
              <path d="M24 10 Q27 6, 30 10" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
              <path d="M42 11 Q44 7, 47 11" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          <div className="absolute -left-8" style={{ animation: 'gbaFlameTailTrail 1.2s ease-out 0.1s forwards', opacity: 0 }}>
            <svg width="44" height="24" viewBox="0 0 44 24">
              <path d="M0 8 Q12 6, 36 8" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <path d="M2 14 Q16 14, 42 14" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
              <path d="M0 20 Q12 22, 36 20" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          {[0, 1, 2].map(i => (
            <div key={`ftw-spark-${i}`} className="absolute" style={{ animation: `gbaFlameTailSpark 1.2s ease-out ${0.3 + i * 0.12}s forwards`, opacity: 0 }}>
              <svg width="8" height="8" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r={3 - i * 0.5} fill={i === 0 ? '#fbbf24' : i === 1 ? '#f97316' : '#ef4444'} opacity="0.9" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 12d. FIRE BLAST STAR (Ninetales — GBA だいもんじ: the kanji 'fire' character forms
            as a blazing five-pointed star that sears outward, then disperses into embers.
            This is the iconic Fire Blast animation from GBA: the 大 character shape. */}
      {fx.type === 'fire_blast_star' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* The だいもんじ star shape — five strokes radiating from center */}
          <div className="absolute" style={{ animation: 'gbaFireBlastStarForm 1.2s ease-out forwards' }}>
            <svg width="90" height="90" viewBox="0 0 90 90" className="drop-shadow-[0_0_30px_#ea580c]">
              <defs>
                <linearGradient id="fbsGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fef3c7" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              {/* Five strokes of the 大 character as a star */}
              <path d="M45 5 L45 40" stroke="url(#fbsGrad)" strokeWidth="6" strokeLinecap="round" />
              <path d="M45 40 L20 75" stroke="url(#fbsGrad)" strokeWidth="6" strokeLinecap="round" />
              <path d="M45 40 L70 75" stroke="url(#fbsGrad)" strokeWidth="6" strokeLinecap="round" />
              <path d="M15 35 L45 40" stroke="url(#fbsGrad)" strokeWidth="5" strokeLinecap="round" />
              <path d="M75 35 L45 40" stroke="url(#fbsGrad)" strokeWidth="5" strokeLinecap="round" />
              {/* Hot core */}
              <circle cx="45" cy="40" r="8" fill="#fef3c7" opacity="0.9" />
              <circle cx="45" cy="40" r="5" fill="#ffffff" opacity="0.7" />
            </svg>
          </div>
          {/* Trailing heat shimmer below the star */}
          <div className="absolute" style={{ animation: 'gbaFireBlastStarTrail 1.2s ease-out 0.15s forwards', opacity: 0 }}>
            <svg width="60" height="20" viewBox="0 0 60 20">
              <path d="M5 10 Q15 6, 30 10 Q45 14, 55 10" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
              <path d="M10 14 Q25 12, 40 14 Q50 16, 52 14" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          {/* Scattering embers from the star tips */}
          {[
            { ex: '-18px', ey: '-14px' }, { ex: '18px', ey: '-14px' },
            { ex: '-22px', ey: '10px' }, { ex: '22px', ey: '10px' },
            { ex: '0px', ey: '-20px' }
          ].map((p, i) => (
            <div key={`fbs-ember-${i}`} className="absolute" style={{ '--ex': p.ex, '--ey': p.ey, animation: `gbaFireBlastStarEmber 1.2s ease-out ${0.35 + i * 0.08}s forwards`, opacity: 0 } as React.CSSProperties}>
              <svg width="10" height="10" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="3.5" fill={i % 2 === 0 ? '#fbbf24' : '#f97316'} opacity="0.9" />
              </svg>
            </div>
          ))}
        </div>
      )}


      {/* 12e. FIRE SPIN VORTEX (Charizard Fire Spin — spiraling flame tornado trapping the target)
            A rotating column of flame encircles the opponent, GBA Fire Spin: tight spiral + orbiting embers. */}
      {fx.type === 'fire_spin_vortex' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Central spiral body */}
          <div className="absolute" style={{ animation: 'gbaFireSpinSpiral 1.2s linear forwards' }}>
            <svg width="72" height="72" viewBox="0 0 72 72" className="drop-shadow-[0_0_22px_#f97316]">
              <defs>
                <linearGradient id="fsvGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              <path d="M36 6 Q50 12, 54 26 Q58 40, 48 50 Q38 60, 24 56 Q10 52, 12 38 Q14 24, 26 18 Q38 12, 42 22 Q46 32, 38 38 Q30 44, 26 36" fill="none" stroke="url(#fsvGrad)" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
              <path d="M36 12 Q46 16, 48 26 Q50 36, 42 42 Q34 48, 26 44 Q18 40, 22 32 Q26 24, 34 24" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          {/* Expanding heat rings */}
          <div className="absolute w-16 h-16 rounded-full border-2 border-orange-500/80" style={{ animation: 'gbaFireSpinRing 1.2s ease-out 0.1s forwards', opacity: 0 }} />
          <div className="absolute w-20 h-20 rounded-full border border-amber-400/60" style={{ animation: 'gbaFireSpinRing 1.2s ease-out 0.3s forwards', opacity: 0 }} />
          {/* Orbiting embers circling the vortex */}
          {[0, 1, 2, 3, 4].map(i => (
            <div key={`fsv-e-${i}`} className="absolute" style={{ '--orbit-start': `${i * 72}deg`, '--orbit-r': `${28 + i * 4}px`, animation: `gbaFireSpinEmber 1.2s ease-out ${0.1 + i * 0.06}s forwards`, opacity: 0 } as React.CSSProperties}>
              <svg width="9" height="9" viewBox="0 0 9 9">
                <circle cx="4.5" cy="4.5" r={3.5 - i * 0.4} fill={i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#f97316' : '#ef4444'} opacity="0.9" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 12f. FIRE PUNCH BLAZE (Magmar Fire Punch — fire-wreathed fist lunge with impact burst)
            Magmar's fist rockets forward wreathed in flame; GBA Fire Punch is a straight lunge
            with trailing fire wisps and a hot impact flash. */}
      {fx.type === 'fire_punch_blaze' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Fist shape — Magmar's orange-red fist seen from the front */}
          <div className="absolute" style={{ animation: 'gbaFirePunchLunge 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="64" height="52" viewBox="0 0 64 52" className="drop-shadow-[0_0_20px_#f97316]">
              <defs>
                <linearGradient id="fpGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              {/* Fist mass */}
              <path d="M6 12 Q6 6, 14 5 L50 5 Q58 6, 58 12 L58 34 Q58 42, 50 42 L14 42 Q6 42, 6 34 Z" fill="url(#fpGrad)" stroke="#b91c1c" strokeWidth="2" />
              {/* Knuckles */}
              <ellipse cx="16" cy="8" rx="5.5" ry="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              <ellipse cx="28" cy="6.5" rx="6" ry="4.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              <ellipse cx="40" cy="6.5" rx="6" ry="4.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              <ellipse cx="52" cy="8" rx="5.5" ry="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              {/* Thumb */}
              <path d="M8 30 Q6 26, 12 25 L50 27 Q56 27.5, 56 31 Q56 35, 50 35 L12 34 Q6 33, 8 30 Z" fill="url(#fpGrad)" stroke="#b91c1c" strokeWidth="1.5" />
            </svg>
          </div>
          {/* Fire wisps trailing behind the fist */}
          {[0, 1, 2].map(i => (
            <div key={`fp-flame-${i}`} className="absolute -left-6" style={{ animation: `gbaFirePunchFlame 1.2s ease-out ${0.1 + i * 0.12}s forwards`, opacity: 0 }}>
              <svg width="14" height="18" viewBox="0 0 14 18">
                <path d="M7 18 Q4 12, 5 8 Q3 4, 7 1 Q11 4, 9 8 Q10 12, 7 18 Z" fill={i === 0 ? '#fbbf24' : i === 1 ? '#f97316' : '#ef4444'} opacity="0.85" />
              </svg>
            </div>
          ))}
          {/* Impact burst */}
          <div className="absolute" style={{ animation: 'gbaFirePunchImpact 1.2s ease-out 0.4s forwards', opacity: 0 }}>
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.8" />
              <circle cx="28" cy="28" r="14" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.6" />
              <circle cx="28" cy="28" r="7" fill="#fef3c7" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}


      {/* 12g. FLAME PILLAR (Dark Rapidash — vertical fire column erupting from below)
            A pillar of flame bursts upward beneath the target, GBA-style vertical eruption. */}
      {fx.type === 'flame_pillar' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div className="absolute" style={{ animation: 'gbaFlamePillarRise 1.2s ease-out forwards' }}>
            <svg width="44" height="72" viewBox="0 0 44 72" className="drop-shadow-[0_0_18px_#dc2626]">
              <defs>
                <linearGradient id="fpilGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="40%" stopColor="#f97316" />
                  <stop offset="70%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#fef3c7" />
                </linearGradient>
              </defs>
              <path d="M22 72 Q14 58, 16 44 Q12 32, 18 20 Q14 12, 22 2 Q30 12, 26 20 Q32 32, 28 44 Q30 58, 22 72 Z" fill="url(#fpilGrad)" opacity="0.9" />
              <path d="M22 64 Q18 52, 19 42 Q16 32, 20 22 Q18 14, 22 8 Q26 14, 24 22 Q28 32, 25 42 Q26 52, 22 64 Z" fill="#fbbf24" opacity="0.7" />
              <path d="M22 52 Q20 42, 21 34 Q19 26, 22 18 Q25 26, 23 34 Q24 42, 22 52 Z" fill="#fef3c7" opacity="0.8" />
            </svg>
          </div>
          {[0, 1, 2, 3].map(i => (
            <div key={`fpil-e-${i}`} className="absolute" style={{ '--fx': `${(i - 1.5) * 12}px`, animation: `gbaFlamePillarEmber 1.2s ease-out ${0.2 + i * 0.1}s forwards`, opacity: 0 } as React.CSSProperties}>
              <svg width="8" height="8" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r={3 - i * 0.4} fill={i % 2 === 0 ? '#fbbf24' : '#f97316'} opacity="0.9" />
              </svg>
            </div>
          ))}
          <div className="absolute" style={{ animation: 'gbaFlamePillarGlow 1.2s ease-out 0.1s forwards', opacity: 0 }}>
            <div className="w-16 h-8 rounded-full bg-gradient-to-t from-orange-500/60 to-transparent blur-sm" />
          </div>
        </div>
      )}

      {/* 12h. WILDFIRE SCORCH (Moltres — expanding legendary heat wave, no direct damage)
            Moltres spreads an all-consuming heat wave. GBA Wildfire: organic expanding fire. */}
      {fx.type === 'wildfire_scorch' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Organic expanding flame wave — not a radial gradient circle */}
          <div className="absolute" style={{ animation: 'gbaWildfireWave 1.2s ease-out forwards' }}>
            <svg width="90" height="90" viewBox="0 0 90 90" className="drop-shadow-[0_0_26px_#ef4444]">
              <defs>
                <linearGradient id="wfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef3c7" />
                  <stop offset="40%" stopColor="#fbbf24" />
                  <stop offset="70%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              {/* Organic flame wave shape */}
              <path d="M45 5 Q55 15, 52 25 Q62 18, 64 30 Q74 26, 70 38 Q80 38, 74 48 Q82 54, 72 56 Q76 66, 64 62 Q64 72, 54 68 Q52 78, 45 74 Q38 78, 36 68 Q26 72, 26 62 Q14 66, 18 56 Q8 54, 16 48 Q10 38, 20 38 Q16 26, 26 30 Q28 18, 38 25 Q35 15, 45 5 Z" fill="url(#wfGrad)" opacity="0.85" />
              <path d="M45 20 Q52 26, 50 34 Q58 30, 58 38 Q64 38, 60 46 Q66 50, 58 52 Q60 58, 52 56 Q52 64, 45 60 Q38 64, 38 56 Q30 58, 32 52 Q24 50, 30 46 Q26 38, 32 38 Q32 30, 40 34 Q38 26, 45 20 Z" fill="#fef3c7" opacity="0.5" />
              <circle cx="45" cy="45" r="8" fill="#ffffff" opacity="0.4" />
            </svg>
          </div>
          {/* Organic expanding rings — SVG paths, not CSS borders */}
          <div className="absolute" style={{ animation: 'gbaWildfireRing 1.2s ease-out 0.1s forwards', opacity: 0 }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <path d="M40 6 Q50 12, 48 20 Q58 16, 58 26 Q66 24, 62 34 Q70 36, 64 44 Q70 50, 60 50 Q62 58, 52 56 Q52 64, 44 60 Q42 68, 38 62 Q30 66, 32 58 Q22 60, 26 52 Q16 50, 22 44 Q14 36, 22 34 Q18 24, 26 26 Q28 16, 36 20 Q34 12, 40 6 Z" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaWildfireRing 1.2s ease-out 0.25s forwards', opacity: 0 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <path d="M50 8 Q62 14, 60 24 Q72 20, 72 32 Q82 30, 78 42 Q88 44, 80 52 Q86 60, 74 60 Q76 70, 64 66 Q64 76, 54 72 Q52 80, 48 74 Q40 78, 42 70 Q30 72, 34 64 Q22 62, 28 54 Q18 48, 26 44 Q20 34, 30 34 Q28 24, 38 26 Q36 16, 46 20 Q44 12, 50 8 Z" fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.4" />
            </svg>
          </div>
          {/* Scattered flame sparks */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={`wf-s-${i}`} className="absolute" style={{ '--wx': `${Math.cos(i * Math.PI / 3) * 28}px`, '--wy': `${Math.sin(i * Math.PI / 3) * 28}px`, animation: `gbaWildfireSpark 1.2s ease-out ${0.15 + i * 0.08}s forwards`, opacity: 0 } as React.CSSProperties}>
              <svg width="12" height="14" viewBox="0 0 12 14">
                <path d="M6 14 Q4 10, 5 7 Q3 4, 6 1 Q9 4, 7 7 Q8 10, 6 14 Z" fill={i % 2 === 0 ? '#fbbf24' : '#ef4444'} opacity="0.85" />
              </svg>
            </div>
          ))}
        </div>
      )}


      {/* 12i. FIREBALL BARRAGE (Dark Charizard Continuous Fireball / Dark Charmeleon Fireball
            — sequential fireball volleys with trails and impact bursts) */}
      {fx.type === 'fireball_barrage' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {[0, 1, 2].map(i => (
            <div key={`fb-ball-${i}`} className="absolute" style={{ animation: `gbaFireballLaunch 1.2s cubic-bezier(0.2, 0.8, 0.4, 1) ${i * 0.18}s forwards`, opacity: 0 }}>
              <svg width="32" height="32" viewBox="0 0 32 32" className="drop-shadow-[0_0_14px_#f97316]">
                <circle cx="16" cy="16" r="12" fill="#f97316" />
                <circle cx="16" cy="16" r="8" fill="#fbbf24" />
                <circle cx="14" cy="13" r="4" fill="#fef3c7" opacity="0.8" />
              </svg>
            </div>
          ))}
          <div className="absolute -left-10" style={{ animation: 'gbaFireballTrail 1.2s ease-out 0.1s forwards', opacity: 0 }}>
            <svg width="48" height="16" viewBox="0 0 48 16">
              <path d="M0 5 Q16 3, 44 5" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <path d="M2 10 Q20 10, 46 10" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaFireballImpact 1.2s ease-out 0.45s forwards', opacity: 0 }}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="18" fill="none" stroke="#fbbf24" strokeWidth="2.5" opacity="0.8" />
              <circle cx="24" cy="24" r="10" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.6" />
              <circle cx="24" cy="24" r="5" fill="#fef3c7" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 12j. PLAYING WITH FIRE (Dark Flareon — mischievous flickering flames dancing playfully)
            Flareon toys with fire: small flames pop, flicker and dance around the target. */}
      {fx.type === 'playing_with_fire' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {[0, 1, 2].map(i => (
            <div key={`pwf-${i}`} className="absolute" style={{ transform: `translate(${(i - 1) * 22}px, 0px)`, animation: `gbaPlayFireDance 1.2s ease-out ${i * 0.15}s forwards`, opacity: 0 }}>
              <svg width="18" height="24" viewBox="0 0 18 24">
                <path d="M9 24 Q5 17, 6 12 Q4 7, 9 2 Q14 7, 12 12 Q13 17, 9 24 Z" fill={i === 0 ? '#fbbf24' : i === 1 ? '#f97316' : '#ef4444'} opacity="0.9" />
                <path d="M9 18 Q7 14, 8 10 Q7 6, 9 4 Q11 6, 10 10 Q11 14, 9 18 Z" fill="#fef3c7" opacity="0.7" />
              </svg>
            </div>
          ))}
          <div className="absolute" style={{ animation: 'gbaPlayFireFlicker 1.2s linear 0.2s forwards', opacity: 0 }}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-t from-orange-500/50 to-transparent blur-sm" />
          </div>
          <div className="absolute" style={{ animation: 'gbaPlayFirePop 1.2s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.7" />
              <circle cx="20" cy="20" r="9" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 13. WATER GUN / HYDRO PUMP / WATERFALL (GBA-style water projectile stream with splash)
          Intensity-aware: wi scales stream volume, droplet count, splash force and glow so a
          30-damage Water Gun reads ~20% stronger than the 10-damage stock, and 50 damage
          (base + 2 extra Water Energy) reads ~40% stronger. */}
      {fx.type === 'water_gun_stream' && (() => {
        const wi = Math.max(1, fx.intensity ?? 1);
        return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Main water stream - arcing droplets (scales with intensity) */}
          <div className="absolute" style={{ animation: 'gbaWaterStreamArc 1.2s cubic-bezier(0.2, 0.8, 0.4, 1) forwards', filter: wi > 1.05 ? `drop-shadow(0 0 ${Math.round(4 + (wi - 1) * 12)}px rgba(56,189,248,0.5))` : undefined }}>
            <svg width={Math.round(90 * wi)} height={Math.round(50 * wi)} viewBox="0 0 90 50">
              {/* Stream body - tapered water jet */}
              <path d="M5 25 Q25 18, 45 22 Q65 26, 85 20" fill="none" stroke="url(#waterJetGrad)" strokeWidth={6 * wi} strokeLinecap="round" opacity="0.9" />
              <path d="M8 28 Q30 22, 50 25 Q70 28, 82 24" fill="none" stroke="#7dd3fc" strokeWidth={3 * wi} strokeLinecap="round" opacity="0.7" />
              {/* Highlight core */}
              <path d="M12 24 Q35 19, 55 22 Q72 25, 80 21" fill="none" stroke="#e0f2fe" strokeWidth={2 * wi} strokeLinecap="round" opacity="0.8" />
              <defs>
                <linearGradient id="waterJetGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#7dd3fc" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Water droplets scattering from stream (scale with intensity) */}
          <div className="absolute" style={{ animation: 'gbaWaterDroplet1 1.2s ease-out 0.15s forwards', opacity: 0 }}>
            <svg width={Math.round(12 * wi)} height={Math.round(16 * wi)} viewBox="0 0 12 16">
              <path d="M6 1 Q9 6, 9 9 Q9 13, 6 15 Q3 13, 3 9 Q3 6, 6 1 Z" fill="#38bdf8" opacity="0.9" />
              <ellipse cx="5" cy="8" rx="1.5" ry="2" fill="#bae6fd" opacity="0.7" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaWaterDroplet2 1.2s ease-out 0.25s forwards', opacity: 0 }}>
            <svg width={Math.round(10 * wi)} height={Math.round(14 * wi)} viewBox="0 0 10 14">
              <path d="M5 1 Q7.5 5, 7.5 8 Q7.5 11, 5 13 Q2.5 11, 2.5 8 Q2.5 5, 5 1 Z" fill="#0ea5e9" opacity="0.85" />
              <ellipse cx="4" cy="7" rx="1.2" ry="1.8" fill="#e0f2fe" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaWaterDroplet3 1.2s ease-out 0.35s forwards', opacity: 0 }}>
            <svg width={Math.round(8 * wi)} height={Math.round(12 * wi)} viewBox="0 0 8 12">
              <path d="M4 1 Q6 4, 6 6.5 Q6 9.5, 4 11 Q2 9.5, 2 6.5 Q2 4, 4 1 Z" fill="#7dd3fc" opacity="0.8" />
            </svg>
          </div>
          {/* Extra droplets appear at higher intensity — visibly more water volume */}
          {wi > 1.12 && (
            <div className="absolute" style={{ animation: 'gbaWaterDroplet2 1.2s ease-out 0.42s forwards', opacity: 0 }}>
              <svg width={Math.round(11 * wi)} height={Math.round(15 * wi)} viewBox="0 0 10 14">
                <path d="M5 1 Q7.5 5, 7.5 8 Q7.5 11, 5 13 Q2.5 11, 2.5 8 Q2.5 5, 5 1 Z" fill="#38bdf8" opacity="0.8" />
              </svg>
            </div>
          )}
          {wi > 1.28 && (
            <div className="absolute" style={{ animation: 'gbaWaterDroplet1 1.2s ease-out 0.5s forwards', opacity: 0 }}>
              <svg width={Math.round(9 * wi)} height={Math.round(13 * wi)} viewBox="0 0 12 16">
                <path d="M6 1 Q9 6, 9 9 Q9 13, 6 15 Q3 13, 3 9 Q3 6, 6 1 Z" fill="#0ea5e9" opacity="0.75" />
              </svg>
            </div>
          )}
          {/* Impact splash at target (scales with intensity) */}
          <div className="absolute right-2" style={{ animation: 'gbaWaterSplashImpact 1.2s ease-out 0.4s forwards', opacity: 0 }}>
            <svg width={Math.round(60 * wi)} height={Math.round(50 * wi)} viewBox="0 0 60 50">
              {/* Splash crown */}
              <path d="M30 35 Q20 25, 15 15 Q18 22, 22 28" fill="none" stroke="#7dd3fc" strokeWidth={2.5 * wi} strokeLinecap="round" opacity="0.9" />
              <path d="M30 35 Q35 22, 42 12 Q38 22, 35 28" fill="none" stroke="#38bdf8" strokeWidth={2.5 * wi} strokeLinecap="round" opacity="0.85" />
              <path d="M30 35 Q25 28, 18 22" fill="none" stroke="#bae6fd" strokeWidth={2 * wi} strokeLinecap="round" opacity="0.7" />
              <path d="M30 35 Q38 26, 45 18" fill="none" stroke="#bae6fd" strokeWidth={2 * wi} strokeLinecap="round" opacity="0.7" />
              {/* Splash droplets */}
              <circle cx="14" cy="12" r={2.5 * wi} fill="#7dd3fc" opacity="0.8" />
              <circle cx="44" cy="10" r={2 * wi} fill="#38bdf8" opacity="0.75" />
              <circle cx="25" cy="8" r={1.8 * wi} fill="#bae6fd" opacity="0.7" />
              <circle cx="38" cy="7" r={1.5 * wi} fill="#e0f2fe" opacity="0.65" />
              {/* Extra splash droplets at higher intensity */}
              {wi > 1.12 && <circle cx="10" cy="18" r={2 * wi} fill="#38bdf8" opacity="0.7" />}
              {wi > 1.12 && <circle cx="48" cy="15" r={1.8 * wi} fill="#7dd3fc" opacity="0.65" />}
              {wi > 1.28 && <circle cx="20" cy="5" r={2.2 * wi} fill="#bae6fd" opacity="0.6" />}
              {/* Base splash pool */}
              <ellipse cx="30" cy="40" rx={18 * wi} ry={6 * wi} fill="#0ea5e9" opacity="0.3" />
              <ellipse cx="30" cy="38" rx={12 * wi} ry={4 * wi} fill="#38bdf8" opacity="0.25" />
            </svg>
          </div>
          {/* Trailing mist behind stream (denser at higher intensity) */}
          <div className="absolute -left-4" style={{ animation: 'gbaWaterMistTrail 1.2s ease-out forwards', opacity: 0 }}>
            <svg width={Math.round(40 * wi)} height={Math.round(30 * wi)} viewBox="0 0 40 30">
              <ellipse cx="20" cy="15" rx={16 * wi} ry={8 * wi} fill="#bae6fd" opacity={0.2 + (wi - 1) * 0.15} />
              <ellipse cx="14" cy="12" rx={10 * wi} ry={5 * wi} fill="#e0f2fe" opacity={0.15 + (wi - 1) * 0.1} />
            </svg>
          </div>
        </div>
        );
      })()}

      {/* 14. BUBBLEBEAM / BUBBLE (GBA-style rising iridescent bubbles) */}
      {fx.type === 'bubblebeam' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Large central bubble */}
          <div className="absolute" style={{ animation: 'gbaBubbleRise1 1.25s cubic-bezier(0.25, 0.8, 0.4, 1) forwards' }}>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#67e8f9" strokeWidth="1.5" opacity="0.8" />
              <circle cx="18" cy="18" r="15" fill="url(#bubbleGrad1)" opacity="0.3" />
              <ellipse cx="13" cy="12" rx="4" ry="3" fill="#e0f2fe" opacity="0.6" />
              <circle cx="23" cy="22" r="2" fill="#a5f3fc" opacity="0.4" />
              <defs>
                <radialGradient id="bubbleGrad1" cx="0.35" cy="0.35">
                  <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.5" />
                  <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.3" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          {/* Medium bubble - offset left */}
          <div className="absolute -left-5" style={{ animation: 'gbaBubbleRise2 1.25s cubic-bezier(0.25, 0.8, 0.4, 1) 0.1s forwards', opacity: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="#a5f3fc" strokeWidth="1.2" opacity="0.7" />
              <circle cx="12" cy="12" r="10" fill="#22d3ee" opacity="0.12" />
              <ellipse cx="9" cy="8" rx="3" ry="2" fill="#e0f2fe" opacity="0.5" />
            </svg>
          </div>
          {/* Medium bubble - offset right */}
          <div className="absolute -right-4" style={{ animation: 'gbaBubbleRise3 1.25s cubic-bezier(0.25, 0.8, 0.4, 1) 0.2s forwards', opacity: 0 }}>
            <svg width="28" height="28" viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="12" fill="none" stroke="#67e8f9" strokeWidth="1.3" opacity="0.75" />
              <circle cx="14" cy="14" r="12" fill="#06b6d4" opacity="0.1" />
              <ellipse cx="10" cy="9" rx="3.5" ry="2.5" fill="#cffafe" opacity="0.55" />
            </svg>
          </div>
          {/* Small bubbles cluster */}
          <div className="absolute -left-2 -top-3" style={{ animation: 'gbaBubbleRise2 1.25s ease-out 0.3s forwards', opacity: 0 }}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <circle cx="9" cy="9" r="7" fill="none" stroke="#a5f3fc" strokeWidth="1" opacity="0.6" />
              <ellipse cx="7" cy="6" rx="2" ry="1.5" fill="#e0f2fe" opacity="0.4" />
            </svg>
          </div>
          <div className="absolute right-1 -top-5" style={{ animation: 'gbaBubbleRise1 1.25s ease-out 0.4s forwards', opacity: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.5" fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.55" />
              <ellipse cx="5" cy="5" rx="1.5" ry="1" fill="#cffafe" opacity="0.4" />
            </svg>
          </div>
          {/* Bubble pop sparkle */}
          <div className="absolute" style={{ animation: 'gbaBubblePop 1.25s ease-out 0.6s forwards', opacity: 0 }}>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <line x1="15" y1="5" x2="15" y2="12" stroke="#a5f3fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              <line x1="15" y1="18" x2="15" y2="25" stroke="#a5f3fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              <line x1="5" y1="15" x2="12" y2="15" stroke="#67e8f9" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <line x1="18" y1="15" x2="25" y2="15" stroke="#67e8f9" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
        </div>
      )}

      {/* 15. ICE BEAM / STAR FREEZE (GBA-style ice crystal formation with frost particles) */}
      {(fx.type === 'ice_beam_frost' || fx.type === 'star_freeze') && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Central ice crystal forming - hexagonal snowflake */}
          <div className="absolute" style={{ animation: 'gbaIceCrystalForm 1.25s cubic-bezier(0.2, 0.8, 0.3, 1) forwards' }}>
            <svg width="64" height="64" viewBox="0 0 64 64" className="drop-shadow-[0_0_14px_#67e8f9]">
              {/* Six-fold symmetric ice crystal */}
              <g stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" fill="none">
                <line x1="32" y1="4" x2="32" y2="60" />
                <line x1="8" y1="18" x2="56" y2="46" />
                <line x1="56" y1="18" x2="8" y2="46" />
              </g>
              {/* Branch details */}
              <g stroke="#cffafe" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8">
                <line x1="32" y1="12" x2="26" y2="18" />
                <line x1="32" y1="12" x2="38" y2="18" />
                <line x1="32" y1="52" x2="26" y2="46" />
                <line x1="32" y1="52" x2="38" y2="46" />
                <line x1="14" y1="22" x2="18" y2="28" />
                <line x1="50" y1="42" x2="46" y2="36" />
              </g>
              {/* Center glow */}
              <circle cx="32" cy="32" r="6" fill="#e0f2fe" opacity="0.5" />
              <circle cx="32" cy="32" r="3" fill="#ffffff" opacity="0.7" />
            </svg>
          </div>
          {/* Frost ring expanding */}
          <div className="absolute" style={{ animation: 'gbaIceFrostRing 1.25s ease-out 0.2s forwards', opacity: 0 }}>
            <div className="w-20 h-20 rounded-full border-2 border-cyan-300/60" />
          </div>
          <div className="absolute" style={{ animation: 'gbaIceFrostRing 1.25s ease-out 0.35s forwards', opacity: 0 }}>
            <div className="w-14 h-14 rounded-full border border-cyan-200/40" />
          </div>
          {/* Ice shard particles scattering */}
          <div className="absolute" style={{ animation: 'gbaIceShardScatter1 1.25s ease-out 0.3s forwards', opacity: 0 }}>
            <svg width="10" height="14" viewBox="0 0 10 14">
              <polygon points="5,0 8,5 7,12 5,14 3,12 2,5" fill="#a5f3fc" opacity="0.8" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaIceShardScatter2 1.25s ease-out 0.4s forwards', opacity: 0 }}>
            <svg width="8" height="12" viewBox="0 0 8 12">
              <polygon points="4,0 7,4 6,10 4,12 2,10 1,4" fill="#cffafe" opacity="0.7" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaIceShardScatter3 1.25s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="7" height="10" viewBox="0 0 7 10">
              <polygon points="3.5,0 6,3 5.5,8 3.5,10 1.5,8 1,3" fill="#e0f2fe" opacity="0.65" />
            </svg>
          </div>
          {/* Cold mist at base */}
          <div className="absolute bottom-1" style={{ animation: 'gbaIceMistSpread 1.25s ease-out 0.25s forwards', opacity: 0 }}>
            <svg width="70" height="20" viewBox="0 0 70 20">
              <ellipse cx="35" cy="14" rx="30" ry="5" fill="#bae6fd" opacity="0.2" />
              <ellipse cx="25" cy="12" rx="18" ry="4" fill="#e0f2fe" opacity="0.15" />
            </svg>
          </div>
        </div>
      )}

      {/* 15b. BLIZZARD STORM (Articuno - icy wind + snow particles wrapping around card) */}
      {fx.type === 'blizzard_storm' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Icy mist wrapping the card area */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{ animation: 'gbaBlizzardMistWrap 1.25s ease-out forwards' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/40 via-blue-100/30 to-white/20 backdrop-blur-[1px]" />
          </div>
          {/* Snow particles - multiple sizes, parallax drift */}
          <div className="absolute flex flex-col gap-1" style={{ animation: 'gbaBlizzardSnowDrift1 1.25s linear forwards' }}>
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#e0f2fe]" />
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-100 shadow-[0_0_4px_#cffafe] ml-3" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_8px_#e0f2fe] -ml-1" />
          </div>
          <div className="absolute flex flex-col gap-2 -left-4" style={{ animation: 'gbaBlizzardSnowDrift2 1.25s linear 0.15s forwards', opacity: 0 }}>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-50 shadow-[0_0_5px_#e0f2fe]" />
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#f0f9ff] ml-2" />
          </div>
          <div className="absolute flex flex-col gap-1 right-2 -top-2" style={{ animation: 'gbaBlizzardSnowDrift3 1.25s linear 0.3s forwards', opacity: 0 }}>
            <div className="w-2 h-2 rounded-full bg-white/80 shadow-[0_0_7px_#e0f2fe]" />
            <div className="w-1 h-1 rounded-full bg-cyan-200 shadow-[0_0_4px_#cffafe] ml-4" />
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#f0f9ff] -ml-2" />
          </div>
          {/* Central ice crystal forming */}
          <div className="absolute" style={{ animation: 'gbaIceCrystalGrow 1.2s ease-out 0.2s forwards', opacity: 0 }}>
            <span className="text-4xl select-none drop-shadow-[0_0_15px_#67e8f9]">❄️</span>
          </div>
          {/* Wind streaks */}
          <div className="absolute w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent rounded-full -rotate-12" style={{ animation: 'gbaBlizzardWindStreak 1.25s linear forwards' }} />
          <div className="absolute w-20 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full rotate-6 mt-4" style={{ animation: 'gbaBlizzardWindStreak 1.25s linear 0.2s forwards', opacity: 0 }} />
        </div>
      )}

      {/* 16. SOLAR BEAM CHARGE BLAST (GBA-style charge orb then beam fire) */}
      {fx.type === 'solar_beam_charge_blast' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Charging orb - grows then releases */}
          <div className="absolute" style={{ animation: 'gbaSolarChargeOrb 1.3s cubic-bezier(0.2, 0.8, 0.3, 1) forwards' }}>
            <svg width="50" height="50" viewBox="0 0 50 50" className="drop-shadow-[0_0_20px_#fde047]">
              <circle cx="25" cy="25" r="18" fill="url(#solarOrbGrad)" />
              <circle cx="25" cy="25" r="12" fill="#fef9c3" opacity="0.7" />
              <circle cx="25" cy="25" r="6" fill="#ffffff" opacity="0.9" />
              {/* Solar rays */}
              <g stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.8">
                <line x1="25" y1="2" x2="25" y2="8" />
                <line x1="25" y1="42" x2="25" y2="48" />
                <line x1="2" y1="25" x2="8" y2="25" />
                <line x1="42" y1="25" x2="48" y2="25" />
                <line x1="9" y1="9" x2="13" y2="13" />
                <line x1="37" y1="37" x2="41" y2="41" />
                <line x1="41" y1="9" x2="37" y2="13" />
                <line x1="9" y1="41" x2="13" y2="37" />
              </g>
              <defs>
                <radialGradient id="solarOrbGrad" cx="0.4" cy="0.4">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          {/* Beam firing horizontally after charge */}
          <div className="absolute" style={{ animation: 'gbaSolarBeamFire 1.3s ease-out 0.45s forwards', opacity: 0 }}>
            <svg width="120" height="16" viewBox="0 0 120 16">
              <rect x="0" y="4" width="120" height="8" rx="4" fill="url(#solarBeamGrad)" opacity="0.9" />
              <rect x="5" y="6" width="110" height="4" rx="2" fill="#fef9c3" opacity="0.7" />
              <defs>
                <linearGradient id="solarBeamGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="30%" stopColor="#fde047" />
                  <stop offset="70%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Impact flash at beam end */}
          <div className="absolute right-0" style={{ animation: 'gbaSolarBeamImpact 1.3s ease-out 0.65s forwards', opacity: 0 }}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="14" fill="#fef08a" opacity="0.5" />
              <circle cx="20" cy="20" r="8" fill="#ffffff" opacity="0.7" />
              <g stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.8">
                <line x1="20" y1="2" x2="20" y2="8" />
                <line x1="20" y1="32" x2="20" y2="38" />
                <line x1="2" y1="20" x2="8" y2="20" />
                <line x1="32" y1="20" x2="38" y2="20" />
              </g>
            </svg>
          </div>
          {/* Light particles during charge */}
          <div className="absolute" style={{ animation: 'gbaSolarParticle1 1.3s ease-out 0.1s forwards', opacity: 0 }}>
            <div className="w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_6px_#fde047]" />
          </div>
          <div className="absolute" style={{ animation: 'gbaSolarParticle2 1.3s ease-out 0.2s forwards', opacity: 0 }}>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_5px_#fbbf24]" />
          </div>
        </div>
      )}

      {/* 17. PSYBEAM KALEIDOSCOPE (GBA-style prismatic beam with color rotation) */}
      {fx.type === 'psybeam_kaleidoscope' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Prismatic beam core */}
          <div className="absolute" style={{ animation: 'gbaPsybeamFire 1.2s ease-out forwards' }}>
            <svg width="100" height="20" viewBox="0 0 100 20">
              <rect x="0" y="5" width="100" height="10" rx="5" fill="url(#psybeamGrad)" opacity="0.9" />
              <rect x="5" y="7" width="90" height="6" rx="3" fill="#f0abfc" opacity="0.5" />
              <defs>
                <linearGradient id="psybeamGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                  <stop offset="25%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="75%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Kaleidoscope color orbs orbiting */}
          <div className="absolute" style={{ animation: 'gbaPsybeamOrbit1 1.2s linear forwards' }}>
            <div className="w-3 h-3 rounded-full bg-pink-400 shadow-[0_0_8px_#ec4899]" />
          </div>
          <div className="absolute" style={{ animation: 'gbaPsybeamOrbit2 1.2s linear 0.1s forwards', opacity: 0 }}>
            <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_6px_#a855f7]" />
          </div>
          <div className="absolute" style={{ animation: 'gbaPsybeamOrbit3 1.2s linear 0.2s forwards', opacity: 0 }}>
            <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_6px_#06b6d4]" />
          </div>
          {/* Impact sparkle at beam end */}
          <div className="absolute right-1" style={{ animation: 'gbaPsybeamImpact 1.2s ease-out 0.4s forwards', opacity: 0 }}>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <polygon points="18,2 22,14 34,14 24,22 28,34 18,26 8,34 12,22 2,14 14,14" fill="#f0abfc" stroke="#e879f9" strokeWidth="1" opacity="0.8" />
              <circle cx="18" cy="18" r="5" fill="#ffffff" opacity="0.7" />
            </svg>
          </div>
        </div>
      )}

      {/* 18. LEECH SEED / VINE WHIP (GBA green lash/snap) */}
      {fx.type === 'leech_seed_vines' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="flex flex-col items-center gap-1"
            style={{ animation: 'gbaVineLashSnap 1.2s ease-out forwards' }}
          >
            <span className="text-5xl select-none filter drop-shadow-[0_0_16px_#22c55e]">🌿</span>
            <div className="flex gap-2">
              <span className="text-2xl text-emerald-400 animate-ping">🌱</span>
              <span className="text-2xl text-green-300 animate-ping" style={{ animationDelay: '0.15s' }}>✨</span>
            </div>
          </div>
          <div
            className="absolute w-24 h-1.5 bg-gradient-to-r from-transparent via-green-400 to-white rounded-full"
            style={{ animation: 'gbaVineWhipSnap 1.2s ease-out forwards' }}
          />
        </div>
      )}

      {/* 18b. VINE WHIP LASH (Ivysaur - whip-crack vine arcs) */}
      {fx.type === 'vine_whip_lash' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* First vine whip - arcs from left (thick Ivysaur vine) */}
          <div
            className="absolute"
            style={{ animation: 'gbaVineWhipArc1 1.25s cubic-bezier(0.3, 0.8, 0.2, 1) forwards' }}
          >
            <svg width="100" height="56" viewBox="0 0 100 56" className="drop-shadow-[0_0_8px_#22c55e]">
              <path d="M5 44 Q28 6, 52 22 Q74 36, 92 16" fill="none" stroke="#166534" strokeWidth="8" strokeLinecap="round" />
              <path d="M5 44 Q28 6, 52 22 Q74 36, 92 16" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />
              <path d="M5 44 Q28 6, 52 22 Q74 36, 92 16" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
              {/* Vine tip bulb */}
              <circle cx="92" cy="16" r="4" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
            </svg>
          </div>
          {/* Second vine whip - arcs from right, delayed (thick Ivysaur vine) */}
          <div
            className="absolute"
            style={{ animation: 'gbaVineWhipArc2 1.25s cubic-bezier(0.3, 0.8, 0.2, 1) 0.2s forwards', opacity: 0 }}
          >
            <svg width="100" height="56" viewBox="0 0 100 56" className="-scale-x-100 drop-shadow-[0_0_8px_#16a34a]">
              <path d="M5 38 Q32 8, 58 24 Q76 34, 94 14" fill="none" stroke="#14532d" strokeWidth="7" strokeLinecap="round" />
              <path d="M5 38 Q32 8, 58 24 Q76 34, 94 14" fill="none" stroke="#16a34a" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M5 38 Q32 8, 58 24 Q76 34, 94 14" fill="none" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" />
              {/* Vine tip bulb */}
              <circle cx="94" cy="14" r="3.5" fill="#22c55e" stroke="#16a34a" strokeWidth="1" />
            </svg>
          </div>
          {/* Snap impact flash - SVG starburst */}
          <div className="absolute" style={{ animation: 'gbaVineSnapFlash 1.25s ease-out 0.45s forwards', opacity: 0 }}>
            <svg width="32" height="32" viewBox="0 0 32 32" className="drop-shadow-[0_0_10px_#4ade80]">
              <polygon points="16,2 19,12 30,12 21,18 24,28 16,22 8,28 11,18 2,12 13,12" fill="#bbf7d0" stroke="#4ade80" strokeWidth="1" />
            </svg>
          </div>
          {/* Leaf debris on impact - SVG leaves */}
          <div className="absolute flex gap-2" style={{ animation: 'gbaVineLeafDebris 1.25s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="14" height="12" viewBox="0 0 14 12">
              <path d="M7 0 Q12 3, 12 7 Q12 11, 7 12 Q2 11, 2 7 Q2 3, 7 0 Z" fill="#4ade80" stroke="#22c55e" strokeWidth="0.8" />
              <line x1="7" y1="2" x2="7" y2="10" stroke="#16a34a" strokeWidth="0.8" />
            </svg>
            <svg width="10" height="9" viewBox="0 0 10 9" className="-mt-1">
              <path d="M5 0 Q9 2, 9 5 Q9 8, 5 9 Q1 8, 1 5 Q1 2, 5 0 Z" fill="#86efac" stroke="#4ade80" strokeWidth="0.6" />
              <line x1="5" y1="1.5" x2="5" y2="7.5" stroke="#22c55e" strokeWidth="0.6" />
            </svg>
          </div>
        </div>
      )}

      {/* 18c. SMOKESCREEN CLOUD (Horsea/Magmar - parallax smoke puffs at eye level) */}
      {fx.type === 'smokescreen_cloud' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Main smoke puff - drifts right */}
          <div
            className="absolute"
            style={{ animation: 'gbaSmokescreenDrift1 1.25s ease-out forwards' }}
          >
            <div className="w-14 h-10 rounded-full bg-gradient-to-r from-gray-600/80 via-gray-500/70 to-gray-700/60 blur-[2px] shadow-[0_0_12px_rgba(100,100,100,0.5)]" />
          </div>
          {/* Secondary puff - drifts left, slightly lower */}
          <div
            className="absolute mt-3"
            style={{ animation: 'gbaSmokescreenDrift2 1.25s ease-out 0.15s forwards', opacity: 0 }}
          >
            <div className="w-12 h-8 rounded-full bg-gradient-to-l from-gray-700/70 via-gray-500/60 to-gray-600/50 blur-[2px] shadow-[0_0_10px_rgba(80,80,80,0.4)]" />
          </div>
          {/* Small wisp - higher, faster */}
          <div
            className="absolute -mt-4"
            style={{ animation: 'gbaSmokescreenDrift3 1.25s ease-out 0.3s forwards', opacity: 0 }}
          >
            <div className="w-8 h-6 rounded-full bg-gray-500/50 blur-[3px]" />
          </div>
          {/* Fading opacity overlay to simulate vision obscure */}
          <div className="absolute inset-0 rounded-lg bg-gray-800/20" style={{ animation: 'gbaSmokescreenFade 1.25s ease-out forwards' }} />
        </div>
      )}

      {/* 19. SEISMIC SLAM / EARTHQUAKE (GBA-style ground rupture with rock debris) */}
      {fx.type === 'seismic_slam' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Ground crack lines spreading */}
          <div className="absolute bottom-0" style={{ animation: 'gbaSeismicCrack 1.2s ease-out forwards' }}>
            <svg width="100" height="30" viewBox="0 0 100 30">
              <path d="M50 5 L45 12 L48 18 L42 25" fill="none" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <path d="M50 5 L56 14 L53 20 L58 28" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <path d="M50 8 L38 15 L35 22" fill="none" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M50 8 L62 13 L66 20" fill="none" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          {/* Rock chunks flying up from impact */}
          <div className="absolute" style={{ animation: 'gbaSeismicRock1 1.2s cubic-bezier(0.2, 0.8, 0.4, 1) 0.1s forwards', opacity: 0 }}>
            <svg width="18" height="16" viewBox="0 0 18 16">
              <polygon points="9,0 16,5 14,13 4,14 2,6" fill="#78716c" stroke="#57534e" strokeWidth="1" />
              <line x1="6" y1="4" x2="12" y2="10" stroke="#a8a29e" strokeWidth="1" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaSeismicRock2 1.2s cubic-bezier(0.2, 0.8, 0.4, 1) 0.15s forwards', opacity: 0 }}>
            <svg width="14" height="12" viewBox="0 0 14 12">
              <polygon points="7,0 13,4 11,11 3,10 1,5" fill="#a8a29e" stroke="#78716c" strokeWidth="1" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaSeismicRock3 1.2s cubic-bezier(0.2, 0.8, 0.4, 1) 0.2s forwards', opacity: 0 }}>
            <svg width="12" height="10" viewBox="0 0 12 10">
              <polygon points="6,0 11,3 10,9 2,8 1,4" fill="#57534e" stroke="#44403c" strokeWidth="1" />
            </svg>
          </div>
          {/* Dust cloud at impact point */}
          <div className="absolute bottom-2" style={{ animation: 'gbaSeismicDust 1.2s ease-out 0.25s forwards', opacity: 0 }}>
            <svg width="70" height="30" viewBox="0 0 70 30">
              <ellipse cx="35" cy="20" rx="28" ry="8" fill="#d6a35c" opacity="0.35" />
              <ellipse cx="25" cy="16" rx="16" ry="6" fill="#e0b878" opacity="0.3" />
              <ellipse cx="48" cy="14" rx="14" ry="5" fill="#c2884a" opacity="0.25" />
            </svg>
          </div>
          {/* Shockwave ring on ground */}
          <div className="absolute bottom-1" style={{ animation: 'gbaSeismicWaveRing 1.2s ease-out 0.15s forwards', opacity: 0 }}>
            <div className="w-20 h-8 rounded-[50%] border-2 border-amber-600/50" />
          </div>
        </div>
      )}

      {/* 20. GUILLOTINE (GBA-style blade dropping with impact flash) */}
      {fx.type === 'guillotine_snap' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Falling blade */}
          <div className="absolute" style={{ animation: 'gbaGuillotineBladeFall 1.15s cubic-bezier(0.4, 0, 0.8, 0.6) forwards' }}>
            <svg width="40" height="60" viewBox="0 0 40 60" className="drop-shadow-[0_0_12px_#ef4444]">
              {/* Blade shape - angled guillotine edge */}
              <path d="M8 5 L32 5 L35 10 L35 45 L20 58 L5 45 L5 10 Z" fill="url(#guillotineGrad)" stroke="#991b1b" strokeWidth="1.5" strokeLinejoin="round" />
              {/* Edge highlight */}
              <path d="M10 8 L30 8 L32 12 L32 42 L20 52 L8 42 L8 12 Z" fill="none" stroke="#fca5a5" strokeWidth="1" opacity="0.6" />
              {/* Center line */}
              <line x1="20" y1="8" x2="20" y2="50" stroke="#fecaca" strokeWidth="1" opacity="0.4" />
              <defs>
                <linearGradient id="guillotineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e5e7eb" />
                  <stop offset="60%" stopColor="#9ca3af" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Impact slash lines */}
          <div className="absolute" style={{ animation: 'gbaGuillotineImpactSlash 1.15s ease-out 0.45s forwards', opacity: 0 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
              <line x1="10" y1="30" x2="50" y2="30" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
              <line x1="15" y1="20" x2="45" y2="40" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <line x1="15" y1="40" x2="45" y2="20" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          {/* Impact flash */}
          <div className="absolute" style={{ animation: 'gbaGuillotineFlash 1.15s ease-out 0.5s forwards', opacity: 0 }}>
            <div className="w-16 h-16 rounded-full bg-white/40 blur-sm" />
          </div>
          {/* Speed lines during fall */}
          <div className="absolute -top-4" style={{ animation: 'gbaGuillotineSpeedLines 1.15s ease-out forwards', opacity: 0 }}>
            <svg width="30" height="40" viewBox="0 0 30 40">
              <line x1="8" y1="0" x2="8" y2="30" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              <line x1="15" y1="0" x2="15" y2="35" stroke="#f3f4f6" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <line x1="22" y1="0" x2="22" y2="28" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 20b. CRABHAMMER (Kingler - giant claw slamming down) */}
      {fx.type === 'crab_hammer_slam' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Giant Kingler claw - detailed SVG with shell plating, bumps, serrations */}
          <div className="absolute" style={{ animation: 'gbaCrabHammerSlam 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="110" height="92" viewBox="0 0 110 92" className="drop-shadow-[0_0_18px_#dc2626]">
              <defs>
                <linearGradient id="kgClawG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="45%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
                <linearGradient id="kgShellG" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
              </defs>
              {/* Arm segment */}
              <path d="M6 22 Q12 14, 20 16 Q27 18, 28 25 Q27 32, 20 32 Q12 30, 6 22 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
              <ellipse cx="17" cy="24" rx="5" ry="6" fill="none" stroke="#fca5a5" strokeWidth="1" opacity="0.5" />
              {/* Main palm - large bulbous claw with characteristic bumps */}
              <path d="M24 12 Q38 4, 56 6 Q74 8, 84 20 Q92 32, 90 46 Q88 58, 78 64 Q66 70, 52 66 Q38 62, 32 50 Q26 38, 24 12 Z" fill="url(#kgClawG)" stroke="#7f1d1d" strokeWidth="2.5" />
              {/* Shell plate ridges */}
              <path d="M34 16 Q48 10, 64 12" fill="none" stroke="#fca5a5" strokeWidth="1.5" opacity="0.5" />
              <path d="M32 28 Q48 22, 68 24" fill="none" stroke="#fca5a5" strokeWidth="1.2" opacity="0.45" />
              <path d="M34 42 Q50 36, 70 38" fill="none" stroke="#fca5a5" strokeWidth="1" opacity="0.35" />
              <path d="M36 54 Q52 50, 68 52" fill="none" stroke="#fca5a5" strokeWidth="0.8" opacity="0.3" />
              {/* Kingler's characteristic top spikes */}
              <path d="M38 8 Q41 2, 45 5 Q47 9, 43 11 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />
              <path d="M54 5 Q58 0, 62 3 Q63 7, 58 9 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />
              <path d="M70 12 Q74 6, 78 9 Q78 14, 74 15 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />
              {/* Shell texture dots */}
              <circle cx="42" cy="24" r="2.5" fill="#fca5a5" opacity="0.3" />
              <circle cx="58" cy="18" r="2" fill="#fca5a5" opacity="0.25" />
              <circle cx="68" cy="32" r="2.5" fill="#fca5a5" opacity="0.3" />
              <circle cx="48" cy="38" r="2" fill="#fca5a5" opacity="0.25" />
              {/* Inner mouth gap */}
              <path d="M56 58 Q62 62, 70 62 Q78 62, 82 58 Q80 64, 72 66 Q64 66, 58 62 Z" fill="#fecaca" stroke="#b91c1c" strokeWidth="1" opacity="0.8" />
              {/* LOWER FINGER (base/anvil) */}
              <path d="M72 60 Q80 64, 90 66 Q98 68, 104 64 Q108 60, 106 55 Q100 58, 92 60 Q84 62, 76 58 Z" fill="url(#kgShellG)" stroke="#7f1d1d" strokeWidth="2" />
              {/* Lower finger serrations */}
              <path d="M82 62 L84 58 L86 62 M90 61 L92 57 L94 61" fill="none" stroke="#7f1d1d" strokeWidth="1.5" strokeLinejoin="round" />
              {/* UPPER FINGER (hammer face) */}
              <path d="M40 56 Q46 64, 54 70 Q62 76, 72 74 Q80 72, 78 66 Q72 70, 62 70 Q52 68, 44 58 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
              {/* Upper finger serrations */}
              <path d="M48 64 L50 69 L52 64 M56 67 L58 72 L60 67 M64 69 L66 74 L68 69" fill="none" stroke="#7f1d1d" strokeWidth="1.8" strokeLinejoin="round" />
              {/* Finger joint */}
              <circle cx="72" cy="60" r="4.5" fill="#fca5a5" stroke="#b91c1c" strokeWidth="2" />
              <circle cx="72" cy="60" r="2" fill="#fecaca" opacity="0.6" />
            </svg>
          </div>
          {/* Impact shockwave ring */}
          <div className="absolute w-20 h-20 rounded-full border-3 border-orange-300/80" style={{ animation: 'gbaCrabHammerImpact 1.2s ease-out 0.45s forwards', opacity: 0 }} />
          {/* Impact sparks */}
          <div className="absolute flex gap-2" style={{ animation: 'gbaCrabHammerImpact 1.2s ease-out 0.5s forwards', opacity: 0 }}>
            <span className="text-lg text-orange-300 select-none drop-shadow-[0_0_8px_#fdba74]">✦</span>
            <span className="text-sm text-yellow-200 select-none drop-shadow-[0_0_6px_#fef08a] -mt-2">✧</span>
            <span className="text-lg text-orange-300 select-none drop-shadow-[0_0_8px_#fdba74]">✦</span>
          </div>
          {/* Ground crack debris on impact */}
          <div className="absolute mt-12" style={{ animation: 'gbaCrabHammerImpact 1.2s ease-out 0.55s forwards', opacity: 0 }}>
            <svg width="64" height="22" viewBox="0 0 64 22">
              <path d="M32 2 L27 8 L30 12 L25 18" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <path d="M32 2 L37 9 L34 14 L39 20" fill="none" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M32 4 L28 6 M32 4 L36 7" fill="none" stroke="#a16207" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 20c. COBRA STARE (Dark Arbok) - the hood opens over the chosen Pokémon, then it strikes.
           Nested beats so it reads as one creature: the wrapper rears and lunges, the inner group
           sways like a charmed cobra, and the hood, the pattern, the head and the tongue each run
           their own clock on top of that. */}
      {fx.type === 'cobra_stare' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Beat 0: the light drains out of the victim's card before anything appears */}
          <div
            className="absolute inset-[-14px] rounded-2xl"
            style={{
              animation: 'gbaCobraDread 1.25s ease-in-out forwards',
              opacity: 0,
              background: 'radial-gradient(ellipse at 50% 42%, rgba(88,28,135,0.10) 0%, rgba(30,10,60,0.62) 62%, rgba(8,3,20,0.88) 100%)'
            }}
          />

          <div className="absolute" style={{ animation: 'gbaCobraRear 1.25s cubic-bezier(0.16, 1, 0.3, 1) forwards', opacity: 0 }}>
            <div className="relative" style={{ animation: 'gbaCobraSway 1.25s ease-in-out forwards', transformOrigin: '50% 92%' }}>
              {/* Coiled body the hood rises out of (also carries every gradient the cobra uses) */}
              <svg width="150" height="150" viewBox="0 0 150 150" className="absolute -left-[75px] -top-[75px] overflow-visible">
                <defs>
                  <linearGradient id="cobraBodyGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1e1b4b" />
                    <stop offset="45%" stopColor="#5b21b6" />
                    <stop offset="100%" stopColor="#151038" />
                  </linearGradient>
                  <linearGradient id="cobraHoodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="42%" stopColor="#4c1d95" />
                    <stop offset="100%" stopColor="#170f33" />
                  </linearGradient>
                  <radialGradient id="cobraEyeGrad" cx="50%" cy="45%" r="60%">
                    <stop offset="0%" stopColor="#fef9c3" />
                    <stop offset="45%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#78350f" />
                  </radialGradient>
                </defs>
                <path
                  d="M75 112 C 56 112, 42 124, 48 136 C 55 149, 92 149, 100 136 C 107 125, 96 114, 84 113"
                  fill="url(#cobraBodyGrad)" stroke="#0a0518" strokeWidth="3" strokeLinejoin="round"
                />
                <path d="M52 128 C 62 134, 88 134, 98 127" fill="none" stroke="#c4b5fd" strokeWidth="1.6" opacity="0.45" />
                <path d="M55 137 C 66 143, 86 143, 95 136" fill="none" stroke="#c4b5fd" strokeWidth="1.4" opacity="0.3" />
              </svg>

              {/* The hood: flares open with an overshoot, then holds its spread */}
              <svg
                width="150" height="150" viewBox="0 0 150 150"
                className="absolute -left-[75px] -top-[75px] overflow-visible"
                style={{ animation: 'gbaCobraHoodFlare 1.25s cubic-bezier(0.22, 1.2, 0.36, 1) forwards', transformOrigin: '50% 78%', opacity: 0 }}
              >
                <path
                  d="M75 26 C 103 26, 125 47, 127 72 C 129 95, 110 114, 75 116 C 40 114, 21 95, 23 72 C 25 47, 47 26, 75 26 Z"
                  fill="url(#cobraHoodGrad)" stroke="#0a0518" strokeWidth="3.5" strokeLinejoin="round"
                />
                {/* scalloped rim - the row of scales that catches the light as the hood opens */}
                <path
                  d="M75 26 C 103 26, 125 47, 127 72 C 129 95, 110 114, 75 116 C 40 114, 21 95, 23 72 C 25 47, 47 26, 75 26 Z"
                  fill="none" stroke="#a78bfa" strokeWidth="4" strokeDasharray="3 6" opacity="0.5"
                />
                <path d="M75 34 C 98 34, 118 52, 119 72" fill="none" stroke="#ddd6fe" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
              </svg>

              {/* The hood pattern - Dark Arbok's two false eyes and its fang mark. This is the
                  part of the illustration the move is named after, so it lights up from inside. */}
              <svg
                width="150" height="150" viewBox="0 0 150 150"
                className="absolute -left-[75px] -top-[75px] overflow-visible"
                style={{ animation: 'gbaCobraPatternGlow 1.25s ease-in-out forwards', opacity: 0 }}
              >
                <ellipse cx="55" cy="74" rx="10" ry="14" fill="#e9d5ff" opacity="0.92" />
                <ellipse cx="95" cy="74" rx="10" ry="14" fill="#e9d5ff" opacity="0.92" />
                <ellipse cx="55" cy="75" rx="4" ry="9" fill="#1e1b4b" />
                <ellipse cx="95" cy="75" rx="4" ry="9" fill="#1e1b4b" />
                <path d="M66 96 L75 110 L84 96" fill="none" stroke="#f5d0fe" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
                <path d="M70 98 L72 106 M80 98 L78 106" stroke="#c084fc" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
              </svg>

              {/* Hypnotic rings thrown off the pattern, spinning as they expand */}
              <div className="absolute" style={{ animation: 'gbaCobraHypnoRing 1.25s ease-out 0.22s forwards', opacity: 0 }}>
                <div className="w-24 h-24 rounded-full border-2 border-fuchsia-300/70" />
              </div>
              <div className="absolute" style={{ animation: 'gbaCobraHypnoRing 1.25s ease-out 0.38s forwards', opacity: 0 }}>
                <div className="w-16 h-16 rounded-full border-2 border-purple-200/60" />
              </div>

              {/* The head, riding above the hood and dipping into the strike */}
              <svg
                width="150" height="150" viewBox="0 0 150 150"
                className="absolute -left-[75px] -top-[75px] overflow-visible"
                style={{ animation: 'gbaCobraHeadLift 1.25s cubic-bezier(0.22, 1, 0.36, 1) forwards', transformOrigin: '50% 30%', opacity: 0 }}
              >
                <path
                  d="M75 4 C 90 4, 99 13, 99 22 C 99 30, 92 34, 84 36 L 75 44 L 66 36 C 58 34, 51 30, 51 22 C 51 13, 60 4, 75 4 Z"
                  fill="#4c1d95" stroke="#0a0518" strokeWidth="3" strokeLinejoin="round"
                />
                <path d="M57 18 C 65 12, 85 12, 93 18" fill="none" stroke="#a78bfa" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
                <path d="M75 26 L75 42" stroke="#2e1065" strokeWidth="1.6" opacity="0.6" />
                <ellipse cx="66" cy="22" rx="5.5" ry="4.5" fill="url(#cobraEyeGrad)" />
                <ellipse cx="84" cy="22" rx="5.5" ry="4.5" fill="url(#cobraEyeGrad)" />
                <ellipse cx="66" cy="22" rx="1.6" ry="4" fill="#0a0518" />
                <ellipse cx="84" cy="22" rx="1.6" ry="4" fill="#0a0518" />
                <circle cx="64" cy="20" r="1.2" fill="#fffbeb" opacity="0.9" />
                <circle cx="82" cy="20" r="1.2" fill="#fffbeb" opacity="0.9" />
              </svg>

              {/* Forked tongue: two flicks before it commits */}
              <svg
                width="40" height="40" viewBox="0 0 40 40"
                className="absolute -left-[20px] top-[16px] overflow-visible"
                style={{ animation: 'gbaCobraTongueFlick 1.25s ease-in-out forwards', transformOrigin: '50% 0%' }}
              >
                <path d="M20 2 L20 18 M20 18 L13 30 M20 18 L27 30" stroke="#fb7185" strokeWidth="2.6" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </div>

          {/* The strike landing: a fang-mark burst snapped out under the hood */}
          <div className="absolute" style={{ animation: 'gbaCobraStrikeFlash 1.25s ease-out forwards', opacity: 0 }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <polygon
                points="60,6 70,44 106,32 80,60 114,76 76,76 70,114 56,80 26,102 38,66 6,60 44,52 32,16 54,44"
                fill="#f0abfc" stroke="#fdf4ff" strokeWidth="2" strokeLinejoin="round" opacity="0.85"
              />
            </svg>
          </div>

          {/* Afterimage: the stare keeps sitting on the victim after the sprite is gone */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              animation: 'gbaCobraAfterimage 1.25s ease-out forwards',
              opacity: 0,
              background: 'radial-gradient(circle at 50% 40%, rgba(232,121,249,0.30) 0%, rgba(147,51,234,0.12) 55%, rgba(0,0,0,0) 78%)'
            }}
          />
        </div>
      )}


      {/* 20d. HORN THRUST (Goldeen/Seaking - single horn piercing) */}
      {fx.type === 'horn_thrust' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div className="absolute" style={{ animation: 'gbaHornThrustLunge 1.15s cubic-bezier(0.15, 0.9, 0.3, 1) forwards' }}>
            <div className="relative">
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[28px] border-l-slate-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
              <div className="absolute -left-1 -top-2 w-3 h-4 rounded-full bg-gradient-to-b from-slate-300 to-slate-400 border border-slate-500" />
            </div>
          </div>
          <div className="absolute flex flex-col gap-1 -left-6" style={{ animation: 'gbaHornThrustLunge 1.15s ease-out 0.1s forwards', opacity: 0 }}>
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-white/60 rounded-full" />
            <div className="w-6 h-0.5 bg-gradient-to-r from-transparent to-white/40 rounded-full ml-1" />
          </div>
          <div className="absolute right-2" style={{ animation: 'gbaCrabHammerImpact 1.15s ease-out 0.4s forwards', opacity: 0 }}>
            <span className="text-xl text-white select-none drop-shadow-[0_0_10px_#ffffff]">✦</span>
          </div>
        </div>
      )}

      {/* 21. PIN MISSILE / TWINEEDLE */}
      {fx.type === 'pin_missile_volley' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <div
            className="flex gap-2"
            style={{ animation: 'gbaPinDartBarrage 1.15s ease-out forwards' }}
          >
            <span className="text-3xl text-lime-400">📍</span>
            <span className="text-3xl text-yellow-300 -mt-2">📍</span>
            <span className="text-3xl text-lime-400 mt-2">📍</span>
          </div>
        </div>
      )}

      {/* 22. DRILL PECK / DRILL RUN (GBA-style spinning drill beak thrust) */}
      {fx.type === 'drill_peck_spiral' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Spinning drill cone */}
          <div className="absolute" style={{ animation: 'gbaDrillSpinThrust 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="50" height="70" viewBox="0 0 50 70" className="drop-shadow-[0_0_14px_#f59e0b]">
              {/* Drill cone body */}
              <path d="M25 2 L38 25 L35 45 L25 68 L15 45 L12 25 Z" fill="url(#drillGrad)" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
              {/* Spiral grooves */}
              <path d="M18 20 Q25 18, 32 20" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.8" />
              <path d="M17 30 Q25 28, 33 30" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.7" />
              <path d="M18 40 Q25 38, 32 40" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
              <path d="M20 50 Q25 48, 30 50" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" />
              {/* Highlight edge */}
              <path d="M22 5 L25 60" fill="none" stroke="#fef3c7" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
              <defs>
                <linearGradient id="drillGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Spiral wind lines around drill */}
          <div className="absolute" style={{ animation: 'gbaDrillSpiralWind 1.2s linear forwards', opacity: 0 }}>
            <svg width="70" height="70" viewBox="0 0 70 70">
              <path d="M35 10 Q50 15, 50 35 Q50 55, 35 60" fill="none" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M35 15 Q45 20, 45 35 Q45 50, 35 55" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              <path d="M35 20 Q40 25, 40 35 Q40 45, 35 50" fill="none" stroke="#fff7ed" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
            </svg>
          </div>
          {/* Impact sparks at tip */}
          <div className="absolute -bottom-2" style={{ animation: 'gbaDrillImpactSpark 1.2s ease-out 0.4s forwards', opacity: 0 }}>
            <svg width="40" height="30" viewBox="0 0 40 30">
              <line x1="20" y1="15" x2="8" y2="5" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              <line x1="20" y1="15" x2="32" y2="3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <line x1="20" y1="15" x2="5" y2="20" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <line x1="20" y1="15" x2="36" y2="22" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
        </div>
      )}

      {/* 23. WHIRLWIND / CYCLONE (GBA low side-angle funnel vortex) */}
      {fx.type === 'whirlwind_cyclone' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div className="absolute" style={{ animation: 'gbaFunnelSway 1.2s ease-in-out forwards' }}>
            <svg width="90" height="110" viewBox="0 0 90 110">
              <path d="M15 12 Q45 2, 75 12 Q68 30, 58 48 Q52 66, 48 82 Q46 94, 45 104 Q44 94, 42 82 Q38 66, 32 48 Q22 30, 15 12 Z" fill="url(#funnelGrad)" opacity="0.55" />
              <ellipse cx="45" cy="16" rx="30" ry="7" fill="none" stroke="#7dd3fc" strokeWidth="2.5" opacity="0.9" />
              <ellipse cx="45" cy="36" rx="21" ry="5.5" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.75" transform="rotate(-4 45 36)" />
              <ellipse cx="45" cy="56" rx="13" ry="4" fill="none" stroke="#7dd3fc" strokeWidth="2" opacity="0.6" transform="rotate(5 45 56)" />
              <ellipse cx="45" cy="76" rx="7" ry="3" fill="none" stroke="#bae6fd" strokeWidth="1.5" opacity="0.5" />
              <path d="M20 104 Q30 98, 40 103" fill="none" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <path d="M50 103 Q60 97, 70 102" fill="none" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <defs>
                <linearGradient id="funnelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bae6fd" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute -left-6 top-1/4" style={{ animation: 'gbaWindStreak 1.2s linear forwards', opacity: 0 }}>
            <svg width="60" height="14" viewBox="0 0 60 14">
              <path d="M2 4 Q20 0, 38 5 Q50 8, 58 4" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <path d="M6 10 Q24 6, 44 10" fill="none" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute -right-4 bottom-1/4" style={{ animation: 'gbaWindStreak 1.2s linear 0.2s forwards', opacity: 0 }}>
            <svg width="50" height="12" viewBox="0 0 50 12">
              <path d="M48 3 Q30 0, 12 5 Q5 7, 2 4" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
        </div>
      )}

      {/* 23b. SAND ATTACK THROW (Sandshrew - sand grains hurled at target) */}
      {fx.type === 'sand_attack_throw' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="absolute -left-4 bottom-2" style={{ animation: `gbaSandArc${(i % 3) + 1} 1.2s cubic-bezier(0.2, 0.7, 0.6, 1) ${i * 0.06}s forwards`, opacity: 0 }}>
              <div className="rounded-full" style={{ width: `${8 + (i % 3) * 4}px`, height: `${8 + (i % 3) * 4}px`, background: i % 2 === 0 ? '#d6a35c' : '#c2884a', boxShadow: '0 0 6px rgba(214,163,92,0.6)' }} />
            </div>
          ))}
          <div className="absolute right-4 top-1/3" style={{ animation: 'gbaSandScatter 1.2s ease-out 0.4s forwards', opacity: 0 }}>
            <svg width="60" height="44" viewBox="0 0 60 44">
              <circle cx="12" cy="10" r="2.5" fill="#d6a35c" />
              <circle cx="26" cy="6" r="2" fill="#e0b878" />
              <circle cx="40" cy="12" r="2.8" fill="#c2884a" />
              <circle cx="50" cy="8" r="1.8" fill="#d6a35c" />
              <circle cx="18" cy="24" r="2.2" fill="#e0b878" />
              <circle cx="34" cy="22" r="2.6" fill="#d6a35c" />
              <circle cx="46" cy="26" r="2" fill="#c2884a" />
              <circle cx="8" cy="34" r="1.8" fill="#e0b878" />
              <circle cx="28" cy="36" r="2.4" fill="#d6a35c" />
              <circle cx="44" cy="38" r="2" fill="#c2884a" />
            </svg>
          </div>
          <div className="absolute -left-2 bottom-0" style={{ animation: 'gbaSandOriginPuff 1.2s ease-out forwards', opacity: 0 }}>
            <svg width="40" height="20" viewBox="0 0 40 20">
              <ellipse cx="20" cy="14" rx="16" ry="5" fill="#d6a35c" opacity="0.4" />
              <ellipse cx="12" cy="10" rx="8" ry="4" fill="#e0b878" opacity="0.35" />
            </svg>
          </div>
        </div>
      )}

      {/* 23c. SAND ATTACK DUST (Eevee - blinding dust cloud over target) */}
      {fx.type === 'sand_attack_dust' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div className="absolute" style={{ animation: 'gbaDustCloudPuff 1.25s ease-out forwards' }}>
            <svg width="100" height="70" viewBox="0 0 100 70">
              <ellipse cx="50" cy="40" rx="42" ry="22" fill="#d6a35c" opacity="0.45" />
              <ellipse cx="32" cy="32" rx="22" ry="14" fill="#e0b878" opacity="0.5" />
              <ellipse cx="68" cy="30" rx="20" ry="13" fill="#c2884a" opacity="0.45" />
              <ellipse cx="50" cy="22" rx="16" ry="10" fill="#ead9b0" opacity="0.5" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaDustSwirl 1.25s ease-in-out 0.2s forwards', opacity: 0 }}>
            <svg width="80" height="50" viewBox="0 0 80 50">
              <path d="M8 30 Q22 18, 38 26 Q54 34, 70 22" fill="none" stroke="#e0b878" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <path d="M14 40 Q30 30, 48 36 Q62 42, 72 34" fill="none" stroke="#d6a35c" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
            </svg>
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="absolute" style={{ left: `${30 + i * 14}%`, top: `${35 + (i % 2) * 15}%`, animation: `gbaDustGrain 1.25s ease-out ${0.15 + i * 0.1}s forwards`, opacity: 0 }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: i % 2 === 0 ? '#e0b878' : '#c2884a' }} />
            </div>
          ))}
        </div>
      )}

      {/* 24. PAY DAY COINS (GBA-style golden coins scattering with sparkle) */}
      {fx.type === 'pay_day_coins' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Coin 1 - spinning */}
          <div className="absolute" style={{ animation: 'gbaPayDayCoin1 1.25s cubic-bezier(0.2, 0.7, 0.4, 1) forwards' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" className="drop-shadow-[0_0_6px_#fbbf24]">
              <circle cx="10" cy="10" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="5" fill="none" stroke="#f59e0b" strokeWidth="1" />
              <ellipse cx="8" cy="7" rx="2" ry="1.5" fill="#fef3c7" opacity="0.6" />
            </svg>
          </div>
          {/* Coin 2 */}
          <div className="absolute" style={{ animation: 'gbaPayDayCoin2 1.25s cubic-bezier(0.2, 0.7, 0.4, 1) 0.1s forwards', opacity: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" className="drop-shadow-[0_0_5px_#f59e0b]">
              <circle cx="8" cy="8" r="6.5" fill="#f59e0b" stroke="#b45309" strokeWidth="1.2" />
              <circle cx="8" cy="8" r="4" fill="none" stroke="#fbbf24" strokeWidth="0.8" />
              <ellipse cx="6.5" cy="5.5" rx="1.5" ry="1" fill="#fef3c7" opacity="0.5" />
            </svg>
          </div>
          {/* Coin 3 */}
          <div className="absolute" style={{ animation: 'gbaPayDayCoin3 1.25s cubic-bezier(0.2, 0.7, 0.4, 1) 0.2s forwards', opacity: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.5" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
              <ellipse cx="5.5" cy="5" rx="1.5" ry="1" fill="#fefce8" opacity="0.5" />
            </svg>
          </div>
          {/* Gold sparkle burst */}
          <div className="absolute" style={{ animation: 'gbaPayDaySparkle 1.25s ease-out 0.35s forwards', opacity: 0 }}>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <line x1="18" y1="4" x2="18" y2="12" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <line x1="18" y1="24" x2="18" y2="32" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <line x1="4" y1="18" x2="12" y2="18" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <line x1="24" y1="18" x2="32" y2="18" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <circle cx="18" cy="18" r="3" fill="#fef9c3" opacity="0.6" />
            </svg>
          </div>
        </div>
      )}

      {/* 25. SELFDESTRUCT / EXPLOSION (GBA-style expanding shockwave with debris — enhanced
            with crater, secondary shockwave, ember rain and more detailed core) */}
      {fx.type === 'selfdestruct_shockwave' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Central flash core — larger with inner plasma swirl */}
          <div className="absolute" style={{ animation: 'gbaExplosionCore 1.4s ease-out forwards' }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <defs>
                <radialGradient id="explosionCoreGrad" cx="0.5" cy="0.5">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="25%" stopColor="#fef9c3" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="75%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.3" />
                </radialGradient>
              </defs>
              <circle cx="40" cy="40" r="30" fill="url(#explosionCoreGrad)" />
              <circle cx="40" cy="40" r="16" fill="#ffffff" opacity="0.9" />
              <circle cx="40" cy="40" r="8" fill="#fef08a" opacity="0.8" />
              <path d="M28 30 Q40 22, 52 30 Q44 40, 52 50 Q40 58, 28 50 Q36 40, 28 30Z" fill="#fbbf24" opacity="0.4" />
            </svg>
          </div>
          {/* Expanding shockwave rings — primary */}
          <div className="absolute" style={{ animation: 'gbaExplosionRing 1.4s ease-out 0.1s forwards', opacity: 0 }}>
            <div className="w-28 h-28 rounded-full border-3 border-orange-400/80" />
          </div>
          <div className="absolute" style={{ animation: 'gbaExplosionRing 1.4s ease-out 0.2s forwards', opacity: 0 }}>
            <div className="w-20 h-20 rounded-full border-2 border-yellow-300/70" />
          </div>
          <div className="absolute" style={{ animation: 'gbaExplosionRing 1.4s ease-out 0.35s forwards', opacity: 0 }}>
            <div className="w-36 h-36 rounded-full border-2 border-red-400/50" />
          </div>
          {/* Secondary shockwave — delayed, wider, fainter */}
          <div className="absolute" style={{ animation: 'gbaExplosionRing2 1.4s ease-out 0.5s forwards', opacity: 0 }}>
            <div className="w-40 h-40 rounded-full border-2 border-orange-300/40" />
          </div>
          {/* Debris particles flying outward — more varied shapes */}
          <div className="absolute" style={{ animation: 'gbaExplosionDebris1 1.4s ease-out 0.15s forwards', opacity: 0 }}>
            <div className="w-3 h-3 rounded-sm bg-orange-500 rotate-45" />
          </div>
          <div className="absolute" style={{ animation: 'gbaExplosionDebris2 1.4s ease-out 0.2s forwards', opacity: 0 }}>
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500 rotate-12" />
          </div>
          <div className="absolute" style={{ animation: 'gbaExplosionDebris3 1.4s ease-out 0.25s forwards', opacity: 0 }}>
            <div className="w-2 h-2 rounded-sm bg-yellow-400 -rotate-30" />
          </div>
          <div className="absolute" style={{ animation: 'gbaExplosionDebris4 1.4s ease-out 0.3s forwards', opacity: 0 }}>
            <div className="w-3 h-2 rounded-sm bg-orange-400 rotate-60" />
          </div>
          <div className="absolute" style={{ animation: 'gbaExplosionDebris5 1.4s ease-out 0.22s forwards', opacity: 0 }}>
            <div className="w-2 h-3 rounded-sm bg-amber-500 -rotate-45" />
          </div>
          <div className="absolute" style={{ animation: 'gbaExplosionDebris6 1.4s ease-out 0.28s forwards', opacity: 0 }}>
            <div className="w-2.5 h-2 rounded-sm bg-red-400 rotate-20" />
          </div>
          {/* Ember rain — small glowing particles falling outward after the blast */}
          <div className="absolute" style={{ animation: 'gbaEmberFall1 1.4s ease-out 0.4s forwards', opacity: 0 }}>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          </div>
          <div className="absolute" style={{ animation: 'gbaEmberFall2 1.4s ease-out 0.5s forwards', opacity: 0 }}>
            <div className="w-1 h-1 rounded-full bg-yellow-300" />
          </div>
          <div className="absolute" style={{ animation: 'gbaEmberFall3 1.4s ease-out 0.45s forwards', opacity: 0 }}>
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
          </div>
          <div className="absolute" style={{ animation: 'gbaEmberFall4 1.4s ease-out 0.55s forwards', opacity: 0 }}>
            <div className="w-1 h-1 rounded-full bg-amber-300" />
          </div>
          {/* Crater — dark scorch mark left after the explosion */}
          <div className="absolute bottom-1" style={{ animation: 'gbaCraterAppear 1.4s ease-out 0.6s forwards', opacity: 0 }}>
            <svg width="70" height="24" viewBox="0 0 70 24">
              <ellipse cx="35" cy="14" rx="30" ry="9" fill="#1f2937" opacity="0.5" />
              <ellipse cx="35" cy="13" rx="22" ry="6" fill="#111827" opacity="0.4" />
              <ellipse cx="35" cy="12" rx="12" ry="3" fill="#000000" opacity="0.3" />
              <path d="M10 14 L18 10 L26 14 L35 9 L44 14 L52 10 L60 14" fill="none" stroke="#374151" strokeWidth="1.5" opacity="0.5" />
            </svg>
          </div>
          {/* Smoke wisps rising after blast — larger, layered */}
          <div className="absolute -top-4" style={{ animation: 'gbaExplosionSmoke 1.4s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="70" height="50" viewBox="0 0 70 50">
              <ellipse cx="35" cy="32" rx="24" ry="14" fill="#6b7280" opacity="0.3" />
              <ellipse cx="25" cy="24" rx="16" ry="10" fill="#9ca3af" opacity="0.25" />
              <ellipse cx="45" cy="20" rx="14" ry="9" fill="#6b7280" opacity="0.2" />
              <ellipse cx="35" cy="14" rx="10" ry="6" fill="#d1d5db" opacity="0.15" />
            </svg>
          </div>
        </div>
      )}

      {/* 26. PSYCHIC DISTORTION (GBA-style warping concentric psychic rings) */}
      {fx.type === 'psychic_distortion' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Outer psychic ring */}
          <div className="absolute" style={{ animation: 'gbaPsychicWarpRing 1.2s ease-out forwards' }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="35" fill="none" stroke="#e879f9" strokeWidth="2.5" opacity="0.7" strokeDasharray="8 4" />
            </svg>
          </div>
          {/* Middle ring */}
          <div className="absolute" style={{ animation: 'gbaPsychicWarpRing 1.2s ease-out 0.1s forwards', opacity: 0 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="26" fill="none" stroke="#c084fc" strokeWidth="2" opacity="0.8" strokeDasharray="6 3" />
            </svg>
          </div>
          {/* Inner ring */}
          <div className="absolute" style={{ animation: 'gbaPsychicWarpRing 1.2s ease-out 0.2s forwards', opacity: 0 }}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="17" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.9" strokeDasharray="5 3" />
            </svg>
          </div>
          {/* Central psychic eye/core */}
          <div className="absolute" style={{ animation: 'gbaPsychicCorePulse 1.2s ease-out 0.15s forwards', opacity: 0 }}>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="10" fill="url(#psychicCoreGrad)" />
              <circle cx="15" cy="15" r="5" fill="#f0abfc" opacity="0.8" />
              <circle cx="15" cy="15" r="2" fill="#ffffff" opacity="0.9" />
              <defs>
                <radialGradient id="psychicCoreGrad" cx="0.4" cy="0.4">
                  <stop offset="0%" stopColor="#f5d0fe" />
                  <stop offset="60%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.5" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          {/* Distortion wavy lines */}
          <div className="absolute" style={{ animation: 'gbaPsychicWavyLine 1.2s ease-out 0.25s forwards', opacity: 0 }}>
            <svg width="70" height="20" viewBox="0 0 70 20">
              <path d="M5 10 Q15 4, 25 10 Q35 16, 45 10 Q55 4, 65 10" fill="none" stroke="#d946ef" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute -mt-5" style={{ animation: 'gbaPsychicWavyLine 1.2s ease-out 0.35s forwards', opacity: 0 }}>
            <svg width="60" height="16" viewBox="0 0 60 16">
              <path d="M5 8 Q15 3, 25 8 Q35 13, 45 8 Q52 4, 55 8" fill="none" stroke="#e879f9" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-fuchsia-600/15 backdrop-blur-[1px] rounded-2xl animate-pulse" />
        </div>
      )}

      {/* 26b. CONFUSE RAY (Vulpix, Alakazam, Drowzee, Lapras - GBA-style spinning confusion swirl) */}
      {fx.type === 'confuse_ray_spiral' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Eerie glow blooming behind the swirl */}
          <div
            className="absolute w-28 h-28 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(200,140,255,0.5) 0%, rgba(147,51,234,0.3) 45%, rgba(88,28,135,0) 72%)',
              animation: 'gbaConfuseRayGlow 1.2s ease-out forwards'
            }}
          />
          {/* Main double-armed spiral - spins in place and recedes instead of expanding outward */}
          <div
            className="absolute"
            style={{ animation: 'gbaConfuseRaySpiral 1.2s linear forwards' }}
          >
            <svg width="112" height="112" viewBox="0 0 100 100" className="overflow-visible">
              <path d={CONFUSE_RAY_ARM_A} fill="none" stroke="url(#confuseRayGrad)" strokeWidth="3.4" strokeLinecap="round" />
              <path d={CONFUSE_RAY_ARM_B} fill="none" stroke="url(#confuseRayGrad)" strokeWidth="3.4" strokeLinecap="round" />
              <defs>
                <linearGradient id="confuseRayGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f0abfc" />
                  <stop offset="45%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Counter-rotating inner swirl - the two spinning against each other is the GBA tell.
              It peaks later than the outer spiral so the layers recede at different rates. */}
          <div
            className="absolute"
            style={{ animation: 'gbaConfuseRaySpiralInner 1.2s linear 0.08s forwards', opacity: 0 }}
          >
            <svg width="64" height="64" viewBox="0 0 100 100" className="overflow-visible">
              <path d={CONFUSE_RAY_INNER_A} fill="none" stroke="#e9d5ff" strokeWidth="5.5" strokeLinecap="round" opacity="0.8" />
              <path d={CONFUSE_RAY_INNER_B} fill="none" stroke="#d8b4fe" strokeWidth="5.5" strokeLinecap="round" opacity="0.65" />
            </svg>
          </div>
          {/* The ray itself streaking in and winding up before the swirl locks on */}
          <div className="absolute" style={{ animation: 'gbaConfuseRayInbound 1.2s ease-out forwards' }}>
            <svg width="30" height="30" viewBox="0 0 100 100">
              <path d={CONFUSE_RAY_ARM_A} fill="none" stroke="#f5d0fe" strokeWidth="9" strokeLinecap="round" />
              <circle cx="50" cy="50" r="7" fill="#ffffff" opacity="0.85" />
            </svg>
          </div>
          {/* Confusion sparks circling the swirl */}
          <div className="absolute" style={{ animation: 'gbaConfuseRaySparkle 1.2s linear 0.25s forwards', opacity: 0 }}>
            <span className="text-sm text-fuchsia-200 select-none drop-shadow-[0_0_6px_#c084fc]">✦</span>
          </div>
          <div className="absolute" style={{ animation: 'gbaConfuseRaySparkle2 1.2s linear 0.35s forwards', opacity: 0 }}>
            <span className="text-xs text-violet-200 select-none drop-shadow-[0_0_6px_#a855f7]">✦</span>
          </div>
          {/* Eerie haze over the struck card - unchanged from the previous pass */}
          <div className="absolute inset-0 bg-fuchsia-600/15 backdrop-blur-[1px] rounded-2xl animate-pulse" />
        </div>
      )}

      {/* 27. MEDITATE ZEN (GBA-style concentric psychic rings pulsing outward) */}
      {fx.type === 'meditate_zen' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Inner psychic core */}
          <div className="absolute" style={{ animation: 'gbaMeditateCorePulse 1.3s ease-in-out forwards' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" className="drop-shadow-[0_0_12px_#818cf8]">
              <circle cx="14" cy="14" r="10" fill="#4f46e5" opacity="0.7" />
              <circle cx="14" cy="14" r="6" fill="#818cf8" opacity="0.9" />
              <circle cx="14" cy="14" r="3" fill="#e0e7ff" opacity="0.8" />
            </svg>
          </div>
          {/* Concentric zen rings expanding outward */}
          {[0, 1, 2].map(i => (
            <div key={`zen-ring-${i}`} className="absolute" style={{ animation: `gbaMeditateRingExpand 1.3s ease-out ${0.15 + i * 0.2}s forwards`, opacity: 0 }}>
              <svg width={64 + i * 24} height={64 + i * 24} viewBox={`0 0 ${64 + i * 24} ${64 + i * 24}`}>
                <circle cx={(64 + i * 24) / 2} cy={(64 + i * 24) / 2} r={(52 + i * 20) / 2}
                  fill="none" stroke={i === 0 ? '#818cf8' : i === 1 ? '#a5b4fc' : '#c7d2fe'}
                  strokeWidth={3 - i * 0.5} opacity={0.8 - i * 0.15} />
              </svg>
            </div>
          ))}
          {/* Rising psychic sparkles */}
          {[0, 1, 2, 3].map(i => (
            <div key={`zen-spark-${i}`} className="absolute" style={{ animation: `gbaMeditateSparkle 1.3s ease-out ${0.3 + i * 0.15}s forwards`, opacity: 0 }}>
              <svg width="8" height="8" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r={3 - i * 0.4} fill={i % 2 === 0 ? '#a5b4fc' : '#e0e7ff'} opacity="0.8" />
              </svg>
            </div>
          ))}
          {/* Soft indigo aura glow */}
          <div className="absolute inset-0 rounded-2xl" style={{ animation: 'gbaMeditateAura 1.3s ease-in-out forwards', background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, rgba(79,70,229,0.08) 60%, transparent 100%)' }} />
        </div>
      )}

      {/* 28. SLUDGE BOMB */}
      {fx.type === 'sludge_bomb' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <div
            className="flex flex-col items-center"
            style={{ animation: 'gbaSludgeSplat 1.2s cubic-bezier(0.3, 1.2, 0.4, 1) forwards' }}
          >
            <div className="w-20 h-20 rounded-full bg-purple-950 border-4 border-purple-600 flex items-center justify-center shadow-[0_0_25px_#7e22ce]">
              <span className="text-4xl select-none">🧪</span>
            </div>
          </div>
        </div>
      )}

      {/* 28b. NASTY GOO (Grimer - GBA-style dripping sticky goo splatter) */}
      {fx.type === 'nasty_goo' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Main goo blob dropping from above */}
          <div className="absolute" style={{ animation: 'gbaNastyGooDrop 1.25s cubic-bezier(0.4, 0, 0.6, 1) forwards' }}>
            <svg width="48" height="56" viewBox="0 0 48 56" className="drop-shadow-[0_0_12px_#65a30d]">
              {/* Goo blob body */}
              <ellipse cx="24" cy="36" rx="18" ry="16" fill="#4d7c0f" opacity="0.9" />
              <ellipse cx="24" cy="34" rx="15" ry="13" fill="#65a30d" opacity="0.85" />
              {/* Goo drip tail */}
              <path d="M24 4 Q22 12, 20 20 Q19 26, 24 28 Q29 26, 28 20 Q26 12, 24 4 Z" fill="#4d7c0f" opacity="0.8" />
              {/* Shine */}
              <ellipse cx="18" cy="30" rx="4" ry="5" fill="#a3e635" opacity="0.5" />
              {/* Bubbles in goo */}
              <circle cx="28" cy="38" r="2.5" fill="#84cc16" opacity="0.6" />
              <circle cx="20" cy="42" r="1.8" fill="#a3e635" opacity="0.5" />
            </svg>
          </div>
          {/* Splat spread on impact */}
          <div className="absolute" style={{ animation: 'gbaNastyGooSplat 1.25s ease-out 0.4s forwards', opacity: 0 }}>
            <svg width="80" height="40" viewBox="0 0 80 40">
              {/* Splatter blobs */}
              <ellipse cx="40" cy="24" rx="28" ry="12" fill="#3f6212" opacity="0.7" />
              <ellipse cx="25" cy="20" rx="8" ry="6" fill="#4d7c0f" opacity="0.8" />
              <ellipse cx="55" cy="22" rx="10" ry="7" fill="#4d7c0f" opacity="0.75" />
              <ellipse cx="40" cy="18" rx="12" ry="8" fill="#65a30d" opacity="0.6" />
              {/* Drip strings */}
              <path d="M30 12 Q28 6, 30 2" fill="none" stroke="#4d7c0f" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <path d="M50 10 Q52 5, 50 1" fill="none" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          {/* Sticky drip particles falling */}
          <div className="absolute -bottom-2" style={{ animation: 'gbaNastyGooDrip 1.25s ease-in 0.55s forwards', opacity: 0 }}>
            <div className="flex gap-2">
              <div className="w-2 h-4 rounded-b-full bg-lime-700/80" />
              <div className="w-1.5 h-3 rounded-b-full bg-lime-800/70" />
              <div className="w-2 h-5 rounded-b-full bg-lime-700/60" />
            </div>
          </div>
          {/* Sticky goo bubbles rising */}
          <div className="absolute" style={{ animation: 'gbaNastyGooSpark 1.25s ease-out 0.7s forwards', opacity: 0 }}>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle cx="10" cy="20" r="4" fill="#84cc16" opacity="0.7" />
              <circle cx="20" cy="14" r="3" fill="#a3e635" opacity="0.6" />
              <circle cx="15" cy="8" r="2" fill="#bef264" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 29. SMOG HAZE (GBA-style rolling toxic smoke clouds) */}
      {fx.type === 'smog_haze' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Main smog cloud - drifts right */}
          <div className="absolute" style={{ animation: 'gbaSmogCloudDrift1 1.25s ease-out forwards' }}>
            <svg width="80" height="50" viewBox="0 0 80 50">
              <ellipse cx="40" cy="30" rx="32" ry="16" fill="#4b5563" opacity="0.5" />
              <ellipse cx="28" cy="24" rx="20" ry="12" fill="#6b7280" opacity="0.45" />
              <ellipse cx="52" cy="22" rx="18" ry="10" fill="#374151" opacity="0.4" />
              <ellipse cx="40" cy="18" rx="14" ry="8" fill="#9ca3af" opacity="0.3" />
            </svg>
          </div>
          {/* Secondary smog puff - drifts left, lower */}
          <div className="absolute mt-4" style={{ animation: 'gbaSmogCloudDrift2 1.25s ease-out 0.15s forwards', opacity: 0 }}>
            <svg width="60" height="40" viewBox="0 0 60 40">
              <ellipse cx="30" cy="24" rx="24" ry="12" fill="#374151" opacity="0.45" />
              <ellipse cx="20" cy="18" rx="15" ry="9" fill="#4b5563" opacity="0.4" />
              <ellipse cx="42" cy="16" rx="12" ry="8" fill="#6b7280" opacity="0.35" />
            </svg>
          </div>
          {/* Toxic purple wisps within smog */}
          <div className="absolute" style={{ animation: 'gbaSmogToxicWisp 1.25s ease-out 0.25s forwards', opacity: 0 }}>
            <svg width="50" height="30" viewBox="0 0 50 30">
              <path d="M8 20 Q15 12, 25 16 Q35 20, 42 14" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <path d="M12 25 Q22 18, 32 22 Q40 25, 46 20" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            </svg>
          </div>
          {/* Small smoke particles rising */}
          <div className="absolute -top-2" style={{ animation: 'gbaSmogParticleRise 1.25s ease-out 0.3s forwards', opacity: 0 }}>
            <div className="w-3 h-3 rounded-full bg-gray-500/40 blur-[1px]" />
          </div>
          <div className="absolute -top-1 left-6" style={{ animation: 'gbaSmogParticleRise 1.25s ease-out 0.45s forwards', opacity: 0 }}>
            <div className="w-2 h-2 rounded-full bg-gray-600/35 blur-[1px]" />
          </div>
        </div>
      )}

      {/* 30. DESTINY BOND / NIGHTMARE (GBA-style dark curse with spectral eye and chains) */}
      {(fx.type === 'destiny_bond_curse' || fx.type === 'nightmare_spook') && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Spectral eye forming */}
          <div className="absolute" style={{ animation: 'gbaCurseEyeForm 1.25s ease-out forwards' }}>
            <svg width="50" height="36" viewBox="0 0 50 36" className="drop-shadow-[0_0_14px_#7c3aed]">
              {/* Eye outline */}
              <path d="M25 4 Q40 10, 46 18 Q40 26, 25 32 Q10 26, 4 18 Q10 10, 25 4 Z" fill="none" stroke="#a855f7" strokeWidth="2" />
              {/* Iris */}
              <circle cx="25" cy="18" r="9" fill="#7c3aed" />
              <circle cx="25" cy="18" r="5" fill="#1e1b4b" />
              {/* Pupil slit */}
              <ellipse cx="25" cy="18" rx="2" ry="6" fill="#dc2626" opacity="0.9" />
              {/* Highlight */}
              <circle cx="22" cy="14" r="2" fill="#e9d5ff" opacity="0.6" />
            </svg>
          </div>
          {/* Chain links orbiting */}
          <div className="absolute" style={{ animation: 'gbaCurseChainOrbit 1.25s linear forwards' }}>
            <svg width="70" height="70" viewBox="0 0 70 70">
              <ellipse cx="35" cy="35" rx="30" ry="30" fill="none" stroke="#6b21a8" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaCurseChainOrbit 1.25s linear 0.15s forwards', opacity: 0 }}>
            <svg width="54" height="54" viewBox="0 0 54 54">
              <ellipse cx="27" cy="27" rx="23" ry="23" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5" />
            </svg>
          </div>
          {/* Dark aura pulse */}
          <div className="absolute" style={{ animation: 'gbaCurseAuraPulse 1.25s ease-out 0.2s forwards', opacity: 0 }}>
            <div className="w-20 h-20 rounded-full border border-purple-800/40" />
          </div>
          {/* Shadow wisps rising */}
          <div className="absolute -bottom-2" style={{ animation: 'gbaCurseShadowWisp 1.25s ease-out 0.3s forwards', opacity: 0 }}>
            <svg width="40" height="24" viewBox="0 0 40 24">
              <path d="M8 22 Q12 14, 16 18 Q20 10, 24 16 Q28 8, 32 14" fill="none" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 31. LICK TONGUE (GBA-style tongue lash swipe) */}
      {fx.type === 'lick_tongue' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Tongue shape sweeping across */}
          <div className="absolute" style={{ animation: 'gbaLickTongueSwipe 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="70" height="40" viewBox="0 0 70 40" className="drop-shadow-[0_0_10px_#e879f9]">
              {/* Tongue body - elongated rounded shape */}
              <path d="M5 20 Q15 12, 35 14 Q55 16, 65 20 Q55 24, 35 26 Q15 28, 5 20 Z" fill="url(#tongueGrad)" stroke="#be185d" strokeWidth="1.5" />
              {/* Center line */}
              <path d="M10 20 Q35 18, 60 20" fill="none" stroke="#fda4af" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
              {/* Tip highlight */}
              <ellipse cx="62" cy="20" rx="4" ry="3" fill="#fecdd3" opacity="0.7" />
              <defs>
                <linearGradient id="tongueGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="60%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#fda4af" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Saliva droplets */}
          <div className="absolute" style={{ animation: 'gbaLickDroplet1 1.2s ease-out 0.3s forwards', opacity: 0 }}>
            <svg width="8" height="10" viewBox="0 0 8 10">
              <path d="M4 1 Q6 4, 6 6 Q6 8.5, 4 9.5 Q2 8.5, 2 6 Q2 4, 4 1 Z" fill="#f9a8d4" opacity="0.7" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaLickDroplet2 1.2s ease-out 0.4s forwards', opacity: 0 }}>
            <svg width="6" height="8" viewBox="0 0 6 8">
              <path d="M3 1 Q4.5 3, 4.5 5 Q4.5 7, 3 7.5 Q1.5 7, 1.5 5 Q1.5 3, 3 1 Z" fill="#fbcfe8" opacity="0.6" />
            </svg>
          </div>
          {/* Impact wobble lines */}
          <div className="absolute right-2" style={{ animation: 'gbaLickImpactWobble 1.2s ease-out 0.45s forwards', opacity: 0 }}>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <path d="M8 15 Q12 10, 15 15 Q18 20, 22 15" fill="none" stroke="#f9a8d4" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <path d="M10 20 Q14 16, 18 20" fill="none" stroke="#fbcfe8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 32. LULLABY / SING (GBA-style floating musical notes with sound arcs) */}
      {fx.type === 'sing_lullaby' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Musical note 1 - eighth note */}
          <div className="absolute" style={{ animation: 'gbaSingNoteFloat1 1.3s cubic-bezier(0.25, 0.8, 0.4, 1) forwards' }}>
            <svg width="24" height="32" viewBox="0 0 24 32" className="drop-shadow-[0_0_8px_#f472b6]">
              <ellipse cx="8" cy="26" rx="6" ry="4.5" fill="#f472b6" />
              <rect x="12" y="4" width="2.5" height="22" rx="1" fill="#f472b6" />
              <path d="M14.5 4 Q20 6, 20 12 Q18 8, 14.5 9 Z" fill="#f9a8d4" />
            </svg>
          </div>
          {/* Musical note 2 - beamed pair */}
          <div className="absolute" style={{ animation: 'gbaSingNoteFloat2 1.3s cubic-bezier(0.25, 0.8, 0.4, 1) 0.15s forwards', opacity: 0 }}>
            <svg width="32" height="28" viewBox="0 0 32 28" className="drop-shadow-[0_0_6px_#ec4899]">
              <ellipse cx="7" cy="22" rx="5" ry="4" fill="#ec4899" />
              <ellipse cx="23" cy="20" rx="5" ry="4" fill="#ec4899" />
              <rect x="10.5" y="4" width="2" height="18" rx="1" fill="#ec4899" />
              <rect x="26.5" y="2" width="2" height="18" rx="1" fill="#ec4899" />
              <rect x="10.5" y="3" width="18" height="3" rx="1.5" fill="#f9a8d4" />
            </svg>
          </div>
          {/* Musical note 3 - small quarter note */}
          <div className="absolute" style={{ animation: 'gbaSingNoteFloat3 1.3s cubic-bezier(0.25, 0.8, 0.4, 1) 0.3s forwards', opacity: 0 }}>
            <svg width="16" height="24" viewBox="0 0 16 24">
              <ellipse cx="6" cy="19" rx="4.5" ry="3.5" fill="#fbcfe8" />
              <rect x="9" y="3" width="2" height="16" rx="1" fill="#fbcfe8" />
            </svg>
          </div>
          {/* Sound wave arcs emanating */}
          <div className="absolute -left-4" style={{ animation: 'gbaSingSoundArc 1.3s ease-out forwards', opacity: 0 }}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <path d="M20 8 Q30 14, 30 20 Q30 26, 20 32" fill="none" stroke="#f9a8d4" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <path d="M20 12 Q27 16, 27 20 Q27 24, 20 28" fill="none" stroke="#fbcfe8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          {/* Sparkle trail */}
          <div className="absolute" style={{ animation: 'gbaSingSparkle 1.3s ease-out 0.4s forwards', opacity: 0 }}>
            <span className="text-xs text-pink-200 select-none">✦</span>
          </div>
        </div>
      )}

      {/* 33. STUN GAS (GBA-style yellow paralytic gas cloud with electric sparks) */}
      {fx.type === 'stun_gas' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Main gas cloud */}
          <div className="absolute" style={{ animation: 'gbaStunGasCloudForm 1.25s ease-out forwards' }}>
            <svg width="70" height="50" viewBox="0 0 70 50">
              <ellipse cx="35" cy="28" rx="28" ry="14" fill="#eab308" opacity="0.25" />
              <ellipse cx="25" cy="22" rx="18" ry="10" fill="#facc15" opacity="0.3" />
              <ellipse cx="45" cy="20" rx="16" ry="9" fill="#fde047" opacity="0.25" />
              <ellipse cx="35" cy="16" rx="12" ry="7" fill="#fef9c3" opacity="0.2" />
            </svg>
          </div>
          {/* Paralysis electric sparks within gas */}
          <div className="absolute" style={{ animation: 'gbaStunSpark1 1.25s ease-out 0.2s forwards', opacity: 0 }}>
            <svg width="16" height="20" viewBox="0 0 16 20">
              <path d="M8 1 L5 8 L9 7 L6 14 L11 10 L8 11 L12 4 Z" fill="#fde047" stroke="#eab308" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaStunSpark2 1.25s ease-out 0.35s forwards', opacity: 0 }}>
            <svg width="12" height="16" viewBox="0 0 12 16">
              <path d="M6 1 L4 6 L7 5.5 L4.5 11 L8.5 8 L6 8.5 L9 3 Z" fill="#fef08a" stroke="#facc15" strokeWidth="0.5" />
            </svg>
          </div>
          {/* Rising gas wisps */}
          <div className="absolute -top-2" style={{ animation: 'gbaStunGasRise 1.25s ease-out 0.15s forwards', opacity: 0 }}>
            <svg width="30" height="24" viewBox="0 0 30 24">
              <path d="M8 20 Q12 12, 15 16 Q18 8, 22 14" fill="none" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          {/* Numbness wobble circles */}
          <div className="absolute" style={{ animation: 'gbaStunNumbRing 1.25s ease-out 0.3s forwards', opacity: 0 }}>
            <div className="w-16 h-16 rounded-full border border-yellow-400/40" />
          </div>
        </div>
      )}

      {/* 34. FOUL ODOR (GBA-style stench wavy lines rising) */}
      {fx.type === 'foul_odor' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Stench wavy line 1 */}
          <div className="absolute" style={{ animation: 'gbaFoulStenchWave1 1.25s ease-out forwards' }}>
            <svg width="20" height="50" viewBox="0 0 20 50">
              <path d="M10 48 Q6 40, 10 34 Q14 28, 10 22 Q6 16, 10 10 Q13 5, 10 2" fill="none" stroke="#84cc16" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          {/* Stench wavy line 2 */}
          <div className="absolute -left-4" style={{ animation: 'gbaFoulStenchWave2 1.25s ease-out 0.1s forwards', opacity: 0 }}>
            <svg width="16" height="42" viewBox="0 0 16 42">
              <path d="M8 40 Q5 33, 8 28 Q11 23, 8 18 Q5 13, 8 8 Q10 4, 8 2" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          {/* Stench wavy line 3 */}
          <div className="absolute left-5" style={{ animation: 'gbaFoulStenchWave3 1.25s ease-out 0.2s forwards', opacity: 0 }}>
            <svg width="14" height="36" viewBox="0 0 14 36">
              <path d="M7 34 Q4 28, 7 24 Q10 20, 7 16 Q4 12, 7 8 Q9 4, 7 2" fill="none" stroke="#bef264" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          {/* Green stink cloud at base */}
          <div className="absolute bottom-2" style={{ animation: 'gbaFoulBaseCloud 1.25s ease-out forwards', opacity: 0 }}>
            <svg width="50" height="24" viewBox="0 0 50 24">
              <ellipse cx="25" cy="16" rx="20" ry="7" fill="#65a30d" opacity="0.25" />
              <ellipse cx="18" cy="12" rx="12" ry="5" fill="#84cc16" opacity="0.2" />
            </svg>
          </div>
          {/* Small stink particles */}
          <div className="absolute -top-1" style={{ animation: 'gbaFoulParticle 1.25s ease-out 0.3s forwards', opacity: 0 }}>
            <div className="w-2 h-2 rounded-full bg-lime-400/50 blur-[1px]" />
          </div>
          <div className="absolute -top-2 left-3" style={{ animation: 'gbaFoulParticle 1.25s ease-out 0.45s forwards', opacity: 0 }}>
            <div className="w-1.5 h-1.5 rounded-full bg-lime-300/40 blur-[1px]" />
          </div>
        </div>
      )}

      {/* 35. STUN SPORE (GBA-style yellow spore particles falling with paralysis sparks) */}
      {fx.type === 'stun_spore' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Spore particles falling - staggered */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="absolute top-0" style={{ left: `${15 + i * 16}%`, animation: `gbaStunSporeFall${(i % 2) + 1} 1.25s cubic-bezier(0.3, 0.6, 0.5, 1) ${i * 0.08}s forwards`, opacity: 0 }}>
              <svg width="10" height="10" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r={3 + (i % 2)} fill={i % 2 === 0 ? '#facc15' : '#fde047'} opacity="0.8" />
                <circle cx="4" cy="4" r="1.2" fill="#fef9c3" opacity="0.6" />
              </svg>
            </div>
          ))}
          {/* Paralysis spark at impact */}
          <div className="absolute" style={{ animation: 'gbaStunSporeSpark 1.25s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="24" height="28" viewBox="0 0 24 28">
              <path d="M12 2 L8 10 L13 9 L9 18 L16 12 L11 13 L16 5 Z" fill="#fde047" stroke="#eab308" strokeWidth="0.8" />
            </svg>
          </div>
          {/* Yellow haze overlay */}
          <div className="absolute inset-0 rounded-lg" style={{ animation: 'gbaStunSporeHaze 1.25s ease-out forwards', opacity: 0 }}>
            <div className="absolute inset-0 rounded-lg bg-yellow-400/8" />
          </div>
        </div>
      )}

      {/* 36a. POISON POWDER SHOWER (GBA toxic powder raining over target) */}
      {fx.type === 'poisonpowder_shower' && (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-visible">
          {/* Rising toxic haze at base */}
          <div className="absolute inset-x-0 bottom-1 flex justify-center" style={{ animation: 'gbaPoisonHazeRise 1.25s ease-out forwards', opacity: 0 }}>
            <svg width="90" height="34" viewBox="0 0 90 34">
              <ellipse cx="45" cy="26" rx="40" ry="7" fill="#a855f7" opacity="0.25" />
              <path d="M15 26 Q22 14, 32 22 Q40 8, 50 18 Q58 6, 66 16 Q74 10, 78 22" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          {/* Powder particles with drift physics — each grain sways on its own sine path,
              falls at a different speed and turbulence phase, so the shower reads as a real
              airborne particle cloud instead of rigid vertical columns. */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((p) => {
            const size = 5 + (p % 3) * 2;
            const fill = ['#c084fc', '#a855f7', '#e879f9', '#d946ef', '#e9d5ff'][p % 5];
            const drift = ((p % 2) + 1);
            return (
              <div
                key={`pp-grain-${p}`}
                className="absolute top-0"
                style={{
                  left: `${8 + p * 11.5}%`,
                  animation: `gbaPowderDrift${drift} ${1.05 + (p % 4) * 0.12}s cubic-bezier(0.3, 0.6, 0.5, 1) ${(p % 5) * 0.07}s forwards`,
                  opacity: 0
                }}
              >
                <svg width={size + 4} height={size + 4} viewBox="0 0 12 12">
                  <circle cx="6" cy="6" r={size / 2} fill={fill} opacity="0.85" />
                  <circle cx={5} cy={5} r={size / 5} fill="#f5d0fe" opacity="0.55" />
                </svg>
              </div>
            );
          })}
          {/* Slow heavy motes drifting lower with more turbulence */}
          {[0, 1, 2].map((m) => (
            <div
              key={`pp-mote-${m}`}
              className="absolute top-1/4"
              style={{
                left: `${20 + m * 26}%`,
                animation: `gbaPowderDrift${(m % 2) + 1} ${1.35 + m * 0.1}s cubic-bezier(0.25, 0.55, 0.5, 1) ${0.25 + m * 0.12}s forwards`,
                opacity: 0
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="3.2" fill={m % 2 === 0 ? '#a855f7' : '#c084fc'} opacity="0.7" />
              </svg>
            </div>
          ))}
          {/* Drifting powder puffs */}
          <div className="absolute left-1/4 top-1/3" style={{ animation: 'gbaPowderPuffDrift 1.25s ease-out 0.3s forwards', opacity: 0 }}>
            <svg width="26" height="20" viewBox="0 0 26 20">
              <ellipse cx="13" cy="12" rx="10" ry="5" fill="#c084fc" opacity="0.35" />
              <ellipse cx="9" cy="9" rx="6" ry="3.5" fill="#e879f9" opacity="0.3" />
            </svg>
          </div>
          <div className="absolute right-1/4 top-1/2" style={{ animation: 'gbaPowderPuffDrift 1.25s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="22" height="16" viewBox="0 0 22 16">
              <ellipse cx="11" cy="9" rx="8" ry="4" fill="#a855f7" opacity="0.3" />
            </svg>
          </div>
        </div>
      )}

      {/* 36b. SLEEP POWDER DRIFT (GBA-style purple soporific particles drifting down) */}
      {fx.type === 'sleep_powder_drift' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Purple powder particles drifting down */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="absolute top-0" style={{ left: `${10 + i * 15}%`, animation: `gbaSleepDrift${(i % 3) + 1} 1.3s cubic-bezier(0.3, 0.6, 0.5, 1) ${i * 0.07}s forwards`, opacity: 0 }}>
              <svg width={8 + (i % 3) * 3} height={8 + (i % 3) * 3} viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="4" fill={['#a855f7', '#c084fc', '#e879f9'][i % 3]} opacity="0.75" />
                <circle cx="5" cy="5" r="1.5" fill="#f5d0fe" opacity="0.5" />
              </svg>
            </div>
          ))}
          {/* Zzz letters floating up - GBA style */}
          <div className="absolute -top-2 right-2" style={{ animation: 'gbaSleepZzz1 1.3s ease-out 0.3s forwards', opacity: 0 }}>
            <span className="text-sm font-black text-purple-300 select-none drop-shadow-[0_0_4px_#a855f7]">Z</span>
          </div>
          <div className="absolute -top-4 right-5" style={{ animation: 'gbaSleepZzz2 1.3s ease-out 0.5s forwards', opacity: 0 }}>
            <span className="text-xs font-black text-purple-200 select-none drop-shadow-[0_0_3px_#c084fc]">z</span>
          </div>
          <div className="absolute -top-5 right-7" style={{ animation: 'gbaSleepZzz3 1.3s ease-out 0.7s forwards', opacity: 0 }}>
            <span className="text-[10px] font-black text-fuchsia-200 select-none drop-shadow-[0_0_3px_#e879f9]">z</span>
          </div>
          {/* Drowsy haze */}
          <div className="absolute inset-0 rounded-lg" style={{ animation: 'gbaSleepHaze 1.3s ease-out forwards', opacity: 0 }}>
            <div className="absolute inset-0 rounded-lg bg-purple-500/6" />
          </div>
        </div>
      )}

      {/* 37. POTION (gray-purple round-bulb bottle, card-accurate, grainy GBA fade-out) */}
      {fx.type === 'potion' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
          style={fx.slot === 'bench' ? { transform: 'scale(0.7)' } : undefined}>
          <div
            className="relative flex flex-col items-center justify-center"
            style={{ animation: 'gbaPotionCardHolo 1.4s ease-out forwards' }}
          >
            {/* Potion bottle — stylized stock PNG, white bg extracted via multiply blend */}
            <img
              src="/assets/Potion.png"
              alt="Potion"
              width={64}
              height={84}
              className="object-contain drop-shadow-[0_0_18px_#a78bfa]"
              style={{ mixBlendMode: 'multiply' }}
              draggable={false}
            />
            {/* Grainy noise dissolve overlay */}
            <div className="absolute inset-0" style={{ animation: 'gbaGrainyFadeOut 1.4s steps(6) forwards', opacity: 0 }}>
              <svg width="100%" height="100%" className="absolute inset-0">
                <filter id="potionGrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /><feColorMatrix type="saturate" values="0" /></filter>
                <rect width="100%" height="100%" filter="url(#potionGrain)" opacity="0.8" />
              </svg>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
              <span className="text-sm text-purple-300 animate-ping">✦</span>
              <span className="text-xs text-emerald-300 animate-ping" style={{ animationDelay: '0.2s' }}>✦</span>
              <span className="text-sm text-violet-200 animate-ping" style={{ animationDelay: '0.4s' }}>✦</span>
            </div>
            <div className="absolute -top-3 -right-6 w-9 h-9 rounded-full bg-emerald-400/90 flex items-center justify-center animate-ping border-2 border-emerald-200">
              <span className="text-xs font-black text-white">+20</span>
            </div>
          </div>
        </div>
      )}

      {/* 37b. SUPER POTION (yellow-red angular bottle, card-accurate, grainy GBA fade-out) */}
      {fx.type === 'super_potion' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
          style={fx.slot === 'bench' ? { transform: 'scale(0.7)' } : undefined}>
          <div
            className="relative flex flex-col items-center justify-center"
            style={{ animation: 'gbaSuperPotionCardHolo 1.4s ease-out forwards' }}
          >
            {/* Super Potion bottle — stylized stock PNG, white bg extracted via multiply blend */}
            <img
              src="/assets/Super_Potion.png"
              alt="Super Potion"
              width={64}
              height={84}
              className="object-contain drop-shadow-[0_0_18px_#fbbf24]"
              style={{ mixBlendMode: 'multiply' }}
              draggable={false}
            />
            {/* Grainy noise dissolve overlay */}
            <div className="absolute inset-0" style={{ animation: 'gbaGrainyFadeOut 1.4s steps(6) forwards', opacity: 0 }}>
              <svg width="100%" height="100%" className="absolute inset-0">
                <filter id="superPotionGrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /><feColorMatrix type="saturate" values="0" /></filter>
                <rect width="100%" height="100%" filter="url(#superPotionGrain)" opacity="0.8" />
              </svg>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
              <span className="text-sm text-yellow-300 animate-ping">✦</span>
              <span className="text-xs text-emerald-300 animate-ping" style={{ animationDelay: '0.2s' }}>✦</span>
              <span className="text-sm text-red-300 animate-ping" style={{ animationDelay: '0.4s' }}>✦</span>
            </div>
            <div className="absolute -top-3 -right-6 w-9 h-9 rounded-full bg-emerald-400/90 flex items-center justify-center animate-ping border-2 border-emerald-200">
              <span className="text-xs font-black text-white">+40</span>
            </div>
          </div>
        </div>
      )}

      {/* 38. GUST OF WIND (Trainer card - low side-angle funnel dragging target in) */}
      {fx.type === 'gust' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div className="absolute" style={{ animation: 'gbaFunnelSway 1.25s ease-in-out forwards' }}>
            <svg width="86" height="104" viewBox="0 0 86 104">
              {/* Funnel cone seen from low side angle */}
              <path d="M13 10 Q43 0, 73 10 Q65 28, 56 46 Q50 63, 46 78 Q44 90, 43 100 Q42 90, 40 78 Q36 63, 30 46 Q21 28, 13 10 Z" fill="url(#gustFunnelGrad)" opacity="0.5" />
              {/* Swirl bands */}
              <ellipse cx="43" cy="14" rx="29" ry="6.5" fill="none" stroke="#7dd3fc" strokeWidth="2.5" opacity="0.9" />
              <ellipse cx="43" cy="34" rx="20" ry="5" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.7" transform="rotate(-5 43 34)" />
              <ellipse cx="43" cy="54" rx="12" ry="3.5" fill="none" stroke="#7dd3fc" strokeWidth="2" opacity="0.55" transform="rotate(4 43 54)" />
              <ellipse cx="43" cy="74" rx="6.5" ry="2.5" fill="none" stroke="#bae6fd" strokeWidth="1.5" opacity="0.45" />
              <defs>
                <linearGradient id="gustFunnelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Leaves/debris whipped up by the gust */}
          <div className="absolute left-2 bottom-4" style={{ animation: 'gbaGustLeaf 1.25s ease-out 0.15s forwards', opacity: 0 }}>
            <svg width="12" height="8" viewBox="0 0 12 8"><path d="M1 4 Q6 0, 11 4 Q6 8, 1 4 Z" fill="#86efac" opacity="0.9" /></svg>
          </div>
          <div className="absolute right-4 bottom-6" style={{ animation: 'gbaGustLeaf 1.25s ease-out 0.35s forwards', opacity: 0 }}>
            <svg width="10" height="7" viewBox="0 0 10 7"><path d="M1 3.5 Q5 0, 9 3.5 Q5 7, 1 3.5 Z" fill="#bbf7d0" opacity="0.8" /></svg>
          </div>
          {/* Sweeping wind streaks */}
          <div className="absolute -left-5 top-1/3" style={{ animation: 'gbaWindStreak 1.25s linear forwards', opacity: 0 }}>
            <svg width="56" height="12" viewBox="0 0 56 12">
              <path d="M2 3 Q18 0, 36 4 Q48 7, 54 3" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <path d="M6 9 Q22 5, 42 9" fill="none" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
        </div>
      )}

      {/* 39. ENERGY REMOVAL (GBA-style energy orb being extracted) */}
      {fx.type === 'energy_removal' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible"
          style={fx.slot === 'bench' ? { transform: 'scale(0.7)' } : undefined}>
          {/* Energy orb being pulled out */}
          <div className="absolute" style={{ animation: 'gbaEnergyRemovalPull 1.25s cubic-bezier(0.3, 0.7, 0.5, 1) forwards' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" className="drop-shadow-[0_0_10px_#f59e0b]">
              <circle cx="14" cy="14" r="10" fill="url(#energyOrbGrad)" />
              <circle cx="14" cy="14" r="5" fill="#fef08a" opacity="0.8" />
              <defs>
                <radialGradient id="energyOrbGrad" cx="0.4" cy="0.4">
                  <stop offset="0%" stopColor="#fef9c3" />
                  <stop offset="60%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.6" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          {/* Extraction trail */}
          <div className="absolute" style={{ animation: 'gbaEnergyRemovalTrail 1.25s ease-out 0.1s forwards', opacity: 0 }}>
            <svg width="40" height="12" viewBox="0 0 40 12">
              <path d="M35 6 Q25 4, 15 6 Q8 8, 2 6" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          {/* Label */}
          <div className="absolute -bottom-4" style={{ animation: 'gbaTrainerLabelFade 1.25s ease-out forwards' }}>
            <span className="text-[10px] font-black text-red-400 bg-red-950/80 px-2 py-0.5 rounded-full border border-red-500">-ENERGY</span>
          </div>
        </div>
      )}

      {/* 40. PLUSPOWER / DEFENDER / BARRIER (GBA-style trainer item activation) */}
      {fx.type === 'pluspower' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Power-up aura: warm pulse hugging the card while the item takes hold */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              animation: 'gbaPlusPowerAura 1.25s ease-out forwards',
              opacity: 0,
              boxShadow: '0 0 18px 5px rgba(245,158,11,0.55), inset 0 0 12px 3px rgba(251,191,36,0.4)'
            }}
          />
          {/* Rising energy wash: power flooding the Pokémon bottom-up */}
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <div
              className="absolute inset-0"
              style={{
                animation: 'gbaPlusPowerWash 1.25s ease-out forwards',
                opacity: 0,
                background: 'linear-gradient(to top, rgba(249,115,22,0.55), rgba(251,191,36,0.3) 45%, rgba(251,191,36,0) 72%)'
              }}
            />
          </div>
          {/* PlusPower capsule icon (stock art, white background pre-extracted) */}
          <div className="absolute" style={{ animation: 'gbaPlusPowerIconPop 1.25s ease-out forwards' }}>
            <img
              src="/assets/PlusPower.png"
              alt="PlusPower"
              className="w-16 sm:w-20 md:w-24 h-auto object-contain drop-shadow-[0_0_10px_#f59e0b] select-none"
              draggable={false}
            />
          </div>
          {/* Power sparkles */}
          <div className="absolute -top-2" style={{ animation: 'gbaTrainerSparkle 1.25s ease-out 0.2s forwards', opacity: 0 }}>
            <span className="text-xs text-amber-200 select-none">✦</span>
          </div>
          <div className="absolute top-0 left-6" style={{ animation: 'gbaTrainerSparkle 1.25s ease-out 0.35s forwards', opacity: 0 }}>
            <span className="text-[10px] text-yellow-300 select-none">✦</span>
          </div>
          {/* Label */}
          <div className="absolute -bottom-4" style={{ animation: 'gbaTrainerLabelFade 1.25s ease-out forwards' }}>
            <span className="text-[10px] font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-400">+10 ATK</span>
          </div>
        </div>
      )}
      {fx.type === 'defender' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Shield forming around card */}
          <div className="absolute" style={{ animation: 'gbaDefenderShieldForm 1.25s ease-out forwards' }}>
            <svg width="50" height="56" viewBox="0 0 50 56" className="drop-shadow-[0_0_10px_#3b82f6]">
              <path d="M25 4 L44 12 L44 30 Q44 44, 25 52 Q6 44, 6 30 L6 12 Z" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M25 10 L38 16 L38 29 Q38 40, 25 46 Q12 40, 12 29 L12 16 Z" fill="#3b82f6" opacity="0.15" />
              <path d="M25 16 L32 20 L32 28 Q32 35, 25 39 Q18 35, 18 28 L18 20 Z" fill="#93c5fd" opacity="0.2" />
            </svg>
          </div>
          {/* Label */}
          <div className="absolute -bottom-4" style={{ animation: 'gbaTrainerLabelFade 1.25s ease-out forwards' }}>
            <span className="text-[10px] font-black text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-400">-20 DEF</span>
          </div>
        </div>
      )}
      {fx.type === 'barrier' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Barrier hexagonal shield forming */}
          <div className="absolute" style={{ animation: 'gbaBarrierForm 1.3s ease-out forwards' }}>
            <svg width="70" height="70" viewBox="0 0 70 70" className="drop-shadow-[0_0_12px_#fde047]">
              <polygon points="35,5 60,18 60,52 35,65 10,52 10,18" fill="none" stroke="#fde047" strokeWidth="2.5" strokeLinejoin="round" opacity="0.8" />
              <polygon points="35,12 53,22 53,48 35,58 17,48 17,22" fill="#fde047" opacity="0.1" stroke="#fef08a" strokeWidth="1" />
              <polygon points="35,19 46,26 46,44 35,51 24,44 24,26" fill="#fef9c3" opacity="0.1" />
            </svg>
          </div>
          {/* Barrier shimmer */}
          <div className="absolute" style={{ animation: 'gbaBarrierShimmer 1.3s ease-out 0.2s forwards', opacity: 0 }}>
            <div className="w-16 h-16 rounded-full border border-yellow-200/30" />
          </div>
        </div>
      )}

      {/* 41. PHYSICAL CHARGE (Headbutt, Ram, Take Down, Quick Attack, Flail) - GBA lunge with trail */}
      {fx.type === 'physical_charge' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Charging body silhouette */}
          <div
            className="absolute"
            style={{ animation: 'gbaPhysicalChargeLunge 1.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
          >
            <svg width="52" height="48" viewBox="0 0 52 48" className="drop-shadow-[0_0_18px_#ffffff]">
              {/* Body mass */}
              <ellipse cx="26" cy="26" rx="20" ry="18" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
              {/* Head bump */}
              <circle cx="38" cy="14" r="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Eye */}
              <circle cx="41" cy="12" r="2" fill="#1e293b" />
              {/* Motion emphasis */}
              <path d="M6 20 Q2 26, 6 32" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          {/* Speed trail behind */}
          <div className="absolute -left-10" style={{ animation: 'gbaChargeTrail 1.15s ease-out forwards', opacity: 0 }}>
            <svg width="45" height="36" viewBox="0 0 45 36">
              <path d="M0 8 Q15 8, 35 10" fill="none" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
              <path d="M0 18 Q18 18, 40 18" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />
              <path d="M0 28 Q15 28, 35 26" fill="none" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          {/* Impact burst on arrival */}
          <div className="absolute" style={{ animation: 'gbaChargeImpact 1.15s ease-out 0.4s forwards', opacity: 0 }}>
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100/60 border-2 border-yellow-300/80 shadow-[0_0_20px_#fde047]" />
              <span className="absolute text-2xl text-yellow-200 select-none">✦</span>
            </div>
          </div>
        </div>
      )}

      {/* 41a. FIRE TAKE DOWN (Arcanine / Growlithe) - GBA blazing charge streak with ember trail.
            No figurative wolf shape: the GBA animation is a horizontal fire streak with trailing
            embers and a blazing impact burst — the card art itself identifies the Pokémon. */}
      {fx.type === 'fire_take_down' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Blazing horizontal fire streak — the charge body */}
          <div className="absolute" style={{ animation: 'gbaFireTakeDownLunge 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="80" height="36" viewBox="0 0 80 36" className="drop-shadow-[0_0_20px_#f97316]">
              <defs>
                <linearGradient id="ftdFireGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                  <stop offset="40%" stopColor="#f97316" />
                  <stop offset="80%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#fef3c7" />
                </linearGradient>
              </defs>
              {/* Tapered flame streak */}
              <path d="M4 18 Q20 10, 40 14 Q60 18, 76 16 Q80 18, 76 20 Q60 22, 40 22 Q20 26, 4 18 Z" fill="url(#ftdFireGrad)" opacity="0.9" />
              {/* Inner hot core */}
              <path d="M20 18 Q40 15, 60 17 Q72 18, 60 19 Q40 21, 20 18 Z" fill="#fef3c7" opacity="0.7" />
              {/* Flame licks on top edge */}
              <path d="M30 12 Q33 8, 36 12" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <path d="M48 13 Q51 9, 54 13" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
              <path d="M62 14 Q64 10, 67 14" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          {/* Ember trail behind the charge */}
          <div className="absolute -left-12" style={{ animation: 'gbaFireTakeDownTrail 1.2s ease-out forwards', opacity: 0 }}>
            <svg width="50" height="40" viewBox="0 0 50 40">
              <path d="M0 12 Q15 10, 40 12" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              <path d="M2 20 Q20 20, 48 20" fill="none" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
              <path d="M0 28 Q15 30, 40 28" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          {/* Rising embers scattering on impact */}
          {[0, 1, 2, 3].map(i => (
            <div key={`ftd-ember-${i}`} className="absolute" style={{ animation: `gbaFireTakeDownEmber 1.2s ease-out ${0.35 + i * 0.1}s forwards`, opacity: 0 }}>
              <svg width="10" height="10" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r={4 - i * 0.5} fill={i === 0 ? '#fbbf24' : i === 1 ? '#f97316' : i === 2 ? '#ef4444' : '#dc2626'} opacity="0.9" />
              </svg>
            </div>
          ))}
          {/* Fiery impact burst */}
          <div className="absolute" style={{ animation: 'gbaFireTakeDownImpact 1.2s ease-out 0.45s forwards', opacity: 0 }}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.8" />
              <circle cx="32" cy="32" r="18" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.6" />
              <circle cx="32" cy="32" r="10" fill="#fbbf24" opacity="0.35" />
            </svg>
          </div>
        </div>
      )}

      {/* 41b. STARFISH SLAP (Staryu / Starmie) - Spinning starfish disc striking the target */}
      {fx.type === 'starfish_slap' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Spinning starfish body */}
          <div className="absolute" style={{ animation: 'gbaStarfishSlapSpin 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="60" height="60" viewBox="0 0 60 60" className="drop-shadow-[0_0_14px_#38bdf8]">
              <polygon points="30,2 36,22 56,22 40,34 46,54 30,42 14,54 20,34 4,22 24,22" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
              <circle cx="30" cy="28" r="6" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" opacity="0.9" />
            </svg>
          </div>
          {/* Water splash arc on contact */}
          <div className="absolute" style={{ animation: 'gbaStarfishSlapSplash 1.2s ease-out 0.4s forwards', opacity: 0 }}>
            <svg width="56" height="40" viewBox="0 0 56 40">
              <path d="M8 36 Q14 20, 28 16 Q42 20, 48 36" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <path d="M14 32 Q20 22, 28 19 Q36 22, 42 32" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <circle cx="10" cy="28" r="3" fill="#7dd3fc" opacity="0.7" />
              <circle cx="46" cy="28" r="3" fill="#7dd3fc" opacity="0.7" />
              <circle cx="28" cy="12" r="2.5" fill="#bae6fd" opacity="0.6" />
            </svg>
          </div>
          {/* Impact ring */}
          <div className="absolute" style={{ animation: 'gbaStarfishSlapRing 1.2s ease-out 0.5s forwards', opacity: 0 }}>
            <div className="w-16 h-16 rounded-full border-2 border-sky-300/70" />
          </div>
        </div>
      )}

      {/* 41c. QUICK ATTACK DASH (Eevee / Vaporeon / Rattata) - Blinding speed dash with afterimage */}
      {fx.type === 'quick_attack_dash' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {[0, 1].map(i => (
            <div key={`qa-ghost-${i}`} className="absolute" style={{ animation: `gbaQuickDashGhost 1.15s ease-out ${i * 0.08}s forwards`, opacity: 0 }}>
              <svg width="48" height="36" viewBox="0 0 48 36">
                <ellipse cx="24" cy="20" rx="16" ry="12" fill="#e2e8f0" opacity={0.35 - i * 0.1} />
                <circle cx="36" cy="12" r="7" fill="#f1f5f9" opacity={0.3 - i * 0.1} />
              </svg>
            </div>
          ))}
          <div className="absolute" style={{ animation: 'gbaQuickDashMain 1.15s cubic-bezier(0.15, 0.95, 0.3, 1) forwards' }}>
            <svg width="52" height="40" viewBox="0 0 52 40" className="drop-shadow-[0_0_16px_#f8fafc]">
              <ellipse cx="24" cy="22" rx="18" ry="13" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="40" cy="13" r="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <circle cx="43" cy="11" r="1.8" fill="#1e293b" />
              <path d="M4 18 Q0 22, 4 26" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          <div className="absolute -left-10" style={{ animation: 'gbaQuickDashLines 1.15s ease-out forwards', opacity: 0 }}>
            <svg width="40" height="30" viewBox="0 0 40 30">
              <line x1="0" y1="7" x2="30" y2="7" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <line x1="2" y1="15" x2="38" y2="15" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <line x1="0" y1="23" x2="28" y2="23" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaQuickDashImpact 1.15s ease-out 0.4s forwards', opacity: 0 }}>
            <div className="w-14 h-14 rounded-full bg-white/70 border-2 border-slate-200/80 shadow-[0_0_18px_#f8fafc]" />
          </div>
        </div>
      )}

      {/* 41d. MUD SLAP THROW (Diglett / Geodude) - Mud clod hurled with dirt spray */}
      {fx.type === 'mud_slap_throw' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div className="absolute" style={{ animation: 'gbaMudSlapThrow 1.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="36" height="30" viewBox="0 0 36 30" className="drop-shadow-[0_0_10px_#92400e]">
              <ellipse cx="18" cy="15" rx="14" ry="11" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
              <ellipse cx="14" cy="12" rx="4" ry="3" fill="#a16207" opacity="0.6" />
              <ellipse cx="22" cy="18" rx="3" ry="2.5" fill="#78350f" opacity="0.5" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaMudSlapSpray 1.15s ease-out 0.4s forwards', opacity: 0 }}>
            <svg width="60" height="44" viewBox="0 0 60 44">
              <circle cx="12" cy="30" r="4" fill="#92400e" opacity="0.8" />
              <circle cx="28" cy="14" r="3" fill="#a16207" opacity="0.7" />
              <circle cx="44" cy="28" r="3.5" fill="#78350f" opacity="0.75" />
              <circle cx="20" cy="38" r="2.5" fill="#a16207" opacity="0.6" />
              <circle cx="50" cy="16" r="2" fill="#92400e" opacity="0.5" />
              <circle cx="8" cy="18" r="2" fill="#78350f" opacity="0.55" />
            </svg>
          </div>
          <div className="absolute" style={{ animation: 'gbaMudSlapDust 1.15s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="50" height="20" viewBox="0 0 50 20">
              <ellipse cx="25" cy="14" rx="22" ry="6" fill="#a16207" opacity="0.3" />
              <ellipse cx="15" cy="10" rx="8" ry="5" fill="#92400e" opacity="0.25" />
              <ellipse cx="35" cy="10" rx="8" ry="5" fill="#78350f" opacity="0.2" />
            </svg>
          </div>
        </div>
      )}
      {/* 41e. FISH FLAIL (Magikarp-specific: red-orange body, whiskers, crown fin, flopping thrash) */}
      {fx.type === 'fish_flail' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Magikarp body thrashing — species-accurate with whiskers and crown fin */}
          <div className="absolute" style={{ animation: 'gbaFishFlailThrash 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="64" height="44" viewBox="0 0 64 44" className="drop-shadow-[0_0_12px_#f97316]">
              <defs>
                <linearGradient id="mkBodyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="60%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              {/* Main body — large ovoid */}
              <ellipse cx="30" cy="24" rx="22" ry="14" fill="url(#mkBodyGrad)" stroke="#c2410c" strokeWidth="2" />
              {/* Tail fin — forked */}
              <path d="M50 20 L62 12 L60 22 L62 32 L50 28 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
              {/* Crown dorsal fin — Magikarp's signature three-point crown */}
              <path d="M22 10 L25 4 L28 10" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
              <path d="M28 10 L31 3 L34 10" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
              <path d="M34 10 L37 5 L40 10" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
              {/* Whiskers — Magikarp's barbels */}
              <path d="M10 20 Q5 16, 3 12" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 26 Q5 30, 3 34" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
              {/* Eye */}
              <circle cx="14" cy="20" r="3" fill="#1e293b" />
              <circle cx="13" cy="19" r="1" fill="#e2e8f0" />
              {/* Mouth — wide open flop */}
              <path d="M8 24 Q10 27, 14 26" fill="none" stroke="#7f1d1d" strokeWidth="1.5" strokeLinecap="round" />
              {/* Pectoral fin */}
              <path d="M24 32 Q28 38, 34 36 Q30 34, 26 30 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1" />
              {/* Scale pattern */}
              <path d="M24 18 Q28 16, 32 18" fill="none" stroke="#fbbf24" strokeWidth="0.8" opacity="0.5" />
              <path d="M26 24 Q30 22, 34 24" fill="none" stroke="#fbbf24" strokeWidth="0.8" opacity="0.4" />
              <path d="M30 20 Q34 18, 38 20" fill="none" stroke="#fbbf24" strokeWidth="0.8" opacity="0.45" />
            </svg>
          </div>
          {/* Water droplets flying off */}
          {[0, 1, 2, 3].map(i => (
            <div key={`ff-drop-${i}`} className="absolute" style={{ animation: `gbaFishFlailDrop 1.2s ease-out ${0.25 + i * 0.12}s forwards`, opacity: 0 }}>
              <svg width="8" height="8" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r={4 - i * 0.5} fill={i % 2 === 0 ? '#60a5fa' : '#93c5fd'} opacity="0.8" />
              </svg>
            </div>
          ))}
          {/* Splash ring */}
          <div className="absolute" style={{ animation: 'gbaFishFlailSplash 1.2s ease-out 0.5s forwards', opacity: 0 }}>
            <div className="w-16 h-16 rounded-full border-2 border-blue-300/70" />
          </div>
        </div>
      )}





      {/* 41f. CLOYSTER CLAMP (anatomical bivalve: two spiked shell halves slam shut on the target).
            Cloyster's shell is purple-gray with jagged outward spikes and a toothed lip; the two
            halves arc in from above and below and clamp together with a squeeze burst. */}
      {fx.type === 'cloyster_clamp' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Upper shell half — arcs down */}
          <div className="absolute" style={{ animation: 'gbaCloysterClampUpper 1.2s cubic-bezier(0.3, 0.8, 0.2, 1) forwards' }}>
            <svg width="96" height="56" viewBox="0 0 96 56" className="drop-shadow-[0_0_14px_#7c3aed]">
              <defs>
                <linearGradient id="clShellTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="55%" stopColor="#6d28d9" />
                  <stop offset="100%" stopColor="#4c1d95" />
                </linearGradient>
              </defs>
              {/* Dome */}
              <path d="M6 50 Q10 18, 48 10 Q86 18, 90 50 Z" fill="url(#clShellTop)" stroke="#3b0764" strokeWidth="2" />
              {/* Jagged spikes on top ridge */}
              <path d="M20 22 L24 10 L28 21 Z" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1" />
              <path d="M40 14 L45 3 L50 13 Z" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1" />
              <path d="M60 15 L66 5 L70 16 Z" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1" />
              <path d="M76 24 L82 13 L85 25 Z" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1" />
              {/* Shell ridges */}
              <path d="M14 40 Q48 26, 82 40" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.5" />
              <path d="M18 32 Q48 20, 78 32" fill="none" stroke="#c4b5fd" strokeWidth="1" opacity="0.4" />
              {/* Toothed lip (inner edge) */}
              <path d="M8 50 L16 45 L24 50 L32 45 L40 50 L48 45 L56 50 L64 45 L72 50 L80 45 L88 50" fill="none" stroke="#ede9fe" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Lower shell half — arcs up */}
          <div className="absolute" style={{ animation: 'gbaCloysterClampLower 1.2s cubic-bezier(0.3, 0.8, 0.2, 1) forwards' }}>
            <svg width="96" height="48" viewBox="0 0 96 48" className="drop-shadow-[0_0_14px_#7c3aed]">
              <defs>
                <linearGradient id="clShellBot" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="55%" stopColor="#5b21b6" />
                  <stop offset="100%" stopColor="#3b0764" />
                </linearGradient>
              </defs>
              {/* Inverted dome */}
              <path d="M6 6 Q10 38, 48 44 Q86 38, 90 6 Z" fill="url(#clShellBot)" stroke="#3b0764" strokeWidth="2" />
              {/* Downward spikes */}
              <path d="M24 34 L28 45 L32 33 Z" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1" />
              <path d="M44 38 L48 47 L52 38 Z" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1" />
              <path d="M64 33 L68 44 L72 32 Z" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1" />
              {/* Toothed lip (inner edge) */}
              <path d="M8 6 L16 11 L24 6 L32 11 L40 6 L48 11 L56 6 L64 11 L72 6 L80 11 L88 6" fill="none" stroke="#ede9fe" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Squeeze impact burst when the halves clamp shut */}
          {!fx.whiffed && (
            <div className="absolute" style={{ animation: 'gbaCloysterClampBurst 1.2s ease-out 0.62s forwards', opacity: 0 }}>
              <svg width="70" height="70" viewBox="0 0 70 70">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                  <line key={`cl-burst-${deg}`} x1="35" y1="35" x2="35" y2="10"
                    stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round"
                    transform={`rotate(${deg} 35 35)`} opacity="0.85" />
                ))}
                <circle cx="35" cy="35" r="9" fill="#ede9fe" opacity="0.8" />
              </svg>
            </div>
          )}
          {/* Purple pressure shockwave ring */}
          {!fx.whiffed && (
            <div className="absolute" style={{ animation: 'gbaCloysterClampRing 1.2s ease-out 0.68s forwards', opacity: 0 }}>
              <div className="w-24 h-24 rounded-full border-2 border-violet-300/70" />
            </div>
          )}
        </div>
      )}


      {/* 41g. CLOYSTER SPIKE CANNON (anatomical shell spikes fired like artillery — replaces emoji pins).
            Gray conical spikes with darker ridges streak across the card, staggered, each trailing
            a faint motion line and bursting into sparks on arrival. */}
      {fx.type === 'cloyster_spike_cannon' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {[0, 1, 2, 3].map(i => (
            <div key={`cl-spike-${i}`} className="absolute" style={{
              animation: `gbaCloysterSpikeFly 1.2s cubic-bezier(0.2, 0.8, 0.4, 1) ${i * 0.09}s forwards`,
              opacity: 0,
              transform: `translateY(${(i - 1.5) * 9}px)`
            }}>
              <svg width="46" height="18" viewBox="0 0 46 18" className="drop-shadow-[0_0_8px_#94a3b8]">
                {/* Spike cone pointing right */}
                <path d="M2 4 L40 9 L2 14 Q0 9, 2 4 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" strokeLinejoin="round" />
                {/* Darker base band */}
                <path d="M2 4 Q0 9, 2 14 L8 12 L8 6 Z" fill="#64748b" opacity="0.8" />
                {/* Ridge lines */}
                <path d="M10 6 L34 8.5" fill="none" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.6" />
                <path d="M10 12 L34 9.5" fill="none" stroke="#475569" strokeWidth="0.8" opacity="0.6" />
                {/* Sharp tip highlight */}
                <path d="M34 8.5 L40 9 L34 9.5 Z" fill="#e2e8f0" opacity="0.9" />
              </svg>
            </div>
          ))}
          {/* Impact spark burst at the target */}
          {!fx.whiffed && (
            <div className="absolute right-1" style={{ animation: 'gbaCloysterSpikeBurst 1.2s ease-out 0.5s forwards', opacity: 0 }}>
              <svg width="52" height="52" viewBox="0 0 52 52">
                {[15, 75, 135, 195, 255, 315].map(deg => (
                  <line key={`cl-spark-${deg}`} x1="26" y1="26" x2="26" y2="8"
                    stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round"
                    transform={`rotate(${deg} 26 26)`} opacity="0.85" />
                ))}
                <circle cx="26" cy="26" r="7" fill="#f8fafc" opacity="0.6" />
              </svg>
            </div>
          )}
          {/* Shell-fragment shrapnel scattering */}
          {!fx.whiffed && (
            <div className="absolute" style={{ animation: 'gbaCloysterSpikeShards 1.2s ease-out 0.58s forwards', opacity: 0 }}>
              <svg width="60" height="40" viewBox="0 0 60 40">
                <polygon points="12,20 18,16 16,24" fill="#94a3b8" opacity="0.8" />
                <polygon points="30,8 36,6 33,13" fill="#64748b" opacity="0.7" />
                <polygon points="44,26 50,24 47,31" fill="#cbd5e1" opacity="0.7" />
                <polygon points="24,32 29,30 27,36" fill="#475569" opacity="0.6" />
              </svg>
            </div>
          )}
        </div>
      )}


      {/* 41h. WATERFALL SURF (Seaking — a rising, cresting wave cascade; deliberately distinct from
            Water Gun's horizontal jet). A blue water wall surges upward, foam curls at the crest,
            droplets scatter, then the wave crashes back down in a splash pool. */}
      {fx.type === 'waterfall_surf' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Rising wave wall — stacked scalloped bands */}
          <div className="absolute" style={{ animation: 'gbaWaterfallSurge 1.25s cubic-bezier(0.25, 0.7, 0.4, 1) forwards' }}>
            <svg width="86" height="96" viewBox="0 0 86 96" className="drop-shadow-[0_0_14px_#38bdf8]">
              <defs>
                <linearGradient id="wfWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="35%" stopColor="#38bdf8" />
                  <stop offset="75%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#075985" />
                </linearGradient>
              </defs>
              {/* Back band */}
              <path d="M4 96 L4 34 Q14 22, 26 30 Q38 14, 52 26 Q64 12, 76 24 Q82 28, 82 36 L82 96 Z" fill="url(#wfWaveGrad)" opacity="0.55" />
              {/* Front band with crest curl */}
              <path d="M10 96 L10 48 Q22 34, 34 44 Q46 26, 58 40 Q70 30, 78 42 L78 96 Z" fill="url(#wfWaveGrad)" opacity="0.85" />
              {/* Foam crest highlights */}
              <path d="M12 46 Q22 34, 34 43" fill="none" stroke="#f0f9ff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
              <path d="M36 42 Q46 27, 58 39" fill="none" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              <path d="M60 39 Q69 31, 77 41" fill="none" stroke="#f0f9ff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              {/* Back crest foam */}
              <path d="M8 33 Q14 23, 25 29" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M52 25 Q62 13, 74 23" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
              {/* Flow streaks inside the wall */}
              <path d="M24 60 Q30 70, 26 84" fill="none" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              <path d="M48 58 Q54 70, 50 86" fill="none" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
              <path d="M66 62 Q70 72, 67 84" fill="none" stroke="#bae6fd" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
            </svg>
          </div>
          {/* Foam bubbles popping at the crest */}
          {[0, 1, 2, 3].map(i => (
            <div key={`wf-foam-${i}`} className="absolute -top-2" style={{ animation: `gbaWaterfallFoam 1.25s ease-out ${0.2 + i * 0.12}s forwards`, opacity: 0 }}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r={4.5 - i * 0.6} fill="none" stroke="#e0f2fe" strokeWidth="1.2" opacity="0.85" />
                <circle cx="4.5" cy="4.5" r="1.2" fill="#f0f9ff" opacity="0.7" />
              </svg>
            </div>
          ))}
          {/* Scattering spray droplets */}
          {[0, 1, 2, 3].map(i => (
            <div key={`wf-drop-${i}`} className="absolute" style={{ animation: `gbaWaterfallSpray 1.25s ease-out ${0.3 + i * 0.1}s forwards`, opacity: 0 }}>
              <svg width="9" height="12" viewBox="0 0 9 12">
                <path d="M4.5 1 Q7 5, 7 7.5 Q7 10.5, 4.5 11 Q2 10.5, 2 7.5 Q2 5, 4.5 1 Z" fill={i % 2 === 0 ? '#38bdf8' : '#7dd3fc'} opacity="0.85" />
              </svg>
            </div>
          ))}
          {/* Crash splash pool at the base */}
          <div className="absolute -bottom-2" style={{ animation: 'gbaWaterfallSplashPool 1.25s ease-out 0.6s forwards', opacity: 0 }}>
            <svg width="96" height="26" viewBox="0 0 96 26">
              <ellipse cx="48" cy="18" rx="42" ry="6" fill="#0ea5e9" opacity="0.35" />
              <ellipse cx="34" cy="14" rx="16" ry="4" fill="#38bdf8" opacity="0.3" />
              <ellipse cx="64" cy="13" rx="14" ry="4" fill="#7dd3fc" opacity="0.28" />
              <path d="M14 12 Q20 6, 26 11 M42 10 Q48 4, 54 10 M68 11 Q74 6, 80 12" fill="none" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
        </div>
      )}


      {/* 42. DEFENSIVE HARDEN (Harden, Withdraw, Minimize, Stiffen) - GBA hexagonal shield forming */}
      {fx.type === 'defensive_harden' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Hexagonal shield forming */}
          <div
            className="absolute"
            style={{ animation: 'gbaHardenShieldPulse 1.2s ease-out forwards' }}
          >
            <svg width="72" height="72" viewBox="0 0 72 72" className="drop-shadow-[0_0_16px_#94a3b8]">
              {/* Hexagonal shield outline */}
              <polygon points="36,4 62,18 62,50 36,68 10,50 10,18" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinejoin="round" />
              {/* Inner hexagon fill */}
              <polygon points="36,10 56,21 56,47 36,60 16,47 16,21" fill="#64748b" opacity="0.3" />
              {/* Metallic sheen */}
              <polygon points="36,10 56,21 56,34 36,26 16,34 16,21" fill="#cbd5e1" opacity="0.4" />
              {/* Center emblem */}
              <circle cx="36" cy="36" r="8" fill="#94a3b8" opacity="0.6" stroke="#e2e8f0" strokeWidth="1.5" />
            </svg>
          </div>
          {/* Pulse ring expanding */}
          <div className="absolute" style={{ animation: 'gbaHardenPulseRing 1.2s ease-out 0.3s forwards', opacity: 0 }}>
            <div className="w-24 h-24 rounded-full border-2 border-slate-300/60" />
          </div>
          {/* Harden sparkle dots */}
          <div className="absolute" style={{ animation: 'gbaHardenSparkle 1.2s ease-out 0.2s forwards', opacity: 0 }}>
            <span className="text-sm text-slate-200 select-none">✦</span>
          </div>
          <div className="absolute -top-3 -right-3" style={{ animation: 'gbaHardenSparkle 1.2s ease-out 0.4s forwards', opacity: 0 }}>
            <span className="text-xs text-slate-300 select-none">✦</span>
          </div>
        </div>
      )}

      {/* 43. RECOVER HEAL (Recover, Spacing Out) - GBA rising green sparkles + cross */}
      {fx.type === 'recover_heal' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Central healing glow */}
          <div
            className="absolute"
            style={{ animation: 'gbaRecoverGlowRise 1.25s ease-out forwards' }}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-400/30 border-2 border-emerald-300/50 flex items-center justify-center shadow-[0_0_25px_#4ade80]">
              {/* Green cross */}
              <svg width="28" height="28" viewBox="0 0 28 28">
                <rect x="10" y="2" width="8" height="24" rx="2" fill="#4ade80" />
                <rect x="2" y="10" width="24" height="8" rx="2" fill="#4ade80" />
              </svg>
            </div>
          </div>
          {/* Rising sparkle particles */}
          <div className="absolute" style={{ animation: 'gbaRecoverSparkle1 1.25s ease-out 0.15s forwards', opacity: 0 }}>
            <span className="text-lg text-emerald-300 select-none drop-shadow-[0_0_8px_#6ee7b7]">✦</span>
          </div>
          <div className="absolute -left-4" style={{ animation: 'gbaRecoverSparkle2 1.25s ease-out 0.3s forwards', opacity: 0 }}>
            <span className="text-sm text-green-200 select-none drop-shadow-[0_0_6px_#4ade80]">✦</span>
          </div>
          <div className="absolute -right-3" style={{ animation: 'gbaRecoverSparkle1 1.25s ease-out 0.45s forwards', opacity: 0 }}>
            <span className="text-base text-emerald-200 select-none drop-shadow-[0_0_6px_#34d399]">✦</span>
          </div>
          {/* Soft green aura ring */}
          <div className="absolute" style={{ animation: 'gbaRecoverAura 1.25s ease-out 0.2s forwards', opacity: 0 }}>
            <div className="w-24 h-24 rounded-full border border-emerald-300/40" />
          </div>
        </div>
      )}

      {/* 44a. STONE BARRAGE SINGLE ROCK (Geodude — one small rock per heads, sequential beats).
            variantSeed picks one of five landing spots so consecutive rocks scatter across the
            card instead of all hitting the same point. The rock keeps tumbling as it travels. */}
      {fx.type === 'stone_barrage_single' && (() => {
        const ROCK_TARGETS = [
          { x: -14, y: -8 },
          { x: 10, y: -12 },
          { x: -6, y: 10 },
          { x: 14, y: 6 },
          { x: 2, y: -4 }
        ];
        const spot = ROCK_TARGETS[(fx.variantSeed ?? 0) % ROCK_TARGETS.length];
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
            {/* Tumbling rock — angular, jagged, geologically layered: concave fracture
                notches, sharp protrusions, sedimentary strata and mineral flecks.
                ~30% larger than previous version for better visibility. */}
            <div className="absolute" style={{
              animation: 'gbaSingleRockToss 0.85s cubic-bezier(0.25, 0.6, 0.5, 1) forwards',
              ['--rock-x' as string]: `${spot.x}px`,
              ['--rock-y' as string]: `${spot.y}px`
            }}>
              <svg width="36" height="31" viewBox="0 0 36 31" className="drop-shadow-[0_0_7px_#78716c]">
                <defs>
                  <linearGradient id="rockStrataSB" x1="0" y1="0" x2="0.3" y2="1">
                    <stop offset="0%" stopColor="#b8b2ac" />
                    <stop offset="40%" stopColor="#78716c" />
                    <stop offset="100%" stopColor="#4a4540" />
                  </linearGradient>
                </defs>
                {/* Body — jagged angular silhouette with concave notches and sharp spurs */}
                <polygon points="18,0 24,2 28,1 33,6 31,10 35,14 33,19 34,24 29,28 24,31 19,29 14,31 9,28 5,30 2,24 0,19 3,14 1,9 5,5 8,2 13,3" fill="url(#rockStrataSB)" stroke="#3d3833" strokeWidth="1.5" strokeLinejoin="miter" />
                {/* Concave chip notches to break the rounded feel */}
                <polygon points="28,1 30,4 26,5" fill="#3d3833" opacity="0.35" />
                <polygon points="1,9 4,10 2,13" fill="#3d3833" opacity="0.3" />
                <polygon points="34,24 31,22 33,19" fill="#3d3833" opacity="0.3" />
                {/* Sedimentary strata bands */}
                <path d="M4 10 L14 8 L26 11 L33 13" fill="none" stroke="#d6d3d1" strokeWidth="1.1" opacity="0.5" />
                <path d="M2 17 L12 15 L24 17 L34 19" fill="none" stroke="#a8a29e" strokeWidth="1" opacity="0.45" />
                <path d="M5 24 L15 22 L26 24 L30 26" fill="none" stroke="#57534e" strokeWidth="1" opacity="0.5" />
                {/* Fracture cracks — angular, not curved */}
                <path d="M15 3 L18 10 L14 17 L17 23" fill="none" stroke="#3d3833" strokeWidth="1.1" strokeLinecap="butt" opacity="0.7" />
                <path d="M25 6 L22 13 L25 16" fill="none" stroke="#3d3833" strokeWidth="0.9" strokeLinecap="butt" opacity="0.6" />
                <path d="M8 12 L11 16" fill="none" stroke="#3d3833" strokeWidth="0.8" strokeLinecap="butt" opacity="0.55" />
                {/* Mineral flecks */}
                <circle cx="10" cy="8" r="1.1" fill="#e7e5e4" opacity="0.7" />
                <circle cx="26" cy="14" r="1" fill="#d6d3d1" opacity="0.6" />
                <circle cx="18" cy="25" r="0.9" fill="#e7e5e4" opacity="0.5" />
                <circle cx="30" cy="20" r="0.8" fill="#f5f5f4" opacity="0.5" />
                {/* Top highlight facet — angular */}
                <polygon points="18,1 25,3 22,9 14,8 11,4" fill="#d6d3d1" opacity="0.4" />
              </svg>
            </div>
            {/* Impact burst only on a connected hit (heads); tails is skipped entirely by the UI.
                Outer div owns the landing-spot translate, inner div owns the scale animation so
                the two transforms never fight over the same property. */}
            {!fx.whiffed && (
              <div className="absolute" style={{ transform: `translate(${spot.x}px, ${spot.y}px)` }}>
                <div style={{ animation: 'gbaRockImpactBurst 0.5s ease-out 0.55s forwards', opacity: 0 }}>
                  <svg width="34" height="34" viewBox="0 0 34 34">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                      <line key={deg} x1="17" y1="17" x2="17" y2="4"
                        stroke="#d6a35c" strokeWidth="2.5" strokeLinecap="round"
                        transform={`rotate(${deg} 17 17)`} opacity="0.9" />
                    ))}
                    <circle cx="17" cy="17" r="6" fill="#fef3c7" opacity="0.8" />
                  </svg>
                </div>
              </div>
            )}
            {/* Dust puff at the landing spot */}
            {!fx.whiffed && (
              <div className="absolute" style={{ transform: `translate(${spot.x}px, ${spot.y + 6}px)` }}>
                <div style={{ animation: 'gbaRockDustPuff 0.6s ease-out 0.6s forwards', opacity: 0 }}>
                  <svg width="24" height="16" viewBox="0 0 24 16">
                    <ellipse cx="12" cy="10" rx="10" ry="5" fill="#a8a29e" opacity="0.5" />
                    <ellipse cx="8" cy="8" rx="5" ry="3" fill="#d6d3d1" opacity="0.4" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* 44b. BIG BOULDER (Graveler Rock Throw — one large boulder with a heavy impact).
            The boulder is roughly 2× the small rocks and the impact burst is 1.5–2× bigger
            than the standard rock impact to sell the Stage 1 power difference. */}
      {fx.type === 'big_boulder' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible" style={{ transform: `scale(${fx.whiffed ? (fx.intensity ?? 1) * 0.7 : (fx.intensity ?? 1)})`, transformOrigin: 'center' }}>
          {/* Large boulder — full geological rework: heavy angular mass
              with strata bands, deep fracture cracks, embedded mineral chunks, chipped spurs
              and micro-texture pitting for realistic stone.
              Intensity-aware: Graveler (40 dmg) renders at 1.0, Onix (10 dmg) at 0.4.
              Whiffed (confusion tails) beats shrink the boulder by 30 %. */}
          <div className="absolute" style={{ animation: 'gbaBigBoulderToss 1.1s cubic-bezier(0.2, 0.65, 0.5, 1) forwards' }}>
            <svg width="67" height="60" viewBox="0 0 67 60" className="drop-shadow-[0_0_16px_#78716c]">
              <defs>
                <radialGradient id="boulderCoreGB" cx="0.35" cy="0.3">
                  <stop offset="0%" stopColor="#d6d3d1" />
                  <stop offset="40%" stopColor="#a8a29e" />
                  <stop offset="75%" stopColor="#78716c" />
                  <stop offset="100%" stopColor="#4a4540" />
                </radialGradient>
              </defs>
              {/* Body — heavy angular mass with sharp spurs and concave chips */}
              <polygon points="32,0 44,3 52,1 60,8 64,16 67,26 63,36 66,44 58,52 48,58 36,60 24,57 14,60 6,52 0,42 2,32 0,22 5,12 10,5 20,2" fill="url(#boulderCoreGB)" stroke="#3d3833" strokeWidth="2.4" strokeLinejoin="miter" />
              {/* Concave chip notches breaking the silhouette */}
              <polygon points="52,1 56,5 50,6" fill="#3d3833" opacity="0.35" />
              <polygon points="0,22 4,24 1,28" fill="#3d3833" opacity="0.3" />
              <polygon points="66,44 62,42 64,38" fill="#3d3833" opacity="0.3" />
              <polygon points="14,60 17,56 12,55" fill="#3d3833" opacity="0.25" />
              {/* Strata bands wrapping the mass */}
              <path d="M6 16 L24 12 L46 15 L62 20" fill="none" stroke="#e7e5e4" strokeWidth="1.6" opacity="0.5" />
              <path d="M2 32 L22 28 L48 31 L65 35" fill="none" stroke="#a8a29e" strokeWidth="1.5" opacity="0.5" />
              <path d="M5 46 L26 42 L50 45 L60 50" fill="none" stroke="#57534e" strokeWidth="1.5" opacity="0.55" />
              {/* Deep fracture cracks radiating from stress points — angular */}
              <path d="M28 6 L33 18 L27 32 L32 46" fill="none" stroke="#3d3833" strokeWidth="2" strokeLinecap="butt" opacity="0.75" />
              <path d="M33 18 L42 24 L50 19" fill="none" stroke="#3d3833" strokeWidth="1.5" strokeLinecap="butt" opacity="0.65" />
              <path d="M27 32 L18 38 L12 36" fill="none" stroke="#3d3833" strokeWidth="1.3" strokeLinecap="butt" opacity="0.6" />
              <path d="M42 38 L48 48" fill="none" stroke="#3d3833" strokeWidth="1.3" strokeLinecap="butt" opacity="0.55" />
              <path d="M50 10 L46 18" fill="none" stroke="#3d3833" strokeWidth="1.1" strokeLinecap="butt" opacity="0.5" />
              {/* Embedded mineral chunks */}
              <polygon points="40,12 47,14 46,22 39,20" fill="#e7e5e4" stroke="#a8a29e" strokeWidth="0.9" opacity="0.8" />
              <polygon points="14,26 20,28 18,36 12,33" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="0.9" opacity="0.7" />
              <polygon points="48,36 54,38 52,44 46,42" fill="#e7e5e4" stroke="#a8a29e" strokeWidth="0.9" opacity="0.65" />
              <polygon points="22,48 27,50 25,55 20,53" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="0.8" opacity="0.6" />
              {/* Mineral flecks + micro-texture pitting */}
              <circle cx="22" cy="14" r="1.3" fill="#f5f5f4" opacity="0.7" />
              <circle cx="54" cy="26" r="1.1" fill="#e7e5e4" opacity="0.6" />
              <circle cx="26" cy="50" r="1.2" fill="#d6d3d1" opacity="0.6" />
              <circle cx="40" cy="52" r="1" fill="#e7e5e4" opacity="0.5" />
              <circle cx="58" cy="32" r="0.9" fill="#f5f5f4" opacity="0.5" />
              <circle cx="12" cy="42" r="1" fill="#d6d3d1" opacity="0.55" />
              <circle cx="35" cy="8" r="0.8" fill="#e7e5e4" opacity="0.5" />
              {/* Micro pitting dots for stone texture */}
              <circle cx="30" cy="22" r="0.6" fill="#3d3833" opacity="0.4" />
              <circle cx="44" cy="28" r="0.5" fill="#3d3833" opacity="0.35" />
              <circle cx="20" cy="34" r="0.6" fill="#3d3833" opacity="0.35" />
              <circle cx="38" cy="42" r="0.5" fill="#3d3833" opacity="0.3" />
              <circle cx="52" cy="44" r="0.5" fill="#3d3833" opacity="0.3" />
              {/* Top-left light facet — angular */}
              <polygon points="32,2 46,5 42,16 28,14 16,7" fill="#e7e5e4" opacity="0.35" />
            </svg>
          </div>
          {/* Heavy impact burst — 1.5–2× the standard rock impact */}
          {!fx.whiffed && (
            <div className="absolute" style={{ animation: 'gbaBigRockImpactBurst 0.65s ease-out 0.6s forwards', opacity: 0 }}>
              <svg width="58" height="58" viewBox="0 0 58 58">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                  <line key={deg} x1="29" y1="29" x2="29" y2="6"
                    stroke="#d6a35c" strokeWidth="3.5" strokeLinecap="round"
                    transform={`rotate(${deg} 29 29)`} opacity="0.9" />
                ))}
                <circle cx="29" cy="29" r="10" fill="#fef3c7" opacity="0.85" />
              </svg>
            </div>
          )}
          {/* Larger dust cloud — outer div offsets, inner div runs the scale animation */}
          {!fx.whiffed && (
            <div className="absolute" style={{ transform: 'translateY(10px) scale(1.4)' }}>
              <div style={{ animation: 'gbaRockDustPuff 0.7s ease-out 0.65s forwards', opacity: 0 }}>
                <svg width="30" height="20" viewBox="0 0 30 20">
                  <ellipse cx="15" cy="13" rx="13" ry="6" fill="#a8a29e" opacity="0.5" />
                  <ellipse cx="10" cy="10" rx="6" ry="4" fill="#d6d3d1" opacity="0.4" />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 44. ROCK BARRAGE (Rock Throw, Stone Barrage, Avalanche - sequential rock projectiles) */}
      {fx.type === 'rock_barrage' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Rock 1 - arcs in from left — angular jagged formation */}
          <div className="absolute" style={{ animation: 'gbaRockThrow1 1.2s cubic-bezier(0.2, 0.7, 0.5, 1) forwards' }}>
            <svg width="28" height="25" viewBox="0 0 28 25" className="drop-shadow-[0_0_5px_#78716c]">
              <polygon points="14,0 20,2 24,1 27,6 25,10 28,13 26,18 22,22 17,25 12,23 7,25 3,21 0,16 2,11 1,6 5,3 9,1" fill="#78716c" stroke="#44403c" strokeWidth="1.5" strokeLinejoin="miter" />
              <polygon points="24,1 26,4 22,5" fill="#44403c" opacity="0.35" />
              <polygon points="1,6 3,8 1,10" fill="#44403c" opacity="0.3" />
              <path d="M3 8 L12 6 L22 9" fill="none" stroke="#a8a29e" strokeWidth="1" opacity="0.55" />
              <path d="M2 15 L14 13 L26 16" fill="none" stroke="#57534e" strokeWidth="0.9" opacity="0.45" />
              <path d="M12 2 L14 9 L11 15" fill="none" stroke="#44403c" strokeWidth="1" strokeLinecap="butt" opacity="0.65" />
              <circle cx="8" cy="6" r="1" fill="#d6d3d1" opacity="0.6" />
              <circle cx="20" cy="12" r="0.9" fill="#e7e5e4" opacity="0.5" />
            </svg>
          </div>
          {/* Rock 2 - slightly delayed, different arc — angular */}
          <div className="absolute" style={{ animation: 'gbaRockThrow2 1.2s cubic-bezier(0.2, 0.7, 0.5, 1) 0.12s forwards', opacity: 0 }}>
            <svg width="24" height="21" viewBox="0 0 24 21" className="drop-shadow-[0_0_4px_#a8a29e]">
              <polygon points="12,0 17,1 21,4 23,9 21,14 22,18 17,21 11,20 6,21 2,17 0,12 2,7 4,3 8,1" fill="#a8a29e" stroke="#57534e" strokeWidth="1.3" strokeLinejoin="miter" />
              <polygon points="21,4 23,7 19,7" fill="#57534e" opacity="0.3" />
              <path d="M3 9 L12 7 L21 10" fill="none" stroke="#d6d3d1" strokeWidth="0.9" opacity="0.5" />
              <path d="M10 2 L12 8 L9 14" fill="none" stroke="#57534e" strokeWidth="0.9" strokeLinecap="butt" opacity="0.6" />
              <circle cx="7" cy="5" r="0.8" fill="#e7e5e4" opacity="0.55" />
            </svg>
          </div>
          {/* Rock 3 - third in sequence — angular */}
          <div className="absolute" style={{ animation: 'gbaRockThrow3 1.2s cubic-bezier(0.2, 0.7, 0.5, 1) 0.24s forwards', opacity: 0 }}>
            <svg width="21" height="18" viewBox="0 0 21 18" className="drop-shadow-[0_0_4px_#57534e]">
              <polygon points="10,0 15,1 19,4 21,8 19,13 16,17 11,18 6,16 2,18 0,13 1,8 3,4 6,1" fill="#57534e" stroke="#3d3833" strokeWidth="1.2" strokeLinejoin="miter" />
              <polygon points="19,4 21,7 17,6" fill="#3d3833" opacity="0.3" />
              <path d="M2 8 L10 6 L19 9" fill="none" stroke="#78716c" strokeWidth="0.8" opacity="0.5" />
              <path d="M9 1 L10 7 L8 12" fill="none" stroke="#3d3833" strokeWidth="0.8" strokeLinecap="butt" opacity="0.6" />
            </svg>
          </div>
          {/* Impact burst on landing — suppressed on a whiffed beat (Stone Barrage's first-flip
              tails fallback, or a tails coin on Avalanche / Bonemerang) so a miss shows rocks
              flying but no damage flash. */}
          {!fx.whiffed && (
            <div className="absolute right-2" style={{ animation: 'gbaRockImpactBurst 1.2s ease-out 0.5s forwards', opacity: 0 }}>
              <svg width="44" height="36" viewBox="0 0 44 36">
                <line x1="22" y1="18" x2="8" y2="6" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                <line x1="22" y1="18" x2="36" y2="4" stroke="#78716c" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <line x1="22" y1="18" x2="6" y2="24" stroke="#d6d3d1" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <line x1="22" y1="18" x2="38" y2="26" stroke="#a8a29e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <circle cx="22" cy="18" r="5" fill="#fef3c7" opacity="0.5" />
              </svg>
            </div>
          )}
          {/* Dust puff at impact — only when the rocks actually connect */}
          {!fx.whiffed && (
            <div className="absolute bottom-3 right-4" style={{ animation: 'gbaRockDustPuff 1.2s ease-out 0.55s forwards', opacity: 0 }}>
              <svg width="40" height="18" viewBox="0 0 40 18">
                <ellipse cx="20" cy="12" rx="16" ry="5" fill="#d6a35c" opacity="0.3" />
                <ellipse cx="14" cy="9" rx="10" ry="4" fill="#e0b878" opacity="0.25" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* 44c. AVALANCHE CASCADE (Golem Avalanche — massive boulders tumbling from above).
            Three huge angular boulders crash down sequentially from the top of the card,
            each with its own rotation and landing offset, plus ground-shake dust. */}
      {fx.type === 'avalanche_cascade' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Boulder 1 — largest, crashes center-left */}
          <div className="absolute" style={{ animation: 'gbaAvalancheFall1 1.1s cubic-bezier(0.3, 0.7, 0.6, 1) forwards' }}>
            <svg width="52" height="46" viewBox="0 0 52 46" className="drop-shadow-[0_0_12px_#78716c]">
              <defs>
                <radialGradient id="avalB1" cx="0.4" cy="0.3">
                  <stop offset="0%" stopColor="#d6d3d1" />
                  <stop offset="45%" stopColor="#a8a29e" />
                  <stop offset="80%" stopColor="#78716c" />
                  <stop offset="100%" stopColor="#4a4540" />
                </radialGradient>
              </defs>
              <polygon points="24,0 38,3 48,12 51,24 46,36 36,44 22,46 10,42 2,32 0,20 4,10 14,3" fill="url(#avalB1)" stroke="#3d3833" strokeWidth="2" strokeLinejoin="miter" />
              <polygon points="38,3 42,8 36,8" fill="#3d3833" opacity="0.35" />
              <polygon points="0,20 3,22 1,26" fill="#3d3833" opacity="0.3" />
              <path d="M4 14 L20 10 L42 15" fill="none" stroke="#d6d3d1" strokeWidth="1.3" opacity="0.5" />
              <path d="M2 28 L22 24 L48 29" fill="none" stroke="#a8a29e" strokeWidth="1.2" opacity="0.45" />
              <path d="M20 3 L24 14 L19 26 L23 38" fill="none" stroke="#3d3833" strokeWidth="1.6" strokeLinecap="butt" opacity="0.7" />
              <path d="M24 14 L34 18 L42 14" fill="none" stroke="#3d3833" strokeWidth="1.2" strokeLinecap="butt" opacity="0.6" />
              <circle cx="14" cy="10" r="1.2" fill="#e7e5e4" opacity="0.6" />
              <circle cx="38" cy="22" r="1" fill="#f5f5f4" opacity="0.5" />
              <circle cx="20" cy="38" r="1.1" fill="#d6d3d1" opacity="0.5" />
            </svg>
          </div>
          {/* Boulder 2 — medium, crashes center-right with delay */}
          <div className="absolute" style={{ animation: 'gbaAvalancheFall2 1.1s cubic-bezier(0.3, 0.7, 0.6, 1) 0.2s forwards', opacity: 0 }}>
            <svg width="40" height="36" viewBox="0 0 40 36" className="drop-shadow-[0_0_10px_#a8a29e]">
              <polygon points="18,0 30,2 38,10 40,20 36,29 27,35 15,36 6,32 0,22 1,12 6,4" fill="#a8a29e" stroke="#57534e" strokeWidth="1.6" strokeLinejoin="miter" />
              <polygon points="30,2 34,6 28,6" fill="#57534e" opacity="0.3" />
              <path d="M3 12 L18 8 L36 13" fill="none" stroke="#d6d3d1" strokeWidth="1" opacity="0.5" />
              <path d="M16 2 L18 12 L14 22" fill="none" stroke="#57534e" strokeWidth="1.2" strokeLinecap="butt" opacity="0.6" />
              <circle cx="10" cy="8" r="0.9" fill="#e7e5e4" opacity="0.55" />
              <circle cx="30" cy="18" r="0.8" fill="#f5f5f4" opacity="0.5" />
            </svg>
          </div>
          {/* Boulder 3 — smaller, crashes right with more delay */}
          <div className="absolute" style={{ animation: 'gbaAvalancheFall3 1.1s cubic-bezier(0.3, 0.7, 0.6, 1) 0.4s forwards', opacity: 0 }}>
            <svg width="32" height="28" viewBox="0 0 32 28" className="drop-shadow-[0_0_8px_#57534e]">
              <polygon points="14,0 24,2 30,8 32,16 28,24 20,28 10,27 3,22 0,14 2,6 8,1" fill="#57534e" stroke="#3d3833" strokeWidth="1.4" strokeLinejoin="miter" />
              <polygon points="24,2 27,5 22,5" fill="#3d3833" opacity="0.3" />
              <path d="M2 10 L14 7 L30 11" fill="none" stroke="#78716c" strokeWidth="0.9" opacity="0.5" />
              <path d="M13 1 L14 9 L11 18" fill="none" stroke="#3d3833" strokeWidth="1" strokeLinecap="butt" opacity="0.6" />
            </svg>
          </div>
          {/* Impact dust cloud at landing */}
          {!fx.whiffed && (
            <div className="absolute bottom-2" style={{ animation: 'gbaAvalancheDust 1.1s ease-out 0.5s forwards', opacity: 0 }}>
              <svg width="90" height="30" viewBox="0 0 90 30">
                <ellipse cx="45" cy="20" rx="38" ry="9" fill="#d6a35c" opacity="0.3" />
                <ellipse cx="30" cy="16" rx="22" ry="7" fill="#e0b878" opacity="0.25" />
                <ellipse cx="60" cy="14" rx="18" ry="6" fill="#d6a35c" opacity="0.2" />
              </svg>
            </div>
          )}
          {/* Ground shake lines */}
          {!fx.whiffed && (
            <div className="absolute bottom-4" style={{ animation: 'gbaAvalancheShake 1.1s ease-out 0.55s forwards', opacity: 0 }}>
              <svg width="80" height="12" viewBox="0 0 80 12">
                <path d="M5 6 L15 2 L25 8 L35 3 L45 9 L55 4 L65 8 L75 5" fill="none" stroke="#a8a29e" strokeWidth="1.5" strokeLinecap="butt" opacity="0.6" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* 45. WING SLASH (Wing Attack, Dive Bomb) */}
      {fx.type === 'wing_slash' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="flex items-center justify-center"
            style={{ animation: 'gbaWingSwoopSlash 1.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
          >
            <span className="text-5xl select-none filter drop-shadow-[0_0_15px_#93c5fd]">🦅</span>
            <div className="absolute text-2xl text-sky-300 animate-ping">💨</div>
          </div>
        </div>
      )}

      {/* 46. SWORDS DANCE BUFF (Swords Dance, Agility, Leer) */}
      {fx.type === 'swords_dance_buff' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="flex flex-col items-center gap-1"
            style={{ animation: 'gbaSwordsDanceSpinUp 1.2s ease-out forwards' }}
          >
            <span className="text-4xl select-none filter drop-shadow-[0_0_14px_#f59e0b]">⚔️</span>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full animate-pulse" />
            <span className="text-xl text-amber-300 animate-ping">✨</span>
          </div>
        </div>
      )}

      {/* 46d. TAIL WAG (Eevee - playful bushy tail swaying side to side with motion puffs) */}
      {fx.type === 'tail_wag' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Swaying bushy tail - anchored at its base so only the tip travels */}
          <div className="absolute" style={{ animation: 'gbaTailWagSway 1.2s ease-in-out forwards', transformOrigin: '50% 100%' }}>
            <svg width="52" height="56" viewBox="0 0 52 56" className="drop-shadow-[0_0_10px_#d97706]">
              {/* Bushy tail body (cream tip like Eevee's illustration) */}
              <path d="M26 54 Q12 46, 10 32 Q8 18, 18 10 Q26 4, 34 10 Q44 18, 42 32 Q40 46, 26 54 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
              <path d="M26 46 Q18 40, 17 30 Q16 20, 24 15 Q30 12, 35 17 Q40 24, 37 33 Q34 42, 26 46 Z" fill="#fbbf24" opacity="0.7" />
              <ellipse cx="26" cy="13" rx="9" ry="7" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
            </svg>
          </div>
          {/* Motion arcs - one per sway direction */}
          <div className="absolute -left-6" style={{ animation: 'gbaTailWagPuff 1.2s ease-out forwards', opacity: 0 }}>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <path d="M26 6 Q10 10, 8 22" fill="none" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <path d="M28 14 Q18 16, 16 25" fill="none" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute -right-6" style={{ animation: 'gbaTailWagPuff 1.2s ease-out 0.55s forwards', opacity: 0 }}>
            <svg width="30" height="30" viewBox="0 0 30 30" style={{ transform: 'scaleX(-1)' }}>
              <path d="M26 6 Q10 10, 8 22" fill="none" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <path d="M28 14 Q18 16, 16 25" fill="none" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          {/* Playful sparkles above */}
          <div className="absolute -top-4" style={{ animation: 'gbaTailWagSparkle 1.2s ease-out 0.2s forwards', opacity: 0 }}>
            <span className="text-lg text-yellow-200 select-none drop-shadow-[0_0_6px_#fde047]">✦</span>
          </div>
          <div className="absolute -top-2 left-6" style={{ animation: 'gbaTailWagSparkle 1.2s ease-out 0.5s forwards', opacity: 0 }}>
            <span className="text-sm text-amber-200 select-none drop-shadow-[0_0_6px_#fbbf24]">✧</span>
          </div>
        </div>
      )}

      {/* 46e. AGILITY DASH (Rapidash / Raichu - blinding speed streaks and afterimages) */}
      {fx.type === 'agility_dash' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Speed streak lines - three parallel dashes sweeping across */}
          <div className="absolute" style={{ animation: 'gbaAgilityStreak1 1.2s ease-out forwards' }}>
            <svg width="70" height="12" viewBox="0 0 70 12">
              <rect x="0" y="4" width="45" height="4" rx="2" fill="#fde047" opacity="0.9" />
              <rect x="50" y="4" width="12" height="4" rx="2" fill="#fbbf24" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute -top-3" style={{ animation: 'gbaAgilityStreak1 1.2s ease-out 0.1s forwards', opacity: 0 }}>
            <svg width="60" height="10" viewBox="0 0 60 10">
              <rect x="0" y="3" width="38" height="4" rx="2" fill="#f59e0b" opacity="0.8" />
              <rect x="42" y="3" width="10" height="4" rx="2" fill="#fde047" opacity="0.5" />
            </svg>
          </div>
          <div className="absolute top-3" style={{ animation: 'gbaAgilityStreak1 1.2s ease-out 0.2s forwards', opacity: 0 }}>
            <svg width="55" height="10" viewBox="0 0 55 10">
              <rect x="0" y="3" width="35" height="4" rx="2" fill="#fbbf24" opacity="0.7" />
              <rect x="40" y="3" width="8" height="4" rx="2" fill="#f59e0b" opacity="0.5" />
            </svg>
          </div>
          {/* Afterimage silhouettes trailing behind */}
          <div className="absolute -left-4" style={{ animation: 'gbaAgilityAfter 1.2s ease-out 0.15s forwards', opacity: 0 }}>
            <div className="w-8 h-10 rounded-full bg-gradient-to-r from-amber-300/40 to-transparent" />
          </div>
          <div className="absolute -left-8" style={{ animation: 'gbaAgilityAfter 1.2s ease-out 0.3s forwards', opacity: 0 }}>
            <div className="w-6 h-8 rounded-full bg-gradient-to-r from-yellow-200/30 to-transparent" />
          </div>
          {/* Spark particles at the feet */}
          <div className="absolute -bottom-2" style={{ animation: 'gbaAgilitySpark 1.2s ease-out 0.25s forwards', opacity: 0 }}>
            <span className="text-sm text-yellow-300 select-none drop-shadow-[0_0_8px_#fde047]">✦</span>
          </div>
          <div className="absolute -bottom-1 left-4" style={{ animation: 'gbaAgilitySpark 1.2s ease-out 0.45s forwards', opacity: 0 }}>
            <span className="text-xs text-amber-200 select-none drop-shadow-[0_0_6px_#fbbf24]">✧</span>
          </div>
          {/* Wind gust kicked up behind the dash */}
          <div className="absolute -right-5" style={{ animation: 'gbaAgilityGust 1.2s ease-out 0.35s forwards', opacity: 0 }}>
            <svg width="40" height="30" viewBox="0 0 40 30">
              <path d="M35 5 Q20 10, 10 15 Q20 20, 35 25" fill="none" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <path d="M38 10 Q25 14, 18 15 Q25 16, 38 20" fill="none" stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 46f. GLARE / LEER (intimidating narrowing eyes with anger mark) */}
      {fx.type === 'glare_leer' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Narrowing menacing eyes */}
          <div className="absolute" style={{ animation: 'gbaLeerGlare 1.2s ease-out forwards' }}>
            <svg width="60" height="36" viewBox="0 0 60 36" className="drop-shadow-[0_0_12px_#ef4444]">
              <path d="M5 18 L18 10 L25 14 L25 22 L18 26 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
              <ellipse cx="18" cy="18" rx="3" ry="4" fill="#fef2f2" />
              <path d="M55 18 L42 10 L35 14 L35 22 L42 26 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
              <ellipse cx="42" cy="18" rx="3" ry="4" fill="#fef2f2" />
              <line x1="8" y1="8" x2="22" y2="12" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="52" y1="8" x2="38" y2="12" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          {/* Anime anger cross mark */}
          <div className="absolute -top-3 -right-3" style={{ animation: 'gbaLeerMark 1.2s ease-out 0.2s forwards', opacity: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <line x1="4" y1="4" x2="10" y2="10" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
              <line x1="10" y1="4" x2="4" y2="10" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
              <line x1="14" y1="4" x2="20" y2="10" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
              <line x1="20" y1="4" x2="14" y2="10" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          {/* Intimidation pressure waves */}
          <div className="absolute -bottom-3" style={{ animation: 'gbaLeerWave 1.2s ease-out 0.3s forwards', opacity: 0 }}>
            <svg width="80" height="20" viewBox="0 0 80 20">
              <path d="M10 10 Q20 4, 30 10 Q40 16, 50 10 Q60 4, 70 10" fill="none" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <path d="M15 14 Q25 10, 35 14 Q45 18, 55 14 Q65 10, 75 14" fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 46g. DIZZINESS SWIRL (dizzy stars orbiting the user's head) */}
      {fx.type === 'dizziness_swirl' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Orbiting star 1 */}
          <div className="absolute" style={{ animation: 'gbaDizzyOrbit1 1.2s linear forwards' }}>
            <span className="text-lg text-yellow-300 select-none drop-shadow-[0_0_8px_#fde047]">★</span>
          </div>
          {/* Orbiting star 2 (opposite phase) */}
          <div className="absolute" style={{ animation: 'gbaDizzyOrbit2 1.2s linear 0.15s forwards', opacity: 0 }}>
            <span className="text-sm text-amber-200 select-none drop-shadow-[0_0_6px_#fbbf24]">✦</span>
          </div>
          {/* Orbiting star 3 */}
          <div className="absolute" style={{ animation: 'gbaDizzyOrbit1 1.2s linear 0.3s forwards', opacity: 0 }}>
            <span className="text-xs text-yellow-100 select-none drop-shadow-[0_0_5px_#fef3c7]">✧</span>
          </div>
          {/* Central dizzy ring */}
          <div className="absolute" style={{ animation: 'gbaDizzyRing 1.2s ease-in-out forwards' }}>
            <svg width="50" height="50" viewBox="0 0 50 50">
              <ellipse cx="25" cy="25" rx="20" ry="8" fill="none" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.6" transform="rotate(-15 25 25)" />
              <ellipse cx="25" cy="25" rx="14" ry="5" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" transform="rotate(10 25 25)" />
            </svg>
          </div>
          {/* Floating sparkle particles */}
          <div className="absolute -top-3" style={{ animation: 'gbaDizzyFloat 1.2s ease-out 0.2s forwards', opacity: 0 }}>
            <span className="text-xs text-yellow-200 select-none">✨</span>
          </div>
          <div className="absolute top-1 left-5" style={{ animation: 'gbaDizzyFloat 1.2s ease-out 0.4s forwards', opacity: 0 }}>
            <span className="text-xs text-amber-100 select-none">✨</span>
          </div>
        </div>
      )}

      {/* 46h. STOMP HOOF (Ponyta/Rapidash - flaming hoof slamming down from above) */}
      {fx.type === 'stomp_hoof' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Hoof descending from above */}
          <div className="absolute" style={{ animation: 'gbaKickSmashHoof 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="44" height="54" viewBox="0 0 44 54" className="drop-shadow-[0_0_14px_#f97316]">
              {/* Hoof - wide flat bottom like a real horse hoof */}
              <path d="M10 32 L34 32 L36 44 Q34 50, 22 50 Q10 50, 8 44 Z" fill="#92400e" stroke="#78350f" strokeWidth="2" />
              {/* Hoof wall band */}
              <rect x="9" y="32" width="26" height="5" rx="2.5" fill="#a16207" />
              {/* Horseshoe shape on bottom */}
              <path d="M12 46 Q22 52, 32 46" fill="none" stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round" />
              {/* Flame mane trailing above hoof */}
              <path d="M14 30 Q12 20, 15 12 Q17 6, 16 2" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
              <path d="M22 30 Q24 18, 21 10 Q20 5, 22 1" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <path d="M30 30 Q31 22, 29 14 Q28 9, 30 5" fill="none" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              {/* Flame tips */}
              <circle cx="16" cy="2" r="2.5" fill="#fde047" opacity="0.8" />
              <circle cx="22" cy="1" r="2" fill="#fbbf24" opacity="0.7" />
              <circle cx="30" cy="4" r="1.8" fill="#f97316" opacity="0.6" />
            </svg>
          </div>
          {/* Impact fire burst at ground level */}
          <div className="absolute -bottom-1" style={{ animation: 'gbaKickSmashImpact 1.2s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="60" height="35" viewBox="0 0 60 35">
              {/* Fire spray lines */}
              <line x1="30" y1="18" x2="10" y2="5" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
              <line x1="30" y1="18" x2="50" y2="3" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <line x1="30" y1="18" x2="6" y2="22" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <line x1="30" y1="18" x2="54" y2="24" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <line x1="30" y1="18" x2="20" y2="2" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <line x1="30" y1="18" x2="42" y2="1" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              {/* Central impact glow */}
              <circle cx="30" cy="18" r="7" fill="#fef3c7" opacity="0.6" />
              <circle cx="30" cy="18" r="4" fill="#ffffff" opacity="0.7" />
            </svg>
          </div>
          {/* Dust puffs at ground */}
          <div className="absolute -bottom-2 -left-3" style={{ animation: 'gbaStompDust 1.2s ease-out 0.55s forwards', opacity: 0 }}>
            <svg width="24" height="16" viewBox="0 0 24 16">
              <ellipse cx="12" cy="10" rx="10" ry="5" fill="#d6d3d1" opacity="0.5" />
              <ellipse cx="8" cy="8" rx="6" ry="3" fill="#e7e5e4" opacity="0.4" />
            </svg>
          </div>
          <div className="absolute -bottom-2 -right-3" style={{ animation: 'gbaStompDust 1.2s ease-out 0.65s forwards', opacity: 0 }}>
            <svg width="24" height="16" viewBox="0 0 24 16">
              <ellipse cx="12" cy="10" rx="10" ry="5" fill="#d6d3d1" opacity="0.5" />
              <ellipse cx="16" cy="8" rx="6" ry="3" fill="#e7e5e4" opacity="0.4" />
            </svg>
          </div>
        </div>
      )}

      {/* 46c. SCYTHER BLADE DANCE (Scyther Swords Dance - scythe-arm crossing slashes) */}
      {fx.type === 'scyther_blade_dance' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Left scythe arm sweeping in */}
          <div className="absolute" style={{ animation: 'gbaScytherBladeLeft 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="64" height="70" viewBox="0 0 64 70">
              {/* Curved scythe blade matching Scyther illustration */}
              <path d="M58 6 Q30 10, 16 30 Q8 44, 10 62 Q16 48, 28 38 Q44 24, 60 14 Z" fill="url(#scyBladeGradL)" stroke="#365314" strokeWidth="1.5" strokeLinejoin="round" />
              {/* Sharp edge highlight */}
              <path d="M56 8 Q32 14, 20 32 Q13 44, 13 56" fill="none" stroke="#fefce8" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              <defs>
                <linearGradient id="scyBladeGradL" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#bef264" />
                  <stop offset="100%" stopColor="#fef9c3" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Right scythe arm sweeping in (mirrored) */}
          <div className="absolute" style={{ animation: 'gbaScytherBladeRight 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) 0.1s forwards', opacity: 0 }}>
            <svg width="64" height="70" viewBox="0 0 64 70" style={{ transform: 'scaleX(-1)' }}>
              <path d="M58 6 Q30 10, 16 30 Q8 44, 10 62 Q16 48, 28 38 Q44 24, 60 14 Z" fill="url(#scyBladeGradR)" stroke="#365314" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M56 8 Q32 14, 20 32 Q13 44, 13 56" fill="none" stroke="#fefce8" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              <defs>
                <linearGradient id="scyBladeGradR" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#bef264" />
                  <stop offset="100%" stopColor="#fef9c3" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Crossing slash flash at center */}
          <div className="absolute" style={{ animation: 'gbaScytherSlashFlash 1.2s ease-out 0.35s forwards', opacity: 0 }}>
            <svg width="70" height="70" viewBox="0 0 70 70">
              <line x1="10" y1="10" x2="60" y2="60" stroke="#fefce8" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
              <line x1="60" y1="10" x2="10" y2="60" stroke="#bef264" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
            </svg>
          </div>
          {/* Green energy sparks */}
          <div className="absolute -top-2" style={{ animation: 'gbaScytherSpark 1.2s ease-out 0.5s forwards', opacity: 0 }}>
            <span className="text-lg text-lime-300 select-none drop-shadow-[0_0_8px_#a3e635]">✦</span>
          </div>
        </div>
      )}

      {/* 46b. SUPERSONIC WAVES (Zubat Supersonic - GBA-style concentric sound arcs + confusion) */}
      {fx.type === 'supersonic_waves' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Emanating sound wave arcs */}
          <div className="absolute flex items-center justify-center" style={{ animation: 'gbaSupersonicEmit 1.25s ease-out forwards' }}>
            <svg width="90" height="90" viewBox="0 0 90 90">
              {/* Three concentric arcs radiating outward */}
              <path d="M45 45 Q55 30, 60 45 Q55 60, 45 45" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
              <path d="M45 45 Q62 22, 70 45 Q62 68, 45 45" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <path d="M45 45 Q70 15, 80 45 Q70 75, 45 45" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          {/* Wavy distortion lines */}
          <div className="absolute" style={{ animation: 'gbaSupersonicWobble 1.25s ease-out 0.15s forwards', opacity: 0 }}>
            <svg width="70" height="40" viewBox="0 0 70 40">
              <path d="M5 20 Q15 10, 25 20 Q35 30, 45 20 Q55 10, 65 20" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
              <path d="M10 28 Q20 20, 30 28 Q40 36, 50 28 Q58 22, 62 28" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          {/* Confusion stars orbiting target */}
          <div className="absolute" style={{ animation: 'gbaSupersonicConfuse 1.25s linear 0.3s forwards', opacity: 0 }}>
            <span className="text-xl text-yellow-300 select-none drop-shadow-[0_0_8px_#fde047]">💫</span>
          </div>
          <div className="absolute" style={{ animation: 'gbaSupersonicConfuse2 1.25s linear 0.4s forwards', opacity: 0 }}>
            <span className="text-sm text-purple-300 select-none drop-shadow-[0_0_6px_#a78bfa]">⭐</span>
          </div>
          {/* Musical note particles */}
          <div className="absolute -top-4" style={{ animation: 'gbaSupersonicNoteFloat 1.25s ease-out 0.2s forwards', opacity: 0 }}>
            <span className="text-lg text-violet-300 select-none">♪</span>
          </div>
        </div>
      )}

      {/* 47. SONIC BOOM (GBA-style expanding sound wave crescents) */}
      {fx.type === 'sonic_boom' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Sound wave crescent 1 */}
          <div className="absolute" style={{ animation: 'gbaSonicCrescent 1.2s ease-out forwards' }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
              <path d="M30 5 Q50 15, 50 30 Q50 45, 30 55" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
            </svg>
          </div>
          {/* Sound wave crescent 2 */}
          <div className="absolute" style={{ animation: 'gbaSonicCrescent 1.2s ease-out 0.15s forwards', opacity: 0 }}>
            <svg width="70" height="70" viewBox="0 0 70 70">
              <path d="M35 8 Q58 20, 58 35 Q58 50, 35 62" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          {/* Sound wave crescent 3 */}
          <div className="absolute" style={{ animation: 'gbaSonicCrescent 1.2s ease-out 0.3s forwards', opacity: 0 }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <path d="M40 10 Q65 24, 65 40 Q65 56, 40 70" fill="none" stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          {/* Origin pulse at source */}
          <div className="absolute -left-2" style={{ animation: 'gbaSonicOriginPulse 1.2s ease-out forwards' }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" fill="#22d3ee" opacity="0.4" />
              <circle cx="12" cy="12" r="4" fill="#a5f3fc" opacity="0.6" />
            </svg>
          </div>
          {/* Air distortion lines */}
          <div className="absolute" style={{ animation: 'gbaSonicDistortion 1.2s ease-out 0.2s forwards', opacity: 0 }}>
            <svg width="50" height="30" viewBox="0 0 50 30">
              <path d="M5 15 Q12 10, 20 15 Q28 20, 35 15 Q42 10, 48 15" fill="none" stroke="#67e8f9" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 48. HYPER BEAM LASER (GBA-style charged beam with core and glow) */}
      {fx.type === 'hyper_beam_laser' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Outer beam glow */}
          <div className="absolute" style={{ animation: 'gbaHyperBeamGlow 1.25s ease-out forwards' }}>
            <svg width="130" height="24" viewBox="0 0 130 24">
              <rect x="0" y="4" width="130" height="16" rx="8" fill="url(#hyperBeamOuterGrad)" opacity="0.5" />
              <defs>
                <linearGradient id="hyperBeamOuterGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                  <stop offset="40%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Core beam */}
          <div className="absolute" style={{ animation: 'gbaHyperBeamCore 1.25s ease-out 0.1s forwards', opacity: 0 }}>
            <svg width="120" height="12" viewBox="0 0 120 12">
              <rect x="0" y="2" width="120" height="8" rx="4" fill="url(#hyperBeamCoreGrad)" />
              <rect x="10" y="4" width="100" height="4" rx="2" fill="#ffffff" opacity="0.8" />
              <defs>
                <linearGradient id="hyperBeamCoreGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Muzzle flash at origin */}
          <div className="absolute -left-2" style={{ animation: 'gbaHyperBeamMuzzle 1.25s ease-out forwards', opacity: 0 }}>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="10" fill="#fef08a" opacity="0.6" />
              <circle cx="15" cy="15" r="5" fill="#ffffff" opacity="0.8" />
            </svg>
          </div>
          {/* Impact burst at target end */}
          <div className="absolute right-0" style={{ animation: 'gbaHyperBeamImpact 1.25s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="14" fill="#fbbf24" opacity="0.4" />
              <circle cx="22" cy="22" r="8" fill="#fef08a" opacity="0.6" />
              <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.8">
                <line x1="22" y1="4" x2="22" y2="10" />
                <line x1="22" y1="34" x2="22" y2="40" />
                <line x1="4" y1="22" x2="10" y2="22" />
                <line x1="34" y1="22" x2="40" y2="22" />
                <line x1="9" y1="9" x2="13" y2="13" />
                <line x1="31" y1="31" x2="35" y2="35" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* 49. HORN GORE (Horn Attack - generic horn charge, GBA-style) */}
      {fx.type === 'horn_gore' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Charging horn */}
          <div className="absolute" style={{ animation: 'gbaHornChargeThrust 1.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="80" height="56" viewBox="0 0 80 56">
              {/* Curved horn pointing right */}
              <path d="M10 34 Q22 18, 40 16 Q58 14, 74 24 Q60 22, 46 26 Q30 30, 18 40 Q12 40, 10 34 Z" fill="url(#hornGradGray)" stroke="#a1a1aa" strokeWidth="1.5" strokeLinejoin="round" />
              {/* Horn ridges */}
              <path d="M24 26 Q26 32, 24 37" fill="none" stroke="#d4d4d8" strokeWidth="1.5" opacity="0.8" />
              <path d="M38 21 Q40 27, 38 32" fill="none" stroke="#d4d4d8" strokeWidth="1.5" opacity="0.7" />
              <path d="M52 19 Q54 24, 52 28" fill="none" stroke="#d4d4d8" strokeWidth="1.5" opacity="0.6" />
              <defs>
                <linearGradient id="hornGradGray" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#e4e4e7" />
                  <stop offset="100%" stopColor="#71717a" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Speed lines behind charge */}
          <div className="absolute -left-8 flex flex-col gap-1.5" style={{ animation: 'gbaHornSpeedLines 1.15s ease-out forwards', opacity: 0 }}>
            <div className="w-9 h-0.5 bg-gradient-to-r from-transparent to-slate-200/80 rounded-full" />
            <div className="w-7 h-0.5 bg-gradient-to-r from-transparent to-slate-300/60 rounded-full ml-1" />
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-slate-200/70 rounded-full" />
          </div>
          {/* Impact spark on contact */}
          <div className="absolute right-3" style={{ animation: 'gbaHornImpactSpark 1.15s ease-out 0.45s forwards', opacity: 0 }}>
            <svg width="34" height="34" viewBox="0 0 34 34">
              <polygon points="17,2 20,13 31,13 22,20 25,31 17,24 9,31 12,20 3,13 14,13" fill="#fef9c3" stroke="#fde047" strokeWidth="1" opacity="0.9" />
            </svg>
          </div>
        </div>
      )}

      {/* 49b. NIDORAN HORN CHARGE (Nidoran♂/♀ - pink poison horn thrust) */}
      {fx.type === 'nidoran_horn_charge' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Pink horn thrust */}
          <div className="absolute" style={{ animation: 'gbaHornChargeThrust 1.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="84" height="60" viewBox="0 0 84 60">
              {/* Nidoran pink conical horn matching its illustration */}
              <path d="M8 38 Q20 24, 38 20 Q58 16, 78 26 Q62 24, 48 28 Q30 33, 16 44 Q10 44, 8 38 Z" fill="url(#hornGradPink)" stroke="#db2777" strokeWidth="1.5" strokeLinejoin="round" />
              {/* Horn ridges */}
              <path d="M24 28 Q26 34, 24 39" fill="none" stroke="#fbcfe8" strokeWidth="1.5" opacity="0.85" />
              <path d="M40 23 Q42 29, 40 34" fill="none" stroke="#fbcfe8" strokeWidth="1.5" opacity="0.7" />
              <path d="M56 21 Q58 26, 56 30" fill="none" stroke="#fbcfe8" strokeWidth="1.5" opacity="0.55" />
              {/* Venom sheen at tip */}
              <circle cx="78" cy="26" r="2.5" fill="#a855f7" opacity="0.85" />
              <defs>
                <linearGradient id="hornGradPink" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f9a8d4" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Speed lines */}
          <div className="absolute -left-8 flex flex-col gap-1.5" style={{ animation: 'gbaHornSpeedLines 1.15s ease-out forwards', opacity: 0 }}>
            <div className="w-9 h-0.5 bg-gradient-to-r from-transparent to-pink-200/80 rounded-full" />
            <div className="w-7 h-0.5 bg-gradient-to-r from-transparent to-pink-300/60 rounded-full ml-1" />
          </div>
          {/* Poison-tinted impact spark */}
          <div className="absolute right-3" style={{ animation: 'gbaHornImpactSpark 1.15s ease-out 0.45s forwards', opacity: 0 }}>
            <svg width="34" height="34" viewBox="0 0 34 34">
              <polygon points="17,2 20,13 31,13 22,20 25,31 17,24 9,31 12,20 3,13 14,13" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1" opacity="0.9" />
              <circle cx="17" cy="17" r="3" fill="#a855f7" opacity="0.8" />
            </svg>
          </div>
        </div>
      )}

      {/* 50. KICK STRIKE (Double Kick, Low Kick, Submission - GBA-style roundhouse kick arc) */}
      {fx.type === 'kick_strike' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Kick leg sweeping in arc */}
          <div className="absolute" style={{ animation: 'gbaKickRoundhouse 1.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="50" height="60" viewBox="0 0 50 60" className="drop-shadow-[0_0_10px_#f97316]">
              {/* Leg shape */}
              <path d="M15 5 Q20 15, 22 28 Q24 38, 30 48 Q34 54, 40 56" fill="none" stroke="#fb923c" strokeWidth="6" strokeLinecap="round" />
              {/* Foot */}
              <ellipse cx="42" cy="54" rx="7" ry="4" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
              {/* Knee joint */}
              <circle cx="22" cy="28" r="4" fill="#fdba74" stroke="#f97316" strokeWidth="1" />
            </svg>
          </div>
          {/* Arc trail behind kick */}
          <div className="absolute" style={{ animation: 'gbaKickArcTrail 1.15s ease-out forwards', opacity: 0 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
              <path d="M10 50 Q20 30, 35 20 Q48 12, 55 8" fill="none" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <path d="M14 48 Q24 32, 38 22 Q48 16, 52 12" fill="none" stroke="#fed7aa" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
            </svg>
          </div>
          {/* Impact star on contact */}
          <div className="absolute" style={{ animation: 'gbaKickImpactStar 1.15s ease-out 0.4s forwards', opacity: 0 }}>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <polygon points="18,2 22,13 34,13 24,20 28,32 18,25 8,32 12,20 2,13 14,13" fill="#fef3c7" stroke="#f97316" strokeWidth="1" opacity="0.8" />
            </svg>
          </div>
        </div>
      )}

      {/* 50b. KICK LOW (Machop - low sweeping kick) */}
      {fx.type === 'kick_low' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div className="absolute" style={{ animation: 'gbaKickLowSweep 1.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <div className="relative w-12 h-6">
              <div className="absolute bottom-0 left-0 w-10 h-4 rounded-full bg-gradient-to-r from-orange-300 to-orange-400 border border-orange-500 shadow-[0_0_8px_#fb923c]" />
              <div className="absolute bottom-0 right-0 w-6 h-5 rounded-lg bg-orange-400 border border-orange-600" />
            </div>
          </div>
          <div className="absolute bottom-0 flex gap-1" style={{ animation: 'gbaKickLowSweep 1.15s ease-out 0.4s forwards', opacity: 0 }}>
            <div className="w-2 h-2 rounded-full bg-gray-400/50 blur-[1px]" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500/40 blur-[1px]" />
          </div>
          <div className="absolute" style={{ animation: 'gbaBiteStarFang 1.15s ease-out 0.35s forwards', opacity: 0 }}>
            <span className="text-2xl text-orange-200 select-none drop-shadow-[0_0_10px_#fdba74]">✦</span>
          </div>
        </div>
      )}

      {/* 50c. KICK SMASH (Ponyta/Rapidash - flaming hoof slam) */}
      {fx.type === 'kick_smash' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Flaming hoof slamming down */}
          <div className="absolute" style={{ animation: 'gbaKickSmashHoof 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="40" height="50" viewBox="0 0 40 50" className="drop-shadow-[0_0_12px_#f97316]">
              {/* Hoof shape */}
              <path d="M12 30 L28 30 L30 42 Q28 48, 20 48 Q12 48, 10 42 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
              {/* Hoof band */}
              <rect x="11" y="30" width="18" height="4" rx="2" fill="#f97316" />
              {/* Flame trails above hoof */}
              <path d="M15 28 Q13 20, 16 14 Q18 10, 17 6" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <path d="M22 28 Q24 18, 22 12 Q21 8, 23 4" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <path d="M27 28 Q28 22, 26 16" fill="none" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              {/* Flame tips */}
              <circle cx="17" cy="5" r="2" fill="#fde047" opacity="0.7" />
              <circle cx="23" cy="3" r="1.8" fill="#fbbf24" opacity="0.6" />
            </svg>
          </div>
          {/* Fire impact burst */}
          <div className="absolute -bottom-1" style={{ animation: 'gbaKickSmashImpact 1.2s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="50" height="30" viewBox="0 0 50 30">
              <line x1="25" y1="15" x2="10" y2="5" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <line x1="25" y1="15" x2="40" y2="3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <line x1="25" y1="15" x2="8" y2="20" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <line x1="25" y1="15" x2="42" y2="22" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <circle cx="25" cy="15" r="5" fill="#fef3c7" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 50d. CLAW PINCH (Krabby/Kingler - anatomical crab claw grabbing & squeezing) */}
      {fx.type === 'claw_pinch' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Whole claw unit slides in from left, then upper finger rotates shut */}
          <div className="absolute" style={{ animation: 'gbaClawGripApproach 1.3s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <svg width="100" height="72" viewBox="0 0 100 72" className="drop-shadow-[0_0_12px_#ea580c]">
              <defs>
                <linearGradient id="krabbyClawGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#c2410c" />
                </linearGradient>
                <linearGradient id="krabbyFingerGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#9a3412" />
                </linearGradient>
              </defs>
              {/* Arm segment */}
              <path d="M2 38 Q6 32, 14 30 Q20 28, 24 32 Q26 36, 24 42 Q20 46, 14 44 Q6 42, 2 38 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
              {/* Arm segment joint ring */}
              <ellipse cx="14" cy="37" rx="5" ry="6" fill="none" stroke="#fdba74" strokeWidth="1" opacity="0.5" />
              {/* Palm / Manus - bulky base */}
              <path d="M22 24 Q32 18, 44 20 Q54 22, 58 30 Q60 38, 56 46 Q50 54, 38 52 Q28 50, 24 42 Q22 34, 22 24 Z" fill="url(#krabbyClawGrad)" stroke="#9a3412" strokeWidth="2" />
              {/* Palm ridge details */}
              <path d="M30 26 Q38 22, 46 24" fill="none" stroke="#fdba74" strokeWidth="1.2" opacity="0.6" />
              <path d="M28 34 Q36 30, 48 32" fill="none" stroke="#fdba74" strokeWidth="1" opacity="0.5" />
              <path d="M30 44 Q40 40, 50 42" fill="none" stroke="#fdba74" strokeWidth="1" opacity="0.4" />
              {/* Palm bump texture */}
              <circle cx="38" cy="36" r="4" fill="#f97316" stroke="#c2410c" strokeWidth="1" opacity="0.6" />
              <circle cx="46" cy="28" r="2.5" fill="#fb923c" opacity="0.4" />
              {/* LOWER FINGER (fixed, larger) - extends right with serrated inner edge */}
              <path d="M54 40 Q62 44, 72 44 Q82 44, 92 40 Q96 37, 94 34 Q88 37, 78 40 Q68 42, 58 38 Z" fill="url(#krabbyFingerGrad)" stroke="#9a3412" strokeWidth="1.5" />
              {/* Lower finger serrations (inner/top edge) */}
              <path d="M64 41 L66 37 L68 41 M72 40 L74 36 L76 40 M80 39 L82 35 L84 39" fill="none" stroke="#7c2d12" strokeWidth="1.3" strokeLinejoin="round" />
              {/* Lower finger tip */}
              <path d="M92 38 Q96 35, 98 37 Q96 40, 93 40 Z" fill="#c2410c" stroke="#7c2d12" strokeWidth="1" />
              {/* UPPER FINGER (movable, smaller) - rotates to close around joint */}
              <g style={{ animation: 'gbaClawFingerClose 1.3s cubic-bezier(0.3, 0.8, 0.2, 1) forwards', transformOrigin: '55px 34px' }}>
                <path d="M55 28 Q62 22, 70 22 Q78 22, 84 25 Q88 28, 86 31 Q80 28, 72 27 Q64 27, 57 30 Z" fill="#ea580c" stroke="#9a3412" strokeWidth="1.5" />
                {/* Upper finger serrations (inner/bottom edge) */}
                <path d="M63 28 L65 32 L67 28 M71 27 L73 31 L75 27" fill="none" stroke="#7c2d12" strokeWidth="1.3" strokeLinejoin="round" />
                {/* Upper finger tip (pointed) */}
                <path d="M84 26 Q88 24, 90 27 Q88 30, 85 29 Z" fill="#c2410c" stroke="#7c2d12" strokeWidth="1" />
              </g>
              {/* Joint circle at pivot */}
              <circle cx="55" cy="34" r="3.5" fill="#fdba74" stroke="#c2410c" strokeWidth="1.5" />
            </svg>
          </div>
          {/* Squeeze impact burst when claw clamps shut */}
          <div className="absolute" style={{ animation: 'gbaClawImpactBurst 1.3s ease-out 0.7s forwards', opacity: 0 }}>
            <svg width="42" height="42" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="9" fill="#fff7ed" opacity="0.6" />
              <circle cx="21" cy="21" r="4" fill="#ffffff" opacity="0.7" />
              <g stroke="#fb923c" strokeWidth="2" strokeLinecap="round" opacity="0.85">
                <line x1="21" y1="3" x2="21" y2="9" />
                <line x1="21" y1="33" x2="21" y2="39" />
                <line x1="3" y1="21" x2="9" y2="21" />
                <line x1="33" y1="21" x2="39" y2="21" />
                <line x1="8" y1="8" x2="12" y2="12" />
                <line x1="30" y1="30" x2="34" y2="34" />
              </g>
            </svg>
          </div>
          {/* Squeeze pressure lines radiating outward */}
          <div className="absolute" style={{ animation: 'gbaClawSqueezeLines 1.3s ease-out 0.75s forwards', opacity: 0 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <line x1="6" y1="36" x2="18" y2="36" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" />
              <line x1="54" y1="36" x2="66" y2="36" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" />
              <line x1="36" y1="6" x2="36" y2="16" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="36" y1="56" x2="36" y2="66" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="12" y1="12" x2="19" y2="19" stroke="#fed7aa" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="53" y1="53" x2="60" y2="60" stroke="#fed7aa" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}

      {/* 50e. PALM STRIKE (Drowzee/Hypno - open palm) */}
      {fx.type === 'palm_strike' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div className="absolute" style={{ animation: 'gbaPalmStrikeWave 1.15s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}>
            <div className="relative w-12 h-14 rounded-xl bg-gradient-to-b from-yellow-200 to-yellow-300 border-2 border-yellow-400 shadow-[0_0_10px_#fde047] flex flex-col items-center justify-end pb-1">
              <div className="absolute -top-2 flex gap-0.5">
                <div className="w-2 h-4 rounded-full bg-yellow-200 border border-yellow-400" />
                <div className="w-2 h-5 rounded-full bg-yellow-200 border border-yellow-400" />
                <div className="w-2 h-5 rounded-full bg-yellow-200 border border-yellow-400" />
                <div className="w-2 h-4 rounded-full bg-yellow-200 border border-yellow-400" />
              </div>
            </div>
          </div>
          <div className="absolute w-12 h-12 rounded-full border-2 border-yellow-300/60" style={{ animation: 'gbaStareHypnosis 1.15s ease-out 0.3s forwards', opacity: 0 }} />
          <div className="absolute" style={{ animation: 'gbaBiteStarFang 1.15s ease-out 0.4s forwards', opacity: 0 }}>
            <span className="text-xl text-yellow-100 select-none drop-shadow-[0_0_10px_#fef9c3]">✧</span>
          </div>
        </div>
      )}

      {/* 51. DRAIN LIFE (Leech Life, Mega Drain - GBA-style life energy siphon stream) */}
      {fx.type === 'drain_life' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Siphon stream - energy flowing from target to attacker */}
          <div className="absolute" style={{ animation: 'gbaDrainStreamFlow 1.3s cubic-bezier(0.3, 0.7, 0.5, 1) forwards' }}>
            <svg width="80" height="30" viewBox="0 0 80 30">
              <path d="M75 15 Q55 8, 40 15 Q25 22, 5 15" fill="none" stroke="url(#drainGrad)" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
              <path d="M72 15 Q54 10, 40 15 Q26 20, 8 15" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <defs>
                <linearGradient id="drainGrad" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#84cc16" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Energy orbs being drained */}
          <div className="absolute" style={{ animation: 'gbaDrainOrb1 1.3s ease-out 0.1s forwards', opacity: 0 }}>
            <div className="w-3 h-3 rounded-full bg-lime-400 shadow-[0_0_8px_#84cc16]" />
          </div>
          <div className="absolute" style={{ animation: 'gbaDrainOrb2 1.3s ease-out 0.2s forwards', opacity: 0 }}>
            <div className="w-2.5 h-2.5 rounded-full bg-green-300 shadow-[0_0_6px_#4ade80]" />
          </div>
          <div className="absolute" style={{ animation: 'gbaDrainOrb3 1.3s ease-out 0.3s forwards', opacity: 0 }}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]" />
          </div>
          {/* Absorption glow at attacker end */}
          <div className="absolute -left-3" style={{ animation: 'gbaDrainAbsorbGlow 1.3s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="10" fill="#4ade80" opacity="0.3" />
              <circle cx="15" cy="15" r="5" fill="#86efac" opacity="0.5" />
            </svg>
          </div>
          {/* Red depletion at target end */}
          <div className="absolute right-2" style={{ animation: 'gbaDrainDeplete 1.3s ease-out 0.2s forwards', opacity: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.5" strokeDasharray="3 2" />
            </svg>
          </div>
        </div>
      )}

      {/* 52. DRAGON RAGE (Dragon Rage) */}
      {fx.type === 'dragon_rage' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="flex items-center justify-center"
            style={{ animation: 'gbaDragonRageBlast 1.2s ease-out forwards' }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-500 to-purple-600 blur-sm flex items-center justify-center shadow-[0_0_35px_#6366f1]">
              <span className="text-4xl select-none">🐉</span>
            </div>
            <div className="absolute text-3xl text-indigo-300 animate-ping">🔥</div>
          </div>
        </div>
      )}

      {/* 53. CONFUSION SELF-HIT (confused attacker rolled TAILS and struck itself) */}
      {fx.type === 'confusion_self_hit' && (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-visible">
          {/* Dizzy magenta wash pulsing across the attacker's own card */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              animation: 'gbaConfusionSelfHitWash 1.25s ease-in-out forwards',
              background: 'radial-gradient(ellipse at center, rgba(217,70,239,0.22) 0%, rgba(147,51,234,0.17) 55%, rgba(88,28,135,0.10) 100%)'
            }}
          />
          {/* Jagged impact starburst - the blow landing on itself */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="120" height="120" viewBox="0 0 120 120"
              style={{ animation: 'gbaConfusionImpact 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards', opacity: 0 }}
            >
              <polygon
                points="60,4 71,42 108,30 82,58 116,74 78,76 74,116 56,82 26,104 38,68 4,60 42,52 30,16 54,42"
                fill="#fde047" stroke="#fff7cc" strokeWidth="2" strokeLinejoin="round"
              />
            </svg>
          </div>
          {/* Dizzy spiral popping in over the attacker — the blow came from its own confusion */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="52" height="52" viewBox="0 0 52 52"
              style={{ animation: 'gbaConfusionDizzyPop 1.1s ease-out 0.12s forwards', opacity: 0, filter: 'drop-shadow(0 0 10px rgba(216,180,254,0.9))' }}
            >
              <path
                d="M26 26 C 26 20, 32 20, 32 26 C 32 34, 20 34, 20 26 C 20 14, 38 14, 38 26 C 38 40, 14 40, 14 26 C 14 8, 44 8, 44 26"
                fill="none" stroke="#e879f9" strokeWidth="2.5" strokeLinecap="round"
              />
              <circle cx="26" cy="26" r="2" fill="#e879f9" />
            </svg>
          </div>
          {/* Small SVG stars orbiting the attacker's own head */}
          {[0, 1, 2].map(i => (
            <div key={i} className="absolute inset-0 flex items-center justify-center">
              <div style={{ animation: `gbaConfusionStarOrbit 1.15s linear ${0.15 + i * 0.28}s forwards`, opacity: 0 }}>
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <polygon points="7,0 8.8,5 14,5 9.8,8.2 11.4,14 7,10.4 2.6,14 4.2,8.2 0,5 5.2,5" fill="#fde047" opacity="0.9" />
                </svg>
              </div>
            </div>
          ))}
          {/* Counter-clockwise curl: the damage came from within, not from the opponent */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-2xl select-none text-fuchsia-300"
              style={{ animation: 'gbaConfusionSelfCurl 1.05s ease-in-out 0.2s forwards', opacity: 0 }}
            >
              ↺
            </span>
          </div>
        </div>
      )}

      {/* FLOATING COMBAT DAMAGE (aligned with the red HP readout above the card, offset to the right with a small gap) */}
      {fx.damageText && (
        <div className="absolute left-full top-0 ml-1 flex flex-col items-start z-50 select-none pointer-events-none animate-damage-float whitespace-nowrap">
          <div className={`text-[11px] sm:text-xs md:text-sm font-black drop-shadow-[0_2px_8px_rgba(0,0,0,1)] tracking-wide whitespace-nowrap leading-tight ${fx.isSelfTarget ? 'text-emerald-300' : 'text-rose-400'}`}>
            {fx.damageText}
          </div>
          {fx.type === 'confusion_self_hit' && (
            <div className="text-[7px] sm:text-[8px] font-bold text-fuchsia-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] tracking-wider uppercase leading-tight mt-px">
              {lang === 'tr' ? 'Kafası karıştı!' : 'Confused!'}
            </div>
          )}
          {fx.isWeakness && (
            <div className="text-[7px] sm:text-[8px] font-bold text-orange-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] tracking-wider uppercase leading-tight mt-px">
              {lang === 'tr' ? 'Zayıflık ×2' : 'Weakness ×2'}
            </div>
          )}
          {fx.isResistance && (
            <div className="text-[7px] sm:text-[8px] font-bold text-sky-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] tracking-wider uppercase leading-tight mt-px">
              {lang === 'tr' ? 'Direnç -30' : 'Resistance -30'}
            </div>
          )}
          {fx.powerDisabledName && (
            <div className="text-[7px] sm:text-[8px] font-bold text-fuchsia-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] tracking-wider uppercase leading-tight mt-px">
              {lang === 'tr' ? `${fx.powerDisabledName} devre dışı` : `${fx.powerDisabledName} off`}
            </div>
          )}
        </div>
      )}

      {/* POISON TICK DAMAGE (GBA-authentic purple nausea pulse + toxic bubbles) */}
      {fx.type === 'poison_tick' && (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden rounded-xl">
          {/* Full-card purple nausea overlay (pure purple tint, no backdrop blur — blur sampled the dark board background and leaked a gray block outside the card) */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              animation: 'gbaPoisonCardNausea 1.4s ease-in-out forwards',
              background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.12) 0%, rgba(147,51,234,0.14) 55%, rgba(168,85,247,0.16) 100%)'
            }}
          />
          {/* GBA-style purple poison bubbles rising (SVG) */}
          <div className="absolute bottom-[20%] left-[25%]" style={{ animation: 'gbaPoisonWisp 1.3s ease-out 0.1s forwards', opacity: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="6" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.7" />
              <circle cx="7" cy="7" r="3" fill="#c084fc" opacity="0.4" />
              <circle cx="5" cy="5" r="1.2" fill="#e9d5ff" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute bottom-[30%] right-[28%]" style={{ animation: 'gbaPoisonWisp 1.3s ease-out 0.3s forwards', opacity: 0 }}>
            <svg width="10" height="10" viewBox="0 0 10 10">
              <circle cx="5" cy="5" r="4" fill="none" stroke="#9333ea" strokeWidth="1.2" opacity="0.6" />
              <circle cx="5" cy="5" r="2" fill="#a855f7" opacity="0.35" />
              <circle cx="3.5" cy="3.5" r="1" fill="#e9d5ff" opacity="0.5" />
            </svg>
          </div>
          <div className="absolute bottom-[45%] left-[45%]" style={{ animation: 'gbaPoisonWisp 1.3s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="8" height="8" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.5" />
              <circle cx="4" cy="4" r="1.5" fill="#8b5cf6" opacity="0.3" />
            </svg>
          </div>
          {/* GBA-style poison droplet icon (replaces generic skull) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2" style={{ animation: 'gbaPoisonSkull 1.2s ease-out 0.1s forwards', opacity: 0 }}>
            <svg width="20" height="24" viewBox="0 0 20 24" className="drop-shadow-[0_0_5px_#a855f7]">
              {/* Poison droplet shape */}
              <path d="M10 2 Q10 2 14 10 Q17 15 17 17 Q17 22 10 22 Q3 22 3 17 Q3 15 6 10 Q10 2 10 2 Z" fill="#7c3aed" opacity="0.85" />
              <path d="M10 4 Q10 4 13 10 Q15.5 14.5 15.5 16.5 Q15.5 20.5 10 20.5 Q4.5 20.5 4.5 16.5 Q4.5 14.5 7 10 Q10 4 10 4 Z" fill="#a855f7" opacity="0.7" />
              {/* Shine highlight */}
              <ellipse cx="7.5" cy="13" rx="1.5" ry="2.5" fill="#e9d5ff" opacity="0.5" />
              {/* Small bubble inside */}
              <circle cx="11" cy="17" r="1.5" fill="#c084fc" opacity="0.5" />
              <circle cx="8" cy="18.5" r="1" fill="#ddd6fe" opacity="0.4" />
            </svg>
          </div>
          {/* Purple poison damage text */}
          {fx.damageText && (
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 font-bold text-xs select-none"
              style={{
                animation: 'gbaPoisonDmgFloat 1.3s ease-out 0.2s forwards',
                opacity: 0,
                color: '#c084fc',
                textShadow: '0 0 6px #6b21a8, 0 1px 3px rgba(0,0,0,0.9)'
              }}
            >
              {fx.damageText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface BattleFXOverlayProps {
  fxList?: ActiveFX[];
  activeFXList?: ActiveFX[];
  onFXComplete: (id: string) => void;
  targetFilter?: 'player' | 'cpu';
  /**
   * Which slot of the side this overlay sits on. The Active Pokémon keeps the default, while a
   * bench card passes its index so a move that picked a Benched victim (Stare) or swept the
   * bench (Poison Vapor) animates where it actually landed.
   */
  slot?: 'active' | 'bench';
  benchIndex?: number;
  lang?: Language;
}

export const BattleFXOverlay: React.FC<BattleFXOverlayProps> = ({
  fxList,
  activeFXList,
  onFXComplete,
  targetFilter,
  slot = 'active',
  benchIndex,
  lang = 'tr'
}) => {
  const list = fxList || activeFXList || [];
  const filteredFX = list.filter(f => {
    if (targetFilter && f.target !== targetFilter) return false;
    const fxSlot = f.slot || 'active';
    if (fxSlot !== slot) return false;
    if (slot === 'bench' && f.benchIndex !== benchIndex) return false;
    return true;
  });

  if (filteredFX.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-visible flex items-center justify-center">
      {filteredFX.map(fx => (
        <SingleFX
          key={fx.id}
          fx={fx}
          onComplete={() => onFXComplete(fx.id)}
          lang={lang}
        />
      ))}
    </div>
  );
};
