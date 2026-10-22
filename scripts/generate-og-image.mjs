// Generate the OG image (1200x630) from scripts/og-template.html + scripts/og-art.jpg.
// The OG image is designed artwork, NOT a screenshot of the app UI.
//
// Usage:
//   npm i -D playwright   (or: NODE_PATH=$(npm root -g) node scripts/generate-og-image.mjs)
//   node scripts/generate-og-image.mjs
// Output: frontend/og-image.jpg (and og-image.png)
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

let chromium;
try {
    ({ chromium } = await import('playwright'));
} catch {
    // Fall back to a globally installed playwright (npm i -g playwright).
    const globalRoot = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
    ({ chromium } = await import(path.join(globalRoot, 'playwright/index.mjs')));
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, '../frontend');
const template = path.join(__dirname, 'og-template.html');

if (!fs.existsSync(path.join(__dirname, 'og-art.jpg'))) {
    throw new Error('scripts/og-art.jpg is missing (OG background artwork).');
}

const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch(
    fs.existsSync(systemChrome) ? { executablePath: systemChrome } : {},
);
try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.goto(`file://${template}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const png = path.join(frontendDir, 'og-image.png');
    await page.screenshot({ path: png, clip: { x: 0, y: 0, width: 1200, height: 630 } });

    execFileSync('magick', [png, '-quality', '90', path.join(frontendDir, 'og-image.jpg')]);
    console.log(`OG image saved to ${png} and og-image.jpg`);
} finally {
    await browser.close();
}
