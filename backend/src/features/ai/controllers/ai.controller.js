import mongoose from "mongoose";
import AiGeneration from "../ai.model.js";
import { executeWithFallback } from "../graphs/fallback_chain.js";

export class AiController {
  constructor() {
  }

  analyzeIdea = async (req, res) => {
    try {
        const { idea } = req.body;
        if (!idea) {
            return res.status(400).json({ success: false, message: "Idea is required" });
        }
        
       if (idea){
        const prompt = `Analyze this idea: ${idea}`;
        const analysis = await executeWithFallback(prompt);
        return res.status(200).json({ success: true, message: "Idea analyzed successfully", data: {
            groq: analysis.response,
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