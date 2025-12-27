
import { challenges } from './challenges';

export const getDeck = (mode, players, customCards = [], settings = { spicy: false }, playedCards = []) => {
    let rawChallenges = [];

    const modePacks = {
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

        newFriends: ['icebreaker', 'social'],
        hot: ['hot'],
        closeFriends: ['hot', 'roast'],
        bar: ['bar', 'public'],
        warmUp: ['warmUp', 'rapid'],
        princess: ['princess'],

        christmas: ['christmas'],
        newYear: ['newYear'],
        beach: ['summer'],
        halloween: ['halloween'],

        tenOuttaTen: ['tenOuttaTen'],
        hypotheticals: ['hypotheticals'],
    };

    let targetPacks = [];

    const modes = Array.isArray(mode) ? mode : [mode];

    modes.forEach(m => {
        const packs = modePacks[m];
        if (packs) {
            targetPacks = [...targetPacks, ...packs];
        } else {
            if (!targetPacks.includes('classic')) targetPacks.push('classic');
        }
    });

    targetPacks = [...new Set(targetPacks)];

    let allChallenges = challenges.filter(c =>
        c.packs && c.packs.some(p => targetPacks.includes(p))
    );

    const currentSpicyLevel = settings.spicyLevel !== undefined ? settings.spicyLevel : (settings.spicy ? 3 : 0);

    if (currentSpicyLevel >= 4) {
        const extraSpice = challenges.filter(c =>
            (c.packs.includes('hot') || (currentSpicyLevel >= 5 && c.packs.includes('nsfw'))) &&
            !allChallenges.includes(c)
        );
        allChallenges = [...allChallenges, ...extraSpice];
    }

    if (settings.groupType && settings.groupType !== 'mixed') {
    }

    allChallenges = [...allChallenges, ...customCards];

    let minSpiciness = 0;
    if (currentSpicyLevel >= 3) minSpiciness = 0;
    if (currentSpicyLevel >= 4) minSpiciness = 1;
    if (currentSpicyLevel >= 5) minSpiciness = 2;
    if (currentSpicyLevel >= 6) minSpiciness = 3;

    allChallenges = allChallenges.filter(c => {
        const cardLevel = c.isSpicy ? 3 : (c.spiciness || 0);
        return cardLevel >= minSpiciness && cardLevel <= currentSpicyLevel;
    });

    const bossChallenges = challenges.filter(c => c.type === 'boss');
    const regularChallenges = allChallenges.filter(c => c.type !== 'boss');

    const freshChallenges = regularChallenges.filter(c => !playedCards.includes(c.id));

    const poolToUse = freshChallenges.length > 0 ? freshChallenges : regularChallenges;

    let deck = [];
    const deckSize = 50;

    for (let i = 0; i < deckSize; i++) {
        if (poolToUse.length === 0) break;
        const randomCard = poolToUse[Math.floor(Math.random() * poolToUse.length)];
        deck.push({ ...randomCard, instanceId: `${randomCard.id}-${i}-${Date.now()}` });
    }

    if (bossChallenges.length > 0) {
        for (let i = 10; i < deck.length; i += 11) {
            const randomBoss = bossChallenges[Math.floor(Math.random() * bossChallenges.length)];
            deck.splice(i, 0, { ...randomBoss, instanceId: `${randomBoss.id}-${i}-${Date.now()}` });
        }
    }

    return deck.map(card => {
        let args = {};
        let targetPlayerId = null;
        let secondaryPlayerId = null;

        if (players.length > 0) {
            const p1Index = Math.floor(Math.random() * players.length);
            const p1 = players[p1Index];
            args.p1 = p1.name;
            targetPlayerId = p1.id;

            if (players.length > 1) {
                const len = players.length;

                const pLeftIndex = (p1Index - 1 + len) % len;
                args.p_left = players[pLeftIndex].name;

                const pRightIndex = (p1Index + 1) % len;
                args.p_right = players[pRightIndex].name;

                const pOppositeIndex = (p1Index + Math.floor(len / 2)) % len;
                args.p_opposite = players[pOppositeIndex].name;

                let p2Index;
                do {
                    p2Index = Math.floor(Math.random() * len);
                } while (p2Index === p1Index);
                const p2 = players[p2Index];
                args.p2 = p2.name;
                secondaryPlayerId = p2.id;
            } else {
                args.p_left = "Ghost";
                args.p_right = "Ghost";
                args.p_opposite = "Ghost";
            }
        }

        return {
            ...card,
            translationKey: card.id,
            text: card.text || card.question || card.word || card.title,
            args,
            targetPlayerId,
            secondaryPlayerId
        };
    });
};
