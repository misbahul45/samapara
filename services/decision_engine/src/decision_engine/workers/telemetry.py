"""Consumer stream:telemetry -> PostgreSQL (bronze + silver) -> XACK.

Semantics: Redis message -> transaction PostgreSQL -> commit -> XACK.
Jika worker crash setelah commit tapi sebelum XACK, message di-redeliver
dan UNIQUE (time, stream_id) menghindari duplikat (idempotent persistence).

Jalankan terpisah dari API:
    uv run python -m decision_engine.workers.telemetry
"""

import asyncio
import json

from psycopg.rows import dict_row
from redis.exceptions import ResponseError

from decision_engine.config import settings
from decision_engine.resources import postgres_pool, redis_client

STREAM = settings.telemetry_stream
GROUP = settings.telemetry_group
CONSUMER = settings.telemetry_consumer


async def ensure_group() -> None:
    try:
        await redis_client.xgroup_create(STREAM, GROUP, id="0", mkstream=True)
    except ResponseError as exc:
        if "BUSYGROUP" not in str(exc):
            raise


async def process_message(stream_id: str, data: dict) -> None:
    timestamp = data["timestamp"]
    device_id = data["device_id"]
    sequence = int(data["sequence"])
    weight = float(data["weight_kg"])
    distance = float(data["distance_cm"])
    battery = float(data["battery_percent"])
    rssi = int(data["rssi"])
    raw_json = json.loads(data["raw_json"])

    # Contoh normalisasi sementara: fill_percent = 100 - jarak ultrasonik.
    # Nanti diganti model anomaly/ML (N-BEATSx, deteksi anomali).
    fill_percent = max(0.0, min(100.0, 100.0 - distance))

    async with postgres_pool.connection() as conn:
        async with conn.transaction():
            async with conn.cursor(row_factory=dict_row) as cursor:
                await cursor.execute(
                    """
                    INSERT INTO bronze.telemetry_raw (
                        time, stream_id, device_id, sequence,
                        weight_kg, distance_cm, battery_percent,
                        signal_strength, raw_payload
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (time, stream_id) DO NOTHING
                    """,
                    (
                        timestamp,
                        stream_id,
                        device_id,
                        sequence,
                        weight,
                        distance,
                        battery,
                        rssi,
                        json.dumps(raw_json),
                    ),
                )

                await cursor.execute(
                    """
                    INSERT INTO silver.telemetry_clean (
                        time, stream_id, device_id, sequence,
                        weight_kg, fill_percent, anomaly_score, quality_status
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (time, stream_id) DO NOTHING
                    """,
                    (
                        timestamp,
                        stream_id,
                        device_id,
                        sequence,
                        weight,
                        fill_percent,
                        0.0,
                        "VALID",
                    ),
                )


async def run() -> None:
    await postgres_pool.open()
    await ensure_group()
    print(f"telemetry worker: group={GROUP} consumer={CONSUMER} stream={STREAM}")

    while True:
        try:
            messages = await redis_client.xreadgroup(
                groupname=GROUP,
                consumername=CONSUMER,
                streams={STREAM: ">"},
                count=20,
                block=5000,
            )
        except Exception as exc:  # Redis down/sementara — jangan mati
            print("telemetry worker redis error:", exc)
            await asyncio.sleep(2)
            continue

        if not messages:
            continue

        for _, entries in messages:
            for stream_id, data in entries:
                try:
                    await process_message(stream_id, data)
                    await redis_client.xack(STREAM, GROUP, stream_id)
                except Exception as exc:
                    print("telemetry worker error:", exc, "stream_id:", stream_id)
                    await asyncio.sleep(1)


if __name__ == "__main__":
    asyncio.run(run())
