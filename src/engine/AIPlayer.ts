import { GameState, Card, InPlayCard, Attack, AIDifficulty } from '../types/game';
import { GameEngine } from './GameEngine';

export interface AIStep {
  type: 'ATTACH_ENERGY' | 'BENCH' | 'EVOLVE' | 'RETREAT' | 'TRAINER' | 'ATTACK' | 'PASS';
  card?: Card;
  targetInstanceId?: string;
  attackIndex?: number;
  attack?: Attack;
  benchIndex?: number;
  description: string;
}

export class AIPlayer {
  static planTurn(state: GameState): AIStep[] {
    const difficulty: AIDifficulty = state.difficulty || 'medium';
    const steps: AIStep[] = [];
    const cpu = state.cpu;
    const player = state.player;

    if (!cpu.active || cpu.active.currentHp <= 0 || state.winner || state.phase === 'GAME_OVER') {
      steps.push({
        type: 'PASS',
        description: 'Opponent passed the turn.'
      });
      return steps;
    }

    // Simulated working copy of CPU state for accurate sequential planning
    let simulatedActive: InPlayCard = {
      ...cpu.active,
      attachedEnergy: [...cpu.active.attachedEnergy]
    };
    let simulatedBench: InPlayCard[] = cpu.bench.map(b => ({
      ...b,
      attachedEnergy: [...b.attachedEnergy]
    }));

    // 0. HARD / EXPERT AI: TACTICAL RETREAT EVALUATION (Prize Denial & Counter-Attacking)
    if ((difficulty === 'hard' || difficulty === 'expert') && state.turn > 2 && !cpu.hasRetreatedThisTurn && cpu.bench.length > 0) {
      if (GameEngine.canRetreat(simulatedActive, cpu.hasRetreatedThisTurn)) {
        const isLowHp = simulatedActive.currentHp <= 30 && simulatedActive.damage >= 30;
        const playerAttackerType = player.active?.card.types?.[0];
        const isWeakToPlayer = !!(playerAttackerType && simulatedActive.card.weakness?.type === playerAttackerType);

        if (isLowHp || isWeakToPlayer) {
          // Find best bench candidate who can retaliate or has higher HP
          let bestBenchIdx = -1;
          let bestBenchScore = -999;

          simulatedBench.forEach((b, idx) => {
            let score = b.currentHp;
            const benchType = b.card.types?.[0];
            if (player.active && benchType && player.active.card.weakness?.type === benchType) {
              score += 80; // Super effective counter!
            }
            if (b.card.attacks && b.card.attacks.some(atk => GameEngine.canPayAttackCost(b, atk))) {
              score += 50; // Ready to attack!
            }
            if (score > bestBenchScore) {
              bestBenchScore = score;
              bestBenchIdx = idx;
            }
          });

          if (bestBenchIdx !== -1 && bestBenchScore > simulatedActive.currentHp + 20) {
            const chosenBench = simulatedBench[bestBenchIdx];
            steps.push({
              type: 'RETREAT',
              benchIndex: bestBenchIdx,
              description: `🔄 Opponent strategically retreated ${simulatedActive.card.name} and sent out ${chosenBench.card.name}!`
            });

            // Simulate retreat locally:
            const retreatCost = simulatedActive.card.retreatCost || 0;
            let discarded = 0;
            while (discarded < retreatCost && simulatedActive.attachedEnergy.length > 0) {
              const removed = simulatedActive.attachedEnergy.pop()!;
              const isDce = removed.name.includes('Double Colorless') || removed.number === 96 || removed.number === 124;
              discarded += (isDce ? 2 : 1);
            }

            const oldActive = simulatedActive;
            simulatedActive = simulatedBench.splice(bestBenchIdx, 1)[0];
            simulatedBench.push(oldActive);
          }
        }
      }
    }

    // 1. Evolve (only if turn > 1 and turnsInPlay >= 1 - allows evolving multiple different Pokémon per turn)
    if (state.turn > 1) {
      const evolutionsInHand = cpu.hand
        .map((c, i) => ({ card: c, handIndex: i }))
        .filter(x => x.card.supertype === 'Pokemon' && x.card.evolvesFrom);

      const allCpuPokemon = [simulatedActive, ...simulatedBench].filter(p => p && p.turnsInPlay >= 1);
      const evolvedInstancesThisTurn = new Set<string>();

      for (const evo of evolutionsInHand) {
        const match = allCpuPokemon.find(p => p.card.name === evo.card.evolvesFrom && !evolvedInstancesThisTurn.has(p.instanceId));
        if (match) {
          steps.push({
            type: 'EVOLVE',
            card: evo.card,
            targetInstanceId: match.instanceId,
            description: `Opponent evolved ${match.card.name} into ${evo.card.name}!`
          });
          evolvedInstancesThisTurn.add(match.instanceId);
          match.card = evo.card;
          match.currentHp = Math.min(evo.card.hp || 50, match.currentHp + Math.max(0, (evo.card.hp || 50) - (match.card.hp || 50)));
        }
      }
    }

    // 2. Bench Basics (bench all eligible basics up to 5 bench limit, matching Player capabilities)
    const basicsInHand = cpu.hand
      .map((c, i) => ({ card: c, handIndex: i }))
      .filter(x => x.card.supertype === 'Pokemon' && x.card.subtype === 'Basic');

    for (const basic of basicsInHand) {
      if (simulatedBench.length >= 5) break;
      steps.push({
        type: 'BENCH',
        card: basic.card,
        description: `Opponent placed ${basic.card.name} on the bench.`
      });
      simulatedBench.push({
        instanceId: 'sim_bench_' + Math.random(),
        card: basic.card,
        currentHp: basic.card.hp || 50,
        damage: 0,
        attachedEnergy: [],
        status: 'None',
        turnsInPlay: 0,
        evolutionHistory: []
      });
    }

    // 3. Attach Energy (1 per turn with selective matching & deficit checking)
    if (!cpu.energyAttachedThisTurn) {
      const energiesInHand = cpu.hand
        .map((c, i) => ({ card: c, handIndex: i }))
        .filter(x => x.card.supertype === 'Energy');

      if (energiesInHand.length > 0) {
        const evolutionsInHand = cpu.hand.filter(c => c.supertype === 'Pokemon' && !!c.evolvesFrom);
        const playerActiveType = player.active?.card.types?.[0];

        // Evaluate all candidate pairs: (energyCard, pokemon)
        interface EnergyCandidate {
          energy: { card: Card; handIndex: number };
          target: InPlayCard;
          score: number;
        }

        const candidates: EnergyCandidate[] = [];
        const inPlayTargets: { pokemon: InPlayCard; isActive: boolean }[] = [
          { pokemon: simulatedActive, isActive: true },
          ...simulatedBench.map(b => ({ pokemon: b, isActive: false }))
        ];

        energiesInHand.forEach(energyItem => {
          inPlayTargets.forEach(t => {
            const isOpponentWeak = !!(playerActiveType && t.pokemon.card.weakness?.type === playerActiveType);
            const score = AIPlayer.evaluateEnergyAttachment(
              t.pokemon,
              energyItem.card,
              t.isActive,
              isOpponentWeak,
              evolutionsInHand
            );

            if (score > 0) {
              candidates.push({
                energy: energyItem,
                target: t.pokemon,
                score
              });
            }
          });
        });

        if (candidates.length > 0) {
          // Sort candidates by score descending
          candidates.sort((a, b) => b.score - a.score);

          let chosenCandidate: EnergyCandidate;
          if (difficulty === 'easy') {
            // Easy: chooses among top valid candidates with slight randomness
            const topSlice = candidates.slice(0, Math.min(3, candidates.length));
            chosenCandidate = topSlice[Math.floor(Math.random() * topSlice.length)];
          } else {
            // Medium, Hard, Expert: Pick the absolute optimal highest scoring energy & Pokemon pair
            chosenCandidate = candidates[0];
          }

          steps.push({
            type: 'ATTACH_ENERGY',
            card: chosenCandidate.energy.card,
            targetInstanceId: chosenCandidate.target.instanceId,
            description: `Opponent attached ${chosenCandidate.energy.card.name} to ${chosenCandidate.target.card.name}.`
          });
          chosenCandidate.target.attachedEnergy.push(chosenCandidate.energy.card);
        }
      }
    }

    // 4. Play Trainer Card (1 per turn)
    if (!cpu.trainerPlayedThisTurn) {
      if (difficulty === 'hard' || difficulty === 'expert') {
        // Hard/Expert Trainer Combinations:
        // A. Gust of Wind: If player has a low-HP or heavy-retreat benched Pokémon, drag it in!
        const gustIdx = cpu.hand.findIndex(c => c.name === 'Gust of Wind');
        if (gustIdx !== -1 && player.bench.length > 0) {
          let chosenBenchIdx = -1;
          player.bench.forEach((b, idx) => {
            if (b.currentHp <= 30 || ((b.card.retreatCost || 0) >= 2 && b.attachedEnergy.length === 0)) {
              chosenBenchIdx = idx;
            }
          });
          if (chosenBenchIdx !== -1) {
            steps.push({
              type: 'TRAINER',
              card: cpu.hand[gustIdx],
              benchIndex: chosenBenchIdx,
              description: `💨 Opponent used Gust of Wind and dragged in ${player.bench[chosenBenchIdx].card.name}!`
            });
          }
        }

        // B. Energy Removal / Super Energy Removal: If player active has energy attached, strip it!
        if (steps.filter(s => s.type === 'TRAINER').length === 0) {
          const erIdx = cpu.hand.findIndex(c => c.name === 'Energy Removal' || c.name === 'Super Energy Removal');
          const erCard = erIdx !== -1 ? cpu.hand[erIdx] : null;
          // Super Energy Removal additionally costs 1 Energy from the AI's own Active Pokémon,
          // and the engine refuses (and wastes) the card without it.
          const canPaySuper = erCard?.name !== 'Super Energy Removal' || !!(cpu.active && cpu.active.attachedEnergy.length > 0);
          if (erCard && canPaySuper && player.active && player.active.attachedEnergy.length > 0) {
            steps.push({
              type: 'TRAINER',
              card: erCard,
              description: `⚡ Opponent played ${erCard.name} to remove your Energy!`
            });
          }
        }

        // C. PlusPower / Defender:
        if (steps.filter(s => s.type === 'TRAINER').length === 0) {
          const ppIdx = cpu.hand.findIndex(c => c.name === 'PlusPower');
          if (ppIdx !== -1 && simulatedActive.card.attacks && simulatedActive.card.attacks.some(a => GameEngine.canPayAttackCost(simulatedActive, a) && GameEngine.canUseAttack(simulatedActive, a, state.turn))) {
            steps.push({
              type: 'TRAINER',
              card: cpu.hand[ppIdx],
              targetInstanceId: simulatedActive.instanceId,
              description: `💥 Opponent used PlusPower on ${simulatedActive.card.name} (+10 damage)!`
            });
          }
        }

        // D. Professor Oak (if low cards in hand):
        if (steps.filter(s => s.type === 'TRAINER').length === 0) {
          const oakIdx = cpu.hand.findIndex(c => c.name === 'Professor Oak');
          if (oakIdx !== -1 && cpu.hand.length <= 3 && cpu.deck.length >= 7) {
            steps.push({
              type: 'TRAINER',
              card: cpu.hand[oakIdx],
              description: `📖 Opponent played Professor Oak to draw 7 fresh cards!`
            });
          }
        }

        // E. Switch (if active is Asleep/Paralyzed or low HP and viable bench exists):
        if (steps.filter(s => s.type === 'TRAINER').length === 0) {
          const switchIdx = cpu.hand.findIndex(c => c.name === 'Switch');
          if (switchIdx !== -1 && simulatedBench.length > 0) {
            const isStuck = simulatedActive.status === 'Asleep' || simulatedActive.status === 'Paralyzed';
            const isLowHp = simulatedActive.currentHp <= 30 && simulatedActive.damage >= 30;
            if (isStuck || isLowHp) {
              let bestBenchIdx = 0;
              let bestScore = -999;
              simulatedBench.forEach((b, idx) => {
                let score = b.currentHp;
                if (b.card.attacks?.some(a => GameEngine.canPayAttackCost(b, a))) score += 50;
                if (score > bestScore) {
                  bestScore = score;
                  bestBenchIdx = idx;
                }
              });
              steps.push({
                type: 'TRAINER',
                card: cpu.hand[switchIdx],
                benchIndex: bestBenchIdx,
                description: `🔄 Opponent played Switch, sending out ${simulatedBench[bestBenchIdx].card.name}!`
              });
              const oldActive = simulatedActive;
              oldActive.status = 'None';
              oldActive.poisonType = undefined;
              simulatedActive = simulatedBench.splice(bestBenchIdx, 1)[0];
              simulatedBench.push(oldActive);
            }
          }
        }
      }

      // Default healing / draw Trainers (Potion, Bill, Full Heal, Energy Search, Gambler)
      if (steps.filter(s => s.type === 'TRAINER').length === 0) {
        const potionIdx = cpu.hand.findIndex(c => c.name === 'Potion');
        if (potionIdx !== -1 && simulatedActive.damage >= 20) {
          steps.push({
            type: 'TRAINER',
            card: cpu.hand[potionIdx],
            targetInstanceId: simulatedActive.instanceId,
            description: `Opponent used Potion on ${simulatedActive.card.name} (+20 HP)!`
          });
        } else {
          const fullHealIdx = cpu.hand.findIndex(c => c.name === 'Full Heal');
          if (fullHealIdx !== -1 && (simulatedActive.status !== 'None' || simulatedActive.poisonType !== undefined)) {
            steps.push({
              type: 'TRAINER',
              card: cpu.hand[fullHealIdx],
              description: `✨ Opponent used Full Heal to cure ${simulatedActive.card.name}!`
            });
          } else {
            const billIdx = cpu.hand.findIndex(c => c.name === 'Bill');
            if (billIdx !== -1) {
              steps.push({
                type: 'TRAINER',
                card: cpu.hand[billIdx],
                description: `Opponent played Bill and drew 2 cards.`
              });
            } else {
              const searchIdx = cpu.hand.findIndex(c => c.name === 'Energy Search');
              if (searchIdx !== -1) {
                steps.push({
                  type: 'TRAINER',
                  card: cpu.hand[searchIdx],
                  description: `⚡ Opponent played Energy Search!`
                });
              }
            }
          }
        }
      }
    }

    // 5. Intelligent Tactical Attack Evaluation
    if (simulatedActive.card.attacks && simulatedActive.status !== 'Paralyzed' && simulatedActive.status !== 'Asleep') {
      let chosenAttackIdx = -1;
      let highestScore = -999;
      // A blocked move has to be scored out of the run entirely. Picking one anyway makes the
      // opponent sit through a coin flip and the full move animation before the engine drops it,
      // which looks exactly like "Tail Wag / Amnesia did nothing".
      let blockedAttackNames: string[] = [];

      simulatedActive.card.attacks.forEach((atk, idx) => {
        if (!GameEngine.canPayAttackCost(simulatedActive, atk)) return;
        if (GameEngine.getAttackBlockReason(simulatedActive, atk, state.turn)) {
          blockedAttackNames.push(atk.name);
          return;
        }
        const atkName = atk.name.toLowerCase();
        let baseDmg = atk.damage || 0;
        if (atkName === 'stretch kick') baseDmg = 20;
        else if (atkName === 'flitter') baseDmg = 20;
        else if (atkName === 'dig under') baseDmg = 10;
        else if (atkName === 'coin hurl') baseDmg = 20;
        else if (atkName === 'super fang' && player.active) {
          baseDmg = Math.ceil(player.active.currentHp / 20) * 10;
        }
        let score = baseDmg;

        // Weakness bonus
        const attackerType = simulatedActive.card.types?.[0];
        if (player.active && player.active.card.weakness?.type === attackerType) {
          score *= 2;
        }

        // Knockout priority (HUGE score multiplier)
        if (player.active && score >= player.active.currentHp && player.active.currentHp > 0) {
          score += (difficulty === 'expert' ? 300 : 200);
        }

        // Tactical value for special moves
        if (atkName === 'lure' && player.bench.length > 0) {
          const hasWeakTarget = player.bench.some(b => b.card.weakness?.type === 'Fire' || b.currentHp <= 40);
          score = hasWeakTarget ? 65 : 30;
        } else if (atkName === 'recover' && simulatedActive.damage >= 40) {
          score = 75;
        } else if (atkName === 'hypnosis' || atkName === 'sleep powder' || atkName === 'sleeping gas') {
          if (player.active && player.active.status === 'None') score = (difficulty === 'expert' ? 60 : 45);
        } else if (atkName === 'thunder wave' || atkName === 'thundershock' || atkName === 'bubble') {
          if (player.active && player.active.status === 'None') score += 35;
        } else if (atkName === 'withdraw' || atkName === 'stiffen') {
          if (simulatedActive.currentHp <= 30) score = 40;
        } else if (atkName === 'call for family' || atkName === 'call for friend' || atkName === 'sprout') {
          if (simulatedBench.length < 3) score = 55;
        } else if (atkName === 'fetch' || atkName === 'dizziness') {
          score = 35;
        } else if (atkName === 'headache') {
          score = 45;
        } else if (atkName === 'rapid evolution') {
          score = 95;
        }

        if (score > highestScore) {
          highestScore = score;
          chosenAttackIdx = idx;
        }
      });

      if (chosenAttackIdx !== -1) {
        const attack = simulatedActive.card.attacks[chosenAttackIdx];
        steps.push({
          type: 'ATTACK',
          attackIndex: chosenAttackIdx,
          attack,
          description: `⚔️ Opponent's ${simulatedActive.card.name} is using ${attack.name}!`
        });
        return steps;
      }

      // Every payable move is switched off by Tail Wag / Leer / Amnesia. Passing is the only legal
      // play, and saying so keeps the block visible instead of the AI just quietly ending its turn.
      if (blockedAttackNames.length > 0) {
        steps.push({
          type: 'PASS',
          description: `🚫 Opponent's ${simulatedActive.card.name} cannot attack — ${blockedAttackNames.join(' / ')} blocked by ${simulatedActive.attackBlockMoveName || 'your move'}.`
        });
        return steps;
      }
    }

    // Pass
    steps.push({
      type: 'PASS',
      description: 'Opponent passed the turn.'
    });

    return steps;
  }

  /**
   * Evaluates how useful a specific energy card is for a candidate Pokémon.
   * Returns a score > 0 if the energy is usable, or <= 0 if irrelevant / over-attached.
   */
  static evaluateEnergyAttachment(
    pokemon: InPlayCard,
    energyCard: Card,
    isTargetActive: boolean,
    isOpponentWeakToPokemon: boolean,
    evolutionsInHand: Card[]
  ): number {
    const energyType = energyCard.types?.[0] || (energyCard.name.includes('Double Colorless') ? 'Colorless' : energyCard.name.replace(' Energy', ''));
    const isDoubleColorless = energyCard.name.includes('Double Colorless');

    // Check all attacks of the current Pokémon and any potential evolution in hand
    const attacksToCheck: Attack[] = [...(pokemon.card.attacks || [])];
    
    // Also look at potential evolutions
    const matchingEvo = evolutionsInHand.find(e => e.evolvesFrom === pokemon.card.name);
    if (matchingEvo && matchingEvo.attacks) {
      attacksToCheck.push(...matchingEvo.attacks);
    }

    if (attacksToCheck.length === 0) return -999;

    // Determine current attached energy breakdown
    const attachedEnergyCounts: Record<string, number> = {};
    pokemon.attachedEnergy.forEach(e => {
      const eType = e.types?.[0] || (e.name.includes('Double Colorless') ? 'Colorless' : e.name.replace(' Energy', ''));
      const val = e.name.includes('Double Colorless') ? 2 : 1;
      attachedEnergyCounts[eType] = (attachedEnergyCounts[eType] || 0) + val;
    });

    let bestAttackBenefitScore = -999;

    attacksToCheck.forEach(attack => {
      const costCounts: Record<string, number> = {};
      let colorlessCostCount = 0;

      (attack.cost || []).forEach(c => {
        if (c === 'Colorless') {
          colorlessCostCount += 1;
        } else {
          costCounts[c] = (costCounts[c] || 0) + 1;
        }
      });

      // Calculate how many colored energies are still missing
      let coloredMissing = 0;
      let neededThisEnergyType = false;

      Object.keys(costCounts).forEach(cType => {
        const needed = costCounts[cType];
        const have = attachedEnergyCounts[cType] || 0;
        if (have < needed) {
          coloredMissing += (needed - have);
          if (cType.toLowerCase() === energyType.toLowerCase()) {
            neededThisEnergyType = true;
          }
        }
      });

      // Calculate surplus colored energy that can count as colorless
      let surplusForColorless = 0;
      Object.keys(attachedEnergyCounts).forEach(cType => {
        const have = attachedEnergyCounts[cType];
        const needed = costCounts[cType] || 0;
        if (have > needed) {
          surplusForColorless += (have - needed);
        }
      });
      // Double colorless count
      surplusForColorless += (attachedEnergyCounts['Colorless'] || 0);

      const colorlessMissing = Math.max(0, colorlessCostCount - surplusForColorless);
      const totalMissingBefore = coloredMissing + colorlessMissing;

      // If attack is ALREADY fully payable, zero additional benefit for this attack
      if (totalMissingBefore === 0) {
        return;
      }

      // Check if attaching this energy reduces the deficit
      let benefitScore = 0;

      if (neededThisEnergyType) {
        // Direct colored requirement match!
        benefitScore += 120;
      } else if (colorlessMissing > 0) {
        // Can act as colorless filler
        benefitScore += isDoubleColorless ? (colorlessMissing >= 2 ? 140 : 80) : 60;
      } else {
        // Completely useless for this attack!
        return;
      }

      const totalMissingAfter = Math.max(0, totalMissingBefore - (isDoubleColorless ? 2 : 1));

      // Massive bonus if this attachment makes the attack READY TO USE RIGHT NOW!
      if (totalMissingAfter === 0) {
        let attackDmg = attack.damage || 0;
        const aname = attack.name.toLowerCase();
        if (aname === 'stretch kick' || aname === 'flitter' || aname === 'coin hurl') attackDmg = 20;
        else if (aname === 'dig under') attackDmg = 10;
        else if (aname === 'super fang') attackDmg = 30;
        benefitScore += isTargetActive ? (300 + attackDmg * 2) : (150 + attackDmg);
      } else if (totalMissingAfter === 1) {
        // 1 energy away from ready!
        benefitScore += isTargetActive ? 180 : 100;
      } else {
        benefitScore += 40;
      }

      if (benefitScore > bestAttackBenefitScore) {
        bestAttackBenefitScore = benefitScore;
      }
    });

    if (bestAttackBenefitScore <= 0) {
      return -999; // Irrelevant or over-attached!
    }

    // Role and strategic modifiers:
    let finalScore = bestAttackBenefitScore;

    if (isTargetActive) {
      finalScore += 60; // Active battling priority
    } else {
      if (isOpponentWeakToPokemon) {
        finalScore += 80; // Super effective bench counter!
      }
      if (pokemon.card.subtype === 'Stage 1' || pokemon.card.subtype === 'Stage 2') {
        finalScore += 50; // Evolved heavy hitter on bench
      }
    }

    return finalScore;
  }
}
