import re
from typing import List, Dict, Any
from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter

class ZenixMarkdownChunker:
    """
    Splits markdown files (like DESIGN.md or animations.md) into semantic chunks
    by preserving header hierarchies.
    """
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        # We want to split by major headers to keep context grouped by section
        self.headers_to_split_on = [
            ("#", "Header 1"),
            ("##", "Header 2"),
            ("###", "Header 3"),
            ("####", "Header 4"),
        ]
        
        self.markdown_splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=self.headers_to_split_on,
            strip_headers=False
        )
        
        # Fallback splitter if a specific section under a header is still too large
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", " ", ""]
        )

    def chunk_document(self, content: str, source_file: str) -> List[Dict[str, Any]]:
        """
        Takes raw markdown content and returns a list of dictionaries containing
        the chunked text and its metadata (headers, source file).
        """
        # Step 1: Split by markdown headers
        header_splits = self.markdown_splitter.split_text(content)
        
        # Step 2: Ensure no chunk is larger than our chunk_size limit
        final_chunks = self.text_splitter.split_documents(header_splits)
        
        results = []
        for doc in final_chunks:
            metadata = doc.metadata.copy()
            metadata["source"] = source_file
            
            # Construct a descriptive title based on the headers
            headers_path = [v for k, v in metadata.items() if k.startswith("Header")]
            section_path = " > ".join(headers_path) if headers_path else "Root"
            
            results.append({
                "content": doc.page_content,
                "metadata": metadata,
                "section_path": f"{source_file} : {section_path}"
            })
            
        return results
