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
    | 'hydro_pump_cannons'
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
    | 'hitmonchan_special_punch'
    | 'bat_wing_flap'
    | 'water_vortex'
    | 'bubble_gentle'
    | 'sticky_hands_grab'
    | 'hyper_beam_ice'
    | 'super_psy_blast'
    | 'amnesia_mind_wipe'
    | 'seismic_toss_machamp'
    | 'heavy_thunder_strike'
    | 'dragonite_slam'
    | 'toxic_corrosion'
    | 'mega_punch_nidoqueen'
    | 'pidgeot_hurricane'
    | 'submission_grapple'
    | 'super_fang_guillotine'
    | 'victreebel_acid_melt'
    | 'raichu_gigashock'
    | 'beedrill_twineedle'
    | 'dugtrio_earthquake'
    | 'electrode_chain_lightning'
    | 'vaporeon_hydro_pump'
    | 'gengar_dark_mind'
    | 'muk_sludge_deluge'
    | 'machamp_karate_chop'
    | 'haunter_dream_eater'
    | 'hypno_hypnotic_pendulum'
    | 'weezing_toxic_smog'
    | 'golem_avalanche'
    | 'wigglytuff_do_the_wave'
    | 'vileplume_petal_dance'
    | 'poliwrath_whirlpool_vortex'
    | 'dewgong_aurora_beam'
    | 'kabutops_sickle_slash'
    | 'marowak_bonemerang'
    | 'nidoking_thrash_fury'
    | 'kingler_crabhammer'
    | 'krabby_irongrip'
    | 'primeape_tantrum_rampage'
    | 'rhydon_horn_drill'
    | 'exeggutor_big_eggsplosion'
    | 'butterfree_mega_drain'
    | 'ninetales_fire_blast'
    | 'hyper_beam_annihilation'
    | 'fearow_drill_peck'
    | 'venomoth_venom_powder'
    | 'rapidash_flame_stomp'
    | 'graveler_rock_throw'
    | 'jolteon_pin_missile'
    | 'dark_gyarados_ice_beam'
    | 'arbok_poison_fang'
    | 'golbat_leech_life'
    | 'dark_blastoise_hydrocannon'
    | 'dark_charizard_fireball'
    | 'farfetchd_leek_slap'
    | 'cubone_bone_strike'
    | 'bulbasaur_leech_seed'
    | 'squirtle_shell_defense'
    | 'pikachu_thunder_jolt'
    | 'charmander_ember_flame'
    | 'ekans_wrap_constrict'
    | 'sandshrew_sand_attack'
    | 'caterpie_string_shot'
    | 'weedle_poison_sting'
    | 'zubat_supersonic'
    | 'gastly_sleeping_gas'
    | 'rattata_quick_attack'
    | 'rattata_gnaw_bite'
    | 'pidgey_whirlwind'
    | 'meowth_pay_day'
    | 'meowth_coin_hurl'
    | 'spearow_peck'
    | 'spearow_mirror_move'
    | 'poliwag_water_gun'
    | 'geodude_stone_barrage'
    | 'vulpix_confuse_ray'
    | 'oddish_stun_spore'
    | 'oddish_sprout'
    | 'jigglypuff_lullaby'
    | 'jigglypuff_pound'
    | 'clefairy_metronome'
    | 'clefairy_sing'
    | 'abra_psyshock'
    | 'abra_vanish'
    | 'drowzee_pound'
    | 'drowzee_confuse_ray'
    | 'drowzee_nightmare'
    | 'snorlax_body_slam'
    | 'lickitung_tongue_wrap'
    | 'lickitung_supersonic'
    | 'kangaskhan_comet_punch'
    | 'kangaskhan_fetch'
    | 'tauros_stomp'
    | 'tauros_rampage';
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
  attackerType?: string;
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
  /**
   * Per-coin strike results for multi-coin attacks (e.g. Doubleslap [coin1, coin2]).
   */
  multiHitSequence?: boolean[];
}

/**
 * Iconic Pokémon Confusion Spiral paths (derived from the in-game confusion state / self-hit SVG).
 * Classic smooth cubic-Bézier coil radiating outward from the center (26, 26).
 * - CONFUSE_SPIRAL_BASE: Authentic 5-loop confusion status spiral (matches confusion_self_hit).
 * - CONFUSE_SPIRAL_EXTENDED: Elevated 7-loop attack variant with extended depth and outer flourish.
 */
const CONFUSE_SPIRAL_BASE =
  'M26 26 C 26 20, 32 20, 32 26 C 32 34, 20 34, 20 26 C 20 14, 38 14, 38 26 C 38 40, 14 40, 14 26 C 14 8, 44 8, 44 26';
const CONFUSE_SPIRAL_EXTENDED =
  'M26 26 C 26 20, 32 20, 32 26 C 32 34, 20 34, 20 26 C 20 14, 38 14, 38 26 C 38 40, 14 40, 14 26 C 14 8, 44 8, 44 26 C 44 47, 6 47, 6 26 C 6 3, 49 3, 49 26';

export function getSpecificAttackFX(attack: Attack, pokemonCard: Card): ActiveFX['type'] {
  const name = attack.name.toLowerCase().trim();
  const pkm = pokemonCard.name.toLowerCase();

  // 0. BATCH 16: BASIC POKÉMON (GROUP A & GROUP B) SIGNATURE DISPATCHES
  // Rattata: Quick Attack & Incisor Gnaw / Bite
  if (pkm.includes('rattata')) {
    if (name.includes('quick attack')) return 'rattata_quick_attack';
    if (name.includes('bite') || name.includes('gnaw')) return 'rattata_gnaw_bite';
  }
  // Pidgey: Whirlwind
  if ((pkm.includes('pidgey') || pkm.includes('pidgeotto')) && name.includes('whirlwind')) {
    return 'pidgey_whirlwind';
  }
  // Meowth: Pay Day & Coin Hurl
  if (pkm.includes('meowth')) {
    if (name.includes('pay day') || name.includes('payday')) return 'meowth_pay_day';
    if (name.includes('coin hurl') || name.includes('coin')) return 'meowth_coin_hurl';
  }
  // Spearow: Peck & Mirror Move
  if (pkm.includes('spearow')) {
    if (name.includes('peck')) return 'spearow_peck';
    if (name.includes('mirror move')) return 'spearow_mirror_move';
  }
  // Poliwag, Poliwhirl & Poliwrath: Belly Spiral Water Gun
  if ((pkm.includes('poliwag') || pkm.includes('poliwhirl') || pkm.includes('poliwrath')) && name.includes('water gun')) {
    return 'poliwag_water_gun';
  }
  // Geodude: Stone Barrage
  if (pkm.includes('geodude') && (name.includes('stone barrage') || name.includes('rock throw') || name.includes('barrage'))) {
    return 'geodude_stone_barrage';
  }
  // Vulpix: Confuse Ray (Mystical Kitsunebi Fox-Fire)
  if (pkm.includes('vulpix') && (name.includes('confuse ray') || name.includes('confusion ray') || name.includes('foxfire'))) {
    return 'vulpix_confuse_ray';
  }
  // Oddish: Stun Spore & Sprout
  if (pkm.includes('oddish')) {
    if (name.includes('stun spore') || name.includes('spore')) return 'oddish_stun_spore';
    if (name.includes('sprout')) return 'oddish_sprout';
  }

  // 0b. BATCH 17: BASIC POKÉMON (GROUP C & GROUP D) SIGNATURE DISPATCHES
  // Jigglypuff: Lullaby & Pound
  if (pkm.includes('jigglypuff')) {
    if (name.includes('lullaby')) return 'jigglypuff_lullaby';
    if (name.includes('pound')) return 'jigglypuff_pound';
  }
  // Clefairy: Metronome & Sing
  if (pkm.includes('clefairy')) {
    if (name.includes('metronome')) return 'clefairy_metronome';
    if (name.includes('sing')) return 'clefairy_sing';
  }
  // Abra: Psyshock & Vanish
  if (pkm.includes('abra')) {
    if (name.includes('psyshock')) return 'abra_psyshock';
    if (name.includes('vanish') || name.includes('teleport')) return 'abra_vanish';
  }
  // Drowzee: Pound, Confuse Ray & Nightmare
  if (pkm.includes('drowzee')) {
    if (name.includes('pound')) return 'drowzee_pound';
    if (name.includes('confuse ray') || name.includes('confusion')) return 'drowzee_confuse_ray';
    if (name.includes('nightmare')) return 'drowzee_nightmare';
  }
  // Snorlax: Body Slam
  if (pkm.includes('snorlax')) {
    if (name.includes('body slam') || name.includes('slam')) return 'snorlax_body_slam';
  }
  // Lickitung: Tongue Wrap & Supersonic
  if (pkm.includes('lickitung')) {
    if (name.includes('tongue wrap') || name.includes('tongue')) return 'lickitung_tongue_wrap';
    if (name.includes('supersonic')) return 'lickitung_supersonic';
  }
  // Kangaskhan: Comet Punch & Fetch
  if (pkm.includes('kangaskhan')) {
    if (name.includes('comet punch')) return 'kangaskhan_comet_punch';
    if (name.includes('fetch')) return 'kangaskhan_fetch';
  }
  // Tauros: Stomp & Rampage
  if (pkm.includes('tauros')) {
    if (name.includes('rampage')) return 'tauros_rampage';
    if (name.includes('stomp')) return 'tauros_stomp';
  }

  // Bite: Ekans/Arbok get jaw-teeth variant; Super Fang gets dedicated guillotine incisors; others keep star-fang
  if (name.includes('super fang') || (pkm.includes('raticate') && name.includes('fang'))) return 'super_fang_guillotine';
  if ((name === 'bite' || name.includes('bite') || name.includes('fang') || name === 'hyper fang')) {
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
  // Crabhammer: Kingler gets dedicated Crabhammer variant
  if (name.includes('crabhammer') || name.includes('crab hammer')) return 'kingler_crabhammer';
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
  // Irongrip: Krabby gets dedicated Iron Grip variant
  if (name.includes('irongrip') || name.includes('iron grip')) {
    if (pkm.includes('krabby') || pkm.includes('kingler')) return 'krabby_irongrip';
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
  if ((name.includes('poison fang') || name.includes('terror strike')) && pkm.includes('arbok')) return 'arbok_poison_fang';
  if (name.includes('poison sting') && (pkm.includes('weedle') || pkm.includes('kakuna') || pkm.includes('beedrill') || pkm.includes('sandslash'))) return 'weedle_poison_sting';
  if (name.includes('poison sting')) return 'weedle_poison_sting';
  if (name.includes('poison fang') || name.includes('spit poison')) return 'poison_sting';
  if (name === 'poison gas' || name.includes('poison gas')) return 'poison_gas';
  if (name === 'foul gas' || name.includes('foul gas')) return 'foul_gas';
  if (name === 'stun gas' || name.includes('stun gas')) return 'stun_gas';
  if (name === 'foul odor' || name.includes('foul odor')) return 'foul_odor';
  if (name === 'stun spore' || name.includes('stun spore')) return 'stun_spore';
  if (name === 'lullaby' || name.includes('lullaby') || name === 'sing' || name.includes('sing')) return 'sing_lullaby';
  if (name.includes('sludge')) return 'muk_sludge_deluge';
  if (name.includes('smog')) return 'weezing_toxic_smog';
  if (name.includes('destiny bond') && (pkm.includes('gastly') || pkm.includes('haunter') || pkm.includes('gengar'))) return 'gastly_sleeping_gas';
  if (name.includes('destiny bond')) return 'destiny_bond_curse';
  if (name.includes('dark mind')) return 'gengar_dark_mind';
  if (name.includes('nightmare')) return 'nightmare_spook';
  if ((name.includes('sleeping gas') || name.includes('lick')) && (pkm.includes('gastly') || pkm.includes('haunter'))) return 'gastly_sleeping_gas';
  if (name.includes('lick')) return 'lick_tongue';
  if (name.includes('meditate')) return 'meditate_zen';

  // 2. Spores, Powders & Showers
  if (name.includes('venom powder') || (pkm.includes('venomoth') && name.includes('powder'))) return 'venomoth_venom_powder';
  if (name.includes('poison powder') || name.includes('poisonpowder') || name.includes('toxic powder') || name.includes('venom powder')) return 'poisonpowder_shower';
  if (name.includes('sleep powder') || name.includes('sleeppowder') || name.includes('lullaby powder') || name.includes('spore') || name.includes('afternoon nap')) return 'sleep_powder_drift';

  // 3. Electric & Shocks
  if (name.includes('chain lightning') || (pkm.includes('electrode') && name.includes('lightning'))) return 'electrode_chain_lightning';
  if (name.includes('gigashock') || (pkm.includes('raichu') && name.includes('shock'))) return 'raichu_gigashock';
  if ((name.includes('thunder jolt') || name.includes('spark') || name.includes('gnaw')) && pkm.includes('pikachu')) return 'pikachu_thunder_jolt';
  if (name.includes('thunder jolt')) return 'pikachu_thunder_jolt';
  if (name === 'thunder' || (name.includes('thunder') && !name.includes('wave') && !name.includes('shock') && !name.includes('punch'))) return 'heavy_thunder_strike';
  if (name.includes('thunder wave') || name.includes('thunderwave') || name.includes('thundershock') || name.includes('thunder') || name.includes('spark') || name.includes('shock') || name.includes('bolt')) return 'thunder_wave';

  // 4. Fire Streams & Blazes — diversified per-move
  if (name.includes('fire blast')) return 'ninetales_fire_blast';
  if (name.includes('fire spin')) return 'fire_spin_vortex';
  if (name.includes('fire punch')) return 'fire_punch_blaze';
  if (name.includes('flame pillar')) return 'flame_pillar';
  if (name.includes('wildfire')) return 'wildfire_scorch';
  if ((name.includes('continuous fireball') || name.includes('fireball')) && pkm.includes('charizard')) return 'dark_charizard_fireball';
  if (name.includes('continuous fireball') || name.includes('fireball')) return 'fireball_barrage';
  if (name.includes('playing with fire')) return 'playing_with_fire';
  if ((name.includes('ember') || name.includes('fire tail')) && pkm.includes('charmander')) return 'charmander_ember_flame';
  if (name.includes('ember')) return 'ember_spark';
  if (name.includes('flame tail') || name.includes('fire tail')) return 'flame_tail_whip';
  if (name.includes('flamethrower')) return 'flamethrower_stream';
  if (name.includes('fire') || name.includes('flame') || name.includes('burn')) return 'flamethrower_blaze';

  // 5. Water & Ice
  if (name.includes('waterfall')) return 'waterfall_surf';
  // Blastoise fires Hydro Pump through the twin water cannons on its shell — dedicated FX.
  if (name.includes('hydro pump') && pkm.includes('blastoise')) return 'hydro_pump_cannons';
  if (name.includes('hydro pump') && (pkm.includes('vaporeon') || pkm.includes('eevee'))) return 'vaporeon_hydro_pump';
  if (name.includes('hydro pump') || name.includes('water gun') || name.includes('surf') || name.includes('tsunami') || name.includes('hydro') || name.includes('aqua')) return 'water_gun_stream';
  if (name.includes('bubblebeam')) return 'bubblebeam';
  if (name.includes('bubble')) return 'bubble_gentle';
  if (name.includes('star freeze') || name.includes('freeze star')) return 'star_freeze';
  if (name.includes('aurora beam')) return 'dewgong_aurora_beam';
  if (name.includes('ice beam') && pkm.includes('gyarados')) return 'dark_gyarados_ice_beam';
  if (name.includes('ice beam') || name.includes('blizzard') || name.includes('freeze') || name.includes('frost')) return 'ice_beam_frost';

  // 6. Psychic & Mind
  if (name.includes('psybeam') || name.includes('kaleidoscope')) return 'psybeam_kaleidoscope';
  if (name.includes('dream eater')) return 'haunter_dream_eater';
  if (name.includes('super psy')) return 'super_psy_blast';
  if (name.includes('amnesia')) return 'amnesia_mind_wipe';
  if (name.includes('confuse ray') || name.includes('confusion ray') || name.includes('eerie light')) return 'confuse_ray_spiral';
  if (name.includes('prophecy') || (pkm.includes('hypno') && (name.includes('hypno') || name.includes('mind shock')))) return 'hypno_hypnotic_pendulum';
  if (name.includes('psychic') || name.includes('hypnosis') || name.includes('night shade')) return 'psychic_distortion';

  // 7. Grass & Nature
  if (name.includes('solar beam') || name.includes('solarbeam')) return 'solar_beam_charge_blast';
  if (name.includes('petal')) return 'vileplume_petal_dance';
  if (name.includes('mega drain')) return 'butterfree_mega_drain';
  if (name.includes('leech seed')) return 'bulbasaur_leech_seed';
  if (name.includes('vine whip') || name.includes('razor leaf') || name.includes('absorb') || name.includes('giga drain')) return 'leech_seed_vines';
  if ((name.includes('wrap') || name.includes('constrict') || name.includes('spit poison')) && (pkm.includes('ekans') || pkm.includes('arbok') || pkm.includes('dratini'))) return 'ekans_wrap_constrict';
  if (name.includes('wrap') || name.includes('constrict')) return 'ekans_wrap_constrict';
  if (name.includes('string shot') && (pkm.includes('caterpie') || pkm.includes('metapod'))) return 'caterpie_string_shot';
  if (name.includes('string shot')) return 'caterpie_string_shot';
  if (name.includes('web') || name.includes('bind')) return 'string_shot_cocoon';

  // 8. Martial Arts, Slashing, Punching
  if (name.includes('sharp sickle') || (name.includes('absorb') && pkm.includes('kabutops'))) return 'kabutops_sickle_slash';
  if (name.includes('slash') || name.includes('fury swipes') || name.includes('scratch') || name.includes('cut') || name.includes('claw') || name.includes('gnaw') || name.includes('nail flick')) return 'slash';
  if (name.includes('mega punch') || (name.includes('boyfriends') && pkm.includes('nidoqueen'))) return 'mega_punch_nidoqueen';
  if (name.includes('karate chop')) return 'machamp_karate_chop';
  if (name.includes('punch') || name.includes('cross chop') || name.includes('comet punch') || name.includes('pound') || name.includes('jab') || name.includes('irongrip')) return 'punch';
  if (name.includes('submission')) return 'submission_grapple';
  if (name.includes('kick') || name.includes('smash kick') || name.includes('stretch kick') || name.includes('high jump kick') || name.includes('low kick') || name.includes('rear kick') || name.includes('double kick')) return 'kick_strike';
  if (name.includes('seismic toss')) return 'seismic_toss_machamp';
  if (name.includes('slam') && (pkm.includes('dragonite') || pkm.includes('dragonair'))) return 'dragonite_slam';
  if (name.includes('earthquake') && (pkm.includes('dugtrio') || pkm.includes('diglett'))) return 'dugtrio_earthquake';
  if (name.includes('rock throw')) return 'graveler_rock_throw';
  if (name.includes('seismic toss') || name.includes('slam') || name.includes('body slam') || name.includes('rock slide') || name.includes('fissure') || name.includes('earthquake') || name.includes('dig') || name.includes('pot smash')) return 'seismic_slam';
  // Clamp: Cloyster gets anatomical shell-clamp; others keep guillotine blade
  if (name.includes('clamp')) {
    if (pkm.includes('cloyster')) return 'cloyster_clamp';
    return 'guillotine_snap';
  }
  if (name.includes('crabhammer')) return 'kingler_crabhammer';
  if (name.includes('guillotine') || name.includes('vice grip') || name.includes('vise grip')) return 'guillotine_snap';

  // 9. Projectiles & Flight
  if (name.includes('horn drill')) return 'rhydon_horn_drill';
  if (name.includes('drill peck')) return 'fearow_drill_peck';
  if (name.includes('drill peck') || name.includes('peck') || name.includes('drill run')) return 'drill_peck_spiral';
  // Spike Cannon: Cloyster fires anatomical shell spikes; others keep generic pin volley
  if (name.includes('spike cannon')) {
    if (pkm.includes('cloyster')) return 'cloyster_spike_cannon';
    return 'pin_missile_volley';
  }
  if (name.includes('twineedle')) return 'beedrill_twineedle';
  if (name.includes('pin missile') && (pkm.includes('jolteon') || pkm.includes('eevee'))) return 'jolteon_pin_missile';
  if (name.includes('pin missile')) return 'pin_missile_volley';
  if (name.includes('sand attack') || name.includes('sand-attack')) {
    if (pkm.includes('sandshrew') || pkm.includes('sandslash')) return 'sandshrew_sand_attack';
    if (pkm.includes('eevee')) return 'sand_attack_dust';
    return 'sand_attack_throw';
  }
  if (name.includes('whirlpool')) return 'poliwrath_whirlpool_vortex';
  if (name.includes('flitter')) return 'bat_wing_flap';
  if (name.includes('hurricane') || (pkm.includes('pidgeot') && (name.includes('whirlwind') || name.includes('gust')))) return 'pidgeot_hurricane';
  if (name.includes('whirlwind') || name.includes('gust') || name.includes('tornado') || name.includes('cyclone') || name.includes('whirlpool')) return 'whirlwind_cyclone';
  if (name.includes('wing attack') || name.includes('dive bomb')) return 'wing_slash';
  if (name.includes('pay day') || name.includes('scavenge') || name.includes('coin hurl') || name.includes('fetch')) return 'pay_day_coins';
  if (name.includes('big eggsplosion') || name.includes('eggsplosion')) return 'exeggutor_big_eggsplosion';
  if (name.includes('selfdestruct') || name.includes('explosion') || name.includes('mass explosion')) return 'selfdestruct_shockwave';
  if (name.includes('hyper beam') && pkm.includes('golduck')) return 'hyper_beam_ice';
  if (name.includes('hyper beam')) return 'hyper_beam_annihilation';
  if (name.includes('energy bomb') || name.includes('speed ball') || name.includes('sonicboom')) return 'hyper_beam_laser';
  if (name.includes('horn attack') || name.includes('horn hazard')) return 'horn_gore';

  // 10. Dragon, Charge & Physical
  if (name.includes('dragon rage')) return 'dragon_rage';

  // 10a. Specific physical attacks with unique, thematic animations
  if (name.includes('mud slap')) return 'mud_slap_throw';
  if (name === 'quick attack') return 'quick_attack_dash';
  if ((name.includes('take down') || name.includes('double-edge')) && (pokemonCard.types?.[0] === 'Fire')) return 'fire_take_down';
  if ((name.includes('flail') || name.includes('flop')) && (pokemonCard.types?.[0] === 'Water')) return 'fish_flail';
  if (name === 'slap' && (pkm.includes('staryu') || pkm.includes('starmie'))) return 'starfish_slap';
  if (name.includes('leek slap') || (pkm.includes('farfetch') && (name.includes('slap') || name.includes('smash') || name.includes('pot smash')))) return 'farfetchd_leek_slap';
  if ((name.includes('bone') || name.includes('rage') || name.includes('snivel')) && pkm.includes('cubone')) return 'cubone_bone_strike';
  if (name.includes('bone club')) return 'cubone_bone_strike';

  // 10b. Generic physical charge (remaining body-slam style moves)
  if (name.includes('stomp') && (pkm.includes('rapidash') || pkm.includes('ponyta'))) return 'rapidash_flame_stomp';
  if (name.includes('tantrum')) return 'primeape_tantrum_rampage';
  if (name.includes('thrash') && pkm.includes('nidoking')) return 'nidoking_thrash_fury';
  if (name.includes('headbutt') || name.includes('ram') || name.includes('take down') || name.includes('double-edge') || name.includes('quick attack') || name.includes('flail') || name.includes('thrash') || name.includes('pounce') || name.includes('knock back') || name.includes('knock down') || name.includes('fury attack') || name.includes('tail slap') || name.includes('tail strike') || name.includes('giant tail') || name.includes('rolling tackle') || name.includes('rocket tackle') || name.includes('flop') || name.includes('slap') || name.includes('frenzied attack')) return 'physical_charge';

  // 11. Defensive, Healing & Buff
  if ((name.includes('withdraw') || name.includes('shell attack') || name.includes('hide in shell')) && (pkm.includes('squirtle') || pkm.includes('wartortle') || pkm.includes('blastoise') || pkm.includes('shellder'))) return 'squirtle_shell_defense';
  if (name.includes('harden') || name.includes('withdraw') || name.includes('minimize') || name.includes('stiffen') || name.includes('scrunch') || name.includes('hide in shell') || name.includes('shell attack') || name.includes('mirror shell') || name === 'barrier') return 'defensive_harden';
  if (name.includes('recover') || name.includes('spacing out') || name.includes('rapid evolution')) return 'recover_heal';
  if (name.includes('swords dance')) {
    if (pkm.includes('scyther')) return 'scyther_blade_dance';
    return 'swords_dance_buff';
  }
  if (name.includes('supersonic')) return 'zubat_supersonic';
  if (name.includes('avalanche')) return 'golem_avalanche';
  if (name.includes('bonemerang')) return 'marowak_bonemerang';
  if (name.includes('leech life') && (pkm.includes('golbat') || pkm.includes('zubat'))) return 'golbat_leech_life';
  if (name.includes('leech life')) return 'drain_life';

  // 12. Additional poison / misc mappings
  if (name === 'toxic' || name.includes('toxic') || (name.includes('poison') && pkm.includes('nidoking'))) return 'toxic_corrosion';
  if (name.includes('acid')) return 'victreebel_acid_melt';
  if (name.includes('poison claws') || name.includes('jellyfish sting')) return 'poison_sting';
  if (name.includes('nasty goo')) return 'nasty_goo';
  if (name.includes('sticky hands')) return 'sticky_hands_grab';
  if (name.includes('vanish') || name.includes('mischief')) return 'whirlwind_cyclone';
  if (name.includes('magnetic lines') || name.includes('magnetism') || name.includes('lightning flash') || name.includes('chain lightning') || name.includes('electric shock') || name.includes('thunder jolt') || name.includes('thunder attack') || name.includes('surprise thunder') || name.includes('thunderbolt')) return 'thunder_wave';
  if (name.includes('flare')) return 'flare_burst';
  if (name.includes('wildfire')) return 'wildfire_scorch';
  if (name.includes('continuous fireball') || name.includes('fireball')) return 'fireball_barrage';
  if (name.includes('playing with fire')) return 'playing_with_fire';
  if (name.includes('do the wave')) return 'wigglytuff_do_the_wave';
  if (name.includes('hydrocannon')) return 'dark_blastoise_hydrocannon';
  if (name.includes('metronome') || name.includes('mirror move') || name.includes('teleport') || name.includes('headache') || name.includes('transform attack') || name.includes('conversion')) return 'psychic_distortion';
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

/**
 * Returns the total animation duration (ms) for a given FX type.
 * Used both by SingleFX to self-remove after the animation completes AND by
 * GameBoard to delay knockout / damage-resolution until the visual finishes.
 */
export const getFXDuration = (type: ActiveFX['type']): number => {
  switch (type) {
    case 'poison_tick':
      return 1600;
    case 'hydro_pump_cannons':
      return 2500; // shell 1.9s + jets 0.3s+1.4s + impact 0.9s+1.3s ≈ 2.2s + buffer
    case 'solar_beam_charge_blast':
      return 2200;
    case 'selfdestruct_shockwave':
      return 2100;
    case 'blizzard_storm':
      return 2000;
    case 'seismic_slam':
      return 1900;
    case 'hyper_beam_laser':
      return 1900;
    case 'star_freeze':
      return 1800;
    case 'water_gun_stream':
      return 1600;
    case 'flamethrower_blaze':
      return 1600;
    case 'flamethrower_stream':
      return 1600;
    case 'ice_beam_frost':
      return 1600;
    case 'fire_blast_star':
      return 1700;
    case 'fire_spin_vortex':
      return 1850;
    case 'dragon_rage':
      return 1750;
    case 'seismic_toss_machamp':
      return 1800;
    case 'heavy_thunder_strike':
      return 1650;
    case 'fire_take_down':
      return 1650;
    case 'water_vortex':
      return 1750;
    case 'dragonite_slam':
      return 1800;
    case 'toxic_corrosion':
      return 1700;
    case 'mega_punch_nidoqueen':
      return 1600;
    case 'pidgeot_hurricane':
      return 1800;
    case 'submission_grapple':
      return 1700;
    case 'super_fang_guillotine':
      return 1600;
    case 'victreebel_acid_melt':
      return 1750;
    case 'raichu_gigashock':
      return 1850;
    case 'beedrill_twineedle':
      return 1500;
    case 'dugtrio_earthquake':
      return 1750;
    case 'electrode_chain_lightning':
      return 1800;
    case 'vaporeon_hydro_pump':
      return 1700;
    case 'gengar_dark_mind':
      return 1800;
    case 'muk_sludge_deluge':
      return 1750;
    case 'machamp_karate_chop':
      return 1550;
    case 'haunter_dream_eater':
      return 1800;
    case 'hypno_hypnotic_pendulum':
      return 1700;
    case 'weezing_toxic_smog':
      return 1700;
    case 'golem_avalanche':
      return 1800;
    case 'psybeam_kaleidoscope':
      return 1650;
    case 'wigglytuff_do_the_wave':
      return 1750;
    case 'vileplume_petal_dance':
      return 1700;
    case 'poliwrath_whirlpool_vortex':
      return 1800;
    case 'dewgong_aurora_beam':
      return 1700;
    case 'kabutops_sickle_slash':
      return 1600;
    case 'marowak_bonemerang':
      return 1800;
    case 'nidoking_thrash_fury':
      return 1750;
    case 'kingler_crabhammer':
    case 'crab_hammer_slam':
      return 1650;
    case 'krabby_irongrip':
    case 'claw_pinch':
      return 1400;
    case 'primeape_tantrum_rampage':
      return 1700;
    case 'rhydon_horn_drill':
      return 1650;
    case 'exeggutor_big_eggsplosion':
      return 1850;
    case 'butterfree_mega_drain':
      return 1700;
    case 'ninetales_fire_blast':
      return 1800;
    case 'hyper_beam_annihilation':
      return 1950;
    case 'fearow_drill_peck':
      return 1550;
    case 'venomoth_venom_powder':
      return 1700;
    case 'rapidash_flame_stomp':
      return 1650;
    case 'graveler_rock_throw':
      return 1600;
    case 'jolteon_pin_missile':
      return 1750;
    case 'dark_gyarados_ice_beam':
      return 1750;
    case 'arbok_poison_fang':
      return 1650;
    case 'golbat_leech_life':
      return 1700;
    case 'dark_blastoise_hydrocannon':
      return 1800;
    case 'dark_charizard_fireball':
      return 1850;
    case 'farfetchd_leek_slap':
      return 1550;
    case 'cubone_bone_strike':
      return 1650;
    case 'bulbasaur_leech_seed':
      return 1750;
    case 'squirtle_shell_defense':
      return 1600;
    case 'pikachu_thunder_jolt':
      return 1650;
    case 'charmander_ember_flame':
      return 1600;
    case 'ekans_wrap_constrict':
      return 1750;
    case 'sandshrew_sand_attack':
      return 1550;
    case 'caterpie_string_shot':
      return 1650;
    case 'weedle_poison_sting':
      return 1550;
    case 'zubat_supersonic':
      return 1600;
    case 'gastly_sleeping_gas':
      return 1700;
    case 'rattata_quick_attack':
      return 1550;
    case 'rattata_gnaw_bite':
      return 1500;
    case 'pidgey_whirlwind':
      return 1650;
    case 'meowth_pay_day':
    case 'meowth_coin_hurl':
      return 1650;
    case 'spearow_peck':
      return 1550;
    case 'spearow_mirror_move':
      return 1650;
    case 'poliwag_water_gun':
      return 1650;
    case 'geodude_stone_barrage':
      return 1700;
    case 'vulpix_confuse_ray':
      return 1700;
    case 'oddish_stun_spore':
      return 1650;
    case 'oddish_sprout':
      return 1600;
    case 'jigglypuff_lullaby':
      return 1750;
    case 'jigglypuff_pound':
      return 1100;
    case 'clefairy_metronome':
      return 1800;
    case 'clefairy_sing':
      return 1650;
    case 'abra_psyshock':
      return 1600;
    case 'abra_vanish':
      return 1300;
    case 'drowzee_pound':
      return 1200;
    case 'drowzee_confuse_ray':
      return 1700;
    case 'drowzee_nightmare':
      return 1650;
    case 'snorlax_body_slam':
      return 1850;
    case 'lickitung_tongue_wrap':
      return 1750;
    case 'lickitung_supersonic':
      return 1650;
    case 'kangaskhan_comet_punch':
      return 1300;
    case 'kangaskhan_fetch':
      return 1200;
    case 'tauros_stomp':
      return 1600;
    case 'tauros_rampage':
      return 1800;
    case 'bubblebeam':
      return 1500;
    case 'drill_peck_spiral':
      return 1500;
    case 'pin_missile_volley':
      return 1500;
    case 'whirlwind_cyclone':
      return 1500;
    case 'smokescreen_cloud':
      return 1500;
    case 'sludge_bomb':
      return 1500;
    case 'smog_haze':
      return 1500;
    case 'doubleslap':
      return 1350;
    case 'confuse_ray_spiral':
      return 1650;
    case 'super_psy_blast':
      return 1350;
    case 'amnesia_mind_wipe':
      return 1400;
    case 'quick_attack_dash':
      return 1150;
    case 'fish_flail':
      return 1300;
    default:
      return 1300;
  }
};


/**
 * Dynamic color palette for Slash / Scratch / Fury Swipes / Claw animations.
 * Selects colors based on the attacker's illustration palette and energy type:
 * - Fire (Charmander, Charmeleon, Dark Charizard): Classic fiery crimson/rose streaks
 * - Grass (Scyther, Paras, Parasect): Mantis blade emerald green with luminous jade highlight
 * - Psyduck (Fury Swipes): Mitsuhiro Arita / Ken Sugimori warm canary-yellow body (not blue water energy)
 * - Ground/Rock/Earth (Dugtrio, Diglett, Sandslash): Luminous warm earthen light brown / golden amber
 * - Colorless Feline/Rodent (Persian, Meowth, Raticate): Razor-sharp silver-white steel claws
 * - Fossil (Kabutops, Kabuto): Ancient razor fossil bronze / burnt amber sickle
 * - Fighting (Mankey, Primeape): Martial fighting warm ochre / fury
 * - Nidoran Female: Soft cerulean blue body with sharp poison claws
 * - Electric (Pikachu, Raichu): Electric lightning gold
 * - Energy Type Fallbacks (Grass, Water, Lightning, Fighting, Psychic, Colorless)
 */
export interface SlashPalette {
  via1: string;
  via2: string;
  glow1: string;
  glow2: string;
  peakGlow: string;
}

export function getSlashPalette(pokemonName = '', attackerType = ''): SlashPalette {
  const pkm = pokemonName.toLowerCase().trim();
  const type = attackerType.toLowerCase().trim();

  // 1. SPECIFIC POKÉMON ILLUSTRATION COLOR & THEMATIC PALETTES
  // Psyduck: Mitsuhiro Arita / Sugimori warm canary-yellow illustration body (not blue water energy)
  if (pkm.includes('psyduck')) {
    return { via1: '#f59e0b', via2: '#fde047', glow1: '#f59e0b', glow2: '#facc15', peakGlow: '#facc15' };
  }
  // Dugtrio, Diglett, Sandslash, Sandshrew: Warm earthen light brown / golden amber (non-dull, high clarity)
  if (pkm.includes('dugtrio') || pkm.includes('diglett') || pkm.includes('sandslash') || pkm.includes('sandshrew')) {
    return { via1: '#d97706', via2: '#fcd34d', glow1: '#d97706', glow2: '#f59e0b', peakGlow: '#f59e0b' };
  }
  // Scyther, Paras, Parasect: Mantis grass green / radiant emerald blade
  if (pkm.includes('scyther') || pkm.includes('paras') || pkm.includes('parasect')) {
    return { via1: '#16a34a', via2: '#4ade80', glow1: '#22c55e', glow2: '#4ade80', peakGlow: '#22c55e' };
  }
  // Persian, Meowth, Raticate: Razor-sharp silver steel claws
  if (pkm.includes('persian') || pkm.includes('meowth') || pkm.includes('raticate')) {
    return { via1: '#94a3b8', via2: '#f1f5f9', glow1: '#cbd5e1', glow2: '#ffffff', peakGlow: '#e2e8f0' };
  }
  // Kabutops, Kabuto: Ancient razor fossil bronze / burnt amber sickle
  if (pkm.includes('kabuto')) {
    return { via1: '#ea580c', via2: '#fdba74', glow1: '#ea580c', glow2: '#fb923c', peakGlow: '#f97316' };
  }
  // Mankey, Primeape: Fighting martial warm ochre / fury
  if (pkm.includes('mankey') || pkm.includes('primeape')) {
    return { via1: '#f59e0b', via2: '#fef08a', glow1: '#f59e0b', glow2: '#fbbf24', peakGlow: '#f59e0b' };
  }
  // Nidoran Female: Soft cerulean blue body with sharp poison claws
  if (pkm.includes('nidoran')) {
    return { via1: '#0284c7', via2: '#7dd3fc', glow1: '#0ea5e9', glow2: '#38bdf8', peakGlow: '#38bdf8' };
  }
  // Pikachu, Raichu: Electric lightning gold
  if (pkm.includes('pikachu') || pkm.includes('raichu')) {
    return { via1: '#eab308', via2: '#fef08a', glow1: '#eab308', glow2: '#fde047', peakGlow: '#facc15' };
  }
  // Charmander, Charmeleon, Charizard: Fiery crimson red (stock slash)
  if (pkm.includes('charmander') || pkm.includes('charmeleon') || pkm.includes('charizard')) {
    return { via1: '#ef4444', via2: '#fb7185', glow1: '#ef4444', glow2: '#f43f5e', peakGlow: '#ef4444' };
  }

  // 2. ENERGY TYPE FALLBACK
  if (type === 'grass') {
    return { via1: '#16a34a', via2: '#4ade80', glow1: '#22c55e', glow2: '#4ade80', peakGlow: '#22c55e' };
  }
  if (type === 'water') {
    return { via1: '#0284c7', via2: '#38bdf8', glow1: '#0284c7', glow2: '#38bdf8', peakGlow: '#38bdf8' };
  }
  if (type === 'lightning') {
    return { via1: '#eab308', via2: '#fef08a', glow1: '#eab308', glow2: '#fde047', peakGlow: '#facc15' };
  }
  if (type === 'fighting') {
    return { via1: '#d97706', via2: '#fcd34d', glow1: '#d97706', glow2: '#f59e0b', peakGlow: '#f59e0b' };
  }
  if (type === 'psychic') {
    return { via1: '#a855f7', via2: '#e879f9', glow1: '#9333ea', glow2: '#c084fc', peakGlow: '#a855f7' };
  }
  if (type === 'colorless') {
    return { via1: '#94a3b8', via2: '#f1f5f9', glow1: '#cbd5e1', glow2: '#ffffff', peakGlow: '#e2e8f0' };
  }

  // Stock crimson red fallback
  return { via1: '#ef4444', via2: '#fb7185', glow1: '#ef4444', glow2: '#f43f5e', peakGlow: '#ef4444' };
}


export const SingleFX: React.FC<SingleFXProps> = ({ fx, onComplete, lang = 'tr' }) => {
  const delayMs = fx.delayMs ?? 0;
  const [started, setStarted] = useState(delayMs === 0);
  // Dynamic color palette for Slash / Scratch / Fury Swipes based on Pokémon illustration & energy type
  const slashPalette = getSlashPalette(fx.pokemonName, fx.attackerType);
  // Doubleslap hand appearance is styled per-Pokémon:
  // - Poliwhirl: White boxing-glove mitten with cuff and distinct thumb
  // - Jynx: Deep purple/violet psychic hand with defined fingers & thumb (matching card illustration)
  // - Dark Wartortle / Wartortle: Indigo-blue reptilian turtle paw with 3 sharp white claws (no glove)
  // - Others: Warm skin-tone hand with thumb
  const attackerLower = (fx.pokemonName || '').toLowerCase();
  const isPoliwhirl = attackerLower.includes('poliwhirl');
  const isJynx = attackerLower.includes('jynx');
  const isWartortle = attackerLower.includes('wartortle');

  // Delayed FX (the confusion self-hit beat) stay mounted but render nothing until their
  // cue, so the beat they follow is never cut short by the list being replaced.
  useEffect(() => {
    if (delayMs === 0) return;
    const cue = setTimeout(() => setStarted(true), delayMs);
    return () => clearTimeout(cue);
  }, [delayMs]);

  useEffect(() => {
    const base = getFXDuration(fx.type);
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

      {/* 4. DOUBLESLAP — Authentic 1999 Ken Sugimori Watercolor Art & GBA Anime Battle Choreography:
            • Poliwhirl: Official Ken Sugimori round white boxing glove with watercolor shading & ink lines
            • Jynx: Official Ken Sugimori purple psychic humanoid hand with graceful fingers & thumb
            • Dark Wartortle / Wartortle: Official Ken Sugimori indigo-blue reptilian paw with 3 sharp ivory claws
            • Standard: Vintage Ken Sugimori warm-tone open slap hand
            • Dynamic GBA Anime Speed Lines, Multi-Layered Geometric Impact Starbursts, Elemental Splashes & Card Shake */}
      {fx.type === 'doubleslap' && (() => {
        const hitSeq = fx.multiHitSequence ?? (!fx.whiffed ? [true, true] : [false, false]);
        const hit1 = hitSeq[0] ?? !fx.whiffed;
        const hit2 = hitSeq[1] ?? !fx.whiffed;

        const slapAsset = isPoliwhirl
          ? '/assets/Poliwhirl_DoubleSlap_Glove.png'
          : isJynx
          ? '/assets/Jynx_DoubleSlap_Hand.png'
          : isWartortle
          ? '/assets/Wartortle_DoubleSlap_Paw.png'
          : '/assets/Poliwhirl_DoubleSlap_Glove.png';

        const auraFilter = isPoliwhirl
          ? 'drop-shadow(0 0 22px rgba(56, 189, 248, 0.9)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.95))'
          : isJynx
          ? 'drop-shadow(0 0 24px rgba(168, 85, 247, 0.95)) drop-shadow(0 0 12px rgba(236, 72, 153, 0.85))'
          : isWartortle
          ? 'drop-shadow(0 0 24px rgba(2, 132, 199, 0.92)) drop-shadow(0 0 10px rgba(56, 189, 248, 0.9))'
          : 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.88)) drop-shadow(0 0 8px rgba(254, 240, 138, 0.95))';

        const windColor1 = isPoliwhirl ? '#38bdf8' : isJynx ? '#c084fc' : isWartortle ? '#0284c7' : '#f59e0b';
        const windColor2 = isPoliwhirl ? '#ffffff' : isJynx ? '#f472b6' : isWartortle ? '#bae6fd' : '#ffffff';

        const starOuter1 = isPoliwhirl ? '#0284c7' : isJynx ? '#7c3aed' : isWartortle ? '#0369a1' : '#d97706';
        const starBorder1 = isPoliwhirl ? '#0369a1' : isJynx ? '#4c1d95' : isWartortle ? '#1e3a8a' : '#b45309';
        const starInner1 = isPoliwhirl ? '#38bdf8' : isJynx ? '#e879f9' : isWartortle ? '#38bdf8' : '#fde047';
        const starGlow1 = isPoliwhirl ? '#38bdf8' : isJynx ? '#c084fc' : isWartortle ? '#0ea5e9' : '#f59e0b';

        const starOuter2 = isPoliwhirl ? '#0ea5e9' : isJynx ? '#db2777' : isWartortle ? '#0284c7' : '#e11d48';
        const starBorder2 = isPoliwhirl ? '#0284c7' : isJynx ? '#831843' : isWartortle ? '#0f172a' : '#9f1239';
        const starInner2 = isPoliwhirl ? '#e0f2fe' : isJynx ? '#fbcfe8' : isWartortle ? '#bae6fd' : '#fecdd3';
        const starGlow2 = isPoliwhirl ? '#67e8f9' : isJynx ? '#f472b6' : isWartortle ? '#38bdf8' : '#f43f5e';

        const ringColor1 = isPoliwhirl ? '#38bdf8' : isJynx ? '#c084fc' : isWartortle ? '#0284c7' : '#fde047';
        const ringColor2 = isPoliwhirl ? '#bae6fd' : isJynx ? '#f472b6' : isWartortle ? '#38bdf8' : '#f43f5e';

        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
            {/* Screen Shake Wrapper triggered on impact beats */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible"
              style={{ animation: (hit1 || hit2) ? 'gbaDoubleSlapCardShake 1.35s ease-out forwards' : undefined }}
            >
              {/* ======================= SLAP 1 (Right Hand: Top-Right to Center/Left) ======================= */}
              {/* Wind / Motion Smear Streaks for Slap 1 (Right to Left) */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ animation: 'gbaDoubleSlapWindRightToLeft 1.35s ease-out forwards', opacity: 0 }}
              >
                <svg width="130" height="90" viewBox="0 0 130 90" className="overflow-visible" style={{ transform: 'scaleX(-1)' }}>
                  <path d="M 8 20 C 40 34 85 48 120 54" stroke={windColor1} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
                  <path d="M 22 10 C 55 26 95 38 126 44" stroke={windColor2} strokeWidth="4.5" strokeLinecap="round" opacity="0.95" />
                  <path d="M 4 34 C 36 44 75 58 108 66" stroke={windColor1} strokeWidth="2.8" strokeLinecap="round" opacity="0.75" />
                </svg>
              </div>

              {/* Hand Model Layer — Slap 1 (Right Hand, sweeping Right to Left, Palm striking forward) */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ animation: 'gbaDoubleSlapRightToLeft 1.35s cubic-bezier(0.18, 0.88, 0.32, 1) forwards' }}
              >
                <img
                  src={slapAsset}
                  alt=""
                  className="select-none pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
                  style={{
                    width: '60%',
                    maxWidth: '162px',
                    height: 'auto',
                    objectFit: 'contain',
                    filter: auraFilter
                  }}
                  draggable={false}
                />
              </div>

              {/* Impact FX 1 — lands at ~29% (400ms) */}
              {hit1 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-visible">
                  {/* High-speed Expanding Shockwave Ring 1 */}
                  <div
                    className="absolute w-28 h-28 rounded-full border-4 pointer-events-none"
                    style={{ borderColor: ringColor1, animation: 'gbaDoubleSlapRing1 1.35s ease-out forwards' }}
                  />

                  {/* Geometric Retro Anime GBA Multi-Layered Impact Starburst 1 */}
                  <div
                    className="absolute flex items-center justify-center pointer-events-none select-none z-30"
                    style={{ animation: 'gbaDoubleSlapStar1 1.35s ease-out forwards', opacity: 0 }}
                  >
                    <svg width="96" height="96" viewBox="0 0 96 96" className="overflow-visible">
                      {/* Outer 16-point faceted comic burst */}
                      <polygon
                        points="48,2 56,29 84,11 69,38 94,48 69,58 84,85 56,67 48,94 40,67 12,85 27,58 2,48 27,38 12,11 40,29"
                        fill={starOuter1}
                        stroke={starBorder1}
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                        style={{ filter: `drop-shadow(0 0 16px ${starGlow1})` }}
                      />
                      {/* Inner brilliant faceted star */}
                      <polygon
                        points="48,14 53,34 74,22 62,41 82,48 62,55 74,74 53,62 48,82 43,62 22,74 34,55 14,48 34,41 22,22 43,34"
                        fill={starInner1}
                        stroke="#ffffff"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      {/* White core diamond glint */}
                      <polygon points="48,26 57,48 48,70 39,48" fill="#ffffff" />
                      <circle cx="48" cy="48" r="9" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 10px #ffffff)' }} />
                    </svg>
                  </div>

                  {/* Directional Sparks bursting outward */}
                  {[
                    { x: 26, y: -16 }, { x: 30, y: 12 }, { x: 14, y: 28 }, { x: -14, y: 28 },
                    { x: -28, y: 12 }, { x: -26, y: -16 }, { x: 0, y: -30 }, { x: 18, y: -26 }
                  ].map((spark, i) => (
                    <div
                      key={i}
                      className="absolute text-xl font-black pointer-events-none"
                      style={{
                        color: starInner1,
                        textShadow: `0 0 8px ${starGlow1}`,
                        animation: 'gbaDoubleSlapSparkPop 0.5s ease-out 0.29s forwards',
                        opacity: 0,
                        '--spark-x': `${spark.x}px`,
                        '--spark-y': `${spark.y}px`
                      } as React.CSSProperties}
                    >
                      ✦
                    </div>
                  ))}

                  {/* Water Droplet Splash Arcs (Poliwhirl & Wartortle) */}
                  {(isPoliwhirl || isWartortle) && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {[
                        { x: 28, y: -20 }, { x: 32, y: 14 }, { x: -30, y: 16 }, { x: -28, y: -22 }, { x: 2, y: -34 }
                      ].map((d, i) => (
                        <div
                          key={i}
                          className="absolute w-3 h-3 rounded-full bg-cyan-100 border border-white shadow-[0_0_10px_#38bdf8]"
                          style={{
                            animation: 'gbaWaterSplashDrop 0.52s ease-out 0.29s forwards',
                            opacity: 0,
                            '--drop-x': `${d.x}px`,
                            '--drop-y': `${d.y}px`
                          } as React.CSSProperties}
                        />
                      ))}
                    </div>
                  )}

                  {/* Psychic Distortion Rings (Jynx) */}
                  {isJynx && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="absolute w-24 h-24 rounded-full border-2 border-purple-400/90 shadow-[0_0_20px_#c084fc]"
                        style={{ animation: 'gbaPsychicRing 0.52s ease-out 0.29s forwards', opacity: 0 }}
                      />
                      <div
                        className="absolute w-16 h-16 rounded-full border-2 border-fuchsia-300 shadow-[0_0_16px_#f472b6]"
                        style={{ animation: 'gbaPsychicRing 0.44s ease-out 0.32s forwards', opacity: 0 }}
                      />
                    </div>
                  )}

                  {/* Triple Claw Slash Marks (Wartortle - Slap 1 Right to Left) */}
                  {isWartortle && (
                    <div className="absolute flex items-center justify-center pointer-events-none z-40">
                      <svg
                        width="80"
                        height="55"
                        viewBox="0 0 80 55"
                        className="overflow-visible"
                        style={{ transform: 'scaleX(-1)', animation: 'gbaClawSlash 0.45s ease-out 0.29s forwards', opacity: 0 }}
                      >
                        <path d="M 12 12 L 68 44" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" className="drop-shadow-[0_0_10px_#38bdf8]" />
                        <path d="M 22 6 L 76 38" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 4 18 L 58 50" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </div>
              )}

              {/* ======================= SLAP 2 (Left Hand: Top-Left to Center/Right) ======================= */}
              {/* Wind / Motion Smear Streaks for Slap 2 (Left to Right) */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ animation: 'gbaDoubleSlapWindLeftToRight 1.35s ease-out forwards', opacity: 0 }}
              >
                <svg width="130" height="90" viewBox="0 0 130 90" className="overflow-visible">
                  <path d="M 8 20 C 40 34 85 48 120 54" stroke={windColor1} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
                  <path d="M 22 10 C 55 26 95 38 126 44" stroke={windColor2} strokeWidth="4.5" strokeLinecap="round" opacity="0.95" />
                  <path d="M 4 34 C 36 44 75 58 108 66" stroke={windColor1} strokeWidth="2.8" strokeLinecap="round" opacity="0.75" />
                </svg>
              </div>

              {/* Hand Model Layer — Slap 2 (Left Hand, sweeping Left to Right, mirrored, Palm striking forward) */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ animation: 'gbaDoubleSlapLeftToRight 1.35s cubic-bezier(0.18, 0.88, 0.32, 1) forwards' }}
              >
                <img
                  src={slapAsset}
                  alt=""
                  className="select-none pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
                  style={{
                    width: '60%',
                    maxWidth: '162px',
                    height: 'auto',
                    objectFit: 'contain',
                    transform: 'scaleX(-1)',
                    filter: auraFilter
                  }}
                  draggable={false}
                />
              </div>

              {/* Impact FX 2 — lands at ~71% (970ms) */}
              {hit2 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-visible">
                  {/* High-speed Expanding Shockwave Ring 2 */}
                  <div
                    className="absolute w-30 h-30 rounded-full border-4 pointer-events-none"
                    style={{ borderColor: ringColor2, animation: 'gbaDoubleSlapRing2 1.35s ease-out forwards' }}
                  />

                  {/* Geometric Retro Anime GBA Multi-Layered Impact Starburst 2 */}
                  <div
                    className="absolute flex items-center justify-center pointer-events-none select-none z-30"
                    style={{ animation: 'gbaDoubleSlapStar2 1.35s ease-out forwards', opacity: 0 }}
                  >
                    <svg width="102" height="102" viewBox="0 0 96 96" className="overflow-visible">
                      {/* Outer 16-point faceted comic burst */}
                      <polygon
                        points="48,2 56,29 84,11 69,38 94,48 69,58 84,85 56,67 48,94 40,67 12,85 27,58 2,48 27,38 12,11 40,29"
                        fill={starOuter2}
                        stroke={starBorder2}
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                        style={{ filter: `drop-shadow(0 0 18px ${starGlow2})` }}
                      />
                      {/* Inner brilliant faceted star */}
                      <polygon
                        points="48,14 53,34 74,22 62,41 82,48 62,55 74,74 53,62 48,82 43,62 22,74 34,55 14,48 34,41 22,22 43,34"
                        fill={starInner2}
                        stroke="#ffffff"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      {/* White core diamond glint */}
                      <polygon points="48,26 57,48 48,70 39,48" fill="#ffffff" />
                      <circle cx="48" cy="48" r="9" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 10px #ffffff)' }} />
                    </svg>
                  </div>

                  {/* Directional Sparks bursting outward */}
                  {[
                    { x: -26, y: -16 }, { x: -30, y: 12 }, { x: -14, y: 28 }, { x: 14, y: 28 },
                    { x: 28, y: 12 }, { x: 26, y: -16 }, { x: 0, y: -30 }, { x: -18, y: -26 }
                  ].map((spark, i) => (
                    <div
                      key={i}
                      className="absolute text-xl font-black pointer-events-none"
                      style={{
                        color: starInner2,
                        textShadow: `0 0 8px ${starGlow2}`,
                        animation: 'gbaDoubleSlapSparkPop 0.5s ease-out 0.71s forwards',
                        opacity: 0,
                        '--spark-x': `${spark.x}px`,
                        '--spark-y': `${spark.y}px`
                      } as React.CSSProperties}
                    >
                      ✦
                    </div>
                  ))}

                  {/* Water Droplet Splash Arcs (Poliwhirl & Wartortle) */}
                  {(isPoliwhirl || isWartortle) && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {[
                        { x: -28, y: -20 }, { x: -32, y: 14 }, { x: 30, y: 16 }, { x: 28, y: -22 }, { x: -2, y: -34 }
                      ].map((d, i) => (
                        <div
                          key={i}
                          className="absolute w-3 h-3 rounded-full bg-cyan-100 border border-white shadow-[0_0_10px_#38bdf8]"
                          style={{
                            animation: 'gbaWaterSplashDrop 0.52s ease-out 0.71s forwards',
                            opacity: 0,
                            '--drop-x': `${d.x}px`,
                            '--drop-y': `${d.y}px`
                          } as React.CSSProperties}
                        />
                      ))}
                    </div>
                  )}

                  {/* Psychic Distortion Rings (Jynx) */}
                  {isJynx && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="absolute w-26 h-26 rounded-full border-2 border-fuchsia-400/90 shadow-[0_0_22px_#f472b6]"
                        style={{ animation: 'gbaPsychicRing 0.52s ease-out 0.71s forwards', opacity: 0 }}
                      />
                      <div
                        className="absolute w-18 h-18 rounded-full border-2 border-purple-300 shadow-[0_0_18px_#c084fc]"
                        style={{ animation: 'gbaPsychicRing 0.44s ease-out 0.74s forwards', opacity: 0 }}
                      />
                    </div>
                  )}

                  {/* Triple Claw Slash Marks (Wartortle) */}
                  {isWartortle && (
                    <div className="absolute flex items-center justify-center pointer-events-none z-40">
                      <svg
                        width="80"
                        height="55"
                        viewBox="0 0 80 55"
                        className="overflow-visible"
                        style={{
                          transform: 'scaleX(-1)',
                          animation: 'gbaClawSlash 0.45s ease-out 0.71s forwards',
                          opacity: 0
                        }}
                      >
                        <path d="M 12 12 L 68 44" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" className="drop-shadow-[0_0_10px_#38bdf8]" />
                        <path d="M 22 6 L 76 38" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 4 18 L 58 50" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

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

      {/* 7c. TOXIC CORROSION (Nidoking Lv. 48 — Double-Poison Corrosive Venom Geyser) */}
      {fx.type === 'toxic_corrosion' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Corrosive deep violet & toxic lime smog vignette */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-950/80 via-fuchsia-950/50 to-lime-950/40 pointer-events-none"
            style={{ animation: 'gbaToxicVenomVignette 1.7s ease-in-out forwards' }}
          />

          {/* Multi-tiered Pressurized Venom Geyser Eruption */}
          <div
            className="absolute bottom-0 flex items-center justify-center"
            style={{ animation: 'gbaToxicGeyserEruption 1.7s cubic-bezier(0.15, 0.88, 0.28, 1) forwards' }}
          >
            <svg width="140" height="180" viewBox="0 0 140 180" className="drop-shadow-[0_0_28px_#c084fc]">
              <defs>
                <linearGradient id="toxicVenomStreamGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#4c1d95" />
                  <stop offset="40%" stopColor="#9333ea" />
                  <stop offset="80%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#a3e635" />
                </linearGradient>
              </defs>
              {/* Massive central venom eruption column */}
              <path
                d="M55 180 C 45 120, 30 70, 70 10 C 110 70, 95 120, 85 180 Z"
                fill="url(#toxicVenomStreamGrad)"
                opacity="0.9"
              />
              {/* Acid core stream */}
              <path
                d="M62 180 C 58 130, 52 80, 70 30 C 88 80, 82 130, 78 180 Z"
                fill="#bef264"
                opacity="0.75"
              />
              {/* Left and right splashing venom arcs */}
              <path d="M60 110 C 35 90, 15 100, 5 130" fill="none" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
              <path d="M80 110 C 105 90, 125 100, 135 130" fill="none" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
              <circle cx="8" cy="132" r="3.5" fill="#a3e635" />
              <circle cx="132" cy="132" r="3.5" fill="#a3e635" />
            </svg>
          </div>

          {/* Eerie Rising Corrosive Toxic Skull Miasma */}
          <div
            className="absolute top-8 flex items-center justify-center"
            style={{ animation: 'gbaToxicSkullMiasma 1.7s ease-out 0.2s forwards', opacity: 0 }}
          >
            <svg width="70" height="70" viewBox="0 0 70 70" className="drop-shadow-[0_0_20px_#84cc16]">
              {/* Stylized toxic skull contour */}
              <path
                d="M35 10 C 22 10, 14 20, 14 34 C 14 44, 22 48, 24 56 L 46 56 C 48 48, 56 44, 56 34 C 56 20, 48 10, 35 10 Z"
                fill="#a3e635"
                opacity="0.6"
              />
              {/* Hollow eye sockets */}
              <circle cx="27" cy="30" r="5" fill="#3b0764" />
              <circle cx="43" cy="30" r="5" fill="#3b0764" />
              {/* Nose cavity & teeth slots */}
              <polygon points="35,36 32,42 38,42" fill="#3b0764" />
              <line x1="30" y1="52" x2="30" y2="56" stroke="#3b0764" strokeWidth="2" />
              <line x1="35" y1="52" x2="35" y2="56" stroke="#3b0764" strokeWidth="2" />
              <line x1="40" y1="52" x2="40" y2="56" stroke="#3b0764" strokeWidth="2" />
            </svg>
          </div>

          {/* Boiling acid bubbles popping */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={`toxic-bubble-${i}`}
              className="absolute"
              style={{
                left: `${24 + i * 18}%`,
                bottom: `${20 + (i % 2) * 25}%`,
                animation: `gbaToxicAcidBubbles 1.7s ease-out ${0.25 + i * 0.12}s forwards`,
                opacity: 0
              }}
            >
              <div className="w-5 h-5 rounded-full border-2 border-lime-400 bg-purple-600/60 shadow-[0_0_10px_#a3e635]" />
            </div>
          ))}
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
            className="absolute inset-0 rounded-xl backdrop-blur-[1.5px]"
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
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              animation: 'gbaPoisonGasHazePulse 1.2s ease-in-out forwards',
              opacity: 0,
              background: 'radial-gradient(ellipse at 50% 55%, rgba(147,51,234,0.22) 0%, rgba(88,28,135,0.16) 50%, rgba(30,10,60,0.10) 80%, transparent 100%)'
            }}
          />
        </div>
      )}

      {/* 9. SLASH / FURY SWIPES / CLAW
          Three variants:
          – normal:    top-left → bottom-right (left-hand swipe)
          – mirrored:  top-right → bottom-left (right-hand swipe), used for alternating multi-hits
          – X-slash:   both at once when Swords Dance doubled the strike */}
      {fx.type === 'slash' && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible"
          style={{ ['--slash-glow' as any]: slashPalette.peakGlow }}
        >
          {fx.swordsDanceBoosted ? (
            <>
              {/* Normal slash (left scythe-arm) */}
              <div
                className="absolute flex flex-col items-center gap-1"
                style={{
                  animation: 'gbaClawSlashDiagonal 1.15s ease-out forwards',
                  ['--slash-glow' as any]: slashPalette.peakGlow
                }}
              >
                <div
                  className="w-24 h-1.5 rounded-full rotate-45"
                  style={{
                    background: `linear-gradient(to right, transparent, ${slashPalette.via1}, #ffffff)`,
                    boxShadow: `0 0 12px ${slashPalette.glow1}`
                  }}
                />
                <div
                  className="w-28 h-2 rounded-full rotate-45 -mt-1"
                  style={{
                    background: `linear-gradient(to right, transparent, ${slashPalette.via2}, #ffffff)`,
                    boxShadow: `0 0 15px ${slashPalette.glow2}`
                  }}
                />
                <div
                  className="w-20 h-1.5 rounded-full rotate-45 -mt-1"
                  style={{
                    background: `linear-gradient(to right, transparent, ${slashPalette.via1}, #ffffff)`,
                    boxShadow: `0 0 12px ${slashPalette.glow1}`
                  }}
                />
              </div>
              {/* Mirrored slash (right scythe-arm) — simultaneous, forming an X */}
              <div
                className="absolute flex flex-col items-center gap-1"
                style={{
                  animation: 'gbaClawSlashDiagonalMirror 1.15s ease-out forwards',
                  ['--slash-glow' as any]: slashPalette.peakGlow
                }}
              >
                <div
                  className="w-24 h-1.5 rounded-full -rotate-45"
                  style={{
                    background: `linear-gradient(to left, transparent, ${slashPalette.via1}, #ffffff)`,
                    boxShadow: `0 0 12px ${slashPalette.glow1}`
                  }}
                />
                <div
                  className="w-28 h-2 rounded-full -rotate-45 -mt-1"
                  style={{
                    background: `linear-gradient(to left, transparent, ${slashPalette.via2}, #ffffff)`,
                    boxShadow: `0 0 15px ${slashPalette.glow2}`
                  }}
                />
                <div
                  className="w-20 h-1.5 rounded-full -rotate-45 -mt-1"
                  style={{
                    background: `linear-gradient(to left, transparent, ${slashPalette.via1}, #ffffff)`,
                    boxShadow: `0 0 12px ${slashPalette.glow1}`
                  }}
                />
              </div>
            </>
          ) : fx.mirrored ? (
            <div
              className="flex flex-col items-center gap-1"
              style={{
                animation: 'gbaClawSlashDiagonalMirror 1.15s ease-out forwards',
                ['--slash-glow' as any]: slashPalette.peakGlow
              }}
            >
              <div
                className="w-24 h-1.5 rounded-full -rotate-45"
                style={{
                  background: `linear-gradient(to left, transparent, ${slashPalette.via1}, #ffffff)`,
                  boxShadow: `0 0 12px ${slashPalette.glow1}`
                }}
              />
              <div
                className="w-28 h-2 rounded-full -rotate-45 -mt-1"
                style={{
                  background: `linear-gradient(to left, transparent, ${slashPalette.via2}, #ffffff)`,
                  boxShadow: `0 0 15px ${slashPalette.glow2}`
                }}
              />
              <div
                className="w-20 h-1.5 rounded-full -rotate-45 -mt-1"
                style={{
                  background: `linear-gradient(to left, transparent, ${slashPalette.via1}, #ffffff)`,
                  boxShadow: `0 0 12px ${slashPalette.glow1}`
                }}
              />
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-1"
              style={{
                animation: 'gbaClawSlashDiagonal 1.15s ease-out forwards',
                ['--slash-glow' as any]: slashPalette.peakGlow
              }}
            >
              <div
                className="w-24 h-1.5 rounded-full rotate-45"
                style={{
                  background: `linear-gradient(to right, transparent, ${slashPalette.via1}, #ffffff)`,
                  boxShadow: `0 0 12px ${slashPalette.glow1}`
                }}
              />
              <div
                className="w-28 h-2 rounded-full rotate-45 -mt-1"
                style={{
                  background: `linear-gradient(to right, transparent, ${slashPalette.via2}, #ffffff)`,
                  boxShadow: `0 0 15px ${slashPalette.glow2}`
                }}
              />
              <div
                className="w-20 h-1.5 rounded-full rotate-45 -mt-1"
                style={{
                  background: `linear-gradient(to right, transparent, ${slashPalette.via1}, #ffffff)`,
                  boxShadow: `0 0 12px ${slashPalette.glow1}`
                }}
              />
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
          {/* Watercolor glove stock art — GBA approach trajectory: spawns tiny at
              right-back, accelerates left-front, dead-stops at 30% card width
              (img width) behind the card boundary; quick fade at the end. */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: 'gbaHitmonchanJab 1.1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards' }}
          >
            <img
              src="/assets/Hitmonchan_Jab.png"
              alt=""
              className="select-none pointer-events-none drop-shadow-[0_0_18px_#ec4899]"
              style={{ width: '30%', maxWidth: '30%', height: 'auto', objectFit: 'contain' }}
              draggable={false}
            />
          </div>
          {/* Wind streaks trailing the glove — staggered opacity, sweep backward
              during flight and vanish at the impact window */}
          <div className="absolute" style={{ transform: 'translate(30%, -8%)' }}>
            <div style={{ animation: 'gbaHitmonchanWindStreaks 1.1s ease-out forwards', opacity: 0 }}>
              <svg width="46" height="30" viewBox="0 0 46 30">
                <line x1="6" y1="7" x2="44" y2="7" stroke="#f9a8d4" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
                <line x1="0" y1="15" x2="38" y2="15" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
                <line x1="8" y1="23" x2="40" y2="23" stroke="#f9a8d4" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              </svg>
            </div>
          </div>
          {/* Small impact star */}
          {!fx.whiffed && (
            <div className="absolute" style={{ animation: 'gbaHitmonchanImpactStar 0.55s ease-out 0.75s forwards', opacity: 0 }}>
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
            {/* Single-arm punch layer — GBA approach from right-back, slight windup
                counter-rotate, snaps left-front; final size 60% card width */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ animation: 'gbaHitmonchanSpecialPunch 1.3s cubic-bezier(0.15, 0.9, 0.25, 1) forwards' }}>
              <img
                src="/assets/Hitmonchan_SpecialPunch.png"
                alt=""
                className="select-none pointer-events-none drop-shadow-[0_0_18px_#ec4899]"
                style={{ width: '60%', maxWidth: '60%', height: 'auto', objectFit: 'contain' }}
                draggable={false}
              />
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

      {/* 11c. HEAVY THUNDER STRIKE (Raichu Lv. 40 — 60 DMG Celestial Thunder Bolt) */}
      {fx.type === 'heavy_thunder_strike' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Dark storm ionization vignette */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indigo-950/75 via-sky-950/40 to-yellow-950/30 pointer-events-none"
            style={{ animation: 'gbaThunderCloudCharge 1.65s ease-in-out forwards' }}
          />

          {/* Full-card celestial screen flash */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ animation: 'gbaThunderScreenFlash 1.65s ease-out forwards' }}
          />

          {/* Colossal Mega Lightning Bolt striking from top */}
          <div
            className="absolute top-0 flex items-center justify-center"
            style={{ animation: 'gbaThunderMegaBolt 1.65s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
          >
            <svg width="120" height="220" viewBox="0 0 120 220" className="drop-shadow-[0_0_32px_#38bdf8]">
              <defs>
                <linearGradient id="heavyThunderGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#fef08a" />
                  <stop offset="70%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
              {/* Outer electrical plasma aura */}
              <path
                d="M60 0 L40 50 L65 42 L32 98 L58 88 L20 152 L48 140 L35 210 L82 135 L58 145 L88 85 L64 94 L92 42 L68 50 Z"
                fill="#38bdf8"
                opacity="0.5"
              />
              {/* Main jagged lightning bolt body */}
              <path
                d="M60 0 L42 48 L63 41 L35 96 L57 87 L24 150 L46 138 L38 206 L80 133 L59 143 L85 84 L63 92 L88 41 L66 49 Z"
                fill="url(#heavyThunderGrad)"
                stroke="#fef08a"
                strokeWidth="1.5"
              />
              {/* Blazing supercharged white-hot core */}
              <path
                d="M60 6 L48 45 L60 42 L40 92 L54 86 L32 144 L44 136 L40 196 L74 133 L58 141 L78 85 L61 91 L80 43 L63 49 Z"
                fill="#ffffff"
                opacity="0.9"
              />
              {/* Branching secondary lightning tendrils */}
              <path d="M42 48 L18 62 L26 78" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <path d="M63 41 L88 32 L102 46" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <path d="M35 96 L12 110 L18 126" fill="none" stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
              <path d="M85 84 L108 98 L114 116" fill="none" stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
            </svg>
          </div>

          {/* Ground Electric Crawling Shockwaves & Impact Core */}
          <div
            className="absolute bottom-0 flex items-center justify-center"
            style={{ animation: 'gbaThunderGroundShock 1.65s cubic-bezier(0.15, 0.9, 0.2, 1) forwards' }}
          >
            <svg width="150" height="90" viewBox="0 0 150 90" className="drop-shadow-[0_0_24px_#fde047]">
              {/* Electric impact crater ellipse */}
              <ellipse cx="75" cy="55" rx="60" ry="20" fill="none" stroke="#38bdf8" strokeWidth="2.5" opacity="0.8" />
              <ellipse cx="75" cy="55" rx="42" ry="14" fill="none" stroke="#fde047" strokeWidth="2" opacity="0.9" />
              <ellipse cx="75" cy="55" rx="24" ry="8" fill="#ffffff" opacity="0.95" />
              {/* Ground electric crawl lines */}
              <path d="M75 55 L50 68 L25 62 L10 75" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" />
              <path d="M75 55 L100 68 L125 62 L140 75" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" />
              <path d="M75 55 L65 40 L45 35 L30 22" fill="none" stroke="#fef08a" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M75 55 L85 40 L105 35 L120 22" fill="none" stroke="#fef08a" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
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

      {/* 12a. EMBER SPARK (Charmander, Ponyta — rising flame with visible fire body, GBA-style)
            Small but clearly a flame: teardrop fire shape with layered color, wider impact glow. */}
      {fx.type === 'ember_spark' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Main flame body — larger, clearly fire-shaped */}
          <div className="absolute" style={{ animation: 'gbaEmberSparkRise 1.25s ease-out forwards' }}>
            <svg width="48" height="56" viewBox="0 0 48 56" className="drop-shadow-[0_0_14px_#f97316]">
              {/* Outer flame silhouette */}
              <path d="M24 54 Q16 42, 18 32 Q12 26, 16 18 Q14 10, 20 6 Q24 2, 28 6 Q34 10, 32 18 Q36 26, 30 32 Q32 42, 24 54 Z" fill="#ea580c" opacity="0.9" />
              {/* Middle flame layer */}
              <path d="M24 48 Q18 38, 20 30 Q16 24, 20 18 Q22 12, 24 10 Q26 12, 28 18 Q32 24, 28 30 Q30 38, 24 48 Z" fill="#f97316" opacity="0.85" />
              {/* Inner bright core */}
              <path d="M24 42 Q20 34, 22 28 Q20 22, 24 16 Q28 22, 26 28 Q28 34, 24 42 Z" fill="#fbbf24" opacity="0.9" />
              {/* Hottest center */}
              <path d="M24 36 Q22 30, 24 22 Q26 30, 24 36 Z" fill="#fef3c7" opacity="0.95" />
              {/* Flame tongue flickers */}
              <path d="M16 20 Q14 14, 17 10" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <path d="M32 18 Q34 12, 31 8" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          {/* Impact glow ring at base */}
          <div className="absolute" style={{ animation: 'gbaEmberImpactGlow 1.25s ease-out 0.2s forwards', opacity: 0 }}>
            <svg width="64" height="32" viewBox="0 0 64 32">
              <ellipse cx="32" cy="20" rx="26" ry="10" fill="#f97316" opacity="0.3" />
              <ellipse cx="32" cy="20" rx="18" ry="7" fill="#fbbf24" opacity="0.25" />
              <ellipse cx="32" cy="20" rx="10" ry="4" fill="#fef3c7" opacity="0.3" />
            </svg>
          </div>
          {/* Rising spark particles — more and slightly larger */}
          {[0, 1, 2, 3].map(i => (
            <div key={`ember-p-${i}`} className="absolute" style={{ animation: `gbaEmberSparkP${i + 1} 1.25s ease-out ${0.12 + i * 0.1}s forwards`, opacity: 0 }}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r={4 - i * 0.5} fill={i === 0 ? '#fbbf24' : i === 1 ? '#f97316' : i === 2 ? '#ef4444' : '#fbbf24'} opacity="0.9" />
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


      {/* 12e. FIRE SPIN VORTEX (Charizard Lv. 76 — 100 DMG Infernal Firestorm Cyclone) */}
      {fx.type === 'fire_spin_vortex' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Scorched Card Heatwave Distortion Overlay */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none z-10"
            style={{
              animation: 'gbaFireSpinScorchedCard 1.85s ease-in-out forwards',
              background: 'radial-gradient(ellipse at center, rgba(251, 146, 60, 0.42) 0%, rgba(239, 68, 68, 0.32) 50%, rgba(153, 27, 27, 0.28) 80%, transparent 100%)',
              backdropFilter: 'blur(2.5px)',
              WebkitBackdropFilter: 'blur(2.5px)'
            }}
          >
            <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/40 shadow-[inset_0_0_20px_rgba(249,115,22,0.5)]" />
          </div>

          {/* Triple-Arm Roaring Inferno Vortex */}
          <div
            className="absolute z-20 pointer-events-none"
            style={{ animation: 'gbaFireSpinTripleSpiral 1.85s cubic-bezier(0.18, 0.85, 0.3, 1) forwards' }}
          >
            <svg width="116" height="116" viewBox="0 0 120 120" className="overflow-visible drop-shadow-[0_0_30px_#f97316]">
              <defs>
                <linearGradient id="fsvGradRed" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#b91c1c" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="fsvGradOrange" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#fde047" />
                </linearGradient>
                <linearGradient id="fsvGradYellow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="60%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
              {/* Outer crimson flame arm */}
              <path
                d="M60 8 Q90 14, 104 42 Q115 72, 94 98 Q72 118, 40 108 Q12 96, 8 66 Q5 36, 32 20 Q56 8, 76 26 Q92 44, 82 70 Q72 90, 50 84 Q34 80, 40 64 Q45 50, 58 58"
                fill="none"
                stroke="url(#fsvGradRed)"
                strokeWidth="5.5"
                strokeLinecap="round"
                opacity="0.95"
              />
              {/* Mid vermillion fire arm (rotated 120deg) */}
              <path
                d="M60 8 Q90 14, 104 42 Q115 72, 94 98 Q72 118, 40 108 Q12 96, 8 66 Q5 36, 32 20 Q56 8, 76 26 Q92 44, 82 70 Q72 90, 50 84 Q34 80, 40 64 Q45 50, 58 58"
                transform="rotate(120 60 60)"
                fill="none"
                stroke="url(#fsvGradOrange)"
                strokeWidth="4.4"
                strokeLinecap="round"
                opacity="0.9"
              />
              {/* Inner blazing gold arm (rotated 240deg) */}
              <path
                d="M60 14 Q85 20, 96 44 Q104 68, 88 88 Q68 104, 44 96 Q20 86, 18 62 Q16 38, 38 26 Q56 16, 72 32 Q84 46, 76 66 Q68 80, 52 76"
                transform="rotate(240 60 60)"
                fill="none"
                stroke="url(#fsvGradYellow)"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.9"
              />
            </svg>
          </div>

          {/* Thermonuclear Incandescent Core */}
          <div
            className="absolute z-25 pointer-events-none"
            style={{ animation: 'gbaFireSpinWhiteCore 1.85s ease-out forwards' }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-200 via-white to-amber-200 blur-[2px] shadow-[0_0_30px_#ffffff] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white shadow-[0_0_16px_#ffffff]" />
            </div>
          </div>

          {/* Dual concentric expanding fire shockwaves */}
          <div
            className="absolute z-15 pointer-events-none"
            style={{ animation: 'gbaFireSpinRing1 1.85s ease-out forwards' }}
          >
            <div className="w-24 h-24 rounded-full border-2 border-orange-500/80 shadow-[0_0_20px_#ea580c]" />
          </div>
          <div
            className="absolute z-15 pointer-events-none"
            style={{ animation: 'gbaFireSpinRing2 1.85s ease-out 0.15s forwards' }}
          >
            <div className="w-20 h-20 rounded-full border border-yellow-300/80 shadow-[0_0_16px_#fde047]" />
          </div>

          {/* Dense rising volcanic ash & cinder embers */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <div
              key={`fsv-ember-${i}`}
              className="absolute z-30 pointer-events-none"
              style={
                {
                  '--orbit-start': `${i * 45}deg`,
                  '--orbit-r': `${32 + (i % 3) * 8}px`,
                  animation: `gbaFireSpinEmbersRise 1.85s ease-out ${0.1 + i * 0.05}s forwards`,
                  opacity: 0
                } as React.CSSProperties
              }
            >
              <svg width="12" height="12" viewBox="0 0 12 12" className="overflow-visible">
                <circle
                  cx="6"
                  cy="6"
                  r={3.8 - (i % 3) * 0.6}
                  fill={i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#fde047' : '#f97316'}
                  className={i % 2 === 0 ? 'drop-shadow-[0_0_6px_#ffffff]' : 'drop-shadow-[0_0_6px_#f97316]'}
                />
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

      {/* 13b. HYDRO PUMP CANNONS (Blastoise-exclusive — twin shell-cannon volley)
          TOMA-style: two dense water jets fire UPWARD from Blastoise's twin back cannons
          (±33° outward splay per stock reference), converge on the target above with muzzle-flash bursts,
          scatter heavy spray and land in a wide splash.
          Intensity scales with bonus Water Energy: base 40 dmg → wi 1.0, +2 Water → 1.2. */}
      {fx.type === 'hydro_pump_cannons' && (() => {
        const wi = Math.max(1, fx.intensity ?? 1);
        return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Blastoise shell + twin cannons — stock PNG (1024×559, transparent bg)
              blur-in + anticipation overshoot → hold → grainy dissolve-out */}
          <div className="absolute bottom-0 left-1/2" style={{ width: Math.round(160 * wi), zIndex: 1, animation: 'gbaHydroCannonShell 1.9s cubic-bezier(0.22, 0.9, 0.36, 1) forwards', opacity: 0 }}>
            <img src="/blastoise-hydro-cannon.png" alt="" draggable={false} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          {/* Left cannon jet — linear trajectory from PNG bore (delayed 0.3s for shell anticipation) */}
          <div className="absolute" style={{ left: `calc(50% - ${Math.round(68 * wi)}px)`, bottom: `${Math.round(66 * wi)}px`, transformOrigin: '50% 100%', animation: 'gbaHydroCannonJetLeft 1.4s cubic-bezier(0.15, 0.8, 0.35, 1) 0.3s forwards', opacity: 0, filter: `drop-shadow(0 0 ${Math.round(8 + (wi - 1) * 20)}px rgba(56,189,248,0.65))` }}>
            <svg width={Math.round(56 * wi)} height={Math.round(100 * wi)} viewBox="0 0 56 100" style={{ overflow: 'visible' }}>
              {/* Initial pressure burst cone at nozzle exit */}
              <path d="M21 98 L28 76 L35 98 Z" fill="#e0f2fe" opacity="0.75" />
              <path d="M16 100 L28 80 L40 100 Z" fill="#7dd3fc" opacity="0.45" />
              {/* Main jet body — straight linear path (+20% thickness) */}
              <path d="M28 96 L28 6" fill="none" stroke="url(#hydroCannonGradL)" strokeWidth={28.1 * wi} strokeLinecap="round" opacity="0.92" />
              <path d="M28 94 L28 8" fill="none" stroke="#7dd3fc" strokeWidth={14 * wi} strokeLinecap="round" opacity="0.7" />
              <path d="M28 92 L28 10" fill="none" stroke="#e0f2fe" strokeWidth={7.8 * wi} strokeLinecap="round" opacity="0.8" />
              <defs>
                <linearGradient id="hydroCannonGradL" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#7dd3fc" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Right cannon jet — linear trajectory from PNG bore (delayed 0.3s for shell anticipation) */}
          <div className="absolute" style={{ right: `calc(50% - ${Math.round(68 * wi)}px)`, bottom: `${Math.round(66 * wi)}px`, transformOrigin: '50% 100%', animation: 'gbaHydroCannonJetRight 1.4s cubic-bezier(0.15, 0.8, 0.35, 1) 0.3s forwards', opacity: 0, filter: `drop-shadow(0 0 ${Math.round(8 + (wi - 1) * 20)}px rgba(56,189,248,0.65))` }}>
            <svg width={Math.round(56 * wi)} height={Math.round(100 * wi)} viewBox="0 0 56 100" style={{ overflow: 'visible' }}>
              {/* Initial pressure burst cone at nozzle exit */}
              <path d="M21 98 L28 76 L35 98 Z" fill="#e0f2fe" opacity="0.75" />
              <path d="M16 100 L28 80 L40 100 Z" fill="#7dd3fc" opacity="0.45" />
              {/* Main jet body — straight linear path (+20% thickness) */}
              <path d="M28 96 L28 6" fill="none" stroke="url(#hydroCannonGradR)" strokeWidth={28.1 * wi} strokeLinecap="round" opacity="0.92" />
              <path d="M28 94 L28 8" fill="none" stroke="#7dd3fc" strokeWidth={14 * wi} strokeLinecap="round" opacity="0.7" />
              <path d="M28 92 L28 10" fill="none" stroke="#e0f2fe" strokeWidth={7.8 * wi} strokeLinecap="round" opacity="0.8" />
              <defs>
                <linearGradient id="hydroCannonGradR" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#7dd3fc" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Muzzle flash — left cannon (double ring + 8-spike burst, delayed after shell) */}
          <div className="absolute" style={{ left: `calc(50% - ${Math.round(66 * wi)}px)`, bottom: `${Math.round(44 * wi)}px`, animation: 'gbaHydroCannonMuzzle 1.3s ease-out 0.35s forwards', opacity: 0 }}>
            <svg width={Math.round(52 * wi)} height={Math.round(52 * wi)} viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="22" fill="none" stroke="#38bdf8" strokeWidth={3.5 * wi} opacity="0.5" />
              <circle cx="26" cy="26" r="16" fill="none" stroke="#7dd3fc" strokeWidth={2 * wi} opacity="0.4" />
              <circle cx="26" cy="26" r="12" fill="#7dd3fc" opacity="0.65" />
              <circle cx="26" cy="26" r="7" fill="#bae6fd" opacity="0.8" />
              <circle cx="26" cy="26" r="3.5" fill="#e0f2fe" opacity="0.95" />
              <path d="M26 2 L28.5 16 L23.5 16 Z" fill="#bae6fd" opacity="0.85" />
              <path d="M26 50 L28.5 36 L23.5 36 Z" fill="#bae6fd" opacity="0.85" />
              <path d="M2 26 L16 23.5 L16 28.5 Z" fill="#bae6fd" opacity="0.85" />
              <path d="M50 26 L36 23.5 L36 28.5 Z" fill="#bae6fd" opacity="0.85" />
              <path d="M8 8 L18 16 L14 20 Z" fill="#e0f2fe" opacity="0.6" />
              <path d="M44 8 L34 16 L38 20 Z" fill="#e0f2fe" opacity="0.6" />
              <path d="M8 44 L18 36 L14 32 Z" fill="#e0f2fe" opacity="0.6" />
              <path d="M44 44 L34 36 L38 32 Z" fill="#e0f2fe" opacity="0.6" />
            </svg>
          </div>
          {/* Muzzle flash — right cannon (double ring + 8-spike burst, delayed after shell) */}
          <div className="absolute" style={{ right: `calc(50% - ${Math.round(66 * wi)}px)`, bottom: `${Math.round(44 * wi)}px`, animation: 'gbaHydroCannonMuzzle 1.3s ease-out 0.41s forwards', opacity: 0 }}>
            <svg width={Math.round(52 * wi)} height={Math.round(52 * wi)} viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="22" fill="none" stroke="#38bdf8" strokeWidth={3.5 * wi} opacity="0.5" />
              <circle cx="26" cy="26" r="16" fill="none" stroke="#7dd3fc" strokeWidth={2 * wi} opacity="0.4" />
              <circle cx="26" cy="26" r="12" fill="#7dd3fc" opacity="0.65" />
              <circle cx="26" cy="26" r="7" fill="#bae6fd" opacity="0.8" />
              <circle cx="26" cy="26" r="3.5" fill="#e0f2fe" opacity="0.95" />
              <path d="M26 2 L28.5 16 L23.5 16 Z" fill="#bae6fd" opacity="0.85" />
              <path d="M26 50 L28.5 36 L23.5 36 Z" fill="#bae6fd" opacity="0.85" />
              <path d="M2 26 L16 23.5 L16 28.5 Z" fill="#bae6fd" opacity="0.85" />
              <path d="M50 26 L36 23.5 L36 28.5 Z" fill="#bae6fd" opacity="0.85" />
              <path d="M8 8 L18 16 L14 20 Z" fill="#e0f2fe" opacity="0.6" />
              <path d="M44 8 L34 16 L38 20 Z" fill="#e0f2fe" opacity="0.6" />
              <path d="M8 44 L18 36 L14 32 Z" fill="#e0f2fe" opacity="0.6" />
              <path d="M44 44 L34 36 L38 32 Z" fill="#e0f2fe" opacity="0.6" />
            </svg>
          </div>
          {/* Heavy spray droplets — scatter left (delayed to match jet arrival) */}
          <div className="absolute top-2 left-4" style={{ animation: 'gbaHydroCannonDrop1 1.3s ease-out 0.65s forwards', opacity: 0 }}>
            <svg width={Math.round(14 * wi)} height={Math.round(18 * wi)} viewBox="0 0 14 18">
              <path d="M7 1 Q10.5 7, 10.5 10.5 Q10.5 15, 7 17 Q3.5 15, 3.5 10.5 Q3.5 7, 7 1 Z" fill="#38bdf8" opacity="0.9" />
              <ellipse cx="5.5" cy="9" rx="1.8" ry="2.4" fill="#bae6fd" opacity="0.7" />
            </svg>
          </div>
          {/* Heavy spray droplets — scatter right (delayed to match jet arrival) */}
          <div className="absolute top-2 right-4" style={{ animation: 'gbaHydroCannonDrop2 1.3s ease-out 0.72s forwards', opacity: 0 }}>
            <svg width={Math.round(12 * wi)} height={Math.round(16 * wi)} viewBox="0 0 12 16">
              <path d="M6 1 Q9 5.5, 9 8.5 Q9 12.5, 6 14.5 Q3 12.5, 3 8.5 Q3 5.5, 6 1 Z" fill="#0ea5e9" opacity="0.85" />
              <ellipse cx="4.5" cy="7.5" rx="1.5" ry="2" fill="#e0f2fe" opacity="0.6" />
            </svg>
          </div>
          {/* Extra droplets at higher intensity */}
          {wi > 1.08 && (
            <div className="absolute top-3" style={{ animation: 'gbaHydroCannonDrop3 1.3s ease-out 0.8s forwards', opacity: 0 }}>
              <svg width={Math.round(10 * wi)} height={Math.round(14 * wi)} viewBox="0 0 10 14">
                <path d="M5 1 Q7.5 4.5, 7.5 7 Q7.5 10.5, 5 12 Q2.5 10.5, 2.5 7 Q2.5 4.5, 5 1 Z" fill="#7dd3fc" opacity="0.8" />
              </svg>
            </div>
          )}
          {/* Convergence impact splash — where both jets meet the target (top).
              Redesigned: layered burst with a white-hot pressure core, radiating water
              spokes, arcing splash curls, airborne mist particles and a landing pool —
              reads as pressurized water striking the target and exploding off it. */}
          <div className="absolute -top-2" style={{ animation: 'gbaHydroCannonImpact 1.3s ease-out 0.9s forwards', opacity: 0 }}>
            <svg width={Math.round(84 * wi)} height={Math.round(72 * wi)} viewBox="0 0 84 72">
              <circle cx="42" cy="40" r={13 * wi} fill="#e0f2fe" opacity="0.9" />
              <circle cx="42" cy="40" r={8 * wi} fill="#bae6fd" opacity="0.95" />
              <circle cx="42" cy="40" r={4.5 * wi} fill="#ffffff" opacity="0.9" />
              <path d="M42 40 L42 10" stroke="#7dd3fc" strokeWidth={3 * wi} strokeLinecap="round" opacity="0.85" />
              <path d="M42 40 L18 22" stroke="#38bdf8" strokeWidth={2.8 * wi} strokeLinecap="round" opacity="0.8" />
              <path d="M42 40 L66 22" stroke="#38bdf8" strokeWidth={2.8 * wi} strokeLinecap="round" opacity="0.8" />
              <path d="M42 40 L12 40" stroke="#7dd3fc" strokeWidth={2.6 * wi} strokeLinecap="round" opacity="0.75" />
              <path d="M42 40 L72 40" stroke="#7dd3fc" strokeWidth={2.6 * wi} strokeLinecap="round" opacity="0.75" />
              <path d="M42 40 L22 58" stroke="#bae6fd" strokeWidth={2.2 * wi} strokeLinecap="round" opacity="0.6" />
              <path d="M42 40 L62 58" stroke="#bae6fd" strokeWidth={2.2 * wi} strokeLinecap="round" opacity="0.6" />
              <path d="M42 40 L42 66" stroke="#e0f2fe" strokeWidth={2 * wi} strokeLinecap="round" opacity="0.55" />
              <path d="M42 40 Q28 30, 16 16 Q24 28, 32 36" fill="none" stroke="#7dd3fc" strokeWidth={3 * wi} strokeLinecap="round" opacity="0.85" />
              <path d="M42 40 Q56 28, 70 14 Q60 28, 50 36" fill="none" stroke="#38bdf8" strokeWidth={3 * wi} strokeLinecap="round" opacity="0.8" />
              <path d="M42 40 Q32 34, 22 24" fill="none" stroke="#bae6fd" strokeWidth={2.2 * wi} strokeLinecap="round" opacity="0.65" />
              <path d="M42 40 Q54 32, 64 26" fill="none" stroke="#bae6fd" strokeWidth={2.2 * wi} strokeLinecap="round" opacity="0.65" />
              <circle cx="14" cy="12" r={3.2 * wi} fill="#7dd3fc" opacity="0.85" />
              <circle cx="68" cy="10" r={2.8 * wi} fill="#38bdf8" opacity="0.8" />
              <circle cx="32" cy="6" r={2.4 * wi} fill="#bae6fd" opacity="0.75" />
              <circle cx="54" cy="8" r={2 * wi} fill="#e0f2fe" opacity="0.7" />
              <circle cx="6" cy="30" r={2.4 * wi} fill="#38bdf8" opacity="0.7" />
              <circle cx="78" cy="28" r={2.2 * wi} fill="#7dd3fc" opacity="0.7" />
              {wi > 1.1 && <circle cx="10" cy="48" r={2.6 * wi} fill="#38bdf8" opacity="0.65" />}
              {wi > 1.1 && <circle cx="74" cy="46" r={2.4 * wi} fill="#7dd3fc" opacity="0.6" />}
              {wi > 1.18 && <circle cx="24" cy="2" r={2.8 * wi} fill="#bae6fd" opacity="0.6" />}
              {wi > 1.18 && <circle cx="60" cy="4" r={2.2 * wi} fill="#e0f2fe" opacity="0.55" />}
              <ellipse cx="42" cy="66" rx={26 * wi} ry={6 * wi} fill="#0ea5e9" opacity="0.3" />
              <ellipse cx="42" cy="64" rx={17 * wi} ry={4.5 * wi} fill="#38bdf8" opacity="0.25" />
            </svg>
          </div>
          {/* Expanding pressure ring — shockwave of pressurized water hitting the target */}
          <div className="absolute -top-2" style={{ animation: 'gbaHydroImpactRing 0.9s ease-out 0.95s forwards', opacity: 0 }}>
            <svg width={Math.round(90 * wi)} height={Math.round(70 * wi)} viewBox="0 0 90 70">
              <ellipse cx="45" cy="35" rx="38" ry="26" fill="none" stroke="#7dd3fc" strokeWidth={2.5 * wi} opacity="0.7" />
              <ellipse cx="45" cy="35" rx="30" ry="20" fill="none" stroke="#bae6fd" strokeWidth={1.8 * wi} opacity="0.5" />
              <ellipse cx="45" cy="35" rx="22" ry="15" fill="none" stroke="#e0f2fe" strokeWidth={1.2 * wi} opacity="0.4" />
            </svg>
          </div>
          {/* Ricochet droplets — water bouncing off the target and falling outward */}
          <div className="absolute top-1 left-6" style={{ animation: 'gbaHydroImpactScatter1 1.1s ease-out 1.0s forwards', opacity: 0 }}>
            <svg width={Math.round(12 * wi)} height={Math.round(16 * wi)} viewBox="0 0 12 16">
              <path d="M6 1 Q9 5.5, 9 8.5 Q9 12.5, 6 14.5 Q3 12.5, 3 8.5 Q3 5.5, 6 1 Z" fill="#38bdf8" opacity="0.9" />
              <ellipse cx="4.5" cy="7.5" rx="1.5" ry="2" fill="#bae6fd" opacity="0.65" />
            </svg>
          </div>
          <div className="absolute top-1 right-6" style={{ animation: 'gbaHydroImpactScatter2 1.1s ease-out 1.06s forwards', opacity: 0 }}>
            <svg width={Math.round(11 * wi)} height={Math.round(15 * wi)} viewBox="0 0 10 14">
              <path d="M5 1 Q7.5 4.5, 7.5 7 Q7.5 10.5, 5 12 Q2.5 10.5, 2.5 7 Q2.5 4.5, 5 1 Z" fill="#0ea5e9" opacity="0.85" />
              <ellipse cx="4" cy="6.5" rx="1.2" ry="1.7" fill="#e0f2fe" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute top-0" style={{ animation: 'gbaHydroImpactScatter3 1.1s ease-out 1.12s forwards', opacity: 0 }}>
            <svg width={Math.round(9 * wi)} height={Math.round(13 * wi)} viewBox="0 0 8 12">
              <path d="M4 1 Q6 3.5, 6 6 Q6 9, 4 10.5 Q2 9, 2 6 Q2 3.5, 4 1 Z" fill="#7dd3fc" opacity="0.8" />
            </svg>
          </div>
          {wi > 1.1 && (
            <div className="absolute top-2 left-1" style={{ animation: 'gbaHydroImpactScatter2 1.1s ease-out 1.16s forwards', opacity: 0 }}>
              <svg width={Math.round(10 * wi)} height={Math.round(14 * wi)} viewBox="0 0 10 14">
                <path d="M5 1 Q7.5 4.5, 7.5 7 Q7.5 10.5, 5 12 Q2.5 10.5, 2.5 7 Q2.5 4.5, 5 1 Z" fill="#bae6fd" opacity="0.75" />
              </svg>
            </div>
          )}
          {/* Foam pool — churned white water collecting at the base of the impact */}
          <div className="absolute -top-1" style={{ animation: 'gbaHydroImpactFoam 1.0s ease-out 1.05s forwards', opacity: 0 }}>
            <svg width={Math.round(64 * wi)} height={Math.round(24 * wi)} viewBox="0 0 64 24">
              <ellipse cx="32" cy="14" rx={28 * wi} ry={7 * wi} fill="#e0f2fe" opacity="0.55" />
              <ellipse cx="32" cy="12" rx={20 * wi} ry={5 * wi} fill="#bae6fd" opacity="0.45" />
              <ellipse cx="24" cy="10" rx={8 * wi} ry={3 * wi} fill="#ffffff" opacity="0.4" />
              <ellipse cx="42" cy="11" rx={6 * wi} ry={2.5 * wi} fill="#ffffff" opacity="0.35" />
              <circle cx="14" cy="8" r={2 * wi} fill="#e0f2fe" opacity="0.6" />
              <circle cx="50" cy="9" r={1.8 * wi} fill="#bae6fd" opacity="0.55" />
              <circle cx="32" cy="6" r={1.5 * wi} fill="#ffffff" opacity="0.5" />
            </svg>
          </div>
          {/* Dense mist at cannon base */}
          <div className="absolute bottom-2" style={{ animation: 'gbaWaterMistTrail 1.3s ease-out forwards', opacity: 0 }}>
            <svg width={Math.round(52 * wi)} height={Math.round(30 * wi)} viewBox="0 0 52 30">
              <ellipse cx="26" cy="15" rx={22 * wi} ry={10 * wi} fill="#bae6fd" opacity={0.25 + (wi - 1) * 0.15} />
              <ellipse cx="18" cy="12" rx={13 * wi} ry={6 * wi} fill="#e0f2fe" opacity={0.18 + (wi - 1) * 0.1} />
            </svg>
          </div>
        </div>
        );
      })()}

      {/* 14. BUBBLEBEAM (Gyarados 40 dmg — dense, fast, high-impact GBA bubble barrage) */}
      {fx.type === 'bubblebeam' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Large central bubble — bigger, faster */}
          <div className="absolute" style={{ animation: 'gbaBubbleRise1 1.0s cubic-bezier(0.2, 0.85, 0.35, 1) forwards' }}>
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="#67e8f9" strokeWidth="2" opacity="0.85" />
              <circle cx="22" cy="22" r="18" fill="url(#bubbleGrad1)" opacity="0.35" />
              <ellipse cx="16" cy="14" rx="5" ry="4" fill="#e0f2fe" opacity="0.65" />
              <circle cx="28" cy="28" r="3" fill="#a5f3fc" opacity="0.5" />
              <defs>
                <radialGradient id="bubbleGrad1" cx="0.35" cy="0.35">
                  <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.5" />
                  <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.35" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          {/* Medium bubble left */}
          <div className="absolute -left-6" style={{ animation: 'gbaBubbleRise2 1.0s cubic-bezier(0.2, 0.85, 0.35, 1) 0.06s forwards', opacity: 0 }}>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="12" fill="none" stroke="#a5f3fc" strokeWidth="1.5" opacity="0.8" />
              <circle cx="15" cy="15" r="12" fill="#22d3ee" opacity="0.15" />
              <ellipse cx="11" cy="10" rx="4" ry="3" fill="#e0f2fe" opacity="0.55" />
            </svg>
          </div>
          {/* Medium bubble right */}
          <div className="absolute -right-5" style={{ animation: 'gbaBubbleRise3 1.0s cubic-bezier(0.2, 0.85, 0.35, 1) 0.1s forwards', opacity: 0 }}>
            <svg width="34" height="34" viewBox="0 0 34 34">
              <circle cx="17" cy="17" r="14" fill="none" stroke="#67e8f9" strokeWidth="1.5" opacity="0.8" />
              <circle cx="17" cy="17" r="14" fill="#06b6d4" opacity="0.12" />
              <ellipse cx="12" cy="11" rx="4" ry="3" fill="#cffafe" opacity="0.6" />
            </svg>
          </div>
          {/* Dense small bubbles — extra count for 40 dmg intensity */}
          <div className="absolute -left-3 -top-4" style={{ animation: 'gbaBubbleRise2 1.0s ease-out 0.15s forwards', opacity: 0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" fill="none" stroke="#a5f3fc" strokeWidth="1.2" opacity="0.7" />
              <ellipse cx="7" cy="7" rx="2.5" ry="2" fill="#e0f2fe" opacity="0.5" />
            </svg>
          </div>
          <div className="absolute right-2 -top-5" style={{ animation: 'gbaBubbleRise1 1.0s ease-out 0.2s forwards', opacity: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="6.5" fill="none" stroke="#67e8f9" strokeWidth="1.2" opacity="0.65" />
              <ellipse cx="6" cy="5" rx="2" ry="1.5" fill="#cffafe" opacity="0.5" />
            </svg>
          </div>
          <div className="absolute -left-7 top-2" style={{ animation: 'gbaBubbleRise3 1.0s ease-out 0.25s forwards', opacity: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="5.5" fill="none" stroke="#a5f3fc" strokeWidth="1" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute right-6 top-0" style={{ animation: 'gbaBubbleRise1 1.0s ease-out 0.3s forwards', opacity: 0 }}>
            <svg width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="4.5" fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.55" />
            </svg>
          </div>
          {/* Impact burst — multi-line pop for 40 dmg */}
          <div className="absolute" style={{ animation: 'gbaBubblePop 1.0s ease-out 0.35s forwards', opacity: 0 }}>
            <svg width="38" height="38" viewBox="0 0 38 38">
              <line x1="19" y1="4" x2="19" y2="13" stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              <line x1="19" y1="25" x2="19" y2="34" stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              <line x1="4" y1="19" x2="13" y2="19" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <line x1="25" y1="19" x2="34" y2="19" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <line x1="8" y1="8" x2="13" y2="13" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <line x1="25" y1="25" x2="30" y2="30" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          {/* Secondary impact ring */}
          <div className="absolute" style={{ animation: 'gbaBubblePop 1.0s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="28" height="28" viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="10" fill="none" stroke="#67e8f9" strokeWidth="1.5" opacity="0.6" />
              <circle cx="14" cy="14" r="5" fill="#a5f3fc" opacity="0.3" />
            </svg>
          </div>
        </div>
      )}

      {/* 14b. BUBBLE (Squirtle — original gentle rising iridescent bubbles) */}
      {fx.type === 'bubble_gentle' && (
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

      {/* 15. ICE BEAM (GBA-style ice crystal formation with frost particles) */}
      {fx.type === 'ice_beam_frost' && (
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

      {/* 15c. STAR FREEZE (Starmie signature move - Celestial Star-Ice Glaciation & Cosmic Paralysis) */}
      {fx.type === 'star_freeze' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Sub-Zero Celestial Card Glaciation Overlay (covers opponent card with frosty blue trance & crystallization blur) */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none z-10"
            style={{
              animation: 'gbaStarFreezeCardGlaciation 1.8s ease-in-out forwards',
              background: 'radial-gradient(ellipse at center, rgba(165, 243, 252, 0.32) 0%, rgba(56, 189, 248, 0.22) 50%, rgba(30, 58, 138, 0.28) 85%, rgba(15, 23, 42, 0.38) 100%)',
              backdropFilter: 'blur(3.5px)',
              WebkitBackdropFilter: 'blur(3.5px)'
            }}
          >
            {/* Crystalline frost border vignette */}
            <div className="absolute inset-0 rounded-2xl border-2 border-cyan-300/40 shadow-[inset_0_0_16px_rgba(56,189,248,0.4)]" />
          </div>

          {/* Sub-zero blinding freeze flash */}
          <div
            className="absolute w-32 h-32 rounded-full pointer-events-none z-20"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(165,243,252,0.7) 35%, rgba(56,189,248,0.3) 65%, transparent 100%)',
              animation: 'gbaStarFreezeFlash 1.8s ease-out forwards'
            }}
          />

          {/* Starmie's Celestial Dual-Star Geometry (10-point Decagram: Gold rear star + Purple front star + Ruby core) */}
          <div
            className="absolute z-20 pointer-events-none"
            style={{ animation: 'gbaStarFreezeStarLock 1.8s cubic-bezier(0.18, 0.85, 0.3, 1) forwards' }}
          >
            <svg width="108" height="108" viewBox="0 0 100 100" className="overflow-visible drop-shadow-[0_0_18px_rgba(56,189,248,0.8)]">
              <defs>
                {/* Gold rear star gradient */}
                <linearGradient id="starmieGoldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="40%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#a16207" />
                </linearGradient>
                {/* Purple front star gradient */}
                <linearGradient id="starmiePurpleGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e879f9" />
                  <stop offset="45%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6b21a8" />
                </linearGradient>
                {/* Ruby core gem gradient */}
                <radialGradient id="starmieRubyGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fca5a5" />
                  <stop offset="35%" stopColor="#ef4444" />
                  <stop offset="75%" stopColor="#b91c1c" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </radialGradient>
                {/* Ice Star Prism gradient */}
                <linearGradient id="starIceGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#cffafe" />
                  <stop offset="70%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* Rear 5-point gold star (rotated 36deg) */}
              <polygon
                points="50,4 61,37 96,37 67,58 78,92 50,71 22,92 33,58 4,37 39,37"
                transform="rotate(36 50 50)"
                fill="url(#starmieGoldGrad)"
                stroke="#ca8a04"
                strokeWidth="1.2"
                opacity="0.92"
              />

              {/* Front 5-point royal purple star */}
              <polygon
                points="50,5 61,38 95,38 67,58 78,91 50,71 22,91 33,58 5,38 39,38"
                fill="url(#starmiePurpleGrad)"
                stroke="#581c87"
                strokeWidth="1.4"
              />

              {/* Central golden octagonal ring casing */}
              <polygon
                points="50,34 61,39 66,50 61,61 50,66 39,61 34,50 39,39"
                fill="url(#starmieGoldGrad)"
                stroke="#854d0e"
                strokeWidth="1.2"
                className="drop-shadow-[0_0_6px_#facc15]"
              />

              {/* Glowing red ruby core gem */}
              <circle
                cx="50"
                cy="50"
                r="10"
                fill="url(#starmieRubyGrad)"
                stroke="#991b1b"
                strokeWidth="1"
                className="drop-shadow-[0_0_10px_#ef4444]"
              />
              <ellipse cx="47" cy="46" rx="3.5" ry="2" fill="#ffffff" opacity="0.85" />
            </svg>
          </div>

          {/* Central Pulsing Cosmic Energy Ring from Gem */}
          <div
            className="absolute z-25 pointer-events-none"
            style={{ animation: 'gbaStarFreezeGemCharge 1.8s ease-out forwards' }}
          >
            <div className="w-12 h-12 rounded-full border-2 border-cyan-300 shadow-[0_0_20px_#38bdf8] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-cyan-200/80 blur-[1px] shadow-[0_0_12px_#ffffff]" />
            </div>
          </div>

          {/* Explosive 8-pointed Geometric Star-Ice Crystal Prism */}
          <div
            className="absolute z-30 pointer-events-none"
            style={{ animation: 'gbaStarFreezeGeometricStar 1.8s cubic-bezier(0.16, 0.9, 0.28, 1) forwards' }}
          >
            <svg width="124" height="124" viewBox="0 0 120 120" className="overflow-visible drop-shadow-[0_0_20px_#38bdf8] drop-shadow-[0_0_10px_#ffffff]">
              {/* Primary 8-point ice star: Vertical / Horizontal cross spikes */}
              <polygon points="60,6 66,48 114,60 66,72 60,114 54,72 6,60 54,48" fill="url(#starIceGrad)" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
              {/* Diagonal cross spikes */}
              <polygon points="60,18 64,52 102,60 64,68 60,102 56,68 18,60 56,52" transform="rotate(45 60 60)" fill="url(#starIceGrad)" stroke="#e0f2fe" strokeWidth="1.2" opacity="0.85" />
              
              {/* Crystalline facets and internal star lattice */}
              <g stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.9">
                <line x1="60" y1="6" x2="60" y2="114" />
                <line x1="6" y1="60" x2="114" y2="60" />
                <line x1="22" y1="22" x2="98" y2="98" />
                <line x1="98" y1="22" x2="22" y2="98" />
                {/* Concentric diamond lattice */}
                <polygon points="60,34 86,60 60,86 34,60" fill="rgba(255,255,255,0.3)" stroke="#ffffff" strokeWidth="1.2" />
                <polygon points="60,42 78,60 60,78 42,60" transform="rotate(45 60 60)" fill="rgba(165,243,252,0.4)" stroke="#cffafe" strokeWidth="1" />
              </g>

              {/* Brilliant central core star flash */}
              <circle cx="60" cy="60" r="8" fill="#ffffff" className="drop-shadow-[0_0_12px_#ffffff]" />
              <circle cx="60" cy="60" r="14" fill="#a5f3fc" opacity="0.5" />
            </svg>
          </div>

          {/* Radiating Crystalline Frost Shockwave Ring */}
          <div className="absolute z-20 pointer-events-none" style={{ animation: 'gbaStarFreezeRing 1.8s ease-out forwards' }}>
            <div className="w-24 h-24 rounded-full border-2 border-cyan-200/80 shadow-[0_0_16px_#67e8f9]" />
          </div>

          {/* Bursting Star Ice Shards */}
          <div className="absolute z-25 pointer-events-none" style={{ animation: 'gbaStarFreezeShards 1.8s ease-out forwards' }}>
            <svg width="100" height="100" viewBox="0 0 100 100" className="overflow-visible">
              <polygon points="50,12 53,24 50,28 47,24" fill="#e0f2fe" opacity="0.9" />
              <polygon points="88,50 76,53 72,50 76,47" fill="#cffafe" opacity="0.9" />
              <polygon points="50,88 47,76 50,72 53,76" fill="#e0f2fe" opacity="0.9" />
              <polygon points="12,50 24,47 28,50 24,53" fill="#cffafe" opacity="0.9" />
              <polygon points="76,24 68,32 65,30 70,23" fill="#ffffff" opacity="0.85" />
              <polygon points="24,76 32,68 35,70 30,77" fill="#ffffff" opacity="0.85" />
            </svg>
          </div>

          {/* Cryogenic Sub-zero Mist at Base */}
          <div className="absolute bottom-2 z-20 pointer-events-none" style={{ animation: 'gbaStarFreezeMist 1.8s ease-out forwards' }}>
            <svg width="90" height="28" viewBox="0 0 90 28">
              <ellipse cx="45" cy="18" rx="40" ry="8" fill="#a5f3fc" opacity="0.35" />
              <ellipse cx="35" cy="14" rx="26" ry="6" fill="#e0f2fe" opacity="0.25" />
            </svg>
          </div>

          {/* Paralyzing Celestial Star Frost Sparks */}
          <div className="absolute z-35 pointer-events-none" style={{ animation: 'gbaStarFreezeSparkle1 1.8s ease-out forwards' }}>
            <span className="text-sm text-cyan-100 select-none drop-shadow-[0_0_8px_#67e8f9]">✦</span>
          </div>
          <div className="absolute z-35 pointer-events-none" style={{ animation: 'gbaStarFreezeSparkle2 1.8s ease-out forwards' }}>
            <span className="text-xs text-white select-none drop-shadow-[0_0_8px_#a5f3fc]">✦</span>
          </div>
          <div className="absolute z-35 pointer-events-none" style={{ animation: 'gbaStarFreezeSparkle3 1.8s ease-out forwards' }}>
            <span className="text-sm text-sky-200 select-none drop-shadow-[0_0_8px_#38bdf8]">✦</span>
          </div>
          <div className="absolute z-35 pointer-events-none" style={{ animation: 'gbaStarFreezeSparkle4 1.8s ease-out forwards' }}>
            <span className="text-xs text-cyan-200 select-none drop-shadow-[0_0_6px_#cffafe]">✦</span>
          </div>
        </div>
      )}

      {/* 16. SOLAR BEAM (Venusaur Lv. 67 — 60 DMG Planetary Solar Cannon) */}
      {fx.type === 'solar_beam_charge_blast' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Card warmth and blur aura */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/20 via-yellow-200/10 to-emerald-400/15 pointer-events-none"
            style={{ animation: 'gbaSolarCardGlow 1.85s ease-in-out forwards' }}
          />

          {/* Converging solar motes (8 gathering photon rays into center) */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaSolarMotesGather 1.85s ease-out forwards' }}
          >
            <svg width="220" height="220" viewBox="0 0 220 220">
              <defs>
                <radialGradient id="solarMoteGrad" cx="0.5" cy="0.5">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#fef08a" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* 8 inward-pointing photon streamers */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <g key={i} transform={`rotate(${angle} 110 110)`}>
                  <line x1="110" y1="20" x2="110" y2="75" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                  <line x1="110" y1="35" x2="110" y2="70" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="110" cy="25" r="4" fill="url(#solarMoteGrad)" />
                  <circle cx="106" cy="45" r="2" fill="#fde047" opacity="0.7" />
                  <circle cx="114" cy="55" r="2" fill="#a7f3d0" opacity="0.8" />
                </g>
              ))}
            </svg>
          </div>

          {/* Solar Corona Core (charging sun orb with rotating corona flares) */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaSolarCoronaCore 1.85s ease-in-out forwards' }}
          >
            <svg width="86" height="86" viewBox="0 0 86 86" className="drop-shadow-[0_0_24px_#fde047]">
              <defs>
                <radialGradient id="solarCoreGrad" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#fef08a" />
                  <stop offset="70%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Outer solar corona spikes */}
              <g stroke="#fde047" strokeWidth="2.2" strokeLinecap="round" opacity="0.9">
                <line x1="43" y1="4" x2="43" y2="16" />
                <line x1="43" y1="70" x2="43" y2="82" />
                <line x1="4" y1="43" x2="16" y2="43" />
                <line x1="70" y1="43" x2="82" y2="43" />
                <line x1="15" y1="15" x2="24" y2="24" />
                <line x1="62" y1="62" x2="71" y2="71" />
                <line x1="71" y1="15" x2="62" y2="24" />
                <line x1="15" y1="71" x2="24" y2="62" />
              </g>
              {/* Sun orb body */}
              <circle cx="43" cy="43" r="28" fill="url(#solarCoreGrad)" />
              <circle cx="43" cy="43" r="18" fill="#fef9c3" opacity="0.85" />
              <circle cx="43" cy="43" r="10" fill="#ffffff" />
            </svg>
          </div>

          {/* Mega Solar Beam (titanic high-intensity solar cannon cutting horizontally) */}
          <div
            className="absolute left-1/2"
            style={{
              width: 220,
              height: 56,
              transformOrigin: '0% 50%',
              transform: 'translate(-35%, -50%)',
              animation: 'gbaSolarMegaBeam 1.85s cubic-bezier(0.15, 0.9, 0.2, 1) forwards'
            }}
          >
            <svg width="220" height="56" viewBox="0 0 220 56" className="drop-shadow-[0_0_26px_#fde047]">
              <defs>
                <linearGradient id="solarMegaBeamGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="20%" stopColor="#fef08a" />
                  <stop offset="55%" stopColor="#facc15" />
                  <stop offset="85%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="solarMegaCoreGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="70%" stopColor="#fef9c3" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#fde047" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              {/* Outer solar flare aura */}
              <rect x="0" y="4" width="220" height="48" rx="24" fill="url(#solarMegaBeamGrad)" opacity="0.4" />
              {/* Main high-density beam */}
              <rect x="0" y="10" width="216" height="36" rx="18" fill="url(#solarMegaBeamGrad)" opacity="0.85" />
              {/* Super-hot thermonuclear white core */}
              <rect x="4" y="18" width="206" height="20" rx="10" fill="url(#solarMegaCoreGrad)" />
              <rect x="8" y="23" width="194" height="10" rx="5" fill="#ffffff" />
              {/* Emerald solar filaments honoring Venusaur's Grass typing */}
              <line x1="20" y1="12" x2="180" y2="12" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
              <line x1="20" y1="44" x2="180" y2="44" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
            </svg>
          </div>

          {/* Impact Lens Flare & Solar Burst */}
          <div
            className="absolute right-0"
            style={{ animation: 'gbaSolarImpactBurst 1.85s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' }}
          >
            <svg width="84" height="84" viewBox="0 0 84 84" className="drop-shadow-[0_0_30px_#fde047]">
              <defs>
                <radialGradient id="solarBurstGrad" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="#fef08a" />
                  <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* 12-point solar flare star */}
              <polygon
                points="42,2 45,30 73,11 54,34 82,42 54,50 73,73 45,54 42,82 39,54 11,73 30,50 2,42 30,34 11,11 39,30"
                fill="url(#solarBurstGrad)"
              />
              <circle cx="42" cy="42" r="16" fill="#ffffff" opacity="0.9" />
              <circle cx="42" cy="42" r="26" fill="#fef08a" opacity="0.4" />
            </svg>
          </div>
        </div>
      )}

      {/* 17. PSYBEAM KALEIDOSCOPE (Alakazam Lv. 42 / Kadabra — Mind-Bending Sacred Mandala & Refraction Beams) */}
      {fx.type === 'psybeam_kaleidoscope' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Prismatic Rotating Sacred Mandala Core */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaPsybeamMandalaSpin 1.65s cubic-bezier(0.12, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150" className="drop-shadow-[0_0_30px_#f43f5e]">
              <defs>
                <linearGradient id="psybeamRainbow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="25%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="75%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              {/* Outer 8-Point Sacred Octagram */}
              <polygon
                points="75,5 92,52 145,52 102,82 118,130 75,100 32,130 48,82 5,52 58,52"
                fill="none"
                stroke="url(#psybeamRainbow)"
                strokeWidth="3"
              />
              {/* Rotated Inner Octagram */}
              <polygon
                points="75,20 88,58 128,58 96,82 108,120 75,98 42,120 54,82 22,58 62,58"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                opacity="0.85"
              />
              <circle cx="75" cy="75" r="22" fill="#ffffff" opacity="0.95" className="drop-shadow-[0_0_12px_#38bdf8]" />
              <circle cx="75" cy="75" r="10" fill="#f43f5e" />
            </svg>
          </div>

          {/* 8-Way Prismatic Refraction Rays */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-20"
            style={{ animation: 'gbaPsybeamPrismRays 1.65s ease-out forwards' }}
          >
            <svg width="180" height="180" viewBox="0 0 180 180" className="drop-shadow-[0_0_20px_#a855f7]">
              <line x1="90" y1="10" x2="90" y2="170" stroke="#f43f5e" strokeWidth="2" />
              <line x1="10" y1="90" x2="170" y2="90" stroke="#38bdf8" strokeWidth="2" />
              <line x1="33" y1="33" x2="147" y2="147" stroke="#a855f7" strokeWidth="2" />
              <line x1="33" y1="147" x2="147" y2="33" stroke="#fbbf24" strokeWidth="2" />
            </svg>
          </div>

          {/* Center Refractive Energy Beam Pulse */}
          <div
            className="absolute flex items-center justify-center z-25"
            style={{ animation: 'gbaPsybeamRefractionPulse 1.65s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
          >
            <div className="w-56 h-3 rounded-full bg-gradient-to-r from-pink-500 via-white to-cyan-400 shadow-[0_0_25px_#38bdf8]" />
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

      {/* 19b. SEISMIC TOSS (Machamp Lv. 67 — 60 DMG 4-Armed Tectonic Upheaval) */}
      {fx.type === 'seismic_toss_machamp' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Screen slam & amber dust shockwave overlay */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ animation: 'gbaSeismicScreenSlam 1.8s ease-out forwards' }}
          />

          {/* Orbital Descent & Crater Impact Ring */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaSeismicDescent 1.8s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
          >
            <svg width="140" height="90" viewBox="0 0 140 90" className="drop-shadow-[0_0_20px_#d97706]">
              {/* Outer shockwave impact ellipse */}
              <ellipse cx="70" cy="50" rx="64" ry="24" fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.8" />
              <ellipse cx="70" cy="50" rx="46" ry="16" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.9" />
              {/* Crater core with incandescent mantle glow */}
              <ellipse cx="70" cy="50" rx="30" ry="10" fill="#ea580c" opacity="0.75" />
              <ellipse cx="70" cy="50" rx="16" ry="5" fill="#fef08a" opacity="0.9" />
            </svg>
          </div>

          {/* 4-Way Seismic Fissures tearing card diagonally & vertically */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: 'gbaSeismicFissure4Way 1.8s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
          >
            <svg width="160" height="180" viewBox="0 0 160 180" className="drop-shadow-[0_0_14px_#d97706]">
              <defs>
                <linearGradient id="seismicLavaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
              </defs>
              {/* North fissure */}
              <path d="M80 90 L78 68 L84 45 L76 25 L80 8" fill="none" stroke="url(#seismicLavaGrad)" strokeWidth="4" strokeLinecap="round" />
              <path d="M80 90 L78 68 L84 45 L76 25 L80 8" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
              {/* South fissure */}
              <path d="M80 90 L83 115 L77 138 L85 160 L80 176" fill="none" stroke="url(#seismicLavaGrad)" strokeWidth="4" strokeLinecap="round" />
              <path d="M80 90 L83 115 L77 138 L85 160 L80 176" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
              {/* West branch */}
              <path d="M80 90 L58 84 L38 94 L18 80 L6 88" fill="none" stroke="url(#seismicLavaGrad)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M80 90 L58 84 L38 94 L18 80 L6 88" fill="none" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
              {/* East branch */}
              <path d="M80 90 L104 96 L124 86 L144 98 L156 90" fill="none" stroke="url(#seismicLavaGrad)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M80 90 L104 96 L124 86 L144 98 L156 90" fill="none" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            </svg>
          </div>

          {/* Exploding Tectonic Rock Shards (8 heavy boulders flung outward) */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: 'gbaSeismicRockShards 1.8s cubic-bezier(0.15, 0.9, 0.3, 1) forwards' }}
          >
            <svg width="180" height="180" viewBox="0 0 180 180">
              {/* Shard 1: Top-Left heavy rock */}
              <polygon points="32,25 44,18 48,30 38,38 28,34" fill="#57534e" stroke="#292524" strokeWidth="1.2" />
              <polygon points="32,25 44,18 40,28" fill="#78716c" opacity="0.8" />
              {/* Shard 2: Top-Right heavy rock */}
              <polygon points="140,28 152,22 158,35 146,42 136,36" fill="#44403c" stroke="#1c1917" strokeWidth="1.2" />
              <polygon points="140,28 152,22 148,34" fill="#78716c" opacity="0.8" />
              {/* Shard 3: Bottom-Left heavy rock */}
              <polygon points="26,145 38,138 46,148 38,160 24,155" fill="#57534e" stroke="#292524" strokeWidth="1.2" />
              <polygon points="26,145 38,138 34,150" fill="#a8a29e" opacity="0.7" />
              {/* Shard 4: Bottom-Right heavy rock */}
              <polygon points="135,140 148,132 156,146 144,158 130,150" fill="#44403c" stroke="#1c1917" strokeWidth="1.2" />
              <polygon points="135,140 148,132 142,146" fill="#78716c" opacity="0.8" />
              {/* Mid-range fragments */}
              <polygon points="85,15 92,10 95,18 88,22" fill="#78716c" />
              <polygon points="15,88 22,82 25,92 18,96" fill="#57534e" />
              <polygon points="160,82 168,78 172,88 164,92" fill="#78716c" />
              <polygon points="88,162 95,156 98,166 90,170" fill="#57534e" />
            </svg>
          </div>
        </div>
      )}

      {/* 19c. DRAGONITE SLAM (Dragonite Lv. 45 — 40x DMG Heavy Draconic Tail Quake) */}
      {fx.type === 'dragonite_slam' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Tactical screen-snap jolt with golden draconic pressure waves */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ animation: 'gbaDragoniteShockwaveSnap 1.8s ease-out forwards' }}
          />

          {/* Aerodynamic supersonic dive shadow & wind sonic boom */}
          <div
            className="absolute top-2 flex items-center justify-center"
            style={{ animation: 'gbaDragoniteSkyDive 1.8s cubic-bezier(0.12, 0.9, 0.24, 1) forwards' }}
          >
            <svg width="150" height="100" viewBox="0 0 150 100" className="drop-shadow-[0_0_24px_#f59e0b]">
              <ellipse cx="75" cy="45" rx="65" ry="20" fill="none" stroke="#fde047" strokeWidth="3" opacity="0.8" />
              <ellipse cx="75" cy="45" rx="42" ry="12" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
              {/* Draconic wingspan sonic streak */}
              <path d="M10 45 Q 75 15, 140 45" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          {/* Colossal Heavy Draconic Tail Smash */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaDragoniteTailSmash 1.8s cubic-bezier(0.15, 0.9, 0.28, 1) forwards' }}
          >
            <svg width="140" height="120" viewBox="0 0 140 120" className="drop-shadow-[0_0_28px_#d97706]">
              <defs>
                <linearGradient id="dragonTailGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="60%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>
              {/* Massive curving draconic tail */}
              <path
                d="M20 20 C 50 10, 110 30, 125 75 C 132 95, 115 110, 95 105 C 75 100, 40 60, 20 20 Z"
                fill="url(#dragonTailGrad)"
                stroke="#fef08a"
                strokeWidth="2.5"
              />
              {/* Dragon tail ivory ridge stripes */}
              <path d="M50 32 L58 44" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
              <path d="M78 48 L86 62" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
              <path d="M100 70 L108 84" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
              {/* Golden kinetic impact arc */}
              <path d="M15 15 Q 120 40, 135 110" fill="none" stroke="#fde047" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
            </svg>
          </div>

          {/* Multi-ring Tectonic Earth Crater */}
          <div
            className="absolute bottom-2 flex items-center justify-center"
            style={{ animation: 'gbaDragoniteTectonicCrater 1.8s cubic-bezier(0.12, 0.88, 0.3, 1) forwards' }}
          >
            <svg width="150" height="80" viewBox="0 0 150 80" className="drop-shadow-[0_0_20px_#b45309]">
              <ellipse cx="75" cy="45" rx="65" ry="22" fill="none" stroke="#d97706" strokeWidth="3" opacity="0.8" />
              <ellipse cx="75" cy="45" rx="45" ry="14" fill="#78350f" opacity="0.6" />
              <ellipse cx="75" cy="45" rx="25" ry="8" fill="#fef08a" opacity="0.8" />
              {/* Radiating fracture fissures */}
              <path d="M75 45 L35 25 M75 45 L115 25 M75 45 L45 65 M75 45 L105 65" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}

      {/* 20b. MEGA PUNCH (Nidoqueen Lv. 43 — 50 DMG Armored Royal Kinetic Fist) */}
      {fx.type === 'mega_punch_nidoqueen' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Suction kinetic windup lines */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaMegaPunchAnticipation 1.6s ease-in-out forwards' }}
          >
            <svg width="140" height="140" viewBox="0 0 140 140">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
                <g key={i} transform={`rotate(${ang} 70 70)`}>
                  <line x1="70" y1="10" x2="70" y2="40" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                  <circle cx="70" cy="12" r="3" fill="#facc15" />
                </g>
              ))}
            </svg>
          </div>

          {/* Armored Cobalt Reptilian Fist Impact */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaMegaPunchFistImpact 1.6s cubic-bezier(0.12, 0.9, 0.22, 1) forwards' }}
          >
            <svg width="120" height="110" viewBox="0 0 120 110" className="drop-shadow-[0_0_32px_#0284c7]">
              <defs>
                <linearGradient id="nidoqueenScaleGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="45%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
              {/* Forearm armored plating */}
              <path d="M20 90 L35 55 L85 55 L100 90 Z" fill="url(#nidoqueenScaleGrad)" stroke="#0284c7" strokeWidth="2" />
              {/* Heavy armored clenched fist */}
              <ellipse cx="60" cy="45" rx="36" ry="26" fill="url(#nidoqueenScaleGrad)" stroke="#e0f2fe" strokeWidth="2.5" />
              {/* 4 Heavy reptilian armored knuckles */}
              <rect x="32" y="24" width="12" height="18" rx="6" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
              <rect x="48" y="20" width="14" height="22" rx="7" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
              <rect x="66" y="22" width="14" height="22" rx="7" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
              <rect x="84" y="26" width="12" height="18" rx="6" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
              {/* Thumb locked over fingers */}
              <path d="M30 45 Q 40 60, 65 58 Q 50 48, 30 45 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              {/* Impact glint on knuckles */}
              <circle cx="55" cy="24" r="3.5" fill="#fde047" className="drop-shadow-[0_0_6px_#fde047]" />
              <circle cx="73" cy="25" r="3.5" fill="#fde047" className="drop-shadow-[0_0_6px_#fde047]" />
            </svg>
          </div>

          {/* Hexagonal / Diamond Kinetic Shockwave Rings */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaMegaPunchShockwaveRings 1.6s cubic-bezier(0.15, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150">
              {/* Diamond outer shockwave */}
              <polygon points="75,10 140,75 75,140 10,75" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.85" />
              <circle cx="75" cy="75" r="48" fill="none" stroke="#facc15" strokeWidth="2.5" opacity="0.9" />
              <circle cx="75" cy="75" r="28" fill="#ffffff" opacity="0.95" />
            </svg>
          </div>

          {/* Exploding kinetic force sparks */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaMegaPunchImpactSparks 1.6s ease-out 0.2s forwards', opacity: 0 }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100">
              <polygon points="50,5 55,38 88,20 68,45 95,50 68,55 88,80 55,62 50,95 45,62 12,80 32,55 5,50 32,45 12,20 45,38" fill="#fde047" stroke="#ffffff" strokeWidth="1.2" />
            </svg>
          </div>
        </div>
      )}

      {/* 20c. PIDGEOT HURRICANE (Pidgeot Lv. 40 — Stratospheric Cyclone & Card Blowback Updraft) */}
      {fx.type === 'pidgeot_hurricane' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Atmospheric Mist and Barometric Pressure Vignette */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              animation: 'gbaHurricaneAura 1.8s ease-in-out forwards',
              background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(20,184,166,0.28) 50%, rgba(15,23,42,0.4) 100%)'
            }}
          />

          {/* Twin Stratospheric Cyclonic Funnels (Left & Right) */}
          <div className="absolute" style={{ animation: 'gbaHurricaneFunnelL 1.8s cubic-bezier(0.1, 0.8, 0.2, 1) forwards' }}>
            <svg width="100" height="150" viewBox="0 0 100 150">
              <defs>
                <linearGradient id="pidgeotGaleGradL" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#f0fdf4" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path d="M15 135 Q 35 90, 20 60 Q 5 30, 45 10 Q 75 30, 65 70 Q 55 105, 80 135 Z" fill="url(#pidgeotGaleGradL)" />
              <ellipse cx="45" cy="18" rx="35" ry="8" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.9" />
              <ellipse cx="40" cy="50" rx="26" ry="6" fill="none" stroke="#bae6fd" strokeWidth="2" opacity="0.75" />
              <ellipse cx="42" cy="90" rx="18" ry="4.5" fill="none" stroke="#7dd3fc" strokeWidth="1.8" opacity="0.6" />
            </svg>
          </div>

          <div className="absolute" style={{ animation: 'gbaHurricaneFunnelR 1.8s cubic-bezier(0.1, 0.8, 0.2, 1) forwards' }}>
            <svg width="100" height="150" viewBox="0 0 100 150">
              <defs>
                <linearGradient id="pidgeotGaleGradR" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#99f6e4" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path d="M85 135 Q 65 90, 80 60 Q 95 30, 55 10 Q 25 30, 35 70 Q 45 105, 20 135 Z" fill="url(#pidgeotGaleGradR)" />
              <ellipse cx="55" cy="18" rx="35" ry="8" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.9" />
              <ellipse cx="60" cy="50" rx="26" ry="6" fill="none" stroke="#99f6e4" strokeWidth="2" opacity="0.75" />
              <ellipse cx="58" cy="90" rx="18" ry="4.5" fill="none" stroke="#5eead4" strokeWidth="1.8" opacity="0.6" />
            </svg>
          </div>

          {/* Central Vertical Updraft Gust (Lifting Target Out) */}
          <div className="absolute flex items-center justify-center" style={{ animation: 'gbaHurricaneUpdraft 1.8s ease-in-out forwards' }}>
            <svg width="120" height="180" viewBox="0 0 120 180">
              <path d="M40 170 Q 60 110, 35 60 Q 60 20, 55 5" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.95" />
              <path d="M60 175 Q 80 120, 65 70 Q 50 30, 75 8" fill="none" stroke="#bae6fd" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
              <path d="M80 170 Q 55 115, 85 65 Q 70 25, 90 5" fill="none" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            </svg>
          </div>

          {/* Expanding Barometric Shock Rings */}
          <div className="absolute flex items-center justify-center" style={{ animation: 'gbaHurricaneShockRing 1.8s ease-out forwards' }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <ellipse cx="80" cy="80" rx="65" ry="45" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
              <ellipse cx="80" cy="80" rx="75" ry="55" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
            </svg>
          </div>

          {/* Pidgeot Crest Feathers caught in vortex */}
          {[0, 90, 180, 270].map((rot, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                animation: `gbaHurricaneFeatherSpin 1.8s cubic-bezier(0.2, 0.8, 0.3, 1) ${0.1 * i}s forwards`,
                transform: `rotate(${rot}deg)`
              }}
            >
              <svg width="36" height="18" viewBox="0 0 36 18">
                <path d="M2 9 Q 14 2, 28 5 Q 35 9, 28 13 Q 14 16, 2 9 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
                <path d="M24 6 Q 34 9, 24 12 Z" fill="#dc2626" />
                <line x1="2" y1="9" x2="28" y2="9" stroke="#fef3c7" strokeWidth="1" opacity="0.8" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 20d. MACHOKE SUBMISSION (Machoke Lv. 40 — 60 DMG Brutal Judo Submission Grapple & Mat Slam) */}
      {fx.type === 'submission_grapple' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Dual Muscular Belted Clamping Arms holding the card */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaSubmissionArmsClamp 1.7s cubic-bezier(0.12, 0.9, 0.22, 1) forwards' }}
          >
            <svg width="170" height="120" viewBox="0 0 170 120" className="drop-shadow-[0_0_24px_#ca8a04]">
              <defs>
                <linearGradient id="machokeMuscleGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="40%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
                <linearGradient id="machokeBeltGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#a16207" />
                </linearGradient>
              </defs>
              {/* Left bicep & gripping hand */}
              <g transform="translate(10, 20)">
                <path d="M0 60 Q 20 20, 45 35 Q 55 45, 60 70 Q 35 75, 0 60 Z" fill="url(#machokeMuscleGrad)" stroke="#475569" strokeWidth="2" />
                <path d="M22 30 Q 32 40, 28 55" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
                <path d="M32 32 Q 42 42, 38 57" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
                <circle cx="62" cy="65" r="14" fill="#64748b" stroke="#e2e8f0" strokeWidth="2" />
              </g>
              {/* Right bicep & gripping hand */}
              <g transform="translate(100, 20)">
                <path d="M60 60 Q 40 20, 15 35 Q 5 45, 0 70 Q 25 75, 60 60 Z" fill="url(#machokeMuscleGrad)" stroke="#475569" strokeWidth="2" />
                <path d="M38 30 Q 28 40, 32 55" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
                <path d="M28 32 Q 18 42, 22 57" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
                <circle cx="-2" cy="65" r="14" fill="#64748b" stroke="#e2e8f0" strokeWidth="2" />
              </g>
              {/* Championship Power Belt Emblem */}
              <polygon points="85,35 100,50 85,65 70,50" fill="url(#machokeBeltGrad)" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="85" cy="50" r="4.5" fill="#ef4444" />
            </svg>
          </div>

          {/* 360 Submission Roll Motion Streaks */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaSubmissionRollSpin 1.7s cubic-bezier(0.2, 0.8, 0.25, 1) forwards' }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="62" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="50 30" opacity="0.85" />
              <circle cx="75" cy="75" r="50" fill="none" stroke="#fdba74" strokeWidth="2" strokeDasharray="30 20" opacity="0.75" />
              <circle cx="75" cy="75" r="38" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="25 15" opacity="0.9" />
            </svg>
          </div>

          {/* Massive Earth / Mat Slam Impact Crater */}
          <div
            className="absolute flex items-center justify-center bottom-0"
            style={{ animation: 'gbaSubmissionEarthSlam 1.7s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
          >
            <svg width="160" height="90" viewBox="0 0 160 90">
              <path d="M80 45 L50 20 L25 35 L5 25" stroke="#ea580c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M80 45 L110 20 L135 35 L155 25" stroke="#ea580c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M80 45 L65 75 L45 85" stroke="#f97316" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M80 45 L95 75 L115 85" stroke="#f97316" strokeWidth="3" strokeLinecap="round" fill="none" />
              <ellipse cx="80" cy="45" rx="25" ry="12" fill="#78350f" opacity="0.6" />
              <circle cx="80" cy="45" r="12" fill="#ffffff" opacity="0.9" />
            </svg>
          </div>

          {/* Machoke 20-Damage Recoil Sparks */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaSubmissionRecoilSparks 1.7s ease-out forwards', opacity: 0 }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120">
              <polygon points="60,10 66,45 100,30 78,56 110,65 76,74 95,105 65,85 55,115 48,82 15,100 35,70 5,60 36,50 15,25 48,38" fill="#ef4444" stroke="#fde047" strokeWidth="1.5" />
              <circle cx="60" cy="60" r="18" fill="#ffffff" opacity="0.95" />
            </svg>
          </div>
        </div>
      )}

      {/* 20e. RATICATE SUPER FANG (Raticate Lv. 41 — Half-HP Carnassial Guillotine Incisors & Cleave) */}
      {fx.type === 'super_fang_guillotine' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Menacing Amber-Crimson Vignette */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{ animation: 'gbaSuperFangVignette 1.6s ease-out forwards' }}
          />

          {/* Authentic 1999 Ken Sugimori Raticate Ferocious Jaws Illustration */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaRaticateSugimoriLunge 1.6s cubic-bezier(0.18, 0.92, 0.28, 1) forwards' }}
          >
            <img
              src="/assets/Raticate_SuperFang_Jaws.png"
              alt="Raticate Super Fang"
              className="select-none pointer-events-none drop-shadow-[0_0_24px_rgba(254,240,138,0.85)] drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
              style={{
                width: '135px',
                maxWidth: '135px',
                height: 'auto',
                objectFit: 'contain'
              }}
              draggable={false}
            />
          </div>

          {/* Upper Jaw: Colossal Chisel Rodent Incisors Clamping Down */}
          <div
            className="absolute flex items-center justify-center -top-6"
            style={{ animation: 'gbaSuperFangUpperJaw 1.6s cubic-bezier(0.18, 0.92, 0.28, 1) forwards' }}
          >
            <svg width="120" height="85" viewBox="0 0 120 85" className="drop-shadow-[0_0_24px_#ffffff]">
              <defs>
                <linearGradient id="incisorGradUpper" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="35%" stopColor="#f8fafc" />
                  <stop offset="90%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>
              <path d="M25 15 Q 60 5, 95 15 L 90 28 Q 60 20, 30 28 Z" fill="#e11d48" stroke="#9f1239" strokeWidth="2" />
              <path d="M38 24 L 56 24 L 55 76 L 37 72 Z" fill="url(#incisorGradUpper)" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
              <line x1="42" y1="28" x2="42" y2="68" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
              <path d="M58 24 L 76 24 L 77 72 L 59 76 Z" fill="url(#incisorGradUpper)" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
              <line x1="72" y1="28" x2="72" y2="68" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
              <polygon points="37,72 55,76 55,80 37,76" fill="#fde047" />
              <polygon points="59,76 77,72 77,76 59,80" fill="#fde047" />
            </svg>
          </div>

          {/* Lower Jaw: Colossal Chisel Rodent Incisors Snapping Up */}
          <div
            className="absolute flex items-center justify-center -bottom-6"
            style={{ animation: 'gbaSuperFangLowerJaw 1.6s cubic-bezier(0.18, 0.92, 0.28, 1) forwards' }}
          >
            <svg width="120" height="85" viewBox="0 0 120 85" className="drop-shadow-[0_0_24px_#ffffff]">
              <defs>
                <linearGradient id="incisorGradLower" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="35%" stopColor="#f8fafc" />
                  <stop offset="90%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>
              <path d="M25 70 Q 60 80, 95 70 L 90 57 Q 60 65, 30 57 Z" fill="#e11d48" stroke="#9f1239" strokeWidth="2" />
              <path d="M40 61 L 57 61 L 56 12 L 39 16 Z" fill="url(#incisorGradLower)" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
              <line x1="44" y1="57" x2="44" y2="18" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
              <path d="M59 61 L 76 61 L 77 16 L 60 12 Z" fill="url(#incisorGradLower)" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
              <line x1="72" y1="57" x2="72" y2="18" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
              <polygon points="39,16 56,12 56,8 39,12" fill="#fde047" />
              <polygon points="60,12 77,16 77,12 60,8" fill="#fde047" />
            </svg>
          </div>

          {/* Vertical Card Guillotine Cleave / Fracture Line */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaSuperFangCleaveFissure 1.6s ease-out forwards' }}
          >
            <svg width="40" height="170" viewBox="0 0 40 170">
              <path d="M20 5 L16 35 L24 60 L17 90 L23 125 L18 150 L20 165" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
              <path d="M20 5 L16 35 L24 60 L17 90 L23 125 L18 150 L20 165" fill="none" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Exploding Incisor Kinetic Bite Sparks */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaSuperFangSparks 1.6s ease-out 0.2s forwards', opacity: 0 }}
          >
            <svg width="110" height="110" viewBox="0 0 110 110">
              <polygon points="55,5 60,38 90,20 72,48 102,55 72,62 90,90 60,72 55,105 50,72 20,90 38,62 8,55 38,48 20,20 50,38" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />
              <circle cx="55" cy="55" r="14" fill="#ffffff" opacity="0.95" />
            </svg>
          </div>
        </div>
      )}

      {/* 20f. VICTREEBEL ACID (Victreebel Lv. 42 — 50 DMG Carnivorous Pitcher Acid Torrent & Visceral Melt) */}
      {fx.type === 'victreebel_acid_melt' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Billowing Caustic Fog & Acid Mist */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              animation: 'gbaAcidCorrosionMist 1.75s ease-out forwards',
              background: 'radial-gradient(circle, rgba(163,230,53,0.3) 0%, rgba(132,204,22,0.4) 45%, rgba(101,163,13,0.2) 85%)'
            }}
          />

          {/* Authentic 1999 Ken Sugimori Victreebel Pitcher Maw Illustration */}
          <div
            className="absolute -top-10 -left-6 flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaVictreebelSugimoriErupt 1.75s cubic-bezier(0.15, 0.85, 0.25, 1) forwards' }}
          >
            <img
              src="/assets/Victreebel_Acid_Maw.png"
              alt="Victreebel Acid"
              className="select-none pointer-events-none drop-shadow-[0_0_28px_rgba(163,230,53,0.9)] drop-shadow-[0_8px_18px_rgba(0,0,0,0.5)]"
              style={{
                width: '150px',
                maxWidth: '150px',
                height: 'auto',
                objectFit: 'contain'
              }}
              draggable={false}
            />
          </div>

          {/* Pressurized Pitcher Digestive Bile Torrent */}
          <div
            className="absolute flex items-center justify-center -top-4"
            style={{ animation: 'gbaAcidDelugeStream 1.75s cubic-bezier(0.12, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="130" height="150" viewBox="0 0 130 150" className="drop-shadow-[0_0_26px_#84cc16]">
              <defs>
                <linearGradient id="acidStreamGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="40%" stopColor="#a3e635" />
                  <stop offset="85%" stopColor="#65a30d" />
                  <stop offset="100%" stopColor="#3f6212" />
                </linearGradient>
              </defs>
              <path d="M20 10 Q 65 35, 110 10 Q 125 75, 100 135 Q 65 145, 30 135 Q 5 75, 20 10 Z" fill="url(#acidStreamGrad)" opacity="0.9" />
              <path d="M35 25 Q 65 55, 95 25 Q 90 90, 75 130 Q 65 135, 55 130 Q 40 90, 35 25 Z" fill="#bef264" opacity="0.85" />
              <path d="M50 35 Q 65 60, 80 35 Q 75 80, 65 110 Q 55 80, 50 35 Z" fill="#ffffff" opacity="0.7" />
            </svg>
          </div>

          {/* Viscous Melting Sludge Drips running down the card */}
          {[15, 45, 75, 105].map((xPos, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${xPos}px`,
                animation: `gbaAcidSludgeDrip 1.75s cubic-bezier(0.2, 0.7, 0.3, 1) ${0.15 + i * 0.1}s forwards`,
                opacity: 0
              }}
            >
              <svg width="24" height="42" viewBox="0 0 24 42">
                <path d="M12 2 Q 18 15, 18 26 A 6 6 0 1 1 6 26 Q 6 15, 12 2 Z" fill="#a3e635" stroke="#65a30d" strokeWidth="1.5" />
                <circle cx="12" cy="30" r="3" fill="#ffffff" opacity="0.75" />
              </svg>
            </div>
          ))}

          {/* Sizzling Caustic Micro-Bubbles popping */}
          {[
            { top: '35%', left: '42%', size: 28, delay: '0.2s' },
            { top: '55%', left: '30%', size: 34, delay: '0.35s' },
            { top: '48%', left: '62%', size: 30, delay: '0.25s' },
            { top: '65%', left: '50%', size: 36, delay: '0.45s' }
          ].map((b, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: b.top,
                left: b.left,
                animation: `gbaAcidSizzlingBubbles 1.75s ease-out ${b.delay} forwards`,
                opacity: 0
              }}
            >
              <svg width={b.size} height={b.size} viewBox="0 0 30 30">
                <circle cx="15" cy="15" r="12" fill="#bef264" stroke="#4d7c0f" strokeWidth="1.5" opacity="0.85" />
                <circle cx="11" cy="11" r="3.5" fill="#ffffff" opacity="0.9" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 20g. RAICHU GIGASHOCK (Raichu Fossil Lv. 45 — 30 DMG Active Strike + 3 Branching Bench Chain Lightning Arcs) */}
      {fx.type === 'raichu_gigashock' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Ionized Electric Field Aura */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              animation: 'gbaGigashockIonAura 1.85s ease-in-out forwards',
              background: 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(2,132,199,0.35) 55%, rgba(15,23,42,0.4) 100%)'
            }}
          />

          {/* Central Heavy Overload Bolt (Striking Active Target) */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaGigashockCentralBolt 1.85s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
          >
            <svg width="70" height="160" viewBox="0 0 70 160" className="drop-shadow-[0_0_32px_#fde047]">
              {/* Outer Cyan Plasma Glow */}
              <path d="M35 0 L24 45 L42 40 L20 90 L38 82 L15 135 L32 125 L30 160 L46 115 L35 122 L52 75 L38 82 L50 38 L34 42 L42 0 Z" fill="#38bdf8" opacity="0.75" />
              {/* Electric Yellow Body */}
              <path d="M35 0 L26 43 L40 39 L22 88 L36 80 L18 132 L30 123 L28 156 L44 113 L33 120 L49 73 L36 80 L47 36 L32 40 L39 0 Z" fill="#fde047" stroke="#facc15" strokeWidth="1.5" />
              {/* Blinding White Core */}
              <path d="M35 5 L29 40 L37 37 L25 82 L33 76 L22 125 L30 118 L29 148 L40 110 L32 115 L45 70 L34 76 L43 35 L31 38 L37 5 Z" fill="#ffffff" opacity="0.95" />
            </svg>
          </div>

          {/* Branching Chain Lightning Arc 1 (Shooting Left toward Bench) */}
          <div
            className="absolute"
            style={{ animation: 'gbaGigashockChainArc1 1.85s cubic-bezier(0.15, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="110" height="70" viewBox="0 0 110 70" className="drop-shadow-[0_0_20px_#38bdf8]">
              <path d="M100 65 L75 45 L85 40 L55 25 L65 18 L30 8 L40 5 L5 2" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              <path d="M100 65 L75 45 L85 40 L55 25 L65 18 L30 8 L40 5 L5 2" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="5" cy="2" r="5" fill="#fde047" className="drop-shadow-[0_0_8px_#fde047]" />
            </svg>
          </div>

          {/* Branching Chain Lightning Arc 2 (Shooting Upward/Center toward Bench) */}
          <div
            className="absolute"
            style={{ animation: 'gbaGigashockChainArc2 1.85s cubic-bezier(0.15, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="60" height="110" viewBox="0 0 60 110" className="drop-shadow-[0_0_20px_#38bdf8]">
              <path d="M30 105 L20 75 L35 70 L15 45 L30 40 L10 15 L20 12 L28 2" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              <path d="M30 105 L20 75 L35 70 L15 45 L30 40 L10 15 L20 12 L28 2" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="28" cy="2" r="5" fill="#fde047" className="drop-shadow-[0_0_8px_#fde047]" />
            </svg>
          </div>

          {/* Branching Chain Lightning Arc 3 (Shooting Right toward Bench) */}
          <div
            className="absolute"
            style={{ animation: 'gbaGigashockChainArc3 1.85s cubic-bezier(0.15, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="110" height="70" viewBox="0 0 110 70" className="drop-shadow-[0_0_20px_#38bdf8]">
              <path d="M10 65 L35 45 L25 40 L55 25 L45 18 L80 8 L70 5 L105 2" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              <path d="M10 65 L35 45 L25 40 L55 25 L45 18 L80 8 L70 5 L105 2" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="105" cy="2" r="5" fill="#fde047" className="drop-shadow-[0_0_8px_#fde047]" />
            </svg>
          </div>

          {/* Overload Electric Plasma Burst at Center */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaGigashockArcSparks 1.85s ease-out 0.25s forwards', opacity: 0 }}
          >
            <svg width="130" height="130" viewBox="0 0 130 130">
              <polygon points="65,5 72,45 108,22 85,55 125,65 85,75 108,108 72,85 65,125 58,85 22,108 45,75 5,65 45,55 22,22 58,45" fill="#fef08a" stroke="#0284c7" strokeWidth="1.5" />
              <circle cx="65" cy="65" r="22" fill="#ffffff" opacity="0.95" />
            </svg>
          </div>
        </div>
      )}

      {/* 20h. BEEDRILL TWINEEDLE (Beedrill Lv. 32 — Authentic Sugimori Twin Lance High-Speed Drill Thrust) */}
      {fx.type === 'beedrill_twineedle' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Authentic 1999 Ken Sugimori Beedrill Twin Lances Illustration */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaBeedrillLancesThrust 1.5s cubic-bezier(0.15, 0.9, 0.25, 1) forwards' }}
          >
            <img
              src="/assets/Beedrill_Twineedle_Lances.png"
              alt="Beedrill Twineedle"
              className="select-none pointer-events-none drop-shadow-[0_0_24px_rgba(254,240,138,0.85)] drop-shadow-[0_6px_14px_rgba(0,0,0,0.4)]"
              style={{
                width: '145px',
                maxWidth: '145px',
                height: 'auto',
                objectFit: 'contain'
              }}
              draggable={false}
            />
          </div>

          {/* Piercing Sonic Cone Rings */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaBeedrillPiercingRing 1.5s ease-out forwards' }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="45" fill="none" stroke="#fde047" strokeWidth="3" opacity="0.9" />
              <circle cx="75" cy="75" r="60" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.75" />
            </svg>
          </div>

          {/* Poison & Kinetic Thrust Impact Sparks */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaBeedrillSparks 1.5s ease-out 0.25s forwards', opacity: 0 }}
          >
            <svg width="110" height="110" viewBox="0 0 110 110">
              <polygon points="55,5 62,38 95,22 75,50 105,58 75,65 95,92 62,75 55,105 48,75 15,92 35,65 5,58 35,50 15,22 48,38" fill="#facc15" stroke="#a855f7" strokeWidth="1.5" />
              <circle cx="55" cy="55" r="16" fill="#ffffff" opacity="0.95" />
            </svg>
          </div>
        </div>
      )}

      {/* 20i. DUGTRIO EARTHQUAKE (Dugtrio Lv. 36 — 60 DMG Subterranean Mole Upheaval & Tectonic Quake) */}
      {fx.type === 'dugtrio_earthquake' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Authentic 1999 Ken Sugimori Dugtrio Trio Eruption Illustration */}
          <div
            className="absolute bottom-4 flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaDugtrioErupt 1.75s cubic-bezier(0.12, 0.9, 0.25, 1) forwards' }}
          >
            <img
              src="/assets/Dugtrio_Earthquake_Trio.png"
              alt="Dugtrio Earthquake"
              className="select-none pointer-events-none drop-shadow-[0_0_24px_rgba(234,88,12,0.85)] drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
              style={{
                width: '145px',
                maxWidth: '145px',
                height: 'auto',
                objectFit: 'contain'
              }}
              draggable={false}
            />
          </div>

          {/* 4-Way Tectonic Fault Line Fractures */}
          <div
            className="absolute flex items-center justify-center bottom-0"
            style={{ animation: 'gbaDugtrioFaultLine 1.75s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
          >
            <svg width="180" height="120" viewBox="0 0 180 120">
              <path d="M90 60 L40 15 L15 35 L5 25" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M90 60 L140 15 L165 35 L175 25" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M90 60 L70 105 L35 115" stroke="#ca8a04" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M90 60 L110 105 L145 115" stroke="#ca8a04" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <ellipse cx="90" cy="60" rx="35" ry="18" fill="#78350f" opacity="0.6" />
              <circle cx="90" cy="60" r="14" fill="#ffffff" opacity="0.9" />
            </svg>
          </div>

          {/* Exploding Earthen Quake Debris & Boulders */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaDugtrioQuakeRocks 1.75s ease-out 0.2s forwards', opacity: 0 }}
          >
            <svg width="140" height="140" viewBox="0 0 140 140">
              <polygon points="70,12 80,48 115,25 92,60 128,70 92,80 115,115 80,92 70,128 60,92 25,115 48,80 12,70 48,60 25,25 60,48" fill="#ea580c" stroke="#facc15" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 20j. ELECTRODE CHAIN LIGHTNING (Electrode Lv. 40/42 — Multi-Target Spherical High-Voltage Discharge) */}
      {fx.type === 'electrode_chain_lightning' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Spherical High-Voltage Overload Core */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaElectrodeSphereOverload 1.8s cubic-bezier(0.15, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-[0_0_35px_#38bdf8]">
              <circle cx="60" cy="60" r="42" fill="none" stroke="#38bdf8" strokeWidth="4" opacity="0.85" />
              <circle cx="60" cy="60" r="32" fill="#fde047" stroke="#facc15" strokeWidth="2.5" />
              <circle cx="60" cy="60" r="18" fill="#ffffff" />
            </svg>
          </div>

          {/* 4-Way Multi-Target Chain Lightning Arcs to Bench Zones */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaElectrodeChainArcs 1.8s ease-out forwards' }}
          >
            <svg width="180" height="180" viewBox="0 0 180 180" className="drop-shadow-[0_0_20px_#fde047]">
              {/* Northwest Arc */}
              <path d="M90 90 L65 65 L75 55 L40 40 L50 30 L15 15" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M90 90 L65 65 L75 55 L40 40 L50 30 L15 15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              {/* Northeast Arc */}
              <path d="M90 90 L115 65 L105 55 L140 40 L130 30 L165 15" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M90 90 L115 65 L105 55 L140 40 L130 30 L165 15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              {/* Southwest Arc */}
              <path d="M90 90 L65 115 L75 125 L40 140 L50 150 L15 165" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M90 90 L65 115 L75 125 L40 140 L50 150 L15 165" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              {/* Southeast Arc */}
              <path d="M90 90 L115 115 L105 125 L140 140 L130 150 L165 165" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M90 90 L115 115 L105 125 L140 140 L130 150 L165 165" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        </div>
      )}

      {/* 20k. VAPOREON HYDRO PUMP (Vaporeon Lv. 42 — 50+ DMG Aquatic Tidal Maelstrom & High-Pressure Column) */}
      {fx.type === 'vaporeon_hydro_pump' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Aquatic Tidal Vignette */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              animation: 'gbaVaporeonHydroSurge 1.7s ease-in-out forwards',
              background: 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(2,132,199,0.4) 50%, rgba(15,23,42,0.5) 100%)'
            }}
          />

          {/* Pressurized Vertical Hydro Column Blast */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaVaporeonTidalColumn 1.7s cubic-bezier(0.12, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="110" height="190" viewBox="0 0 110 190" className="drop-shadow-[0_0_30px_#38bdf8]">
              <defs>
                <linearGradient id="vaporeonHydroGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
              <rect x="25" y="10" width="60" height="170" rx="30" fill="url(#vaporeonHydroGrad)" opacity="0.85" />
              <rect x="38" y="15" width="34" height="160" rx="17" fill="#ffffff" opacity="0.9" />
              {/* Surging hydro spiral rings wrapping the column */}
              <ellipse cx="55" cy="50" rx="45" ry="12" fill="none" stroke="#bae6fd" strokeWidth="3" />
              <ellipse cx="55" cy="95" rx="48" ry="14" fill="none" stroke="#7dd3fc" strokeWidth="3.5" />
              <ellipse cx="55" cy="140" rx="45" ry="12" fill="none" stroke="#38bdf8" strokeWidth="3" />
            </svg>
          </div>
        </div>
      )}

      {/* 20l. GENGAR DARK MIND (Gengar Lv. 38 / Hypno — Spectral Abyssal Specter & Bench Psychic Pulse) */}
      {fx.type === 'gengar_dark_mind' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Abyssal Shadow Vignette */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              animation: 'gbaDarkMindVignette 1.8s ease-in-out forwards',
              background: 'radial-gradient(ellipse at center, rgba(88,28,135,0.4) 0%, rgba(30,27,75,0.6) 60%, rgba(15,23,42,0.85) 100%)'
            }}
          />

          {/* Gengar Malevolent Specter Visage */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaDarkMindGengarManifest 1.8s cubic-bezier(0.15, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="150" height="130" viewBox="0 0 150 130" className="drop-shadow-[0_0_30px_#9333ea]">
              <defs>
                <linearGradient id="gengarBodyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4c1d95" />
                  <stop offset="60%" stopColor="#2e1065" />
                  <stop offset="100%" stopColor="#0f0728" />
                </linearGradient>
                <radialGradient id="gengarEyeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#dc2626" />
                </radialGradient>
              </defs>
              {/* Spiked shadow body outline */}
              <path
                d="M75 10 L88 30 L108 22 L112 40 L135 42 L125 65 L145 80 L125 95 L115 115 L75 120 L35 115 L25 95 L5 80 L25 65 L15 42 L38 40 L42 22 L62 30 Z"
                fill="url(#gengarBodyGrad)"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Glowing Sinister Red Eyes */}
              <polygon points="45,45 62,55 48,60" fill="url(#gengarEyeGlow)" className="drop-shadow-[0_0_12px_#ef4444]" />
              <polygon points="105,45 88,55 102,60" fill="url(#gengarEyeGlow)" className="drop-shadow-[0_0_12px_#ef4444]" />
              {/* Slit pupils */}
              <line x1="53" y1="48" x2="55" y2="58" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="97" y1="48" x2="95" y2="58" stroke="#ffffff" strokeWidth="1.5" />
              {/* Wide Wicked Fanged Grin */}
              <path
                d="M38 78 Q75 108 112 78 Q75 92 38 78 Z"
                fill="#f8fafc"
                stroke="#1e1b4b"
                strokeWidth="2"
              />
              {/* Tooth dividers */}
              <line x1="52" y1="81" x2="52" y2="87" stroke="#1e1b4b" strokeWidth="1.5" />
              <line x1="63" y1="83" x2="63" y2="91" stroke="#1e1b4b" strokeWidth="1.5" />
              <line x1="75" y1="84" x2="75" y2="93" stroke="#1e1b4b" strokeWidth="1.5" />
              <line x1="87" y1="83" x2="87" y2="91" stroke="#1e1b4b" strokeWidth="1.5" />
              <line x1="98" y1="81" x2="98" y2="87" stroke="#1e1b4b" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Left Claw Hand Reaching */}
          <div
            className="absolute left-2 flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaDarkMindShadowHandLeft 1.8s cubic-bezier(0.12, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="70" height="70" viewBox="0 0 70 70">
              <path
                d="M10 50 Q25 40 45 42 Q58 30 65 32 Q52 45 60 48 Q48 55 52 62 Q35 55 10 50 Z"
                fill="#2e1065"
                stroke="#a855f7"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Right Claw Hand Reaching */}
          <div
            className="absolute right-2 flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaDarkMindShadowHandRight 1.8s cubic-bezier(0.12, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="70" height="70" viewBox="0 0 70 70">
              <path
                d="M60 50 Q45 40 25 42 Q12 30 5 32 Q18 45 10 48 Q22 55 18 62 Q35 55 60 50 Z"
                fill="#2e1065"
                stroke="#a855f7"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Bench Psychic Distortion Pulse Rings */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaDarkMindPsychicPulse 1.8s ease-out forwards' }}
          >
            <div className="w-32 h-32 rounded-full border-2 border-purple-500/80 shadow-[0_0_25px_#9333ea]" />
          </div>

          {/* Drifting Ethereal Soul Motes */}
          {[
            { x: -35, y: -40, delay: '0.1s' },
            { x: 38, y: -30, delay: '0.2s' },
            { x: -25, y: 35, delay: '0.15s' },
            { x: 30, y: 40, delay: '0.25s' }
          ].map((mote, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc] pointer-events-none"
              style={{
                animation: `gbaDarkMindMote 1.8s ease-out ${mote.delay} forwards`,
                opacity: 0,
                '--dm-x': `${mote.x}px`,
                '--dm-y': `${mote.y}px`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* 20m. MUK SLUDGE DELUGE (Muk Lv. 34 — Thick Viscous Purple/Green Toxic Sludge Surge) */}
      {fx.type === 'muk_sludge_deluge' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Surging Bottom-Up Viscous Sludge Wave */}
          <div
            className="absolute bottom-0 w-full flex items-center justify-center pointer-events-none z-20"
            style={{ animation: 'gbaMukSludgeWave 1.75s cubic-bezier(0.12, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="180" height="150" viewBox="0 0 180 150">
              <defs>
                <linearGradient id="mukSludgeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7e22ce" />
                  <stop offset="40%" stopColor="#581c87" />
                  <stop offset="85%" stopColor="#3b0764" />
                  <stop offset="100%" stopColor="#1e1b4b" />
                </linearGradient>
              </defs>
              {/* Oozing, undulating toxic slime wave */}
              <path
                d="M 0 80 Q 20 50, 45 70 Q 70 40, 95 65 Q 120 45, 150 70 Q 170 55, 180 75 L 180 150 L 0 150 Z"
                fill="url(#mukSludgeGrad)"
                stroke="#c084fc"
                strokeWidth="3"
              />
              <path
                d="M 15 85 Q 45 60, 75 80 Q 105 55, 135 78 Q 165 65, 175 85"
                fill="none"
                stroke="#84cc16"
                strokeWidth="2"
                opacity="0.85"
              />
            </svg>
          </div>

          {/* Dripping Curtains of Corrosive Slime */}
          <div
            className="absolute top-2 w-full flex justify-center pointer-events-none z-25"
            style={{ animation: 'gbaMukSludgeDrips 1.75s ease-out forwards' }}
          >
            <svg width="160" height="70" viewBox="0 0 160 70">
              <path
                d="M10 0 L15 35 Q18 42, 22 35 L26 0 L40 0 L45 55 Q50 65, 55 55 L60 0 L85 0 L90 45 Q95 52, 100 45 L105 0 L125 0 L130 38 Q135 48, 140 38 L145 0 Z"
                fill="#581c87"
                stroke="#a855f7"
                strokeWidth="1.5"
                opacity="0.9"
              />
            </svg>
          </div>

          {/* Swelling Toxic Sludge Bubbles */}
          <div
            className="absolute left-6 bottom-10 z-30"
            style={{ animation: 'gbaMukSludgeBubble1 1.75s ease-out forwards' }}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-800 via-fuchsia-600 to-lime-400 border border-lime-300 shadow-[0_0_12px_#84cc16]" />
          </div>
          <div
            className="absolute right-8 bottom-14 z-30"
            style={{ animation: 'gbaMukSludgeBubble2 1.75s ease-out 0.1s forwards' }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-900 via-purple-600 to-pink-400 border border-purple-300 shadow-[0_0_14px_#c084fc]" />
          </div>

          {/* Sizzling Corrosive Acid Smoke */}
          <div
            className="absolute flex items-center justify-center z-15"
            style={{ animation: 'gbaMukAcidSizzle 1.75s ease-out forwards' }}
          >
            <div className="w-28 h-28 rounded-full bg-lime-500/25 blur-xl shadow-[0_0_35px_#84cc16]" />
          </div>
        </div>
      )}

      {/* 20n. MACHAMP KARATE CHOP (Machoke Lv. 40 / Machamp — High-Velocity Martial Arts Knife-Hand) */}
      {fx.type === 'machamp_karate_chop' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* High-Speed Diagonal Cutting Plane Beam */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-20"
            style={{ animation: 'gbaKarateChopSlashPlane 1.55s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
          >
            <div className="w-64 h-3 rounded-full bg-gradient-to-r from-transparent via-white to-amber-300 shadow-[0_0_25px_#f59e0b] border-y border-amber-200" />
          </div>

          {/* Machoke/Machamp Muscular Knife-Hand (Shuto-Uchi) */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaKarateChopHandBlade 1.55s cubic-bezier(0.15, 0.9, 0.25, 1) forwards' }}
          >
            <svg width="130" height="130" viewBox="0 0 130 130" className="drop-shadow-[0_0_24px_#f59e0b]">
              <defs>
                <linearGradient id="machampChopGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="40%" stopColor="#64748b" />
                  <stop offset="85%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
              </defs>
              {/* Muscular wrist and rigid knife-hand blade */}
              <path
                d="M20 95 L45 80 L55 55 L75 25 Q82 18, 90 22 L115 50 Q120 58, 112 68 L85 92 L55 110 L25 105 Z"
                fill="url(#machampChopGrad)"
                stroke="#f8fafc"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Extended blade fingers */}
              <path d="M75 25 L95 48" stroke="#94a3b8" strokeWidth="2" />
              <path d="M85 30 L102 54" stroke="#94a3b8" strokeWidth="2" />
              {/* Taut thumb folded against palm */}
              <path d="M55 55 Q68 50, 72 65 Q62 70, 52 65 Z" fill="#475569" stroke="#f8fafc" strokeWidth="1.5" />
              {/* Impact kinetic edge highlight */}
              <path d="M75 25 Q82 18, 90 22 L115 50 Q120 58, 112 68" stroke="#fde047" strokeWidth="3" fill="none" className="drop-shadow-[0_0_8px_#fde047]" />
            </svg>
          </div>

          {/* Radial Impact Shockwave */}
          <div
            className="absolute flex items-center justify-center z-15"
            style={{ animation: 'gbaKarateChopShockwave 1.55s ease-out forwards' }}
          >
            <div className="w-28 h-28 rounded-full border-4 border-amber-300 shadow-[0_0_24px_#f59e0b]" />
          </div>

          {/* Martial Arts Focus Speed Lines */}
          <div
            className="absolute flex items-center justify-center z-10"
            style={{ animation: 'gbaKarateChopFocusLines 1.55s ease-out forwards' }}
          >
            <svg width="170" height="170" viewBox="0 0 170 170">
              <line x1="10" y1="10" x2="60" y2="60" stroke="#fde047" strokeWidth="2" strokeDasharray="6,4" />
              <line x1="160" y1="10" x2="110" y2="60" stroke="#fde047" strokeWidth="2" strokeDasharray="6,4" />
              <line x1="10" y1="160" x2="60" y2="110" stroke="#fde047" strokeWidth="2" strokeDasharray="6,4" />
              <line x1="160" y1="160" x2="110" y2="110" stroke="#fde047" strokeWidth="2" strokeDasharray="6,4" />
            </svg>
          </div>
        </div>
      )}

      {/* 20o. HAUNTER DREAM EATER (Haunter Lv. 22 — Ethereal Slumber Essence Extraction & Phantom Devour) */}
      {fx.type === 'haunter_dream_eater' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Haunter's Floating Ethereal Phantom Maw */}
          <div
            className="absolute top-2 flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaDreamEaterHaunterMaw 1.8s cubic-bezier(0.12, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="130" height="90" viewBox="0 0 130 90" className="drop-shadow-[0_0_25px_#9333ea]">
              <defs>
                <linearGradient id="haunterMawGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6b21a8" />
                  <stop offset="60%" stopColor="#3b0764" />
                  <stop offset="100%" stopColor="#1e1b4b" />
                </linearGradient>
              </defs>
              {/* Haunter triangular spiked face with gaping mouth */}
              <path
                d="M65 5 L85 22 L115 15 L105 38 L125 50 L95 62 L65 85 L35 62 L5 50 L25 38 L15 15 L45 22 Z"
                fill="url(#haunterMawGrad)"
                stroke="#c084fc"
                strokeWidth="2"
              />
              {/* Triangular glowing spectral eyes */}
              <polygon points="45,28 58,35 48,42" fill="#ffffff" className="drop-shadow-[0_0_8px_#ffffff]" />
              <polygon points="85,28 72,35 82,42" fill="#ffffff" className="drop-shadow-[0_0_8px_#ffffff]" />
              {/* Giant unhinged devour maw */}
              <ellipse cx="65" cy="55" rx="28" ry="14" fill="#0f0728" stroke="#f43f5e" strokeWidth="2" />
              {/* Sharp phantom fangs */}
              <polygon points="50,44 54,52 58,44" fill="#ffffff" />
              <polygon points="72,44 76,52 80,44" fill="#ffffff" />
              <polygon points="55,66 59,58 63,66" fill="#ffffff" />
              <polygon points="67,66 71,58 75,66" fill="#ffffff" />
            </svg>
          </div>

          {/* Siphoning Soul Energy Funnel */}
          <div
            className="absolute flex items-center justify-center z-20"
            style={{ animation: 'gbaDreamEaterSoulSiphon 1.8s ease-out forwards' }}
          >
            <svg width="100" height="140" viewBox="0 0 100 140">
              <path d="M20 120 Q35 70, 50 30 Q65 70, 80 120" fill="none" stroke="#e879f9" strokeWidth="3" strokeDasharray="8,4" opacity="0.85" />
              <path d="M35 125 Q45 80, 50 30 Q55 80, 65 125" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="6,3" opacity="0.8" />
            </svg>
          </div>

          {/* Shimmering Dream Essence Orbs Rising */}
          <div
            className="absolute bottom-10 flex items-center justify-center z-25"
            style={{ animation: 'gbaDreamEaterEssenceOrb 1.8s cubic-bezier(0.1, 0.8, 0.25, 1) forwards' }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 via-purple-300 to-cyan-200 border-2 border-white shadow-[0_0_20px_#f472b6] flex items-center justify-center">
              <span className="text-xs text-indigo-900 font-bold select-none">✦</span>
            </div>
          </div>

          {/* Healing Life Essence Sparks */}
          {[
            { x: -30, y: -25, delay: '0.2s' },
            { x: 32, y: -20, delay: '0.3s' },
            { x: -20, y: 20, delay: '0.25s' },
            { x: 25, y: 25, delay: '0.35s' }
          ].map((sp, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full bg-cyan-200 shadow-[0_0_8px_#38bdf8] pointer-events-none"
              style={{
                animation: `gbaDreamEaterHealSpark 1.8s ease-out ${sp.delay} forwards`,
                opacity: 0,
                '--de-x': `${sp.x}px`,
                '--de-y': `${sp.y}px`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* 20p. HYPNO HYPNOTIC PENDULUM (Hypno Lv. 36 — Oscillating Harmonic Trance Arc & Psychedelic Rings) */}
      {fx.type === 'hypno_hypnotic_pendulum' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Swinging Golden Pendulum from Top */}
          <div
            className="absolute top-0 origin-top flex flex-col items-center pointer-events-none z-30"
            style={{ animation: 'gbaHypnoPendulumSwing 1.7s ease-in-out forwards' }}
          >
            {/* Fine Silver Chain */}
            <div className="w-0.5 h-24 bg-gradient-to-b from-slate-300 via-amber-200 to-amber-400 shadow-[0_0_4px_#fde047]" />
            {/* Heavy Golden Bob with Concentric Trance Rings */}
            <svg width="46" height="46" viewBox="0 0 46 46" className="drop-shadow-[0_0_18px_#f59e0b]">
              <defs>
                <radialGradient id="hypnoGoldGrad" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#fde047" />
                  <stop offset="70%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#854d0e" />
                </radialGradient>
              </defs>
              <circle cx="23" cy="23" r="20" fill="url(#hypnoGoldGrad)" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="23" cy="23" r="13" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
              <circle cx="23" cy="23" r="6" fill="#ca8a04" />
            </svg>
          </div>

          {/* Expanding Psychedelic Trance Rings */}
          <div
            className="absolute flex items-center justify-center z-20"
            style={{ animation: 'gbaHypnoTranceRing 1.7s ease-out 0.2s forwards', opacity: 0 }}
          >
            <div className="w-28 h-28 rounded-full border-2 border-fuchsia-400/80 shadow-[0_0_20px_#c084fc]" />
          </div>
          <div
            className="absolute flex items-center justify-center z-20"
            style={{ animation: 'gbaHypnoTranceRing 1.7s ease-out 0.4s forwards', opacity: 0 }}
          >
            <div className="w-36 h-36 rounded-full border border-cyan-400/70 shadow-[0_0_20px_#38bdf8]" />
          </div>

          {/* Floating Dream Motes & Sleep Stars */}
          {[
            { x: -32, y: -28, delay: '0.1s' },
            { x: 30, y: -22, delay: '0.2s' },
            { x: -25, y: 32, delay: '0.3s' },
            { x: 28, y: 30, delay: '0.25s' }
          ].map((mote, i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                animation: `gbaHypnoSleepMote 1.7s ease-out ${mote.delay} forwards`,
                opacity: 0,
                '--hp-x': `${mote.x}px`,
                '--hp-y': `${mote.y}px`
              } as React.CSSProperties}
            >
              <span className="text-amber-300 drop-shadow-[0_0_8px_#fde047] text-lg select-none">✦</span>
            </div>
          ))}
        </div>
      )}

      {/* 20q. WEEZING TOXIC SMOG (Weezing Lv. 27 — Dual-Chimney Volcanic Bilious Smog Plumes) */}
      {fx.type === 'weezing_toxic_smog' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Left Smog Plume Eruption (Yellowish-Green Sulfur) */}
          <div
            className="absolute left-4 flex items-center justify-center pointer-events-none z-25"
            style={{ animation: 'gbaWeezingSmogEruptLeft 1.7s cubic-bezier(0.12, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-[0_0_25px_#84cc16]">
              <circle cx="50" cy="70" r="32" fill="#65a30d" opacity="0.75" />
              <circle cx="70" cy="50" r="28" fill="#a3e635" opacity="0.85" />
              <circle cx="40" cy="40" r="25" fill="#facc15" opacity="0.65" />
            </svg>
          </div>

          {/* Right Smog Plume Eruption (Deep Purple Noxious Haze) */}
          <div
            className="absolute right-4 flex items-center justify-center pointer-events-none z-25"
            style={{ animation: 'gbaWeezingSmogEruptRight 1.7s cubic-bezier(0.12, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-[0_0_25px_#9333ea]">
              <circle cx="70" cy="70" r="32" fill="#581c87" opacity="0.75" />
              <circle cx="50" cy="50" r="28" fill="#9333ea" opacity="0.85" />
              <circle cx="80" cy="40" r="25" fill="#c084fc" opacity="0.65" />
            </svg>
          </div>

          {/* Swirling Smothering Toxic Cloud Blanket */}
          <div
            className="absolute flex items-center justify-center z-20"
            style={{ animation: 'gbaWeezingNoxiousCloud 1.7s ease-out forwards' }}
          >
            <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-purple-900/60 via-lime-900/50 to-purple-800/60 blur-xl shadow-[0_0_40px_#7e22ce]" />
          </div>
        </div>
      )}

      {/* 20r. GOLEM AVALANCHE (Golem Lv. 36 — 60 DMG Bedrock Tremor, Mountain Slabs & Cascading Boulders) */}
      {fx.type === 'golem_avalanche' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible"
             style={{ animation: 'gbaGolemQuakeTremor 0.8s ease-in-out infinite' }}>
          {/* Boulder 1 Falling Left */}
          <div
            className="absolute left-6 flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaGolemRockFall1 1.8s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
          >
            <svg width="55" height="55" viewBox="0 0 55 55" className="drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]">
              <polygon points="10,25 25,8 45,15 50,38 35,50 15,45" fill="#78716c" stroke="#d6d3d1" strokeWidth="1.5" />
              <line x1="25" y1="8" x2="35" y2="50" stroke="#44403c" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Boulder 2 Falling Right */}
          <div
            className="absolute right-6 flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaGolemRockFall2 1.8s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60" className="drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)]">
              <polygon points="12,20 28,5 52,18 48,45 22,55 8,38" fill="#a8a29e" stroke="#f5f5f4" strokeWidth="1.5" />
              <line x1="28" y1="5" x2="22" y2="55" stroke="#57534e" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Heavy Granite Center Slab Impact */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-35"
            style={{ animation: 'gbaGolemRockFall3 1.8s cubic-bezier(0.15, 0.9, 0.25, 1) forwards' }}
          >
            <svg width="75" height="75" viewBox="0 0 75 75" className="drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]">
              <polygon points="18,12 55,8 70,38 52,68 15,62 5,35" fill="#57534e" stroke="#e7e5e4" strokeWidth="2" />
              <line x1="18" y1="12" x2="52" y2="68" stroke="#292524" strokeWidth="2" />
              <line x1="55" y1="8" x2="15" y2="62" stroke="#292524" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Billowing Dust Puffs at Base */}
          <div
            className="absolute bottom-2 flex items-center justify-center z-20"
            style={{ animation: 'gbaGolemDustPuff 1.8s ease-out forwards' }}
          >
            <div className="w-40 h-16 rounded-full bg-stone-500/50 blur-lg shadow-[0_0_25px_#78716c]" />
          </div>
        </div>
      )}

      {/* 20s. WIGGLYTUFF DO THE WAVE (Wigglytuff Lv. 36 — Stadium Rhythm Pulse & Multi-Bench Harmonic Shockwave) */}
      {fx.type === 'wigglytuff_do_the_wave' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Harmonic Stadium Rhythm Pulse Core */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaDoTheWaveRhythm 1.75s cubic-bezier(0.12, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150" className="drop-shadow-[0_0_30px_#f472b6]">
              <defs>
                <radialGradient id="wigglyWaveGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#fbcfe8" />
                  <stop offset="70%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#db2777" />
                </radialGradient>
              </defs>
              <circle cx="75" cy="75" r="48" fill="url(#wigglyWaveGrad)" stroke="#f43f5e" strokeWidth="2.5" />
              <circle cx="75" cy="75" r="32" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.8" />
              <circle cx="75" cy="75" r="16" fill="#ffffff" />
            </svg>
          </div>

          {/* Floating Staccato Musical Eighth Notes & Clefs */}
          {[
            { x: -35, y: -25, delay: '0.1s' },
            { x: 38, y: -20, delay: '0.2s' },
            { x: -25, y: 35, delay: '0.15s' },
            { x: 30, y: 30, delay: '0.25s' }
          ].map((nt, i) => (
            <div
              key={i}
              className="absolute pointer-events-none z-35"
              style={{
                animation: `gbaDoTheWaveNotes 1.75s ease-out ${nt.delay} forwards`,
                transform: `translate(${nt.x}px, ${nt.y}px)`,
                opacity: 0
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" className="drop-shadow-[0_0_10px_#ec4899]">
                <ellipse cx="10" cy="22" rx="6" ry="4" fill="#f43f5e" transform="rotate(-20 10 22)" />
                <rect x="14" y="8" width="3" height="15" fill="#f43f5e" />
                <path d="M14 8 Q22 6, 22 14" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          ))}

          {/* Expanding Multi-Bench Harmonic Shockwave Curtain */}
          <div
            className="absolute flex items-center justify-center z-20"
            style={{ animation: 'gbaDoTheWaveCrowdSurge 1.75s ease-out forwards' }}
          >
            <div className="w-56 h-16 rounded-full border-4 border-pink-400 shadow-[0_0_28px_#ec4899]" />
          </div>
        </div>
      )}

      {/* 20t. VILEPLUME PETAL DANCE (Vileplume Lv. 35 — Razor Petal Vortex Cyclone & Multi-Blade Slashes) */}
      {fx.type === 'vileplume_petal_dance' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Swirling Red/Pink Petal Cyclone Vortex */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-25"
            style={{ animation: 'gbaPetalDanceVortex 1.7s linear forwards' }}
          >
            <svg width="170" height="170" viewBox="0 0 170 170">
              <defs>
                <linearGradient id="vilePetalGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fda4af" />
                  <stop offset="45%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#be123c" />
                </linearGradient>
              </defs>
              {/* Ring of 6 swirling razor flower petals */}
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <g key={i} transform={`rotate(${deg} 85 85)`}>
                  <path
                    d="M85 20 C95 40, 105 60, 85 75 C65 60, 75 40, 85 20 Z"
                    fill="url(#vilePetalGrad)"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="drop-shadow-[0_0_12px_#f43f5e]"
                  />
                  <circle cx="85" cy="50" r="3" fill="#ffffff" opacity="0.9" />
                </g>
              ))}
            </svg>
          </div>

          {/* Diagonal Cross-Slash Blade 1 */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaPetalDanceBlade1 1.7s ease-out forwards' }}
          >
            <svg width="140" height="50" viewBox="0 0 140 50">
              <path d="M10 25 Q 70 5, 130 25 Q 70 35, 10 25 Z" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" className="drop-shadow-[0_0_18px_#e11d48]" />
            </svg>
          </div>

          {/* Diagonal Cross-Slash Blade 2 */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaPetalDanceBlade2 1.7s ease-out forwards' }}
          >
            <svg width="140" height="50" viewBox="0 0 140 50">
              <path d="M10 25 Q 70 45, 130 25 Q 70 15, 10 25 Z" fill="#e11d48" stroke="#ffffff" strokeWidth="2" className="drop-shadow-[0_0_18px_#be123c]" />
            </svg>
          </div>
        </div>
      )}

      {/* 20u. POLIWRATH WHIRLPOOL (Poliwrath Lv. 48 — Deep Oceanic Energy-Stripping Vortex Maelstrom) */}
      {fx.type === 'poliwrath_whirlpool_vortex' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Deep Cyan/Navy Oceanic Maelstrom */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-25"
            style={{ animation: 'gbaWhirlpoolDeepVortex 1.8s cubic-bezier(0.12, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="170" height="170" viewBox="0 0 170 170" className="drop-shadow-[0_0_35px_#0284c7]">
              <defs>
                <linearGradient id="poliWhirlpoolGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="35%" stopColor="#38bdf8" />
                  <stop offset="70%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
              <path
                d="M85 15 C130 15, 160 50, 155 95 C150 140, 115 160, 75 155 C35 150, 15 115, 20 75 C25 40, 55 25, 85 35 C110 45, 130 70, 120 100 C110 130, 85 135, 65 125 C45 115, 50 90, 70 80 C90 70, 100 85, 95 95 C90 105, 80 100, 85 90"
                fill="none"
                stroke="url(#poliWhirlpoolGrad)"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Inward Collapsing Suction Core */}
          <div
            className="absolute flex items-center justify-center z-30"
            style={{ animation: 'gbaWhirlpoolSuctionCore 1.8s ease-out forwards' }}
          >
            <div className="w-16 h-16 rounded-full bg-cyan-200 border-2 border-white shadow-[0_0_24px_#38bdf8]" />
          </div>
        </div>
      )}

      {/* 20v. DEWGONG AURORA BEAM (Dewgong Lv. 42 — Undulating Glacial Aurora Curtains & Sub-Zero Laser) */}
      {fx.type === 'dewgong_aurora_beam' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Undulating Polar Aurora Borealis Curtains */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              animation: 'gbaAuroraCurtain 1.7s ease-in-out forwards',
              background: 'linear-gradient(135deg, rgba(52,211,153,0.35) 0%, rgba(56,189,248,0.4) 45%, rgba(168,85,247,0.35) 100%)'
            }}
          />

          {/* Focused Glacial Laser Beam */}
          <div
            className="absolute flex items-center justify-center z-30"
            style={{ animation: 'gbaAuroraGlacialLaser 1.7s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
          >
            <svg width="190" height="40" viewBox="0 0 190 40">
              <defs>
                <linearGradient id="auroraBeamGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="45%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
              <rect x="0" y="10" width="190" height="20" rx="10" fill="url(#auroraBeamGrad)" className="drop-shadow-[0_0_24px_#38bdf8]" />
              <rect x="10" y="14" width="170" height="12" rx="6" fill="#ffffff" opacity="0.95" />
            </svg>
          </div>

          {/* Sub-Zero Frost Needles & Star Ice Sparks */}
          <div
            className="absolute flex items-center justify-center z-35"
            style={{ animation: 'gbaAuroraFrostSparks 1.7s ease-out forwards' }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120">
              <polygon points="60,10 65,50 105,60 65,70 60,110 55,70 15,60 55,50" fill="#a5f3fc" stroke="#ffffff" strokeWidth="1.5" className="drop-shadow-[0_0_15px_#38bdf8]" />
              <circle cx="60" cy="60" r="12" fill="#ffffff" />
            </svg>
          </div>
        </div>
      )}

      {/* 20w. KABUTOPS SHARP SICKLE & ABSORB (Kabutops Lv. 30 — Prehistoric X-Scissor Sickle Cleave) */}
      {fx.type === 'kabutops_sickle_slash' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Left Scythe Blade */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaKabutopsScytheLeft 1.6s cubic-bezier(0.12, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="130" height="130" viewBox="0 0 130 130" className="drop-shadow-[0_0_24px_#f59e0b]">
              <defs>
                <linearGradient id="kabutopsSickleGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fef3c7" />
                  <stop offset="40%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
              </defs>
              <path
                d="M20 20 C50 15, 95 30, 115 70 C105 60, 75 45, 45 45 L20 20 Z"
                fill="url(#kabutopsSickleGrad)"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <path d="M20 20 C50 15, 95 30, 115 70" stroke="#fde047" strokeWidth="3" fill="none" />
            </svg>
          </div>

          {/* Right Scythe Blade */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaKabutopsScytheRight 1.6s cubic-bezier(0.12, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="130" height="130" viewBox="0 0 130 130" className="drop-shadow-[0_0_24px_#f59e0b]">
              <path
                d="M110 20 C80 15, 35 30, 15 70 C25 60, 55 45, 85 45 L110 20 Z"
                fill="url(#kabutopsSickleGrad)"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <path d="M110 20 C80 15, 35 30, 15 70" stroke="#fde047" strokeWidth="3" fill="none" />
            </svg>
          </div>

          {/* Bio-Absorb Vitality Sparks */}
          <div
            className="absolute flex items-center justify-center z-25"
            style={{ animation: 'gbaKabutopsBioSiphon 1.6s ease-out forwards' }}
          >
            <div className="w-24 h-24 rounded-full border-2 border-lime-400 shadow-[0_0_20px_#84cc16]" />
          </div>
        </div>
      )}

      {/* 20x. MAROWAK BONEMERANG (Marowak Lv. 26 — Dual-Pass 3D Spinning Bone Trajectory) */}
      {fx.type === 'marowak_bonemerang' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Spinning Ivory Bone Club */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaBonemerangFlight 1.8s cubic-bezier(0.15, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="100" height="40" viewBox="0 0 100 40" className="drop-shadow-[0_0_18px_rgba(255,255,255,0.9)]">
              <defs>
                <linearGradient id="marowakBoneGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>
              <rect x="20" y="14" width="60" height="12" rx="4" fill="url(#marowakBoneGrad)" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="18" cy="14" r="8" fill="url(#marowakBoneGrad)" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="18" cy="26" r="8" fill="url(#marowakBoneGrad)" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="82" cy="14" r="8" fill="url(#marowakBoneGrad)" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="82" cy="26" r="8" fill="url(#marowakBoneGrad)" stroke="#64748b" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Dual Impact Flashes */}
          <div
            className="absolute flex items-center justify-center z-35"
            style={{ animation: 'gbaBonemerangImpactBurst 1.8s ease-out forwards' }}
          >
            <div className="w-28 h-28 rounded-full border-4 border-amber-400 shadow-[0_0_24px_#f59e0b]" />
          </div>
        </div>
      )}

      {/* 20y. NIDOKING THRASH (Nidoking Lv. 48 — Berserk Rampage Tremor & Triple Savage Claws) */}
      {fx.type === 'nidoking_thrash_fury' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible"
             style={{ animation: 'gbaNidokingRampageShake 0.75s ease-in-out infinite' }}>
          {/* Savage Purple Claw Swipe 1 */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaNidokingClawSwipe1 1.75s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
          >
            <svg width="160" height="80" viewBox="0 0 160 80">
              <path d="M10 20 L150 20" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" className="drop-shadow-[0_0_16px_#9333ea]" />
              <path d="M25 40 L160 40" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" className="drop-shadow-[0_0_20px_#c084fc]" />
              <path d="M10 60 L145 60" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" className="drop-shadow-[0_0_16px_#9333ea]" />
            </svg>
          </div>

          {/* Reverse Savage Claw Swipe 2 */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaNidokingClawSwipe2 1.75s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
          >
            <svg width="160" height="80" viewBox="0 0 160 80">
              <path d="M150 20 L10 20" stroke="#7e22ce" strokeWidth="5" strokeLinecap="round" className="drop-shadow-[0_0_16px_#9333ea]" />
              <path d="M160 40 L25 40" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" className="drop-shadow-[0_0_20px_#f43f5e]" />
              <path d="M145 60 L10 60" stroke="#7e22ce" strokeWidth="5" strokeLinecap="round" className="drop-shadow-[0_0_16px_#9333ea]" />
            </svg>
          </div>
        </div>
      )}

      {/* 20z. KINGLER CRABHAMMER (Kingler Lv. 27 — 40 DMG Massive Hydraulic Crustacean Pincer Slam) */}
      {(fx.type === 'kingler_crabhammer' || fx.type === 'crab_hammer_slam') && (() => {
        const wi = Math.max(1, fx.intensity ?? 1);
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
            {/* Gigantic Hypertrophied Crustacean Pincer Claw (<= 60% Card Width) */}
            <div
              className="absolute flex items-center justify-center pointer-events-none z-30"
              style={{ animation: 'gbaCrabhammerPincerCock 1.65s cubic-bezier(0.12, 0.85, 0.25, 1) forwards' }}
            >
              <img
                src="/assets/Kingler_Crabhammer_Claw.png"
                alt="Kingler Crabhammer"
                className="max-w-[76px] max-h-[88px] object-contain drop-shadow-[0_0_20px_#ea580c] drop-shadow-[0_0_28px_rgba(2,132,199,0.7)]"
              />
            </div>

            {/* Vertical Seawater Geyser Eruption */}
            <div
              className="absolute flex items-center justify-center z-25"
              style={{ animation: 'gbaCrabhammerGeyserSplash 1.65s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
            >
              <svg width={Math.round(120 * wi)} height={Math.round(140 * wi)} viewBox="0 0 140 160">
                <path d="M30 160 Q70 10, 110 160 Z" fill="#38bdf8" opacity="0.85" className="drop-shadow-[0_0_20px_#0284c7]" />
                <path d="M50 160 Q70 30, 90 160 Z" fill="#ffffff" opacity="0.9" />
              </svg>
            </div>
          </div>
        );
      })()}

      {/* 20aa. PRIMEAPE TANTRUM (Primeape Lv. 35 — Uncontrollable Furious Rage Flurry & Steam Vents) */}
      {fx.type === 'primeape_tantrum_rampage' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Throbbing Crimson Rage Cross Marks */}
          <div
            className="absolute -top-8 right-6 z-35"
            style={{ animation: 'gbaPrimeapeRageVein 1.7s ease-out forwards' }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40">
              <path d="M12 8 C16 16, 16 24, 12 32 M28 8 C24 16, 24 24, 28 32 M8 12 C16 16, 24 16, 32 12 M8 28 C16 24, 24 24, 32 28" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" fill="none" className="drop-shadow-[0_0_12px_#ef4444]" />
            </svg>
          </div>

          {/* High-Speed Barrage of Boxing Fists */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaPrimeapeFrenzyPunches 1.7s ease-out forwards' }}
          >
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="45" cy="45" r="22" fill="#d97706" stroke="#ffffff" strokeWidth="2" className="drop-shadow-[0_0_16px_#ef4444]" />
              <circle cx="95" cy="55" r="20" fill="#ea580c" stroke="#ffffff" strokeWidth="2" className="drop-shadow-[0_0_16px_#f97316]" />
              <circle cx="55" cy="95" r="24" fill="#ef4444" stroke="#ffffff" strokeWidth="2" className="drop-shadow-[0_0_20px_#dc2626]" />
              <circle cx="95" cy="95" r="21" fill="#d97706" stroke="#ffffff" strokeWidth="2" className="drop-shadow-[0_0_16px_#ef4444]" />
            </svg>
          </div>
        </div>
      )}

      {/* 20ab. RHYDON HORN DRILL (Rhydon / Nidorino — 50 DMG High-Torque Spiral Impalement Bore) */}
      {fx.type === 'rhydon_horn_drill' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Massive Spinning Diamond-Tipped Drill Horn */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaHornDrillBore 1.65s cubic-bezier(0.15, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="140" height="70" viewBox="0 0 140 70" className="drop-shadow-[0_0_28px_#f59e0b]">
              <defs>
                <linearGradient id="rhydonHornGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#64748b" />
                  <stop offset="40%" stopColor="#e2e8f0" />
                  <stop offset="85%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
              <polygon points="10,15 130,35 10,55" fill="url(#rhydonHornGrad)" stroke="#475569" strokeWidth="2" />
              {/* Spiral drill threading grooves */}
              <path d="M30 18 Q50 35, 30 52" fill="none" stroke="#334155" strokeWidth="2.5" />
              <path d="M60 23 Q80 35, 60 47" fill="none" stroke="#334155" strokeWidth="2.5" />
              <path d="M90 28 Q105 35, 90 42" fill="none" stroke="#334155" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Friction Spark Shower at Impact Point */}
          <div
            className="absolute right-4 flex items-center justify-center z-35"
            style={{ animation: 'gbaHornDrillSparks 1.65s ease-out forwards' }}
          >
            <div className="w-24 h-24 rounded-full border-4 border-amber-300 shadow-[0_0_25px_#ea580c]" />
          </div>
        </div>
      )}

      {/* 20ac. EXEGGUATOR BIG EGGSPLOSION (Exeggutor Lv. 35 — Multi-Coconut Aerial Bombardment Barrage) */}
      {fx.type === 'exeggutor_big_eggsplosion' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Falling Coconut Bomb 1 */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaEggsplosionBombDrop1 1.85s ease-in-out forwards' }}
          >
            <svg width="50" height="60" viewBox="0 0 50 60" className="drop-shadow-[0_0_20px_#facc15]">
              <ellipse cx="25" cy="30" rx="22" ry="26" fill="#78350f" stroke="#fde047" strokeWidth="2" />
              <circle cx="18" cy="24" r="3" fill="#451a03" />
              <circle cx="32" cy="24" r="3" fill="#451a03" />
              <circle cx="25" cy="35" r="3.5" fill="#451a03" />
            </svg>
          </div>

          {/* Falling Coconut Bomb 2 */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaEggsplosionBombDrop2 1.85s ease-in-out forwards' }}
          >
            <svg width="50" height="60" viewBox="0 0 50 60" className="drop-shadow-[0_0_20px_#eab308]">
              <ellipse cx="25" cy="30" rx="22" ry="26" fill="#854d0e" stroke="#fde047" strokeWidth="2" />
              <circle cx="18" cy="24" r="3" fill="#451a03" />
              <circle cx="32" cy="24" r="3" fill="#451a03" />
              <circle cx="25" cy="35" r="3.5" fill="#451a03" />
            </svg>
          </div>

          {/* Falling Coconut Bomb 3 */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaEggsplosionBombDrop3 1.85s ease-in-out forwards' }}
          >
            <svg width="55" height="65" viewBox="0 0 55 65" className="drop-shadow-[0_0_25px_#f59e0b]">
              <ellipse cx="27" cy="32" rx="24" ry="28" fill="#713f12" stroke="#fef08a" strokeWidth="2.5" />
              <circle cx="20" cy="26" r="3.5" fill="#451a03" />
              <circle cx="34" cy="26" r="3.5" fill="#451a03" />
              <circle cx="27" cy="38" r="4" fill="#451a03" />
            </svg>
          </div>
        </div>
      )}

      {/* 20ad. BUTTERFREE MEGA DRAIN (Butterfree Lv. 37 — Lepidopteran Wing Scale Fog & Bio-Vitality Siphon) */}
      {fx.type === 'butterfree_mega_drain' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Luminous Bio-Pollen Scale Mist */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              animation: 'gbaMegaDrainPollenFog 1.7s ease-in-out forwards',
              background: 'radial-gradient(circle, rgba(163,230,53,0.35) 0%, rgba(34,197,94,0.4) 50%, rgba(13,148,136,0.3) 100%)'
            }}
          />

          {/* Siphoning Bio-Vitality Tendril Stream */}
          <div
            className="absolute flex items-center justify-center z-30"
            style={{ animation: 'gbaMegaDrainVitalitySiphon 1.7s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
          >
            <svg width="120" height="150" viewBox="0 0 120 150">
              <path d="M30 130 Q60 70, 60 10 Q60 70, 90 130" fill="none" stroke="#facc15" strokeWidth="3" strokeDasharray="6,4" className="drop-shadow-[0_0_16px_#facc15]" />
              <circle cx="60" cy="15" r="8" fill="#ffffff" className="drop-shadow-[0_0_12px_#38bdf8]" />
            </svg>
          </div>
        </div>
      )}

      {/* 20ae. NINETALES FIRE BLAST (Ninetales Lv. 32 — Daimonji Kanji Star Flame) */}
      {fx.type === 'ninetales_fire_blast' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Scorched Earth Rune Floor */}
          <div
            className="absolute w-36 h-36 rounded-full flex items-center justify-center pointer-events-none z-10"
            style={{ animation: 'gbaFireBlastScorchRune 1.8s ease-out forwards' }}
          >
            <div className="w-full h-full rounded-full border border-orange-500/40 bg-radial from-orange-600/30 via-red-600/20 to-transparent blur-xs" />
          </div>

          {/* Incandescent Daimonji '大' Kanji Flame Crest */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaFireBlastDaimonjiKanji 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150" className="drop-shadow-[0_0_30px_#ea580c]">
              <defs>
                <linearGradient id="ninetalesDaimonjiGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="25%" stopColor="#fef08a" />
                  <stop offset="60%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <filter id="daimonjiGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Horizontal Bar */}
              <path d="M 25 55 Q 75 50 125 55" stroke="url(#ninetalesDaimonjiGrad)" strokeWidth="16" strokeLinecap="round" filter="url(#daimonjiGlow)" />
              {/* Vertical Spine */}
              <path d="M 75 15 L 75 80" stroke="url(#ninetalesDaimonjiGrad)" strokeWidth="16" strokeLinecap="round" filter="url(#daimonjiGlow)" />
              {/* Sweeping Left Leg */}
              <path d="M 75 60 Q 55 95 25 135" stroke="url(#ninetalesDaimonjiGrad)" strokeWidth="16" strokeLinecap="round" filter="url(#daimonjiGlow)" />
              {/* Sweeping Right Leg */}
              <path d="M 75 60 Q 95 95 125 135" stroke="url(#ninetalesDaimonjiGrad)" strokeWidth="16" strokeLinecap="round" filter="url(#daimonjiGlow)" />
              {/* Inner White-Hot Flame Core */}
              <path d="M 35 55 L 115 55" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
              <path d="M 75 25 L 75 75" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
              <path d="M 75 60 Q 60 90 35 125" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
              <path d="M 75 60 Q 90 90 115 125" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
              {/* Nexus Blast Core */}
              <circle cx="75" cy="58" r="16" fill="#ffffff" className="drop-shadow-[0_0_20px_#facc15]" />
            </svg>
          </div>

          {/* Expanding Flame Shockwave Ring */}
          <div
            className="absolute w-28 h-28 rounded-full border-orange-400 pointer-events-none z-20"
            style={{ animation: 'gbaFireBlastKanjiShockwave 1.8s ease-out forwards' }}
          />

          {/* Radiating Volcanic Ember Spark Shower */}
          {[
            { x: '-38px', y: '-35px' }, { x: '38px', y: '-35px' },
            { x: '-48px', y: '25px' }, { x: '48px', y: '25px' },
            { x: '0px', y: '-48px' }, { x: '0px', y: '48px' },
            { x: '-42px', y: '-8px' }, { x: '42px', y: '-8px' }
          ].map((p, i) => (
            <div
              key={`fb-ember-${i}`}
              className="absolute pointer-events-none z-30"
              style={{
                '--eb-x': p.x,
                '--eb-y': p.y,
                animation: `gbaFireBlastEmberShower 1.8s ease-out ${0.2 + i * 0.05}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <svg width="12" height="12" viewBox="0 0 12 12">
                <polygon points="6,0 7.5,4.5 12,6 7.5,7.5 6,12 4.5,7.5 0,6 4.5,4.5" fill={i % 2 === 0 ? '#fef08a' : '#f97316'} />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 20af. HYPER BEAM ANNIHILATION (Dragonair Lv. 33 / Golduck Lv. 27 — High-Density Ion Mega Laser) */}
      {fx.type === 'hyper_beam_annihilation' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Blinding Screen Glare Flash */}
          <div
            className="absolute inset-0 bg-white/60 pointer-events-none z-20 rounded-xl"
            style={{ animation: 'gbaHyperBeamScreenGlare 1.95s ease-in-out forwards' }}
          />

          {/* Converging Particle Accelerator Charge Orb */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaHyperBeamChargeCore 1.95s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' }}
          >
            <div className="w-24 h-24 rounded-full bg-radial from-white via-cyan-300 to-transparent flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-cyan-100 border-2 border-white shadow-[0_0_25px_#38bdf8]" />
            </div>
          </div>

          {/* Colossal 64px Thick High-Density Mega Laser Beam */}
          <div
            className="absolute w-[240px] h-16 flex items-center justify-center pointer-events-none z-35"
            style={{ animation: 'gbaHyperBeamMegaBlast 1.95s cubic-bezier(0.12, 0.9, 0.25, 1) forwards' }}
          >
            <svg width="240" height="64" viewBox="0 0 240 64">
              <defs>
                <linearGradient id="hyperBeamBeamGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="30%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="70%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {/* Outer Plasma Corona */}
              <rect x="0" y="8" width="240" height="48" rx="24" fill="url(#hyperBeamBeamGrad)" opacity="0.4" className="drop-shadow-[0_0_20px_#38bdf8]" />
              {/* Main Particle Core */}
              <rect x="10" y="16" width="220" height="32" rx="16" fill="#38bdf8" opacity="0.85" />
              {/* White-Hot Disintegration Spine */}
              <rect x="20" y="24" width="200" height="16" rx="8" fill="#ffffff" className="drop-shadow-[0_0_15px_#ffffff]" />
            </svg>
          </div>

          {/* Expanding Oval Compression Shock Rings */}
          {[0, 1, 2].map(i => (
            <div
              key={`hb-shock-${i}`}
              className="absolute w-28 h-20 rounded-full border-2 border-cyan-300 pointer-events-none z-30"
              style={{
                animation: `gbaHyperBeamShockRing 1.95s ease-out ${0.35 + i * 0.15}s forwards`,
                opacity: 0
              }}
            />
          ))}

          {/* Disintegration Sparks */}
          {[
            { x: '-40px', y: '-28px' }, { x: '40px', y: '-28px' },
            { x: '-50px', y: '28px' }, { x: '50px', y: '28px' },
            { x: '-20px', y: '-35px' }, { x: '20px', y: '35px' }
          ].map((p, i) => (
            <div
              key={`hb-spark-${i}`}
              className="absolute pointer-events-none z-40"
              style={{
                '--hb-x': p.x,
                '--hb-y': p.y,
                animation: `gbaHyperBeamVaporizeSparks 1.95s ease-out ${0.4 + i * 0.06}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-200 shadow-[0_0_10px_#ffffff]" />
            </div>
          ))}
        </div>
      )}

      {/* 20ag. FEAROW DRILL PECK (Fearow Lv. 27 — Aerodynamic Corkscrew Beak Dive) */}
      {fx.type === 'fearow_drill_peck' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Aerodynamic Spiral Corkscrew Wind Tunnel */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-20"
            style={{ animation: 'gbaFearowVortexCone 1.55s ease-out forwards' }}
          >
            <svg width="140" height="140" viewBox="0 0 140 140">
              <path
                d="M 70 20 C 100 20, 120 45, 120 70 C 120 100, 95 120, 70 120 C 40 120, 20 95, 20 70 C 20 48, 42 32, 65 32 C 88 32, 105 48, 105 68 C 105 88, 88 105, 70 105 C 52 105, 38 90, 38 72"
                fill="none" stroke="#bae6fd" strokeWidth="3" strokeDasharray="8,6" opacity="0.75"
              />
              <circle cx="70" cy="70" r="48" fill="none" stroke="#e0f2fe" strokeWidth="1.5" opacity="0.5" />
            </svg>
          </div>

          {/* Authentic 1999 Ken Sugimori Fearow Spearhead Beak Dive */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaFearowBeakDrill 1.55s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Fearow_DrillPeck_Beak.png"
              alt="Fearow Drill Peck"
              className="w-36 h-36 object-contain drop-shadow-[0_0_25px_#f59e0b]"
            />
          </div>

          {/* Kinetic Radial Puncture Sparks */}
          {[
            { x: '-32px', y: '-28px' }, { x: '32px', y: '-28px' },
            { x: '-38px', y: '22px' }, { x: '38px', y: '22px' },
            { x: '0px', y: '-36px' }, { x: '0px', y: '36px' }
          ].map((p, i) => (
            <div
              key={`fp-spark-${i}`}
              className="absolute pointer-events-none z-40"
              style={{
                '--dp-x': p.x,
                '--dp-y': p.y,
                animation: `gbaFearowDrillSparks 1.55s ease-out ${0.35 + i * 0.05}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_10px_#f59e0b]" />
            </div>
          ))}
        </div>
      )}

      {/* 20ah. VENOMOTH VENOM POWDER (Venomoth Lv. 28 — Dual Poison & Hypnotic Confusion Spores) */}
      {fx.type === 'venomoth_venom_powder' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Trance Optical Distortion Overlay */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none z-10"
            style={{ animation: 'gbaVenomothTranceDistort 1.7s ease-in-out forwards' }}
          />

          {/* Billowing Iridescent Toxic Spore Cloud */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none z-20"
            style={{
              animation: 'gbaVenomothPollenCloud 1.7s ease-in-out forwards',
              background: 'radial-gradient(circle, rgba(216,180,254,0.45) 0%, rgba(168,85,247,0.4) 45%, rgba(132,204,22,0.3) 80%, transparent 100%)'
            }}
          />

          {/* Hypnotic Psy-Confusion Concentric Ripple Rings */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-25"
            style={{ animation: 'gbaVenomothConfusionRipples 1.7s ease-out forwards' }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#facc15" strokeWidth="2.5" strokeDasharray="10,6" opacity="0.8" />
              <circle cx="60" cy="60" r="35" fill="none" stroke="#e879f9" strokeWidth="2" strokeDasharray="6,4" opacity="0.85" />
              <circle cx="60" cy="60" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
            </svg>
          </div>

          {/* Floating Lepidopteran Wing Scales & Spore Crystals */}
          {[
            { x: '-30px', y: '-25px' }, { x: '30px', y: '-20px' },
            { x: '-20px', y: '30px' }, { x: '25px', y: '25px' },
            { x: '0px', y: '-35px' }, { x: '-40px', y: '5px' }
          ].map((p, i) => (
            <div
              key={`vm-scale-${i}`}
              className="absolute pointer-events-none z-30"
              style={{
                left: `calc(50% + ${p.x})`,
                top: `calc(50% + ${p.y})`,
                animation: `gbaVenomothLepidopteraScale 1.7s ease-out ${0.15 + i * 0.12}s forwards`,
                opacity: 0
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14">
                <polygon points="7,0 14,7 7,14 0,7" fill={i % 2 === 0 ? '#d8b4fe' : '#fef08a'} opacity="0.85" className="drop-shadow-[0_0_8px_#c084fc]" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 20ai. RAPIDASH FLAME STOMP (Rapidash Lv. 33 — Equine Mane Fire & Heavy Hoofprint Quake) */}
      {fx.type === 'rapidash_flame_stomp' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Scorched Molten Ground Fissure Fractures */}
          <div className="absolute flex items-center justify-center pointer-events-none z-15" style={{ animation: 'gbaRapidashGroundFissures 1.65s ease-out forwards' }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <path d="M 65 65 L 35 30 M 65 65 L 95 30 M 65 65 L 25 90 M 65 65 L 105 90 M 65 65 L 65 115" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
              <path d="M 65 65 L 45 40 M 65 65 L 85 40" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
            </svg>
          </div>

          {/* Rearing Fiery Equine Hooves Slam */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaRapidashHoofLunge 1.65s cubic-bezier(0.18, 1, 0.32, 1) forwards' }}
          >
            <svg width="120" height="100" viewBox="0 0 120 100" className="drop-shadow-[0_0_25px_#f97316]">
              {/* Left Hoof */}
              <ellipse cx="40" cy="50" rx="18" ry="14" fill="#451a03" stroke="#f97316" strokeWidth="2.5" />
              <path d="M 28 48 C 28 35, 52 35, 52 48" fill="none" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
              {/* Right Hoof */}
              <ellipse cx="80" cy="50" rx="18" ry="14" fill="#451a03" stroke="#f97316" strokeWidth="2.5" />
              <path d="M 68 48 C 68 35, 92 35, 92 48" fill="none" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
              {/* Flaming Fetlock Flares */}
              <path d="M 30 40 Q 40 15 50 35 Q 40 25 30 40 Z" fill="#f97316" />
              <path d="M 70 40 Q 80 15 90 35 Q 80 25 70 40 Z" fill="#f97316" />
            </svg>
          </div>

          {/* Glowing Molten Hoofprint Scorch Marks */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-20"
            style={{ animation: 'gbaRapidashHoofPrintScorch 1.65s ease-out forwards' }}
          >
            <div className="w-28 h-16 flex justify-between px-2">
              <div className="w-10 h-10 rounded-full border-2 border-orange-400 bg-orange-600/40 blur-xs" />
              <div className="w-10 h-10 rounded-full border-2 border-orange-400 bg-orange-600/40 blur-xs" />
            </div>
          </div>

          {/* Galloping Sparks Eruption */}
          {[
            { x: '-35px', y: '-30px' }, { x: '35px', y: '-30px' },
            { x: '-45px', y: '15px' }, { x: '45px', y: '15px' }
          ].map((p, i) => (
            <div
              key={`rp-ember-${i}`}
              className="absolute pointer-events-none z-35"
              style={{
                '--rh-x': p.x,
                '--rh-y': p.y,
                animation: `gbaRapidashEmberErupt 1.65s ease-out ${0.4 + i * 0.08}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-200 shadow-[0_0_12px_#ea580c]" />
            </div>
          ))}
        </div>
      )}

      {/* 20aj. GRAVELER ROCK THROW (Graveler Lv. 29 — Heavy Polygonal Granite Ballistic Monolith) */}
      {fx.type === 'graveler_rock_throw' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Incoming Ballistic Granite Boulder */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaGravelerMegaboulder 1.6s cubic-bezier(0.2, 0.8, 0.25, 1) forwards' }}
          >
            <svg width="85" height="85" viewBox="0 0 85 85" className="drop-shadow-[0_0_20px_#78350f]">
              <polygon points="42,5 72,25 78,60 50,80 18,72 8,35" fill="#78716c" stroke="#44403c" strokeWidth="3" />
              <polygon points="42,5 72,25 50,45 25,32" fill="#a8a29e" opacity="0.6" />
              <polygon points="50,45 78,60 50,80" fill="#57534e" opacity="0.8" />
              <line x1="25" y1="32" x2="18" y2="72" stroke="#292524" strokeWidth="2" />
            </svg>
          </div>

          {/* Violent Impact Shattering Rock Shards */}
          {[
            { x: '-38px', y: '-35px', r: '-120deg' },
            { x: '42px', y: '-30px', r: '140deg' },
            { x: '-45px', y: '25px', r: '180deg' },
            { x: '45px', y: '30px', r: '-90deg' },
            { x: '0px', y: '-45px', r: '45deg' },
            { x: '0px', y: '45px', r: '-45deg' }
          ].map((s, i) => (
            <div
              key={`gv-shard-${i}`}
              className="absolute pointer-events-none z-35"
              style={{
                '--rs-x': s.x,
                '--rs-y': s.y,
                '--rs-r': s.r,
                animation: `gbaGravelerRockShard 1.6s ease-out ${0.42 + i * 0.04}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <svg width="22" height="22" viewBox="0 0 22 22">
                <polygon points="11,2 20,9 15,19 4,16 2,8" fill="#a8a29e" stroke="#44403c" strokeWidth="1.5" />
              </svg>
            </div>
          ))}

          {/* Dense Earthen Dust Shockwave Puff */}
          <div
            className="absolute w-36 h-28 rounded-full pointer-events-none z-20"
            style={{
              animation: 'gbaGravelerDustPuff 1.6s ease-out forwards',
              background: 'radial-gradient(ellipse, rgba(180,83,9,0.35) 0%, rgba(120,53,15,0.4) 50%, transparent 80%)'
            }}
          />
        </div>
      )}

      {/* 20ak. JOLTEON PIN MISSILE (Jolteon Lv. 29 — 4-Volley High-Voltage Fur Needle Barrage) */}
      {fx.type === 'jolteon_pin_missile' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Volley 1: Top-Left to Center */}
          <div className="absolute pointer-events-none z-30" style={{ animation: 'gbaJolteonMissileSalvo1 1.75s ease-out forwards' }}>
            <svg width="35" height="50" viewBox="0 0 35 50" className="drop-shadow-[0_0_12px_#fde047]">
              <polygon points="17,0 23,40 17,50 11,40" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Volley 2: Top-Right to Center */}
          <div className="absolute pointer-events-none z-30" style={{ animation: 'gbaJolteonMissileSalvo2 1.75s ease-out forwards' }}>
            <svg width="35" height="50" viewBox="0 0 35 50" className="drop-shadow-[0_0_12px_#fde047]">
              <polygon points="17,0 23,40 17,50 11,40" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Volley 3: Bottom-Left to Center */}
          <div className="absolute pointer-events-none z-30" style={{ animation: 'gbaJolteonMissileSalvo3 1.75s ease-out forwards' }}>
            <svg width="35" height="50" viewBox="0 0 35 50" className="drop-shadow-[0_0_14px_#38bdf8]">
              <polygon points="17,0 23,40 17,50 11,40" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Volley 4: Bottom-Right to Center */}
          <div className="absolute pointer-events-none z-30" style={{ animation: 'gbaJolteonMissileSalvo4 1.75s ease-out forwards' }}>
            <svg width="35" height="50" viewBox="0 0 35 50" className="drop-shadow-[0_0_16px_#fde047]">
              <polygon points="17,0 23,40 17,50 11,40" fill="#ffffff" stroke="#eab308" strokeWidth="2" />
            </svg>
          </div>

          {/* Electric Arc Burst at Center */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-35"
            style={{ animation: 'gbaJolteonElectricArcBurst 1.75s ease-out forwards' }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100">
              <path d="M 50 10 L 45 45 L 75 40 L 40 90 L 52 55 L 25 60 Z" fill="#fde047" stroke="#ffffff" strokeWidth="2" className="drop-shadow-[0_0_18px_#fde047]" />
            </svg>
          </div>
        </div>
      )}

      {/* 20al. DARK GYARADOS ICE BEAM (Dark Gyarados Lv. 31 — Glacial Sub-Zero Laser & Solid Ice Encapsulation) */}
      {fx.type === 'dark_gyarados_ice_beam' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Full-Card Solid Cryogenic Ice Block Encapsulation */}
          <div
            className="absolute inset-0 rounded-2xl border-2 border-cyan-200/90 pointer-events-none z-25 flex items-center justify-center"
            style={{
              animation: 'gbaDarkGyaradosSolidIceBlock 1.75s ease-out forwards',
              background: 'radial-gradient(ellipse at center, rgba(186,230,253,0.3) 0%, rgba(56,189,248,0.4) 60%, rgba(2,132,199,0.5) 100%)',
              backdropFilter: 'blur(3px)'
            }}
          >
            {/* Frozen Crystalline Frost Fractures */}
            <svg width="100%" height="100%" viewBox="0 0 140 200" className="absolute inset-0" style={{ animation: 'gbaDarkGyaradosIceFracture 1.75s ease-out forwards' }}>
              <path d="M 10 20 L 50 60 L 90 40 L 130 80 M 50 60 L 40 120 L 80 150 M 40 120 L 15 170 M 80 150 L 120 180" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
              <path d="M 50 60 L 70 80 L 110 70" fill="none" stroke="#e0f2fe" strokeWidth="1.5" opacity="0.75" />
            </svg>
          </div>

          {/* Sub-Zero Glacial Laser Jet */}
          <div
            className="absolute w-[220px] h-12 flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaDarkGyaradosGlacialLaser 1.75s cubic-bezier(0.12, 0.9, 0.25, 1) forwards' }}
          >
            <div className="w-full h-8 rounded-full bg-cyan-300/80 shadow-[0_0_25px_#38bdf8] flex items-center justify-center">
              <div className="w-[90%] h-3 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
            </div>
          </div>

          {/* Sub-Zero Blizzard Fog Mist at Base */}
          <div
            className="absolute bottom-0 w-full h-16 pointer-events-none z-20"
            style={{
              animation: 'gbaDarkGyaradosBlizzardVapor 1.75s ease-out forwards',
              background: 'radial-gradient(ellipse at bottom, rgba(224,242,254,0.6) 0%, rgba(186,230,253,0.3) 50%, transparent 90%)'
            }}
          />
        </div>
      )}

      {/* 20am. ARBOK POISON FANG (Arbok Lv. 27 / Dark Arbok — Menacing Cobra Hood & Piercing Viper Fangs) */}
      {fx.type === 'arbok_poison_fang' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Authentic 1999 Ken Sugimori Arbok Poison Fang Cobra Maw */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaArbokViperFangs 1.65s cubic-bezier(0.18, 1, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Arbok_PoisonFang_Maw.png"
              alt="Arbok Poison Fang"
              className="w-48 h-48 object-contain drop-shadow-[0_0_30px_#7e22ce]"
            />
          </div>

          {/* High-Pressure Corrosive Venom Spurt Streams */}
          <div className="absolute pointer-events-none z-35" style={{ animation: 'gbaArbokVenomSpurtL 1.65s ease-out forwards' }}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="7" fill="#84cc16" className="drop-shadow-[0_0_10px_#a3e635]" />
              <circle cx="10" cy="28" r="4" fill="#a855f7" />
            </svg>
          </div>
          <div className="absolute pointer-events-none z-35" style={{ animation: 'gbaArbokVenomSpurtR 1.65s ease-out forwards' }}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="7" fill="#84cc16" className="drop-shadow-[0_0_10px_#a3e635]" />
              <circle cx="30" cy="28" r="4" fill="#a855f7" />
            </svg>
          </div>
        </div>
      )}

      {/* 20an. GOLBAT LEECH LIFE (Golbat Lv. 29 — Vampiric Wing Swoop & Vitality Siphon) */}
      {fx.type === 'golbat_leech_life' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Authentic 1999 Ken Sugimori Golbat Leech Life Maw */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-25"
            style={{ animation: 'gbaGolbatVampireDive 1.7s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Golbat_LeechLife_Maw.png"
              alt="Golbat Leech Life"
              className="w-48 h-48 object-contain drop-shadow-[0_0_30px_#312e81]"
            />
          </div>

          {/* Siphoned Crimson Vitality Orbs */}
          {[
            { x: '-28px', y: '-35px' }, { x: '28px', y: '-35px' },
            { x: '-20px', y: '25px' }, { x: '20px', y: '25px' }
          ].map((p, i) => (
            <div
              key={`gb-orb-${i}`}
              className="absolute pointer-events-none z-30"
              style={{
                '--vs-x': p.x,
                '--vs-y': p.y,
                animation: `gbaGolbatVitalityOrbSiphon 1.7s cubic-bezier(0.2, 0.8, 0.25, 1) ${0.35 + i * 0.1}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <div className="w-5 h-5 rounded-full bg-rose-500 shadow-[0_0_15px_#ef4444] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
          ))}

          {/* Recovery Emerald Aura Pulse */}
          <div
            className="absolute w-28 h-28 rounded-full pointer-events-none z-25"
            style={{
              animation: 'gbaGolbatHealAuraPulse 1.7s ease-out forwards',
              background: 'radial-gradient(circle, rgba(74,222,128,0.4) 0%, rgba(34,197,94,0.3) 50%, transparent 80%)'
            }}
          />
        </div>
      )}

      {/* 20ao. DARK BLASTOISE HYDROCANNON (Dark Blastoise Lv. 28 — Gunmetal Twin Artillery & Concussion Hydro Geyser) */}
      {fx.type === 'dark_blastoise_hydrocannon' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Gunmetal Twin Artillery Cannons */}
          <div
            className="absolute top-2 w-full flex justify-between px-6 pointer-events-none z-25"
            style={{ animation: 'gbaDarkBlastoiseGunmetalCannons 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            {/* Left Cannon */}
            <div className="w-10 h-18 bg-slate-800 border-2 border-slate-600 rounded-b-md shadow-[0_0_15px_rgba(0,0,0,0.8)] flex flex-col items-center">
              <div className="w-full h-3 bg-amber-600/80 mt-1" />
              <div className="w-8 h-8 rounded-full border border-slate-500 mt-2 bg-slate-900" />
            </div>
            {/* Right Cannon */}
            <div className="w-10 h-18 bg-slate-800 border-2 border-slate-600 rounded-b-md shadow-[0_0_15px_rgba(0,0,0,0.8)] flex flex-col items-center">
              <div className="w-full h-3 bg-amber-600/80 mt-1" />
              <div className="w-8 h-8 rounded-full border border-slate-500 mt-2 bg-slate-900" />
            </div>
          </div>

          {/* Twin Muzzle Blast Detonations */}
          <div className="absolute top-12 w-full flex justify-between px-8 pointer-events-none z-30">
            <div className="w-12 h-12 rounded-full bg-cyan-200 shadow-[0_0_25px_#38bdf8]" style={{ animation: 'gbaDarkBlastoiseMuzzleBlast 1.8s ease-out forwards' }} />
            <div className="w-12 h-12 rounded-full bg-cyan-200 shadow-[0_0_25px_#38bdf8]" style={{ animation: 'gbaDarkBlastoiseMuzzleBlast 1.8s ease-out forwards' }} />
          </div>

          {/* High-Velocity Compressed Hydro Mortar Shells */}
          <div className="absolute flex items-center justify-center pointer-events-none z-35" style={{ animation: 'gbaDarkBlastoiseHydroShell 1.8s cubic-bezier(0.2, 0.8, 0.25, 1) forwards' }}>
            <div className="w-16 h-16 rounded-full bg-radial from-white via-cyan-400 to-blue-700 shadow-[0_0_30px_#0284c7]" />
          </div>

          {/* Massive Vertical Concussion Hydro Geyser */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaDarkBlastoiseConcussionGeyser 1.8s ease-out forwards' }}
          >
            <svg width="150" height="200" viewBox="0 0 150 200">
              <path d="M 40 180 Q 20 90 50 20 Q 75 5 100 20 Q 130 90 110 180 Z" fill="url(#darkBlastoiseGeyserGrad)" opacity="0.85" className="drop-shadow-[0_0_25px_#38bdf8]" />
              <path d="M 55 170 Q 40 90 65 35 Q 75 20 85 35 Q 110 90 95 170 Z" fill="#ffffff" opacity="0.75" />
              <defs>
                <linearGradient id="darkBlastoiseGeyserGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="30%" stopColor="#0284c7" />
                  <stop offset="70%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#e0f2fe" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}

      {/* 20ap. DARK CHARIZARD CONTINUOUS FIREBALL (Dark Charizard Lv. 38 — Triple Volcanic Magma Bombardment) */}
      {fx.type === 'dark_charizard_fireball' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Fireball 1: Left Salvo */}
          <div className="absolute pointer-events-none z-30" style={{ animation: 'gbaDarkFireball1 1.85s cubic-bezier(0.2, 0.8, 0.25, 1) forwards' }}>
            <svg width="45" height="45" viewBox="0 0 45 45" className="drop-shadow-[0_0_20px_#ea580c]">
              <circle cx="22" cy="22" r="18" fill="#7f1d1d" stroke="#f97316" strokeWidth="2.5" />
              <circle cx="22" cy="22" r="10" fill="#ea580c" />
              <circle cx="20" cy="20" r="4" fill="#ffffff" />
            </svg>
          </div>

          {/* Fireball 2: Right Salvo */}
          <div className="absolute pointer-events-none z-30" style={{ animation: 'gbaDarkFireball2 1.85s cubic-bezier(0.2, 0.8, 0.25, 1) forwards' }}>
            <svg width="45" height="45" viewBox="0 0 45 45" className="drop-shadow-[0_0_20px_#dc2626]">
              <circle cx="22" cy="22" r="18" fill="#450a0a" stroke="#ef4444" strokeWidth="2.5" />
              <circle cx="22" cy="22" r="10" fill="#f97316" />
              <circle cx="20" cy="20" r="4" fill="#ffffff" />
            </svg>
          </div>

          {/* Fireball 3: Heavy Center Meteor */}
          <div className="absolute pointer-events-none z-35" style={{ animation: 'gbaDarkFireball3 1.85s cubic-bezier(0.2, 0.8, 0.25, 1) forwards' }}>
            <svg width="60" height="60" viewBox="0 0 60 60" className="drop-shadow-[0_0_30px_#f97316]">
              <circle cx="30" cy="30" r="26" fill="#991b1b" stroke="#fef08a" strokeWidth="3" />
              <circle cx="30" cy="30" r="16" fill="#f97316" />
              <circle cx="28" cy="28" r="7" fill="#ffffff" />
            </svg>
          </div>

          {/* Concussive Crater Blast */}
          <div
            className="absolute w-36 h-36 rounded-full pointer-events-none z-20"
            style={{
              animation: 'gbaDarkFireballCraterBurst 1.85s ease-out forwards',
              background: 'radial-gradient(circle, rgba(234,88,12,0.5) 0%, rgba(185,28,28,0.4) 50%, rgba(15,23,42,0.3) 80%, transparent 100%)'
            }}
          />
        </div>
      )}

      {/* 20aq. FARFETCH'D LEEK SLAP (Farfetch'd Lv. 20 — 1996 Ken Sugimori Scallion Leek Strike) */}
      {fx.type === 'farfetchd_leek_slap' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Authentic 1996 Ken Sugimori Farfetch'd Leek Weapon */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaFarfetchdLeekSwoop 1.55s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Farfetchd_Leek_Weapon.png"
              alt="Farfetchd Leek Weapon"
              className="w-40 h-40 object-contain drop-shadow-[0_0_25px_#22c55e]"
            />
          </div>

          {/* Aerodynamic Emerald/White Wind Slash Trails */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-35"
            style={{ animation: 'gbaFarfetchdLeekSlashMarks 1.55s ease-out forwards' }}
          >
            <svg width="140" height="140" viewBox="0 0 140 140">
              <path d="M 20 25 L 120 115" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <path d="M 35 15 L 125 95" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
              <path d="M 15 45 L 105 125" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
            </svg>
          </div>

          {/* Scattered Vegetable Fiber Sparks */}
          {[
            { x: '-35px', y: '-30px', rot: '45deg' }, { x: '35px', y: '-30px', rot: '-35deg' },
            { x: '-40px', y: '25px', rot: '60deg' }, { x: '40px', y: '25px', rot: '-60deg' },
            { x: '0px', y: '-42px', rot: '15deg' }, { x: '0px', y: '42px', rot: '-15deg' },
            { x: '-25px', y: '0px', rot: '90deg' }, { x: '25px', y: '0px', rot: '-90deg' }
          ].map((p, i) => (
            <div
              key={`ff-fiber-${i}`}
              className="absolute pointer-events-none z-30"
              style={{
                '--ff-x': p.x,
                '--ff-y': p.y,
                animation: `gbaFarfetchdLeafFibers 1.55s ease-out ${0.38 + i * 0.04}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <div
                className="w-3 h-1 bg-lime-400 rounded shadow-[0_0_8px_#84cc16]"
                style={{ transform: `rotate(${p.rot})` }}
              />
            </div>
          ))}

          {/* Concussive Impact Shockwave Ring */}
          <div
            className="absolute w-32 h-32 rounded-full border-2 border-emerald-300 pointer-events-none z-25"
            style={{ animation: 'gbaFarfetchdImpactWave 1.55s ease-out forwards' }}
          />
        </div>
      )}

      {/* 20ar. CUBONE BONE STRIKE (Cubone Lv. 13 — 1996 Ken Sugimori Heavy Bone Club Smash) */}
      {fx.type === 'cubone_bone_strike' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Authentic 1996 Ken Sugimori Dinosaur Bone Club */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaCuboneBoneSmash 1.65s cubic-bezier(0.18, 1, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Cubone_Bone_Club.png"
              alt="Cubone Bone Club"
              className="w-44 h-44 object-contain drop-shadow-[0_0_25px_#ca8a04]"
            />
          </div>

          {/* Radial Ground Tremor Fissures */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            style={{ animation: 'gbaCuboneGroundCracks 1.65s ease-out forwards' }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150">
              <path d="M 75 75 L 30 50 M 75 75 L 120 45 M 75 75 L 35 110 M 75 75 L 115 115 M 75 75 L 75 135 M 75 75 L 75 15"
                stroke="#a16207" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            </svg>
          </div>

          {/* Earthen Dust Cloud Expansion */}
          <div
            className="absolute w-36 h-36 rounded-full pointer-events-none z-15"
            style={{
              animation: 'gbaCuboneDustRing 1.65s ease-out forwards',
              background: 'radial-gradient(circle, rgba(202,138,4,0.4) 0%, rgba(161,98,7,0.3) 50%, transparent 80%)'
            }}
          />

          {/* Flying Bone Splinter Shards */}
          {[
            { x: '-38px', y: '-32px' }, { x: '38px', y: '-32px' },
            { x: '-45px', y: '18px' }, { x: '45px', y: '18px' },
            { x: '-15px', y: '-45px' }, { x: '15px', y: '45px' }
          ].map((p, i) => (
            <div
              key={`cb-shard-${i}`}
              className="absolute pointer-events-none z-35"
              style={{
                '--cb-x': p.x,
                '--cb-y': p.y,
                animation: `gbaCuboneBoneShards 1.65s ease-out ${0.4 + i * 0.05}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <div className="w-2.5 h-2.5 bg-amber-100 border border-amber-600 rounded-sm shadow-[0_0_6px_#ca8a04]" />
            </div>
          ))}
        </div>
      )}

      {/* 20as. BULBASAUR LEECH SEED (Bulbasaur Lv. 13 — 1996 Ken Sugimori Spiked Seed Pod & Tendril Drain) */}
      {fx.type === 'bulbasaur_leech_seed' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Authentic 1996 Ken Sugimori Spiked Seed Pod */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaBulbasaurSeedImplant 1.75s cubic-bezier(0.18, 1, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Bulbasaur_Leech_Seed_Pod.png"
              alt="Bulbasaur Leech Seed Pod"
              className="w-36 h-36 object-contain drop-shadow-[0_0_25px_#15803d]"
            />
          </div>

          {/* Sprouting Coiled Vine Tendrils */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-25"
            style={{ animation: 'gbaBulbasaurTendrilClasp 1.75s ease-out forwards' }}
          >
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 80 80 Q 50 30 20 40 Q 10 70 30 90" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
              <path d="M 80 80 Q 110 30 140 40 Q 150 70 130 90" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
              <path d="M 80 80 Q 50 130 30 120 Q 20 150 50 150" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 80 80 Q 110 130 130 120 Q 140 150 110 150" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Siphoned Emerald & Ruby Vitality Orbs */}
          {[
            { x: '-32px', y: '-30px' }, { x: '32px', y: '-30px' },
            { x: '-22px', y: '30px' }, { x: '22px', y: '30px' }
          ].map((p, i) => (
            <div
              key={`bs-orb-${i}`}
              className="absolute pointer-events-none z-35"
              style={{
                '--bs-x': p.x,
                '--bs-y': p.y,
                animation: `gbaBulbasaurLifeSiphon 1.75s cubic-bezier(0.2, 0.8, 0.25, 1) ${0.55 + i * 0.1}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <div className="w-5 h-5 rounded-full bg-emerald-400 border border-white shadow-[0_0_15px_#22c55e] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-rose-400" />
              </div>
            </div>
          ))}

          {/* Drained Target Healing Aura Ripple */}
          <div
            className="absolute w-32 h-32 rounded-full pointer-events-none z-20"
            style={{
              animation: 'gbaBulbasaurDrainRipple 1.75s ease-out forwards',
              background: 'radial-gradient(circle, rgba(34,197,94,0.35) 0%, rgba(21,128,61,0.2) 60%, transparent 80%)'
            }}
          />
        </div>
      )}

      {/* 20at. SQUIRTLE SHELL DEFENSE (Squirtle Lv. 8 — 1996 Ken Sugimori Turtle Shell Withdraw & Reflect) */}
      {fx.type === 'squirtle_shell_defense' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Authentic 1996 Ken Sugimori Smooth Turtle Shell */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaSquirtleShellSnap 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Squirtle_Turtle_Shell.png"
              alt="Squirtle Turtle Shell"
              className="w-44 h-44 object-contain drop-shadow-[0_0_30px_#0284c7]"
            />
          </div>

          {/* Prismatic Deflective Shimmer Barrier */}
          <div
            className="absolute w-40 h-40 rounded-full border-2 border-cyan-200 pointer-events-none z-35"
            style={{
              animation: 'gbaSquirtleReflectShimmer 1.6s ease-out forwards',
              background: 'radial-gradient(circle, rgba(224,242,254,0.4) 0%, rgba(56,189,248,0.3) 50%, transparent 75%)'
            }}
          />

          {/* Deflected Water Splash Droplets */}
          {[
            { x: '-42px', y: '-35px' }, { x: '42px', y: '-35px' },
            { x: '-48px', y: '15px' }, { x: '48px', y: '15px' },
            { x: '-25px', y: '40px' }, { x: '25px', y: '40px' }
          ].map((p, i) => (
            <div
              key={`sq-drop-${i}`}
              className="absolute pointer-events-none z-35"
              style={{
                '--sq-x': p.x,
                '--sq-y': p.y,
                animation: `gbaSquirtleDeflectSplash 1.6s ease-out ${0.42 + i * 0.06}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-300 border border-white shadow-[0_0_10px_#38bdf8]" />
            </div>
          ))}

          {/* Expanding Hydro Protective Concussion Ring */}
          <div
            className="absolute w-44 h-44 rounded-full border border-sky-300 pointer-events-none z-20"
            style={{ animation: 'gbaSquirtleShieldRings 1.6s ease-out forwards' }}
          />
        </div>
      )}

      {/* 20au. PIKACHU THUNDER JOLT (Pikachu Lv. 12/14 — 1996 Ken Sugimori Chubby Pikachu Spark & Mega Thunder Jolt) */}
      {fx.type === 'pikachu_thunder_jolt' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Authentic 1996 Ken Sugimori Chubby Pikachu Stance */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaPikachuChargePose 1.65s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Pikachu_Spark_Cheeks.png"
              alt="Pikachu Spark Cheeks"
              className="w-44 h-44 object-contain drop-shadow-[0_0_25px_#eab308]"
            />
          </div>

          {/* High-Voltage Forked Zigzag Lightning Detonation */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-35"
            style={{ animation: 'gbaPikachuThunderBolts 1.65s ease-out forwards' }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150">
              <path d="M 75 10 L 60 55 L 90 65 L 50 115 L 80 120 L 40 145" fill="none" stroke="#fde047" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_15px_#eab308]" />
              <path d="M 75 10 L 60 55 L 90 65 L 50 115 L 80 120 L 40 145" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 75 40 L 110 30 L 95 65 L 135 80" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 75 75 L 30 70 L 45 95 L 15 110" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Expanding Spherical Ion Shockwave Rings */}
          <div
            className="absolute w-44 h-44 rounded-full border-2 border-yellow-300 pointer-events-none z-25"
            style={{ animation: 'gbaPikachuShockwaveRings 1.65s ease-out forwards' }}
          />

          {/* Crackling High-Voltage Electric Sparks */}
          {[
            { x: '-38px', y: '-35px' }, { x: '38px', y: '-35px' },
            { x: '-42px', y: '25px' }, { x: '42px', y: '25px' },
            { x: '-15px', y: '-45px' }, { x: '15px', y: '45px' }
          ].map((p, i) => (
            <div
              key={`pk-spark-${i}`}
              className="absolute pointer-events-none z-35"
              style={{
                '--pk-x': p.x,
                '--pk-y': p.y,
                animation: `gbaPikachuElectricSparks 1.65s ease-out ${0.4 + i * 0.05}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <div className="w-3 h-3 bg-yellow-200 rotate-45 border border-white shadow-[0_0_10px_#facc15]" />
            </div>
          ))}
        </div>
      )}

      {/* 20av. CHARMANDER EMBER FLAME (Charmander Lv. 10 — 1996 Ken Sugimori Teardrop Tail Flame & Incandescent Ember Burst) */}
      {fx.type === 'charmander_ember_flame' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Authentic 1996 Ken Sugimori Charmander Tail Flame */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaCharmanderTailSweep 1.6s cubic-bezier(0.18, 1, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Charmander_Tail_Flame.png"
              alt="Charmander Tail Flame"
              className="w-40 h-40 object-contain drop-shadow-[0_0_30px_#ea580c]"
            />
          </div>

          {/* Triple Staggered Incandescent Ember Projectiles */}
          <div className="absolute pointer-events-none z-35" style={{ animation: 'gbaCharmanderEmber1 1.6s cubic-bezier(0.2, 0.8, 0.25, 1) forwards' }}>
            <div className="w-7 h-7 rounded-full bg-radial from-white via-amber-400 to-red-600 shadow-[0_0_15px_#f97316]" />
          </div>
          <div className="absolute pointer-events-none z-35" style={{ animation: 'gbaCharmanderEmber2 1.6s cubic-bezier(0.2, 0.8, 0.25, 1) forwards' }}>
            <div className="w-6 h-6 rounded-full bg-radial from-white via-yellow-300 to-orange-600 shadow-[0_0_12px_#ea580c]" />
          </div>
          <div className="absolute pointer-events-none z-35" style={{ animation: 'gbaCharmanderEmber3 1.6s cubic-bezier(0.2, 0.8, 0.25, 1) forwards' }}>
            <div className="w-8 h-8 rounded-full bg-radial from-white via-orange-400 to-rose-700 shadow-[0_0_18px_#dc2626]" />
          </div>

          {/* Scorched Ground Magma Aura Patch */}
          <div
            className="absolute w-36 h-36 rounded-full pointer-events-none z-20"
            style={{
              animation: 'gbaCharmanderScorchPatch 1.6s ease-out forwards',
              background: 'radial-gradient(circle, rgba(249,115,22,0.5) 0%, rgba(220,38,38,0.3) 55%, transparent 80%)'
            }}
          />

          {/* Floating Carbon Cinders */}
          {[
            { x: '-30px', y: '-35px' }, { x: '30px', y: '-35px' },
            { x: '-20px', y: '25px' }, { x: '20px', y: '25px' }
          ].map((p, i) => (
            <div
              key={`cm-cind-${i}`}
              className="absolute pointer-events-none z-35"
              style={{
                '--cm-x': p.x,
                '--cm-y': p.y,
                animation: `gbaCharmanderCinders 1.6s ease-out ${0.45 + i * 0.08}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <div className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_6px_#f59e0b]" />
            </div>
          ))}
        </div>
      )}

      {/* 20aw. EKANS WRAP CONSTRICT (Ekans Lv. 10 — 1996 Ken Sugimori Coiled Serpent Wrap & Venom Fang Strike) */}
      {fx.type === 'ekans_wrap_constrict' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Authentic 1996 Ken Sugimori Coiled Ekans Serpent */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaEkansConstrictCoil 1.75s cubic-bezier(0.18, 1, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Ekans_Coiled_Serpent.png"
              alt="Ekans Coiled Serpent"
              className="w-48 h-48 object-contain drop-shadow-[0_0_30px_#9333ea]"
            />
          </div>

          {/* Tri-Wave Crushing Compression Pulse Rings */}
          <div
            className="absolute w-44 h-44 rounded-full border-2 border-purple-400 pointer-events-none z-25"
            style={{ animation: 'gbaEkansCrushPulse 1.75s ease-out forwards' }}
          />

          {/* Dual Corrosive Venom Spurt Droplets */}
          <div className="absolute pointer-events-none z-35" style={{ animation: 'gbaEkansVenomSpurtL 1.75s ease-out forwards' }}>
            <svg width="35" height="35" viewBox="0 0 35 35">
              <circle cx="17" cy="17" r="6" fill="#a855f7" className="drop-shadow-[0_0_8px_#c084fc]" />
              <circle cx="10" cy="22" r="3" fill="#ec4899" />
            </svg>
          </div>
          <div className="absolute pointer-events-none z-35" style={{ animation: 'gbaEkansVenomSpurtR 1.75s ease-out forwards' }}>
            <svg width="35" height="35" viewBox="0 0 35 35">
              <circle cx="17" cy="17" r="6" fill="#a855f7" className="drop-shadow-[0_0_8px_#c084fc]" />
              <circle cx="24" cy="22" r="3" fill="#ec4899" />
            </svg>
          </div>

          {/* Eerie Purple Constriction Shimmer Aura */}
          <div
            className="absolute w-40 h-40 rounded-full pointer-events-none z-20"
            style={{
              animation: 'gbaEkansAuraConstrict 1.75s ease-out forwards',
              background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(126,34,206,0.3) 50%, transparent 80%)'
            }}
          />
        </div>
      )}

      {/* 20ax. SANDSHREW SAND ATTACK (Sandshrew Lv. 12 — 1996 Ken Sugimori Digging Claws & Blinding Sand Blast) */}
      {fx.type === 'sandshrew_sand_attack' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Authentic 1996 Ken Sugimori Digging Claw Arm */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaSandshrewClawSwipe 1.55s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Sandshrew_Digging_Claws.png"
              alt="Sandshrew Digging Claws"
              className="w-40 h-40 object-contain drop-shadow-[0_0_25px_#d97706]"
            />
          </div>

          {/* Conical Swirling Desert Sand Blast */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-25"
            style={{ animation: 'gbaSandshrewSandBlast 1.55s ease-out forwards' }}
          >
            <svg width="160" height="160" viewBox="0 0 160 160">
              <path d="M 20 80 Q 80 20 140 60 Q 150 110 80 130 Q 30 130 20 80 Z" fill="url(#sandBlastGrad)" opacity="0.85" />
              <defs>
                <radialGradient id="sandBlastGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#d97706" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#92400e" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* Flying Abrasive Sand Pellets */}
          {[
            { x: '-45px', y: '-35px', s: 3 }, { x: '45px', y: '-35px', s: 4 },
            { x: '-50px', y: '20px', s: 3.5 }, { x: '50px', y: '20px', s: 3 },
            { x: '-20px', y: '-45px', s: 2.5 }, { x: '20px', y: '45px', s: 4 },
            { x: '-30px', y: '40px', s: 3 }, { x: '30px', y: '-40px', s: 2.5 }
          ].map((p, i) => (
            <div
              key={`ss-grit-${i}`}
              className="absolute pointer-events-none z-35"
              style={{
                '--ss-x': p.x,
                '--ss-y': p.y,
                animation: `gbaSandshrewGritPellets 1.55s ease-out ${0.35 + i * 0.04}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <div
                className="rounded-full bg-amber-200 border border-amber-600 shadow-[0_0_6px_#b45309]"
                style={{ width: `${p.s}px`, height: `${p.s}px` }}
              />
            </div>
          ))}

          {/* Blinding Sandstorm Accuracy Reduction Haze */}
          <div
            className="absolute inset-0 pointer-events-none z-20 backdrop-blur-[2.5px]"
            style={{
              animation: 'gbaSandshrewBlindingHaze 1.55s ease-out forwards',
              background: 'radial-gradient(circle, rgba(217,119,6,0.35) 0%, rgba(180,83,9,0.25) 60%, transparent 85%)'
            }}
          />
        </div>
      )}

      {/* 20ay. CATERPIE STRING SHOT (Caterpie Lv. 13 — 1996 Ken Sugimori Osmeterium Head & Sticky Silk Jet) */}
      {fx.type === 'caterpie_string_shot' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Authentic 1996 Ken Sugimori Caterpie Head with Red-Orange Osmeterium */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaCaterpieHeadPop 1.65s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Caterpie_Head_Osmeterium.png"
              alt="Caterpie Head Osmeterium"
              className="w-40 h-40 object-contain drop-shadow-[0_0_25px_#22c55e]"
            />
          </div>

          {/* High-Velocity Swirling Silk Strand Jets */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-35"
            style={{ animation: 'gbaCaterpieSilkJet 1.65s ease-out forwards' }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150">
              <path d="M 20 130 Q 50 80 80 70 Q 120 60 140 20" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" className="drop-shadow-[0_0_10px_#e0f2fe]" />
              <path d="M 30 140 Q 60 100 90 85 Q 130 70 145 35" fill="none" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 10 115 Q 40 70 70 60 Q 110 50 130 10" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Criss-Cross Silk Cocoon Web Wrap */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-25"
            style={{ animation: 'gbaCaterpieCocoonWrap 1.65s ease-out forwards' }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150">
              <line x1="20" y1="20" x2="130" y2="130" stroke="#f8fafc" strokeWidth="3" strokeDasharray="6,4" opacity="0.85" />
              <line x1="130" y1="20" x2="20" y2="130" stroke="#f8fafc" strokeWidth="3" strokeDasharray="6,4" opacity="0.85" />
              <line x1="10" y1="75" x2="140" y2="75" stroke="#e2e8f0" strokeWidth="2.5" strokeDasharray="8,5" opacity="0.8" />
              <line x1="75" y1="10" x2="75" y2="140" stroke="#e2e8f0" strokeWidth="2.5" strokeDasharray="8,5" opacity="0.8" />
            </svg>
          </div>

          {/* Scattered Viscous Silk Droplets */}
          {[
            { x: '-35px', y: '-32px' }, { x: '35px', y: '-32px' },
            { x: '-42px', y: '25px' }, { x: '42px', y: '25px' },
            { x: '0px', y: '-40px' }, { x: '0px', y: '40px' }
          ].map((p, i) => (
            <div
              key={`cp-silk-${i}`}
              className="absolute pointer-events-none z-35"
              style={{
                '--cp-x': p.x,
                '--cp-y': p.y,
                animation: `gbaCaterpieSilkDrops 1.65s ease-out ${0.38 + i * 0.05}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white border border-slate-200 shadow-[0_0_8px_#ffffff]" />
            </div>
          ))}
        </div>
      )}

      {/* 20az. WEEDLE POISON STING (Weedle Lv. 12 — 1996 Ken Sugimori Poison Horn Dive & Acid Spurt) */}
      {fx.type === 'weedle_poison_sting' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Authentic 1996 Ken Sugimori Weedle Head & Stinger */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-30"
            style={{ animation: 'gbaWeedleStingerDive 1.55s cubic-bezier(0.18, 1, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Weedle_Poison_Stinger.png"
              alt="Weedle Poison Stinger"
              className="w-40 h-40 object-contain drop-shadow-[0_0_25px_#a855f7]"
            />
          </div>

          {/* High-Pressure Corrosive Phosphor Venom Spurts */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-35"
            style={{ animation: 'gbaWeedlePoisonSpurt 1.55s ease-out forwards' }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="14" fill="#a855f7" className="drop-shadow-[0_0_15px_#c084fc]" />
              <circle cx="60" cy="60" r="7" fill="#84cc16" />
              <circle cx="45" cy="40" r="4" fill="#a855f7" />
              <circle cx="75" cy="40" r="4" fill="#a855f7" />
              <circle cx="35" cy="70" r="3.5" fill="#84cc16" />
              <circle cx="85" cy="70" r="3.5" fill="#84cc16" />
            </svg>
          </div>

          {/* Toxic Intoxication Purple Vignette Pulse */}
          <div
            className="absolute w-44 h-44 rounded-full pointer-events-none z-20"
            style={{
              animation: 'gbaWeedlePoisonVignette 1.55s ease-out forwards',
              background: 'radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(126,34,206,0.3) 55%, transparent 80%)'
            }}
          />
        </div>
      )}

      {/* 20ba. ZUBAT SUPERSONIC (Zubat Lv. 10 — Concentric Ultrasonic Echolocation Rings & Trance Warp) */}
      {fx.type === 'zubat_supersonic' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Triple Concentric High-Frequency Sonic Wave Rings */}
          <div
            className="absolute w-24 h-24 rounded-full border-2 border-cyan-300 pointer-events-none z-30"
            style={{ animation: 'gbaZubatSonicRings1 1.6s ease-out forwards' }}
          />
          <div
            className="absolute w-24 h-24 rounded-full border-2 border-indigo-400 pointer-events-none z-30"
            style={{ animation: 'gbaZubatSonicRings2 1.6s ease-out 0.15s forwards' }}
          />
          <div
            className="absolute w-24 h-24 rounded-full border-2 border-teal-200 pointer-events-none z-30"
            style={{ animation: 'gbaZubatSonicRings3 1.6s ease-out 0.3s forwards' }}
          />

          {/* Frequency Oscillation Sound Bar Waves */}
          <div
            className="absolute flex items-center justify-center pointer-events-none z-35"
            style={{ animation: 'gbaZubatFrequencyBars 1.6s ease-out forwards' }}
          >
            <svg width="140" height="80" viewBox="0 0 140 80">
              <path d="M 10 40 Q 30 10 50 40 Q 70 70 90 40 Q 110 10 130 40" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_0_12px_#38bdf8]" />
              <path d="M 20 40 Q 40 20 60 40 Q 80 60 100 40 Q 120 20 140 40" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            </svg>
          </div>

          {/* Optical Confusion Trance Blur */}
          <div
            className="absolute inset-0 pointer-events-none z-20 backdrop-blur-[3px]"
            style={{
              animation: 'gbaZubatConfusionDistort 1.6s ease-out forwards',
              background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, rgba(99,102,241,0.2) 60%, transparent 85%)'
            }}
          />
        </div>
      )}

      {/* 20bb. GASTLY SLEEPING GAS (Gastly Lv. 8 — Swirling Spectral Ectoplasm & Hypnotic Sleep Spores) */}
      {fx.type === 'gastly_sleeping_gas' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Swirling Spectral Ectoplasmic Gas Cloud */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-25"
            style={{ animation: 'gbaGastlySleepGasCloud 1.7s ease-out forwards' }}
          >
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="55" fill="url(#gastlyGasGrad)" opacity="0.85" className="drop-shadow-[0_0_25px_#7c3aed]" />
              <circle cx="65" cy="65" r="30" fill="#2e1065" opacity="0.9" />
              {/* Gastly Triangular Hypnotic Eyes */}
              <polygon points="50,55 68,60 55,70" fill="#ffffff" />
              <polygon points="80,60 98,55 93,70" fill="#ffffff" />
              <defs>
                <radialGradient id="gastlyGasGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e1b4b" />
                  <stop offset="50%" stopColor="#6b21a8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* Floating Dream Motes with Subtle Zzz Drift */}
          {[
            { x: '-32px', y: '-35px' }, { x: '32px', y: '-35px' },
            { x: '-25px', y: '25px' }, { x: '25px', y: '25px' }
          ].map((p, i) => (
            <div
              key={`gs-mote-${i}`}
              className="absolute pointer-events-none z-35"
              style={{
                '--gs-x': p.x,
                '--gs-y': p.y,
                animation: `gbaGastlyDreamMotes 1.7s ease-out ${0.4 + i * 0.08}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <div className="w-4 h-4 rounded-full bg-violet-300 border border-white shadow-[0_0_12px_#c084fc] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-900" />
              </div>
            </div>
          ))}

          {/* Deep Somnolence Hypnotic Pulse */}
          <div
            className="absolute w-44 h-44 rounded-full pointer-events-none z-20"
            style={{
              animation: 'gbaGastlyMistPulse 1.7s ease-out forwards',
              background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, rgba(91,33,182,0.3) 55%, transparent 80%)'
            }}
          />
        </div>
      )}

      {/* 20bc. RATTATA QUICK ATTACK (Compact High-Velocity Diagonal Zigzag Flash) */}
      {fx.type === 'rattata_quick_attack' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Lightning Speed Zigzag Slash Line (<= 60% Card Width) */}
          <div
            className="absolute pointer-events-none z-30"
            style={{ animation: 'gbaRattataZigZagTrail 1.55s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
          >
            <svg width="72" height="72" viewBox="0 0 72 72">
              <polyline
                points="10,62 30,36 44,46 64,10"
                fill="none"
                stroke="#ffffff"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_10px_#fde047]"
              />
              <polyline
                points="10,62 30,36 44,46 64,10"
                fill="none"
                stroke="#facc15"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* High-Impact Starburst */}
          <div className="absolute flex items-center justify-center pointer-events-none z-35">
            <svg width="48" height="48" viewBox="0 0 48 48" className="animate-ping" style={{ animationDuration: '0.7s' }}>
              <polygon points="24,4 29,19 44,24 29,29 24,44 19,29 4,24 19,19" fill="#ffffff" className="drop-shadow-[0_0_12px_#ffffff]" />
              <polygon points="24,10 27,21 38,24 27,27 24,38 21,27 10,24 21,21" fill="#fef08a" />
            </svg>
          </div>
        </div>
      )}

      {/* 20bd. RATTATA GNAW / BITE (Dedicated Rodent Buck Incisor Crunch) */}
      {fx.type === 'rattata_gnaw_bite' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Upper Buck Incisors (Compact) */}
          <div
            className="absolute pointer-events-none z-30"
            style={{ animation: 'gbaRattataIncisorTop 1.5s ease-out forwards' }}
          >
            <svg width="48" height="32" viewBox="0 0 48 32">
              <path
                d="M 8 3 L 40 3 C 40 3 38 24 36 27 C 34 30 26 30 25 27 L 24 6 L 23 27 C 22 30 14 30 12 27 C 10 24 8 3 8 3 Z"
                fill="#fef3c7"
                stroke="#78350f"
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_8px_#fbbf24]"
              />
              <line x1="24" y1="6" x2="24" y2="28" stroke="#b45309" strokeWidth="1.8" />
              <path d="M 13 8 L 14 20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              <path d="M 34 8 L 35 20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            </svg>
          </div>

          {/* Lower Buck Incisors */}
          <div
            className="absolute pointer-events-none z-30"
            style={{ animation: 'gbaRattataIncisorBottom 1.5s ease-out forwards' }}
          >
            <svg width="42" height="26" viewBox="0 0 42 26">
              <path
                d="M 9 23 L 33 23 C 33 23 32 6 30 4 C 28 2 22 2 21 4 L 21 20 L 20 4 C 19 2 13 2 11 4 C 9 6 9 23 9 23 Z"
                fill="#fffbeb"
                stroke="#78350f"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <line x1="21" y1="4" x2="21" y2="21" stroke="#b45309" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Comic Crunch Sparkles */}
          {[
            { x: '-16px', y: '-8px' }, { x: '16px', y: '-8px' },
            { x: '0px', y: '12px' }
          ].map((p, i) => (
            <div
              key={`rt-spark-${i}`}
              className="absolute pointer-events-none z-35 animate-ping"
              style={{
                transform: `translate(${p.x}, ${p.y})`,
                animationDuration: '0.5s',
                animationDelay: '0.35s'
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b]" />
            </div>
          ))}
        </div>
      )}

      {/* 20be. PIDGEY WHIRLWIND (Ascending Funnel & Authentic Ken Sugimori Down-Feathers) */}
      {fx.type === 'pidgey_whirlwind' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Swirling Aerodynamic Funnel (<= 60% Card Width) */}
          <div
            className="absolute pointer-events-none z-25 flex items-center justify-center"
            style={{ animation: 'gbaPidgeyVortexCone 1.65s ease-out forwards' }}
          >
            <svg width="74" height="74" viewBox="0 0 74 74">
              <ellipse cx="37" cy="37" rx="33" ry="17" fill="none" stroke="#bae6fd" strokeWidth="2.5" strokeDasharray="8 4" className="drop-shadow-[0_0_10px_#38bdf8]" />
              <ellipse cx="37" cy="37" rx="22" ry="11" fill="none" stroke="#e0f2fe" strokeWidth="2" strokeDasharray="6 3" />
              <ellipse cx="37" cy="37" rx="12" ry="5" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>

          {/* 4 Fluttering Down-Feathers */}
          {[
            { fx: '-18px', fy: '-12px', fr: '120deg', delay: 0.1 },
            { fx: '18px', fy: '-15px', fr: '-110deg', delay: 0.2 },
            { fx: '-14px', fy: '14px', fr: '160deg', delay: 0.25 },
            { fx: '14px', fy: '12px', fr: '-150deg', delay: 0.35 }
          ].map((f, i) => (
            <div
              key={`pidgey-feather-${i}`}
              className="absolute pointer-events-none z-35"
              style={{
                '--p-fx': f.fx,
                '--p-fy': f.fy,
                '--p-fr': f.fr,
                animation: `gbaPidgeyFeatherDrift 1.65s cubic-bezier(0.2, 0.8, 0.4, 1) ${f.delay}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <svg width="18" height="24" viewBox="0 0 34 48">
                <path
                  d="M 17 4 C 8 16, 4 32, 17 44 C 30 32, 26 16, 17 4 Z"
                  fill="#fef3c7"
                  stroke="#78350f"
                  strokeWidth="2.2"
                  className="drop-shadow-[0_0_6px_#fde68a]"
                />
                <path d="M 17 12 C 12 22, 10 32, 17 42 Z" fill="#d97706" opacity="0.35" />
                <line x1="17" y1="4" x2="17" y2="46" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 20bf. MEOWTH PAY DAY (3D Koban Gold Coin Flip & Shimmer Shockwave) */}
      {fx.type === 'meowth_pay_day' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Tumbling 3D Authentic Japanese Koban Gold Coin (<= 60% Card Width) */}
          <div
            className="absolute pointer-events-none z-30"
            style={{ animation: 'gbaMeowthKobanToss 1.65s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <svg width="36" height="50" viewBox="0 0 80 110" className="drop-shadow-[0_0_14px_#fbbf24]">
              <rect x="6" y="6" width="68" height="98" rx="34" ry="34" fill="url(#meowthKobanGradMini)" stroke="#78350f" strokeWidth="3.5" />
              <line x1="20" y1="26" x2="60" y2="26" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
              <line x1="14" y1="36" x2="66" y2="36" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
              <line x1="14" y1="74" x2="66" y2="74" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
              <line x1="20" y1="84" x2="60" y2="84" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
              <rect x="28" y="46" width="24" height="18" rx="3" fill="#fbbf24" stroke="#78350f" strokeWidth="2.5" />
              <line x1="33" y1="55" x2="47" y2="55" stroke="#78350f" strokeWidth="2.5" />
              <line x1="40" y1="49" x2="40" y2="61" stroke="#78350f" strokeWidth="2.5" />
              <path d="M 20 16 Q 40 10 60 16" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85" />
              <defs>
                <linearGradient id="meowthKobanGradMini" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Golden Impact Wave Ring */}
          <div
            className="absolute w-20 h-20 rounded-full border-2 border-amber-300 pointer-events-none z-25"
            style={{ animation: 'gbaMeowthCoinRing 1.65s ease-out 0.45s forwards', opacity: 0 }}
          />

          {/* Radiating Golden Shimmer Diamonds */}
          {[
            { x: '-20px', y: '-16px' }, { x: '20px', y: '-16px' },
            { x: '-18px', y: '16px' }, { x: '18px', y: '16px' }
          ].map((p, i) => (
            <div
              key={`meowth-spark-${i}`}
              className="absolute pointer-events-none z-35 animate-ping"
              style={{
                transform: `translate(${p.x}, ${p.y})`,
                animationDuration: '0.6s',
                animationDelay: `${0.5 + i * 0.06}s`
              }}
            >
              <div className="w-2.5 h-2.5 rotate-45 bg-amber-200 border border-white shadow-[0_0_8px_#fbbf24]" />
            </div>
          ))}
        </div>
      )}

      {/* 20bg. MEOWTH COIN HURL (Rapid-Fire Volley of Koban Coins) */}
      {fx.type === 'meowth_coin_hurl' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {[
            { ox: '-28px', oy: '-24px', tx: '-10px', ty: '-10px', delay: 0.1 },
            { ox: '28px', oy: '-20px', tx: '10px', ty: '-6px', delay: 0.25 },
            { ox: '-22px', oy: '22px', tx: '-8px', ty: '8px', delay: 0.4 },
            { ox: '22px', oy: '18px', tx: '8px', ty: '6px', delay: 0.55 }
          ].map((c, i) => (
            <div
              key={`coin-hurl-${i}`}
              className="absolute pointer-events-none z-30"
              style={{
                '--c-ox': c.ox,
                '--c-oy': c.oy,
                '--c-tx': c.tx,
                '--c-ty': c.ty,
                animation: `gbaMeowthCoinHurl 1.65s cubic-bezier(0.2, 0.8, 0.3, 1) ${c.delay}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <svg width="24" height="34" viewBox="0 0 80 110" className="drop-shadow-[0_0_10px_#fde047]">
                <rect x="6" y="6" width="68" height="98" rx="34" ry="34" fill="#fbbf24" stroke="#78350f" strokeWidth="4" />
                <line x1="20" y1="36" x2="60" y2="36" stroke="#b45309" strokeWidth="3.5" />
                <line x1="20" y1="74" x2="60" y2="74" stroke="#b45309" strokeWidth="3.5" />
                <rect x="30" y="48" width="20" height="14" rx="2" fill="#fef08a" stroke="#78350f" strokeWidth="2.5" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 20bh. SPEAROW PECK (Rapid-Fire Triple Spearhead Beak Thrust) */}
      {fx.type === 'spearow_peck' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Sharp Darting Spearhead Beak (<= 60% Card Width) */}
          <div
            className="absolute pointer-events-none z-30"
            style={{ animation: 'gbaSpearowTriplePeck 1.55s cubic-bezier(0.2, 1, 0.3, 1) forwards' }}
          >
            <svg width="44" height="44" viewBox="0 0 85 85" className="drop-shadow-[0_0_12px_#f59e0b]">
              <polygon points="10,75 75,10 65,5 20,40" fill="#f97316" stroke="#78350f" strokeWidth="4" strokeLinejoin="round" />
              <polygon points="10,75 55,55 35,70" fill="#fbbf24" stroke="#78350f" strokeWidth="3" strokeLinejoin="round" />
              <line x1="20" y1="65" x2="68" y2="16" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
            </svg>
          </div>

          {/* Kinetic Puncture Wind Ripples */}
          <div className="absolute flex items-center justify-center pointer-events-none z-25">
            <svg width="48" height="48" viewBox="0 0 110 110" className="animate-ping" style={{ animationDuration: '0.5s' }}>
              <polygon points="55,15 70,45 100,55 70,65 55,95 40,65 10,55 40,45" fill="none" stroke="#facc15" strokeWidth="4" />
            </svg>
          </div>
        </div>
      )}

      {/* 20bi. SPEAROW MIRROR MOVE (Hexagonal Prismatic Reflection Barrier) */}
      {fx.type === 'spearow_mirror_move' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Prismatic Hexagonal Mirror Shield (<= 60% Card Width) */}
          <div
            className="absolute pointer-events-none z-30 flex items-center justify-center"
            style={{ animation: 'gbaSpearowMirrorGleam 1.65s ease-out forwards' }}
          >
            <svg width="74" height="74" viewBox="0 0 160 160">
              <polygon
                points="80,15 140,45 140,115 80,145 20,115 20,45"
                fill="url(#mirrorGlassGradMini)"
                stroke="#ffffff"
                strokeWidth="4"
                className="drop-shadow-[0_0_16px_#c084fc]"
                opacity="0.9"
              />
              <line x1="80" y1="15" x2="80" y2="145" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
              <line x1="20" y1="45" x2="140" y2="115" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
              <line x1="20" y1="115" x2="140" y2="45" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
              <path d="M 35 55 L 75 25 L 125 75 L 85 105 Z" fill="#ffffff" opacity="0.35" />
              <defs>
                <linearGradient id="mirrorGlassGradMini" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#c084fc" stopOpacity="0.75" />
                  <stop offset="70%" stopColor="#f472b6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}

      {/* 20bj. POLIWAG & POLIWHIRL WATER GUN (Focused Pressurized Water Jet & Intensity Scaling) */}
      {fx.type === 'poliwag_water_gun' && (() => {
        const wi = Math.max(1, fx.intensity ?? 1);
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
            {/* Compact Belly Spiral Focusing Emitter Lens (<= 60% Card Width) */}
            <div
              className="absolute -left-2 pointer-events-none z-25 flex items-center justify-center"
              style={{ animation: 'gbaPoliwagBellySpiral 1.65s cubic-bezier(0.1, 0.9, 0.2, 1) forwards' }}
            >
              <svg width="38" height="38" viewBox="0 0 75 75">
                <circle cx="37" cy="37" r="32" fill="#f0f9ff" stroke="#0284c7" strokeWidth="3" className="drop-shadow-[0_0_8px_#0284c7]" />
                <path
                  d="M 37 37 Q 42 37 42 32 Q 42 25 32 25 Q 22 25 22 37 Q 22 52 37 52 Q 57 52 57 32 Q 57 15 37 15 Q 15 15 15 37 Q 15 62 37 62"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Focused Pressurized High-Velocity Water Jet Stream (scaled with wi) */}
            <div
              className="absolute pointer-events-none z-30 flex items-center justify-center"
              style={{ animation: 'gbaPoliwagJetStream 1.65s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
            >
              <svg
                width={Math.round(66 * Math.min(1.45, wi))}
                height={Math.round(22 * Math.min(1.45, wi))}
                viewBox="0 0 66 22"
                style={{ filter: `drop-shadow(0 0 ${Math.round(5 + (wi - 1) * 8)}px #0ea5e9)` }}
              >
                {/* Cylindrical pressurized water bullet */}
                <path
                  d="M 2 11 Q 20 6, 44 8 L 64 11 L 44 14 Q 20 16, 2 11 Z"
                  fill="url(#poliJetGradMini)"
                  stroke="#0284c7"
                  strokeWidth={1.8 * wi}
                />
                {/* Core white speed beam */}
                <line x1="6" y1="11" x2="58" y2="11" stroke="#e0f2fe" strokeWidth={1.6 * wi} strokeLinecap="round" opacity="0.9" />
                <defs>
                  <linearGradient id="poliJetGradMini" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#7dd3fc" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Directional Forward Impact Splash Crown (NOT lawn sprinkler dots) */}
            <div
              className="absolute right-1"
              style={{ animation: 'gbaWaterSplashImpact 1.2s ease-out 0.35s forwards', opacity: 0 }}
            >
              <svg width={Math.round(36 * wi)} height={Math.round(30 * wi)} viewBox="0 0 36 30">
                <path d="M 18 26 Q 11 16, 6 6 Q 10 13, 14 20" fill="none" stroke="#7dd3fc" strokeWidth={2 * wi} strokeLinecap="round" opacity="0.9" />
                <path d="M 18 26 Q 23 14, 30 4 Q 26 13, 22 20" fill="none" stroke="#38bdf8" strokeWidth={2 * wi} strokeLinecap="round" opacity="0.85" />
                <path d="M 18 26 Q 18 13, 18 3" fill="none" stroke="#e0f2fe" strokeWidth={1.8 * wi} strokeLinecap="round" opacity="0.9" />
                <circle cx="6" cy="5" r={1.8 * wi} fill="#bae6fd" />
                <circle cx="30" cy="4" r={1.6 * wi} fill="#38bdf8" />
                <circle cx="18" cy="2" r={1.4 * wi} fill="#e0f2fe" />
                {wi > 1.15 && <circle cx="12" cy="9" r={1.5 * wi} fill="#7dd3fc" />}
                {wi > 1.28 && <circle cx="24" cy="8" r={1.4 * wi} fill="#bae6fd" />}
              </svg>
            </div>
          </div>
        );
      })()}

      {/* 20bk. GEODUDE STONE BARRAGE (Sequential Granite Boulder Volley & Ground Tremor) */}
      {fx.type === 'geodude_stone_barrage' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* 3 Sequential Falling Boulders (<= 60% Card Width) */}
          {[
            { bx: '-18px', br: '25deg', delay: 0.1 },
            { bx: '16px', br: '-30deg', delay: 0.3 },
            { bx: '0px', br: '60deg', delay: 0.5 }
          ].map((b, i) => (
            <div
              key={`geo-boulder-${i}`}
              className="absolute pointer-events-none z-30"
              style={{
                '--gb-x': b.bx,
                '--gb-r': b.br,
                animation: `gbaGeodudeBoulderFall 1.7s cubic-bezier(0.2, 0.8, 0.4, 1) ${b.delay}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <svg width="34" height="34" viewBox="0 0 75 75" className="drop-shadow-[0_0_10px_#78716c]">
                <polygon
                  points="20,10 55,15 70,40 58,68 25,65 10,42"
                  fill="#64748b"
                  stroke="#1e293b"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
                <polygon points="20,10 40,35 25,65 10,42" fill="#78716c" opacity="0.6" />
                <polygon points="55,15 70,40 40,35" fill="#475569" />
                <polygon points="20,10 40,35 55,15" fill="#94a3b8" />
                <polyline points="20,10 55,15 70,40" fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          ))}

          {/* Earth Dust Shockwave */}
          <div
            className="absolute w-18 h-18 rounded-full border-2 border-stone-400 pointer-events-none z-20"
            style={{ animation: 'gbaGeodudeDustShockwave 1.7s ease-out 0.5s forwards', opacity: 0 }}
          />
        </div>
      )}

      {/* 20bl. VULPIX CONFUSE RAY (Mystical Kitsunebi Fox-Fire Orbit & Hypnotic Waves) */}
      {fx.type === 'vulpix_confuse_ray' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Revolving Kitsunebi Fox-Fire Tri-Wisp Formation (<= 60% Card Width) */}
          <div
            className="absolute w-20 h-20 pointer-events-none z-30 flex items-center justify-center"
            style={{ animation: 'gbaVulpixFoxFireOrbit 1.7s cubic-bezier(0.15, 0.85, 0.3, 1) forwards' }}
          >
            {[0, 120, 240].map((deg, i) => (
              <div
                key={`foxfire-${i}`}
                className="absolute pointer-events-none"
                style={{ transform: `rotate(${deg}deg) translate(26px) rotate(-${deg}deg)` }}
              >
                <svg width="20" height="26" viewBox="0 0 45 55" className="drop-shadow-[0_0_10px_#f97316]">
                  <path
                    d="M 22 4 C 10 18, 5 32, 22 52 C 40 32, 35 18, 22 4 Z"
                    fill="#ea580c"
                    stroke="#7c2d12"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M 22 14 C 14 24, 10 34, 22 46 C 34 34, 30 24, 22 14 Z"
                    fill="#fef08a"
                  />
                  <path d="M 22 4 Q 28 0 32 6" stroke="#c084fc" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            ))}
          </div>

          {/* Hypnotic Concentric Confusion Pulse */}
          <div
            className="absolute w-20 h-20 rounded-full pointer-events-none z-20"
            style={{
              animation: 'gbaVulpixHypnoWave 1.7s ease-out 0.4s forwards',
              background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(168,85,247,0.2) 50%, transparent 75%)',
              opacity: 0
            }}
          />
        </div>
      )}

      {/* 20bm. ODDISH STUN SPORE (Leafy Bulb Shake & Electrostatic Golden Spore Shower) */}
      {fx.type === 'oddish_stun_spore' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Shaking 5-Lobed Leaf Bulb (<= 60% Card Width) */}
          <div
            className="absolute -top-5 pointer-events-none z-25"
            style={{ animation: 'gbaOddishBulbShake 1.65s ease-in-out forwards' }}
          >
            <svg width="48" height="38" viewBox="0 0 110 90">
              <ellipse cx="55" cy="30" rx="14" ry="28" fill="#16a34a" stroke="#14532d" strokeWidth="3" />
              <ellipse cx="32" cy="40" rx="12" ry="24" fill="#22c55e" stroke="#14532d" strokeWidth="3" transform="rotate(-25 32 40)" />
              <ellipse cx="78" cy="40" rx="12" ry="24" fill="#22c55e" stroke="#14532d" strokeWidth="3" transform="rotate(25 78 40)" />
              <ellipse cx="18" cy="55" rx="10" ry="20" fill="#4ade80" stroke="#14532d" strokeWidth="3" transform="rotate(-50 18 55)" />
              <ellipse cx="92" cy="55" rx="10" ry="20" fill="#4ade80" stroke="#14532d" strokeWidth="3" transform="rotate(50 92 55)" />
            </svg>
          </div>

          {/* Drifting Golden Electrostatic Spores */}
          {[
            { ox: '-18px', dx: '-6px', delay: 0.15 },
            { ox: '-8px', dx: '4px', delay: 0.2 },
            { ox: '6px', dx: '-5px', delay: 0.25 },
            { ox: '16px', dx: '6px', delay: 0.3 },
            { ox: '-12px', dx: '8px', delay: 0.35 },
            { ox: '10px', dx: '-10px', delay: 0.4 }
          ].map((s, i) => (
            <div
              key={`oddish-spore-${i}`}
              className="absolute pointer-events-none z-35"
              style={{
                '--os-ox': s.ox,
                '--os-dx': s.dx,
                animation: `gbaOddishSporeFall 1.65s cubic-bezier(0.2, 0.7, 0.4, 1) ${s.delay}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <div className="w-2 h-2 rounded-full bg-yellow-300 border border-white shadow-[0_0_6px_#facc15] flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-amber-500" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 20bn. ODDISH SPROUT (Botanical Emergence & Radiant Nature Seedling) */}
      {fx.type === 'oddish_sprout' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Emerging Seedling (<= 60% Card Width) */}
          <div
            className="absolute pointer-events-none z-30"
            style={{ animation: 'gbaOddishSproutRise 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <svg width="42" height="42" viewBox="0 0 90 90" className="drop-shadow-[0_0_12px_#4ade80]">
              <ellipse cx="45" cy="75" rx="35" ry="10" fill="#78350f" stroke="#451a03" strokeWidth="3" />
              <path d="M 45 75 Q 43 55 45 40" stroke="#16a34a" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              <path d="M 45 42 C 30 35, 20 45, 22 52 C 28 55, 42 50, 45 42 Z" fill="#4ade80" stroke="#14532d" strokeWidth="2.5" />
              <path d="M 45 42 C 60 35, 70 45, 68 52 C 62 55, 48 50, 45 42 Z" fill="#22c55e" stroke="#14532d" strokeWidth="2.5" />
              <circle cx="28" cy="45" r="3" fill="#ffffff" />
            </svg>
          </div>
        </div>
      )}

      {/* 20bo. JIGGLYPUFF LULLABY (Floating Watercolor Notes, Sleep Runes & Fairy Dream Dust) */}
      {fx.type === 'jigglypuff_lullaby' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Main Watercolor Musical Notes & Microphone (<= 60% Card Width) */}
          <div
            className="absolute pointer-events-none z-30 flex items-center justify-center"
            style={{ animation: 'gbaJigglypuffLullabyNotes 1.75s cubic-bezier(0.2, 0.8, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Jigglypuff_Lullaby_Notes.png"
              alt="Jigglypuff Lullaby"
              className="max-w-[70px] max-h-[70px] object-contain drop-shadow-[0_0_12px_rgba(244,114,182,0.85)]"
            />
          </div>

          {/* Floating Pastel Eighth Notes */}
          {[
            { note: '♪', color: '#f472b6', x: '-22px', y: '-10px', delay: 0.2 },
            { note: '♫', color: '#38bdf8', x: '24px', y: '-18px', delay: 0.4 },
            { note: '♪', color: '#fef08a', x: '18px', y: '16px', delay: 0.6 }
          ].map((n, i) => (
            <div
              key={`jigg-note-${i}`}
              className="absolute text-lg font-bold pointer-events-none z-35 select-none"
              style={{
                color: n.color,
                left: `calc(50% + ${n.x})`,
                top: `calc(50% + ${n.y})`,
                filter: `drop-shadow(0 0 6px ${n.color})`,
                animation: `gbaJigglypuffLullabyNotes 1.6s ease-in-out ${n.delay}s forwards`,
                opacity: 0
              }}
            >
              {n.note}
            </div>
          ))}

          {/* Drifting "Zzz" Sleep Runes */}
          {[
            { dx: '-14px', delay: 0.35, size: 'text-xs' },
            { dx: '6px', delay: 0.55, size: 'text-sm' },
            { dx: '18px', delay: 0.75, size: 'text-base' }
          ].map((z, i) => (
            <div
              key={`jigg-zzz-${i}`}
              className={`absolute font-black tracking-widest text-purple-200 pointer-events-none z-40 select-none ${z.size}`}
              style={{
                '--zzz-dx': z.dx,
                animation: `gbaJigglypuffSleepZzz 1.7s ease-out ${z.delay}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              Z
            </div>
          ))}

          {/* Soft Fairy Dust Sleep Halo */}
          <div
            className="absolute w-20 h-20 rounded-full pointer-events-none z-20"
            style={{
              background: 'radial-gradient(circle, rgba(244,114,182,0.35) 0%, rgba(56,189,248,0.2) 50%, transparent 75%)',
              animation: 'gbaClefairySingPulse 1.75s ease-out forwards'
            }}
          />
        </div>
      )}

      {/* 20bp. JIGGLYPUFF POUND (Cute Puffy Slap & Pink Comic Starburst) */}
      {fx.type === 'jigglypuff_pound' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="absolute pointer-events-none z-30"
            style={{ animation: 'gbaJigglypuffPound 1.1s cubic-bezier(0.18, 0.9, 0.3, 1) forwards' }}
          >
            <svg width="48" height="48" viewBox="0 0 70 70" className="drop-shadow-[0_0_12px_#f43f5e]">
              <circle cx="35" cy="35" r="24" fill="#fbcfe8" stroke="#f43f5e" strokeWidth="3" />
              <ellipse cx="35" cy="40" rx="10" ry="7" fill="#fb7185" />
              <circle cx="25" cy="27" r="4" fill="#fb7185" />
              <circle cx="35" cy="23" r="4.5" fill="#fb7185" />
              <circle cx="45" cy="27" r="4" fill="#fb7185" />
            </svg>
          </div>
          <div className="absolute pointer-events-none z-35" style={{ animation: 'gbaGuillotineFlash 1.1s ease-out 0.25s forwards', opacity: 0 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
              <polygon points="30,5 37,22 55,22 41,34 46,51 30,41 14,51 19,34 5,22 23,22" fill="#fda4af" stroke="#e11d48" strokeWidth="2" />
            </svg>
          </div>
        </div>
      )}

      {/* 20bq. CLEFAIRY METRONOME (Wagging Metronome Finger & Cosmic Twinkle Burst) */}
      {fx.type === 'clefairy_metronome' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Main Wagging Metronome Finger (<= 60% Card Width) */}
          <div
            className="absolute pointer-events-none z-30 flex items-center justify-center"
            style={{ animation: 'gbaClefairyMetronomeWag 1.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards' }}
          >
            <img
              src="/assets/Clefairy_Metronome_Finger.png"
              alt="Clefairy Metronome"
              className="max-w-[68px] max-h-[68px] object-contain drop-shadow-[0_0_14px_rgba(236,72,153,0.9)]"
            />
          </div>

          {/* Rhythmic Cosmic Starlight Bursts radiating from fingertip */}
          {[
            { sx: '-18px', sy: '-24px', color: '#ec4899', delay: 0.25 },
            { sx: '20px', sy: '-22px', color: '#a855f7', delay: 0.55 },
            { sx: '-14px', sy: '-28px', color: '#38bdf8', delay: 0.85 },
            { sx: '16px', sy: '-26px', color: '#fef08a', delay: 1.15 },
            { sx: '0px', sy: '-34px', color: '#ffffff', delay: 1.45 }
          ].map((s, i) => (
            <div
              key={`clef-star-${i}`}
              className="absolute pointer-events-none z-35"
              style={{
                '--star-x': s.sx,
                '--star-y': s.sy,
                '--star-color': s.color,
                animation: `gbaClefairyCosmicTwinkle 1.6s ease-out ${s.delay}s forwards`,
                opacity: 0
              } as React.CSSProperties}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M12,2 L14.5,9.5 L22,12 L14.5,14.5 L12,22 L9.5,14.5 L2,12 L9.5,9.5 Z" fill={s.color} stroke="#ffffff" strokeWidth="1" />
              </svg>
            </div>
          ))}

          {/* Harmonic Cosmic Starlight Ripple Ring */}
          <div
            className="absolute w-20 h-20 rounded-full border border-pink-300 pointer-events-none z-20"
            style={{
              animation: 'gbaClefairySingPulse 1.8s ease-out 0.4s forwards',
              boxShadow: '0 0 16px #ec4899',
              opacity: 0
            }}
          />
        </div>
      )}

      {/* 20br. CLEFAIRY SING (Melodic Starlight Arcs & Lullaby Pulse) */}
      {fx.type === 'clefairy_sing' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="absolute w-20 h-20 rounded-full pointer-events-none z-25"
            style={{
              background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(168,85,247,0.2) 50%, transparent 75%)',
              animation: 'gbaClefairySingPulse 1.65s ease-out forwards'
            }}
          />
          <div className="absolute pointer-events-none z-30" style={{ animation: 'gbaJigglypuffLullabyNotes 1.65s ease-in-out forwards' }}>
            <svg width="40" height="50" viewBox="0 0 50 65" className="drop-shadow-[0_0_12px_#ec4899]">
              <path
                d="M 28 8 C 24 8, 20 16, 20 28 C 20 40, 32 44, 32 52 C 32 58, 26 62, 20 60 C 15 58, 14 52, 17 48"
                fill="none"
                stroke="#f472b6"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line x1="28" y1="4" x2="28" y2="58" stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}

      {/* 20bs. ABRA PSYSHOCK (Concentric Telekinetic Shockwave & Psychic Distortion) */}
      {fx.type === 'abra_psyshock' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="absolute w-18 h-18 rounded-full border-2 border-purple-400 pointer-events-none z-25"
            style={{ animation: 'gbaAbraTelekinesisRings 1.6s cubic-bezier(0.15, 0.85, 0.35, 1) forwards' }}
          />
          <div
            className="absolute w-14 h-14 rounded-full border-2 border-pink-400 pointer-events-none z-26"
            style={{ animation: 'gbaAbraTelekinesisRings 1.6s cubic-bezier(0.15, 0.85, 0.35, 1) 0.2s forwards', opacity: 0 }}
          />
          <div
            className="absolute pointer-events-none z-30"
            style={{ animation: 'gbaAbraPsyshockPulse 1.6s cubic-bezier(0.15, 0.85, 0.35, 1) forwards' }}
          >
            <svg width="58" height="58" viewBox="0 0 80 80" className="drop-shadow-[0_0_16px_#a855f7]">
              <circle cx="40" cy="40" r="18" fill="url(#abraPsiGradMini)" stroke="#c084fc" strokeWidth="2.5" />
              <ellipse cx="40" cy="40" rx="14" ry="7" fill="#ffffff" opacity="0.9" />
              <circle cx="40" cy="40" r="5" fill="#7e22ce" />
              <path d="M 40 18 L 36 6 L 44 8 Z" fill="#d946ef" />
              <path d="M 40 62 L 44 74 L 36 72 Z" fill="#d946ef" />
              <path d="M 18 40 L 6 44 L 8 36 Z" fill="#c084fc" />
              <path d="M 62 40 L 74 36 L 72 44 Z" fill="#c084fc" />
              <defs>
                <radialGradient id="abraPsiGradMini" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="60%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6b21a8" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}

      {/* 20bt. ABRA VANISH (Psychic Shimmer & Teleport Dissolve) */}
      {fx.type === 'abra_vanish' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="absolute pointer-events-none z-30 flex items-center justify-center"
            style={{ animation: 'gbaAbraVanish 1.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' }}
          >
            <div className="w-14 h-14 rounded-full bg-purple-500/80 border-2 border-white flex items-center justify-center shadow-[0_0_20px_#a855f7]">
              <div className="w-6 h-6 rounded-full bg-white animate-ping" />
            </div>
          </div>
        </div>
      )}

      {/* 20bu. DROWZEE POUND (Hypnotic Palm Strike & Psychic Impact) */}
      {fx.type === 'drowzee_pound' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="absolute pointer-events-none z-30"
            style={{ animation: 'gbaDrowzeePalmStrike 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
          >
            <svg width="54" height="54" viewBox="0 0 70 70" className="drop-shadow-[0_0_14px_#a855f7]">
              <ellipse cx="35" cy="42" rx="18" ry="16" fill="#eab308" stroke="#713f12" strokeWidth="3" />
              <path
                d="M 35 42 Q 38 42 38 39 Q 38 35 34 35 Q 30 35 30 42 Q 30 47 36 47 Q 42 47 42 40"
                fill="none"
                stroke="#6b21a8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <ellipse cx="20" cy="25" rx="5" ry="9" fill="#eab308" stroke="#713f12" strokeWidth="2.5" transform="rotate(-20 20 25)" />
              <ellipse cx="29" cy="20" rx="5" ry="10" fill="#eab308" stroke="#713f12" strokeWidth="2.5" transform="rotate(-6 29 20)" />
              <ellipse cx="40" cy="20" rx="5" ry="10" fill="#eab308" stroke="#713f12" strokeWidth="2.5" transform="rotate(6 40 20)" />
              <ellipse cx="50" cy="25" rx="5" ry="9" fill="#eab308" stroke="#713f12" strokeWidth="2.5" transform="rotate(20 50 25)" />
            </svg>
          </div>
        </div>
      )}

      {/* 20bv. DROWZEE CONFUSE RAY (Revolving Hypnotic Spirals & Chromatic Wave) */}
      {fx.type === 'drowzee_confuse_ray' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="absolute pointer-events-none z-30"
            style={{ animation: 'gbaDrowzeeHypnoRay 1.7s cubic-bezier(0.2, 0.8, 0.3, 1) forwards' }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60" className="drop-shadow-[0_0_14px_#d946ef]">
              <path d={CONFUSE_SPIRAL_BASE} fill="none" stroke="#d946ef" strokeWidth="3" strokeLinecap="round" />
              <path d={CONFUSE_SPIRAL_BASE} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.75" transform="rotate(180 26 26)" />
            </svg>
          </div>
        </div>
      )}

      {/* 20bw. DROWZEE NIGHTMARE (Dark Dream Haze & Eerie Shadow Eyes) */}
      {fx.type === 'drowzee_nightmare' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="absolute w-20 h-20 pointer-events-none z-30 flex items-center justify-center"
            style={{ animation: 'gbaDrowzeeNightmareHaze 1.65s ease-in-out forwards' }}
          >
            <svg width="64" height="64" viewBox="0 0 80 80" className="drop-shadow-[0_0_16px_#581c87]">
              <circle cx="40" cy="40" r="28" fill="#3b0764" opacity="0.75" />
              <circle cx="28" cy="34" r="16" fill="#581c87" opacity="0.8" />
              <circle cx="52" cy="36" r="18" fill="#581c87" opacity="0.8" />
              <path d="M 24 38 Q 30 32 36 38 Q 30 42 24 38 Z" fill="#f43f5e" />
              <path d="M 44 38 Q 50 32 56 38 Q 50 42 44 38 Z" fill="#f43f5e" />
              <circle cx="30" cy="38" r="2" fill="#ffffff" />
              <circle cx="50" cy="38" r="2" fill="#ffffff" />
            </svg>
          </div>
        </div>
      )}

      {/* 20bx. SNORLAX BODY SLAM (Massive Gravity Drop, Ground Dust & Paralysis Burst) */}
      {fx.type === 'snorlax_body_slam' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Leaping Crushing Snorlax Silhouette (<= 60% Card Width) */}
          <div
            className="absolute pointer-events-none z-30 flex items-center justify-center"
            style={{ animation: 'gbaSnorlaxBodySlamCrush 1.85s cubic-bezier(0.25, 0.1, 0.25, 1) forwards' }}
          >
            <img
              src="/assets/Snorlax_Body_Slam.png"
              alt="Snorlax Body Slam"
              className="max-w-[74px] max-h-[74px] object-contain drop-shadow-[0_0_14px_rgba(30,41,59,0.85)]"
            />
          </div>

          {/* Heavy Ground Dust Plumes blowing outward */}
          <div
            className="absolute bottom-2 pointer-events-none z-25"
            style={{
              '--dust-x': '-18px',
              animation: 'gbaSnorlaxGroundDust 1.5s ease-out 0.8s forwards',
              opacity: 0
            } as React.CSSProperties}
          >
            <div className="w-8 h-8 rounded-full bg-stone-400/80" />
          </div>
          <div
            className="absolute bottom-2 pointer-events-none z-25"
            style={{
              '--dust-x': '18px',
              animation: 'gbaSnorlaxGroundDust 1.5s ease-out 0.8s forwards',
              opacity: 0
            } as React.CSSProperties}
          >
            <div className="w-8 h-8 rounded-full bg-stone-400/80" />
          </div>

          {/* Massive Comic Impact Starburst */}
          <div
            className="absolute pointer-events-none z-35"
            style={{ animation: 'gbaGuillotineFlash 1.2s ease-out 0.85s forwards', opacity: 0 }}
          >
            <svg width="68" height="68" viewBox="0 0 80 80">
              <polygon
                points="40,5 48,28 72,20 56,38 75,55 52,56 48,78 36,60 18,72 26,50 5,42 24,30 12,12 32,20"
                fill="#f59e0b"
                stroke="#dc2626"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          {/* Yellow Paralysis Lightning Sparks on Impact */}
          {[
            { x: '-16px', y: '-10px', delay: 0.9 },
            { x: '18px', y: '-8px', delay: 0.95 },
            { x: '0px', y: '16px', delay: 1.0 }
          ].map((sp, i) => (
            <div
              key={`snor-spark-${i}`}
              className="absolute pointer-events-none z-40"
              style={{
                left: `calc(50% + ${sp.x})`,
                top: `calc(50% + ${sp.y})`,
                animation: `gbaLickitungParalysisSpark 0.9s ease-out ${sp.delay}s forwards`,
                opacity: 0
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" className="drop-shadow-[0_0_8px_#facc15]">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 20by. LICKITUNG TONGUE WRAP (Broad Spatula Tongue Lash & Paralysis Constriction) */}
      {fx.type === 'lickitung_tongue_wrap' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Main Spatula Tongue Lash Illustration (<= 60% Card Width) */}
          <div
            className="absolute pointer-events-none z-30 flex items-center justify-center"
            style={{ animation: 'gbaLickitungTongueWrapLash 1.75s cubic-bezier(0.16, 0.9, 0.28, 1) forwards' }}
          >
            <img
              src="/assets/Lickitung_Tongue_Wrap.png"
              alt="Lickitung Tongue Wrap"
              className="max-w-[76px] max-h-[76px] object-contain drop-shadow-[0_0_12px_rgba(244,63,94,0.85)]"
            />
          </div>

          {/* Constricting Saliva & Elastic Wrap Rings around Victim Card */}
          <div
            className="absolute w-18 h-18 rounded-full border-2 border-pink-400 pointer-events-none z-25"
            style={{
              animation: 'gbaAbraTelekinesisRings 1.5s ease-out 0.4s forwards',
              boxShadow: '0 0 12px #f43f5e',
              opacity: 0
            }}
          />

          {/* Crackling Yellow Paralysis Arcs */}
          {[
            { x: '-16px', y: '-14px', delay: 0.4 },
            { x: '16px', y: '12px', delay: 0.6 },
            { x: '-8px', y: '18px', delay: 0.8 },
            { x: '12px', y: '-16px', delay: 1.0 }
          ].map((p, i) => (
            <div
              key={`licki-para-${i}`}
              className="absolute pointer-events-none z-40"
              style={{
                left: `calc(50% + ${p.x})`,
                top: `calc(50% + ${p.y})`,
                animation: `gbaLickitungParalysisSpark 1.2s ease-out ${p.delay}s forwards`,
                opacity: 0
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" className="drop-shadow-[0_0_8px_#facc15]">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="#fde047" stroke="#eab308" strokeWidth="1.5" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 20bz. LICKITUNG SUPERSONIC (Golden Concentric Supersonic Sound Rings) */}
      {fx.type === 'lickitung_supersonic' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {[0, 0.25, 0.5, 0.75].map((del, i) => (
            <div
              key={`licki-sound-${i}`}
              className="absolute w-18 h-18 rounded-full border-2 border-yellow-400 pointer-events-none z-30"
              style={{
                animation: `gbaLickitungSupersonicRings 1.65s ease-out ${del}s forwards`,
                opacity: 0
              }}
            />
          ))}
        </div>
      )}

      {/* 20ca. KANGASKHAN COMET PUNCH (Rapid Sequential Boxing Flurry & Comet Trails) */}
      {fx.type === 'kangaskhan_comet_punch' && (() => {
        const wi = Math.max(1, fx.intensity ?? 1);
        const isMirrored = Boolean(fx.mirrored);
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
            {/* Punching Glove with Flaming Comet Trail (<= 60% Card Width) */}
            <div
              className="absolute pointer-events-none z-35"
              style={{
                '--kp-ox': isMirrored ? '26px' : '-26px',
                '--kp-oy': isMirrored ? '-14px' : '16px',
                '--kp-rot': isMirrored ? '15deg' : '-15deg',
                animation: 'gbaKangaskhanCometPunch 1.3s cubic-bezier(0.18, 0.9, 0.3, 1) forwards'
              } as React.CSSProperties}
            >
              <svg width="52" height="52" viewBox="0 0 70 70" className="drop-shadow-[0_0_12px_#f97316]">
                <path d="M 12 35 Q 26 28 42 35" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                <path d="M 8 42 Q 24 38 40 42" stroke="#f97316" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
                <circle cx="46" cy="35" r="16" fill="#ea580c" stroke="#7c2d12" strokeWidth="2.5" />
                <ellipse cx="40" cy="26" rx="6" ry="5" fill="#f97316" stroke="#7c2d12" strokeWidth="2" />
                <circle cx="50" cy="31" r="3" fill="#ffffff" opacity="0.9" />
              </svg>
            </div>

            {/* Comic Impact Stars */}
            <div
              className="absolute pointer-events-none z-30"
              style={{ animation: 'gbaGuillotineFlash 1.1s ease-out 0.28s forwards', opacity: 0 }}
            >
              <svg width={Math.round(54 * wi)} height={Math.round(54 * wi)} viewBox="0 0 60 60">
                <polygon points="30,5 37,22 55,22 41,34 46,51 30,41 14,51 19,34 5,22 23,22" fill="#fde047" stroke="#ea580c" strokeWidth="2" />
              </svg>
            </div>
          </div>
        );
      })()}

      {/* 20cb. KANGASKHAN FETCH (Maternal Pouch Sparkle & Draw Indicator) */}
      {fx.type === 'kangaskhan_fetch' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          <div
            className="absolute pointer-events-none z-30"
            style={{ animation: 'gbaKangaskhanFetch 1.2s cubic-bezier(0.18, 0.9, 0.3, 1) forwards' }}
          >
            <svg width="46" height="46" viewBox="0 0 60 60" className="drop-shadow-[0_0_12px_#facc15]">
              <path d="M 12 24 C 12 44, 48 44, 48 24 Z" fill="#d97706" stroke="#78350f" strokeWidth="3" />
              <line x1="12" y1="24" x2="48" y2="24" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
              <rect x="22" y="10" width="16" height="22" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
              <polygon points="30,14 32,19 37,19 33,22 35,27 30,24 25,27 27,22 23,19 28,19" fill="#f59e0b" />
            </svg>
          </div>
        </div>
      )}

      {/* 20cc. TAUROS STOMP (Heavy Hoof Impact & Ground Fissures) */}
      {fx.type === 'tauros_stomp' && (() => {
        const wi = Math.max(1, fx.intensity ?? 1);
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
            {/* Cloven Hooves Slamming Down (<= 60% Card Width) */}
            <div
              className="absolute pointer-events-none z-30 flex items-center justify-center"
              style={{ animation: 'gbaTaurosHoofImpact 1.6s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
            >
              <img
                src="/assets/Tauros_Hoof_Stomp.png"
                alt="Tauros Stomp"
                className="max-w-[70px] max-h-[70px] object-contain drop-shadow-[0_0_14px_rgba(180,83,9,0.85)]"
              />
            </div>

            {/* Ground Fissure Cracks */}
            <div
              className="absolute bottom-2 pointer-events-none z-25"
              style={{ animation: 'gbaGeodudeDustShockwave 1.5s ease-out 0.5s forwards', opacity: 0 }}
            >
              <svg width={Math.round(62 * wi)} height="32" viewBox="0 0 70 35">
                <path d="M 35 15 L 20 28 L 8 32 M 35 15 L 48 26 L 62 30 M 35 15 L 35 32" stroke="#78350f" strokeWidth={2.5 * wi} strokeLinecap="round" fill="none" />
                <path d="M 28 20 L 22 14 M 42 22 L 50 18" stroke="#b45309" strokeWidth={1.8 * wi} strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </div>
        );
      })()}

      {/* 20cd. TAUROS RAMPAGE (Furious Multi-Stomp Barrage & Rage Sparks) */}
      {fx.type === 'tauros_rampage' && (() => {
        const wi = Math.max(1, fx.intensity ?? 1);
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
            {/* Alternating Stomping Cloven Hooves (<= 60% Card Width) */}
            <div
              className="absolute pointer-events-none z-30 flex items-center justify-center"
              style={{ animation: 'gbaTaurosRampageFrenzy 1.8s ease-in-out forwards' }}
            >
              <img
                src="/assets/Tauros_Hoof_Stomp.png"
                alt="Tauros Rampage"
                className="max-w-[74px] max-h-[74px] object-contain drop-shadow-[0_0_16px_rgba(220,38,38,0.9)]"
              />
            </div>

            {/* Deep Ground Fissures */}
            <div
              className="absolute bottom-1 pointer-events-none z-25"
              style={{ animation: 'gbaGeodudeDustShockwave 1.7s ease-out 0.3s forwards', opacity: 0 }}
            >
              <svg width={Math.round(68 * wi)} height="36" viewBox="0 0 70 35">
                <path d="M 35 12 L 18 26 L 5 32 M 35 12 L 52 25 L 65 30 M 35 12 L 35 34" stroke="#991b1b" strokeWidth={3 * wi} strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Red Rage Aura Sparks */}
            {[
              { x: '-18px', y: '-16px', delay: 0.2 },
              { x: '18px', y: '-12px', delay: 0.4 },
              { x: '-12px', y: '12px', delay: 0.6 },
              { x: '14px', y: '16px', delay: 0.8 },
              { x: '0px', y: '-22px', delay: 1.0 }
            ].map((r, i) => (
              <div
                key={`tauros-rage-${i}`}
                className="absolute pointer-events-none z-35"
                style={{
                  left: `calc(50% + ${r.x})`,
                  top: `calc(50% + ${r.y})`,
                  animation: `gbaLickitungParalysisSpark 1.1s ease-out ${r.delay}s forwards`,
                  opacity: 0
                }}
              >
                <div className="w-2.5 h-2.5 rotate-45 bg-red-500 border border-yellow-300 shadow-[0_0_8px_#ef4444]" />
              </div>
            ))}
          </div>
        );
      })()}

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

      {/* 20b. CRABHAMMER (Handled above in kingler_crabhammer) */}

      {/* 20c. COBRA STARE (Dark Arbok) - the reference illustration materializes through a
           GBA-style grainy dissolve. The light drains, static coalesces into the image, holds
           with a pulsing horror glow, then dissolves back into grain leaving an afterimage. */}
      {fx.type === 'cobra_stare' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Beat 0: soft dread vignette — the light drains from the victim's card.
              Kept to inset-0 with a low-alpha gradient so it reads as the card dimming,
              never as a solid block or a frame bleeding past the card edge. */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              animation: 'gbaCobraDread 1.25s ease-in-out forwards',
              opacity: 0,
              background: 'radial-gradient(ellipse at 50% 45%, rgba(88,28,135,0.05) 0%, rgba(30,10,60,0.20) 58%, rgba(12,5,28,0.36) 100%)'
            }}
          />

          {/* Beat 1: the reference image materializes through grainy dissolve */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: 'gbaStareMaterialize 0.7s steps(8) 0.15s forwards', opacity: 0 }}
          >
            <img
              src="/assets/dark_arbok_stare.png"
              alt=""
              className="select-none pointer-events-none"
              style={{
                width: '72%',
                maxWidth: '72%',
                height: 'auto',
                objectFit: 'contain',
                animation: 'gbaStarePulse 0.5s ease-in-out 0.85s 2',
                filter: 'drop-shadow(0 0 12px rgba(147,51,234,0.6))'
              }}
              draggable={false}
            />
          </div>

          {/* Beat 3: dissolve out — the image breaks back into grain */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: 'gbaStareDissolveOut 0.45s steps(5) 0.8s forwards', opacity: 0 }}
          >
            <img
              src="/assets/dark_arbok_stare.png"
              alt=""
              className="select-none pointer-events-none"
              style={{ width: '72%', maxWidth: '72%', height: 'auto', objectFit: 'contain' }}
              draggable={false}
            />
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

      {/* 22a. BAT WING FLAP (Flitter - Golbat's wing strike) */}
      {fx.type === 'bat_wing_flap' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Flapping bat wings */}
          <div className="absolute flex items-center justify-center" style={{ animation: 'gbaBatWingFlap 1.05s ease-out forwards' }}>
            <svg width="110" height="70" viewBox="0 0 110 70">
              <path d="M50 42 Q30 8, 6 14 Q16 20, 14 30 Q24 26, 28 35 Q36 31, 42 42 Z" fill="url(#batWingGrad)" opacity="0.9" />
              <path d="M60 42 Q80 8, 104 14 Q94 20, 96 30 Q86 26, 82 35 Q74 31, 68 42 Z" fill="url(#batWingGrad)" opacity="0.9" />
              <defs>
                <linearGradient id="batWingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Wing-beat speed streaks */}
          <div className="absolute -left-5 top-1/3" style={{ animation: 'gbaWindStreak 1.05s linear forwards', opacity: 0 }}>
            <svg width="60" height="14" viewBox="0 0 60 14">
              <path d="M2 4 Q20 0, 38 5 Q50 8, 58 4" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <path d="M6 10 Q24 6, 44 10" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute -right-5 bottom-1/4" style={{ animation: 'gbaWindStreak 1.05s linear 0.15s forwards', opacity: 0 }}>
            <svg width="60" height="14" viewBox="0 0 60 14">
              <path d="M2 4 Q20 0, 38 5 Q50 8, 58 4" fill="none" stroke="#ddd6fe" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          {!fx.whiffed && (
            <div className="absolute text-3xl select-none" style={{ animation: 'gbaVenomSplash 0.9s ease-out 0.35s forwards', opacity: 0 }}>💥</div>
          )}
        </div>
      )}

      {/* 22b. WATER VORTEX (Whirlpool - Poliwrath Lv. 48 — 40 DMG + Energy Discard Oceanic Maelstrom) */}
      {fx.type === 'water_vortex' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Deep oceanic abyss vignette */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-sky-950/65 via-blue-950/50 to-cyan-950/40 pointer-events-none"
            style={{ animation: 'gbaWhirlpoolAbyss 1.75s ease-in-out forwards' }}
          />

          {/* Rapidly accelerating 4-arm water torrent vortex */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaWhirlpoolSpiralTorrents 1.75s cubic-bezier(0.18, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150" className="drop-shadow-[0_0_24px_#38bdf8]">
              <defs>
                <radialGradient id="maelstromAbyssGrad" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#082f49" />
                  <stop offset="45%" stopColor="#0369a1" />
                  <stop offset="85%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="torrentWaveGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#7dd3fc" />
                  <stop offset="70%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0c4a6e" />
                </linearGradient>
              </defs>
              {/* Central oceanic sinkhole */}
              <circle cx="75" cy="75" r="24" fill="url(#maelstromAbyssGrad)" />
              <circle cx="75" cy="75" r="10" fill="#032541" />

              {/* 4 swirling tidal torrent arms */}
              {[0, 90, 180, 270].map((angle, i) => (
                <g key={i} transform={`rotate(${angle} 75 75)`}>
                  <path
                    d="M75 75 C 75 48, 110 40, 125 58 C 138 74, 115 105, 95 95 C 82 88, 76 78, 75 75 Z"
                    fill="url(#torrentWaveGrad)"
                    opacity="0.82"
                  />
                  {/* Foaming crest line */}
                  <path
                    d="M75 72 C 78 46, 112 38, 126 56 C 136 70, 118 98, 98 92"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  {/* Droplet beads along arm */}
                  <circle cx="118" cy="46" r="2.8" fill="#e0f2fe" opacity="0.95" />
                  <circle cx="128" cy="65" r="2.2" fill="#7dd3fc" opacity="0.85" />
                  <circle cx="108" cy="98" r="1.8" fill="#bae6fd" opacity="0.8" />
                </g>
              ))}
            </svg>
          </div>

          {/* Energy Drain sinkhole swirl (energy cards sucked into vortex) */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaWhirlpoolEnergyDrain 1.75s cubic-bezier(0.12, 0.9, 0.28, 1) forwards' }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120">
              {/* Spiraling golden & cyan energy particles */}
              {[0, 60, 120, 180, 240, 300].map((deg, idx) => (
                <g key={idx} transform={`rotate(${deg} 60 60)`}>
                  <line x1="60" y1="12" x2="60" y2="35" stroke="#fde047" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
                  <circle cx="60" cy="12" r="3" fill="#ffffff" className="drop-shadow-[0_0_6px_#fde047]" />
                  <circle cx="58" cy="24" r="2" fill="#38bdf8" />
                </g>
              ))}
            </svg>
          </div>

          {/* Froth rings expanding on collapse */}
          {!fx.whiffed && (
            <div
              className="absolute flex items-center justify-center"
              style={{ animation: 'gbaWhirlpoolFrothRings 1.75s ease-out 0.4s forwards', opacity: 0 }}
            >
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="54" fill="none" stroke="#e0f2fe" strokeWidth="2.5" strokeDasharray="12 8" opacity="0.75" />
                <circle cx="70" cy="70" r="38" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 6" opacity="0.85" />
              </svg>
            </div>
          )}
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
          {/* Eerie hypnotic card blur overlay (covers the entire struck card with purple confusion trance blur) */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none z-10"
            style={{
              animation: 'gbaConfuseCardBlur 1.65s ease-in-out forwards',
              background: 'radial-gradient(ellipse at center, rgba(192, 132, 252, 0.28) 0%, rgba(147, 51, 234, 0.22) 50%, rgba(88, 28, 135, 0.16) 80%, transparent 100%)',
              backdropFilter: 'blur(3.5px)',
              WebkitBackdropFilter: 'blur(3.5px)'
            }}
          />
          {/* Eerie glow blooming behind the swirl */}
          <div
            className="absolute w-20 h-20 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(200,140,255,0.5) 0%, rgba(147,51,234,0.3) 45%, rgba(88,28,135,0) 72%)',
              animation: 'gbaConfuseRayGlow 1.65s ease-out forwards'
            }}
          />
          {/* Main confusion spiral - faithful Bézier coil derived from in-game confusion self-hit, elevated with luminous depth */}
          <div
            className="absolute z-20"
            style={{ animation: 'gbaConfuseRaySpiral 1.65s linear forwards' }}
          >
            <svg width="92" height="92" viewBox="0 0 52 52" className="overflow-visible">
              <defs>
                <linearGradient id="confuseRayGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fdf4ff" />
                  <stop offset="25%" stopColor="#f0abfc" />
                  <stop offset="60%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <radialGradient id="confuseRayCoreGrad" cx="0.4" cy="0.4">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#f0abfc" />
                  <stop offset="100%" stopColor="#9333ea" />
                </radialGradient>
              </defs>
              {/* Soft purple outer aura glow */}
              <path
                d={CONFUSE_SPIRAL_EXTENDED}
                fill="none"
                stroke="#c084fc"
                strokeWidth="5.5"
                strokeLinecap="round"
                opacity="0.35"
                className="drop-shadow-[0_0_12px_#c084fc]"
              />
              {/* Main vibrant energetic spiral body */}
              <path
                d={CONFUSE_SPIRAL_EXTENDED}
                fill="none"
                stroke="url(#confuseRayGrad)"
                strokeWidth="3.2"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_#e879f9]"
              />
              {/* Luminous psychic white spine running down center */}
              <path
                d={CONFUSE_SPIRAL_EXTENDED}
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.1"
                strokeLinecap="round"
                opacity="0.9"
              />
              {/* Concentrated psychic iris / core pupil */}
              <circle cx="26" cy="26" r="3.6" fill="url(#confuseRayCoreGrad)" className="drop-shadow-[0_0_8px_#e879f9]" />
              <circle cx="26" cy="26" r="2" fill="#ffffff" opacity="0.95" />
              <circle cx="25.3" cy="25.3" r="0.75" fill="#ffffff" />
            </svg>
          </div>
          {/* Counter-rotating inner swirl with harmonic depth (56x56) */}
          <div
            className="absolute z-20"
            style={{ animation: 'gbaConfuseRaySpiralInner 1.65s linear 0.08s forwards', opacity: 0 }}
          >
            <svg width="56" height="56" viewBox="0 0 52 52" className="overflow-visible">
              <path
                d={CONFUSE_SPIRAL_BASE}
                fill="none"
                stroke="#f0abfc"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.85"
                className="drop-shadow-[0_0_6px_#e879f9]"
              />
              <path
                d={CONFUSE_SPIRAL_BASE}
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          </div>
          {/* The ray itself streaking in and winding up before the swirl locks on (26x26) */}
          <div className="absolute z-20" style={{ animation: 'gbaConfuseRayInbound 1.65s ease-out forwards' }}>
            <svg width="26" height="26" viewBox="0 0 52 52">
              <path d={CONFUSE_SPIRAL_BASE} fill="none" stroke="#f5d0fe" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="26" cy="26" r="4.5" fill="#ffffff" opacity="0.95" />
            </svg>
          </div>
          {/* Confusion sparks circling the swirl */}
          <div className="absolute z-30" style={{ animation: 'gbaConfuseRaySparkle 1.65s linear 0.22s forwards', opacity: 0 }}>
            <span className="text-sm text-fuchsia-200 select-none drop-shadow-[0_0_6px_#c084fc]">✦</span>
          </div>
          <div className="absolute z-30" style={{ animation: 'gbaConfuseRaySparkle2 1.65s linear 0.38s forwards', opacity: 0 }}>
            <span className="text-xs text-violet-200 select-none drop-shadow-[0_0_6px_#a855f7]">✦</span>
          </div>
        </div>
      )}

      {/* 26c. SUPER PSY BLAST (Kadabra - signature high-impact telekinetic spoon blast) */}
      {fx.type === 'super_psy_blast' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Intense Psionic Core Sphere */}
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{ animation: 'gbaSuperPsyCore 1.35s cubic-bezier(0.18, 0.88, 0.32, 1) forwards' }}
          >
            <svg width="74" height="74" viewBox="0 0 74 74">
              <circle cx="37" cy="37" r="26" fill="url(#superPsyCoreGrad)" />
              <circle cx="37" cy="37" r="16" fill="#f5d0fe" opacity="0.9" />
              <circle cx="37" cy="37" r="8" fill="#ffffff" />
              <defs>
                <radialGradient id="superPsyCoreGrad" cx="0.45" cy="0.45">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#f0abfc" />
                  <stop offset="70%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#581c87" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* Faceted Telekinetic Expanding Shockwave Ring 1 */}
          <div
            className="absolute w-24 h-24 rounded-full border-4 border-fuchsia-400 pointer-events-none"
            style={{ animation: 'gbaSuperPsyRing1 1.35s ease-out forwards' }}
          />

          {/* Faceted Telekinetic Expanding Shockwave Ring 2 */}
          <div
            className="absolute w-28 h-28 rounded-full border-4 border-purple-500 pointer-events-none"
            style={{ animation: 'gbaSuperPsyRing2 1.35s ease-out forwards' }}
          />

          {/* Horizontal Sinuous Distortion Shockwaves */}
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{ animation: 'gbaSuperPsyWarpWave 1.35s ease-out 0.15s forwards', opacity: 0 }}
          >
            <svg width="120" height="40" viewBox="0 0 120 40" className="overflow-visible">
              <path d="M 5 20 Q 30 6, 60 20 T 115 20" fill="none" stroke="#e879f9" strokeWidth="3.2" strokeLinecap="round" className="drop-shadow-[0_0_12px_#e879f9]" />
              <path d="M 12 12 Q 35 28, 65 14 T 108 14" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <path d="M 12 28 Q 42 12, 70 26 T 108 26" fill="none" stroke="#f0abfc" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            </svg>
          </div>

          {/* Directional Psionic Diamond Sparks */}
          {[
            { x: 28, y: -20 }, { x: -28, y: -20 }, { x: 32, y: 16 }, { x: -32, y: 16 },
            { x: 0, y: -34 }, { x: 0, y: 34 }, { x: 38, y: 0 }, { x: -38, y: 0 }
          ].map((spark, i) => (
            <div
              key={i}
              className="absolute text-xl font-black text-fuchsia-200 pointer-events-none"
              style={{
                textShadow: '0 0 10px #e879f9',
                animation: 'gbaSuperPsySparkPop 0.6s ease-out 0.28s forwards',
                opacity: 0,
                '--sp-x': `${spark.x}px`,
                '--sp-y': `${spark.y}px`
              } as React.CSSProperties}
            >
              ✦
            </div>
          ))}

          {/* Opponent Card Psionic Blur Overlay */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none z-10"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(192, 132, 252, 0.28) 0%, rgba(147, 51, 234, 0.22) 50%, rgba(88, 28, 135, 0.16) 80%, transparent 100%)',
              backdropFilter: 'blur(3.5px)',
              WebkitBackdropFilter: 'blur(3.5px)'
            }}
          />
        </div>
      )}

      {/* 26d. AMNESIA MIND WIPE (Poliwhirl - hypnotic memory-erasure & drifting question marks) */}
      {fx.type === 'amnesia_mind_wipe' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Hypnotic Memory-Erasure Ring */}
          <div
            className="absolute w-24 h-24 rounded-full border-2 border-indigo-400 pointer-events-none"
            style={{ animation: 'gbaAmnesiaRing 1.4s ease-out forwards' }}
          />
          <div
            className="absolute w-16 h-16 rounded-full border-2 border-purple-300 pointer-events-none"
            style={{ animation: 'gbaAmnesiaRing 1.4s ease-out 0.15s forwards', opacity: 0 }}
          />

          {/* Mental-Fog Ripple Waves */}
          <div
            className="absolute w-32 h-32 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(167,139,250,0.4) 0%, rgba(129,140,248,0.2) 45%, rgba(99,102,241,0) 70%)',
              animation: 'gbaAmnesiaFogRipple 1.4s ease-out forwards'
            }}
          />

          {/* Floating Ethereal Question-Mark Thought Motes (mind blanking out) */}
          {[
            { text: '?', x: -24, y: 8, delay: 0.1, size: 'text-2xl', color: '#c084fc' },
            { text: '?', x: 22, y: -6, delay: 0.22, size: 'text-xl', color: '#818cf8' },
            { text: '¿', x: -6, y: -24, delay: 0.35, size: 'text-lg', color: '#e879f9' },
            { text: '?', x: 28, y: 18, delay: 0.45, size: 'text-base', color: '#a78bfa' },
            { text: '?', x: 0, y: 20, delay: 0.28, size: 'text-xl', color: '#f0abfc' }
          ].map((q, i) => (
            <div
              key={i}
              className={`absolute font-black select-none pointer-events-none ${q.size}`}
              style={{
                left: `calc(50% + ${q.x}px)`,
                top: `calc(50% + ${q.y}px)`,
                color: q.color,
                textShadow: `0 0 12px ${q.color}`,
                animation: `gbaAmnesiaQuestionPop 0.85s ease-out ${q.delay}s forwards`,
                opacity: 0
              }}
            >
              {q.text}
            </div>
          ))}

          {/* Opponent Card Mind-Wipe Blur Overlay */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none z-10"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(192, 132, 252, 0.28) 0%, rgba(147, 51, 234, 0.22) 50%, rgba(88, 28, 135, 0.16) 80%, transparent 100%)',
              backdropFilter: 'blur(3.5px)',
              WebkitBackdropFilter: 'blur(3.5px)'
            }}
          />
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

      {/* 28. SLUDGE BOMB (Muk — GBA-style viscous purple sludge lob, thick and gooey) */}
      {fx.type === 'sludge_bomb' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Main sludge blob arcing toward target */}
          <div className="absolute" style={{ animation: 'gbaSludgeThrow 1.3s cubic-bezier(0.35, 0.9, 0.5, 1) forwards' }}>
            <svg width="56" height="48" viewBox="0 0 56 48" className="drop-shadow-[0_0_16px_#7e22ce]">
              {/* Thick viscous blob body */}
              <path d="M28 4 Q36 8, 38 16 Q42 14, 44 20 Q48 22, 44 28 Q46 34, 40 36 Q42 42, 34 42 Q30 46, 24 42 Q18 44, 16 38 Q10 38, 12 30 Q8 26, 12 20 Q10 14, 16 14 Q18 8, 24 8 Q26 4, 28 4 Z" fill="#6b21a8" opacity="0.95" />
              <path d="M28 10 Q34 12, 35 18 Q38 17, 39 22 Q42 24, 39 28 Q40 32, 35 33 Q36 37, 30 36 Q27 40, 23 36 Q19 38, 18 32 Q14 31, 16 26 Q13 23, 17 20 Q16 16, 21 16 Q22 11, 28 10 Z" fill="#7e22ce" opacity="0.85" />
              {/* Glossy highlight */}
              <ellipse cx="22" cy="18" rx="5" ry="4" fill="#a855f7" opacity="0.6" />
              {/* Dripping trail behind blob */}
              <path d="M28 4 Q26 0, 24 2" fill="none" stroke="#6b21a8" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              <path d="M34 8 Q36 4, 33 2" fill="none" stroke="#7e22ce" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              {/* Bubbles in sludge */}
              <circle cx="32" cy="26" r="3" fill="#9333ea" opacity="0.7" />
              <circle cx="22" cy="30" r="2" fill="#a855f7" opacity="0.6" />
              <circle cx="30" cy="34" r="1.5" fill="#c084fc" opacity="0.5" />
            </svg>
          </div>
          {/* Impact splatter on landing */}
          <div className="absolute" style={{ animation: 'gbaSludgeImpactSplat 1.3s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="90" height="50" viewBox="0 0 90 50">
              {/* Main splat pool */}
              <ellipse cx="45" cy="34" rx="32" ry="12" fill="#581c87" opacity="0.8" />
              <ellipse cx="45" cy="32" rx="26" ry="10" fill="#6b21a8" opacity="0.7" />
              <ellipse cx="45" cy="30" rx="18" ry="7" fill="#7e22ce" opacity="0.6" />
              {/* Splatter blobs flying outward */}
              <ellipse cx="20" cy="24" rx="7" ry="5" fill="#6b21a8" opacity="0.8" />
              <ellipse cx="70" cy="22" rx="8" ry="6" fill="#7e22ce" opacity="0.75" />
              <ellipse cx="35" cy="16" rx="5" ry="4" fill="#9333ea" opacity="0.7" />
              <ellipse cx="58" cy="14" rx="6" ry="4" fill="#6b21a8" opacity="0.65" />
              {/* Drip strings hanging */}
              <path d="M30 20 Q28 12, 30 6" fill="none" stroke="#6b21a8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <path d="M60 18 Q62 10, 60 4" fill="none" stroke="#7e22ce" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M45 24 Q44 16, 46 10" fill="none" stroke="#581c87" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
            </svg>
          </div>
          {/* Dripping viscous drops falling from splat */}
          <div className="absolute -bottom-3" style={{ animation: 'gbaSludgeDripFall 1.3s ease-in 0.7s forwards', opacity: 0 }}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-5 rounded-b-full bg-purple-800/90" />
              <div className="w-2 h-4 rounded-b-full bg-purple-900/80" />
              <div className="w-3 h-6 rounded-b-full bg-purple-800/70" />
              <div className="w-1.5 h-3 rounded-b-full bg-purple-700/80" />
            </div>
          </div>
          {/* Toxic purple wisps rising from sludge */}
          <div className="absolute -top-2" style={{ animation: 'gbaSludgeWispRise 1.3s ease-out 0.8s forwards', opacity: 0 }}>
            <svg width="40" height="24" viewBox="0 0 40 24">
              <path d="M8 18 Q14 10, 20 14 Q26 18, 32 12" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <path d="M12 22 Q20 16, 28 20" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            </svg>
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

      {/* 28c. STICKY HANDS (Grimer — GBA-style stretching sticky arms reaching out) */}
      {fx.type === 'sticky_hands_grab' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Left sticky arm reaching right */}
          <div className="absolute -left-4" style={{ animation: 'gbaStickyArmReach 1.3s cubic-bezier(0.3, 0.9, 0.4, 1) forwards' }}>
            <svg width="70" height="36" viewBox="0 0 70 36" className="drop-shadow-[0_0_10px_#4d7c0f]">
              {/* Arm body — thick, gooey, tapered */}
              <path d="M4 20 Q14 14, 26 16 Q38 12, 50 15 Q58 14, 64 17 Q66 20, 64 23 Q58 26, 50 24 Q38 28, 26 25 Q14 28, 4 22 Z" fill="#3f6212" opacity="0.9" />
              <path d="M8 20 Q16 16, 28 17 Q40 14, 52 16 Q58 16, 62 19 Q58 23, 52 22 Q40 26, 28 23 Q16 26, 8 22 Z" fill="#4d7c0f" opacity="0.8" />
              {/* Hand/fingers at tip — three stubby digits */}
              <ellipse cx="64" cy="17" rx="5" ry="4" fill="#4d7c0f" opacity="0.9" />
              <ellipse cx="66" cy="14" rx="3" ry="3" fill="#65a30d" opacity="0.8" />
              <ellipse cx="67" cy="20" rx="3" ry="3" fill="#65a30d" opacity="0.8" />
              <ellipse cx="65" cy="23" rx="2.5" ry="2.5" fill="#4d7c0f" opacity="0.7" />
              {/* Shine on arm */}
              <ellipse cx="30" cy="17" rx="8" ry="3" fill="#84cc16" opacity="0.4" />
            </svg>
          </div>
          {/* Right sticky arm reaching left */}
          <div className="absolute -right-4" style={{ animation: 'gbaStickyArmReachR 1.3s cubic-bezier(0.3, 0.9, 0.4, 1) 0.1s forwards', opacity: 0 }}>
            <svg width="70" height="36" viewBox="0 0 70 36" className="drop-shadow-[0_0_10px_#4d7c0f]">
              {/* Arm body mirrored */}
              <path d="M66 20 Q56 14, 44 16 Q32 12, 20 15 Q12 14, 6 17 Q4 20, 6 23 Q12 26, 20 24 Q32 28, 44 25 Q56 28, 66 22 Z" fill="#3f6212" opacity="0.9" />
              <path d="M62 20 Q54 16, 42 17 Q30 14, 18 16 Q12 16, 8 19 Q12 23, 18 22 Q30 26, 42 23 Q54 26, 62 22 Z" fill="#4d7c0f" opacity="0.8" />
              {/* Hand/fingers at tip */}
              <ellipse cx="6" cy="17" rx="5" ry="4" fill="#4d7c0f" opacity="0.9" />
              <ellipse cx="4" cy="14" rx="3" ry="3" fill="#65a30d" opacity="0.8" />
              <ellipse cx="3" cy="20" rx="3" ry="3" fill="#65a30d" opacity="0.8" />
              <ellipse cx="5" cy="23" rx="2.5" ry="2.5" fill="#4d7c0f" opacity="0.7" />
              {/* Shine */}
              <ellipse cx="40" cy="17" rx="8" ry="3" fill="#84cc16" opacity="0.4" />
            </svg>
          </div>
          {/* Grab impact — sticky residue at center */}
          <div className="absolute" style={{ animation: 'gbaStickyGrabImpact 1.3s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="50" height="40" viewBox="0 0 50 40">
              <ellipse cx="25" cy="24" rx="18" ry="10" fill="#3f6212" opacity="0.6" />
              <ellipse cx="25" cy="22" rx="12" ry="7" fill="#4d7c0f" opacity="0.5" />
              {/* Sticky strings connecting */}
              <path d="M15 18 Q12 12, 14 6" fill="none" stroke="#4d7c0f" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M35 16 Q38 10, 36 4" fill="none" stroke="#65a30d" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              <path d="M25 14 Q24 8, 26 3" fill="none" stroke="#3f6212" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
            </svg>
          </div>
          {/* Dripping goo from grab point */}
          <div className="absolute -bottom-2" style={{ animation: 'gbaNastyGooDrip 1.3s ease-in 0.7s forwards', opacity: 0 }}>
            <div className="flex gap-1.5">
              <div className="w-2 h-4 rounded-b-full bg-lime-800/80" />
              <div className="w-1.5 h-3 rounded-b-full bg-lime-700/70" />
              <div className="w-2 h-5 rounded-b-full bg-lime-800/60" />
            </div>
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
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              animation: 'gbaSleepHaze 1.3s ease-in-out forwards',
              opacity: 0,
              background: 'radial-gradient(ellipse at 50% 60%, rgba(168,85,247,0.14) 0%, rgba(126,34,206,0.08) 55%, transparent 100%)'
            }}
          />
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

      {/* 41a. FIRE TAKE DOWN (Arcanine Lv. 45 — 80 DMG Infernal Cataclysm Tackle) */}
      {fx.type === 'fire_take_down' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Scorched heat wave & card blur vignette */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-600/25 via-amber-500/20 to-red-600/30 pointer-events-none"
            style={{ animation: 'gbaArcanineIgnition 1.65s ease-in-out forwards' }}
          />

          {/* Molten scorched trench tearing through ground */}
          <div
            className="absolute bottom-6 flex items-center justify-center"
            style={{ animation: 'gbaArcanineGroundScorch 1.65s cubic-bezier(0.12, 0.9, 0.25, 1) forwards' }}
          >
            <svg width="180" height="24" viewBox="0 0 180 24">
              <defs>
                <linearGradient id="scorchTrenchGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#78350f" stopOpacity="0" />
                  <stop offset="30%" stopColor="#ea580c" />
                  <stop offset="70%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
              <path d="M0 12 L40 6 L90 14 L140 8 L180 12 L140 18 L90 10 L40 16 Z" fill="url(#scorchTrenchGrad)" opacity="0.85" />
              <line x1="20" y1="12" x2="170" y2="12" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Colossal 150px Blazing Predator Charge Streak */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaArcanineSonicCharge 1.65s cubic-bezier(0.18, 0.92, 0.28, 1) forwards' }}
          >
            <svg width="150" height="70" viewBox="0 0 150 70" className="drop-shadow-[0_0_28px_#ea580c]">
              <defs>
                <linearGradient id="arcanineFlameGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#991b1b" stopOpacity="0" />
                  <stop offset="25%" stopColor="#ef4444" />
                  <stop offset="60%" stopColor="#f97316" />
                  <stop offset="85%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
                <linearGradient id="arcanineCoreGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                  <stop offset="60%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
              {/* Giant aerodynamic flame vanguard */}
              <path
                d="M10 35 C 35 15, 80 18, 142 35 C 80 52, 35 55, 10 35 Z"
                fill="url(#arcanineFlameGrad)"
                opacity="0.95"
              />
              {/* Thermonuclear white-hot core */}
              <path
                d="M45 35 C 70 24, 110 26, 138 35 C 110 44, 70 46, 45 35 Z"
                fill="url(#arcanineCoreGrad)"
                opacity="0.95"
              />
              {/* Supersonic shockwaves and trailing fire crests */}
              <path d="M125 18 Q 138 26, 145 35 Q 138 44, 125 52" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              <path d="M105 10 Q 124 22, 135 35 Q 124 48, 105 60" fill="none" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <path d="M55 8 Q 80 5, 110 16" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
              <path d="M55 62 Q 80 65, 110 54" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
            </svg>
          </div>

          {/* 80-DMG Cataclysm Impact Burst */}
          <div
            className="absolute flex items-center justify-center"
            style={{ animation: 'gbaArcanineCataclysmBurst 1.65s cubic-bezier(0.15, 0.85, 0.25, 1) forwards' }}
          >
            <svg width="110" height="110" viewBox="0 0 110 110" className="drop-shadow-[0_0_35px_#f97316]">
              <polygon
                points="55,4 62,38 96,18 76,46 106,55 76,64 96,92 62,72 55,106 48,72 14,92 34,64 4,55 34,46 14,18 48,38"
                fill="#fde047"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <circle cx="55" cy="55" r="22" fill="#ffffff" opacity="0.9" />
              <circle cx="55" cy="55" r="34" fill="#ea580c" opacity="0.35" />
            </svg>
          </div>

          {/* Scattering recoil volcanic embers (visualizing Arcanine's 30 self-recoil!) */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${30 + (i % 3) * 22}%`,
                animation: `gbaArcanineRecoilEmbers 1.65s ease-out ${0.35 + i * 0.08}s forwards`,
                opacity: 0
              }}
            >
              <div
                className="rounded-full drop-shadow-[0_0_8px_#f59e0b]"
                style={{
                  width: 8 - (i % 3),
                  height: 8 - (i % 3),
                  backgroundColor: i % 2 === 0 ? '#fde047' : '#ea580c'
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* 41b. STARFISH SLAP (Staryu) - Authentic 1999 Sugimori Staryu spinning disc strike */}
      {fx.type === 'starfish_slap' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Spinning authentic Sugimori Staryu disc */}
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{ animation: 'gbaStarfishSlapSpin 1.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Staryu_Slap.png"
              alt="Staryu"
              className="w-20 h-20 object-contain drop-shadow-[0_0_16px_rgba(56,189,248,0.75)] filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] select-none pointer-events-none"
            />
            {/* Pulsing ruby core flare synchronized with contact */}
            <div
              className="absolute w-5 h-5 rounded-full bg-red-500/80 blur-[2px] drop-shadow-[0_0_12px_#ef4444]"
              style={{ animation: 'gbaStaryuCoreFlash 1.2s ease-in-out forwards' }}
            />
          </div>

          {/* Water splash arc on contact */}
          <div className="absolute" style={{ animation: 'gbaStarfishSlapSplash 1.2s ease-out 0.4s forwards', opacity: 0 }}>
            <svg width="68" height="52" viewBox="0 0 68 52" className="overflow-visible">
              <path d="M 6 44 Q 18 16, 34 12 Q 50 16, 62 44" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
              <path d="M 14 38 Q 24 20, 34 16 Q 44 20, 54 38" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
              <circle cx="10" cy="34" r="3.5" fill="#38bdf8" className="drop-shadow-[0_0_6px_#38bdf8]" />
              <circle cx="58" cy="34" r="3.5" fill="#38bdf8" className="drop-shadow-[0_0_6px_#38bdf8]" />
              <circle cx="34" cy="8" r="3" fill="#bae6fd" className="drop-shadow-[0_0_6px_#7dd3fc]" />
              <circle cx="22" cy="18" r="2.5" fill="#e0f2fe" opacity="0.8" />
              <circle cx="46" cy="18" r="2.5" fill="#e0f2fe" opacity="0.8" />
            </svg>
          </div>

          {/* Concentric water impact ripple rings */}
          <div className="absolute" style={{ animation: 'gbaStarfishSlapRing 1.2s ease-out 0.42s forwards', opacity: 0 }}>
            <div className="w-20 h-20 rounded-full border-2 border-sky-400/80 shadow-[0_0_12px_#38bdf8]" />
          </div>
          <div className="absolute" style={{ animation: 'gbaStarfishSlapRing2 1.2s ease-out 0.50s forwards', opacity: 0 }}>
            <div className="w-14 h-14 rounded-full border border-cyan-200/70 shadow-[0_0_8px_#7dd3fc]" />
          </div>

          {/* Tactile card impact flash */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ animation: 'gbaStarfishSlapImpactFlash 1.2s ease-out forwards', opacity: 0 }}
          />
        </div>
      )}

      {/* 41c. QUICK ATTACK DASH (Eevee / Vaporeon / Rattata) - High-speed zigzag dash with cross-slashes */}
      {fx.type === 'quick_attack_dash' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Tactile Card Impact Snap */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible"
            style={{ animation: 'gbaQuickCardSnap 1.15s ease-out forwards' }}
          >
            {/* Blinding Zigzag Speed Dash Trail */}
            <div
              className="absolute pointer-events-none"
              style={{ animation: 'gbaQuickZigzag 1.15s cubic-bezier(0.15, 0.95, 0.3, 1) forwards' }}
            >
              <svg width="120" height="60" viewBox="0 0 120 60" className="overflow-visible">
                <path
                  d="M 5 15 L 45 48 L 75 12 L 115 42"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_16px_#ffffff] drop-shadow-[0_0_8px_#38bdf8]"
                />
                <path
                  d="M 12 18 L 48 45 L 72 16 L 108 40"
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.8"
                />
              </svg>
            </div>

            {/* Anime Razor Cross-Slashes */}
            <div className="absolute flex items-center justify-center pointer-events-none z-30">
              <svg width="88" height="88" viewBox="0 0 88 88" className="overflow-visible">
                {/* Slash 1: Diagonal Top-Left to Bottom-Right */}
                <line
                  x1="8" y1="12" x2="80" y2="76"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{ animation: 'gbaQuickCrossSlash1 1.15s ease-out forwards', opacity: 0 }}
                  className="drop-shadow-[0_0_14px_#ffffff]"
                />
                {/* Slash 2: Diagonal Top-Right to Bottom-Left */}
                <line
                  x1="80" y1="12" x2="8" y2="76"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{ animation: 'gbaQuickCrossSlash2 1.15s ease-out 0.05s forwards', opacity: 0 }}
                  className="drop-shadow-[0_0_14px_#ffffff]"
                />
              </svg>
            </div>

            {/* Horizontal Speedlines */}
            <div
              className="absolute pointer-events-none"
              style={{ animation: 'gbaQuickSpeedlines 1.15s ease-out 0.08s forwards', opacity: 0 }}
            >
              <svg width="100" height="40" viewBox="0 0 100 40">
                <line x1="0" y1="8" x2="85" y2="8" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                <line x1="15" y1="20" x2="100" y2="20" stroke="#f8fafc" strokeWidth="3.2" strokeLinecap="round" className="drop-shadow-[0_0_8px_#ffffff]" />
                <line x1="5" y1="32" x2="90" y2="32" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
              </svg>
            </div>

            {/* Sonic Boom Impact Burst */}
            <div
              className="absolute flex items-center justify-center pointer-events-none z-40"
              style={{ animation: 'gbaQuickSonicBurst 1.15s ease-out 0.28s forwards', opacity: 0 }}
            >
              <svg width="50" height="50" viewBox="0 0 50 50">
                <polygon points="25,2 30,18 48,25 30,32 25,48 20,32 2,25 20,18" fill="#ffffff" className="drop-shadow-[0_0_16px_#ffffff]" />
                <circle cx="25" cy="25" r="5" fill="#38bdf8" />
              </svg>
            </div>
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
      {/* 41e. FISH FLAIL (Magikarp-specific: authentic 1999 Sugimori watercolor thrashing with water splashes) */}
      {fx.type === 'fish_flail' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Magikarp Authentic 1999 Sugimori watercolor figure hopping & thrashing */}
          <div
            className="absolute flex items-center justify-center pointer-events-none select-none z-30"
            style={{ animation: 'gbaMagikarpFlailHop 1.3s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
          >
            <img
              src="/assets/Magikarp_Flail.png"
              alt="Magikarp"
              className="select-none pointer-events-none drop-shadow-[0_6px_16px_rgba(0,0,0,0.35)] drop-shadow-[0_0_12px_#38bdf8]"
              style={{
                width: '76px',
                maxWidth: '76px',
                height: 'auto',
                objectFit: 'contain'
              }}
              draggable={false}
            />
          </div>

          {/* Water Splash Ring 1 (lands on 1st flop ~28%) */}
          <div
            className="absolute w-24 h-24 rounded-full border-4 border-cyan-300 pointer-events-none"
            style={{ animation: 'gbaMagikarpSplashRing1 1.3s ease-out forwards' }}
          />

          {/* Water Splash Ring 2 (lands on 2nd flop ~56%) */}
          <div
            className="absolute w-28 h-28 rounded-full border-4 border-sky-400 pointer-events-none"
            style={{ animation: 'gbaMagikarpSplashRing2 1.3s ease-out forwards' }}
          />

          {/* Water Droplets bursting outwards on impacts */}
          {[
            { x: -28, y: -26 }, { x: 26, y: -24 }, { x: -34, y: 10 }, { x: 32, y: 12 },
            { x: -14, y: -36 }, { x: 16, y: -34 }
          ].map((d, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full bg-cyan-100 border border-white shadow-[0_0_8px_#38bdf8] pointer-events-none"
              style={{
                animation: `gbaMagikarpWaterDrop 0.6s ease-out ${i < 3 ? '0.28s' : '0.56s'} forwards`,
                opacity: 0,
                '--flail-x': `${d.x}px`,
                '--flail-y': `${d.y}px`
              } as React.CSSProperties}
            />
          ))}
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

      {/* 48b. HYPER BEAM ICE (Golduck — ice-blue charged beam, GBA-style) */}
      {fx.type === 'hyper_beam_ice' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Outer beam glow — ice blue */}
          <div className="absolute" style={{ animation: 'gbaHyperBeamIceGlow 1.25s ease-out forwards' }}>
            <svg width="130" height="24" viewBox="0 0 130 24">
              <rect x="0" y="4" width="130" height="16" rx="8" fill="url(#hyperBeamIceOuterGrad)" opacity="0.5" />
              <defs>
                <linearGradient id="hyperBeamIceOuterGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                  <stop offset="40%" stopColor="#67e8f9" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Core beam — ice blue/white */}
          <div className="absolute" style={{ animation: 'gbaHyperBeamIceCore 1.25s ease-out 0.1s forwards', opacity: 0 }}>
            <svg width="120" height="12" viewBox="0 0 120 12">
              <rect x="0" y="2" width="120" height="8" rx="4" fill="url(#hyperBeamIceCoreGrad)" />
              <rect x="10" y="4" width="100" height="4" rx="2" fill="#ffffff" opacity="0.85" />
              <defs>
                <linearGradient id="hyperBeamIceCoreGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#a5f3fc" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Muzzle flash — cool blue */}
          <div className="absolute -left-2" style={{ animation: 'gbaHyperBeamIceMuzzle 1.25s ease-out forwards', opacity: 0 }}>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="10" fill="#a5f3fc" opacity="0.6" />
              <circle cx="15" cy="15" r="5" fill="#ffffff" opacity="0.8" />
            </svg>
          </div>
          {/* Impact burst — ice blue with frost shards */}
          <div className="absolute right-0" style={{ animation: 'gbaHyperBeamIceImpact 1.25s ease-out 0.5s forwards', opacity: 0 }}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="15" fill="#67e8f9" opacity="0.35" />
              <circle cx="24" cy="24" r="9" fill="#a5f3fc" opacity="0.5" />
              <circle cx="24" cy="24" r="4" fill="#ffffff" opacity="0.7" />
              {/* Frost shard lines */}
              <g stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" opacity="0.8">
                <line x1="24" y1="4" x2="24" y2="11" />
                <line x1="24" y1="37" x2="24" y2="44" />
                <line x1="4" y1="24" x2="11" y2="24" />
                <line x1="37" y1="24" x2="44" y2="24" />
                <line x1="10" y1="10" x2="15" y2="15" />
                <line x1="33" y1="33" x2="38" y2="38" />
                <line x1="10" y1="38" x2="15" y2="33" />
                <line x1="33" y1="15" x2="38" y2="10" />
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

      {/* 50d. KRABBY IRON GRIP (Krabby Lv. 20 — Pincer Clamp & Squeeze Impact) */}
      {(fx.type === 'krabby_irongrip' || fx.type === 'claw_pinch') && (() => {
        const wi = Math.max(1, fx.intensity ?? 1);
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
            {/* Krabby Clamping Pincer (<= 60% Card Width) */}
            <div
              className="absolute pointer-events-none z-30 flex items-center justify-center"
              style={{ animation: 'gbaClawGripApproach 1.4s cubic-bezier(0.2, 0.9, 0.3, 1) forwards' }}
            >
              <img
                src="/assets/Krabby_Irongrip_Claw.png"
                alt="Krabby Iron Grip"
                className="max-w-[68px] max-h-[76px] object-contain drop-shadow-[0_0_14px_#ea580c] drop-shadow-[0_0_20px_rgba(234,88,12,0.6)]"
              />
            </div>
            {/* Impact Clamp Sparks / Squeeze Burst */}
            <div
              className="absolute pointer-events-none z-35"
              style={{ animation: 'gbaClawImpactBurst 1.4s ease-out 0.45s forwards', opacity: 0 }}
            >
              <svg width={Math.round(48 * wi)} height={Math.round(48 * wi)} viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="12" fill="#fff7ed" opacity="0.75" />
                <circle cx="24" cy="24" r="6" fill="#ffffff" opacity="0.9" />
                <line x1="6" y1="24" x2="16" y2="24" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="32" y1="24" x2="42" y2="24" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="24" y1="6" x2="24" y2="16" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="24" y1="32" x2="24" y2="42" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        );
      })()}

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

      {/* 52. DRAGON RAGE (Gyarados — Draconic Wrath, Azure Maw & Energy Torrent) */}
      {fx.type === 'dragon_rage' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 overflow-visible">
          {/* Draconic storm aura vignette over the target card */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none z-10"
            style={{
              animation: 'gbaDragonRageAura 1.75s ease-in-out forwards',
              background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.38) 0%, rgba(67, 56, 202, 0.28) 45%, rgba(30, 27, 75, 0.32) 80%, transparent 100%)',
              backdropFilter: 'blur(2.5px)',
              WebkitBackdropFilter: 'blur(2.5px)'
            }}
          />

          {/* Swirling deep indigo/cyan draconic vortex */}
          <div
            className="absolute z-20 pointer-events-none"
            style={{ animation: 'gbaDragonRageVortex 1.75s cubic-bezier(0.18, 0.85, 0.32, 1) forwards' }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120" className="overflow-visible">
              <defs>
                <linearGradient id="drVortexGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="40%" stopColor="#818cf8" />
                  <stop offset="80%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#1e1b4b" />
                </linearGradient>
              </defs>
              <path
                d="M60 10 Q95 18, 108 45 Q118 78, 95 102 Q68 118, 35 106 Q8 92, 12 58 Q16 28, 42 20 Q70 14, 88 32 Q102 52, 88 78 Q72 98, 48 90 Q28 82, 34 60 Q38 42, 58 45 Q74 48, 70 66 Q66 78, 54 72"
                fill="none"
                stroke="url(#drVortexGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_24px_#6366f1]"
              />
            </svg>
          </div>

          {/* Surging Draconic Energy Silhouette (Gyarados wrathful dragon maw) */}
          <div
            className="absolute z-30 pointer-events-none"
            style={{ animation: 'gbaDragonRageMaw 1.75s cubic-bezier(0.15, 0.9, 0.28, 1) forwards' }}
          >
            <svg width="110" height="110" viewBox="0 0 120 120" className="overflow-visible drop-shadow-[0_0_24px_#4f46e5]">
              <defs>
                <linearGradient id="dragonRageHeadGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#c7d2fe" />
                  <stop offset="30%" stopColor="#6366f1" />
                  <stop offset="70%" stopColor="#3730a3" />
                  <stop offset="100%" stopColor="#1e1b4b" />
                </linearGradient>
              </defs>

              {/* Upper dragon skull and sweeping horns */}
              <path
                d="M15 35 Q30 15, 60 8 Q90 15, 105 35 Q115 15, 118 5 Q108 28, 102 45 Q110 52, 112 65 Q95 62, 88 56 Q80 72, 60 74 Q40 72, 32 56 Q25 62, 8 65 Q10 52, 18 45 Q12 28, 2 5 Q5 15, 15 35 Z"
                fill="url(#dragonRageHeadGrad)"
                stroke="#a5b4fc"
                strokeWidth="2.5"
              />

              {/* Roaring lower dragon jaw */}
              <path
                d="M32 68 Q60 102, 88 68 Q60 84, 32 68 Z"
                fill="#312e81"
                stroke="#6366f1"
                strokeWidth="2"
              />

              {/* Razor draconic fangs */}
              <polygon points="40,54 44,66 48,54" fill="#ffffff" />
              <polygon points="72,54 76,66 80,54" fill="#ffffff" />
              <polygon points="56,56 60,70 64,56" fill="#ffffff" />
              <polygon points="46,80 50,70 54,78" fill="#ffffff" />
              <polygon points="66,78 70,70 74,80" fill="#ffffff" />

              {/* Furious glowing cyan draconic eyes */}
              <polygon points="36,36 48,32 44,40" fill="#38bdf8" className="drop-shadow-[0_0_12px_#38bdf8]" />
              <polygon points="84,36 72,32 76,40" fill="#38bdf8" className="drop-shadow-[0_0_12px_#38bdf8]" />
            </svg>
          </div>

          {/* Spiraling dual dragon breath torrents */}
          <div
            className="absolute z-25 pointer-events-none"
            style={{ animation: 'gbaDragonRageBreath1 1.75s ease-out forwards' }}
          >
            <svg width="130" height="40" viewBox="0 0 130 40">
              <path
                d="M 5 20 Q 35 6, 65 24 Q 95 34, 125 18"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="6"
                strokeLinecap="round"
                className="drop-shadow-[0_0_16px_#38bdf8]"
              />
              <path
                d="M 12 20 Q 40 10, 68 22 Q 95 30, 120 20"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div
            className="absolute z-25 pointer-events-none"
            style={{ animation: 'gbaDragonRageBreath2 1.75s ease-out forwards' }}
          >
            <svg width="130" height="40" viewBox="0 0 130 40">
              <path
                d="M 5 20 Q 35 34, 65 16 Q 95 6, 125 22"
                fill="none"
                stroke="#818cf8"
                strokeWidth="5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_16px_#6366f1]"
              />
            </svg>
          </div>

          {/* Concentric dragon energy shockwaves */}
          <div
            className="absolute z-20 pointer-events-none"
            style={{ animation: 'gbaDragonRageShockwave 1.75s ease-out forwards' }}
          >
            <div className="w-24 h-24 rounded-full border-2 border-indigo-400/80 shadow-[0_0_20px_#6366f1]" />
          </div>

          {/* Crackling draconic fire motes */}
          {[
            { dx: '-28px', dy: '-26px' },
            { dx: '32px', dy: '-20px' },
            { dx: '-22px', dy: '30px' },
            { dx: '30px', dy: '28px' }
          ].map((sp, idx) => (
            <div
              key={`dr-spark-${idx}`}
              className="absolute z-35 pointer-events-none"
              style={
                {
                  '--dr-dx': sp.dx,
                  '--dr-dy': sp.dy,
                  animation: `gbaDragonRageSpark 1.75s ease-out ${0.25 + idx * 0.08}s forwards`,
                  opacity: 0
                } as React.CSSProperties
              }
            >
              <span className="text-sm text-cyan-200 drop-shadow-[0_0_8px_#38bdf8] select-none">✦</span>
            </div>
          ))}
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
