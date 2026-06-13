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
    // Using a reliable model alias provided by OpenRouter
    this.model = "openai/gpt-4o"; 
  }

  async _call(prompt) {
    const completion = await this.client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: this.model,
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
