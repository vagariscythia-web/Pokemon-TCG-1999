import { Card } from '../types/game';
import cardsData from '../data/cards.json';

export interface SavedCustomDeck {
  id: string;
  name: string;
  updatedAt: number;
  cardIds: string[];
}

const STORAGE_KEY = 'pkmn_custom_decks_v1';
const allCards = cardsData as Card[];
const cardMap = new Map<string, Card>();
allCards.forEach(c => cardMap.set(c.id, c));

export function loadSavedCustomDecks(): SavedCustomDeck[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load saved custom decks from localStorage:', err);
    return [];
  }
}

export function saveCustomDeck(name: string, deck: Card[], existingId?: string): SavedCustomDeck {
  const decks = loadSavedCustomDecks();
  const id = existingId || 'deck_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const cardIds = deck.map(c => c.id);

  const savedDeck: SavedCustomDeck = {
    id,
    name: name.trim() || 'Custom Deck',
    updatedAt: Date.now(),
    cardIds
  };

  const existingIdx = decks.findIndex(d => d.id === id);
  if (existingIdx !== -1) {
    decks[existingIdx] = savedDeck;
  } else {
    decks.unshift(savedDeck);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  } catch (err) {
    console.error('Failed to save custom deck to localStorage:', err);
  }

  return savedDeck;
}

export function deleteCustomDeck(id: string): void {
  const decks = loadSavedCustomDecks().filter(d => d.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  } catch (err) {
    console.error('Failed to delete custom deck from localStorage:', err);
  }
}

export function convertCardIdsToCards(cardIds: string[]): Card[] {
  const deck: Card[] = [];
  cardIds.forEach(id => {
    const found = cardMap.get(id);
    if (found) {
      deck.push({ ...found });
    }
  });
  return deck;
}

export function exportCustomDeckToJson(deckName: string, deck: Card[]): string {
  const exportData = {
    appName: 'Pokemon TCG 1999',
    version: '1.0',
    deckName: deckName.trim() || 'Custom Deck',
    exportedAt: new Date().toISOString(),
    totalCards: deck.length,
    cardIds: deck.map(c => c.id),
    cardsList: deck.map(c => ({
      name: c.name,
      id: c.id,
      set: c.set,
      number: c.number,
      supertype: c.supertype
    }))
  };
  return JSON.stringify(exportData, null, 2);
}

export function exportCustomDeckToFile(deckName: string, deck: Card[]): void {
  const jsonStr = exportCustomDeckToJson(deckName, deck);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = (deckName || 'custom_deck').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  a.download = `${safeName}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importCustomDeckFromJson(jsonString: string): { name: string; deck: Card[] } | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed) return null;

    let deckName = parsed.deckName || parsed.name || 'Imported Deck';
    let cardIds: string[] = [];

    if (Array.isArray(parsed.cardIds)) {
      cardIds = parsed.cardIds;
    } else if (Array.isArray(parsed.cardsList)) {
      cardIds = parsed.cardsList.map((c: any) => c.id).filter(Boolean);
    } else if (Array.isArray(parsed)) {
      cardIds = parsed.map((c: any) => (typeof c === 'string' ? c : c.id)).filter(Boolean);
    }

    const deck = convertCardIdsToCards(cardIds);
    if (deck.length === 0) return null;

    return {
      name: deckName,
      deck
    };
  } catch (err) {
    console.error('Failed to import custom deck JSON:', err);
    return null;
  }
}
