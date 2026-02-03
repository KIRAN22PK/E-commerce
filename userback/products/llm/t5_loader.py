from transformers import T5Tokenizer, T5ForConditionalGeneration

_tokenizer = None
_model = None

def get_t5():
    global _tokenizer, _model

    if _model is None:
        _tokenizer = T5Tokenizer.from_pretrained("t5-small")
        _model = T5ForConditionalGeneration.from_pretrained("t5-small")

    return _tokenizer, _model
