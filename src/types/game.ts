export type CardSupertype = 'Pokemon' | 'Energy' | 'Trainer';
export type PokemonSubtype = 'Basic' | 'Stage 1' | 'Stage 2' | 'Basic Energy' | 'Special Energy';
export type EnergyType = 'Grass' | 'Fire' | 'Water' | 'Lightning' | 'Psychic' | 'Fighting' | 'Colorless';
export type StatusCondition = 'None' | 'Asleep' | 'Confused' | 'Paralyzed';
export type PoisonCondition = 'Poisoned' | 'Toxic';

export interface Attack {
  name: string;
  cost: EnergyType[];
  damage: number;
  damageMultiplier?: string;
  text: string;
}

export interface WeaknessResistance {
  type: EnergyType;
  value: number;
}

export interface PokemonCardData {
  hp: number;
  types: EnergyType[];
  evolvesFrom?: string;
  attacks?: Attack[];
  weakness?: WeaknessResistance;
  resistance?: WeaknessResistance;
  retreatCost: number;
  pokemonPower?: {
    name: string;
    text: string;
  };
}

export interface EnergyCardData {
  provides?: EnergyType[];
  type?: string;
  amount?: number;
  isSpecial?: boolean;
  text?: string;
}

export interface TrainerCardData {
  text: string;
  effectType?: string;
}

export interface Card {
  id: string;
  number: number;
  name: string;
  supertype: CardSupertype;
  subtype?: PokemonSubtype;
  types?: EnergyType[];
  hp?: number;
  evolvesFrom?: string;
  attacks?: Attack[];
  weakness?: WeaknessResistance;
  resistance?: WeaknessResistance;
  retreatCost?: number;
  pokemonPower?: {
    name: string;
    text: string;
  };
  power?: {
    name: string;
    text: string;
  };
  image?: string;
  originalImageUrl?: string;
  energy?: EnergyCardData;
  trainer?: TrainerCardData;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Rare Holo' | string;
  set?: 'Base Set' | 'Jungle' | 'Fossil' | 'Base Set 2' | 'Team Rocket' | string;
  setCode?: 'base' | 'jungle' | 'fossil' | 'base2' | 'rocket' | string;
}

export interface InPlayCard {
  instanceId: string;
  card: Card;
  currentHp: number;
  damage: number;
  status: StatusCondition;
  attachedEnergy: Card[];
  turnsInPlay: number;
  evolutionHistory: Card[];
  isClefairyDoll?: boolean;
  plusPowersAttached?: number;
  preventDamageNextTurn?: boolean;
  preventAllEffectsNextTurn?: boolean;
  hardenActiveNextTurn?: boolean;
  sandAttackedNextTurn?: boolean;
  accuracyDebuffMoveName?: string;
  amnesiaBlockedAttackName?: string;
  /** The move that switched this Pokémon's attacks off (Tail Wag, Leer, Amnesia...). */
  attackBlockMoveName?: string;
  /**
   * Active Pokémon that imposed a Tail Wag / Leer style block. Both of those cards read
   * "(Benching either Pokémon ends this effect.)", so the marker is needed to drop the block
   * when the *attacker* leaves the Active spot, not just the marked defender.
   */
  attackBlockSourceInstanceId?: string;
  /** Game turn after which an attack block lapses ("during your opponent's next turn"). */
  attackBlockExpiresOnTurn?: number;
  destinyBondActiveNextTurn?: boolean;
  defendersAttached?: number;
  minimizeActiveNextTurn?: boolean;
  pounceActiveNextTurn?: boolean;
  swordsDanceActiveNextTurn?: boolean;
  preventAttackNextTurn?: boolean;
  preventRetreatNextTurn?: boolean;
  powerBlockedNextTurn?: boolean;
  /**
   * Set by Dark Arbok's Stare: "that power stops working until the end of your opponent's next
   * turn". Stored as the last game turn the shutdown covers (attack turn + 1) instead of a
   * boolean, because a boolean would have to be cleared at the END of that turn - advanceTurn
   * clears the other "*NextTurn" flags as soon as the player becomes active, which would hand
   * the power straight back on the very turn Stare was meant to lock it down.
   */
  powerDisabledUntilTurn?: number;
  toxicCounter?: number;
  powerUsedThisTurn?: boolean;
  /** Set by Ditto's Transform: the card Ditto is currently copying. */
  transformedInto?: Card;
  /**
   * Independent poison track (official TCG rules): Poisoned/Toxic coexists with
   * Asleep/Paralyzed/Confused. Cleared by retreat, evolution, Full Heal, or benching.
   */
  poisonType?: PoisonCondition;
}

/** Why a Pokémon is currently not allowed to use a given attack. */
export type AttackBlockReason = 'prevent_attack' | 'amnesia';

export interface PlayerState {
  id: 'player' | 'cpu';
  name: string;
  deck: Card[];
  hand: Card[];
  discard: Card[];
  prizes: Card[];
  active: InPlayCard | null;
  bench: InPlayCard[];
  energyAttachedThisTurn: boolean;
  hasRetreatedThisTurn: boolean;
  trainerPlayedThisTurn: boolean; // Limit of 1 Trainer card per turn
  trainerBlockedNextTurn?: boolean; // Blocked by Psyduck's Headache
  deckName?: string;
  deckTypes?: EnergyType[];
}

export type GamePhase = 
  | 'SETUP_ACTIVE' 
  | 'MAIN_PHASE' 
  | 'SELECT_BENCH_REPLACEMENT' 
  | 'WAITING_OPPONENT_REPLACEMENT' 
  | 'GAME_OVER';

export interface GameLogEntry {
  id: string;
  timestamp: string;
  text: string;
  type: 'action' | 'damage' | 'status' | 'system' | 'ai';
}

/**
 * Recorded when a Confused attacker's check coin came up TAILS: the attack never
 * reached the defender, the attacker struck itself instead. The UI needs this to
 * keep the two beats apart - the move animation still travels to the opponent's
 * card (slightly delayed, so it reads as a separate event) while the impact and
 * the damage number land on the confused attacker itself.
 */
export interface ConfusionSelfHit {
  /** Damage the confused attacker dealt to itself. */
  damage: number;
  /** Which side the confused attacker - and therefore the self-hit - belongs to. */
  target: 'player' | 'cpu';
  /** The move that was attempted but never landed. */
  attackName: string;
  /** True when the 20 self-damage finished the attacker off. */
  causedKnockout: boolean;
}

/**
 * An attack that never started because a move such as Tail Wag, Leer or Amnesia had switched
 * the attacker's options off. Recorded so the UI can show a clean "cannot attack" indicator
 * instead of a coin flip plus a full move animation that leads to nothing.
 */
export interface AttackBlocked {
  reason: AttackBlockReason;
  /** The move that imposed the block (Tail Wag / Leer / Amnesia). */
  moveName: string;
}

export interface AttackResult {
  damage: number;
  isWeakness: boolean;
  isResistance: boolean;
  attackName: string;
  confusionSelfHit?: ConfusionSelfHit;
  attackBlocked?: AttackBlocked;
  /**
   * Which of the defender's Pokémon actually took this attack's damage. Stare reads "Choose 1 of
   * your opponent's Pokémon", so the hit can land on the Bench while the Active Pokémon stands
   * there untouched. The UI needs this to put the animation, the shake and the damage number on
   * the card that was struck instead of always on the Active slot.
   */
  damageTarget?: 'active' | 'bench';
  /** Index into the defending player's bench when damageTarget is 'bench'. */
  damageTargetBenchIndex?: number;
  /**
   * Every Benched Pokémon the attack damaged in addition to its main target (Poison Vapor,
   * Blizzard). Recorded so the animation can roll across the whole enemy bench rather than
   * stopping on the Active card, which is the part of the card text the player has to see.
   */
  benchHits?: BenchHit[];
  /** Name of a Pokémon Power this attack shut down (Stare) - shown in the FX label. */
  powerDisabledName?: string;
  /**
   * Move-specific visual intensity multiplier for the FX overlay.
   * Set only by attacks whose damage scales with attached energy count:
   *   Enhancers (Water Gun, Hydro Pump, Hydrocannon): 1.0 + bonusDamage/10 × 0.1
   *   Multipliers (Continuous Fireball): 1.0 + heads × 0.10
   * Undefined for all other moves → FX renders at static baseline.
   */
  fxIntensity?: number;
  /**
   * Number of successful hits from a multi-coin-flip attack (Fury Swipes, Double Kick,
   * Comet Punch, etc.). The UI plays sequential alternating normal/mirrored animation
   * beats instead of a single static hit. Undefined for non-multi-coin moves.
   */
  multiHitCount?: number;
  /**
   * Per-coin results for multi-coin-flip attacks (Doubleslap, Slam, Stone Barrage…).
   * Index i = coin i+1. true = heads (hit connected), false = tails (whiffed).
   * Lets the UI play one animation beat per coin, showing impact only on heads.
   */
  multiHitSequence?: boolean[];
  /**
   * True when Scyther's Slash was boosted by a prior Swords Dance. The UI renders both
   * the normal and mirrored slash simultaneously (X-shape) to convey the double strike.
   */
  swordsDanceBoosted?: boolean;
  /**
   * True when an attack or defense move's coin flip failed (Tails) or whiffed.
   * Prompts the UI to play a rapid, subdued whiff animation instead of the full triumphant sequence.
   */
  whiffed?: boolean;
  /** Coin flip outcome for single-coin moves (true = heads, false = tails). */
  coinFlipSuccess?: boolean;
  /** Recoil or self-damage inflicted on the attacker Pokémon by this attack (Thunderpunch, Double-edge, Take Down, etc.) */
  selfDamage?: number;
}

/** One Benched Pokémon damaged as a secondary effect of an attack. */
export interface BenchHit {
  /** Which side the benched Pokémon belongs to ('cpu' = the attacker's opponent). */
  side: 'player' | 'cpu';
  benchIndex: number;
  instanceId: string;
  pokemonName: string;
  amount: number;
}

/**
 * A single between-turns status damage event (Poison / Toxic) recorded by
 * GameEngine.endTurn so the UI can play the poison_tick FX in the exact same
 * frame that the HP bar actually drops, and on the correct Pokémon instance.
 */
export interface StatusTick {
  target: 'player' | 'cpu';
  instanceId: string;
  pokemonName: string;
  amount: number;
  kind: 'Poisoned' | 'Toxic';
}

/** A player-chosen target Pokémon on the opponent's bench (Lure, Spark, ...). */
export interface AttackEffectChoices {
  amnesiaTarget?: string;
  conversionType?: string;
  metronomeTarget?: number;
  /** Index into the defending Pokémon's attachedEnergy (Hyper Beam, Whirlpool). */
  defenderEnergyIndex?: number;
  /** Index into the attacker's attachedEnergy (Third Eye, Fire Spin). */
  ownEnergyIndex?: number;
  /** Index into the defender's bench (Spark, Dark Mind, Stretch Kick, Flame Pillar, Lure, Drag Off, ...). */
  benchTargetIndex?: number;
  /**
   * Dark Arbok's Stare: "Choose 1 of your opponent's Pokémon." 0 is the Defending (Active)
   * Pokémon, n > 0 is defenderPlayer.bench[n - 1]. Left undefined for the AI, which then
   * picks through GameEngine.pickStareTargetIndex.
   */
  stareTargetIndex?: number;
  /** Index into the attacker's bench (Energy Bomb). */
  ownBenchTargetIndex?: number;
  /** How many Fire Energy cards to discard for Wildfire ("you may discard any number"). */
  energyDiscardCount?: number;
}

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface GameState {
  turn: number;
  turnPlayer: 'player' | 'cpu';
  phase: GamePhase;
  player: PlayerState;
  cpu: PlayerState;
  winner: 'player' | 'cpu' | null;
  winReason?: string;
  difficulty?: AIDifficulty;
  logs: GameLogEntry[];
  pendingKnockout?: {
    faintedName: string;
    isPlayer: boolean;
  };
  lastAttackResult?: AttackResult;
  lastStatusTicks?: StatusTick[];
}
