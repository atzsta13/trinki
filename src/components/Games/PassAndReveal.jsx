import { useState } from 'react';
import { useT } from '../../i18n';
import { triggerHaptic, HapticType } from '../../logic/haptics';
import Button from '../Shared/Button';

// "Pass the phone to X" + a tap-to-reveal secret. Used by Spy and Fake Artist.
// Render with key={playerIndex} so the secret is hidden again for the next player.
const PassAndReveal = ({ playerName, secret, isImpostor, doneLabel, onDone }) => {
    const t = useT();
    const [shown, setShown] = useState(false);

    return (
        <div className="screen">
            <p className="muted">{t('spy_pass_to')}</p>
            <h1 className="accent">{playerName}</h1>
            <button
                className={`reveal ${shown ? (isImpostor ? 'impostor' : 'shown') : ''}`}
                onClick={() => { setShown(s => !s); triggerHaptic(HapticType.SELECTION); }}
            >
                {shown ? secret : <>👆<br /><small>{t('tap_to_reveal')}</small></>}
            </button>
            {shown && <Button onClick={onDone}>{doneLabel}</Button>}
        </div>
    );
};

export default PassAndReveal;
