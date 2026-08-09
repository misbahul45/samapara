"""SAMPARA Decision Engine — FastAPI app.

Internal-only: dipanggil api_platform (Bearer INTERNAL_SERVICE_TOKEN).
Worker background (consumer Redis Streams) jalan sebagai proses terpisah:
    uv run python -m decision_engine.workers.telemetry
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from decision_engine.api import forecast, health
from decision_engine.resources import (
    api_platform_client,
    postgres_pool,
    qdrant_client,
    redis_client,
)


@asynccontextmanager
async def lifespan(_: FastAPI):
    await postgres_pool.open()
    await postgres_pool.check()
    await redis_client.ping()
    await qdrant_client.get_collections()

    yield

    await api_platform_client.aclose()
    await qdrant_client.close()
    await redis_client.aclose()
    await postgres_pool.close()


app = FastAPI(
    title="SAMPARA Decision Engine",
    description="Intelligence and Agentic AI service for SAMPARA",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(health.router)
app.include_router(forecast.router)


@app.get("/", tags=["System"])
async def root() -> dict[str, str]:
    return {"service": "decision-engine", "status": "ok"}
