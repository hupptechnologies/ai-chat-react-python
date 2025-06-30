from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..database import AsyncSessionLocal
from ..services.ai_service import stream_chat_completion
from ..models import RoleEnum
from ..services.chat_service import ChatService

router = APIRouter()


@router.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    async with AsyncSessionLocal() as db:
        chat_service = ChatService(db)
        try:
            while True:
                data = await websocket.receive_json()
                user_content = data.get("content")

                if not user_content:
                    await websocket.send_json({"error": "No content provided"})
                    continue

                # Persist user message
                await chat_service.add_message(content=user_content, role=RoleEnum.USER)

                # Send user message confirmation
                await websocket.send_json({"role": "user", "content": user_content})

                # Stream AI response
                ai_content = ""
                await websocket.send_json(
                    {"role": "ai", "content": "", "loading": True}
                )

                try:
                    async for delta in stream_chat_completion(user_content):
                        ai_content += delta
                        await websocket.send_json(
                            {"role": "ai", "content": ai_content, "loading": True}
                        )

                    # Persist AI message
                    await chat_service.add_message(content=ai_content, role=RoleEnum.AI)
                    await websocket.send_json(
                        {"role": "ai", "content": ai_content, "loading": False}
                    )

                except Exception as ai_error:
                    await websocket.send_json(
                        {
                            "error": f"AI service error: {str(ai_error)}",
                            "loading": False,
                        }
                    )

        except WebSocketDisconnect:
            print("WebSocket disconnected")
        except Exception as e:
            await websocket.send_json(
                {"error": f"WebSocket error: {str(e)}", "loading": False}
            )
