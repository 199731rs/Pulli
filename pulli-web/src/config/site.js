// Business details shown across the site. Edit here, not in components.
export const SITE = {
  brand: 'Pulli',
  tagline: 'Elevating Lifestyles',
  marketedBy: 'Global Marketing',
  address: 'Delhi 110006, India',
  email: 'pullihardware@gmail.com',
  website: 'www.pullihardware.com',
  phone: '', // add when available, e.g. '+91 98xxxxxxxx'
  priceListYear: '2026-27',
}

// Inbox that receives contact-form enquiries. Kept separate from SITE.email,
// which is the public address shown on the site. Temporary: testing inbox.
export const ENQUIRY_EMAIL = 'ratnasingh199731@gmail.com'

// Enquiry form delivery. FormSubmit forwards each submission to ENQUIRY_EMAIL.
// The very first submission triggers a one-time activation email to that
// inbox; click the link in it and every later enquiry arrives normally.
// To use Formspree / Web3Forms instead, replace the endpoint URL.
export const FORM_ENDPOINT = `https://formsubmit.co/ajax/${ENQUIRY_EMAIL}`

export const CATALOGUES = [
  {
    title: 'Architectural Hardware Price List',
    meta: '2026-27 · 143 pages · 31 MB',
    href: '/catalogues/pulli-price-list-2026-27.pdf',
    image: '/img/hero/cabinet.jpg',
  },
  {
    title: 'Premium Bath Collection',
    meta: '2026 · 20 pages · 10 MB',
    href: '/catalogues/pulli-bath-catalogue-2026.pdf',
    image: '/img/hero/rolex-antique.jpg',
  },
]
