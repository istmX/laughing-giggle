import os
from pathlib import Path
from loguru import logger
from dotenv import load_dotenv

# Ensure we can import from app
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from app.rag.chunking.markdown_chunker import ZenixMarkdownChunker
from app.rag.vectorstore.qdrant_store import QdrantStore

def ingest_knowledge_base():
    """
    Reads the Zenix context and UI data folders, chunks the markdown files, 
    and ingests them into the Qdrant Cloud vector database.
    """
    load_dotenv()
    
    # Path to the new local knowledge folder
    base_dir = Path(__file__).resolve().parent.parent.parent / "knowledge"
    
    if not base_dir.exists():
        logger.error(f"Data directory not found at {base_dir}")
        return

    logger.info(f"Starting ingestion from: {base_dir}")

    chunker = ZenixMarkdownChunker()
    qdrant_manager = QdrantStore()
    
    # Ensure collection exists before we insert
    qdrant_manager.initialize_collection()
    vector_store = qdrant_manager.get_vector_store()
    
    # We want to ingest all .md files in the data folder, including subdirectories (context/ and ui/)
    md_files = list(base_dir.rglob("*.md"))
    
    if not md_files:
        logger.warning("No markdown files found to ingest.")
        return

    total_chunks = 0
    all_docs = []

    for file_path in md_files:
        try:
            content = file_path.read_text(encoding="utf-8")
            relative_path = file_path.relative_to(base_dir)
            
            logger.info(f"Chunking {relative_path}...")
            
            chunks = chunker.chunk_document(content, str(relative_path))
            
            for chunk_data in chunks:
                # Convert our chunk dictionary to LangChain Document format for insertion
                from langchain_core.documents import Document
                
                doc = Document(
                    page_content=chunk_data["content"],
                    metadata=chunk_data["metadata"]
                )
                all_docs.append(doc)
                
            logger.info(f"Generated {len(chunks)} chunks for {relative_path}")
            total_chunks += len(chunks)
            
        except Exception as e:
            logger.error(f"Failed to process {file_path}: {e}")

    if all_docs:
        logger.info(f"Uploading {len(all_docs)} total chunks to Qdrant Cloud...")
        # Add documents in batches automatically via LangChain Qdrant integration
        vector_store.add_documents(all_docs)
        logger.success(f"Successfully ingested {len(all_docs)} chunks into Qdrant.")
    else:
        logger.warning("No valid chunks were generated.")

if __name__ == "__main__":
    ingest_knowledge_base()
