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

    if (gameState === 'setup') {
        return (
            <div className="screen">
                <h1>🎭 Charades</h1>
                <p>Hold the phone to your forehead.</p>
                <p>Your friends act it out – you guess!</p>
                <Button onClick={startGame}>Start Game</Button>
                <Button variant="secondary" onClick={onNext}>Skip</Button>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="screen">
                <h1>Time&apos;s Up!</h1>
                <div className="huge good">{score}</div>
                <p>Points</p>
                <Button onClick={onNext}>Next Card ➡️</Button>
            </div>
        );
    }

    return (
        <div className="screen">
            <div className="row spread full-width big">
                <strong className="good">✅ {score}</strong>
                <strong>⏱️ {timeLeft}</strong>
            </div>
            <h1 className="grow charades-word">{currentWord}</h1>
            <div className="row">
                <Button className="btn-big btn-stop" onClick={handlePass}>PASS</Button>
                <Button className="btn-big btn-go" onClick={handleCorrect}>CORRECT</Button>
            </div>
        </div>
    );
};

export default CharadesGame;
