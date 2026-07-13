import { StateGraph } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const state = {
  messages: {
    value: (x, y) => x.concat(y),
    default: () => [],
  },
  context: {
    value: (x, y) => y,
    default: () => "",
  },
  generatedArtifact: {
    value: (x, y) => y,
    default: () => "",
  },
};

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  modelName: "gemini-1.5-pro",
});

const generateContext = async (state) => {
  const prompt = `Generate context based on the following messages:\n${JSON.stringify(state.messages)}`;
  const response = await llm.invoke(prompt);
  return { context: response.content };
};

const generateArtifact = async (state) => {
  const prompt = `Generate an artifact based on the context:\n${state.context}`;
  const response = await llm.invoke(prompt);
  return { generatedArtifact: response.content };
};

const validateArtifact = async (state) => {
  // Dummy validation node
  return { ...state };
};

const builder = new StateGraph({ channels: state });

builder.addNode("generateContext", generateContext);
builder.addNode("generateArtifact", generateArtifact);
builder.addNode("validateArtifact", validateArtifact);

builder.addEdge("__start__", "generateContext");
builder.addEdge("generateContext", "generateArtifact");
builder.addEdge("generateArtifact", "validateArtifact");
builder.addEdge("validateArtifact", "__end__");

export const contextEngineGraph = builder.compile();
