from django.apps import AppConfig


class ProductsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "products"

    def ready(self):
        # Load embedding / semantic search index
        from products.embedding_chat.vector_store import load_index
        load_index()

        # (Optional) Load recommendation index if you have one
        # from products.recommendation.vector_store import load_reco_index
        # load_reco_index()