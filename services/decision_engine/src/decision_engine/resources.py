"""Resource shared: dibuat SEKALI saat import, dipakai seluruh app.

- postgres_pool  : AsyncConnectionPool (psycopg) — dibuka di lifespan
- redis_client   : redis.asyncio (Streams consumer + cache)
- qdrant_client  : AsyncQdrantClient (RAG retrieval)
- api_platform_client : httpx -> Hono internal API (business mutation
  HANYA lewat Hono, bukan langsung ke tabel business)
"""

import httpx
import redis.asyncio as redis
from psycopg_pool import AsyncConnectionPool
from qdrant_client import AsyncQdrantClient

from decision_engine.config import settings

postgres_pool = AsyncConnectionPool(
    conninfo=settings.database_url,
    min_size=settings.db_pool_min,
    max_size=settings.db_pool_max,
    open=False,  # dibuka eksplisit di lifespan (pola psycopg async)
    timeout=10,
)

redis_client = redis.from_url(
    settings.redis_url,
    decode_responses=True,
    socket_timeout=settings.redis_socket_timeout_seconds,
)

qdrant_client = AsyncQdrantClient(
    url=settings.qdrant_url,
    api_key=settings.qdrant_api_key,
    timeout=10,
)

api_platform_client = httpx.AsyncClient(
    base_url=settings.api_platform_url,
    timeout=httpx.Timeout(10.0),
    headers={
        "Authorization": f"Bearer {settings.internal_service_token}",
    },
)
