# Mustafa Kalkanlı — Executive Evidence Redesign

## Amaç

mustafakalkanli.com'u sade bir kişisel tanıtım sayfasından, yönetici seviyesinde güven veren iki dilli bir danışmanlık vitrini haline getirmek. Site beş saniye içinde adın, ana uzmanlık alanının ve sağlanan değerin anlaşılmasını sağlamalıdır.

## Kesinleşen kararlar

- Sayfada yalnızca **Mustafa Kalkanlı** adı kullanılacak; adın yanında veya altında unvan bulunmayacak.
- Ana uzmanlık **Siber Güvenlik Yönetimi ve Stratejisi** olacak.
- **Adli Bilişim / Digital Forensics** ikincil uzmanlık olarak sunulacak.
- Adli bilişim için yanlış veya uydurma bir Türkçe terim kullanılmayacak.
- Türkçe varsayılan dil olacak; İngilizce içerik eksiksiz ve anlam bakımından eşdeğer olacak.
- Site, içerik son onayı verilene kadar `noindex, nofollow, noarchive` kalacak.
- Kanıtlanmamış sertifika, müşteri, deneyim süresi, başarı oranı, vaka, bilirkişilik, 7/24 hizmet veya hukuki sonuç iddiası kullanılmayacak.

## Konumlandırma ve ton

Temel vaat: siber riskleri yönetilebilir kararlara dönüştüren; yönetişim, dayanıklılık ve gerektiğinde adli bilişim kanıtını aynı karar çerçevesinde buluşturan bir yaklaşım.

Ton sakin, kesin, ölçülü ve yönetici odaklı olacak. Teknik doğruluk korunacak; korku dili, saldırgan satış söylemi, hacker/kapüşon/kilit/matrix klişeleri ve sahte SOC göstergeleri kullanılmayacak.

## Bilgi mimarisi

1. **Üst alan:** Mustafa Kalkanlı adı, TR/EN dil seçimi ve bölüm navigasyonu.
2. **Hero:** Kısa değer önerisi, danışmanlık iletişimi çağrısı ve uzmanlığa inen ikincil çağrı.
3. **Değer şeridi:** Risk görünürlüğü, önceliklendirilmiş yol haritası ve kurumsal dayanıklılık.
4. **Ana çalışma alanları:**
   - Siber Güvenlik Yönetimi ve Stratejisi
   - Yönetişim, Risk ve Yönetim Raporlaması
   - Siber Dayanıklılık ve Olay Hazırlığı
   - Güvenlik Programı Değerlendirmesi
5. **Adli Bilişim:** Ana hizmetlerden görsel olarak daha küçük bir uzmanlık katmanı. Yetkilendirilmiş olaylarda dijital izlerin korunması, zaman çizelgesinin oluşturulması ve bulguların karar verilebilir rapora dönüştürülmesi anlatılacak.
6. **Çalışma yaklaşımı:** Bağlamı kur → Riski görünür kıl → Önceliklendir → Yol haritası oluştur → Takip et.
7. **Çalışma ilkeleri:** Bağlama özgü, kanıta dayalı, ölçülebilir ve gizliliğe duyarlı.
8. **İletişim:** Danışmanlık görüşmesi için `mk@mustafakalkanli.com`; GitHub yalnızca ikincil kanıt/çalışma bağlantısı olarak kalacak.
9. **Alt bilgi:** Ad, uzmanlık ekseni, dil ve gizlilik vurgusu.

## Adli bilişim sınırları

- Çalışma yalnızca açık yetkilendirme ve tanımlı kapsamla ifade edilecek.
- Delil bütünlüğü, mümkün olduğunda salt-okunur edinim, hash ve işlem kaydı ilkeleri vurgulanacak.
- “Delil teslim zinciri / chain of custody” gerektiği yerde doğru terimle kullanılacak.
- Kesin fail isnadı, hukuki görüş, mahkemede kabul garantisi veya doğrulanmamış bilirkişilik/laboratuvar yetkinliği ima edilmeyecek.
- Türkçe başlık **Adli Bilişim**, İngilizce başlık **Digital Forensics** olacak.

## Görsel sistem

- Tasarım yönü: **Executive Evidence** — editoryal otorite ve adli hassasiyet.
- Renkler: mineral kâğıt `#F1EEE7`, gece laciverti `#0B1E32`, mürekkep `#101820`, ölçülü kobalt `#2764FF`; bakır yalnızca ikincil kanıt işaretlerinde.
- Tipografi: güçlü editoryal serif başlık, Geist Sans gövde ve Geist Mono etiket/numara sistemi.
- Hero, masaüstünde asimetrik 7/5 düzen kullanacak.
- Özgün karar izi: **Varlık → Maruziyet → Kanıt → Karar**. Mobilde dikey akacak.
- Görsel kimliği tipografi, çizgiler ve veri ilişkileri taşıyacak; fotoğraf gerekmeden güçlü görünmeli.
- Hareket 450–700 ms aralığında, küçük ve amaçlı olacak; `prefers-reduced-motion` tam desteklenecek.

## Çift dil davranışı

- Kontrol `TR | EN` biçiminde açık durum gösterecek.
- Dil tercihi yerel olarak korunacak ve sayfa yenilendiğinde kaybolmayacak.
- Görünen metin, menü, CTA, erişilebilir ad, belge dili, başlık ve açıklama birlikte değişecek.
- Türkçe ve İngilizce başlık satırları kendi dillerine göre ayrı dengelenecek.
- Dil geçişi kullanıcının mevcut bölümünü değiştirmeyecek.

## Teknik yaklaşım

- React/Vinext içerik modeli tek kaynak olacak; statik Cloudflare çıktısı aynı kaynaktan üretilecek veya otomatik eşitlik testiyle korunacak.
- Yayına yalnızca gerekli statik dosyalar çıkacak; depo kaynaklarının tamamı yayın artefaktına eklenmeyecek.
- Dış bağlantılarda `noopener noreferrer` korunacak.
- Gereksiz istemci JavaScript'i ve ağır görseller kullanılmayacak.
- Mevcut GitHub → Cloudflare otomatik dağıtım akışı korunacak.

## Erişilebilirlik ve responsive gereksinimleri

- Tek `h1`, düzenli başlık sırası, atlama bağlantısı ve semantik bölgeler.
- Klavye erişimi, görünür odak ve en az 44 piksel dokunma hedefleri.
- WCAG AA kontrastı; küçük bakır metinler ölçülmeden kullanılmayacak.
- 320, 375, 768, 1024 ve 1440 pikselde yatay taşma veya metin kesilmesi olmayacak.
- 200% yakınlaştırmada içerik ve navigasyon çalışmaya devam edecek.

## Kabul kriterleri

- Türkçe ve İngilizce tüm içerik eksiksiz ve aynı ticari anlamda.
- Türkçe içerikte yalnızca **Adli Bilişim** terimi kullanılıyor.
- Adli Bilişim ana uzmanlığın önüne geçmiyor.
- Kanıtlanmamış kişisel veya ticari iddia bulunmuyor.
- Test, lint ve üretim derlemesi başarılı.
- Kritik akışlar Chrome, Safari ve Firefox'ta; masaüstü ve mobil genişliklerde doğrulanmış.
- Lighthouse hedefleri: Performance ≥90, Accessibility ≥95, Best Practices ≥95.
- Canlı HTML `noindex, nofollow, noarchive` içeriyor; sitemap yayınlanmıyor.
- GitHub `main` commit'i ile Cloudflare üretim commit'i aynı ve ana alan adı HTTPS 200 döndürüyor.
