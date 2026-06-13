import OpenAI from "openai";
import BaseProvider from "./base.provider.js";

export class DeepSeekProvider extends BaseProvider {
  constructor() {
    super();
    this.openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
  }

  async analyzeIdea(data) { return { content: "DeepSeek Analysis" }; }
  async generateQuestions(data) { return { content: "DeepSeek Questions" }; }
  async generateContext(data) { return { content: "DeepSeek Context" }; }
  async generateTasks(data) { return { content: "DeepSeek Tasks" }; }
  async generateDocumentation(data) { return { content: "DeepSeek Documentation" }; }
}
