import { GoogleGenAI } from '@google/genai'

import BaseProvider from './base.provider.js'

export class GeminiProvider extends BaseProvider {
  constructor() {
    super()
    this.primaryKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
    this.secondaryKey = process.env.GEMINI_API_KEY_II
    
    if (!this.primaryKey) {
      throw new Error('Missing GEMINI_API_KEY: set GEMINI_API_KEY or GOOGLE_API_KEY in environment')
    }

    this.ai = new GoogleGenAI({ apiKey: this.primaryKey })
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
      const errStr = error.message || '';
      if (this.secondaryKey && (errStr.includes('429') || errStr.includes('limit') || errStr.includes('quota') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('exhausted'))) {
        console.warn('Primary Gemini key exhausted. Retrying with GEMINI_API_KEY_II...');
        try {
          const secondaryAi = new GoogleGenAI({ apiKey: this.secondaryKey })
          const response = await secondaryAi.models.generateContent({
            model: this.model,
            contents: prompt,
          })
          const text = typeof response?.text === 'string' ? response.text.trim() : ''
          if (text) {
            this.ai = secondaryAi
            return { content: text }
          }
        } catch (secondaryError) {
          console.error('Error calling secondary Gemini API:', secondaryError)
        }
      }
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
