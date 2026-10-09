// End-to-end checks of the real production build on a phone viewport.
// `data-card` on the game screen changes whenever a new card is dealt, so every step waits for exactly that.
import { test, expect } from '@playwright/test';
import { RAW_KEY, collectErrors, advance } from './helpers.js';

const startParty = async (page, onlyModes) => {
    await page.goto('/');
    if (onlyModes) {
        // Deselect one mode at a time and wait until the UI reflects it, so no click can race a re-render.
        const active = page.locator('.mode-card.active');
        for (let n = await active.count(); n > 0; n--) {
            await active.first().click();
            await expect(active).toHaveCount(n - 1);
        }
        for (const name of onlyModes) await page.locator('.mode-card', { hasText: name }).first().click();
        await expect(active).toHaveCount(onlyModes.length);
    }
    await page.getByRole('button', { name: /•/ }).click();
    await expect(page.locator('[data-card]')).toBeVisible();
};

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('partypenguin_disclaimer_accepted', 'true');
        localStorage.setItem('partypenguin_players', JSON.stringify(
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

test('players saved under the old app name are kept after the rename', async ({ browser }) => {
    const page = await browser.newPage();
    await page.addInitScript(() => {
        if (sessionStorage.getItem('seeded')) return;
        sessionStorage.setItem('seeded', '1');
        localStorage.clear();
        localStorage.setItem('trinki_disclaimer_accepted', 'true');
        localStorage.setItem('trinki_players', JSON.stringify([{ id: 'x', name: 'Legacy Larry', drinkCount: 0, streak: 0 }]));
    });
    await page.goto('/');
    await expect(page.locator('.player-chip', { hasText: 'Legacy Larry' })).toBeVisible();
    expect(await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('trinki_')))).toEqual([]);
    await page.close();
});
