import { describe, it, expect } from 'vitest';
import { getDeck, DECK_SIZE } from '../../src/logic/deck';
import { challenges } from '../../src/logic/challenges';

const players = [
    { id: 'a', name: 'Alex' },
    { id: 'b', name: 'Sam' },
    { id: 'c', name: 'Chris' },
    { id: 'd', name: 'Dana' }
];

describe('getDeck', () => {
    it('builds a full deck with unique instance ids', () => {
        const deck = getDeck(['classic'], players, [], { spicyLevel: 3 });
        expect(deck).toHaveLength(DECK_SIZE);
        expect(new Set(deck.map(c => c.instanceId)).size).toBe(DECK_SIZE);
    });

    it('only uses cards from the selected modes', () => {
        const deck = getDeck(['spy'], players, [], { spicyLevel: 3 });
        deck.forEach(card => expect(card.type).toBe('spy'));
    });

    it('respects the spiciness slider', () => {
        getDeck(['classic', 'tod', 'paranoia'], players, [], { spicyLevel: 1 })
            .forEach(card => expect(card.spiciness).toBeLessThanOrEqual(1));
        // Level 5 drops the tamest cards (minimum spiciness = level - 3).
        getDeck(['classic', 'tod', 'paranoia'], players, [], { spicyLevel: 5 })
            .forEach(card => expect(card.spiciness).toBeGreaterThanOrEqual(2));
    });

    it('always includes custom cards, regardless of spiciness', () => {
        const custom = [{ id: 'custom_1', text: 'Custom rule', type: 'custom' }];
        const deck = getDeck(['spy'], players, custom, { spicyLevel: 6 });
        expect(deck.some(c => c.id === 'custom_1')).toBe(true);
    });

    it('prefers cards that have not been played yet', () => {
        const spyAndArt = challenges.filter(c => c.packs.includes('spy') || c.packs.includes('fakeArtist'));
        const played = spyAndArt.filter(c => c.type === 'spy').map(c => c.id);
        const deck = getDeck(['spy', 'fakeArtist'], players, [], { spicyLevel: 3 }, played);
        deck.forEach(card => expect(played).not.toContain(card.id));
    });

    it('assigns seat-based player names', () => {
        const deck = getDeck(['classic'], players, [], { spicyLevel: 3 });
        deck.forEach(card => {
            const i = players.findIndex(p => p.name === card.args.p1);
            expect(card.targetPlayerId).toBe(players[i].id);
            expect(card.args.p_left).toBe(players[(i + players.length - 1) % players.length].name);
            expect(card.args.p_right).toBe(players[(i + 1) % players.length].name);
            expect(card.args.p2).not.toBe(card.args.p1);
        });
    });

    it('returns an empty deck when nothing matches', () => {
        expect(getDeck(['newYear'], players, [], { spicyLevel: 3 })).toEqual([]);
    });
});
