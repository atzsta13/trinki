import React from 'react';
import Button from '../Shared/Button';

const Disclaimer = ({ onAccept }) => {
    return (
        <div className="flex-center full-screen" style={{
            flexDirection: 'column',
            padding: '40px',
            background: '#000',
            zIndex: 9999,
            textAlign: 'center'
        }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '20px' }}>⚠️ WARNING</h1>

            <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: '15px',
                marginBottom: '40px',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                color: '#ddd'
            }}>
                <p style={{ marginBottom: '15px' }}>
                    <strong>Please Drink Responsibly.</strong>
                </p>
                <p style={{ marginBottom: '15px' }}>
                    This game is intended for entertainment purposes only.
                    You must be of legal drinking age in your country to play.
                </p>
                <p style={{ marginBottom: '15px' }}>
                    Do not feel pressured to complete any challenge that makes you uncomfortable or puts your health/safety at risk.
                    You can always choose to skip a turn.
                </p>
                <p>
                    Never drink and drive.
                </p>
            </div>

            <Button onClick={onAccept} fullWidth>
                I Agree & I am 18+
            </Button>
        </div>
    );
};

export default Disclaimer;
