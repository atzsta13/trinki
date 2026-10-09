// End-to-end checks of the real production build on a phone viewport.
// `data-card` on the game screen changes whenever a new card is dealt, so every step waits for exactly that.
import { test, expect } from '@playwright/test';

const SKIP_BUTTON = /next card|skip|nächste karte|überspringen/i;
// A raw i18n key (e.g. "secrets_intro_title") means a translation is missing.
const RAW_KEY = /\b[a-z0-9]+_[a-z0-9_]+\b/;

/** @param {import('@playwright/test').Page} page */
const collectErrors = (page) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    return errors;
};

const currentCardId = (page) => page.locator('[data-card]').getAttribute('data-card');

// Waits until the card has finished its entrance animation (position stable between two frames).
const stableBox = async (locator) => {
    let previous = null;
    await expect.poll(async () => {
        const box = await locator.boundingBox();
        const same = previous && box && Math.abs(box.x - previous.x) < 1 && Math.abs(box.y - previous.y) < 1 && Math.abs(box.width - previous.width) < 1;
        previous = box;
        return same;
    }, { intervals: [50] }).toBe(true);
    return previous;
};

// Advances one card: swipe a normal card, or press skip/next in a minigame.
const advance = async (page) => {
    const before = await currentCardId(page);
    const card = page.locator('.game-card');
    if (await card.isVisible()) {
        const box = await stableBox(card);
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 260, box.y + box.height / 2, { steps: 10 });
        await page.mouse.up();
    } else {
        await page.getByRole('button', { name: SKIP_BUTTON }).first().click();
    }
    await expect.poll(() => currentCardId(page), { message: `stuck on card ${before}` }).not.toBe(before);
};

const startParty = async (page, onlyModes) => {
    await page.goto('/');
    if (onlyModes) {
        // Click each active mode exactly once (element handles don't re-resolve between clicks).
        const active = page.locator('.mode-card.active');
        for (const mode of await active.elementHandles()) await mode.click();
        await expect(active).toHaveCount(0);
        for (const name of onlyModes) await page.locator('.mode-card', { hasText: name }).first().click();
        await expect(active).toHaveCount(onlyModes.length);
    }
    await page.getByRole('button', { name: /•/ }).click();
    await expect(page.locator('[data-card]')).toBeVisible();
};

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('trinki_disclaimer_accepted', 'true');
        localStorage.setItem('trinki_players', JSON.stringify(
            ['Alex', 'Sam', 'Chris'].map((name, i) => ({ id: String(i + 1), name, drinkCount: 0, streak: 0 }))
        ));
    });
});

test('plays 25 cards of the default mix without errors or missing translations', async ({ page }) => {
    const errors = collectErrors(page);
    await startParty(page);
    for (let i = 0; i < 25; i++) {
        await expect(page.locator('body')).not.toContainText(RAW_KEY);
        await advance(page);
    }
    expect(errors).toEqual([]);
});

test.describe('in German', () => {
    test.use({ locale: 'de-DE' });

    test('setup and cards are translated', async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto('/');
        await expect(page.getByText('SPIELER', { exact: false }).first()).toBeVisible();
        await startParty(page);
        for (let i = 0; i < 10; i++) {
            await expect(page.locator('body')).not.toContainText(RAW_KEY);
            await advance(page);
        }
        expect(errors).toEqual([]);
    });
});

// Every minigame must offer a way to the next card (it once only had "Exit").
for (const mode of ['Bomb', 'Charades', 'Spy', 'Fake Artist']) {
    test(`${mode} minigame can be skipped`, async ({ page }) => {
        const errors = collectErrors(page);
        await startParty(page, [mode]);
        // Some modes mix in plain cards (e.g. charade cards); play on until the minigame shows up.
        for (let i = 0; i < 20 && await page.locator('.game-card').isVisible(); i++) await advance(page);
        await expect(page.locator('.game-card')).toHaveCount(0);
        await advance(page);
        expect(errors).toEqual([]);
    });
}

test('dice button suggests a name without adding a player', async ({ page }) => {
    await page.goto('/');
    const chips = page.locator('.player-chip');
    await expect(chips).toHaveCount(3);
    await page.getByRole('button', { name: '🎲' }).click();
    await expect(page.locator('input.input-field').first()).not.toHaveValue('');
    await expect(chips).toHaveCount(3);
});

test('ending the game from the menu shows the scoreboard, play again deals new cards', async ({ page }) => {
    await startParty(page, ['Most Likely']);
    await page.getByRole('button', { name: '☰' }).click();
    await page.getByRole('button', { name: /end game/i }).click();
    await expect(page.getByText(/party mvp/i)).toBeVisible();
    await page.getByRole('button', { name: /play again/i }).click();
    await expect(page.locator('.game-card')).toBeVisible();
});

test('every empty mode now has cards', async ({ page }) => {
    for (const mode of ['Icebreaker', 'Bar', 'Pre-Game', 'New Year', 'Beach']) {
        await startParty(page, [mode]);
        await expect(page.locator('.game-card')).toBeVisible();
        await page.getByRole('button', { name: '☰' }).click();
        page.once('dialog', d => d.accept());
        await page.getByRole('button', { name: /quit party/i }).click();
    }
});

test('quitting from the menu returns to the setup screen', async ({ page }) => {
    await startParty(page, ['Most Likely']); // no minigames, so the ☰ menu is always there
    await page.getByRole('button', { name: '☰' }).click();
    page.once('dialog', d => d.accept());
    await page.getByRole('button', { name: /quit party|party verlassen/i }).click();
    await expect(page.getByRole('button', { name: /•/ })).toBeVisible();
});
