import React, { useState } from 'react';
import { useGame } from '../../logic/GameContext';
import { Reorder } from 'framer-motion';
import Button from '../Shared/Button';
import CustomCardInput from '../Shared/CustomCardInput';
import SettingsModal from '../Shared/SettingsModal';
import nameList from '../../logic/names.json';
import { useTranslation } from 'react-i18next';
import { PARTY_MODES, SOCIAL_MODES, SEASONAL_MODES, MODES, TOOLS } from '../../logic/modes';
import { triggerHaptic, HapticType } from '../../logic/haptics';

const SetupSection = ({ title, children }) => (
    <div className="setup-card">
        <h3 className="setup-title">
            {title}
        </h3>
        {children}
    </div>
);

const SetupScreen = () => {
    const { players, setPlayers, addPlayer, removePlayer, startGame, launchGame, settings, setSpicyLevel, setDrinkType, setGroupType, gameMode, openTool } = useGame();
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    const [selectedModes, setSelectedModes] = useState(() => {
        if (!gameMode || gameMode === 'classic') {
            return [
                'classic', 'mostLikely', 'neverHaveIEver', 'wouldYouRather', 'taboo', 'paranoia',
                'tenOuttaTen', 'hypotheticals', 'truthOrDare', 'marryKissKill',
                'mindMatch', 'wrongAnswers', 'betBuddy', 'fakeOrFact',
                'bomb', 'charades', 'fakeArtist', 'spy'
            ];
        }
        return ['classic', gameMode];
    });

    const getRandomName = (e) => {
        e.preventDefault();
        const skipped = JSON.parse(localStorage.getItem('trinki_skipped_names') || '[]');

        if (name && nameList.includes(name) && !skipped.includes(name)) {
            skipped.push(name);
            localStorage.setItem('trinki_skipped_names', JSON.stringify(skipped));
        }

        const available = nameList.filter(n => !skipped.includes(n) && !players.some(p => p.name === n));

        if (available.length === 0) {
            if (window.confirm("No more random names! Reset the list?")) {
                localStorage.removeItem('trinki_skipped_names');
                const allAvailable = nameList.filter(n => !players.some(p => p.name === n));
                if (allAvailable.length > 0) {
                    const random = allAvailable[Math.floor(Math.random() * allAvailable.length)];
                    setName(random);
                }
            }
            return;
        }

        const random = available[Math.floor(Math.random() * available.length)];
        setName(random);
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (name.trim()) {
            addPlayer(name.trim());
            setName('');
        }
    };

    return (
        <div className="flex-col-start full-screen party-setup-container" style={{ alignItems: 'center', position: 'relative' }}>
            <button
                onClick={() => setShowSettings(true)}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    zIndex: 10
                }}
            >
                ⚙️
            </button>

            <div className="container-responsive">
                <h2 style={{ marginBottom: '20px', color: 'var(--color-primary)', alignSelf: 'center', textAlign: 'center' }}>
                    🦝 Trinki
                </h2>

                <SetupSection title={t('players')}>
                    {players.length === 0 ? (
                        <div style={{ marginBottom: '15px', opacity: 0.5, fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>{t('no_players')}</div>
                    ) : (
                        <Reorder.Group axis="y" values={players} onReorder={setPlayers} style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                            {players.map(p => (
                                <Reorder.Item key={p.id} value={p} style={{ marginBottom: '8px', cursor: 'grab' }} whileDrag={{ scale: 1.05, cursor: 'grabbing', zIndex: 10 }}>
                                    <div className="player-chip">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <span style={{ opacity: 0.4, fontSize: '1.5rem', lineHeight: '1rem' }}>≡</span>
                                            <span style={{ fontWeight: '600' }}>{p.name}</span>
                                        </div>
                                        <span
                                            onClick={(e) => { e.stopPropagation(); removePlayer(p.id); }}
                                            style={{
                                                color: '#ff0055',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                padding: '5px 10px',
                                                fontSize: '1.2rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            ✕
                                        </span>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    )}

                    <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px', width: '100%' }}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name..."
                            className="input-field"
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '10px',
                                fontSize: '1rem',
                                minWidth: 0
                            }}
                        />
                        <Button onClick={handleAdd} variant="secondary" style={{ padding: '12px', minWidth: '50px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)', flexShrink: 0 }}>🎲</Button>
                        <Button type="submit" variant="primary" style={{ padding: '12px', minWidth: '50px', flexShrink: 0 }}>+</Button>
                    </form>


                </SetupSection>

                <SetupSection title={t('vibe_check')}>
                    <div className="glass-panel" style={{ padding: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                            <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{t('spiciness_level')}</span>
                            <span style={{ fontSize: '1.8rem' }}>
                                {['👶', '🧊', '🫣', '🍻', '🔥', '🥵', '☠️'][settings.spicyLevel]}
                            </span>
                        </div>

                        <div style={{ position: 'relative', padding: '0 5px' }}>
                            <input
                                type="range"
                                min="0"
                                max="6"
                                step="1"
                                value={settings.spicyLevel}
                                onChange={(e) => {
                                    setSpicyLevel(parseInt(e.target.value));
                                    triggerHaptic(HapticType.SELECTION);
                                }}
                                style={{
                                    width: '100%',
                                    height: '8px',
                                    background: 'linear-gradient(to right, #00ffff, #ff0055)',
                                    borderRadius: '4px',
                                    appearance: 'none',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', marginTop: '15px' }}>
                                {['👶', '🧊', '🫣', '🍻', '🔥', '🥵', '☠️'].map((emoji, i) => (
                                    <span
                                        key={i}
                                        onClick={() => {
                                            setSpicyLevel(i);
                                            triggerHaptic(HapticType.SELECTION);
                                        }}
                                        style={{
                                            fontSize: '1.2rem',
                                            cursor: 'pointer',
                                            opacity: settings.spicyLevel >= i ? 1 : 0.3,
                                            transform: settings.spicyLevel === i ? 'scale(1.4)' : 'scale(1)',
                                            transition: 'all 0.2s',
                                            filter: settings.spicyLevel === i ? 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' : 'none',
                                            width: '32px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {emoji}
                                    </span>
                                ))}
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem', color: '#fff', opacity: 0.9, fontStyle: 'italic' }}>
                                {t(`spicy_${settings.spicyLevel}`)}
                            </div>
                        </div>
                    </div>
                </SetupSection>

                <SetupSection title={t('content_pack')}>

                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{
                            margin: '0 0 10px 0',
                            opacity: 0.6,
                            fontSize: '0.8rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            textAlign: 'center'
                        }}>
                            {t('cat_party')}
                        </h4>
                        <div className="mode-card-grid" style={{ padding: '0 10px' }}>
                            {PARTY_MODES.map(mode => {
                                const isActive = selectedModes.includes(mode.id);
                                return (
                                    <div
                                        key={mode.id}
                                        onClick={() => {
                                            triggerHaptic(HapticType.SELECTION);
                                            if (isActive) {
                                                setSelectedModes(selectedModes.filter(m => m !== mode.id));
                                            } else {
                                                setSelectedModes([...selectedModes, mode.id]);
                                            }
                                        }}
                                        className={`mode-card ${isActive ? 'active' : ''}`}
                                        style={{ width: '100%', height: 'auto', aspectRatio: '1/1' }}
                                    >
                                        <span style={{ fontSize: '2rem', marginBottom: '8px' }}>{mode.emoji}</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', lineHeight: '1.2' }}>
                                            {t(mode.label) !== mode.label ? t(mode.label) : (mode.labelFallback || mode.label.split(' ').slice(1).join(' ') || mode.label)}
                                        </span>
                                        {/* Checkmark for active */}
                                        {isActive && <div style={{
                                            position: 'absolute', top: '8px', right: '8px',
                                            width: '20px', height: '20px', background: '#fff',
                                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <span style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                                        </div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tools Section */}
                    {TOOLS && TOOLS.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{
                                margin: '0 0 10px 0',
                                opacity: 0.6,
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                textAlign: 'center'
                            }}>
                                Party Tools
                            </h4>
                            <div className="mode-card-grid" style={{ padding: '0 10px' }}>
                                {TOOLS.map(tool => (
                                    <div
                                        key={tool.id}
                                        onClick={() => openTool(tool.id)}
                                        className="mode-card"
                                        style={{ width: '100%', height: 'auto', aspectRatio: '2/1', flexDirection: 'row', gap: '15px' }}
                                    >
                                        <span style={{ fontSize: '2rem' }}>{tool.emoji}</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                                            {tool.title || tool.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {[
                        { title: t('cat_social'), items: SOCIAL_MODES },
                        { title: t('cat_seasonal'), items: SEASONAL_MODES }
                    ].map((group) => (
                        <div key={group.title} style={{ marginBottom: '20px' }}>
                            <h4 style={{
                                margin: '0 0 10px 0',
                                opacity: 0.6,
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                textAlign: 'center'
                            }}>

                                {group.title}
                            </h4>
                            <p style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.5, margin: '-5px 0 10px 0' }}>
                                {group.title === t('cat_party') ? 'Select card interaction types (mechanics).' :
                                    group.title === t('cat_social') ? 'Adds themed content (filtered by spiciness).' :
                                        'Adds holiday-themed cards.'}
                            </p>
                            <div className="mode-card-grid" style={{ padding: '0 10px' }}>
                                {group.items.map(mode => {
                                    const isActive = selectedModes.includes(mode.id);
                                    return (
                                        <div
                                            key={mode.id}
                                            onClick={() => {
                                                triggerHaptic(HapticType.LIGHT);
                                                if (isActive) {
                                                    setSelectedModes(selectedModes.filter(m => m !== mode.id));
                                                } else {
                                                    setSelectedModes([...selectedModes, mode.id]);
                                                }
                                            }}
                                            className={`mode-card ${isActive ? 'active' : ''}`}
                                            style={{ width: '100%', height: 'auto', aspectRatio: '1/1' }}
                                        >
                                            <span style={{ fontSize: '2rem', marginBottom: '8px' }}>{mode.emoji}</span>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', lineHeight: '1.2' }}>
                                                {t(mode.label) !== mode.label ? t(mode.label) : (mode.labelFallback || mode.label)}
                                            </span>
                                            {isActive && <div style={{
                                                position: 'absolute', top: '8px', right: '8px',
                                                width: '20px', height: '20px', background: '#fff',
                                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <span style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                                            </div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div style={{ marginTop: '15px' }}>
                        <CustomCardInput />
                    </div>
                </SetupSection>
            </div>

            <div className="bottom-gradient-bar">
                <Button
                    onClick={() => launchGame(selectedModes)}
                    fullWidth
                    className="btn-liquid"
                    style={{
                        maxWidth: '400px',
                        opacity: players.length < 2 || selectedModes.length === 0 ? 0.5 : 1,
                        pointerEvents: players.length < 2 || selectedModes.length === 0 ? 'none' : 'auto',
                        boxShadow: '0 0 20px rgba(255, 0, 85, 0.5)',
                        fontSize: '1rem',
                        height: '65px'
                    }}
                >
                    {t('lets_play')} • {selectedModes && selectedModes.length} {selectedModes.length === 1 ? t('mode') : t('modes')}
                </Button>
            </div>

            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </div>
    );
};

export default SetupScreen;
