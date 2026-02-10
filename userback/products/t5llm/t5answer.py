import torch
from utils.ml_loader import get_t5_model


def generate_answer_t5(context: str, query: str, max_length=150):
    model, tokenizer = get_t5_model()

    prompt = f"""
    Answer the question using only the given context.
    Given context has 2 products with their attributes and values.
    Give a concise answer by comparing the 2 products.

    Context:
    {context}

    Question:
    {query}
    """

    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=512
    )

    outputs = model.generate(
        input_ids=inputs.input_ids,
        attention_mask=inputs.attention_mask,
        max_length=max_length,
        num_beams=4,
        early_stopping=True
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)
