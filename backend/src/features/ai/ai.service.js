import {GoogleGenAI} from '@google/genai';
import {buildIdeaAnalysisPrompt} from './ai.prompt.js';
import {IdeaAnalysisSchema} from './ai.validator.js';


const getAI = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};

const ai = getAI();

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
        model: "gemini-2.5-flash-lite",
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