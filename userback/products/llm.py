# from transformers import AutoModelForCausalLM, AutoTokenizer
# from peft import PeftModel
# import torch

# MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
# LORA_PATH = "lora_training/lora_adapter"

# # Load once (server startup)
# tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

# base_model = AutoModelForCausalLM.from_pretrained(
#     MODEL_NAME,
#     torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
# )

# model = PeftModel.from_pretrained(base_model, LORA_PATH)
# model.eval()


# def generate_comparison_answer(context, query):
#     prompt = f"""
# Context:
# {context}

# Question:
# {query}

# Answer:
# """

#     inputs = tokenizer(prompt, return_tensors="pt")

#     with torch.no_grad():
#         outputs = model.generate(
#             **inputs,
#             max_new_tokens=150,
#             temperature=0.7,
#             do_sample=True
#         )

#     decoded = tokenizer.decode(outputs[0], skip_special_tokens=True)
#     answer=decoded.split("Answer:")[-1].strip()
#     return answer