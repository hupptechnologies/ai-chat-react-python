import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Message


@pytest.mark.asyncio
class TestAPI:
    """Test API endpoints using an integrated test database."""

    async def test_root_endpoint(self, client: TestClient):
        """Test the root endpoint returns a welcome message."""
        response = client.get("/")
        assert response.status_code == 200

    async def test_history_endpoint_empty(self, client: TestClient):
        """Test the history endpoint returns an empty list when the DB is empty."""
        response = client.get("/api/history")
        assert response.status_code == 200
        data = response.json()
        assert data["messages"] == []

    async def test_history_endpoint_with_messages(
        self, client: TestClient, db_session: AsyncSession
    ):
        """Test the history endpoint returns messages from the database."""
        # Arrange: Create and save test messages to the test DB
        user_message = Message(role="user", content="Hello")
        ai_message = Message(role="ai", content="Hi there!")

        db_session.add_all([user_message, ai_message])
        await db_session.commit()

        # Act: Call the API endpoint
        response = client.get("/api/history")

        # Assert: Check the response
        assert response.status_code == 200
        data = response.json()
        assert len(data["messages"]) == 2

        # Verify message content
        assert data["messages"][0]["role"] == "user"
        assert data["messages"][0]["content"] == "Hello"
        assert data["messages"][1]["role"] == "ai"
        assert data["messages"][1]["content"] == "Hi there!"

        # Verify all required fields are present
        for message in data["messages"]:
            assert "id" in message
            assert "role" in message
            assert "content" in message
            assert "created_at" in message
