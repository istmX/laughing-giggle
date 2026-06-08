export const buildIdeaAnalysisPrompt = (
  idea,
  brief
) => `
You are a senior software architect.

Analyze the following project idea.

Project Idea:
${idea.idea_text || idea.prompt || JSON.stringify(idea)}

Current Brief:
${JSON.stringify(brief)}

Determine:

1. Is the idea complete?
2. What information is missing?
3. What questions should be asked?

Return ONLY valid JSON.

{
  "is_complete": false,
  "missing_fields": [],
  "questions": [
    {
      "key": "",
      "question": ""
    }
  ]
}
`;

export const buildContextGenerationPrompt = (idea, brief) => `
You are a senior software architect and project manager.
Generate a comprehensive technical context for the following project.

Project Idea: ${idea.prompt}
Refined Brief: ${JSON.stringify(brief)}

Generate the following sections in Markdown format:
1. Project Overview
2. Build Plan
3. Architecture (Including a Mermaid diagram)
4. Code Standards
5. UI Rules

Return ONLY valid JSON in this format:
{
  "project_overview": "",
  "build_plan": "",
  "architecture": "",
  "mermaid_diagram": "",
  "code_standards": "",
  "ui_rules": ""
}
`;

export const buildTaskGenerationPrompt = (idea, brief, context) => `
You are a project manager. Based on the project context, generate a list of actionable development tasks.

Project: ${idea.prompt}
Context: ${JSON.stringify(context)}

Return ONLY valid JSON in this format:
{
  "tasks": [
    {
      "title": "",
      "description": "",
      "priority": "low" | "medium" | "high"
    }
  ]
}
`;