from fastapi import FastAPI

from app.routes import wind

app = FastAPI(title="GB Wind Forecast API")
app.include_router(wind.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok"}
