import OpenAI from "openai";
import BaseProvider from "./base.provider.js";

export class OpenRouterProvider extends BaseProvider {
  constructor() {
    super();
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("Missing OPENROUTER_API_KEY: set OPENROUTER_API_KEY in environment");
    }
    this.client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": "https://zenix.ai",
        "X-OpenRouter-Title": "Zenix",
      },
    });
    // Using a reliable model
    this.model = "meta-llama/llama-3.3-70b-instruct"; 
  }

  async _call(prompt) {
    try {
      const completion = await this.client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: this.model,
        max_tokens: 4000,
      });

      if (!completion || !completion.choices || completion.choices.length === 0 || !completion.choices[0].message || !completion.choices[0].message.content) {
        throw new Error("OpenRouter API returned an invalid response structure.");
      }

      return { content: completion.choices[0].message.content };
    } catch (error) {
      console.error("Error calling OpenRouter API:", error);
      throw new Error(`Failed to get content from OpenRouter API: ${error.message}`);
    }
  }

  async analyzeIdea(prompt) { return await this._call(prompt); }
  async generateQuestions(prompt) { return await this._call(prompt); }
  async generateContext(prompt) { return await this._call(prompt); }
  async generateTasks(prompt) { return await this._call(prompt); }
  async generateRefinedSpec(prompt) { return await this._call(prompt); }
  async generateDocumentation(prompt) { return await this._call(prompt); }

  async processConversation(prompt) {
    return await this._call(prompt)
  }
  async generateArtifacts(prompt) {
    return await this._call(prompt)
  }
}
