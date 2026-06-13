import { GoogleGenAI } from "@google/genai";
import BaseProvider from "./base.provider.js";

export class GeminiProvider extends BaseProvider {
  constructor() {
    super();
    this.gemini = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async analyzeIdea(data) { return { content: "Gemini Analysis" }; }
  async generateQuestions(data) { return { content: "Gemini Questions" }; }
  async generateContext(data) { return { content: "Gemini Context" }; }
  async generateTasks(data) { return { content: "Gemini Tasks" }; }
  async generateDocumentation(data) { return { content: "Gemini Documentation" }; }
}
