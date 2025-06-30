from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = ""
    OPENAI_API_KEY: str = ""
    allowed_origins: list = ["http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
