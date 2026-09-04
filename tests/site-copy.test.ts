import assert from 'node:assert/strict';
import test from 'node:test';

import { siteCopy } from '../lib/site-copy.ts';

void test('Turkish and English copy share a complete structure', () => {
  assert.deepEqual(Object.keys(siteCopy.tr), Object.keys(siteCopy.en));

  for (const locale of ['tr', 'en'] as const) {
    const copy = siteCopy[locale];
    assert.ok(copy.hero.title.length > 20);
    assert.ok(copy.hero.summary.length > 80);
    assert.equal(copy.expertise.length, 2);
    assert.match(copy.expertise[0].title.toLowerCase(), locale === 'tr' ? /strateji/ : /strategy/);
    assert.match(copy.expertise[1].title.toLowerCase(), /forensic|adli/);
  }
});

void test('SEO copy is descriptive and links are user-confirmed', () => {
  for (const locale of ['tr', 'en'] as const) {
    assert.ok(siteCopy[locale].seo.title.length >= 30);
    assert.ok(siteCopy[locale].seo.title.length <= 65);
    assert.ok(siteCopy[locale].seo.description.length >= 70);
    assert.ok(siteCopy[locale].seo.description.length <= 170);
  }

  assert.equal(siteCopy.shared.githubUrl, 'https://github.com/mkalkanli');
});
