import React, { useState } from 'react';
import { GameProvider, useGame } from './logic/GameContext';
import { AnimatePresence, motion } from 'framer-motion';
import SetupScreen from './components/Screens/SetupScreen';
import GameScreen from './components/Screens/GameScreen';
import FingerChooser from './components/Screens/FingerChooser';

import Disclaimer from './components/Screens/Disclaimer';

const AppContent = () => {
  const { gameState, settings } = useGame();
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
    return localStorage.getItem('trinki_disclaimer_accepted') === 'true';
  });

  React.useEffect(() => {
    document.body.className = `theme-${settings.theme || 'neon'}`;
  }, [settings.theme]);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('trinki_disclaimer_accepted', 'true');
    setDisclaimerAccepted(true);
  };

  if (!disclaimerAccepted) {
    return <Disclaimer onAccept={handleAcceptDisclaimer} />;
  }

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3
  };

  let content;
  switch (gameState) {
    case 'playing':
    case 'finished':
      content = <GameScreen key="game" />;
      break;
    case 'setup':
      content = <SetupScreen key="setup" />;
      break;
    case 'chooser':
      content = <FingerChooser key="chooser" />;
      break;
    default:
      content = <SetupScreen key="setup" />;
      break;
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        >
          {content}
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
