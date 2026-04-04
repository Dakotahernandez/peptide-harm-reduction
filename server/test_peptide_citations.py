from peptides_data import load_peptides


def test_all_displayed_peptide_facts_have_citations():
    peptides = load_peptides()

    for peptide in peptides:
        facts = [
            peptide.storage,
            *peptide.typical_protocols,
            *peptide.notes,
            *peptide.benefits,
            *peptide.side_effects,
        ]

        for fact in facts:
            assert fact in peptide.citations, f"{peptide.id} missing citations for fact: {fact}"
            sources = peptide.citations[fact]
            assert sources, f"{peptide.id} has empty citations for fact: {fact}"
            for source in sources:
                assert source.title, f"{peptide.id} citation missing title for fact: {fact}"
                assert source.url, f"{peptide.id} citation missing url for fact: {fact}"
