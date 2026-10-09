import { challenges } from './challenges';

const DECK_SIZE = 50;

// Which content packs each selectable mode pulls cards from.
const MODE_PACKS = {
    classic: ['classic', 'vote', 'charade', 'bomb', 'virus', 'taboo', 'neverHaveIEver', 'wouldYouRather'],
    mostLikely: ['vote'],
    neverHaveIEver: ['neverHaveIEver'],
    wouldYouRather: ['wouldYouRather'],
    taboo: ['taboo'],
    paranoia: ['paranoia'],
    tod: ['truthOrDare'],
    marryKissKill: ['marryKissKill'],
    mindMatch: ['mindMatch'],
    wrongAnswers: ['wrongAnswers'],
    betBuddy: ['betBuddy'],
    fakeOrFact: ['fakeOrFact'],
    tenOuttaTen: ['tenOuttaTen'],
    hypotheticals: ['hypotheticals'],

    bomb: ['bomb'],
    charades: ['charade', 'charades'],
    spy: ['spy'],
    fakeArtist: ['fakeArtist'],

    newFriends: ['icebreaker', 'social'],
    closeFriends: ['hot', 'roast'],
    bar: ['bar', 'public'],
    warmUp: ['warmUp', 'rapid'],
    princess: ['princess'],

    christmas: ['christmas'],
    newYear: ['newYear'],
    beach: ['summer'],
    halloween: ['halloween'],
};

// Spicy levels 4+ cut out the tamest cards, so the deck actually gets spicier.
const minSpicinessFor = (level) => Math.max(0, level - 3);

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

const assignPlayers = (players) => {
    if (players.length === 0) return { args: {}, targetPlayerId: null, secondaryPlayerId: null };

    const len = players.length;
    const p1Index = Math.floor(Math.random() * len);
    const p1 = players[p1Index];
    const args = { p1: p1.name };

    if (len === 1) {
        return { args, targetPlayerId: p1.id, secondaryPlayerId: null };
    }

    // Players are ordered the way they sit, so neighbours can be derived from the index.
    args.p_left = players[(p1Index - 1 + len) % len].name;
    args.p_right = players[(p1Index + 1) % len].name;
    args.p_opposite = players[(p1Index + Math.floor(len / 2)) % len].name;

    let p2Index = Math.floor(Math.random() * (len - 1));
    if (p2Index >= p1Index) p2Index++;
    const p2 = players[p2Index];
    args.p2 = p2.name;

    return { args, targetPlayerId: p1.id, secondaryPlayerId: p2.id };
};

export const getDeck = (mode, players, customCards = [], settings = {}, playedCards = []) => {
    const modes = Array.isArray(mode) ? mode : [mode];
    const targetPacks = new Set(modes.flatMap(m => MODE_PACKS[m] || ['classic']));
    const spicyLevel = settings.spicyLevel ?? 3;

    let pool = challenges.filter(c => c.packs.some(p => targetPacks.has(p)));

    if (spicyLevel >= 4) {
        const extraSpice = challenges.filter(c =>
            (c.packs.includes('hot') || (spicyLevel >= 5 && c.packs.includes('nsfw'))) && !pool.includes(c)
        );
        pool = [...pool, ...extraSpice];
    }

    const minSpiciness = minSpicinessFor(spicyLevel);
    pool = pool.filter(c => {
        const cardLevel = c.spiciness || 0;
        return cardLevel >= minSpiciness && cardLevel <= spicyLevel;
    });

    // Custom cards are always in, regardless of spiciness.
    pool = [...pool, ...customCards];

    const fresh = pool.filter(c => !playedCards.includes(c.id));
    const source = fresh.length > 0 ? fresh : pool;
    if (source.length === 0) return [];

    const now = Date.now();
    return Array.from({ length: DECK_SIZE }, (_, i) => {
        const card = pickRandom(source);
        return {
            ...card,
            instanceId: `${card.id}-${i}-${now}`,
            translationKey: card.translationKey || card.id,
            text: card.text || card.question || card.word,
            ...assignPlayers(players)
        };
    });
};
