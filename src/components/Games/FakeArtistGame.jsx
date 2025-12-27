import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../logic/GameContext';
import Button from '../Shared/Button';
import { useTranslation } from 'react-i18next';

const CATEGORIES = [
    { name: "Animals", items: ["Cat", "Dog", "Elephant", "Giraffe", "Raccoon", "Snake", "Lion", "Tiger", "Bear", "Shark", "Whale", "Dolphin", "Bird", "Spider", "Frog", "Turtle", "Monkey", "Cow", "Pig", "Horse"] },
    { name: "Food", items: ["Pizza", "Burger", "Banana", "Ice Cream", "Sushi", "Taco", "Cake", "Apple", "Orange", "Grapes", "Watermelon", "Strawberry", "Cherry", "Pineapple", "Carrot", "Potato", "Corn", "Broccoli", "Tomato", "Cookie"] },
    { name: "Objects", items: ["Chair", "Car", "House", "Tree", "Book", "Laptop", "Shoe", "Table", "Lamp", "Clock", "Mirror", "Keys", "Wallet", "Phone", "Camera", "Headphones", "Glasses", "Watch", "Pen", "Pencil"] },
    { name: "Movies", items: ["Titanic", "Star Wars", "Jurassic Park", "Harry Potter", "The Avengers", "Frozen", "The Lion King", "Finding Nemo", "Shrek", "Toy Story", "Avatar", "The Matrix", "Inception", "Joker", "Black Panther"] },
    { name: "Holidays", items: ["Christmas", "Halloween", "Easter", "Thanksgiving", "New Year", "Valentine's Day", "Hanukkah", "Ramadan", "Diwali", "Kwanzaa", "St. Patrick's Day", "April Fools", "Mother's Day", "Father's Day", "Independence Day"] },
    { name: "Sports", items: ["Soccer", "Basketball", "Tennis", "Golf", "Volleyball", "Baseball", "Football", "Rugby", "Cricket", "Hockey", "Boxing", "Swimming", "Cycling", "Running", "Skiing"] },
    { name: "Transport", items: ["Car", "Bus", "Train", "Plane", "Boat", "Bike", "Skateboard", "Rollerblades", "Scooter", "Helicopter", "Submarine", "Rocket", "Truck", "Van", "Motorcycle"] },
    { name: "Clothes", items: ["Shirt", "Pants", "Dress", "Skirt", "Shorts", "Jacket", "Coat", "Hat", "Scarf", "Gloves", "Socks", "Shoes", "Boots", "Sandals", "Belt"] },
    { name: "Instruments", items: ["Guitar", "Drums", "Violin", "Flute", "Trumpet", "Piano", "Saxophone", "Clarinet", "Harp", "Cello", "Banjo", "Ukulele", "Accordion", "Trombone", "Tuba"] },
];

const FakeArtistGame = () => {
    const { players, goHome } = useGame();
    const { t } = useTranslation();

    const [gameState, setGameState] = useState('setup');
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [fakeIndex, setFakeIndex] = useState(null);
    const [secretWord, setSecretWord] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [isRevealing, setIsRevealing] = useState(false);

    // Canvas Refs
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingHistory, setDrawingHistory] = useState([]);

    const startGame = () => {
        const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        setCategoryName(cat.name);
        setSecretWord(cat.items[Math.floor(Math.random() * cat.items.length)]);
        setFakeIndex(Math.floor(Math.random() * players.length));
        setCurrentPlayerIndex(0);
        setGameState('reveal');

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleNext = () => {
        setIsRevealing(false);
        // After reveal, go to DRAW
        setGameState('draw');
    };

    const finishTurn = () => {
        // Next player
        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(p => p + 1);
            setGameState('reveal');
        } else {
            // Everyone has gone once. 
            // Usually Fake Artist is 2 rounds. Let's do 1 round for MVP speed.
            setGameState('discuss');
        }
    };

    // Canvas Logic
    const startDraw = ({ nativeEvent }) => {
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDraw = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();
        setIsDrawing(false);
    };

    const getCoordinates = (nativeEvent) => {
        // Handle Trace/Touch
        if (nativeEvent.touches && nativeEvent.touches.length > 0) {
            const touch = nativeEvent.touches[0];
            const rect = canvasRef.current.getBoundingClientRect();
            return {
                offsetX: touch.clientX - rect.left,
                offsetY: touch.clientY - rect.top
            };
        }
        return { offsetX: nativeEvent.offsetX, offsetY: nativeEvent.offsetY };
    };

    useEffect(() => {
        if (gameState === 'draw' || gameState === 'discuss') {
            // Re-init canvas context properties
            const canvas = canvasRef.current;
            if (canvas) {
                // We don't want to clear it, we want to Keep it!
                // React might unmount/remount. We need to save the image data?
                // For this simple implementation, let's hope the component stays mounted. 
                // It does because we are just changing state inside FakeArtistGame.
                const ctx = canvas.getContext('2d');
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#000';
            }
        }
    }, [gameState]);

    return (
        <div className="full-screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>

            {/* Header */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>🎨 Fake Artist</span>
                {gameState !== 'setup' && <span>Player: {players[currentPlayerIndex]?.name}</span>}
                <Button onClick={goHome} variant="secondary" style={{ padding: '5px 10px', minWidth: 'auto', fontSize: '1rem' }}>✕</Button>
            </div>

            {gameState === 'setup' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h1>🎨</h1>
                    <h2>{t('mode_fake_artist')}</h2>
                    <p style={{ textAlign: 'center', opacity: 0.8, maxWidth: '300px' }}>
                        {t('fake_intro')}
                    </p>
                    {players.length < 3 ? <p style={{ color: 'red' }}>Need 3+ Players</p> :
                        <Button onClick={startGame} className="btn-liquid" style={{ marginTop: '20px' }}>{t('start_game')}</Button>
                    }
                    <Button onClick={goHome} variant="secondary" style={{ marginTop: '20px' }}>{t('exit_game_button')}</Button>
                </div>
            )}

            {gameState === 'reveal' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>{t('spy_pass_to')} {players[currentPlayerIndex].name}</h2>
                    <button
                        onMouseDown={() => setIsRevealing(true)}
                        onMouseUp={() => setIsRevealing(false)}
                        onTouchStart={() => setIsRevealing(true)}
                        onTouchEnd={() => setIsRevealing(false)}
                        style={{
                            width: '200px', height: '200px', borderRadius: '50%',
                            background: isRevealing ? (currentPlayerIndex === fakeIndex ? '#ff0055' : '#00ffff') : '#333',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginTop: '20px', border: 'none', color: '#fff'
                        }}
                    >
                        {isRevealing ? (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.8rem' }}>{t('category')}: {categoryName}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    {currentPlayerIndex === fakeIndex ? t('fake_you_are_fake') : secretWord}
                                </div>
                            </div>
                        ) : t('fake_hold_to_see')}
                    </button>
                    {isRevealing && (
                        <Button onClick={handleNext} style={{ marginTop: '30px' }}>I Know It (Go Draw)</Button>
                    )}
                </div>
            )}

            {/* Canvas Area - Always rendered but hidden/shown to persist? No, if we hide via conditional rendering it destroys canvas.
                We must use display: none for persistence.
            */}
            <div style={{
                display: (gameState === 'draw' || gameState === 'discuss') ? 'flex' : 'none',
                flexDirection: 'column', alignItems: 'center', flex: 1, width: '100%'
            }}>
                <h3 style={{ margin: '10px' }}>{gameState === 'draw' ? t('fake_draw_one') : t('final_stats')}</h3>
                <canvas
                    ref={canvasRef}
                    width={320}
                    height={350}
                    style={{ background: '#fff', borderRadius: '10px', touchAction: 'none' }}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={stopDraw}
                    onMouseLeave={stopDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={stopDraw}
                />

                {gameState === 'draw' && (
                    <Button onClick={finishTurn} className="btn-liquid" style={{ marginTop: '20px' }}>Done Drawing</Button>
                )}

                {gameState === 'discuss' && (
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <p>The Word was: <b>{secretWord}</b></p>
                        <p>The Fake was: <b style={{ color: '#ff0055' }}>{players[fakeIndex].name}</b></p>
                        <Button onClick={startGame} variant="primary">New Round</Button>
                    </div>
                )}
            </div>

            {gameState === 'draw' && (
                <div style={{ position: 'fixed', bottom: 10, left: 10, opacity: 0.5, fontSize: '0.8rem', pointerEvents: 'none' }}>
                    {t('fake_tip_no_lift')}
                </div>
            )}

        </div>
    );
};

export default FakeArtistGame;
