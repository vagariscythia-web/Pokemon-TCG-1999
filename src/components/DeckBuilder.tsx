import { Language, TRANSLATIONS } from '../i18n/translations';
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Card, EnergyType } from '../types/game';
import cardsData from '../data/cards.json';
import { PREBUILT_DECKS, buildDeckFromList } from '../data/decks';
import { CardView } from './CardView';
import { CardZoomModal } from './CardZoomModal';
import { getCardLevel } from '../utils/cardLevels';
import {
  Search, Plus, Minus, Trash2, ArrowLeft, Save, Sparkles, Filter, Layers,
  LayoutGrid, List, Download, Upload, Copy, Check, Eye, FolderOpen, PlusCircle,
  GripVertical, RotateCcw
} from 'lucide-react';
import {
  loadSavedCustomDecks,
  saveCustomDeck,
  deleteCustomDeck,
  exportCustomDeckToFile,
  exportCustomDeckToJson,
  importCustomDeckFromJson,
  SavedCustomDeck,
  convertCardIdsToCards
} from '../utils/customDeckStorage';

interface DeckBuilderProps {
  onBack: () => void;
  onSelectDeck: (deck: Card[]) => void;
  uiScale?: number;
  onChangeUiScale?: (scale: number) => void;
  lang?: Language;
  onChangeLang?: (lang: Language) => void;
}

// Canonical comparator for sorting custom deck:
// 1. Pokémon (by Level descending, then name A-Z)
// 2. Trainer cards (name A-Z)
// 3. Energy cards (Special Energy first, then basic energy)
const compareCardsByLevel = (a: Card, b: Card): number => {
  const supertypeOrder: Record<string, number> = { 'Pokemon': 1, 'Trainer': 2, 'Energy': 3 };
  const typeDiff = (supertypeOrder[a.supertype] || 9) - (supertypeOrder[b.supertype] || 9);
  if (typeDiff !== 0) return typeDiff;

  if (a.supertype === 'Pokemon' && b.supertype === 'Pokemon') {
    const lvlA = getCardLevel(a);
    const lvlB = getCardLevel(b);
    if (lvlB !== lvlA) return lvlB - lvlA; // Level descending (e.g. Venusaur Lv. 67 before Gyarados Lv. 41)
  }

  return a.name.localeCompare(b.name);
};

// Layout width constraints:
// Default: Gallery 55%, Custom Deck 45%
// Custom Deck can expand moderately up to 51% (Gallery shrinks down to 49%)
// Custom Deck cannot shrink below 45% (Gallery cannot exceed 55%)
const DEFAULT_GALLERY_WIDTH_PCT = 55;
const MIN_GALLERY_WIDTH_PCT = 49;
const MAX_GALLERY_WIDTH_PCT = 55;

export const DeckBuilder: React.FC<DeckBuilderProps> = ({
  onBack,
  onSelectDeck,
  uiScale = 1.15,
  onChangeUiScale,
  lang = 'tr',
  onChangeLang
}) => {
  const t = TRANSLATIONS[lang];
  const allCards = cardsData as Card[];

  // Saved custom decks from storage
  const [savedDecks, setSavedDecks] = useState<SavedCustomDeck[]>(() => loadSavedCustomDecks());
  const [currentDeckId, setCurrentDeckId] = useState<string | undefined>(() => {
    const saved = loadSavedCustomDecks();
    return saved.length > 0 ? saved[0].id : undefined;
  });

  // Current deck in builder
  const [deck, setDeck] = useState<Card[]>(() => {
    const saved = loadSavedCustomDecks();
    if (saved.length > 0) {
      const loaded = convertCardIdsToCards(saved[0].cardIds);
      if (loaded.length > 0) return loaded;
    }
    return buildDeckFromList(PREBUILT_DECKS[0].cards);
  });

  const [deckName, setDeckName] = useState<string>(() => {
    const saved = loadSavedCustomDecks();
    return saved.length > 0 ? saved[0].name : 'My Custom Deck';
  });

  const [viewMode, setViewMode] = useState<'visual' | 'list'>('visual');
  const [searchTerm, setSearchTerm] = useState('');
  const [setFilter, setSetFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [supertypeFilter, setSupertypeFilter] = useState<string>('ALL');
  const [zoomedCard, setZoomedCard] = useState<Card | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Splitter: Gallery width % (bounded between 49% and 55%)
  const [leftWidthPct, setLeftWidthPct] = useState<number>(() => {
    const saved = localStorage.getItem('pkmn_deckbuilder_split_pct');
    return saved
      ? Math.max(MIN_GALLERY_WIDTH_PCT, Math.min(MAX_GALLERY_WIDTH_PCT, parseFloat(saved)))
      : DEFAULT_GALLERY_WIDTH_PCT;
  });
  const [isResizing, setIsResizing] = useState(false);
  const mainSplitRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Drag splitter resize handlers (allows dragging to the left to expand custom deck up to limit)
  const handleMouseDownResize = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isResizing || !mainSplitRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const rect = mainSplitRef.current.getBoundingClientRect();
      const newPct = ((clientX - rect.left) / rect.width) * 100;
      // Constraint: Gallery cannot exceed 55%, can shrink down to 49% (Custom deck expands from 45% up to 51%)
      const clamped = Math.max(MIN_GALLERY_WIDTH_PCT, Math.min(MAX_GALLERY_WIDTH_PCT, newPct));
      setLeftWidthPct(clamped);
      localStorage.setItem('pkmn_deckbuilder_split_pct', clamped.toFixed(1));
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isResizing]);

  // Reset layout / view to default
  const handleResetLayout = () => {
    setLeftWidthPct(DEFAULT_GALLERY_WIDTH_PCT);
    localStorage.removeItem('pkmn_deckbuilder_split_pct');
    showToast(t.resetViewSuccess || (lang === 'tr' ? 'Görünüm varsayılana sıfırlandı!' : 'View reset to default!'));
  };

  // Filter cards in left-hand browser
  const filteredCards = useMemo(() => {
    return allCards.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.attacks?.some(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSet = setFilter === 'ALL' || c.set === setFilter || c.setCode === setFilter;
      const matchesType = typeFilter === 'ALL' || (c.types && c.types.includes(typeFilter as EnergyType));
      const matchesSupertype = supertypeFilter === 'ALL' || c.supertype === supertypeFilter;
      return matchesSearch && matchesSet && matchesType && matchesSupertype;
    });
  }, [allCards, searchTerm, setFilter, typeFilter, supertypeFilter]);

  // Card count in current deck
  const getCardCountInDeck = (cardName: string) => {
    return deck.filter(c => c.name.toLowerCase() === cardName.toLowerCase()).length;
  };

  // Add card to deck (max 60, max 4 copies unless basic energy)
  const addCardToDeck = (card: Card) => {
    if (deck.length >= 60) {
      showToast(lang === 'tr' ? 'Deste 60 kart limitine ulaştı!' : 'Deck reached 60 cards limit!');
      return;
    }
    const currentCount = getCardCountInDeck(card.name);
    const isBasicEnergy = (card.supertype === 'Energy' && card.subtype === 'Basic Energy') ||
                          (card.number >= 97 && card.number <= 102 && card.set === 'Base Set');
    if (!isBasicEnergy && currentCount >= 4) {
      showToast(lang === 'tr' ? 'Aynı karttan en fazla 4 adet eklenebilir!' : 'Max 4 copies allowed per card!');
      return;
    }

    setDeck(prev => [...prev, { ...card }]);
  };

  // Remove single copy of card by card id
  const removeOneCopy = (cardId: string) => {
    setDeck(prev => {
      const idx = prev.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        const next = [...prev];
        next.splice(idx, 1);
        return next;
      }
      return prev;
    });
  };

  // Remove all copies of a card
  const removeAllCopies = (cardId: string) => {
    setDeck(prev => prev.filter(c => c.id !== cardId));
  };

  // Stacked representation of cards in custom deck (sorted by Level descending)
  const stackedDeck = useMemo(() => {
    const map = new Map<string, { card: Card; count: number; indices: number[] }>();
    deck.forEach((c, idx) => {
      const existing = map.get(c.id);
      if (existing) {
        existing.count++;
        existing.indices.push(idx);
      } else {
        map.set(c.id, { card: c, count: 1, indices: [idx] });
      }
    });

    return Array.from(map.values()).sort((a, b) => compareCardsByLevel(a.card, b.card));
  }, [deck]);

  // List view cards sorted by Level descending
  const sortedDeckForList = useMemo(() => {
    return [...deck].sort(compareCardsByLevel);
  }, [deck]);

  // Load preset theme deck
  const loadPreset = (presetId: string) => {
    const found = PREBUILT_DECKS.find(p => p.id === presetId);
    if (found) {
      const newCards = buildDeckFromList(found.cards);
      setDeck(newCards);
      setDeckName(found.name);
      setCurrentDeckId(undefined);
      showToast(lang === 'tr' ? `${found.name} hazır destesi yüklendi!` : `Loaded ${found.name}!`);
    }
  };

  // Load a saved custom deck
  const loadCustomDeckById = (id: string) => {
    const found = savedDecks.find(d => d.id === id);
    if (found) {
      const loadedCards = convertCardIdsToCards(found.cardIds);
      setDeck(loadedCards);
      setDeckName(found.name);
      setCurrentDeckId(found.id);
      showToast(lang === 'tr' ? `${found.name} yüklendi!` : `Loaded ${found.name}!`);
    }
  };

  // Save current deck to localStorage
  const handleSaveDeck = () => {
    if (deck.length === 0) {
      showToast(lang === 'tr' ? 'Boş deste kaydedilemez!' : 'Cannot save empty deck!');
      return;
    }
    const saved = saveCustomDeck(deckName, deck, currentDeckId);
    setSavedDecks(loadSavedCustomDecks());
    setCurrentDeckId(saved.id);
    showToast(t.deckSavedSuccess || 'Deste başarıyla kaydedildi!');
  };

  // Create brand new deck
  const handleNewDeck = () => {
    setDeck([]);
    setDeckName(lang === 'tr' ? 'Yeni Özel Deste' : 'New Custom Deck');
    setCurrentDeckId(undefined);
    showToast(lang === 'tr' ? 'Yeni boş deste oluşturuldu!' : 'New empty deck created!');
  };

  // Delete saved deck
  const handleDeleteCurrentSavedDeck = () => {
    if (!currentDeckId) {
      setDeck([]);
      return;
    }
    deleteCustomDeck(currentDeckId);
    const updated = loadSavedCustomDecks();
    setSavedDecks(updated);
    if (updated.length > 0) {
      loadCustomDeckById(updated[0].id);
    } else {
      handleNewDeck();
    }
    showToast(lang === 'tr' ? 'Deste silindi.' : 'Deck deleted.');
  };

  // Export to file
  const handleExportToFile = () => {
    exportCustomDeckToFile(deckName, deck);
    showToast(lang === 'tr' ? 'Deste dosyası indirildi (.json)!' : 'Deck file downloaded (.json)!');
  };

  // Copy deck JSON to clipboard
  const handleCopyDeck = () => {
    const jsonStr = exportCustomDeckToJson(deckName, deck);
    navigator.clipboard.writeText(jsonStr);
    showToast(lang === 'tr' ? 'Deste verisi panoya kopyalandı!' : 'Deck copied to clipboard!');
  };

  // Import deck from uploaded JSON file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = importCustomDeckFromJson(content);
      if (imported && imported.deck.length > 0) {
        setDeck(imported.deck);
        setDeckName(imported.name);
        setCurrentDeckId(undefined);
        showToast(t.deckImportSuccess || 'Deste başarıyla içe aktarıldı!');
      } else {
        showToast(t.invalidDeckFile || 'Geçersiz deste dosyası!');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  // Deck statistics
  const pokemonCount = deck.filter(c => c.supertype === 'Pokemon').length;
  const trainerCount = deck.filter(c => c.supertype === 'Trainer').length;
  const energyCount = deck.filter(c => c.supertype === 'Energy').length;

  return (
    <div className="h-screen w-full max-w-full bg-slate-950 text-white p-2 sm:p-3 flex flex-col select-none overflow-hidden box-border">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-yellow-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce border-2 border-yellow-300">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".json,application/json"
        className="hidden"
      />

      {/* 1. TOP HEADER - Fixed Standard Scale */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-yellow-500/30 pb-2 mb-2 shrink-0 w-full">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer text-xs sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-yellow-400 tracking-wider flex items-center gap-1.5">
              <Layers className="w-5 h-5 text-yellow-400" />
              {t.deckBuilderTitle}
            </h1>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              {lang === 'tr'
                ? `${allCards.length} Kart • Sürükle-Bırak Destekli • Seviye Sıralamalı • Genişletilebilir Özel Deste`
                : `${allCards.length} Cards • Drag & Drop • Level Sorted • Expandable Custom Deck`}
            </p>
          </div>
        </div>

        {/* Top Controls: Preset Selector, Reset View, Scale, Language, Play Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Görünümü Sıfırla (Reset View to Default) */}
          <button
            onClick={handleResetLayout}
            className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-gray-300 hover:text-yellow-400 text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow transition cursor-pointer"
            title={t.resetView || (lang === 'tr' ? 'Varsayılan Görünümü Geri Yükle' : 'Reset View to Default')}
          >
            <RotateCcw className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden md:inline">{t.resetView || (lang === 'tr' ? 'Görünümü Sıfırla' : 'Reset View')}</span>
          </button>

          {/* Display Scale (100%, 115%, 125%) */}
          {onChangeUiScale && (
            <div className="hidden md:flex bg-slate-900/90 border border-slate-700 rounded-xl px-2 py-1 items-center gap-1 text-[11px] font-bold shadow">
              <span className="text-gray-400 mr-0.5">🔍</span>
              {[1.0, 1.15, 1.25].map(scale => (
                <button
                  key={scale}
                  onClick={() => onChangeUiScale(scale)}
                  className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                    Math.abs(uiScale - scale) < 0.05
                      ? 'bg-yellow-500 text-slate-950 shadow font-black'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {Math.round(scale * 100)}%
                </button>
              ))}
            </div>
          )}

          {/* Language Switcher */}
          {onChangeLang && (
            <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-0.5 flex items-center text-[10px] font-bold shadow">
              <button
                onClick={() => onChangeLang('tr')}
                className={`px-2 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                  lang === 'tr' ? 'bg-red-600 text-white shadow font-black' : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Türkçe"
              >
                <span>🇹🇷</span> TR
              </button>
              <button
                onClick={() => onChangeLang('en')}
                className={`px-2 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                  lang === 'en' ? 'bg-blue-600 text-white shadow font-black' : 'text-gray-400 hover:text-gray-200'
                }`}
                title="English"
              >
                <span>🇬🇧</span> EN
              </button>
            </div>
          )}

          {/* Preset Theme Selector */}
          <select
            onChange={(e) => loadPreset(e.target.value)}
            defaultValue=""
            className="bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer max-w-[150px] sm:max-w-none truncate"
          >
            <option value="" disabled>{t.loadThemeDeck}</option>
            {PREBUILT_DECKS.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Play with deck button */}
          <button
            onClick={() => {
              handleSaveDeck();
              onSelectDeck(deck);
            }}
            disabled={deck.length !== 60}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm shadow-xl flex items-center gap-1.5 transition cursor-pointer ${
              deck.length === 60
                ? 'bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-slate-950 animate-pulse shadow-yellow-500/20'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" /> {t.playWithThisDeck}
          </button>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
        {/* Set Filter Pills Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-thin shrink-0">
          {[
            { id: 'ALL', label: lang === 'tr' ? `Tüm Setler (${allCards.length})` : `All Sets (${allCards.length})` },
            { id: 'Base Set', label: 'Base Set (102)' },
            { id: 'Jungle', label: 'Jungle (64)' },
            { id: 'Fossil', label: 'Fossil (62)' },
            { id: 'Base Set 2', label: 'Base Set 2 (130)' },
            { id: 'Team Rocket', label: 'Team Rocket (83)' }
          ].map(setTab => (
            <button
              key={setTab.id}
              onClick={() => setSetFilter(setTab.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                setFilter === setTab.id
                  ? 'bg-yellow-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700'
              }`}
            >
              {setTab.label}
            </button>
          ))}
        </div>

        {/* Main Resizable Workspace Splitter Container */}
        <div
          ref={mainSplitRef}
          className="flex-1 flex flex-col lg:flex-row min-h-0 w-full max-w-full relative overflow-hidden"
        >
          {/* Left Column: Card Browser */}
          <div
            style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${leftWidthPct}%` : '100%' }}
            className="h-full flex flex-col bg-slate-900/70 p-3 pl-3.5 pr-2.5 rounded-2xl border border-slate-800 shadow-xl min-w-0 overflow-hidden shrink-0 box-border"
          >
            {/* Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2.5 shrink-0">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder={t.searchCardsPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800/90 pl-9 pr-8 py-1.5 rounded-xl text-xs border border-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 w-4 h-4 rounded-full bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white flex items-center justify-center text-[10px] font-black transition cursor-pointer"
                    title={lang === 'tr' ? 'Aramayı Temizle' : 'Clear Search'}
                  >
                    ✕
                  </button>
                )}
              </div>
              <select
                value={supertypeFilter}
                onChange={(e) => setSupertypeFilter(e.target.value)}
                className="bg-slate-800/90 text-xs px-2.5 py-1.5 rounded-xl border border-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">{t.allCardTypes}</option>
                <option value="Pokemon">Pokémon</option>
                <option value="Trainer">Trainers</option>
                <option value="Energy">Energy Cards</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-800/90 text-xs px-2.5 py-1.5 rounded-xl border border-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">{t.allElements}</option>
                <option value="Grass">Grass</option>
                <option value="Fire">Fire</option>
                <option value="Water">Water</option>
                <option value="Lightning">Lightning</option>
                <option value="Psychic">Psychic</option>
                <option value="Fighting">Fighting</option>
                <option value="Colorless">Colorless</option>
              </select>
            </div>

            {/* Card Gallery Grid - Dynamic Auto-Fill Column Wrap (Cards never cut off on the left) */}
            <div style={{ zoom: uiScale }} className="flex-1 overflow-y-auto min-h-0 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2.5 sm:gap-3 p-2 pt-3 pl-3 pr-2 scrollbar-thin content-start min-w-0 justify-items-center">
              {filteredCards.map((card) => {
                const inDeckCount = getCardCountInDeck(card.name);
                const isBasicEnergy = (card.supertype === 'Energy' && card.subtype === 'Basic Energy') ||
                                      (card.number >= 97 && card.number <= 102 && card.set === 'Base Set');
                const isMaxed = !isBasicEnergy && inDeckCount >= 4;

                return (
                  <div
                    key={card.id}
                    draggable={!isMaxed && deck.length < 60}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify(card));
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    className="flex flex-col items-center group relative cursor-grab active:cursor-grabbing hover:scale-105 transition-transform w-full max-w-[114px]"
                  >
                    <CardView
                      card={card}
                      size="sm"
                      onClick={() => addCardToDeck(card)}
                      onInspect={() => setZoomedCard(card)}
                    />
                    <div className="text-[10px] text-center font-bold text-gray-200 mt-1 truncate w-20">
                      {card.name}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[9px] text-amber-400 font-mono">
                        {card.set === 'Jungle' ? 'JU' : card.set === 'Fossil' ? 'FO' : card.set === 'Base Set 2' ? 'B2' : card.set === 'Team Rocket' ? 'TR' : 'BS'} #{card.number}
                      </span>
                      <span className={`text-[9px] px-1 rounded font-bold ${
                        isMaxed ? 'bg-red-900/80 text-red-300' :
                        inDeckCount > 0 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-400'
                      }`}>
                        {inDeckCount}{isBasicEnergy ? '' : '/4'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Draggable Splitter Handle */}
          <div
            onMouseDown={handleMouseDownResize}
            onTouchStart={handleMouseDownResize}
            className={`hidden lg:flex items-center justify-center w-2.5 hover:w-3 cursor-col-resize select-none z-30 transition-all px-0.5 shrink-0 ${
              isResizing ? 'bg-yellow-500/20' : 'bg-transparent'
            }`}
            title={lang === 'tr' ? 'Özel desteyi genişletmek için sola sürükleyin' : 'Drag left to expand custom deck'}
          >
            <div className={`w-1 h-14 rounded-full transition-all flex items-center justify-center ${
              isResizing ? 'bg-yellow-400 shadow-[0_0_10px_#facc15] h-20 w-1.5' : 'bg-slate-700 hover:bg-yellow-500'
            }`}>
              <GripVertical className="w-2.5 h-2.5 text-slate-400 opacity-60 hover:opacity-100" />
            </div>
          </div>

          {/* Right Column: Custom Deck Panel */}
          <div
            style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `calc(${100 - leftWidthPct}% - 10px)` : '100%' }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
              setIsDraggingOver(true);
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingOver(false);
              try {
                const json = e.dataTransfer.getData('application/json');
                if (json) {
                  const card = JSON.parse(json);
                  addCardToDeck(card);
                }
              } catch (err) {
                console.error('Drop error:', err);
              }
            }}
            className={`h-full flex flex-col bg-slate-900/90 p-3 rounded-2xl border transition shadow-2xl min-w-0 max-w-full overflow-hidden shrink-0 box-border ${
              isDraggingOver
                ? 'border-yellow-400 ring-4 ring-yellow-400/30 bg-yellow-950/20'
                : 'border-yellow-500/40'
            }`}
          >
            {/* Deck Name & Persistence Header */}
            <div className="border-b border-slate-700/80 pb-2 mb-2 shrink-0 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
                {/* Editable Deck Name Input */}
                <input
                  type="text"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  placeholder={t.customDeckDefault || 'Custom Deck'}
                  className="bg-slate-800 text-yellow-300 font-black text-base px-2.5 py-1 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-yellow-500 flex-1 min-w-0 truncate"
                />

                {/* View Toggle: Visual (Thumbnails) vs List */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-0.5 flex items-center text-xs shrink-0">
                  <button
                    onClick={() => setViewMode('visual')}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold transition cursor-pointer ${
                      viewMode === 'visual'
                        ? 'bg-yellow-500 text-slate-950 shadow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title={t.visualView || 'Visual View'}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.visualView || 'Görsel'}</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold transition cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-yellow-500 text-slate-950 shadow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title={t.listView || 'List View'}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.listView || 'Liste'}</span>
                  </button>
                </div>
              </div>

              {/* Deck Management Bar: Saved Decks, Save, New, Import/Export */}
              <div className="flex items-center justify-between gap-1.5 flex-wrap text-xs min-w-0">
                {/* Saved Decks Select */}
                {savedDecks.length > 0 && (
                  <div className="flex items-center gap-1 min-w-0">
                    <FolderOpen className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    <select
                      value={currentDeckId || ''}
                      onChange={(e) => loadCustomDeckById(e.target.value)}
                      className="bg-slate-800 text-[11px] text-gray-200 px-2 py-1 rounded-lg border border-slate-700 focus:outline-none cursor-pointer max-w-[120px] truncate"
                    >
                      <option value="" disabled>{t.savedDecks || 'Saved Decks'}</option>
                      {savedDecks.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Action Buttons: Save, New, Export, Import, Clear */}
                <div className="flex items-center gap-1.5 flex-wrap ml-auto">
                  <button
                    onClick={handleSaveDeck}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow transition cursor-pointer"
                    title={t.saveDeck || 'Desteyi Kaydet'}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{t.saveDeck || 'Kaydet'}</span>
                  </button>

                  <button
                    onClick={handleNewDeck}
                    className="bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-[11px] px-2 py-1 rounded-lg flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                    title={t.newDeck || 'Yeni Deste'}
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span className="hidden sm:inline">{t.newDeck || 'Yeni'}</span>
                  </button>

                  <button
                    onClick={handleExportToFile}
                    className="bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-[11px] px-2 py-1 rounded-lg flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                    title={t.exportDeck || 'Dışa Aktar'}
                  >
                    <Download className="w-3.5 h-3.5 text-yellow-400" />
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-[11px] px-2 py-1 rounded-lg flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                    title={t.importDeck || 'İçe Aktar'}
                  >
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  </button>

                  <button
                    onClick={handleCopyDeck}
                    className="bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-[11px] px-2 py-1 rounded-lg flex items-center gap-1 border border-slate-700 transition cursor-pointer"
                    title={t.copyDeck || 'Kopyala'}
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <button
                    onClick={() => setDeck([])}
                    className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-950/40 px-2 py-1 rounded-lg border border-red-800/60 transition cursor-pointer"
                    title={t.clearDeck}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Deck Stats Bar */}
              <div className="flex items-center justify-between text-xs mt-1.5 font-mono text-gray-300 min-w-0">
                <span className={`font-black ${deck.length === 60 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                  {deck.length}/60 {t.deckCount || 'Cards'}
                </span>
                <div className="flex gap-2 text-[11px] truncate">
                  <span className="text-amber-300">PKMN: {pokemonCount}</span>
                  <span className="text-blue-300">TRN: {trainerCount}</span>
                  <span className="text-emerald-300">ENG: {energyCount}</span>
                  <span className="text-gray-400">({stackedDeck.length} {t.uniqueCards || 'Unique'})</span>
                </div>
              </div>
            </div>

            {/* Drag & Drop Hint Dropzone Area */}
            {deck.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-700 rounded-xl text-gray-400 my-auto">
                <Layers className="w-12 h-12 text-slate-600 mb-2 animate-pulse" />
                <p className="text-xs font-semibold text-gray-300">{t.deckIsEmpty}</p>
                <p className="text-[11px] text-gray-500 mt-1">{t.dragDropNotice}</p>
              </div>
            ) : viewMode === 'visual' ? (
              /* ======================================================== */
              /* 1. VISUAL THUMBNAIL / STACKED VIEW (Sorted by Level)     */
              /* ======================================================== */
              <div style={{ zoom: uiScale }} className="flex-1 overflow-y-auto min-h-0 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2.5 sm:gap-3 p-2.5 pt-3 pl-3 pr-3 scrollbar-thin content-start min-w-0 justify-items-center">
                {stackedDeck.map(({ card, count }) => {
                  const isBasicEnergy = (card.supertype === 'Energy' && card.subtype === 'Basic Energy') ||
                                        (card.number >= 97 && card.number <= 102 && card.set === 'Base Set');
                  const canAddMore = (isBasicEnergy || count < 4) && deck.length < 60;
                  const cardLevel = getCardLevel(card);

                  return (
                    <div
                      key={card.id}
                      className="relative flex flex-col items-center group bg-slate-800/40 p-1.5 rounded-xl border border-slate-700/60 transition w-full max-w-[114px]"
                    >
                      {/* Visual Card Stack Overlap Fan Layers */}
                      <div className="relative">
                        {count > 2 && (
                          <div className="absolute inset-0 bg-slate-700 rounded-md border border-slate-600 transform translate-x-1.5 -translate-y-1.5 opacity-60 pointer-events-none" />
                        )}
                        {count > 1 && (
                          <div className="absolute inset-0 bg-slate-800 rounded-md border border-slate-600 transform translate-x-1 -translate-y-1 opacity-80 pointer-events-none" />
                        )}

                        {/* Main Front Card Thumbnail */}
                        <CardView
                          card={card}
                          size="sm"
                          onClick={() => addCardToDeck(card)}
                          onInspect={() => setZoomedCard(card)}
                        />

                        {/* Compact Stacked Count Badge (Inset top-right, avoids horizontal overflow) */}
                        <div className="absolute -top-1.5 -right-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-black text-[9px] px-1 min-w-[17px] h-[17px] rounded-full shadow-md border border-yellow-200 z-20 pointer-events-none flex items-center justify-center">
                          ×{count}
                        </div>
                      </div>

                      {/* Card Title & Level */}
                      <div className="text-[10px] text-center font-bold text-gray-200 mt-1.5 truncate w-20">
                        {card.name}
                      </div>
                      {card.supertype === 'Pokemon' ? (
                        <div className="text-[9px] text-amber-400 font-mono font-bold">
                          Lv. {cardLevel}
                        </div>
                      ) : (
                        <div className="text-[9px] text-gray-400 font-mono">
                          {card.supertype}
                        </div>
                      )}

                      {/* Quick Quantity Control Toolbar (+, -, Trash, Inspect) */}
                      <div className="flex items-center gap-1 mt-1 bg-slate-900/90 rounded-lg p-0.5 border border-slate-700">
                        <button
                          onClick={() => removeOneCopy(card.id)}
                          className="p-1 hover:bg-slate-700 text-red-400 rounded transition cursor-pointer"
                          title={lang === 'tr' ? '1 Adet Çıkar' : 'Remove 1'}
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => addCardToDeck(card)}
                          disabled={!canAddMore}
                          className="p-1 hover:bg-slate-700 text-emerald-400 disabled:opacity-30 rounded transition cursor-pointer"
                          title={lang === 'tr' ? '1 Adet Ekle' : 'Add 1'}
                        >
                          <Plus className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => setZoomedCard(card)}
                          className="p-1 hover:bg-slate-700 text-blue-400 rounded transition cursor-pointer"
                          title={lang === 'tr' ? 'İncele' : 'Inspect'}
                        >
                          <Eye className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => removeAllCopies(card.id)}
                          className="p-1 hover:bg-slate-700 text-gray-400 hover:text-red-400 rounded transition cursor-pointer"
                          title={lang === 'tr' ? 'Tümünü Çıkar' : 'Remove All'}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ======================================================== */
              /* 2. TEXT / COMPACT LIST VIEW (Sorted by Level)            */
              /* ======================================================== */
              <div style={{ zoom: uiScale }} className="flex-1 overflow-y-auto min-h-0 space-y-1 pr-1 scrollbar-thin min-w-0">
                {sortedDeckForList.map((card, index) => (
                  <div
                    key={`${card.id}-${index}`}
                    className="flex items-center justify-between bg-slate-800/80 hover:bg-slate-750 px-2.5 py-1.5 rounded-xl border border-slate-700 text-xs transition min-w-0"
                  >
                    <div
                      onClick={() => setZoomedCard(card)}
                      className="flex items-center gap-2 truncate cursor-pointer flex-1 min-w-0"
                    >
                      <span className="text-[10px] text-gray-400 font-mono w-4 shrink-0">{index + 1}</span>
                      <span className="font-semibold text-gray-100 truncate hover:text-yellow-300">{card.name}</span>
                      {card.supertype === 'Pokemon' && (
                        <span className="text-[10px] text-amber-400 font-mono font-bold shrink-0">
                          Lv. {getCardLevel(card)}
                        </span>
                      )}
                      <span className="text-[9px] text-gray-400 font-mono shrink-0">
                        ({card.set === 'Jungle' ? 'JU' : card.set === 'Fossil' ? 'FO' : card.set === 'Base Set 2' ? 'B2' : card.set === 'Team Rocket' ? 'TR' : 'BS'} #{card.number})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        card.supertype === 'Pokemon' ? 'bg-amber-900/60 text-amber-300' :
                        card.supertype === 'Trainer' ? 'bg-blue-900/60 text-blue-300' :
                        'bg-emerald-900/60 text-emerald-300'
                      }`}>
                        {card.supertype}
                      </span>
                      <button
                        onClick={() => removeOneCopy(card.id)}
                        className="text-red-400 hover:text-red-300 p-1 hover:bg-red-950/40 rounded transition cursor-pointer"
                        title={lang === 'tr' ? 'Çıkar' : 'Remove'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Zoom Modal */}
      <CardZoomModal
        card={zoomedCard}
        onClose={() => setZoomedCard(null)}
        lang={lang}
      />
    </div>
  );
};
