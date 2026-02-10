from transformers import T5Tokenizer, T5ForConditionalGeneration

MODEL_NAME = "google/flan-t5-small"


tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME)
model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)
