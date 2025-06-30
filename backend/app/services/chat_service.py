from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

from ..chat.schemas import MessageRead
from ..models import Message, RoleEnum


class ChatService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_messages(self) -> List[MessageRead]:
        result = await self.db.execute(
            Message.__table__.select().order_by(Message.created_at.asc())
        )
        messages = result.fetchall()
        return [MessageRead.from_orm(m) for m in messages]

    async def add_message(self, content: str, role: RoleEnum) -> MessageRead:
        message = Message(content=content, role=role.value)
        self.db.add(message)
        await self.db.commit()
        await self.db.refresh(message)
        return MessageRead.from_orm(message)
