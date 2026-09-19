import { Language, TRANSLATIONS, translateLog } from '../i18n/translations';
import React, { useState, useEffect } from 'react';
import { sounds } from './SoundManager';
import { Sparkles } from 'lucide-react';

interface CoinFlipModalProps {
  isOpen: boolean;
  reason: string;
  count?: number;
  mode?: 'fixed' | 'until_tails';
  /** Pre-determined results to replay (remote multiplayer coin flip display) */
  presetResults?: boolean[];
  onComplete: (results: boolean[]) => void;
  lang?: Language;
}

export const CoinFlipModal: React.FC<CoinFlipModalProps> = ({
  isOpen,
  reason,
  count = 1,
  mode = 'fixed',
  presetResults,
  onComplete,
  lang = 'tr'
}) => {
  const t = TRANSLATIONS[lang];
  const [phase, setPhase] = useState<'idle' | 'tossing' | 'spinning' | 'landed'>('idle');
  const [currentFlipIdx, setCurrentFlipIdx] = useState(0);
  const [flipResults, setFlipResults] = useState<boolean[]>([]);
  const [rotationX, setRotationX] = useState(0);

  // Pre-warm coin images in memory
  useEffect(() => {
    ['/assets/coin_heads.png', '/assets/coin_tails.png', '/assets/coin_heads.svg', '/assets/coin_tails.svg'].forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const completedRef = React.useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setPhase('idle');
      setCurrentFlipIdx(0);
      setFlipResults([]);
      setRotationX(0);
      completedRef.current = false;
      return;
    }

    completedRef.current = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let isCancelled = false;

    if (mode === 'until_tails') {
      // Dynamic real-time flip-until-tails mode (terminates on first tails)
      const results: boolean[] = [];

      const runUntilTailsFlip = (flipIdx: number) => {
        if (isCancelled) return;
        const isHeads = presetResults ? (presetResults[flipIdx] ?? false) : Math.random() >= 0.5;
        results.push(isHeads);
        setFlipResults([...results]);
        setCurrentFlipIdx(flipIdx);
        setPhase('tossing');
        sounds.playCoinFlip();

        // 1. Initial toss upward
        setRotationX(360);

        // 2. Rapid vertical spinning
        timers.push(setTimeout(() => {
          if (isCancelled) return;
          setPhase('spinning');
          const finalDeg = isHeads ? 2160 : 2340;
          setRotationX(finalDeg);
        }, 200));

        // 3. Landing & next step
        timers.push(setTimeout(() => {
          if (isCancelled) return;
          setPhase('landed');
          sounds.playCoinFlip();

          if (isHeads && flipIdx < 10 && (!presetResults || flipIdx < presetResults.length - 1)) {
            // Heads! Flip again after pause
            timers.push(setTimeout(() => {
              if (isCancelled) return;
              runUntilTailsFlip(flipIdx + 1);
            }, 850));
          } else {
            // Tails! Stop sequence immediately
            timers.push(setTimeout(() => {
              if (isCancelled || completedRef.current) return;
              completedRef.current = true;
              onComplete(results);
            }, 950));
          }
        }, 1000));
      };

      runUntilTailsFlip(0);
    } else {
      // Fixed count mode
      const results: boolean[] = presetResults
        ? [...presetResults]
        : Array.from({ length: count }, () => Math.random() >= 0.5);
      setFlipResults(results);

      const runFlipAnimation = (flipIdx: number) => {
        if (isCancelled) return;
        const isHeads = results[flipIdx];
        setCurrentFlipIdx(flipIdx);
        setPhase('tossing');
        sounds.playCoinFlip();

        setRotationX(360);

        timers.push(setTimeout(() => {
          if (isCancelled) return;
          setPhase('spinning');
          const finalDeg = isHeads ? 2160 : 2340;
          setRotationX(finalDeg);
        }, 200));

        timers.push(setTimeout(() => {
          if (isCancelled) return;
          setPhase('landed');
          sounds.playCoinFlip();

          if (flipIdx + 1 < count) {
            timers.push(setTimeout(() => {
              if (isCancelled) return;
              runFlipAnimation(flipIdx + 1);
            }, 800));
          } else {
            timers.push(setTimeout(() => {
              if (isCancelled || completedRef.current) return;
              completedRef.current = true;
              onComplete(results);
            }, 900));
          }
        }, 1000));
      };

      runFlipAnimation(0);
    }

    return () => {
      isCancelled = true;
      timers.forEach(t => clearTimeout(t));
    };
  }, [isOpen, count, mode]);

  if (!isOpen) return null;

  const currentResult = flipResults[currentFlipIdx];
  const isHeads = currentResult === true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in safe-area-padding">
      <div className="bg-slate-900/95 border-2 border-yellow-500/80 rounded-3xl p-6 md:p-8 max-w-md w-full text-center text-white shadow-[0_0_50px_rgba(250,204,21,0.4)] flex flex-col items-center relative overflow-hidden">
        
        {/* Ambient Decorative Lighting */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />

        {/* Title & Reason */}
        <h3 className="text-base md:text-lg font-black tracking-widest text-yellow-400 mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
          {lang === 'tr' ? 'Pokémon Yazı-Tura Atışı' : 'Pokémon Coin Toss'}
        </h3>
        <p className="text-xs md:text-sm text-gray-300 mb-6 font-medium max-w-xs">{translateLog(reason, lang)}</p>

        {/* Progress indicator */}
        {mode === 'until_tails' ? (
          <div className="flex items-center gap-2 mb-4 text-xs font-mono font-bold text-amber-300 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/40">
            <span>
              {lang === 'tr' 
                ? `Yazı Gelene Kadar Atış (${flipResults.filter(Boolean).length} Tura)` 
                : `Flip Until Tails (${flipResults.filter(Boolean).length} Heads)`}
            </span>
          </div>
        ) : count > 1 ? (
          <div className="flex items-center gap-2 mb-4 text-xs font-mono font-bold text-yellow-300 bg-slate-950/80 px-3 py-1 rounded-full border border-yellow-500/40">
            <span>{lang === 'tr' ? `Atış ${currentFlipIdx + 1} / ${count}` : `Flip ${currentFlipIdx + 1} of ${count}`}</span>
            <div className="flex gap-1">
              {Array.from({ length: count }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx < currentFlipIdx
                      ? flipResults[idx] ? 'bg-yellow-400' : 'bg-slate-400'
                      : idx === currentFlipIdx
                      ? 'bg-yellow-300 animate-ping'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* 3D VERTICAL COIN FLIP STAGE */}
        <div className="relative w-44 h-44 md:w-52 md:h-52 my-2 flex items-center justify-center [perspective:1000px]">
          {/* Dynamic Status Ring on Landing */}
          {phase === 'landed' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              {isHeads ? (
                /* Golden Victory Radiance */
                <div className="w-44 h-44 md:w-52 md:h-52 rounded-full border-2 border-yellow-400/70 bg-yellow-400/15 animate-ping duration-1000" />
              ) : (
                /* Subtle Slate Miss Ring */
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-red-500/30 bg-red-950/20 animate-pulse duration-700" />
              )}
            </div>
          )}

          <div
            className={`w-36 h-36 md:w-44 md:h-44 relative [transform-style:preserve-3d] transition-transform duration-[800ms] ease-out z-10 ${
              phase === 'landed' && !isHeads ? 'animate-wiggle' : ''
            }`}
            style={{
              transform: `translateY(${phase === 'spinning' || phase === 'tossing' ? '-50px' : '0px'}) rotateX(${rotationX}deg)`
            }}
          >
            {/* FRONT FACE (HEADS - METALLIC GOLD LUGIA COIN) */}
            <div
              className="absolute inset-0 w-full h-full rounded-full overflow-hidden [backface-visibility:hidden] flex items-center justify-center"
              style={{ transform: 'translateZ(2px)' }}
            >
              <img
                src="/assets/coin_heads.png"
                alt="Heads"
                className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
                loading="eager"
                decoding="sync"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/coin_heads.svg';
                }}
              />
            </div>

            {/* BACK FACE (TAILS - METALLIC SILVER POKEBALL COIN) */}
            <div
              className="absolute inset-0 w-full h-full rounded-full overflow-hidden [backface-visibility:hidden] flex items-center justify-center"
              style={{ transform: 'rotateX(180deg) translateZ(2px)' }}
            >
              <img
                src="/assets/coin_tails.png"
                alt="Tails"
                className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
                loading="eager"
                decoding="sync"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/coin_tails.svg';
                }}
              />
            </div>
          </div>
        </div>

        {/* STREAMLINED CLEAN OUTCOME BANNER */}
        <div className="min-h-[4.5rem] flex flex-col items-center justify-center mt-2">
          {phase === 'landed' ? (
            <div className="flex flex-col items-center animate-fade-in">
              <div
                className={`text-2xl md:text-3xl font-black tracking-widest uppercase flex items-center justify-center gap-2 ${
                  isHeads
                    ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] animate-bounce'
                    : 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]'
                }`}
              >
                {isHeads ? (
                  <>
                    <span className="text-xl">✨</span>
                    <span>{lang === 'tr' ? 'TURA (HEADS)' : 'HEADS'}</span>
                    <span className="text-xl">✨</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">✕</span>
                    <span>{lang === 'tr' ? 'YAZI (TAILS)' : 'TAILS'}</span>
                    <span className="text-xl">✕</span>
                  </>
                )}
              </div>

              {/* Clean Status Badge */}
              <div className="mt-1.5 flex items-center justify-center">
                {isHeads ? (
                  <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 shadow flex items-center gap-1.5">
                    <span>✓</span>
                    <span>
                      {reason.includes('İlk Sıra') || reason.includes('goes first') || reason.includes('Starting')
                        ? (lang === 'tr' ? '👑 1. Tur Sizin' : '👑 Turn 1 is Yours')
                        : mode === 'until_tails'
                        ? (lang === 'tr' ? `${flipResults.filter(Boolean).length}. Tura` : `${flipResults.filter(Boolean).length} Heads`)
                        : (lang === 'tr' ? 'Başarılı' : 'Success')}
                    </span>
                  </span>
                ) : (
                  <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/50 text-rose-300 shadow flex items-center gap-1.5">
                    <span>✕</span>
                    <span>
                      {reason.includes('İlk Sıra') || reason.includes('goes first') || reason.includes('Starting')
                        ? (lang === 'tr' ? '⚔️ 1. Tur Rakibin' : "⚔️ Turn 1 is Opponent's")
                        : mode === 'until_tails'
                        ? (lang === 'tr' ? `Yazı! Toplam ${flipResults.filter(Boolean).length} Tura` : `Tails! ${flipResults.filter(Boolean).length} Heads`)
                        : (lang === 'tr' ? 'Başarısız' : 'Failed')}
                    </span>
                  </span>
                )}
              </div>

              {(count > 1 || mode === 'until_tails') && flipResults.length > 0 && (
                <div className="text-xs font-mono font-bold text-gray-300 mt-1.5">
                  {lang === 'tr' ? 'Sonuçlar: ' : 'Results: '}
                  {flipResults.slice(0, currentFlipIdx + 1).map(r => r ? t.heads : t.tails).join(', ')}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs font-bold text-yellow-300 animate-pulse tracking-wider">
              {lang === 'tr' ? 'Yazı-Tura Havada Dönüyor...' : 'Flipping Coin in Mid-Air...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
