import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { triggerHaptic, HapticType } from '../../logic/haptics';
import { useShake } from '../../logic/useShake';
import { playTick, playSuccess, playError, playClick, playPop } from '../../logic/sound';
import { triggerConfetti } from '../../logic/confetti';
import { getRoast } from '../../logic/roasts';

const TYPE_LABELS = {
    wouldYouRather: '🤔 Would you rather',
    neverHaveIEver: '✋ Never have I ever',
    reflex: '⚡ Reflex test',
    precision: '⏱️ Precision',
    shake: '🎲 Shake it'
};

const PRECISION_TARGET = 5.0;
const PRECISION_TOLERANCE = 0.2;
const REFLEX_LIMIT_MS = 400;


const PLAYER_PILLS = {
    p_left: { icon: '⬅️', label: 'left' },
    p_right: { icon: '➡️', label: 'right' },
    p_opposite: { icon: '↕️', label: 'opposite' },
    p2: { icon: '👥' }
};

const getTextSize = (txt) => {
    if (!txt) return '2.2rem';
    if (txt.length < 30) return '3rem';
    if (txt.length < 50) return '2.5rem';
    if (txt.length < 100) return '2rem';
    return '1.5rem';
};

const getCardClass = (type) => {
    if (type === 'virus') return 'game-card card-virus';
    if (type === 'hot' || type === 'nsfw') return 'game-card card-hot';
    return 'game-card';
};

const Card = ({ type, text, forbidden, spiciness, translationKey, args, onClick, sips, onResult }) => {
    const { t } = useTranslation();
    const content = translationKey ? t(`challenges:${translationKey}`, { ...args, defaultValue: text }) : text;

    const [raccoonRoast] = useState(() => (Math.random() > 0.6 ? getRoast() : ''));

    const [votingStarted, setVotingStarted] = useState(false);
    const [voteCountdown, setVoteCountdown] = useState(3);
    const voteIntervalRef = useRef(null);

    const [reflexState, setReflexState] = useState(type === 'reflex' ? 'waiting' : 'idle');
    const [reflexTime, setReflexTime] = useState(0);
    const reflexStartRef = useRef(0);
    const reflexTimeoutRef = useRef(null);

    const [precisionState, setPrecisionState] = useState('idle');
    const [precisionTime, setPrecisionTime] = useState(0);
    const precisionStartRef = useRef(0);
    const precisionFrameRef = useRef(null);

    const [shakeResult, setShakeResult] = useState(null);
    const [isShaking, setIsShaking] = useState(false);

    const [paranoiaStep, setParanoiaStep] = useState('ask');
    const [coinResult, setCoinResult] = useState(null);

    // The parent remounts Card for every new card (keyed by instance), so effects only run once per card.
    useEffect(() => {
        if (spiciness >= 4) {
            triggerConfetti();
            triggerHaptic(HapticType.HEAVY);
        }

        if (type === 'reflex') {
            reflexTimeoutRef.current = setTimeout(() => {
                setReflexState('ready');
                reflexStartRef.current = Date.now();
                playClick();
                triggerHaptic(HapticType.SUCCESS);
            }, Math.random() * 3000 + 2000);
        }

        return () => {
            clearTimeout(reflexTimeoutRef.current);
            clearInterval(voteIntervalRef.current);
            cancelAnimationFrame(precisionFrameRef.current);
        };
    }, [spiciness, type]);

    const handleVoteStart = (e) => {
        e.stopPropagation();
        if (votingStarted) return;

        setVotingStarted(true);
        playTick();
        triggerHaptic(HapticType.WARNING);

        voteIntervalRef.current = setInterval(() => {
            setVoteCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(voteIntervalRef.current);
                    playSuccess();
                    triggerHaptic(HapticType.SUCCESS);
                    return 0;
                }
                playTick();
                triggerHaptic(HapticType.WARNING);
                return prev - 1;
            });
        }, 1000);
    };

    const rollDice = () => {
        setIsShaking(true);
        triggerHaptic(HapticType.HEAVY);
        setTimeout(() => {
            const result = Math.floor(Math.random() * 6) + 1;
            setShakeResult(result);
            setIsShaking(false);
            playSuccess();
            triggerHaptic(HapticType.SUCCESS);
            if (result === 6) {
                triggerConfetti();
                onResult?.(true);
            }
        }, 1000);
    };

    useShake(15, () => {
        if (!shakeResult && !isShaking) rollDice();
    }, type === 'shake');

    const handleReflexTap = () => {
        if (reflexState === 'waiting') {
            clearTimeout(reflexTimeoutRef.current);
            setReflexState('early');
            playError();
            triggerHaptic(HapticType.WARNING);
        } else if (reflexState === 'ready') {
            const time = Date.now() - reflexStartRef.current;
            setReflexTime(time);
            setReflexState('done');
            const success = time <= REFLEX_LIMIT_MS;
            if (success) {
                playSuccess();
                triggerConfetti();
            } else {
                playError();
            }
            onResult?.(success);
            triggerHaptic(HapticType.SUCCESS);
        }
    };

    const handlePrecisionTap = () => {
        if (precisionState === 'idle') {
            setPrecisionState('running');
            precisionStartRef.current = Date.now();
            playClick();
            triggerHaptic(HapticType.LIGHT);

            const update = () => {
                setPrecisionTime((Date.now() - precisionStartRef.current) / 1000);
                precisionFrameRef.current = requestAnimationFrame(update);
            };
            precisionFrameRef.current = requestAnimationFrame(update);
        } else if (precisionState === 'running') {
            cancelAnimationFrame(precisionFrameRef.current);
            const time = (Date.now() - precisionStartRef.current) / 1000;
            setPrecisionTime(time);
            setPrecisionState('stopped');

            const success = Math.abs(time - PRECISION_TARGET) <= PRECISION_TOLERANCE;
            if (success) {
                playSuccess();
                triggerConfetti();
            } else {
                playError();
            }
            onResult?.(success);
            triggerHaptic(HapticType.MEDIUM);
        }
    };

    const handleParanoiaTap = () => {
        setParanoiaStep('flip');
        triggerHaptic(HapticType.MEDIUM);
        setTimeout(() => {
            const result = Math.random() > 0.5 ? 'heads' : 'tails';
            setCoinResult(result);
            setParanoiaStep('result');
            if (result === 'heads') {
                playSuccess();
                triggerHaptic(HapticType.SUCCESS);
            } else {
                playPop();
                triggerHaptic(HapticType.LIGHT);
            }
        }, 1500);
    };

    // Whether the card's mini-interaction is finished and a tap should move on.
    const isResolved = () => {
        switch (type) {
            case 'reflex': return reflexState === 'done' || reflexState === 'early';
            case 'precision': return precisionState === 'stopped';
            case 'shake': return shakeResult !== null;
            case 'paranoia': return paranoiaStep === 'result';
            default: return true;
        }
    };

    const handleClick = () => {
        if (isResolved()) {
            onClick?.();
            return;
        }
        if (type === 'reflex') handleReflexTap();
        else if (type === 'precision' && precisionState !== 'stopped') handlePrecisionTap();
        else if (type === 'shake' && !isShaking) {
            // iOS needs explicit permission for motion events; tapping rolls manually either way.
            if (typeof DeviceMotionEvent?.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission().catch(() => { });
            }
            rollDice();
        }
        else if (type === 'paranoia' && paranoiaStep === 'ask') handleParanoiaTap();
    };

    const renderBody = () => {
        switch (type) {
            case 'wouldYouRather': {
                const [optionA, optionB] = content.replace(/\?$/, '').split(/\s+OR\s+|\|/);
                const optionStyle = { padding: '15px', border: '1px solid #fff', borderRadius: '10px', background: 'rgba(255,255,255,0.1)' };
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                        <div style={optionStyle}>{optionA}</div>
                        {optionB && (
                            <>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#aaa' }}>OR</div>
                                <div style={optionStyle}>{optionB}</div>
                            </>
                        )}
                    </div>
                );
            }

            case 'reflex':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <p style={{ fontSize: '1.2rem' }}>{content}</p>
                        {reflexState === 'waiting' && <div style={{ fontSize: '2rem', color: '#aaa' }}>Wait for it...</div>}
                        {reflexState === 'ready' && <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#00ff00' }}>TAP!</div>}
                        {reflexState === 'early' && <div style={{ fontSize: '2rem', color: '#ff0000' }}>TOO EARLY!</div>}
                        {reflexState === 'done' && (
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: reflexTime > REFLEX_LIMIT_MS ? '#ff0000' : '#00ff00' }}>
                                {reflexTime}ms
                            </div>
                        )}
                    </div>
                );

            case 'shake':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <p style={{ fontSize: '1.2rem' }}>{content}</p>
                        {isShaking && <div style={{ fontSize: '2rem' }}>🎲 Rolling...</div>}
                        {shakeResult && (
                            <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#00ffff' }}>{shakeResult}</div>
                        )}
                        {!isShaking && !shakeResult && (
                            <>
                                <div style={{ fontSize: '3rem' }}>📱👋</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>(or tap to roll)</div>
                            </>
                        )}
                    </div>
                );

            case 'precision': {
                const success = Math.abs(precisionTime - PRECISION_TARGET) <= PRECISION_TOLERANCE;
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <p style={{ fontSize: '1.2rem' }}>{content}</p>
                        <div style={{ fontSize: '4rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#00ff00' }}>
                            {precisionTime.toFixed(2)}s
                        </div>
                        {precisionState === 'idle' && <div style={{ fontSize: '1.5rem', color: '#aaa' }}>Tap to Start</div>}
                        {precisionState === 'running' && <div style={{ fontSize: '1.5rem', color: '#fff' }}>Tap to Stop!</div>}
                        {precisionState === 'stopped' && (
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: success ? '#00ff00' : '#ff0000' }}>
                                {success ? 'SAFE! 🎉' : 'DRINK! 🍺'}
                            </div>
                        )}
                    </div>
                );
            }

            case 'taboo':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
                        <div style={{ fontSize: '1rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '2px' }}>Describe</div>
                        <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '10px', textAlign: 'center' }}>
                            {content}
                        </div>
                        {forbidden?.length > 0 && (
                            <>
                                <div style={{ width: '60%', height: '2px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />
                                <div style={{ fontSize: '0.9rem', color: '#ff0055', fontWeight: 'bold', letterSpacing: '1px' }}>DON'T SAY</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', marginTop: '5px' }}>
                                    {forbidden.map(word => (
                                        <div key={word} style={{ fontSize: '1.4rem', opacity: 0.9, fontWeight: '500' }}>{word}</div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                );

            case 'paranoia':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
                        {paranoiaStep === 'ask' && (
                            <>
                                <div style={{ fontSize: '1rem', opacity: 0.7, textTransform: 'uppercase' }}>Whisper to Player on Right</div>
                                <div className="card-text" style={{ fontSize: '1.5rem' }}>{content}</div>
                                <div style={{ marginTop: '20px', fontSize: '1.2rem', opacity: 0.9, fontWeight: 'bold' }}>
                                    They must answer out loud!
                                </div>
                                <div style={{ marginTop: '30px', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                                    <span style={{ fontSize: '2rem' }}>🪙</span>
                                    <br />
                                    Tap card to flip coin
                                </div>
                            </>
                        )}
                        {paranoiaStep === 'flip' && (
                            <>
                                <div style={{ fontSize: '1.2rem' }}>Flipping...</div>
                                <div style={{ fontSize: '4rem', animation: 'spin 0.5s infinite linear' }}>🪙</div>
                            </>
                        )}
                        {paranoiaStep === 'result' && (
                            <>
                                <div style={{ fontSize: '4rem' }}>{coinResult === 'heads' ? '🗣️' : '🤐'}</div>
                                <h2 style={{ fontSize: '2.5rem', color: coinResult === 'heads' ? '#00ff00' : '#ffff00' }}>
                                    {coinResult === 'heads' ? 'REVEAL!' : 'SECRET SAFE!'}
                                </h2>
                                {coinResult === 'heads' && (
                                    <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Read the question out loud!</p>
                                )}
                            </>
                        )}
                    </div>
                );

            case 'vote':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div className="card-text">{content}</div>
                        {!votingStarted ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
                                <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>{t('read_aloud')}</div>
                                <button
                                    onClick={handleVoteStart}
                                    style={{
                                        background: 'var(--color-primary)',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '20px 40px',
                                        borderRadius: '50px',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                        marginTop: '10px',
                                        width: '80%',
                                        animation: 'pulse 2s infinite'
                                    }}
                                >
                                    {t('start_countdown')}
                                </button>
                            </div>
                        ) : voteCountdown > 0 ? (
                            <div style={{ fontSize: '5rem', fontWeight: 'bold', color: '#ffff00', animation: 'pulse 0.5s infinite' }}>
                                {voteCountdown}
                            </div>
                        ) : (
                            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffff00', animation: 'shake 0.5s' }}>
                                {t('point_now')}
                            </div>
                        )}
                        {votingStarted && (
                            <div style={{ fontSize: '1.5rem', opacity: 0.9, marginTop: '20px', fontWeight: 'bold' }}>
                                {voteCountdown > 0 ? t('think_of_answer') : t('point_at_person')}
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="card-text" style={{ fontSize: getTextSize(content), lineHeight: 1.3, fontWeight: 700 }}>
                        {content}
                    </div>
                );
        }
    };

    return (
        <div
            className={getCardClass(type)}
            onClick={handleClick}
            style={{
                animation: isShaking ? 'shake 0.2s infinite' : undefined,
                border: reflexState === 'ready' ? '4px solid #00ff00' : undefined,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxSizing: 'border-box'
            }}
        >
            <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    gap: '12px',
                    marginBottom: '30px'
                }}>
                    {args?.p1 && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{
                                padding: '10px 24px',
                                background: 'linear-gradient(135deg, var(--color-primary), #00d4ff)',
                                borderRadius: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 8px 20px rgba(0,255,255,0.3)',
                                border: '2px solid rgba(255,255,255,0.3)'
                            }}
                        >
                            <span style={{ fontSize: '1.4rem' }}>👤</span>
                            <span style={{ color: '#000', fontSize: '1.6rem', fontWeight: '900', letterSpacing: '0.5px' }}>{args.p1}</span>
                        </motion.div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                        {Object.entries(PLAYER_PILLS).filter(([key]) => args?.[key]).map(([key, pill]) => (
                            <motion.div
                                key={key}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                style={{
                                    padding: '6px 14px',
                                    background: 'rgba(255,255,255,0.08)',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{pill.icon}</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                    {pill.label && <span style={{ fontSize: '0.7rem', opacity: 0.5, marginRight: '4px', textTransform: 'uppercase' }}>{t(pill.label)}</span>}
                                    {args[key]}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="card-title" style={{
                    fontSize: '1.5rem',
                    marginBottom: '20px',
                    letterSpacing: '3px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}>
                    {TYPE_LABELS[type] || type}
                </div>

                {renderBody()}

                {raccoonRoast && type !== 'virus' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        style={{
                            marginTop: '20px',
                            background: 'rgba(0,0,0,0.4)',
                            padding: '10px 15px',
                            borderRadius: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <div style={{ fontSize: '1.5rem' }}>🦝</div>
                        <div style={{ fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.9 }}>"{raccoonRoast}"</div>
                    </motion.div>
                )}

                {sips > 0 && (
                    <div className="card-badge">
                        <span>⚡</span>
                        <span>{sips} {sips === 1 ? t('penalty') : t('penalties')}</span>
                    </div>
                )}
            </div>

            {/* Shine Effect */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default Card;
