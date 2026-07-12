import { GoogleGenAI } from '@google/genai'

import BaseProvider from './base.provider.js'

export class GeminiProvider extends BaseProvider {
  constructor() {
    super()

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
    if (!apiKey) {
      throw new Error('Missing GEMINI_API_KEY: set GEMINI_API_KEY or GOOGLE_API_KEY in environment')
    }

    this.ai = new GoogleGenAI({ apiKey })
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  }

  async _call(prompt) {
    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
      })

      const text = typeof response?.text === 'string' ? response.text.trim() : ''

      if (!text) {
        throw new Error('Gemini API returned an empty response.')
      }

      return { content: text }
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      throw new Error(`Failed to get content from Gemini API: ${error.message}`)
    }
  }

  async analyzeIdea(prompt) {
    return await this._call(prompt)
  }

  async generateQuestions(prompt) {
    return await this._call(prompt)
  }

  async generateContext(prompt) {
    return await this._call(prompt)
  }

  async generateTasks(prompt) {
    return await this._call(prompt)
  }

  async generateRefinedSpec(prompt) {
    return await this._call(prompt)
  }

  async generateDocumentation(prompt) {
    return await this._call(prompt)
  }

  async processConversation(prompt) {
    return await this._call(prompt)
  }

  async generateArtifacts(prompt) {
    return await this._call(prompt)
  }
}
