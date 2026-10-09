import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../logic/GameContext';
import Button from '../Shared/Button';
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

const COUNTDOWN_MS = 3000;
const BEEP_INTERVAL_MS = 600;
const CIRCLE_SIZE = 100;

const FingerChooser = () => {
    const { goHome } = useGame();
    const [touches, setTouches] = useState({}); // { [pointerId]: { x, y, color } }
    const [winnerId, setWinnerId] = useState(null);
    const [status, setStatus] = useState('waiting'); // waiting, countdown, chosen

    // Mirrors `touches` for the countdown timer, which must see the fingers at the moment it fires.
    const touchesRef = useRef({});
    const timerRef = useRef(null);
    const intervalRef = useRef(null);

    const stopCountdown = () => {
        clearTimeout(timerRef.current);
        clearInterval(intervalRef.current);
    };

    useEffect(() => stopCountdown, []);

    const updateTouches = (next) => {
        touchesRef.current = next;
        setTouches(next);
    };

    const pickWinner = () => {
        const ids = Object.keys(touchesRef.current);
        if (ids.length === 0) {
            setStatus('waiting');
            return;
        }
        setWinnerId(ids[Math.floor(Math.random() * ids.length)]);
        setStatus('chosen');
        playSuccess();
        triggerHaptic(HapticType.SUCCESS);
        triggerConfetti();
    };

    // Two or more fingers start a countdown; dropping below two cancels it.
    const syncCountdown = (touchCount) => {
        if (touchCount >= 2 && status === 'waiting') {
            setStatus('countdown');
            playBeep();
            triggerHaptic(HapticType.HEARTBEAT);
            intervalRef.current = setInterval(() => {
                playBeep();
                triggerHaptic(HapticType.HEARTBEAT);
            }, BEEP_INTERVAL_MS);
            timerRef.current = setTimeout(() => {
                clearInterval(intervalRef.current);
                pickWinner();
            }, COUNTDOWN_MS);
        } else if (touchCount < 2 && status === 'countdown') {
            setStatus('waiting');
            stopCountdown();
        }
    };

    const reset = () => {
        stopCountdown();
        updateTouches({});
        setWinnerId(null);
        setStatus('waiting');
    };

    const handlePointerDown = (e) => {
        if (winnerId) {
            reset();
            return;
        }
        e.preventDefault();
        triggerHaptic(HapticType.SELECTION);

        const prev = touchesRef.current;
        const color = COLORS[Object.keys(prev).length % COLORS.length];
        const next = { ...prev, [e.pointerId]: { x: e.clientX, y: e.clientY, color } };
        updateTouches(next);
        syncCountdown(Object.keys(next).length);
    };

    const handlePointerMove = (e) => {
        e.preventDefault();
        const prev = touchesRef.current;
        if (winnerId || !prev[e.pointerId]) return;
        updateTouches({ ...prev, [e.pointerId]: { ...prev[e.pointerId], x: e.clientX, y: e.clientY } });
    };

    const handlePointerUp = (e) => {
        e.preventDefault();
        if (winnerId) return; // Keep the winner visible even if fingers lift

        const next = { ...touchesRef.current };
        delete next[e.pointerId];
        updateTouches(next);
        syncCountdown(Object.keys(next).length);
    };

    const touchCount = Object.keys(touches).length;

    return (
        <div
            className="chooser"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            {touchCount === 0 && <Button variant="secondary" className="chooser-back" onClick={goHome}>← Back</Button>}

            {touchCount < 2 && !winnerId && (
                <div className="center muted passive">
                    <h2>Finger Chooser</h2>
                    <p>Place 2+ fingers on screen to choose a starter</p>
                </div>
            )}

            {status === 'countdown' && <div className="big passive">Hold...</div>}

            {Object.entries(touches).map(([id, touch]) => {
                const isWinner = id === winnerId;
                if (winnerId && !isWinner) return null; // Hide losers
                return (
                    // Outer element follows the finger, inner one animates (pulse while counting, grow for the winner).
                    <div key={id} className="finger-anchor" style={{ transform: `translate3d(${touch.x - CIRCLE_SIZE / 2}px, ${touch.y - CIRCLE_SIZE / 2}px, 0)` }}>
                        <div
                            className={`finger ${status === 'countdown' ? 'counting' : ''} ${isWinner ? 'winner' : ''}`}
                            style={{ background: touch.color, boxShadow: `0 0 30px ${touch.color}` }}
                        />
                    </div>
                );
            })}

            {winnerId && (
                <div className="chooser-result passive pop-in">
                    <h1>CHOSEN!</h1>
                    <p>Tap anywhere to reset</p>
                </div>
            )}
        </div>
    );
};

export default FingerChooser;
