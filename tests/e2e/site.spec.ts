import { expect, test, type Page } from '@playwright/test';

const EFFECTIVELY_DISABLED_MOTION_MS = 0.05;

const focusByTabbing = async (
  page: Page,
  name: RegExp | string,
  advanceKey: 'Tab' | 'Alt+Tab' = 'Tab',
) => {
  const target = page.getByRole('link', { name });

  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press(advanceKey);
    if (await target.evaluate((element) => element === document.activeElement)) {
      return target;
    }
  }

  throw new Error(`Could not focus link: ${String(name)}`);
};

const getHorizontalOverflow = async (page: Page) =>
  page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const offenders = Array.from(document.querySelectorAll('body *'))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          element: element.tagName.toLowerCase(),
          className: element.className,
          left: rect.left,
          right: rect.right,
        };
      })
      .filter(
        ({ left, right }) => left < -1 || right > viewportWidth + 1,
      );

    return {
      viewportWidth,
      scrollWidth: document.scrollingElement?.scrollWidth ?? 0,
      offenders,
    };
  });

const parseDurationMs = (value: string) =>
  value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      if (entry.endsWith('ms')) return Number.parseFloat(entry);
      if (entry.endsWith('s')) return Number.parseFloat(entry) * 1000;
      return Number.parseFloat(entry);
    });

const waitForStablePage = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForFunction(() => document.readyState === 'complete');
};

test('renders a Turkish-only one-screen personal entrypoint with non-indexable contact paths', async ({
  page,
}) => {
  await page.goto('/');
  await waitForStablePage(page);

  await expect(page).toHaveTitle(/Mustafa Kalkanlı/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow, noarchive',
  );
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mustafa Kalkanlı');
  await expect(page.getByText('Siber Güvenlik', { exact: true })).toBeVisible();
  await expect(page.getByText('Bilgi Güvenliği', { exact: true })).toBeVisible();
  await expect(page.getByText('Siber Güvenlik Yönetimi ve Stratejisi', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Adli Bilişim', { exact: true })).toBeVisible();
  await expect(page.locator('main > section')).toHaveCount(1);
  await expect(page.locator('nav, #yaklasim, #uzmanlik, #ilkeler, #iletisim, .decision-trace, .value-strip, .service-grid, .scenario-grid, .engagement-steps')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /e-posta gönder/i })).toHaveAttribute(
    'href',
    'mailto:mk@mustafakalkanli.com',
  );
  await expect(page.getByRole('link', { name: 'E-posta gönder' })).toHaveAttribute(
    'href',
    'mailto:mk@mustafakalkanli.com',
  );
  await expect(page.locator('body')).not.toContainText('Digital Forensics');
  await expect(page.locator('body')).not.toContainText('English');
});

test('supports keyboard navigation with visible focus states and skip navigation', async ({
  page,
  browserName,
}) => {
  await page.goto('/');
  await waitForStablePage(page);

  const advanceKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  const skipLink = await focusByTabbing(page, 'Ana içeriğe geç', advanceKey);
  await expect(skipLink).toBeFocused();

  const skipLinkStyles = await skipLink.evaluate((element) => {
    const styles = window.getComputedStyle(element);
    return {
      outlineStyle: styles.outlineStyle,
      outlineWidth: styles.outlineWidth,
      transform: styles.transform,
    };
  });

  expect(skipLinkStyles.outlineStyle).not.toBe('none');
  expect(skipLinkStyles.outlineWidth).not.toBe('0px');
  expect(skipLinkStyles.transform).not.toContain('-130%');

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);

  const primaryCta = await focusByTabbing(
    page,
    /e-posta gönder/i,
    advanceKey,
  );
  await expect(primaryCta).toBeFocused();

  const primaryCtaStyles = await primaryCta.evaluate((element) => {
    const styles = window.getComputedStyle(element);
    return {
      outlineStyle: styles.outlineStyle,
      outlineWidth: styles.outlineWidth,
    };
  });

  expect(primaryCtaStyles.outlineStyle).not.toBe('none');
  expect(primaryCtaStyles.outlineWidth).not.toBe('0px');
});

test('respects reduced-motion preferences without leaving reveal content hidden', async ({
  page,
}, testInfo) => {
  test.skip(
    !testInfo.project.name.includes('reduced-motion'),
    'Reduced-motion assertions run only in the reduced-motion project.',
  );

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await waitForStablePage(page);

  const htmlState = await page.locator('html').evaluate(() => {
    return {
      reduceMotionMatches: window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches,
    };
  });

  expect(htmlState.reduceMotionMatches).toBe(true);

  const revealStates = await page.locator('[data-reveal]').evaluateAll((elements) =>
    elements.map((element) => ({
      visible: element.classList.contains('is-visible'),
      opacity: window.getComputedStyle(element).opacity,
      transform: window.getComputedStyle(element).transform,
      transitionDuration: window.getComputedStyle(element).transitionDuration,
      animationDuration: window.getComputedStyle(element).animationDuration,
    })),
  );

  expect(revealStates.length).toBeGreaterThan(0);
  expect(revealStates.every((item) => item.visible)).toBe(true);
  expect(revealStates.every((item) => item.opacity === '1')).toBe(true);
  expect(
    revealStates.every(
      (item) =>
        item.transform === 'none' ||
        item.transform === 'matrix(1, 0, 0, 1, 0, 0)',
    ),
  ).toBe(true);
  expect(
    revealStates.every((item) =>
      parseDurationMs(item.transitionDuration).every(
        (duration) => duration <= EFFECTIVELY_DISABLED_MOTION_MS,
      ),
    ),
  ).toBe(true);
  expect(
    revealStates.every((item) =>
      parseDurationMs(item.animationDuration).every(
        (duration) => duration <= EFFECTIVELY_DISABLED_MOTION_MS,
      ),
    ),
  ).toBe(true);
});

test('does not introduce horizontal overflow', async ({ page }) => {
  await page.goto('/');
  await waitForStablePage(page);

  const overflow = await getHorizontalOverflow(page);

  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.viewportWidth + 1);
  expect(overflow.offenders).toEqual([]);
});
