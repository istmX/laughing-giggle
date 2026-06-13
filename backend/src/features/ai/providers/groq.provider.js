import Groq from "groq-sdk";
import BaseProvider from "./base.provider.js";

export class GroqProvider extends BaseProvider {
  constructor() {
    super();
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async analyzeIdea(data) { return { content: "Groq Analysis" }; }
  async generateQuestions(data) { return { content: "Groq Questions" }; }
  async generateContext(data) { return { content: "Groq Context" }; }
  async generateTasks(data) { return { content: "Groq Tasks" }; }
  async generateDocumentation(data) { return { content: "Groq Documentation" }; }
}
