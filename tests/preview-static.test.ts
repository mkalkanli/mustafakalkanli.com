import assert from 'node:assert/strict';
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  contentTypeForPath,
  createStaticPreviewServer,
  resolveAssetPath,
} from '../scripts/preview-static.mjs';

const listen = async (distDir: string) => {
  const server = createStaticPreviewServer({ distDir });

  await new Promise<void>((resolvePromise, rejectPromise) => {
    server.once('error', rejectPromise);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', rejectPromise);
      resolvePromise();
    });
  });

  const address = server.address();
  assert(address && typeof address === 'object');

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((resolvePromise, rejectPromise) => {
        server.close((error) =>
          error ? rejectPromise(error) : resolvePromise(),
        );
      }),
  };
};

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
  assert.equal(
    contentTypeForPath('script.js'),
    'text/javascript; charset=utf-8',
  );
  assert.equal(contentTypeForPath('robots.txt'), 'text/plain; charset=utf-8');
  assert.equal(contentTypeForPath('favicon.svg'), 'image/svg+xml');
});

void test('static preview serves GET and HEAD while rejecting unsupported methods', async () => {
  const fixtureRoot = await mkdtemp(join(tmpdir(), 'preview-static-http-'));
  const distDir = join(fixtureRoot, 'dist');

  await mkdir(distDir, { recursive: true });
  await writeFile(join(distDir, 'index.html'), '<h1>preview</h1>', 'utf8');
  const preview = await listen(distDir);

  try {
    const getResponse = await fetch(`${preview.baseUrl}/`);
    assert.equal(getResponse.status, 200);
    assert.equal(await getResponse.text(), '<h1>preview</h1>');

    const headResponse = await fetch(`${preview.baseUrl}/`, { method: 'HEAD' });
    assert.equal(headResponse.status, 200);
    assert.equal(await headResponse.text(), '');

    const postResponse = await fetch(`${preview.baseUrl}/`, { method: 'POST' });
    assert.equal(postResponse.status, 405);
    assert.equal(postResponse.headers.get('allow'), 'GET, HEAD');
    assert.equal(await postResponse.text(), 'Method Not Allowed');
  } finally {
    await preview.close();
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

void test('static preview forbids HTTP access through a symlink outside dist', async () => {
  const fixtureRoot = await mkdtemp(join(tmpdir(), 'preview-static-symlink-'));
  const distDir = join(fixtureRoot, 'dist');
  const secretPath = join(fixtureRoot, 'secret.txt');

  await mkdir(distDir, { recursive: true });
  await writeFile(join(distDir, 'index.html'), '<h1>preview</h1>', 'utf8');
  await writeFile(secretPath, 'private fixture', 'utf8');
  await symlink(secretPath, join(distDir, 'public.txt'));
  const preview = await listen(distDir);

  try {
    const response = await fetch(`${preview.baseUrl}/public.txt`);
    assert.equal(response.status, 403);
    assert.equal(await response.text(), 'Forbidden');
  } finally {
    await preview.close();
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});
