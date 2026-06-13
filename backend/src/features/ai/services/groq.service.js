import {GroqProvider} from '../providers/groq.provider.js';
import {AiController} from '../controllers/ai.controller.js';
import {GroqPrompts} from '../prompts/groq.prompts.js';
export class GroqService {
  constructor() {
    this.groqProvider = new GroqProvider();
    this.aiController = new AiController();
  }

  async analyzeIdeaWithGroq(idea) {
    try {
    
      const groqResult = await this.groqProvider.analyze(idea);
      const prompt = GroqPrompts.analyzeIdea(idea);
      const response = await this.groqProvider.generate({
        prompt
      });
      return { ...groqResult, ...response };
    } catch (error) {
      console.error("Error analyzing idea with Groq:", error);
      throw error;
    }

}
}

export default GroqService;