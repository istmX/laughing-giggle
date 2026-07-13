import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { executeWithFallback } from "./fallback_chain.js";
import { buildConversationalPrompt } from "../prompts/conversational.prompt.js";

const pmWizardState = {
  messages: {
    value: (x, y) => x.concat(y),
    default: () => [],
  },
  idea: {
    value: (x, y) => y ? y : x,
    default: () => "",
  },
  isComplete: {
    value: (x, y) => y,
    default: () => false,
  },
};

const processConversationNode = async (state) => {
  const prompt = buildConversationalPrompt({
    idea: state.idea,
    history: state.messages
  });

  const aiResult = await executeWithFallback(prompt);
  const response = aiResult.response;

  return {
    messages: [{ role: "assistant", content: JSON.stringify(response) }],
    isComplete: response.is_complete || false,
  };
};

const workflow = new StateGraph({
  channels: pmWizardState,
})
  .addNode("processConversation", processConversationNode)
  .addEdge(START, "processConversation")
  .addEdge("processConversation", END);

export const pmWizardGraph = workflow.compile({ checkpointer: new MemorySaver() });
export const PM_WIZARD_GRAPH_READY = true;

