export const AMAZON_TAG = 'reconstitutio-20';

export const AFFILIATE_DISCLOSURE =
  'Some links on this site are affiliate links. As an Amazon Associate I earn from qualifying purchases. We may earn a small commission at no extra cost to you if you purchase through these links. This does not influence our content or recommendations.';

// Helper to build an Amazon affiliate link from an ASIN or product URL
export function amazonLink(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

export const SUPPLIES = [
  {
    name: 'Insulin Syringes 1mL 30G (100-Pack)',
    description: '1 mL, 30G, 5/16" (8mm). Individually wrapped. Box of 100.',
    category: 'syringes',
    href: 'https://amzn.to/4dpSsD9',
  },
  {
    name: 'Bacteriostatic Water (BAC)',
    description: '30 mL vials, 0.9% benzyl alcohol. Preferred diluent for multi-use reconstitution.',
    category: 'diluent',
    href: null,
  },
  {
    name: 'Alcohol Prep Pads (70% IPA, 200-Pack)',
    description: 'MED PRIDE sterile, individually wrapped, medical grade 2-ply wipes.',
    category: 'hygiene',
    href: 'https://amzn.to/4c80M86',
  },
  {
    name: 'Sharps Container 5 Qt (2-Pack)',
    description: 'Oakridge Products biohazard needle disposal. Horizontal drop lid, CDC certified.',
    category: 'disposal',
    href: 'https://amzn.to/4v7zfN3',
  },
  {
    name: 'Sharps Container 1 Qt (3-Pack)',
    description: 'Alcedo portable travel-size biohazard needle and syringe disposal.',
    category: 'disposal',
    href: 'https://amzn.to/4sSd8IG',
  },
  {
    name: 'Mixing Syringes (3–5 mL)',
    description: 'With Luer lock and blunt-tip draw needles for reconstitution.',
    category: 'mixing',
    href: null, // Not eligible for Amazon affiliate
  },
  {
    name: 'Vial Labels + Fine-tip Marker',
    description: 'Waterproof labels for recording peptide name, concentration, and date.',
    category: 'labeling',
    href: null,
  },
];

export const SUPPLIER_LINKS = [
  // Add supplier entries as needed — set href to amazonLink('ASIN') or a direct URL
];

// Peptide suppliers — mapped by peptide name (lowercase).
// Each supplier has: name, href (affiliate link), note (optional).
// When a peptide has no specific entry, it falls back to the "default" key.
export const PEPTIDE_SUPPLIERS = {
  default: [
    // Placeholder — add SwissChems and other affiliate links here when approved
    // Example:
    // { name: 'SwissChems', href: 'https://swisschems.is/ref/YOURCODE', note: 'Use code RECONSTITUTION for 10% off' },
  ],
  // Per-peptide overrides (optional):
  // 'bpc-157': [
  //   { name: 'SwissChems', href: 'https://swisschems.is/product/bpc-157?ref=YOURCODE', note: '5mg vial' },
  // ],
};
