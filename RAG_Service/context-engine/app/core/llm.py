import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_mistralai import ChatMistralAI
from langchain_google_genai import ChatGoogleGenerativeAI

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.env"))
load_dotenv(env_path)

def get_fallback_llm():
    """
    Returns an LLM with fallbacks: Groq -> Mistral -> Gemini.
    """
    groq_llm = ChatGroq(model_name="llama-3.1-8b-instant")
    mistral_llm = ChatMistralAI(model="mistral-large-latest")
    gemini_llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro")
    
    # Configure fallbacks
    return groq_llm.with_fallbacks([mistral_llm, gemini_llm])

def get_fallback_llm_ii():
    """
    Returns an LLM with fallbacks using secondary keys (_II).
    """
    groq_api_key_ii = os.getenv("GROQ_API_KEY_II")
    mistral_api_key_ii = os.getenv("MISTRAL_API_KEY_II")
    gemini_api_key_ii = os.getenv("GEMINI_API_KEY_II")
    
    groq_llm = ChatGroq(model_name="llama-3.1-8b-instant", api_key=groq_api_key_ii)
    mistral_llm = ChatMistralAI(model="mistral-large-latest", api_key=mistral_api_key_ii)
    gemini_llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", api_key=gemini_api_key_ii)
    
    return groq_llm.with_fallbacks([mistral_llm, gemini_llm])

