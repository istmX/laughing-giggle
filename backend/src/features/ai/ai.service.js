import {GoogleGenAI} from '@google/genai';
import {buildIdeaAnalysisPrompt} from './ai.prompt.js';
import {IdeaAnalysisSchema} from './ai.validator.js';


const ai = GoogleGenAI({
    apikey:process.env.GEMINI_API_KEY
});



export const analyzeIdeaWithAI = async (
  idea,
  brief
) => {
  try {
    const prompt = buildIdeaAnalysisPrompt(
      idea,
      brief
    );

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

    const text =
      response.text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const parsed = JSON.parse(text);

    return IdeaAnalysisSchema.parse(parsed);

  } catch (error) {
    console.error(
      "AI analysis failed:",
      error
    );

    throw error;
  }
};