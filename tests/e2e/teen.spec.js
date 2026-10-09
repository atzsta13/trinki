// The 13+ store edition (`npm run build:teen`, project "teen"): ice cubes instead of drinks,
// spiciness capped, adult modes hidden. Content is also checked statically (unit tests, check-teen.js);
// this makes sure the real app shows the teen edition.
import { test, expect } from '@playwright/test';
import { RAW_KEY, collectErrors, advance } from './helpers.js';

const DRINKING = /\b(drinks?|drunk|sips?|shots?|beer|wine|cheers|toast)\b|🍺|🍻/i;

test('first start shows the ice-cube house rules and the no-subscription promise', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('HOUSE RULES')).toBeVisible();
    await expect(page.getByText(/never chew or swallow the ice/i)).toBeVisible();
    await expect(page.getByText(/no subscriptions/i)).toBeVisible();
    await expect(page.getByText(/18\+|drinking age/i)).toHaveCount(0);
    await page.getByRole('button', { name: /let's play/i }).click();
    await expect(page.getByRole('button', { name: /•/ })).toBeVisible();
});

test.describe('after the house rules', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('partypenguin_disclaimer_accepted', 'true');
            // A level saved by the full edition is capped.
            localStorage.setItem('partypenguin_settings', JSON.stringify({ spicyLevel: 6 }));
            localStorage.setItem('partypenguin_players', JSON.stringify(
                ['Alex', 'Sam', 'Chris'].map((name, i) => ({ id: String(i + 1), name, drinkCount: 0, streak: 0 }))
            ));
        });
    });

    test('setup hides the adult modes and caps spiciness', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.spicy-slider')).toHaveAttribute('max', '3');
        await expect(page.locator('.spicy-slider')).toHaveValue('3');
        await expect(page.locator('.spicy-step')).toHaveCount(4);
        await expect(page.locator('.mode-card', { hasText: /^🌶️\s*Spicy$/ })).toHaveCount(0);
        await expect(page.locator('.mode-card', { hasText: 'Bar' })).toHaveCount(0);
        await expect(page.locator('.mode-card', { hasText: 'Warm-Up' })).toBeVisible();
    });

    test('plays 30 cards with every pack on and never mentions drinking', async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto('/');
        // Turn on every pack, including the themed and seasonal ones.
        const inactive = page.locator('.mode-card:not(.active):not(.tool-card)');
        for (let n = await inactive.count(); n > 0; n--) {
            await inactive.first().click();
            await expect(inactive).toHaveCount(n - 1);
        }
        await page.getByRole('button', { name: /•/ }).click();
        for (let i = 0; i < 30; i++) {
            await expect(page.locator('body')).not.toContainText(DRINKING);
            await expect(page.locator('body')).not.toContainText(RAW_KEY);
            await advance(page);
        }
        expect(errors).toEqual([]);
    });
});
