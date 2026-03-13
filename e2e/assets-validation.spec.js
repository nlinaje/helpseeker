import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('all image files referenced in scenarios.json exist', async ({ page }) => {
  // Load scenarios data
  const scenariosPath = path.join(process.cwd(), 'data', 'scenarios.json');
  const scenariosData = JSON.parse(fs.readFileSync(scenariosPath, 'utf-8'));

  // Collect all referenced image paths
  const referencedImages = new Set();
  for (const scenario of scenariosData.scenarios) {
    if (scenario.image) referencedImages.add(scenario.image);
    if (scenario.images && Array.isArray(scenario.images)) {
      scenario.images.forEach(img => referencedImages.add(img));
    }
  }

  // Check each image exists
  const missingImages = [];
  for (const imagePath of referencedImages) {
    const fullPath = path.join(process.cwd(), imagePath);
    if (!fs.existsSync(fullPath)) {
      missingImages.push(imagePath);
    }
  }

  if (missingImages.length > 0) {
    console.error(`Missing ${missingImages.length} image files:`);
    missingImages.slice(0, 10).forEach(img => console.error(`  - ${img}`));
    if (missingImages.length > 10) {
      console.error(`  ... and ${missingImages.length - 10} more`);
    }
  }

  expect(missingImages).toHaveLength(0);
});

test('no 404 responses when loading scenario with images', async ({ page }) => {
  // Track all HTTP requests
  const failedRequests = [];
  page.on('response', response => {
    if (response.status() === 404) {
      failedRequests.push({
        url: response.url(),
        status: response.status(),
      });
    }
  });

  // Create profile
  await page.goto('/#/profile/new');
  const nameInput = page.locator('input#childName');
  await nameInput.fill('Test');
  const firstCharacter = page.locator('button.character-option').first();
  await firstCharacter.click();
  const submitButton = page.getByRole('button', { name: /Profil erstellen/i });
  await submitButton.click();

  // Open category and play scenario
  const firstCategory = page.locator('button.category-card').first();
  await firstCategory.click();
  const firstScenario = page.locator('button.scenario-card').first();
  await firstScenario.click();

  // Wait for scenario to load
  await expect(page.locator('.scenario-play-view')).toBeVisible({ timeout: 5000 });

  // Filter to only image 404s (not other assets)
  const imageFailures = failedRequests.filter(req =>
    /images\/scenarios\/.*\.(jpg|png|webp)$/i.test(req.url)
  );

  if (imageFailures.length > 0) {
    console.error(`Found ${imageFailures.length} missing image files:`);
    imageFailures.slice(0, 5).forEach(req => {
      console.error(`  404: ${req.url.replace(/.*\//, '')}`);
    });
  }

  expect(imageFailures).toHaveLength(0);
});
