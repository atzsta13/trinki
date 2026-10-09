import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useGame } from '../../logic/GameContext';
import { useT } from '../../i18n';
import Card from '../Shared/Card';
import Button from '../Shared/Button';
import SettingsModal from '../Shared/SettingsModal';
import { triggerHaptic, HapticType } from '../../logic/haptics';
import { playClick, playSuccess, playError, playPop } from '../../logic/sound';
import { triggerConfetti, triggerEmojiBurst } from '../../logic/confetti';
import { CHOICE_PATTERNS } from '../../logic/edition';

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

const SWIPE_THRESHOLD = 100; // px
const SWIPE_VELOCITY = 0.5; // px/ms
const CHOICE_PATTERN = CHOICE_PATTERNS[__EDITION__];

// Drag-to-swipe for one card. Moves the element directly (no React render per pointer move);
// past the threshold the card flies out and `onSwipe(direction)` is called.
const SwipeCard = ({ onSwipe, children }) => {
    const ref = useRef(null);
    const drag = useRef(null);
    const dragged = useRef(false); // the current gesture is a drag, not a tap
    const gone = useRef(false);

    const place = (x, transition = 'none') => {
        const el = ref.current;
        el.style.transition = transition;
        el.style.transform = `translateX(${x}px) rotate(${Math.max(-25, Math.min(25, x / 8))}deg)`;
    };

    const flyOut = (direction) => {
        gone.current = true;
        triggerHaptic(HapticType.HEAVY);
        place(600 * direction, 'transform 0.2s ease-in, opacity 0.2s ease-in');
        ref.current.style.opacity = '0';
        setTimeout(() => onSwipe(direction), 200);
    };

    const onPointerDown = (e) => {
        if (gone.current) return;
        dragged.current = false;
        drag.current = { id: e.pointerId, startX: e.clientX, x: 0, lastX: e.clientX, lastTime: e.timeStamp, velocity: 0, moved: false };
    };

    const onPointerMove = (e) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        const x = e.clientX - d.startX;
        if (!d.moved && Math.abs(x) > 6) {
            d.moved = true;
            dragged.current = true;
            // Capture only once it's a drag, so plain taps still reach the card's onClick.
            ref.current.setPointerCapture(e.pointerId);
        }
        if (Math.abs(x) >= SWIPE_THRESHOLD && Math.abs(d.x) < SWIPE_THRESHOLD) triggerHaptic(HapticType.MEDIUM);
        d.velocity = (e.clientX - d.lastX) / Math.max(e.timeStamp - d.lastTime, 1);
        d.lastX = e.clientX;
        d.lastTime = e.timeStamp;
        d.x = x;
        if (d.moved) place(x);
    };

    const onPointerUp = () => {
        const d = drag.current;
        drag.current = null;
        if (!d?.moved) return;
        if (d.x > SWIPE_THRESHOLD || d.velocity > SWIPE_VELOCITY) flyOut(1);
        else if (d.x < -SWIPE_THRESHOLD || d.velocity < -SWIPE_VELOCITY) flyOut(-1);
        else place(0, 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1.2)');
    };

    return (
        <div
            ref={ref}
            className="swipe-card"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            // A drag ends with a click; it must not also count as a tap on the card.
            onClickCapture={(e) => { if (gone.current || dragged.current) e.stopPropagation(); }}
        >
            {children}
        </div>
    );
};

const GameOverScreen = ({ players, onPlayAgain, onHome }) => {
    const t = useT();
    const [mvp, ...rest] = [...players].sort((a, b) => (b.drinkCount || 0) - (a.drinkCount || 0));

    return (
        <div className="screen">
            <div className="pop-in">
                <h2 className="glow">{t('game_over')}</h2>
                <p className="muted">{t('hope_epic')}</p>
            </div>
            {mvp && (
                <div className="panel mvp pop-in">
                    <div className="mvp-crown">👑</div>
                    <h3 className="gold">{t('party_mvp')}</h3>
                    <div className="huge">{mvp.name}</div>
                    <div className="muted">{mvp.drinkCount || 0} {t('points')}</div>
                </div>
            )}
            <div className="stack scoreboard">
                {rest.map((p, i) => (
                    <div key={p.id} className="player-chip">
                        <strong>#{i + 2} {p.name}</strong>
                        <span>{p.drinkCount || 0} {t('points')}</span>
                    </div>
                ))}
            </div>
            <div className="row full-width">
                <Button className="grow" onClick={onPlayAgain}>{t('play_again')} 🔄</Button>
                <Button variant="secondary" onClick={onHome}>🏠</Button>
            </div>
        </div>
    );
};

const ActiveRulesSheet = ({ rules, getCardText, onEnd, onClose }) => {
    const t = useT();
    return (
        <div className="sheet-backdrop" onClick={onClose}>
            <div className="sheet stack" onClick={(e) => e.stopPropagation()}>
                <div className="row spread">
                    <h2 className="accent">{t('active_rules')}</h2>
                    <Button variant="icon" onClick={onClose}>✕</Button>
                </div>
                {rules.length === 0 && <p className="muted center">🧘 {t('no_active_rules')}</p>}
                {rules.map(rule => (
                    <div key={rule.instanceId} className="rule">
                        <p>{getCardText(rule)}</p>
                        <Button variant="secondary" className="btn-small danger-text" onClick={() => onEnd(rule.instanceId)}>{t('end_rule')}</Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GameScreen = () => {
    const {
        currentCard, gameMode, nextCard, gameState, launchGame, goHome, players,
        updatePlayerDrinkCount, updatePlayerStreak, settings, activeViruses, removeVirus
    } = useGame();
    const t = useT();
    const [showSettings, setShowSettings] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [streakMessage, setStreakMessage] = useState(null);
    const [ttsEnabled, setTtsEnabled] = useState(false);

    const getCardText = (card) => (card ? t(card.translationKey, { ...card.args, defaultValue: card.text }) : '');

    // Derived null-safely: while leaving the game the screen still renders once with no card,
    // and the React Compiler reads values used by handlers during render.
    const currentText = getCardText(currentCard);
    const targetPlayerId = currentCard?.targetPlayerId;
    const cardPoints = currentCard?.points || currentCard?.sips;
    // Truth/dare and "... or drink" cards are resolved by swiping: right = done, left = penalty.
    const isChoiceCard = currentCard?.type === 'truth' || currentCard?.type === 'dare' || CHOICE_PATTERN.test(currentText);

    useEffect(() => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        if (!ttsEnabled || !currentText) return;
        const utterance = new SpeechSynthesisUtterance(currentText);
        utterance.lang = TTS_LOCALES[settings.language] || 'en-US';
        window.speechSynthesis.speak(utterance);
    }, [currentText, ttsEnabled, settings.language]);

    const handleCardResult = (success) => {
        if (!targetPlayerId) return;
        updatePlayerStreak(targetPlayerId, success);
        const player = players.find(p => p.id === targetPlayerId);
        const streak = (player?.streak || 0) + 1;
        if (!success || !player || streak < 3) return;

        setStreakMessage(t('streak', { name: player.name, count: streak }));
        setTimeout(() => setStreakMessage(null), 3000);
        playSuccess();
        if (streak >= 5) {
            triggerEmojiBurst(['👑', '💎', '🦄', '✨']);
            triggerConfetti();
        } else {
            triggerEmojiBurst(['🔥', '🌶️', '🥵', '⚡']);
        }
    };

    const penaltyAmount = () => {
        if (cardPoints) return cardPoints;
        const text = currentText.toLowerCase();
        const match = text.match(/(?:drink|penalty|points|take|lose) (\d+)/);
        if (match) return parseInt(match[1], 10);
        return __EDITION__ !== 'teen' && text.includes('finish your drink') ? 5 : 1;
    };

    const handleSwipe = (direction) => {
        if (!isChoiceCard) {
            playPop();
            if (direction < 0 && Math.random() > 0.7) triggerEmojiBurst(['💀', '📉', '🥀', '🤏']);
        } else if (direction < 0) {
            playError();
            triggerHaptic(HapticType.HEAVY);
            if (targetPlayerId) updatePlayerDrinkCount(targetPlayerId, penaltyAmount());
        } else {
            playSuccess();
            triggerHaptic(HapticType.SUCCESS);
        }
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
                onPlayAgain={() => { playClick(); launchGame(gameMode); }}
                onHome={() => { playClick(); goHome(); }}
            />
        );
    }

    if (!currentCard) return null;

    const Minigame = MINIGAMES[currentCard.type];
    if (Minigame) {
        return (
            // data-card lets the e2e tests see exactly when the next card is dealt.
            <div className="full" data-card={currentCard.instanceId}>
                <Suspense fallback={null}>
                    <Minigame key={currentCard.instanceId} card={currentCard} onNext={() => { playSuccess(); nextCard(); }} />
                </Suspense>
            </div>
        );
    }

    return (
        <div className="game" data-card={currentCard.instanceId}>
            {streakMessage && <div className="toast">{streakMessage}</div>}

            <div className="game-bar">
                <Button variant="icon" onClick={() => { playClick(); setShowSettings(true); }}>☰</Button>
                <Button variant="icon" className={ttsEnabled ? 'on' : ''} onClick={() => { playClick(); setTtsEnabled(on => !on); }}>
                    {ttsEnabled ? '🗣️' : '🔇'}
                </Button>
                {activeViruses.length > 0 && (
                    <button className="virus-badge" onClick={() => { playClick(); setShowRules(true); }}>📜 {activeViruses.length}</button>
                )}
            </div>

            <div className="card-area">
                <SwipeCard key={currentCard.instanceId} onSwipe={handleSwipe}>
                    <Card
                        type={currentCard.type}
                        text={currentCard.text}
                        forbidden={currentCard.forbidden}
                        translationKey={currentCard.translationKey}
                        args={currentCard.args}
                        onClick={isChoiceCard ? undefined : handleCardTap}
                        isChoice={isChoiceCard}
                        sips={cardPoints}
                        spiciness={currentCard.spiciness}
                        onResult={handleCardResult}
                    />
                </SwipeCard>
            </div>

            {showRules && (
                <ActiveRulesSheet
                    rules={activeViruses}
                    getCardText={getCardText}
                    onEnd={(id) => { playClick(); removeVirus(id); }}
                    onClose={() => setShowRules(false)}
                />
            )}
            {showSettings && <SettingsModal onClose={() => { playClick(); setShowSettings(false); }} />}
        </div>
    );
};

export default GameScreen;
