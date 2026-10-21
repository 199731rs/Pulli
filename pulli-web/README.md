# Pulli website (React)

Static showcase site for Pulli architectural hardware and the premium bath collection.
Built with Vite 4 + React 18 + React Router 6 (works on Node 16+).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

Deploy `dist/` to Netlify (the `public/_redirects` file handles page refreshes on deep links) or any static host.

## Where things live

| Path | What |
|---|---|
| `src/config/site.js` | Contact details, enquiry form endpoint, catalogue downloads. **Edit here first.** |
| `src/data/products.json` | Products shown on the site (generated, do not hand edit) |
| `src/data/catalogue.json` | Categories and finish families (generated) |
| `src/lib/catalogue.js` | Data helpers: lookups, price formatting, search, filters |
| `src/context/EnquiryContext.jsx` | Enquiry list (saved in the visitor's browser) |
| `src/pages/` | Home, Collections, Category, Product, Finishes, Search, About, Contact |
| `src/components/` | Header, Footer, ProductCard, ProductBrowser, PriceTable, EnquiryDrawer… |
| `public/img/` | Logo, hero photos, MVP product photos |
| `public/catalogues/` | The two PDFs offered for download |
| `full-catalogue/` | **Archive, not deployed.** All 570 product photos + `products-full.json` (574 products) |
| `scripts/source/` | Product rows transcribed from the PDFs |
| `scripts/build_data.py` | Regenerates data + images from the PDFs |

## MVP vs full catalogue

The MVP shows 15 curated products (8 hardware, 7 bath) across 13 categories. To change the
selection, edit `MVP_IDS` in `scripts/build_data.py`. To publish everything, set `MVP = False`.
Then run:

```bash
pip install pymupdf pillow
python scripts/build_data.py
```

The script reads the PDFs from the parent folder (`../Pulli Price List_2026-27.pdf` etc.).

## Enquiry form

Submissions are sent with FormSubmit to the email in `src/config/site.js`. The **first** submission
sends a one-time activation email to that inbox. Click the link in it, and every later enquiry arrives
as a normal email with the visitor's details and their product list. To use Formspree or Web3Forms
instead, change `FORM_ENDPOINT`.

## Before going live

- Add a phone number in `src/config/site.js` (left blank, none was in the PDFs).
- Confirm the inbox for enquiries and activate FormSubmit (see above).
- Spot-check prices against the printed price list; they were transcribed from the PDF images.
- The price-list PDF is 31 MB; consider a compressed version for the download link.
