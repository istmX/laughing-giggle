from langchain_community.embeddings import HuggingFaceEmbeddings

class ZenixEmbeddings:
    """
    Provides completely free, local embeddings using Sentence Transformers.
    We use 'all-MiniLM-L6-v2' as it is extremely fast and provides great semantic search
    performance without requiring any API keys or incurring costs.
    """
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.embeddings = HuggingFaceEmbeddings(
            model_name=model_name,
            model_kwargs={'device': 'cpu'},  # Change to 'cuda' if GPU is available
            encode_kwargs={'normalize_embeddings': True} # Better for cosine similarity
        )
        
    def get_embeddings_model(self) -> HuggingFaceEmbeddings:
        """Returns the LangChain compatible embeddings object for Qdrant"""
        return self.embeddings
