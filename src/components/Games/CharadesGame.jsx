import { useState, useEffect } from 'react';
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

const ROUND_SECONDS = 60;

const CharadesGame = ({ onNext }) => {
    const [gameState, setGameState] = useState('setup'); // setup, playing, finished
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
    const [currentWord, setCurrentWord] = useState('');

    const nextWord = () => {
        setCurrentWord(CHARADES_WORDS[Math.floor(Math.random() * CHARADES_WORDS.length)]);
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
        setTimeLeft(ROUND_SECONDS);
        nextWord();
        setGameState('playing');
    };

    useEffect(() => {
        if (gameState !== 'playing') return;
        const endsAt = Date.now() + ROUND_SECONDS * 1000;
        const interval = setInterval(() => {
            const left = Math.max(Math.ceil((endsAt - Date.now()) / 1000), 0);
            setTimeLeft(left);
            if (left === 0) {
                clearInterval(interval);
                setGameState('finished');
                playPop();
            }
        }, 250);
        return () => clearInterval(interval);
    }, [gameState]);

    return (
        <div className="full-screen" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px',
            background: '#000'
        }}>
            {gameState === 'setup' && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <h1 style={{ fontSize: '3rem' }}>🎭</h1>
                    <h1>Charades</h1>
                    <p>Hold the phone to your forehead.</p>
                    <p>Your friends act it out – you guess!</p>
                    <Button onClick={startGame} className="btn-liquid" style={{ marginTop: '20px' }}>Start Game</Button>
                    <div style={{ marginTop: '40px' }}>
                        <Button onClick={onNext} variant="secondary">Skip</Button>
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
                        <Button onClick={handlePass} style={{ background: '#ff5555', height: '80px', width: '120px' }}>PASS</Button>
                        <Button onClick={handleCorrect} style={{ background: '#55ff55', height: '80px', width: '120px', color: '#000' }}>CORRECT</Button>
                    </div>
                </div>
            )}

            {gameState === 'finished' && (
                <div style={{ textAlign: 'center' }}>
                    <h1>Time's Up!</h1>
                    <h2 style={{ fontSize: '4rem', color: '#00ff00' }}>{score}</h2>
                    <p>Points</p>
                    <Button onClick={onNext} className="btn-liquid" style={{ marginTop: '20px' }}>Next Card ➡️</Button>
                </div>
            )}
        </div>
    );
};

export default CharadesGame;
