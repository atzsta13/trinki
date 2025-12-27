import React, { createContext, useState, useContext, useEffect } from 'react';
import { getDeck } from './deck';
import { setSoundEnabled } from './sound';
import { setHapticsEnabled } from './haptics';
import i18n from '../i18n';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('trinki_players');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Alex', drinkCount: 0 },
      { id: 2, name: 'Sam', drinkCount: 0 }
    ];
  });
  const [gameMode, setGameMode] = useState('classic');
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [gameState, setGameState] = useState('setup');
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('trinki_settings');
    const defaults = {
      spicyLevel: 3,
      drinkType: 'sips',
      groupType: 'mixed',
      soundEnabled: true,
      hapticsEnabled: true,
      language: i18n.language || 'en',
      theme: 'neon'
    };



    if (saved) {
      return { ...defaults, ...JSON.parse(saved) };
    }
    return defaults;
  });


  useEffect(() => {
    localStorage.setItem('trinki_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('trinki_settings', JSON.stringify(settings));
    // Sync Theme Color for PWA
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
      const color = '#000000'; // Neon default black
      metaThemeColor.setAttribute("content", color);
    }

    // Apply theme class to body
    document.body.className = `theme-${settings.theme}`;
  }, [settings]);

  const [playedCards, setPlayedCards] = useState(() => {
    const saved = localStorage.getItem('trinki_played_cards');
    return saved ? JSON.parse(saved) : [];
  });
  const [customCards, setCustomCards] = useState(() => {
    const saved = localStorage.getItem('trinki_custom_cards');
    return saved ? JSON.parse(saved) : [];
  });

  const addCustomCard = (text) => {
    const newCard = { id: Date.now(), text, type: 'custom' };
    const updated = [...customCards, newCard];
    setCustomCards(updated);
    localStorage.setItem('trinki_custom_cards', JSON.stringify(updated));
  };

  const removeCustomCard = (id) => {
    const updated = customCards.filter(c => c.id !== id);
    setCustomCards(updated);
    localStorage.setItem('trinki_custom_cards', JSON.stringify(updated));
  };

  const addPlayer = (name) => {
    const newPlayer = {
      id: Date.now().toString(),
      name,
      drinkCount: 0,
      streak: 0
    };
    setPlayers([...players, newPlayer]);
  };

  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const updatePlayerDrinkCount = (id, amount) => {
    setPlayers(players.map(p => {
      if (p.id === id) {
        return { ...p, drinkCount: p.drinkCount + amount, streak: 0 };
      }
      return p;
    }));
  };

  const updatePlayerStreak = (id, increment) => {
    setPlayers(players.map(p => {
      if (p.id === id) {
        return { ...p, streak: increment ? (p.streak || 0) + 1 : 0 };
      }
      return p;
    }));
  };

  const setDrinkType = (type) => {
    setSettings(prev => ({ ...prev, drinkType: type }));
  };

  const toggleSound = () => {
    setSettings(prev => {
      const newState = !prev.soundEnabled;
      setSoundEnabled(newState);
      return { ...prev, soundEnabled: newState };
    });
  };

  const toggleHaptics = () => {
    setSettings(prev => {
      const newState = !prev.hapticsEnabled;
      setHapticsEnabled(newState);
      return { ...prev, hapticsEnabled: newState };
    });
  };

  const setTheme = (theme) => {
    setSettings(prev => ({ ...prev, theme: 'neon' }));
  };


  const startGame = (mode) => {
    // If invalid params, just go to home or ignore
    if (!mode) return;

    setGameMode(mode);
    setGameState('setup');
  };


  const launchGame = (modes) => {
    if (players.length < 2) {
      alert("Need at least 2 players!");
      return;
    }

    setGameMode(modes);

    const initialDeck = getDeck(modes, players, customCards, settings, playedCards);
    setDeck(initialDeck);

    if (initialDeck.length > 0) {
      setCurrentCard(initialDeck[0]);
    }

    setGameState('playing');
  };

  const setSpicyLevel = (level) => {
    setSettings(prev => ({ ...prev, spicyLevel: level }));
  };

  const [activeViruses, setActiveViruses] = useState([]);

  const removeVirus = (id) => {
    setActiveViruses(prev => prev.filter(v => v.id !== id));
  };

  const finishGame = () => {
    setGameState('finished');
  };

  const nextCard = () => {
    setDeck(prevDeck => {
      let nextBatch = prevDeck || [];

      if (nextBatch.length === 0) {
        if (!gameMode) return [];
        const refilled = getDeck(gameMode, players, customCards, settings, playedCards);

        if (refilled.length === 0) {
          setGameState('finished');
          return [];
        }
        nextBatch = refilled;
      }

      const [next, ...rest] = nextBatch;

      setCurrentCard(next);

      if (next && next.type === 'virus') {
        setActiveViruses(prev => [...prev, next]);
      }

      if (next) {
        setPlayedCards(prevPlayed => {
          const newPlayed = [...prevPlayed, next.text];
          localStorage.setItem('trinki_played_cards', JSON.stringify(newPlayed));
          return newPlayed;
        });
      }

      return rest;
    });
  };

  const resetHistory = () => {
    setPlayedCards([]);
    localStorage.removeItem('trinki_played_cards');
  };

  const resetGame = () => {
    setGameState('setup');
    setDeck([]);
    setCurrentCard(null);
    setActiveViruses([]);
  };

  const goHome = () => {
    setGameState('setup');
    setDeck([]);
    setCurrentCard(null);
    setActiveViruses([]);
  };
  const openTool = (toolId) => {
    if (toolId === 'chooser') {
      setGameState('chooser');
    }
  };
  const setGroupType = (type) => {
    setSettings(prev => ({ ...prev, groupType: type }));
  };

  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setSettings(prev => ({ ...prev, language: lang }));
  };

  const openChooser = () => {
    setGameState('chooser');
  };

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
      setDrinkType,
      setGroupType,
      toggleSound,
      toggleHaptics,
      setTheme,
      setLanguage,
      gameMode,
      gameState,
      currentCard,
      startGame,
      launchGame,
      nextCard,
      finishGame,
      resetGame,
      goHome,
      openTool,
      resetHistory,
      deck,
      playedCards,
      activeViruses,
      removeVirus,
      openChooser
    }}>
      {children}
    </GameContext.Provider>
  );
};
