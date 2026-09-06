import { GameState, Card, PlayerState, InPlayCard } from '../types/game';

export interface TrainerResult {
  state: GameState;
  success: boolean;
  message: string;
  requiresSelection?: {
    type: 'BENCH_POKEMON' | 'OPPONENT_BENCH' | 'ENERGY_TO_DISCARD' | 'CARD_FROM_HAND' | 'TRAINER_FROM_DISCARD' | 'DECK_SEARCH';
    sourceCard: Card;
    min: number;
    max: number;
    actionId: string;
  };
}

export function resolveTrainer(
  state: GameState,
  player: PlayerState,
  opponent: PlayerState,
  card: Card,
  params?: any
): TrainerResult {
  const cardNum = card.number;

  switch (cardNum) {
    // #88: Professor Oak - Discard hand, draw 7
    case 88: {
      player.discard.push(...player.hand);
      player.hand = [];
      const drawn: Card[] = [];
      for (let i = 0; i < 7 && player.deck.length > 0; i++) {
        drawn.push(player.deck.shift()!);
      }
      player.hand.push(...drawn);
      return {
        state,
        success: true,
        message: `${player.name} played Professor Oak, discarding hand and drawing 7 cards!`
      };
    }

    // #91: Bill - Draw 2 cards
    case 91: {
      const drawn: Card[] = [];
      for (let i = 0; i < 2 && player.deck.length > 0; i++) {
        drawn.push(player.deck.shift()!);
      }
      player.hand.push(...drawn);
      return {
        state,
        success: true,
        message: `${player.name} played Bill and drew 2 cards.`
      };
    }

    // #94: Potion - Remove up to 20 damage from 1 Pokemon
    case 94: {
      const target: InPlayCard | null = params?.targetPokemon || player.active;
      if (!target) return { state, success: false, message: 'No target Pokémon for Potion.' };
      const healed = Math.min(20, target.damage);
      target.damage -= healed;
      target.currentHp = Math.min(target.card.hp || 0, target.currentHp + healed);
      return {
        state,
        success: true,
        message: `${player.name} used Potion on ${target.card.name}, healing ${healed} HP!`
      };
    }

    // #90: Super Potion - Discard 1 Energy attached, heal 40 damage
    case 90: {
      const target: InPlayCard | null = params?.targetPokemon || player.active;
      if (!target) return { state, success: false, message: 'No target for Super Potion.' };
      if (target.attachedEnergy.length === 0) {
        return { state, success: false, message: 'Super Potion requires 1 attached Energy to discard.' };
      }
      const discardedEnergy = target.attachedEnergy.pop()!;
      player.discard.push(discardedEnergy);
      const healed = Math.min(40, target.damage);
      target.damage -= healed;
      target.currentHp = Math.min(target.card.hp || 0, target.currentHp + healed);
      return {
        state,
        success: true,
        message: `${player.name} used Super Potion on ${target.card.name}, discarding ${discardedEnergy.name} and healing ${healed} HP!`
      };
    }

    // #95: Switch - Switch active Pokemon with bench
    case 95: {
      if (player.bench.length === 0) {
        return { state, success: false, message: 'No benched Pokémon to switch with.' };
      }
      const benchIndex = params?.benchIndex ?? 0;
      if (benchIndex < 0 || benchIndex >= player.bench.length) {
        return { state, success: false, message: 'Invalid bench target.' };
      }
      const oldActive = player.active;
      if (oldActive) {
        oldActive.status = 'None'; // Switching clears status
        oldActive.poisonType = undefined;
        const newActive = player.bench.splice(benchIndex, 1)[0];
        player.bench.push(oldActive);
        player.active = newActive;
        return {
          state,
          success: true,
          message: `${player.name} played Switch, bringing out ${newActive.card.name}!`
        };
      }
      return { state, success: false, message: 'No active Pokémon.' };
    }

    // #93: Gust of Wind - Switch opponent active with opponent bench
    case 93: {
      if (opponent.bench.length === 0) {
        return { state, success: false, message: "Opponent has no benched Pokémon to Gust." };
      }
      const oppBenchIndex = params?.oppBenchIndex ?? 0;
      const oldOppActive = opponent.active;
      if (oldOppActive) {
        oldOppActive.status = 'None';
        oldOppActive.poisonType = undefined;
        const newOppActive = opponent.bench.splice(oppBenchIndex, 1)[0];
        opponent.bench.push(oldOppActive);
        opponent.active = newOppActive;
        return {
          state,
          success: true,
          message: `${player.name} played Gust of Wind, forcing out opponent's ${newOppActive.card.name}!`
        };
      }
      return { state, success: false, message: "Opponent has no active Pokémon." };
    }

    // #92: Energy Removal - Discard 1 Energy attached to opponent's Pokemon
    case 92: {
      const oppTarget: InPlayCard | null = params?.oppPokemon || opponent.active;
      if (!oppTarget || oppTarget.attachedEnergy.length === 0) {
        return { state, success: false, message: "Target opponent Pokémon has no attached Energy." };
      }
      const removed = oppTarget.attachedEnergy.pop()!;
      opponent.discard.push(removed);
      return {
        state,
        success: true,
        message: `${player.name} used Energy Removal to discard ${removed.name} from opponent's ${oppTarget.card.name}!`
      };
    }

    // #79: Super Energy Removal - Discard 1 of your own energy, discard up to 2 of opponent's energy
    case 79: {
      if (!player.active || player.active.attachedEnergy.length === 0) {
        return { state, success: false, message: "You must have at least 1 energy attached to your active Pokémon." };
      }
      if (!opponent.active || opponent.active.attachedEnergy.length === 0) {
        return { state, success: false, message: "Opponent must have energy attached." };
      }
      const myDiscard = player.active.attachedEnergy.pop()!;
      player.discard.push(myDiscard);
      const oppDiscard1 = opponent.active.attachedEnergy.pop()!;
      opponent.discard.push(oppDiscard1);
      if (opponent.active.attachedEnergy.length > 0) {
        const oppDiscard2 = opponent.active.attachedEnergy.pop()!;
        opponent.discard.push(oppDiscard2);
      }
      return {
        state,
        success: true,
        message: `${player.name} played Super Energy Removal, discarding ${myDiscard.name} to strip opponent's energy!`
      };
    }

    // #84: PlusPower - Attach to active, +10 damage this turn
    case 84: {
      if (!player.active) return { state, success: false, message: 'No active Pokémon.' };
      player.active.plusPowersAttached = (player.active.plusPowersAttached || 0) + 1;
      return {
        state,
        success: true,
        message: `${player.name} attached PlusPower to ${player.active.card.name} (+10 attack damage this turn)!`
      };
    }

    // #80: Defender - Attach to active, -20 damage taken during opponent's next turn
    case 80: {
      if (!player.active) return { state, success: false, message: 'No active Pokémon.' };
      player.active.defendersAttached = (player.active.defendersAttached || 0) + 1;
      return {
        state,
        success: true,
        message: `${player.name} attached Defender to ${player.active.card.name} (-20 damage taken next turn)!`
      };
    }

    // #82: Full Heal - Clear all status conditions
    case 82: {
      if (!player.active) return { state, success: false, message: 'No active Pokémon.' };
      player.active.status = 'None';
      player.active.poisonType = undefined;
      player.active.toxicCounter = 0;
      return {
        state,
        success: true,
        message: `${player.name} played Full Heal! ${player.active.card.name} is cured of all status conditions.`
      };
    }

    // #78: Scoop Up - Return 1 Pokemon to hand, discard all attached cards
    case 78: {
      const target: InPlayCard | null = params?.targetPokemon || player.active;
      if (!target) return { state, success: false, message: 'No target for Scoop Up.' };
      // Discard attached energy & evolution cards except base
      player.discard.push(...target.attachedEnergy);
      if (target.evolutionHistory.length > 1) {
        const evos = target.evolutionHistory.slice(1);
        player.discard.push(...evos);
      }
      player.hand.push(target.evolutionHistory[0] || target.card);

      if (target === player.active) {
        if (player.bench.length > 0) {
          player.active = player.bench.shift()!;
        } else {
          player.active = null;
        }
      } else {
        player.bench = player.bench.filter(p => p.instanceId !== target.instanceId);
      }
      return {
        state,
        success: true,
        message: `${player.name} used Scoop Up on ${target.card.name}, returning it to hand!`
      };
    }

    // #71: Computer Search - Discard 2, search deck for 1 card
    case 71: {
      if (player.hand.length < 2) {
        return { state, success: false, message: 'Computer Search requires discarding 2 other cards from hand.' };
      }
      // Simple automated pick or first card from deck if AI / default
      const discards = params?.discardCards || player.hand.slice(0, 2);
      player.hand = player.hand.filter(c => !discards.includes(c));
      player.discard.push(...discards);
      if (player.deck.length > 0) {
        const found = params?.chosenCard || player.deck.find(c => c.supertype === 'Pokemon' || c.name === 'Professor Oak') || player.deck[0];
        player.deck = player.deck.filter(c => c !== found);
        player.hand.push(found);
        return {
          state,
          success: true,
          message: `${player.name} played Computer Search, finding ${found.name} from deck!`
        };
      }
      return { state, success: false, message: 'Deck is empty.' };
    }

    // #74: Item Finder - Discard 2, take 1 Trainer from discard
    case 74: {
      if (player.hand.length < 2) {
        return { state, success: false, message: 'Item Finder requires discarding 2 cards.' };
      }
      const trainersInDiscard = player.discard.filter(c => c.supertype === 'Trainer' && c.number !== 74);
      if (trainersInDiscard.length === 0) {
        return { state, success: false, message: 'No other Trainer cards in discard pile.' };
      }
      const discards = params?.discardCards || player.hand.slice(0, 2);
      player.hand = player.hand.filter(c => !discards.includes(c));
      player.discard.push(...discards);
      const chosen = params?.chosenTrainer || trainersInDiscard[trainersInDiscard.length - 1];
      player.discard = player.discard.filter(c => c !== chosen);
      player.hand.push(chosen);
      return {
        state,
        success: true,
        message: `${player.name} played Item Finder, retrieving ${chosen.name} from discard!`
      };
    }

    // #81: Energy Retrieval - Trade 1 card from hand for up to 2 basic energy from discard
    case 81: {
      const basicEnergies = player.discard.filter(c => c.supertype === 'Energy' && c.subtype === 'Basic Energy');
      if (basicEnergies.length === 0) {
        return { state, success: false, message: 'No basic energy in discard pile.' };
      }
      const count = Math.min(2, basicEnergies.length);
      const retrieved = basicEnergies.slice(0, count);
      retrieved.forEach(e => {
        player.discard = player.discard.filter(c => c !== e);
        player.hand.push(e);
      });
      return {
        state,
        success: true,
        message: `${player.name} played Energy Retrieval, recovering ${count} energy cards from discard!`
      };
    }

    // #73: Imposter Professor Oak - Opponent shuffles hand into deck, draws 7
    case 73: {
      opponent.deck.push(...opponent.hand);
      opponent.hand = [];
      // shuffle deck
      opponent.deck.sort(() => Math.random() - 0.5);
      const drawn: Card[] = [];
      for (let i = 0; i < 7 && opponent.deck.length > 0; i++) {
        drawn.push(opponent.deck.shift()!);
      }
      opponent.hand.push(...drawn);
      return {
        state,
        success: true,
        message: `${player.name} played Imposter Professor Oak! ${opponent.name} shuffled hand into deck and drew 7 cards.`
      };
    }

    // Default trainer
    default: {
      return {
        state,
        success: true,
        message: `${player.name} played ${card.name}.`
      };
    }
  }
}
