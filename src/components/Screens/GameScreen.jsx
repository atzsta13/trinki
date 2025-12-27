import React, { useState, lazy } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { useGame } from '../../logic/GameContext';
import { useTranslation } from 'react-i18next';
import Card from '../Shared/Card';
import Button from '../Shared/Button';
import SettingsModal from '../Shared/SettingsModal';
import { triggerHaptic, HapticType } from '../../logic/haptics';
import { playClick, playSuccess, playError, playPop } from '../../logic/sound';
import { triggerConfetti, triggerEmojiBurst } from '../../logic/confetti';

const BombGame = lazy(() => import('../Games/BombGame'));
const SpyGame = lazy(() => import('../Games/SpyGame'));
const CharadesGame = lazy(() => import('../Games/CharadesGame'));
const FakeArtistGame = lazy(() => import('../Games/FakeArtistGame'));
const SecretsGame = lazy(() => import('../Games/SecretsGame'));
const DarkTalesGame = lazy(() => import('../Games/DarkTalesGame'));

const ConfirmationDialog = ({ title, message, onConfirm, onCancel, confirmLabel = "Yes", cancelLabel = "Cancel", isDestructive = false }) => (
    <div className="modal-overlay" style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box'
    }}>
        <div className="glass-panel" style={{
            padding: '30px',
            width: '100%',
            maxWidth: '320px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '20px'
        }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text)' }}>{title}</h3>
            <p style={{ fontSize: '1rem', opacity: 0.8, margin: 0 }}>{message}</p>
            <div style={{ display: 'flex', gap: '15px', width: '100%', marginTop: '10px' }}>
                <Button onClick={onCancel} variant="secondary" fullWidth style={{ fontSize: '0.9rem' }}>{cancelLabel}</Button>
                <Button onClick={onConfirm} style={{
                    fontSize: '0.9rem',
                    width: '100%',
                    background: isDestructive ? '#ff0055' : 'var(--color-primary)',
                    boxShadow: isDestructive ? '0 4px 15px rgba(255,0,85,0.4)' : 'none'
                }}>
                    {confirmLabel}
                </Button>
            </div>
        </div>
    </div>
);

const GameScreen = () => {
    const {
        currentCard,
        gameMode,
        nextCard,
        gameState,
        resetGame,
        goHome,
        addPlayer,
        players,
        updatePlayerDrinkCount,
        updatePlayerStreak,
        settings,
        playedCards,
        deck,
        finishGame,
        activeViruses,
        removeVirus
    } = useGame();

    const { t } = useTranslation();
    const controls = useAnimation();
    const [showAddPlayer, setShowAddPlayer] = useState(false);
    const [showTipsyCounter, setShowTipsyCounter] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [streakNotification, setStreakNotification] = useState(null);
    const [confirmation, setConfirmation] = useState(null);
    const [ttsEnabled, setTtsEnabled] = useState(false);

    React.useEffect(() => {
        if (ttsEnabled && currentCard) {
            const text = getCardText(currentCard);
            if (text) {
                const utterance = new SpeechSynthesisUtterance(text);
                if (settings.language === 'de') utterance.lang = 'de-DE';
                else if (settings.language === 'es') utterance.lang = 'es-ES';
                else if (settings.language === 'fr') utterance.lang = 'fr-FR';
                else if (settings.language === 'it') utterance.lang = 'it-IT';
                else utterance.lang = 'en-US';

                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(utterance);
            }
        } else {
            window.speechSynthesis.cancel();
        }
    }, [currentCard, ttsEnabled, settings.language]);

    const handleCardResult = (success) => {
        if (currentCard && currentCard.targetPlayerId) {
            updatePlayerStreak(currentCard.targetPlayerId, success);

            if (success) {
                const player = players.find(p => p.id === currentCard.targetPlayerId);
                if (player) {
                    const newStreak = (player.streak || 0) + 1;
                    if (newStreak >= 3) {
                        setStreakNotification(`${player.name} is on fire! 🔥 ${newStreak} `);
                        setTimeout(() => setStreakNotification(null), 3000);
                        playSuccess();

                        if (newStreak >= 5) {
                            triggerEmojiBurst(['👑', '💎', '🦄', '✨']);
                            triggerConfetti();
                        } else {
                            triggerEmojiBurst(['🔥', '🌶️', '🥵', '⚡']);
                        }
                    }
                }
            }
        }
    };

    const handleHome = () => {
        playClick();
        triggerHaptic(HapticType.MEDIUM);
        setConfirmation({
            title: t('leave_party_title'),
            message: t('leave_party_message'),
            confirmLabel: t('exit_game_button'),
            isDestructive: true,
            onConfirm: () => {
                setConfirmation(null);
                goHome();
            }
        });
    };

    const handleFinish = () => {
        playClick();
        triggerHaptic(HapticType.MEDIUM);
        setConfirmation({
            title: t('finish_game_title'),
            message: t('finish_game_message'),
            confirmLabel: t('finish_button'),
            onConfirm: () => {
                setConfirmation(null);
                finishGame();
            }
        });
    };

    const totalCards = (deck ? deck.length : 0) + (playedCards ? playedCards.length : 0) + (currentCard ? 1 : 0);
    const progress = totalCards > 0 ? (playedCards ? playedCards.length : 0) / totalCards : 0;

    const getTheme = (p) => {
        if (p < 0.33) return { bg: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)', name: t('level_chill'), color: '#00ffff' };
        if (p < 0.66) return { bg: 'linear-gradient(to bottom, #2c003e, #4c005e)', name: t('level_wild'), color: '#ff00ff' };
        return { bg: 'linear-gradient(to bottom, #3e0000, #6e0000)', name: t('level_chaos'), color: '#ff0055' };
    };

    const theme = getTheme(progress);

    const handleAddPlayer = (e) => {
        e.preventDefault();
        if (newPlayerName.trim()) {
            playSuccess();
            triggerHaptic(HapticType.SUCCESS);
            addPlayer(newPlayerName.trim());
            setNewPlayerName('');
            setShowAddPlayer(false);
            alert(t('player_joined', { playerName: newPlayerName }));
        }
    };

    const getCardText = (card) => {
        if (!card) return "";
        if (card.translationKey) {
            return t(`challenges:${card.translationKey}`, { ...card.args, defaultValue: card.text }) || card.text || "";
        }
        return card.text || "";
    };

    const isChoiceCard = () => {
        if (!currentCard) return false;
        const text = getCardText(currentCard).toLowerCase();
        const type = currentCard.type;
        if (text.match(/(or drink|or penalty|or finish|if you refuse|if yes, drink|if yes penalty|if yes take)/i)) return true;
        if (type === 'truth' || type === 'dare') return true;
        return false;
    };

    const handleAction = (action) => {
        if (action === 'drink') {
            playError();
            triggerHaptic(HapticType.HEAVY);
            let amount = currentCard.sips || 1;

            if (currentCard.sips === undefined && currentCard.points === undefined) {
                const text = getCardText(currentCard).toLowerCase();
                const match = text.match(/(?:drink|penalty|points|take|lose) (\d+)/i);
                if (match) {
                    amount = parseInt(match[1], 10);
                } else if (text.includes('finish your drink')) {
                    amount = 5;
                }
            }

            if (currentCard.targetPlayerId) {
                updatePlayerDrinkCount(currentCard.targetPlayerId, amount);
            }
        } else {
            playSuccess();
            triggerHaptic(HapticType.SUCCESS);
        }
        nextCard();
    };

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

    const bind = useDrag(({ active, movement: [mx, my], velocity: [vx, vy], direction: [xDir], last }) => {
        if (active) {
            x.set(mx);

            // Textural Haptic Feedback: Trigger a faint click every 10px of movement
            const prevMx = x.getPrevious() || 0;
            if (Math.floor(Math.abs(mx) / 10) !== Math.floor(Math.abs(prevMx) / 10)) {
                triggerHaptic(HapticType.SELECTION);
            }

            // Distinct tick when crossing the dismissal threshold
            if (Math.abs(mx) >= 100 && Math.abs(prevMx) < 100) {
                triggerHaptic(HapticType.MEDIUM);
            }
        } else {
            const showButtons = isChoiceCard();
            const threshold = 100;
            const velocityThreshold = 0.4; // Lowered for better snappiness

            if (mx > threshold || (vx > velocityThreshold && xDir > 0)) {
                triggerHaptic(HapticType.HEAVY);
                controls.start({
                    x: 600,
                    opacity: 0,
                    scale: 0.8,
                    rotate: 20,
                    transition: { duration: 0.2, ease: "easeIn" }
                }).then(() => {
                    if (showButtons) handleAction('done');
                    else { playPop(); nextCard(); }
                    controls.set({ x: 0, opacity: 1, rotate: 0, scale: 1 });
                    x.set(0);
                });
            }
            else if (mx < -threshold || (vx > velocityThreshold && xDir < 0)) {
                triggerHaptic(HapticType.HEAVY);
                controls.start({
                    x: -600,
                    opacity: 0,
                    scale: 0.8,
                    rotate: -20,
                    transition: { duration: 0.2, ease: "easeIn" }
                }).then(() => {
                    if (showButtons) handleAction('penalty');
                    else {
                        playPop();
                        if (Math.random() > 0.7) triggerEmojiBurst(['💀', '📉', '🥀', '🤏']);
                        nextCard();
                    }
                    controls.set({ x: 0, opacity: 1, rotate: 0, scale: 1 });
                    x.set(0);
                });
            }
            else {
                // High-stiffness spring for "snap back" feel
                controls.start({
                    x: 0, opacity: 1, rotate: 0, scale: 1,
                    transition: { type: 'spring', stiffness: 800, damping: 35 }
                });
            }
        }
    }, {
        from: () => [x.get(), 0],
        filterTaps: true,
        rubberband: true,
        axis: 'lock',
        pointer: { touch: true },
        touchAction: 'pan-y'
    });

    if (gameState === 'finished') {
        const sortedPlayers = [...players].sort((a, b) => (b.drinkCount || 0) - (a.drinkCount || 0));
        const mvp = sortedPlayers[0];

        return (
            <div className="full-screen" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '30px',
                padding: '20px',
                textAlign: 'center'
            }}>
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                    <h2 style={{ fontSize: '3.5rem', margin: 0, textShadow: '0 0 20px rgba(255, 0, 153, 0.6)' }}>
                        {t('game_over')}
                    </h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>{t('hope_epic')}</p>
                </motion.div>

                {mvp && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel"
                        style={{
                            padding: '30px',
                            width: '100%',
                            maxWidth: '350px',
                            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(0,0,0,0.4))',
                            borderColor: 'gold',
                            boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative'
                        }}
                    >
                        <div style={{ fontSize: '4rem', position: 'absolute', top: '-40px' }}>👑</div>
                        <h3 style={{ color: 'gold', fontSize: '1.5rem', marginBottom: '10px', marginTop: '20px' }}>PARTY MVP</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{mvp.name}</div>
                        <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>{mvp.drinkCount || 0} {t('points')}</div>
                    </motion.div>
                )}

                <div style={{ width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '10px', height: '150px', overflowY: 'auto' }}>
                    {sortedPlayers.slice(1).map((p, i) => (
                        <div key={p.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '12px 20px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontWeight: 'bold' }}>#{i + 2} {p.name}</span>
                            <span>{p.drinkCount || 0} pts</span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '350px' }}>
                    <Button onClick={() => { playClick(); triggerHaptic(HapticType.MEDIUM); resetGame(); }} fullWidth variant="primary">
                        {t('play_again')} 🔄
                    </Button>
                    <Button onClick={() => { playClick(); goHome(); }} fullWidth variant="secondary">
                        🏠
                    </Button>
                </div>
            </div>
        );
    }

    if (currentCard) {
        if (currentCard.type === 'bomb') {
            return <React.Suspense fallback={<div>Loading...</div>}><BombGame onNext={() => { playSuccess(); nextCard(); }} initialMode={currentCard.args?.mode || 'classic'} /></React.Suspense>;
        }
        if (currentCard.type === 'spy') {
            return <React.Suspense fallback={<div>Loading...</div>}><SpyGame /></React.Suspense>;
        }
        if (currentCard.type === 'charades') {
            return <React.Suspense fallback={<div>Loading...</div>}><CharadesGame /></React.Suspense>;
        }
        if (currentCard.type === 'fakeArtist') {
            return <React.Suspense fallback={<div>Loading...</div>}><FakeArtistGame /></React.Suspense>;
        }
        if (currentCard.type === 'secrets') {
            return <React.Suspense fallback={<div>Loading...</div>}><SecretsGame /></React.Suspense>;
        }
        if (currentCard.type === 'darkTales') {
            return <React.Suspense fallback={<div>Loading...</div>}><DarkTalesGame /></React.Suspense>;
        }
    }

    if (!currentCard) return null;

    const showButtons = isChoiceCard();

    return (
        <div className="full-screen" style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            background: 'transparent',
            transition: 'background 1s ease'
        }}>
            <AnimatePresence>
                {streakNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1.1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        style={{
                            position: 'absolute',
                            top: '80px',
                            left: '50%',
                            x: '-50%',
                            padding: '12px 30px',
                            borderRadius: '30px',
                            color: '#fff',
                            fontWeight: '800',
                            letterSpacing: '0.05em',
                            fontSize: '1.2rem',
                            zIndex: 200,
                            boxShadow: '0 10px 30px rgba(255, 0, 85, 0.6)',
                            background: 'linear-gradient(45deg, #FF0099, #FF5400)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            minWidth: '200px'
                        }}
                    >
                        {streakNotification}
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '20px',
                zIndex: 100,
                alignItems: 'center'
            }}>
                <Button
                    onClick={() => { playClick(); setShowSettings(true); }}
                    variant="secondary"
                    style={{
                        width: '44px', height: '44px',
                        padding: 0,
                        fontSize: '1.4rem',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}
                >
                    ☰
                </Button>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <div
                        onClick={() => { playClick(); setTtsEnabled(!ttsEnabled); }}
                        style={{
                            background: ttsEnabled ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                            color: 'white',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '1.1rem',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        {ttsEnabled ? '🗣️' : '🔇'}
                    </div>

                    {activeViruses.length > 0 && (
                        <div
                            onClick={() => { playClick(); setShowRules(true); }}
                            style={{
                                background: '#9900ff',
                                color: 'white',
                                padding: '5px 15px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                boxShadow: '0 0 10px #9900ff',
                                cursor: 'pointer'
                            }}
                        >
                            <span>📜</span>
                            <span>{activeViruses.length}</span>
                        </div>
                    )}
                </div>

                <div style={{ width: '44px' }} />
            </div>

            {confirmation && (
                <ConfirmationDialog
                    title={confirmation.title}
                    message={confirmation.message}
                    confirmLabel={confirmation.confirmLabel}
                    isDestructive={confirmation.isDestructive}
                    onConfirm={confirmation.onConfirm}
                    onCancel={() => { playClick(); setConfirmation(null); }}
                />
            )}

            <AnimatePresence>
                {showRules && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 300,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                background: 'var(--color-card-bg)',
                                borderTopLeftRadius: '24px',
                                borderTopRightRadius: '24px',
                                borderTop: '1px solid var(--color-card-border)',
                                boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '24px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)' }}>Active Rules</h2>
                                <Button onClick={() => setShowRules(false)} variant="secondary" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>✕</Button>
                            </div>

                            {activeViruses.length === 0 ? (
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', opacity: 0.6 }}>
                                    <span style={{ fontSize: '3rem', marginBottom: '10px' }}>🧘</span>
                                    <p>No active viruses... yet.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' }}>
                                    {activeViruses.map((v, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                padding: '15px',
                                                borderRadius: '16px',
                                                borderLeft: '4px solid #00FF66',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <p style={{ margin: 0, fontSize: '1rem', flex: 1, fontWeight: '500' }}>{getCardText(v)}</p>
                                            <Button
                                                onClick={() => { playClick(); removeVirus(v.id); }}
                                                variant="secondary"
                                                style={{ padding: '8px 12px', fontSize: '0.8rem', marginLeft: '10px', borderColor: '#ff5555', color: '#ff5555' }}
                                            >
                                                End
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {showSettings && <SettingsModal onClose={() => { playClick(); setShowSettings(false); }} />}

            {showAddPlayer && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.9)',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h3>Add New Player</h3>
                    <form onSubmit={handleAddPlayer} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <input
                            type="text"
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            placeholder="Name..."
                            style={{ padding: '10px', borderRadius: '5px' }}
                        />
                        <Button onClick={handleAddPlayer}>Add</Button>
                    </form>
                    <Button onClick={() => { playClick(); triggerHaptic(HapticType.LIGHT); setShowAddPlayer(false); }} variant="secondary" style={{ marginTop: '20px' }}>Cancel</Button>
                </div>
            )}

            {showTipsyCounter && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.95)',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px',
                    boxSizing: 'border-box',
                    overflowY: 'auto'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>Scoreboard</h3>
                        <Button onClick={() => { playClick(); triggerHaptic(HapticType.LIGHT); setShowTipsyCounter(false); }} variant="secondary">✕</Button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {players.map(p => (
                            <div key={p.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: '#333',
                                padding: '15px',
                                borderRadius: '10px'
                            }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{p.name} {p.streak >= 3 ? `🔥 ${p.streak} ` : ''}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{p.drinkCount || 0}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#aaa' }}>
                                            Points
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 20px',
                position: 'relative',
                width: '100%',
                overflow: 'hidden'
            }}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        {...bind()}
                        key={currentCard ? currentCard.id : 'empty'}
                        animate={controls}
                        initial={{ scale: 0.8, opacity: 0, y: 50, x: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: -50, transition: { duration: 0.15 } }}
                        whileInView={{ scale: 1, opacity: 1, y: 0 }}
                        style={{
                            x,
                            rotate,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'grab',
                            touchAction: 'pan-y'
                        }}
                    >
                        <Card
                            type={currentCard.type}
                            text={currentCard.text}
                            translationKey={currentCard.translationKey}
                            args={currentCard.args}
                            onClick={showButtons ? undefined : () => { playPop(); triggerHaptic(HapticType.MEDIUM); nextCard(); }}
                            showTapHint={false}
                            sips={currentCard.points || currentCard.sips}
                            spiciness={currentCard.spiciness}
                            onResult={handleCardResult}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div style={{
                height: 'calc(60px + env(safe-area-inset-bottom))',
                width: '100%',
                flexShrink: 0,
                zIndex: 10
            }} />
        </div>
    );
};

export default GameScreen;
