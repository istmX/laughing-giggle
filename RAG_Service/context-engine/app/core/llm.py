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

def get_provider_pool():
    """
    Returns an ordered list of LLM instances for primary usage and worst-case fallback.
    Primary Keys: GROQ_API_KEY, MISTRAL_API_KEY, GEMINI_API_KEY
    Worst-case Fallback: GROQ_API_KEY_II, MISTRAL_API_KEY_II, GEMINI_API_KEY_II
    """
    primary_groq = os.getenv("GROQ_API_KEY")
    primary_mistral = os.getenv("MISTRAL_API_KEY")
    primary_gemini = os.getenv("GEMINI_API_KEY")

    fallback_groq = os.getenv("GROQ_API_KEY_II")
    fallback_mistral = os.getenv("MISTRAL_API_KEY_II")
    fallback_gemini = os.getenv("GEMINI_API_KEY_II")

    llms = []

    # Primary Pool
    if primary_groq:
        llms.append(ChatGroq(model_name="llama-3.1-8b-instant", api_key=primary_groq))
    if primary_mistral:
        llms.append(ChatMistralAI(model="mistral-large-latest", api_key=primary_mistral))
    if primary_gemini:
        llms.append(ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", api_key=primary_gemini))

    # Worst-Case Fallback Pool (Secondary Keys)
    if fallback_groq and fallback_groq != primary_groq:
        llms.append(ChatGroq(model_name="llama-3.1-8b-instant", api_key=fallback_groq))
    if fallback_mistral and fallback_mistral != primary_mistral:
        llms.append(ChatMistralAI(model="mistral-large-latest", api_key=fallback_mistral))
    if fallback_gemini and fallback_gemini != primary_gemini:
        llms.append(ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", api_key=fallback_gemini))

    if not llms:
        # Fallback to default constructor if no environment keys set explicitly
        return [ChatGroq(model_name="llama-3.1-8b-instant")]

    return llms

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

