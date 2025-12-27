import React, { useState } from 'react';
import { useGame } from '../../logic/GameContext';
import Button from '../Shared/Button';

const CustomCardInput = () => {
    const { customCards, addCustomCard, removeCustomCard } = useGame();
    const [text, setText] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (text.trim()) {
            addCustomCard(text.trim());
            setText('');
        }
    };

    return (
        <div style={{ width: '100%', marginTop: '20px' }}>
            <h3 className="setup-title">Custom Cards</h3>

            <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add your own rule..."
                    className="input-field"
                    style={{
                        flex: 1,
                        padding: '15px',
                        borderRadius: '12px',
                        fontSize: '1rem'
                    }}
                />
                <Button onClick={handleAdd} type="submit" variant="secondary" style={{ padding: '15px', minWidth: '60px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)' }}>+</Button>
            </form>

            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {customCards.map(card => (
                    <div key={card.id} className="player-chip" style={{ justifyContent: 'space-between', borderRadius: '12px' }}>
                        <span style={{ flex: 1, marginRight: '10px' }}>{card.text}</span>
                        <span onClick={() => removeCustomCard(card.id)} style={{ color: '#ff0055', cursor: 'pointer', fontWeight: 'bold', padding: '5px' }}>✕</span>
                    </div>
                ))}
                {customCards.length === 0 && <p style={{ opacity: 0.5, fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>No custom cards active.</p>}
            </div>
        </div>
    );
};

export default CustomCardInput;
