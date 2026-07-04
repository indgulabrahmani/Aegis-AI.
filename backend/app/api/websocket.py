from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.database import User
from typing import Dict, Set
import json

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
    
    def disconnect(self, websocket: WebSocket, user_id: int):
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
    
    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except:
                    # Connection might be closed
                    pass
    
    async def broadcast(self, message: dict):
        for user_id, connections in self.active_connections.items():
            for connection in connections:
                try:
                    await connection.send_json(message)
                except:
                    pass


manager = ConnectionManager()


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str,
    db: AsyncSession = Depends(get_db)
):
    """
    WebSocket endpoint for real-time updates
    """
    try:
        # Verify token and get user
        from app.core.security import decode_access_token
        from sqlalchemy import select
        
        payload = decode_access_token(token)
        if not payload:
            await websocket.close(code=1008)
            return
        
        email = payload.get("sub")
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if not user:
            await websocket.close(code=1008)
            return
        
        # Connect
        await manager.connect(websocket, user.id)
        
        try:
            while True:
                # Keep connection alive and handle incoming messages
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle different message types
                if message.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
                
        except WebSocketDisconnect:
            manager.disconnect(websocket, user.id)
    
    except Exception as e:
        await websocket.close(code=1011)


async def notify_mission_update(mission_id: int, user_id: int, status: str, message: str):
    """
    Notify a user about mission updates
    """
    await manager.send_personal_message({
        "type": "mission_update",
        "data": {
            "mission_id": mission_id,
            "status": status,
            "message": message
        }
    }, user_id)


async def notify_task_update(task_id: int, user_id: int, agent: str, status: str, message: str):
    """
    Notify a user about task updates
    """
    await manager.send_personal_message({
        "type": "task_update",
        "data": {
            "task_id": task_id,
            "agent": agent,
            "status": status,
            "message": message
        }
    }, user_id)
