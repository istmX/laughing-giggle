/**
 * PM Wizard LangGraph State Machine
 * TODO: Implement with @langchain/langgraph once installed
 *
 * Flow:
 * AnalyzePrompt -> DetermineQuestions -> CollectUserAnswers
 * -> VerifyDetails -> (loop if incomplete) -> RefineSpec
 */

export const PM_WIZARD_GRAPH_READY = false;
