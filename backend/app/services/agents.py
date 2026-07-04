from app.services.gemini_service import gemini_service
from app.models.schemas import AgentType
from typing import Dict, Any

# Agent System Prompts
AGENT_SYSTEM_PROMPTS = {
    AgentType.HR: """
You are the HR Agent for Aegis. You specialize in:
- Hiring plans and job descriptions
- Interview scorecards and evaluation criteria
- Onboarding checklists and processes
- Team structure and organization design
- Compensation analysis

Provide detailed, actionable outputs. Be specific and practical.
""",

    AgentType.FINANCE: """
You are the Finance Agent for Aegis. You specialize in:
- Runway calculations and cash flow analysis
- Budget breakdowns and financial planning
- Expense categorization and tracking
- Financial summaries and reports
- ROI analysis and cost projections

Provide accurate financial analysis with clear numbers and assumptions.
""",

    AgentType.LEGAL: """
You are the Legal Agent for Aegis. You specialize in:
- Contract and document drafts (NDA, offer letters, ToS)
- Compliance checklists and regulatory requirements
- Legal reviews and risk assessments
- Terms and conditions
- Data privacy and security considerations

Provide professional legal drafts with appropriate disclaimers. Always recommend review by legal counsel.
""",

    AgentType.MARKETING: """
You are the Marketing Agent for Aegis. You specialize in:
- Go-to-market (GTM) strategy development
- Positioning statements and value propositions
- Launch checklists and timelines
- Social media content and marketing copy
- Campaign planning and execution

Provide creative, data-driven marketing strategies with clear action items.
"""
}


class AgentService:
    async def execute_task(
        self,
        agent: AgentType,
        task_description: str,
        context: str = ""
    ) -> Dict[str, Any]:
        """
        Execute a task for a specific agent
        """
        system_prompt = AGENT_SYSTEM_PROMPTS[agent]
        
        prompt = f"""
Task: {task_description}

Context: {context if context else "No additional context provided"}

Please execute this task and provide a comprehensive response.
Return your response as JSON with this structure:
{{
  "output": "detailed output/artifact",
  "artifact_type": "type of artifact (e.g., 'Job Description', 'Budget Breakdown', 'Contract Draft', 'GTM Plan')",
  "reasoning": "brief explanation of your approach"
}}
"""
        
        try:
            response = await gemini_service.generate_json_response(
                prompt=prompt,
                system_prompt=system_prompt
            )
            return response
        except Exception as e:
            raise Exception(f"{agent.value} agent execution failed: {str(e)}")
    
    def get_agent_info(self, agent: AgentType) -> Dict[str, Any]:
        """
        Get information about an agent
        """
        agent_info = {
            AgentType.HR: {
                "id": "hr",
                "name": "HR Agent",
                "description": "Handles hiring, onboarding, and team management",
                "capabilities": [
                    "Job description drafting",
                    "Interview scorecards",
                    "Onboarding checklists",
                    "Compensation analysis",
                    "Team structure planning"
                ]
            },
            AgentType.FINANCE: {
                "id": "finance",
                "name": "Finance Agent",
                "description": "Manages financial planning and runway analysis",
                "capabilities": [
                    "Runway calculations",
                    "Budget breakdowns",
                    "Expense categorization",
                    "Financial summaries",
                    "Cash flow projections"
                ]
            },
            AgentType.LEGAL: {
                "id": "legal",
                "name": "Legal Agent",
                "description": "Drafts contracts and ensures compliance",
                "capabilities": [
                    "NDA drafting",
                    "Offer letter templates",
                    "Terms of Service",
                    "Compliance checklists",
                    "Contract reviews"
                ]
            },
            AgentType.MARKETING: {
                "id": "marketing",
                "name": "Marketing Agent",
                "description": "Creates GTM strategies and marketing content",
                "capabilities": [
                    "GTM strategy development",
                    "Positioning statements",
                    "Launch checklists",
                    "Social media content",
                    "Marketing campaigns"
                ]
            }
        }
        return agent_info[agent]


agent_service = AgentService()
