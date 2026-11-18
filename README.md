# GYSKAMU Dosya VideoLab ⚖️🎬

**`@gyskamu`** için memurlara ve kamu görevlilerine yönelik **45–55 saniye** aralığında, **Gemini 2.5 TTS (`Charon`)** seslendirmeli, **lüks parşömen/espresso/altın** estetiğinde, **tam boy aksiyon animasyonlu (`Remotion 1080×1920 30fps`)** Instagram Reels memur hakları dosyası ve **sabit kilitli `GYSKAMU` caption** üretim fabrikası.

---

## 🚀 Başka Bir Bilgisayarda Anında Kurulum & Kullanım

Herhangi bir bilgisayarda sadece bu repo linkini AI asistanına (Antigravity, Claude Code, Cursor, Gemini vb.) vermeniz veya klonlamanız yeterlidir. Google Gemini API anahtarı (`config/settings.json` ve `generate_charon_v2.py` içinde) repoya gömülüdür.

```bash
# 1. Repoyu klonla
git clone https://github.com/SoftLawyer/GYSKAMU_Dosya_VideoLab.git
cd GYSKAMU_Dosya_VideoLab

# 2. Bağımlılıkları yükle (Node.js + Python + ffmpeg)
npm install
pip install google-genai numpy
```

### AI Asistanına Söylemeniz Gereken Tek Şey:
- **"Bana memur konusu öner"** (veya *"disiplin konusu"*, *"izin raporu konusu"*, *"mobbing konusu"*, *"mesai nöbet konusu"*, *"öğretmen konusu"*, *"kolluk konusu"*)
  - Sistem önce **`registry/episodes.json`** arşivini kontrol eder ve size daha önce işlenmemiş **10 çarpıcı memur/kamu görevlisi vakası seçeneği** sunar.
- **"3 numaralı konuyu hazırla"** dediğinizde:
  1. Sıradaki **`♦ DOSYA NO: X`** numarasını otomatik verir.
  2. **45–55 saniye** aralığında `Charon` seslendirmesini ve sahne ses efektlerini (`master_audio.mp3` + `src/timeline.json`) üretir.
  3. Olayın fiziksel aksiyonunu bizzat gösteren 7 bölümlü tam boy animasyonu (`src/GyskamuVideo.tsx`) kurgular ve `1080×1920` MP4 olarak render eder.
  4. Altında zorunlu **`GYSKAMU size; ...`** sabit bloğu bulunan Instagram Reels **caption** metnini hazır olarak sunar.

---

## 🛠️ CLI Komutları

```bash
# Şimdiye kadar üretilen dosyaları ve sıradaki Dosya No'yu gör
python3 scripts/gyskamu_studio.py list

# İstediğin memur hukuku alanında 10 aday vaka seçeneği listele
python3 scripts/gyskamu_studio.py suggest --category disiplin_savunma
python3 scripts/gyskamu_studio.py suggest --category izin_rapor
python3 scripts/gyskamu_studio.py suggest --category mobbing_amir
python3 scripts/gyskamu_studio.py suggest --category mesai_nobet
python3 scripts/gyskamu_studio.py suggest --category ogretmen_meb
python3 scripts/gyskamu_studio.py suggest --category kolluk_ozel
python3 scripts/gyskamu_studio.py suggest --category memur

# Seslendirme + SFX + timeline.json üret (Charon TTS)
python3 generate_charon_v2.py

# 45-55sn süre kilidini, 7 bölümü ve zorunlu GYSKAMU caption bloğunu doğrula
python3 scripts/gyskamu_studio.py validate

# Videoyu 1080x1920 Full HD MP4 olarak render et
npm run render
```

---

## 📁 Repo Yapısı

| Yol | Açıklama |
|---|---|
| [`MASTER_PROMPT.md`](MASTER_PROMPT.md) | AI ajanları için 2 aşamalı (10 seçenek -> 45-55sn video + sabit GYSKAMU caption) ana üretim protokolü |
| [`AGENTS.md`](AGENTS.md) / [`CLAUDE.md`](CLAUDE.md) / [`GEMINI.md`](GEMINI.md) | Farklı AI araçlarının repoyu açar açmaz `MASTER_PROMPT.md` kurallarına adapte olmasını sağlayan otomatik talimat dosyaları |
| [`config/settings.json`](config/settings.json) | Gömülü Google Gemini API anahtarı, `Charon` TTS ayarları, `45–55sn` süre kilidi ve sabit `GYSKAMU` caption alt bloğu |
| [`locks/gyskamu_locks.json`](locks/gyskamu_locks.json) | Tasarım, süre, aksiyon animasyonu ve caption kilit kuralları |
| [`registry/episodes.json`](registry/episodes.json) | Üretilen dosyaların (`DOSYA NO: 1`...) arşivi ve tekrar önleme kaydı |
| [`registry/topic_bank.json`](registry/topic_bank.json) | Disiplin & Savunma, İzin & Rapor, Mobbing & Amir, Mesai & Nöbet, Öğretmen/MEB ve Kolluk/Özel kategorilerinde 60+ hazır memur vakası havuzu |
| [`generate_charon_v2.py`](generate_charon_v2.py) | Gemini 2.5 `Charon` TTS sentezleyici, otomatik sessizlik adası hizalayıcı, prosedürel SFX mikseri ve `timeline.json` üretici |
| [`src/GyskamuVideo.tsx`](src/GyskamuVideo.tsx) | Lüks ilerleme çubuğu, `FullBodyCharacter`, `LuxuryBalanceScale` ve 7 bölümlü `@gyskamu` Remotion sahne motoru |
| [`scripts/gyskamu_studio.py`](scripts/gyskamu_studio.py) | 10 memur konusu önerici, süre/kilit doğrulayıcı ve sabit bloklu caption üretici CLI |
