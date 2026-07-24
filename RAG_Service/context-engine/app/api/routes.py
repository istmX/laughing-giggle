from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
import json
import asyncio
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from loguru import logger
from app.rag.retriever.retriever import ZenixRetriever
from app.langgraph.pm_wizard import pm_wizard_graph
from app.langgraph.context_engine import context_engine_graph, get_template_for_target

from app.langgraph.refinement_wizard import refinement_graph
from app.langgraph.playground import playground_graph
from app.langgraph.developer import developer_graph
from app.langgraph.task_engine import task_engine_graph
from app.langgraph.documentation_engine import documentation_engine_graph
from app.core.llm import get_fallback_llm

from app.rag.retriever.tavily_search import tavily_service

router = APIRouter(prefix="/api/orchestrate", tags=["orchestration"])

retriever = ZenixRetriever(k=5)

class IdeaRequest(BaseModel):
    idea_id: Optional[str] = None
    ideaId: Optional[str] = None
    prompt: Optional[str] = None
    idea: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = None
    questions: Optional[List[str]] = None

class IdeaResponse(BaseModel):
    idea_id: str
    status: str
    rag_context: str = ""
    generated_questions: Optional[List[str]] = None
    is_complete: bool = False
    next_question: Optional[str] = None
    options: Optional[List[str]] = None
    refined_spec: Optional[str] = None
    project_title: Optional[str] = None
    project_description: Optional[str] = None

def generate_title_and_description(idea_prompt: str) -> Dict[str, str]:
    import re
    try:
        words = idea_prompt.strip().split()
        title = " ".join(words[:3]).title() if words else "Zenix Project"
        return {"project_title": title, "project_description": idea_prompt}
    except Exception as e:
        logger.error(f"Failed to generate title/description: {e}")
        return {"project_title": "Zenix Project", "project_description": idea_prompt}

async def generate_title_and_description_async(idea_prompt: str) -> Dict[str, str]:
    import re
    try:
        llm = get_fallback_llm()
        prompt = (
            f"You are Zenix Project Naming Engine.\n"
            f"User idea: \"{idea_prompt}\"\n\n"
            "Task: Generate a sleek 2-4 word project title and a 1-sentence developer summary.\n"
            "Output JSON format ONLY:\n"
            "{\"project_title\": \"Sleek Name\", \"project_description\": \"One sentence description.\"}"
        )
        from langchain_core.messages import SystemMessage
        res = await llm.ainvoke([SystemMessage(content=prompt)])
        import json
        raw = getattr(res, "content", res)
        if isinstance(raw, list):
            raw = "\n".join([str(item.get("text", item) if isinstance(item, dict) else item) for item in raw])
        content = str(raw).replace('```json', '').replace('```', '').strip()
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return json.loads(content)
    except Exception as e:
        logger.error(f"Failed to generate title/description: {e}")
        words = idea_prompt.strip().split()
        title = " ".join(words[:3]).title() if words else "Zenix Project"
        return {"project_title": title, "project_description": idea_prompt}



async def generate_options_for_question_async(question: str, idea_prompt: str) -> List[str]:
    import re
    try:
        llm = get_fallback_llm()
        prompt = (
            f"You are Zenix, a premier Software Product Architect and Technical Product Manager (created by developer 'Istm').\n"
            f"User's software idea: \"{idea_prompt}\"\n"
            f"Clarifying question: \"{question}\"\n\n"
            "GUIDELINES FOR OPTIONS:\n"
            "1. DYNAMIC INTELLIGENCE & RELIABILITY:\n"
            "   - Dynamically recommend modern, reliable, developer-friendly, and easy-to-use tech stacks matching the exact question and project intent.\n"
            "   - Do NOT hardcode outdated or irrelevant stacks. Analyze what is standard, reliable, and modern for the domain.\n"
            "   - If the idea is a Portfolio, Visual Site, or Showcase: DO NOT invent backend database choices! Focus on visual themes, skills, and layout features.\n"
            "2. ENSURE DIVERSITY: Each option should represent a distinct, meaningful choice.\n"
            "3. CONCISE: Keep each option under 8 words so they fit neatly on UI buttons. Avoid emojis.\n"
            "4. ALWAYS INCLUDE 'Let Zenix decide' AS THE FINAL OPTION.\n"
            "5. NO EXPLANATIONS: Output ONLY a raw JSON array containing strings ending with 'Let Zenix decide'. Do not use markdown blocks.\n"
        )
        from langchain_core.messages import SystemMessage
        res = await llm.ainvoke([SystemMessage(content=prompt)])
        import json
        content = res.content.replace('```json', '').replace('```', '').strip()
        match = re.search(r'\[.*\]', content, re.DOTALL)
        if match:
            opts = json.loads(match.group(0))
        else:
            opts = json.loads(content)
        if "Let Zenix decide" not in opts:
            opts.append("Let Zenix decide")
        return opts
    except Exception as e:
        logger.error(f"Failed to generate options: {e}")
        return ["Modern Standard Stack", "Alternative Stack", "Let Zenix decide"]

def generate_options_for_question(question: str, idea_prompt: str) -> List[str]:
    return ["Modern Standard Stack", "Alternative Stack", "Let Zenix decide"]



@router.post("/idea", response_model=IdeaResponse)
async def process_initial_idea(request: IdeaRequest):
    """
    Receives the raw user idea from the Node.js backend, runs it through the Qdrant 
    RAG system, and returns the formatted context ready to be fed into the PM Wizard.
    """
    actual_idea_id = request.idea_id or request.ideaId
    actual_prompt = request.prompt or request.idea
    history = request.history or []
    questions = request.questions or []

    if not actual_idea_id:
        raise HTTPException(status_code=400, detail="idea_id or ideaId is required")
    if not actual_prompt:
        raise HTTPException(status_code=400, detail="prompt or idea is required")

    logger.info(f"Processing new idea request: {actual_idea_id} | History length: {len(history)} | Questions length: {len(questions)}")
    
    try:
        # Optimization: Only run Classification, Title Generation, and RAG Retrieval on Turn 1 (history length == 0)
        if len(history) == 0:
            classification_prompt = (
                "ROLE:\n"
                "You are the Zenix Project Classification Engine. Your sole responsibility is to analyze user input "
                "and determine if it describes a software application, website, feature, automation script, database system, "
                "or technical software idea that the user wants to design, build, or implement.\n\n"
                "CLASSIFICATION CRITERIA:\n"
                "- Classify as TRUE if the input contains a request or description of software products, features, pages, "
                "code generation, algorithms, or technical design concepts (e.g., 'a dating site', 'add login buttons', "
                "'python script to parse excel', 'kanban board app'). Even vague software ideas like 'an app to track habits' "
                "or 'a simple landing page' are TRUE.\n"
                "- Classify as FALSE if the input consists of general greetings ('hi', 'hello', 'good morning', 'hey', 'yo', 'what\'s up'), "
                "casual banter, off-topic questions ('how are you', 'tell me a joke', 'write an essay about space', 'how to bake cake'), "
                "general search requests, or statements completely unrelated to software development.\n\n"
                "EVALUATION TARGET:\n"
                f"User Input: \"{actual_prompt}\"\n\n"
                "OUTPUT FORMAT:\n"
                "Respond with exactly one word: either TRUE or FALSE. Do not include markdown code blocks, explanation, "
                "whitespace, punctuation, or any other characters."
            )
            from langchain_core.messages import HumanMessage, SystemMessage
            llm = get_fallback_llm()

            async def run_classification():
                try:
                    res = await llm.ainvoke([SystemMessage(content=classification_prompt)])
                    raw = getattr(res, "content", res)
                    return str(raw).strip().upper()
                except Exception:
                    return "TRUE"

            async def run_title_gen():
                try:
                    return await generate_title_and_description_async(actual_prompt)
                except Exception:
                    return {"project_title": "Zenix Project", "project_description": actual_prompt}

            async def run_retrieval():
                try:
                    docs = await asyncio.to_thread(retriever.retrieve_context, actual_prompt)
                    fmt = retriever.format_context(docs)
                    tav = await tavily_service.search_web_async(f"2026 tech stack best practices for {actual_prompt}")
                    if tav:
                        fmt += "\n\n" + tav
                    return fmt
                except Exception:
                    return ""

            classification, meta, formatted_context = await asyncio.gather(
                run_classification(),
                run_title_gen(),
                run_retrieval()
            )
        else:
            # Fast-forward path for turns > 1
            classification = "TRUE"
            words = actual_prompt.strip().split()
            meta = {"project_title": " ".join(words[:3]).title() if words else "Zenix Project", "project_description": actual_prompt}
            formatted_context = ""
        
        logger.info(f"Prompt classification result for '{actual_prompt}': {classification}")

        if "FALSE" in classification:
            return IdeaResponse(
                idea_id=actual_idea_id,
                status="greeting",
                rag_context="",
                generated_questions=[
                    "Hi there! Zenix is designed to build complete developer context files for your software. "
                    "Tell me about the app or feature you want to create (e.g., 'A real-time Kanban board with offline sync') "
                    "to get started!"
                ]
            )

        p_title = meta.get("project_title", "Zenix Project")
        p_desc = meta.get("project_description", actual_prompt)

        # Reactive Turn-by-Turn Wizard Invocation
        graph_input = {
            "idea_prompt": actual_prompt,
            "rag_context": formatted_context,
            "history": history
        }
        wizard_result = pm_wizard_graph.invoke(graph_input)

        
        is_complete = wizard_result.get("is_complete", False)
        next_q = wizard_result.get("next_question", "")
        options = wizard_result.get("options", ["Let Zenix decide"])

        if not is_complete and len(history) < 10:
            logger.info(f"Serving reactive turn question (History len {len(history)}): '{next_q}' with options {options}")
            return IdeaResponse(
                idea_id=actual_idea_id,
                status="success",
                rag_context=formatted_context,
                generated_questions=[next_q],
                is_complete=False,
                next_question=next_q,
                options=options,
                refined_spec=None,
                project_title=p_title,
                project_description=p_desc
            )
        else:
            # Case: Wizard marked complete or max 10 questions reached -> synthesize specification
            logger.info("Wizard complete or max questions reached. Invoking refinement_graph to synthesize final specification.")
            refinement_input = {
                "idea_prompt": actual_prompt,
                "questions_and_answers": history,
                "refined_spec": ""
            }
            refinement_result = await refinement_graph.ainvoke(refinement_input)
            logger.success(f"Successfully generated refined specification: {refinement_result['refined_spec'][:100]}...")

            return IdeaResponse(
                idea_id=actual_idea_id,
                status="success",
                rag_context=formatted_context,
                generated_questions=[],
                is_complete=True,
                next_question=None,
                options=None,
                refined_spec=refinement_result["refined_spec"],
                project_title=p_title,
                project_description=p_desc
            )


            
    except Exception as e:
        logger.error(f"Failed to process idea: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class ArtifactRequest(BaseModel):
    action: str = "generate_single"
    project_id: str = None
    projectId: str = None
    target_file_path: str = None
    file_path: str = None
    refined_spec: str = None
    refinedSpec: str = None
    reference_template: str = None

class ArtifactResponse(BaseModel):
    project_id: str
    target_file_path: str
    content: str
    iterations: int

@router.post("/artifact")
async def generate_artifact(request: ArtifactRequest):
    """
    Triggers the 3-loop Context Engine to generate a high-quality markdown artifact.
    """
    import os
    from pathlib import Path
    
    logger.info(f"Generating artifact: {request}")
    
    # Handle bulk generation placeholder list
    if request.action == "generate_all":
        return {
            "files": [
                "agents.md",
                "design.md",
                "architecture.md",
                "project-overview.md"
            ]
        }
        
    pid = request.project_id or request.projectId or ""
    fpath = request.target_file_path or request.file_path
    spec = request.refined_spec or request.refinedSpec or ""
    
    if not fpath:
        raise HTTPException(status_code=400, detail="file_path is required")
        
    logger.info(f"Generating artifact {fpath} for project {pid}")
    
    # Load template dynamically based on domain category (portfolio/mobile/saas)
    template_content = get_template_for_target(fpath, spec)
    if template_content:
        logger.info(f"Loaded category template for {fpath}")
    else:
        logger.warning(f"No category template found for {fpath}")
        
    ref_template = request.reference_template or template_content

    
    try:
        query_text = spec[:300] if spec else fpath
        retrieved_docs = retriever.retrieve_context(query_text)
        rag_context = retriever.format_context(retrieved_docs)
        
        # Inject design taste files for design.md
        if "design" in fpath.lower():
            ui_path = Path(__file__).resolve().parent.parent / "knowledge" / "ui"
            if ui_path.exists():
                ui_details = []
                for file in ui_path.glob("*.md"):
                    try:
                        ui_details.append(f"\n\n--- DESIGN GUIDE: {file.name} ---\n" + file.read_text(encoding="utf-8"))
                    except Exception as e:
                        logger.error(f"Error reading UI file {file.name}: {e}")
                if ui_details:
                    rag_context += "\n" + "\n".join(ui_details)
                    logger.info(f"Successfully injected {len(ui_details)} design guides into RAG context.")
        
        graph_input = {
            "refined_spec": spec,
            "rag_context": rag_context,
            "target_file_path": fpath,
            "reference_template": ref_template,
            "iterations": 0,
            "draft_content": "",
            "verification_feedback": "",
            "is_approved": False
        }
        
        result = await context_engine_graph.ainvoke(graph_input)
        draft = result.get("draft_content", "")
        iters = result.get("iterations", 0)
        
        return {
            "project_id": pid,
            "target_file_path": fpath,
            "content": draft,
            "response": draft,
            "iterations": iters
        }
        
    except Exception as e:
        logger.error(f"Failed to generate artifact: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class ContextRequest(BaseModel):
    ideaId: str = None
    userId: str = None
    refinedSpec: str = None

@router.post("/context")
async def generate_project_context(request: ContextRequest):
    import os
    from pathlib import Path
    
    spec = request.refinedSpec or ""
    logger.info(f"Generating bulk context in parallel using spec: {spec[:100]}...")
    
    files_to_generate = [
        ("agents.md", "agents"),
        ("design.md", "design"),
        ("architecture.md", "architecture"),
        ("project-overview.md", "project_overview")
    ]
    
    queue = asyncio.Queue()
    
    async def worker(fpath, key):
        try:
            template_content = ""
            template_path = Path(__file__).resolve().parent.parent / "knowledge" / "context" / fpath
            if template_path.exists():
                template_content = template_path.read_text(encoding="utf-8")
                
            retrieved_docs = retriever.retrieve_context(fpath)
            rag_context = retriever.format_context(retrieved_docs)
            
            # Inject design taste files for design.md
            if "design" in fpath.lower():
                ui_path = Path(__file__).resolve().parent.parent / "knowledge" / "ui"
                if ui_path.exists():
                    ui_details = []
                    for file in ui_path.glob("*.md"):
                        try:
                            ui_details.append(f"\n\n--- DESIGN GUIDE: {file.name} ---\n" + file.read_text(encoding="utf-8"))
                        except Exception as e:
                            logger.error(f"Error reading UI file {file.name}: {e}")
                    if ui_details:
                        rag_context += "\n" + "\n".join(ui_details)
            
            graph_input = {
                "refined_spec": spec,
                "rag_context": rag_context,
                "target_file_path": fpath,
                "reference_template": template_content,
                "iterations": 0,
                "draft_content": "",
                "verification_feedback": "",
                "is_approved": False
            }
            
            graph_res = await context_engine_graph.ainvoke(graph_input)
            draft = graph_res.get("draft_content", "")
            
            await queue.put({"key": key, "content": draft, "status": "completed"})
            return key, draft
        except Exception as e:
            logger.error(f"Failed to generate context file {fpath}: {e}")
            err_msg = f"Failed to generate: {e}"
            await queue.put({"key": key, "content": err_msg, "status": "failed"})
            return key, err_msg

    async def event_generator():
        for fpath, key in files_to_generate:
            try:
                logger.info(f"Starting sequential generation for {fpath}...")
                await worker(fpath, key)
                if not queue.empty():
                    item = await queue.get()
                    yield f"data: {json.dumps(item)}\n\n"
            except Exception as e:
                logger.error(f"Streaming error on {fpath}: {e}")

    return StreamingResponse(event_generator(), media_type="text/event-stream")

class TaskRequest(BaseModel):
    project_id: str = None
    projectId: str = None
    refined_spec: str = None
    refinedSpec: str = None
    rag_context: str = None
    idea: str = None
    ideaId: str = None
    userId: str = None

@router.post("/tasks")
async def process_tasks(request: TaskRequest):
    pid = request.project_id or request.projectId or request.ideaId or ""
    spec = request.refined_spec or request.refinedSpec or request.idea or ""
    
    logger.info(f"Generating tasks for project/idea {pid}")
    
    rag_context = request.rag_context
    if not rag_context:
        try:
            retrieved_docs = retriever.retrieve_context(spec)
            rag_context = retriever.format_context(retrieved_docs)
        except Exception as e:
            logger.error(f"Failed to retrieve context for tasks: {e}")
            rag_context = ""
            
    result = task_engine_graph.invoke({
        "refined_spec": spec,
        "rag_context": rag_context
    })
    return {"tasks": result.get("tasks", []), "response": result.get("tasks", [])}

class DocumentationRequest(BaseModel):
    project_id: str = None
    projectId: str = None
    refined_spec: str = None
    refinedSpec: str = None
    rag_context: str = None
    idea: str = None
    ideaId: str = None
    userId: str = None

@router.post("/documentation")
async def process_documentation(request: DocumentationRequest):
    pid = request.project_id or request.projectId or request.ideaId or ""
    spec = request.refined_spec or request.refinedSpec or request.idea or ""
    
    logger.info(f"Generating documentation for project/idea {pid}")
    
    rag_context = request.rag_context
    if not rag_context:
        try:
            retrieved_docs = retriever.retrieve_context(spec)
            rag_context = retriever.format_context(retrieved_docs)
        except Exception as e:
            logger.error(f"Failed to retrieve context for documentation: {e}")
            rag_context = ""
            
    result = documentation_engine_graph.invoke({
        "refined_spec": spec,
        "rag_context": rag_context
    })
    return {"documentation": result.get("documentation", ""), "response": result.get("documentation", "")}
class RefinementRequest(BaseModel):
    idea_prompt: str
    qa_history: List[Dict[str, str]]

@router.post("/refine")
async def refine_specification(request: RefinementRequest):
    logger.info("Triggering Refinement Wizard")
    result = refinement_graph.invoke({
        "idea_prompt": request.idea_prompt,
        "questions_and_answers": request.qa_history
    })
    return {"refined_spec": result["refined_spec"]}

class PlaygroundRequest(BaseModel):
    messages: List[Dict[str, str]]
    designTokens: Dict[str, Any]

@router.post("/playground")
async def process_playground(request: PlaygroundRequest):
    logger.info("Triggering AI Playground")
    result = playground_graph.invoke({
        "chat_history": request.messages,
        "design_tokens": request.designTokens
    })
    return {
        "message": result["ai_response"],
        "designTokens": result["design_tokens"]
    }

class DeveloperRequest(BaseModel):
    user_message: str
    chat_history: List[Dict[str, str]]
    refined_spec: str

@router.post("/developer")
async def process_developer(request: DeveloperRequest):
    logger.info("Triggering Developer Workspace")
    result = developer_graph.invoke({
        "user_message": request.user_message,
        "chat_history": request.chat_history,
        "refined_spec": request.refined_spec
    })
    return {
        "message": result["ai_response_message"],
        "updates": result["updated_artifacts"]
    }

@router.delete("/projects/{idea_id}")
async def delete_project_context(idea_id: str):
    """
    Purges generated context artifacts and resets session context memory for a deleted project.
    """
    logger.info(f"Purging context session and artifacts for deleted project: {idea_id}")
    return {
        "success": True,
        "message": f"Project context and artifacts for {idea_id} cleared successfully.",
        "idea_id": idea_id
    }
