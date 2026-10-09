import { useState, useRef } from 'react';
import { useGame } from '../../logic/GameContext';
import { useT } from '../../i18n';
import Button from '../Shared/Button';
import PassAndReveal from './PassAndReveal';

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

// Everyone draws one line of the secret word; the fake artist doesn't know it and has to bluff.
const FakeArtistGame = ({ onNext }) => {
    const { players } = useGame();
    const t = useT();
    const [stage, setStage] = useState('setup'); // setup → reveal ⇄ draw → discuss
    const [playerIndex, setPlayerIndex] = useState(0);
    const [fakeIndex, setFakeIndex] = useState(0);
    const [category, setCategory] = useState('');
    const [word, setWord] = useState('');
    const canvasRef = useRef(null);

    const start = () => {
        const cat = pickRandom(t.words.categories);
        setCategory(cat.name);
        setWord(pickRandom(cat.words));
        setFakeIndex(Math.floor(Math.random() * players.length));
        setPlayerIndex(0);
        setStage('reveal');
    };

    const finishTurn = () => {
        if (playerIndex < players.length - 1) {
            setPlayerIndex(i => i + 1);
            setStage('reveal');
        } else {
            setStage('discuss');
        }
    };

    const point = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
    };

    const startLine = (e) => {
        if (stage !== 'draw') return;
        canvasRef.current.setPointerCapture(e.pointerId);
        const ctx = canvasRef.current.getContext('2d');
        Object.assign(ctx, { lineWidth: 3, lineCap: 'round', strokeStyle: '#000' });
        ctx.beginPath();
        ctx.moveTo(...point(e));
    };

    const continueLine = (e) => {
        if (stage !== 'draw' || !canvasRef.current.hasPointerCapture(e.pointerId)) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(...point(e));
        ctx.stroke();
    };

    const showCanvas = stage === 'draw' || stage === 'discuss';

    return (
        <div className="full">
            <Button variant="secondary" className="btn-small corner" onClick={onNext}>{t('skip_card')} ⏭</Button>

            {stage === 'setup' && (
                <div className="screen">
                    <h1>🎨 {t('mode_fake_artist')}</h1>
                    <p className="muted">{t('fake_intro')}</p>
                    {players.length < 3 ? <p className="bad">{t('need_3_players')}</p> : <Button onClick={start}>{t('start_game')}</Button>}
                </div>
            )}

            {stage === 'reveal' && (
                <PassAndReveal
                    key={playerIndex}
                    playerName={players[playerIndex].name}
                    secret={<>{t('category')}: {category}<br /><strong>{playerIndex === fakeIndex ? t('fake_you_are_fake') : word}</strong></>}
                    isImpostor={playerIndex === fakeIndex}
                    doneLabel={t('fake_go_draw')}
                    onDone={() => setStage('draw')}
                />
            )}

            {/* The canvas stays mounted (only hidden) so the drawing survives between turns. */}
            <div className="screen" hidden={!showCanvas}>
                <h3>{stage === 'draw' ? `${players[playerIndex]?.name}: ${t('fake_draw_one')}` : t('final_stats')}</h3>
                <canvas ref={canvasRef} width={320} height={350} className="drawing" onPointerDown={startLine} onPointerMove={continueLine} />
                {stage === 'draw' && <><Button onClick={finishTurn}>{t('fake_done')}</Button><p className="muted small">{t('fake_tip_no_lift')}</p></>}
                {stage === 'discuss' && (
                    <>
                        <p>{t('spy_the_word_was')} <b>{word}</b></p>
                        <p>{t('fake_was')} <b className="bad">{players[fakeIndex].name}</b></p>
                        <Button onClick={onNext}>{t('next_card')} ➡️</Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FakeArtistGame;
