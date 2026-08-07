from fastapi import FastAPI

app = FastAPI(
    title="SAMPARA Decision Engine",
    description="Intelligence and Agentic AI service for SAMPARA",
    version="0.1.0",
)


@app.get("/health", tags=["System"])
async def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "decision-engine",
        "version": "0.1.0",
    }
