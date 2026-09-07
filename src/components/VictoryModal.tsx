import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from './SoundManager';
import { Trophy, Frown, RotateCcw, Home } from 'lucide-react';
import { Language, TRANSLATIONS, translateLog } from '../i18n/translations';

interface VictoryModalProps {
  winner: 'player' | 'cpu' | null;
  winReason?: string;
  onRematch: () => void;
  onMainMenu: () => void;
  lang?: Language;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  winReason,
  onRematch,
  onMainMenu,
  lang = 'tr'
}) => {
  const t = TRANSLATIONS[lang];
  // Delay the modal so the fainted animation (grayscale pulse + knockout banner)
  // is visible before the victory/defeat screen covers the board.
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (!winner) { setVisible(false); return; }
    const timer = setTimeout(() => setVisible(true), 650);
    return () => clearTimeout(timer);
  }, [winner]);

  const isPlayerWin = winner === 'player';

  useEffect(() => {
    // Only celebrate once the modal is actually shown (after the delay).
    if (!visible || !isPlayerWin) return;
    sounds.playVictory();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  }, [visible, isPlayerWin]);

  if (!winner || !visible) return null;

  const defaultWinDesc = isPlayerWin
    ? (lang === 'tr' ? 'Tebrikler! Pokémon TCG maçını kazandınız!' : 'You have won the Pokémon TCG match!')
    : (lang === 'tr' ? 'Rakibiniz maçı kazandı. Bir dahaki sefere bol şans!' : 'Opponent won the match. Better luck next time!');

  const translatedReason = winReason ? translateLog(winReason, lang) : defaultWinDesc;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in safe-area-padding">
      <div className={`relative border-4 rounded-3xl p-6 sm:p-8 max-w-md w-[92%] text-center shadow-2xl flex flex-col items-center ${
        isPlayerWin
          ? 'bg-slate-900 border-yellow-400 shadow-yellow-500/30'
          : 'bg-slate-900 border-red-600 shadow-red-500/30'
      }`}>
        {/* Icon */}
        <div className="mb-4">
          {isPlayerWin ? (
            <div className="w-20 h-20 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center animate-bounce">
              <Trophy className="w-10 h-10 text-yellow-400" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center">
              <Frown className="w-10 h-10 text-red-400" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className={`text-3xl font-black tracking-widest mb-2 ${
          isPlayerWin ? 'text-yellow-400' : 'text-red-500'
        }`}>
          {isPlayerWin
            ? (lang === 'tr' ? 'ZAFER!' : 'VICTORY!')
            : (lang === 'tr' ? 'YENİLGİ' : 'DEFEAT')}
        </h2>

        <p className="text-sm text-gray-300 font-medium mb-6 px-2">
          {translatedReason}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={onRematch}
            className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg transition active:scale-95 text-xs sm:text-sm"
          >
            <RotateCcw className="w-4 h-4" /> {t.rematchBtn}
          </button>
          <button
            onClick={onMainMenu}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl border border-slate-700 transition active:scale-95 text-xs sm:text-sm"
          >
            <Home className="w-4 h-4" /> {t.backToMenu}
          </button>
        </div>
      </div>
    </div>
  );
};
