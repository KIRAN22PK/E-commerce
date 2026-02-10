from products.symspell.corrector import build_domain_dictionary

_sym_spell_instance = None

def get_symspell():
    global _sym_spell_instance

    if _sym_spell_instance is None:
        products = ["shoes", "mobile", "shirts","fans","ceilingfans","lightbulb","bulb","phones"]
        _sym_spell_instance = build_domain_dictionary(products)

    return _sym_spell_instance

_brand_symspell = None

def get_brand_symspell():
    global _brand_symspell

    if _brand_symspell is None:
        brands = [
            "nike",
            "Mi",
            "reymond",
            "orient",
            "crompton",
            "havells",
            "apple",
            "oneplus",
            'Bata',
            'i phone',
            'redmi',
            
        ]
        _brand_symspell = build_domain_dictionary(brands)

    return _brand_symspell
