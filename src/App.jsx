import { useState } from 'react';
import { GameProvider, useGame } from './logic/GameContext';
import SetupScreen from './components/Screens/SetupScreen';
import GameScreen from './components/Screens/GameScreen';
import FingerChooser from './components/Screens/FingerChooser';
import Disclaimer from './components/Screens/Disclaimer';
import { STORAGE_PREFIX } from './logic/storage';

// The teen edition has its own key, so a device that accepted the 18+ warning still sees the ice cube house rules.
const DISCLAIMER_KEY = `${STORAGE_PREFIX}${__EDITION__ === 'teen' ? 'house_rules_accepted' : 'disclaimer_accepted'}`;

const SCREENS = {
  setup: SetupScreen,
  playing: GameScreen,
  finished: GameScreen,
  chooser: FingerChooser
};

const AppContent = () => {
  const { gameState } = useGame();
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => localStorage.getItem(DISCLAIMER_KEY) === 'true');

  if (!disclaimerAccepted) {
    return (
      <Disclaimer onAccept={() => {
        localStorage.setItem(DISCLAIMER_KEY, 'true');
        setDisclaimerAccepted(true);
      }} />
    );
  }

  const Screen = SCREENS[gameState] || SetupScreen;
  // The key restarts the fade-in whenever the screen changes ('playing' and 'finished' share one).
  return (
    <div key={gameState === 'finished' ? 'playing' : gameState} className="screen-transition">
      <Screen />
    </div>
  );
};

const App = () => (
  <GameProvider>
    <AppContent />
  </GameProvider>
);

export default App;
