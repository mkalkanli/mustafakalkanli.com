export type Locale = 'tr' | 'en';

export const siteCopy = {
  shared: {
    githubUrl: 'https://github.com/mkalkanli',
  },
  tr: {
    nav: { expertise: 'Uzmanlık', approach: 'Yaklaşım', contact: 'Bağlantı' },
    languageLabel: 'English',
    hero: {
      eyebrow: 'Siber Güvenlik Yönetimi & Stratejisi',
      title: 'Dijital riski, yönetilebilir kararlara dönüştürüyorum.',
      summary:
        'Kurumların siber güvenliği yalnızca teknik bir konu olarak değil; yönetişim, iş sürekliliği ve sürdürülebilir dayanıklılık çerçevesinde ele almasına yardımcı oluyorum.',
      cta: 'Uzmanlık alanlarını keşfedin',
      secondaryCta: 'GitHub profili',
    },
    expertiseTitle: 'Strateji ile teknik gerçeklik arasında.',
    expertiseIntro:
      'Yönetim katının ihtiyaç duyduğu netlik ile olayların gerektirdiği teknik derinliği aynı çerçevede buluşturan bir yaklaşım.',
    expertise: [
      {
        number: '01',
        title: 'Siber Güvenlik Yönetimi ve Stratejisi',
        description:
          'Risk önceliklendirme, yönetişim, güvenlik programı tasarımı ve karar vericiler için anlaşılır bir siber dayanıklılık yol haritası.',
      },
      {
        number: '02',
        title: 'Dijital Adli Analiz',
        description:
          'Olayların izini kanıta dayalı biçimde sürmek, bulguları bağlama oturtmak ve gelecekteki savunma kararlarına dönüştürmek.',
      },
    ],
    approachLabel: 'Yaklaşım',
    approachTitle: 'Güvenlik, teknoloji listesinden önce bir karar disiplinidir.',
    approachBody:
      'Etkili güvenlik; doğru soruları sormak, kritik varlıkları tanımak, belirsizliği görünür kılmak ve teknik bulguları iş sonuçlarıyla ilişkilendirmekle başlar.',
    principles: ['Yönetişim', 'Risk', 'Dayanıklılık', 'Kanıt'],
    contactLabel: 'Bağlantı',
    contactTitle: 'Araştırmalar ve açık çalışmalar için GitHub profilimi ziyaret edin.',
    contactCta: 'GitHub’da görüntüle',
    footer: 'Mustafa Kalkanlı — Siber Güvenlik Yönetimi ve Stratejisi',
    seo: {
      title: 'Mustafa Kalkanlı | Siber Güvenlik Stratejisi',
      description:
        'Mustafa Kalkanlı’nın siber güvenlik yönetimi, strateji, kurumsal dayanıklılık ve dijital adli analiz yaklaşımını keşfedin.',
    },
  },
  en: {
    nav: { expertise: 'Expertise', approach: 'Approach', contact: 'Connect' },
    languageLabel: 'Türkçe',
    hero: {
      eyebrow: 'Cybersecurity Management & Strategy',
      title: 'Turning digital risk into decisions leaders can act on.',
      summary:
        'I help organizations approach cybersecurity not only as a technical concern, but as a discipline of governance, business continuity, and sustainable resilience.',
      cta: 'Explore expertise',
      secondaryCta: 'GitHub profile',
    },
    expertiseTitle: 'Where strategy meets technical reality.',
    expertiseIntro:
      'An approach that brings executive clarity and the technical depth required by real-world incidents into the same frame.',
    expertise: [
      {
        number: '01',
        title: 'Cybersecurity Management and Strategy',
        description:
          'Risk prioritization, governance, security program design, and clear cyber-resilience roadmaps for decision-makers.',
      },
      {
        number: '02',
        title: 'Digital Forensics',
        description:
          'Following the evidence behind incidents, placing findings in context, and translating them into stronger future defenses.',
      },
    ],
    approachLabel: 'Approach',
    approachTitle: 'Security is a decision discipline before it is a technology list.',
    approachBody:
      'Effective security begins with asking the right questions, understanding critical assets, making uncertainty visible, and connecting technical findings to business outcomes.',
    principles: ['Governance', 'Risk', 'Resilience', 'Evidence'],
    contactLabel: 'Connect',
    contactTitle: 'Visit my GitHub profile for research and open work.',
    contactCta: 'View on GitHub',
    footer: 'Mustafa Kalkanlı — Cybersecurity Management and Strategy',
    seo: {
      title: 'Mustafa Kalkanlı | Cybersecurity Strategy',
      description:
        'Explore Mustafa Kalkanlı’s perspective on cybersecurity management, strategy, organizational resilience, and digital forensics.',
    },
  },
} as const;
