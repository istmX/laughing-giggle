from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
import json
from pydantic import BaseModel
from typing import List, Dict, Any
from loguru import logger
from app.rag.retriever.retriever import ZenixRetriever
from app.langgraph.pm_wizard import pm_wizard_graph
from app.langgraph.context_engine import context_engine_graph
from app.langgraph.refinement_wizard import refinement_graph
from app.langgraph.playground import playground_graph
from app.langgraph.developer import developer_graph
from app.langgraph.task_engine import task_engine_graph
from app.langgraph.documentation_engine import documentation_engine_graph

router = APIRouter(prefix="/api/orchestrate", tags=["orchestration"])
retriever = ZenixRetriever(k=5)

class IdeaRequest(BaseModel):
    idea_id: str
    prompt: str

class IdeaResponse(BaseModel):
    idea_id: str
    status: str
    rag_context: str
    generated_questions: List[str]

@router.post("/idea", response_model=IdeaResponse)
async def process_initial_idea(request: IdeaRequest):
    """
    Receives the raw user idea from the Node.js backend, runs it through the Qdrant 
    RAG system, and returns the formatted context ready to be fed into the PM Wizard.
    """
    logger.info(f"Processing new idea request: {request.idea_id}")
    
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
        
    try:
        # Step 1: Retrieve relevant UI/UX and architectural chunks from Qdrant
        retrieved_docs = retriever.retrieve_context(request.prompt)
        
        # Step 2: Format the raw LangChain documents into a single string for the LLM
        formatted_context = retriever.format_context(retrieved_docs)
        
        # Step 3: Run the PM Wizard LangGraph to generate clarification questions
        graph_input = {
            "idea_prompt": request.prompt,
            "rag_context": formatted_context,
            "messages": []
        }
        graph_result = pm_wizard_graph.invoke(graph_input)
        
        logger.success(f"Successfully processed idea {request.idea_id} through RAG and LangGraph")
        
        return IdeaResponse(
            idea_id=request.idea_id,
            status="success",
            rag_context=formatted_context,
            generated_questions=graph_result["generated_questions"]
        )
        
    except Exception as e:
        logger.error(f"Failed to process idea through RAG: {e}")
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
    
    # Load the template from knowledge/context/
    template_content = ""
    try:
        base_name = os.path.basename(fpath).lower()
        if base_name == "readme.md":
            base_name = "project-overview.md"
            
        template_path = Path(__file__).resolve().parent.parent / "knowledge" / "context" / base_name
        if template_path.exists():
            template_content = template_path.read_text(encoding="utf-8")
            logger.info(f"Loaded template from: {template_path}")
        else:
            logger.warning(f"Template not found at: {template_path}")
    except Exception as e:
        logger.error(f"Error loading template: {e}")
        
    ref_template = request.reference_template or template_content
    
    try:
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
        
        result = context_engine_graph.invoke(graph_input)
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
    logger.info(f"Generating bulk context using spec: {spec[:100]}...")
    
    files_to_generate = [
        ("agents.md", "agents"),
        ("design.md", "design"),
        ("architecture.md", "architecture"),
        ("project-overview.md", "project_overview")
    ]
    
    result_dict = {}
    
    for fpath, key in files_to_generate:
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
            
            graph_res = context_engine_graph.invoke(graph_input)
            result_dict[key] = graph_res.get("draft_content", "")
        except Exception as e:
            logger.error(f"Failed to generate context file {fpath}: {e}")
            result_dict[key] = f"Failed to generate: {e}"
            
    return result_dict

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
