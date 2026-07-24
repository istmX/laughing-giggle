import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_mistralai import ChatMistralAI
from langchain_google_genai import ChatGoogleGenerativeAI
from loguru import logger

# Load environment from RAG_Service/.env or workspace root
rag_env = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.env"))
root_env = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../.env"))
load_dotenv(rag_env)
load_dotenv(root_env)

try:
    from langchain_nvidia_ai_endpoints import ChatNVIDIA
    HAS_NVIDIA = True
except ImportError:
    ChatNVIDIA = None
    HAS_NVIDIA = False

_GLOBAL_PROVIDER_POOL = None

def get_provider_pool():
    """
    Returns a cached global list of LLM instances for primary usage and worst-case fallback.
    Initializes instances once to eliminate repeated connection overhead.
    """
    global _GLOBAL_PROVIDER_POOL
    if _GLOBAL_PROVIDER_POOL is not None and len(_GLOBAL_PROVIDER_POOL) > 0:
        return _GLOBAL_PROVIDER_POOL

    nvidia_key = os.getenv("NVIDIA_API_KEY")
    primary_gemini = os.getenv("GOOGLE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    secondary_gemini = os.getenv("GEMINI_SECONDARY_KEY") or os.getenv("GEMINI_API_KEY_II")
    
    primary_groq = os.getenv("GROQ_API_KEY")
    primary_mistral = os.getenv("MISTRAL_API_KEY")

    fallback_groq = os.getenv("GROQ_API_KEY_II")
    fallback_mistral = os.getenv("MISTRAL_API_KEY_II")

    llms = []

    # 1. Primary Model: NVIDIA Free Cloud API Endpoint - DeepSeek V4 Flash (Instant Direct Mode: 2-3s)
    if nvidia_key and HAS_NVIDIA and ChatNVIDIA is not None:
        try:
            llms.append(
                ChatNVIDIA(
                    model="deepseek-ai/deepseek-v4-flash",
                    api_key=nvidia_key,
                    temperature=0.7,
                    max_tokens=16384,
                    model_kwargs={"extra_body": {"chat_template_kwargs": {"thinking": False}}}
                )
            )
            logger.info("DeepSeek V4 Flash (NVIDIA Free Cloud API) initialized as Primary LLM in Instant Mode (thinking=False).")
        except Exception as e:
            logger.warning(f"Failed to initialize ChatNVIDIA DeepSeek V4 Flash: {e}")




    # 2. Secondary Gemini 3.5 Flash Model Fallback
    if primary_gemini:
        gemini_primary = ChatGoogleGenerativeAI(model="gemini-3.5-flash", api_key=primary_gemini)
        gemini_fallback = ChatGoogleGenerativeAI(model="gemini-2.5-flash", api_key=primary_gemini)
        llms.append(gemini_primary.with_fallbacks([gemini_fallback]))

    # 3. Secondary Gemini API Key Fallback
    if secondary_gemini and secondary_gemini != primary_gemini:
        sec_primary = ChatGoogleGenerativeAI(model="gemini-3.5-flash", api_key=secondary_gemini)
        sec_fallback = ChatGoogleGenerativeAI(model="gemini-2.5-flash", api_key=secondary_gemini)
        llms.append(sec_primary.with_fallbacks([sec_fallback]))


    # 4. Mistral & Groq Fallbacks
    if primary_mistral:
        llms.append(ChatMistralAI(model="mistral-large-latest", api_key=primary_mistral))
    if primary_groq:
        llms.append(ChatGroq(model_name="llama-3.1-8b-instant", api_key=primary_groq))

    if fallback_mistral and fallback_mistral != primary_mistral:
        llms.append(ChatMistralAI(model="mistral-large-latest", api_key=fallback_mistral))
    if fallback_groq and fallback_groq != primary_groq:
        llms.append(ChatGroq(model_name="llama-3.1-8b-instant", api_key=fallback_groq))

    if not llms:
        groq_k = primary_groq or os.getenv("GROQ_API_KEY")
        if groq_k:
            llms = [ChatGroq(model_name="llama-3.1-8b-instant", api_key=groq_k)]
        else:
            llms = [ChatMistralAI(model="mistral-large-latest", api_key=primary_mistral or os.getenv("MISTRAL_API_KEY"))]

    _GLOBAL_PROVIDER_POOL = llms
    return _GLOBAL_PROVIDER_POOL




def ensure_env_loaded():
    rag_env = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.env"))
    rag_env_2 = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.env"))
    root_env = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../.env"))
    for path in [rag_env, rag_env_2, root_env]:
        if os.path.exists(path):
            load_dotenv(path)

def get_interactive_llm():
    """
    Dedicated fast LLM instance for interactive UI tasks (Q&A turns, title generation, classification).
    Uses Groq Llama 3.1 8B primary with Mistral & Gemini fallbacks for guaranteed 0.3s responses.
    """
    ensure_env_loaded()
    primary_groq = os.getenv("GROQ_API_KEY") or os.getenv("GROQ_API_KEY_II")
    primary_mistral = os.getenv("MISTRAL_API_KEY")
    primary_gemini = os.getenv("GOOGLE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    
    interactive_chain = []
    if primary_groq:
        interactive_chain.append(ChatGroq(model_name="llama-3.1-8b-instant", api_key=primary_groq))
    if primary_mistral:
        interactive_chain.append(ChatMistralAI(model="mistral-large-latest", api_key=primary_mistral))
    if primary_gemini:
        interactive_chain.append(ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=primary_gemini))
        
    if not interactive_chain:
        if primary_groq:
            return ChatGroq(model_name="llama-3.1-8b-instant", api_key=primary_groq)
        return ChatGroq(model_name="llama-3.1-8b-instant")
        
    primary = interactive_chain[0]
    fallbacks = interactive_chain[1:]
    return primary.with_fallbacks(fallbacks) if fallbacks else primary


def get_context_llm(index: int = 0):
    """
    Dedicated high-speed LLM model chain for 4-file context blueprint generation (agents.md, design.md, etc.).
    Uses Groq Llama 3.1 8B & Mistral Large FIRST (sub-second execution),
    followed by Gemini 2.0 Flash, placing ChatNVIDIA DeepSeek V4 Flash strictly at the very end.
    """
    ensure_env_loaded()
    primary_groq = os.getenv("GROQ_API_KEY")
    fallback_groq = os.getenv("GROQ_API_KEY_II") or primary_groq
    primary_mistral = os.getenv("MISTRAL_API_KEY")
    fallback_mistral = os.getenv("MISTRAL_API_KEY_II") or primary_mistral
    primary_gemini = os.getenv("GOOGLE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    nvidia_key = os.getenv("NVIDIA_API_KEY")

    fast_chain = []
    # 1. Groq Llama 3.1 8B (0.3s Instant Execution)
    if primary_groq:
        fast_chain.append(ChatGroq(model_name="llama-3.1-8b-instant", api_key=primary_groq))
    if fallback_groq and fallback_groq != primary_groq:
        fast_chain.append(ChatGroq(model_name="llama-3.1-8b-instant", api_key=fallback_groq))

    # 2. Mistral Large (1.0s High-Quality Technical Markdown)
    if primary_mistral:
        fast_chain.append(ChatMistralAI(model="mistral-large-latest", api_key=primary_mistral))
    if fallback_mistral and fallback_mistral != primary_mistral:
        fast_chain.append(ChatMistralAI(model="mistral-large-latest", api_key=fallback_mistral))

    # 3. Gemini 2.0 Flash (Secondary Backup)
    if primary_gemini:
        fast_chain.append(ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=primary_gemini))

    # 4. DeepSeek V4 Flash (NVIDIA Cloud API) - STRICTLY AT THE VERY END OF FALLBACK CHAIN
    if nvidia_key and HAS_NVIDIA and ChatNVIDIA is not None:
        try:
            fast_chain.append(
                ChatNVIDIA(
                    model="deepseek-ai/deepseek-v4-flash",
                    api_key=nvidia_key,
                    temperature=0.7,
                    max_tokens=16384,
                    model_kwargs={"extra_body": {"chat_template_kwargs": {"thinking": False}}}
                )
            )
        except Exception as e:
            logger.warning(f"Failed to append ChatNVIDIA fallback to context chain: {e}")

    if not fast_chain:
        groq_k = primary_groq or fallback_groq
        if groq_k:
            fast_chain = [ChatGroq(model_name="llama-3.1-8b-instant", api_key=groq_k)]
        elif primary_mistral:
            fast_chain = [ChatMistralAI(model="mistral-large-latest", api_key=primary_mistral)]

    if not fast_chain:
        raise ValueError("No valid AI API keys found in environment. Please set GROQ_API_KEY or MISTRAL_API_KEY.")

    start_idx = index % len(fast_chain)
    ordered = fast_chain[start_idx:] + fast_chain[:start_idx]

    primary = ordered[0]
    fallbacks = ordered[1:]
    return primary.with_fallbacks(fallbacks) if fallbacks else primary


def get_load_balanced_llm(index: int = 0):
    """
    Returns an LLM chain starting at the given index in the provider pool,
    with all other pool members configured as automatic sequential fallbacks.
    """
    pool = get_provider_pool()
    if not pool:
        return get_interactive_llm()

    # Rotate starting provider based on index (Round-Robin)
    start_idx = index % len(pool)
    ordered_pool = pool[start_idx:] + pool[:start_idx]

    primary = ordered_pool[0]
    fallbacks = ordered_pool[1:]
    return primary.with_fallbacks(fallbacks) if fallbacks else primary

def get_fallback_llm():
    return get_interactive_llm()

def get_fallback_llm_ii():
    return get_load_balanced_llm(1)

