from symspellpy import SymSpell, Verbosity


def build_domain_dictionary(product_list):
    sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)

    for prod in product_list:
        for token in prod.lower().split():
            sym_spell.create_dictionary_entry(token, 1)

    return sym_spell


def correct_query(sym_spell, query: str):
    corrected_tokens = []

    for word in query.lower().split():
        suggestions = sym_spell.lookup(
            word,
            verbosity=Verbosity.TOP,   
            max_edit_distance=2
        )

        if suggestions:
            corrected_tokens.append(suggestions[0].term)
        else:
            corrected_tokens.append(word)

    return " ".join(corrected_tokens)
