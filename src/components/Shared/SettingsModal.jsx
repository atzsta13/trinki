import React, { useState } from 'react';
import Button from './Button';
import { useGame } from '../../logic/GameContext';

import { useTranslation } from 'react-i18next';


const SettingsModal = ({ onClose }) => {
    const { settings, toggleSound, toggleHaptics, setLanguage, setTheme, resetHistory, gameState, goHome } = useGame();
    const { t } = useTranslation();

    return (
        <div className="settings-modal">
            <div style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr 48px',
                alignItems: 'center',
                marginBottom: '30px',
                width: '100%'
            }}>
                <Button
                    onClick={onClose}
                    variant="secondary"
                    className="modal-close-btn"
                    style={{}}
                >
                    ✕
                </Button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.5rem' }}>{t('settings')}</h2>
                </div>
                <div></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem' }}>{t('sound_effects')}</span>
                    <div
                        onClick={toggleSound}
                        style={{
                            width: '60px', height: '30px',
                            background: settings.soundEnabled ? 'var(--color-primary)' : 'rgba(125,125,125,0.3)',
                            borderRadius: '15px',
                            position: 'relative',
                            transition: 'background 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            width: '26px', height: '26px',
                            background: '#fff',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '2px',
                            left: settings.soundEnabled ? '32px' : '2px',
                            transition: 'left 0.2s'
                        }} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem' }}>{t('vibration')}</span>
                    <div
                        onClick={toggleHaptics}
                        style={{
                            width: '60px', height: '30px',
                            background: settings.hapticsEnabled ? 'var(--color-primary)' : 'rgba(125,125,125,0.3)',
                            borderRadius: '15px',
                            position: 'relative',
                            transition: 'background 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            width: '26px', height: '26px',
                            background: '#fff',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '2px',
                            left: settings.hapticsEnabled ? '32px' : '2px',
                            transition: 'left 0.2s'
                        }} />
                    </div>
                </div>

                <div>
                    <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '10px' }}>{t('settings_language')}</span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {[
                            { code: 'en', label: '🇬🇧 EN' },
                            { code: 'de', label: '🇩🇪 DE' },
                            { code: 'es', label: '🇪🇸 ES' },
                            { code: 'fr', label: '🇫🇷 FR' },
                            { code: 'it', label: '🇮🇹 IT' },
                            { code: 'pt', label: '🇵🇹 PT' },
                            { code: 'nl', label: '🇳🇱 NL' },
                            { code: 'pl', label: '🇵🇱 PL' },
                            { code: 'tr', label: '🇹🇷 TR' },
                            { code: 'sv', label: '🇸🇪 SV' }
                        ].map((lang) => (
                            <Button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code)}
                                variant={settings.language === lang.code ? 'primary' : 'secondary'}
                                style={{
                                    padding: '5px 8px',
                                    fontSize: '0.9rem',
                                    opacity: settings.language === lang.code ? 1 : 0.6,
                                    flex: '1 0 18%'
                                }}
                            >
                                {lang.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                    <Button onClick={() => { if (confirm(t('leave_party_message'))) resetHistory(); }} variant="secondary" fullWidth style={{ color: '#ff5555' }}>
                        {t('reset_history')}
                    </Button>
                </div>

                {gameState === 'playing' && (
                    <div style={{ marginTop: '10px' }}>
                        <Button
                            onClick={() => {
                                if (window.confirm(t('leave_party_message'))) {
                                    goHome();
                                    onClose();
                                }
                            }}
                            fullWidth
                            style={{ background: '#ff0055', boxShadow: '0 4px 15px rgba(255,0,85,0.4)', color: '#fff' }}
                        >
                            🏠 {t('back_home')}
                        </Button>
                    </div>
                )}
            </div>

            <div style={{ marginTop: 'auto', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', paddingTop: '20px' }}>
                Trinki {t('version')} 2.0.42
            </div>
        </div>
    );
};

export default SettingsModal;
