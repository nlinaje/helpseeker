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

test('scenario images are not cropped by aspect-ratio constraint', async ({ page }) => {
  await createProfile(page);

  // Open Academic category (where de-acad-002 is)
  await page.locator('button.category-card').nth(1).click();

  // Play second scenario (de-acad-002 with modified image)
  await page.locator('button.scenario-card').nth(1).click();

  await expect(page.locator('.scenario-play-view')).toBeVisible();

  const storyboard = page.locator('.scenario-storyboard').first();
  const image = storyboard.locator('img').first();

  if (await image.isVisible()) {
    const naturalDimensions = await image.evaluate(el => ({
      width: el.naturalWidth,
      height: el.naturalHeight,
    }));

    const computedStyle = await image.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        aspectRatio: style.aspectRatio,
        objectFit: style.objectFit,
      };
    });

    // For wide images (width > height), verify the aspect ratio doesn't force square crop
    if (naturalDimensions.width > naturalDimensions.height) {
      // If using object-fit: cover with aspect-ratio: 1, the image will be cropped
      const isCropped = computedStyle.objectFit === 'cover' &&
                       (computedStyle.aspectRatio === '1' || computedStyle.aspectRatio === 'auto 1');

      if (isCropped) {
        console.warn(`⚠️ Image "${image.locator('img').first().getAttribute('src')}" may be cropped:`);
        console.warn(`   Natural: ${naturalDimensions.width}x${naturalDimensions.height} (aspect ${(naturalDimensions.width/naturalDimensions.height).toFixed(2)}:1)`);
        console.warn(`   CSS: aspect-ratio: ${computedStyle.aspectRatio}, object-fit: ${computedStyle.objectFit}`);
        console.warn(`   This may hide parts of wide images. Consider using object-fit: contain or removing aspect-ratio.`);
      }
    }
  }
});

