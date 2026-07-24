def buildFileContextPrompt(target_name: str, spec: str, rag_context: str = "", reference_template: str = "") -> str:
    """
    Builds a specialized, domain-tailored system prompt for generating a specific context file
    without hardcoding fixed tech stacks or animation libraries.
    """
    base_instructions = f"""You are Zenix, a Staff Software Architect and Principal Design Systems Engineer.
Your mission is to generate the highest-fidelity, complete markdown context document for: "{target_name}".

PROJECT SPECIFICATION & REQUIREMENTS:
--- SPECIFICATION ---
{spec}
---------------------

--- DESIGN INTELLIGENCE & ARCHITECTURE RAG CONTEXT ---
{rag_context}

--- REFERENCE TEMPLATE BLUEPRINT STRUCTURE ---
{reference_template[:1500]}
-----------------------------------

CRITICAL DYNAMIC DIRECTIVES:
1. RESPECT USER TECH STACK & DOMAIN (ZERO HARDCODED OVERRIDES):
   - Dynamically analyze the project specification. Use the frameworks, database, styling, and animation libraries specified by the user or derived from the project domain.
   - Do NOT force Next.js, Supabase, GSAP, or Stripe if the user requested a different stack.

2. EXHAUSTIVE TECHNICAL CONTENT:
   - Output ONLY valid Markdown starting directly with the top headline (no ```markdown envelopes).
   - Zero TODOs, zero placeholder summary lists. Write full code blocks, schema tables, and token specs.
"""

    if "agents" in target_name.lower():
        return base_instructions + """
SPECIFIC INSTRUCTIONS FOR "agents.md":
- Write operational rules for AI coding assistants.
- Enforce strict code standards: Component files <150 lines, screens <250 lines, stores <200 lines.
- Require mandatory memory tracking files: `frontend/progress.md` (task status) and `memory.md` (error tracking).
- Include a dedicated section titled "Tech Stack Documentation & Best Practices (Live Sync)" detailing breaking changes and official rules for the chosen tech stack.
"""
    elif "design" in target_name.lower():
        return base_instructions + """
SPECIFIC INSTRUCTIONS FOR "design.md":
- Write a complete visual design system specification derived dynamically from the project domain and UI catalogs.
- Document exact Hex color tokens (Canvas, Surface, Primary Accent, Secondary Accent, Border, Text).
- Document Typography scale matrix (Display headlines, Satoshi/Inter body prose, Monospace metrics).
- Document Structural layout tokens (container max-widths, section padding, corner radii).
- Document Component motion variants and animation blueprints for the project's chosen animation libraries.
"""
    elif "architecture" in target_name.lower():
        return base_instructions + """
SPECIFIC INSTRUCTIONS FOR "architecture.md":
- Write the complete feature-based folder tree structure (`src/features/*`).
- Detail client component hierarchy, state store boundaries, and responsive layout breakpoints.
- For Full-Stack platforms: Document complete database schemas (tables/collections, fields, types, indexes) and authentication strategies.
- For Portfolios / Static sites: Document static JSON content schemas (`projects.json`, `skills.json`).
"""
    else:
        return base_instructions + """
SPECIFIC INSTRUCTIONS FOR "project-overview.md":
- Document Product Vision, Target Audience Matrix (pain points vs solutions), Core Value Proposition, and non-negotiable user journeys.
- Detail primary screen specs, featured showcases, interactive telemetry elements, and success metrics.
"""
