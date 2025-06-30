from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..services.chat_service import ChatService
from .schemas import ConversationRead

router = APIRouter()


def get_chat_service(db: AsyncSession = Depends(get_db)):
    return ChatService(db)


@router.get("/history", response_model=ConversationRead)
async def get_conversation_history(
    chat_service: ChatService = Depends(get_chat_service),
):
    try:
        messages = await chat_service.get_messages()
        return {"messages": messages}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch conversation history: {str(e)}"
        )
