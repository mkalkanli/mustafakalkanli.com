import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv[2];

const requiredSections = [
  'meta',
  'profile',
  'contact',
];

export const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const escapeJsonForScript = (value) =>
  JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');

const valueAt = (content, path) => {
  const value = path.split('.').reduce((current, key) => current?.[key], content);

  if (value === undefined || value === null || typeof value === 'object') {
    throw new Error(`Template value is missing or not scalar: ${path}`);
  }

  return value;
};

const validateContent = (content) => {
  if (!content || typeof content !== 'object') {
    throw new Error('Turkish site content must be a JSON object.');
  }

  for (const section of requiredSections) {
    if (!content[section] || typeof content[section] !== 'object') {
      throw new Error(`Turkish site content is missing the ${section} section.`);
    }
  }

  if (content.meta.locale !== 'tr' || content.meta.documentLanguage !== 'tr') {
    throw new Error('The first release must use Turkish content and document language.');
  }

  if (content.contact.email !== 'mk@mustafakalkanli.com') {
    throw new Error('The contact email must be mk@mustafakalkanli.com.');
  }

  if (content.profile.name !== 'Mustafa Kalkanlı') {
    throw new Error('The profile name must be Mustafa Kalkanlı.');
  }

  if (!Array.isArray(content.profile.areas) || content.profile.areas.length !== 3) {
    throw new Error('The temporary profile must define three areas.');
  }
};

const buildContent = async () => {
  const [dictionary, template] = await Promise.all([
    readFile(resolve(root, 'content/tr.json'), 'utf8'),
    readFile(resolve(root, 'site/index.template.html'), 'utf8'),
  ]);
  const content = JSON.parse(dictionary);
  validateContent(content);

  const html = template.replace(/{{([\w.]+)}}/g, (_match, path) => {
    if (path === 'meta.schemaJson') {
      return escapeJsonForScript(content.meta.schema);
    }

    return escapeHtml(valueAt(content, path));
  });

  if (/{{[\w.]+}}/.test(html)) {
    throw new Error('The site template contains an unresolved content value.');
  }

  await writeFile(resolve(root, 'index.html'), html, 'utf8');
};

const run = async () => {
  if (mode !== '--preview' && mode !== '--production') {
    throw new Error('Usage: node scripts/build-site.mjs --preview|--production');
  }

  await buildContent();

  if (mode === '--preview') {
    return;
  }

  const dist = resolve(root, 'dist');
  const assets = [
    ['index.html', 'index.html'],
    ['styles.css', 'styles.css'],
    ['script.js', 'script.js'],
    ['robots.txt', 'robots.txt'],
    ['public/favicon.svg', 'favicon.svg'],
    ['public/cybersecurity-shield-v3.png', 'cybersecurity-shield-v3.png'],
  ];

  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  await Promise.all(
    assets.map(([source, target]) => cp(resolve(root, source), resolve(dist, target))),
  );
};

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await run();
}
