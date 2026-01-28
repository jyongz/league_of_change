# config.py
from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str  # Add your database URL here, like Databricks JDBC URL

    class Config:
        env_file = ".env"  # Load from .env file for sensitive info

# Instantiate settings
settings = Settings()
