from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from .core.config import settings

# Database URL from settings
engine = create_async_engine(settings.DATABASE_URL)

# Async session maker
AsyncSessionLocal = async_sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)


async def init_db():
    """Create database tables."""
    async with engine.begin() as conn:
        from .models import Base
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    """Dependency to get a database session."""
    async with AsyncSessionLocal() as session:
        yield session
