import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/HelpSeeker/);
});

test('can create a profile', async ({ page }) => {
  await page.goto('/');

  // Should show profile creation button
  const createButton = page.getByRole('button', { name: /Neues Profil erstellen/i });
  await expect(createButton).toBeVisible();
  await createButton.click();

  // Should navigate to profile creation
  await expect(page).toHaveURL(/#\/profile\/new/);
});

test('scenario categories are displayed after profile creation', async ({ page }) => {
  // Create profile first
  await page.goto('/#/profile/new');

  // Fill in profile name
  const nameInput = page.locator('input#childName');
  await nameInput.fill('Test Child');

  // Select a character (click any character button)
  const firstCharacter = page.locator('button.character-option').first();
  await firstCharacter.click();

  // Submit form - click "Profil erstellen" button
  const submitButton = page.getByRole('button', { name: /Profil erstellen/i });
  await submitButton.click();

  // Should redirect to scenarios
  await expect(page).toHaveURL(/#\/scenarios/);

  // Categories should be visible
  const categories = ['Körperlich', 'Lernen', 'Sozial', 'Gefühle'];
  for (const category of categories) {
    await expect(page.getByText(category)).toBeVisible();
  }
});
