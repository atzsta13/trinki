import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../logic/GameContext';
import { useTranslation } from 'react-i18next';
import Button from '../Shared/Button';
import { playPop, playClick, playSuccess } from '../../logic/sound';
import { triggerHaptic, HapticType } from '../../logic/haptics';

const DarkTalesGame = () => {
    const { players, nextCard, currentCard } = useGame();
    const { t } = useTranslation();

    const [stage, setStage] = useState('intro');
    const [narrator, setNarrator] = useState(players[0] || { name: 'Player' });
    const [showSolution, setShowSolution] = useState(false);

    const title = t(`challenges:${currentCard.translationKey}_title`);
    const story = t(`challenges:${currentCard.translationKey}_story`);
    const solution = t(`challenges:${currentCard.translationKey}_solution`);

    const handleStart = () => {
        playClick();
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        setNarrator(randomPlayer);
        setStage('assign');
    };

    const handleConfirmNarrator = () => {
        playClick();
        setStage('riddle');
    };

    const handleToggleSolution = () => {
        if (!showSolution) {
            triggerHaptic(HapticType.WARNING);
        } else {
            triggerHaptic(HapticType.LIGHT);
        }
        setShowSolution(!showSolution);
        playPop();
    };

    const handleFinish = () => {
        playSuccess();
        nextCard();
    };


    if (stage === 'intro') {
        return (
            <div className="full-screen" style={{
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                padding: '40px', textAlign: 'center', gap: '30px',
                background: 'linear-gradient(to bottom, #1a0b0b, #000)'
            }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ fontSize: '4rem' }}
                >
                    🧛
                </motion.div>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#ff4444' }}>{t('dark_tales_title')}</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
                        {t('dark_tales_intro')}
                    </p>
                </div>
                <Button onClick={handleStart} variant="primary" style={{ background: '#ff4444', borderColor: '#ff0000' }}>
                    {t('start_button')}
                </Button>
            </div>
        );
    }

    if (stage === 'assign') {
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
                    📖
                </motion.div>
                <h2>{t('dark_tales_narrator_assign')}</h2>
                <h1 style={{ fontSize: '3rem', color: '#ff4444' }}>{narrator.name}</h1>
                <p style={{ opacity: 0.6 }}>{t('dark_tales_narrator_warn')}</p>

                <div style={{ marginTop: 'auto', width: '100%' }}>
                    <Button onClick={handleConfirmNarrator} fullWidth variant="primary" style={{ background: '#ff4444', borderColor: '#ff0000' }}>
                        {t('dark_tales_btn_iam', { name: narrator.name })}
                    </Button>
                </div>
            </div>
        );
    }

    if (stage === 'riddle') {
        return (
            <div className="full-screen" style={{
                display: 'flex', flexDirection: 'column',
                padding: '20px', paddingTop: '40px', gap: '20px',
                background: 'linear-gradient(to bottom, #2d1313, #000)'
            }}>
                <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        alignSelf: 'center',
                        border: '1px solid #ff4444',
                        color: '#ff4444',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        boxShadow: '0 0 15px rgba(255, 68, 68, 0.3)'
                    }}>
                    {t('dark_tales_narrator_badge')}
                </motion.div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{ fontSize: '2rem', textAlign: 'center', color: '#fff' }}>{title}</motion.h2>

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '25px',
                            borderRadius: '15px',
                            fontSize: '1.2rem',
                            lineHeight: '1.6',
                            fontStyle: 'italic',
                            borderLeft: '4px solid #ff4444',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                        }}>
                        "{story}"
                    </motion.div>

                    <div style={{ textAlign: 'center', opacity: 0.7, fontSize: '0.9rem', marginTop: '10px' }}>
                        {t('dark_tales_instruction')}
                    </div>
                </div>

                {/* Solution Reveal Section */}
                <div style={{
                    background: showSolution ? '#1a0b0b' : 'rgba(255,255,255,0.05)',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    border: showSolution ? '1px solid #ff4444' : 'none'
                }}>
                    <div
                        onClick={handleToggleSolution}
                        style={{
                            padding: '15px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            background: showSolution ? 'rgba(255, 68, 68, 0.2)' : 'transparent'
                        }}
                    >
                        <span style={{ fontWeight: 'bold' }}>{t('dark_tales_solution_label')}</span>
                        <span>{showSolution ? '👁️' : '🔒'}</span>
                    </div>

                    <AnimatePresence>
                        {showSolution && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    {solution}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <Button onClick={handleFinish} fullWidth variant="secondary">
                        {t('dark_tales_btn_solved')}
                    </Button>
                </div>
            </div>
        );
    }

    return null;
};

export default DarkTalesGame;
