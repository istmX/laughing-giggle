import mongoose from "mongoose";
import AiGeneration from "../ai.model.js";
import { deepseekProvider } from "../providers/deepseek.provider.js";
import { GroqProvider } from "../providers/groq.provider.js";
import { geminiProvider } from "../providers/gemini.provider.js";
import { GroqService } from "../services/groq.service.js";

export class AiController {
  constructor() {
    this.deepseek = new deepseekProvider();
    this.groq = new GroqProvider();
    this.gemini = new geminiProvider();
  }

  analyzeIdea = async (req, res) => {
    try {
        const { idea } = req.body;
        if (!idea) {
            return res.status(400).json({ success: false, message: "Idea is required" });
        }
        
       if (idea){
        const groqResult = await this.groq.analyze(idea);
        
        const groqAnalysis = await GroqService.analyzeIdeaWithGroq(idea);
        return res.status(200).json({ success: true, message: "Idea analyzed successfully", data: {
            groq: groqAnalysis,
        }
           
        });
       }


        }
    
    catch (error) {
        console.error("Error analyzing idea:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}