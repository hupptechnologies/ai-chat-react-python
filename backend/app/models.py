from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import declarative_base
import datetime
from enum import Enum

Base = declarative_base()


class RoleEnum(str, Enum):
    USER = "user"
    AI = "ai"


class Message(AsyncAttrs, Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, nullable=False)  # 'user' or 'ai'
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
