import React, { useState, useEffect, useRef } from 'react';
import { triggerHaptic, HapticType } from '../../logic/haptics';
import { useShake } from '../../logic/useShake';
import { playTick, playExplosion, playSuccess, playError, playClick } from '../../logic/sound';
import { triggerConfetti } from '../../logic/confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { getRoast } from '../../logic/roasts';
import { useTranslation } from 'react-i18next';


const Card = ({ type, text, spiciness, translationKey, args, duration, onClick, showTapHint = true, sips, onResult }) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (spiciness && spiciness >= 4) {
            triggerConfetti();
            triggerHaptic(HapticType.HEAVY);
        }
    }, [text]);


    const content = translationKey ? t(`challenges:${translationKey}`, { ...args, defaultValue: text }) : text;

    const [timer, setTimer] = useState(duration || 0);
    const [exploded, setExploded] = useState(false);
    const [voteCountdown, setVoteCountdown] = useState(3);
    const [votingStarted, setVotingStarted] = useState(false);
    const voteIntervalRef = useRef(null);


    const [reflexState, setReflexState] = useState('idle');
    const [reflexTime, setReflexTime] = useState(0);
    const reflexStartRef = useRef(0);
    const reflexTimeoutRef = useRef(null);


    const [precisionState, setPrecisionState] = useState('idle');
    const [precisionTime, setPrecisionTime] = useState(0);
    const precisionStartRef = useRef(0);
    const precisionFrameRef = useRef(null);


    const [shakeResult, setShakeResult] = useState(null);
    const [isShaking, setIsShaking] = useState(false);


    const [duelScore, setDuelScore] = useState(50);
    const [duelWinner, setDuelWinner] = useState(null);


    const [mysteryRevealed, setMysteryRevealed] = useState(false);
    const [mysteryHoldProgress, setMysteryHoldProgress] = useState(0);
    const mysteryIntervalRef = useRef(null);


    const [paranoiaStep, setParanoiaStep] = useState('ask');
    const [coinResult, setCoinResult] = useState(null);
    const [raccoonRoast, setRaccoonRoast] = useState('');

    useEffect(() => {
        setRaccoonRoast(Math.random() > 0.6 ? getRoast() : '');
    }, [content]);

    const handleVoteStart = (e) => {
        if (e) e.stopPropagation();
        if (votingStarted) return;

        setVotingStarted(true);
        playClick();

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

        // Initial tick for 3
        playTick();
        triggerHaptic(HapticType.WARNING);
    };


    useShake(15, () => {
        if (type === 'shake' && !shakeResult && !isShaking) {
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
                    if (onResult) onResult(true);
                }
            }, 1000);
        }
    });

    useEffect(() => {

        setReflexState('idle');
        setReflexTime(0);
        setShakeResult(null);
        setIsShaking(false);
        setPrecisionState('idle');
        setPrecisionTime(0);
        setDuelScore(50);
        setDuelWinner(null);
        setMysteryRevealed(false);
        setMysteryHoldProgress(0);
        setExploded(false);
        setTimer(duration || 0);
        setParanoiaStep('ask');
        setCoinResult(null);

        if (type === 'bomb' && duration) {
            setTimer(duration);
            setExploded(false);
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setExploded(true);
                        playExplosion();
                        triggerHaptic(HapticType.HEAVY);
                        return 0;
                    }

                    if (prev <= 5) {
                        playTick();
                        triggerHaptic(HapticType.HEARTBEAT);
                    } else {
                        playTick();
                        triggerHaptic(HapticType.LIGHT);
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }

        if (type === 'vote') {
            setVoteCountdown(3);
            setVotingStarted(false);

        }

        if (type === 'reflex') {
            setReflexState('waiting');
            const delay = Math.random() * 3000 + 2000;
            reflexTimeoutRef.current = setTimeout(() => {
                setReflexState('ready');
                reflexStartRef.current = Date.now();
                playClick();
                triggerHaptic(HapticType.SUCCESS);
            }, delay);
            return () => clearTimeout(reflexTimeoutRef.current);
        }

        return () => {
            if (precisionFrameRef.current) cancelAnimationFrame(precisionFrameRef.current);
            if (mysteryIntervalRef.current) clearInterval(mysteryIntervalRef.current);
        };
    }, [type, content, duration]);

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
            if (time <= 400) {
                playSuccess();
                triggerConfetti();
                if (onResult) onResult(true);
            } else {
                playError();
                if (onResult) onResult(false);
            }
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
            setPrecisionState('stopped');
            cancelAnimationFrame(precisionFrameRef.current);


            const target = 5.00;
            const tol = 0.2;
            const time = (Date.now() - precisionStartRef.current) / 1000;

            if (Math.abs(time - target) <= tol) {
                playSuccess();
                triggerConfetti();
                if (onResult) onResult(true);
            } else {
                playError();
                if (onResult) onResult(false);
            }

            triggerHaptic(HapticType.MEDIUM);
        }
    };

    const handleDuelTap = (player) => {
        if (duelWinner) return;

        // Don't play sound on every tap for duel, it's too much. Maybe every 5?
        // Actually, a very short click is fine.
        // playClick();
        triggerHaptic(HapticType.LIGHT);
        setDuelScore(prev => {
            const change = player === 1 ? -5 : 5;
            const newScore = prev + change;

            if (newScore <= 0) {
                setDuelWinner(1);
                playSuccess();
                triggerHaptic(HapticType.SUCCESS);
                triggerConfetti();
                if (onResult) onResult(true, 1);
                return 0;
            } else if (newScore >= 100) {
                setDuelWinner(2);
                playSuccess();
                triggerHaptic(HapticType.SUCCESS);
                triggerConfetti();
                if (onResult) onResult(true, 2);
                return 100;
            }
            return newScore;
        });
    };

    const startMysteryHold = () => {
        if (mysteryRevealed) return;
        mysteryIntervalRef.current = setInterval(() => {
            setMysteryHoldProgress(prev => {
                if (prev >= 100) {
                    clearInterval(mysteryIntervalRef.current);
                    setMysteryRevealed(true);
                    playSuccess();
                    triggerHaptic(HapticType.SUCCESS);
                    triggerConfetti();
                    if (onResult) onResult(true);
                    return 100;
                }
                triggerHaptic(HapticType.LIGHT);
                return prev + 5;
            });
        }, 50);
    };

    const stopMysteryHold = () => {
        if (mysteryRevealed) return;
        clearInterval(mysteryIntervalRef.current);
        setMysteryHoldProgress(0);
    };

    const getCardClass = () => {
        if (exploded) return 'game-card card-bomb';
        if (type === 'virus') return 'game-card card-virus';
        if (type === 'hot' || type === 'nsfw') return 'game-card card-hot';
        if (type === 'bomb') return 'game-card card-bomb';
        if (type === 'truth') return 'game-card card-truth';
        if (type === 'dare') return 'game-card card-dare';
        if (type === 'boss') return 'game-card card-boss';
        if (type === 'redFlag') return 'game-card card-red-flag';
        // Default glass
        return 'game-card card-glass';
    };

    const getBorderColor = () => {

        if (reflexState === 'ready') return '#00ff00';
        if (explosion) return '#ff0000';
        return '#fff';
    };

    const handleClick = () => {
        if (type === 'reflex') {
            if (reflexState === 'done' || reflexState === 'early') {
                if (onClick) onClick();
            } else {
                handleReflexTap();
            }
        } else if (type === 'precision') {
            if (precisionState === 'stopped') {
                if (onClick) onClick();
            } else {
                handlePrecisionTap();
            }
        } else if (type === 'shake') {

            if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {

                        } else {
                            alert("Permission denied. Tap the card to roll manually.");
                            manualRoll();
                        }
                    })
                    .catch(console.error);
            }

            if (!shakeResult && !isShaking) {
                manualRoll();
            } else if (shakeResult) {
                if (onClick) onClick();
            }
        } else if (type === 'mystery' && mysteryRevealed) {
            if (onClick) onClick();
        } else if (type === 'paranoia') {
            if (paranoiaStep === 'ask') {
                setParanoiaStep('flip');

                triggerHaptic(HapticType.MEDIUM);
                setIsShaking(true);
                setTimeout(() => {
                    setIsShaking(false);
                    const result = Math.random() > 0.5 ? 'heads' : 'tails';
                    setCoinResult(result);
                    setParanoiaStep('result');
                    if (result === 'heads') { playSuccess(); triggerHaptic(HapticType.SUCCESS); }
                    else { playPop(); triggerHaptic(HapticType.LIGHT); }
                }, 1500);
            } else if (paranoiaStep === 'result') {
                if (onClick) onClick();
            }
        } else if (type !== 'duel' && type !== 'mystery' && onClick) {
            onClick();
        }
    };

    const manualRoll = () => {
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
                if (onResult) onResult(true);
            }
        }, 1000);
    };




    const getTextSize = (txt) => {
        if (!txt) return '2.2rem';
        if (txt.length < 30) return '3rem';
        if (txt.length < 50) return '2.5rem';
        if (txt.length < 100) return '2rem';
        return '1.5rem';
    };

    return (
        <div
            className={getCardClass()}
            onClick={handleClick}
            onMouseDown={type === 'mystery' ? startMysteryHold : undefined}
            onMouseUp={type === 'mystery' ? stopMysteryHold : undefined}
            onTouchStart={type === 'mystery' ? startMysteryHold : undefined}
            onTouchEnd={type === 'mystery' ? stopMysteryHold : undefined}
            style={{
                animation: exploded ? 'shake 0.5s infinite' : (isShaking ? 'shake 0.2s infinite' : undefined),
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
                        {['p_left', 'p_right', 'p_opposite', 'p2'].map(key => {
                            if (args?.[key] && args[key] !== "Ghost") {
                                const icons = { p_left: '⬅️', p_right: '➡️', p_opposite: '↕️', p2: '👥' };
                                const labels = { p_left: t('left'), p_right: t('right'), p_opposite: t('opposite'), p2: '' };
                                return (
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
                                            gap: '6px',
                                            backdropFilter: 'blur(5px)'
                                        }}
                                    >
                                        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{icons[key]}</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                            {labels[key] && <span style={{ fontSize: '0.7rem', opacity: 0.5, marginRight: '4px', textTransform: 'uppercase' }}>{labels[key]}</span>}
                                            {args[key]}
                                        </span>
                                    </motion.div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
                {type !== 'duel' && (
                    <div className="card-title" style={{
                        color: 'var(--color-primary)',
                        fontSize: '1.5rem',
                        marginBottom: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        opacity: 0.9,
                        fontWeight: '800',
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                        {type === 'bomb' ? '💣 BOMB' :
                            type === 'wouldYouRather' ? '🤔 WOULD YOU RATHER' :
                                type === 'neverHaveIEver' ? '✋ NEVER HAVE I EVER' :
                                    type === 'reflex' ? '⚡ REFLEX TEST' :
                                        type === 'shake' ? '🎲 SHAKE IT' :
                                            type === 'duel' ? '⚔️ DUEL' :
                                                type === 'mystery' ? '❓ MYSTERY' :
                                                    type === 'redFlag' ? '🚩 RED FLAG' :
                                                        type}
                    </div>
                )}

                {type === 'wouldYouRather' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                        <div style={{ padding: '15px', border: '1px solid #fff', borderRadius: '10px', background: 'rgba(255,255,255,0.1)' }}>
                            {content.split('|')[0]}
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#aaa' }}>OR</div>
                        <div style={{ padding: '15px', border: '1px solid #fff', borderRadius: '10px', background: 'rgba(255,255,255,0.1)' }}>
                            {content.split('|')[1]}
                        </div>
                    </div>
                ) : type === 'reflex' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <p style={{ fontSize: '1.2rem' }}>{content}</p>
                        {reflexState === 'waiting' && <div style={{ fontSize: '2rem', color: '#aaa' }}>Wait for it...</div>}
                        {reflexState === 'ready' && <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#00ff00' }}>TAP!</div>}
                        {reflexState === 'early' && <div style={{ fontSize: '2rem', color: '#ff0000' }}>TOO EARLY!</div>}
                        {reflexState === 'done' && (
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: reflexTime > 400 ? '#ff0000' : '#00ff00' }}>
                                {reflexTime}ms
                            </div>
                        )}
                    </div>
                ) : type === 'shake' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <p style={{ fontSize: '1.2rem' }}>{content}</p>
                        {isShaking && <div style={{ fontSize: '2rem' }}>🎲 Rolling...</div>}
                        {shakeResult && (
                            <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#00ffff' }}>
                                {shakeResult}
                            </div>
                        )}
                        {!isShaking && !shakeResult && (
                            <>
                                <div style={{ fontSize: '3rem' }}>📱👋</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>(or tap to roll)</div>
                            </>
                        )}
                    </div>
                ) : type === 'precision' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <p style={{ fontSize: '1.2rem' }}>{content}</p>
                        <div style={{ fontSize: '4rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#00ff00' }}>
                            {precisionTime.toFixed(2)}s
                        </div>
                        {precisionState === 'idle' && <div style={{ fontSize: '1.5rem', color: '#aaa' }}>Tap to Start</div>}
                        {precisionState === 'running' && <div style={{ fontSize: '1.5rem', color: '#fff' }}>Tap to Stop!</div>}
                        {precisionState === 'stopped' && (
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: Math.abs(precisionTime - 5.00) <= 0.2 ? '#00ff00' : '#ff0000' }}>
                                {Math.abs(precisionTime - 5.00) <= 0.2 ? 'SAFE! 🎉' : 'DRINK! 🍺'}
                            </div>
                        )}
                    </div>
                ) : type === 'duel' ? (
                    <div style={{ width: '100%', height: '300px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '4px', background: '#555', transform: 'translateY(-50%)' }} />
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: `${duelScore}% `,
                            width: '20px',
                            height: '20px',
                            background: '#fff',
                            borderRadius: '50%',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 10px #fff'
                        }} />

                        <div
                            onClick={(e) => { e.stopPropagation(); handleDuelTap(1); }}
                            style={{
                                flex: 1,
                                background: duelWinner === 1 ? '#00ff00' : (duelWinner === 2 ? '#330000' : '#ff0055'),
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '10px 10px 0 0',
                                opacity: duelWinner === 2 ? 0.3 : 1
                            }}
                        >
                            <h2 style={{ fontSize: '2rem' }}>{duelWinner === 1 ? 'WINNER!' : 'TAP!'}</h2>
                        </div>
                        <div
                            onClick={(e) => { e.stopPropagation(); handleDuelTap(2); }}
                            style={{
                                flex: 1,
                                background: duelWinner === 2 ? '#00ff00' : (duelWinner === 1 ? '#330000' : '#0055ff'),
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '0 0 10px 10px',
                                opacity: duelWinner === 1 ? 0.3 : 1
                            }}
                        >
                            <h2 style={{ fontSize: '2rem' }}>{duelWinner === 2 ? 'WINNER!' : 'TAP!'}</h2>
                        </div>
                    </div>
                ) : type === 'mystery' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        {!mysteryRevealed ? (
                            <>
                                <div style={{ fontSize: '5rem', animation: 'pulse 1s infinite' }}>❓</div>
                                <p style={{ fontSize: '1.2rem' }}>Hold to Reveal...</p>
                                <div style={{ width: '100%', height: '10px', background: '#333', borderRadius: '5px', overflow: 'hidden' }}>
                                    <div style={{ width: `${mysteryHoldProgress}% `, height: '100%', background: '#9900ff', transition: 'width 0.1s' }} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: '3rem' }}>✨</div>
                                <p style={{ fontSize: '1.5rem', lineHeight: '1.4' }}>{content}</p>
                            </>
                        )}
                    </div>
                ) : type === 'boss' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', border: '4px solid gold', padding: '20px', borderRadius: '10px', background: 'rgba(0,0,0,0.5)' }}>
                        <div style={{ fontSize: '4rem', animation: 'pulse 0.5s infinite' }}>👹</div>
                        <h2 style={{ color: 'gold', textTransform: 'uppercase', fontSize: '2rem' }}>BOSS BATTLE</h2>
                        <p style={{ fontSize: '1.5rem', lineHeight: '1.4', fontWeight: 'bold', color: '#ff0000' }}>
                            {content.replace('BOSS BATTLE:', '')}
                        </p>
                    </div>
                ) : type === 'vote' ? (
                    null
                ) : type === 'taboo' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
                        <div style={{ fontSize: '1rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '2px' }}>Describe</div>
                        <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '10px', textAlign: 'center' }}>
                            {content.split('|')[0]}
                        </div>

                        <div style={{ width: '60%', height: '2px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />

                        <div style={{ fontSize: '0.9rem', color: '#ff0055', fontWeight: 'bold', letterSpacing: '1px' }}>DON'T SAY</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', marginTop: '5px' }}>
                            {content.split('|')[1] && content.split('|')[1].split(',').map((word, i) => (
                                <div key={i} style={{ fontSize: '1.4rem', opacity: 0.9, fontWeight: '500' }}>{word.trim()}</div>
                            ))}
                        </div>
                    </div>
                ) : type === 'paranoia' ? (
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
                ) : (
                    <div className="card-text" style={{ fontSize: getTextSize(content), lineHeight: 1.3, fontWeight: 700 }}>
                        {content}
                    </div>
                )}

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

                {type === 'bomb' && (
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: exploded ? '#ff0000' : '#fff', marginTop: '20px' }}>
                        {exploded ? 'BOOM!' : timer}
                    </div>
                )}

                {sips > 0 && (
                    <div className="card-badge">
                        <span>⚡</span>
                        <span>{sips} {sips === 1 ? t('penalty') : t('penalties')}</span>
                    </div>
                )}

                {type === 'vote' && (
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
                )}

            </div>

            {/* Shine Effect */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                pointerEvents: 'none'
            }} />

            {showTapHint && !votingStarted && !exploded && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        opacity: 0.5,
                        pointerEvents: 'none'
                    }}
                >
                    {((type === 'reflex' && (reflexState === 'done' || reflexState === 'early')) ||
                        (type === 'precision' && (precisionState === 'stopped')) ||
                        (type === 'shake' && shakeResult) ||
                        (type === 'paranoia' && paranoiaStep === 'result') ||
                        (type === 'mystery' && mysteryRevealed) ||
                        (!['reflex', 'precision', 'shake', 'paranoia', 'mystery', 'duel', 'vote'].includes(type)))
                        ? t('tap_continue') : ''}
                </motion.div>
            )}


        </div>
    );
};

export default Card;
