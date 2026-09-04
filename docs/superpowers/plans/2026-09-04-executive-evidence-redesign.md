# Executive Evidence Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** mustafakalkanli.com'u Türkçe, yönetici odaklı, erişilebilir ve güçlü bir siber güvenlik danışmanlığı sayfası olarak yeniden tasarlamak.

**Architecture:** `content/tr.json` cümle veritabanı tek içerik kaynağı olacak; `scripts/build-site.mjs` bu sözlükten hem yerel `index.html` önizlemesini hem de yalnızca yayın dosyalarını içeren `dist/` klasörünü oluşturacak. Kaynak-regresyon testleri sözlük şemasını, terminolojiyi, erişilebilirliği ve `noindex` korumasını; tarayıcı testleri etkileşim ve responsive davranışı doğrulayacak.

**Tech Stack:** HTML5, CSS, küçük vanilla JavaScript, Node build script/test runner, Playwright, Cloudflare Pages, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-04-executive-evidence-redesign.md`

## Global Constraints

- İlk sürüm yalnızca Türkçe olacak; dil seçici gösterilmeyecek.
- Sayfada unvan kullanılmayacak; yalnızca Mustafa Kalkanlı adı kullanılacak.
- Ana uzmanlık Siber Güvenlik Yönetimi ve Stratejisi, ikincil uzmanlık Adli Bilişim olacak.
- Adli bilişim için yanlış veya uydurma terim kullanılmayacak.
- Kanıtlanmamış sertifika, müşteri, deneyim, başarı, bilirkişilik veya hukuki sonuç iddiası eklenmeyecek.
- `noindex, nofollow, noarchive` canlı yayında korunacak; sitemap yayımlanmayacak.
- `mk@mustafakalkanli.com` birincil danışmanlık iletişim kanalı olacak.
- WCAG AA, azaltılmış hareket ve 320–1440 piksel arası responsive davranış zorunlu.

---

### Task 1: Üretim yüzeyini ve güvenlik sınırlarını sabitle

**Files:**
- Modify: `package.json`
- Modify: `.openai/hosting.json`
- Modify: `.github/workflows/pages.yml`
- Modify: `tests/site-source.test.ts`
- Create: `tests/build-output.test.ts`
- Create: `scripts/build-site.mjs`

**Interfaces:**
- Produces: `npm run build:static` komutu ve yalnızca kamuya açık dosyaları içeren `dist/`.
- Consumes: mevcut kök `index.html`, `styles.css`, `script.js`, `robots.txt` ve `public/favicon.svg`.

- [ ] **Step 1: Yayın artefaktı için başarısız testi yaz**

```ts
void test('static build publishes only public site assets', async () => {
  const files = await readdir(new URL('../dist/', import.meta.url));
  assert.deepEqual(files.sort(), ['favicon.svg', 'index.html', 'robots.txt', 'script.js', 'styles.css']);
});
```

- [ ] **Step 2: Testi çalıştır ve `dist/` sözleşmesi olmadığı için başarısız olduğunu doğrula**

Run: `npm test -- tests/build-output.test.ts`
Expected: FAIL; `dist/` eksik veya beklenmeyen sunucu dosyaları içeriyor.

- [ ] **Step 3: Vite statik derleme sözleşmesini uygula**

```json
{
  "scripts": {
    "build:content": "node scripts/build-site.mjs --preview",
    "build:static": "node scripts/build-site.mjs --production",
    "dev:static": "vite --host 127.0.0.1 --port 4173"
  }
}
```

`scripts/build-site.mjs` bu ilk görevde mevcut kök `index.html` dosyasını kullanacak. `--preview` kök dosyayı koruyacak; `--production` temiz bir `dist/` içinde `index.html`, `styles.css`, `script.js`, `robots.txt` ve `favicon.svg` üretecek. `.openai/hosting.json` içindeki statik dizini `dist` yap. GitHub Pages artefakt adımını `path: ./dist` olarak değiştir.

- [ ] **Step 4: Derleme ve testleri doğrula**

Run: `npm run build:static && npm test`
Expected: PASS; `dist/` yalnızca izin verilen dosyaları içerir.

- [ ] **Step 5: Commit**

```bash
git add package.json .openai/hosting.json .github/workflows/pages.yml scripts/build-site.mjs tests/site-source.test.ts tests/build-output.test.ts
git commit -m "build: isolate public website output"
```

### Task 2: Türkçe içerik mimarisini oluştur

**Files:**
- Create: `content/tr.json`
- Create: `site/index.template.html`
- Modify: `scripts/build-site.mjs`
- Generate: `index.html`
- Modify: `tests/site-source.test.ts`

**Interfaces:**
- Produces: doğrulanmış `SiteContent` sözlüğü ile `#uzmanlik`, `#hizmetler`, `#yaklasim`, `#adli-bilisim`, `#iletisim` bölümleri.
- Consumes: Global Constraints içindeki onaylı terminoloji ve iddia sınırları.

- [ ] **Step 1: İçerik ve terminoloji testlerini yaz**

```ts
const content = JSON.parse(await read('content/tr.json'));
assert.equal(content.meta.locale, 'tr');
assert.equal(content.forensics.title, 'Adli Bilişim');
assert.equal(content.contact.email, 'mk@mustafakalkanli.com');
assert.match(index, /Siber Güvenlik Yönetimi ve Stratejisi/);
assert.match(index, /Adli Bilişim/);
assert.doesNotMatch(index, /Digital Forensics|data-i18n|language-button/);
assert.match(index, /href="mailto:mk@mustafakalkanli\.com"/);
assert.match(index, /name="robots" content="noindex, nofollow, noarchive"/);
```

- [ ] **Step 2: Testi çalıştır ve eski çift dilli işaretler nedeniyle başarısız olduğunu doğrula**

Run: `npm test -- tests/site-source.test.ts`
Expected: FAIL; eski dil düğmesi veya eski terimler hâlâ mevcut.

- [ ] **Step 3: Semantik Türkçe sayfa iskeletini yaz**

`content/tr.json` içinde `meta`, `navigation`, `hero`, `valueStrip`, `services`, `scenarios`, `approach`, `forensics`, `principles`, `contact` ve `footer` alanlarını oluştur. `site/index.template.html` sırası: skip link → header → hero → değer şeridi → dört ana çalışma alanı → karar senaryoları → çalışma yaklaşımı → ikincil Adli Bilişim paneli → ilkeler → iletişim → footer. Hero ana metni “Siber riski, yönetilebilir kararlara dönüştürün.” olacak; isim dışında unvan eklenmeyecek. `scripts/build-site.mjs` dosyasını sözlük değerlerini HTML-escape ederek şablondaki adlandırılmış alanlara yerleştirecek biçimde genişlet; `npm run build:content` ile HTML'i üret.

- [ ] **Step 4: İçerik testini doğrula**

Run: `npm test -- tests/site-source.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add content/tr.json site/index.template.html scripts/build-site.mjs index.html tests/site-source.test.ts
git commit -m "feat: add Turkish advisory content architecture"
```

### Task 3: Executive Evidence görsel sistemini uygula

**Files:**
- Modify: `styles.css`
- Modify: `site/index.template.html`
- Generate: `index.html`
- Modify: `script.js`
- Modify: `tests/site-source.test.ts`

**Interfaces:**
- Produces: `.decision-trace`, `.service-grid`, `.forensics-panel`, `.engagement-steps` bileşenleri.
- Consumes: Task 2 semantik bölüm kimlikleri.

- [ ] **Step 1: Görsel ve erişilebilir davranış testlerini yaz**

```ts
assert.match(css, /--paper:\s*#f1eee7/i);
assert.match(css, /--midnight:\s*#0b1e32/i);
assert.match(css, /--cobalt:\s*#2764ff/i);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /@media \(max-width: 560px\)/);
assert.match(index, /class="decision-trace"/);
assert.match(index, /href="#main-content"/);
```

- [ ] **Step 2: Testi çalıştır ve yeni tasarım tokenları olmadığı için başarısız olduğunu doğrula**

Run: `npm test -- tests/site-source.test.ts`
Expected: FAIL; Executive Evidence tokenları ve karar izi eksik.

- [ ] **Step 3: Tasarımı ve küçük etkileşimleri uygula**

CSS tokenları `--paper`, `--midnight`, `--ink`, `--cobalt`, `--copper` olacak. Masaüstü hero 7/5 grid; karar izi Varlık → Maruziyet → Kanıt → Karar; mobilde tek sütun. `script.js` yalnızca header scroll durumu, bölüm görünürlük işaretleri ve hareket tercihini destekleyecek; içerik JavaScript olmadan görünür kalacak.

- [ ] **Step 4: Test ve statik derlemeyi doğrula**

Run: `npm test && npm run build:static`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site/index.template.html index.html styles.css script.js tests/site-source.test.ts
git commit -m "feat: apply executive evidence visual system"
```

### Task 4: Tarayıcı kalite kapılarını ekle

**Files:**
- Modify: `package.json`
- Create: `playwright.config.ts`
- Create: `tests/e2e/site.spec.ts`

**Interfaces:**
- Produces: `npm run test:e2e`.
- Consumes: `npm run dev:static` ile sunulan üretim yüzeyi.

- [ ] **Step 1: E2E testini yaz**

```ts
test('Turkish advisory page is usable and non-indexable', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Mustafa Kalkanlı/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow, noarchive');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Siber riski');
  await expect(page.getByRole('heading', { name: 'Adli Bilişim' })).toBeVisible();
  await expect(page.getByRole('link', { name: /danışmanlık/i })).toHaveAttribute('href', 'mailto:mk@mustafakalkanli.com');
});
```

- [ ] **Step 2: Testi çalıştır ve E2E altyapısı eksik olduğu için başarısız olduğunu doğrula**

Run: `npm run test:e2e`
Expected: FAIL; script veya Playwright yapılandırması eksik.

- [ ] **Step 3: Playwright yapılandırmasını ekle**

Run: `npm install --save-dev @playwright/test`

`webServer.command` değerini `npm run build:content && npm run dev:static`, `baseURL` değerini `http://127.0.0.1:4173` yap. Testi 320, 375, 768, 1024 ve 1440 genişliklerinde yatay taşma kontrolüyle çoğalt; klavye odağı ve azaltılmış hareket senaryosunu ekle.

- [ ] **Step 4: Kalite kapılarını çalıştır**

Run: `npm test && npm run lint && npm run build:static && npm run test:e2e`
Expected: tüm komutlar PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json playwright.config.ts tests/e2e/site.spec.ts
git commit -m "test: add browser quality gates"
```

### Task 5: İncele, yayınla ve canlı ortamı doğrula

**Files:**
- Modify if required: `content/tr.json`, `site/index.template.html`, `styles.css`, `script.js`
- Generate: `index.html`
- Verify: `dist/index.html`, `dist/robots.txt`

**Interfaces:**
- Produces: GitHub `main` ve Cloudflare Pages üzerinde doğrulanmış Türkçe site.
- Consumes: Task 1–4 çıktıları.

- [ ] **Step 1: Kod ve güvenlik incelemesi yap**

Kontrol et: kanıtsız iddia yok, yanlış adli bilişim terimi yok, gizli bilgi yok, dış bağlantılar `noopener noreferrer`, `noindex` korunuyor ve yayın artefaktı yalnızca `dist/`.

- [ ] **Step 2: Tam doğrulama paketini çalıştır**

Run: `npm test && npm run lint && npm run build:static && npm run test:e2e && git diff --check`
Expected: tümü PASS; çalışma ağacında yalnızca planlı değişiklikler.

- [ ] **Step 3: GitHub'a gönder ve Cloudflare otomatik dağıtımını izle**

```bash
git push -u origin main
```

- [ ] **Step 4: Canlı sözleşmeyi doğrula**

Run: `curl -sSIL https://mustafakalkanli.com/` ve `curl -sS https://mustafakalkanli.com/`
Expected: HTTP 200; içerikte `Adli Bilişim` ve `noindex, nofollow, noarchive`; yanlış terim veya dil düğmesi yok.

- [ ] **Step 5: Görsel QA ve teslim**

Chrome, Safari ve Firefox'ta masaüstü/mobil görünümü, odak sırası, iletişim bağlantısı, azaltılmış hareket ve 200% zoom doğrula. Cloudflare production commit'i ile GitHub `main` commit'inin eşleştiğini kaydet.
