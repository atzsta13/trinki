import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Button from '../Shared/Button';
import { triggerHaptic, HapticType } from '../../logic/haptics';
import { playError } from '../../logic/sound';

const CATEGORIES = [
    "Brands of Cereal", "Types of Cheese", "Cars", "Things in a Fridge", "Pokemon", "Countries", "Capital Cities", "Vegetables", "Bad Habits",
    "Body Parts", "Colors", "Video Games", "Movies", "Celebrities", "Animals", "Fruits", "Sports", "Drinks", "Apps",
    "Clothing Brands", "Shoe Brands", "Makeup Brands", "Fast Food Chains", "Pizza Toppings", "Ice Cream Flavors", "Dog Breeds", "Cat Breeds",
    "Birds", "Fish", "Insects", "Flowers", "Trees", "Planets", "Constellations", "Chemical Elements", "Presidents",
    "Languages", "Currencies", "Holidays", "Festivals", "Musical Instruments", "Music Genres", "Dance Styles", "Board Games",
    "Card Games", "Casino Games", "Superheroes", "Villains", "Cartoons", "Anime", "TV Shows", "Books", "Authors",
    "Scientists", "Artists", "Musicians", "Bands", "Songs", "Albums", "Cities in USA", "Cities in Europe", "Cities in Asia",
    "Rivers", "Mountains", "Oceans", "Seas", "Lakes", "Islands", "Deserts", "Forests", "Parks", "Landmarks",
    "Universities", "Subjects", "Jobs", "Hobbies", "Tools", "Kitchen Appliances", "Furniture", "Rooms", "Buildings",
    "Vehicles", "Weapons"
];

const PANIC_PROMPTS = [
    "Name 3 things allowed on a plane", "Name 3 excuses for being late", "Name 3 things you lick", "Name 3 bald celebrities",
    "Name 3 things that are red", "Name 3 things that smell bad", "Name 3 things you find in a bathroom", "Name 3 things you can buy for $1",
    "Name 3 things you shouldn't say to a cop", "Name 3 things you do in the morning", "Name 3 things you eat with a spoon", "Name 3 things that are sticky",
    "Name 3 things you can climb", "Name 3 things that are cold", "Name 3 things you can wear", "Name 3 things you can drive",
    "Name 3 things you can throw", "Name 3 things you can break", "Name 3 things you can burn", "Name 3 things you can freeze",
    "Name 3 things you can hide", "Name 3 things you can steal", "Name 3 things you can cook", "Name 3 things you can drink",
    "Name 3 things you can smoke", "Name 3 things you can hug", "Name 3 things you can kick", "Name 3 things you can punch",
    "Name 3 things you can kiss", "Name 3 things you can kill (in a game)", "Name 3 things you can paint", "Name 3 things you can draw",
    "Name 3 things you can write", "Name 3 things you can read", "Name 3 things you can watch"
];

const MODE_INFO = {
    classic: { title: 'Word Bomb', description: 'Pass the bomb before it explodes!' },
    panic: { title: '5 Second Panic', description: 'Name 3 things in 5 seconds!' },
    alphabet: { title: 'Alphabet Soup', description: 'Go through A-Z for the category!' }
};

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

// `card.bombMode` picks the variant; plain bomb cards ("Name 3 ...") play as a panic round with their own prompt.
const BombGame = ({ card, onNext }) => {
    const mode = card.bombMode || (card.duration ? 'panic' : 'classic');
    const [gameState, setGameState] = useState('setup');
    // The round ends at `deadline`; only whole seconds are rendered, so the UI updates once per second.
    const [deadline, setDeadline] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [prompt, setPrompt] = useState('');
    const [letter, setLetter] = useState('A');

    const startTimer = (seconds) => {
        setDeadline(Date.now() + seconds * 1000);
        setSecondsLeft(Math.ceil(seconds));
    };

    const startRound = () => {
        if (mode === 'classic') {
            setPrompt(pickRandom(CATEGORIES));
            startTimer(Math.floor(Math.random() * 40) + 20);
        } else if (mode === 'panic') {
            setPrompt(card.duration ? card.text : pickRandom(PANIC_PROMPTS));
            startTimer(card.duration || 5);
        } else if (mode === 'alphabet') {
            setPrompt(pickRandom(CATEGORIES));
            setLetter('A');
            startTimer(10);
        }
        setGameState('tick');
    };

    const nextRound = () => {
        if (mode === 'alphabet') {
            const nextChar = String.fromCharCode(letter.charCodeAt(0) + 1);
            if (nextChar > 'Z') {
                onNext();
                return;
            }
            setLetter(nextChar);
            startTimer(10);
        } else if (mode === 'panic') {
            setPrompt(pickRandom(PANIC_PROMPTS));
            startTimer(5);
        }
    };

    // Heartbeat on every full second, explosion when the time runs out.
    useEffect(() => {
        if (gameState !== 'tick') return;
        let lastSecond = Math.ceil((deadline - Date.now()) / 1000);

        const interval = setInterval(() => {
            const remaining = deadline - Date.now();
            if (remaining <= 0) {
                clearInterval(interval);
                setSecondsLeft(0);
                setGameState('boom');
                playError();
                triggerHaptic(HapticType.ERROR);
                setTimeout(() => triggerHaptic(HapticType.HEAVY), 200);
                return;
            }
            const second = Math.ceil(remaining / 1000);
            if (second !== lastSecond) {
                lastSecond = second;
                setSecondsLeft(second);
                triggerHaptic(HapticType.HEARTBEAT);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [gameState, deadline]);

    const timerColor = secondsLeft > 10 ? '#fff' : secondsLeft > 5 ? '#ffd700' : '#ff0055';
    const pulseDuration = secondsLeft > 10 ? 1 : secondsLeft > 5 ? 0.5 : 0.25;

    const renderContent = () => {
        if (gameState === 'setup') {
            return (
                <div style={{ textAlign: 'center' }}>
                    <h2>{MODE_INFO[mode].title}</h2>
                    <p style={{ opacity: 0.7, marginBottom: '20px' }}>{MODE_INFO[mode].description}</p>
                    <Button onClick={startRound} className="btn-liquid">Light Fuse</Button>
                    <div style={{ marginTop: '30px' }}>
                        <Button onClick={onNext} variant="secondary">Skip</Button>
                    </div>
                </div>
            );
        }

        if (gameState === 'tick') {
            return (
                <div style={{ textAlign: 'center', width: '100%', position: 'relative' }}>
                    <motion.div
                        animate={{ opacity: [0, 0.2, 0], scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: pulseDuration, ease: 'easeInOut' }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            x: '-50%',
                            y: '-50%',
                            width: '300px',
                            height: '300px',
                            background: `radial-gradient(circle, ${timerColor} 0%, transparent 70%)`,
                            pointerEvents: 'none',
                            zIndex: 0
                        }}
                    />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '1.5rem', opacity: 0.8, marginBottom: '10px' }}>{mode === 'alphabet' ? `Category: ${prompt}` : 'Topic:'}</div>

                        <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, margin: '10px 0' }}>
                            {mode === 'alphabet' ? `Letter: ${letter}` : prompt}
                        </h1>

                        <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ repeat: Infinity, duration: pulseDuration }}
                            style={{ fontSize: '5rem', margin: '20px 0', fontWeight: 'bold', color: timerColor, textShadow: `0 0 20px ${timerColor}` }}
                        >
                            {/* Classic hides the timer so nobody knows when it blows. */}
                            {mode === 'classic' ? '💣' : secondsLeft}
                        </motion.div>

                        {mode !== 'classic' && (
                            <Button onClick={nextRound} className="btn-liquid" style={{ background: '#00ff00', color: '#000', boxShadow: '0 10px 20px rgba(0,255,0,0.3)' }}>
                                {mode === 'alphabet' ? 'Next Letter (Reset)' : 'Success (Pass)'}
                            </Button>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '5rem' }}>💥 BOOM 💥</h1>
                <p>You Lose!</p>
                <Button onClick={onNext} variant="primary" className="btn-liquid">Next Card ➡️</Button>
            </div>
        );
    };

    const backgroundColor = gameState === 'boom' ? '#4a0000' : (gameState === 'tick' && secondsLeft <= 5 ? '#3a2a00' : '#1a1a1a');

    return (
        <div className="full-screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', backgroundColor }}>
            {renderContent()}
        </div>
    );
};

export default BombGame;
