import { useState } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../../logic/GameContext';
import { useTranslation } from 'react-i18next';
import Button from '../Shared/Button';
import { playPop, playSuccess, playClick } from '../../logic/sound';
import { triggerHaptic, HapticType } from '../../logic/haptics';

const shuffle = (list) => {
    const result = [...list];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

const randomBetween = (min, max) => Math.random() * (max - min) + min;

// Flight paths for the shuffle animation, rolled once so renders stay pure.
const SHUFFLE_PATHS = Array.from({ length: 6 }, (_, i) => ({
    x: [(i - 2.5) * 10, randomBetween(-150, 150), randomBetween(-150, 150), (i - 2.5) * 5],
    y: [0, randomBetween(-100, 100), randomBetween(-100, 100), 0],
    rotate: [i * 5, randomBetween(-360, 360), randomBetween(-360, 360), i * 2]
}));

const SecretsGame = ({ card, onNext }) => {
    const { players } = useGame();
    const { t } = useTranslation();

    const [stage, setStage] = useState('intro');
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const [revealedIndex, setRevealedIndex] = useState(null);
    const question = t(`challenges:${card.translationKey}`);

    const currentPlayer = players[currentPlayerIndex];

    const handleStart = () => {
        playClick();
        setStage('pass');
    };

    const handlePassConfirm = () => {
        playClick();
        setStage('input');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!currentInput.trim()) return;

        playSuccess();
        triggerHaptic(HapticType.SUCCESS);

        const newAnswers = [...answers, {
            text: currentInput,
            playerId: currentPlayer.id,
            playerName: currentPlayer.name
        }];
        setAnswers(newAnswers);
        setCurrentInput('');

        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(prev => prev + 1);
            setStage('pass');
        } else {
            setShuffledAnswers(shuffle(newAnswers));
            setStage('shuffling');
            setTimeout(() => {
                setStage('reveal');
            }, 3000);
        }
    };

    const handleRevealAuthor = (index) => {
        if (revealedIndex === index) setRevealedIndex(null);
        else setRevealedIndex(index);
        playPop();
    };


    if (stage === 'intro') {
        return (
            <div className="full-screen" style={{
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                padding: '40px', textAlign: 'center', gap: '30px'
            }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ fontSize: '4rem' }}
                >
                    🤫
                </motion.div>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{t('secrets_intro_title')}</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
                        {t('secrets_intro_desc')}
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '20px',
                    borderRadius: '15px',
                    fontStyle: 'italic',
                    fontSize: '1.3rem'
                }}>
                    "{question}"
                </div>

                <Button onClick={handleStart} variant="primary">Start</Button>
                <Button onClick={onNext} variant="secondary">{t('skip_card')}</Button>
            </div>
        );
    }

    if (stage === 'pass') {
        return (
            <div className="full-screen" style={{
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                padding: '40px', textAlign: 'center', gap: '30px',
                background: '#000'
            }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ fontSize: '3rem' }}
                >
                    📱➡️
                </motion.div>
                <h2>{t('secrets_pass_title')}</h2>
                <h1 style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>{currentPlayer.name}</h1>
                <p style={{ opacity: 0.6 }}>{t('secrets_pass_desc')}</p>
                <Button onClick={handlePassConfirm} variant="primary">{t('secrets_btn_iam', { name: currentPlayer.name })}</Button>
            </div>
        );
    }

    if (stage === 'input') {
        return (
            <div className="full-screen" style={{
                display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-start', alignItems: 'center',
                padding: '20px', paddingTop: '60px', gap: '20px'
            }}>
                <div style={{ padding: '0 20px', width: '100%', textAlign: 'center' }}>
                    <h3 style={{ opacity: 0.7 }}>{currentPlayer.name}'s Answer</h3>
                    <h2 style={{ fontSize: '1.5rem', marginTop: '10px' }}>{question}</h2>
                </div>

                <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <textarea
                        autoFocus
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder={t('secrets_placeholder')}
                        style={{
                            width: '100%',
                            flex: 1,
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '15px',
                            color: 'white',
                            fontSize: '1.2rem',
                            padding: '20px',
                            resize: 'none',
                            outline: 'none',
                            marginBottom: '20px'
                        }}
                    />
                    <Button type="submit" disabled={!currentInput.trim()} fullWidth variant="primary">
                        {t('secrets_btn_submit')}
                    </Button>
                </form>
            </div>
        );
    }

    if (stage === 'shuffling') {
        return (
            <div className="full-screen" style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px'
            }}>
                <div style={{ position: 'relative', width: '240px', height: '160px', perspective: '1000px' }}>
                    {SHUFFLE_PATHS.map((path, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                ...path,
                                z: [0, 100, 200, 0],
                                rotateY: [0, 180, 360, 0],
                                rotateX: [0, 45, -45, 0]
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.1
                            }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, var(--color-primary), #9900ff)',
                                borderRadius: '15px',
                                border: '2px solid rgba(255,255,255,0.4)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backfaceVisibility: 'hidden',
                                fontSize: '4rem'
                            }}
                        >
                            🤫
                        </motion.div>
                    ))}
                </div>
                <motion.h2
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    {t('secrets_shuffling')}
                </motion.h2>
            </div>
        );
    }

    if (stage === 'reveal') {
        return (
            <div className="full-screen" style={{
                display: 'flex', flexDirection: 'column',
                padding: '20px', paddingTop: '40px', gap: '20px'
            }}>
                <h2 style={{ textAlign: 'center' }}>{t('secrets_reveal_title')}</h2>

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    paddingBottom: '80px'
                }}>
                    {shuffledAnswers.map((answer, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            onClick={() => handleRevealAuthor(index)}
                            style={{
                                background: revealedIndex === index ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                padding: '20px',
                                borderRadius: '15px',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <p style={{ fontSize: '1.3rem', margin: 0, fontWeight: '500' }}>"{answer.text}"</p>

                            {revealedIndex === index && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ marginTop: '10px', fontSize: '0.9rem', fontWeight: 'bold', color: 'black' }}
                                >
                                    — {answer.playerName}
                                </motion.div>
                            )}

                            {revealedIndex !== index && (
                                <div style={{
                                    marginTop: '10px', fontSize: '0.8rem', opacity: 0.5,
                                    textTransform: 'uppercase', letterSpacing: '1px'
                                }}>
                                    {t('secrets_hint_tap')}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                <div style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%',
                    padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,1), transparent)'
                }}>
                    <Button onClick={onNext} fullWidth variant="secondary">{t('secrets_btn_finish')}</Button>
                </div>
            </div>
        );
    }

    return null;
};

export default SecretsGame;
