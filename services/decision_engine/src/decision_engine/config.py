"""Konfigurasi decision_engine dari environment (dikirim docker-compose)."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",  # opsional; container memakai env vars dari compose
        extra="ignore",
    )

    database_url: str
    redis_url: str

    qdrant_url: str
    qdrant_api_key: str

    api_platform_url: str
    internal_service_token: str

    qdrant_collection: str = "samapara_knowledge"

    db_pool_min: int = 1
    db_pool_max: int = 5
    redis_socket_timeout_seconds: float = 30.0

    telemetry_stream: str = "stream:telemetry"
    telemetry_group: str = "telemetry-normalizer"
    telemetry_consumer: str = "decision-engine-1"


settings = Settings()
