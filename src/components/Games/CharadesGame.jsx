import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../logic/GameContext';
import Button from '../Shared/Button';
import { playSuccess, playError, playPop } from '../../logic/sound';
import { triggerHaptic, HapticType } from '../../logic/haptics';

const CHARADES_WORDS = [
    "Harry Potter", "Spiderman", "Taylor Swift", "Piano", "T-Rex",
    "Donald Trump", "Zombie", "Shower", "SpongeBob", "Ballerina",
    "Monkey", "Robot", "Tooth fairy", "Sumo Wrestler", "Kangaroo",
    "Batman", "Superman", "Wonder Woman", "Joker", "Vampire",
    "Werewolf", "Ghost", "Witch", "Alien", "Astronaut",
    "Cowboy", "Pirate", "Ninja", "Clown", "Mime",
    "Doctor", "Teacher", "Police Officer", "Firefighter", "Chef",
    "Cat", "Dog", "Elephant", "Giraffe", "Lion",
    "Tiger", "Bear", "Shark", "Whale", "Dolphin",
    "Bird", "Snake", "Spider", "Frog", "Turtle",
    "Car", "Bus", "Train", "Plane", "Boat",
    "Bike", "Skateboard", "Rollerblades", "Scooter", "Helicopter",
    "Guitar", "Drums", "Violin", "Flute", "Trumpet",
    "Microwave", "Toaster", "Blender", "Vacuum", "Iron",
    "Washing Machine", "Dishwasher", "Fridge", "Oven", "Stove",
    "TV", "Computer", "Phone", "Camera", "Headphones"
];

const CharadesGame = () => {
    const { goHome } = useGame();
    const [gameState, setGameState] = useState('setup'); // setup, ready, playing, finished
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentWord, setCurrentWord] = useState('');
    const [lastTilt, setLastTilt] = useState(0);


    const nextWord = () => {
        const word = CHARADES_WORDS[Math.floor(Math.random() * CHARADES_WORDS.length)];
        setCurrentWord(word);
    };

    const handleCorrect = () => {
        setScore(s => s + 1);
        playSuccess();
        triggerHaptic(HapticType.SUCCESS);
        nextWord();
    };

    const handlePass = () => {
        playError();
        triggerHaptic(HapticType.WARNING);
        nextWord();
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(60);
        nextWord();
        setGameState('ready');


        setTimeout(() => setGameState('playing'), 1000);
    };


    useEffect(() => {
        if (gameState !== 'playing') return;

        const interval = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setGameState('finished');
                    playPop();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [gameState]);


    useEffect(() => {
        if (gameState !== 'playing') return;

        const handleMotion = (event) => {
            const { beta, gamma } = event.rotationRate || {}; // or accelerationIncludingGravity
            // Simplified logic: usually we use accelerationIncludingGravity.z 
            // but for web compatibility let's use a simpler heuristic or just buttons for MVP reliability.
            // On Mobile: beta is front/back tilt.
            // Screen facing user: beta ~90. Screen down (floor): beta ~180. Screen up (ceiling): beta ~0.
        };

        // window.addEventListener('devicemotion', handleMotion);
        // return () => window.removeEventListener('devicemotion', handleMotion);
    }, [gameState]);

    return (
        <div className="full-screen" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px',
            background: '#000',
            transition: 'background 0.3s'
        }}>
            <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
                <Button onClick={goHome} variant="secondary" style={{ padding: '5px 10px', minWidth: 'auto', background: 'rgba(0,0,0,0.5)' }}>✕</Button>
            </div>
            {gameState === 'setup' && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <h1 style={{ fontSize: '3rem' }}>🎭</h1>
                    <h1>Charades</h1>
                    <p>Place phone on forehead.</p>
                    <p>Tilt DOWN for Correct.</p>
                    <p>Tilt UP to Pass.</p>
                    <Button onClick={startGame} className="btn-liquid" style={{ marginTop: '20px' }}>Start Game</Button>
                    <div style={{ marginTop: '40px' }}>
                        <Button onClick={goHome} variant="secondary">Back</Button>
                    </div>
                </div>
            )}

            {gameState === 'playing' && (
                <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{ position: 'absolute', top: 20, right: 20, fontSize: '1.5rem', fontWeight: 'bold' }}>
                        ⏱️ {timeLeft}
                    </div>
                    <div style={{ position: 'absolute', top: 20, left: 20, fontSize: '1.5rem', fontWeight: 'bold', color: '#00ff00' }}>
                        ✅ {score}
                    </div>

                    <h1 style={{ fontSize: '4rem', textAlign: 'center', lineHeight: 1.1, padding: '20px' }}>
                        {currentWord}
                    </h1>

                    <div style={{ marginTop: '50px', display: 'flex', gap: '20px', opacity: 0.8 }}>
                        <Button onClick={handlePass} style={{ background: '#ff5555', height: '80px', width: '120px' }}>PASS (Up)</Button>
                        <Button onClick={handleCorrect} style={{ background: '#55ff55', height: '80px', width: '120px', color: '#000' }}>CORRECT (Down)</Button>
                    </div>
                    <p style={{ marginTop: '10px', opacity: 0.5, fontSize: '0.8rem' }}>(Tilt Logic Disabled)</p>
                </div>
            )}

            {gameState === 'finished' && (
                <div style={{ textAlign: 'center' }}>
                    <h1>Time's Up!</h1>
                    <h2 style={{ fontSize: '4rem', color: '#00ff00' }}>{score}</h2>
                    <p>Points</p>
                    <Button onClick={startGame} className="btn-liquid" style={{ marginTop: '20px' }}>Play Again</Button>
                    <div style={{ marginTop: '20px' }}>
                        <Button onClick={goHome} variant="secondary">Exit</Button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CharadesGame;
