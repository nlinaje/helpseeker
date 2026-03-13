import { test, expect } from '@playwright/test';

// Helper function to create a profile
async function createProfile(page, name = 'Test Child') {
  await page.goto('/#/profile/new');
  const nameInput = page.locator('input#childName');
  await nameInput.fill(name);
  const firstCharacter = page.locator('button.character-option').first();
  await firstCharacter.click();
  const submitButton = page.getByRole('button', { name: /Profil erstellen/i });
  await submitButton.click();
  await expect(page).toHaveURL(/#\/scenarios/);
}

test('can select a scenario category', async ({ page }) => {
  await createProfile(page);

  // Click first category
  const firstCategory = page.locator('button.category-card').first();
  await expect(firstCategory).toBeVisible();
  await firstCategory.click();

  // Should show scenarios for that category
  await expect(page.locator('button.scenario-card').first()).toBeVisible();
});

test('scenario list displays scenarios with difficulty', async ({ page }) => {
  await createProfile(page);

  // Open first category
  const firstCategory = page.locator('button.category-card').first();
  await firstCategory.click();

  // Scenarios should be visible
  const firstScenario = page.locator('button.scenario-card').first();
  await expect(firstScenario).toBeVisible();

  // Difficulty dots should be visible
  const difficultyDots = firstScenario.locator('.difficulty-dots');
  await expect(difficultyDots).toBeVisible();
});

test('can play a scenario', async ({ page }) => {
  await createProfile(page);

  // Open first category
  const firstCategory = page.locator('button.category-card').first();
  await firstCategory.click();

  // Click first scenario
  const firstScenario = page.locator('button.scenario-card').first();
  await firstScenario.click();

  // Should navigate to scenario play view
  await expect(page).toHaveURL(/#\/scenario\/\w+/);

  // Scenario content should be visible
  await expect(page.locator('.scenario-play-view')).toBeVisible();
});

test('back button from scenario returns to category list', async ({ page }) => {
  await createProfile(page);

  // Open first category
  const firstCategory = page.locator('button.category-card').first();
  await firstCategory.click();

  // Click first scenario
  const firstScenario = page.locator('button.scenario-card').first();
  await firstScenario.click();

  // Click back button
  const backButton = page.locator('button.btn-back').first();
  await backButton.click();

  // Should return to scenario list in same category (not category cards overview)
  await expect(page).toHaveURL(/#\/scenarios/);
  // Should show scenario cards, not category cards
  await expect(page.locator('button.scenario-card').first()).toBeVisible();
});

test('after completing scenario, stays in category to select another', async ({ page }) => {
  await createProfile(page);

  // Open first category
  const firstCategory = page.locator('button.category-card').first();
  await firstCategory.click();

  // Click first scenario
  const firstScenario = page.locator('button.scenario-card').first();
  await firstScenario.click();

  // Find and click the correct answer button
  // First scenario has target phrase "Ich brauche Hilfe"
  const correctButton = page.locator('button.choice-btn', { hasText: /Ich brauche Hilfe/ }).first();
  await correctButton.click();

  // Wait for celebration view
  await expect(page.locator('.celebration-view')).toBeVisible();

  // Click "Weiter" button
  const continueButton = page.getByRole('button', { name: /Weiter/i }).first();
  await continueButton.click();

  // Should return to scenario list in SAME category, not category cards overview
  await expect(page).toHaveURL(/#\/scenarios/);
  // Should show scenario cards for the category
  await expect(page.locator('button.scenario-card').first()).toBeVisible();
  // Should NOT show category cards
  await expect(page.locator('button.category-card')).toHaveCount(0);
});
