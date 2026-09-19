import { Language, TRANSLATIONS } from './i18n/translations';
import React, { useState, useEffect } from 'react';
import { GameState, Card, AIDifficulty, EnergyType } from './types/game';
import { GameEngine } from './engine/GameEngine';
import { PREBUILT_DECKS, buildDeckFromList } from './data/decks';
import { loadSavedCustomDecks, convertCardIdsToCards } from './utils/customDeckStorage';
import { MainMenu } from './components/MainMenu';
import { GameBoard } from './components/GameBoard';
import { DeckBuilder } from './components/DeckBuilder';
import { MultiplayerLobby } from './components/MultiplayerLobby';
import { net } from './network/MultiplayerManager';

export function App() {
  const [screen, setScreen] = useState<'menu' | 'game' | 'builder' | 'multiplayer'>('menu');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [activePlayerDeck, setActivePlayerDeck] = useState<Card[]>(() => buildDeckFromList(PREBUILT_DECKS[0].cards));
  const [activeCpuDeck, setActiveCpuDeck] = useState<Card[]>(() => buildDeckFromList(PREBUILT_DECKS[1].cards));
  const [activePlayerDeckName, setActivePlayerDeckName] = useState<string>('Overgrowth');
  const [activeCpuDeckName, setActiveCpuDeckName] = useState<string>('Brushfire');
  const [activePlayerDeckTypes, setActivePlayerDeckTypes] = useState<EnergyType[]>(['Grass', 'Water']);
  const [activeCpuDeckTypes, setActiveCpuDeckTypes] = useState<EnergyType[]>(['Fire', 'Grass']);
  const [prizeCount, setPrizeCount] = useState<number>(6);
  const [urlRoomCode, setUrlRoomCode] = useState<string>('');
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('pkmn_lang');
    return (saved === 'en' ? 'en' : 'tr') as Language; // Turkish is the default!
  });

  const handleToggleLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('pkmn_lang', newLang);
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const [uiScale, setUiScale] = useState<number>(() => {
    const saved = localStorage.getItem('pkmn_ui_scale');
    return saved ? parseFloat(saved) : 1.15; // Comfortable default display scale
  });

  useEffect(() => {
    try {
      (document.body.style as any).zoom = '1';
      localStorage.setItem('pkmn_ui_scale', uiScale.toString());
    } catch (e) {}
  }, [uiScale]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setUrlRoomCode(roomParam);
      setScreen('multiplayer');
    }
  }, []);

  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>(() => {
    const saved = localStorage.getItem('pkmn_ai_difficulty');
    return (saved as AIDifficulty) || 'medium';
  });

  const [matchKey, setMatchKey] = useState<number>(1);

  const handleStartGame = (playerDeckId: string, cpuDeckId: string, prizes: number, difficulty: AIDifficulty = 'medium') => {
    let pDeck: Card[];
    let pName: string;
    let pTypes: EnergyType[];

    const savedDecks = loadSavedCustomDecks();
    const customFound = savedDecks.find(d => d.id === playerDeckId);

    if (customFound) {
      pDeck = convertCardIdsToCards(customFound.cardIds);
      const pTheme = GameEngine.getDeckTheme(pDeck, customFound.name);
      pName = pTheme.name;
      pTypes = pTheme.types;
    } else {
      const pPreset = PREBUILT_DECKS.find(d => d.id === playerDeckId) || PREBUILT_DECKS[0];
      pDeck = buildDeckFromList(pPreset.cards);
      pName = pPreset.name.replace(/\s*\([^)]*\)/, '');
      pTypes = pPreset.type.split('/').map(t => t.trim() as EnergyType);
    }

    const cpuCustomFound = savedDecks.find(d => d.id === cpuDeckId);
    let cDeck: Card[];
    let cName: string;
    let cTypes: EnergyType[];

    if (cpuCustomFound) {
      cDeck = convertCardIdsToCards(cpuCustomFound.cardIds);
      const cTheme = GameEngine.getDeckTheme(cDeck, cpuCustomFound.name);
      cName = cTheme.name;
      cTypes = cTheme.types;
    } else {
      const cPreset = PREBUILT_DECKS.find(d => d.id === cpuDeckId) || PREBUILT_DECKS[1];
      cDeck = buildDeckFromList(cPreset.cards);
      cName = cPreset.name.replace(/\s*\([^)]*\)/, '');
      cTypes = cPreset.type.split('/').map(t => t.trim() as EnergyType);
    }

    setActivePlayerDeck(pDeck);
    setActiveCpuDeck(cDeck);
    setActivePlayerDeckName(pName);
    setActiveCpuDeckName(cName);
    setActivePlayerDeckTypes(pTypes);
    setActiveCpuDeckTypes(cTypes);
    setPrizeCount(prizes);
    setAiDifficulty(difficulty);
    localStorage.setItem('pkmn_ai_difficulty', difficulty);
    setIsMultiplayer(false);

    const init = GameEngine.initGame(pDeck, cDeck, prizes, difficulty, pName, cName, pTypes, cTypes);
    setGameState(init);
    setMatchKey(prev => prev + 1);
    setScreen('game');
  };

  const handleStartMultiplayerGame = (params: {
    role: 'host' | 'guest';
    playerDeck: Card[];
    opponentDeck: Card[];
    prizeCount: number;
    initialFirstPlayer: 'player' | 'cpu';
    playerName?: string;
    opponentName?: string;
    playerDeckName?: string;
    opponentDeckName?: string;
    seed?: number;
  }) => {
    const pTheme = GameEngine.getDeckTheme(params.playerDeck, params.playerDeckName || 'Custom Deck');
    const oTheme = GameEngine.getDeckTheme(params.opponentDeck, params.opponentDeckName || 'Opponent Deck');

    setActivePlayerDeck(params.playerDeck);
    setActiveCpuDeck(params.opponentDeck);
    setActivePlayerDeckName(pTheme.name);
    setActiveCpuDeckName(oTheme.name);
    setActivePlayerDeckTypes(pTheme.types);
    setActiveCpuDeckTypes(oTheme.types);
    setPrizeCount(params.prizeCount);
    setIsMultiplayer(true);

    const init = GameEngine.initMultiplayerGame(
      params.playerDeck,
      params.opponentDeck,
      params.prizeCount,
      params.initialFirstPlayer,
      params.playerName || 'Player',
      params.opponentName || 'Opponent',
      pTheme.name,
      oTheme.name,
      pTheme.types,
      oTheme.types
    );

    setGameState(init);
    setMatchKey(prev => prev + 1);
    setScreen('game');
  };

  const handleRematch = () => {
    if (isMultiplayer) {
      // Generate a new deterministic seed for the rematch and broadcast it so both
      // players shuffle identically. The receiving side applies it in GameBoard's
      // GAME_ACTION handler (MULLIGAN with _rematchSeed).
      const newSeed = (Date.now() ^ (Math.random() * 0xFFFFFFFF)) >>> 0;
      GameEngine.setMultiplayerSeed(newSeed);
      net.sendMessage('GAME_ACTION', { type: 'MULLIGAN', _rematchSeed: newSeed });
    }
    const init = isMultiplayer
      ? GameEngine.initMultiplayerGame(
          activePlayerDeck,
          activeCpuDeck,
          prizeCount,
          'player',
          gameState?.player.name || 'Player',
          gameState?.cpu.name || 'Opponent',
          activePlayerDeckName,
          activeCpuDeckName,
          activePlayerDeckTypes,
          activeCpuDeckTypes
        )
      : GameEngine.initGame(
          activePlayerDeck,
          activeCpuDeck,
          prizeCount,
          aiDifficulty,
          activePlayerDeckName,
          activeCpuDeckName,
          activePlayerDeckTypes,
          activeCpuDeckTypes
        );
    setGameState(init);
    setMatchKey(prev => prev + 1);
  };

  const handleCustomDeckSelected = (customDeck: Card[]) => {
    const pTheme = GameEngine.getDeckTheme(customDeck, 'Custom Deck');
    const cPreset = PREBUILT_DECKS[1];
    const cDeck = buildDeckFromList(cPreset.cards);
    const cName = cPreset.name.replace(/\s*\([^)]*\)/, '');
    const cTypes = cPreset.type.split('/').map(t => t.trim() as EnergyType);

    setActivePlayerDeck(customDeck);
    setActiveCpuDeck(cDeck);
    setActivePlayerDeckName(pTheme.name);
    setActiveCpuDeckName(cName);
    setActivePlayerDeckTypes(pTheme.types);
    setActiveCpuDeckTypes(cTypes);

    const init = GameEngine.initGame(customDeck, cDeck, 6, aiDifficulty, pTheme.name, cName, pTheme.types, cTypes);
    setGameState(init);
    setMatchKey(prev => prev + 1);
    setScreen('game');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white select-none">
      {screen === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          onOpenDeckBuilder={() => setScreen('builder')}
          onOpenMultiplayer={() => setScreen('multiplayer')}
          uiScale={uiScale}
          onChangeUiScale={setUiScale}
          lang={lang}
          onChangeLang={handleToggleLang}
        />
      )}

      {screen === 'multiplayer' && (
        <MultiplayerLobby
          initialRoomCode={urlRoomCode}
          onBack={() => setScreen('menu')}
          onStartMultiplayerGame={handleStartMultiplayerGame}
          lang={lang}
          onChangeLang={handleToggleLang}
        />
      )}

      {screen === 'builder' && (
        <DeckBuilder
          onBack={() => setScreen('menu')}
          onSelectDeck={handleCustomDeckSelected}
          uiScale={uiScale}
          onChangeUiScale={setUiScale}
          lang={lang}
          onChangeLang={handleToggleLang}
        />
      )}

      {screen === 'game' && gameState && (
        <GameBoard
          key={`match-${matchKey}`}
          initialState={gameState}
          isMultiplayer={isMultiplayer}
          onExitToMenu={() => setScreen('menu')}
          onRematch={handleRematch}
          uiScale={uiScale}
          onChangeUiScale={setUiScale}
          lang={lang}
          onChangeLang={handleToggleLang}
        />
      )}
    </div>
  );
}

export default App;
