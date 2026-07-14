from .base_prompt import buildBasePrompt

def buildDocumentationPrompt(docType: str = "README.md"):
  return f"""
{buildBasePrompt()}

### Task
Generate a professional, developer-focused engineering document.
Type: {docType}

### Content Guidelines
- Focus on technical accuracy and maintainability.
- Provide comprehensive instructions for implementation, usage, or deployment.
- Absolutely no marketing fluff.
- Use structured Markdown with clear headings and code examples where applicable.
- If documentation is for an API, include request/response payloads, endpoints, and authentication requirements.
"""
