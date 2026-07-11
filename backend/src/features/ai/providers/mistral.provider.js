import OpenAI from "openai";
import BaseProvider from "./base.provider.js";

export class MistralProvider extends BaseProvider {
  constructor() {
    super();
    this.openai = new OpenAI({
      baseURL: "https://api.mistral.ai/v1",
      apiKey: process.env.MISTRAL_API_KEY || "dummy",
    });
    this.model = "mistral-small-2506";
  }

  async _call(prompt) {
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error("MISTRAL_API_KEY is not defined");
    }
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

  async processConversation(prompt) {
    return await this._call(prompt)
  }
  async generateArtifacts(prompt) {
    return await this._call(prompt)
  }
}
