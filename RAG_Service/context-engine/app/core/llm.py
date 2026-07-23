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
    
    return groq_llm.with_fallbacks([mistral_llm, gemini_llm])

def get_fallback_llm_ii():
    """
    Returns an LLM chain with multi-provider fallbacks across Groq, Mistral, and Gemini.
    Automatically switches to the next available AI if 429 rate limits or errors occur.
    """
    groq_api_key_ii = os.getenv("GROQ_API_KEY_II") or os.getenv("GROQ_API_KEY")
    groq_api_key_i = os.getenv("GROQ_API_KEY")
    mistral_api_key_ii = os.getenv("MISTRAL_API_KEY_II") or os.getenv("MISTRAL_API_KEY")
    mistral_api_key_i = os.getenv("MISTRAL_API_KEY")
    gemini_api_key = os.getenv("GEMINI_API_KEY_II") or os.getenv("GEMINI_API_KEY")

    llms = []
    if groq_api_key_ii:
        llms.append(ChatGroq(model_name="llama-3.1-8b-instant", api_key=groq_api_key_ii))
    if groq_api_key_i and groq_api_key_i != groq_api_key_ii:
        llms.append(ChatGroq(model_name="llama-3.1-8b-instant", api_key=groq_api_key_i))
    if mistral_api_key_ii:
        llms.append(ChatMistralAI(model="mistral-large-latest", api_key=mistral_api_key_ii))
    if mistral_api_key_i and mistral_api_key_i != mistral_api_key_ii:
        llms.append(ChatMistralAI(model="mistral-large-latest", api_key=mistral_api_key_i))
    if gemini_api_key:
        llms.append(ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", api_key=gemini_api_key))

    if not llms:
        return get_fallback_llm()

    primary = llms[0]
    fallbacks = llms[1:]
    return primary.with_fallbacks(fallbacks) if fallbacks else primary
