from fastapi import APIRouter, Depends
from app.models.schemas import AgentResponse, AgentType
from app.services.agents import agent_service

router = APIRouter(prefix="/api/agents", tags=["Agents"])


@router.get("/", response_model=list[AgentResponse])
async def get_agents():
    """
    Get information about all available agents
    """
    agents = []
    for agent_type in AgentType:
        info = agent_service.get_agent_info(agent_type)
        agents.append(AgentResponse(
            id=AgentType(info["id"]),
            name=info["name"],
            description=info["description"],
            capabilities=info["capabilities"],
            status="idle"  # Could be dynamic in production
        ))
    return agents


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: AgentType):
    """
    Get information about a specific agent
    """
    info = agent_service.get_agent_info(agent_id)
    return AgentResponse(
        id=AgentType(info["id"]),
        name=info["name"],
        description=info["description"],
        capabilities=info["capabilities"],
        status="idle"
    )
