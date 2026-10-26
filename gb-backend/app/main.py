from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.routes import wind

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"

app = FastAPI(title="GB Wind Forecast API")
app.include_router(wind.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok"}


if STATIC_DIR.is_dir():
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
