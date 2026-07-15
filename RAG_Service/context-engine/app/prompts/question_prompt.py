from .base_prompt import buildBasePrompt

def buildQuestionPrompt():
  return f"""
{buildBasePrompt()}

### Task
Generate intelligent, non-generic clarification questions based on: "{data.idea}"

### Requirements
- Focus on removing ambiguity in requirements, architecture, and user flows.
- Do not ask questions already answered in the idea prompt.
- Generate between 5 and 10 highly specific questions.
- Each question must explain *why* clarification is needed.

### Output Requirements
Return a strictly structured JSON object in the following format:
{
  "questions": [
    {
      "id": 1,
      "title": "string (the question itself)",
      "reason": "string (why clarification is needed)",
      "options": ["string", "string", "string"] // Provide 3-4 sensible default options the user can choose from, plus a "Write my own" mental option.
    }
  ]
}
"""
