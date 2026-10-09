import { useState } from 'react';
import { useGame } from '../../logic/GameContext';
import { useT } from '../../i18n';
import Button from '../Shared/Button';
import { playPop, playSuccess, playClick } from '../../logic/sound';
import { triggerHaptic, HapticType } from '../../logic/haptics';

const shuffle = (list) => {
    const result = [...list];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

// Everyone answers the question secretly; answers are shuffled and the group guesses who wrote what.
const SecretsGame = ({ card, onNext }) => {
    const { players } = useGame();
    const t = useT();
    const [stage, setStage] = useState('intro'); // intro → pass ⇄ input → shuffling → reveal
    const [playerIndex, setPlayerIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [input, setInput] = useState('');
    const [revealed, setRevealed] = useState(null);
    const question = t(card.translationKey);
    const player = players[playerIndex];

    const go = (next) => { playClick(); setStage(next); };

    const submit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        playSuccess();
        triggerHaptic(HapticType.SUCCESS);
        const all = [...answers, { text: input.trim(), playerName: player.name }];
        setAnswers(all);
        setInput('');
        if (playerIndex < players.length - 1) {
            setPlayerIndex(i => i + 1);
            setStage('pass');
        } else {
            setAnswers(shuffle(all));
            setStage('shuffling');
            setTimeout(() => setStage('reveal'), 1500);
        }
    };

    if (stage === 'intro') {
        return (
            <div className="screen">
                <div className="huge pop-in">🤫</div>
                <h1>{t('secrets_intro_title')}</h1>
                <p className="muted">{t('secrets_intro_desc')}</p>
                <div className="option"><em>&quot;{question}&quot;</em></div>
                <Button onClick={() => go('pass')}>Start</Button>
                <Button variant="secondary" onClick={onNext}>{t('skip_card')}</Button>
            </div>
        );
    }

    if (stage === 'pass') {
        return (
            <div className="screen">
                <div className="huge">📱➡️</div>
                <h2>{t('secrets_pass_title')}</h2>
                <h1 className="accent">{player.name}</h1>
                <p className="muted">{t('secrets_pass_desc')}</p>
                <Button onClick={() => go('input')}>{t('secrets_btn_iam', { name: player.name })}</Button>
            </div>
        );
    }

    if (stage === 'input') {
        return (
            <form className="screen screen-top" onSubmit={submit}>
                <p className="muted">{player.name}</p>
                <h2>{question}</h2>
                <textarea autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('secrets_placeholder')} className="input-field grow" />
                <Button type="submit" className="full-width" disabled={!input.trim()}>{t('secrets_btn_submit')}</Button>
            </form>
        );
    }

    if (stage === 'shuffling') {
        return (
            <div className="screen">
                <div className="huge spin">🤫</div>
                <h2 className="pulse">{t('secrets_shuffling')}</h2>
            </div>
        );
    }

    return (
        <div className="screen screen-top">
            <h2>{t('secrets_reveal_title')}</h2>
            <div className="stack grow scroll full-width">
                {answers.map((answer, i) => (
                    <button key={i} className={`answer ${revealed === i ? 'revealed' : ''}`} onClick={() => { setRevealed(revealed === i ? null : i); playPop(); }}>
                        &quot;{answer.text}&quot;
                        <small>{revealed === i ? `— ${answer.playerName}` : t('secrets_hint_tap')}</small>
                    </button>
                ))}
            </div>
            <Button variant="secondary" className="full-width" onClick={onNext}>{t('secrets_btn_finish')}</Button>
        </div>
    );
};

export default SecretsGame;
