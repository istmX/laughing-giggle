import { StateGraph, START, END } from "@langchain/langgraph";
import { executeWithFallback } from "./fallback_chain.js";

const state = {
  requirements: {
    value: (x, y) => y ? y : x,
    default: () => "",
  },
  contextData: {
    value: (x, y) => y ? y : x,
    default: () => "",
  },
  generatedArtifact: {
    value: (x, y) => y ? y : x,
    default: () => "",
  },
  validationFeedback: {
    value: (x, y) => y ? y : x,
    default: () => "",
  },
  isValid: {
    value: (x, y) => y !== undefined ? y : x,
    default: () => false,
  },
  iterationCount: {
    value: (x, y) => x + (y || 0),
    default: () => 0,
  },
};

const generateArtifactNode = async (state) => {
  let prompt = `You are an expert developer. Generate the requested artifact code based on the context.\n\nContext:\n${state.contextData}\n\nRequirements:\n${state.requirements}\n\n`;
  if (state.validationFeedback) {
    prompt += `PREVIOUS VALIDATION FAILED. Fix these issues:\n${state.validationFeedback}\n\n`;
  }
  prompt += "Return ONLY the raw code/content for the artifact in a valid JSON object format: { \"content\": \"...\" }";
  
  const result = await executeWithFallback(prompt);
  let content = result.response?.content || result.response;
  
  return { generatedArtifact: content, iterationCount: 1 }; // Adds 1 to count
};

const validateArtifactNode = async (state) => {
  const prompt = `You are a strict QA reviewer. Evaluate the following artifact against the requirements.\n\nRequirements:\n${state.requirements}\n\nArtifact:\n${state.generatedArtifact}\n\nAnalyze if the artifact fulfills ALL requirements and has NO major syntax errors. Return a JSON object with 'isValid' (boolean) and 'feedback' (string with actionable fixes if invalid, or empty if valid). Format: { "isValid": true/false, "feedback": "..." }`;
  
  const result = await executeWithFallback(prompt);
  const isValid = result.response?.isValid || false;
  const feedback = result.response?.feedback || "Validation failed.";

  return { isValid, validationFeedback: isValid ? "" : feedback };
};

const routingLogic = (state) => {
  if (state.isValid || state.iterationCount >= 3) {
    return END;
  }
  return "generateArtifact";
};

const builder = new StateGraph({ channels: state });

builder.addNode("generateArtifact", generateArtifactNode);
builder.addNode("validateArtifact", validateArtifactNode);

builder.addEdge(START, "generateArtifact");
builder.addEdge("generateArtifact", "validateArtifact");
builder.addConditionalEdges("validateArtifact", routingLogic);

export const contextEngineGraph = builder.compile();
export const CONTEXT_ENGINE_GRAPH_READY = true;
