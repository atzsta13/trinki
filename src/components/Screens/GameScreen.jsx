import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useAnimationControls, useMotionValue, useTransform } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../logic/GameContext';
import Card from '../Shared/Card';
import Button from '../Shared/Button';
import SettingsModal from '../Shared/SettingsModal';
import { triggerHaptic, HapticType } from '../../logic/haptics';
import { playClick, playSuccess, playError, playPop } from '../../logic/sound';
import { triggerConfetti, triggerEmojiBurst } from '../../logic/confetti';

const MINIGAMES = {
    bomb: lazy(() => import('../Games/BombGame')),
    spy: lazy(() => import('../Games/SpyGame')),
    charades: lazy(() => import('../Games/CharadesGame')),
    fakeArtist: lazy(() => import('../Games/FakeArtistGame')),
    secrets: lazy(() => import('../Games/SecretsGame')),
    darkTales: lazy(() => import('../Games/DarkTalesGame'))
};

const TTS_LOCALES = {
    en: 'en-US', de: 'de-DE', es: 'es-ES', fr: 'fr-FR', it: 'it-IT',
    pt: 'pt-PT', nl: 'nl-NL', pl: 'pl-PL', tr: 'tr-TR', sv: 'sv-SE'
};

const SWIPE_THRESHOLD = 100;
const SWIPE_VELOCITY = 500; // px/s
const CHOICE_PATTERN = /(or drink|or penalty|or finish|if you refuse|if yes, drink|if yes penalty|if yes take)/i;

const roundButtonStyle = {
    width: '44px', height: '44px',
    padding: 0,
    fontSize: '1.4rem',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
};

const GameOverScreen = ({ players, onPlayAgain, onHome }) => {
    const { t } = useTranslation();
    const sortedPlayers = [...players].sort((a, b) => (b.drinkCount || 0) - (a.drinkCount || 0));
    const [mvp, ...rest] = sortedPlayers;

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
                {rest.map((p, i) => (
                    <div key={p.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 20px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontWeight: 'bold' }}>#{i + 2} {p.name}</span>
                        <span>{p.drinkCount || 0} {t('points')}</span>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '350px' }}>
                <Button onClick={onPlayAgain} fullWidth variant="primary">
                    {t('play_again')} 🔄
                </Button>
                <Button onClick={onHome} fullWidth variant="secondary">
                    🏠
                </Button>
            </div>
        </div>
    );
};

const ActiveRulesSheet = ({ rules, getCardText, onEnd, onClose }) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.8)',
                zIndex: 300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
            }}
        >
            <div style={{
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
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)' }}>{t('active_rules')}</h2>
                    <Button onClick={onClose} variant="secondary" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>✕</Button>
                </div>

                {rules.length === 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', opacity: 0.6 }}>
                        <span style={{ fontSize: '3rem', marginBottom: '10px' }}>🧘</span>
                        <p>{t('no_active_rules')}</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' }}>
                        {rules.map((rule, i) => (
                            <motion.div
                                key={rule.instanceId}
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
                                <p style={{ margin: 0, fontSize: '1rem', flex: 1, fontWeight: '500' }}>{getCardText(rule)}</p>
                                <Button
                                    onClick={() => onEnd(rule.instanceId)}
                                    variant="secondary"
                                    style={{ padding: '8px 12px', fontSize: '0.8rem', marginLeft: '10px', borderColor: '#ff5555', color: '#ff5555' }}
                                >
                                    {t('end_rule')}
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// One instance per card (keyed by the parent), so every card starts with fresh motion values.
// Swiping right/left flies the card out and then reports the direction.
const SwipeCard = ({ onSwipe, children }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const controls = useAnimationControls();
    // A drag ends with a click on the card; this keeps it from also counting as a tap.
    const draggedRef = useRef(false);
    const swipedRef = useRef(false);

    useEffect(() => {
        controls.start({ scale: 1, opacity: 1, y: 0 });
    }, [controls]);

    const flyOut = (direction) => {
        if (swipedRef.current) return;
        swipedRef.current = true;
        triggerHaptic(HapticType.HEAVY);
        controls.start({
            x: 600 * direction,
            opacity: 0,
            scale: 0.8,
            rotate: 20 * direction,
            transition: { duration: 0.2, ease: 'easeIn' }
        }).then(() => onSwipe(direction));
    };

    const handleDrag = (_, { offset }) => {
        const prev = x.getPrevious() ?? 0;
        // Single distinct tick when crossing the dismissal threshold.
        if (Math.abs(offset.x) >= SWIPE_THRESHOLD && Math.abs(prev) < SWIPE_THRESHOLD) {
            triggerHaptic(HapticType.MEDIUM);
        }
    };

    const handleDragEnd = (_, { offset, velocity }) => {
        if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY) {
            flyOut(1);
        } else if (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY) {
            flyOut(-1);
        } else {
            // High-stiffness spring for a "snap back" feel
            controls.start({
                x: 0, rotate: 0,
                transition: { type: 'spring', stiffness: 800, damping: 35 }
            });
        }
    };

    return (
        <motion.div
            drag="x"
            dragMomentum={false}
            dragElastic={0.9}
            onPointerDown={() => { draggedRef.current = false; }}
            onDragStart={() => { draggedRef.current = true; }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onClickCapture={(e) => { if (draggedRef.current || swipedRef.current) e.stopPropagation(); }}
            animate={controls}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            exit={{ scale: 0.8, opacity: 0, y: -50, transition: { duration: 0.15 } }}
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
            {children}
        </motion.div>
    );
};

const GameScreen = () => {
    const {
        currentCard,
        gameMode,
        nextCard,
        gameState,
        launchGame,
        goHome,
        players,
        updatePlayerDrinkCount,
        updatePlayerStreak,
        settings,
        activeViruses,
        removeVirus
    } = useGame();

    const { t } = useTranslation();
    const [showSettings, setShowSettings] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [streakNotification, setStreakNotification] = useState(null);
    const [ttsEnabled, setTtsEnabled] = useState(false);


    const getCardText = (card) => {
        if (!card) return '';
        if (card.translationKey) {
            return t(`challenges:${card.translationKey}`, { ...card.args, defaultValue: card.text }) || card.text || '';
        }
        return card.text || '';
    };

    const currentText = getCardText(currentCard);

    useEffect(() => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        if (!ttsEnabled || !currentText) return;

        const utterance = new SpeechSynthesisUtterance(currentText);
        utterance.lang = TTS_LOCALES[settings.language] || 'en-US';
        window.speechSynthesis.speak(utterance);
    }, [currentText, ttsEnabled, settings.language]);

    const handleCardResult = (success) => {
        if (!currentCard?.targetPlayerId) return;
        updatePlayerStreak(currentCard.targetPlayerId, success);
        if (!success) return;

        const player = players.find(p => p.id === currentCard.targetPlayerId);
        const newStreak = (player?.streak || 0) + 1;
        if (!player || newStreak < 3) return;

        setStreakNotification(`${player.name} is on fire! 🔥 ${newStreak}`);
        setTimeout(() => setStreakNotification(null), 3000);
        playSuccess();

        if (newStreak >= 5) {
            triggerEmojiBurst(['👑', '💎', '🦄', '✨']);
            triggerConfetti();
        } else {
            triggerEmojiBurst(['🔥', '🌶️', '🥵', '⚡']);
        }
    };

    // Truth/dare and "... or drink" cards are resolved by swiping: right = done, left = penalty.
    const isChoiceCard = () => {
        if (!currentCard) return false;
        if (currentCard.type === 'truth' || currentCard.type === 'dare') return true;
        return CHOICE_PATTERN.test(currentText);
    };

    const getPenaltyAmount = () => {
        if (currentCard.points || currentCard.sips) return currentCard.points || currentCard.sips;
        const text = currentText.toLowerCase();
        const match = text.match(/(?:drink|penalty|points|take|lose) (\d+)/i);
        if (match) return parseInt(match[1], 10);
        if (text.includes('finish your drink')) return 5;
        return 1;
    };

    const handleChoice = (tookPenalty) => {
        if (tookPenalty) {
            playError();
            triggerHaptic(HapticType.HEAVY);
            if (currentCard.targetPlayerId) {
                updatePlayerDrinkCount(currentCard.targetPlayerId, getPenaltyAmount());
            }
        } else {
            playSuccess();
            triggerHaptic(HapticType.SUCCESS);
        }
        nextCard();
    };

    const handleSwipe = (direction) => {
        if (isChoiceCard()) {
            handleChoice(direction < 0);
            return;
        }
        playPop();
        if (direction < 0 && Math.random() > 0.7) triggerEmojiBurst(['💀', '📉', '🥀', '🤏']);
        nextCard();
    };

    const handleCardTap = () => {
        playPop();
        triggerHaptic(HapticType.MEDIUM);
        nextCard();
    };

    if (gameState === 'finished') {
        return (
            <GameOverScreen
                players={players}
                onPlayAgain={() => { playClick(); triggerHaptic(HapticType.MEDIUM); launchGame(gameMode); }}
                onHome={() => { playClick(); goHome(); }}
            />
        );
    }

    if (!currentCard) return null;

    const Minigame = MINIGAMES[currentCard.type];
    if (Minigame) {
        const onNext = () => { playSuccess(); nextCard(); };
        return (
            <Suspense fallback={null}>
                <Minigame key={currentCard.instanceId} card={currentCard} onNext={onNext} />
            </Suspense>
        );
    }

    const choiceCard = isChoiceCard();

    return (
        <div className="full-screen" style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
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
                <Button onClick={() => { playClick(); setShowSettings(true); }} variant="secondary" style={roundButtonStyle}>
                    ☰
                </Button>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Button
                        onClick={() => { playClick(); setTtsEnabled(on => !on); }}
                        variant="secondary"
                        style={{ ...roundButtonStyle, width: '40px', height: '40px', fontSize: '1.1rem', background: ttsEnabled ? 'var(--color-primary)' : roundButtonStyle.background }}
                    >
                        {ttsEnabled ? '🗣️' : '🔇'}
                    </Button>

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

            <AnimatePresence>
                {showRules && (
                    <ActiveRulesSheet
                        rules={activeViruses}
                        getCardText={getCardText}
                        onEnd={(id) => { playClick(); removeVirus(id); }}
                        onClose={() => setShowRules(false)}
                    />
                )}
            </AnimatePresence>

            {showSettings && <SettingsModal onClose={() => { playClick(); setShowSettings(false); }} />}

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
                <AnimatePresence mode="wait">
                    <SwipeCard key={currentCard.instanceId} onSwipe={handleSwipe}>
                        <Card
                            type={currentCard.type}
                            text={currentCard.text}
                            forbidden={currentCard.forbidden}
                            translationKey={currentCard.translationKey}
                            args={currentCard.args}
                            onClick={choiceCard ? undefined : handleCardTap}
                            sips={currentCard.points || currentCard.sips}
                            spiciness={currentCard.spiciness}
                            onResult={handleCardResult}
                        />
                    </SwipeCard>
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
