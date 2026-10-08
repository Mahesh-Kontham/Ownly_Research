"""Build the site's data from the original research files.

Reads the three Play Store review workbooks and the case-study DOCX from the
research folder, and writes:
  src/data/stats.json        numbers and chart series used across the site
  src/content/case.json      the full case study as structured blocks
  public/case/*.png          exhibits extracted from the case study
  public/data/*.csv          anonymised review datasets for download

Personal data is never written: reviewer names, profile images, review IDs,
review URLs and developer replies are dropped, and e-mail addresses, phone
numbers, long numeric IDs and a staff handle are redacted from review text.

Usage:  python scripts/build_data.py [RESEARCH_DIR]   (default: D:/ownly)
"""
import json
import re
import sys
import warnings
from pathlib import Path

import pandas as pd

warnings.filterwarnings("ignore")
ROOT = Path(__file__).resolve().parents[1]
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("D:/ownly")
OUT_DATA = ROOT / "src" / "data"
OUT_CONTENT = ROOT / "src" / "content"
OUT_CASE = ROOT / "public" / "case"
OUT_CSV = ROOT / "public" / "data"
for d in (OUT_DATA, OUT_CONTENT, OUT_CASE, OUT_CSV):
    d.mkdir(parents=True, exist_ok=True)

REDACT = [
    (re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+"), "[email]"),
    (re.compile(r"(?:\+?91[\s-]?)?\b\d{10}\b"), "[phone]"),
    (re.compile(r"\b\d{6,}\b"), "[id]"),
    (re.compile(r"\b[A-Z]{2}_[A-Za-z]+_[A-Z]{2}\b"), "[staff name]"),
    (re.compile(r"(?i)\b(named|name is|agent|executive)\s+[a-z]+(\s+[a-z]+)?(?=\s+(?:reach|said|told|call|from|is|was|has|who)\b)"), r"\1 [name]"),
    (re.compile(r"(?i)\b(named)\s+[a-z]+"), r"\1 [name]"),
    (re.compile(r"(Your captain,\s+)[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?"), r"\1[name]"),
]
# Reviewer display names that are ordinary phrases, not identifying (excluded from the leak check)
COMMON_PHRASE_NAMES = {"for you"}


def clean(text):
    t = "" if pd.isna(text) else str(text)
    for rx, rep in REDACT:
        t = rx.sub(rep, t)
    return t.strip()


def r2(x):
    return None if pd.isna(x) else round(float(x), 2)


# ------------------------------------------------------------------ customer
cust = pd.read_excel(SRC / "ownly_reviews.xlsx", "Review Tags")
cust["txt"] = cust["Review Text"].astype(str).str.lower()
neg = cust[cust.Rating <= 2]
N_NEG = len(neg)
THEMES = [
    ("Support unresponsive", "Support Unresponsive", "recovery"),
    ("Rider / delivery partner", "Rider / Delivery Partner", "other"),
    ("Refund problem", "Refund Problem", "recovery"),
    ("Delivery delay / ETA", "Delivery Delay / ETA", "other"),
    ("Not delivered / false 'Delivered'", "Not Delivered / False 'Delivered'", "severe"),
    ("Cancelled after payment", "Order Cancelled", "severe"),
    ("Food quality / hygiene", "Food Quality / Hygiene", "other"),
    ("Missing / wrong items", "Missing / Wrong Items", "other"),
    ("Payment / COD", "Payment / COD", "other"),
    ("App bugs / forced rating", "App Bugs / Forced Rating", "other"),
    ("First-order experience", "First Order Experience", "other"),
    ("Offer / promo mismatch", "Offers / Promo Mismatch", "other"),
    ("Restaurant selection", "Restaurant Selection", "other"),
    ("Packaging / spillage", "Packaging / Spillage", "other"),
]
themes = []
for label, col, group in THEMES:
    n = int(neg[col].sum())
    themes.append({"theme": label, "group": group, "neg": n, "pct": round(n / N_NEG * 100, 1),
                   "all": int(cust[col].sum()), "avg": r2(cust[cust[col] == 1].Rating.mean())})

sev = (cust["Order Cancelled"] == 1) | (cust["Not Delivered / False 'Delivered'"] == 1)
rec = (cust["Support Unresponsive"] == 1) | (cust["Refund Problem"] == 1)
op = cust["Operational Failure (1/0)"] == 1
negm = cust.Rating <= 2
strict_fraud = cust.txt.str.contains(r"fraud|froud|scam|fake|cheat|chor|loot")
comp = cust["Competitor Mention"] == 1

stages = []
for label, cols in [("Discover & offer", ["Offers / Promo Mismatch"]),
                    ("Order & pay", ["Payment / COD", "App Bugs / Forced Rating"]),
                    ("Restaurant accepts", ["Order Cancelled"]),
                    ("Last-mile delivery", ["Delivery Delay / ETA", "Rider / Delivery Partner", "Not Delivered / False 'Delivered'"]),
                    ("Order receipt", ["Missing / Wrong Items", "Food Quality / Hygiene", "Packaging / Spillage"]),
                    ("Refund & support", ["Support Unresponsive", "Refund Problem"])]:
    m = (cust[cols] == 1).any(axis=1)
    stages.append({"stage": label, "pct": round((m & negm).sum() / N_NEG * 100, 1), "avg": r2(cust[m].Rating.mean()),
                   "afterPayment": label not in ("Discover & offer", "Order & pay")})

recovery = []
for label, col in [("Order cancelled", "Order Cancelled"), ("Not delivered", "Not Delivered / False 'Delivered'"),
                   ("Delivery delay", "Delivery Delay / ETA"), ("Food quality", "Food Quality / Hygiene")]:
    x = cust[cust[col] == 1]
    m = rec[x.index]
    recovery.append({"failure": label, "withSupport": r2(x[m].Rating.mean()), "withSupportN": int(m.sum()),
                     "without": r2(x[~m].Rating.mean()), "withoutN": int((~m).sum())})

pos = cust[(cust.Rating >= 4) & (cust["Word Count"] > 3)]
f5 = cust[cust.Rating == 5]
customer = {
    "n": len(cust), "from": str(cust["Review Date"].min().date()), "to": str(cust["Review Date"].max().date()),
    "avg": r2(cust.Rating.mean()), "neg": N_NEG,
    "ratings": {str(k): int(v) for k, v in cust.Rating.value_counts().sort_index().items()},
    "severe": {"neg": int((sev & negm).sum()), "pct": round((sev & negm).sum() / N_NEG * 100, 1), "avg": r2(cust[sev].Rating.mean())},
    "recoveryNegPct": round((rec & negm).sum() / N_NEG * 100, 1),
    "fraudStrictNeg": int((strict_fraud & negm).sum()),
    "pricePraise": {"reasoned": len(pos), "price": int(pos["Price / No-Fee Value (+)"].sum()),
                    "pct": round(pos["Price / No-Fee Value (+)"].sum() / len(pos) * 100, 1),
                    "negStillPraise": int(neg["Price / No-Fee Value (+)"].sum())},
    "fiveStarShortPct": round((f5["Word Count"] <= 3).mean() * 100, 1),
    "replyRatePct": round(cust["Reply Lag (hrs)"].notna().mean() * 100, 1),
    "replyMedianMin": round(cust["Reply Lag (hrs)"].median() * 60),
    "replyEmailPct": round(cust["Reply Redirects to Email (1/0)"].mean() * 100, 1),
    "thumbsTotal": int(cust["Thumbs Up"].sum()), "thumbsNeg": int(neg["Thumbs Up"].sum()),
    "cascade": [
        {"step": "All 1–2★ reviews", "n": int(negm.sum())},
        {"step": "…describe an operational failure", "n": int((negm & op).sum())},
        {"step": "…and could not get help or a refund", "n": int((negm & op & rec).sum())},
        {"step": "…and use fraud/scam words or name a competitor", "n": int((negm & op & rec & (strict_fraud | comp)).sum())},
    ],
    "themes": themes, "stages": stages, "recovery": recovery,
}

# ------------------------------------------------------------------ captain
cap = pd.read_excel(SRC / "ownly_captain_reviews.xlsx", "Review Tags")
cneg = cap[cap.Rating <= 2]
cthemes = []
for col in ["Onboarding / Verification Delay", "Brand Trust / 'Don't Download'", "Support Unresponsive",
            "App Stability / Login Bugs", "Incentive & Payout Trust", "Order Flow / Dispatch", "City Not Live"]:
    cthemes.append({"theme": col.replace(" / ", " / "), "neg": int(cneg[col].sum()),
                    "pct": round(cneg[col].sum() / len(cneg) * 100, 1), "avg": r2(cap[cap[col] == 1].Rating.mean()),
                    "thumbs": int(cap[cap[col] == 1]["Thumbs Up"].sum())})
w = cap["Stated Wait (days)"].dropna()
burst = cap[cap["5★ Burst-Day Review?"].astype(str).str.lower().isin(["1", "yes", "true"])]
captain = {
    "n": len(cap), "from": str(pd.to_datetime(cap.Date).min().date()), "to": str(pd.to_datetime(cap.Date).max().date()),
    "avg": r2(cap.Rating.mean()), "neg": len(cneg),
    "ratings": {str(k): int(v) for k, v in cap.Rating.value_counts().sort_index().items()},
    "themes": cthemes, "thumbsTotal": int(cap["Thumbs Up"].sum()),
    "wait": {"n": len(w), "median": float(w.median()), "max": float(w.max()), "over30Pct": round((w > 30).mean() * 100),
             "buckets": [{"bucket": lab, "n": int(((w >= a) & (w <= b)).sum())} for a, b, lab in
                         [(0, 3, "0–3"), (4, 7, "4–7"), (8, 14, "8–14"), (15, 30, "15–30"), (31, 60, "31–60"), (61, 9999, "61+")]]},
    "stage": {k: int(v) for k, v in cap["Rider Stage"].value_counts().items()},
    "burst5": len(burst), "all5": int((cap.Rating == 5).sum()), "organicAvg": r2(cap.drop(burst.index).Rating.mean()),
    "replyRatePct": round(cap["Dev Replied?"].mean() * 100, 1),
}

# ------------------------------------------------------------------ restaurant
rest = pd.read_excel(SRC / "ownly_resturant.xlsx", "Data")
rest["d"] = pd.to_datetime(rest.date).dt.date
by_day = rest.groupby("d").size()
burst_days = [d for d, v in by_day.items() if v >= 10]
organic = rest[~rest.d.isin(burst_days)]
issues = rest[rest["Issue Review"].astype(str).str.lower() == "yes"]
restaurant = {
    "n": len(rest), "from": str(min(rest.d)), "to": str(max(rest.d)), "avg": r2(rest.score.mean()),
    "organicAvg": r2(organic.score.mean()), "organicN": len(organic), "issues": len(issues),
    "ratings": {str(k): int(v) for k, v in rest.score.value_counts().sort_index().items()},
    "burstDays": [{"date": str(d), "n": int(by_day[d])} for d in burst_days],
    "themes": [{"theme": k, "n": int(v)} for k, v in issues["Theme (coded)"].value_counts().items()],
    "replyRatePct": round(rest.replyText.notna().mean() * 100, 1),
}

# ------------------------------------------------------------------ cross-app burst series
capd = pd.read_excel(SRC / "ownly_captain_reviews.xlsx", "Data")
capd["d"] = pd.to_datetime(capd.date).dt.date
rng = pd.date_range("2026-05-01", "2026-07-15").date
cser, rser = capd.groupby("d").size(), rest.groupby("d").size()
bursts = [{"date": str(d), "captain": int(cser.get(d, 0)), "restaurant": int(rser.get(d, 0))} for d in rng]

stats = {"customer": customer, "captain": captain, "restaurant": restaurant, "bursts": bursts,
         "total": len(cust) + len(cap) + len(rest),
         "seo": {"visits": "1.1K", "keywords": 163, "brandedTraffic": 155, "nonBranded": 931, "topPagePct": 63.5,
                 "zomato": "67.9M", "swiggy": "15.3M", "date": "2026-10-05"}}
(OUT_DATA / "stats.json").write_text(json.dumps(stats, ensure_ascii=False, indent=1), encoding="utf-8")

# ------------------------------------------------------------------ anonymised CSVs
custd = pd.read_excel(SRC / "ownly_reviews.xlsx", "Data")
theme_cols = [c for _, c, _ in THEMES]
ct = cust[["Review #"] + theme_cols].copy()
out = pd.DataFrame({"date": pd.to_datetime(custd.date).dt.date, "rating": custd.score, "app_version": custd.version,
                    "thumbs_up": custd.thumbsUp, "review_text": custd.text.map(clean)})
out = pd.concat([out.reset_index(drop=True), ct[theme_cols].reset_index(drop=True)], axis=1)
out.to_csv(OUT_CSV / "ownly_customer_reviews_anonymised.csv", index=False, encoding="utf-8-sig")

cap_tags = cap[["Onboarding / Verification Delay", "Support Unresponsive", "App Stability / Login Bugs", "Incentive & Payout Trust",
                "Order Flow / Dispatch", "City Not Live", "Brand Trust / 'Don't Download'", "Rider Stage", "Stated Wait (days)"]]
outc = pd.DataFrame({"date": capd.d, "rating": capd.score, "app_version": capd.version, "thumbs_up": capd.thumbsUp,
                     "review_text": capd.text.map(clean)})
pd.concat([outc.reset_index(drop=True), cap_tags.reset_index(drop=True)], axis=1).to_csv(
    OUT_CSV / "ownly_captain_reviews_anonymised.csv", index=False, encoding="utf-8-sig")

pd.DataFrame({"date": rest.d, "rating": rest.score, "app_version": rest.version, "thumbs_up": rest.thumbsUp,
              "review_text": rest.text.map(clean), "theme": rest["Theme (coded)"], "journey_stage": rest["Journey Stage (coded)"],
              "issue_review": rest["Issue Review"]}).to_csv(OUT_CSV / "ownly_restaurant_partner_reviews_anonymised.csv",
                                                           index=False, encoding="utf-8-sig")

# Safety check: no reviewer names may appear in any CSV
names = set(str(n).strip().lower() for f in ["ownly_reviews.xlsx", "ownly_captain_reviews.xlsx"]
            for n in pd.read_excel(SRC / f, "Data").userName.dropna() if len(str(n).strip()) > 6)
names |= set(str(n).strip().lower() for n in rest.userName.dropna() if len(str(n).strip()) > 6)
for f in OUT_CSV.glob("*.csv"):
    body = f.read_text(encoding="utf-8-sig").lower()
    assert "googleusercontent" not in body, f"image URL leaked in {f.name}"
    leaked = [n for n in names - COMMON_PHRASE_NAMES if n in body]
    assert not leaked, f"{f.name} contains reviewer names: {leaked[:3]}"

# ------------------------------------------------------------------ case study DOCX → blocks
from docx import Document  # noqa: E402
from docx.oxml.ns import qn  # noqa: E402

doc = Document(SRC / "Ownly_PM_Case_Study_Mahesh_Kontham.docx")
BADGE = re.compile(r"\u00a0([A-Z][A-Z -]+[A-Z])\u00a0")


def run_text(p):
    parts = []
    for r in p.runs:
        t = r.text
        if not t:
            continue
        if BADGE.fullmatch(t):
            parts.append("{{" + t.strip("\u00a0") + "}}")
        elif r.bold:
            parts.append("**" + t + "**")
        elif r.italic:
            parts.append("*" + t + "*")
        else:
            parts.append(t)
    s = "".join(parts).replace("****", "")
    return s


img_counter = [0]


def para_images(p):
    out = []
    for blip in p._p.iter(qn("a:blip")):
        rid = blip.get(qn("r:embed"))
        part = doc.part.related_parts[rid]
        img_counter[0] += 1
        name = f"exhibit_{img_counter[0]:02d}.png"
        (OUT_CASE / name).write_bytes(part.blob)
        out.append(name)
    return out


def cell_text(c):
    return "\n".join(run_text(p) for p in c.paragraphs if p.text.strip())


blocks = []
body = doc.element.body
from docx.table import Table  # noqa: E402
from docx.text.paragraph import Paragraph  # noqa: E402

for el in body.iterchildren():
    if el.tag == qn("w:p"):
        p = Paragraph(el, doc)
        style = p.style.name if p.style is not None else ""
        imgs = para_images(p)
        if imgs:
            for i in imgs:
                blocks.append({"t": "img", "src": i})
            continue
        txt = run_text(p).strip()
        if not txt:
            continue
        if style.startswith("Heading 1"):
            m = re.match(r"(\d+)\s+(.*)", p.text.strip())
            blocks.append({"t": "h1", "num": int(m.group(1)) if m else None, "text": m.group(2) if m else p.text.strip()})
        elif style.startswith("Heading 2"):
            blocks.append({"t": "h2", "text": p.text.strip()})
        elif style.startswith("Heading 3"):
            blocks.append({"t": "h3", "text": p.text.strip()})
        elif p._p.pPr is not None and p._p.pPr.numPr is not None:
            ilvl = p._p.pPr.numPr.numId.val if p._p.pPr.numPr.numId is not None else 0
            kind = "ol" if ilvl not in (1,) else "ul"
            blocks.append({"t": "li", "text": txt, "numId": int(ilvl)})
        else:
            italic_caption = all((r.italic or not r.text.strip()) for r in p.runs) and txt.startswith("*Exhibit")
            blocks.append({"t": "caption" if italic_caption else "p", "text": txt.strip("*") if italic_caption else txt})
    elif el.tag == qn("w:tbl"):
        t = Table(el, doc)
        rows = [[cell_text(c) for c in r.cells] for r in t.rows]
        if len(rows) == 1 and len(rows[0]) == 1:
            lines = [run_text(p) for p in t.rows[0].cells[0].paragraphs if p.text.strip()]
            head = lines[0].replace("**", "")
            kind, _, title = head.partition("  ·  ")
            blocks.append({"t": "callout", "kind": kind.strip(), "title": title.strip(), "lines": lines[1:]})
        elif len(rows) == 1:
            blocks.append({"t": "stats", "items": rows[0]})
        else:
            blocks.append({"t": "table", "head": rows[0], "rows": rows[1:]})

# Group list items and attach captions; drop cover + contents
clean_blocks, i = [], 0
start = next(k for k, b in enumerate(blocks) if b["t"] == "h1" and b.get("num") == 2)
blocks = blocks[start:]
while i < len(blocks):
    b = blocks[i]
    if b["t"] == "li":
        items, nid = [], b["numId"]
        while i < len(blocks) and blocks[i]["t"] == "li" and blocks[i]["numId"] == nid:
            items.append(blocks[i]["text"]); i += 1
        clean_blocks.append({"t": "list", "ordered": nid != 1, "items": items})
        continue
    clean_blocks.append(b); i += 1

# Determine which numbering id is bullets: the most common one
from collections import Counter  # noqa: E402
ids = Counter(b["numId"] for b in blocks if b["t"] == "li")
bullet_id = ids.most_common(1)[0][0] if ids else 1
for b in clean_blocks:
    pass
# re-run grouping with the correct bullet id
final, i = [], 0
while i < len(blocks):
    b = blocks[i]
    if b["t"] == "li":
        items, nid = [], b["numId"]
        while i < len(blocks) and blocks[i]["t"] == "li" and blocks[i]["numId"] == nid:
            items.append(blocks[i]["text"]); i += 1
        final.append({"t": "list", "ordered": nid != bullet_id, "items": items})
        continue
    final.append(b); i += 1

sections, cur = [], None
for b in final:
    if b["t"] == "h1":
        cur = {"num": b["num"], "title": b["text"], "blocks": []}
        sections.append(cur)
    elif cur is not None:
        cur["blocks"].append(b)
(OUT_CONTENT / "case.json").write_text(json.dumps(sections, ensure_ascii=False, indent=1), encoding="utf-8")

print(f"stats: {stats['total']} reviews | case sections: {len(sections)} | exhibits: {img_counter[0]} | csv: {len(list(OUT_CSV.glob('*.csv')))}")
