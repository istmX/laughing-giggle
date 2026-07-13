import Groq from "groq-sdk";
import BaseProvider from "./base.provider.js";

export class GroqProvider extends BaseProvider {
  constructor() {
    super();
    this.primaryKey = process.env.GROQ_API_KEY;
    this.secondaryKey = process.env.GROQ_API_KEY_II;
    this.groq = new Groq({
      apiKey: this.primaryKey,
    });
    this.model = "llama-3.3-70b-versatile";
  }

  async _call(prompt) {
    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: this.model,
      });
      return { content: chatCompletion.choices[0].message.content };
    } catch (error) {
      const errStr = error.message || '';
      if (this.secondaryKey && (errStr.includes('429') || errStr.includes('limit') || errStr.includes('quota') || errStr.includes('exhausted'))) {
        console.warn('Primary Groq key exhausted. Retrying with GROQ_API_KEY_II...');
        try {
          const secondaryGroq = new Groq({ apiKey: this.secondaryKey });
          const chatCompletion = await secondaryGroq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: this.model,
          });
          if (chatCompletion.choices[0]?.message?.content) {
            this.groq = secondaryGroq;
            return { content: chatCompletion.choices[0].message.content };
          }
        } catch (secondaryError) {
          console.error('Error calling secondary Groq API:', secondaryError);
        }
      }
      throw error;
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

  async developerChat(prompt) {
    return await this._call(prompt)
  }
}
