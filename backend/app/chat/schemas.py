from pydantic import BaseModel
from datetime import datetime
from typing import List
from ..models import RoleEnum


class MessageBase(BaseModel):
    role: RoleEnum
    content: str


class MessageCreate(MessageBase):
    pass


class MessageRead(MessageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationRead(BaseModel):
    messages: List[MessageRead]
