import { createContext, useState, useContext, useEffect } from 'react';
import { getDeck } from './deck';
import { setSoundEnabled } from './sound';
import { setHapticsEnabled } from './haptics';
import { getLanguage, setLanguage as applyLanguage } from '../i18n';
import { STORAGE_PREFIX } from './storage';
import { MAX_SPICINESS } from './modes';

const STORAGE_KEYS = {
  players: `${STORAGE_PREFIX}players`,
  settings: `${STORAGE_PREFIX}settings`,
  playedCards: `${STORAGE_PREFIX}played_cards`,
  customCards: `${STORAGE_PREFIX}custom_cards`
};

// Only remember the most recent cards so localStorage doesn't grow forever.
const PLAYED_HISTORY_LIMIT = 500;

const DEFAULT_PLAYERS = [
  { id: '1', name: 'Alex', drinkCount: 0, streak: 0 },
  { id: '2', name: 'Sam', drinkCount: 0, streak: 0 }
];

const loadJSON = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const saveJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (private mode) – the game still works without persistence.
  }
};

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState(() => loadJSON(STORAGE_KEYS.players, DEFAULT_PLAYERS));
  const [settings, setSettings] = useState(() => {
    const saved = { spicyLevel: 3, soundEnabled: true, hapticsEnabled: true, ...loadJSON(STORAGE_KEYS.settings, {}) };
    // A level saved by a spicier edition must not outlive the switch to the teen edition.
    return { ...saved, spicyLevel: Math.min(saved.spicyLevel, MAX_SPICINESS), language: getLanguage() };
  });
  const [playedCards, setPlayedCards] = useState(() => loadJSON(STORAGE_KEYS.playedCards, []));
  const [customCards, setCustomCards] = useState(() => loadJSON(STORAGE_KEYS.customCards, []));

  const [gameMode, setGameMode] = useState(null);
  const [gameState, setGameState] = useState('setup');
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [activeViruses, setActiveViruses] = useState([]);

  useEffect(() => saveJSON(STORAGE_KEYS.players, players), [players]);
  useEffect(() => saveJSON(STORAGE_KEYS.playedCards, playedCards), [playedCards]);
  useEffect(() => saveJSON(STORAGE_KEYS.customCards, customCards), [customCards]);
  useEffect(() => saveJSON(STORAGE_KEYS.settings, settings), [settings]);

  // Keep the module-level sound/haptics switches in sync with persisted settings.
  useEffect(() => setSoundEnabled(settings.soundEnabled), [settings.soundEnabled]);
  useEffect(() => setHapticsEnabled(settings.hapticsEnabled), [settings.hapticsEnabled]);

  // --- Players ---
  const addPlayer = (name) => {
    setPlayers(prev => [...prev, { id: Date.now().toString(), name, drinkCount: 0, streak: 0 }]);
  };

  const removePlayer = (id) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const updatePlayerDrinkCount = (id, amount) => {
    setPlayers(prev => prev.map(p =>
      p.id === id ? { ...p, drinkCount: (p.drinkCount || 0) + amount, streak: 0 } : p
    ));
  };

  const updatePlayerStreak = (id, success) => {
    setPlayers(prev => prev.map(p =>
      p.id === id ? { ...p, streak: success ? (p.streak || 0) + 1 : 0 } : p
    ));
  };

  // --- Custom cards ---
  const addCustomCard = (text) => {
    setCustomCards(prev => [...prev, { id: `custom_${Date.now()}`, text, type: 'custom' }]);
  };

  const removeCustomCard = (id) => {
    setCustomCards(prev => prev.filter(c => c.id !== id));
  };

  // --- Settings ---
  const setSpicyLevel = (level) => setSettings(prev => ({ ...prev, spicyLevel: level }));
  const toggleSound = () => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  const toggleHaptics = () => setSettings(prev => ({ ...prev, hapticsEnabled: !prev.hapticsEnabled }));

  const setLanguage = (lang) => {
    applyLanguage(lang);
    setSettings(prev => ({ ...prev, language: lang }));
  };

  // --- Game flow ---
  const showCard = (card) => {
    setCurrentCard(card);
    if (card.type === 'virus') {
      setActiveViruses(prev => [...prev, card]);
    }
    setPlayedCards(prev => [...prev, card.id].slice(-PLAYED_HISTORY_LIMIT));
  };

  const launchGame = (modes) => {
    if (players.length < 2) return;

    const newDeck = getDeck(modes, players, customCards, settings, playedCards);
    if (newDeck.length === 0) return;

    const [first, ...rest] = newDeck;
    setPlayers(prev => prev.map(p => ({ ...p, drinkCount: 0, streak: 0 })));
    setGameMode(modes);
    setActiveViruses([]);
    setDeck(rest);
    showCard(first);
    setGameState('playing');
  };

  const nextCard = () => {
    let remaining = deck;
    if (remaining.length === 0) {
      remaining = gameMode ? getDeck(gameMode, players, customCards, settings, playedCards) : [];
      if (remaining.length === 0) {
        setGameState('finished');
        return;
      }
    }

    const [next, ...rest] = remaining;
    setDeck(rest);
    showCard(next);
  };

  const finishGame = () => setGameState('finished');

  const goHome = () => {
    setGameState('setup');
    setDeck([]);
    setCurrentCard(null);
    setActiveViruses([]);
  };

  const removeVirus = (instanceId) => {
    setActiveViruses(prev => prev.filter(v => v.instanceId !== instanceId));
  };

  const resetHistory = () => setPlayedCards([]);

  const openChooser = () => setGameState('chooser');

  return (
    <GameContext.Provider value={{
      players,
      setPlayers,
      addPlayer,
      removePlayer,
      updatePlayerDrinkCount,
      updatePlayerStreak,
      customCards,
      addCustomCard,
      removeCustomCard,
      settings,
      setSpicyLevel,
      toggleSound,
      toggleHaptics,
      setLanguage,
      gameMode,
      gameState,
      currentCard,
      launchGame,
      nextCard,
      finishGame,
      goHome,
      openChooser,
      resetHistory,
      activeViruses,
      removeVirus
    }}>
      {children}
    </GameContext.Provider>
  );
};
