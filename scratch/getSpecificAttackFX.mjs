export function getSpecificAttackFX(attack, pokemonCard) {
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
  // Geodude: Stone Barrage (Sequential per-heads rock barrage with Onix-grade morphology & whiff support)
  if (pkm.includes('geodude') && (name.includes('stone barrage') || name.includes('rock throw') || name.includes('barrage'))) {
    return 'stone_barrage_single';
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
    // Abra'nın Psyshock'u artık referans görseldeki seyrek pastel halka rosetleri (lite varyant);
    // yoğun v4 konveyör bloğu Kadabra Super Psy'a transfer edildi (aşağıdaki guard).
    if (name.includes('psyshock')) return 'psyshock_lite_waves';
    if (name.includes('vanish') || name.includes('teleport')) return 'abra_vanish';
  }
  // Kadabra Super Psy: Abra'dan transfer edilen yoğun faz kilitli v4 vortex konveyörü.
  // (Jenerik 'super psy' → super_psy_blast satırından ÖNCE gelmelidir.)
  if (name.includes('super psy') && pkm.includes('kadabra')) return 'psyshock_waves';
  // Drowzee: Pound, Confuse Ray & Nightmare
  if (pkm.includes('drowzee')) {
    if (name.includes('pound')) return 'drowzee_pound';
    if (name.includes('confuse ray') || name.includes('confusion'))
      return 'drowzee_confuse_ray';
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

  // 0d. BATCH 18: BASIC POKÉMON (DODUO, MAGNEMITE, PORYGON) SIGNATURE DISPATCHES
  // Doduo: Fury Attack
  if (pkm.includes('doduo')) {
    if (name.includes('fury attack') || name.includes('fury')) return 'doduo_fury_attack';
  }
  // Magnemite: Magnetism & Thunder Wave
  if (pkm.includes('magnemite')) {
    if (name.includes('magnetism')) return 'magnemite_magnetism';
    if (name.includes('thunder wave') || name.includes('thundershock')) return 'magnemite_thunder_wave';
  }
  // Porygon: Conversion 1 & 2
  if (pkm.includes('porygon')) {
    if (name.includes('conversion')) return 'porygon_conversion';
  }

  // 0e. BATCH 19: BASIC POKÉMON (CHANSEY & HITMONLEE) SIGNATURE DISPATCHES
  // Chansey: Scrunch
  if (pkm.includes('chansey')) {
    if (name.includes('scrunch')) return 'chansey_scrunch';
  }
  // Hitmonlee: Stretch Kick & High Jump Kick
  if (pkm.includes('hitmonlee')) {
    if (name.includes('stretch kick')) return 'hitmonlee_stretch_kick';
    if (name.includes('high jump kick') || name.includes('jump kick')) return 'hitmonlee_high_jump_kick';
  }

  // 0f. BATCH 20: LEGENDARY BIRDS TRIO (ARTICUNO, ZAPDOS, MOLTRES) SIGNATURE DISPATCHES
  // Articuno: Freeze Dry & Blizzard
  if (pkm.includes('articuno')) {
    if (name.includes('freeze dry') || name.includes('freeze-dry')) return 'articuno_freeze_dry';
    if (name.includes('blizzard')) return 'articuno_blizzard';
  }
  // Zapdos: Thunder (pure-SVG 60 DMG), Thunderbolt (stock actor 100 DMG) & Thunderstorm
  if (pkm.includes('zapdos')) {
    if (name.includes('thunderstorm')) return 'zapdos_thunderstorm';
    if (name.includes('thunderbolt')) return 'zapdos_thunderbolt';
    if (name.includes('thunder')) return 'zapdos_thunder';
  }
  // Moltres: Wildfire & Dive Bomb
  if (pkm.includes('moltres')) {
    if (name.includes('wildfire')) return 'moltres_wildfire';
    if (name.includes('dive bomb') || name.includes('dive')) return 'moltres_dive_bomb';
  }

  // 0g. BATCH 21: PSYCHIC TITANS & SHAPESHIFTER (MEWTWO, MR. MIME, DITTO) SIGNATURE DISPATCHES
  // Mewtwo: Psychic & Barrier
  if (pkm.includes('mewtwo')) {
    if (name.includes('barrier')) return 'mewtwo_barrier';
    if (name.includes('psychic')) return 'mewtwo_psychic';
  }
  // Mr. Mime: Meditate & Invisible Wall
  if (pkm.includes('mr. mime') || pkm.includes('mr mime')) {
    if (name.includes('invisible wall')) return 'mr_mime_invisible_wall';
    if (name.includes('meditate')) return 'mr_mime_meditate';
  }
  // Ditto: Transform & Transform Attack
  if (pkm.includes('ditto')) {
    if (name.includes('transform')) return 'ditto_transform';
  }

  // 0d. BATCH 22: TOXIC SLUDGE, CAVE & CONSTRICTION (GRIMER, ZUBAT, TANGELA)
  // Grimer: Nasty Goo, Sticky Hands & Minimize
  if (pkm.includes('grimer')) {
    if (name.includes('nasty goo')) return 'grimer_nasty_goo';
    if (name.includes('sticky hands')) return 'grimer_sticky_hands';
    if (name.includes('minimize')) return 'grimer_minimize';
  }
  // Zubat: Leech Life & Supersonic
  if (pkm.includes('zubat')) {
    if (name.includes('leech life')) return 'zubat_leech_life';
    if (name.includes('supersonic')) return 'zubat_supersonic';
  }
  // Tangela: Bind
  if (pkm.includes('tangela')) {
    if (name.includes('bind')) return 'tangela_bind';
  }
  // Venonat: Stun Spore & Leech Life
  if (pkm.includes('venonat')) {
    if (name.includes('stun spore') || name.includes('spore')) return 'venonat_stun_spore';
    if (name.includes('leech life')) return 'venonat_leech_life';
  }
  // Paras & Parasect: Spore (Tochukaso Mushroom Cloud)
  if (pkm.includes('paras')) {
    if (name.includes('spore')) return 'paras_spore';
  }
  // Exeggcute: Hypnosis
  if (pkm.includes('exeggcute')) {
    if (name.includes('hypnosis')) return 'exeggcute_hypnosis';
  }
  // Shellder: Hide in Shell & Supersonic
  if (pkm.includes('shellder')) {
    if (name.includes('hide in shell') || name.includes('shell')) return 'shellder_hide_in_shell';
    if (name.includes('supersonic')) return 'shellder_supersonic';
  }
  // Horsea: Smokescreen
  if (pkm.includes('horsea')) {
    if (name.includes('smokescreen')) return 'horsea_smokescreen';
  }
  // Tentacool: Acid
  if (pkm.includes('tentacool')) {
    if (name.includes('acid')) return 'tentacool_acid';
  }
  // Psyduck: Headache, Fury Swipes, Dizziness
  if (pkm.includes('psyduck')) {
    if (name.includes('headache')) return 'psyduck_headache';
    if (name.includes('fury swipes')) return 'psyduck_fury_swipes';
    if (name.includes('dizziness')) return 'psyduck_dizziness';
  }
  // Lapras: Glacial Surge (Water Gun) & Aurora Ray (Confuse Ray)
  if (pkm.includes('lapras')) {
    if (name.includes('water gun')) return 'lapras_glacial_surge';
    if (name.includes('confuse ray'))
      return 'lapras_aurora_ray';
  }
  // Seel: Arctic Horn Headbutt
  if (pkm.includes('seel')) {
    if (name.includes('headbutt')) return 'seel_horn_headbutt';
  }

  // 0f. BATCH 23: BASIC POKÉMON (GROUP D: SLOWPOKE, MANKEY, DRATINI, VOLTORB, GROWLITHE)
  // Slowpoke: Spacing Out & Afternoon Nap
  if (pkm.includes('slowpoke')) {
    if (name.includes('spacing out')) return 'slowpoke_spacing_out';
    if (name.includes('afternoon nap') || name.includes('nap')) return 'slowpoke_afternoon_nap';
  }
  // Mankey & Primeape: Anger & Mischief
  if (pkm.includes('mankey') || pkm.includes('primeape')) {
    if (name.includes('anger') || name.includes('mischief')) return 'mankey_anger';
  }
  // Dratini: Pound (Serpentine Azure Tail Whip Strike)
  if (pkm.includes('dratini')) {
    if (name.includes('pound')) return 'dratini_pound';
  }
  // Voltorb & Electrode: Speed Ball
  if (pkm.includes('voltorb') || pkm.includes('electrode')) {
    if (name.includes('speed ball')) return 'voltorb_speed_ball';
  }
  // Growlithe: Flare
  if (pkm.includes('growlithe')) {
    if (name.includes('flare')) return 'flare_burst';
  }

  // 0g. KULVAR B: FOSSIL & SIGNATURE APEX POKÉMON DISPATCHES
  // Aerodactyl: Prehistoric Wing Attack
  if (pkm.includes('aerodactyl')) {
    if (name.includes('wing attack') || name.includes('wing') || name.includes('dive bomb')) return 'aerodactyl_wing_attack';
  }
  // Kabutops: Prehistoric Sickle Cleave & Absorb
  if (pkm.includes('kabutops')) {
    if (name.includes('sharp sickle') || name.includes('absorb') || name.includes('sickle') || name.includes('slash')) return 'kabutops_sickle_slash';
  }
  // Omastar: Spike Cannon
  if (pkm.includes('omastar')) {
    if (name.includes('spike cannon') || name.includes('cannon') || name.includes('spike')) return 'omastar_spike_cannon';
  }
  // Dodrio: Tri-Fury Rage
  if (pkm.includes('dodrio')) {
    if (name.includes('rage') || name.includes('fury') || name.includes('tri attack') || name.includes('tri-attack')) return 'dodrio_tri_fury';
  }
  // Tentacruel: Crimson Lash & Jellyfish Sting
  if (pkm.includes('tentacruel')) {
    if (name.includes('jellyfish sting') || name.includes('sting') || name.includes('acid') || name.includes('poison')) return 'tentacruel_crimson_lash';
  }

  // Bite: Ekans/Arbok get jaw-teeth variant; Super Fang gets dedicated guillotine incisors; others keep star-fang
  if (name.includes('super fang') || (pkm.includes('raticate') && name.includes('fang'))) return 'super_fang_guillotine';
  if ((name === 'bite' || name.includes('bite') || name.includes('fang') || name === 'hyper fang')) {
    if (pkm.includes('ekans') || pkm.includes('arbok')) return 'bite_jaw';
    return 'bite';
  }
  // Vine Whip: Ivysaur, Venusaur, Bellsprout & any Pokémon using Vine Whip gets the authentic Himeno lash
  if (name.includes('vine whip')) {
    return 'vine_whip_lash';
  }
  // Smokescreen: dedicated smoke cloud instead of whirlwind
  if (name.includes('smokescreen')) return 'smokescreen_cloud';
  // Thunderpunch: Electabuzz gets fist+lightning variant
  if (name.includes('thunderpunch') || name.includes('thunder punch')) return 'thunder_punch';
  // Blizzard vs Freeze-Dry distinction
  if (name.includes('blizzard')) return 'blizzard_storm';
  // Crabhammer: Kingler gets dedicated Crabhammer variant
  if (name.includes('crabhammer') || name.includes('crab hammer')) return 'kingler_crabhammer';
  // Horn Attack: Rhydon/Rhyhorn get drill bore; Goldeen gets single-horn thrust; Nidoran gets Horn Hazard
  if (name.includes('horn attack') || name.includes('horn hazard')) {
    if (pkm.includes('rhydon') || pkm.includes('rhyhorn')) return 'rhydon_horn_drill';
    if (pkm.includes('goldeen') || pkm.includes('seaking')) return 'horn_thrust';
    if (pkm.includes('nidoran') || pkm.includes('nidorino') || pkm.includes('nidoking')) return 'nidoran_horn_hazard';
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
  // Irongrip: Pinsir gets dedicated dual-claw lunge vice-clamp; Krabby gets claw clamp
  if (name.includes('irongrip') || name.includes('iron grip')) {
    if (pkm.includes('pinsir')) return 'pinsir_irongrip';
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
  if ((name === 'sleeping gas' || name.includes('sleeping gas')) && (pkm.includes('gastly') || pkm.includes('haunter') || pkm.includes('gengar'))) return 'gastly_sleeping_gas';
  if (name === 'sleeping gas' || name.includes('sleeping gas')) return 'sleeping_gas';
  if (name === 'psyshock' || name.includes('psyshock') || name === 'mind shock' || name.includes('mind shock') || name === 'psypunch') return 'psyshock_waves';
  if (name.includes('doubleslap') || name.includes('double slap')) return 'doubleslap';
  // Poison Vapor (Dark Arbok) is a field-wide venom mist, not a stinger: it has to read as the
  // whole opposing Bench being swallowed, which is exactly what its text does. Sharing the
  // Poison Sting animation made the bench damage invisible.
  if (name.includes('poison vapor')) return 'poison_vapor';
  // Poison Sting & Spit Poison: Weedle gets authentic larva stinger; Ekans gets dedicated serpent venom darts; others get GBA venom needle
  if (name.includes('poison sting') || name.includes('spit poison')) {
    if (pkm.includes('weedle')) return 'weedle_poison_sting';
    if (pkm.includes('ekans')) return 'ekans_poison_sting';
    if (pkm.includes('arbok')) return 'arbok_poison_fang';
    return 'poison_sting';
  }
  if (name.includes('terror strike') && pkm.includes('arbok')) return 'arbok_wrap_constrict';
  if (name.includes('poison fang') && pkm.includes('arbok')) return 'arbok_poison_fang';
  if (name.includes('poison fang')) {
    if (pkm.includes('ekans')) return 'ekans_poison_sting';
    return 'poison_sting';
  }
  if (name === 'poison gas' || name.includes('poison gas')) {
    if (pkm.includes('koffing')) return 'koffing_foul_gas';
    return 'poison_gas';
  }
  if (name === 'foul gas' || name.includes('foul gas')) return 'koffing_foul_gas';
  if (name === 'stun gas' || name.includes('stun gas')) {
    if (pkm.includes('weezing')) return 'weezing_toxic_smog';
    return 'stun_gas';
  }
  if (name === 'foul odor' || name.includes('foul odor')) return 'foul_odor';
  if (name === 'stun spore' || name.includes('stun spore')) return 'stun_spore';
  if (name === 'lullaby' || name.includes('lullaby') || name === 'sing' || name.includes('sing')) return 'sing_lullaby';
  if (name.includes('sludge')) return 'muk_sludge_deluge';
  if (name.includes('smog')) {
    if (pkm.includes('magmar')) return 'magmar_smog';
    return 'weezing_toxic_smog';
  }
  if (pkm.includes('weezing') && (name.includes('mass explosion') || name.includes('selfdestruct'))) return 'weezing_toxic_smog';
  if (name.includes('destiny bond') && (pkm.includes('gastly') || pkm.includes('haunter') || pkm.includes('gengar'))) return 'gastly_sleeping_gas';
  if (name.includes('destiny bond')) return 'destiny_bond_curse';
  if (name.includes('dark mind')) return 'gengar_dark_mind';
  if (name.includes('nightmare')) {
    if (pkm.includes('haunter') || pkm.includes('gastly')) return 'haunter_dream_eater';
    return 'nightmare_spook';
  }
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
  if (name.includes('fire tail') && pokemonCard.id === 'tr-50') return 'charmander_fire_tail_whip';
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
  if (name.includes('ice beam') && (pkm.includes('dewgong') || pkm.includes('seel'))) return 'dewgong_ice_beam';
  if (name.includes('ice beam') || name.includes('blizzard') || name.includes('freeze') || name.includes('frost')) return 'ice_beam_frost';

  // 6. Psychic & Mind
  if (name.includes('psybeam') || name.includes('kaleidoscope')) return 'psybeam_kaleidoscope';
  if (name.includes('dream eater')) return 'haunter_dream_eater';
  if (name.includes('super psy')) return 'super_psy_blast';
  if (name.includes('amnesia')) return 'amnesia_mind_wipe';
  // Alakazam: Confuse Ray (Sugimori watercolor trance actor + golden telekinetic vortex; species guard BEFORE generic rule)
  if (pkm.includes('alakazam') && (name.includes('confuse ray') || name.includes('confusion ray'))) return 'alakazam_confuse_ray';
  if (name.includes('confuse ray') || name.includes('confusion ray') || name.includes('eerie light')) return 'confuse_ray_spiral';
  if (name.includes('prophecy') || (pkm.includes('hypno') && (name.includes('hypno') || name.includes('mind shock')))) return 'hypno_hypnotic_pendulum';
  if (name.includes('psychic') || name.includes('hypnosis') || name.includes('night shade')) return 'psychic_distortion';

  // 7. Grass & Nature
  if (name.includes('solar beam') || name.includes('solarbeam')) return 'solar_beam_charge_blast';
  if (name.includes('petal')) return 'vileplume_petal_dance';
  if (name.includes('mega drain')) return 'butterfree_mega_drain';
  if (name.includes('leech seed')) {
    if (pkm.includes('bulbasaur') || pkm.includes('ivysaur') || pkm.includes('venusaur')) return 'bulbasaur_leech_seed';
    return 'leech_seed_vines';
  }
  if (name.includes('razor leaf')) return 'razor_leaf';
  if (name.includes('vine whip') || name.includes('absorb') || name.includes('giga drain')) return 'leech_seed_vines';
  if ((name.includes('wrap') || name.includes('constrict')) && pkm.includes('arbok')) return 'arbok_wrap_constrict';
  if ((name.includes('wrap') || name.includes('constrict')) && pkm.includes('ekans')) return 'ekans_wrap_constrict';
  if ((name.includes('wrap') || name.includes('constrict')) && (pkm.includes('dratini') || pkm.includes('dragonair') || pkm.includes('dragonite'))) return 'dratini_tail_wrap';
  if (name.includes('string shot') && (pkm.includes('caterpie') || pkm.includes('metapod'))) return 'caterpie_string_shot';
  if (name.includes('web') || name.includes('bind') || name.includes('string shot') || name.includes('wrap') || name.includes('constrict')) return 'string_shot_cocoon';

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
  if (name.includes('guillotine') || (pkm.includes('pinsir') && (name.includes('vice') || name.includes('vise') || name.includes('grip') || name.includes('snap')))) return 'pinsir_guillotine';
  if (name.includes('vice grip') || name.includes('vise grip')) return 'guillotine_snap';

  // 9. Projectiles & Flight
  if (name.includes('horn drill') && (pkm.includes('rhydon') || pkm.includes('rhyhorn'))) return 'rhydon_horn_drill';
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
  if (name.includes('selfdestruct') || name.includes('explosion') || name.includes('mass explosion')) {
    if (pkm.includes('golem') || pkm.includes('graveler') || pkm.includes('geodude')) return 'golem_selfdestruct';
    return 'selfdestruct_shockwave';
  }
  if (name.includes('hyper beam') && pkm.includes('golduck')) return 'hyper_beam_ice';
  if (name.includes('hyper beam')) return 'hyper_beam_annihilation';
  if (name.includes('energy bomb') || name.includes('speed ball') || name.includes('sonicboom')) return 'hyper_beam_laser';
  if (name.includes('horn hazard') || (name.includes('horn') && (pkm.includes('nidoran') || pkm.includes('nidorino') || pkm.includes('nidoking')))) return 'nidoran_horn_hazard';
  if (name.includes('horn attack')) return 'horn_gore';

  // 10. Dragon, Charge & Physical
  if (name.includes('dragon rage')) return 'dragon_rage';

  // 10a. Specific physical attacks with unique, thematic animations
  if (name.includes('mud slap')) return 'mud_slap_throw';
  if (name === 'quick attack') return 'quick_attack_dash';
  if ((name.includes('take down') || name.includes('double-edge')) && (pokemonCard.types?.[0] === 'Fire')) return 'fire_take_down';
  if ((name.includes('flail') || name.includes('flop')) && pkm.includes('magikarp')) return 'fish_flail';
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
  if ((name.includes('withdraw') || name.includes('shell attack') || name.includes('hide in shell')) && (pkm.includes('squirtle') || pkm.includes('wartortle') || pkm.includes('blastoise'))) return 'squirtle_shell_defense';
  if (name.includes('harden') || name.includes('withdraw') || name.includes('minimize') || name.includes('stiffen') || name.includes('scrunch') || name.includes('hide in shell') || name.includes('shell attack') || name.includes('mirror shell') || name === 'barrier') return 'defensive_harden';
  if (name.includes('recover') || name.includes('spacing out') || name.includes('rapid evolution')) return 'recover_heal';
  if (name.includes('swords dance')) {
    if (pkm.includes('scyther')) return 'scyther_blade_dance';
    return 'swords_dance_buff';
  }
  if (name.includes('supersonic')) return 'zubat_supersonic';
  if (name.includes('avalanche')) return 'golem_avalanche';
  if (name.includes('bonemerang')) return 'marowak_bonemerang';
  if (name.includes('leech life') && pkm.includes('golbat')) return 'golbat_leech_life';
  if (name.includes('leech life')) return 'drain_life';

  // 12. Additional poison / misc mappings
  if (name === 'toxic' || name.includes('toxic') || (name.includes('poison') && pkm.includes('nidoking'))) return 'toxic_corrosion';
  if (name.includes('acid') && (pkm.includes('victreebel') || pkm.includes('weepinbell') || pkm.includes('bellsprout'))) return 'victreebel_acid_melt';
  if (name.includes('acid')) return 'toxic_corrosion';
  if (name.includes('poison claws') || name.includes('jellyfish sting')) return 'poison_sting';
  if (name.includes('nasty goo')) return 'nasty_goo';
  if (name.includes('sticky hands')) return 'grimer_sticky_hands';
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