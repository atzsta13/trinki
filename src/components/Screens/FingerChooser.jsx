import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../logic/GameContext';
import Button from '../Shared/Button';
import { motion } from 'framer-motion';
import { playBeep, playSuccess } from '../../logic/sound';
import { triggerHaptic, HapticType } from '../../logic/haptics';
import { triggerConfetti } from '../../logic/confetti';

const COLORS = [
    '#FF0099', // Neon Pink
    '#00FFFF', // Cyan
    '#CCFF00', // Lime
    '#FFD60A', // Yellow
    '#FF5400', // Orange
    '#AF52DE', // Purple
    '#5AC8FA', // Sky Blue
    '#FF3B30', // Red
];

const FingerChooser = () => {
    const { goHome } = useGame();
    const [touches, setTouches] = useState({}); // { [id]: { x, y, color } }
    const [winnerId, setWinnerId] = useState(null);
    const [status, setStatus] = useState('waiting'); // waiting, countdown, chosen
    const timerRef = useRef(null);
    const intervalRef = useRef(null);
    // The countdown callback needs the fingers at the moment it fires, not when it started.
    const touchesRef = useRef(touches);
    touchesRef.current = touches;

    const stopCountdown = () => {
        clearTimeout(timerRef.current);
        clearInterval(intervalRef.current);
    };

    useEffect(() => stopCountdown, []);

    const reset = () => {
        setTouches({});
        setWinnerId(null);
        setStatus('waiting');
        stopCountdown();
    };

    const handlePointerDown = (e) => {
        if (winnerId) {
            reset();
            return;
        }

        e.preventDefault();
        // Crisp tick on touch
        triggerHaptic(HapticType.SELECTION);

        const { pointerId, clientX, clientY } = e;

        setTouches(prev => {
            // Assign a color based on the number of current touches
            const count = Object.keys(prev).length;
            const color = COLORS[count % COLORS.length];
            return {
                ...prev,
                [pointerId]: { x: clientX, y: clientY, color }
            };
        });
    };

    const handlePointerMove = (e) => {
        e.preventDefault();
        if (winnerId) return;

        const { pointerId, clientX, clientY } = e;
        setTouches(prev => {
            if (!prev[pointerId]) return prev;
            return {
                ...prev,
                [pointerId]: { ...prev[pointerId], x: clientX, y: clientY }
            };
        });
    };

    const handlePointerUp = (e) => {
        e.preventDefault();
        if (winnerId) return; // Keep winner visible even if finger lifts

        const { pointerId } = e;

        setTouches(prev => {
            const next = { ...prev };
            delete next[pointerId];
            return next;
        });
    };

    // Two or more fingers start a 3s countdown; lifting below two cancels it.
    useEffect(() => {
        const touchCount = Object.keys(touches).length;
        if (status === 'chosen') return;

        if (touchCount >= 2 && status === 'waiting') {
            setStatus('countdown');
            playBeep();
            triggerHaptic(HapticType.HEARTBEAT);

            intervalRef.current = setInterval(() => {
                playBeep();
                triggerHaptic(HapticType.HEARTBEAT);
            }, 600);

            timerRef.current = setTimeout(() => {
                clearInterval(intervalRef.current);
                pickWinner();
            }, 3000);
        } else if (touchCount < 2 && status === 'countdown') {
            setStatus('waiting');
            stopCountdown();
        }
    }, [touches, status]);

    const pickWinner = () => {
        const ids = Object.keys(touchesRef.current);
        if (ids.length === 0) return;
        const randomId = ids[Math.floor(Math.random() * ids.length)];
        setWinnerId(randomId);
        setStatus('chosen');
        playSuccess();
        triggerHaptic(HapticType.SUCCESS); // Premium success pattern
        triggerConfetti();
    };

    return (
        <div
            className="finger-chooser-container"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'transparent', // Use global theme background
                touchAction: 'none', // Critical for preventing scroll/zoom
                userSelect: 'none',
                zIndex: 2000,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {/* Back Button (only visible if no touches) */}
            {Object.keys(touches).length === 0 && (
                <div style={{ position: 'absolute', top: 'env(safe-area-inset-top)', left: 20, zIndex: 2001, paddingTop: 20 }}>
                    <Button onClick={goHome} variant="secondary" style={{ padding: '10px 20px', minHeight: 'auto' }}>
                        ← Back
                    </Button>
                </div>
            )}

            {/* Instructions */}
            {Object.keys(touches).length < 2 && !winnerId && (
                <div style={{ pointerEvents: 'none', opacity: 0.6, textAlign: 'center' }}>
                    <h2>Finger Chooser</h2>
                    <p>Place 2+ fingers on screen to choose a starter</p>
                </div>
            )}

            {/* Status logic specifically for visual feedback */}
            {status === 'countdown' && (
                <div style={{ pointerEvents: 'none', color: '#fff', fontSize: '2rem', fontWeight: 'bold', position: 'absolute' }}>
                    Hold...
                </div>
            )}

            {/* Render Circles */}
            {Object.entries(touches).map(([id, touch]) => {
                const isWinner = winnerId && String(id) === String(winnerId);
                const isLoser = winnerId && !isWinner;

                if (isLoser) return null; // Hide losers

                return (
                    <motion.div
                        key={id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: isWinner ? 50 : (status === 'countdown' ? [1.5, 1.8, 1.5] : 1.5),
                            opacity: 1,
                            x: touch.x - 50,
                            y: touch.y - 50
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                            scale: {
                                duration: 0.5,
                                repeat: status === 'countdown' ? Infinity : 0
                            }
                        }}
                        style={{
                            position: 'absolute',
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            background: touch.color,
                            boxShadow: `0 0 30px ${touch.color}`,
                            left: 0,
                            top: 0,
                            pointerEvents: 'none'
                        }}
                    >
                        {isWinner && (
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '2px' // Scaled up by parent 50x -> 100px
                            }}>
                                WINNER
                            </div>
                        )}
                    </motion.div>
                );
            })}

            {/* Winner Text Overlay */}
            {winnerId && (
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    width: '100%',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    animation: 'fadeInScale 0.5s ease'
                }}>
                    <h1 style={{ fontSize: '4rem', color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>CHOSEN!</h1>
                    <p style={{ marginTop: 20 }}>Tap anywhere to reset</p>
                </div>
            )}

        </div>
    );
};

export default FingerChooser;
