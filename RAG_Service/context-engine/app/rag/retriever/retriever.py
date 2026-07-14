from typing import List
from langchain_core.documents import Document
from app.rag.vectorstore.qdrant_store import QdrantStore
from loguru import logger

class ZenixRetriever:
    """
    Handles retrieving relevant context chunks from the Qdrant vector store
    based on the user's idea or query.
    """
    def __init__(self, k: int = 5):
        """
        :param k: Number of relevant chunks to retrieve.
        """
        self.k = k
        self.qdrant_store = QdrantStore()
        # Initialize the LangChain retriever interface
        self.retriever = self.qdrant_store.get_vector_store().as_retriever(
            search_type="similarity",
            search_kwargs={"k": self.k}
        )

    def retrieve_context(self, query: str) -> List[Document]:
        """
        Takes a string query (like the user's software idea) and returns
        the top K most semantically similar markdown chunks from our knowledge base.
        """
        logger.info(f"Retrieving top {self.k} context chunks for query: '{query[:50]}...'")
        
        try:
            docs = self.retriever.invoke(query)
            logger.info(f"Successfully retrieved {len(docs)} documents.")
            return docs
        except Exception as e:
            logger.error(f"Error during retrieval: {e}")
            return []

    def format_context(self, docs: List[Document]) -> str:
        """
        Takes a list of retrieved LangChain Documents and formats them into a 
        single readable string for the LLM prompt.
        """
        if not docs:
            return "No relevant architectural context found."
            
        formatted_str = "--- RETRIEVED ARCHITECTURAL CONTEXT ---\n\n"
        for i, doc in enumerate(docs):
            source = doc.metadata.get("source", "Unknown Source")
            # Extract header path if available from chunk metadata
            headers = [v for k, v in doc.metadata.items() if k.startswith("Header")]
            header_path = " > ".join(headers) if headers else "Root"
            
            formatted_str += f"[{i+1}] Source: {source} (Section: {header_path})\n"
            formatted_str += f"{doc.page_content}\n"
            formatted_str += "-" * 50 + "\n\n"
            
        return formatted_str
