import Button from '../Shared/Button';

const Disclaimer = ({ onAccept }) => (
    <div className="screen">
        <h1 className="accent">⚠️ WARNING</h1>
        <div className="panel stack small">
            <strong>Please Drink Responsibly.</strong>
            <p>This game is intended for entertainment purposes only. You must be of legal drinking age in your country to play.</p>
            <p>Do not feel pressured to complete any challenge that makes you uncomfortable or puts your health/safety at risk. You can always choose to skip a turn.</p>
            <p>Never drink and drive.</p>
        </div>
        <Button onClick={onAccept} className="full-width">I Agree &amp; I am 18+</Button>
    </div>
);

export default Disclaimer;
