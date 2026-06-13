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
    let fallbackUsed = false;
    let fallbackProvider = null;

    for (let i = 0; i < strategy.length; i++) {
      const providerKey = strategy[i];
      try {
        const response = await this.providers[providerKey][taskType](data);
        
        return {
          response,
          providerUsed: providerKey,
          fallbackUsed,
          fallbackProvider
        };
      } catch (error) {
        console.error(`[AI FALLBACK] Provider: ${providerKey} | Task: ${taskType} | Error: ${error.message}`);
        
        if (i < strategy.length - 1) {
          fallbackUsed = true;
          fallbackProvider = providerKey;
          console.error(`Fallback: ${strategy[i + 1]}`);
        }
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
