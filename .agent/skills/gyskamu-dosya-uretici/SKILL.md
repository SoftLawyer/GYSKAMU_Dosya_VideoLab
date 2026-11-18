---
name: gyskamu-dosya-uretici
description: GYSKAMU (@gyskamu) için memurlara yönelik 10 vaka seçeneği sunma, seçilen konuyu 45-55 saniyelik Charon TTS seslendirmeli ve tam boy aksiyon animasyonlu 1080x1920 Remotion MP4 videoya dönüştürme ve sabit GYSKAMU alt bloklu Instagram Reels caption üretme yeteneği.
---

# GYSKAMU Dosya VideoLab Üretim Yeteneği

Bu yetenek aktif olduğunda kök dizindeki [`MASTER_PROMPT.md`](../../../MASTER_PROMPT.md) protokolünü uygula:

1. **Konu İsteği Geldiğinde 10 Seçenek Sun:**
   - `python3 scripts/gyskamu_studio.py list` ve `python3 scripts/gyskamu_studio.py suggest --category <kategori>` komutlarını çalıştır.
   - Kullanıcıya 10 adet paradoksal, yüksek merak uyandıran memur hakları vakası seçeneği sun ve seçimini bekle.
2. **45–55 Saniyelik Video Üretimi:**
   - Seçilen vaka için sıradaki `♦ DOSYA NO: [X]` numarasını ata.
   - `generate_charon_v2.py` ile 7 bölüm (`Beat 0..6`), 16–20 segment, toplam **45–55 saniye** uzunluğunda `Charon` (`gemini-2.5-flash-preview-tts`) seslendirmesini, ses efektlerini ve `src/timeline.json` dosyasını üret.
   - `src/GyskamuVideo.tsx` içinde `Beat 0` aksiyon sahnesini ve 7 bölümün tamamını yeni memur vakasına göre kurgula, `npx remotion still` ile görsel kontrol yap ve `npx remotion render` ile MP4 videoyu üret.
3. **Zorunlu Sabit Bloklu Caption:**
   - Videoyla birlikte verilen Instagram Reels açıklamasının altına her zaman `config/settings.json` içindeki `Haklarını bil, kaybetme... GYSKAMU size; ...` sabit bloğunu birebir ekle.
