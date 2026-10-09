import { useState } from 'react';
import { useGame } from '../../logic/GameContext';
import { useT } from '../../i18n';
import Button from '../Shared/Button';
import { playPop, playClick } from '../../logic/sound';
import { triggerHaptic, HapticType } from '../../logic/haptics';

// A narrator reads a dark riddle; the group asks yes/no questions until they find the solution.
const DarkTalesGame = ({ card, onNext }) => {
    const { players } = useGame();
    const t = useT();
    const [stage, setStage] = useState('intro'); // intro → assign → riddle
    const [narrator, setNarrator] = useState(players[0]);
    const [showSolution, setShowSolution] = useState(false);
    const key = card.translationKey;

    const pickNarrator = () => {
        playClick();
        setNarrator(players[Math.floor(Math.random() * players.length)]);
        setStage('assign');
    };

    const toggleSolution = () => {
        triggerHaptic(showSolution ? HapticType.LIGHT : HapticType.WARNING);
        playPop();
        setShowSolution(s => !s);
    };

    if (stage === 'intro') {
        return (
            <div className="screen dark-tales">
                <div className="huge pop-in">🧛</div>
                <h1 className="blood">{t('dark_tales_title')}</h1>
                <p className="muted">{t('dark_tales_intro')}</p>
                <Button variant="danger" onClick={pickNarrator}>{t('start_button')}</Button>
                <Button variant="secondary" onClick={onNext}>{t('skip_card')}</Button>
            </div>
        );
    }

    if (stage === 'assign') {
        return (
            <div className="screen dark-tales">
                <div className="huge">📖</div>
                <h2>{t('dark_tales_narrator_assign')}</h2>
                <h1 className="blood">{narrator.name}</h1>
                <p className="muted">{t('dark_tales_narrator_warn')}</p>
                <Button variant="danger" className="full-width" onClick={() => { playClick(); setStage('riddle'); }}>
                    {t('dark_tales_btn_iam', { name: narrator.name })}
                </Button>
            </div>
        );
    }

    return (
        <div className="screen dark-tales">
            <span className="narrator-badge pulse">{t('dark_tales_narrator_badge')}</span>
            <h2>{t(`${key}_title`)}</h2>
            <div className="option story"><em>&quot;{t(`${key}_story`)}&quot;</em></div>
            <p className="muted small">{t('dark_tales_instruction')}</p>
            <button className={`solution ${showSolution ? 'open' : ''}`} onClick={toggleSolution}>
                <span className="row spread"><strong>{t('dark_tales_solution_label')}</strong>{showSolution ? '👁️' : '🔒'}</span>
                {showSolution && <p>{t(`${key}_solution`)}</p>}
            </button>
            <Button variant="secondary" className="full-width" onClick={onNext}>{t('dark_tales_btn_solved')}</Button>
        </div>
    );
};

export default DarkTalesGame;
