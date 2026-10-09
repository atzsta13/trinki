import { useState, useEffect } from 'react';
import { useGame } from '../../logic/GameContext';
import { useT } from '../../i18n';
import Button from '../Shared/Button';
import PassAndReveal from './PassAndReveal';
import { triggerHaptic, HapticType } from '../../logic/haptics';

const DISCUSS_SECONDS = 180;

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];
const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

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

// Everyone but the spy sees the secret word; discuss, then vote who the spy is.
const SpyGame = ({ onNext }) => {
    const { players } = useGame();
    const t = useT();
    const [stage, setStage] = useState('setup'); // setup → reveal → discuss → vote → result
    const [playerIndex, setPlayerIndex] = useState(0);
    const [spyIndex, setSpyIndex] = useState(0);
    const [word, setWord] = useState('');
    const [timeLeft, setTimeLeft] = useState(DISCUSS_SECONDS);
    const [votedIndex, setVotedIndex] = useState(null);

    useEffect(() => {
        if (stage !== 'discuss') return;
        const interval = setInterval(() => setTimeLeft(s => Math.max(s - 1, 0)), 1000);
        return () => clearInterval(interval);
    }, [stage]);

    const start = () => {
        setWord(pickRandom(pickRandom(SPY_WORDS).words));
        setSpyIndex(Math.floor(Math.random() * players.length));
        setPlayerIndex(0);
        setStage('reveal');
    };

    const nextPlayer = () => {
        if (playerIndex < players.length - 1) setPlayerIndex(i => i + 1);
        else setStage('discuss');
    };

    const vote = (index) => {
        setVotedIndex(index);
        setStage('result');
        triggerHaptic(index === spyIndex ? HapticType.SUCCESS : HapticType.ERROR);
    };

    return (
        <div className="full">
            <Button variant="secondary" className="btn-small corner" onClick={onNext}>{t('skip_card')} ⏭</Button>

            {stage === 'setup' && (
                <div className="screen">
                    <h1>🕵️ {t('mode_spy')}</h1>
                    <p className="muted">{t('spy_find_liar')}</p>
                    {players.length < 3 ? <p className="bad">{t('need_3_players')}</p> : <Button onClick={start}>{t('start_game')}</Button>}
                </div>
            )}

            {stage === 'reveal' && (
                <PassAndReveal
                    key={playerIndex}
                    playerName={players[playerIndex].name}
                    secret={playerIndex === spyIndex ? t('spy_you_are_spy') : word}
                    isImpostor={playerIndex === spyIndex}
                    doneLabel={playerIndex === players.length - 1 ? t('start_game') : t('next_player')}
                    onDone={nextPlayer}
                />
            )}

            {stage === 'discuss' && (
                <div className="screen">
                    <h1>{t('time')}: {formatTime(timeLeft)}</h1>
                    <p className="muted">{t('spy_discuss')}</p>
                    <div className="huge pulse">🕵️‍♂️</div>
                    <Button onClick={() => setStage('vote')}>{t('spy_who_is_spy')}</Button>
                </div>
            )}

            {stage === 'vote' && (
                <div className="screen">
                    <h2>{t('spy_who_is_spy')}</h2>
                    <p className="muted">{t('spy_vote_hint')}</p>
                    <div className="vote-grid">
                        {players.map((p, i) => <Button key={p.id} variant="secondary" onClick={() => vote(i)}>{p.name}</Button>)}
                    </div>
                </div>
            )}

            {stage === 'result' && (
                <div className="screen">
                    <div className="huge pop-in">{votedIndex === spyIndex ? '✅' : '❌'}</div>
                    <h2>{votedIndex === spyIndex ? t('spy_found') : t('spy_wrong')}</h2>
                    <div className="panel stack">
                        <p className="muted small">{t('spy_the_spy_was')}</p>
                        <h1 className="bad">{players[spyIndex].name}</h1>
                        <p className="muted small">{t('spy_the_word_was')}</p>
                        <h3 className="accent">{word}</h3>
                    </div>
                    <Button onClick={onNext}>{t('next_card')} ➡️</Button>
                </div>
            )}
        </div>
    );
};

export default SpyGame;
