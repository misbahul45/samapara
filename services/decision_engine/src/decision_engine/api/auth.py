"""Autentikasi antar service: Bearer INTERNAL_SERVICE_TOKEN (constant-time)."""

import secrets

from fastapi import Header, HTTPException

from decision_engine.config import settings


async def require_internal_service(
    authorization: str = Header(default=""),
) -> None:
    expected = f"Bearer {settings.internal_service_token}"
    if not secrets.compare_digest(authorization, expected):
        raise HTTPException(status_code=401, detail="Unauthorized")
