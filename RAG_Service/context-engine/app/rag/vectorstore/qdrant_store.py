import os
from qdrant_client import QdrantClient
from langchain_community.vectorstores import Qdrant
from app.rag.embeddings.free_embeddings import ZenixEmbeddings
from loguru import logger

class QdrantStore:
    """
    Manages the connection to Qdrant Cloud and handles document insertion/retrieval.
    """
    def __init__(self, collection_name: str = "zenix_context"):
        self.collection_name = collection_name
        self.qdrant_url = os.getenv("QDRANT_URL")
        self.qdrant_api_key = os.getenv("QDRANT_API_KEY")
        
        if not self.qdrant_url or not self.qdrant_api_key:
            logger.warning("Qdrant Cloud credentials not found in environment variables. Falling back to in-memory mode.")
            self.client = QdrantClient(location=":memory:")
        else:
            self.client = QdrantClient(
                url=self.qdrant_url,
                api_key=self.qdrant_api_key
            )
            
        self.embeddings = ZenixEmbeddings().get_embeddings_model()

    def get_vector_store(self) -> Qdrant:
        """
        Returns a LangChain-compatible Qdrant vector store instance.
        """
        return Qdrant(
            client=self.client,
            collection_name=self.collection_name,
            embeddings=self.embeddings
        )

    def initialize_collection(self):
        """
        Creates the collection if it doesn't exist.
        all-MiniLM-L6-v2 produces vectors of 384 dimensions.
        """
        from qdrant_client.http.models import Distance, VectorParams
        
        collections = self.client.get_collections().collections
        exists = any(c.name == self.collection_name for c in collections)
        
        if not exists:
            logger.info(f"Creating new Qdrant collection: {self.collection_name}")
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE),
            )
        else:
            logger.info(f"Qdrant collection {self.collection_name} already exists.")
