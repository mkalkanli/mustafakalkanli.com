import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import test from 'node:test';

void test('static build publishes only public site assets', async () => {
  const files = await readdir(new URL('../dist/', import.meta.url));
  assert.deepEqual(files.sort(), ['favicon.svg', 'index.html', 'robots.txt', 'script.js', 'styles.css']);
});
