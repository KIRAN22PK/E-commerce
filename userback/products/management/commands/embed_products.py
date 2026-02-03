from django.core.management.base import BaseCommand
from products.models import Product
from products.embedding_chat.text_builder import product_to_text
from products.embedding_chat.embedder import embed_texts
from products.embedding_chat.vector_store import save_index

class Command(BaseCommand):
    help = "Generate product embeddings (local)"

    def handle(self, *args, **kwargs):
        products = Product.objects.all()
        texts = [product_to_text(p) for p in products]
        embeddings = embed_texts(texts)
        product_ids = [p.id for p in products]
        save_index(product_ids, embeddings)
        self.stdout.write("✅ Embeddings generated successfully")
