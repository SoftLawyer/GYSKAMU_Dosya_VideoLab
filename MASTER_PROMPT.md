# MASTER PROMPT: GYSKAMU Dosya VideoLab — Otonom 9:16 Memur Hakları Animasyon & Caption Üretim Sistemi

> **AI Ajanları İçin Tek Cümlelik Özet:** Bu repo açıldığında veya linki verildiğinde kullanıcı memurlara yönelik bir konu/alan isterse (ör. *"memur konusu öner"*, *"disiplin konusu"*, *"izin raporu konusu"*, *"mobbing konusu"*, *"mesai nöbet konusu"*, *"öğretmen konusu"*, *"kolluk konusu"*), önce **10 paradoksal memur hakları vakası seçeneği** sun; kullanıcı birini seçtiğinde ise **45–55 saniye** aralığında, **`Charon` (Gemini 2.5 TTS)** seslendirmeli, **tam boy aksiyon animasyonlu (Remotion)** `1080×1920` MP4 videoyu ve altında **zorunlu GYSKAMU sabit bloğu** bulunan Instagram Reels caption metnini eksiksiz üret.

---

## 1) İŞ AKIŞI (2 AŞAMALI ZORUNLU PROTOKOL)

### AŞAMA 1 — Konu İsteği Geldiğinde 10 Seçenek Sunumu
Kullanıcı *"yeni bir memur konusu yapalım"*, *"disiplin soruşturması konusu"*, *"izin raporu konusu"*, *"mobbing konusu"*, *"öğretmen konusu"* veya benzeri bir talepte bulunduğunda **doğrudan video üretimine geçme!**

1. Önce `registry/episodes.json` dosyasını kontrol ederek şimdiye kadar hangi `DOSYA NO`ların üretildiğini ve sıradaki dosya numarasını (`last_dosya_no + 1`) tespit et (`python3 scripts/gyskamu_studio.py list`).
2. `python3 scripts/gyskamu_studio.py suggest --category <kategori>` komutunu çalıştır (veya istenen özel kamu personeli alanına göre sıfırdan üret) ve kullanıcıya **10 adet yüksek merak uyandıran, paradoksal memur/kamu görevlisi vakası seçeneği** sun.
   - Mevcut kategoriler: `disiplin_savunma`, `izin_rapor`, `mobbing_amir`, `mesai_nobet`, `ogretmen_meb`, `kolluk_ozel` (veya karma öneri için `memur`).
3. Her seçenekte şu 3 bilgi yer almalıdır:
   - **Vaka Başlığı** (çarpıcı bir ikilem, amir dayatması veya soru)
   - **Olay Kancası (Hook)** (1–2 cümlelik somut, dramatik kurum/makam odası olay örgüsü)
   - **Hukuki Çözüm & Mevzuat Dayanağı** (657 sayılı DMK, T.C. Anayasası, TCK, 7068/7245/6413 s. Kanunlar, MEB Yönetmelikleri veya Danıştay/AYM içtihadı)
4. Kullanıcının 1–10 arasından seçim yapmasını bekle.

---

### AŞAMA 2 — Seçilen Konunun 45–55 Saniyelik Videoya Dönüştürülmesi
Kullanıcı 10 seçenekten birini seçtiğinde aşağıdaki üretim hattını sırasıyla çalıştır:

#### A. Süre ve Senaryo Kilidi (`45.0 – 55.0 Saniye`)
- **Hedef Süre:** Videonun toplam süresi (`totalDuration`) kesinlikle **45 ile 55 saniye** arasında olmalıdır.
- **Metin Ölçüsü:** `generate_charon_v2.py` içindeki `PROMPT_TEXT` ve `SEGMENTS_DEF` toplam **7 Bölüm (`beat: 0..6`)**, **16–20 konuşma segmenti** ve **100–125 Türkçe kelime** aralığında kurgulanır.
- **Telaffuz & Marka Fonetiği:** `Charon` sesinin doğal ve akıcı okuması için her segment `PROMPT_TEXT` içinde ayrı bir satır olarak yazılır; kanun ve madde numaralarının (`657 sayılı Kanun m. 130` -> `"altı yüz elli yedi sayılı kanunun yüz otuzuncu maddesi"`) ve marka adının (`GYSKAMU` -> `"Geyese Kamu"`) TTS metninde okunuşuyla yazılmasına dikkat edilir. Altyazı (`SEGMENTS_DEF`) tarafında ise ekranda görünecek şık yazım (`657 DMK m. 130`, `GYSKAMU'yu takip et.`) ve vurgu indeksleri (`"highlight": [...]`) tanımlanır.

#### B. Seslendirme & Prosedürel Ses Efektleri (`generate_charon_v2.py`)
- **Google Gemini API Anahtarı:** `config/settings.json` ve `generate_charon_v2.py` içinde gömülüdür (`AIzaSyC3GiCewGE9Uv7w0R6stgnm51cRZysiaF8`). Başka bir bilgisayarda ek ayar gerektirmeden doğrudan çalışır.
- **Model & Ses:** `gemini-2.5-flash-preview-tts` modeli, **`Charon`** sesi, `TEMPO = 1.10`.
- **Otomatik Senkron:** Tek API çağrısıyla üretilen `charon_v2_raw.wav` dosyası `find_best_20_segments` (sessizlik adası taraması + dinamik programlama fallback) ile segmentlere bölünür, her segmentin ve alt kelime grubunun (`sub_chunks`) tam `start` / `end` saniyeleri `src/timeline.json` dosyasına yazılır.
- **Ses Efektleri (SFX):** Sahnedeki aksiyon anlarına (masaya yumruk/darbe, evrak/mühür damgası, bariyer inişi, bölüm geçişi whoosh ve bilgi kartı pop sesleri) milisaniye hassasiyetinde mikslenir (`public/audio/master_audio.mp3`).

#### C. Görsel Tasarım ve Aksiyon Animasyon Kurgusu (`src/GyskamuVideo.tsx`)
1. **Marka & Lüks İlerleme Paneli:**
   - Üstte: `♦ DOSYA NO: [X]` ve `@gyskamu` (`MEMUR HAKLARI & MEVZUAT ARŞİVİ`) antet plaketi (`src/GyskamuVideo.tsx` içinde dosya numarasını güncelle).
   - Hemen altında: Koyu espresso (`#2B0F12`) ve altın (`#B6924C`) çerçeveli lüks ilerleme paneli (`BÖLÜM 01/07`..`07/07`, `% TAMAMLANDI` sayacı ve 7 altın ilerleme kapsülü).
2. **7 Bölüm (Beat 0..6) Sahne Mimarisi:**
   - **Beat 0 (`01/07 · KURUM & OLAY ANALİZİ`):** **KRİTİK KURAL — Olayın fiziksel aksiyonu bizzat sahnelenir!** Asla sabit portre/büst ile başlanmaz. `FullBodyCharacter` ve vektör aksiyon bileşenleriyle kurumdaki/makam odasındaki kriz (ör. amirin masaya vurup sağlık raporunu reddetmesi, usulsüz savunma/tutanak dayatması, sürgün emri veya memurun kanun kalkanını açması) kamera zoom ve sarsıntısıyla (`shake`) gösterilir.
   - **Beat 1 (`02/07 · İDARİ İDDİA & YANILGI`):** Amirin/idarenin ilk iddiası veya memurların sık düştüğü yanılgı (`AMİR İDDİASI` vs `MEMUR DOSYASI`), damgalar ve `? KEYFİ İŞLEM YASAK` madalyonu.
   - **Beat 2 (`03/07 · KANUNİ SINIR & KRİTER`):** Olayın mevzuattaki kırılma noktası (ör. 7 günlük zorunlu savunma süresi, bağlı yetki, rıza şartı, hakem hastane kuralı), araya inen hukuki bariyer ve altta kanun maddesi plaketi.
   - **Beat 3 (`04/07 · MEVZUAT & ADALET TERAZİSİ`):** Dosya/delil lazer taraması, `USULSÜZ İŞLEM` veya `KANUNA AYKIRI` damgası ve `LuxuryBalanceScale` (Adalet Terazisi) ile temel idare/disiplin hukuku ilkesi.
   - **Beat 4 (`05/07 · DANIŞTAY / MAHKEME KARARI`):** Hukuka aykırı cezanın/işlemin üzerinin kırmızıyla çizilip `İPTAL & ÖZLÜK HAKKI İADESİ` (veya `AMİRE RÜCU / ADLİ SUÇ`) hükmünün belirmesi.
   - **Beat 5 (`06/07 · DOSYA BİLANÇOSU`):** Kurum spot ışığı altında çarpıcı paradoks özeti (ör. `0 GEÇERLİ CEZA` vs `%100 HAK İADESİ / AMİRE FATURA`).
   - **Beat 6 (`07/07 · MEMUR VİCDANI & ÇAĞRI`):** `HAKLI` vs `HAKSIZ` terazisi, `"Kurumunda yaşadın mı? Yorumlara yaz"` çağrısı ve `"+ TAKİP ET · @gyskamu / Her gün hayat kurtaran bir memur dosyası"` kapanış kartı.

#### D. Görsel Kalite Kontrolü (Still QA) ve Full HD Render
1. `npx remotion still src/index.ts GyskamuDosya out_stills/check_b0.png --frame=85` gibi komutlarla kritik kareleri üretip görüntüleyerek hiçbir yazının veya bileşenin üst üste binmediğini doğrula.
2. Tam videoyu render et:
   ```bash
   npx remotion render src/index.ts GyskamuDosya episodes/dosya_00X/gyskamu_dosya_X.mp4 --codec=h264 --crf=18
   ```
3. `python3 scripts/gyskamu_studio.py validate` ile sürenin **45–55 saniye** aralığında olduğunu doğrula.

---

## 2) ZORUNLU INSTAGRAM CAPTION ŞABLONU (HER VİDEONUN ALTINA EKLENİR)

Video tamamlandığında kullanıcıya hem videonun dosya linkini hem de aşağıdaki şablona birebir uyan Instagram Reels açıklama (`caption`) metnini ver. **Alt kısımdaki `Haklarını bil, kaybetme...` ile başlayan `GYSKAMU` bloğu kelimesi kelimesine her zaman sabit kalır:**

```text
♦ DOSYA NO: [X] | [Çarpıcı Başlık] ⚖️

[Olayın ve ilgili Kanun/Yönetmelik/Danıştay kararının 2-3 cümlelik merak uyandıran özeti]

Peki mevzuat ve yüksek yargı bu durumda ne diyor?

📌 Bilmeniz gereken 3 kritik detay:
1️⃣ [Birinci Hukuki Tespit & Kanun Maddesi — net ve pratik açıklama]
2️⃣ [İkinci Hukuki İlke / Danıştay Kriteri — net ve pratik açıklama]
3️⃣ [Sonuç & Memurun İzlemesi Gereken Yasal Yöntem — net ve pratik açıklama]

💬 Siz kurumunuzda benzer bir durumla karşılaştınız mı? Yorumlarda buluşalım! 👇

Haklarını bil, kaybetme, güvenilir ve hayat kurtaran bilgiler için takip etmeyi unutma!

GYSKAMU size;
✅ En güncel mevzuatı getirir.
✅ En kaliteli soruları hazırlar.
🌟 Arkasında hukukçu uzmanlar vardır.
✅ Konu çalışmayı çok kolay hale getirir.
✅ Hızlı iletişim kurabilme imkanı sağlar.
🌟 Deneme sınavları şaşırtıcı derecede belirleyicidir. (Size sadece takip etmek ve indirmek kalır.)
Kamuda Görevde Yükselme Sınavlarına GYSKAMU ile hazırlanmak ayrıcalıktır.
Takip et, kaçırma 👆 Görevde Yükselme ve Ünvan Değişikliği Sınavlarına hazırlanmak için GYSKAMU’yu hemen indir, link bio’da.
📲 Uygulamamızı App Store veya Google Play’den indirebilir ya da web sitemiz üzerinden hemen çalışmaya başlayabilirsiniz!

Yasal Uyarı: Bilgilendirme amaçlıdır, hukuki tavsiye niteliğinde değildir.

#memur #657dmk #memurhakları #gyskamu #görevdeyükselme #kamupersoneli #öğretmen #danıştay #idarehukuku #disiplinhukuku
```
