import { useState } from 'react';
import { useGame } from '../../logic/GameContext';
import { useT } from '../../i18n';
import Button from './Button';

const CustomCardInput = () => {
    const { customCards, addCustomCard, removeCustomCard } = useGame();
    const t = useT();
    const [text, setText] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        addCustomCard(text.trim());
        setText('');
    };

    return (
        <section className="stack">
            <h3 className="section-title">{t('custom_cards')}</h3>
            <form onSubmit={handleAdd} className="row">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t('custom_card_placeholder')}
                    className="input-field"
                />
                <Button type="submit" variant="secondary">+</Button>
            </form>
            {customCards.map(card => (
                <div key={card.id} className="player-chip">
                    <span>{card.text}</span>
                    <button className="chip-remove" onClick={() => removeCustomCard(card.id)}>✕</button>
                </div>
            ))}
            {customCards.length === 0 && <p className="muted small">{t('no_custom_cards')}</p>}
        </section>
    );
};

export default CustomCardInput;
