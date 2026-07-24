import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_mistralai import ChatMistralAI
from langchain_google_genai import ChatGoogleGenerativeAI

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.env"))
load_dotenv(env_path)

import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_mistralai import ChatMistralAI
from langchain_google_genai import ChatGoogleGenerativeAI
from loguru import logger

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.env"))
load_dotenv(env_path)

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
        try:
            llms.append(ChatGoogleGenerativeAI(model="gemini-3.5-flash", api_key=primary_gemini))
        except Exception as e:
            logger.warning(f"Failed to load gemini-3.5-flash, falling back to gemini-2.5-flash: {e}")
            llms.append(ChatGoogleGenerativeAI(model="gemini-2.5-flash", api_key=primary_gemini))



    # 3. Secondary Gemini API Key Fallback
    if secondary_gemini and secondary_gemini != primary_gemini:
        try:
            llms.append(ChatGoogleGenerativeAI(model="gemini-3.5-flash", api_key=secondary_gemini))
        except Exception as e:
            llms.append(ChatGoogleGenerativeAI(model="gemini-2.5-flash", api_key=secondary_gemini))


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
        llms = [ChatGroq(model_name="llama-3.1-8b-instant")]

    _GLOBAL_PROVIDER_POOL = llms
    return _GLOBAL_PROVIDER_POOL




def get_load_balanced_llm(index: int = 0):
    """
    Returns an LLM chain starting at the given index in the provider pool,
    with all other pool members configured as automatic sequential fallbacks.
    """
    pool = get_provider_pool()
    if not pool:
        return ChatGroq(model_name="llama-3.1-8b-instant")

    # Rotate starting provider based on index (Round-Robin)
    start_idx = index % len(pool)
    ordered_pool = pool[start_idx:] + pool[:start_idx]

    primary = ordered_pool[0]
    fallbacks = ordered_pool[1:]
    return primary.with_fallbacks(fallbacks) if fallbacks else primary

def get_fallback_llm():
    return get_load_balanced_llm(0)

def get_fallback_llm_ii():
    return get_load_balanced_llm(1)

