import { GeminiProvider } from "../providers/gemini.provider.js";
import { GroqProvider } from "../providers/groq.provider.js";
import { DeepSeekProvider } from "../providers/deepseek.provider.js";
import { OpenRouterProvider } from "../providers/openrouter.provider.js";

class AiOrchestrator {
  constructor() {
    this.providers = {
      gemini: new GeminiProvider(),
      grok: new GroqProvider(),
      deepseek: new DeepSeekProvider(),
      openrouter: new OpenRouterProvider(),
    };
    this.TIMEOUT_MS = 10000; // 10s
  }

  async execute(taskType, data) {
    const strategy = this.getStrategy(taskType);
    let fallbackUsed = false;
    let fallbackProvider = null;

    for (let i = 0; i < strategy.length; i++) {
      const providerKey = strategy[i];
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout after ${this.TIMEOUT_MS}ms`)), this.TIMEOUT_MS)
        );

        const response = await Promise.race([
          this.providers[providerKey][taskType](data),
          timeoutPromise
        ]);

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
      case 'generateRefinedSpec':
        return ['grok', 'deepseek', 'openrouter'];
      case 'generateContext':
      case 'generateTasks':
      case 'generateDocumentation':
        return ['gemini', 'deepseek', 'openrouter'];
      default:
        throw new Error(`Unknown task type: ${taskType}`);
    }
  }
}

export default new AiOrchestrator();
