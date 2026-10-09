// All sounds are synthesized with the Web Audio API – no audio files needed.

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
// Created on the first sound (always after a user gesture) so startup doesn't spin up the audio thread.
let audioCtx = null;
let soundEnabled = true;

export const setSoundEnabled = (enabled) => {
    soundEnabled = enabled;
};

// Returns the audio context if a sound may play right now, otherwise null.
const getContext = () => {
    if (!soundEnabled || !AudioContextClass) return null;
    audioCtx ??= new AudioContextClass({ latencyHint: 'interactive' });
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
};

// Plays a single enveloped oscillator, optionally sweeping to `endFreq`.
const playTone = ({ freq, endFreq, type = 'sine', duration, volume = 0.05, startOffset = 0, sweep = 'exponential' }) => {
    const ctx = getContext();
    if (!ctx) return;

    const start = ctx.currentTime + startOffset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (endFreq) {
        if (sweep === 'linear') osc.frequency.linearRampToValueAtTime(endFreq, start + duration);
        else osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
    }

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
};

export const playClick = () => playTone({ freq: 800, endFreq: 100, duration: 0.05 });

export const playPop = () => playTone({ freq: 1200, endFreq: 600, duration: 0.15 });

export const playTick = () => playTone({ freq: 2000, duration: 0.03, volume: 0.02 });

export const playBeep = () => playTone({ freq: 880, duration: 0.1 });

export const playError = () => playTone({ freq: 150, endFreq: 100, duration: 0.2, sweep: 'linear' });

// Quick rising C-major arpeggio.
export const playSuccess = () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        playTone({ freq, duration: 0.6, volume: 0.04, startOffset: i * 0.06 });
    });
};
