import { useState } from 'react';
import { useGame } from '../../logic/GameContext';
import { useT } from '../../i18n';
import Button from '../Shared/Button';
import CustomCardInput from '../Shared/CustomCardInput';
import SettingsModal from '../Shared/SettingsModal';
import nameList from '../../logic/names.json';
import { PARTY_MODES, SOCIAL_MODES, SEASONAL_MODES, DEFAULT_MODES } from '../../logic/modes';
import { triggerHaptic, HapticType } from '../../logic/haptics';

const SPICY_EMOJIS = ['👶', '🧊', '🫣', '🍻', '🔥', '🥵', '☠️'];
const SKIPPED_NAMES_KEY = 'trinki_skipped_names';

const ModeGroup = ({ title, description, modes, selectedModes, onToggle }) => {
    const t = useT();
    return (
        <div className="stack">
            <h4 className="group-title">{title}</h4>
            {description && <p className="muted small center">{description}</p>}
            <div className="mode-grid">
                {modes.map(mode => (
                    <button
                        key={mode.id}
                        className={`mode-card ${selectedModes.includes(mode.id) ? 'active' : ''}`}
                        onClick={() => onToggle(mode.id)}
                    >
                        <span className="mode-emoji">{mode.emoji}</span>
                        {t(mode.label, { defaultValue: mode.labelFallback })}
                    </button>
                ))}
            </div>
        </div>
    );
};

const SetupScreen = () => {
    const { players, setPlayers, addPlayer, removePlayer, launchGame, settings, setSpicyLevel, gameMode, openChooser } = useGame();
    const t = useT();
    const [name, setName] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    // Coming back from a game keeps the previous selection.
    const [selectedModes, setSelectedModes] = useState(() => (Array.isArray(gameMode) ? gameMode : DEFAULT_MODES));

    const toggleMode = (id) => {
        triggerHaptic(HapticType.SELECTION);
        setSelectedModes(prev => (prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]));
    };

    const changeSpice = (level) => {
        setSpicyLevel(level);
        triggerHaptic(HapticType.SELECTION);
    };

    // Player order is the seating order (cards refer to left/right neighbours).
    const moveUp = (index) => {
        const next = [...players];
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
        setPlayers(next);
    };

    // Suggests a random name; a suggestion that gets rerolled won't be suggested again.
    const suggestName = () => {
        const skipped = JSON.parse(localStorage.getItem(SKIPPED_NAMES_KEY) || '[]');
        if (nameList.includes(name) && !skipped.includes(name)) {
            skipped.push(name);
            localStorage.setItem(SKIPPED_NAMES_KEY, JSON.stringify(skipped));
        }

        const unused = nameList.filter(n => !players.some(p => p.name === n));
        let available = unused.filter(n => !skipped.includes(n));
        if (available.length === 0) {
            if (!window.confirm(t('random_name_reset'))) return;
            localStorage.removeItem(SKIPPED_NAMES_KEY);
            available = unused;
        }
        if (available.length > 0) setName(available[Math.floor(Math.random() * available.length)]);
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        addPlayer(name.trim());
        setName('');
    };

    const canStart = players.length >= 2 && selectedModes.length > 0;

    return (
        <div className="setup">
            <Button variant="icon" className="settings-button" onClick={() => setShowSettings(true)}>⚙️</Button>

            <div className="setup-inner">
                <h2 className="accent center">🦝 Trinki</h2>

                <section className="stack">
                    <h3 className="section-title">{t('players')}</h3>
                    {players.length === 0 && <p className="muted center">{t('no_players')}</p>}
                    {players.map((p, i) => (
                        <div key={p.id} className="player-chip">
                            <span>{p.name}</span>
                            <span className="row">
                                {i > 0 && <button className="chip-move" aria-label="Move up" onClick={() => moveUp(i)}>▲</button>}
                                <button className="chip-remove" onClick={() => removePlayer(p.id)}>✕</button>
                            </span>
                        </div>
                    ))}
                    <form onSubmit={handleAdd} className="row">
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name..." className="input-field" />
                        <Button variant="secondary" onClick={suggestName}>🎲</Button>
                        <Button type="submit">+</Button>
                    </form>
                </section>

                <section className="stack">
                    <h3 className="section-title">{t('vibe_check')}</h3>
                    <div className="panel stack">
                        <div className="row spread">
                            <strong>{t('spiciness_level')}</strong>
                            <span className="spicy-current">{SPICY_EMOJIS[settings.spicyLevel]}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="6"
                            value={settings.spicyLevel}
                            onChange={(e) => changeSpice(Number(e.target.value))}
                            className="spicy-slider"
                        />
                        <div className="row spread">
                            {SPICY_EMOJIS.map((emoji, i) => (
                                <button
                                    key={emoji}
                                    className={`spicy-step ${settings.spicyLevel >= i ? 'on' : ''} ${settings.spicyLevel === i ? 'current' : ''}`}
                                    onClick={() => changeSpice(i)}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                        <p className="center small"><em>{t(`spicy_${settings.spicyLevel}`)}</em></p>
                    </div>
                </section>

                <section className="stack">
                    <h3 className="section-title">{t('content_pack')}</h3>
                    <ModeGroup title={t('cat_party')} modes={PARTY_MODES} selectedModes={selectedModes} onToggle={toggleMode} />

                    <h4 className="group-title">{t('party_tools')}</h4>
                    <button className="mode-card tool-card" onClick={openChooser}>
                        <span className="mode-emoji">👆</span> Finger Chooser
                    </button>

                    <ModeGroup title={t('cat_social')} description={t('desc_social')} modes={SOCIAL_MODES} selectedModes={selectedModes} onToggle={toggleMode} />
                    <ModeGroup title={t('cat_seasonal')} description={t('desc_seasonal')} modes={SEASONAL_MODES} selectedModes={selectedModes} onToggle={toggleMode} />
                    <CustomCardInput />
                </section>
            </div>

            <div className="bottom-bar">
                <Button className="start-button" disabled={!canStart} onClick={() => launchGame(selectedModes)}>
                    {t('lets_play')} • {selectedModes.length} {selectedModes.length === 1 ? t('mode') : t('modes')}
                </Button>
            </div>

            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </div>
    );
};

export default SetupScreen;
