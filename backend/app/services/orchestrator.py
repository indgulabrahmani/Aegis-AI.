from app.services.gemini_service import gemini_service
from app.models.schemas import AgentType, TaskCreate
from typing import List
import json

ORCHESTRATOR_SYSTEM_PROMPT = """
You are the Orchestrator Agent for Aegis, an AI CEO assistant. Your role is to:
1. Analyze the founder's mission/goal
2. Break it down into specific sub-tasks
3. Assign each task to the appropriate specialist agent (HR, Finance, Legal, Marketing)
4. Determine which tasks require founder approval (high-stakes actions like financial commitments, legal documents)

Available agents:
- HR Agent: hiring plans, job descriptions, interview scorecards, onboarding checklists
- Finance Agent: runway calculations, budget breakdowns, expense categorization, financial summaries
- Legal Agent: contract/document drafts (NDA, offer letter, ToS), compliance checklists - ALWAYS requires approval
- Marketing Agent: GTM plans, positioning statements, launch checklists, social/content drafts

Return a JSON response with this exact structure:
{
  "analysis": "brief analysis of the mission",
  "tasks": [
    {
      "agent": "hr|finance|legal|marketing",
      "description": "specific task description",
      "requires_approval": boolean
    }
  ]
}
"""


class OrchestratorService:
    async def analyze_mission(self, mission: str) -> dict:
        """
        Analyze the founder's mission and break it down into tasks
        """
        prompt = f"""
        Founder's mission: {mission}
        
        Analyze this mission and break it down into specific tasks for the specialist agents.
        Return your response as valid JSON.
        """
        
        try:
            response = await gemini_service.generate_json_response(
                prompt=prompt,
                system_prompt=ORCHESTRATOR_SYSTEM_PROMPT
            )
            return response
        except Exception as e:
            raise Exception(f"Orchestrator analysis failed: {str(e)}")
    
    def parse_tasks(self, response: dict) -> List[TaskCreate]:
        """
        Parse the orchestrator response into TaskCreate objects
        """
        tasks = []
        for task_data in response.get("tasks", []):
            task = TaskCreate(
                agent=AgentType(task_data["agent"]),
                description=task_data["description"],
                requires_approval=task_data.get("requires_approval", False)
            )
            tasks.append(task)
        return tasks


orchestrator_service = OrchestratorService()
