import assert from 'node:assert/strict';
import { execFile as execFileCallback } from 'node:child_process';
import { readdir, rm } from 'node:fs/promises';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const execFile = promisify(execFileCallback);

void test('static build publishes only public site assets', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
  await execFile(process.execPath, ['scripts/build-site.mjs', '--production'], { cwd: root });
  const files = await readdir(new URL('../dist/', import.meta.url));
  assert.deepEqual(files.sort(), ['cybersecurity-core-v1.png', 'favicon.svg', 'index.html', 'robots.txt', 'script.js', 'styles.css']);
});
