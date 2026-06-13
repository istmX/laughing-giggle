import OpenAI from "openai";
import BaseProvider from "./base.provider.js";

export class DeepSeekProvider extends BaseProvider {
  constructor() {
    super();
    this.openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
    this.model = "deepseek-chat";
  }

  async _call(prompt) {
    const completion = await this.openai.chat.completions.create({
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
