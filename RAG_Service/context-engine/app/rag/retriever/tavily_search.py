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


    async def search_web_async(self, query: str, max_results: int = 3) -> str:
        """
        Executes a targeted AI search asynchronously with a strict 4-second timeout limit.
        Ensures search never stalls the LLM pipeline or causes 60-second gateway timeouts.
        """
        import asyncio
        if not self.client:
            logger.warning("Tavily API key not found. Skipping live web search.")
            return ""

        clean_query = query.replace("\n", " ").replace('"', ' ').replace("'", ' ').strip()
        if len(clean_query) > 250:
            clean_query = clean_query[:250].rsplit(' ', 1)[0]

        try:
            logger.info(f"Executing Tavily AI Search for: '{clean_query}'")
            loop = asyncio.get_event_loop()
            res = await asyncio.wait_for(
                loop.run_in_executor(None, lambda: self.client.search(query=clean_query, search_depth="basic", max_results=max_results)),
                timeout=4.0
            )
            results = res.get("results", [])
            if not results:
                return ""

            formatted = "\n--- TAVILY LIVE WEB INTELLIGENCE ---\n"
            for r in results:
                formatted += f"Source: {r.get('title', 'Web Result')} ({r.get('url', '')})\n"
                formatted += f"{r.get('content', '')}\n\n"
            return formatted
        except Exception as e:
            logger.warning(f"Tavily search timed out or skipped ({e}). Proceeding instantly with DeepSeek V4 Flash...")
            return ""

    def search_web(self, query: str, max_results: int = 3) -> str:
        """
        Synchronous search wrapper safely bounded by 250 characters.
        """
        if not self.client:
            return ""

        clean_query = query.replace("\n", " ").replace('"', ' ').replace("'", ' ').strip()
        if len(clean_query) > 250:
            clean_query = clean_query[:250].rsplit(' ', 1)[0]

        try:
            res = self.client.search(query=clean_query, search_depth="basic", max_results=max_results)
            results = res.get("results", [])
            if not results:
                return ""

            formatted = "\n--- TAVILY LIVE WEB INTELLIGENCE ---\n"
            for r in results:
                formatted += f"Source: {r.get('title', 'Web Result')} ({r.get('url', '')})\n"
                formatted += f"{r.get('content', '')}\n\n"
            return formatted
        except Exception as e:
            logger.warning(f"Tavily search skipped ({e}).")
            return ""



tavily_service = TavilySearchService()
