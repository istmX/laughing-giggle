import os
from loguru import logger

try:
    from tavily import TavilyClient
    HAS_TAVILY = True
except ImportError:
    TavilyClient = None
    HAS_TAVILY = False
    logger.warning("tavily-python package not installed. Live Tavily web search will be disabled.")

class TavilySearchService:
    """
    Wrapper for Tavily AI Search to fetch real-time web search results,
    official framework documentation, and trending component specifications.
    """
    def __init__(self):
        self.api_key = os.getenv("TAVILY_API_KEY")
        if self.api_key and HAS_TAVILY and TavilyClient is not None:
            try:
                self.client = TavilyClient(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize TavilyClient: {e}")
                self.client = None
        else:
            self.client = None


    def search_web(self, query: str, max_results: int = 3) -> str:
        """
        Executes a targeted AI search and returns formatted markdown context snippets.
        """
        if not self.client:
            logger.warning("Tavily API key not found. Skipping live web search.")
            return ""

        try:
            logger.info(f"Executing Tavily AI Search for: '{query}'")
            res = self.client.search(query=query, search_depth="basic", max_results=max_results)
            results = res.get("results", [])
            
            if not results:
                return ""

            formatted = "\n--- TAVILY LIVE WEB INTELLIGENCE ---\n"
            for r in results:
                formatted += f"Source: {r.get('title', 'Web Result')} ({r.get('url', '')})\n"
                formatted += f"{r.get('content', '')}\n\n"
            return formatted
        except Exception as e:
            logger.error(f"Tavily search failed for '{query}': {e}")
            return ""

tavily_service = TavilySearchService()
