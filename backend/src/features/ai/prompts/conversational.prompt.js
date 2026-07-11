import { buildBasePrompt } from "./base.prompt.js";

export const buildConversationalPrompt = (data) => {
  const history = data.history || [];
  
  // Check if user requested to skip remaining questions
  const userRequestedSkip = history.some(item => {
    if (typeof item.answer !== 'string') return false;
    const ans = item.answer.toLowerCase().trim();
    return (
      ans === "no" ||
      ans === "none" ||
      ans === "nothing" ||
      ans === "no other" ||
      ans === "no other details" ||
      ans === "nothing else" ||
      ans === "no, thanks" ||
      ans === "no, thank you" ||
      ans.includes("let zenix decide all") || 
      ans.includes("let zenix decide for all") || 
      ans.includes("let ai decide for all") || 
      ans.includes("let ai decide all") || 
      ans.includes("no other details") ||
      ans.includes("generate the final spec")
    );
  });

  return `
${buildBasePrompt()}

### Task
You are a senior software architect gathering product and high-level architectural requirements for:
Original Idea: "${data.idea}"

Q&A History (questions asked so far and user answers):
${JSON.stringify(history, null, 2)}

${userRequestedSkip ? `
### CRITICAL INSTRUCTION
The user has requested to finalize the specification. You MUST end the conversation now.
Set "is_complete": true, "next_question": null, "options": null, and generate the final "refined_spec" based on the accumulated context, filling in any gaps with sensible engineering decisions.
Do NOT ask another question.
` : `
### Your Responsibilities
1. **Ask Clarifying Questions**: Even if the Original Idea is detailed, you MUST ask at least 1-2 clarifying questions (e.g., about target audience, specific features, tech stack, or styling) before setting "is_complete": true. Do not skip questions unless the user explicitly asks you to.
    2. **Stay High-Level**: Focus strictly on product features, core user flows, and high-level requirements. DO NOT get bogged down in deep technical details (such as specific NLP algorithms, libraries, DB schemas, cloud hosting setups, or low-level implementation tech) unless requested.
    3. **Ask About Tech Stack, Styling, Colors, and Fonts**: If not specified in the Original Idea or History, you **MUST** ask about the user's preferred tech stack, styling framework (e.g. Tailwind CSS, NativeWind, Shadcn UI, or customized CSS frameworks), target color palette/theme, and typography/fonts during the Q&A loop. Provide clear, selectable suggested options (e.g. specific tools, palettes, clean font pairs, and a "Let Zenix decide" option).
    4. **Filler / Wrap-up Questions**: If you ask a generic wrap-up question (e.g. asking if the user has any other details to add, or if they are ready to finalize), you **MUST** provide these exact options:
       ["I have no other details, please generate the final spec", "Let Zenix decide all remaining details", "Write my own details"]
    5. **Exit Early**: If the idea is already clear enough, or you do not have a highly specific, high-value product or architectural question left, immediately set "is_complete": true. Do NOT ask generic, open-ended filler questions without options.
    6. **Options Requirement (Mostly MCQs, No Manual Typing)**: If you set "is_complete": false, you **MUST** provide exactly 3 specific, diverse suggested options/answers in the "options" array for the next_question. Frame almost all questions as Multiple-Choice Questions (MCQs) where the user can pick one of the options. Avoid open-ended text questions that require manual typing.
    `}

    ### Guidelines for Generating "refined_spec" (When is_complete is true)
    When generating the final "refined_spec", you are writing a prompt/context file for a **coding AI agent** who will build this project. Follow these rules:
    - **No Ambiguity / No Ors**: Specify **exactly one** concrete technology stack, exactly one specific color scheme, and exactly one concrete typography scale. Never use options like "React or Angular" or "MongoDB or PostgreSQL". 
    - **Zenix Tech Defaults**: If the user did not specify a tech stack (or chose "Let Zenix decide"):
      - For standard web apps: Use Next.js (Frontend), Node.js with Express (Backend), and Supabase or MongoDB (Database).
      - For mobile apps: Use React Native.
    - **Zenix Design Defaults (Colors & Fonts)**: If the user chose "Let Zenix decide" (or left it unspecified), select a specific, high-end color combination (inspired by the 100 pairs in 'color_theory.md', matching the app's vibe—e.g., "Stormy morning" for professional tools, "Blue eclipse" for sleek dark mode SaaS, "Fresh peach" or "Blooming romance" for lifestyle/social, etc.) and specific, modern font pairings drawing from the 25 best sans serif fonts in 'sans_serif_fonts.md' (e.g. Inter for clean app interfaces, DM Sans for modern websites, Cabin for friendly humanist brands, or Be Vietnam Pro for dashboards). Never output placeholder colors like "generic purple" or abstract values.
- **Structure for AI Coding Agents**: Organize the specification in clear, structured markdown chapters tailored for an AI developer:
  - **Project Overview & Objectives**
  - **Concrete Tech Stack & Architecture** (exactly one set of tools, plus a concrete design token structure layout based on the primitive, semantic, and component token rules from 'product_design.md')
  - **Feature Specifications & Core Flows** (mapped as a cohesive user journey/story utilizing the principles of progressive disclosure and welcoming entry design from 'storytelling.md')
  - **API Endpoints & Integration Rules**
  - **AI Agent Implementation Guidelines** (standards for building the codebase step-by-step, specifying precise UI transitions and state motion using standard names from 'animations.md' like staggers, morphs, pop-ins, layout animations, or shared element transitions)

### Output Structure
Return a STRICT JSON object with EXACTLY this shape. Do not add any text outside the JSON:

{
  "is_complete": boolean,
  "next_question": "string (required if is_complete is false, null if is_complete is true)",
  "options": ["string", "string", "string"], // Provide exactly 3 specific, diverse suggested answers for next_question if is_complete is false. null if is_complete is true.
  "refined_spec": "string (required if is_complete is true — write the comprehensive specification document meant for AI agents. null if is_complete is false)"
}
`;
};
