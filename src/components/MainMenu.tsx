import React, { useState } from 'react';
import { PREBUILT_DECKS } from '../data/decks';
import { Sparkles, Play, BookOpen, Layers, Volume2, VolumeX, Users, Radio, Globe, ShieldAlert, Swords, Crown, Trophy, Dices, Shuffle } from 'lucide-react';
import { sounds } from './SoundManager';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { AIDifficulty } from '../types/game';
import { loadSavedCustomDecks } from '../utils/customDeckStorage';

interface MainMenuProps {
  onStartGame: (playerDeckId: string, cpuDeckId: string, prizeCount: number, difficulty: AIDifficulty) => void;
  onOpenDeckBuilder: () => void;
  onOpenMultiplayer: () => void;
  uiScale?: number;
  onChangeUiScale?: (scale: number) => void;
  lang?: Language;
  onChangeLang?: (lang: Language) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenDeckBuilder,
  onOpenMultiplayer,
  uiScale = 1.15,
  onChangeUiScale,
  lang = 'tr',
  onChangeLang
}) => {
  const t = TRANSLATIONS[lang];
  const [playerDeckId, setPlayerDeckId] = useState(PREBUILT_DECKS[0].id);
  const [cpuDeckId, setCpuDeckId] = useState(PREBUILT_DECKS[1].id);
  const [prizeCount, setPrizeCount] = useState<number>(6);
  const [difficulty, setDifficulty] = useState<AIDifficulty>(() => {
    const saved = localStorage.getItem('pkmn_ai_difficulty');
    return (saved as AIDifficulty) || 'hard';
  });
  const [showRules, setShowRules] = useState(false);
  const [soundOn, setSoundOn] = useState(sounds.enabled);

  const savedCustoms = loadSavedCustomDecks();
  const allAvailableDeckIds = [
    ...savedCustoms.map(d => d.id),
    ...PREBUILT_DECKS.map(d => d.id)
  ];

  const handleRandomizeBothDecks = () => {
    sounds.playCardDraw();
    if (allAvailableDeckIds.length === 0) return;

    // Pick random for player
    const randomPlayerIdx = Math.floor(Math.random() * allAvailableDeckIds.length);
    const chosenPlayerId = allAvailableDeckIds[randomPlayerIdx];
    setPlayerDeckId(chosenPlayerId);

    // Pick random for CPU (preferably distinct if multiple exist)
    const availableForCpu = allAvailableDeckIds.filter(id => id !== chosenPlayerId);
    const chosenCpuId = availableForCpu.length > 0
      ? availableForCpu[Math.floor(Math.random() * availableForCpu.length)]
      : allAvailableDeckIds[Math.floor(Math.random() * allAvailableDeckIds.length)];
    
    setCpuDeckId(chosenCpuId);
  };

  const toggleSound = () => {
    sounds.enabled = !soundOn;
    setSoundOn(!soundOn);
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/assets/bg_main_menu.jpg')` }}
    >
      {/* Dark Ambient Overlay for Contrast & Readability */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Controls: Language Switcher, Scale & Sound */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        {/* Language Switcher Toggle */}
        {onChangeLang && (
          <div className="bg-slate-900/90 border border-slate-700 rounded-full p-0.5 flex items-center text-[10px] font-bold shadow">
            <button
              onClick={() => onChangeLang('tr')}
              className={`px-2.5 py-1 rounded-full transition flex items-center gap-1 ${
                lang === 'tr' ? 'bg-red-600 text-white shadow font-black' : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Türkçe"
            >
              <span>🇹🇷</span> TR
            </button>
            <button
              onClick={() => onChangeLang('en')}
              className={`px-2.5 py-1 rounded-full transition flex items-center gap-1 ${
                lang === 'en' ? 'bg-blue-600 text-white shadow font-black' : 'text-gray-400 hover:text-gray-200'
              }`}
              title="English"
            >
              <span>🇬🇧</span> EN
            </button>
          </div>
        )}

        {/* Display Scale */}
        {onChangeUiScale && (
          <div className="hidden sm:flex bg-slate-900/90 border border-slate-700 rounded-full px-2.5 py-1 items-center gap-1 text-[10px] font-bold shadow">
            <span className="text-gray-400 mr-0.5">🔍</span>
            {[1.0, 1.15, 1.25].map(scale => (
              <button
                key={scale}
                onClick={() => onChangeUiScale(scale)}
                className={`px-2 py-0.5 rounded-full transition ${
                  Math.abs(uiScale - scale) < 0.05
                    ? 'bg-yellow-500 text-slate-950 shadow'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {Math.round(scale * 100)}%
              </button>
            ))}
          </div>
        )}

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="bg-slate-900/80 hover:bg-slate-800 p-2.5 rounded-full border border-slate-700 text-yellow-400 transition shadow"
          title={t.sound}
        >
          {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
        </button>
      </div>

      
      {/* Scalable Main Content Wrapper */}
      <div
        style={{ zoom: uiScale }}
        className="flex flex-col items-center justify-center relative z-10 w-full max-w-2xl transition-transform duration-200"
      >
        {/* Retro Title Header */}
        <div className="text-center mb-6 animate-fade-in relative z-10 w-full max-w-2xl">
          {/* Marquee Scrolling Header Banner */}
          <div className="w-full max-w-xl mx-auto mb-3 overflow-hidden rounded-full bg-yellow-500/15 border border-yellow-500/50 py-1.5 px-2 relative backdrop-blur-md shadow-lg">
            <div className="animate-marquee flex items-center">
              <span className="text-xs font-mono tracking-widest text-yellow-300 font-bold uppercase inline-flex items-center gap-2 px-6">
                <span>⚡</span> {t.badgeText} <span>⚡</span>
              </span>
              <span className="text-xs font-mono tracking-widest text-yellow-300 font-bold uppercase inline-flex items-center gap-2 px-6">
                <span>⚡</span> {t.badgeText} <span>⚡</span>
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            {t.gameTitle}
          </h1>
          <p className="text-sm md:text-base text-gray-200 mt-2 font-medium drop-shadow">
            {t.gameSubtitle}
          </p>
        </div>

        {/* Match Setup Box */}
        <div className="bg-slate-900/90 border-2 border-yellow-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl backdrop-blur-md relative z-10">
          <div className="space-y-4">
            {/* Online Multiplayer Big Button */}
            <button
              onClick={onOpenMultiplayer}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm py-3.5 rounded-2xl shadow-xl transition flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer border border-blue-400/40"
            >
              <Users className="w-5 h-5" /> {t.playMultiplayer}
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-grow h-px bg-slate-800" />
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{t.orSolo}</span>
            <div className="flex-grow h-px bg-slate-800" />
          </div>

          {/* Deck Selection Header with Randomize Button */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-yellow-400">
              {lang === 'tr' ? '⚔️ Deste Seçimi' : '⚔️ Deck Selection'}
            </span>
            <button
              type="button"
              onClick={handleRandomizeBothDecks}
              className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-[11px] px-3 py-1.5 rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95 cursor-pointer border border-yellow-300"
              title={lang === 'tr' ? 'Her iki taraf için rastgele deste seç' : 'Randomize decks for both players'}
            >
              <Dices className="w-3.5 h-3.5" />
              <span>{t.randomizeDecks || (lang === 'tr' ? '🎲 Rastgele Deste Seç' : '🎲 Randomize Decks')}</span>
            </button>
          </div>

          {/* Player Deck Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1.5">
              {t.yourDeck}
            </label>
            <select
              value={playerDeckId}
              onChange={(e) => setPlayerDeckId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer transition-all duration-200"
            >
              {savedCustoms.length > 0 && (
                <optgroup label={t.customDecksGroup || (lang === 'tr' ? '✨ Özel Desteleriniz' : '✨ Your Custom Decks')}>
                  {savedCustoms.map(d => (
                    <option key={d.id} value={d.id}>✨ {d.name} ({d.cardIds.length} {t.deckCount || 'Cards'})</option>
                  ))}
                </optgroup>
              )}
              <optgroup label={t.prebuiltDecksGroup || (lang === 'tr' ? '📦 Hazır Tema Desteleri' : '📦 Prebuilt Theme Decks')}>
                {PREBUILT_DECKS.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.type})</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* CPU Opponent Deck Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-blue-400 mb-1.5">
              {t.cpuDeck}
            </label>
            <select
              value={cpuDeckId}
              onChange={(e) => setCpuDeckId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-200"
            >
              {savedCustoms.length > 0 && (
                <optgroup label={t.customDecksGroup || (lang === 'tr' ? '✨ Özel Desteleriniz' : '✨ Your Custom Decks')}>
                  {savedCustoms.map(d => (
                    <option key={d.id} value={d.id}>✨ {d.name} ({d.cardIds.length} {t.deckCount || 'Cards'})</option>
                  ))}
                </optgroup>
              )}
              <optgroup label={t.prebuiltDecksGroup || (lang === 'tr' ? '📦 Hazır Tema Desteleri' : '📦 Prebuilt Theme Decks')}>
                {PREBUILT_DECKS.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.type})</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Prize Cards Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              {t.prizeCards} <span className="text-gray-500 font-normal">{t.prizesDesc}</span>
            </label>
            <div className="flex gap-3">
              {[2, 4, 6].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPrizeCount(num)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                    prizeCount === num
                      ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                      : 'bg-slate-800 border-slate-700 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {num} {t.prizeSlot}
                </button>
              ))}
            </div>
          </div>

          {/* AI Difficulty Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center justify-between">
              <span>{t.difficultyLabel}</span>
              <span className="text-[10px] font-normal text-gray-400">
                {difficulty === 'easy' ? t.diffEasy : difficulty === 'medium' ? t.diffMedium : difficulty === 'hard' ? t.diffHard : t.diffExpert}
              </span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => { setDifficulty('easy'); localStorage.setItem('pkmn_ai_difficulty', 'easy'); }}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex flex-col items-center gap-1 border ${
                  difficulty === 'easy'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                    : 'bg-slate-800 border-slate-700 text-gray-400 hover:text-gray-200'
                }`}
                title={t.diffEasyDesc}
              >
                <span>🌱</span>
                <span>{lang === 'tr' ? 'Acemi' : 'Easy'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setDifficulty('medium'); localStorage.setItem('pkmn_ai_difficulty', 'medium'); }}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex flex-col items-center gap-1 border ${
                  difficulty === 'medium'
                    ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_12px_rgba(96,165,250,0.3)]'
                    : 'bg-slate-800 border-slate-700 text-gray-400 hover:text-gray-200'
                }`}
                title={t.diffMediumDesc}
              >
                <span>⚔️</span>
                <span>{lang === 'tr' ? 'Normal' : 'Medium'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setDifficulty('hard'); localStorage.setItem('pkmn_ai_difficulty', 'hard'); }}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex flex-col items-center gap-1 border ${
                  difficulty === 'hard'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                    : 'bg-slate-800 border-slate-700 text-gray-400 hover:text-gray-200'
                }`}
                title={t.diffHardDesc}
              >
                <span>👑</span>
                <span>{lang === 'tr' ? 'Zor' : 'Hard'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setDifficulty('expert'); localStorage.setItem('pkmn_ai_difficulty', 'expert'); }}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex flex-col items-center gap-1 border ${
                  difficulty === 'expert'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.4)]'
                    : 'bg-slate-800 border-slate-700 text-gray-400 hover:text-gray-200'
                }`}
                title={t.diffExpertDesc}
              >
                <span>🏆</span>
                <span>{lang === 'tr' ? 'Usta' : 'Master'}</span>
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 italic leading-tight">
              {difficulty === 'easy' ? t.diffEasyDesc : difficulty === 'medium' ? t.diffMediumDesc : difficulty === 'hard' ? t.diffHardDesc : t.diffExpertDesc}
            </p>
          </div>

          {/* Start Battle Button */}
          <button
            onClick={() => onStartGame(playerDeckId, cpuDeckId, prizeCount, difficulty)}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black text-base py-3.5 rounded-2xl shadow-xl transition flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer mt-2"
          >
            <Play className="w-5 h-5 fill-current" /> {t.startBattle}
          </button>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between gap-3">
          <button
            onClick={onOpenDeckBuilder}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Layers className="w-4 h-4 text-yellow-400" /> {t.deckBuilder}
          </button>
          <button
            onClick={() => setShowRules(true)}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <BookOpen className="w-4 h-4 text-blue-400" /> {t.ruleBook}
          </button>
        </div>
      </div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-yellow-500/40 rounded-3xl max-w-lg w-full p-6 text-sm text-gray-300 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 pb-2 border-b border-slate-800">
              {t.rulesTitle}
            </h3>
            <div className="space-y-4 text-xs leading-relaxed">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <h4 className="font-bold text-yellow-300 text-sm mb-1">{t.rule1Title}</h4>
                <p>{t.rule1Text}</p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <h4 className="font-bold text-yellow-300 text-sm mb-1">{t.rule2Title}</h4>
                <p>{t.rule2Text}</p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <h4 className="font-bold text-yellow-300 text-sm mb-1">{t.rule3Title}</h4>
                <p>{t.rule3Text}</p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <h4 className="font-bold text-yellow-300 text-sm mb-1">{t.rule4Title}</h4>
                <p>{t.rule4Text}</p>
              </div>
            </div>
            <button
              onClick={() => setShowRules(false)}
              className="mt-5 w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-2.5 rounded-xl transition"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
