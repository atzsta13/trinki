export const ROASTS = [
    "Wow, awkward...",
    "I wouldn't do that if I were you.",
    "Do it. You won't.",
    "My grandma drinks faster than you.",
    "This says a lot about society.",
    "Yikes.",
    "Imagine refusing this...",
    "Take the shot, coward.",
    "I'm judging you.",
    "Skill issue.",
    "Cringe.",
    "Are we having fun yet?",
    "🦝 *Judgemental Stare*",
    "I've seen better parties at a library.",
    "Drink water too, amateur."
];

export const getRoast = () => ROASTS[Math.floor(Math.random() * ROASTS.length)];
