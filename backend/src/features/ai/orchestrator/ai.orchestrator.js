import { GeminiProvider } from "../providers/gemini.provider.js";
import { GroqProvider } from "../providers/groq.provider.js";
import { DeepSeekProvider } from "../providers/deepseek.provider.js";

class AiOrchestrator {
  constructor() {
    this.providers = {
      gemini: new GeminiProvider(),
      grok: new GroqProvider(),
      deepseek: new DeepSeekProvider(),
    };
  }

  async execute(taskType, data) {
    const strategy = this.getStrategy(taskType);
    
    for (const providerKey of strategy) {
      try {
        return await this.providers[providerKey][taskType](data);
      } catch (error) {
        console.error(`Provider ${providerKey} failed for ${taskType}:`, error);
        // Continue to next provider in strategy (fallback)
      }
    }
    
    throw new Error(`All providers failed for task: ${taskType}`);
  }

  getStrategy(taskType) {
    switch (taskType) {
      case 'analyzeIdea':
      case 'generateQuestions':
        return ['grok', 'deepseek'];
      case 'generateContext':
      case 'generateTasks':
      case 'generateDocumentation':
        return ['gemini', 'deepseek'];
      default:
        throw new Error(`Unknown task type: ${taskType}`);
    }
  }
}

export default new AiOrchestrator();
