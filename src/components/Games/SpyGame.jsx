import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useGame } from '../../logic/GameContext';
import Button from '../Shared/Button';
import { triggerHaptic, HapticType } from '../../logic/haptics';

const SPY_WORDS = [
    { category: "Locations", words: ["Beach", "Hospital", "School", "Police Station", "Supermarket", "Cinema", "Airplane", "Gym", "Library", "Zoo", "Casino", "Church", "Bank", "Hotel", "Restaurant", "Museum", "Graveyard", "Space Station", "Submarine", "Cruise Ship", "Farm", "Circus", "Bowling Alley", "Stadium"] },
    { category: "Objects", words: ["Toaster", "Toothbrush", "Laptop", "Bicycle", "Umbrella", "Shoe", "Guitar", "Spoon", "Toilet", "Microwave", "Remote", "Pillow", "Chair", "Table", "Lamp", "Clock", "Mirror", "Keys", "Wallet", "Phone", "Camera", "Headphones", "Glasses", "Watch"] },
    { category: "Jobs", words: ["Doctor", "Teacher", "Pilot", "Chef", "Firefighter", "Artist", "Programmer", "Spy", "Police Officer", "Nurse", "Lawyer", "Dentist", "Plumber", "Electrician", "Mechanic", "Farmer", "Astronaut", "Actor", "Singer", "Dancer", "Writer", "Scientist", "Athlete", "Politician"] },
    { category: "Movies", words: ["Titanic", "Star Wars", "Jurassic Park", "Harry Potter", "The Avengers", "Frozen", "The Lion King", "Finding Nemo", "Shrek", "Toy Story", "Avatar", "The Matrix", "Inception", "Joker", "Black Panther", "Spider-Man", "Batman", "Superman", "Wonder Woman", "Iron Man"] },
    { category: "Historical", words: ["World War II", "Ancient Egypt", "The Moon Landing", "The Titanic", "The wild West", "Medieval Times", "The Renaissance", "The Ice Age", "The Victorian Era", "The Roaring 20s", "The Great Depression", "The Cold War", "The French Revolution", "The Roman Empire", "The Viking Age"] },
    { category: "Hobbies", words: ["Gardening", "Cooking", "Painting", "Drawing", "Singing", "Dancing", "Photography", "Reading", "Writing", "Gaming", "Hiking", "Camping", "Fishing", "Hunting", "Knitting", "Sewing", "Surfing", "Skiing", "Snowboarding", "Skateboarding"] },
    { category: "Brands", words: ["Apple", "Samsung", "Nike", "Adidas", "Coca-Cola", "Pepsi", "McDonalds", "Burger King", "Amazon", "Google", "Facebook", "Instagram", "Twitter", "TikTok", "YouTube", "Netflix", "Spotify", "Disney", "Tesla", "Microsoft"] },
    { category: "Sports", words: ["Soccer", "Basketball", "Tennis", "Golf", "Volleyball", "Baseball", "Football", "Rugby", "Cricket", "Hockey", "Boxing", "Swimming", "Cycling", "Running", "Skiing", "Surfing", "Skateboarding", "Wrestling", "Gymnastics", "Karate"] },
    { category: "Holidays", words: ["Christmas", "Halloween", "Easter", "Thanksgiving", "New Year", "Valentine's Day", "Hanukkah", "Ramadan", "Diwali", "Kwanzaa", "St. Patrick's Day", "April Fools", "Mother's Day", "Father's Day", "Independence Day"] },
];

const SpyGame = ({ onNext }) => {
    const { players } = useGame();
    const { t } = useTranslation();
    const [gameState, setGameState] = useState('setup');
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [isRevealing, setIsRevealing] = useState(false);
    const [spyIndex, setSpyIndex] = useState(null);
    const [secretWord, setSecretWord] = useState('');
    const [timer, setTimer] = useState(0);
    const [votedIndex, setVotedIndex] = useState(null);
    const [voteCountdown, setVoteCountdown] = useState(0);

    const startGame = () => {
        const cat = SPY_WORDS[Math.floor(Math.random() * SPY_WORDS.length)];
        const word = cat.words[Math.floor(Math.random() * cat.words.length)];
        setSecretWord(word);

        const spy = Math.floor(Math.random() * players.length);
        setSpyIndex(spy);

        setCurrentPlayerIndex(0);
        setGameState('reveal');
        setIsRevealing(false);
    };

    const nextPlayer = () => {
        setIsRevealing(false);
        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(prev => prev + 1);
        } else {
            setTimer(180);
            setGameState('discuss');
        }
    };

    useEffect(() => {
        if (gameState !== 'discuss') return;
        const interval = setInterval(() => setTimer(t => Math.max(t - 1, 0)), 1000);
        return () => clearInterval(interval);
    }, [gameState]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    useEffect(() => {
        if (voteCountdown <= 0) return;
        const timeout = setTimeout(() => {
            if (voteCountdown === 1) {
                setGameState('vote');
                triggerHaptic(HapticType.SUCCESS);
            } else {
                triggerHaptic(HapticType.WARNING);
            }
            setVoteCountdown(v => v - 1);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [voteCountdown]);

    return (
        <div className="full-screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
                <Button onClick={onNext} variant="secondary" style={{ padding: '5px 15px', minHeight: 'auto', fontSize: '0.8rem', background: 'rgba(0,0,0,0.5)' }}>{t('skip_card')} ⏭</Button>
            </div>

            {gameState === 'setup' && (
                <>
                    <h1 style={{ color: '#fff' }}>🕵️ {t('mode_spy')}</h1>
                    <p style={{ opacity: 0.7, marginBottom: '20px' }}>{t('spy_find_liar')}</p>
                    {players.length < 3 ? <p style={{ color: '#ff5555' }}>{t('need_3_players')}</p> :
                        <Button onClick={startGame} className="btn-liquid">{t('start_game')}</Button>
                    }
                </>
            )}

            {gameState === 'reveal' && (
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <h2 style={{ marginBottom: '10px' }}>{t('spy_pass_to')}</h2>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '30px' }}>
                        {players[currentPlayerIndex].name}
                    </h1>

                    <div
                        onMouseDown={() => { setIsRevealing(true); triggerHaptic(HapticType.SELECTION); }}
                        onMouseUp={() => { setIsRevealing(false); triggerHaptic(HapticType.LIGHT); }}
                        onTouchStart={() => { setIsRevealing(true); triggerHaptic(HapticType.SELECTION); }}
                        onTouchEnd={() => { setIsRevealing(false); triggerHaptic(HapticType.LIGHT); }}
                        style={{
                            width: '200px', height: '200px',
                            borderRadius: '50%',
                            background: isRevealing ? (currentPlayerIndex === spyIndex ? '#ff0055' : '#00ffff') : '#333',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto',
                            userSelect: 'none',
                            cursor: 'pointer',
                            border: '4px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        {isRevealing ? (
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000', textAlign: 'center', padding: '10px' }}>
                                {currentPlayerIndex === spyIndex ? t('spy_you_are_spy') : secretWord}
                            </span>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ fontSize: '3rem' }}>👆</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '5px' }}>{t('spy_hold_to_reveal')}</span>
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        {isRevealing && (
                            <Button onClick={nextPlayer} variant="primary">
                                {currentPlayerIndex === players.length - 1 ? t('start_game') : t('next_player')}
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {gameState === 'discuss' && (
                <div style={{ textAlign: 'center' }}>
                    <h1>{t('time')}: {formatTime(timer)}</h1>
                    <p style={{ opacity: 0.8, marginBottom: '20px' }}>{t('spy_discuss')}</p>

                    <div style={{
                        width: '120px', height: '120px', borderRadius: '50%',
                        border: '4px solid var(--color-primary)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', margin: '20px auto',
                        fontSize: '2rem', animation: 'pulse 2s infinite'
                    }}>
                        🕵️‍♂️
                    </div>

                    {voteCountdown > 0 ? (
                        <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{voteCountdown}</div>
                    ) : (
                        <Button onClick={() => setVoteCountdown(3)} variant="primary" style={{ marginTop: '20px' }}>{t('start_countdown')}</Button>
                    )}
                </div>
            )}

            {gameState === 'vote' && (
                <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                    <h2 style={{ marginBottom: '10px' }}>{t('spy_who_is_spy')}</h2>
                    <p style={{ opacity: 0.6, marginBottom: '20px' }}>{t('spy_vote_hint')}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {players.map((p, idx) => (
                            <Button
                                key={p.id}
                                onClick={() => {
                                    setVotedIndex(idx);
                                    setGameState('result');
                                    triggerHaptic(idx === spyIndex ? HapticType.SUCCESS : HapticType.ERROR);
                                }}
                                variant="secondary"
                                style={{ padding: '15px' }}
                            >
                                {p.name}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {gameState === 'result' && (
                <div style={{ textAlign: 'center' }}>
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ fontSize: '4rem' }}
                    >
                        {votedIndex === spyIndex ? '✅' : '❌'}
                    </motion.div>

                    <h2 style={{ marginTop: '20px' }}>
                        {votedIndex === spyIndex ? t('spy_found') : t('spy_wrong')}
                    </h2>

                    <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '15px' }}>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{t('spy_the_spy_was')}</p>
                        <h1 style={{ color: '#ff0055' }}>{players[spyIndex].name}</h1>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '10px' }}>{t('spy_the_word_was')}</p>
                        <h3 style={{ color: 'var(--color-primary)' }}>{secretWord}</h3>
                    </div>

                    <Button onClick={onNext} variant="primary" style={{ marginTop: '30px' }}>{t('next_card')} ➡️</Button>
                </div>
            )}
        </div>
    );
};

export default SpyGame;
