import { Language, TRANSLATIONS, translateLog, formatCardTypeLabel } from '../i18n/translations';
import React, { useState, useEffect, useRef } from 'react';
import { GameState, Card, InPlayCard, Attack, StatusTick, AttackEffectChoices, ConfusionSelfHit, AttackResult } from '../types/game';
import { GameEngine, STAGE_2_TO_BASIC_MAP } from '../engine/GameEngine';
import { AIPlayer, AIStep } from '../engine/AIPlayer';
import { CardView } from './CardView';
import { CardZoomModal } from './CardZoomModal';
import { CoinFlipModal } from './CoinFlipModal';
import { GameLog } from './GameLog';
import { InGameChat } from './InGameChat';
import { ChatMessage } from '../types/multiplayer';
import { VictoryModal } from './VictoryModal';
import { BattleFXOverlay, ActiveFX, getSpecificAttackFX, isSelfTargetingMove } from './BattleFXOverlay';
import { sounds } from './SoundManager';
import { EnergyOrb } from './EnergyOrb';
import { net } from '../network/MultiplayerManager';
import { NetworkMessage } from '../types/multiplayer';
import { Swords, ArrowRight, Shield, Zap, Sparkles, ArrowLeft, RefreshCw, PlusCircle, Play, Radio, Smile, Skull, Loader2, ArrowUpRight, MessageSquare, Terminal, ChevronUp, ChevronDown } from 'lucide-react';
import { formatCardText, getEnergyIconPath } from '../utils/formatCardText';

interface GameBoardProps {
  initialState: GameState;
  onExitToMenu: () => void;
  onRematch: () => void;
  isMultiplayer?: boolean;
  uiScale?: number;
  onChangeUiScale?: (scale: number) => void;
  lang?: Language;
  onChangeLang?: (lang: Language) => void;
}

/**
 * GameEngine.endTurn() applies between-turns Poison/Toxic damage and advances the turn in a
 * single atomic step, so the resolved state returned by executeAttack() already contains that
 * damage. These helpers let the UI replay it as its own beat: the damage is recorded on the
 * state (lastStatusTicks), held back on the HP bar, and released in the same frame the
 * poison_tick FX starts.
 */
const statusTicksToShow = (resolved: GameState): StatusTick[] =>
  (resolved.lastStatusTicks || []).filter(tk => {
    const active = resolved[tk.target]?.active;
    // Never show a tick on a Pokémon that has since been replaced.
    // Allow 0 HP so lethal poison ticks are still displayed before the fainted animation.
    return !!active && active.instanceId === tk.instanceId;
  });

const poisonFXFromTicks = (ticks: StatusTick[]): ActiveFX[] =>
  ticks.map(tk => ({
    id: Math.random().toString(36).substring(2, 9),
    type: 'poison_tick' as const,
    target: tk.target,
    damageText: `-${tk.amount}`,
  }));

/**
 * How long the attempted move's animation waits before playing on the opponent's card during a
 * confusion self-hit. Enough of an offset that the attacker's own impact reads as a separate
 * event, short enough that the two still belong to one attack beat.
 */
const CONFUSION_MOVE_FX_DELAY_MS = 420;

export const GameBoard: React.FC<GameBoardProps> = ({
  initialState,
  onExitToMenu,
  onRematch,
  isMultiplayer = false,
  uiScale = 1.15,
  onChangeUiScale,
  lang = 'tr',
  onChangeLang
}) => {
  const t = TRANSLATIONS[lang];
  const [state, setState] = useState<GameState>(initialState);
  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);
  const [zoomedCard, setZoomedCard] = useState<Card | null>(null);
  const [zoomedInPlay, setZoomedInPlay] = useState<InPlayCard | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [showEmotes, setShowEmotes] = useState(false);
  const [opponentEmote, setOpponentEmote] = useState<string | null>(null);
  const [activeFXList, setActiveFXList] = useState<ActiveFX[]>([]);
  const [isRetreatMode, setIsRetreatMode] = useState(false);
  const [hoveredDropTarget, setHoveredDropTarget] = useState<{
    type: 'active' | 'bench';
    benchIndex?: number;
    instanceId?: string;
  } | null>(null);
  // DRAG AND DROP STATE (Cross-platform Desktop & Mobile Touch)
  const [draggingCard, setDraggingCard] = useState<{
    card: Card;
    handIndex: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    initialCenterX: number;
    initialCenterY: number;
    isDragActive: boolean;
  } | null>(null);

  const [draggingBenchPokemon, setDraggingBenchPokemon] = useState<{
    inPlay: InPlayCard;
    benchIndex: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    initialCenterX: number;
    initialCenterY: number;
    isDragActive: boolean;
  } | null>(null);

  const [breederModal, setBreederModal] = useState<{
    isOpen: boolean;
    breederHandIndex: number;
    pairs: { basicInPlay: InPlayCard; stage2Card: Card; stage2HandIndex: number; isBench: boolean; benchIndex: number }[];
  } | null>(null);
  const [energyRetrievalModal, setEnergyRetrievalModal] = useState<{
    isOpen: boolean;
    card: Card;
    handIndex: number;
    selectedDiscardHandIndex: number | null;
    selectedDiscardEnergyIndices: number[];
    maxRetrievalCount: number;
  } | null>(null);
  const [maintenanceModal, setMaintenanceModal] = useState<{
    isOpen: boolean;
    card: Card;
    handIndex: number;
    selectedHandIndices: number[];
  } | null>(null);
  const [itemFinderModal, setItemFinderModal] = useState<{
    isOpen: boolean;
    card: Card;
    handIndex: number;
    selectedDiscardIndices: number[];
    selectedDiscardTrainerIndex: number | null;
  } | null>(null);
  const [viewDiscardModal, setViewDiscardModal] = useState<'player' | 'cpu' | null>(null);
  const [computerSearchModal, setComputerSearchModal] = useState<{
    isOpen: boolean;
    card: Card;
    handIndex: number;
    selectedDiscardIndices: number[];
    selectedDeckIndex: number | null;
  } | null>(null);
  const [deckSearchModal, setDeckSearchModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    card: Card;
    handIndex: number;
    cards: { card: Card; originalDeckIndex: number }[];
    onSelect: (chosenDeckIndex: number) => void;
    /** Optional: lets a caller recover cleanly when the player backs out of a mandatory choice. */
    onCancel?: () => void;
  } | null>(null);
  const [trainerSwitchModal, setTrainerSwitchModal] = useState<{
    isOpen: boolean;
    card: Card;
    handIndex: number;
    isGustOfWind: boolean;
  } | null>(null);
  /**
   * Dark Arbok's Stare reads "Choose 1 of your opponent's Pokémon", so the player - not the
   * engine - names the victim, and the pick can be any Benched body as well as the Active one.
   * The attack is already declared and its coins flipped when this opens, so backing out still
   * resolves the move (with the engine's own pick) instead of stranding a locked turn.
   */
  const [stareTargetModal, setStareTargetModal] = useState<{
    isOpen: boolean;
    attackIndex: number;
    coinResults?: boolean[];
  } | null>(null);
  const [powerDiscardModal, setPowerDiscardModal] = useState<{
    isOpen: boolean;
    inPlay: InPlayCard;
    powerName: string;
  } | null>(null);
  const [actionBanner, setActionBanner] = useState<{ text: string; type: 'attack' | 'info' | 'knockout' } | null>(null);
  const [isTurnLocked, setIsTurnLocked] = useState(false);
  // Between-turns Poison/Toxic damage is committed to the engine state atomically with the
  // attack that precedes it. These two fields hold that damage back on the HP bar only, so
  // the bar drops in the exact same frame the poison_tick FX starts (and never on a Pokémon
  // that has since been replaced by a Knockout).
  const [withheldTicks, setWithheldTicks] = useState<StatusTick[]>([]);
  const [isPoisonSequenceActive, setIsPoisonSequenceActive] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'log' | 'chat'>('log');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [floatingChatToast, setFloatingChatToast] = useState<{ sender: string; text: string } | null>(null);
  const [activeTrainerOverlay, setActiveTrainerOverlay] = useState<{ card: Card; isOpponent: boolean } | null>(null);
  
  // Coin Flip Modal State
  const [coinFlipData, setCoinFlipData] = useState<{
    isOpen: boolean;
    reason: string;
    count: number;
    mode?: 'fixed' | 'until_tails';
    onComplete: (results: boolean[]) => void;
  }>({
    isOpen: false,
    reason: '',
    count: 1,
    mode: 'fixed',
    onComplete: () => {}
  });

  // Effect Choice Modal (Amnesia target, Conversion type, Metronome copy)
  const [effectChoiceModal, setEffectChoiceModal] = useState<{
    isOpen: boolean;
    mode: 'amnesia' | 'conversion' | 'metronome';
    attackIndex: number;
    coinResults?: boolean[];
    options: { label: string; value: string | number }[];
  }>({
    isOpen: false,
    mode: 'amnesia',
    attackIndex: 0,
    options: []
  });

  // Card Movement Animation States
  const [ascendingPlayerBenchIdx, setAscendingPlayerBenchIdx] = useState<number | null>(null);
  const [descendingPlayerActive, setDescendingPlayerActive] = useState(false);
  const [ascendingCpuBenchIdx, setAscendingCpuBenchIdx] = useState<number | null>(null);
  const [descendingCpuActive, setDescendingCpuActive] = useState(false);

  const isAiRunningRef = useRef(false);
  const lastAiTurnRunRef = useRef<number>(-1);
  const isChoosingReplacementRef = useRef(false);
  // Engaged when CPU attack beats are still on screen at the moment the turn hands back to the
  // player; keeps the turn locked until they drain without re-locking on the player's own FX.
  const playerTurnFxGateRef = useRef(false);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Ref mirror of activeFXList so the CPU choreography — which must NOT list activeFXList in
  // its dep array — can still read the live FX queue when gating step transitions.
  const activeFXListRef = useRef(activeFXList);
  useEffect(() => {
    activeFXListRef.current = activeFXList;
  }, [activeFXList]);


    // AUTOMATIC FAINTED / KNOCKOUT WATCHDOG (Active & Bench)
    // This is the PRIMARY and RELIABLE mechanism for resolving knockouts.
  useEffect(() => {
    if (state.phase === 'GAME_OVER' || state.winner) return;
    // Never re-resolve if already in replacement selection
    if (state.phase === 'SELECT_BENCH_REPLACEMENT') return;
    // Skip while the poison tick sequence is animating; the explicit handler
    // in handleEndTurn / AI PASS will resolve the knockout after the FX.
    if (isPoisonSequenceActive) return;

    const anyPlayerFainted = (state.player.active && state.player.active.currentHp <= 0) || state.player.bench.some(b => b.currentHp <= 0);
    const anyCpuFainted = (state.cpu.active && state.cpu.active.currentHp <= 0) || state.cpu.bench.some(b => b.currentHp <= 0);

    // SAFETY NET: If player has no active but has bench Pokemon, force replacement phase
    if (!state.player.active && state.player.bench.length > 0 && state.phase === 'MAIN_PHASE') {
      setIsTurnLocked(false);
      setIsAiThinking(false);
      isAiRunningRef.current = false;
      setState(curr => {
        if (curr.phase === 'SELECT_BENCH_REPLACEMENT' || curr.winner) return curr;
        return GameEngine.resolveKnockout(curr);
      });
      return;
    }

    // SAFETY NET: If CPU has no active but has bench Pokemon, auto-promote
    if (!state.cpu.active && state.cpu.bench.length > 0 && state.phase === 'MAIN_PHASE') {
      setState(curr => {
        if (curr.winner) return curr;
        return GameEngine.resolveKnockout(curr);
      });
      return;
    }

    if (anyPlayerFainted) {
      const faintedName = (state.player.active && state.player.active.currentHp <= 0)
        ? state.player.active.card.name
        : state.player.bench.find(b => b.currentHp <= 0)?.card.name || 'Pokémon';
      setActionBanner({ text: `💀 ${faintedName} was Knocked Out!`, type: 'knockout' });
      setIsTurnLocked(false);
      const timer = setTimeout(() => {
        setActiveFXList([]);
        setState(curr => {
          if (curr.phase === 'SELECT_BENCH_REPLACEMENT' || curr.winner || curr.phase === 'GAME_OVER') return curr;
          return GameEngine.resolveKnockout(curr);
        });
        setActionBanner(null);
      }, 1800);
      return () => clearTimeout(timer);
    }

    if (anyCpuFainted) {
      setIsAiThinking(false);
      isAiRunningRef.current = false;
      const faintedName = (state.cpu.active && state.cpu.active.currentHp <= 0)
        ? state.cpu.active.card.name
        : state.cpu.bench.find(b => b.currentHp <= 0)?.card.name || 'Pokémon';
      setActionBanner({ text: `💀 Opponent's ${faintedName} was Knocked Out!`, type: 'knockout' });
      const timer = setTimeout(() => {
        setActiveFXList([]);
        setState(curr => {
          if (curr.phase === 'SELECT_BENCH_REPLACEMENT' || curr.winner || curr.phase === 'GAME_OVER') return curr;
          return GameEngine.resolveKnockout(curr);
        });
        setActionBanner(null);
        setIsAiThinking(false);
        isAiRunningRef.current = false;
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [
    state.player.active?.currentHp,
    state.cpu.active?.currentHp,
    state.player.active === null,
    state.cpu.active === null,
    state.player.bench.length,
    state.cpu.bench.length,
    state.player.bench.map(b => b.currentHp).join(','),
    state.cpu.bench.map(b => b.currentHp).join(','),
    state.phase,
    state.winner,
    isPoisonSequenceActive
  ]);

    // PRELOAD ALL MATCH CARD IMAGES & COIN ASSETS
  useEffect(() => {
    ['/assets/coin_heads.png', '/assets/coin_tails.png', '/assets/coin_heads.svg', '/assets/coin_tails.svg', '/assets/card_back.png'].forEach(src => {
      const img = new Image();
      img.src = src;
    });

    const allCards = [
      ...initialState.player.deck,
      ...initialState.player.hand,
      ...initialState.player.prizes,
      ...initialState.cpu.deck,
      ...initialState.cpu.hand,
      ...initialState.cpu.prizes
    ];
    allCards.forEach(c => {
      if (c) {
        const img = new Image();
        img.src = c.originalImageUrl || c.image || (c.set === 'Base Set' || !c.set ? `/cards/${c.number}.jpg` : '');
      }
    });
  }, [initialState]);

  // Synchronize internal state on rematch / new game
  useEffect(() => {
    setState(initialState);
    setSelectedHandIndex(null);
    setZoomedCard(null);
    setZoomedInPlay(null);
    setActiveFXList([]);
    setIsRetreatMode(false);
    setActionBanner(null);
    setIsTurnLocked(false);
    setActiveTrainerOverlay(null);
    setAscendingPlayerBenchIdx(null);
    setDescendingPlayerActive(false);
    setAscendingCpuBenchIdx(null);
    setDescendingCpuActive(false);
    isAiRunningRef.current = false;
    lastAiTurnRunRef.current = -1;
  }, [initialState]);

  // Trigger battle animation helper
  const triggerFX = (
    type: ActiveFX['type'],
    target: 'player' | 'cpu',
    damageText?: string,
    isWeakness?: boolean,
    isResistance?: boolean,
    isBlocked?: boolean,
    pokemonName?: string,
    isSelfTarget?: boolean,
    slot?: 'active' | 'bench',
    benchIndex?: number
  ) => {
    const fx: ActiveFX = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      target,
      damageText,
      isWeakness,
      isResistance,
      isBlocked,
      pokemonName,
      isSelfTarget,
      slot,
      benchIndex,
      // Self-targeting moves are buffs / heals - nothing recoils, so nothing shakes.
      shake: !isSelfTarget
    };
    setActiveFXList([fx]);
  };

  /**
   * Everything the engine reported about a resolved attack, turned into animation beats.
   *
   * Two rules the old single-beat version could not express: a move that names its own victim
   * (Stare) has to animate on the card that was actually struck, which can be a Benched one, and
   * a move that sweeps the bench (Poison Vapor, Blizzard) has to show a beat on every body it
   * damaged. Without those, both cards look like they only hit the Active Pokémon even though the
   * HP bars elsewhere do move - the damage happens somewhere the player is not being shown.
   */
  const playAttackFX = (spec: {
    fxType: ActiveFX['type'];
    /** Side that was attacked - the side the move animation belongs to. */
    target: 'player' | 'cpu';
    damageText?: string;
    isWeakness?: boolean;
    isResistance?: boolean;
    isBlocked?: boolean;
    attackerName: string;
    selfTarget?: boolean;
    result?: AttackResult;
  }) => {
    const uid = () => Math.random().toString(36).substring(2, 9);
    const onBench = !spec.selfTarget && spec.result?.damageTarget === 'bench';

    // Per-move visual intensity. Only energy-dependent attacks set fxIntensity on the
    // AttackResult; everything else stays undefined → FX renders at its static baseline.
    //   Enhancers  (Water Gun, Hydro Pump, Hydrocannon): 1.0 + max(0, damage − 10) × 0.01
    //   Multipliers (Continuous Fireball, Big Eggsplosion): 1.0 + heads × 0.10
    // Non-energy-dependent coin-flip moves (Playing with Fire, Stomp, Thrash …) do NOT
    // set fxIntensity and remain at 1.0.
    const moveIntensity = spec.result?.fxIntensity;

    // Coin-flip multi-hit attacks animate ONE BEAT PER COIN so the player can read each flip:
    //   • A HEADS beat plays the move's strike animation AND its impact flash / shake / damage.
    //   • A TAILS beat plays the same strike animation but is flagged `whiffed`, so the impact
    //     flash, screen shake and damage number are suppressed - the move visibly "misses".
    // Beats are staggered so they run sequentially, alternating normal / mirrored so consecutive
    // strikes read as left-hand, right-hand, left-hand… instead of one static repeat.
    //
    // Stone Barrage is special: it flips "until tails", so only the HEADS are thrown rocks (the
    // terminating tails is not a rock). Zero heads (first flip tails) falls back to the classic
    // three-rock volley, played whiffed so it clearly reads as a total miss.
    const MULTI_HIT_STAGGER_MS = 380;
    const seq = spec.result?.multiHitSequence;
    const isStoneBarrage = spec.fxType === 'stone_barrage_single';
    const beats: ActiveFX[] = [];

    const baseBeat = (over: Partial<ActiveFX>): ActiveFX => ({
      id: uid(),
      type: spec.fxType,
      target: spec.target,
      slot: onBench ? 'bench' : 'active',
      benchIndex: onBench ? spec.result?.damageTargetBenchIndex : undefined,
      pokemonName: spec.attackerName,
      isSelfTarget: spec.selfTarget,
      intensity: moveIntensity,
      ...over
    });

    if (isStoneBarrage) {
      const heads = spec.result?.multiHitCount ?? 0;
      if (heads === 0) {
        // First coin was tails → zero damage. Legacy triple-rock volley, whiffed (no impact FX).
        beats.push(baseBeat({
          type: 'rock_barrage',
          damageText: spec.damageText,
          isWeakness: spec.isWeakness,
          isResistance: spec.isResistance,
          isBlocked: spec.isBlocked,
          whiffed: true
        }));
      } else {
        // One small rock per heads, each aimed at a different spot on the target card.
        for (let i = 0; i < heads; i++) {
          beats.push(baseBeat({
            type: 'stone_barrage_single',
            damageText: i === 0 ? spec.damageText : undefined,
            isWeakness: i === 0 ? spec.isWeakness : undefined,
            isResistance: i === 0 ? spec.isResistance : undefined,
            isBlocked: i === 0 ? spec.isBlocked : undefined,
            shake: !spec.selfTarget,
            variantSeed: i,
            delayMs: i === 0 ? undefined : i * MULTI_HIT_STAGGER_MS
          }));
        }
      }
    } else if (seq && seq.length > 0) {
      // Per-coin beats: every coin gets its own animation; tails beats are whiffed.
      const firstHit = seq.indexOf(true);
      const labelIdx = firstHit >= 0 ? firstHit : seq.length - 1;
      seq.forEach((isHit, i) => {
        beats.push(baseBeat({
          damageText: i === labelIdx ? spec.damageText : undefined,
          isWeakness: i === labelIdx ? spec.isWeakness : undefined,
          isResistance: i === labelIdx ? spec.isResistance : undefined,
          isBlocked: i === labelIdx ? spec.isBlocked : undefined,
          powerDisabledName: i === 0 ? spec.result?.powerDisabledName : undefined,
          shake: isHit && !spec.selfTarget,
          mirrored: i % 2 === 1,
          whiffed: !isHit,
          swordsDanceBoosted: i === 0 ? spec.result?.swordsDanceBoosted : undefined,
          delayMs: i === 0 ? undefined : i * MULTI_HIT_STAGGER_MS
        }));
      });
    } else {
      // Legacy path: moves that only report multiHitCount (no per-coin sequence) still land one
      // hit beat per heads; single-hit moves collapse to exactly one beat as before.
      const multiHit = spec.result?.multiHitCount ?? 0;
      const beatCount = Math.max(1, multiHit);
      for (let i = 0; i < beatCount; i++) {
        beats.push(baseBeat({
          damageText: i === 0 ? spec.damageText : undefined,
          isWeakness: i === 0 ? spec.isWeakness : undefined,
          isResistance: i === 0 ? spec.isResistance : undefined,
          isBlocked: i === 0 ? spec.isBlocked : undefined,
          shake: !spec.selfTarget,
          powerDisabledName: i === 0 ? spec.result?.powerDisabledName : undefined,
          mirrored: i % 2 === 1,
          swordsDanceBoosted: i === 0 ? spec.result?.swordsDanceBoosted : undefined,
          delayMs: i === 0 ? undefined : i * MULTI_HIT_STAGGER_MS
        }));
      }
    }

    (spec.result?.benchHits ?? []).forEach(hit => {
      beats.push({
        id: uid(),
        // The vapor gets its own compact cloud; anything else replays the move on the bench card.
        type: spec.fxType === 'poison_vapor' ? 'poison_vapor_bench' : spec.fxType,
        target: hit.side,
        slot: 'bench',
        benchIndex: hit.benchIndex,
        damageText: `-${hit.amount} ${t.dmgText}`,
        pokemonName: hit.pokemonName,
        // Staggered so the cloud visibly travels down the bench instead of firing everywhere
        // at once, and short enough to finish before the turn unlocks.
        delayMs: 240 + Math.min(hit.benchIndex, 4) * 110,
        shake: true,
        intensity: moveIntensity
      });
    });

    // Self-targeting moves that ALSO deal damage (Agility) must still show the impact on the
    // opponent's card. The dash / buff animation plays on the attacker's card while the hit
    // lands on the defender with a shake and a floating damage number. Without this beat the
    // opponent's HP bar moves silently and the player cannot read that damage was dealt.
    if (spec.selfTarget && spec.result && spec.result.damage > 0) {
      const oppSide: 'player' | 'cpu' = spec.target === 'player' ? 'cpu' : 'player';
      beats.push({
        id: uid(),
        type: 'tackle',
        target: oppSide,
        slot: 'active',
        damageText: `-${spec.result.damage} ${t.dmgText}`,
        pokemonName: spec.attackerName,
        shake: true,
        delayMs: 450,
        intensity: moveIntensity
      });
    }

    setActiveFXList(beats);
  };

  /**
   * A confused attacker that rolls TAILS never lands its move - it hits itself for 20. Play that
   * out unambiguously: the impact, the card shake and the damage number all go on the confused
   * attacker's own card, while the attempted move still animates on the opponent's card a short
   * beat later (and without any impact flash) so the two stay easy to tell apart.
   */
  const triggerConfusionSelfHit = (
    moveFxType: ActiveFX['type'],
    selfHit: ConfusionSelfHit,
    attackerName: string,
    intensity?: number
  ) => {
    const uid = () => Math.random().toString(36).substring(2, 9);
    const defender: 'player' | 'cpu' = selfHit.target === 'player' ? 'cpu' : 'player';
    setActiveFXList([
      {
        id: uid(),
        type: 'confusion_self_hit',
        target: selfHit.target,
        damageText: `-${selfHit.damage} ${t.dmgText}`,
        pokemonName: attackerName,
        shake: true
      },
      {
        id: uid(),
        type: moveFxType,
        target: defender,
        pokemonName: attackerName,
        delayMs: CONFUSION_MOVE_FX_DELAY_MS,
        whiffed: true,
        intensity
      }
    ]);
  };

  const removeFX = (id: string) => {
    setActiveFXList(prev => prev.filter(f => f.id !== id));
  };

  /**
   * Does a shaking beat sit on this exact slot? The Active card used to shake whenever anything
   * on its side animated, which made a Stare that picked the Bench look like it had hit the
   * Active Pokémon as well.
   */
  const slotShakes = (side: 'player' | 'cpu', slot: 'active' | 'bench', benchIndex?: number) =>
    activeFXList.some(f =>
      f.target === side && f.shake && (f.slot || 'active') === slot &&
      (slot === 'active' || f.benchIndex === benchIndex)
    );

  /**
   * Are attack / status animation beats still on screen? Multi-hit coin-flip moves now run one
   * staggered beat per coin, which can extend well past the fixed turn-unlock timeout. Bench
   * switching (retreat) is therefore additionally locked until every beat has finished and
   * self-removed, so the player can never slip a retreat in mid-volley. Knockout flows clear the
   * FX list outright before handing control to replacement selection, so a fainted defender never
   * leaves the player stuck behind this gate.
   */
  const isAttackFXPlaying = activeFXList.length > 0;

  // Display floating trainer card for 1.8s
  const showFloatingTrainer = (card: Card, isOpponent: boolean) => {
    setActiveTrainerOverlay({ card, isOpponent });
    setTimeout(() => {
      setActiveTrainerOverlay(null);
    }, 1800);
  };

  // Calculate all coin flips needed before and during attack (Sand-attack, Confusion, Attack Effect)
  const getFullAttackCoinFlips = (
    attacker: InPlayCard,
    attack: Attack,
    defender?: InPlayCard | null
  ): { count: number; description: string; mode: 'fixed' | 'until_tails' } => {
    let count = 0;
    const reasons: string[] = [];

    if (attacker.sandAttackedNextTurn || attacker.accuracyDebuffMoveName) {
      count += 1;
      const debuffName = attacker.accuracyDebuffMoveName || 'Sand-attack';
      reasons.push(lang === 'tr' ? `${debuffName} Doğruluk Kontrolü` : `${debuffName} Accuracy`);
    }
    if (attacker.status === 'Confused') {
      count += 1;
      reasons.push(lang === 'tr' ? 'Confusion (Kafa Karışıklığı)' : 'Confusion');
    }

    const text = (attack.text || '').toLowerCase();
    const name = attack.name.toLowerCase();

    const isUntilTails = text.includes('until you get tails') || text.includes('until you get a tails') || name === 'stone barrage';

    if (isUntilTails) {
      reasons.push(attack.name);
      return {
        count: 1,
        mode: 'until_tails',
        description: reasons.join(' + ')
      };
    }

    const attackFlips = getAttackCoinFlipCount(attacker, attack, defender);
    if (attackFlips > 0) {
      count += attackFlips;
      reasons.push(attack.name);
    }

    return {
      count,
      mode: 'fixed',
      description: reasons.join(' + ')
    };
  };

  // The coin plan belongs to the engine: it must match how many coins executeAttack
  // consumes. This wrapper only supplies the board context (the defender's bench size)
  // that the pure helper cannot see. Note the removal of `attack.damageMultiplier === '×'`
  // from that rule — a multiplier means the damage varies, not that a coin is flipped,
  // which is why Kingler's Flail opened a coin modal for no reason.
  const getAttackCoinFlipCount = (attacker: InPlayCard, attack: Attack, defender?: InPlayCard | null): number => {
    const defenderBenchCount = defender
      ? (defender === player.active ? cpu.bench.length : player.bench.length)
      : 0;
    return GameEngine.getAttackCoinFlipCount(attacker, attack, defender, defenderBenchCount);
  };

    // SEQUENTIAL STEP-BY-STEP CPU CHOREOGRAPHY WITH FAIL-SAFE WATCHDOG
  useEffect(() => {
    if (isMultiplayer || state.turnPlayer !== 'cpu' || state.winner || state.phase !== 'MAIN_PHASE') {
      setIsAiThinking(false);
      isAiRunningRef.current = false;
      return;
    }

    // Wait for the player's between-turns poison tick to finish before the opponent acts,
    // otherwise the CPU choreography would overlap (and visually overwrite) the tick.
    if (isPoisonSequenceActive) {
      return;
    }

    // Animation-completion gating happens inside executeNextStep() (see the FX-COMPLETION GATE
    // there). activeFXList must NOT appear in this effect's dep list: every self-removing beat
    // would tear the choreography down and restart it from step 0, duplicating AI actions.

    // Ensure this turn is not duplicate-run while executing
    if (lastAiTurnRunRef.current === state.turn && isAiRunningRef.current) {
      return;
    }
    lastAiTurnRunRef.current = state.turn;

    // Check if CPU active is fainted
    if (!state.cpu.active || state.cpu.active.currentHp <= 0) {
      setIsAiThinking(false);
      isAiRunningRef.current = false;
      setState(curr => GameEngine.resolveKnockout(curr));
      return;
    }

    isAiRunningRef.current = true;
    setIsAiThinking(true);

    let isCleanedUp = false;
    // Retry handle for the FX-completion gate inside executeNextStep; cleared in the cleanup.
    let fxGateRetryTimer: ReturnType<typeof setTimeout> | null = null;
    const steps = AIPlayer.planTurn(state);

    // Ensure the steps list ALWAYS has a terminal ending step (ATTACK or PASS)
    const hasTerminal = steps.some(s => s.type === 'ATTACK' || s.type === 'PASS');
    if (!hasTerminal) {
      steps.push({
        type: 'PASS',
        description: 'Opponent passed the turn.'
      });
    }

    let stepIndex = 0;

    const cleanupAiTurn = () => {
      setIsAiThinking(false);
      isAiRunningRef.current = false;
      setActionBanner(null);
    };

    const executeNextStep = () => {
      if (isCleanedUp || state.winner || state.phase === 'GAME_OVER') {
        cleanupAiTurn();
        return;
      }

      // FX-COMPLETION GATE: never advance to the next CPU step while animation beats are still
      // on screen. The player's previous-turn beats (Thunder Punch ~1.0 s, Agility buff+damage
      // ~1.75 s, Stone Barrage multi-rock volleys 2 s+) outlive the fixed inter-step timeouts,
      // and advancing anyway lets the CPU's coin-flip modal open on top of a still-playing
      // animation. activeFXList is deliberately NOT in this effect's dep list (it churns every
      // time a beat self-removes), so the gate polls against the ref mirror on a short timer;
      // the 15 s watchdog still bounds total wait so a stuck beat can never deadlock the game.
      if (activeFXListRef.current.length > 0) {
        fxGateRetryTimer = setTimeout(executeNextStep, 120);
        return;
      }

      if (stepIndex >= steps.length) {
        // Fallback: If ran out of steps without ending turn, force end turn
        setState(curr => (curr.turnPlayer === 'cpu' && !curr.winner ? GameEngine.endTurn(curr) : curr));
        cleanupAiTurn();
        return;
      }

      const step = steps[stepIndex];
      stepIndex++;

      if (step.type === 'EVOLVE' && step.card && step.targetInstanceId) {
        sounds.playEvolution();
        setActionBanner({ text: step.description, type: 'info' });
        setState(prev => GameEngine.evolvePokemon(prev, 'cpu', -1, step.targetInstanceId, step.card));
        setTimeout(executeNextStep, 900);
      } else if (step.type === 'BENCH' && step.card) {
        sounds.playCardDraw();
        setActionBanner({ text: step.description, type: 'info' });
        setState(prev => GameEngine.benchPokemon(prev, 'cpu', -1, step.card));
        setTimeout(executeNextStep, 800);
      } else if (step.type === 'ATTACH_ENERGY' && step.card && step.targetInstanceId) {
        sounds.playCardDraw();
        setActionBanner({ text: step.description, type: 'info' });
        setState(prev => GameEngine.attachEnergy(prev, 'cpu', -1, step.targetInstanceId, false, step.card));
        setTimeout(executeNextStep, 800);
      } else if (step.type === 'RETREAT' && step.benchIndex !== undefined) {
        sounds.playCardDraw();
        setActionBanner({ text: step.description, type: 'info' });
        setState(prev => GameEngine.retreatPokemon(prev, 'cpu', step.benchIndex!));
        setTimeout(executeNextStep, 1500);
      } else if (step.type === 'TRAINER' && step.card) {
        sounds.playCardDraw();
        showFloatingTrainer(step.card, true);
        setActionBanner({ text: step.description, type: 'info' });
        if (step.card.name === 'Super Potion') {
          if (step.benchIndex !== undefined && step.benchIndex >= 0) {
            triggerFX('super_potion', 'cpu', undefined, undefined, undefined, undefined, undefined, undefined, 'bench', step.benchIndex);
          } else {
            triggerFX('super_potion', 'cpu');
          }
        }
        else if (step.card.name.includes('Potion')) {
          if (step.benchIndex !== undefined && step.benchIndex >= 0) {
            triggerFX('potion', 'cpu', undefined, undefined, undefined, undefined, undefined, undefined, 'bench', step.benchIndex);
          } else {
            triggerFX('potion', 'cpu');
          }
        }
        else if (step.card.name === 'Gust of Wind') triggerFX('gust', 'player');
        else if (step.card.name.includes('Energy Removal')) triggerFX('energy_removal', 'player');
        else if (step.card.name === 'PlusPower') triggerFX('pluspower', 'cpu');
        setState(prev => GameEngine.playTrainer(prev, 'cpu', -1, { targetBenchIndex: step.benchIndex }, step.card));
        setTimeout(executeNextStep, 1500);
      } else if (step.type === 'ATTACK') {
        const cpuActive = stateRef.current.cpu.active || state.cpu.active;
        if (!cpuActive || cpuActive.currentHp <= 0) {
          setTimeout(executeNextStep, 500);
          return;
        }

        // Always resolve attack against the real active Pokémon
        let attackIndexToUse = step.attackIndex ?? 0;
        if (step.attack && cpuActive.card.attacks) {
          const matchIdx = cpuActive.card.attacks.findIndex(a => a.name.toLowerCase() === step.attack!.name.toLowerCase());
          if (matchIdx !== -1) {
            attackIndexToUse = matchIdx;
          }
        }

        const validAttack = cpuActive.card.attacks?.[attackIndexToUse];
        if (!validAttack || !GameEngine.canPayAttackCost(cpuActive, validAttack)) {
          const payableIdx = cpuActive.card.attacks?.findIndex((_, i) => {
            const a = cpuActive.card.attacks?.[i];
            return !!a && GameEngine.canPayAttackCost(cpuActive, a) && GameEngine.canUseAttack(cpuActive, a, stateRef.current.turn);
          });
          if (payableIdx !== undefined && payableIdx !== -1) {
            attackIndexToUse = payableIdx;
          } else {
            setState(prev => GameEngine.endTurn(prev));
            cleanupAiTurn();
            return;
          }
        }

        const attackToUse = cpuActive.card.attacks![attackIndexToUse];

        /**
         * Tail Wag / Leer / Amnesia switch the move off before it starts. Running it anyway made
         * the player sit through a coin flip and the whole move animation for an attack the
         * engine then dropped in silence, which is exactly what the block "not working" looked
         * like. Show a clear cannot-attack beat instead and let the engine log + close the turn.
         */
        if (GameEngine.getAttackBlockReason(cpuActive, attackToUse, stateRef.current.turn)) {
          const blockerName = cpuActive.attackBlockMoveName
            || (GameEngine.getAttackBlockReason(cpuActive, attackToUse, stateRef.current.turn) === 'amnesia' ? 'Amnesia' : 'Tail Wag');
          setActionBanner({ text: `🚫 ${cpuActive.card.name} cannot attack — blocked by ${blockerName}!`, type: 'info' });
          triggerFX('barrier', 'cpu', lang === 'tr' ? 'SALDIRAMAZ' : 'CANNOT ATTACK', false, false, true, cpuActive.card.name, true);
          setState(prev => {
            const atk = prev.cpu.active?.card.attacks?.[attackIndexToUse];
            // Re-check against the live state: if the mark somehow lapsed in the meantime the turn
            // still has to close, and a move that was declared blocked must never land.
            if (!prev.cpu.active || !prev.player.active || !atk || !GameEngine.getAttackBlockReason(prev.cpu.active, atk, prev.turn)) {
              return GameEngine.endTurn(prev);
            }
            return GameEngine.executeAttack(prev, attackIndexToUse);
          });
          setTimeout(cleanupAiTurn, 1800);
          return;
        }

        const { count: coinCount, description, mode } = getFullAttackCoinFlips(cpuActive, attackToUse, stateRef.current.player.active || state.player.active);

        let hasExecutedCpuAttack = false;
        const performCpuAttack = (coinResults?: boolean[]) => {
          if (hasExecutedCpuAttack) return;
          hasExecutedCpuAttack = true;
          sounds.playAttackHit();
          setActionBanner({ text: `⚔️ Opponent's ${cpuActive.card.name} used ${attackToUse.name}!`, type: 'attack' });

          setState(prev => {
            if (!prev.cpu.active || !prev.player.active) return prev;
            const fxType = getSpecificAttackFX(attackToUse, prev.cpu.active.card);

            // CPU auto-selects effect choices for Amnesia / Conversion / Metronome
            const atkLower = attackToUse.name.toLowerCase();
            let cpuEffectChoices: { amnesiaTarget?: string; conversionType?: string; metronomeTarget?: number } | undefined;
            if (atkLower === 'amnesia' && prev.player.active.card.attacks && prev.player.active.card.attacks.length > 0) {
              // AI blocks the strongest payable attack
              let bestIdx = 0;
              let bestDmg = -1;
              prev.player.active.card.attacks.forEach((a, i) => {
                if (GameEngine.canPayAttackCost(prev.player.active!, a) && (a.damage || 0) > bestDmg) {
                  bestDmg = a.damage || 0;
                  bestIdx = i;
                }
              });
              cpuEffectChoices = { amnesiaTarget: prev.player.active.card.attacks[bestIdx].name };
            } else if (atkLower === 'conversion 1' || atkLower === 'conversion 2') {
              // AI picks attacker's own type as resistance / defender weakness type
              const attackerType = prev.cpu.active.card.types?.[0];
              const types = ['Grass', 'Fire', 'Water', 'Lightning', 'Psychic', 'Fighting'];
              cpuEffectChoices = { conversionType: attackerType && types.includes(attackerType) ? attackerType : types[Math.floor(Math.random() * types.length)] };
            } else if (atkLower === 'metronome' && prev.player.active.card.attacks && prev.player.active.card.attacks.length > 0) {
              let bestIdx = 0;
              let bestDmg = -1;
              prev.player.active.card.attacks.forEach((a, i) => {
                if ((a.damage || 0) > bestDmg) { bestDmg = a.damage || 0; bestIdx = i; }
              });
              cpuEffectChoices = { metronomeTarget: bestIdx };
            }

            const next = GameEngine.executeAttack(prev, attackIndexToUse, coinResults, cpuEffectChoices);
            // Hold the between-turns poison damage back on the HP bar until its FX plays.
            const cpuTicks = statusTicksToShow(next);
            if (cpuTicks.length > 0) setWithheldTicks(cpuTicks);

            const atkRes = next.lastAttackResult;
            const attackerType = prev.cpu.active!.card.types?.[0];
            const isWeak = atkRes ? atkRes.isWeakness : (prev.player.active?.card.weakness?.type === attackerType);
            const isResist = atkRes ? atkRes.isResistance : (prev.player.active?.card.resistance?.type === attackerType);
            const calculatedDmg = atkRes ? atkRes.damage : (attackToUse.damage || 0);
            // A shield on the Active Pokémon must not turn a Stare that picked the Bench into a
            // "BLOCKED" beat - look at the card the engine says was struck.
            const struck = atkRes?.damageTarget === 'bench' ? prev.player.bench[atkRes.damageTargetBenchIndex ?? -1] : prev.player.active;
            const isBlocked = calculatedDmg === 0 && Boolean(struck?.preventDamageNextTurn || struck?.preventAllEffectsNextTurn || struck?.hardenActiveNextTurn);

            const selfTarget = isSelfTargetingMove(attackToUse.name);
            // A confused CPU attacker that rolled TAILS hit itself, not the player's Pokémon.
            if (atkRes?.confusionSelfHit) {
              const confusionIntensity = (prev.cpu.active!.card.name.includes('Onix') && fxType === 'big_boulder') ? 0.4 : undefined;
              triggerConfusionSelfHit(fxType, atkRes.confusionSelfHit, prev.cpu.active!.card.name, confusionIntensity);
            } else {
              playAttackFX({
                fxType: isBlocked ? 'barrier' : fxType,
                target: selfTarget ? 'cpu' : 'player',
                damageText: isBlocked
                  ? (lang === 'tr' ? 'ENGELLENDİ' : 'BLOCKED')
                  : selfTarget ? attackToUse.name : (calculatedDmg > 0 ? `-${calculatedDmg} ${t.dmgText}` : t.effectText),
                isWeakness: isWeak,
                isResistance: isResist,
                isBlocked,
                attackerName: prev.cpu.active?.card.name || '',
                selfTarget,
                result: atkRes
              });
            }
            return next;
          });

          // Check if either Pokémon was knocked out from the attack
          setTimeout(() => {
            setState(current => {
              const playerActiveFainted = current.player.active && current.player.active.currentHp <= 0;
              const cpuActiveFainted = current.cpu.active && current.cpu.active.currentHp <= 0;

              if (playerActiveFainted) {
                setActionBanner({ text: `💀 ${current.player.active!.card.name} was Knocked Out!`, type: 'knockout' });
                setTimeout(() => {
                  setActiveFXList([]);
                  setWithheldTicks([]);
                  setState(postKnockout => GameEngine.resolveKnockout(postKnockout));
                  setActionBanner(null);
                  cleanupAiTurn();
                }, 1800);
              } else if (cpuActiveFainted) {
                setActionBanner({ text: `💀 Opponent's ${current.cpu.active!.card.name} was Knocked Out!`, type: 'knockout' });
                setTimeout(() => {
                  setActiveFXList([]);
                  if (current.cpu.bench.length > 0) {
                    setAscendingCpuBenchIdx(0);
                    setTimeout(() => {
                      setActiveFXList([]);
                      setState(postKnockout => GameEngine.resolveKnockout(postKnockout));
                      setAscendingCpuBenchIdx(null);
                      setActionBanner(null);
                      cleanupAiTurn();
                    }, 650);
                  } else {
                    setState(postKnockout => GameEngine.resolveKnockout(postKnockout));
                    setActionBanner(null);
                    cleanupAiTurn();
                  }
                }, 1800);
              } else {
                // Release the held-back poison damage in the very same frame the tick FX starts,
                // so the HP bar and the floating number always agree.
                const ticks = statusTicksToShow(current);
                setWithheldTicks([]);
                if (ticks.length > 0) {
                  setIsPoisonSequenceActive(true);
                  setActiveFXList(poisonFXFromTicks(ticks));
                  setTimeout(() => {
                    setActiveFXList([]);
                    setIsPoisonSequenceActive(false);

                    // Check if the poison/toxic tick was lethal
                    const playerFainted = current.player.active && current.player.active.currentHp <= 0;
                    const cpuFainted = current.cpu.active && current.cpu.active.currentHp <= 0;

                    if (playerFainted || cpuFainted) {
                      const faintedName = playerFainted
                        ? current.player.active!.card.name
                        : current.cpu.active!.card.name;
                      const bannerText = playerFainted
                        ? `💀 Your ${faintedName} succumbed to Poison and was Knocked Out!`
                        : `💀 Opponent's ${faintedName} succumbed to Poison and was Knocked Out!`;
                      setActionBanner({ text: bannerText, type: 'knockout' });
                      setTimeout(() => {
                        setState(post => GameEngine.resolveKnockout(post));
                        setActionBanner(null);
                        cleanupAiTurn();
                      }, 1800);
                    } else {
                      cleanupAiTurn();
                    }
                  }, 1600);
                } else {
                  cleanupAiTurn();
                }
              }
              return current;
            });
          }, 1400);
        };

        if (coinCount > 0 || mode === 'until_tails') {
          setCoinFlipData({
            isOpen: true,
            reason: mode === 'until_tails'
              ? (lang === 'tr' ? `Rakip Saldırısı - Yazı Gelene Kadar Atış (${description})` : `Opponent Attack - Flip Until Tails (${description})`)
              : (lang === 'tr' ? `Rakip Saldırısı (${description})` : `Opponent Attack (${description})`),
            count: coinCount,
            mode: mode || 'fixed',
            onComplete: (results) => {
              setCoinFlipData(prev => ({ ...prev, isOpen: false }));
              performCpuAttack(results);
            }
          });
        } else {
          performCpuAttack();
        }
      } else if (step.type === 'PASS') {
        setActionBanner({ text: 'Opponent passed the turn.', type: 'info' });
        setTimeout(() => {
          const resolved = GameEngine.endTurn(stateRef.current);
          const ticks = statusTicksToShow(resolved);
          if (ticks.length === 0) {
            setState(resolved);
            cleanupAiTurn();
            return;
          }
          // Hold the damage back for one frame, then commit the state and start the tick FX
          // together, keeping the player locked out until the beat has played.
          setWithheldTicks(ticks);
          setIsPoisonSequenceActive(true);
          setIsTurnLocked(true);
          setState(resolved);
          setTimeout(() => {
            setWithheldTicks([]);
            setActiveFXList(poisonFXFromTicks(ticks));
            setTimeout(() => {
              setActiveFXList([]);
              setIsPoisonSequenceActive(false);

              // Check if the poison/toxic tick was lethal
              const playerFainted = resolved.player.active && resolved.player.active.currentHp <= 0;
              const cpuFainted = resolved.cpu.active && resolved.cpu.active.currentHp <= 0;

              if (playerFainted || cpuFainted) {
                const faintedName = playerFainted
                  ? resolved.player.active!.card.name
                  : resolved.cpu.active!.card.name;
                const bannerText = playerFainted
                  ? `💀 Your ${faintedName} succumbed to Poison and was Knocked Out!`
                  : `💀 Opponent's ${faintedName} succumbed to Poison and was Knocked Out!`;
                setActionBanner({ text: bannerText, type: 'knockout' });
                setTimeout(() => {
                  setState(post => GameEngine.resolveKnockout(post));
                  setActionBanner(null);
                  setIsTurnLocked(false);
                  cleanupAiTurn();
                }, 1800);
              } else {
                setIsTurnLocked(false);
                cleanupAiTurn();
              }
            }, 1600);
          }, 60);
        }, 700);
      }
    };

    const initialTimer = setTimeout(executeNextStep, 700);

    // 15s FAIL-SAFE LIVENESS WATCHDOG FOR CPU TURNS (Ensures complex animations/coin flips complete smoothly)
    const failSafeTimer = setTimeout(() => {
      setState(curr => {
        if (curr.turnPlayer === 'cpu' && !curr.winner && curr.phase === 'MAIN_PHASE') {
          console.warn('CPU Turn Liveness Watchdog triggered: Forcing clean turn transition.');
          return GameEngine.endTurn(curr);
        }
        return curr;
      });
      cleanupAiTurn();
    }, 15000);

    return () => {
      isCleanedUp = true;
      clearTimeout(initialTimer);
      clearTimeout(failSafeTimer);
      if (fxGateRetryTimer) clearTimeout(fxGateRetryTimer);
    };
  }, [state.turnPlayer, state.turn, state.phase, state.winner, isMultiplayer, isPoisonSequenceActive]);

  // Ensure locks and thinking indicators are reset when it becomes the player's turn
  useEffect(() => {
    if (state.turnPlayer !== 'player') {
      playerTurnFxGateRef.current = false;
      return;
    }
    setIsAiThinking(false);
    isAiRunningRef.current = false;
    setIsRetreatMode(false);
    // A pending poison tick owns the turn lock: endTurn() already flipped turnPlayer, but
    // the HP bar has not been released yet. Releasing the lock here would let the player
    // act (and start new choreography) on top of the tick FX.
    if (isPoisonSequenceActive) return;
    // Symmetric gate: executeAttack() hands the turn back synchronously, but the CPU's attack
    // beats may still be animating. Hold the turn lock ONLY for beats that were already on
    // screen at the handoff (once engaged, the gate holds until the queue fully drains); FX
    // the player triggers during their own turn must not re-lock it, hence the flag.
    if (playerTurnFxGateRef.current) {
      if (activeFXList.length > 0) {
        setIsTurnLocked(true);
        return;
      }
      playerTurnFxGateRef.current = false;
    } else if (activeFXList.length > 0) {
      playerTurnFxGateRef.current = true;
      setIsTurnLocked(true);
      return;
    }
    setIsTurnLocked(false);
  }, [state.turnPlayer, isPoisonSequenceActive, activeFXList]);

  // CRITICAL: Ensure isTurnLocked is ALWAYS false during SELECT_BENCH_REPLACEMENT
  // so the player can interact with bench Pokemon to choose a replacement.
  useEffect(() => {
    if (state.phase === 'SELECT_BENCH_REPLACEMENT') {
      setIsTurnLocked(false);
      setIsAiThinking(false);
      isAiRunningRef.current = false;
      setIsRetreatMode(false);
    }
  }, [state.phase]);

  // Handle incoming multiplayer actions
  useEffect(() => {
    if (!isMultiplayer) return;

    const unsubMessage = net.onMessage((msg: NetworkMessage) => {
      if (msg.type === 'GAME_ACTION') {
        const action = msg.payload;
        sounds.playCardDraw();

        if (action.type === 'SELECT_STARTING_ACTIVE') {
          if (action.card) {
            setState(prev => {
              const updated = { ...prev };
              updated.cpu.active = GameEngine.createInPlayCard(action.card);
              if (updated.player.active) {
                updated.phase = 'MAIN_PHASE';
                GameEngine.addLog(updated, `--- Turn 1: ${updated.turnPlayer === 'player' ? 'Your' : "Opponent's"} Turn ---`, 'system');
              }
              GameEngine.addLog(updated, `Opponent placed ${action.card.name} as Active Pokémon.`, 'ai');
              return updated;
            });
          }
        } else if (action.type === 'BENCH_BASIC') {
          setActionBanner({ text: `Opponent benched ${action.card?.name}.`, type: 'info' });
          setTimeout(() => setActionBanner(null), 2500);
          setState(prev => GameEngine.benchPokemon(prev, 'cpu', -1, action.card));
        } else if (action.type === 'EVOLVE') {
          sounds.playEvolution();
          setActionBanner({ text: `Opponent evolved into ${action.card?.name}!`, type: 'info' });
          setTimeout(() => setActionBanner(null), 2500);
          setState(prev => GameEngine.evolvePokemon(prev, 'cpu', -1, undefined, action.card, action.targetIsActive, action.benchIndex));
        } else if (action.type === 'ATTACH_ENERGY') {
          setActionBanner({ text: `Opponent attached ${action.card?.name}.`, type: 'info' });
          setTimeout(() => setActionBanner(null), 2500);
          setState(prev => GameEngine.attachEnergy(prev, 'cpu', -1, undefined, false, action.card, action.targetIsActive, action.benchIndex));
        } else if (action.type === 'PLAY_TRAINER') {
          if (action.card) showFloatingTrainer(action.card, true);
          setActionBanner({ text: `Opponent played ${action.card?.name}!`, type: 'info' });
          setTimeout(() => setActionBanner(null), 2500);
          if (action.card?.name === 'Super Potion') {
            const cpuSpBench = action.trainerParams?.targetBenchIndex;
            if (cpuSpBench !== undefined && cpuSpBench >= 0) {
              triggerFX('super_potion', 'cpu', undefined, undefined, undefined, undefined, undefined, undefined, 'bench', cpuSpBench);
            } else {
              triggerFX('super_potion', 'cpu');
            }
          }
          else if (action.card?.name?.includes('Potion')) {
            const cpuPBench = action.trainerParams?.targetBenchIndex;
            if (cpuPBench !== undefined && cpuPBench >= 0) {
              triggerFX('potion', 'cpu', undefined, undefined, undefined, undefined, undefined, undefined, 'bench', cpuPBench);
            } else {
              triggerFX('potion', 'cpu');
            }
          }
          else if (action.card?.name === 'Gust of Wind') triggerFX('gust', 'player');
          else if (action.card?.name?.includes('Energy Removal')) {
            const erTarget = action.trainerParams?.oppTargetPokemon;
            const erBIdx = erTarget ? player.bench.findIndex(b => b.instanceId === erTarget.instanceId) : -1;
            if (erBIdx !== -1) {
              triggerFX('energy_removal', 'player', undefined, undefined, undefined, undefined, undefined, undefined, 'bench', erBIdx);
            } else {
              triggerFX('energy_removal', 'player');
            }
          }
          else if (action.card?.name === 'PlusPower') triggerFX('pluspower', 'cpu');
          setState(prev => GameEngine.playTrainer(prev, 'cpu', -1, action.trainerParams, action.card));
        } else if (action.type === 'RETREAT' || action.type === 'SELECT_BENCH_REPLACEMENT') {
          const bIdx = action.benchIndex || 0;
          setAscendingCpuBenchIdx(bIdx);
          setDescendingCpuActive(true);
          setActionBanner({ text: 'Opponent switched Active Pokémon!', type: 'info' });

          setTimeout(() => {
            if (action.type === 'RETREAT') {
              setState(prev => GameEngine.retreatPokemon(prev, 'cpu', bIdx));
            } else {
              setState(prev => GameEngine.sendOutBenchedPokemon(prev, 'cpu', bIdx));
            }
            setAscendingCpuBenchIdx(null);
            setDescendingCpuActive(false);
            setTimeout(() => setActionBanner(null), 1500);
          }, 650);
        } else if (action.type === 'ATTACK') {
          sounds.playAttackHit();
          // Mirrors the local attack path. executeAttack() also ends the turn, so any
          // between-turns Poison/Toxic damage is already inside the returned state; hold it
          // back on the HP bar and release it together with its own poison_tick FX, otherwise
          // the remote view drops HP before the number that explains it.
          // Resolved straight from stateRef (like handleEndTurn) instead of inside a setState
          // updater, so React's StrictMode double-invoke cannot re-run the engine.
          let remoteTicks: StatusTick[] = [];
          {
            const updated = { ...stateRef.current };
            const attackerName = updated.cpu.active?.card.name || '';
            const atk = updated.cpu.active?.card.attacks?.[action.attackIndex];
            const fxType = atk && updated.cpu.active
              ? getSpecificAttackFX(atk, updated.cpu.active.card)
              : 'psychic_distortion';
            if (atk) {
              setActionBanner({ text: `⚔️ Opponent's ${attackerName} used ${atk.name}!`, type: 'attack' });
              setTimeout(() => setActionBanner(null), 3000);
            }
            updated.turnPlayer = 'cpu';
            const resolved = GameEngine.executeAttack(updated, action.attackIndex, action.coinResults, action.effectChoices);
            remoteTicks = statusTicksToShow(resolved);
            setState(resolved);
            if (remoteTicks.length > 0) {
              setWithheldTicks(remoteTicks);
              setIsPoisonSequenceActive(true);
            }
            // Which beat to play is only known once the engine has resolved the attack: a confused
            // opponent that rolled TAILS strikes itself, so the impact belongs on its own card.
            if (atk) {
              const atkRes = resolved.lastAttackResult;
              if (atkRes?.confusionSelfHit) {
                const confusionIntensity = (attackerName.includes('Onix') && fxType === 'big_boulder') ? 0.4 : undefined;
                triggerConfusionSelfHit(fxType, atkRes.confusionSelfHit, attackerName, confusionIntensity);
              } else {
                const selfTarget = isSelfTargetingMove(atk.name);
                const dealtDmg = atkRes ? atkRes.damage : (atk.damage || 0);
                playAttackFX({
                  fxType,
                  target: selfTarget ? 'cpu' : 'player',
                  damageText: selfTarget ? atk.name : (dealtDmg > 0 ? `-${dealtDmg} ${t.dmgText}` : t.effectText),
                  isWeakness: atkRes?.isWeakness,
                  isResistance: atkRes?.isResistance,
                  attackerName,
                  selfTarget,
                  result: atkRes
                });
              }
            }
          }

          // Hold 0 HP state for 1.8s before resolving knockout
          setTimeout(() => {
            const current = stateRef.current;
            if (current.player.active && current.player.active.currentHp <= 0) {
              setActionBanner({ text: `💀 Your ${current.player.active.card.name} was Knocked Out!`, type: 'knockout' });
              setTimeout(() => {
                setActiveFXList([]);
                setWithheldTicks([]);
                setIsPoisonSequenceActive(false);
                setState(postHold => GameEngine.resolveKnockout(postHold));
                setActionBanner(null);
              }, 1800);
            } else if (current.cpu.active && current.cpu.active.currentHp <= 0) {
              setActionBanner({ text: `💀 Opponent's ${current.cpu.active.card.name} was Knocked Out!`, type: 'knockout' });
              setTimeout(() => {
                setActiveFXList([]);
                setWithheldTicks([]);
                setIsPoisonSequenceActive(false);
                if (current.cpu.bench.length > 0) {
                  setAscendingCpuBenchIdx(0);
                  setTimeout(() => {
                    setActiveFXList([]);
                    setState(postHold => GameEngine.resolveKnockout(postHold));
                    setAscendingCpuBenchIdx(null);
                    setActionBanner(null);
                  }, 650);
                } else {
                  setState(postHold => GameEngine.resolveKnockout(postHold));
                  setActionBanner(null);
                }
              }, 1800);
            } else {
              setActionBanner(null);
              // Release the held-back damage in the same frame the tick FX starts.
              setWithheldTicks([]);
              if (remoteTicks.length > 0) {
                setActiveFXList(poisonFXFromTicks(remoteTicks));
                setTimeout(() => {
                  setActiveFXList([]);
                  setIsPoisonSequenceActive(false);

                  // Check if the poison/toxic tick was lethal
                  const playerFainted = current.player.active && current.player.active.currentHp <= 0;
                  const cpuFainted = current.cpu.active && current.cpu.active.currentHp <= 0;

                  if (playerFainted || cpuFainted) {
                    const faintedName = playerFainted
                      ? current.player.active!.card.name
                      : current.cpu.active!.card.name;
                    const bannerText = playerFainted
                      ? `💀 Your ${faintedName} succumbed to Poison and was Knocked Out!`
                      : `💀 Opponent's ${faintedName} succumbed to Poison and was Knocked Out!`;
                    setActionBanner({ text: bannerText, type: 'knockout' });
                    setTimeout(() => {
                      setState(post => GameEngine.resolveKnockout(post));
                      setActionBanner(null);
                    }, 1800);
                  }
                }, 1600);
              } else {
                setIsPoisonSequenceActive(false);
              }
            }
          }, 1000);
        } else if (action.type === 'PASS_TURN') {
          setActionBanner({ text: 'Opponent ended turn.', type: 'info' });
          // Same beat as the local handleEndTurn(): commit the engine state and play the
          // poison tick FX together, keeping the board locked while it resolves.
          setIsTurnLocked(true);
          setTimeout(() => {
            setActionBanner(null);
            const resolved = GameEngine.endTurn(stateRef.current);
            const ticks = statusTicksToShow(resolved);
            setState(resolved);
            if (ticks.length === 0) {
              setIsTurnLocked(false);
              return;
            }
            setWithheldTicks(ticks);
            setIsPoisonSequenceActive(true);
            setTimeout(() => {
              setWithheldTicks([]);
              setActiveFXList(poisonFXFromTicks(ticks));
              setTimeout(() => {
                setActiveFXList([]);
                setIsPoisonSequenceActive(false);

                // Check if the poison/toxic tick was lethal
                const playerFainted = resolved.player.active && resolved.player.active.currentHp <= 0;
                const cpuFainted = resolved.cpu.active && resolved.cpu.active.currentHp <= 0;

                if (playerFainted || cpuFainted) {
                  const faintedName = playerFainted
                    ? resolved.player.active!.card.name
                    : resolved.cpu.active!.card.name;
                  const bannerText = playerFainted
                    ? `💀 Your ${faintedName} succumbed to Poison and was Knocked Out!`
                    : `💀 Opponent's ${faintedName} succumbed to Poison and was Knocked Out!`;
                  setActionBanner({ text: bannerText, type: 'knockout' });
                  setTimeout(() => {
                    setState(post => GameEngine.resolveKnockout(post));
                    setActionBanner(null);
                    setIsTurnLocked(false);
                  }, 1800);
                } else {
                  setIsTurnLocked(false);
                }
              }, 1600);
            }, 60);
          }, 700);
        }
      } else if (msg.type === 'CHAT') {
        const chat = msg.payload as ChatMessage;
        sounds.playCardDraw();
        setChatMessages(prev => [...prev, chat]);
        setFloatingChatToast({ sender: chat.senderName || 'Opponent', text: chat.text });
        setTimeout(() => setFloatingChatToast(null), 3500);
        setActiveSidebarTab(currentTab => {
          if (currentTab !== 'chat') {
            setUnreadChatCount(prev => prev + 1);
          }
          return currentTab;
        });
      } else if (msg.type === 'EMOTE') {
        setOpponentEmote(msg.payload?.emote || null);
        sounds.playEvolution();
        setTimeout(() => setOpponentEmote(null), 3500);
      }
    });

    return () => {
      unsubMessage();
    };
  }, [isMultiplayer]);

  const player = state.player;
  const cpu = state.cpu;

  /**
   * Active Pokémon as it should currently be *drawn*. While a poison_tick FX is pending, the
   * damage it already took is added back so the HP bar and the floating number drop together.
   */
  const displayActive = (side: 'player' | 'cpu'): InPlayCard | undefined => {
    const p = side === 'player' ? player.active : cpu.active;
    if (!p) return undefined;
    const tk = withheldTicks.find(x => x.instanceId === p.instanceId);
    if (!tk) return p;
    return {
      ...p,
      damage: Math.max(0, p.damage - tk.amount),
      currentHp: Math.min(p.card.hp || 0, p.currentHp + tk.amount),
    };
  };

  // STRICT INITIAL SETUP: ONLY when in SETUP_ACTIVE phase
  // Calculate half-factor scale for hand cards (e.g. 125% uiScale -> 112.5% handScale, 115% -> 107.5%)
  const handScale = 1 + ((uiScale || 1.15) - 1) * 0.5;

  const isInitialSetup = state.phase === 'SETUP_ACTIVE' && !state.winner;
  const isSelectReplacement = state.phase === 'SELECT_BENCH_REPLACEMENT';
  const isPlayerTurn = state.turnPlayer === 'player' && !state.winner && !isInitialSetup && !isSelectReplacement && !isTurnLocked && Boolean(player.active && player.active.currentHp > 0);

  const isPlayerParalyzed = player.active?.status === 'Paralyzed';
  const isPlayerAsleep = player.active?.status === 'Asleep';

  // Mulligan detection: ONLY during initial setup
  const playerBasicsInHand = player.hand.filter(c => (c.supertype === 'Pokemon' && c.subtype === 'Basic') || c.name === 'Mysterious Fossil' || c.name === 'Clefairy Doll');
  const showMulligan = isInitialSetup && playerBasicsInHand.length === 0;
  const selectedCard = selectedHandIndex !== null ? player.hand[selectedHandIndex] : null;

  // Persistent tracking of hand card group order (preserves column positions until completely exhausted)
  const handOrderRef = React.useRef<string[]>([]);

  // Group identical cards in player hand for stacked fan layout with persistent stable column ordering
  const groupedHand: { card: Card; indices: number[]; count: number }[] = (() => {
    const groupMap = new Map<string, { card: Card; indices: number[]; count: number }>();
    
    player.hand.forEach((card, originalIndex) => {
      const key = card.id || card.name;
      const existing = groupMap.get(key);
      if (existing) {
        existing.indices.push(originalIndex);
        existing.count += 1;
      } else {
        groupMap.set(key, {
          card,
          indices: [originalIndex],
          count: 1
        });
      }
    });

    // 1. Keep existing group keys in order if they still exist in hand
    const updatedOrder = handOrderRef.current.filter(key => groupMap.has(key));
    // 2. Append newly arrived cards at the end (far right)
    groupMap.forEach((_, key) => {
      if (!updatedOrder.includes(key)) {
        updatedOrder.push(key);
      }
    });
    handOrderRef.current = updatedOrder;

    // 3. Return groups strictly in stable order
    return updatedOrder.map(key => groupMap.get(key)!).filter(Boolean);
  })();

  const handleInspect = (card: Card, inPlay?: InPlayCard) => {
    setZoomedCard(card);
    setZoomedInPlay(inPlay || null);
  };

      // DIRECT ACTION EXECUTORS (Support both Direct Drag-and-Drop and Click selection)
  const executeDirectAttachEnergy = (
    handIdx: number,
    targetId: string,
    targetIsActive = true,
    benchIdx = 0
  ) => {
    if (!isPlayerTurn) return;
    const card = player.hand[handIdx];
    if (!card || card.supertype !== 'Energy') return;

    if (player.energyAttachedThisTurn) {
      setActionBanner({
        text: lang === 'tr' ? 'Bu tur zaten bir Energy kartı eklediniz (tur başına 1 sınır)!' : 'You have already attached an Energy card this turn (1 per turn limit)!',
        type: 'info'
      });
      setTimeout(() => setActionBanner(null), 2500);
      return;
    }

    sounds.playCardDraw();
    const realIdx = player.hand.findIndex(c => c === card || (c.id && card.id && c.id === card.id));
    const actualIdx = realIdx !== -1 ? realIdx : handIdx;
    const next = GameEngine.attachEnergy(state, 'player', actualIdx, targetId, false, card, targetIsActive, benchIdx);
    setState(next);

    if (isMultiplayer) {
      net.sendAction({
        type: 'ATTACH_ENERGY',
        card: card,
        targetIsActive,
        benchIndex: benchIdx
      });
    }

    setSelectedHandIndex(null);
  };

  const executeDirectEvolve = (
    handIdx: number,
    targetId: string,
    targetIsActive = true,
    benchIdx = 0
  ) => {
    if (!isPlayerTurn) return;
    const card = player.hand[handIdx];
    if (!card || card.supertype !== 'Pokemon' || !card.evolvesFrom) return;

    let target: InPlayCard | null = null;
    if (player.active && player.active.instanceId === targetId) target = player.active;
    else target = player.bench.find(b => b.instanceId === targetId) || null;

    if (!target || target.card.name !== card.evolvesFrom) {
      setActionBanner({
        text: lang === 'tr' ? `Bu evrim kartı yalnızca ${card.evolvesFrom} üzerine oynanabilir!` : `This evolution card can only be played on ${card.evolvesFrom}!`,
        type: 'info'
      });
      setTimeout(() => setActionBanner(null), 2500);
      return;
    }

    if (state.turn === 1) {
      setActionBanner({ text: lang === 'tr' ? 'Maçın 1. turunda evrimleşilemez!' : 'Cannot evolve on Turn 1 of the game!', type: 'info' });
      setTimeout(() => setActionBanner(null), 2500);
      return;
    }

    if (target.turnsInPlay < 1) {
      setActionBanner({
        text: lang === 'tr' ? `${target.card.name} oyuna girdiği tur evrimleşemez! (1 tur beklenmeli)` : `Cannot evolve ${target.card.name} on the turn it entered play! Must wait 1 turn.`,
        type: 'info'
      });
      setTimeout(() => setActionBanner(null), 2500);
      return;
    }

    sounds.playEvolution();
    const realIdx = player.hand.findIndex(c => c === card || c.id === card.id);
    const actualIdx = realIdx !== -1 ? realIdx : handIdx;
    const next = GameEngine.evolvePokemon(state, 'player', actualIdx, targetId, card, targetIsActive, benchIdx);
    setState(next);

    if (isMultiplayer) {
      net.sendAction({
        type: 'EVOLVE',
        card: card,
        targetIsActive,
        benchIndex: benchIdx
      });
    }

    setSelectedHandIndex(null);
  };

  const executeDirectBenchBasic = (handIdx: number, draggedCard?: Card) => {
    const card = draggedCard || player.hand[handIdx];
    if (!card) return;
    const isBasic = (card.supertype === 'Pokemon' && card.subtype === 'Basic') || card.name === 'Mysterious Fossil' || card.name === 'Clefairy Doll';
    if (!isBasic) return;

    // If starting active has not been set yet, set active!
    if (isInitialSetup) {
      handleSetStartingActive(handIdx);
      return;
    }

    if (player.bench.length < 5) {
      sounds.playCardDraw();
      const realIdx = player.hand.findIndex(c => c === card || c.id === card.id);
      const actualIdx = realIdx !== -1 ? realIdx : handIdx;
      const next = GameEngine.benchPokemon(state, 'player', actualIdx, card);
      setState(next);
      setSelectedHandIndex(null);

      if (isMultiplayer) {
        net.sendAction({
          type: 'BENCH_BASIC',
          card: card,
          handIndex: actualIdx
        });
      }
    }
  };

  // POINTER & TOUCH DRAG CONTROLLERS
  const handleCardPointerDown = (e: React.PointerEvent, card: Card, handIndex: number) => {
    if (isTurnLocked || (!isPlayerTurn && !isInitialSetup)) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const startX = e.clientX;
    const startY = e.clientY;
    const targetEl = e.currentTarget as HTMLElement;
    const rect = targetEl.getBoundingClientRect();
    const initialCenterX = rect.left + rect.width / 2;
    const initialCenterY = rect.top + rect.height / 2;

    const onPointerMove = (moveEv: PointerEvent) => {
      const dist = Math.hypot(moveEv.clientX - startX, moveEv.clientY - startY);
      if (dist > 5) {
        setDraggingCard({
          card,
          handIndex,
          startX,
          startY,
          currentX: moveEv.clientX,
          currentY: moveEv.clientY,
          initialCenterX,
          initialCenterY,
          isDragActive: true
        });

        // Dual Hover Detection: Element from point + Bounding Rect
        const hitEl = document.elementFromPoint(moveEv.clientX, moveEv.clientY);
        const activeSlotEl = document.querySelector('[data-drop-zone="player-active"]') as HTMLElement | null;
        const isOverActive = !!hitEl?.closest('[data-drop-zone="player-active"]') || (() => {
          if (!activeSlotEl) return false;
          const r = activeSlotEl.getBoundingClientRect();
          return (
            moveEv.clientX >= r.left - 30 &&
            moveEv.clientX <= r.right + 30 &&
            moveEv.clientY >= r.top - 30 &&
            moveEv.clientY <= r.bottom + 30
          );
        })();

        if (isOverActive) {
          setHoveredDropTarget({ type: 'active' });
          return;
        }

        const benchPokemonEl = hitEl?.closest('[data-drop-zone="in-play-pokemon"][data-is-active="false"]') as HTMLElement | null;
        if (benchPokemonEl) {
          const bIdx = benchPokemonEl.getAttribute('data-bench-index');
          setHoveredDropTarget({ type: 'bench', benchIndex: bIdx ? parseInt(bIdx, 10) : 0 });
          return;
        }

        setHoveredDropTarget(null);
      }
    };

    const onPointerUp = (upEv: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      // Instantly clear dragging preview and hover target indicators
      setDraggingCard(null);
      setHoveredDropTarget(null);

      const dist = Math.hypot(upEv.clientX - startX, upEv.clientY - startY);
      if (dist <= 6) {
        handleHandCardClick(handIndex);
        return;
      }

      const dropX = upEv.clientX;
      const dropY = upEv.clientY;
      const hitEl = document.elementFromPoint(dropX, dropY);

      // 1. Check Player Active Slot (Dual check: hit element or bounding rect)
      const activeSlotEl = document.querySelector('[data-drop-zone="player-active"]') as HTMLElement | null;
      const isDroppedOnActive = !!hitEl?.closest('[data-drop-zone="player-active"]') || (() => {
        if (!activeSlotEl) return false;
        const r = activeSlotEl.getBoundingClientRect();
        return (
          dropX >= r.left - 40 &&
          dropX <= r.right + 40 &&
          dropY >= r.top - 40 &&
          dropY <= r.bottom + 40
        );
      })();

      if (isDroppedOnActive) {
        const isBasic = (card.supertype === 'Pokemon' && card.subtype === 'Basic') || card.name === 'Mysterious Fossil' || card.name === 'Clefairy Doll';
        if (isBasic) {
          if (isInitialSetup || !player.active) {
            handleSetStartingActive(handIndex);
            setDraggingCard(null);
            return;
          }
        } else if (card.supertype === 'Energy' && player.active) {
          executeDirectAttachEnergy(handIndex, player.active.instanceId, true, 0);
          setDraggingCard(null);
          return;
        } else if (card.supertype === 'Pokemon' && card.evolvesFrom && player.active) {
          executeDirectEvolve(handIndex, player.active.instanceId, true, 0);
          setDraggingCard(null);
          return;
        } else if (card.supertype === 'Trainer') {
          triggerTrainerCardPlay(card, handIndex, undefined, player.active || undefined);
          setDraggingCard(null);
          return;
        }
      }

      // 2. Check Bench Pokémon elements
      const benchPokemonElements = document.querySelectorAll('[data-drop-zone="in-play-pokemon"][data-is-active="false"]');
      for (let i = 0; i < benchPokemonElements.length; i++) {
        const el = benchPokemonElements[i] as HTMLElement;
        const rect = el.getBoundingClientRect();
        const isHit = el.contains(hitEl) || (
          dropX >= rect.left - 25 &&
          dropX <= rect.right + 25 &&
          dropY >= rect.top - 25 &&
          dropY <= rect.bottom + 25
        );
        if (isHit) {
          const instanceId = el.dataset.instanceId;
          const benchIndexStr = el.dataset.benchIndex;
          const benchIndex = benchIndexStr !== undefined ? parseInt(benchIndexStr, 10) : i;

          if (instanceId) {
            if (card.supertype === 'Energy') {
              executeDirectAttachEnergy(handIndex, instanceId, false, benchIndex);
              setDraggingCard(null);
              return;
            } else if (card.supertype === 'Pokemon' && card.evolvesFrom) {
              executeDirectEvolve(handIndex, instanceId, false, benchIndex);
              setDraggingCard(null);
              return;
            } else if (card.supertype === 'Trainer') {
              const inPlayObj = player.bench[benchIndex];
              triggerTrainerCardPlay(card, handIndex, benchIndex, inPlayObj || undefined);
              setDraggingCard(null);
              return;
            }
          }
          break;
        }
      }

      // 3. Check ALL Player Bench Zones / Empty Slots bounding rects
      const benchZoneElements = document.querySelectorAll('[data-drop-zone="player-bench"]');
      let isBenchDropped = !!hitEl?.closest('[data-drop-zone="player-bench"]');
      if (!isBenchDropped) {
        for (let i = 0; i < benchZoneElements.length; i++) {
          const el = benchZoneElements[i] as HTMLElement;
          const rect = el.getBoundingClientRect();
          if (
            dropX >= rect.left - 30 &&
            dropX <= rect.right + 30 &&
            dropY >= rect.top - 30 &&
            dropY <= rect.bottom + 30
          ) {
            isBenchDropped = true;
            break;
          }
        }
      }

      if (isBenchDropped) {
        const isBasic = (card.supertype === 'Pokemon' && card.subtype === 'Basic') || card.name === 'Mysterious Fossil' || card.name === 'Clefairy Doll';
        if (isBasic) {
          executeDirectBenchBasic(handIndex, card);
          setDraggingCard(null);
          return;
        }
      }

      // 4. Check Center Battlefield Zone bounding rect
      const fieldZoneEl = document.querySelector('[data-drop-zone="center-field"]') as HTMLElement | null;
      const isFieldDropped = !!hitEl?.closest('[data-drop-zone="center-field"]') || (() => {
        if (!fieldZoneEl) return false;
        const rect = fieldZoneEl.getBoundingClientRect();
        return (
          dropX >= rect.left - 20 &&
          dropX <= rect.right + 20 &&
          dropY >= rect.top - 20 &&
          dropY <= rect.bottom + 20
        );
      })();

      if (isFieldDropped && card.supertype === 'Trainer') {
        triggerTrainerCardPlay(card, handIndex);
        setDraggingCard(null);
        return;
      }

      setDraggingCard(null);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const handleBenchCardPointerDown = (e: React.PointerEvent, inPlay: InPlayCard, benchIndex: number) => {
    if (isTurnLocked) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const startX = e.clientX;
    const startY = e.clientY;
    const targetEl = e.currentTarget as HTMLElement;
    const rect = targetEl.getBoundingClientRect();
    const initialCenterX = rect.left + rect.width / 2;
    const initialCenterY = rect.top + rect.height / 2;

    const onPointerMove = (moveEv: PointerEvent) => {
      const dist = Math.hypot(moveEv.clientX - startX, moveEv.clientY - startY);
      if (dist > 6) {
        setDraggingBenchPokemon({
          inPlay,
          benchIndex,
          startX,
          startY,
          currentX: moveEv.clientX,
          currentY: moveEv.clientY,
          initialCenterX,
          initialCenterY,
          isDragActive: true
        });

        // Scan if player active slot is hovered
        const activeSlotEl = document.querySelector('[data-drop-zone="player-active"]') as HTMLElement | null;
        if (activeSlotEl) {
          const rect = activeSlotEl.getBoundingClientRect();
          if (
            moveEv.clientX >= rect.left - 20 &&
            moveEv.clientX <= rect.right + 20 &&
            moveEv.clientY >= rect.top - 20 &&
            moveEv.clientY <= rect.bottom + 20
          ) {
            setHoveredDropTarget({ type: 'active' });
            return;
          }
        }
        setHoveredDropTarget(null);
      }
    };

    const onPointerUp = (upEv: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      setDraggingBenchPokemon(null);
      setHoveredDropTarget(null);

      const dist = Math.hypot(upEv.clientX - startX, upEv.clientY - startY);
      if (dist <= 6) {
        // Standard click is handled by CardView's onClick handler
        return;
      }

      const dropX = upEv.clientX;
      const dropY = upEv.clientY;
      const activeSlotEl = document.querySelector('[data-drop-zone="player-active"]') as HTMLElement | null;
      if (activeSlotEl) {
        const rect = activeSlotEl.getBoundingClientRect();
        if (
          dropX >= rect.left - 30 &&
          dropX <= rect.right + 30 &&
          dropY >= rect.top - 30 &&
          dropY <= rect.bottom + 30
        ) {
          if (isSelectReplacement) {
            handleChooseKnockoutReplacement(inPlay.instanceId);
          } else if (isRetreatMode || (isPlayerTurn && player.active && GameEngine.canRetreat(player.active, player.hasRetreatedThisTurn))) {
            handleRetreatToBench(benchIndex);
          }
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const handleHandCardClick = (index: number) => {
    if (isTurnLocked) return;
    sounds.playCardDraw();
    if (selectedHandIndex === index) {
      setSelectedHandIndex(null);
    } else {
      setSelectedHandIndex(index);
    }
  };

  // Mulligan Reshuffle Action (Only for initial setup)
  const handleMulliganReshuffle = () => {
    if (!isInitialSetup) return;
    sounds.playCardDraw();
    setActionBanner({ text: '🔄 Mulligan! Reshuffling hand and drawing 7 new cards...', type: 'info' });
    const next = GameEngine.mulliganHand(state, 'player');
    setState(next);
    setSelectedHandIndex(null);
    setTimeout(() => setActionBanner(null), 2000);
  };

  const handleSetStartingActive = (index: number) => {
    const card = player.hand[index];
    const isBasic = (card?.supertype === 'Pokemon' && card?.subtype === 'Basic') || card?.name === 'Mysterious Fossil' || card?.name === 'Clefairy Doll';
    if (card && isBasic) {
      sounds.playCardDraw();
      const next = GameEngine.selectStartingActive(state, index);
      setSelectedHandIndex(null);

      if (!isMultiplayer) {
        setState(next);

        // Official Pokémon TCG Rule: Flip a coin to determine who goes first
        setTimeout(() => {
          setCoinFlipData({
            isOpen: true,
            reason: lang === 'tr'
              ? '🪙 Resmi Kural: İlk turun kime ait olacağını belirlemek için yazı-tura atılıyor. (TURA = Siz / YAZI = Gary)'
              : '🪙 Official Rule: Flipping a coin to determine who goes first. (HEADS = You / TAILS = Gary)',
            count: 1,
            mode: 'fixed',
            onComplete: (results) => {
              const playerWonToss = results[0] === true;
              setCoinFlipData(prev => ({ ...prev, isOpen: false }));

              if (playerWonToss) {
                sounds.playEvolution();
                setActionBanner({
                  text: lang === 'tr' ? '🪙 TURA! İlk sırayı siz kazandınız. (1. Tur Sizin)' : '🪙 HEADS! You won the coin toss and go first on Turn 1!',
                  type: 'info'
                });
                setState(curr => {
                  const updated = { ...curr, turnPlayer: 'player' as const, phase: 'MAIN_PHASE' as const };
                  GameEngine.addLog(updated, lang === 'tr' ? '🪙 Resmi Kural: İlk Sıra Atışı -> TURA! 1. Tura siz başlıyorsunuz.' : '🪙 Official Rule: Starting Coin Toss -> HEADS! Player starts Turn 1.', 'system');
                  return updated;
                });
                setTimeout(() => setActionBanner(null), 2200);
              } else {
                sounds.playEvolution();
                setActionBanner({
                  text: lang === 'tr' ? '🪙 YAZI! Rakip (Gary) ilk sırayı kazandı. (1. Tur Rakibin)' : '🪙 TAILS! Opponent (Gary) won the coin toss and goes first on Turn 1!',
                  type: 'info'
                });
                setState(curr => {
                  const updated = { ...curr, turnPlayer: 'cpu' as const, phase: 'MAIN_PHASE' as const };
                  GameEngine.addLog(updated, lang === 'tr' ? '🪙 Resmi Kural: İlk Sıra Atışı -> YAZI! 1. Tura Gary (Rakip) başlıyor.' : '🪙 Official Rule: Starting Coin Toss -> TAILS! Opponent starts Turn 1.', 'system');
                  return updated;
                });
                setTimeout(() => setActionBanner(null), 2200);
              }
            }
          });
        }, 350);
      } else {
        // Multiplayer mode
        setState(next);
        net.sendAction({
          type: 'SELECT_STARTING_ACTIVE',
          card: card,
          handIndex: index
        });
      }
    }
  };

  // SEND OUT CHOSEN BENCH POKEMON AFTER KNOCKOUT
  const handleChooseKnockoutReplacement = (instanceId: string) => {
    if (isChoosingReplacementRef.current) return;
    isChoosingReplacementRef.current = true;

    const benchIndex = player.bench.findIndex(b => b.instanceId === instanceId);
    if (benchIndex === -1) {
      isChoosingReplacementRef.current = false;
      return;
    }

    sounds.playCardDraw();
    setAscendingPlayerBenchIdx(benchIndex);
    setActionBanner({ text: `Sending out ${player.bench[benchIndex]?.card.name}!`, type: 'info' });

    setTimeout(() => {
      setState(prev => {
        if (prev.phase !== 'SELECT_BENCH_REPLACEMENT') return prev;
        const idx = prev.player.bench.findIndex(b => b.instanceId === instanceId);
        if (idx === -1) return prev;
        return GameEngine.sendOutBenchedPokemon(prev, 'player', idx);
      });
      setAscendingPlayerBenchIdx(null);
      isChoosingReplacementRef.current = false;
      setTimeout(() => setActionBanner(null), 1500);

      if (isMultiplayer) {
        net.sendAction({
          type: 'SELECT_BENCH_REPLACEMENT',
          benchIndex
        });
      }
    }, 700);
  };

  const handleBenchBasic = (handIndex: number) => {
    executeDirectBenchBasic(handIndex);
  };

  const handleEvolveTarget = (targetId: string, targetIsActive: boolean, benchIndex: number) => {
    if (!isPlayerTurn || selectedHandIndex === null) return;
    const card = player.hand[selectedHandIndex];
    if (!card || card.supertype !== 'Pokemon' || !card.evolvesFrom) return;

    sounds.playEvolution();
    const next = GameEngine.evolvePokemon(state, 'player', selectedHandIndex, targetId);
    setState(next);

    if (isMultiplayer) {
      net.sendAction({
        type: 'EVOLVE',
        card: card,
        targetIsActive,
        benchIndex
      });
    }

    setSelectedHandIndex(null);
  };

  const handleAttachEnergyToTarget = (targetId: string, targetIsActive: boolean, benchIndex: number) => {
    if (!isPlayerTurn || selectedHandIndex === null || player.energyAttachedThisTurn) return;
    const card = player.hand[selectedHandIndex];
    if (!card || card.supertype !== 'Energy') return;

    sounds.playCardDraw();
    const realIdx = player.hand.findIndex(c => c === card || (c.id && card.id && c.id === card.id));
    const actualIdx = realIdx !== -1 ? realIdx : selectedHandIndex;
    const next = GameEngine.attachEnergy(state, 'player', actualIdx, targetId, false, card, targetIsActive, benchIndex);
    setState(next);

    if (isMultiplayer) {
      net.sendAction({
        type: 'ATTACH_ENERGY',
        card: card,
        targetIsActive,
        benchIndex
      });
    }

    setSelectedHandIndex(null);
  };

  const handleInPlayClick = (target: InPlayCard, isBench: boolean) => {
    if (isRetreatMode && isBench) {
      const bIdx = player.bench.findIndex(b => b.instanceId === target.instanceId);
      if (bIdx !== -1) {
        handleRetreatToBench(bIdx);
        return;
      }
    }

    if (isSelectReplacement && isBench) {
      handleChooseKnockoutReplacement(target.instanceId);
      return;
    }

    if (!isPlayerTurn || selectedHandIndex === null) {
      handleInspect(target.card, target);
      return;
    }
    const card = player.hand[selectedHandIndex];
    const benchIndex = isBench ? player.bench.findIndex(b => b.instanceId === target.instanceId) : 0;

    if (card.supertype === 'Pokemon' && card.evolvesFrom === target.card.name) {
      if (state.turn === 1) {
        setActionBanner({ text: 'Cannot evolve on Turn 1 of the game!', type: 'info' });
        setTimeout(() => setActionBanner(null), 2000);
        return;
      }
      if (target.turnsInPlay < 1) {
        setActionBanner({ text: `Cannot evolve ${target.card.name} on the turn it entered play! Must wait 1 turn.`, type: 'info' });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }
      handleEvolveTarget(target.instanceId, !isBench, benchIndex);
      return;
    }

    if (card.supertype === 'Energy') {
      if (!player.energyAttachedThisTurn) {
        handleAttachEnergyToTarget(target.instanceId, !isBench, benchIndex);
      }
      return;
    }

    if (card.supertype === 'Trainer') {
      triggerTrainerCardPlay(card, selectedHandIndex, isBench ? benchIndex : undefined, target);
      return;
    }
  };

    /**
     * Opens the shared card-selection modal - the very same screen Poké Ball, Energy Search
     * and Recycle use - over an arbitrary list of cards. Every "choose a card" decision the
     * engine used to make on the player's behalf goes through here, so the look stays identical.
     */
    const chooseCardFromList = (
      trainerCard: Card,
      handIndex: number,
      title: string,
      description: string,
      cards: { card: Card; originalDeckIndex: number }[],
      onPick: (originalIndex: number) => void,
      onCancel?: () => void
    ) => {
      setDeckSearchModal({
        isOpen: true,
        title,
        description,
        card: trainerCard,
        handIndex,
        cards,
        onCancel,
        onSelect: (chosenIndex) => {
          setDeckSearchModal(null);
          onPick(chosenIndex);
        }
      });
    };

    const showTrainerInfo = (text: string) => {
      setActionBanner({ text, type: 'info' });
      setTimeout(() => setActionBanner(null), 2500);
    };

    /**
     * Energy Removal reads "Choose 1 Energy card attached to 1 of your opponent's Pokémon and
     * discard it", Super Energy Removal adds "discard 1 of your own Energy to strip up to 2".
     * Every one of those is a player decision, so walk them through the shared picker instead
     * of letting the engine grab the last attached Energy.
     */
    const playEnergyRemoval = (card: Card, handIndex: number) => {
      const isSuper = card.name === 'Super Energy Removal';
      const ownActive = player.active;

      if (isSuper && (!ownActive || ownActive.attachedEnergy.length === 0)) {
        showTrainerInfo(lang === 'tr'
          ? "Süper Enerji Giderme için Aktif Pokémon'unuzda en az 1 Enerji kartı ekli olmalıdır!"
          : 'Super Energy Removal requires at least 1 Energy attached to your Active Pokémon!');
        return;
      }

      const oppCandidates = [cpu.active, ...cpu.bench].filter((p): p is InPlayCard => !!p && p.attachedEnergy.length > 0);
      if (oppCandidates.length === 0) {
        showTrainerInfo(lang === 'tr'
          ? "Rakibinin hiçbir Pokémon'unda atılı bir Enerji kartı yok!"
          : "None of your opponent's Pokémon have any attached Energy cards!");
        return;
      }

      const commit = (ownEnergyIndex: number | undefined, oppTarget: InPlayCard, oppEnergyIndices: number[]) => {
        executeTrainerPlay(card, handIndex, undefined, undefined, undefined, isSuper
          ? { chosenEnergyIndex: ownEnergyIndex, chosenOppEnergyIndices: oppEnergyIndices, oppTargetPokemon: oppTarget }
          : { chosenEnergyIndex: oppEnergyIndices[0], oppTargetPokemon: oppTarget });
      };

      const chooseOppEnergy = (oppTarget: InPlayCard, ownEnergyIndex: number | undefined, alreadyPicked: number[]) => {
        const options = oppTarget.attachedEnergy
          .map((e, i) => ({ card: e, originalDeckIndex: i }))
          .filter(x => !alreadyPicked.includes(x.originalDeckIndex));

        const finish = (picked: number) => {
          const nextPicked = [...alreadyPicked, picked];
          if (isSuper && nextPicked.length < 2 && options.length > 1) {
            chooseOppEnergy(oppTarget, ownEnergyIndex, nextPicked);
          } else {
            commit(ownEnergyIndex, oppTarget, nextPicked);
          }
        };

        // A single option is not a choice - but Super Energy Removal still asks so the
        // player can back out instead of being forced to strip a second Energy.
        if (options.length === 1 && !isSuper) {
          finish(options[0].originalDeckIndex);
          return;
        }

        chooseCardFromList(
          card,
          handIndex,
          isSuper
            ? (alreadyPicked.length === 0
                ? (lang === 'tr' ? 'Süper Enerji Giderme: 1. Enerjiyi Seçin' : 'Super Energy Removal: Choose the 1st Energy')
                : (lang === 'tr' ? 'Süper Enerji Giderme: 2. Enerjiyi Seçin' : 'Super Energy Removal: Choose the 2nd Energy'))
            : (lang === 'tr' ? 'Enerji Giderme: Atılacak Enerjiyi Seçin' : 'Energy Removal: Choose the Energy to Discard'),
          lang === 'tr'
            ? `${oppTarget.card.name} üzerindeki atılacak enerji kartını seçin:`
            : `Choose an Energy card attached to ${oppTarget.card.name} to discard:`,
          options,
          finish
        );
      };

      const chooseOppTarget = (ownEnergyIndex: number | undefined) => {
        if (oppCandidates.length === 1) {
          chooseOppEnergy(oppCandidates[0], ownEnergyIndex, []);
          return;
        }
        chooseCardFromList(
          card,
          handIndex,
          isSuper
            ? (lang === 'tr' ? 'Süper Enerji Giderme: Rakip Pokémon Seçin' : 'Super Energy Removal: Choose an Opponent Pokémon')
            : (lang === 'tr' ? 'Enerji Giderme: Rakip Pokémon Seçin' : 'Energy Removal: Choose an Opponent Pokémon'),
          lang === 'tr'
            ? "Enerji atmak istediğiniz rakip Pokémon'u seçin:"
            : "Choose which of your opponent's Pokémon to strip an Energy from:",
          oppCandidates.map((p, i) => ({ card: p.card, originalDeckIndex: i })),
          (i) => chooseOppEnergy(oppCandidates[i], ownEnergyIndex, [])
        );
      };

      if (isSuper) {
        const ownEnergies = ownActive!.attachedEnergy;
        if (ownEnergies.length === 1) {
          chooseOppTarget(0);
          return;
        }
        chooseCardFromList(
          card,
          handIndex,
          lang === 'tr' ? 'Süper Enerji Giderme: Ödeyeceğiniz Enerjiyi Seçin' : 'Super Energy Removal: Choose the Energy You Pay',
          lang === 'tr'
            ? "Efekti başlatmak için Aktif Pokémon'unuzdan atacağınız enerji kartını seçin:"
            : 'Discard 1 Energy from your Active Pokémon to pay for the effect - choose which:',
          ownEnergies.map((e, i) => ({ card: e, originalDeckIndex: i })),
          (ownIdx) => chooseOppTarget(ownIdx)
        );
        return;
      }

      chooseOppTarget(undefined);
    };

    const triggerTrainerCardPlay = (card: Card, handIndex: number, targetBenchIdx?: number, targetPokemon?: InPlayCard) => {
    if (!isPlayerTurn || handIndex === null || handIndex === undefined || handIndex < 0) return;

    if (player.trainerPlayedThisTurn) {
      setActionBanner({ text: lang === 'tr' ? 'Bu tur zaten bir Trainer kartı oynadınız (tur başına 1 limit)!' : 'You have already played a Trainer card this turn (1 per turn limit)!', type: 'info' });
      setTimeout(() => setActionBanner(null), 2500);
      return;
    }

    // 0. Potion / Super Potion: Disallow using pure damage healing on full-health Pokemon
    if (card.name === 'Potion' || card.name === 'Super Potion') {
      let target = targetPokemon || (targetBenchIdx !== undefined ? player.bench[targetBenchIdx] : player.active);

      if (!target) {
        setActionBanner({
          text: lang === 'tr' ? 'İyileştirilecek uygun bir Pokémon bulunamadı!' : 'No eligible Pokémon found to heal!',
          type: 'info'
        });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }

      const isTargetFullHp = (target.damage || 0) <= 0 || target.currentHp >= (target.card.hp || 0);

      // If clicked "Play Trainer" with undamaged active, check if any bench Pokemon is damaged to auto-assist
      if (isTargetFullHp && !targetPokemon && targetBenchIdx === undefined) {
        const damagedBench = player.bench.find(b => (b.damage || 0) > 0 && b.currentHp < (b.card.hp || 0));
        if (damagedBench) {
          target = damagedBench;
          targetPokemon = damagedBench;
        } else {
          setActionBanner({
            text: lang === 'tr'
              ? `${target.card.name} zaten tam canlı (Full HP, hasar almamış)!`
              : `${target.card.name} already has full HP!`,
            type: 'info'
          });
          setTimeout(() => setActionBanner(null), 2500);
          return;
        }
      } else if (isTargetFullHp) {
        setActionBanner({
          text: lang === 'tr'
            ? `${target.card.name} zaten tam canlı (Full HP, hasar almamış)!`
            : `${target.card.name} already has full HP!`,
          type: 'info'
        });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }

      if (card.name === 'Super Potion' && target.attachedEnergy.length === 0) {
        setActionBanner({
          text: lang === 'tr'
            ? `Super Potion için ${target.card.name} üzerinde en az 1 Enerji kartı bulunmalıdır!`
            : `Super Potion requires at least 1 Energy attached to ${target.card.name}!`,
          type: 'info'
        });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }

      // The player chooses which attached Energy pays for the heal (only meaningful when more
      // than one Energy is attached - same rule the Switch / Gust of Wind pickers follow).
      if (card.name === 'Super Potion' && target.attachedEnergy.length > 1) {
        chooseCardFromList(
          card,
          handIndex,
          lang === 'tr' ? 'Süper İksir: Atılacak Enerji Kartını Seçin' : 'Super Potion: Choose the Energy to Discard',
          lang === 'tr'
            ? `${target.card.name} üzerindeki enerji kartlarından mezarlığa atılacak olanı seçin:`
            : `Choose which Energy attached to ${target.card.name} to discard for the heal:`,
          target.attachedEnergy.map((e, i) => ({ card: e, originalDeckIndex: i })),
          (energyIndex) => executeTrainerPlay(card, handIndex, undefined, target, undefined, { chosenEnergyIndex: energyIndex })
        );
        return;
      }
    }

    // 0.05 Energy Removal / Super Energy Removal - handled in its own block below.
    if (card.name === 'Energy Removal' || card.name === 'Super Energy Removal') {
      return playEnergyRemoval(card, handIndex);
    }

    // 0.06 Other "choose ..." Trainers the engine used to decide on the player's behalf.
    if (card.name === 'Mr. Fuji' || card.name === 'Mr Fuji') {
      if (player.bench.length === 0) {
        showTrainerInfo(lang === 'tr' ? 'Yedek kulübenizde Pokémon yok!' : 'You have no Benched Pokémon!');
        return;
      }
      if (targetBenchIdx === undefined && player.bench.length > 1) {
        chooseCardFromList(
          card, handIndex,
          lang === 'tr' ? 'Mr. Fuji: Desteye Dönecek Pokémon Seçin' : 'Mr. Fuji: Choose the Pokémon to Return',
          lang === 'tr'
            ? 'Destede karıştırılmak üzere yedek kulübenizden bir Pokémon seçin:'
            : 'Choose a Benched Pokémon to shuffle back into your deck:',
          player.bench.map((b, i) => ({ card: b.card, originalDeckIndex: i })),
          (bIdx) => executeTrainerPlay(card, handIndex, bIdx)
        );
        return;
      }
    }

    if (card.name === 'Revive') {
      const basics = player.discard
        .map((c, i) => ({ card: c, originalDeckIndex: i }))
        .filter(x => x.card.supertype === 'Pokemon' && x.card.subtype === 'Basic');
      if (basics.length === 0) {
        showTrainerInfo(lang === 'tr' ? 'Iskarta yığınızda Basic Pokémon yok!' : 'No Basic Pokémon in your discard pile!');
        return;
      }
      if (player.bench.length >= 5) {
        showTrainerInfo(lang === 'tr' ? 'Yedek kulübeniz dolu!' : 'Your Bench is full!');
        return;
      }
      if (basics.length > 1) {
        chooseCardFromList(
          card, handIndex,
          lang === 'tr' ? 'Dirilt: Canlandırılacak Pokémon Seçin' : 'Revive: Choose the Pokémon to Revive',
          lang === 'tr'
            ? 'Iskarta yığınızdan yedeğe koyacağınız Basic Pokémonu seçin (yarı HP ile girer):'
            : 'Choose a Basic Pokémon from your discard pile to put onto your Bench (it enters with half HP):',
          basics,
          (discardIdx) => executeTrainerPlay(card, handIndex, undefined, undefined, undefined, { chosenDiscardIndex: discardIdx })
        );
        return;
      }
    }

    if (card.name === 'Pokémon Flute' || card.name === 'Pokemon Flute') {
      const oppBasics = cpu.discard
        .map((c, i) => ({ card: c, originalDeckIndex: i }))
        .filter(x => x.card.supertype === 'Pokemon' && x.card.subtype === 'Basic');
      if (oppBasics.length === 0) {
        showTrainerInfo(lang === 'tr' ? "Rakibin ıskarta yığında Basic Pokémon yok!" : "Your opponent has no Basic Pokémon in their discard pile!");
        return;
      }
      if (cpu.bench.length >= 5) {
        showTrainerInfo(lang === 'tr' ? 'Rakibin yedek kulübesi dolu!' : "Your opponent's Bench is full!");
        return;
      }
      if (oppBasics.length > 1) {
        chooseCardFromList(
          card, handIndex,
          lang === 'tr' ? 'Pokémon Flüt: Canlandırılacak Rakip Pokémon' : 'Pokémon Flute: Choose the Opponent Pokémon',
          lang === 'tr'
            ? 'Rakibin ıskarta yığından yedeğine koyacağınız Basic Pokémonu seçin:'
            : "Choose a Basic Pokémon from your opponent's discard pile to put onto their Bench:",
          oppBasics,
          (discardIdx) => executeTrainerPlay(card, handIndex, undefined, undefined, undefined, { chosenOppDiscardIndex: discardIdx })
        );
        return;
      }
    }

    if (card.name === 'Pokémon Trader' || card.name === 'Pokemon Trader') {
      const handPokes = player.hand
        .map((c, i) => ({ card: c, originalDeckIndex: i }))
        .filter(x => x.card.supertype === 'Pokemon');
      const deckPokes = player.deck
        .map((c, i) => ({ card: c, originalDeckIndex: i }))
        .filter(x => x.card.supertype === 'Pokemon');
      if (handPokes.length === 0 || deckPokes.length === 0) {
        showTrainerInfo(lang === 'tr'
          ? 'Pokémon Trader için elde ve destede birer Pokémon gerekir!'
          : 'Pokémon Trader needs a Pokémon in both your hand and your deck!');
        return;
      }
      const pickDeck = (handIdx: number) => {
        if (deckPokes.length === 1) {
          executeTrainerPlay(card, handIndex, undefined, undefined, undefined, { chosenTraderHandIndex: handIdx, chosenTraderDeckIndex: deckPokes[0].originalDeckIndex });
          return;
        }
        chooseCardFromList(
          card, handIndex,
          lang === 'tr' ? 'Pokémon Trader: Desteden Alınacak Pokémon' : 'Pokémon Trader: Choose the Pokémon to Take',
          lang === 'tr' ? 'Desteden elinize alacağınız Pokémonu seçin:' : 'Choose a Pokémon from your deck to put into your hand:',
          deckPokes,
          (deckIdx) => executeTrainerPlay(card, handIndex, undefined, undefined, undefined, { chosenTraderHandIndex: handIdx, chosenTraderDeckIndex: deckIdx })
        );
      };
      if (handPokes.length > 1) {
        chooseCardFromList(
          card, handIndex,
          lang === 'tr' ? 'Pokémon Trader: Elinden Atılacak Pokémon' : 'Pokémon Trader: Choose the Pokémon to Discard',
          lang === 'tr' ? 'Takas için elinizden atacağınız Pokémonu seçin:' : 'Choose a Pokémon in your hand to discard for the trade:',
          handPokes,
          (handIdx) => pickDeck(handIdx)
        );
        return;
      }
      pickDeck(handPokes[0].originalDeckIndex);
      return;
    }

    // 0.1 Energy Retrieval / Super Energy Retrieval
    if (card.name === 'Energy Retrieval' || card.name === 'Super Energy Retrieval') {
      const otherCardsCount = player.hand.length - 1;
      const energiesInDiscard = player.discard.filter(c => c.supertype === 'Energy');
      const isSuper = card.name === 'Super Energy Retrieval';
      const requiredDiscardCount = isSuper ? 2 : 1;
      const maxRecoverCount = isSuper ? 4 : 2;

      if (otherCardsCount < requiredDiscardCount) {
        setActionBanner({
          text: lang === 'tr'
            ? `${card.name} oynamak için elinizde en az ${requiredDiscardCount} diğer kart bulunmalıdır!`
            : `${card.name} requires discarding ${requiredDiscardCount} other card${requiredDiscardCount > 1 ? 's' : ''} from hand!`,
          type: 'info'
        });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }
      if (energiesInDiscard.length === 0) {
        setActionBanner({
          text: lang === 'tr'
            ? 'Iskarta yığınızda hiç Enerji kartı yok!'
            : 'No Energy cards in your discard pile!',
          type: 'info'
        });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }
      setEnergyRetrievalModal({
        isOpen: true,
        card,
        handIndex,
        selectedDiscardHandIndex: null,
        selectedDiscardEnergyIndices: [],
        maxRetrievalCount: maxRecoverCount
      });
      return;
    }

    // 0.2 Maintenance
    if (card.name === 'Maintenance') {
      const otherCardsCount = player.hand.length - 1;
      if (otherCardsCount < 2) {
        setActionBanner({
          text: lang === 'tr'
            ? 'Maintenance oynamak için elinizde en az 2 diğer kart olmalıdır!'
            : 'Maintenance requires shuffling 2 other cards from hand into your deck!',
          type: 'info'
        });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }
      setMaintenanceModal({
        isOpen: true,
        card,
        handIndex,
        selectedHandIndices: []
      });
      return;
    }

    // 1. Computer Search
    if (card.name === 'Computer Search') {
      const otherCardsCount = player.hand.length - 1;
      if (otherCardsCount < 2) {
        setActionBanner({
          text: lang === 'tr' ? 'Computer Search oynamak için elinizde en az 2 diğer kart olmalıdır!' : 'Computer Search requires discarding 2 other cards from hand!',
          type: 'info'
        });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }
      if (player.deck.length === 0) {
        setActionBanner({
          text: lang === 'tr' ? 'Destenizde aranacak hiç kart yok!' : 'Your deck has no cards left to search!',
          type: 'info'
        });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }
      setComputerSearchModal({
        isOpen: true,
        card,
        handIndex,
        selectedDiscardIndices: [],
        selectedDeckIndex: null
      });
      return;
    }

    // 2. Item Finder
    if (card.name === 'Item Finder') {
      const otherCardsCount = player.hand.length - 1;
      const trainersInDiscard = player.discard.filter(c => c.supertype === 'Trainer');
      if (otherCardsCount < 2) {
        setActionBanner({
          text: lang === 'tr' ? 'Item Finder için elinizden 2 diğer kart atmalısınız!' : 'Item Finder requires discarding 2 other cards from hand!',
          type: 'info'
        });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }
      if (trainersInDiscard.length === 0) {
        setActionBanner({
          text: lang === 'tr' ? 'Iskarta yığınızda hiç Trainer kartı yok!' : 'No Trainer cards in your discard pile!',
          type: 'info'
        });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }
      setItemFinderModal({
        isOpen: true,
        card,
        handIndex,
        selectedDiscardIndices: [],
        selectedDiscardTrainerIndex: null
      });
      return;
    }

    // 3. Pokemon Breeder
    if (card.name === 'Pokemon Breeder' || card.name === 'Pokémon Breeder') {
      const stage2CardsInHand: { card: Card; handIndex: number }[] = [];
      player.hand.forEach((c, idx) => {
        if (c.supertype === 'Pokemon' && c.subtype === 'Stage 2') {
          stage2CardsInHand.push({ card: c, handIndex: idx });
        }
      });
      const inPlayBasics: { inPlay: InPlayCard; isBench: boolean; benchIndex: number }[] = [];
      if (player.active && player.active.turnsInPlay >= 1) {
        inPlayBasics.push({ inPlay: player.active, isBench: false, benchIndex: 0 });
      }
      player.bench.forEach((b, idx) => {
        if (b.turnsInPlay >= 1) {
          inPlayBasics.push({ inPlay: b, isBench: true, benchIndex: idx });
        }
      });
      const validPairs: { basicInPlay: InPlayCard; stage2Card: Card; stage2HandIndex: number; isBench: boolean; benchIndex: number }[] = [];
      stage2CardsInHand.forEach(s2 => {
        const matchingBasicName = STAGE_2_TO_BASIC_MAP[s2.card.name];
        if (matchingBasicName) {
          inPlayBasics.forEach(b => {
            if (b.inPlay.card.name === matchingBasicName) {
              validPairs.push({
                basicInPlay: b.inPlay,
                stage2Card: s2.card,
                stage2HandIndex: s2.handIndex,
                isBench: b.isBench,
                benchIndex: b.benchIndex
              });
            }
          });
        }
      });
      if (state.turn === 1) {
        setActionBanner({ text: lang === 'tr' ? 'Maçın 1. turunda evrimleşilemez!' : 'Cannot evolve on Turn 1 of the game!', type: 'info' });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }
      if (validPairs.length === 0) {
        setActionBanner({
          text: lang === 'tr' ? 'Elinizde ve sahada uygun Pokémon Breeder evrim çifti yok (en az 1 tur beklenmeli)!' : 'No matching Basic and Stage 2 Pokémon pair available to evolve!',
          type: 'info'
        });
        setTimeout(() => setActionBanner(null), 3000);
        return;
      }
      setBreederModal({
        isOpen: true,
        breederHandIndex: handIndex,
        pairs: validPairs
      });
      return;
    }

    // 4. Switch
    if (card.name === 'Switch') {
      if (player.bench.length === 0) {
        setActionBanner({ text: lang === 'tr' ? 'Yedek kulübenizde hiç Pokémon yok!' : 'No Pokémon on your bench to switch with!', type: 'info' });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }
      if (targetBenchIdx !== undefined) {
        executeTrainerPlay(card, handIndex, targetBenchIdx);
        return;
      }
      if (player.bench.length > 1) {
        setTrainerSwitchModal({
          isOpen: true,
          card,
          handIndex,
          isGustOfWind: false
        });
        return;
      }
    }

    // 5. Gust of Wind
    if (card.name === 'Gust of Wind') {
      if (cpu.bench.length === 0) {
        setActionBanner({ text: lang === 'tr' ? 'Rakibin yedek kulübesinde hiç Pokémon yok!' : 'Opponent has no Pokémon on bench!', type: 'info' });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }
      if (targetBenchIdx !== undefined) {
        executeTrainerPlay(card, handIndex, targetBenchIdx);
        return;
      }
      if (cpu.bench.length > 1) {
        setTrainerSwitchModal({
          isOpen: true,
          card,
          handIndex,
          isGustOfWind: true
        });
        return;
      }
    }

    // 6. Energy Search
    if (card.name === 'Energy Search') {
      const basicEnergies = player.deck
        .map((c, i) => ({ card: c, originalDeckIndex: i }))
        .filter(x => x.card.supertype === 'Energy' && (!x.card.subtype || x.card.subtype.includes('Basic') || (!x.card.name.includes('Double Colorless') && !x.card.name.includes('Rainbow'))));

      if (basicEnergies.length === 0) {
        setActionBanner({ text: lang === 'tr' ? 'Destede hiç Temel Enerji kartı yok!' : 'No Basic Energy cards found in deck!', type: 'info' });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }

      setDeckSearchModal({
        isOpen: true,
        title: lang === 'tr' ? 'Energy Search: Temel Enerji Seçin' : 'Energy Search: Choose Basic Energy',
        description: lang === 'tr' ? 'Destenizden elinize eklemek istediğiniz Temel Enerji kartını seçin:' : 'Select a Basic Energy card from your deck to put into your hand:',
        card,
        handIndex,
        cards: basicEnergies,
        onSelect: (chosenDeckIndex) => {
          setDeckSearchModal(null);
          executeDeckSearchTrainerPlay(card, handIndex, chosenDeckIndex);
        }
      });
      return;
    }

    // 7. The Boss's Way
    if (card.name.includes("The Boss's Way") || card.name.includes("The Boss’s Way")) {
      const darkEvos = player.deck
        .map((c, i) => ({ card: c, originalDeckIndex: i }))
        .filter(x => x.card.supertype === 'Pokemon' && x.card.name.includes('Dark') && (x.card.subtype === 'Stage 1' || x.card.subtype === 'Stage 2'));

      if (darkEvos.length === 0) {
        setActionBanner({ text: lang === 'tr' ? 'Destede hiç Dark Evrim kartı yok!' : 'No Dark Evolution cards in deck!', type: 'info' });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }

      setDeckSearchModal({
        isOpen: true,
        title: lang === 'tr' ? "The Boss's Way: Dark Evrim Seçin" : "The Boss's Way: Choose Dark Evolution",
        description: lang === 'tr' ? 'Destenizden elinize eklemek istediğiniz Dark Evrim kartını seçin:' : 'Select a Dark Evolution card from your deck to put into your hand:',
        card,
        handIndex,
        cards: darkEvos,
        onSelect: (chosenDeckIndex) => {
          setDeckSearchModal(null);
          executeDeckSearchTrainerPlay(card, handIndex, chosenDeckIndex);
        }
      });
      return;
    }

    // 8. Coin-flip Trainer cards
    const coinFlipTrainers = ['Gambler', 'Poké Ball', 'Poke Ball', 'Recycle', 'Digger', 'Sleep!'];
    if (coinFlipTrainers.includes(card.name)) {
      if (card.name === 'Recycle' && player.discard.length === 0) {
        setActionBanner({ text: lang === 'tr' ? 'Mezarlığınızda hiç kart yok!' : 'No cards in your discard pile!', type: 'info' });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }

      setCoinFlipData({
        isOpen: true,
        reason: lang === 'tr' ? `${card.name} için Yazı-Tura Atışı` : `Coin Toss for ${card.name}`,
        count: 1,
        onComplete: (results) => {
          setCoinFlipData(prev => ({ ...prev, isOpen: false }));
          const flip = results[0];
          if ((card.name === 'Poké Ball' || card.name === 'Poke Ball') && flip) {
            const allPokemon = player.deck
              .map((c, i) => ({ card: c, originalDeckIndex: i }))
              .filter(x => x.card.supertype === 'Pokemon');

            if (allPokemon.length > 0) {
              setDeckSearchModal({
                isOpen: true,
                title: lang === 'tr' ? 'Poké Ball: TURA! Pokémon Seçin' : 'Poké Ball: HEADS! Choose Pokémon',
                description: lang === 'tr' ? 'Desteden elinize eklemek istediğiniz Pokémon kartını seçin:' : 'Select a Pokémon from your deck to put into your hand:',
                card,
                handIndex,
                cards: allPokemon,
                onSelect: (chosenDeckIndex) => {
                  setDeckSearchModal(null);
                  executeDeckSearchTrainerPlay(card, handIndex, chosenDeckIndex);
                }
              });
              return;
            }
          } else if (card.name === 'Recycle' && flip) {
            if (player.discard.length === 1) {
              executeTrainerPlay(card, handIndex, undefined, undefined, results, { targetDiscardIndex: 0 });
              return;
            } else if (player.discard.length > 1) {
              const discardCards = player.discard.map((c, i) => ({ card: c, originalDeckIndex: i }));
              setDeckSearchModal({
                isOpen: true,
                title: lang === 'tr' ? 'Recycle: TURA! Destenizin Üstüne Koyulacak Kartı Seçin' : 'Recycle: HEADS! Choose Card for Top of Deck',
                description: lang === 'tr' ? 'Mezarlığınızdan destenizin en üstüne koymak istediğiniz kartı seçin:' : 'Select a card from your discard pile to put on top of your deck:',
                card,
                handIndex,
                cards: discardCards,
                onSelect: (chosenDiscardIndex) => {
                  setDeckSearchModal(null);
                  executeTrainerPlay(card, handIndex, undefined, undefined, results, { targetDiscardIndex: chosenDiscardIndex });
                }
              });
              return;
            }
          } else if (card.name === 'Digger' && flip && cpu.bench.length > 1) {
            chooseCardFromList(
              card,
              handIndex,
              lang === 'tr' ? 'Kazıcı: TURA! Eline Alınacak Rakip Pokémon' : 'Digger: HEADS! Choose the Opponent Pokémon',
              lang === 'tr'
                ? 'Eline geri alınacak rakip yedek Pokémonu seçin:'
                : "Choose which of your opponent's Benched Pokémon returns to their hand:",
              cpu.bench.map((b, i) => ({ card: b.card, originalDeckIndex: i })),
              (bIdx) => executeTrainerPlay(card, handIndex, undefined, undefined, results, { chosenOppBenchIndex: bIdx })
            );
            return;
          }
          executeTrainerPlay(card, handIndex, targetBenchIdx, targetPokemon, results);
        }
      });
      return;
    }

    // Default immediate play
    executeTrainerPlay(card, handIndex, targetBenchIdx, targetPokemon);
  };

  const handlePlaySelectedTrainer = () => { if (selectedHandIndex !== null) triggerTrainerCardPlay(player.hand[selectedHandIndex], selectedHandIndex); };

  const executeDeckSearchTrainerPlay = (card: Card, handIdx: number, chosenDeckIndex: number) => {
    sounds.playCardDraw();
    showFloatingTrainer(card, false);

    const next = GameEngine.playDeckSearchTrainer(state, 'player', handIdx, chosenDeckIndex, card);
    setState(next);

    if (isMultiplayer) {
      net.sendAction({
        type: 'PLAY_TRAINER',
        card: card,
        trainerParams: { chosenDeckIndex }
      });
    }

    setSelectedHandIndex(null);
  };

  const isPassivePower = (powerName: string): boolean => {
    const norm = powerName.toLowerCase().trim();
    const passives = [
      'invisible wall',
      'thick skinned',
      'retreat aid',
      'sinkhole',
      'hay fever',
      'sticky goo',
      'frenzy',
      'toxic gas',
      'prehistoric power',
      'kabuto armor',
      'final beam',
      'summon minions',
      'reel in',
      'sneak attack',
      'healing wind'
    ];
    return passives.includes(norm);
  };

  const handleDiscardFossil = (instanceId: string) => {
    if (!isPlayerTurn || isTurnLocked) return;
    sounds.playCardDraw();
    const next = GameEngine.discardFossilFromPlay(state, 'player', instanceId);
    setState(next);
    setActionBanner({ text: lang === 'tr' ? 'Kart oyundan çıkarıldı ve mezarlığa gönderildi.' : 'Card discarded from play.', type: 'info' });
    setTimeout(() => setActionBanner(null), 2000);
  };

  const handleActivatePokemonPower = (inPlay: InPlayCard, power: { name: string; text: string }) => {
    if (!isPlayerTurn || isTurnLocked || inPlay.powerUsedThisTurn) return;
    // Stare's shutdown lasts through the opponent's next turn, so this can be true on a turn the
    // player is otherwise allowed to use the power.
    if (GameEngine.isPowerDisabled(inPlay, state.turn)) return;

    const normPower = power.name.toLowerCase().trim();

    // 1. Matter Exchange
    if (normPower === 'matter exchange') {
      if (player.hand.length === 0) {
        setActionBanner({ text: lang === 'tr' ? 'Elinizde feda edilecek kart yok!' : 'No cards in hand to discard!', type: 'info' });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }
      if (player.hand.length === 1) {
        executePowerActivation(inPlay.instanceId, power.name, { discardHandIndex: 0 });
        return;
      }
      setPowerDiscardModal({
        isOpen: true,
        inPlay,
        powerName: power.name
      });
      return;
    }

    // 2. Evolutionary Light (Dark Dragonair)
    if (normPower === 'evolutionary light') {
      const evoCards = player.deck
        .map((c, i) => ({ card: c, originalDeckIndex: i }))
        .filter(x => x.card.supertype === 'Pokemon' && (x.card.subtype === 'Stage 1' || x.card.subtype === 'Stage 2'));

      if (evoCards.length === 0) {
        setActionBanner({ text: lang === 'tr' ? 'Destede hiç Evrim kartı yok!' : 'No Evolution cards found in deck!', type: 'info' });
        setTimeout(() => setActionBanner(null), 2500);
        return;
      }

      setDeckSearchModal({
        isOpen: true,
        title: lang === 'tr' ? 'Evolutionary Light: Evrim Kartı Seçin' : 'Evolutionary Light: Choose Evolution Card',
        description: lang === 'tr' ? 'Destenizden elinize eklemek istediğiniz Evrim kartını seçin:' : 'Select an Evolution card from your deck to put into your hand:',
        card: inPlay.card,
        handIndex: -1,
        cards: evoCards,
        onSelect: (chosenDeckIndex) => {
          setDeckSearchModal(null);
          executePowerActivation(inPlay.instanceId, power.name, { chosenDeckIndex });
        }
      });
      return;
    }

    // 3. Pollen Stench / Long-Distance Hypnosis
    if (normPower === 'pollen stench' || normPower === 'long-distance hypnosis') {
      setCoinFlipData({
        isOpen: true,
        reason: lang === 'tr' ? `${power.name} için Yazı-Tura` : `Coin Toss for ${power.name}`,
        count: 1,
        onComplete: (results) => {
          setCoinFlipData(prev => ({ ...prev, isOpen: false }));
          executePowerActivation(inPlay.instanceId, power.name, { coinResults: results });
        }
      });
      return;
    }

    // Direct powers
    executePowerActivation(inPlay.instanceId, power.name);
  };

  const executePowerActivation = (
    instanceId: string,
    powerName: string,
    params?: {
      discardHandIndex?: number;
      chosenDeckIndex?: number;
      targetInstanceId?: string;
      coinResults?: boolean[];
    }
  ) => {
    sounds.playCardDraw();
    const next = GameEngine.executePokemonPower(state, 'player', instanceId, powerName, params);
    setState(next);
    setPowerDiscardModal(null);
  };

  const handleExecuteEnergyRetrieval = (
    retrievalHandIndex: number,
    discardHandIndex: number,
    chosenDiscardEnergyIndices: number[]
  ) => {
    sounds.playCardDraw();
    const next = GameEngine.playEnergyRetrieval(
      state,
      'player',
      retrievalHandIndex,
      discardHandIndex,
      chosenDiscardEnergyIndices
    );
    setState(next);
    setSelectedHandIndex(null);
    setEnergyRetrievalModal(null);

    if (isMultiplayer) {
      net.sendAction({
        type: 'PLAY_TRAINER',
        card: player.hand[retrievalHandIndex],
        trainerParams: { discardHandIndex, chosenDiscardEnergyIndices }
      });
    }
  };

  const handleExecuteMaintenance = (
    maintenanceHandIndex: number,
    chosenHandIndices: number[]
  ) => {
    sounds.playCardDraw();
    const next = GameEngine.playMaintenance(
      state,
      'player',
      maintenanceHandIndex,
      chosenHandIndices
    );
    setState(next);
    setSelectedHandIndex(null);
    setMaintenanceModal(null);

    if (isMultiplayer) {
      net.sendAction({
        type: 'PLAY_TRAINER',
        card: player.hand[maintenanceHandIndex],
        trainerParams: { chosenHandIndices }
      });
    }
  };

  const handleExecuteItemFinder = (
    itemFinderHandIndex: number,
    discardIndices: number[],
    chosenDiscardTrainerIndex: number
  ) => {
    sounds.playCardDraw();
    const next = GameEngine.playItemFinder(
      state,
      'player',
      itemFinderHandIndex,
      discardIndices,
      chosenDiscardTrainerIndex
    );
    setState(next);
    setSelectedHandIndex(null);
    setItemFinderModal(null);
  };

  const handleExecuteComputerSearch = (
    searchHandIndex: number,
    discardIndices: number[],
    chosenDeckIndex: number
  ) => {
    sounds.playCardDraw();
    const next = GameEngine.playComputerSearch(
      state,
      'player',
      searchHandIndex,
      discardIndices,
      chosenDeckIndex
    );
    setState(next);
    setSelectedHandIndex(null);
    setComputerSearchModal(null);
  };

  const handleExecuteBreederEvolution = (
    breederHandIndex: number,
    stage2HandIndex: number,
    targetInstanceId: string
  ) => {
    sounds.playEvolution();
    const next = GameEngine.playPokemonBreeder(
      state,
      'player',
      breederHandIndex,
      stage2HandIndex,
      targetInstanceId
    );
    setState(next);
    setSelectedHandIndex(null);
    setBreederModal(null);
  };

    const executeTrainerPlay = (
      card: Card,
      handIdx: number,
      targetBenchIndex?: number,
      targetPokemon?: InPlayCard,
      coinResults?: boolean[],
      extraParams?: {
        targetDiscardIndex?: number;
        /** Index into the target Pokémon's attachedEnergy, chosen by the player. */
        chosenEnergyIndex?: number;
        /** Indices into the opponent target's attachedEnergy (Super Energy Removal strips up to 2). */
        chosenOppEnergyIndices?: number[];
        /** Which of the opponent's Pokémon the energy is removed from. */
        oppTargetPokemon?: InPlayCard;
        /** Revive: which Basic Pokémon in your own discard pile comes back. */
        chosenDiscardIndex?: number;
        /** Digger: which of the opponent's Benched Pokémon goes back to their hand. */
        chosenOppBenchIndex?: number;
        /** Pokémon Flute: which Basic Pokémon in the opponent's discard pile they revive. */
        chosenOppDiscardIndex?: number;
        /** Pokémon Trader: the hand / deck Pokémon taking part in the trade. */
        chosenTraderHandIndex?: number;
        chosenTraderDeckIndex?: number;
      }
    ) => {
    sounds.playCardDraw();
    showFloatingTrainer(card, false);

    if (card.name === 'Gust of Wind') triggerFX('gust', 'cpu');
    else if (card.name.includes('Energy Removal')) {
      const oppTarget = extraParams?.oppTargetPokemon;
      const erBenchIdx = oppTarget ? cpu.bench.findIndex(b => b.instanceId === oppTarget.instanceId) : -1;
      if (erBenchIdx !== -1) {
        triggerFX('energy_removal', 'cpu', undefined, undefined, undefined, undefined, undefined, undefined, 'bench', erBenchIdx);
      } else {
        triggerFX('energy_removal', 'cpu');
      }
    }
    else if (card.name === 'Super Potion') {
      const spBenchIdx = targetPokemon ? player.bench.findIndex(b => b.instanceId === targetPokemon.instanceId) : (targetBenchIndex !== undefined ? targetBenchIndex : -1);
      if (spBenchIdx !== -1) {
        triggerFX('super_potion', 'player', undefined, undefined, undefined, undefined, undefined, undefined, 'bench', spBenchIdx);
      } else {
        triggerFX('super_potion', 'player');
      }
    }
    else if (card.name.includes('Potion') || card.name === 'Full Heal') {
      const pBenchIdx = targetPokemon ? player.bench.findIndex(b => b.instanceId === targetPokemon.instanceId) : (targetBenchIndex !== undefined ? targetBenchIndex : -1);
      if (pBenchIdx !== -1) {
        triggerFX('potion', 'player', undefined, undefined, undefined, undefined, undefined, undefined, 'bench', pBenchIdx);
      } else {
        triggerFX('potion', 'player');
      }
    }
    else if (card.name === 'PlusPower') triggerFX('pluspower', 'player');
    else if (card.name === 'Defender') triggerFX('defender', 'player');

    const trainerParams = {
      targetBenchIndex,
      targetPokemon,
      coinResults,
      targetDiscardIndex: extraParams?.targetDiscardIndex,
      chosenEnergyIndex: extraParams?.chosenEnergyIndex,
      chosenOppEnergyIndices: extraParams?.chosenOppEnergyIndices,
      oppTargetPokemon: extraParams?.oppTargetPokemon,
      chosenDiscardIndex: extraParams?.chosenDiscardIndex,
      chosenOppBenchIndex: extraParams?.chosenOppBenchIndex,
      chosenOppDiscardIndex: extraParams?.chosenOppDiscardIndex,
      chosenTraderHandIndex: extraParams?.chosenTraderHandIndex,
      chosenTraderDeckIndex: extraParams?.chosenTraderDeckIndex,
    };

    const next = GameEngine.playTrainer(state, 'player', handIdx, trainerParams);
    setState(next);

    if (isMultiplayer) {
      net.sendAction({
        type: 'PLAY_TRAINER',
        card: card,
        trainerParams
      });
    }

    setSelectedHandIndex(null);
    setTrainerSwitchModal(null);
  };

    const handleAttack = (atkIndex: number) => {
    if (!isPlayerTurn || !player.active || player.active.currentHp <= 0 || isPlayerParalyzed || isPlayerAsleep || isTurnLocked) return;
    const attack = player.active.card.attacks?.[atkIndex];
    if (!attack) return;

    // Tail Wag / Leer / Amnesia: never spend the turn on a coin flip for a move that is switched
    // off. The button is already disabled; this also covers the multiplayer and keyboard paths.
    const attackBlockReason = GameEngine.getAttackBlockReason(player.active, attack, state.turn);
    if (attackBlockReason) {
      const blockerName = player.active.attackBlockMoveName || (attackBlockReason === 'amnesia' ? 'Amnesia' : 'Tail Wag');
      setActionBanner({
        text: lang === 'tr'
          ? `🚫 ${attack.name} kullanılamıyor — ${blockerName} tarafından engellendi!`
          : `🚫 ${attack.name} is unavailable — blocked by ${blockerName}!`,
        type: 'info'
      });
      setTimeout(() => setActionBanner(null), 2200);
      return;
    }

    setIsTurnLocked(true);

    const atkNameLower = attack.name.toLowerCase();

    // Check if this attack requires a player choice before execution
    const needsAmnesiaChoice = atkNameLower === 'amnesia' && cpu.active && (cpu.active.card.attacks?.length || 0) > 1;
    const needsConversionChoice = atkNameLower === 'conversion 1' || atkNameLower === 'conversion 2';
    const needsMetronomeChoice = atkNameLower === 'metronome' && cpu.active && (cpu.active.card.attacks?.length || 0) > 0;

    if (needsAmnesiaChoice || needsConversionChoice || needsMetronomeChoice) {
      const { count: coinCount, description, mode } = getFullAttackCoinFlips(player.active, attack, cpu.active);

      const proceedWithChoice = (coinResults?: boolean[]) => {
        if (needsAmnesiaChoice) {
          setEffectChoiceModal({
            isOpen: true,
            mode: 'amnesia',
            attackIndex: atkIndex,
            coinResults,
            options: cpu.active!.card.attacks!.map((a, i) => ({ label: a.name, value: a.name }))
          });
        } else if (needsConversionChoice) {
          const typeOptions = ['Grass', 'Fire', 'Water', 'Lightning', 'Psychic', 'Fighting'];
          setEffectChoiceModal({
            isOpen: true,
            mode: 'conversion',
            attackIndex: atkIndex,
            coinResults,
            options: typeOptions.map(t => ({ label: t, value: t }))
          });
        } else if (needsMetronomeChoice) {
          setEffectChoiceModal({
            isOpen: true,
            mode: 'metronome',
            attackIndex: atkIndex,
            coinResults,
            options: cpu.active!.card.attacks!.map((a, i) => ({ label: a.name, value: i }))
          });
        }
      };

      if (coinCount > 0 || mode === 'until_tails') {
        setCoinFlipData({
          isOpen: true,
          reason: mode === 'until_tails'
            ? (lang === 'tr' ? `Yazı Gelene Kadar Atış (${description})` : `Flip Until Tails (${description})`)
            : (lang === 'tr' ? `Yazı-Tura (${description})` : `Flipping ${coinCount} coin${coinCount > 1 ? 's' : ''} for ${description}`),
          count: coinCount,
          mode: mode || 'fixed',
          onComplete: (results) => {
            setCoinFlipData(prev => ({ ...prev, isOpen: false }));
            proceedWithChoice(results);
          }
        });
      } else {
        proceedWithChoice();
      }
      return;
    }

    const { count: coinCount, description, mode } = getFullAttackCoinFlips(player.active, attack, cpu.active);

    let hasExecutedPlayerAttack = false;
    const performAttack = (coinResults?: boolean[]) => {
      if (hasExecutedPlayerAttack) return;

      // Stare names its own victim: "Choose 1 of your opponent's Pokémon." Only interrupt when
      // the opponent actually has a choice to make - with a lone Active Pokémon there is nothing
      // to pick, and a modal there would just be friction.
      if (atkNameLower === 'stare' && cpu.bench.length > 0) {
        hasExecutedPlayerAttack = true;
        setStareTargetModal({ isOpen: true, attackIndex: atkIndex, coinResults });
        return;
      }

      // The coins are already flipped by now; if the attack text says "choose ...", collect
      // the player's answer first and only then resolve the attack.
      const pendingSteps = buildAttackChoiceSteps(attack, coinResults);
      if (pendingSteps.length > 0) {
        hasExecutedPlayerAttack = true;
        runAttackChoiceQueue(atkIndex, coinResults, pendingSteps);
        return;
      }

      hasExecutedPlayerAttack = true;
      setIsTurnLocked(true);
      sounds.playAttackHit();

      const fxType = getSpecificAttackFX(attack, player.active!.card);
      const next = GameEngine.executeAttack(state, atkIndex, coinResults);
      setState(next);
      // Hold any between-turns poison damage back on the HP bar; it is released together
      // with its own FX once the attack animation has finished.
      const playerTicks = statusTicksToShow(next);
      if (playerTicks.length > 0) {
        setWithheldTicks(playerTicks);
        setIsPoisonSequenceActive(true);
      }

      const atkRes = next.lastAttackResult;
      const attackerType = player.active!.card.types?.[0];
      const isWeak = atkRes ? atkRes.isWeakness : (cpu.active?.card.weakness?.type === attackerType);
      const isResist = atkRes ? atkRes.isResistance : (cpu.active?.card.resistance?.type === attackerType);
      const calculatedDmg = atkRes ? atkRes.damage : (attack.damage || 0);
      // The card that was actually struck - Stare can pick a Benched one, and a shield on the
      // Active Pokémon has no business turning that hit into a "BLOCKED" beat.
      const struck = atkRes?.damageTarget === 'bench' ? cpu.bench[atkRes.damageTargetBenchIndex ?? -1] : cpu.active;
      const isBlocked = calculatedDmg === 0 && Boolean(struck?.preventDamageNextTurn || struck?.preventAllEffectsNextTurn || struck?.hardenActiveNextTurn);

      setActionBanner({ text: `⚔️ Your ${player.active!.card.name} used ${attack.name}!`, type: 'attack' });
      const selfTarget = isSelfTargetingMove(attack.name);
      // A confused attacker that rolled TAILS hit itself, so the impact belongs on its own card.
      if (atkRes?.confusionSelfHit) {
        const confusionIntensity = (player.active!.card.name.includes('Onix') && fxType === 'big_boulder') ? 0.4 : undefined;
        triggerConfusionSelfHit(fxType, atkRes.confusionSelfHit, player.active!.card.name, confusionIntensity);
      } else {
        playAttackFX({
          fxType: isBlocked ? 'barrier' : fxType,
          target: selfTarget ? 'player' : 'cpu',
          damageText: isBlocked
            ? (lang === 'tr' ? 'ENGELLENDİ' : 'BLOCKED')
            : selfTarget ? attack.name : (calculatedDmg > 0 ? `-${calculatedDmg} ${t.dmgText}` : t.effectText),
          isWeakness: isWeak,
          isResistance: isResist,
          isBlocked,
          attackerName: player.active!.card.name,
          selfTarget,
          result: atkRes
        });
      }

      if (isMultiplayer) {
        net.sendAction({
          type: 'ATTACK',
          attackIndex: atkIndex,
          coinResults
        });
      }

      setSelectedHandIndex(null);
      setIsRetreatMode(false);

      if (next.player.active && next.player.active.currentHp <= 0) {
        setActionBanner({ text: `💀 ${next.player.active.card.name} was Knocked Out!`, type: 'knockout' });
        setTimeout(() => {
          setActiveFXList([]);
          setWithheldTicks([]);
          setIsPoisonSequenceActive(false);
          setState(postKnockout => GameEngine.resolveKnockout(postKnockout));
          setActionBanner(null);
          setIsTurnLocked(false);
        }, 1800);
      } else if (next.cpu.active && next.cpu.active.currentHp <= 0) {
        setActionBanner({ text: `💀 Opponent's ${next.cpu.active.card.name} was Knocked Out!`, type: 'knockout' });
        setTimeout(() => {
          setActiveFXList([]);
          setWithheldTicks([]);
          setIsPoisonSequenceActive(false);
          if (next.cpu.bench.length > 0) {
            setAscendingCpuBenchIdx(0);
            setTimeout(() => {
              setActiveFXList([]);
              setState(postKnockout => GameEngine.resolveKnockout(postKnockout));
              setAscendingCpuBenchIdx(null);
              setActionBanner(null);
              setIsTurnLocked(false);
            }, 650);
          } else {
            setState(postKnockout => GameEngine.resolveKnockout(postKnockout));
            setActionBanner(null);
            setIsTurnLocked(false);
          }
        }, 1800);
      } else {
        // Dynamic timeout: multi-hit moves (Stone Barrage with many heads) stagger beats at
        // 380ms intervals. The unlock must wait for the LAST beat to finish its animation
        // (850ms for rocks) plus a small buffer, otherwise the opponent's turn starts while
        // rocks are still flying.
        const beatCount = atkRes?.multiHitCount ?? 1;
        const isStoneBarrageFx = fxType === 'stone_barrage_single';
        const staggerMs = 380;
        const lastBeatStart = isStoneBarrageFx
          ? Math.max(0, beatCount - 1) * staggerMs
          : 0;
        const animDuration = isStoneBarrageFx ? 900 : 1300;
        const unlockDelay = Math.max(1800, lastBeatStart + animDuration + 300);
        setTimeout(() => {
          setActionBanner(null);
          // Commit the held-back poison damage in the same frame its FX starts, then let the
          // opponent's turn begin. The tick is read from lastStatusTicks, never re-guessed
          // from the current status (which would double-tick or hit the wrong Pokémon).
          setWithheldTicks([]);
          if (playerTicks.length > 0) {
            setActiveFXList(poisonFXFromTicks(playerTicks));
            setTimeout(() => {
              setActiveFXList([]);
              setIsPoisonSequenceActive(false);

              // Check if the poison/toxic tick was lethal
              const playerFainted = next.player.active && next.player.active.currentHp <= 0;
              const cpuFainted = next.cpu.active && next.cpu.active.currentHp <= 0;

              if (playerFainted || cpuFainted) {
                const faintedName = playerFainted
                  ? next.player.active!.card.name
                  : next.cpu.active!.card.name;
                const bannerText = playerFainted
                  ? `💀 Your ${faintedName} succumbed to Poison and was Knocked Out!`
                  : `💀 Opponent's ${faintedName} succumbed to Poison and was Knocked Out!`;
                setActionBanner({ text: bannerText, type: 'knockout' });
                setTimeout(() => {
                  setState(post => GameEngine.resolveKnockout(post));
                  setActionBanner(null);
                  setIsTurnLocked(false);
                }, 1800);
              } else {
                setIsTurnLocked(false);
              }
            }, 1600);
          } else {
            setIsPoisonSequenceActive(false);
            setIsTurnLocked(false);
          }
        }, unlockDelay);
      }
    };

    if (coinCount > 0 || mode === 'until_tails') {
      setCoinFlipData({
        isOpen: true,
        reason: mode === 'until_tails'
          ? (lang === 'tr' ? `Yazı Gelene Kadar Atış (${description})` : `Flip Until Tails (${description})`)
          : (lang === 'tr' ? `Yazı-Tura (${description})` : `Flipping ${coinCount} coin${coinCount > 1 ? 's' : ''} for ${description}`),
        count: coinCount,
        mode: mode || 'fixed',
        onComplete: (results) => {
          setCoinFlipData(prev => ({ ...prev, isOpen: false }));
          performAttack(results);
        }
      });
    } else {
      performAttack();
    }
  };

  /**
   * Runs the player's attack once every choice the card demands has been collected
   * (which Energy to discard, which Benched Pokémon to hit, Amnesia target, ...).
   */
  const executeAttackWithChoices = (
    attackIndex: number,
    coinResults: boolean[] | undefined,
    effectChoices: AttackEffectChoices
  ) => {
    if (!player.active || !cpu.active) { setIsTurnLocked(false); return; }

    sounds.playAttackHit();
    const attack = player.active.card.attacks?.[attackIndex];
    const fxType = attack ? getSpecificAttackFX(attack, player.active.card) : 'psychic_distortion';
    const next = GameEngine.executeAttack(state, attackIndex, coinResults, effectChoices);
    setState(next);
    const choiceTicks = statusTicksToShow(next);
    if (choiceTicks.length > 0) {
      setWithheldTicks(choiceTicks);
      setIsPoisonSequenceActive(true);
    }

    const atkRes = next.lastAttackResult;
    const attackerType = player.active.card.types?.[0];
    const isWeak = atkRes ? atkRes.isWeakness : (cpu.active?.card.weakness?.type === attackerType);
    const isResist = atkRes ? atkRes.isResistance : (cpu.active?.card.resistance?.type === attackerType);
    const calculatedDmg = atkRes ? atkRes.damage : (attack?.damage || 0);
    const struck = atkRes?.damageTarget === 'bench' ? cpu.bench[atkRes.damageTargetBenchIndex ?? -1] : cpu.active;
    const isBlocked = calculatedDmg === 0 && Boolean(struck?.preventDamageNextTurn || struck?.preventAllEffectsNextTurn || struck?.hardenActiveNextTurn);

    setActionBanner({ text: `⚔️ Your ${player.active.card.name} used ${attack?.name}!`, type: 'attack' });
    const selfTarget = attack ? isSelfTargetingMove(attack.name) : false;
    // A confused attacker that rolled TAILS hit itself, so the impact belongs on its own card.
    if (atkRes?.confusionSelfHit) {
      const confusionIntensity = (player.active.card.name.includes('Onix') && fxType === 'big_boulder') ? 0.4 : undefined;
      triggerConfusionSelfHit(fxType, atkRes.confusionSelfHit, player.active.card.name, confusionIntensity);
    } else {
      playAttackFX({
        fxType: isBlocked ? 'barrier' : fxType,
        target: selfTarget ? 'player' : 'cpu',
        damageText: isBlocked
          ? (lang === 'tr' ? 'ENGELLENDİ' : 'BLOCKED')
          : selfTarget ? (attack?.name || '') : (calculatedDmg > 0 ? `-${calculatedDmg} ${t.dmgText}` : t.effectText),
        isWeakness: isWeak,
        isResistance: isResist,
        isBlocked,
        attackerName: player.active.card.name,
        selfTarget,
        result: atkRes
      });
    }

    if (isMultiplayer) {
      net.sendAction({
        type: 'ATTACK',
        attackIndex,
        coinResults,
        effectChoices
      });
    }

    setSelectedHandIndex(null);
    setIsRetreatMode(false);

    if (next.player.active && next.player.active.currentHp <= 0) {
      setActionBanner({ text: `💀 ${next.player.active.card.name} was Knocked Out!`, type: 'knockout' });
      setTimeout(() => {
        setActiveFXList([]);
        setWithheldTicks([]);
        setIsPoisonSequenceActive(false);
        setState(postKnockout => GameEngine.resolveKnockout(postKnockout));
        setActionBanner(null);
        setIsTurnLocked(false);
      }, 1800);
    } else if (next.cpu.active && next.cpu.active.currentHp <= 0) {
      setActionBanner({ text: `💀 Opponent's ${next.cpu.active.card.name} was Knocked Out!`, type: 'knockout' });
      setTimeout(() => {
        setActiveFXList([]);
        setWithheldTicks([]);
        setIsPoisonSequenceActive(false);
        if (next.cpu.bench.length > 0) {
          setAscendingCpuBenchIdx(0);
          setTimeout(() => {
            setActiveFXList([]);
            setState(postKnockout => GameEngine.resolveKnockout(postKnockout));
            setAscendingCpuBenchIdx(null);
            setActionBanner(null);
            setIsTurnLocked(false);
          }, 650);
        } else {
          setState(postKnockout => GameEngine.resolveKnockout(postKnockout));
          setActionBanner(null);
          setIsTurnLocked(false);
        }
      }, 1800);
    } else {
      setTimeout(() => {
        setActionBanner(null);
        setWithheldTicks([]);
        if (choiceTicks.length > 0) {
          setActiveFXList(poisonFXFromTicks(choiceTicks));
          setTimeout(() => {
            setActiveFXList([]);
            setIsPoisonSequenceActive(false);

            // Check if the poison/toxic tick was lethal
            const playerFainted = next.player.active && next.player.active.currentHp <= 0;
            const cpuFainted = next.cpu.active && next.cpu.active.currentHp <= 0;

            if (playerFainted || cpuFainted) {
              const faintedName = playerFainted
                ? next.player.active!.card.name
                : next.cpu.active!.card.name;
              const bannerText = playerFainted
                ? `💀 Your ${faintedName} succumbed to Poison and was Knocked Out!`
                : `💀 Opponent's ${faintedName} succumbed to Poison and was Knocked Out!`;
              setActionBanner({ text: bannerText, type: 'knockout' });
              setTimeout(() => {
                setState(post => GameEngine.resolveKnockout(post));
                setActionBanner(null);
                setIsTurnLocked(false);
              }, 1800);
            } else {
              setIsTurnLocked(false);
            }
          }, 1600);
        } else {
          setIsPoisonSequenceActive(false);
          setIsTurnLocked(false);
        }
      }, 1800);
    }
  };
  /**
   * Stare: the player has named the victim, so resolve the attack against that Pokémon.
   * targetIndex follows the engine's convention - 0 is the Defending Pokémon, n > 0 is
   * cpu.bench[n - 1].
   */
  const commitStareTarget = (targetIndex: number) => {
    const modal = stareTargetModal;
    setStareTargetModal(null);
    if (!modal) return;
    executeAttackWithChoices(modal.attackIndex, modal.coinResults, { stareTargetIndex: targetIndex });
  };

  /** Backing out still resolves the move: it was declared, so the turn has to be spent. */
  const abandonStareTarget = () => {
    const modal = stareTargetModal;
    setStareTargetModal(null);
    if (!modal) return;
    // No pick made means the default target, which is the Defending Pokémon.
    executeAttackWithChoices(modal.attackIndex, modal.coinResults, { stareTargetIndex: 0 });
  };

  /**
   * One pickable opponent Pokémon in the Stare modal. The Pokémon Power is printed on the card
   * because shutting it down is half of why the move gets used - a player who cannot see which
   * body has a power cannot make that decision.
   */
  const renderStareOption = (p: InPlayCard, targetIndex: number, isBench: boolean) => {
    const power = GameEngine.powerOf(p);
    return (
      <button
        key={p.instanceId}
        onClick={() => commitStareTarget(targetIndex)}
        className={`bg-slate-800 hover:bg-slate-700 p-2 sm:p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1 transition active:scale-95 text-center group ${
          isBench ? 'border-fuchsia-500/30 hover:border-fuchsia-300' : 'border-rose-500/50 hover:border-rose-300'
        }`}
      >
        <div className="w-14 sm:w-[74px] aspect-[600/825] rounded-lg overflow-hidden shadow-lg">
          <img
            src={p.card.originalImageUrl || p.card.image || `/cards/${p.card.number}.jpg`}
            alt={p.card.name}
            className="w-full h-full object-fill"
          />
        </div>
        <span className="text-[11px] font-bold text-fuchsia-100 truncate w-full group-hover:text-white">{p.card.name}</span>
        <span className="text-[10px] font-mono text-emerald-400">{p.currentHp}/{p.card.hp} HP</span>
        {power ? (
          <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-purple-500/25 text-purple-200 border border-purple-400/50 truncate max-w-full">
            ⚡ {power.name}
          </span>
        ) : (
          <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-slate-900/70 text-gray-500 border border-slate-700">
            {lang === 'tr' ? 'Yetenek yok' : 'No power'}
          </span>
        )}
      </button>
    );
  };



  /** One card-driven decision the player must answer before an attack can resolve. */
  interface AttackChoiceStep {
    title: string;
    description: string;
    options: { card: Card; originalDeckIndex: number }[];
    apply: (index: number, acc: AttackEffectChoices) => void;
  }

  /**
   * Attacks whose text says "choose ..." must not pick for the player. Anything with a single
   * candidate is skipped - there is no decision to make - so the picker only interrupts when
   * the choice is real.
   */
  const buildAttackChoiceSteps = (attack: Attack, coinResults?: boolean[]): AttackChoiceStep[] => {
    const steps: AttackChoiceStep[] = [];
    const name = attack.name.toLowerCase();
    const heads = coinResults && coinResults.length > 0 ? coinResults[0] : true;
    const pA = player.active;
    const cA = cpu.active;
    if (!pA) return steps;

    const energiesOf = (p: InPlayCard) => p.attachedEnergy.map((e, i) => ({ card: e, originalDeckIndex: i }));
    const benchOf = (side: 'player' | 'cpu') =>
      (side === 'player' ? player.bench : cpu.bench).map((b, i) => ({ card: b.card, originalDeckIndex: i }));

    // "Discard 1 Energy card attached to <attacker> in order to use this attack."
    if (name === 'third eye' && pA.attachedEnergy.length > 1) {
      steps.push({
        title: lang === 'tr' ? 'Üçüncü Göz: Atılacak Enerjiyi Seçin' : 'Third Eye: Choose the Energy to Discard',
        description: lang === 'tr'
          ? `${pA.card.name} üzerindeki, kart çekmek için atacağınız enerji:`
          : `Choose the Energy attached to ${pA.card.name} to discard:`,
        options: energiesOf(pA),
        apply: (i, acc) => { acc.ownEnergyIndex = i; }
      });
    }

    // "If the Defending Pokémon has any Energy cards attached to it, choose 1 of them and discard it."
    if ((name === 'hyper beam' || (name === 'whirlpool' && heads)) && cA && cA.attachedEnergy.length > 1) {
      steps.push({
        title: lang === 'tr' ? `${attack.name}: Rakipten Atılacak Enerjiyi Seçin` : `${attack.name}: Choose the Opponent Energy to Discard`,
        description: lang === 'tr'
          ? `${cA.card.name} üzerindeki atılacak enerji kartını seçin:`
          : `Choose an Energy attached to ${cA.card.name} to discard:`,
        options: energiesOf(cA),
        apply: (i, acc) => { acc.defenderEnergyIndex = i; }
      });
    }

    // "choose 1 of your opponent's Benched Pokémon"
    const wantsOppBench =
      (name === 'dark mind' || name === 'spark' || name === 'stretch kick' || name === 'flame pillar'
        || name === 'lure' || name === 'drag off' || name === 'knock back' || name === 'whirlwind')
      || ((name === 'fascinate') && heads);
    if (wantsOppBench && cpu.bench.length > 1) {
      steps.push({
        title: lang === 'tr' ? `${attack.name}: Rakip Yedek Pokémon Seçin` : `${attack.name}: Choose a Benched Opponent Pokémon`,
        description: lang === 'tr'
          ? 'Etkinin hedefleyeceği rakip yedek Pokémonu seçin:'
          : 'Choose which benched opponent Pokémon the effect targets:',
        options: benchOf('cpu'),
        apply: (i, acc) => { acc.benchTargetIndex = i; }
      });
    }

    // Energy Bomb: "attach them to your Benched Pokémon (in any way you choose)"
    if (name === 'energy bomb' && player.bench.length > 1 && pA.attachedEnergy.length > 0) {
      steps.push({
        title: lang === 'tr' ? 'Enerji Bombası: Enerjileri Taşıyacağınız Pokémon' : 'Energy Bomb: Choose the Receiving Pokémon',
        description: lang === 'tr'
          ? 'Tüm enerjilerin taşınacağı yedek Pokémonu seçin:'
          : 'Choose which Benched Pokémon receives all the Energy cards:',
        options: benchOf('player'),
        apply: (i, acc) => { acc.ownBenchTargetIndex = i; }
      });
    }

    return steps;
  };

  /** Asks the player each pending question in turn, then runs the attack with the answers. */
  const runAttackChoiceQueue = (
    attackIndex: number,
    coinResults: boolean[] | undefined,
    steps: AttackChoiceStep[]
  ) => {
    const acc: AttackEffectChoices = {};
    const takeNext = (remaining: AttackChoiceStep[]) => {
      if (remaining.length === 0) {
        executeAttackWithChoices(attackIndex, coinResults, acc);
        return;
      }
      const [step, ...rest] = remaining;
      chooseCardFromList(
        player.active!.card,
        -1,
        step.title,
        step.description,
        step.options,
        (i) => { step.apply(i, acc); takeNext(rest); },
        // The attack was already declared and its coins flipped, so backing out resolves it
        // with the engine default rather than leaving the turn locked forever.
        () => executeAttackWithChoices(attackIndex, coinResults, acc)
      );
    };
    takeNext(steps);
  };

  // Handler for the text-option effect modal (Amnesia / Conversion / Metronome)
  const handleEffectChoiceSelect = (chosenValue: string | number) => {
    const modal = effectChoiceModal;
    setEffectChoiceModal(prev => ({ ...prev, isOpen: false }));
    if (!player.active || !cpu.active) { setIsTurnLocked(false); return; }

    const effectChoices: AttackEffectChoices = {};
    if (modal.mode === 'amnesia') {
      effectChoices.amnesiaTarget = chosenValue as string;
    } else if (modal.mode === 'conversion') {
      effectChoices.conversionType = chosenValue as string;
    } else if (modal.mode === 'metronome') {
      // The picker now passes the attack name; resolve it to an index for the engine.
      if (typeof chosenValue === 'string') {
        const idx = cpu.active!.card.attacks?.findIndex(a => a.name === chosenValue) ?? 0;
        effectChoices.metronomeTarget = idx >= 0 ? idx : 0;
      } else {
        effectChoices.metronomeTarget = chosenValue as number;
      }
    }

    executeAttackWithChoices(modal.attackIndex, modal.coinResults, effectChoices);
  };

  /**
   * Fallback resolver for an effect-choice picker. The move was already declared (energy paid),
   * so it must resolve — with no pick supplied the engine applies its default fallback
   * (Amnesia: block first attack; Metronome: copy first attack; Conversion: random type).
   *
   * NOTE: all three pickers now render with `forceSelection`, so the X button and backdrop-click
   * are disabled and this handler is effectively unreachable through the UI. It is kept as a safety
   * net so the turn never deadlocks if `onClose` were ever fired programmatically.
   */
  const handleEffectChoiceCancel = () => {
    const modal = effectChoiceModal;
    setEffectChoiceModal(prev => ({ ...prev, isOpen: false }));
    if (!player.active || !cpu.active) { setIsTurnLocked(false); return; }
    // All three modes resolve with engine defaults when no choice is supplied.
    executeAttackWithChoices(modal.attackIndex, modal.coinResults, {});
  };

  const handleRetreatToBench = (benchIndex: number) => {
    if (!isPlayerTurn || !player.active || isPlayerParalyzed || isPlayerAsleep || isAttackFXPlaying) return;
    sounds.playCardDraw();
    
    setDescendingPlayerActive(true);
    setAscendingPlayerBenchIdx(benchIndex);
    setActionBanner({ text: `Retreating ${player.active.card.name} and sending out ${player.bench[benchIndex]?.card.name}!`, type: 'info' });

    setTimeout(() => {
      const next = GameEngine.retreatPokemon(state, 'player', benchIndex);
      setState(next);
      setIsRetreatMode(false);
      setDescendingPlayerActive(false);
      setAscendingPlayerBenchIdx(null);
      setTimeout(() => setActionBanner(null), 1500);

      if (isMultiplayer) {
        net.sendAction({
          type: 'RETREAT',
          benchIndex
        });
      }
    }, 650);

    setSelectedHandIndex(null);
  };

  const handleEndTurn = () => {
    if (!isPlayerTurn) return;
    if (isTurnLocked || isAiThinking) return;

    // Lock UI while the poison tick plays
    setIsTurnLocked(true);

    const resolved = GameEngine.endTurn(stateRef.current);
    const ticks = statusTicksToShow(resolved);

    // Commit the engine state and start the tick FX in the same frame, so the HP bar
    // never drops before (or long after) the number that explains it.
    setState(resolved);
    setIsRetreatMode(false);
    setSelectedHandIndex(null);

    if (ticks.length > 0) {
      setWithheldTicks(ticks);
      setIsPoisonSequenceActive(true);
      setActiveFXList(poisonFXFromTicks(ticks));
      setTimeout(() => {
        setActiveFXList([]);
        setIsPoisonSequenceActive(false);
        setWithheldTicks([]);

        // Check if the poison/toxic tick was lethal
        const playerFainted = resolved.player.active && resolved.player.active.currentHp <= 0;
        const cpuFainted = resolved.cpu.active && resolved.cpu.active.currentHp <= 0;

        if (playerFainted || cpuFainted) {
          const faintedName = playerFainted
            ? resolved.player.active!.card.name
            : resolved.cpu.active!.card.name;
          const bannerText = playerFainted
            ? `💀 Your ${faintedName} succumbed to Poison and was Knocked Out!`
            : `💀 Opponent's ${faintedName} succumbed to Poison and was Knocked Out!`;
          setActionBanner({ text: bannerText, type: 'knockout' });
          setTimeout(() => {
            setState(post => GameEngine.resolveKnockout(post));
            setActionBanner(null);
            setIsTurnLocked(false);
          }, 1800);
        } else {
          setIsTurnLocked(false);
        }
      }, 1600);
    } else {
      setIsTurnLocked(false);
    }
  };

  const handleSendChatMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'player1',
      senderName: player.name || 'Player',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    sounds.playCardDraw();
    setChatMessages(prev => [...prev, newMsg]);

    if (isMultiplayer) {
      net.sendChat(text, player.name || 'Player');
    } else {
      // AI interactive chat responses
      const aiResponses = [
        "Smell ya later! My Pokémon are on a whole different level!",
        "Hmph! That won't save you from my strategy!",
        "Nice try, but I'm going to be the Pokémon League Champion!",
        "Let's see if your cards can handle my next attack!",
        "Good move! But I've still got plenty of tricks up my sleeve!"
      ];
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'player2',
          senderName: cpu.name,
          text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        sounds.playCardDraw();
        setChatMessages(prev => [...prev, aiMsg]);
        setFloatingChatToast({ sender: cpu.name, text: aiMsg.text });
        setTimeout(() => setFloatingChatToast(null), 3500);
        if (activeSidebarTab !== 'chat') {
          setUnreadChatCount(prev => prev + 1);
        }
      }, 1200);
    }
  };

  const sendEmote = (emote: string) => {
    if (isMultiplayer) {
      net.sendEmote(emote);
    }
    setShowEmotes(false);
  };

  return (
    <div className="min-h-screen bg-pkmn-darkgreen text-white flex flex-col justify-between pt-1 px-1.5 pb-1 md:pt-1.5 md:px-3 md:pb-1.5 select-none relative overflow-x-hidden font-sans">
      {/* BattleFXOverlay is now rendered inside each active card container for correct positioning */}

      {activeTrainerOverlay && (
        <div className={`fixed z-50 pointer-events-none flex flex-col items-center animate-fade-in ${
          activeTrainerOverlay.isOpponent
            ? 'top-[20%] left-[8%] md:left-[12%]'
            : 'bottom-[20%] right-[8%] md:right-[12%]'
        }`}>
          <div className="text-[10px] md:text-[11px] font-black  tracking-wider text-yellow-300 bg-slate-950/95 px-3 py-1 rounded-full border border-yellow-400 mb-1.5 shadow-2xl flex items-center gap-1.5 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            {activeTrainerOverlay.isOpponent ? t.opponentPlayedTrainer : t.youPlayedTrainer}
          </div>
          <div className="w-20 md:w-28 aspect-[600/825] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.7)] border-2 border-yellow-400 bg-slate-900 animate-pulse">
            <img
              src={activeTrainerOverlay.card.originalImageUrl || activeTrainerOverlay.card.image || `/cards/${activeTrainerOverlay.card.number}.jpg`}
              alt={activeTrainerOverlay.card.name}
              className="w-full h-full object-fill"
            />
          </div>
          <div className="mt-1 text-[11px] font-black text-white bg-slate-950/90 px-2.5 py-0.5 rounded-full border border-slate-700 shadow">
            {activeTrainerOverlay.card.name}
          </div>
        </div>
      )}

      {/* Standard Fixed Top Bar */}
      <div className="flex items-center justify-between bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 md:py-2 rounded-xl border border-yellow-500/40 mb-1 shadow-lg z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isMultiplayer) net.disconnect();
              onExitToMenu();
            }}
            className="text-xs font-bold text-gray-300 hover:text-yellow-400 flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {t.menu}
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-blue-400 tracking-wider">
                {cpu.name === 'Opponent (Gary)' ? t.cpuDefault : cpu.name === 'Opponent' ? t.opponentDefault : cpu.name}
              </span>
              {cpu.deckName && (
                <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-0.5 rounded-full border border-blue-500/40 shadow-sm">
                  <span className="text-[10px] font-bold text-blue-200">
                    {cpu.deckName}
                  </span>
                  {cpu.deckTypes && cpu.deckTypes.length > 0 && (
                    <div className="flex items-center gap-1">
                      {cpu.deckTypes.map((type, i) => (
                        <EnergyOrb key={i} type={type} size="xs" />
                      ))}
                    </div>
                  )}
                </div>
              )}
              {isMultiplayer ? (
                <span className="text-[9px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 text-green-400 animate-pulse" /> {t.onlineBadge}
                </span>
              ) : state.difficulty && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                  state.difficulty === 'easy'
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700'
                    : state.difficulty === 'hard'
                    ? 'bg-amber-950/60 text-amber-300 border-amber-700'
                    : state.difficulty === 'expert'
                    ? 'bg-purple-950/60 text-purple-300 border-purple-700 shadow-[0_0_8px_rgba(192,132,252,0.3)]'
                    : 'bg-blue-950/60 text-blue-300 border-blue-700'
                }`}>
                  {state.difficulty === 'easy' ? '🌱 Acemi' : state.difficulty === 'hard' ? '👑 Salon Lideri' : state.difficulty === 'expert' ? '🏆 Şampiyon' : '⚔️ Standart'}
                </span>
              )}
            </div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
              {t.hand}: {cpu.hand.length} • {t.deck}: {cpu.deck.length}
            </div>
          </div>
        </div>

        {/* Turn Status Announcement */}
        <div className="text-center">
          {isInitialSetup ? (
            showMulligan ? (
              <div className="bg-amber-600 text-slate-950 text-xs font-black px-4 py-1.5 rounded-full tracking-widest animate-bounce shadow-lg border border-yellow-300 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-slate-950 animate-spin" /> {t.noBasicOpeningHand}
              </div>
            ) : (
              <div className="bg-yellow-500 text-slate-950 text-xs font-black px-4 py-1.5 rounded-full tracking-widest animate-bounce shadow-lg border border-yellow-300">
                {t.step1SelectActive}
              </div>
            )
          ) : isSelectReplacement ? (
            <div className="bg-red-600 text-white text-xs font-black px-4 py-1.5 rounded-full tracking-widest animate-bounce shadow-lg border border-red-300 flex items-center gap-1.5">
              <Skull className="w-4 h-4" /> {t.activeKnockedOutChoose}
            </div>
          ) : (
            <div className={`text-xs font-black px-4 py-1.5 rounded-full tracking-widest border flex items-center justify-center gap-1.5 ${
              isInitialSetup
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 animate-pulse'
                : isAiThinking
                ? 'bg-blue-600/30 text-blue-300 border-blue-400 animate-pulse'
                : isPlayerTurn
                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400 shadow-card-glow'
                : 'bg-blue-600/20 text-blue-300 border-blue-400'
            }`}>
              {isInitialSetup ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
                  {lang === 'tr' ? 'BAŞLANGIÇ AKTİFİNİ SEÇİN' : 'CHOOSE STARTING ACTIVE'}
                </>
              ) : isAiThinking ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-400" />
                  {t.opponentTakingTurn}
                </>
              ) : isPlayerTurn ? (
                t.yourTurn
              ) : (
                t.opponentTurn
              )}{' '}
              ({t.turnNum} {state.turn})
            </div>
          )}
        </div>

        {/* Player Status, UI Scale & Emote Menu */}
        <div className="flex items-center gap-2 text-right">
          {onChangeLang && (
            <div className="bg-slate-900 border border-slate-700 rounded-full p-0.5 flex items-center text-[9px] font-bold shadow">
              <button
                onClick={() => onChangeLang('tr')}
                className={`px-1.5 py-0.5 rounded-full transition flex items-center gap-1 cursor-pointer ${
                  lang === 'tr' ? 'bg-red-600 text-white shadow font-black' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>🇹🇷</span> TR
              </button>
              <button
                onClick={() => onChangeLang('en')}
                className={`px-1.5 py-0.5 rounded-full transition flex items-center gap-1 cursor-pointer ${
                  lang === 'en' ? 'bg-blue-600 text-white shadow font-black' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>🇬🇧</span> EN
              </button>
            </div>
          )}
          {onChangeUiScale && (
            <div className="hidden sm:flex bg-slate-900 border border-slate-700 rounded-full px-2 py-0.5 items-center gap-1 text-[9px] font-bold shadow">
              {[1.0, 1.15, 1.25].map(scale => (
                <button
                  key={scale}
                  onClick={() => onChangeUiScale(scale)}
                  className={`px-1.5 py-0.5 rounded-full transition cursor-pointer ${
                    Math.abs(uiScale - scale) < 0.05
                      ? 'bg-yellow-500 text-slate-950 shadow font-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {Math.round(scale * 100)}%
                </button>
              ))}
            </div>
          )}
          {isMultiplayer && (
            <div className="relative">
              <button
                onClick={() => setShowEmotes(!showEmotes)}
                className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg border border-slate-700 text-yellow-400 transition cursor-pointer"
                title="Send Emote"
              >
                <Smile className="w-4 h-4" />
              </button>
              {showEmotes && (
                <div className="absolute right-0 top-9 bg-slate-900 border border-yellow-500/40 rounded-xl p-2 shadow-2xl flex flex-col gap-1 z-50 text-xs w-36">
                  {['🔥 Good Luck!', '⚡ Nice Move!', '🛡️ Well Played!', '😎 GG!', '😮 Wow!'].map((e, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendEmote(e)}
                      className="text-left px-2 py-1 rounded hover:bg-slate-800 text-gray-200 text-[11px] cursor-pointer"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {player.deckName && (
                <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-0.5 rounded-full border border-yellow-500/40 shadow-sm">
                  {player.deckTypes && player.deckTypes.length > 0 && (
                    <div className="flex items-center gap-1">
                      {player.deckTypes.map((type, i) => (
                        <EnergyOrb key={i} type={type} size="xs" />
                      ))}
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-yellow-200">
                    {player.deckName}
                  </span>
                </div>
              )}
              <span className="text-xs font-bold text-yellow-400 tracking-wider">
                {player.name === 'Player' ? t.playerDefault : player.name}
              </span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
              {t.hand}: {player.hand.length} • {t.deck}: {player.deck.length}
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Action Toast Banner */}
      {actionBanner && (
        <div className={`fixed top-18 left-1/2 transform -translate-x-1/2 px-6 py-2.5 rounded-full shadow-2xl z-50 text-sm font-black animate-bounce border-2 flex items-center gap-2 ${
          actionBanner.type === 'knockout'
            ? 'bg-red-950/95 text-red-300 border-red-500 ring-4 ring-red-600/50'
            : actionBanner.type === 'attack'
            ? 'bg-red-600/95 text-white border-yellow-400'
            : 'bg-slate-900/95 text-yellow-300 border-yellow-500/60'
        }`}>
          {actionBanner.type === 'knockout' ? <Skull className="w-5 h-5 text-red-400" /> : actionBanner.type === 'attack' ? <Swords className="w-4 h-4 text-yellow-300" /> : <Sparkles className="w-4 h-4 text-yellow-400" />}
          {translateLog(actionBanner.text, lang)}
        </div>
      )}

      {/* Opponent Floating Chat Toast */}
      {floatingChatToast && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-slate-900/95 text-white border-2 border-blue-400 font-bold px-4 py-2 rounded-2xl shadow-2xl z-50 text-xs animate-bounce flex items-center gap-2 max-w-sm">
          <MessageSquare className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="truncate"><strong className="text-blue-300">{floatingChatToast.sender}:</strong> "{floatingChatToast.text}"</span>
        </div>
      )}

      {/* Opponent Emote */}
      {opponentEmote && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-slate-950 font-black px-4 py-1.5 rounded-full shadow-2xl z-50 text-xs animate-bounce border-2 border-slate-950">
          Opponent says: {opponentEmote}
        </div>
      )}

      
        {/* Main Playmat Field */}
        <div className="flex flex-col lg:flex-row gap-3 w-full flex-grow z-10">
        <div className="flex-1 min-w-0 flex flex-col justify-between bg-pkmn-felt border-4 border-amber-900/80 rounded-2xl p-2.5 md:p-3.5 shadow-2xl relative min-h-[480px]">
          
          {/* 1. OPPONENT AREA */}
          <div className="flex items-center justify-between border-b border-amber-950/40 pb-1.5">
            <div className="flex flex-col items-center">
              <div className="text-[10px] font-bold text-blue-300 mb-1">
                {t.opponentPrizes} ({cpu.prizes.length})
              </div>
              <div className="grid grid-cols-3 gap-1">
                {cpu.prizes.map((_, i) => (
                  <div key={i} className="w-8 sm:w-10 md:w-12 lg:w-13 aspect-[600/825] rounded-md overflow-hidden shadow-md">
                    <img src="/assets/card_back.png" alt="Prize" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>

            {/* CPU Bench (Up to 5) - Proportionate size */}
            <div className="flex gap-2 justify-center items-center flex-grow px-4 transition-transform duration-200" style={{ zoom: uiScale }}>
              {cpu.bench.map((b, bIdx) => (
                <div
                  key={b.instanceId}
                  className={`relative ${slotShakes('cpu', 'bench', bIdx) ? 'animate-fx-card-shake' : ''}`}
                >
                  <CardView
                    inPlayCard={b}
                    size="sm"
                    isAscending={ascendingCpuBenchIdx === bIdx}
                    onInspect={() => handleInspect(b.card, b)}
                  />
                  {/* A move that picked a Benched Pokémon (Stare) or swept the whole Bench
                      (Poison Vapor) has to animate on that card, not on the Active one. */}
                  <BattleFXOverlay fxList={activeFXList} onFXComplete={removeFX} targetFilter="cpu" slot="bench" benchIndex={bIdx} lang={lang} />
                </div>
              ))}
              {Array.from({ length: 5 - cpu.bench.length }).map((_, i) => (
                <div
                  key={i}
                  className="w-14 sm:w-[74px] md:w-[92px] lg:w-[110px] aspect-[600/825] border border-dashed border-white/15 bg-slate-900/20 rounded-xl flex flex-col items-center justify-center text-[8px] text-white/20 select-none pointer-events-none"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-white/15 mb-0.5" />
                  <span>{t.bench}</span>
                </div>
              ))}
            </div>

            {/* CPU Deck */}
            <div className="flex gap-2">
              <div className="w-11 sm:w-14 md:w-16 lg:w-20 aspect-[600/825] rounded-xl overflow-hidden shadow-xl relative border border-yellow-500/40">
                <img src="/assets/card_back.png" alt="Opponent Deck" className="w-full h-full object-contain" />
                <span className="absolute bottom-1 right-1 text-[10px] font-mono font-bold text-yellow-300 bg-black/80 px-1.5 py-0.5 rounded">
                  {cpu.deck.length}
                </span>
              </div>
            </div>
          </div>

          {/* 2. CENTER BATTLEFIELD: ACTIVE POKEMON */}
          <div data-drop-zone="center-field" className="my-auto py-2 flex items-center justify-around rounded-3xl transition-all duration-300">
            {/* CPU Active */}
            <div className={`flex flex-col items-center transition-transform duration-200 ${slotShakes('cpu', 'active') ? 'animate-fx-card-shake' : ''} ${activeFXList.some(f => f.target === 'cpu' && f.type === 'poison_tick') ? 'animate-poison-card-tremble' : ''}`} style={{ zoom: uiScale }}>
              <div className="text-xs font-bold text-blue-300 mb-1.5  tracking-wider">{t.opponentActive}</div>
              <div className="relative">
                {cpu.active ? (
                  <CardView
                    inPlayCard={displayActive('cpu')}
                    size="active"
                    isDescending={descendingCpuActive}
                    onInspect={() => handleInspect(cpu.active!.card, cpu.active!)}
                  />
                ) : (
                  <div className="w-[128px] sm:w-[142px] md:w-[166px] lg:w-[184px] aspect-[600/825] border-2 border-dashed border-blue-400/40 rounded-xl flex flex-col items-center justify-center text-xs text-blue-300 animate-pulse p-2 text-center">
                    <span>{t.waitingOpponentActive}</span>
                  </div>
                )}
                <BattleFXOverlay fxList={activeFXList} onFXComplete={removeFX} targetFilter="cpu" slot="active" lang={lang} />
              </div>
            </div>

            {/* Player Active */}
            <div
              data-drop-zone="player-active"
              data-is-active="true"
              className="flex flex-col items-center rounded-2xl transition-transform duration-200"
              style={{ zoom: uiScale }}
            >
              <div className="text-xs font-bold text-yellow-400 mb-1.5  tracking-wider">{t.yourActive}</div>
              {player.active ? (
                <div
                  data-drop-zone="in-play-pokemon"
                  data-instance-id={player.active.instanceId}
                  data-is-active="true"
                  className={`w-full flex justify-center relative ${slotShakes('player', 'active') ? 'animate-fx-card-shake' : ''} ${activeFXList.some(f => f.target === 'player' && f.type === 'poison_tick') ? 'animate-poison-card-tremble' : ''}`}
                >
                  {/* Active Hover Target Indicator */}
                  {hoveredDropTarget?.type === 'active' && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center animate-bounce pointer-events-none">
                      <span className="text-[8px] font-black bg-yellow-400 text-slate-950 px-1.5 py-0.2 rounded-full shadow-md font-mono tracking-wider flex items-center gap-0.5">
                        ▼ {lang === 'tr' ? 'HEDEF' : 'TARGET'}
                      </span>
                      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-yellow-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] -mt-0.5" />
                    </div>
                  )}
                  <CardView
                    inPlayCard={displayActive('player')}
                    size="active"
                    isSelected={false}
                    isDropHovered={hoveredDropTarget?.type === 'active'}
                    isDescending={descendingPlayerActive}
                    onClick={() => handleInPlayClick(player.active!, false)}
                    onInspect={() => handleInspect(player.active!.card, player.active!)}
                  />
                  <BattleFXOverlay fxList={activeFXList} onFXComplete={removeFX} targetFilter="player" slot="active" lang={lang} />
                </div>
              ) : (
                <div
                  onClick={() => {
                    if (selectedHandIndex !== null && isInitialSetup) handleSetStartingActive(selectedHandIndex);
                  }}
                  className={`w-[128px] sm:w-[142px] md:w-[166px] lg:w-[184px] aspect-[600/825] border-2 border-dashed border-yellow-400 bg-yellow-500/10 rounded-xl flex flex-col items-center justify-center text-xs text-yellow-300 animate-pulse cursor-pointer p-2 text-center transition-all duration-200 ${
                    draggingCard?.isDragActive && ((draggingCard.card.supertype === 'Pokemon' && draggingCard.card.subtype === 'Basic') || draggingCard.card.name === 'Mysterious Fossil' || draggingCard.card.name === 'Clefairy Doll')
                      ? 'ring-4 ring-yellow-400/80 bg-yellow-500/20 shadow-[0_0_25px_rgba(250,204,21,0.6)] scale-102'
                      : ''
                  }`}
                >
                  <PlusCircle className="w-6 h-6 mb-1 text-yellow-400" />
                  <span className="font-bold">{isInitialSetup ? t.placeStartingActive : t.activeSlot}</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. PLAYER AREA */}
          <div className="flex items-center justify-between border-t border-amber-950/40 pt-1.5">
            <div className="flex flex-col items-center">
              <div className="text-[10px] font-bold text-yellow-300 mb-1">{t.yourPrizes} ({player.prizes.length})</div>
              <div className="grid grid-cols-3 gap-1">
                {player.prizes.map((_, i) => (
                  <div key={i} className="w-11 md:w-13 aspect-[600/825] rounded-md overflow-hidden shadow-md">
                    <img src="/assets/card_back.png" alt="Prize" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>

            {/* Player Bench (Up to 5) - Shrink empty boxes to exact card size */}
            <div data-drop-zone="player-bench" className="flex gap-2 justify-center items-center flex-grow px-4 rounded-2xl transition-transform duration-200" style={{ zoom: uiScale }}>
              {player.bench.map((b, bIdx) => (
                <div key={b.instanceId} className="flex flex-col items-center">
                  <div
                    data-drop-zone="in-play-pokemon"
                    data-instance-id={b.instanceId}
                    data-bench-index={bIdx}
                    data-is-active="false"
                    onPointerDown={(e) => handleBenchCardPointerDown(e, b, bIdx)}
                    className={`relative touch-none select-none transition-opacity duration-200 ${
                      draggingBenchPokemon?.benchIndex === bIdx ? 'opacity-30' : ''
                    } ${slotShakes('player', 'bench', bIdx) ? 'animate-fx-card-shake' : ''}`}
                  >
                    {/* Bench Hover Target Indicator (Downward Triangle/Arrow) */}
                    {hoveredDropTarget?.type === 'bench' && hoveredDropTarget.benchIndex === bIdx && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center animate-bounce pointer-events-none">
                        <span className="text-[8px] font-black bg-yellow-400 text-slate-950 px-1.5 py-0.2 rounded-full shadow-md font-mono tracking-wider flex items-center gap-0.5">
                          ▼ {lang === 'tr' ? 'HEDEF' : 'TARGET'}
                        </span>
                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-yellow-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] -mt-0.5" />
                      </div>
                    )}
                    <CardView
                      inPlayCard={b}
                      size="sm"
                      isSelected={false}
                      isDropHovered={hoveredDropTarget?.type === 'bench' && hoveredDropTarget.benchIndex === bIdx}
                      isAscending={ascendingPlayerBenchIdx === bIdx}
                      isTargetable={isRetreatMode || isSelectReplacement}
                      showInspectIcon={isSelectReplacement || !player.active}
                      onClick={() => handleInPlayClick(b, true)}
                      onInspect={() => handleInspect(b.card, b)}
                    />
                    {/* Beats that name this exact Benched Pokémon (Stare's pick, Poison Vapor's
                        sweep) land here instead of on the Active card. */}
                    <BattleFXOverlay fxList={activeFXList} onFXComplete={removeFX} targetFilter="player" slot="bench" benchIndex={bIdx} lang={lang} />
                  </div>
                  {(isRetreatMode || isSelectReplacement) && (
                    <button
                      onClick={() => {
                        if (isSelectReplacement) {
                          handleChooseKnockoutReplacement(b.instanceId);
                        } else {
                          handleRetreatToBench(bIdx);
                        }
                      }}
                      className="mt-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded shadow animate-pulse flex items-center gap-0.5"
                    >
                      <ArrowUpRight className="w-2.5 h-2.5" />
                      {isSelectReplacement ? t.sendOut : t.switchIn}
                    </button>
                  )}
                </div>
              ))}
              {Array.from({ length: 5 - player.bench.length }).map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (selectedHandIndex !== null) handleBenchBasic(selectedHandIndex);
                  }}
                  data-drop-zone="player-bench" className="w-14 sm:w-[74px] md:w-[92px] lg:w-[110px] aspect-[600/825] border border-dashed border-white/15 hover:border-yellow-400/50 bg-slate-900/20 rounded-xl flex flex-col items-center justify-center text-[8px] text-white/25 hover:text-yellow-300 cursor-pointer transition select-none"
                >
                  <PlusCircle className="w-3.5 h-3.5 mb-0.5 opacity-60" />
                  <span>{t.bench}</span>
                </div>
              ))}
            </div>

            {/* Player Deck */}
            <div className="flex gap-2">
              <div className="w-16 md:w-20 aspect-[600/825] rounded-xl overflow-hidden shadow-xl relative border border-yellow-500/40">
                <img src="/assets/card_back.png" alt="Deck" className="w-full h-full object-contain" />
                <span className="absolute bottom-1 right-1 text-[10px] font-mono font-bold text-yellow-300 bg-black/80 px-1.5 py-0.5 rounded">
                  {player.deck.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: {t.commandCenter} & Battle Log */}
        <div className="w-full lg:w-[285px] xl:w-[310px] shrink-0 flex flex-col justify-between gap-2.5 z-10">
          <div className="bg-slate-900/95 border-2 border-yellow-500/40 rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-black  tracking-wider text-yellow-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-yellow-400" /> {t.commandCenter}
              </h3>
              <div className="flex items-center gap-1.5">
                {player.energyAttachedThisTurn && (
                  <span className="text-[10px] bg-green-900/60 text-green-300 px-2 py-0.5 rounded border border-green-700 font-semibold">
                    {t.energyBadge}
                  </span>
                )}
                {player.trainerPlayedThisTurn && (
                  <span className="text-[10px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700 font-semibold">
                    {t.trainerBadge}
                  </span>
                )}
              </div>
            </div>

            {/* MULLIGAN RESHUFFLE: ONLY ON TURN 1 INITIAL SETUP WITH 0 BASICS */}
            {isInitialSetup && showMulligan && (
              <div className="p-3.5 bg-amber-950/90 border-2 border-amber-500 rounded-xl space-y-2 animate-bounce shadow-xl">
                <div className="text-xs font-black text-amber-300  tracking-wider flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" /> {t.mulliganTitle}
                </div>
                <p className="text-[11px] text-gray-200 leading-relaxed">
                  {t.mulliganDesc}
                </p>
                <button
                  onClick={handleMulliganReshuffle}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black py-2.5 rounded-lg text-xs shadow-lg transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 fill-current" /> {t.mulliganBtn}
                </button>
              </div>
            )}

            {/* KNOCKOUT REPLACEMENT MODE (ONLY FROM BENCH) */}
            {isSelectReplacement && (
              <div className="p-3 bg-red-950/80 border-2 border-red-500 rounded-xl space-y-2 animate-fade-in">
                <div className="text-xs font-black text-red-300  tracking-wider flex items-center gap-1.5">
                  <Skull className="w-4 h-4 text-red-400" /> {t.selectReplacementTitle}
                </div>
                <p className="text-[11px] text-gray-200">
                  {t.selectReplacementDesc}
                </p>
                <div className="space-y-1.5 pt-1">
                  {player.bench.map((b, idx) => (
                    <button
                      key={b.instanceId}
                      onClick={() => handleChooseKnockoutReplacement(b.instanceId)}
                      className="w-full text-left bg-slate-800 hover:bg-yellow-500 hover:text-slate-950 text-white p-2 rounded-lg text-xs font-bold transition flex items-center justify-between border border-slate-700 shadow"
                    >
                      <span>{idx + 1}. {b.card.name}</span>
                      <span className="font-mono text-[10px]">{b.currentHp}/{b.card.hp} HP ({b.attachedEnergy.length} Energy)</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RETREAT SELECTION MODE */}
            {isRetreatMode && (
              <div className="p-3 bg-blue-950/80 border-2 border-blue-500 rounded-xl space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-black text-blue-300  tracking-wider">
                  <span>{t.retreatTitle}</span>
                  <button onClick={() => setIsRetreatMode(false)} className="text-[10px] text-gray-400 hover:text-white underline">{t.cancel}</button>
                </div>
                <p className="text-[11px] text-gray-200">
                  {t.retreatDesc}
                </p>
                <div className="space-y-1.5 pt-1">
                  {player.bench.map((b, idx) => (
                    <button
                      key={b.instanceId}
                      onClick={() => handleRetreatToBench(idx)}
                      className="w-full text-left bg-slate-800 hover:bg-yellow-500 hover:text-slate-950 text-white p-2 rounded-lg text-xs font-bold transition flex items-center justify-between border border-slate-700 shadow"
                    >
                      <span>{idx + 1}. {b.card.name}</span>
                      <span className="font-mono text-[10px]">{b.currentHp}/{b.card.hp} HP</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* INITIAL SETUP PHASE ACTIONS */}
            {isInitialSetup && !showMulligan && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/40 rounded-xl">
                <div className="text-xs font-bold text-yellow-300 mb-2">
                  {t.setupSelectActiveDesc}
                </div>
                {selectedCard && selectedCard.supertype === 'Pokemon' && selectedCard.subtype === 'Basic' ? (
                  <button
                    onClick={() => handleSetStartingActive(selectedHandIndex!)}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-2 animate-pulse"
                  >
                    <Play className="w-4 h-4 fill-current" /> {t.setAsActiveBtn} ({selectedCard.name})
                  </button>
                ) : (
                  <div className="text-xs text-gray-400 italic">
                    {t.clickBasicInHandPrompt}
                  </div>
                )}
              </div>
            )}

            {/* SELECTED CARD ACTIONS IN HAND */}
            {!isInitialSetup && !isSelectReplacement && selectedCard && (
              <div className="p-3 bg-slate-800/90 border border-slate-700 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs border-b border-slate-700/60 pb-1.5">
                  <span className="font-bold text-yellow-300">{lang === 'tr' ? 'Seçilen' : 'Selected'}: {selectedCard.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">({formatCardTypeLabel(selectedCard, lang)})</span>
                </div>

                {/* Basic Pokemon */}
                {selectedCard.supertype === 'Pokemon' && selectedCard.subtype === 'Basic' && (
                  <div className="space-y-1.5">
                    {player.bench.length < 5 && (
                      <button
                        onClick={() => handleBenchBasic(selectedHandIndex!)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> {t.putOnBenchBtn}
                      </button>
                    )}
                  </div>
                )}

                {/* Evolution Pokemon (Enforcing 1-turn wait rule) */}
                {selectedCard.supertype === 'Pokemon' && selectedCard.evolvesFrom && (
                  <div className="space-y-1.5">
                    {state.turn === 1 ? (
                      <div className="text-[11px] text-amber-300/90 italic bg-amber-950/40 p-2 rounded border border-amber-800/50">
                        {t.cannotEvolveTurn1}
                      </div>
                    ) : (
                      <>
                        {player.active && player.active.card.name === selectedCard.evolvesFrom && (
                          player.active.turnsInPlay >= 1 ? (
                            <button
                              onClick={() => handleEvolveTarget(player.active!.instanceId, true, 0)}
                              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg text-xs"
                            >
                              ▲ {t.evolveActiveBtn} ({player.active.card.name} → {selectedCard.name})
                            </button>
                          ) : (
                            <div className="text-[10px] text-gray-400 italic">
                              {t.cannotEvolveTurnEntered}
                            </div>
                          )
                        )}
                        {player.bench.map((b, i) => b.card.name === selectedCard.evolvesFrom ? (
                          b.turnsInPlay >= 1 ? (
                            <button
                              key={b.instanceId}
                              onClick={() => handleEvolveTarget(b.instanceId, false, i)}
                              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg text-xs"
                            >
                              ▲ {t.evolveBenchedBtn} ({b.card.name} → {selectedCard.name})
                            </button>
                          ) : (
                            <div key={b.instanceId} className="text-[10px] text-gray-400 italic">
                              {lang === 'tr' ? `Yedekteki ${b.card.name} henüz evrimleşemez (1 tur beklenmeli).` : `Cannot evolve Benched ${b.card.name} yet (must wait 1 turn).`}
                            </div>
                          )
                        ) : null)}
                      </>
                    )}
                  </div>
                )}

                {/* Energy Card */}
                {selectedCard.supertype === 'Energy' && (
                  <div className="space-y-1.5">
                    {player.energyAttachedThisTurn ? (
                      <div className="text-[11px] text-yellow-400">
                        {t.energyAttachedTurnLimit}
                      </div>
                    ) : (
                      <>
                        {player.active && (
                          <button
                            onClick={() => handleAttachEnergyToTarget(player.active!.instanceId, true, 0)}
                            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5"
                          >
                            {t.attachToActiveBtn} ({player.active.card.name})
                          </button>
                        )}
                        {player.bench.map((b, i) => (
                          <button
                            key={b.instanceId}
                            onClick={() => handleAttachEnergyToTarget(b.instanceId, false, i)}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-yellow-300 font-semibold py-1.5 rounded-lg text-xs"
                          >
                            {t.attachToBenchBtn} #{i+1} ({b.card.name})
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}

                {/* Trainer Card (1 per turn limit) */}
                {selectedCard.supertype === 'Trainer' && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-gray-300 leading-relaxed">{formatCardText(selectedCard.trainer?.text || '')}</p>
                    {player.trainerPlayedThisTurn ? (
                      <div className="text-[11px] text-yellow-400 bg-yellow-950/40 p-2 rounded border border-yellow-800/50">
                        {t.trainerPlayedTurnLimit}
                      </div>
                    ) : (
                      <button
                        onClick={handlePlaySelectedTrainer}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs shadow transition"
                      >
                        {t.playTrainerBtn}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* POKEMON POWERS & SPECIAL IN-PLAY ACTIONS */}
            {!isInitialSetup && !isSelectReplacement && (
              (() => {
                const pokemonsWithPower = [player.active, ...player.bench].filter(
                  (p): p is InPlayCard => !!p && !!(p.card.power || p.card.pokemonPower)
                );

                const inPlayDollsAndFossils = [player.active, ...player.bench].filter(
                  (p): p is InPlayCard => !!p && (p.card.name === 'Mysterious Fossil' || p.card.name === 'Clefairy Doll' || Boolean(p.isClefairyDoll))
                );

                if (pokemonsWithPower.length === 0 && inPlayDollsAndFossils.length === 0) return null;

                // Group and deduplicate duplicate powers by power.name
                const uniquePowersMap = new Map<string, { inPlay: InPlayCard; power: any; count: number; canUse: boolean; isPassive: boolean; isDisabled: boolean }>();
                pokemonsWithPower.forEach(inPlay => {
                  const power = inPlay.card.power || inPlay.card.pokemonPower;
                  if (!power) return;
                  const isPassive = isPassivePower(power.name);
                  const isAsleepOrParalyzedOrConfused = inPlay.status === 'Asleep' || inPlay.status === 'Paralyzed' || inPlay.status === 'Confused';
                  // Dark Arbok's Stare silences a Pokémon Power for a whole round. The button has
                  // to say so rather than sit there looking usable - the engine already refuses it.
                  const isDisabled = GameEngine.isPowerDisabled(inPlay, state.turn);
                  const canUse = Boolean(isPlayerTurn && !inPlay.powerUsedThisTurn && !isAsleepOrParalyzedOrConfused && !isDisabled);

                  const existing = uniquePowersMap.get(power.name);
                  if (!existing) {
                    uniquePowersMap.set(power.name, { inPlay, power, count: 1, canUse, isPassive, isDisabled });
                  } else {
                    existing.count++;
                    if (!existing.canUse && canUse) {
                      existing.inPlay = inPlay;
                      existing.canUse = true;
                      existing.isDisabled = isDisabled;
                    }
                  }
                });

                const uniquePowers = Array.from(uniquePowersMap.values());

                return (
                  <div className="space-y-1.5 mb-2.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 tracking-wider">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {lang === 'tr' ? 'ÖZEL YETENEKLER & EYLEMLER' : 'POWERS & SPECIAL ACTIONS'}:
                      </span>
                    </div>

                    {/* Render unique Pokemon Powers */}
                    {uniquePowers.map(({ inPlay, power, count, canUse, isPassive, isDisabled }) => {
                      return (
                        <div
                          key={power.name}
                          className={`p-2 rounded-xl border transition ${
                            isDisabled && !isPassive
                              ? 'bg-fuchsia-950/20 border-fuchsia-800/40 text-fuchsia-200/80'
                              : isPassive
                              ? 'bg-purple-950/20 border-purple-800/30 text-purple-200'
                              : canUse
                              ? 'bg-slate-900/80 border-amber-500/60 text-white shadow-sm'
                              : 'bg-slate-900/40 border-slate-800 text-gray-500'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <div className="flex items-center gap-1 min-w-0 flex-1">
                              <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                                POWER
                              </span>
                              <span className="text-[11px] font-bold text-yellow-300 truncate">{power.name}</span>
                              <span className="text-[9px] text-gray-400 font-medium shrink-0">
                                ({inPlay.card.name}{count > 1 ? ` x${count}` : ''})
                              </span>
                            </div>
                            <div className="shrink-0">
                              {isDisabled ? (
                                <span
                                  className="text-[9px] font-bold text-fuchsia-200 bg-fuchsia-950/70 px-1.5 py-0.5 rounded border border-fuchsia-700/60 flex items-center gap-0.5 whitespace-nowrap"
                                  title={lang === 'tr' ? "Rakibin Dark Arbok'unun Stare yeteneği bu gücü rakibin sonraki turu bitene kadar kapattı" : "Shut down by the opponent's Dark Arbok Stare until the end of their next turn"}
                                >
                                  👁️ {lang === 'tr' ? 'Devre Dışı' : 'Shut Down'}
                                </span>
                              ) : isPassive ? (
                                <span className="text-[9px] font-semibold text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40">
                                  {lang === 'tr' ? 'Pasif' : 'Passive'}
                                </span>
                              ) : inPlay.powerUsedThisTurn ? (
                                <span className="text-[9px] font-semibold text-gray-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                                  {lang === 'tr' ? 'Kullanıldı' : 'Used'}
                                </span>
                              ) : (
                                <button
                                  disabled={!canUse}
                                  onClick={() => handleActivatePokemonPower(inPlay, power)}
                                  className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 disabled:opacity-40 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-lg shadow transition active:scale-95 cursor-pointer flex items-center gap-1 whitespace-nowrap"
                                >
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>{lang === 'tr' ? 'Gücü Kullan' : 'Use Power'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-[9.5px] text-gray-300/90 leading-tight">{formatCardText(power.text)}</p>
                        </div>
                      );
                    })}

                    {/* Render Mysterious Fossil / Clefairy Doll Discard Option */}
                    {inPlayDollsAndFossils.map(fossil => (
                      <div
                        key={fossil.instanceId}
                        className="p-2 rounded-xl border bg-slate-900/80 border-amber-500/40 text-white shadow-sm flex items-center justify-between gap-1.5"
                      >
                        <div className="flex items-center gap-1 min-w-0 flex-1">
                          <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 shrink-0">
                            TRAINER
                          </span>
                          <span className="text-[11px] font-bold text-yellow-300 truncate">{fossil.card.name}</span>
                          <span className="text-[9px] text-gray-400 font-medium shrink-0">
                            ({fossil === player.active ? (lang === 'tr' ? 'Aktif' : 'Active') : (lang === 'tr' ? 'Bench' : 'Bench')})
                          </span>
                        </div>
                        <button
                          disabled={!isPlayerTurn}
                          onClick={() => handleDiscardFossil(fossil.instanceId)}
                          className="bg-red-500/80 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-lg shadow transition active:scale-95 cursor-pointer whitespace-nowrap"
                        >
                          {lang === 'tr' ? 'Oyundan Çıkar' : 'Discard from Play'}
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()
            )}

            {/* ATTACK ACTIONS (DISABLED IF PARALYZED OR ASLEEP) */}
            {!isInitialSetup && !isSelectReplacement && player.active && player.active.card.attacks && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-300  tracking-wider">
                  <span>{t.attacksTitle} ({player.active.card.name}):</span>
                  {isPlayerParalyzed && <span className="text-yellow-400 font-black">{t.paralyzedStatus}</span>}
                  {isPlayerAsleep && <span className="text-blue-400 font-black">{t.asleepStatus}</span>}
                </div>
                {player.active.card.attacks.map((atk, idx) => {
                  const canPay = GameEngine.canPayAttackCost(player.active!, atk);
                  // One helper for every "this move is switched off" case: Tail Wag / Leer block the
                  // whole moveset, Amnesia only the named attack. Both have to grey the button out
                  // and say why, otherwise clicking it spends the turn on a coin flip for nothing.
                  const blockReason = GameEngine.getAttackBlockReason(player.active, atk, state.turn);
                  const blockLabel = blockReason === 'amnesia'
                    ? '⏳ AMNESIA'
                    : `🚫 ${(player.active?.attackBlockMoveName || 'TAIL WAG').toUpperCase()}`;
                  const isBlocked = !isPlayerTurn || !canPay || isPlayerParalyzed || isPlayerAsleep || !player.active || player.active.currentHp <= 0 || blockReason !== null;
                  return (
                    <button
                      key={idx}
                      disabled={isBlocked}
                      onClick={() => handleAttack(idx)}
                      className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition ${
                        !isBlocked
                          ? 'bg-red-600/40 hover:bg-red-600/70 border-red-500 text-white cursor-pointer shadow-md'
                          : 'bg-slate-800/40 border-slate-700/40 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Swords className="w-3.5 h-3.5 text-red-400" />
                          <span className="text-xs font-bold">{atk.name}</span>
                          {blockReason && <span className="text-[9px] font-black text-purple-400 animate-pulse">{blockLabel}</span>}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {atk.cost.map((c, i) => (
                            <img
                              key={i}
                              src={getEnergyIconPath(c)}
                              alt={c}
                              className="w-4 h-4 rounded-full object-contain drop-shadow"
                            />
                          ))}
                        </div>
                      </div>
                      {(() => {
                        const preview = GameEngine.calculatePreviewAttackDamage(player.active!, atk, cpu.active);
                        return (
                          <div className="flex flex-col items-end">
                            <span className="text-xs sm:text-sm font-black text-yellow-400">
                              {atk.damage > 0 || preview.totalDamage > 0
                                ? `${preview.displayDamage} ${t.dmgText}`
                                : t.effectText}
                            </span>
                            {preview.bonusDamage !== 0 && (
                              <span className="text-[10px] font-bold text-emerald-400 animate-pulse">
                                = {preview.totalDamage} {t.dmgText}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </button>
                  );
                })}
              </div>
            )}

            {/* RETREAT & PASS TURN BUTTONS */}
            {!isInitialSetup && !isSelectReplacement && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                {player.bench.length > 0 && player.active && (
                  <button
                    disabled={!isPlayerTurn || player.hasRetreatedThisTurn || isPlayerParalyzed || isPlayerAsleep || isAttackFXPlaying}
                    onClick={() => setIsRetreatMode(!isRetreatMode)}
                    className={`text-xs font-semibold py-2.5 rounded-xl border transition ${
                      isPlayerParalyzed || isPlayerAsleep
                        ? 'bg-slate-800/40 border-slate-700/40 text-gray-500 cursor-not-allowed'
                        : isRetreatMode
                        ? 'bg-blue-600 text-white border-blue-400'
                        : 'bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-gray-200 border-slate-700'
                    }`}
                  >
                    {isPlayerParalyzed ? t.paralyzedStatus : isPlayerAsleep ? t.asleepStatus : isRetreatMode ? t.cancel : t.retreatBtn}
                  </button>
                )}
                <button
                  disabled={!isPlayerTurn}
                  onClick={handleEndTurn}
                  className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition shadow"
                >
                  {t.passTurnBtn}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Tabbed Log & Live Chat */}
          <div className="flex flex-col gap-1.5">
            <div className="flex bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 text-[11px] font-bold">
              <button
                onClick={() => setActiveSidebarTab('log')}
                className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeSidebarTab === 'log'
                    ? 'bg-yellow-500 text-slate-950 shadow'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Terminal className="w-3 h-3" />
                <span>{t.battleLogTab}</span>
              </button>
              <button
                onClick={() => {
                  setActiveSidebarTab('chat');
                  setUnreadChatCount(0);
                }}
                className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1.5 transition relative ${
                  activeSidebarTab === 'chat'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>{t.liveChatTab}</span>
                {unreadChatCount > 0 && activeSidebarTab !== 'chat' && (
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black animate-pulse shadow">
                    {unreadChatCount}
                  </span>
                )}
              </button>
            </div>

            {activeSidebarTab === 'log' ? (
              <GameLog logs={state.logs} lang={lang} />
            ) : (
              <InGameChat
                messages={chatMessages}
                onSendMessage={handleSendChatMessage}
                playerName={player.name || 'Player'}
                isMultiplayer={isMultiplayer}
                lang={lang}
              />
            )}
          </div>
        </div>
      </div>

      {/* MOBILE TOUCH QUICK ACTIONS TOOLBAR (Appears on phones when a card is selected) */}
      {selectedCard && (
        <div className="lg:hidden fixed bottom-28 left-2 right-2 z-40 bg-slate-900/95 backdrop-blur-md border-2 border-yellow-400 p-2.5 rounded-2xl shadow-2xl animate-fade-in flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-yellow-300 truncate max-w-[120px]">{selectedCard.name}</span>
            <button
              onClick={() => handleInspect(selectedCard)}
              className="bg-slate-800 text-yellow-400 text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-700 flex items-center gap-1 active:scale-95"
            >
              <Sparkles className="w-3 h-3" /> {lang === 'tr' ? 'İncele' : 'Inspect'}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Basic Pokemon Action on Mobile */}
            {selectedCard.supertype === 'Pokemon' && selectedCard.subtype === 'Basic' && (
              isInitialSetup ? (
                <button
                  onClick={() => handleSetStartingActive(selectedHandIndex!)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black px-3 py-1.5 rounded-xl shadow active:scale-95 animate-pulse"
                >
                  ⚡ {lang === 'tr' ? 'Aktif Yap' : 'Set Active'}
                </button>
              ) : (
                player.bench.length < 5 && (
                  <button
                    onClick={() => handleBenchBasic(selectedHandIndex!)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow active:scale-95"
                  >
                    🎴 {lang === 'tr' ? 'Yedeğe Koy' : 'Put on Bench'}
                  </button>
                )
              )
            )}

            {/* Evolution Pokemon Action on Mobile */}
            {selectedCard.supertype === 'Pokemon' && selectedCard.evolvesFrom && (
              player.active && player.active.card.name === selectedCard.evolvesFrom && player.active.turnsInPlay >= 1 && (
                <button
                  onClick={() => handleEvolveTarget(player.active!.instanceId, true, 0)}
                  className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow active:scale-95"
                >
                  ▲ {lang === 'tr' ? 'Aktifi Evrimleştir' : 'Evolve Active'}
                </button>
              )
            )}

            {/* Energy Action on Mobile */}
            {selectedCard.supertype === 'Energy' && !player.energyAttachedThisTurn && (
              player.active && (
                <button
                  onClick={() => handleAttachEnergyToTarget(player.active!.instanceId, true, 0)}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow active:scale-95"
                >
                  ⚡ {lang === 'tr' ? 'Aktife Ekle' : 'Attach to Active'}
                </button>
              )
            )}

            {/* Trainer Action on Mobile */}
            {selectedCard.supertype === 'Trainer' && !player.trainerPlayedThisTurn && (
              <button
                onClick={handlePlaySelectedTrainer}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow active:scale-95"
              >
                ▶ {lang === 'tr' ? 'Eğitmeni Oyna' : 'Play Trainer'}
              </button>
            )}

            <button
              onClick={() => setSelectedHandIndex(null)}
              className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      
      {/* FLOATING DRAGGED CARD GHOST PREVIEW (TOUCH & MOUSE - TRANSPARENT CLEAN BACKDROP) */}
      {draggingCard && draggingCard.isDragActive && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 rotate-2 scale-105 select-none flex flex-col items-center"
          style={{
            left: `${draggingCard.currentX}px`,
            top: `${draggingCard.currentY}px`,
            width: '124px'
          }}
        >
          <div className="w-full aspect-[600/825] p-[2px] bg-[#f5cb39] rounded-xl overflow-hidden shadow-[0_0_25px_rgba(250,204,21,0.95),0_10px_20px_rgba(0,0,0,0.35)] border border-[#c79808]">
            <div className="w-full h-full rounded-[6px] overflow-hidden bg-[#f5cb39] flex items-center justify-center">
              <img
                src={draggingCard.card.originalImageUrl || draggingCard.card.image || `/cards/${draggingCard.card.number}.jpg`}
                alt={draggingCard.card.name}
                draggable={false}
                className="w-full h-full object-fill pointer-events-none select-none rounded-[6px]"
              />
            </div>
          </div>
          <div className="text-center mt-1">
            <span className="bg-slate-950/90 text-yellow-300 font-bold text-[9px] px-2 py-0.5 rounded-full border border-yellow-500/60 shadow">
              {draggingCard.card.name}
            </span>
          </div>
        </div>
      )}

      {/* FLOATING DRAGGED BENCH POKEMON GHOST PREVIEW (TOUCH & MOUSE - TRANSPARENT CLEAN BACKDROP) */}
      {draggingBenchPokemon && draggingBenchPokemon.isDragActive && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 rotate-2 scale-105 select-none flex flex-col items-center"
          style={{
            left: `${draggingBenchPokemon.currentX}px`,
            top: `${draggingBenchPokemon.currentY}px`,
            width: '124px'
          }}
        >
          <div className="w-full aspect-[600/825] p-[2px] bg-[#f5cb39] rounded-xl overflow-hidden shadow-[0_0_25px_rgba(250,204,21,0.95),0_10px_20px_rgba(0,0,0,0.35)] border border-[#c79808]">
            <div className="w-full h-full rounded-[6px] overflow-hidden bg-[#f5cb39] flex items-center justify-center">
              <img
                src={draggingBenchPokemon.inPlay.card.originalImageUrl || draggingBenchPokemon.inPlay.card.image || `/cards/${draggingBenchPokemon.inPlay.card.number}.jpg`}
                alt={draggingBenchPokemon.inPlay.card.name}
                draggable={false}
                className="w-full h-full object-fill pointer-events-none select-none rounded-[6px]"
              />
            </div>
          </div>
          <div className="text-center mt-1">
            <span className="bg-slate-950/90 text-yellow-300 font-bold text-[9px] px-2 py-0.5 rounded-full border border-yellow-500/60 shadow">
              {draggingBenchPokemon.inPlay.card.name} ({draggingBenchPokemon.inPlay.currentHp}/{draggingBenchPokemon.inPlay.card.hp} HP)
            </span>
          </div>
        </div>
      )}

      {/* BOTTOM DRAWER: PLAYER HAND */}
      <div className="mt-1.5 bg-slate-950/90 backdrop-blur-md border-2 border-yellow-500/40 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-2xl z-20 pb-[max(0.6rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-xs font-bold text-yellow-400 tracking-wider">
            {t.yourHand} ({player.hand.length} {t.cards})
          </span>
          <span className="text-xs text-gray-300 font-medium">
            {isInitialSetup
              ? showMulligan
                ? t.tipMulligan
                : t.tipSetup
              : isSelectReplacement
              ? t.tipKnockout
              : t.tipNormal}
          </span>
        </div>

        <div
          className="flex gap-3 overflow-x-auto pt-4 pb-2.5 px-2 touch-pan-x select-none items-end transition-transform duration-200"
          style={{ zoom: handScale }}
        >
          {groupedHand.map((group, gIdx) => {
            const isBasic = group.card.supertype === 'Pokemon' && group.card.subtype === 'Basic';
            const isGroupSelected = selectedHandIndex !== null && group.indices.includes(selectedHandIndex);
            const activeHandIdx = isGroupSelected && selectedHandIndex !== null ? selectedHandIndex : group.indices[0];
            const stackLayers = Math.min(group.count, 3);

            return (
              <div
                key={group.card.id ? `${group.card.id}-${gIdx}` : `${group.card.name}-${gIdx}`}
                className="flex-shrink-0 flex flex-col items-center group/cardstack relative"
              >
                <div
                  onPointerDown={(e) => handleCardPointerDown(e, group.card, activeHandIdx)}
                  className="touch-none cursor-grab active:cursor-grabbing relative transition-transform duration-200"
                  style={{
                    paddingRight: group.count > 1 ? `${(stackLayers - 1) * 5}px` : '0px',
                    paddingTop: group.count > 1 ? `${(stackLayers - 1) * 2.5}px` : '0px',
                  }}
                >
                  {/* Under-cards in the staggered deck stack (straight, clean parallel alignment) */}
                  {Array.from({ length: stackLayers - 1 }).map((_, layerIdx) => {
                    const depth = stackLayers - 1 - layerIdx; // 1, 2
                    const offsetX = depth * 5;
                    const offsetY = (stackLayers - 1 - depth) * 2.5;

                    return (
                      <div
                        key={depth}
                        className="absolute pointer-events-none transition-all duration-300 ease-out"
                        style={{
                          top: `${offsetY}px`,
                          left: `${offsetX}px`,
                          zIndex: depth,
                          opacity: Math.max(0.72, 0.92 - depth * 0.08),
                        }}
                      >
                        <CardView
                          card={group.card}
                          size="md"
                          isSelected={false}
                          onClick={() => {}}
                          onInspect={() => {}}
                        />
                      </div>
                    );
                  })}

                  {/* Top Interactive Card */}
                  <div
                    className="relative transition-transform duration-200"
                    style={{
                      zIndex: 10,
                      marginTop: `${(stackLayers - 1) * 2.5}px`,
                    }}
                  >
                    <CardView
                      card={group.card}
                      size="md"
                      isSelected={isGroupSelected}
                      onClick={() => {}}
                      onInspect={() => handleInspect(group.card)}
                    />
                  </div>

                  {/* Compact, Tight Golden Count Badge on outer top-right boundary (Elevated for zero clipping) */}
                  {group.count > 1 && (
                    <div
                      className="absolute -top-2 -right-1.5 bg-gradient-to-br from-amber-400 to-yellow-300 text-slate-950 font-black text-[10px] h-4.5 min-w-4.5 px-1.5 rounded-full border-2 border-slate-950 shadow-lg flex items-center justify-center gap-0.5 z-30 pointer-events-none transition-transform group-hover/cardstack:scale-110"
                      title={`${group.count} adet ${group.card.name}`}
                    >
                      <span className="text-[8px] font-bold opacity-75">×</span>
                      <span className="font-black leading-none">{group.count}</span>
                    </div>
                  )}
                </div>

                {isInitialSetup && isBasic && (
                  <button
                    onClick={() => handleSetStartingActive(activeHandIdx)}
                    className="mt-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-md shadow hover:shadow-lg transition z-20"
                  >
                    {t.setActiveShort}
                  </button>
                )}
              </div>
            );
          })}
          {player.hand.length === 0 && (
            <div className="text-center w-full py-4 text-xs text-gray-500">{t.noHandCards}</div>
          )}
        </div>
      </div>

                  {/* ENERGY RETRIEVAL MODAL */}
      {energyRetrievalModal && energyRetrievalModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-fade-in safe-area-padding">
          <div className="bg-slate-900 border-2 border-yellow-500/80 rounded-3xl p-4 sm:p-6 max-w-2xl w-full text-white shadow-2xl flex flex-col max-h-[90vh]">
            <div className="text-center mb-3">
              <h3 className="text-base sm:text-xl font-black text-yellow-400 flex items-center justify-center gap-2">
                <span>⚡</span> {energyRetrievalModal.card.name}
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                {lang === 'tr'
                  ? '1. Adım: Elinizden feda edilecek 1 kart seçin. 2. Adım: Iskarta yığınınızdan en fazla 2 Temel Enerji seçip elinize alın.'
                  : 'Step 1: Choose 1 card from hand to discard. Step 2: Choose up to 2 Basic Energy cards from discard pile.'}
              </p>
            </div>

            {/* Step 1: Discard 1 hand card */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5 px-1">
                <span className="text-amber-400">
                  {lang === 'tr' ? '1. Elinizden Feda Edilecek 1 Kartı Seçin:' : '1. Select 1 Card from Hand to Discard:'}
                </span>
                <span className="font-mono text-gray-400">
                  {energyRetrievalModal.selectedDiscardHandIndex !== null ? '1 / 1 ' + (lang === 'tr' ? 'seçildi' : 'selected') : '0 / 1'}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto p-1.5 bg-slate-950/70 rounded-xl border border-slate-800">
                {player.hand.map((hCard, hIdx) => {
                  if (hIdx === energyRetrievalModal.handIndex) return null;
                  const isSelected = energyRetrievalModal.selectedDiscardHandIndex === hIdx;
                  return (
                    <div
                      key={hIdx}
                      onClick={() => {
                        setEnergyRetrievalModal(prev => prev ? {
                          ...prev,
                          selectedDiscardHandIndex: prev.selectedDiscardHandIndex === hIdx ? null : hIdx
                        } : null);
                      }}
                      className={`flex-shrink-0 cursor-pointer transition-all rounded-xl p-1 relative ${
                        isSelected ? 'ring-4 ring-red-500 bg-red-950/40 scale-105 shadow-lg' : 'hover:scale-102 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="w-14 sm:w-16 aspect-[600/825] rounded-lg overflow-hidden shadow">
                        <img src={hCard.originalImageUrl || hCard.image || `/cards/${hCard.number}.jpg`} alt={hCard.name} className="w-full h-full object-fill pointer-events-none" />
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                          ✕
                        </div>
                      )}
                      <div className="text-[9px] font-bold text-center mt-1 truncate w-14 sm:w-16 text-gray-300">
                        {hCard.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Discard Pile Energy Picker */}
            <div className="flex-grow flex flex-col min-h-0 mb-4">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5 px-1">
                <span className="text-emerald-400">
                  {lang === 'tr' ? `2. Iskarta Yığınınızdan En Fazla ${energyRetrievalModal.maxRetrievalCount} Enerji Seçin:` : `2. Select up to ${energyRetrievalModal.maxRetrievalCount} Energy Cards from Discard Pile:`}
                </span>
                <span className="font-mono text-gray-400">
                  {energyRetrievalModal.selectedDiscardEnergyIndices.length} / {energyRetrievalModal.maxRetrievalCount} {lang === 'tr' ? 'seçildi' : 'selected'}
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 overflow-y-auto p-2 bg-slate-950/70 rounded-xl border border-slate-800 flex-grow max-h-48">
                {player.discard.map((dCard, dIdx) => {
                  if (dCard.supertype !== 'Energy') return null;
                  const isChosen = energyRetrievalModal.selectedDiscardEnergyIndices.includes(dIdx);
                  return (
                    <div
                      key={dIdx}
                      onClick={() => {
                        setEnergyRetrievalModal(prev => {
                          if (!prev) return null;
                          const current = [...prev.selectedDiscardEnergyIndices];
                          if (current.includes(dIdx)) {
                            return { ...prev, selectedDiscardEnergyIndices: current.filter(i => i !== dIdx) };
                          } else if (current.length < prev.maxRetrievalCount) {
                            return { ...prev, selectedDiscardEnergyIndices: [...current, dIdx] };
                          }
                          return prev;
                        });
                      }}
                      className={`cursor-pointer transition-all rounded-xl p-1 flex flex-col items-center relative ${
                        isChosen ? 'ring-4 ring-emerald-400 bg-emerald-950/60 scale-105 shadow-xl' : 'hover:scale-102 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="w-full aspect-[600/825] rounded-lg overflow-hidden shadow">
                        <img src={dCard.originalImageUrl || dCard.image || `/cards/${dCard.number}.jpg`} alt={dCard.name} className="w-full h-full object-fill pointer-events-none" />
                      </div>
                      {isChosen && (
                        <div className="absolute top-1 right-1 bg-emerald-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                          ✓
                        </div>
                      )}
                      <span className="text-[9px] font-bold text-center mt-0.5 truncate w-full text-gray-300">{dCard.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEnergyRetrievalModal(null)}
                className="bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 active:scale-95 transition"
              >
                {t.cancel}
              </button>
              <button
                disabled={energyRetrievalModal.selectedDiscardHandIndex === null || energyRetrievalModal.selectedDiscardEnergyIndices.length === 0}
                onClick={() => {
                  handleExecuteEnergyRetrieval(
                    energyRetrievalModal.handIndex,
                    energyRetrievalModal.selectedDiscardHandIndex!,
                    energyRetrievalModal.selectedDiscardEnergyIndices
                  );
                }}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5"
              >
                <span>⚡</span> {lang === 'tr' ? 'Enerjileri Kurtar & Ele Al' : 'Retrieve Energy Cards'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAINTENANCE MODAL */}
      {maintenanceModal && maintenanceModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-fade-in safe-area-padding">
          <div className="bg-slate-900 border-2 border-yellow-500/80 rounded-3xl p-4 sm:p-6 max-w-lg w-full text-white shadow-2xl flex flex-col max-h-[85vh]">
            <div className="text-center mb-3">
              <h3 className="text-base sm:text-xl font-black text-yellow-400 flex items-center justify-center gap-2">
                <span>🔄</span> Maintenance
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                {lang === 'tr'
                  ? 'Elinizden 2 kart seçip destenize karıştırın, ardından 1 kart çekin.'
                  : 'Select 2 cards from your hand to shuffle into your deck, then draw 1 card.'}
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5 px-1">
                <span className="text-amber-400">
                  {lang === 'tr' ? 'Desteye Karıştırılacak 2 Kart Seçin:' : 'Select 2 Hand Cards to Shuffle into Deck:'}
                </span>
                <span className="font-mono text-gray-400">
                  {maintenanceModal.selectedHandIndices.length} / 2 {lang === 'tr' ? 'seçildi' : 'selected'}
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 overflow-y-auto p-2 bg-slate-950/70 rounded-xl border border-slate-800 max-h-56">
                {player.hand.map((hCard, hIdx) => {
                  if (hIdx === maintenanceModal.handIndex) return null;
                  const isSelected = maintenanceModal.selectedHandIndices.includes(hIdx);
                  return (
                    <div
                      key={hIdx}
                      onClick={() => {
                        setMaintenanceModal(prev => {
                          if (!prev) return null;
                          const current = [...prev.selectedHandIndices];
                          if (current.includes(hIdx)) {
                            return { ...prev, selectedHandIndices: current.filter(i => i !== hIdx) };
                          } else if (current.length < 2) {
                            return { ...prev, selectedHandIndices: [...current, hIdx] };
                          }
                          return prev;
                        });
                      }}
                      className={`cursor-pointer transition-all rounded-xl p-1 flex flex-col items-center relative ${
                        isSelected ? 'ring-4 ring-amber-400 bg-amber-950/40 scale-105 shadow-lg' : 'hover:scale-102 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="w-full aspect-[600/825] rounded-lg overflow-hidden shadow">
                        <img src={hCard.originalImageUrl || hCard.image || `/cards/${hCard.number}.jpg`} alt={hCard.name} className="w-full h-full object-fill pointer-events-none" />
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-amber-400 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                          ✓
                        </div>
                      )}
                      <span className="text-[9px] font-bold text-center mt-1 truncate w-full text-gray-300">{hCard.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setMaintenanceModal(null)}
                className="bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 active:scale-95 transition"
              >
                {t.cancel}
              </button>
              <button
                disabled={maintenanceModal.selectedHandIndices.length !== 2}
                onClick={() => {
                  handleExecuteMaintenance(
                    maintenanceModal.handIndex,
                    maintenanceModal.selectedHandIndices
                  );
                }}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5"
              >
                <span>🔄</span> {lang === 'tr' ? 'Desteye Karıştır & 1 Kart Çek' : 'Shuffle 2 & Draw 1 Card'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ITEM FINDER MODAL */}
      {itemFinderModal && itemFinderModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-fade-in safe-area-padding">
          <div className="bg-slate-900 border-2 border-yellow-500/80 rounded-3xl p-4 sm:p-6 max-w-2xl w-full text-white shadow-2xl flex flex-col max-h-[90vh]">
            <div className="text-center mb-3">
              <h3 className="text-base sm:text-xl font-black text-yellow-400 flex items-center justify-center gap-2">
                <span>🔍</span> {lang === 'tr' ? 'Item Finder (Eşya Bulucu)' : 'Item Finder Discard Retrieval'}
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                {lang === 'tr'
                  ? '1. Adım: Elinizden 2 kart feda edin. 2. Adım: Iskarta yığınınızdan 1 Trainer kartı seçip elinize alın.'
                  : 'Step 1: Choose 2 cards to discard. Step 2: Choose 1 Trainer card from discard pile to put in hand.'}
              </p>
            </div>

            {/* Step 1: Discard 2 hand cards */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5 px-1">
                <span className="text-amber-400">
                  {lang === 'tr' ? '1. Elinizden 2 Kart Seçin (Atılacak):' : '1. Select 2 Hand Cards to Discard:'}
                </span>
                <span className="font-mono text-gray-400">
                  {itemFinderModal.selectedDiscardIndices.length} / 2 {lang === 'tr' ? 'seçildi' : 'selected'}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto p-1.5 bg-slate-950/70 rounded-xl border border-slate-800">
                {player.hand.map((hCard, hIdx) => {
                  if (hIdx === itemFinderModal.handIndex) return null;
                  const isSelected = itemFinderModal.selectedDiscardIndices.includes(hIdx);
                  return (
                    <div
                      key={hIdx}
                      onClick={() => {
                        setItemFinderModal(prev => {
                          if (!prev) return null;
                          const current = [...prev.selectedDiscardIndices];
                          if (current.includes(hIdx)) {
                            return { ...prev, selectedDiscardIndices: current.filter(i => i !== hIdx) };
                          } else if (current.length < 2) {
                            return { ...prev, selectedDiscardIndices: [...current, hIdx] };
                          }
                          return prev;
                        });
                      }}
                      className={`flex-shrink-0 cursor-pointer transition-all rounded-xl p-1 relative ${
                        isSelected ? 'ring-4 ring-red-500 bg-red-950/40 scale-105 shadow-lg' : 'hover:scale-102 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="w-14 sm:w-16 aspect-[600/825] rounded-lg overflow-hidden shadow">
                        <img src={hCard.originalImageUrl || hCard.image || `/cards/${hCard.number}.jpg`} alt={hCard.name} className="w-full h-full object-fill pointer-events-none" />
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                          ✕
                        </div>
                      )}
                      <div className="text-[9px] font-bold text-center mt-1 truncate w-14 sm:w-16 text-gray-300">
                        {hCard.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Discard Pile Trainer Picker */}
            <div className="flex-grow flex flex-col min-h-0 mb-4">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5 px-1">
                <span className="text-emerald-400">
                  {lang === 'tr' ? '2. Iskarta Yığınınızdan 1 Trainer Kartı Seçin:' : '2. Select 1 Trainer Card from Discard Pile:'}
                </span>
                <span className="font-mono text-gray-400">
                  {player.discard.filter(c => c.supertype === 'Trainer').length} {lang === 'tr' ? 'Trainer var' : 'Trainers available'}
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 overflow-y-auto p-2 bg-slate-950/70 rounded-xl border border-slate-800 flex-grow max-h-48">
                {player.discard.filter(c => c.supertype === 'Trainer').map((dCard, dIdx) => {
                  const isChosen = itemFinderModal.selectedDiscardTrainerIndex === dIdx;
                  return (
                    <div
                      key={dIdx}
                      onClick={() => setItemFinderModal(prev => prev ? { ...prev, selectedDiscardTrainerIndex: dIdx } : null)}
                      className={`cursor-pointer transition-all rounded-xl p-1 flex flex-col items-center relative ${
                        isChosen ? 'ring-4 ring-emerald-400 bg-emerald-950/60 scale-105 shadow-xl' : 'hover:scale-102 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="w-full aspect-[600/825] rounded-lg overflow-hidden shadow">
                        <img src={dCard.originalImageUrl || dCard.image || `/cards/${dCard.number}.jpg`} alt={dCard.name} className="w-full h-full object-fill pointer-events-none" />
                      </div>
                      {isChosen && (
                        <div className="absolute top-1 right-1 bg-emerald-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                          ✓
                        </div>
                      )}
                      <span className="text-[9px] font-bold text-center mt-0.5 truncate w-full text-gray-300">{dCard.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setItemFinderModal(null)}
                className="bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 active:scale-95 transition"
              >
                {t.cancel}
              </button>
              <button
                disabled={itemFinderModal.selectedDiscardIndices.length !== 2 || itemFinderModal.selectedDiscardTrainerIndex === null}
                onClick={() => {
                  handleExecuteItemFinder(
                    itemFinderModal.handIndex,
                    itemFinderModal.selectedDiscardIndices,
                    itemFinderModal.selectedDiscardTrainerIndex!
                  );
                }}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5"
              >
                <span>🔍</span> {lang === 'tr' ? 'Kurtarmayı Tamamla & Al' : 'Retrieve Trainer Card'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE DISCARD PILE VIEWER MODAL */}
      {viewDiscardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-fade-in safe-area-padding">
          <div className="bg-slate-900 border-2 border-yellow-500/80 rounded-3xl p-4 sm:p-6 max-w-2xl w-full text-white shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <h3 className="text-base sm:text-lg font-black text-yellow-400 flex items-center gap-2">
                <span>🗂️</span> {viewDiscardModal === 'player' ? (lang === 'tr' ? 'Iskarta Yığınınız (Discard Pile)' : 'Your Discard Pile') : (lang === 'tr' ? "Rakibin Iskarta Yığını (Discard Pile)" : "Opponent's Discard Pile")}
              </h3>
              <span className="text-xs font-mono text-gray-400">
                {(viewDiscardModal === 'player' ? player.discard : cpu.discard).length} {lang === 'tr' ? 'kart' : 'cards'}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 overflow-y-auto p-2 bg-slate-950/70 rounded-xl border border-slate-800 flex-grow">
              {(viewDiscardModal === 'player' ? player.discard : cpu.discard).map((card, idx) => (
                <div key={idx} className="flex flex-col items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-full aspect-[600/825] rounded-lg overflow-hidden shadow">
                    <img src={card.originalImageUrl || card.image || `/cards/${card.number}.jpg`} alt={card.name} className="w-full h-full object-fill pointer-events-none" />
                  </div>
                  <span className="text-[9px] font-bold text-center mt-1 truncate w-full text-gray-300">{card.name}</span>
                </div>
              ))}
              {(viewDiscardModal === 'player' ? player.discard : cpu.discard).length === 0 && (
                <div className="col-span-full py-12 text-center text-xs text-gray-500 italic">
                  {lang === 'tr' ? 'Iskarta yığınında henüz hiç kart yok.' : 'No cards in discard pile yet.'}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 mt-2 border-t border-slate-800">
              <button
                onClick={() => setViewDiscardModal(null)}
                className="bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold px-6 py-2 rounded-xl border border-slate-700 active:scale-95"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPUTER SEARCH INTERACTIVE DECK SEARCH MODAL */}
      {computerSearchModal && computerSearchModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-fade-in safe-area-padding">
          <div className="bg-slate-900 border-2 border-yellow-500/80 rounded-3xl p-4 sm:p-6 max-w-2xl w-full text-white shadow-2xl flex flex-col max-h-[90vh]">
            <div className="text-center mb-3">
              <h3 className="text-base sm:text-xl font-black text-yellow-400 flex items-center justify-center gap-2">
                <span>💻</span> {lang === 'tr' ? 'Computer Search (Bilgisayar Araması)' : 'Computer Search Deck Finder'}
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                {lang === 'tr'
                  ? '1. Adım: Elinizden feda edilecek 2 kart seçin. 2. Adım: Destenizden elinize almak istediğiniz 1 kartı seçin.'
                  : 'Step 1: Choose 2 cards from hand to discard. Step 2: Choose 1 card from your deck to put in hand.'}
              </p>
            </div>

            {/* Step 1: Discard 2 cards from hand */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5 px-1">
                <span className="text-amber-400">
                  {lang === 'tr' ? '1. Elinizden 2 Kart Seçin (Atılacak):' : '1. Select 2 Hand Cards to Discard:'}
                </span>
                <span className="font-mono text-gray-400">
                  {computerSearchModal.selectedDiscardIndices.length} / 2 {lang === 'tr' ? 'seçildi' : 'selected'}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto p-1.5 bg-slate-950/70 rounded-xl border border-slate-800">
                {player.hand.map((hCard, hIdx) => {
                  if (hIdx === computerSearchModal.handIndex) return null; // Skip Computer Search itself
                  const isSelectedForDiscard = computerSearchModal.selectedDiscardIndices.includes(hIdx);
                  return (
                    <div
                      key={hIdx}
                      onClick={() => {
                        setComputerSearchModal(prev => {
                          if (!prev) return null;
                          const current = [...prev.selectedDiscardIndices];
                          if (current.includes(hIdx)) {
                            return { ...prev, selectedDiscardIndices: current.filter(i => i !== hIdx) };
                          } else if (current.length < 2) {
                            return { ...prev, selectedDiscardIndices: [...current, hIdx] };
                          }
                          return prev;
                        });
                      }}
                      className={`flex-shrink-0 cursor-pointer transition-all rounded-xl p-1 relative ${
                        isSelectedForDiscard
                          ? 'ring-4 ring-red-500 bg-red-950/40 scale-105 shadow-lg'
                          : 'hover:scale-102 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="w-14 sm:w-16 aspect-[600/825] rounded-lg overflow-hidden shadow">
                        <img src={hCard.originalImageUrl || hCard.image || `/cards/${hCard.number}.jpg`} alt={hCard.name} className="w-full h-full object-fill pointer-events-none" />
                      </div>
                      {isSelectedForDiscard && (
                        <div className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                          ✕
                        </div>
                      )}
                      <div className="text-[9px] font-bold text-center mt-1 truncate w-14 sm:w-16 text-gray-300">
                        {hCard.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Browse and pick 1 card from deck */}
            <div className="flex-grow flex flex-col min-h-0 mb-4">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5 px-1">
                <span className="text-emerald-400">
                  {lang === 'tr' ? '2. Destenizden 1 Kart Seçin (Ele Alınacak):' : '2. Select 1 Card from Deck to Put in Hand:'}
                </span>
                <span className="font-mono text-gray-400">
                  {player.deck.length} {lang === 'tr' ? 'kart var' : 'cards in deck'}
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 overflow-y-auto p-2 bg-slate-950/70 rounded-xl border border-slate-800 flex-grow max-h-48">
                {player.deck.map((dCard, dIdx) => {
                  const isChosen = computerSearchModal.selectedDeckIndex === dIdx;
                  return (
                    <div
                      key={dIdx}
                      onClick={() => {
                        setComputerSearchModal(prev => prev ? { ...prev, selectedDeckIndex: dIdx } : null);
                      }}
                      className={`cursor-pointer transition-all rounded-xl p-1 flex flex-col items-center relative ${
                        isChosen
                          ? 'ring-4 ring-emerald-400 bg-emerald-950/60 scale-105 shadow-xl'
                          : 'hover:scale-102 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="w-full aspect-[600/825] rounded-lg overflow-hidden shadow">
                        <img src={dCard.originalImageUrl || dCard.image || `/cards/${dCard.number}.jpg`} alt={dCard.name} className="w-full h-full object-fill pointer-events-none" />
                      </div>
                      {isChosen && (
                        <div className="absolute top-1 right-1 bg-emerald-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                          ✓
                        </div>
                      )}
                      <span className="text-[9px] font-bold text-center mt-0.5 truncate w-full text-gray-300">
                        {dCard.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setComputerSearchModal(null)}
                className="bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 active:scale-95 transition"
              >
                {t.cancel}
              </button>
              <button
                disabled={computerSearchModal.selectedDiscardIndices.length !== 2 || computerSearchModal.selectedDeckIndex === null}
                onClick={() => {
                  handleExecuteComputerSearch(
                    computerSearchModal.handIndex,
                    computerSearchModal.selectedDiscardIndices,
                    computerSearchModal.selectedDeckIndex!
                  );
                }}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5"
              >
                <span>🔍</span> {lang === 'tr' ? 'Aramayı Tamamla & Kartı Al' : 'Confirm & Take Card'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POKEMON BREEDER EVOLUTION MODAL */}
      {breederModal && breederModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in safe-area-padding">
          <div className="bg-slate-900 border-2 border-yellow-500/80 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl flex flex-col items-center">
            <h3 className="text-base sm:text-lg font-black text-yellow-400 mb-1 text-center">
              {lang === 'tr' ? 'Pokémon Breeder: Evrim Seçimi' : 'Pokémon Breeder: Choose Evolution'}
            </h3>
            <p className="text-xs text-gray-300 mb-4 text-center">
              {lang === 'tr'
                ? 'Sahadaki Basic Pokémonu doğrudan elinizdeki Stage 2 Pokémona evrimleştirmek için bir çift seçin:'
                : 'Choose a Basic Pokémon on the field to evolve directly into a Stage 2 Pokémon from hand:'}
            </p>

            <div className="space-y-3 w-full mb-5 max-h-72 overflow-y-auto p-1">
              {breederModal.pairs.map((pair, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    handleExecuteBreederEvolution(
                      breederModal.breederHandIndex,
                      pair.stage2HandIndex,
                      pair.basicInPlay.instanceId
                    )
                  }
                  className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-2xl border-2 border-yellow-500/40 hover:border-yellow-400 flex items-center justify-between gap-3 transition active:scale-95 group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-12 aspect-[600/825] rounded overflow-hidden shadow">
                      <img src={pair.basicInPlay.card.originalImageUrl || pair.basicInPlay.card.image || `/cards/${pair.basicInPlay.card.number}.jpg`} alt={pair.basicInPlay.card.name} className="w-full h-full object-fill" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-yellow-300 group-hover:text-white">{pair.basicInPlay.card.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">({pair.isBench ? (lang === 'tr' ? 'Yedek' : 'Bench') : (lang === 'tr' ? 'Aktif' : 'Active')}) • {pair.basicInPlay.currentHp}/{pair.basicInPlay.card.hp} HP</div>
                    </div>
                  </div>

                  <div className="text-sm font-black text-yellow-400">➔</div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-300 group-hover:text-white">{pair.stage2Card.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">Stage 2 • {pair.stage2Card.hp} HP</div>
                    </div>
                    <div className="w-12 aspect-[600/825] rounded overflow-hidden shadow">
                      <img src={pair.stage2Card.originalImageUrl || pair.stage2Card.image || `/cards/${pair.stage2Card.number}.jpg`} alt={pair.stage2Card.name} className="w-full h-full object-fill" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setBreederModal(null)}
              className="bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold px-6 py-2 rounded-xl border border-slate-700 active:scale-95"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* TRAINER SWITCH & GUST OF WIND SELECTION MODAL */}
      {trainerSwitchModal && trainerSwitchModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in safe-area-padding">
          <div className="bg-slate-900 border-2 border-yellow-500/80 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl flex flex-col items-center">
            <h3 className="text-base sm:text-lg font-black text-yellow-400 mb-1 text-center">
              {trainerSwitchModal.isGustOfWind
                ? (lang === 'tr' ? 'Gust of Wind: Rakibin Sahaya Çekilecek Pokémonunu Seçin' : 'Gust of Wind: Choose Opponent Benched Pokémon to Drag Active')
                : (lang === 'tr' ? 'Switch: Sahaya Sürmek İstediğiniz Yedek Pokémonu Seçin' : 'Switch: Choose which Benched Pokémon to Swap In')}
            </h3>
            <p className="text-xs text-gray-300 mb-4 text-center">
              {trainerSwitchModal.isGustOfWind
                ? (lang === 'tr' ? 'Rakibin yedek kulübesindeki Pokémonlardan birini seçin:' : 'Select one of opponent benched Pokémon:')
                : (lang === 'tr' ? 'Yedek kulübenizden yeni Aktif konuma geçecek Pokémonu seçin:' : 'Select one of your benched Pokémon to become your new Active:')}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mb-5 max-h-60 overflow-y-auto p-1">
              {(trainerSwitchModal.isGustOfWind ? cpu.bench : player.bench).map((b, idx) => (
                <button
                  key={b.instanceId}
                  onClick={() => executeTrainerPlay(trainerSwitchModal.card, trainerSwitchModal.handIndex, idx)}
                  className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-2xl border-2 border-yellow-500/40 hover:border-yellow-400 flex flex-col items-center gap-1.5 transition active:scale-95 text-center group"
                >
                  <div className="w-16 aspect-[600/825] rounded-lg overflow-hidden shadow">
                    <img src={b.card.originalImageUrl || b.card.image || `/cards/${b.card.number}.jpg`} alt={b.card.name} className="w-full h-full object-fill" />
                  </div>
                  <span className="text-xs font-bold text-yellow-300 truncate w-full group-hover:text-white">{b.card.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400">{b.currentHp}/{b.card.hp} HP</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setTrainerSwitchModal(null)}
              className="bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold px-6 py-2 rounded-xl border border-slate-700 active:scale-95"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* STARE TARGET SELECTION (Dark Arbok - "Choose 1 of your opponent's Pokémon") */}
      {stareTargetModal && stareTargetModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 safe-area-padding animate-fade-in">
          <div className="bg-slate-900 border-2 border-fuchsia-500/80 rounded-3xl p-5 max-w-2xl w-full text-white shadow-2xl flex flex-col items-center">
            <h3 className="text-base sm:text-lg font-black text-fuchsia-300 mb-1 text-center">
              👁️ {lang === 'tr' ? 'Stare: Hedef Pokémonu Seçin' : 'Stare: Choose the Target Pokémon'}
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-300 mb-4 text-center max-w-xl leading-snug">
              {lang === 'tr'
                ? 'Rakibinin Aktif ya da Yedek Pokémonlarından birini seç: 10 hasar Zayıflık/Direnç hesaplanmadan o Pokémona uygulanır ve varsa özel yeteneği rakibin sonraki turu sona erene kadar devre dışı kalır.'
                : "Pick any opposing Active or Benched Pokémon: the 10 damage is dealt to that Pokémon without Weakness or Resistance, and its Pokémon Power (if any) stops working until the end of your opponent's next turn."}
            </p>

            {cpu.active && (
              <div className="w-full mb-3">
                <div className="text-[9px] font-black tracking-[0.2em] text-rose-300 mb-1.5">
                  {lang === 'tr' ? 'AKTİF POKÉMON' : 'ACTIVE POKÉMON'}
                </div>
                <div className="flex justify-center">{renderStareOption(cpu.active!, 0, false)}</div>
              </div>
            )}

            {cpu.bench.length > 0 && (
              <div className="w-full mb-4">
                <div className="text-[9px] font-black tracking-[0.2em] text-fuchsia-300 mb-1.5">
                  {lang === 'tr' ? 'YEDEK KULÜBE' : 'BENCH'}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 justify-items-center max-h-56 overflow-y-auto p-1">
                  {cpu.bench.map((b, i) => renderStareOption(b, i + 1, true))}
                </div>
              </div>
            )}

            <button
              onClick={abandonStareTarget}
              className="bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold px-6 py-2 rounded-xl border border-slate-700 active:scale-95"
            >
              {lang === 'tr' ? 'Seçmeden Saldır (Aktif)' : 'Attack the Active Pokémon Instead'}
            </button>
          </div>
        </div>
      )}

      {/* DECK SEARCH MODAL (Energy Search, Boss's Way, Poké Ball) */}
      {deckSearchModal && deckSearchModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in safe-area-padding">
          <div className="bg-slate-900 border-2 border-yellow-500/80 rounded-3xl p-6 max-w-xl w-full text-white shadow-2xl flex flex-col max-h-[85vh]">
            <h3 className="text-base sm:text-lg font-black text-yellow-400 mb-1 text-center">
              {deckSearchModal.title}
            </h3>
            <p className="text-xs text-gray-300 mb-4 text-center">
              {deckSearchModal.description}
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 overflow-y-auto p-2 bg-slate-950/70 rounded-2xl border border-slate-800 flex-grow max-h-72 mb-4">
              {deckSearchModal.cards.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => deckSearchModal.onSelect(item.originalDeckIndex)}
                  className="bg-slate-800 hover:bg-slate-700 p-2 rounded-2xl border-2 border-yellow-500/40 hover:border-yellow-400 flex flex-col items-center gap-1.5 transition active:scale-95 text-center group cursor-pointer"
                >
                  <div className="w-full aspect-[600/825] rounded-lg overflow-hidden shadow">
                    <img
                      src={item.card.originalImageUrl || item.card.image || `/cards/${item.card.number}.jpg`}
                      alt={item.card.name}
                      className="w-full h-full object-fill pointer-events-none"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-yellow-300 truncate w-full group-hover:text-white">
                    {item.card.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  const onCancel = deckSearchModal.onCancel;
                  setDeckSearchModal(null);
                  onCancel?.();
                }}
                className="bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold px-6 py-2 rounded-xl border border-slate-700 active:scale-95"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POKEMON POWER DISCARD MODAL (Matter Exchange) */}
      {powerDiscardModal && powerDiscardModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in safe-area-padding">
          <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl flex flex-col max-h-[85vh]">
            <h3 className="text-base sm:text-lg font-black text-amber-400 mb-1 text-center">
              {lang === 'tr' ? 'Matter Exchange: Feda Edilecek Kartı Seçin' : 'Matter Exchange: Choose Card to Discard'}
            </h3>
            <p className="text-xs text-gray-300 mb-4 text-center">
              {lang === 'tr'
                ? 'Destenizden 1 yeni kart çekmek için elinizden feda etmek istediğiniz kartı seçin:'
                : 'Select 1 card from your hand to discard in order to draw 1 card from your deck:'}
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto p-2 bg-slate-950/70 rounded-2xl border border-slate-800 flex-grow max-h-72 mb-4">
              {player.hand.map((hCard, idx) => (
                <button
                  key={idx}
                  onClick={() => executePowerActivation(powerDiscardModal.inPlay.instanceId, powerDiscardModal.powerName, { discardHandIndex: idx })}
                  className="bg-slate-800 hover:bg-slate-700 p-2 rounded-2xl border-2 border-red-500/40 hover:border-red-400 flex flex-col items-center gap-1.5 transition active:scale-95 text-center group cursor-pointer"
                >
                  <div className="w-full aspect-[600/825] rounded-lg overflow-hidden shadow">
                    <img
                      src={hCard.originalImageUrl || hCard.image || `/cards/${hCard.number}.jpg`}
                      alt={hCard.name}
                      className="w-full h-full object-fill pointer-events-none"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-gray-300 truncate w-full group-hover:text-white">
                    {hCard.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setPowerDiscardModal(null)}
                className="bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold px-6 py-2 rounded-xl border border-slate-700 active:scale-95"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CoinFlipModal
        isOpen={coinFlipData.isOpen}
        reason={coinFlipData.reason}
        count={coinFlipData.count}
        mode={coinFlipData.mode}
        onComplete={coinFlipData.onComplete}
        lang={lang}
      />

      {/* Amnesia target picker — reuses the card info modal with selectable attacks.
          forceSelection: the modal CANNOT be dismissed without picking an attack
          (no X button, no backdrop-click close), preventing the engine from
          silently defaulting to the first attack when the player just wanted out. */}
      {effectChoiceModal.isOpen && effectChoiceModal.mode === 'amnesia' && cpu.active && (
        <CardZoomModal
          card={cpu.active.card}
          inPlayCard={cpu.active}
          onClose={handleEffectChoiceCancel}
          onSelectAttack={(name) => handleEffectChoiceSelect(name)}
          attackSelectionPrompt={
            lang === 'tr'
              ? `Sonraki tur için ${cpu.active.card.name} üzerinde engellemek istediğiniz saldırıyı seçin`
              : `Choose which of ${cpu.active.card.name}'s attacks to shut down for the next turn`
          }
          forceSelection
          lang={lang}
        />
      )}

      {/* Metronome picker — reuses the card info modal with selectable attacks.
          forceSelection: the attack is already declared (energy paid) and MUST resolve,
          so the player has to pick which move to copy — no X button, no backdrop close,
          which stops the engine silently defaulting to the first attack. */}
      {effectChoiceModal.isOpen && effectChoiceModal.mode === 'metronome' && cpu.active && (
        <CardZoomModal
          card={cpu.active.card}
          inPlayCard={cpu.active}
          onClose={handleEffectChoiceCancel}
          onSelectAttack={(name) => handleEffectChoiceSelect(name)}
          attackSelectionPrompt={
            lang === 'tr'
              ? `🎵 Metronome: ${cpu.active.card.name} saldırılarından kopyalanacak olanı seçin`
              : `🎵 Metronome: Choose which of ${cpu.active.card.name}'s attacks to copy`
          }
          forceSelection
          lang={lang}
        />
      )}

      {/* Conversion type picker — reuses the card info modal with option buttons.
          forceSelection: the attack is already declared (energy paid) and MUST resolve,
          so the player has to pick the new type — no X button, no backdrop close,
          which stops the engine silently picking a random type. */}
      {effectChoiceModal.isOpen && effectChoiceModal.mode === 'conversion' && player.active && (
        <CardZoomModal
          card={player.active.card}
          inPlayCard={player.active}
          onClose={handleEffectChoiceCancel}
          onSelectOption={(value) => handleEffectChoiceSelect(value)}
          selectionOptions={effectChoiceModal.options.map(o => ({ label: o.label, value: o.value as string }))}
          optionSelectionPrompt={
            lang === 'tr'
              ? '🔮 Conversion: Yeni tipi seçin'
              : '🔮 Conversion: Choose the new type'
          }
          forceSelection
          lang={lang}
        />
      )}

      <CardZoomModal
        card={zoomedCard}
        inPlayCard={zoomedInPlay}
        onClose={() => {
          setZoomedCard(null);
          setZoomedInPlay(null);
        }}
        lang={lang}
      />

      <VictoryModal
        winner={state.winner}
        winReason={state.winReason}
        onRematch={onRematch}
        onMainMenu={onExitToMenu}
        lang={lang}
      />
    </div>
  );
};