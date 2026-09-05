import { Language, TRANSLATIONS } from '../i18n/translations';
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../types/game';
import { PREBUILT_DECKS, buildDeckFromList } from '../data/decks';
import { net } from '../network/MultiplayerManager';
import { NetworkMessage } from '../types/multiplayer';
import { sounds } from './SoundManager';
import { ArrowLeft, Copy, Check, Users, Play, Shield, Sparkles, MessageSquare, Zap, Radio, Loader2, Dices, Shuffle } from 'lucide-react';
import { loadSavedCustomDecks, convertCardIdsToCards } from '../utils/customDeckStorage';

interface MultiplayerLobbyProps {
  onBack: () => void;
  onStartMultiplayerGame: (params: {
    role: 'host' | 'guest';
    playerDeck: Card[];
    opponentDeck: Card[];
    prizeCount: number;
    initialFirstPlayer: 'player' | 'cpu';
    playerName?: string;
    opponentName?: string;
    playerDeckName?: string;
    opponentDeckName?: string;
  }) => void;
  initialRoomCode?: string;
  lang?: Language;
  onChangeLang?: (lang: Language) => void;
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({
  onBack,
  onStartMultiplayerGame,
  initialRoomCode = '',
  lang = 'tr',
  onChangeLang
}) => {
  const t = TRANSLATIONS[lang];
  const [tab, setTab] = useState<'create' | 'join'>(initialRoomCode ? 'join' : 'create');
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Match settings
  const [selectedDeckId, setSelectedDeckId] = useState(PREBUILT_DECKS[0].id);
  const [prizeCount, setPrizeCount] = useState<number>(6);
  const [username, setUsername] = useState<string>(() => localStorage.getItem('pkmn_trainer_name') || 'Trainer Red');
  const [opponentUsername, setOpponentUsername] = useState<string>('Opponent');

  // In-Lobby state
  const [isRoomConnected, setIsRoomConnected] = useState(false);
  const [hostDeckId, setHostDeckId] = useState(PREBUILT_DECKS[0].id);
  const [guestDeckId, setGuestDeckId] = useState(PREBUILT_DECKS[1].id);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');

  const savedCustomDecks = loadSavedCustomDecks();
  const allAvailableDecks = [
    ...savedCustomDecks.map(d => ({ id: d.id, name: `✨ ${d.name} (${d.cardIds.length} Kart)`, isCustom: true, cardIds: d.cardIds, deckName: d.name })),
    ...PREBUILT_DECKS.map(d => ({ id: d.id, name: `📦 ${d.name} (${d.type})`, isCustom: false, cards: d.cards, deckName: d.name }))
  ];

  const selectedCustom = savedCustomDecks.find(d => d.id === selectedDeckId);
  const currentDeck = selectedCustom
    ? convertCardIdsToCards(selectedCustom.cardIds)
    : buildDeckFromList(PREBUILT_DECKS.find(d => d.id === selectedDeckId)?.cards || PREBUILT_DECKS[0].cards);
  const currentDeckName = selectedCustom ? selectedCustom.name : (PREBUILT_DECKS.find(d => d.id === selectedDeckId)?.name || 'Theme Deck');

  const [guestCustomCardIds, setGuestCustomCardIds] = useState<string[] | undefined>();
  const [guestCustomDeckName, setGuestCustomDeckName] = useState<string | undefined>();
  const [hostCustomCardIds, setHostCustomCardIds] = useState<string[] | undefined>();
  const [hostCustomDeckName, setHostCustomDeckName] = useState<string | undefined>();

  const handleRandomizeLobbyDeck = () => {
    sounds.playCardDraw();
    if (allAvailableDecks.length === 0) return;
    const randomIdx = Math.floor(Math.random() * allAvailableDecks.length);
    const chosen = allAvailableDecks[randomIdx];
    setSelectedDeckId(chosen.id);

    if (isRoomConnected) {
      if (net.role === 'guest') {
        const isCustom = chosen.isCustom;
        const customObj = isCustom ? savedCustomDecks.find(d => d.id === chosen.id) : null;
        net.sendMessage('JOIN_REQUEST', {
          deckId: chosen.id,
          customCardIds: customObj ? customObj.cardIds : undefined,
          customDeckName: customObj ? customObj.name : undefined,
          username
        });
      }
    }
  };

  const hasStartedRef = useRef(false);

  // Host: Create Room
  const handleCreateRoom = async () => {
    setIsConnecting(true);
    setError('');
    setStatus(lang === 'tr' ? 'Oda sunucuya kaydediliyor...' : 'Creating room on WebRTC server...');
    try {
      const code = await net.createRoom();
      setRoomCode(code);
      setStatus(lang === 'tr' ? 'Oda hazır! Rakibin katılması bekleniyor...' : 'Room ready! Waiting for opponent to join...');
      setIsConnecting(false);
    } catch (err: any) {
      setError((lang === 'tr' ? 'Oda oluşturulamadı: ' : 'Could not create room: ') + err.message);
      setIsConnecting(false);
    }
  };

  // Guest: Join Room
  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return;
    setIsConnecting(true);
    setError('');
    setStatus((lang === 'tr' ? 'Odaya bağlanılıyor ' : 'Connecting to host room ') + roomCode.toUpperCase() + '...');
    try {
      await net.joinRoom(roomCode);
      setIsConnecting(false);
      setIsRoomConnected(true);
      setStatus(t.opponentConnected);
      sounds.playEvolution();
      // Send deck & username to host
      net.sendMessage('JOIN_REQUEST', {
        deckId: selectedDeckId,
        customCardIds: selectedCustom ? selectedCustom.cardIds : undefined,
        customDeckName: selectedCustom ? selectedCustom.name : undefined,
        username
      });
    } catch (err: any) {
      setError(err?.message || (lang === 'tr' ? 'Bağlantı başarısız. Oda kodunu kontrol edin.' : 'Failed to connect. Please check the room code.'));
      setIsConnecting(false);
    }
  };

  // Setup event subscriptions
  useEffect(() => {
    const unsubConnect = net.onConnect(() => {
      setIsRoomConnected(true);
      setIsConnecting(false);
      setStatus(t.opponentConnected);
      sounds.playEvolution();

      if (net.role === 'guest') {
        net.sendMessage('JOIN_REQUEST', {
          deckId: selectedDeckId,
          customCardIds: selectedCustom ? selectedCustom.cardIds : undefined,
          customDeckName: selectedCustom ? selectedCustom.name : undefined,
          username
        });
      }
    });

    const unsubDisconnect = net.onDisconnect(() => {
      setIsRoomConnected(false);
      setStatus(lang === 'tr' ? 'Rakip ayrıldı.' : 'Opponent disconnected.');
      setError(lang === 'tr' ? 'Rakip lobiden ayrıldı.' : 'Opponent disconnected from lobby.');
    });

    const unsubError = net.onError((err) => {
      setError(err);
      setIsConnecting(false);
    });

    const unsubMessage = net.onMessage((msg: NetworkMessage) => {
      console.log('Lobby received:', msg);

      if (msg.type === 'HANDSHAKE' || msg.type === 'HANDSHAKE_ACK') {
        setIsRoomConnected(true);
        setIsConnecting(false);
        if (net.role === 'guest') {
          net.sendMessage('JOIN_REQUEST', { deckId: selectedDeckId });
        }
      } else if (msg.type === 'JOIN_REQUEST') {
        setGuestDeckId(msg.payload?.deckId || PREBUILT_DECKS[1].id);
        if (msg.payload?.customCardIds) {
          setGuestCustomCardIds(msg.payload.customCardIds);
          setGuestCustomDeckName(msg.payload.customDeckName);
        } else {
          setGuestCustomCardIds(undefined);
          setGuestCustomDeckName(undefined);
        }
        if (msg.payload?.username) setOpponentUsername(msg.payload.username);
        setIsRoomConnected(true);
        setIsConnecting(false);
        // Reply with host settings & custom deck info
        net.sendMessage('JOIN_ACCEPT', {
          deckId: selectedDeckId,
          customCardIds: selectedCustom ? selectedCustom.cardIds : undefined,
          customDeckName: selectedCustom ? selectedCustom.name : undefined,
          prizeCount,
          username
        });
      } else if (msg.type === 'JOIN_ACCEPT') {
        setHostDeckId(msg.payload?.deckId || PREBUILT_DECKS[0].id);
        if (msg.payload?.customCardIds) {
          setHostCustomCardIds(msg.payload.customCardIds);
          setHostCustomDeckName(msg.payload.customDeckName);
        } else {
          setHostCustomCardIds(undefined);
          setHostCustomDeckName(undefined);
        }
        if (msg.payload?.prizeCount) setPrizeCount(msg.payload.prizeCount);
        if (msg.payload?.username) setOpponentUsername(msg.payload.username);
        setIsRoomConnected(true);
        setIsConnecting(false);
      } else if (msg.type === 'GAME_START') {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        sounds.playEvolution();
        const hostDeck = msg.payload?.hostCustomCardIds
          ? convertCardIdsToCards(msg.payload.hostCustomCardIds)
          : buildDeckFromList(
              PREBUILT_DECKS.find(d => d.id === (msg.payload?.hostDeckId || hostDeckId))?.cards || PREBUILT_DECKS[0].cards
            );
        const guestDeck = currentDeck;

        onStartMultiplayerGame({
          role: 'guest',
          playerDeck: guestDeck,
          opponentDeck: hostDeck,
          prizeCount: msg.payload?.prizeCount || prizeCount,
          initialFirstPlayer: msg.payload?.firstTurnIsHost ? 'cpu' : 'player',
          playerName: username || 'Guest',
          opponentName: msg.payload?.hostUsername || opponentUsername || 'Host',
          playerDeckName: currentDeckName,
          opponentDeckName: msg.payload?.hostCustomDeckName || 'Opponent Deck'
        });
      } else if (msg.type === 'EMOTE') {
        setChatMessages(prev => [...prev, { sender: opponentUsername || 'Opponent', text: msg.payload?.emote || '' }]);
      }
    });

    return () => {
      unsubConnect();
      unsubDisconnect();
      unsubError();
      unsubMessage();
    };
  }, [selectedDeckId, prizeCount, hostDeckId, guestDeckId, currentDeck, onStartMultiplayerGame, username, opponentUsername, lang, t]);

  // Copy shareable room link
  const copyRoomLink = () => {
    const link = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Host starts the match with burst messaging
  const handleHostStartGame = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const firstTurnIsHost = Math.random() >= 0.5;

    const startPayload = {
      hostDeckId: selectedDeckId,
      hostCustomCardIds: selectedCustom ? selectedCustom.cardIds : undefined,
      hostCustomDeckName: selectedCustom ? selectedCustom.name : undefined,
      guestDeckId,
      guestCustomCardIds,
      guestCustomDeckName,
      prizeCount,
      firstTurnIsHost,
      hostUsername: username
    };

    net.sendMessage('GAME_START', startPayload);
    setTimeout(() => net.sendMessage('GAME_START', startPayload), 250);
    setTimeout(() => net.sendMessage('GAME_START', startPayload), 600);

    const hostDeck = currentDeck;
    const oppDeck = guestCustomCardIds
      ? convertCardIdsToCards(guestCustomCardIds)
      : buildDeckFromList(
          PREBUILT_DECKS.find(d => d.id === guestDeckId)?.cards || PREBUILT_DECKS[1].cards
        );

    sounds.playEvolution();
    onStartMultiplayerGame({
      role: 'host',
      playerDeck: hostDeck,
      opponentDeck: oppDeck,
      prizeCount,
      initialFirstPlayer: firstTurnIsHost ? 'player' : 'cpu',
      playerName: username || 'Host',
      opponentName: opponentUsername || 'Guest',
      playerDeckName: currentDeckName,
      opponentDeckName: guestCustomDeckName || 'Opponent Deck'
    });
  };

  // Quick Chat Send
  const sendChat = () => {
    if (!chatInput.trim()) return;
    net.sendEmote(chatInput);
    setChatMessages(prev => [...prev, { sender: username || 'You', text: chatInput }]);
    setChatInput('');
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/assets/bg_multiplayer.jpg')` }}
    >
      {/* Dark Ambient Overlay for High Contrast & Sleek Atmosphere */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between max-w-xl w-full mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              net.disconnect();
              onBack();
            }}
            className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 text-yellow-400 font-bold px-3 py-2 rounded-xl border border-slate-700 transition text-xs shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> {t.backToMenu}
          </button>
          {onChangeLang && (
            <div className="bg-slate-900/90 border border-slate-700 rounded-full p-0.5 flex items-center text-[10px] font-bold shadow">
              <button
                onClick={() => onChangeLang('tr')}
                className={`px-2 py-0.5 rounded-full transition flex items-center gap-1 ${
                  lang === 'tr' ? 'bg-red-600 text-white shadow font-black' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>🇹🇷</span> TR
              </button>
              <button
                onClick={() => onChangeLang('en')}
                className={`px-2 py-0.5 rounded-full transition flex items-center gap-1 ${
                  lang === 'en' ? 'bg-blue-600 text-white shadow font-black' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>🇬🇧</span> EN
              </button>
            </div>
          )}
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-green-400 flex items-center gap-1.5 justify-end">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> WebRTC P2P Online
          </span>
        </div>
      </div>

      {/* Main Lobby Box */}
      <div className="bg-slate-900/95 border-2 border-yellow-500/40 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl backdrop-blur-md relative z-10">
        <div className="text-center mb-5">
          <div className="inline-block bg-yellow-500/10 border border-yellow-500/40 px-3 py-0.5 rounded-full text-xs font-mono text-yellow-400 uppercase mb-2">
            {t.lobbyBadge}
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
            {t.lobbyTitle}
          </h2>
        </div>

        {/* Trainer Profile Card */}
        <div className="mb-5 bg-slate-950/80 p-3.5 rounded-2xl border border-yellow-500/30 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3 flex-grow">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black text-base shadow-md">
              {username ? username.charAt(0).toUpperCase() : 'T'}
            </div>
            <div className="flex-grow">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider block mb-0.5">
                {t.trainerNameLabel}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 16);
                  setUsername(val);
                  localStorage.setItem('pkmn_trainer_name', val);
                }}
                placeholder={t.trainerNamePlaceholder}
                className="w-full bg-slate-900 text-yellow-300 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-yellow-400 transition"
              />
            </div>
          </div>
          {isRoomConnected && (
            <div className="text-right pl-3 border-l border-slate-800 flex-shrink-0">
              <div className="text-[10px] text-gray-400 font-bold">{t.opponentLabel}</div>
              <div className="text-xs font-black text-blue-400">{opponentUsername}</div>
            </div>
          )}
        </div>

        {/* NOT CONNECTED TO ROOM YET: CREATE OR JOIN TABS */}
        {!isRoomConnected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => {
                  setTab('create');
                  setError('');
                }}
                className={`py-2 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 ${
                  tab === 'create'
                    ? 'bg-yellow-500 text-slate-950 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" /> {t.createRoomTab}
              </button>
              <button
                onClick={() => {
                  setTab('join');
                  setError('');
                }}
                className={`py-2 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 ${
                  tab === 'join'
                    ? 'bg-yellow-500 text-slate-950 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Play className="w-4 h-4" /> {t.joinRoomTab}
              </button>
            </div>

            {/* Select Your Deck with Random Button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold tracking-wider text-yellow-400">
                  {t.yourDeck}
                </label>
                <button
                  type="button"
                  onClick={handleRandomizeLobbyDeck}
                  className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow active:scale-95 cursor-pointer"
                  title={lang === 'tr' ? 'Rastgele bir deste seç' : 'Pick a random deck'}
                >
                  <Dices className="w-3 h-3" />
                  <span>{t.randomDeck || (lang === 'tr' ? '🎲 Rastgele' : '🎲 Random')}</span>
                </button>
              </div>
              <select
                value={selectedDeckId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedDeckId(val);
                  if (isRoomConnected && net.role === 'guest') {
                    const customObj = savedCustomDecks.find(d => d.id === val);
                    net.sendMessage('JOIN_REQUEST', {
                      deckId: val,
                      customCardIds: customObj ? customObj.cardIds : undefined,
                      customDeckName: customObj ? customObj.name : undefined,
                      username
                    });
                  }
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
              >
                {savedCustomDecks.length > 0 && (
                  <optgroup label={t.customDecksGroup || (lang === 'tr' ? '✨ Özel Desteleriniz' : '✨ Your Custom Decks')}>
                    {savedCustomDecks.map(d => (
                      <option key={d.id} value={d.id}>✨ {d.name} ({d.cardIds.length} {t.deckCount || 'Kart'})</option>
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

            {/* CREATE ROOM CONTENT */}
            {tab === 'create' && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold tracking-wider text-gray-300 mb-1.5">
                    {t.prizeCardsFormat}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { count: 6, label: t.prizes6Standard },
                      { count: 4, label: t.prizes4Quick },
                      { count: 2, label: t.prizes2Practice }
                    ].map(p => (
                      <button
                        key={p.count}
                        type="button"
                        onClick={() => setPrizeCount(p.count)}
                        className={`py-2 px-1 text-xs font-bold rounded-xl border transition ${
                          prizeCount === p.count
                            ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow'
                            : 'bg-slate-800 text-gray-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {!roomCode ? (
                  <button
                    onClick={handleCreateRoom}
                    disabled={isConnecting}
                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black text-sm py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Users className="w-4 h-4" /> {t.generateOnlineRoom}
                  </button>
                ) : (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/40 rounded-2xl space-y-3 animate-fade-in text-center">
                    <div className="text-xs text-yellow-300 font-bold">{t.shareRoomCode}</div>
                    <div className="text-3xl font-mono font-black tracking-widest text-yellow-400 bg-slate-950/80 py-2 px-4 rounded-xl border border-yellow-500/50 inline-block">
                      {roomCode}
                    </div>

                    <div>
                      <button
                        onClick={copyRoomLink}
                        className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 mx-auto transition shadow"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? t.linkCopied : t.copyDirectLink}
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-400 animate-pulse flex items-center justify-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-400" />
                      {t.waitingOpponent}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* JOIN ROOM CONTENT */}
            {tab === 'join' && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold tracking-wider text-yellow-400 mb-1.5">
                    {t.enterRoomCode}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PIKA-42"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-base font-mono font-bold text-yellow-300 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center"
                  />
                </div>

                <button
                  onClick={handleJoinRoom}
                  disabled={!roomCode.trim() || isConnecting}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-slate-950 font-black text-sm py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> {t.connectingToRoom}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" /> {t.joinMatchBtn}
                    </>
                  )}
                </button>
              </div>
            )}

            {status && !error && <div className="text-xs text-yellow-300 text-center mt-2 animate-pulse">{status}</div>}
            {error && <div className="text-xs text-red-400 text-center mt-2 font-semibold bg-red-950/40 p-2 rounded-lg border border-red-800">{error}</div>}
          </div>
        )}

        {/* CONNECTED ROOM LOBBY SCREEN */}
        {isRoomConnected && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs">
              <div>
                <span className="text-gray-400 font-mono">{t.roomCodeLabel}</span>
                <span className="font-mono font-black text-yellow-400 ml-2 text-sm">{roomCode}</span>
              </div>
              <div className="flex items-center gap-1.5 text-green-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
                {t.bothConnected}
              </div>
            </div>

            {/* Players Roster */}
            <div className="grid grid-cols-2 gap-3">
              {/* Host Card */}
              <div className="bg-slate-800/90 border border-yellow-500/40 p-3.5 rounded-2xl text-center">
                <div className="text-[10px] font-bold text-yellow-400 tracking-wider mb-1">
                  {t.hostPlayer1} {net.role === 'host' ? t.youLabel : ''}
                </div>
                <div className="text-sm font-black text-white truncate">
                  {PREBUILT_DECKS.find(d => d.id === (net.role === 'host' ? selectedDeckId : hostDeckId))?.name || t.customDeckDefault}
                </div>
                <div className="mt-2 inline-block bg-green-900/60 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded border border-green-700">
                  {t.readyBadge}
                </div>
              </div>

              {/* Guest Card */}
              <div className="bg-slate-800/90 border border-blue-500/40 p-3.5 rounded-2xl text-center">
                <div className="text-[10px] font-bold text-blue-400 tracking-wider mb-1">
                  {t.guestPlayer2} {net.role === 'guest' ? t.youLabel : ''}
                </div>
                <div className="text-sm font-black text-white truncate">
                  {PREBUILT_DECKS.find(d => d.id === (net.role === 'guest' ? selectedDeckId : guestDeckId))?.name || t.customDeckDefault}
                </div>
                <div className="mt-2 inline-block bg-green-900/60 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded border border-green-700">
                  {t.readyBadge}
                </div>
              </div>
            </div>

            {/* In-Lobby Quick Chat */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 h-32 flex flex-col justify-between">
              <div className="overflow-y-auto space-y-1 text-xs pr-1">
                {chatMessages.length === 0 ? (
                  <div className="text-gray-500 text-[11px] text-center pt-4">{t.sayHello}</div>
                ) : (
                  chatMessages.map((m, i) => (
                    <div key={i} className="leading-tight">
                      <span className={`font-bold ${m.sender === username || m.sender === 'You' ? 'text-yellow-400' : 'text-blue-400'}`}>
                        {m.sender === 'You' ? t.youLabel : m.sender}:
                      </span>{' '}
                      <span className="text-gray-200">{m.text}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder={t.quickMessagePlaceholder}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={sendChat}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-lg text-xs"
                >
                  {t.sendBtn}
                </button>
              </div>
            </div>

            {/* Host Start Game Button / Guest Waiting message */}
            {net.role === 'host' ? (
              <button
                onClick={handleHostStartGame}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black text-base py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer animate-pulse"
              >
                <Play className="w-5 h-5 fill-current" /> {t.startOnlineMatchBtn}
              </button>
            ) : (
              <div className="p-3 bg-blue-950/40 border border-blue-700/50 rounded-xl text-center text-xs text-blue-300 animate-pulse font-semibold">
                {t.waitingHostStart}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
