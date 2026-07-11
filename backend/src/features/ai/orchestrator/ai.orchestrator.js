import { GeminiProvider } from "../providers/gemini.provider.js";
import { GroqProvider } from "../providers/groq.provider.js";
import { MistralProvider } from "../providers/mistral.provider.js";
import { OpenRouterProvider } from "../providers/openrouter.provider.js";

class AiOrchestrator {
  constructor() {
    this.providers = {
      grok: new GroqProvider(),
      mistral: new MistralProvider(),
      openrouter: new OpenRouterProvider(),
      gemini: new GeminiProvider(),
    };
    this.TIMEOUT_MS = 25000; // 25s timeout for faster fallbacks
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
      case 'processConversation':
        return ['grok', 'mistral', 'openrouter', 'gemini'];
      case 'generateContext':
      case 'generateTasks':
      case 'generateDocumentation':
        return ['grok', 'mistral', 'openrouter', 'gemini'];
      default:
        throw new Error(`Unknown task type: ${taskType}`);
    }
  }
}

export default new AiOrchestrator();
