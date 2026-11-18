#!/usr/bin/env python3
"""
GYSKAMU Dosya VideoLab — CLI Yönetim, 10 Memur Konusu Öneri, Süre Kilidi (45-55sn) ve Sabit GYSKAMU Caption Üretim Aracı
"""
import os
import sys
import json
import argparse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SETTINGS_PATH = os.path.join(BASE_DIR, "config", "settings.json")
LOCKS_PATH = os.path.join(BASE_DIR, "locks", "gyskamu_locks.json")
EPISODES_PATH = os.path.join(BASE_DIR, "registry", "episodes.json")
TOPIC_BANK_PATH = os.path.join(BASE_DIR, "registry", "topic_bank.json")
TIMELINE_PATH = os.path.join(BASE_DIR, "src", "timeline.json")

CATEGORY_ALIASES = {
    "disiplin": "disiplin_savunma",
    "savunma": "disiplin_savunma",
    "disiplin_savunma": "disiplin_savunma",
    "izin": "izin_rapor",
    "rapor": "izin_rapor",
    "izin_rapor": "izin_rapor",
    "mobbing": "mobbing_amir",
    "amir": "mobbing_amir",
    "mobbing_amir": "mobbing_amir",
    "mesai": "mesai_nobet",
    "nobet": "mesai_nobet",
    "mesai_nobet": "mesai_nobet",
    "ogretmen": "ogretmen_meb",
    "meb": "ogretmen_meb",
    "ogretmen_meb": "ogretmen_meb",
    "kolluk": "kolluk_ozel",
    "polis": "kolluk_ozel",
    "bekci": "kolluk_ozel",
    "asker": "kolluk_ozel",
    "saglik": "kolluk_ozel",
    "kolluk_ozel": "kolluk_ozel",
}


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def cmd_list(_args):
    reg = load_json(EPISODES_PATH)
    print(f"📁 GYSKAMU DOSYA ARŞİVİ (Son Dosya No: {reg['last_dosya_no']} -> Sıradaki: DOSYA NO: {reg['last_dosya_no'] + 1})")
    print("-" * 85)
    if not reg["episodes"]:
        print("  (Henüz üretilmiş dosya kaydı yok. İlk üretilecek video DOSYA NO: 1 olacaktır.)")
        print("-" * 85)
        return
    for ep in reg["episodes"]:
        print(f"  ♦ DOSYA NO: {ep['dosya_no']} | [{ep['category'].upper()}] {ep['title']}")
        print(f"    Süre: {ep['duration_sec']} sn | Ses: {ep['voice']} | Video: {ep['video_path']}")
        print(f"    Kanun/İlke: {', '.join(ep['laws'])}")
        print("-" * 85)


def cmd_suggest(args):
    bank = load_json(TOPIC_BANK_PATH)
    reg = load_json(EPISODES_PATH)
    done_titles = {ep["title"].lower() for ep in reg["episodes"]}
    raw_cat = (args.category or "disiplin_savunma").lower().strip()

    if raw_cat in ("memur", "genel", "karma"):
        # Karma 10 öneri (tüm memur kategorilerinden dengeli seçki)
        pool = []
        for c_key in ["disiplin_savunma", "izin_rapor", "mobbing_amir", "mesai_nobet", "ogretmen_meb", "kolluk_ozel"]:
            for item in bank["categories"].get(c_key, [])[:2]:
                if item["title"].lower() not in done_titles:
                    pool.append(item)
        selected = pool[:10]
        cat_label = "GENEL MEMUR HAKLARI (KARMA)"
    else:
        cat = CATEGORY_ALIASES.get(raw_cat, raw_cat)
        if cat not in bank["categories"]:
            print(f"⚠️ '{raw_cat}' kategorisi sabit havuzda yok. Mevcut kategoriler: {', '.join(bank['categories'].keys())} (veya: disiplin, izin, mobbing, mesai, ogretmen, kolluk, memur)")
            return
        items = [item for item in bank["categories"][cat] if item["title"].lower() not in done_titles]
        selected = items[:10]
        cat_label = cat.upper()

    next_no = reg["last_dosya_no"] + 1
    print(f"⚖️  GYSKAMU DOSYA NO: {next_no} İÇİN [{cat_label}] KATEGORİSİNDE {len(selected)} ADAY MEMUR VAKASI SEÇENEĞİ:")
    print("=" * 90)
    for idx, item in enumerate(selected, 1):
        print(f"{idx}. {item['title']}")
        print(f"   🔥 Kanca (Hook): {item['hook']}")
        print(f"   ⚖️  Hukuki Çözüm: {item['summary']}")
        print(f"   📜 Dayanak: {', '.join(item['laws'])}")
        print("-" * 90)


def cmd_validate(_args):
    settings = load_json(SETTINGS_PATH)
    errors = []
    if not os.path.exists(TIMELINE_PATH):
        errors.append("src/timeline.json bulunamadı.")
    else:
        tl = load_json(TIMELINE_PATH)
        dur = tl.get("totalDuration", 0)
        min_d = settings["video"]["min_duration_sec"]
        max_d = settings["video"]["max_duration_sec"]
        if not (min_d <= dur <= max_d + 0.5):
            errors.append(f"Süre kilidi ihlali: {dur}s (Hedef: {min_d}s - {max_d}s)")
        beats = tl.get("beats", [])
        if len(beats) != 7:
            errors.append(f"Beat sayısı 7 olmalı, mevcut: {len(beats)}")

    mp3_path = os.path.join(BASE_DIR, "public", "audio", "master_audio.mp3")
    if not os.path.exists(mp3_path):
        errors.append("public/audio/master_audio.mp3 bulunamadı.")

    reg = load_json(EPISODES_PATH)
    footer = settings["caption_mandatory_footer"].strip()
    if "GYSKAMU size;" not in footer:
        errors.append("config/settings.json içinde zorunlu 'GYSKAMU size;' alt bloğu eksik!")

    for ep in reg["episodes"]:
        cap_file = os.path.join(BASE_DIR, ep["caption_path"])
        if not os.path.exists(cap_file):
            errors.append(f"Caption dosyası eksik: {ep['caption_path']}")
        else:
            with open(cap_file, "r", encoding="utf-8") as f:
                content = f.read()
            if footer not in content:
                errors.append(f"DOSYA NO {ep['dosya_no']} caption içinde zorunlu GYSKAMU alt bloğu eksik!")

    if errors:
        print("❌ DOĞRULAMA HATALARI:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        tl = load_json(TIMELINE_PATH)
        print(f"✅ TÜM KİLİTLER DOĞRULANDI! (Aktif Timeline Süresi: {tl['totalDuration']}s | 7 Bölüm | Sabit GYSKAMU Caption Bloğu Tamam)")


def cmd_caption(args):
    settings = load_json(SETTINGS_PATH)
    reg = load_json(EPISODES_PATH)
    dosya_no = args.dosya or (reg["last_dosya_no"] + 1)
    footer = settings["caption_mandatory_footer"]
    text = f"""♦ DOSYA NO: {dosya_no} | {args.title} ⚖️

{args.intro}

Peki mevzuat ve yüksek yargı bu durumda ne diyor?

📌 Bilmeniz gereken 3 kritik detay:
{args.points}

💬 {args.question} Yorumlarda buluşalım! 👇

{footer}

{args.tags}
"""
    print(text)


def main():
    parser = argparse.ArgumentParser(description="GYSKAMU Dosya VideoLab CLI")
    sub = parser.add_subparsers(dest="cmd")

    sub.add_parser("list", help="Üretilen tüm memur dosyalarını ve sıradaki Dosya No'yu listele")

    p_sug = sub.add_parser("suggest", help="Kategoriye göre 10 aday memur hukuku dosyası öner")
    p_sug.add_argument(
        "--category",
        default="disiplin_savunma",
        help="Kategori (disiplin_savunma, izin_rapor, mobbing_amir, mesai_nobet, ogretmen_meb, kolluk_ozel, memur)"
    )

    sub.add_parser("validate", help="45-55sn süre kilidini, 7 bölümü ve zorunlu GYSKAMU caption bloğunu doğrula")

    p_cap = sub.add_parser("caption", help="Zorunlu GYSKAMU alt bloğuyla tam Instagram caption üret")
    p_cap.add_argument("--dosya", type=int, default=None)
    p_cap.add_argument("--title", required=True)
    p_cap.add_argument("--intro", required=True)
    p_cap.add_argument("--points", required=True)
    p_cap.add_argument("--question", default="Siz kurumunuzda benzer bir durumla karşılaştınız mı?")
    p_cap.add_argument("--tags", default="#memur #657dmk #memurhakları #gyskamu #görevdeyükselme #kamupersoneli #öğretmen #danıştay #idarehukuku #disiplinhukuku")

    args = parser.parse_args()
    if args.cmd == "list":
        cmd_list(args)
    elif args.cmd == "suggest":
        cmd_suggest(args)
    elif args.cmd == "validate":
        cmd_validate(args)
    elif args.cmd == "caption":
        cmd_caption(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
