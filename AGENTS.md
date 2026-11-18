# AGENTS.md — Otomatik AI Ajan Adaptasyon Kılavuzu (GYSKAMU Dosya VideoLab)

Bu repo açıldığında veya klonlandığında **HER ZAMAN** önce [`MASTER_PROMPT.md`](MASTER_PROMPT.md) ve [`config/settings.json`](config/settings.json) dosyalarını oku ve aşağıdaki protokole birebir uy:

1. **Konu İsteği -> 10 Seçenek Sunumu:**
   - Kullanıcı memurlara yönelik bir konu/alan istediğinde (ör. *"memur konusu öner"*, *"disiplin konusu"*, *"izin raporu"*, *"mobbing"*, *"mesai nöbet"*, *"öğretmen"*, *"polis/bekçi/kolluk"*), doğrudan video üretimine geçme.
   - Önce `python3 scripts/gyskamu_studio.py list` ile son `DOSYA NO`yu kontrol et, ardından `python3 scripts/gyskamu_studio.py suggest --category <kategori>` çalıştırarak (veya o konuya özel üreterek) **10 adet paradoksal, merak uyandıran memur hakları vaka seçeneği** sun ve kullanıcının seçimini bekle.
2. **Seçilen Konunun Üretimi (45–55 Saniye Kilidi):**
   - Kullanıcı 10 seçenekten birini seçtiğinde sıradaki `♦ DOSYA NO: [X]` numarasını ver.
   - `generate_charon_v2.py` içindeki metni ve 7 bölümü (`beat: 0..6`, 16–20 segment, ~100–125 kelime) yeni konuya göre güncelle ve `python3 generate_charon_v2.py` ile **`Charon` (`gemini-2.5-flash-preview-tts`, `atempo=1.10`)** sesini + prosedürel ses efektlerini + `src/timeline.json` dosyasını üret. (Google Gemini API anahtarı `config/settings.json` ve `generate_charon_v2.py` içinde gömülüdür.)
   - Toplam sürenin **45 ile 55 saniye** arasında olduğunu doğrula.
   - `src/GyskamuVideo.tsx` içinde `♦ DOSYA NO: [X]` başlığını, `BEAT_META` başlıklarını ve 7 sahnenin tam boy aksiyon animasyonlarını (özellikle `Beat 0`da kurumdaki/makam odasındaki olayın fiziksel olarak gerçekleştiği sahneyi) yeni memur vakasına göre kurgula.
   - `npx remotion still` ile sahne karelerini kontrol et, ardından `npx remotion render src/index.ts GyskamuDosya episodes/dosya_00X/gyskamu_dosya_X.mp4 --codec=h264 --crf=18` komutuyla MP4 videoyu üret.
3. **Zorunlu Instagram Caption:**
   - Videoyla birlikte Instagram Reels açıklama metnini hazırla ve **altına her zaman** `config/settings.json` içindeki `Haklarını bil, kaybetme... GYSKAMU size; ...` sabit bloğunu kelimesi kelimesine ekle.
