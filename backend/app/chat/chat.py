from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from .schemas import ConversationRead
from ..services.chat_service import ChatService

router = APIRouter()


@router.get("/history", response_model=ConversationRead)
async def get_conversation_history(db: AsyncSession = Depends(get_db)):
    chat_service = ChatService(db)
    try:
        messages = await chat_service.get_messages()
        return {"messages": messages}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch conversation history: {str(e)}"
        )
