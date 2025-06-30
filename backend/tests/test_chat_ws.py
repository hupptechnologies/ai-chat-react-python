from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Message, RoleEnum


async def mock_stream_chat_completion(user_content: str):
    """A mock for the AI service's streaming function to isolate the test from the actual AI service."""
    response_text = f"AI response to: {user_content}"
    for char in response_text:
        yield char


@pytest.mark.asyncio
@patch("app.chat.chat_ws.stream_chat_completion", new=mock_stream_chat_completion)
async def test_websocket_chat_saves_messages(
    client: TestClient, db_session: AsyncSession
):
    """
    Test a chat session over WebSocket and verify that messages are correctly saved to the test database.
    """
    test_message = "Hello, WebSocket!"
    expected_ai_response = f"AI response to: {test_message}"

    with client.websocket_connect("/ws/chat") as websocket:
        websocket.send_json({"content": test_message})

        # Receive and verify the user message confirmation
        data = websocket.receive_json()
        assert data == {"role": "user", "content": test_message}

        # Consume messages until the final one (loading: False)
        final_ai_message = {}
        while (message := websocket.receive_json()) and message.get("loading", True):
            pass
        final_ai_message = message

        # Assert the final AI message is correct
        assert final_ai_message == {
            "role": "ai",
            "content": expected_ai_response,
            "loading": False,
        }

    # Verify that the messages were correctly persisted in the test database
    await db_session.flush()

    user_msg_stmt = select(Message).where(Message.role == RoleEnum.USER)
    user_messages = (await db_session.execute(user_msg_stmt)).scalars().all()
    assert len(user_messages) == 1
    assert user_messages[0].content == test_message

    ai_msg_stmt = select(Message).where(Message.role == RoleEnum.AI)
    ai_messages = (await db_session.execute(ai_msg_stmt)).scalars().all()
    assert len(ai_messages) == 1
    assert ai_messages[0].content == expected_ai_response
