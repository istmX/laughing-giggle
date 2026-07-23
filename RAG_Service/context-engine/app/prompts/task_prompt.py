from .base_prompt import buildBasePrompt

def buildTaskPrompt(idea: str):
  return f"""
{buildBasePrompt()}

### Task
You are Zenix Lead Architect & Engineering Manager.
Generate a structured JSON list of exactly 10 high-fidelity, actionable, and sequential AI-ready implementation MISSIONS for the following finalized project specification:

-----BEGIN SPECIFICATION-----
{idea}
-----END SPECIFICATION-----

### Mission Object Schema
Each implementation mission object in the array must match this schema:
{{
  "title": "Clear, technical title of the mission",
  "objective": "Detailed objective of what this mission accomplishes",
  "estimated_complexity": "Low" | "Medium" | "High",
  "required_context": [
    "List specific files/documents the coding agent must read before writing code (e.g. agents.md, design.md, specific features/controllers)."
  ],
  "instructions": "Exhaustive details on architectural decisions, coding patterns, libraries to use, and constraints to respect.",
  "implementation_steps": [
    "Step 1: Concrete engineering step",
    "Step 2: Concrete engineering step",
    "..."
  ],
  "expected_files": [
    "List exact filenames and paths to create or modify (e.g. src/features/auth/ui/LoginForm.jsx)"
  ],
  "success_criteria": [
    "Validation rule 1 (e.g. file exists and contains ZM1 pattern)",
    "Validation rule 2 (e.g. returns a 200 payload with specific keys)"
  ]
}}

### Rules for Generating Missions
1. GRANULAR & ACTIONABLE:
   - Missions must represent real engineering units of work (e.g., Database setup, specific API route controller implementation, single component layout integration).
   - Do NOT output abstract, non-coding, or generic project management items (e.g., "Conduct QA review" or "Monitor deployment metrics").
2. SYSTEMATIC SEQUENCE:
   - Organize missions chronologically, starting from setup and schema initialization, followed by core APIs and UI/pages integration, concluding with validation/refactoring.
   - If a mission depends on files/APIs built in a previous mission, clearly call it out.
3. ABSOLUTELY NO SUMMARIES:
   - The "instructions" and "implementation_steps" fields must be highly descriptive, outlining code logic, methods, and functions. Do not say "implement the rest".
   - Keep the tone developer-first, clear, minimal, and highly structured. No emojis are permitted.
"""
