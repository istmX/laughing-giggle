export const buildIdeaAnalysisPrompt = (
  idea,
  brief
) => `
You are a senior software architect.

Analyze the following project idea.

Project Idea:
${idea.idea_text || idea.title || JSON.stringify(idea)}

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