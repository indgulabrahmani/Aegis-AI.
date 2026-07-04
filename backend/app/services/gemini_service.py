import google.generativeai as genai
from app.config import settings
from typing import Dict, Any
import json

genai.configure(api_key=settings.GEMINI_API_KEY)


class GeminiService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-pro')
    
    async def generate_response(
        self,
        prompt: str,
        system_prompt: str = None,
        response_format: str = "text"
    ) -> str:
        """
        Generate a response from Gemini API
        """
        full_prompt = ""
        if system_prompt:
            full_prompt += f"System: {system_prompt}\n\n"
        full_prompt += f"User: {prompt}"
        
        try:
            response = await self.model.generate_content_async(full_prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")
    
    async def generate_json_response(
        self,
        prompt: str,
        system_prompt: str = None
    ) -> Dict[str, Any]:
        """
        Generate a JSON response from Gemini API
        """
        full_prompt = ""
        if system_prompt:
            full_prompt += f"System: {system_prompt}\n\n"
        full_prompt += f"User: {prompt}\n\n"
        full_prompt += "IMPORTANT: Respond with valid JSON only. No markdown, no explanations."
        
        try:
            response = await self.model.generate_content_async(full_prompt)
            text = response.text.strip()
            
            # Remove markdown code blocks if present
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            
            return json.loads(text.strip())
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse JSON response: {str(e)}")
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")


gemini_service = GeminiService()
