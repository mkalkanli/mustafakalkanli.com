import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

void test('page exposes bilingual navigation and core expertise', async () => {
  const page = await read('app/page.tsx');
  assert.match(page, /'use client'/);
  assert.match(page, /siteCopy/);
  assert.match(page, /setLocale/);
  assert.match(page, /id="expertise"/);
  assert.match(page, /id="approach"/);
  assert.match(page, /aria-label/);
});

void test('layout contains canonical metadata and verified Person data', async () => {
  const layout = await read('app/layout.tsx');
  assert.match(layout, /https:\/\/mustafakalkanli\.com/);
  assert.match(layout, /application\/ld\+json/);
  assert.match(layout, /Mustafa Kalkanlı/);
  assert.match(layout, /openGraph/);
});

void test('crawler files make the canonical homepage indexable', async () => {
  const [robots, sitemap] = await Promise.all([
    read('public/robots.txt'),
    read('public/sitemap.xml'),
  ]);
  assert.match(robots, /Allow: \/$/m);
  assert.doesNotMatch(robots, /Disallow: \/$/m);
  assert.match(sitemap, /https:\/\/mustafakalkanli\.com\//);
});

void test('GitHub Pages static entrypoint is deployable and indexable', async () => {
  const [index, css, script, cname, robots, sitemap] = await Promise.all([
    read('index.html'),
    read('styles.css'),
    read('script.js'),
    read('CNAME'),
    read('robots.txt'),
    read('sitemap.xml'),
  ]);

  assert.match(index, /<html lang="tr"/);
  assert.match(index, /https:\/\/mustafakalkanli\.com\//);
  assert.match(index, /data-lang-target="en"/);
  assert.match(index, /Siber G[uü]venlik Y[oö]netimi ve Stratejisi/);
  assert.match(index, /Digital Forensics/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(script, /localStorage/);
  assert.equal(cname.trim(), 'mustafakalkanli.com');
  assert.match(robots, /Sitemap: https:\/\/mustafakalkanli\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/mustafakalkanli\.com\/<\/loc>/);
});
