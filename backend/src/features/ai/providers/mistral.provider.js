import OpenAI from "openai";
import BaseProvider from "./base.provider.js";

export class MistralProvider extends BaseProvider {
  constructor() {
    super();
    this.primaryKey = process.env.MISTRAL_API_KEY;
    this.secondaryKey = process.env.MISTRAL_API_KEY_II;
    this.openai = new OpenAI({
      baseURL: "https://api.mistral.ai/v1",
      apiKey: this.primaryKey || "dummy",
    });
    this.model = "mistral-small-2506";
  }

  async _call(prompt) {
    if (!this.primaryKey) {
      throw new Error("MISTRAL_API_KEY is not defined");
    }
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: this.model,
      });
      return { content: completion.choices[0].message.content };
    } catch (error) {
      const errStr = error.message || '';
      if (this.secondaryKey && (errStr.includes('429') || errStr.includes('limit') || errStr.includes('quota') || errStr.includes('exhausted'))) {
        console.warn('Primary Mistral key exhausted. Retrying with MISTRAL_API_KEY_II...');
        try {
          const secondaryOpenai = new OpenAI({
            baseURL: "https://api.mistral.ai/v1",
            apiKey: this.secondaryKey,
          });
          const completion = await secondaryOpenai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: this.model,
          });
          if (completion.choices[0]?.message?.content) {
            this.openai = secondaryOpenai;
            return { content: completion.choices[0].message.content };
          }
        } catch (secondaryError) {
          console.error('Error calling secondary Mistral API:', secondaryError);
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
