import { useState, useEffect } from 'react';
import { useT } from '../../i18n';
import Button from '../Shared/Button';
import { playSuccess, playError, playPop } from '../../logic/sound';
import { triggerHaptic, HapticType } from '../../logic/haptics';

const ROUND_SECONDS = 60;

const CharadesGame = ({ onNext }) => {
    const t = useT();
    const [gameState, setGameState] = useState('setup'); // setup, playing, finished
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
    const [currentWord, setCurrentWord] = useState('');

    const nextWord = () => {
        const words = t.words.charades;
        setCurrentWord(words[Math.floor(Math.random() * words.length)]);
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
                <h1>🎭 {t('mode_charades')}</h1>
                <p>{t('charades_howto_1')}</p>
                <p>{t('charades_howto_2')}</p>
                <Button onClick={startGame}>{t('start_game')}</Button>
                <Button variant="secondary" onClick={onNext}>{t('skip_card')}</Button>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="screen">
                <h1>{t('times_up')}</h1>
                <div className="huge good">{score}</div>
                <p>{t('points')}</p>
                <Button onClick={onNext}>{t('next_card')} ➡️</Button>
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
                <Button className="btn-big btn-stop" onClick={handlePass}>{t('charades_pass')}</Button>
                <Button className="btn-big btn-go" onClick={handleCorrect}>{t('charades_correct')}</Button>
            </div>
        </div>
    );
};

export default CharadesGame;
