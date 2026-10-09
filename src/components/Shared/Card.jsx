import { useState, useEffect, useRef } from 'react';
import { useT } from '../../i18n';
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

const NEIGHBOUR_PILLS = [
    ['p_left', '⬅️', 'left'],
    ['p_right', '➡️', 'right'],
    ['p_opposite', '↕️', 'opposite'],
    ['p2', '👥']
];

const textSizeClass = (text) => (text.length < 30 ? 'text-xl' : text.length < 60 ? 'text-lg' : text.length < 100 ? 'text-md' : 'text-sm');

const succeed = () => { playSuccess(); triggerConfetti(); };

const Card = ({ type, text, forbidden, spiciness, translationKey, args, onClick, sips, onResult }) => {
    const t = useT();
    const content = t(translationKey, { ...args, defaultValue: text });

    const [roast] = useState(() => (Math.random() > 0.6 ? getRoast() : ''));
    // Progress of the card's mini-interaction: idle → (waiting | ready | running | rolling | flipping | counting) → done | early
    const [step, setStep] = useState(type === 'reflex' ? 'waiting' : 'idle');
    const [value, setValue] = useState(0); // reflex ms, precision seconds, dice roll or vote countdown
    const [coin, setCoin] = useState(null);
    const startRef = useRef(0);
    const timerRef = useRef(null);
    const frameRef = useRef(null);

    // Card is remounted for every dealt card, so this runs once per card.
    useEffect(() => {
        if (spiciness >= 4) {
            triggerConfetti();
            triggerHaptic(HapticType.HEAVY);
        }
        if (type === 'reflex') {
            timerRef.current = setTimeout(() => {
                setStep('ready');
                startRef.current = Date.now();
                playClick();
                triggerHaptic(HapticType.SUCCESS);
            }, Math.random() * 3000 + 2000);
        }
        return () => {
            clearTimeout(timerRef.current);
            clearInterval(timerRef.current);
            cancelAnimationFrame(frameRef.current);
        };
    }, [spiciness, type]);

    // Ends the vote countdown at zero (here rather than in the state updater, so sounds fire once).
    useEffect(() => {
        if (step !== 'counting' || value > 0) return;
        clearInterval(timerRef.current);
        playSuccess();
        triggerHaptic(HapticType.SUCCESS);
    }, [step, value]);

    const rollDice = () => {
        setStep('rolling');
        triggerHaptic(HapticType.HEAVY);
        timerRef.current = setTimeout(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            setValue(roll);
            setStep('done');
            playSuccess();
            triggerHaptic(HapticType.SUCCESS);
            if (roll === 6) {
                triggerConfetti();
                onResult?.(true);
            }
        }, 1000);
    };

    useShake(15, () => { if (step === 'idle') rollDice(); }, type === 'shake');

    const startVote = (e) => {
        e.stopPropagation();
        setStep('counting');
        setValue(3);
        playTick();
        timerRef.current = setInterval(() => {
            setValue(v => v - 1);
            playTick();
            triggerHaptic(HapticType.WARNING);
        }, 1000);
    };

    const tapReflex = () => {
        if (step === 'waiting') {
            clearTimeout(timerRef.current);
            setStep('early');
            playError();
            triggerHaptic(HapticType.WARNING);
        } else if (step === 'ready') {
            const time = Date.now() - startRef.current;
            setValue(time);
            setStep('done');
            const success = time <= REFLEX_LIMIT_MS;
            if (success) succeed(); else playError();
            onResult?.(success);
        }
    };

    const tapPrecision = () => {
        triggerHaptic(HapticType.MEDIUM);
        if (step === 'idle') {
            setStep('running');
            startRef.current = Date.now();
            playClick();
            const update = () => {
                setValue((Date.now() - startRef.current) / 1000);
                frameRef.current = requestAnimationFrame(update);
            };
            frameRef.current = requestAnimationFrame(update);
            return;
        }
        cancelAnimationFrame(frameRef.current);
        const time = (Date.now() - startRef.current) / 1000;
        setValue(time);
        setStep('done');
        const success = Math.abs(time - PRECISION_TARGET) <= PRECISION_TOLERANCE;
        if (success) succeed(); else playError();
        onResult?.(success);
    };

    const tapShake = () => {
        if (step !== 'idle') return;
        // iOS needs explicit permission for motion events; tapping rolls manually either way.
        window.DeviceMotionEvent?.requestPermission?.().catch(() => { });
        rollDice();
    };

    const flipCoin = () => {
        if (step !== 'idle') return;
        setStep('flipping');
        triggerHaptic(HapticType.MEDIUM);
        timerRef.current = setTimeout(() => {
            const heads = Math.random() > 0.5;
            setCoin(heads ? 'heads' : 'tails');
            setStep('done');
            if (heads) playSuccess(); else playPop();
            triggerHaptic(heads ? HapticType.SUCCESS : HapticType.LIGHT);
        }, 1500);
    };

    const handleClick = () => {
        const interaction = { reflex: tapReflex, precision: tapPrecision, shake: tapShake, paranoia: flipCoin }[type];
        // Interactive cards first play their mini-interaction; once it is over, a tap moves on.
        if (!interaction || step === 'done' || step === 'early') onClick?.();
        else interaction();
    };

    const renderBody = () => {
        switch (type) {
            case 'wouldYouRather': {
                const [a, b] = content.replace(/\?$/, '').split(/\s+OR\s+|\|/);
                return (
                    <div className="stack full-width">
                        <div className="option">{a}</div>
                        {b && <><strong className="muted">OR</strong><div className="option">{b}</div></>}
                    </div>
                );
            }
            case 'reflex':
                return (
                    <div className="stack">
                        <p>{content}</p>
                        {step === 'waiting' && <div className="big muted">Wait for it...</div>}
                        {step === 'ready' && <div className="huge good">TAP!</div>}
                        {step === 'early' && <div className="big bad">TOO EARLY!</div>}
                        {step === 'done' && <div className={`huge ${value > REFLEX_LIMIT_MS ? 'bad' : 'good'}`}>{value}ms</div>}
                    </div>
                );
            case 'shake':
                return (
                    <div className="stack">
                        <p>{content}</p>
                        {step === 'rolling' && <div className="big">🎲 Rolling...</div>}
                        {step === 'done' && <div className="huge cyan">{value}</div>}
                        {step === 'idle' && <><div className="big">📱👋</div><p className="muted small">(or tap to roll)</p></>}
                    </div>
                );
            case 'precision': {
                const success = Math.abs(value - PRECISION_TARGET) <= PRECISION_TOLERANCE;
                return (
                    <div className="stack">
                        <p>{content}</p>
                        <div className="huge mono good">{value.toFixed(2)}s</div>
                        {step === 'idle' && <div className="big muted">Tap to Start</div>}
                        {step === 'running' && <div className="big">Tap to Stop!</div>}
                        {step === 'done' && <div className={`big ${success ? 'good' : 'bad'}`}>{success ? 'SAFE! 🎉' : 'DRINK! 🍺'}</div>}
                    </div>
                );
            }
            case 'taboo':
                return (
                    <div className="stack">
                        <p className="muted small upper">Describe</p>
                        <div className="huge accent">{content}</div>
                        {forbidden?.length > 0 && (
                            <>
                                <strong className="bad small upper">Don&apos;t say</strong>
                                {forbidden.map(word => <div key={word} className="big">{word}</div>)}
                            </>
                        )}
                    </div>
                );
            case 'paranoia':
                if (step === 'idle') {
                    return (
                        <div className="stack">
                            <p className="muted small upper">Whisper to Player on Right</p>
                            <div className="card-text text-md">{content}</div>
                            <strong>They must answer out loud!</strong>
                            <div className="option">🪙<br />Tap card to flip coin</div>
                        </div>
                    );
                }
                if (step === 'flipping') return <div className="stack"><p>Flipping...</p><div className="huge spin">🪙</div></div>;
                return (
                    <div className="stack">
                        <div className="huge">{coin === 'heads' ? '🗣️' : '🤐'}</div>
                        <h2 className={coin === 'heads' ? 'good' : 'yellow'}>{coin === 'heads' ? 'REVEAL!' : 'SECRET SAFE!'}</h2>
                        {coin === 'heads' && <p className="muted">Read the question out loud!</p>}
                    </div>
                );
            case 'vote':
                return (
                    <div className="stack">
                        <div className="card-text text-md">{content}</div>
                        {step === 'idle' ? (
                            <>
                                <p className="muted">{t('read_aloud')}</p>
                                <button className="btn btn-primary pulse" onClick={startVote}>{t('start_countdown')}</button>
                            </>
                        ) : (
                            <>
                                <div className="huge yellow pulse">{value > 0 ? value : t('point_now')}</div>
                                <strong>{value > 0 ? t('think_of_answer') : t('point_at_person')}</strong>
                            </>
                        )}
                    </div>
                );
            default:
                return <div className={`card-text ${textSizeClass(content)}`}>{content}</div>;
        }
    };

    return (
        <div className={`game-card card-${type} ${step === 'ready' ? 'card-go' : ''} ${step === 'rolling' ? 'shake' : ''}`} onClick={handleClick}>
            {args?.p1 && <div className="pill-main">👤 {args.p1}</div>}
            <div className="pills">
                {NEIGHBOUR_PILLS.filter(([key]) => args?.[key]).map(([key, icon, label]) => (
                    <span key={key} className="pill">
                        {icon} {label && <small>{t(label)}</small>} {args[key]}
                    </span>
                ))}
            </div>

            <div className="card-title">{TYPE_LABELS[type] || type}</div>
            {renderBody()}

            {roast && type !== 'virus' && <div className="roast">🦝 <em>&quot;{roast}&quot;</em></div>}
            {sips > 0 && <div className="card-badge">⚡ {sips} {sips === 1 ? t('penalty') : t('penalties')}</div>}
        </div>
    );
};

export default Card;
