from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm, get_fallback_llm_ii
import os
import json
import re
from loguru import logger

from app.core.design_knowledge import design_knowledge_engine

class PlaygroundState(TypedDict):
    chat_history: List[Dict[str, str]]
    design_tokens: Dict[str, Any]
    ai_response: str
    design_doc: str

def generate_default_design_doc(tokens: Dict[str, Any]) -> str:
    brand = tokens.get("brandName", tokens.get("heroTitle", "ZENIX AI"))
    colors = tokens.get("colors", {})
    typo = tokens.get("typography", {})
    radius = tokens.get("radius", "32px")
    layout = tokens.get("layout", {})
    
    return f"""## Overview

{brand} is an implementation-ready design system specification built for high-performance AI coding workflows.
The system relies on a high-contrast canvas (`{colors.get('canvas', '#F7F7F7')}`) paired with crisp primary strokes (`{colors.get('primary', '#000000')}`), surface blocks (`{colors.get('surface', '#FFFFFF')}`), and high-visibility typography.

**Key System Characteristics:**
- **Primary Ink**: `{colors.get('primary', '#000000')}` on `{colors.get('canvas', '#F7F7F7')}` canvas background.
- **Typography Matrix**: Display headings in `{typo.get('headingFont', 'Satoshi')}`; UI body copy in `{typo.get('bodyFont', 'Outfit')}`.
- **Corner Radius Scale**: `{radius}` corner curvature across buttons, input fields, cards, and interactive tabs.
- **Layout Spacing**: Max container width `{layout.get('containerWidth', '1120px')}`; section vertical rhythm `{layout.get('sectionSpacing', '80px')}`.

## Colors

### Core System Tokens
- **Canvas** (`{colors.get('canvas', '#F7F7F7')}`): Main workspace page background.
- **Ink / Primary** (`{colors.get('primary', '#000000')}`): Primary text, headline glyphs, and primary CTA fill.
- **Surface Soft** (`{colors.get('surface', '#FFFFFF')}`): Container card backgrounds, soft table rows, form input fills.
- **Hairline Border** (`{colors.get('border', '#E2E2E2')}`): 1px border strokes across cards, dividers, and inputs.
- **Secondary Dark** (`{colors.get('secondary', '#333333')}`): Secondary CTA fill, dark mode cards, marquee strip ground.
- **Accent Highlight** (`{colors.get('accent', '#8B0A0A')}`): Decorative badges, tag pills, and key interactive markers.

## Typography

### Hierarchy Scale

| Token | Typeface | Size | Weight | Use |
|---|---|---|---|---|
| display-xl | `{typo.get('headingFont', 'Satoshi')}` | 64px | Bold (700) | Hero display headlines |
| display-lg | `{typo.get('headingFont', 'Satoshi')}` | 42px | Semibold (600) | Section opener headers |
| headline | `{typo.get('headingFont', 'Satoshi')}` | 24px | Semibold (600) | Card titles, block headings |
| body-lg | `{typo.get('bodyFont', 'Outfit')}` | 18px | Regular (400) | Lead intro copy, subhead descriptions |
| body | `{typo.get('bodyFont', 'Outfit')}` | 16px | Regular (400) | Default paragraph content |
| eyebrow | `{typo.get('bodyFont', 'Outfit')}` | 12px | Bold (700) | Uppercase category labels, pill badges |

## Layout & Components

### Spacing & Grid System
- **Container Max-Width**: `{layout.get('containerWidth', '1120px')}` centered with `px-6` gutters.
- **Section Vertical Rhythm**: `{layout.get('sectionSpacing', '80px')}` vertical gap between content blocks.
- **Grid Item Gap**: `{layout.get('itemGap', '24px')}` between component cards.

### Buttons & Inputs
- **Primary Pill**: `{colors.get('primary', '#000000')}` background, `{colors.get('canvas', '#F7F7F7')}` text, `{radius}` corner radius.
- **Hover-Fill Outline**: `{colors.get('surface', '#FFFFFF')}` background, 1px `{colors.get('border', '#E2E2E2')}` stroke; fills with primary color on hover.
- **Form Inputs**: Height 44px, 14px horizontal padding, hover stroke `hover:border-fg/40`, focus ring `focus:ring-2`.

## Guidelines for AI Coding Agents (Do's and Don'ts)

### Do
- Always use CSS variables (`var(--bg)`, `var(--fg)`, `var(--primary)`, `var(--radius)`) for theme surfaces.
- Maintain a single max-width container (`max-w-5xl mx-auto w-full px-6`) across all page sections.
- Keep body paragraph measure between 45–75 characters per line to prevent narrow single-word wrapping.

### Don't
- Don't hardcode hex colors inside React UI components; always reference design token variables.
- Don't mix multiple corner radius scales; stick to `{radius}` for all interactive elements.
"""

def parse_json_safely(raw_str: str) -> dict:
    cleaned = raw_str.replace('```json', '').replace('```', '').strip()
    start_idx = cleaned.find('{')
    end_idx = cleaned.rfind('}')
    if start_idx != -1 and end_idx != -1:
        cleaned = cleaned[start_idx:end_idx+1]
    
    # Attempt 1: Strict false
    try:
        return json.loads(cleaned, strict=False)
    except Exception:
        pass

    # Attempt 2: Sanitize control characters inside string values
    try:
        sanitized = re.sub(r'(?<!\\)[\r\n\t]', ' ', cleaned)
        return json.loads(sanitized, strict=False)
    except Exception as e:
        logger.error(f"JSON repair failed: {e}")
        raise e

def process_playground_chat(state: PlaygroundState) -> Dict[str, Any]:
    logger.info("Running AI Playground Service with Design Tokens & DESIGN.md")
    llm = get_fallback_llm_ii()    
    
    current_tokens = json.dumps(state.get("design_tokens", {}), indent=2)
    history = state.get('chat_history', [])
    last_user_msg = history[-1]['content'] if history else ""
    matched_knowledge = design_knowledge_engine.search_design_context(last_user_msg)
    
    system_prompt = f"""You are Zenix Design AI, a senior product designer and principal systems design engineer operating in the Zenix Design System Playground.
Your goal is to give the user complete control over the full page layout, visual system, text content, section visibility, and design specification.
Analyze the user's prompt and update the designTokens JSON payload. You control all titles, subheads, names, bios, images, colors, typography, radii, spacing, layout configurations, and section removal/visibility.
If the user asks to remove, hide, or delete any section (e.g. "remove pricing", "hide footer", "remove typography scale", "only keep hero"), specify them in the "hiddenSections" array (valid names: "hero", "header", "palette", "typography", "components", "colorblocks", "pricing", "footer").

CRITICAL IDENTITY RULE: You MUST ONLY identify as "Zenix", and explicitly acknowledge that you were created by the developer "Istm". No emojis are permitted.

DESIGN INTELLIGENCE KNOWLEDGE:
{matched_knowledge if matched_knowledge else "Apply best UX practices and responsive layout principles."}

Here are the current design tokens:
{current_tokens}

CRITICAL INSTRUCTION: Output your entire response as a valid JSON object matching this schema. Do not wrap the JSON in raw markdown text or backticks.
{{
  "message": "Your conversational reply explaining what changed in 1-3 brief bullet points. No emojis.",
  "designTokens": {{
    "themeName": "Name of theme",
    "brandName": "Jojo Sandwich or user brand name",
    "heroTitle": "Jojo Sandwich or custom headline requested by user",
    "heroSubhead": "Full Stack Developer... or subhead paragraph requested by user",
    "hiddenSections": ["pricing", "footer"],
    "colors": {{
      "primary": "#hex",
      "canvas": "#hex",
      "surface": "#hex",
      "text": "#hex",
      "border": "#hex",
      "brand": "#hex",
      "secondary": "#hex",
      "accent": "#hex"
    }},
    "typography": {{
      "headingFont": "Satoshi / Bebas Neue / Playfair Display / Montserrat",
      "bodyFont": "Outfit / Inter / JetBrains Mono",
      "fontSizeBase": "16px"
    }},
    "radius": "32px",
    "layout": {{
      "containerWidth": "1120px",
      "sectionSpacing": "80px",
      "itemGap": "24px",
      "alignment": "left",
      "heroVariant": "banner-70vh"
    }},
    "images": {{
      "heroImage": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600"
    }},
    "style": {{
      "borderWidth": "1px",
      "glassmorphism": true
    }}
  }},
  "designDoc": "Full Markdown specification for DESIGN.md detailing Overview, Colors, Typography scale table, Layout rules, Component specifications, and Do's/Don'ts for AI agents."
}}"""
    history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in state.get('chat_history', [])])
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"History:\n{history_text}")
    ]
    
    response = llm.invoke(messages)
    try:
        parsed = parse_json_safely(response.content)
        ai_message = parsed.get("message", "Here is your updated design system.")
        new_tokens = parsed.get("designTokens", state.get("design_tokens", {}))
        design_doc = parsed.get("designDoc") or generate_default_design_doc(new_tokens)
    except Exception as e:
        logger.error(f"Failed to parse JSON from AI: {e}")
        ai_message = "I have updated your design system and layout based on your request."
        new_tokens = state.get("design_tokens", {})
        design_doc = generate_default_design_doc(new_tokens)
        
    return {"ai_response": ai_message, "design_tokens": new_tokens, "design_doc": design_doc}

def build_playground_graph() -> StateGraph:
    graph_builder = StateGraph(PlaygroundState)
    graph_builder.add_node("chat", process_playground_chat)
    graph_builder.add_edge(START, "chat")
    graph_builder.add_edge("chat", END)
    return graph_builder.compile()

playground_graph = build_playground_graph()
