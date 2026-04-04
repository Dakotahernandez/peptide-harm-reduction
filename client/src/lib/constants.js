export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD ? 'https://api.reconstitutionsafety.com' : 'http://localhost:8000');

export const SYRINGE_PROFILES = [
  { id: 'u100-1ml', label: 'U-100 1.0 mL (100 units)', max_ml: 1, max_units: 100, major_tick_units: 10 },
  { id: 'u100-05ml', label: 'U-100 0.5 mL (50 units)', max_ml: 0.5, max_units: 50, major_tick_units: 10 },
  { id: 'u100-03ml', label: 'U-100 0.3 mL (30 units)', max_ml: 0.3, max_units: 30, major_tick_units: 5 },
];

export const DEFAULT_LEGAL_FOOTER = [
  'This site and its calculators are provided for educational and harm-reduction purposes only. They are not medical advice, diagnosis, or treatment.',
  'No clinician-patient relationship is created. Consult a licensed clinician for personalized guidance.',
  'If you think you may be experiencing a medical emergency, call 911 (US) or your local emergency number.',
  'Information may be incomplete or incorrect and can change over time. You are responsible for verifying units, concentration, sterility, and legality before acting.',
  'External links and citations are provided for reference only. The operators do not control or endorse third-party content.',
  "The site is provided 'as-is' without warranties. To the maximum extent permitted by law, the operators disclaim liability for any injury, loss, or damages arising from use of this site.",
];

export const OFFLINE_PEPTIDES = [
  {
    id: 'demo-bpc',
    name: 'BPC-157',
    aka: ['Body Protection Compound'],
    category: 'Protective peptide',
    vial_amount_mg: 5,
    typical_diluent_ml: 2,
    storage: 'Refrigerate 2–8°C; protect from light once mixed.',
    typical_protocols: ['Daily'],
    notes: ['Demo data: common research ranges 250–500 mcg per administration.'],
    benefits: ['Tissue protection in preclinical models'],
    side_effects: ['Injection site irritation'],
    citations: {
      'Refrigerate 2–8°C; protect from light once mixed.': [
        { title: 'AAPPTEC: Handling and Storage of Peptides', url: 'https://www.peptide.com/faqs/handling-and-storage-of-peptides/' },
      ],
      Daily: [{ title: 'PubMed search: BPC-157', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157' }],
      'Demo data: common research ranges 250–500 mcg per administration.': [
        { title: 'PubMed search: BPC-157', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157' },
      ],
      'Tissue protection in preclinical models': [
        { title: 'PubMed search: BPC-157', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157' },
      ],
      'Injection site irritation': [
        { title: 'GenScript: Peptide Storage and Handling Guidelines', url: 'https://www.genscript.com/peptide_storage_and_handling.html' },
      ],
    },
  },
  {
    id: 'demo-ipamorelin',
    name: 'Ipamorelin',
    aka: [],
    category: 'GHRP',
    vial_amount_mg: 2,
    typical_diluent_ml: 2,
    storage: 'Store lyophilized and reconstituted at 2–8°C.',
    typical_protocols: ['Daily'],
    notes: ['Demo data: often researched 100–300 mcg per administration.'],
    benefits: ['Selective GH pulse support'],
    side_effects: ['Hunger, flushing'],
    citations: {
      'Store lyophilized and reconstituted at 2–8°C.': [
        { title: 'Bachem: Reconstitution of Peptides', url: 'https://www.bachem.com/knowledge-center/technologies/reconstitution-of-peptides/' },
      ],
      Daily: [{ title: 'PubMed search: Ipamorelin', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Ipamorelin' }],
      'Demo data: often researched 100–300 mcg per administration.': [
        { title: 'PubMed search: Ipamorelin', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Ipamorelin' },
      ],
      'Selective GH pulse support': [
        { title: 'PubMed search: Ipamorelin', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Ipamorelin' },
      ],
      'Hunger, flushing': [
        { title: 'PubMed search: Ipamorelin', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Ipamorelin' },
      ],
    },
  },
  {
    id: 'demo-semaglutide',
    name: 'Semaglutide',
    aka: ['GLP-1 analog'],
    category: 'Metabolic peptide',
    vial_amount_mg: 5,
    typical_diluent_ml: 2,
    storage: 'Keep 2–8°C; avoid light after mixing.',
    typical_protocols: ['Once weekly'],
    notes: ['Demo data: long half-life; once-weekly research dosing paradigms.'],
    benefits: ['Appetite and glycemic modulation research'],
    side_effects: ['Nausea, GI upset'],
    citations: {
      'Keep 2–8°C; avoid light after mixing.': [
        { title: 'DailyMed: Ozempic (semaglutide) label', url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=adec4fd2-6858-4c99-91d4-531f5f2a2d79' },
      ],
      'Once weekly': [
        { title: 'DailyMed: Ozempic (semaglutide) label', url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=adec4fd2-6858-4c99-91d4-531f5f2a2d79' },
      ],
      'Demo data: long half-life; once-weekly research dosing paradigms.': [
        { title: 'DailyMed: Ozempic (semaglutide) label', url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=adec4fd2-6858-4c99-91d4-531f5f2a2d79' },
      ],
      'Appetite and glycemic modulation research': [
        { title: 'PubMed search: Semaglutide', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Semaglutide' },
      ],
      'Nausea, GI upset': [
        { title: 'DailyMed: Ozempic (semaglutide) label', url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=adec4fd2-6858-4c99-91d4-531f5f2a2d79' },
      ],
    },
  },
];

export const OFFLINE_DISCLAIMER = {
  title: 'Offline demo mode',
  body: 'Backend unreachable. Showing demo peptides and local-only calculations. Research use only; this is not medical advice.',
  legal_footer: DEFAULT_LEGAL_FOOTER,
};
