"""Forecast endpoint internal (dipanggil Hono, bukan publik).

Baseline placeholder sampai N-BEATSx dipasang: rata-rata 20 telemetry
terakhir per device -> P50; P80/P90 = P50 * 1.10 / 1.20.
Hasil ditulis ke gold.forecasts (role sampara_ai).
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from decision_engine.api.auth import require_internal_service
from decision_engine.resources import postgres_pool

router = APIRouter(
    prefix="/internal/v1/forecast",
    dependencies=[Depends(require_internal_service)],
)


class ForecastRequest(BaseModel):
    deviceId: str


@router.post("/run")
async def run_forecast(body: ForecastRequest) -> dict:
    async with postgres_pool.connection() as conn:
        async with conn.cursor() as cursor:
            await cursor.execute(
                """
                SELECT weight_kg
                FROM silver.telemetry_clean
                WHERE device_id = %s
                ORDER BY time DESC
                LIMIT 20
                """,
                (body.deviceId,),
            )
            rows = await cursor.fetchall()

    weights = [float(row[0]) for row in rows if row[0] is not None]

    if not weights:
        p50 = 0.0
    else:
        p50 = sum(weights) / len(weights)

    # Placeholder hingga N-BEATSx terpasang (service/DB connection tetap sama)
    p80 = p50 * 1.10
    p90 = p50 * 1.20

    now = datetime.now(timezone.utc)

    async with postgres_pool.connection() as conn:
        async with conn.cursor() as cursor:
            await cursor.execute(
                """
                INSERT INTO gold.forecasts (
                    device_id, forecast_for, p50, p80, p90,
                    predicted_weight_kg, model_name, model_version
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    body.deviceId,
                    now,
                    p50,
                    p80,
                    p90,
                    p50,
                    "baseline",
                    "0.1.0",
                ),
            )
            await conn.commit()

    return {
        "status": True,
        "data": {
            "deviceId": body.deviceId,
            "p50": p50,
            "p80": p80,
            "p90": p90,
        },
    }
