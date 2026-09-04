import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv[2];

if (mode === '--preview') {
  // The preview build currently consumes the checked-in root entrypoint.
  process.exit(0);
}

if (mode !== '--production') {
  throw new Error('Usage: node scripts/build-site.mjs --preview|--production');
}

const dist = resolve(root, 'dist');
const assets = [
  ['index.html', 'index.html'],
  ['styles.css', 'styles.css'],
  ['script.js', 'script.js'],
  ['robots.txt', 'robots.txt'],
  ['public/favicon.svg', 'favicon.svg'],
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await Promise.all(
  assets.map(([source, target]) => cp(resolve(root, source), resolve(dist, target))),
);
