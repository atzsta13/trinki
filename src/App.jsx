import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './logic/GameContext';
import SetupScreen from './components/Screens/SetupScreen';
import GameScreen from './components/Screens/GameScreen';
import FingerChooser from './components/Screens/FingerChooser';
import Disclaimer from './components/Screens/Disclaimer';

const DISCLAIMER_KEY = 'trinki_disclaimer_accepted';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
};

const SCREENS = {
  setup: SetupScreen,
  playing: GameScreen,
  finished: GameScreen,
  chooser: FingerChooser
};

const AppContent = () => {
  const { gameState } = useGame();
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
    try {
      return localStorage.getItem(DISCLAIMER_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const handleAcceptDisclaimer = () => {
    try {
      localStorage.setItem(DISCLAIMER_KEY, 'true');
    } catch {
      // Not persisted – the disclaimer just shows again next time.
    }
    setDisclaimerAccepted(true);
  };

  if (!disclaimerAccepted) {
    return <Disclaimer onAccept={handleAcceptDisclaimer} />;
  }

  const Screen = SCREENS[gameState] || SetupScreen;
  // 'playing' and 'finished' share a screen, so they share a transition key too.
  const screenKey = gameState === 'finished' ? 'playing' : gameState;

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={screenKey}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        >
          <Screen />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
