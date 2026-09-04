# Personal Cybersecurity Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a bilingual personal reputation site for Mustafa Kalkanlı.

**Architecture:** A Vinext single-page app renders Turkish content by default and switches to English on the client. Copy is isolated in a typed module; the page and metadata consume verified claims only.

**Tech Stack:** Vinext, React 19, TypeScript, Tailwind CSS, Node test runner, OpenAI Sites

**Spec:** `docs/superpowers/specs/2026-09-04-personal-cybersecurity-site-design.md`

## Global Constraints

- Turkish is the default language.
- Only user-confirmed profile facts and links may be published.
- The initial page must remain useful and indexable without JavaScript interaction.
- Do not use generic hacker imagery or fabricated proof points.

---

### Task 1: Content contract and bilingual copy

**Files:**
- Create: `lib/site-copy.ts`
- Test: `tests/site-copy.test.ts`

**Interfaces:**
- Produces: `siteCopy`, a complete `tr` and `en` content record.

- [ ] Write tests for complete locale keys, SEO lengths, and confirmed external links.
- [ ] Run tests and confirm failure because `lib/site-copy.ts` does not exist.
- [ ] Implement the minimal typed bilingual content.
- [ ] Run tests and confirm they pass.

### Task 2: Responsive page and language control

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/site-source.test.ts`

**Interfaces:**
- Consumes: `siteCopy` from Task 1.
- Produces: accessible bilingual page sections and language controls.

- [ ] Write source-level smoke tests for the page structure and language control.
- [ ] Run tests and confirm the starter fails them.
- [ ] Implement the smallest complete page and responsive styling.
- [ ] Run tests and confirm they pass.

### Task 3: Metadata and crawler files

**Files:**
- Modify: `app/layout.tsx`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Test: `tests/site-source.test.ts`

**Interfaces:**
- Produces: canonical metadata and crawlable public files for `https://mustafakalkanli.com/`.

- [ ] Add failing assertions for metadata, robots, sitemap, and Person JSON-LD.
- [ ] Implement metadata and crawler files.
- [ ] Run all tests, lint, and production build.

### Task 4: Publish

**Files:**
- Modify: `.openai/hosting.json`

**Interfaces:**
- Produces: pushed Git source and a production deployment.

- [ ] Initialize Git, commit validated source, and push to `mkalkanli/mustafakalkanli.com`.
- [ ] Package the validated build and save a Sites version.
- [ ] Deploy the saved version and verify the live URL returns successfully.
