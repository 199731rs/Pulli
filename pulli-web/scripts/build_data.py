"""Build src/data/*.json and public/img/* from the Pulli PDFs.

The product rows in scripts/source/*.json were transcribed from the two
image-only PDFs. This script normalises them into one catalogue file and
crops the matching product photos straight out of the PDFs.

Run from the pulli-web folder:  python scripts/build_data.py
Needs: pip install pymupdf pillow
"""
import json, glob, os, re, io
import pymupdf
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "scripts", "source")
OUT_DATA = os.path.join(ROOT, "src", "data")
OUT_IMG = os.path.join(ROOT, "public", "img")
PDF_DIR = os.path.dirname(ROOT)
PDFS = {
    "c": os.path.join(PDF_DIR, "Pulli Bath Catalogue 2026-4_260822_175248.pdf"),
    "p": os.path.join(PDF_DIR, "Pulli Price List_2026-27.pdf"),
    "logo": os.path.join(PDF_DIR, "Pulli Logo 1_250922_185145.pdf"),
}

# ---------- categories ----------
HARDWARE = [
    ("cabinet-handles", "Cabinet Handles", "Cabinet Handle", "Pull handles for wardrobes, kitchens and drawers in zinc, aluminium, brass and SS."),
    ("door-handles", "Main Door Handles", "Door Handle", "Statement pull handles and door knobs for main and interior doors."),
    ("knobs", "Knobs", "Knob", "Drawer and cabinet knobs, from minimal rounds to sculpted designer pieces."),
    ("kadi", "Kadi", "Kadi", "Drawer kadis and ring pulls with a classic touch."),
    ("sliding-handles", "Sliding Handles", "Sliding Handle", "Flush and recessed pulls for sliding wardrobes and doors."),
    ("window-handles", "Window Handles", "Window Handle", "Compact handles for windows and shutters."),
    ("profile-handles", "Profile Handles", "Profile Handle", "Aluminium edge profiles for handle-free modern kitchens."),
    ("hooks", "Hooks & Khuti", "Hook", "Wall hooks, multi-pin khutis and key stands."),
    ("sofa-legs", "Sofa Legs", "Sofa Leg", "Furniture legs in aluminium, SS and wood in many heights."),
    ("door-accessories", "Door Accessories", "Door Accessories", "Door stoppers, magnets, latches, tower bolts, aldrops and more."),
    ("door-closers", "Door Closers", "Door Closer", "Aluminium door closers for smooth, controlled closing."),
]
CAT_ALIASES = {"Door Knob": "Door Handle"}

BATH = [
    ("costa", "Costa", "Round, soft-edged SS 304 accessories in four finishes."),
    ("sofia", "Sofia", "Classic curves with frosted glass details."),
    ("rolex", "Rolex", "Square-profile accessories in CP and Antique."),
    ("octa", "Octa", "Crisp geometric forms in brass and SS."),
    ("racks-shelves", "Racks, Corners & Shelves", "Folding towel racks, glass corners and shelves."),
    ("mirror-cabinets", "Mirror Cabinets", "SS 202 mirror cabinets with generous storage."),
    ("noble-bottles", "Noble Liquid Bottles", "Wall-mounted soap dispensers in four finishes."),
    ("glass-accessories", "Glass & Spares", "Tumblers, soap dishes, dispensers and spare glass."),
]
BATH_BY_SERIES = {
    "Costa": "costa", "Sofia": "sofia", "Rolex": "rolex", "Octa": "octa",
    "Lotus": "racks-shelves", "Folding Rack": "racks-shelves",
    "Mirror Cabinet": "mirror-cabinets", "Noble Liquid Bottles": "noble-bottles",
    "Glass & Other Accessories": "glass-accessories",
}

# ---------- finish families (swatch filter) ----------
FAMILIES = [
    ("chrome", "Chrome", "#d9dde1"),
    ("steel", "Satin & Steel", "#b9bcbd"),
    ("black", "Black", "#24262a"),
    ("gold", "Gold", "#cfa84f"),
    ("rose-gold", "Rose Gold", "#c98c74"),
    ("antique", "Antique & Bronze", "#8a6a3c"),
    ("copper", "Copper", "#b06a3e"),
    ("wood", "Wood", "#7b5134"),
    ("grey", "Grey", "#7d8186"),
    ("colours", "Colours", "conic"),
]
WORDS = {
    "cp": "chrome", "chrome": "chrome",
    "satin": "steel", "ss": "steel", "dss": "steel", "silver": "steel", "mbn": "steel", "steel": "steel",
    "black": "black", "z-black": "black",
    "gold": "gold", "god": "gold",
    "rg": "rose-gold", "rose": "rose-gold",
    "ab": "antique", "a/b": "antique", "antique": "antique", "choco": "antique", "patina": "antique", "brown": "antique",
    "copper": "copper",
    "wood": "wood", "wenge": "wood", "wengy": "wood", "teak": "wood", "walnut": "wood",
    "grey": "grey", "gray": "grey", "iron": "grey",
    "white": "colours", "pink": "colours", "orange": "colours", "blue": "colours", "green": "colours",
    "rainbow": "colours", "multi": "colours", "cola": "colours", "velvet": "colours", "combi": "colours",
}


def families_of(finish):
    if not finish:
        return []
    s = finish.lower().replace("a/b", " ab ").replace("rose gold", "rose")
    out = []
    for w in re.split(r"[\s/,&+()\-]+", s):
        fam = WORDS.get(w)
        if fam and fam not in out:
            out.append(fam)
    return out


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def clean_sizes(sizes, unit):
    if not sizes or all(x is None for x in sizes):
        return [], None
    return [str(x) for x in sizes], unit


# ---------- load ----------
products, dividers, used_imgs = [], [], set()
ids = set()


def unique_id(base):
    i, cand = 2, base
    while cand in ids:
        cand = f"{base}-{i}"
        i += 1
    ids.add(cand)
    return cand


hw_slug = {src: s for s, _, src, _ in HARDWARE}
for f in sorted(glob.glob(os.path.join(SRC, "price_*.json")), key=lambda x: int(re.findall(r"_(\d+)_", x)[0])):
    d = json.load(open(f, encoding="utf-8"))
    for pg in d["pages"]:
        if pg.get("type") == "divider":
            dividers.append({"page": pg["page"], "title": pg.get("title"), "category": hw_slug.get(CAT_ALIASES.get(pg.get("category"), pg.get("category")))})
    for p in d["products"]:
        cat = CAT_ALIASES.get(p["category"], p["category"])
        notes = (p.get("notes") or "")
        sizes, unit = clean_sizes(p.get("sizes"), p.get("sizeUnit"))
        prices = []
        for row in p.get("prices") or []:
            vals = row.get("values") or []
            prices.append({"finish": row.get("finish"), "values": vals})
        if not sizes and prices and max(len(r["values"]) for r in prices) > 1:
            sizes = [f"Option {i+1}" for i in range(max(len(r["values"]) for r in prices))]
        finishes = [r["finish"] for r in prices if r["finish"]]
        fams = []
        for fi in finishes:
            for x in families_of(fi):
                if x not in fams:
                    fams.append(x)
        code = p.get("code") or p.get("name")
        img = p.get("image")
        if img:
            used_imgs.add(img)
        products.append({
            "id": unique_id(slug(code)),
            "code": code,
            "name": p.get("name"),
            "line": "hardware",
            "category": hw_slug[cat],
            "material": p.get("material"),
            "sizes": sizes,
            "sizeUnit": unit,
            "prices": prices,
            "finishes": finishes,
            "families": fams,
            "priceBasis": "pair" if re.search(r"per pair", notes, re.I) else "piece",
            "image": img and f"/img/products/{img}",
            "page": p["page"],
        })

d = json.load(open(os.path.join(SRC, "cat.json"), encoding="utf-8"))
bath_pages = {pg["page"]: pg for pg in d["pages"]}
for p in d["products"]:
    cat = BATH_BY_SERIES[p["series"]]
    finish = p.get("finish")
    sizes, prices = [], []
    if p.get("mrp"):
        variants = [m.get("variant") for m in p["mrp"]]
        if any(variants):
            sizes = [v or "Standard" for v in variants]
        prices = [{"finish": finish or "Standard", "values": [m.get("price") for m in p["mrp"]]}]
    elif p.get("prices"):
        prices = p["prices"]
        sizes = [str(s) for s in (p.get("sizes") or [])]
    name = p.get("name") or "Product"
    code = p.get("code")
    imgs = p.get("images") or ([p["image"]] if p.get("image") else [])
    used_imgs.update(imgs)
    finishes = [r["finish"] for r in prices if r.get("finish")]
    fams = []
    for fi in finishes:
        for x in families_of(fi):
            if x not in fams:
                fams.append(x)
    products.append({
        "id": unique_id(slug(f"{code or name}-{finish or ''}")),
        "code": code,
        "name": name,
        "line": "bath",
        "category": cat,
        "series": p["series"],
        "material": p.get("material"),
        "sizes": sizes,
        "sizeUnit": None,
        "prices": prices,
        "finishes": finishes,
        "families": fams,
        "priceBasis": "mrp",
        "image": imgs and f"/img/products/{imgs[0]}",
        "images": [f"/img/products/{i}" for i in imgs],
        "page": p["page"],
    })

# ---------- MVP selection ----------
# The MVP site shows a curated mix from both PDFs. Set MVP = False to publish
# the full transcribed catalogue (574 products).
MVP = True
MVP_IDS = [
    # architectural hardware (price list)
    "ch-252", "ch-crown", "gd-350", "sh-285", "knob-507", "pride-kadi", "pencil-leg", "ds-royal",
    # bath collection (bath catalogue)
    "cog-006-pvd-gold", "cobm-011-black-matt", "roab-006-antique", "oc-009-cp",
    "nlr-001-pvd-rose-gold", "mirror-cabinet-big-cp", "lotus-round-corner-cp-z-black-pvd-gold-pvd-rose-gold",
]
# Full catalogue is always archived (not deployed) for when the site grows.
ARCHIVE = os.path.join(ROOT, "full-catalogue")
full_products, full_imgs = products, set(used_imgs)
if MVP:
    keep = {p["id"]: p for p in products}
    products = [keep[i] for i in MVP_IDS]
    used_imgs = {os.path.basename(u) for p in products for u in (p.get("images") or [p["image"]]) if u}

# ---------- images ----------
def page_boxes(page):
    pa = page.rect.width * page.rect.height
    boxes = []
    for info in page.get_image_info():
        r = pymupdf.Rect(info["bbox"]) & page.rect
        if r.width < 60 or r.height < 60 or r.width * r.height > 0.6 * pa:
            continue
        if any(abs(r.x0 - b.x0) < 3 and abs(r.y0 - b.y0) < 3 for b in boxes):
            continue
        boxes.append(r)
    boxes.sort(key=lambda r: (round(r.y0 / 20), r.x0))
    return boxes


def save_jpg(pix, path, max_w=None):
    im = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
    if max_w and im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(path, "JPEG", quality=80, optimize=True, progressive=True)


docs = {k: pymupdf.open(v) for k, v in PDFS.items()}
os.makedirs(os.path.join(OUT_IMG, "products"), exist_ok=True)
os.makedirs(os.path.join(OUT_IMG, "hero"), exist_ok=True)
# Catalogue photos carry printed captions along the bottom (code, name, M.R.P.)
# and a sliver of page background at the edges; trim both off.
CAPTION_TRIM = {"c": 0.17, "p": 0.11}


def trimmed(r, key):
    w, h = r.width, r.height
    return pymupdf.Rect(r.x0 + w * 0.02, r.y0 + h * 0.02, r.x1 - w * 0.02, r.y1 - h * CAPTION_TRIM[key])


def export_photos(names, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    by_page = {}
    for name in names:
        m = re.match(r"([cp])(\d{3})_(\d+)\.jpg", name)
        by_page.setdefault((m[1], int(m[2])), []).append((int(m[3]), name))
    for (k, pno), items in by_page.items():
        page = docs[k][pno - 1]
        boxes = page_boxes(page)
        for idx, name in items:
            out = os.path.join(out_dir, name)
            save_jpg(page.get_pixmap(dpi=144, clip=trimmed(boxes[idx - 1], k)), out, max_w=900)


export_photos(used_imgs, os.path.join(OUT_IMG, "products"))
export_photos(full_imgs, os.path.join(ARCHIVE, "img", "products"))
with open(os.path.join(ARCHIVE, "products-full.json"), "w", encoding="utf-8") as fh:
    json.dump(full_products, fh, ensure_ascii=False, indent=1)

# hero photos: (key, pdf, page, which box; None = largest image incl. full-page)
HEROES = [
    ("cabinet", "p", 3, 1), ("sliding", "p", 50, 1), ("knob-kadi", "p", 61, 1),
    ("main-door", "p", 85, 1), ("khuti", "p", 118, 1), ("door-accessories", "p", 134, 1),
    ("packaging", "p", 142, None), ("bath-model", "c", 2, None),
    ("rolex-antique", "c", 10, 1), ("glass", "c", 17, 1), ("bath-room", "c", 20, None),
]
for key, k, pno, idx in HEROES:
    page = docs[k][pno - 1]
    if idx:
        r = page_boxes(page)[idx - 1]
        # divider photos have a teal accent bar printed on their left edge
        r = pymupdf.Rect(r.x0 + r.width * 0.045, r.y0, r.x1, r.y1)
    else:
        infos = sorted(page.get_image_info(), key=lambda i: -(pymupdf.Rect(i["bbox"]) & page.rect).get_area())
        r = pymupdf.Rect(infos[0]["bbox"]) & page.rect
    save_jpg(page.get_pixmap(dpi=220, clip=r), os.path.join(OUT_IMG, "hero", f"{key}.jpg"), max_w=1800)

# logo: navy original + white version for dark backgrounds
lp = docs["logo"][0]
pix = lp.get_pixmap(dpi=600, alpha=True)
im = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGBA")
im = im.crop(im.getbbox())
im.thumbnail((900, 900), Image.LANCZOS)
im.save(os.path.join(OUT_IMG, "pulli-logo.png"), optimize=True)
r, g, b, a = im.split()
white = Image.merge("RGBA", (a.point(lambda _: 255), a.point(lambda _: 255), a.point(lambda _: 255), a))
white.save(os.path.join(OUT_IMG, "pulli-logo-white.png"), optimize=True)

# ---------- write data ----------
counts = {}
for p in products:
    counts[p["category"]] = counts.get(p["category"], 0) + 1


def cover_for(cat):
    first = next((p for p in products if p["category"] == cat and p["image"]), None)
    return first and first["image"]


catalogue = {
    "hardware": [{"slug": s, "name": n, "blurb": b, "count": counts[s], "cover": cover_for(s)} for s, n, _, b in HARDWARE if counts.get(s)],
    "bath": [{"slug": s, "name": n, "blurb": b, "count": counts[s], "cover": cover_for(s)} for s, n, b in BATH if counts.get(s)],
    "families": [
        {"slug": s, "name": n, "swatch": c, "count": cnt}
        for s, n, c in FAMILIES
        if (cnt := sum(1 for p in products if s in p["families"]))
    ],
}
with open(os.path.join(OUT_DATA, "products.json"), "w", encoding="utf-8") as fh:
    json.dump(products, fh, ensure_ascii=False, separators=(",", ":"))
with open(os.path.join(OUT_DATA, "catalogue.json"), "w", encoding="utf-8") as fh:
    json.dump(catalogue, fh, ensure_ascii=False, indent=1)
print(len(products), "products,", len(used_imgs), "images")
print({c["slug"]: c["count"] for c in catalogue["hardware"] + catalogue["bath"]})
print({f["slug"]: f["count"] for f in catalogue["families"]})
print("no family:", sum(1 for p in products if not p["families"]))
