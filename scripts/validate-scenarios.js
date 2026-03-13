#!/usr/bin/env node
/**
 * Validate scenarios.json data integrity
 * - Check all referenced images exist
 * - Report missing files
 * - Optionally remove missing image references
 */

const fs = require('fs');
const path = require('path');

const scenariosPath = path.join(process.cwd(), 'data', 'scenarios.json');
const data = JSON.parse(fs.readFileSync(scenariosPath, 'utf-8'));

const missingImages = new Map(); // imagePath -> count
const issues = {
  missingImages: 0,
  duplicateIds: new Set(),
};

// Check for duplicates
const ids = new Set();
for (const scenario of data.scenarios) {
  if (ids.has(scenario.id)) {
    issues.duplicateIds.add(scenario.id);
  }
  ids.add(scenario.id);
}

// Check all image references
for (const scenario of data.scenarios) {
  if (scenario.image && !fs.existsSync(path.join(process.cwd(), scenario.image))) {
    missingImages.set(scenario.image, (missingImages.get(scenario.image) ?? 0) + 1);
    issues.missingImages++;
  }

  if (scenario.images && Array.isArray(scenario.images)) {
    scenario.images = scenario.images.filter(img => {
      const exists = fs.existsSync(path.join(process.cwd(), img));
      if (!exists) {
        missingImages.set(img, (missingImages.get(img) ?? 0) + 1);
        issues.missingImages++;
      }
      return exists;
    });
  }
}

// Report
console.log('\n📋 Scenarios Validation Report\n');
console.log(`Total scenarios: ${data.scenarios.length}`);
console.log(`Total images referenced: ${Array.from(missingImages.keys()).length + (data.scenarios.filter(s => s.image && fs.existsSync(path.join(process.cwd(), s.image))).length)}`);

if (issues.duplicateIds.size > 0) {
  console.log(`\n⚠️  Duplicate IDs found (${issues.duplicateIds.size}):`);
  issues.duplicateIds.forEach(id => console.log(`   - ${id}`));
}

if (issues.missingImages > 0) {
  console.log(`\n❌ Missing images: ${issues.missingImages} references to non-existent files`);
  console.log(`   Unique files: ${missingImages.size}\n`);

  // Show top missing images
  const sorted = Array.from(missingImages.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  sorted.forEach(([img, count]) => {
    console.log(`   ${count === 1 ? '  ' : count > 1 ? '✕' : '!'} ${img}`);
  });

  if (missingImages.size > 15) {
    console.log(`   ... and ${missingImages.size - 15} more`);
  }
} else {
  console.log(`\n✅ All images exist!`);
}

// Fix option
if (process.argv.includes('--fix') && issues.missingImages > 0) {
  fs.writeFileSync(scenariosPath, JSON.stringify(data, null, 2) + '\n');
  console.log(`\n✨ Fixed scenarios.json - removed ${issues.missingImages} missing image references`);
}

console.log();
process.exit(issues.missingImages > 0 ? 1 : 0);
