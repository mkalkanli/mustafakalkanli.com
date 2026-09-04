import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  contentTypeForPath,
  resolveAssetPath,
} from '../scripts/preview-static.mjs';

void test('static preview resolves root requests and blocks path traversal', async () => {
  const fixtureRoot = await mkdtemp(join(tmpdir(), 'preview-static-'));
  const distDir = join(fixtureRoot, 'dist');

  await mkdir(distDir, { recursive: true });
  await writeFile(join(distDir, 'index.html'), '<h1>preview</h1>', 'utf8');
  await writeFile(join(distDir, 'robots.txt'), 'User-agent: *', 'utf8');

  try {
    const indexPath = await resolveAssetPath(distDir, '/');
    const robotsPath = await resolveAssetPath(distDir, '/robots.txt');

    assert.equal(await readFile(indexPath, 'utf8'), '<h1>preview</h1>');
    assert.equal(await readFile(robotsPath, 'utf8'), 'User-agent: *');
    await assert.rejects(
      resolveAssetPath(distDir, '/../package.json'),
      /outside the dist directory/,
    );
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

void test('static preview emits content types for the released asset allowlist', () => {
  assert.equal(contentTypeForPath('index.html'), 'text/html; charset=utf-8');
  assert.equal(contentTypeForPath('styles.css'), 'text/css; charset=utf-8');
  assert.equal(contentTypeForPath('script.js'), 'text/javascript; charset=utf-8');
  assert.equal(contentTypeForPath('robots.txt'), 'text/plain; charset=utf-8');
  assert.equal(contentTypeForPath('favicon.svg'), 'image/svg+xml');
});
