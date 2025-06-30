import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .chat.chat import router as api_router
from .chat.chat_ws import router as ws_router
from .database import init_db
from .core.config import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "AI Chat Backend is running"}


app.include_router(api_router, prefix="/api")
app.include_router(ws_router)


@app.on_event("startup")
async def on_startup():
    await init_db()


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
