'use client';

import { ArrowDownRight, ArrowUpRight, Languages, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type Locale, siteCopy } from '@/lib/site-copy';

export default function Home() {
  const [locale, setLocale] = useState<Locale>('tr');
  const copy = siteCopy[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = copy.seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.seo.description);
  }, [copy.seo.description, copy.seo.title, locale]);

  const toggleLocale = () => setLocale((current) => (current === 'tr' ? 'en' : 'tr'));

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Mustafa Kalkanlı — ana sayfa">MK<span className="wordmark-dot">.</span></a>
        <nav className="main-nav" aria-label={locale === 'tr' ? 'Ana menü' : 'Main navigation'}>
          <a href="#expertise">{copy.nav.expertise}</a><a href="#approach">{copy.nav.approach}</a><a href="#contact">{copy.nav.contact}</a>
        </nav>
        <button className="language-button" type="button" onClick={toggleLocale} aria-label={locale === 'tr' ? 'Switch language to English' : 'Dili Türkçeye çevir'}>
          <Languages aria-hidden="true" size={16} />{copy.languageLabel}
        </button>
      </header>

      <section id="top" className="hero section-shell">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow"><span />{copy.hero.eyebrow}</p>
          <h1>{copy.hero.title}</h1>
          <p className="hero-summary">{copy.hero.summary}</p>
          <div className="hero-actions">
            <a className="primary-link" href="#expertise">{copy.hero.cta}<ArrowDownRight aria-hidden="true" size={18} /></a>
            <a className="text-link" href={siteCopy.shared.githubUrl} target="_blank" rel="noopener noreferrer">{copy.hero.secondaryCta}<ArrowUpRight aria-hidden="true" size={16} /></a>
          </div>
        </div>
        <div className="signal-panel" aria-label={locale === 'tr' ? 'Uzmanlık özeti' : 'Expertise summary'}>
          <div className="signal-topline"><span>MK / CYBER</span><ShieldCheck aria-hidden="true" size={20} /></div>
          <div className="signal-mark"><span>RISK</span><strong>→</strong><span>DECISION</span></div>
          <div className="signal-footer"><span>STRATEGY</span><span>FORENSICS</span><span>RESILIENCE</span></div>
        </div>
      </section>

      <section id="expertise" className="expertise-section section-shell">
        <div className="section-heading">
          <p className="section-index">01 / {copy.nav.expertise}</p><h2>{copy.expertiseTitle}</h2><p>{copy.expertiseIntro}</p>
        </div>
        <div className="expertise-list">
          {copy.expertise.map((item) => <article className="expertise-card" key={item.number}><span className="card-number">{item.number}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}
        </div>
      </section>

      <section id="approach" className="approach-section">
        <div className="section-shell approach-grid">
          <p className="section-index light">02 / {copy.approachLabel}</p>
          <div><h2>{copy.approachTitle}</h2><p>{copy.approachBody}</p></div>
          <ol className="principle-list">{copy.principles.map((principle, index) => <li key={principle}><span>0{index + 1}</span>{principle}</li>)}</ol>
        </div>
      </section>

      <section id="contact" className="contact-section section-shell">
        <p className="section-index">03 / {copy.contactLabel}</p>
        <div className="contact-row"><h2>{copy.contactTitle}</h2><a className="github-link" href={siteCopy.shared.githubUrl} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">GH</span>{copy.contactCta}<ArrowUpRight aria-hidden="true" size={18} /></a></div>
      </section>
      <footer className="site-footer section-shell"><span>© {new Date().getFullYear()}</span><span>{copy.footer}</span></footer>
    </main>
  );
}
