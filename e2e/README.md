# HelpSeeker E2E Tests

Playwright-based end-to-end tests for the HelpSeeker PWA.

## Setup

Tests are configured to automatically start the dev server on `http://localhost:8080` using the bundled Python HTTP server.

## Asset Validation

The test suite includes asset validation to catch missing image files (which previously showed as 404 errors):

```bash
npm test -- e2e/assets-validation.spec.js
```

This validates that:
1. All image files referenced in `scenarios.json` actually exist
2. No 404 HTTP responses occur when loading scenarios

If you see missing images, you can fix `scenarios.json` automatically:
```bash
npm run validate:scenarios:fix
```

Or validate without fixing:
```bash
npm run validate:scenarios
```

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests with browser visible
npm run test:headed

# Run tests in debug mode (step through)
npm run test:debug

# Run tests in interactive UI mode
npm run test:ui

# Run a specific test file
npx playwright test e2e/home.spec.js

# Run a specific test
npx playwright test -g "home page loads"
```

## Test Data Requirements

Tests expect:
- `data-testid` attributes on key elements (scenario cards, buttons, etc.)
- Categories: Physical, Academic, Social, Emotional
- At least one scenario per category

Update HTML/Vue components to add test IDs:
```html
<div data-testid="scenario-card">...</div>
<button data-testid="back-button">Back</button>
<span data-testid="scenario-title">Title</span>
```

## Viewing Results

After running tests:
```bash
npx playwright show-report
```

This opens an HTML report with test results and traces.

## Adding New Tests

Create `.spec.js` files in the `e2e/` directory. Playwright auto-discovers them.

```js
import { test, expect } from '@playwright/test';

test('describe what it does', async ({ page }) => {
  await page.goto('/');
  // Interact with page
  // Assert expected behavior
});
```

See [Playwright docs](https://playwright.dev/docs/intro) for more.

## Image Display Tests

The `image-dimensions.spec.js` test suite checks for image display issues:

```bash
npm test -- e2e/image-dimensions.spec.js
```

### Known Issue: Wide Image Cropping

**Current CSS:**
```css
.storyboard-panel {
  width: 100%;
  aspect-ratio: 1;      /* Forces square */
  object-fit: cover;    /* Crops to fill square */
}
```

**Effect:** Wide images (aspect ratio > 1) are cropped to square, showing only the middle portion. For example, a 1200×600px image displays as 208×208px with left/right sides hidden.

**Solution Options:**
1. **For complete image display:** Change to `object-fit: contain` to show entire image
2. **For responsive layout:** Use `aspect-ratio: auto` to preserve original proportions
3. **For storyboards:** Keep `aspect-ratio: 1` but ensure images match that ratio

This affects scenarios like `de-acad-002` with wide illustration images.
