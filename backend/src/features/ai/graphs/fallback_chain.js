import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const executeWithFallback = async (promptText) => {
    const groq = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        modelName: "llama3-70b-8192", 
        temperature: 0.2
    });

    const gemini = new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
        model: "gemini-2.5-flash",
        temperature: 0.2
    });

    const mistral = new ChatMistralAI({
        apiKey: process.env.MISTRAL_API_KEY,
        modelName: "mistral-large-latest",
        temperature: 0.2
    });

    const chain = groq.withFallbacks({ fallbacks: [gemini, mistral] }).pipe(new StringOutputParser());

    const result = await chain.invoke(promptText);

    
    try {
        const cleaned = result.replace(/```json/g, '').replace(/```/g, '').trim();
        return { response: JSON.parse(cleaned), providerUsed: "langchain-fallback", fallbackUsed: true, fallbackProvider: "unknown" };
    } catch (e) {
        return { response: result, providerUsed: "langchain-fallback", fallbackUsed: true, fallbackProvider: "unknown" };
    }
};
