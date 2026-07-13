import { StateGraph } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const state = {
  messages: {
    value: (x, y) => x.concat(y),
    default: () => [],
  },
  designTokens: {
    value: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  },
  previewHtml: {
    value: (x, y) => y,
    default: () => "",
  },
};

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_II,
  model: "gemini-2.5-flash",
});

const processFeedback = async (state) => {
  const prompt = `Update design tokens based on user feedback. Current tokens: ${JSON.stringify(state.designTokens)}. User messages: ${JSON.stringify(state.messages)}. Return only JSON with new/updated tokens.`;
  const response = await llm.invoke(prompt);
  let newTokens = {};
  try {
    const text = response.content.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    newTokens = JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse design tokens:", e);
  }
  return { designTokens: newTokens };
};

const compilePreview = async (state) => {
  const prompt = `Generate HTML preview for design tokens: ${JSON.stringify(state.designTokens)}. Return only the HTML code.`;
  const response = await llm.invoke(prompt);
  const html = response.content.replace(/\`\`\`html/g, "").replace(/\`\`\`/g, "").trim();
  return { previewHtml: html };
};

const builder = new StateGraph({ channels: state });

builder.addNode("processFeedback", processFeedback);
builder.addNode("compilePreview", compilePreview);

builder.addEdge("__start__", "processFeedback");
builder.addEdge("processFeedback", "compilePreview");
builder.addEdge("compilePreview", "__end__");

export const playgroundGraph = builder.compile();
