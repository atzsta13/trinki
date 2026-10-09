import { useGame } from '../../logic/GameContext';
import { useT } from '../../i18n';
import Button from './Button';

const LANGUAGES = [
    ['en', '🇬🇧 EN'], ['de', '🇩🇪 DE'], ['es', '🇪🇸 ES'], ['fr', '🇫🇷 FR'], ['it', '🇮🇹 IT'],
    ['pt', '🇵🇹 PT'], ['nl', '🇳🇱 NL'], ['pl', '🇵🇱 PL'], ['tr', '🇹🇷 TR'], ['sv', '🇸🇪 SV']
];

const Toggle = ({ label, checked, onToggle }) => (
    <label className="row spread">
        <span>{label}</span>
        <button role="switch" aria-checked={checked} className={`toggle ${checked ? 'on' : ''}`} onClick={onToggle} />
    </label>
);

const SettingsModal = ({ onClose }) => {
    const { settings, toggleSound, toggleHaptics, setLanguage, resetHistory, gameState, goHome, finishGame } = useGame();
    const t = useT();

    return (
        <div className="overlay stack">
            <div className="row spread">
                <Button variant="icon" onClick={onClose}>✕</Button>
                <h2 className="accent">{t('settings')}</h2>
                <span className="icon-spacer" />
            </div>

            <Toggle label={t('sound_effects')} checked={settings.soundEnabled} onToggle={toggleSound} />
            <Toggle label={t('vibration')} checked={settings.hapticsEnabled} onToggle={toggleHaptics} />

            <span>{t('settings_language')}</span>
            <div className="language-grid">
                {LANGUAGES.map(([code, label]) => (
                    <Button key={code} variant={settings.language === code ? 'primary' : 'secondary'} className="btn-small" onClick={() => setLanguage(code)}>
                        {label}
                    </Button>
                ))}
            </div>

            <Button variant="secondary" className="full-width danger-text" onClick={() => window.confirm(`${t('reset_history')}?`) && resetHistory()}>
                {t('reset_history')}
            </Button>

            {gameState === 'playing' && (
                <Button className="full-width" onClick={() => { finishGame(); onClose(); }}>
                    🏁 {t('end_game')}
                </Button>
            )}

            {gameState === 'playing' && (
                <Button
                    variant="danger"
                    className="full-width"
                    onClick={() => {
                        if (!window.confirm(t('leave_party_message'))) return;
                        goHome();
                        onClose();
                    }}
                >
                    🏠 {t('back_home')}
                </Button>
            )}

            <p className="muted small center">Trinki {t('version')} {__APP_VERSION__}</p>
        </div>
    );
};

export default SettingsModal;
