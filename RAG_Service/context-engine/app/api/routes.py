from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
import json
from pydantic import BaseModel
from typing import List, Dict
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
    project_id: str
    target_file_path: str
    refined_spec: str
    reference_template: str

class ArtifactResponse(BaseModel):
    project_id: str
    target_file_path: str
    content: str
    iterations: int

@router.post("/artifact")
async def generate_artifact(request: ArtifactRequest):
    """
    Triggers the 3-loop Context Engine to generate a high-quality markdown artifact, streaming updates.
    """
    logger.info(f"Generating artifact {request.target_file_path} for project {request.project_id}")
    
    try:
        search_query = f"{request.target_file_path} design system UI rules tokens components architecture"
        retrieved_docs = retriever.retrieve_context(search_query)
        rag_context = retriever.format_context(retrieved_docs)
        
        graph_input = {
            "refined_spec": request.refined_spec,
            "rag_context": rag_context,
            "target_file_path": request.target_file_path,
            "reference_template": request.reference_template,
            "iterations": 0,
            "draft_content": "",
            "verification_feedback": "",
            "is_approved": False
        }
        
        async def event_stream():
            try:
                for output in context_engine_graph.stream(graph_input):
                    # output is a dict mapping node_name -> state update
                    for node_name, state_update in output.items():
                        data = json.dumps({
                            "node": node_name,
                            "iterations": state_update.get("iterations", 0),
                            "is_approved": state_update.get("is_approved", False),
                            "content": state_update.get("draft_content", "")
                        })
                        yield f"data: {data}\n\n"
            except Exception as e:
                logger.error(f"Stream error: {e}")
                yield f"event: error\ndata: {str(e)}\n\n"
                
        return StreamingResponse(event_stream(), media_type="text/event-stream")
        
    except Exception as e:
        logger.error(f"Failed to generate artifact: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class TaskRequest(BaseModel):
    project_id: str
    refined_spec: str
    rag_context: str

@router.post("/tasks")
async def process_tasks(request: TaskRequest):
    logger.info(f"Generating tasks for project {request.project_id}")
    result = task_engine_graph.invoke({
        "refined_spec": request.refined_spec,
        "rag_context": request.rag_context
    })
    return {"tasks": result.get("tasks", [])}

class DocumentationRequest(BaseModel):
    project_id: str
    refined_spec: str
    rag_context: str

@router.post("/documentation")
async def process_documentation(request: DocumentationRequest):
    logger.info(f"Generating documentation for project {request.project_id}")
    result = documentation_engine_graph.invoke({
        "refined_spec": request.refined_spec,
        "rag_context": request.rag_context
    })
    return {"documentation": result.get("documentation", "")}
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

class ConvoRequest(BaseModel):
    prompt: str
    idea_id: str
    history: List[Dict[str, str]]

@router.post("/conversation")
async def process_conversation_route(request: ConvoRequest):
    last_answer = ""
    if request.history:
        last_answer = request.history[-1].get("answer", "").lower()
        
    is_done = len(request.history) >= 3 or "zenix decide" in last_answer or "no other details" in last_answer
    
    if is_done:
        result = refinement_graph.invoke({
            "idea_prompt": request.prompt,
            "questions_and_answers": request.history
        })
        return {
            "is_complete": True,
            "refined_spec": result["refined_spec"]
        }
    else:
        from app.core.llm import get_fallback_llm
        from langchain_core.messages import SystemMessage
        import json
        
        history_text = "\\n".join([f"Q: {h['question']}\\nA: {h['answer']}" for h in request.history])
        
        sys_prompt = f"""You are Zenix, an expert Software Product Manager.
The user wants to build: {request.prompt}

Here is the conversation so far:
{history_text}

Ask ONE highly specific, technical, or design-oriented clarification question to gather more context.
Provide exactly 2 specific multiple choice options for your question.
Output ONLY a raw JSON object. Do not use markdown wrapping.
Example:
{{"next_question": "What framework?", "options": ["React", "Vue"]}}"""
        
        llm = get_fallback_llm()
        resp = llm.invoke([SystemMessage(content=sys_prompt)])
        try:
            raw_text = resp.content.replace('```json', '').replace('```', '').strip()
            data = json.loads(raw_text)
        except Exception as e:
            data = {"next_question": "Any other specific preferences?", "options": ["Yes", "No"]}
            
        data["is_complete"] = False
        return data

class PlaygroundRequest(BaseModel):
    user_message: str
    chat_history: List[Dict[str, str]]

@router.post("/playground")
async def process_playground(request: PlaygroundRequest):
    logger.info("Triggering AI Playground")
    result = playground_graph.invoke({
        "user_message": request.user_message,
        "chat_history": request.chat_history
    })
    return {
        "message": result["ai_response"],
        "html": result["generated_html"]
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
