import { GoogleGenerativeAI } from "@google/generative-ai";
import BaseProvider from "./base.provider.js";

export class GeminiProvider extends BaseProvider {
  constructor() {
    super();
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async _call(prompt) {
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return { content: response.text() };
  }

  async analyzeIdea(prompt) { return await this._call(prompt); }
  async generateQuestions(prompt) { return await this._call(prompt); }
  async generateContext(prompt) { return await this._call(prompt); }
  async generateTasks(prompt) { return await this._call(prompt); }
  async generateRefinedSpec(prompt) { return await this._call(prompt); }
  async generateDocumentation(prompt) { return await this._call(prompt); }
}
