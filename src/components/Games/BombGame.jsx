import { useState, useEffect } from 'react';
import { useT } from '../../i18n';
import Button from '../Shared/Button';
import { triggerHaptic, HapticType } from '../../logic/haptics';
import { playError } from '../../logic/sound';

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

// `card.bombMode` picks the variant; plain bomb cards ("Name 3 ...") play as a panic round with their own prompt.
const BombGame = ({ card, onNext }) => {
    const t = useT();
    const { bomb: CATEGORIES, panic: PANIC_PROMPTS } = t.words;
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
            setPrompt(card.duration ? t(card.translationKey, { defaultValue: card.text }) : pickRandom(PANIC_PROMPTS));
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

    // Speeds up as time runs out: calm → hurry → panic.
    const urgency = secondsLeft > 10 ? 'calm' : secondsLeft > 5 ? 'hurry' : 'panic';

    if (gameState === 'setup') {
        return (
            <div className="screen bomb">
                <h2>{t(`bomb_${mode}_title`)}</h2>
                <p className="muted">{t(`bomb_${mode}_desc`)}</p>
                <Button onClick={startRound}>{t('bomb_light_fuse')}</Button>
                <Button variant="secondary" onClick={onNext}>{t('skip_card')}</Button>
            </div>
        );
    }

    if (gameState === 'boom') {
        return (
            <div className="screen bomb boom">
                <h1 className="huge">💥 BOOM 💥</h1>
                <p>{t('bomb_lose')}</p>
                <Button onClick={onNext}>{t('next_card')} ➡️</Button>
            </div>
        );
    }

    return (
        <div className={`screen bomb ${urgency}`}>
            <p className="muted big">{mode === 'alphabet' ? `${t('category')}: ${prompt}` : t('bomb_topic')}</p>
            <h1>{mode === 'alphabet' ? `${t('bomb_letter')}: ${letter}` : prompt}</h1>
            {/* Classic hides the timer so nobody knows when it blows. */}
            <div className="bomb-timer">{mode === 'classic' ? '💣' : secondsLeft}</div>
            {mode !== 'classic' && (
                <Button className="btn-go" onClick={nextRound}>{mode === 'alphabet' ? t('bomb_next_letter') : t('bomb_pass')}</Button>
            )}
        </div>
    );
};

export default BombGame;
