import React, { useState, useEffect } from 'react';
import { useGame } from '../../logic/GameContext';
import Button from '../Shared/Button';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { triggerHaptic, HapticType } from '../../logic/haptics';
import { playError, playSuccess } from '../../logic/sound';

const BombGame = ({ onNext, initialMode }) => {
    const { players, goHome } = useGame();
    const { t } = useTranslation();
    const [bombMode, setBombMode] = useState(initialMode || null);
    const [gameState, setGameState] = useState(initialMode ? 'setup' : 'menu');
    const [timer, setTimer] = useState(0);
    const [prompt, setPrompt] = useState('');
    const [letter, setLetter] = useState('A');


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

    const selectMode = (m) => {
        setBombMode(m);
        setGameState('setup');
    };

    const startGame = () => {
        if (bombMode === 'classic') {
            setPrompt(CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]);
            setTimer(Math.floor(Math.random() * 40) + 20);
        } else if (bombMode === 'panic') {
            setPrompt(PANIC_PROMPTS[Math.floor(Math.random() * PANIC_PROMPTS.length)]);
            setTimer(5);
        } else if (bombMode === 'alphabet') {
            setPrompt(CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]);
            setLetter('A');
            setTimer(10);
        }
        setGameState('tick');
    };

    const nextRound = () => {
        if (bombMode === 'alphabet') {
            const nextChar = String.fromCharCode(letter.charCodeAt(0) + 1);
            if (nextChar > 'Z') {
                setGameState('boom');
                return;
            }
            setLetter(nextChar);
            setTimer(10);
        } else if (bombMode === 'panic') {
            setPrompt(PANIC_PROMPTS[Math.floor(Math.random() * PANIC_PROMPTS.length)]);
            setTimer(5);
        }
    };

    useEffect(() => {
        let interval;
        if (gameState === 'tick') {
            interval = setInterval(() => {
                setTimer(t => {
                    const intT = Math.ceil(t);
                    const nextT = t - 0.1;
                    const nextIntT = Math.ceil(nextT);

                    if (intT !== nextIntT && nextT > 0) {
                        triggerHaptic(HapticType.HEARTBEAT);
                    }

                    if (nextT <= 0) {
                        setGameState('boom');
                        playError();
                        triggerHaptic(HapticType.ERROR);
                        setTimeout(() => triggerHaptic(HapticType.HEAVY), 200);
                        return 0;
                    }
                    return nextT;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [gameState]);


    const renderContent = () => {
        if (gameState === 'menu') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
                    <h1 style={{ color: '#FF3B30' }}>Bomb Party 💣</h1>
                    <h2 style={{ color: '#fff', fontSize: '1rem', opacity: 0.8 }}>Select Mode</h2>
                    <Button onClick={() => selectMode('classic')} className="btn-liquid" style={{ width: '80%' }}>💣 Word Bomb (Classic)</Button>
                    <Button onClick={() => selectMode('panic')} variant="secondary" style={{ width: '80%' }}>😱 5-Second Panic</Button>
                    <Button onClick={() => selectMode('alphabet')} variant="secondary" style={{ width: '80%' }}>🔡 Alphabet Soup</Button>
                </div>
            );
        }
        if (gameState === 'setup') {
            return (
                <div style={{ textAlign: 'center' }}>
                    <h2>{bombMode === 'classic' ? 'Word Bomb' : bombMode === 'panic' ? '5 Second Panic' : 'Alphabet Soup'}</h2>
                    <p style={{ opacity: 0.7, marginBottom: '20px' }}>
                        {bombMode === 'classic' ? 'Pass the bomb before it explodes!' :
                            bombMode === 'panic' ? 'Name 3 things in 5 seconds!' :
                                'Go through A-Z for the category!'}
                    </p>
                    <Button onClick={startGame} className="btn-liquid">Light Fuse</Button>
                    <br /><br />
                    {!onNext && <Button onClick={() => setGameState('menu')} variant="secondary">Back</Button>}
                </div>
            )
        }
        if (gameState === 'tick') {

            const getTimerColor = () => {
                if (timer > 10) return '#fff';
                if (timer > 5) return '#ffd700';
                return '#ff0055';
            };

            return (
                <div style={{ textAlign: 'center', width: '100%', position: 'relative' }}>
                    <motion.div
                        animate={{
                            opacity: [0, 0.2, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: timer > 10 ? 1 : (timer > 5 ? 0.5 : 0.25),
                            ease: "easeInOut"
                        }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            x: '-50%',
                            y: '-50%',
                            width: '300px',
                            height: '300px',
                            background: `radial-gradient(circle, ${getTimerColor()} 0%, transparent 70%)`,
                            pointerEvents: 'none',
                            zIndex: 0
                        }}
                    />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '1.5rem', opacity: 0.8, marginBottom: '10px' }}>{bombMode === 'alphabet' ? `Category: ${prompt}` : 'Topic:'}</div>

                        <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, margin: '10px 0' }}>
                            {bombMode === 'alphabet' ? `Letter: ${letter}` : prompt}
                        </h1>

                        <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                            transition={{
                                repeat: Infinity,
                                duration: timer > 10 ? 1 : (timer > 5 ? 0.5 : 0.2)
                            }}
                            style={{ fontSize: '5rem', margin: '20px 0', fontWeight: 'bold', color: getTimerColor(), textShadow: `0 0 20px ${getTimerColor()}` }}
                        >
                            {bombMode === 'classic' ? '💣' : Math.ceil(timer)}
                        </motion.div>

                        {bombMode !== 'classic' && (
                            <Button onClick={nextRound} className="btn-liquid" style={{ background: '#00ff00', color: '#000', boxShadow: '0 10px 20px rgba(0,255,0,0.3)' }}>
                                {bombMode === 'alphabet' ? 'Next Letter (Reset)' : 'Success (Pass)'}
                            </Button>
                        )}
                    </div>
                </div>
            )
        }
        if (gameState === 'boom') {
            return (
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '5rem' }}>💥 BOOM 💥</h1>
                    <p>You Lose!</p>
                    {onNext ? (
                        <Button onClick={onNext} variant="primary" className="btn-liquid">Next Card ➡️</Button>
                    ) : (
                        <>
                            <Button onClick={() => setGameState('setup')} variant="primary">Play Again</Button>
                            <br /><br />
                            <Button onClick={() => setGameState('menu')} variant="secondary">Change Mode</Button>
                        </>
                    )}
                </div>
            )
        }
    };

    const getBackgroundColor = () => {
        if (gameState === 'boom') return '#4a0000';
        if (gameState === 'tick' && timer <= 5) return '#3a2a00';
        return '#1a1a1a';
    };

    return (
        <div className="full-screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', backgroundColor: getBackgroundColor() }}>
            {!onNext && (
                <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
                    <Button onClick={goHome} variant="secondary" style={{ padding: '5px 10px', minWidth: 'auto', background: 'rgba(0,0,0,0.5)' }}>✕</Button>
                </div>
            )}

            {renderContent()}

            {!onNext && (
                <div style={{ position: 'absolute', bottom: 40 }}>
                    <Button onClick={goHome} variant="secondary">Exit</Button>
                </div>
            )}
        </div>
    );
};

export default BombGame;
