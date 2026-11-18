# GEMINI.md — GYSKAMU Dosya VideoLab Talimatları

Lütfen işlem yapmadan önce [`MASTER_PROMPT.md`](MASTER_PROMPT.md) ve [`AGENTS.md`](AGENTS.md) dosyalarını okuyun.

- **Kural 1 (10 Seçenek):** Kullanıcı memurlara yönelik bir konu alanı söylediğinde (ör. *"memur konusu"*, *"disiplin konusu"*, *"izin raporu"*, *"mobbing"*) önce **10 seçenek** sunun, seçtiği konuyu hazırlayın.
- **Kural 2 (45–55 Saniye & Charon TTS):** Videolar `generate_charon_v2.py` (gömülü Google Gemini API anahtarı + `Charon` sesi + `atempo=1.10`) ve `src/GyskamuVideo.tsx` (7 bölüm, lüks espresso/altın ilerleme çubuğu, tam boy aksiyon animasyonu) ile **45–55 saniye** aralığında `1080×1920` MP4 olarak üretilir.
- **Kural 3 (Sabit GYSKAMU Caption Bloğu):** Her videonun caption metninin altına `config/settings.json` ve `MASTER_PROMPT.md` içinde yer alan `Haklarını bil, kaybetme... GYSKAMU size; ...` bloğu kelimesi kelimesine eklenir.
