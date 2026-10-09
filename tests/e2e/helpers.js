// Shared steps for the e2e specs of both editions.
import { expect } from '@playwright/test';

const SKIP_BUTTON = /next card|skip|nächste karte|überspringen/i;
// A raw i18n key (e.g. "secrets_intro_title") means a translation is missing.
export const RAW_KEY = /\b[a-z0-9]+_[a-z0-9_]+\b/;

/** @param {import('@playwright/test').Page} page */
export const collectErrors = (page) => {
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
export const advance = async (page) => {
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
