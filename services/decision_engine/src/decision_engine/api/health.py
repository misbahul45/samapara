"""Health internal — cek koneksi PostgreSQL."""

from fastapi import APIRouter, Depends

from decision_engine.api.auth import require_internal_service
from decision_engine.resources import postgres_pool

router = APIRouter(
    prefix="/internal/v1",
    dependencies=[Depends(require_internal_service)],
)


@router.get("/health")
async def health() -> dict:
    async with postgres_pool.connection() as conn:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT 1")
            value = (await cursor.fetchone())[0]

    return {
        "status": True,
        "service": "decision_engine",
        "postgres": value == 1,
    }
