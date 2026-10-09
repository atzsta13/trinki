const ROASTS = [
    "Wow, awkward...",
    "I wouldn't do that if I were you.",
    "Do it. You won't.",
    "This says a lot about society.",
    "Yikes.",
    "Imagine refusing this...",
    "I'm judging you.",
    "Skill issue.",
    "Cringe.",
    "Are we having fun yet?",
    "🐧 *Judgemental Stare*",
    "I've seen better parties at a library."
];

// The teen edition gets its own penalty jokes; the build drops the unused list.
const PENALTY_ROASTS = __EDITION__ === 'teen'
    ? ["My grandma takes ice cubes faster than you.", "Take the ice cube, coward.", "Stay frosty, amateur."]
    : ["My grandma drinks faster than you.", "Take the shot, coward.", "Drink water too, amateur."];

const ALL_ROASTS = [...ROASTS, ...PENALTY_ROASTS];

export const getRoast = () => ALL_ROASTS[Math.floor(Math.random() * ALL_ROASTS.length)];
