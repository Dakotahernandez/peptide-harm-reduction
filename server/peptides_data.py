from __future__ import annotations

from typing import List, Optional
from urllib.parse import quote_plus

from pydantic import PositiveFloat

from models import Citation, Peptide

AAPPTEC_HANDLING = Citation(
    title="AAPPTEC: Handling and Storage of Peptides",
    url="https://www.peptide.com/faqs/handling-and-storage-of-peptides/",
)
GENSCRIPT_STORAGE = Citation(
    title="GenScript: Peptide Storage and Handling Guidelines",
    url="https://www.genscript.com/peptide_storage_and_handling.html",
)
BACHEM_RECONSTITUTION = Citation(
    title="Bachem: Reconstitution of Peptides",
    url="https://www.bachem.com/knowledge-center/technologies/reconstitution-of-peptides/",
)

DAILYMED_OZEMPIC = Citation(
    title="DailyMed: Ozempic (semaglutide) label",
    url="https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=adec4fd2-6858-4c99-91d4-531f5f2a2d79",
)
DAILYMED_ZEPBOUND = Citation(
    title="DailyMed: Zepbound (tirzepatide) label",
    url="https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=487cd7e7-434c-4925-99fa-aa80b1cc776b",
)
DAILYMED_VYLEESI = Citation(
    title="DailyMed: Vyleesi (bremelanotide) label",
    url="https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f1d0c1b5-2f39-4bad-a6a4-0066e3ad5dcf",
)


def pubmed_search(term: str) -> Citation:
    return Citation(
        title=f"PubMed search: {term}",
        url=f"https://pubmed.ncbi.nlm.nih.gov/?term={quote_plus(term)}",
    )


def build_citations(
    *,
    storage: str,
    typical_protocols: List[str],
    notes: List[str],
    benefits: List[str],
    side_effects: List[str],
    storage_citations: List[Citation],
    default_citations: List[Citation],
    protocol_citations: Optional[List[Citation]] = None,
) -> dict[str, List[Citation]]:
    citations: dict[str, List[Citation]] = {
        storage: storage_citations,
    }
    for fact in notes + benefits + side_effects:
        citations[fact] = default_citations
    protocol_sources = default_citations if protocol_citations is None else protocol_citations
    for protocol in typical_protocols:
        citations[protocol] = protocol_sources
    return citations


def load_peptides() -> List[Peptide]:
    storage_sources = [AAPPTEC_HANDLING, GENSCRIPT_STORAGE, BACHEM_RECONSTITUTION]

    bpc_sources = [pubmed_search("BPC-157")]
    bpc_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C and protect from light."
    bpc_protocols = ["Daily"]
    bpc_notes = [
        "Common research dose ranges 250-500 mcg per administration.",
        "Use insulin syringes for subcutaneous research to improve volume accuracy.",
    ]
    bpc_benefits = [
        "Tissue protection and gut mucosa support in preclinical models",
        "May aid soft-tissue recovery in research settings",
    ]
    bpc_side_effects = [
        "Transient injection site irritation",
        "Limited human data; monitor for unexpected reactions",
    ]

    tb_sources = [pubmed_search("Thymosin beta-4")]
    tb_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C; avoid repeated freeze-thaw."
    tb_protocols = ["Once weekly", "Twice weekly"]
    tb_notes = [
        "Research ranges often 2-5 mg per week split into multiple administrations.",
        "Some researchers rotate injection sites to reduce irritation.",
    ]
    tb_benefits = [
        "May support angiogenesis and soft-tissue healing in animal studies",
        "Potential mobility support post-exercise in research contexts",
    ]
    tb_side_effects = [
        "Injection site redness",
        "Possible lethargy or headache reported anecdotally",
    ]

    ipa_sources = [pubmed_search("Ipamorelin")]
    ipa_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    ipa_protocols = ["Daily"]
    ipa_notes = [
        "Often researched in the 100-300 mcg range per administration.",
        "Researchers avoid mixing with alcohol-based diluents to protect peptide integrity.",
    ]
    ipa_benefits = [
        "Selective GH pulse stimulation with low effect on prolactin and cortisol",
        "Often explored for lean mass and recovery support in research",
    ]
    ipa_side_effects = [
        "Transient hunger or lightheadedness after administration",
        "Rare flushing or tingling",
    ]

    cjc_no_dac_sources = [pubmed_search("MOD GRF 1-29")]
    cjc_no_dac_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    cjc_no_dac_protocols = ["Daily"]
    cjc_no_dac_notes = [
        "Often paired with a GHRP like Ipamorelin in research protocols.",
        "Shorter half-life compared to DAC version; some divide daily administrations.",
    ]
    cjc_no_dac_benefits = [
        "Short-acting GHRH analog for physiologic GH pulses",
        "Commonly combined with GHRPs in studies",
    ]
    cjc_no_dac_side_effects = [
        "Flushing or warmth",
        "Potential water retention at higher research doses",
    ]

    cjc_dac_sources = [pubmed_search("CJC-1295")]
    cjc_dac_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    cjc_dac_protocols = ["Once weekly"]
    cjc_dac_notes = [
        "Longer half-life due to DAC; research dosing commonly 1-2 mg weekly.",
        "Roll vial gently after adding diluent to reduce foaming.",
    ]
    cjc_dac_benefits = [
        "Sustained GH/IGF-1 elevation in research models",
        "Lower injection frequency than no-DAC variant",
    ]
    cjc_dac_side_effects = [
        "Possible water retention and joint stiffness",
        "Flushing or injection site irritation",
    ]

    serm_sources = [pubmed_search("Sermorelin")]
    serm_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    serm_protocols = ["Daily"]
    serm_notes = [
        "Research ranges often 200-500 mcg per administration.",
        "Some researchers administer pre-bed to align with natural GH pulses.",
    ]
    serm_benefits = [
        "Stimulates endogenous GH release in a pulsatile manner",
        "Short half-life allows timing with circadian GH peaks",
    ]
    serm_side_effects = [
        "Flushing or transient headache",
        "Injection site redness",
    ]

    ghrp2_sources = [pubmed_search("GHRP-2")]
    ghrp2_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    ghrp2_protocols = ["Daily"]
    ghrp2_notes = [
        "Research doses often 100-300 mcg per administration.",
        "May cause transient hunger; plan timing accordingly in research settings.",
    ]
    ghrp2_benefits = [
        "Robust GH pulse with relatively predictable profile",
        "Often used to study appetite and GH dynamics",
    ]
    ghrp2_side_effects = [
        "Hunger surge",
        "Possible water retention and numbness/tingling",
    ]

    ghrp6_sources = [pubmed_search("GHRP-6")]
    ghrp6_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    ghrp6_protocols = ["Daily"]
    ghrp6_notes = [
        "Research doses often 100-300 mcg per administration.",
        "Known to increase appetite; researchers monitor caloric intake effects.",
    ]
    ghrp6_benefits = [
        "Strong GH pulse and appetite stimulation (ghrelin mimetic)",
        "Studied for gastric motility and metabolic effects",
    ]
    ghrp6_side_effects = [
        "Marked hunger and stomach rumbling",
        "Possible water retention and flushing",
    ]

    hexa_sources = [pubmed_search("Hexarelin")]
    hexa_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    hexa_protocols = ["Daily"]
    hexa_notes = [
        "Researchers often limit cycle length to reduce tachyphylaxis.",
        "Use gentle swirling to mix; avoid vigorous shaking.",
    ]
    hexa_benefits = [
        "Potent GH pulse; longer half-life than some GHRPs",
        "Used to study cardiac and metabolic endpoints",
    ]
    hexa_side_effects = [
        "Possible cortisol/prolactin elevation at higher doses",
        "Joint stiffness or water retention",
    ]

    aod_sources = [pubmed_search("AOD-9604")]
    aod_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    aod_protocols = ["Daily"]
    aod_notes = [
        "Often researched at 250-500 mcg per administration.",
        "Researchers avoid freezing reconstituted solutions to maintain integrity.",
    ]
    aod_benefits = [
        "Investigated for lipolysis signaling without GH effects",
        "Fragment of hGH focusing on fat metabolism pathways",
    ]
    aod_side_effects = [
        "Nausea or headache in some reports",
        "Limited human safety data; monitor carefully",
    ]

    mt2_sources = [pubmed_search("Melanotan II")]
    mt2_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C and protect from light."
    mt2_protocols = ["Daily"]
    mt2_notes = [
        "Test spots for skin reaction before broader application.",
        "Researchers minimize light exposure post-reconstitution to reduce degradation.",
    ]
    mt2_benefits = [
        "Potent melanocortin agonist; studied for pigmentation",
        "May influence libido and appetite in research",
    ]
    mt2_side_effects = [
        "Flushing, nausea, darkening of existing moles/freckles",
        "Possible increased blood pressure transiently",
    ]

    pt141_sources = [pubmed_search("Bremelanotide"), DAILYMED_VYLEESI]
    pt141_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    pt141_protocols = ["As needed"]
    pt141_notes = [
        "Research doses often 1-2 mg per administration.",
        "Some researchers report flushing; observe and document responses.",
    ]
    pt141_benefits = [
        "Melanocortin agonist investigated for libido and arousal",
        "Non-NO pathway; distinct from PDE5 mechanisms",
    ]
    pt141_side_effects = [
        "Nausea, flushing, headache",
        "Transient blood pressure increases reported clinically",
    ]

    kpv_sources = [pubmed_search("KPV Lys-Pro-Val peptide")]
    kpv_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    kpv_protocols = ["Daily"]
    kpv_notes = [
        "Small tri-peptide; handle gently to avoid adsorption losses.",
        "Often researched for topical or systemic anti-inflammatory properties.",
    ]
    kpv_benefits = [
        "Alpha-MSH fragment studied for anti-inflammatory properties",
        "Potential gut barrier support in preclinical work",
    ]
    kpv_side_effects = [
        "Minimal reported; monitor for hypersensitivity",
    ]

    selank_sources = [pubmed_search("Selank")]
    selank_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    selank_protocols = ["Daily"]
    selank_notes = [
        "Some researchers use intranasal routes; sterile technique still applies.",
        "Avoid repeated freeze-thaw of reconstituted solution.",
    ]
    selank_benefits = [
        "Heptapeptide studied for anxiolytic and cognitive effects",
        "May modulate BDNF expression in models",
    ]
    selank_side_effects = [
        "Nasal irritation if used intranasally",
        "Rare headache or fatigue",
    ]

    semax_sources = [pubmed_search("Semax")]
    semax_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    semax_protocols = ["Daily"]
    semax_notes = [
        "Intranasal research is common; use sterile atomizers if applicable.",
        "Protect from light after mixing to reduce oxidation.",
    ]
    semax_benefits = [
        "ACTH(4-10) analog studied for neuroprotective effects",
        "May support focus and working memory in research",
    ]
    semax_side_effects = [
        "Nasal dryness or irritation",
        "Occasional headache or anxiety in some reports",
    ]

    dsip_sources = [pubmed_search("Delta sleep-inducing peptide")]
    dsip_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    dsip_protocols = ["Daily"]
    dsip_notes = [
        "Research doses often 100-300 mcg per administration.",
        "Document sleep/wake timing when studying effects.",
    ]
    dsip_benefits = [
        "Studied for modulation of sleep architecture",
        "May influence stress-response markers in models",
    ]
    dsip_side_effects = [
        "Drowsiness or vivid dreams",
        "Headache in some reports",
    ]

    folli_sources = [pubmed_search("Follistatin 344")]
    folli_storage = "Store lyophilized at -20°C long term; 2-8°C short term; reconstituted 2-8°C."
    folli_protocols = ["Once weekly"]
    folli_notes = [
        "Handle gently; avoid foaming to protect tertiary structure.",
        "Label with peptide name and concentration; handle gently after mixing.",
    ]
    folli_benefits = [
        "Myostatin-binding properties studied for muscle accrual",
        "Potential regenerative applications in preclinical data",
    ]
    folli_side_effects = [
        "Limited human data; monitor liver/kidney markers in research",
        "Injection site irritation",
    ]

    peg_mgf_sources = [pubmed_search("PEG-MGF")]
    peg_mgf_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    peg_mgf_protocols = ["Mon / Wed / Fri"]
    peg_mgf_notes = [
        "Often researched post-resistance exercise; timing is noted in logs.",
        "PEGylation extends half-life; dose frequency may be lower than MGF.",
    ]
    peg_mgf_benefits = [
        "IGF variant researched for muscle repair signaling",
        "PEGylation prolongs exposure for convenience in studies",
    ]
    peg_mgf_side_effects = [
        "Potential hypoglycemia-like symptoms; monitor glucose",
        "Water retention possible",
    ]

    igf_lr3_sources = [pubmed_search("IGF-1 LR3")]
    igf_lr3_storage = "Store lyophilized at -20°C long term; 2-8°C short term; reconstituted 2-8°C."
    igf_lr3_protocols = ["Daily"]
    igf_lr3_notes = [
        "Researchers often use acetic acid or bacteriostatic water; follow supplier guidance.",
        "Track glucose levels in research where relevant due to insulin-like activity.",
    ]
    igf_lr3_benefits = [
        "Extended-acting IGF-1 analog studied for hypertrophy and repair",
        "Reduced binding to IGFBPs increases bioavailability",
    ]
    igf_lr3_side_effects = [
        "Hypoglycemia risk; monitor glucose in research",
        "Injection site irritation",
    ]

    mots_sources = [pubmed_search("MOTS-c")]
    mots_storage = "Store lyophilized at -20°C long term; 2-8°C short term; reconstituted 2-8°C."
    mots_protocols = ["Twice weekly"]
    mots_notes = [
        "Research doses vary; log timing relative to meals and exercise.",
        "Avoid repeated freeze-thaw; aliquot if needed.",
    ]
    mots_benefits = [
        "Mitochondrial-derived peptide studied for metabolic regulation",
        "May influence exercise tolerance in preclinical work",
    ]
    mots_side_effects = [
        "Transient fatigue or nausea reported anecdotally",
        "Limited human safety data",
    ]

    aod_hc_sources = [pubmed_search("AOD-9604")]
    aod_hc_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    aod_hc_protocols = ["Daily"]
    aod_hc_notes = [
        "Higher-mass vial for extended study durations.",
        "Calculate concentration carefully; label vials with mg/mL post-reconstitution.",
    ]
    aod_hc_benefits = [
        "Same fragment mechanism as AOD-9604 with higher total mass per vial",
        "Useful for longer study durations without reordering",
    ]
    aod_hc_side_effects = [
        "Nausea or headache in some reports",
        "Limited clinical safety data; monitor closely",
    ]

    sema_sources = [pubmed_search("Semaglutide"), DAILYMED_OZEMPIC]
    sema_storage = "Store lyophilized at 2-8°C; protect from light. Reconstituted: 2-8°C."
    sema_protocols = ["Once weekly"]
    sema_notes = [
        "Research often tracks glucose, appetite, and nausea; titrate slowly in study protocols.",
        "Roll vial gently after diluent to avoid foaming; label with concentration.",
    ]
    sema_benefits = [
        "GLP-1 analog studied for glycemic control and appetite modulation",
        "Long half-life enables once-weekly research dosing paradigms",
    ]
    sema_side_effects = [
        "Nausea, vomiting, or diarrhea—especially during titration",
        "Risk of hypoglycemia when combined with other glucose-lowering agents",
    ]

    tirz_sources = [pubmed_search("Tirzepatide"), DAILYMED_ZEPBOUND]
    tirz_storage = "Store lyophilized at 2-8°C; reconstituted solution 2-8°C."
    tirz_protocols = ["Once weekly"]
    tirz_notes = [
        "Dual agonist; researchers monitor GI effects and glucose closely.",
        "Dose escalations in studies are typically gradual to improve tolerability.",
    ]
    tirz_benefits = [
        "Dual GIP/GLP-1 agonist studied for weight and glycemic control",
        "May improve insulin sensitivity markers in research",
    ]
    tirz_side_effects = [
        "GI effects (nausea, diarrhea, constipation) common during titration",
        "Potential hypoglycemia when combined with insulin/secretagogues",
    ]

    reta_sources = [pubmed_search("Retatrutide")]
    reta_storage = "Store lyophilized at 2-8°C; protect from light; reconstituted 2-8°C."
    reta_protocols = ["Once weekly"]
    reta_notes = [
        "Emerging research compound; human data are limited—document all observations carefully.",
        "Start with very small research doses and gradual titration; monitor glucose and GI responses.",
    ]
    reta_benefits = [
        "Triple agonist (GIP/GLP-1/GCGR) under investigation for weight and metabolic outcomes",
        "Early data suggest potent appetite and glycemic effects",
    ]
    reta_side_effects = [
        "GI upset, nausea, diarrhea possible especially early in titration",
        "Potential hypoglycemia when combined with other glucose-lowering agents",
    ]

    return [
        Peptide(
            id="bpc-157",
            name="BPC-157",
            aka=["Body Protection Compound"],
            category="Protective peptide",
            vial_amount_mg=PositiveFloat(5.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=bpc_storage,
            typical_protocols=bpc_protocols,
            notes=bpc_notes,
            benefits=bpc_benefits,
            side_effects=bpc_side_effects,
            citations=build_citations(
                storage=bpc_storage,
                typical_protocols=bpc_protocols,
                notes=bpc_notes,
                benefits=bpc_benefits,
                side_effects=bpc_side_effects,
                storage_citations=storage_sources,
                default_citations=bpc_sources,
            ),
        ),
        Peptide(
            id="tb-500",
            name="TB-500",
            aka=["Thymosin Beta-4"],
            category="Regenerative peptide",
            vial_amount_mg=PositiveFloat(5.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=tb_storage,
            typical_protocols=tb_protocols,
            notes=tb_notes,
            benefits=tb_benefits,
            side_effects=tb_side_effects,
            citations=build_citations(
                storage=tb_storage,
                typical_protocols=tb_protocols,
                notes=tb_notes,
                benefits=tb_benefits,
                side_effects=tb_side_effects,
                storage_citations=storage_sources,
                default_citations=tb_sources,
            ),
        ),
        Peptide(
            id="ipamorelin",
            name="Ipamorelin",
            aka=[],
            category="GHRP",
            vial_amount_mg=PositiveFloat(2.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=ipa_storage,
            typical_protocols=ipa_protocols,
            notes=ipa_notes,
            benefits=ipa_benefits,
            side_effects=ipa_side_effects,
            citations=build_citations(
                storage=ipa_storage,
                typical_protocols=ipa_protocols,
                notes=ipa_notes,
                benefits=ipa_benefits,
                side_effects=ipa_side_effects,
                storage_citations=storage_sources,
                default_citations=ipa_sources,
            ),
        ),
        Peptide(
            id="cjc-1295-no-dac",
            name="CJC-1295 (no DAC)",
            aka=["MOD-GRF 1-29"],
            category="GHRH analog",
            vial_amount_mg=PositiveFloat(2.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=cjc_no_dac_storage,
            typical_protocols=cjc_no_dac_protocols,
            notes=cjc_no_dac_notes,
            benefits=cjc_no_dac_benefits,
            side_effects=cjc_no_dac_side_effects,
            citations=build_citations(
                storage=cjc_no_dac_storage,
                typical_protocols=cjc_no_dac_protocols,
                notes=cjc_no_dac_notes,
                benefits=cjc_no_dac_benefits,
                side_effects=cjc_no_dac_side_effects,
                storage_citations=storage_sources,
                default_citations=cjc_no_dac_sources,
            ),
        ),
        Peptide(
            id="cjc-1295-dac",
            name="CJC-1295 (with DAC)",
            aka=["CJC-1295 DAC"],
            category="GHRH analog",
            vial_amount_mg=PositiveFloat(2.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=cjc_dac_storage,
            typical_protocols=cjc_dac_protocols,
            notes=cjc_dac_notes,
            benefits=cjc_dac_benefits,
            side_effects=cjc_dac_side_effects,
            citations=build_citations(
                storage=cjc_dac_storage,
                typical_protocols=cjc_dac_protocols,
                notes=cjc_dac_notes,
                benefits=cjc_dac_benefits,
                side_effects=cjc_dac_side_effects,
                storage_citations=storage_sources,
                default_citations=cjc_dac_sources,
            ),
        ),
        Peptide(
            id="sermorelin",
            name="Sermorelin",
            aka=[],
            category="GHRH analog",
            vial_amount_mg=PositiveFloat(2.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=serm_storage,
            typical_protocols=serm_protocols,
            notes=serm_notes,
            benefits=serm_benefits,
            side_effects=serm_side_effects,
            citations=build_citations(
                storage=serm_storage,
                typical_protocols=serm_protocols,
                notes=serm_notes,
                benefits=serm_benefits,
                side_effects=serm_side_effects,
                storage_citations=storage_sources,
                default_citations=serm_sources,
            ),
        ),
        Peptide(
            id="ghrp-2",
            name="GHRP-2",
            aka=[],
            category="GHRP",
            vial_amount_mg=PositiveFloat(5.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=ghrp2_storage,
            typical_protocols=ghrp2_protocols,
            notes=ghrp2_notes,
            benefits=ghrp2_benefits,
            side_effects=ghrp2_side_effects,
            citations=build_citations(
                storage=ghrp2_storage,
                typical_protocols=ghrp2_protocols,
                notes=ghrp2_notes,
                benefits=ghrp2_benefits,
                side_effects=ghrp2_side_effects,
                storage_citations=storage_sources,
                default_citations=ghrp2_sources,
            ),
        ),
        Peptide(
            id="ghrp-6",
            name="GHRP-6",
            aka=[],
            category="GHRP",
            vial_amount_mg=PositiveFloat(5.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=ghrp6_storage,
            typical_protocols=ghrp6_protocols,
            notes=ghrp6_notes,
            benefits=ghrp6_benefits,
            side_effects=ghrp6_side_effects,
            citations=build_citations(
                storage=ghrp6_storage,
                typical_protocols=ghrp6_protocols,
                notes=ghrp6_notes,
                benefits=ghrp6_benefits,
                side_effects=ghrp6_side_effects,
                storage_citations=storage_sources,
                default_citations=ghrp6_sources,
            ),
        ),
        Peptide(
            id="hexarelin",
            name="Hexarelin",
            aka=[],
            category="GHRP",
            vial_amount_mg=PositiveFloat(2.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=hexa_storage,
            typical_protocols=hexa_protocols,
            notes=hexa_notes,
            benefits=hexa_benefits,
            side_effects=hexa_side_effects,
            citations=build_citations(
                storage=hexa_storage,
                typical_protocols=hexa_protocols,
                notes=hexa_notes,
                benefits=hexa_benefits,
                side_effects=hexa_side_effects,
                storage_citations=storage_sources,
                default_citations=hexa_sources,
            ),
        ),
        Peptide(
            id="aod-9604",
            name="AOD-9604",
            aka=["Advanced Obesity Drug fragment"],
            category="Fragment peptide",
            vial_amount_mg=PositiveFloat(5.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=aod_storage,
            typical_protocols=aod_protocols,
            notes=aod_notes,
            benefits=aod_benefits,
            side_effects=aod_side_effects,
            citations=build_citations(
                storage=aod_storage,
                typical_protocols=aod_protocols,
                notes=aod_notes,
                benefits=aod_benefits,
                side_effects=aod_side_effects,
                storage_citations=storage_sources,
                default_citations=aod_sources,
            ),
        ),
        Peptide(
            id="melanotan-2",
            name="Melanotan II",
            aka=["MT-2"],
            category="Melanocortin analog",
            vial_amount_mg=PositiveFloat(10.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=mt2_storage,
            typical_protocols=mt2_protocols,
            notes=mt2_notes,
            benefits=mt2_benefits,
            side_effects=mt2_side_effects,
            citations=build_citations(
                storage=mt2_storage,
                typical_protocols=mt2_protocols,
                notes=mt2_notes,
                benefits=mt2_benefits,
                side_effects=mt2_side_effects,
                storage_citations=storage_sources,
                default_citations=mt2_sources,
            ),
        ),
        Peptide(
            id="pt-141",
            name="PT-141",
            aka=["Bremelanotide"],
            category="Melanocortin analog",
            vial_amount_mg=PositiveFloat(10.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=pt141_storage,
            typical_protocols=pt141_protocols,
            notes=pt141_notes,
            benefits=pt141_benefits,
            side_effects=pt141_side_effects,
            citations=build_citations(
                storage=pt141_storage,
                typical_protocols=pt141_protocols,
                notes=pt141_notes,
                benefits=pt141_benefits,
                side_effects=pt141_side_effects,
                storage_citations=storage_sources,
                default_citations=pt141_sources,
                protocol_citations=[DAILYMED_VYLEESI],
            ),
        ),
        Peptide(
            id="kpv",
            name="KPV",
            aka=["Lys-Pro-Val"],
            category="Anti-inflammatory peptide",
            vial_amount_mg=PositiveFloat(5.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=kpv_storage,
            typical_protocols=kpv_protocols,
            notes=kpv_notes,
            benefits=kpv_benefits,
            side_effects=kpv_side_effects,
            citations=build_citations(
                storage=kpv_storage,
                typical_protocols=kpv_protocols,
                notes=kpv_notes,
                benefits=kpv_benefits,
                side_effects=kpv_side_effects,
                storage_citations=storage_sources,
                default_citations=kpv_sources,
            ),
        ),
        Peptide(
            id="selank",
            name="Selank",
            aka=[],
            category="Peptide analog",
            vial_amount_mg=PositiveFloat(10.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=selank_storage,
            typical_protocols=selank_protocols,
            notes=selank_notes,
            benefits=selank_benefits,
            side_effects=selank_side_effects,
            citations=build_citations(
                storage=selank_storage,
                typical_protocols=selank_protocols,
                notes=selank_notes,
                benefits=selank_benefits,
                side_effects=selank_side_effects,
                storage_citations=storage_sources,
                default_citations=selank_sources,
            ),
        ),
        Peptide(
            id="semax",
            name="Semax",
            aka=[],
            category="Peptide analog",
            vial_amount_mg=PositiveFloat(10.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=semax_storage,
            typical_protocols=semax_protocols,
            notes=semax_notes,
            benefits=semax_benefits,
            side_effects=semax_side_effects,
            citations=build_citations(
                storage=semax_storage,
                typical_protocols=semax_protocols,
                notes=semax_notes,
                benefits=semax_benefits,
                side_effects=semax_side_effects,
                storage_citations=storage_sources,
                default_citations=semax_sources,
            ),
        ),
        Peptide(
            id="dsip",
            name="DSIP",
            aka=["Delta Sleep-Inducing Peptide"],
            category="Neuropeptide",
            vial_amount_mg=PositiveFloat(5.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=dsip_storage,
            typical_protocols=dsip_protocols,
            notes=dsip_notes,
            benefits=dsip_benefits,
            side_effects=dsip_side_effects,
            citations=build_citations(
                storage=dsip_storage,
                typical_protocols=dsip_protocols,
                notes=dsip_notes,
                benefits=dsip_benefits,
                side_effects=dsip_side_effects,
                storage_citations=storage_sources,
                default_citations=dsip_sources,
            ),
        ),
        Peptide(
            id="follistatin-344",
            name="Follistatin 344",
            aka=[],
            category="Binding protein fragment",
            vial_amount_mg=PositiveFloat(1.0),
            typical_diluent_ml=PositiveFloat(1.0),
            storage=folli_storage,
            typical_protocols=folli_protocols,
            notes=folli_notes,
            benefits=folli_benefits,
            side_effects=folli_side_effects,
            citations=build_citations(
                storage=folli_storage,
                typical_protocols=folli_protocols,
                notes=folli_notes,
                benefits=folli_benefits,
                side_effects=folli_side_effects,
                storage_citations=storage_sources,
                default_citations=folli_sources,
            ),
        ),
        Peptide(
            id="peg-mgf",
            name="PEG-MGF",
            aka=["PEGylated Mechano Growth Factor"],
            category="IGF variant",
            vial_amount_mg=PositiveFloat(2.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=peg_mgf_storage,
            typical_protocols=peg_mgf_protocols,
            notes=peg_mgf_notes,
            benefits=peg_mgf_benefits,
            side_effects=peg_mgf_side_effects,
            citations=build_citations(
                storage=peg_mgf_storage,
                typical_protocols=peg_mgf_protocols,
                notes=peg_mgf_notes,
                benefits=peg_mgf_benefits,
                side_effects=peg_mgf_side_effects,
                storage_citations=storage_sources,
                default_citations=peg_mgf_sources,
            ),
        ),
        Peptide(
            id="igf-1-lr3",
            name="IGF-1 LR3",
            aka=["Long R3 IGF-1"],
            category="IGF analog",
            vial_amount_mg=PositiveFloat(1.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=igf_lr3_storage,
            typical_protocols=igf_lr3_protocols,
            notes=igf_lr3_notes,
            benefits=igf_lr3_benefits,
            side_effects=igf_lr3_side_effects,
            citations=build_citations(
                storage=igf_lr3_storage,
                typical_protocols=igf_lr3_protocols,
                notes=igf_lr3_notes,
                benefits=igf_lr3_benefits,
                side_effects=igf_lr3_side_effects,
                storage_citations=storage_sources,
                default_citations=igf_lr3_sources,
            ),
        ),
        Peptide(
            id="mots-c",
            name="MOTS-c",
            aka=[],
            category="Mitochondrial peptide",
            vial_amount_mg=PositiveFloat(10.0),
            typical_diluent_ml=PositiveFloat(5.0),
            storage=mots_storage,
            typical_protocols=mots_protocols,
            notes=mots_notes,
            benefits=mots_benefits,
            side_effects=mots_side_effects,
            citations=build_citations(
                storage=mots_storage,
                typical_protocols=mots_protocols,
                notes=mots_notes,
                benefits=mots_benefits,
                side_effects=mots_side_effects,
                storage_citations=storage_sources,
                default_citations=mots_sources,
            ),
        ),
        Peptide(
            id="aod-derivative-hc",
            name="AOD-9604 (high concentration)",
            aka=["AOD-9604 HC"],
            category="Fragment peptide",
            vial_amount_mg=PositiveFloat(10.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=aod_hc_storage,
            typical_protocols=aod_hc_protocols,
            notes=aod_hc_notes,
            benefits=aod_hc_benefits,
            side_effects=aod_hc_side_effects,
            citations=build_citations(
                storage=aod_hc_storage,
                typical_protocols=aod_hc_protocols,
                notes=aod_hc_notes,
                benefits=aod_hc_benefits,
                side_effects=aod_hc_side_effects,
                storage_citations=storage_sources,
                default_citations=aod_hc_sources,
            ),
        ),
        Peptide(
            id="semaglutide",
            name="Semaglutide",
            aka=["GLP-1 analog"],
            category="Metabolic peptide",
            vial_amount_mg=PositiveFloat(5.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=sema_storage,
            typical_protocols=sema_protocols,
            notes=sema_notes,
            benefits=sema_benefits,
            side_effects=sema_side_effects,
            citations=build_citations(
                storage=sema_storage,
                typical_protocols=sema_protocols,
                notes=sema_notes,
                benefits=sema_benefits,
                side_effects=sema_side_effects,
                storage_citations=storage_sources,
                default_citations=sema_sources,
                protocol_citations=[DAILYMED_OZEMPIC],
            ),
        ),
        Peptide(
            id="tirzepatide",
            name="Tirzepatide",
            aka=["Dual GIP/GLP-1"],
            category="Metabolic peptide",
            vial_amount_mg=PositiveFloat(10.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=tirz_storage,
            typical_protocols=tirz_protocols,
            notes=tirz_notes,
            benefits=tirz_benefits,
            side_effects=tirz_side_effects,
            citations=build_citations(
                storage=tirz_storage,
                typical_protocols=tirz_protocols,
                notes=tirz_notes,
                benefits=tirz_benefits,
                side_effects=tirz_side_effects,
                storage_citations=storage_sources,
                default_citations=tirz_sources,
                protocol_citations=[DAILYMED_ZEPBOUND],
            ),
        ),
        Peptide(
            id="retatrutide",
            name="Retatrutide",
            aka=["Triple agonist", "GIP/GLP-1/GCGR"],
            category="Metabolic peptide",
            vial_amount_mg=PositiveFloat(5.0),
            typical_diluent_ml=PositiveFloat(2.0),
            storage=reta_storage,
            typical_protocols=reta_protocols,
            notes=reta_notes,
            benefits=reta_benefits,
            side_effects=reta_side_effects,
            citations=build_citations(
                storage=reta_storage,
                typical_protocols=reta_protocols,
                notes=reta_notes,
                benefits=reta_benefits,
                side_effects=reta_side_effects,
                storage_citations=storage_sources,
                default_citations=reta_sources,
            ),
        ),
    ]
