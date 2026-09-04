import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const canonicalUrl = 'https://mustafakalkanli.com/';

export const metadata: Metadata = {
  metadataBase: new URL(canonicalUrl),
  title: 'Mustafa Kalkanlı | Siber Güvenlik Stratejisi',
  description: 'Mustafa Kalkanlı’nın siber güvenlik yönetimi, strateji, kurumsal dayanıklılık ve dijital adli analiz yaklaşımını keşfedin.',
  alternates: { canonical: canonicalUrl },
  openGraph: { type: 'website', url: canonicalUrl, title: 'Mustafa Kalkanlı | Siber Güvenlik Stratejisi', description: 'Siber güvenlik yönetimi, strateji, kurumsal dayanıklılık ve dijital adli analiz.', siteName: 'Mustafa Kalkanlı', locale: 'tr_TR' },
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: { index: false, follow: false, noarchive: true },
  },
};

const personSchema = { '@context': 'https://schema.org', '@type': 'Person', name: 'Mustafa Kalkanlı', url: canonicalUrl, sameAs: ['https://github.com/mkalkanli'], knowsAbout: ['Cybersecurity Management', 'Cybersecurity Strategy', 'Digital Forensics'] };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} /></body></html>;
}
