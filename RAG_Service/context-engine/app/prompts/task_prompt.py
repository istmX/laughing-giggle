from .base_prompt import buildBasePrompt

def buildTaskPrompt(idea: str):
  return f"""
{buildBasePrompt()}

### Task
Generate 10 AI-ready implementation MISSIONS for the following project specification:

-----BEGIN USER INPUT-----
{idea}
-----END USER INPUT-----

### Mission Structure
Each mission must be directly executable by an AI coding agent and include:
- title
- objective
- required_context (List specific files/documents to read first)
- instructions (Detailed engineering instructions)
- implementation_steps (Numbered)
- expected_files
- success_criteria
- estimated_complexity (Low, Medium, High)

### Rules
- Tasks must be highly specific, actionable, and self-contained.
- Do not generate generic management tasks.
- If a mission depends on another, explicitly state the dependency.
"""
