import { useState, useRef } from 'react';
import { useGame } from '../../logic/GameContext';
import { useT } from '../../i18n';
import Button from '../Shared/Button';
import PassAndReveal from './PassAndReveal';

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

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

// Everyone draws one line of the secret word; the fake artist doesn't know it and has to bluff.
const FakeArtistGame = ({ onNext }) => {
    const { players } = useGame();
    const t = useT();
    const [stage, setStage] = useState('setup'); // setup → reveal ⇄ draw → discuss
    const [playerIndex, setPlayerIndex] = useState(0);
    const [fakeIndex, setFakeIndex] = useState(0);
    const [category, setCategory] = useState('');
    const [word, setWord] = useState('');
    const canvasRef = useRef(null);

    const start = () => {
        const cat = pickRandom(CATEGORIES);
        setCategory(cat.name);
        setWord(pickRandom(cat.items));
        setFakeIndex(Math.floor(Math.random() * players.length));
        setPlayerIndex(0);
        setStage('reveal');
    };

    const finishTurn = () => {
        if (playerIndex < players.length - 1) {
            setPlayerIndex(i => i + 1);
            setStage('reveal');
        } else {
            setStage('discuss');
        }
    };

    const point = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
    };

    const startLine = (e) => {
        if (stage !== 'draw') return;
        canvasRef.current.setPointerCapture(e.pointerId);
        const ctx = canvasRef.current.getContext('2d');
        Object.assign(ctx, { lineWidth: 3, lineCap: 'round', strokeStyle: '#000' });
        ctx.beginPath();
        ctx.moveTo(...point(e));
    };

    const continueLine = (e) => {
        if (stage !== 'draw' || !canvasRef.current.hasPointerCapture(e.pointerId)) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(...point(e));
        ctx.stroke();
    };

    const showCanvas = stage === 'draw' || stage === 'discuss';

    return (
        <div className="full">
            <Button variant="secondary" className="btn-small corner" onClick={onNext}>{t('skip_card')} ⏭</Button>

            {stage === 'setup' && (
                <div className="screen">
                    <h1>🎨 {t('mode_fake_artist')}</h1>
                    <p className="muted">{t('fake_intro')}</p>
                    {players.length < 3 ? <p className="bad">{t('need_3_players')}</p> : <Button onClick={start}>{t('start_game')}</Button>}
                </div>
            )}

            {stage === 'reveal' && (
                <PassAndReveal
                    key={playerIndex}
                    playerName={players[playerIndex].name}
                    secret={<>{t('category')}: {category}<br /><strong>{playerIndex === fakeIndex ? t('fake_you_are_fake') : word}</strong></>}
                    isImpostor={playerIndex === fakeIndex}
                    doneLabel={t('fake_go_draw')}
                    onDone={() => setStage('draw')}
                />
            )}

            {/* The canvas stays mounted (only hidden) so the drawing survives between turns. */}
            <div className="screen" hidden={!showCanvas}>
                <h3>{stage === 'draw' ? `${players[playerIndex]?.name}: ${t('fake_draw_one')}` : t('final_stats')}</h3>
                <canvas ref={canvasRef} width={320} height={350} className="drawing" onPointerDown={startLine} onPointerMove={continueLine} />
                {stage === 'draw' && <><Button onClick={finishTurn}>{t('fake_done')}</Button><p className="muted small">{t('fake_tip_no_lift')}</p></>}
                {stage === 'discuss' && (
                    <>
                        <p>{t('spy_the_word_was')} <b>{word}</b></p>
                        <p>{t('fake_was')} <b className="bad">{players[fakeIndex].name}</b></p>
                        <Button onClick={onNext}>{t('next_card')} ➡️</Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FakeArtistGame;
