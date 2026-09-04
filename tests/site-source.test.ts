import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { escapeHtml } from '../scripts/build-site.mjs';

const read = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), 'utf8');

void test('content values are escaped before template interpolation', () => {
  assert.equal(
    escapeHtml('<img src="x" onerror="alert(1)"> & \'metin\''),
    '&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt; &amp; &#39;metin&#39;',
  );
});

void test('generated site contains canonical metadata and verified Person data', async () => {
  const [dictionary, index] = await Promise.all([
    read('content/tr.json'),
    read('index.html'),
  ]);
  const content = JSON.parse(dictionary);

  assert.equal(content.meta.canonicalUrl, 'https://mustafakalkanli.com/');
  assert.equal(content.meta.schema['@type'], 'Person');
  assert.equal(content.meta.schema.name, 'Mustafa Kalkanlı');
  assert.match(
    index,
    /<link rel="canonical" href="https:\/\/mustafakalkanli\.com\/"/,
  );
  assert.match(index, /<script type="application\/ld\+json">/);
  assert.match(index, /<meta property="og:title"/);
});

void test('crawler files block all indexing while the site is being prepared', async () => {
  const [dictionary, index, robots] = await Promise.all([
    read('content/tr.json'),
    read('index.html'),
    read('robots.txt'),
  ]);
  const content = JSON.parse(dictionary);

  assert.equal(content.meta.robots, 'noindex, nofollow, noarchive');
  assert.match(index, /name="robots" content="noindex, nofollow, noarchive"/);
  assert.match(robots, /Allow: \/$/m);
  assert.doesNotMatch(robots, /Disallow: \/$/m);
  assert.doesNotMatch(robots, /Sitemap:/);
});

void test('default project commands use the canonical static dictionary site', async () => {
  const packageJson = JSON.parse(await read('package.json'));

  assert.equal(
    packageJson.scripts.dev,
    'npm run build:content && npm run dev:static',
  );
  assert.equal(packageJson.scripts.build, 'npm run build:static');
  assert.equal(
    packageJson.scripts['build:content'],
    'node scripts/build-site.mjs --preview',
  );
  assert.equal(
    packageJson.scripts['build:static'],
    'node scripts/build-site.mjs --production',
  );
  assert.equal(
    packageJson.scripts['dev:static'],
    'vite --host 127.0.0.1 --port 4173',
  );
  assert.equal(
    packageJson.scripts.start,
    'npm run build:static && node scripts/preview-static.mjs',
  );
});

void test('Turkish dictionary builds a temporary one-screen personal entrypoint', async () => {
  const [dictionary, index, css, cname, robots] = await Promise.all([
    read('content/tr.json'),
    read('index.html'),
    read('styles.css'),
    read('CNAME'),
    read('robots.txt'),
  ]);

  const content = JSON.parse(dictionary);

  assert.match(index, /<html lang="tr"/);
  assert.match(index, /https:\/\/mustafakalkanli\.com\//);
  assert.equal(content.meta.locale, 'tr');
  assert.equal(content.profile.name, 'Mustafa Kalkanlı');
  assert.deepEqual(content.profile.areas, [
    'Siber Güvenlik',
    'Bilgi Güvenliği',
    'Siber Güvenlik Yönetimi ve Stratejisi',
    'Adli Bilişim',
  ]);
  assert.equal(content.contact.email, 'mk@mustafakalkanli.com');
  assert.doesNotMatch(index, /Digital Forensics|data-i18n|language-button/);
  assert.match(index, /<script src="script\.js" defer><\/script>/);
  assert.match(index, /<h1 id="hero-title">Mustafa Kalkanlı<\/h1>/);
  assert.match(index, /Siber Güvenlik[\s\S]*Bilgi Güvenliği[\s\S]*Siber Güvenlik Yönetimi ve Stratejisi[\s\S]*Adli Bilişim/);
  assert.doesNotMatch(index, /<nav|id="yaklasim"|id="uzmanlik"|id="ilkeler"|id="iletisim"|decision-trace|value-strip|service-grid|scenario-grid|engagement-steps/);
  assert.match(index, /href="mailto:mk@mustafakalkanli\.com"/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.equal(cname.trim(), 'mustafakalkanli.com');
  assert.match(index, /name="robots" content="noindex, nofollow, noarchive"/);
  assert.match(robots, /Allow: \/$/m);
  assert.doesNotMatch(robots, /Disallow: \/$/m);
  assert.doesNotMatch(robots, /Sitemap:/);
});

void test('temporary profile keeps the restrained responsive visual system', async () => {
  const [dictionary, index, css, script] = await Promise.all([
    read('content/tr.json'),
    read('index.html'),
    read('styles.css'),
    read('script.js'),
  ]);

  const content = JSON.parse(dictionary);

  assert.match(css, /--paper:\s*#f1eee7/i);
  assert.match(css, /--ink:\s*#101820/i);
  assert.match(css, /--cobalt:\s*#2764ff/i);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.doesNotMatch(css, /letter-spacing:\s*-/);
  assert.match(css, /\.profile-card/);
  assert.match(index, /href="#main-content"/);
  assert.match(index, /<script src="script\.js" defer><\/script>/);
  assert.equal(content.profile.areas.length, 4);
  assert.match(script, /is-scrolled/);
  assert.match(script, /is-visible/);
  assert.match(script, /prefers-reduced-motion/);
});
