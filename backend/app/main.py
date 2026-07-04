from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, missions, approvals, agents, logs, analytics, websocket
from app.models.database import Base
from app.core.database import engine
from app.config import settings
import asyncio

app = FastAPI(
    title="Aegis API",
    description="AI CEO Assistant - Enterprise Backend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(missions.router)
app.include_router(approvals.router)
app.include_router(agents.router)
app.include_router(logs.router)
app.include_router(analytics.router)
app.include_router(websocket.router)


@app.on_event("startup")
async def startup_event():
    """
    Initialize database on startup
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/")
async def root():
    return {
        "message": "Aegis API - AI CEO Assistant",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
