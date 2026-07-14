from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
import uvicorn
from loguru import logger

from app.api.routes import router as orchestrate_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Zenix RAG Service",
    description="Retrieval-Augmented Generation context engine for Zenix",
    version="1.0.0",
    default_response_class=ORJSONResponse
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orchestrate_router)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up Zenix RAG Service...")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
