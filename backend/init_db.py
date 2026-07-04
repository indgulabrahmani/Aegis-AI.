import asyncio
from app.core.database import engine
from app.models.database import Base, User
from app.core.security import get_password_hash
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select


async def init_database():
    """
    Initialize the database with tables and a default admin user
    """
    print("Creating database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print("Database tables created successfully.")
    
    # Check if admin user exists
    async with AsyncSession(engine) as session:
        result = await session.execute(select(User).where(User.email == "admin@aegis.ai"))
        admin_user = result.scalar_one_or_none()
        
        if not admin_user:
            print("Creating default admin user...")
            admin = User(
                email="admin@aegis.ai",
                full_name="Aegis Admin",
                hashed_password=get_password_hash("admin123"),
                is_active=True
            )
            session.add(admin)
            await session.commit()
            print("Default admin user created: admin@aegis.ai / admin123")
        else:
            print("Admin user already exists.")
    
    print("Database initialization complete.")


if __name__ == "__main__":
    asyncio.run(init_database())
