import OpenAI from "openai";
import BaseProvider from "./base.provider.js";

export class OpenRouterProvider extends BaseProvider {
  constructor() {
    super();
    this.client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "https://zenix.ai",
        "X-OpenRouter-Title": "Zenix",
      },
    });
    // Using a reliable model
    this.model = "meta-llama/llama-3.3-70b-instruct"; 
  }

  async _call(prompt) {
    const completion = await this.client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: this.model,
      max_tokens: 4000, // Capping tokens to fit in free tier/credits
    });
    return { content: completion.choices[0].message.content };
  }

  async analyzeIdea(prompt) { return await this._call(prompt); }
  async generateQuestions(prompt) { return await this._call(prompt); }
  async generateContext(prompt) { return await this._call(prompt); }
  async generateTasks(prompt) { return await this._call(prompt); }
  async generateRefinedSpec(prompt) { return await this._call(prompt); }
  async generateDocumentation(prompt) { return await this._call(prompt); }
}
