import Groq from "groq-sdk";
import BaseProvider from "./base.provider.js";

export class GroqProvider extends BaseProvider {
  constructor() {
    super();
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    this.model = "llama-3.3-70b-versatile";
  }

  async _call(prompt) {
    const chatCompletion = await this.groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: this.model,
    });
    return { content: chatCompletion.choices[0].message.content };
  }

  async analyzeIdea(prompt) { return await this._call(prompt); }
  async generateQuestions(prompt) { return await this._call(prompt); }
  async generateContext(prompt) { return await this._call(prompt); }
  async generateTasks(prompt) { return await this._call(prompt); }
  async generateRefinedSpec(prompt) { return await this._call(prompt); }
  async generateDocumentation(prompt) { return await this._call(prompt); }
}
