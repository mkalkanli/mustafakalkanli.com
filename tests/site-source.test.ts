import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { escapeHtml } from '../scripts/build-site.mjs';

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

void test('content values are escaped before template interpolation', () => {
  assert.equal(escapeHtml('<img src="x" onerror="alert(1)"> & \'metin\''), '&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt; &amp; &#39;metin&#39;');
});

void test('layout contains canonical metadata and verified Person data', async () => {
  const layout = await read('app/layout.tsx');
  assert.match(layout, /https:\/\/mustafakalkanli\.com/);
  assert.match(layout, /application\/ld\+json/);
  assert.match(layout, /Mustafa Kalkanlı/);
  assert.match(layout, /openGraph/);
});

void test('crawler files block all indexing while the site is being prepared', async () => {
  const [layout, robots] = await Promise.all([read('app/layout.tsx'), read('public/robots.txt')]);
  assert.match(layout, /index:\s*false/);
  assert.match(layout, /follow:\s*false/);
  assert.match(robots, /Allow: \/$/m);
  assert.doesNotMatch(robots, /Disallow: \/$/m);
  assert.doesNotMatch(robots, /Sitemap:/);
});

void test('Turkish dictionary builds a non-indexable advisory entrypoint', async () => {
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
  assert.equal(content.forensics.title, 'Adli Bilişim');
  assert.equal(content.contact.email, 'mk@mustafakalkanli.com');
  assert.match(index, /Siber Güvenlik Yönetimi ve Stratejisi/);
  assert.match(index, /Adli Bilişim/);
  assert.doesNotMatch(index, /Digital Forensics|data-i18n|language-button/);
  assert.match(index, /href="mailto:mk@mustafakalkanli\.com"/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.equal(cname.trim(), 'mustafakalkanli.com');
  assert.match(index, /name="robots" content="noindex, nofollow, noarchive"/);
  assert.match(robots, /Allow: \/$/m);
  assert.doesNotMatch(robots, /Disallow: \/$/m);
  assert.doesNotMatch(robots, /Sitemap:/);
});
