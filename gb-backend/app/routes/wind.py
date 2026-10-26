from datetime import date

from fastapi import APIRouter, HTTPException, Query

from app.services import wind_service

router = APIRouter(tags=["wind"])

FIRST_DAY = date(2026, 1, 1)
LAST_DAY = date(2026, 2, 1)


@router.get("/wind")
def wind(
    start: date = FIRST_DAY,
    end: date = date(2026, 1, 7),
    horizon_h: int = Query(4, ge=0, le=48, description="Minimum hours between forecast publish and target time"),
):
    if not FIRST_DAY <= start <= end <= LAST_DAY:
        raise HTTPException(400, f"Need {FIRST_DAY} <= start <= end <= {LAST_DAY}")
    return wind_service.get_wind(start, end, horizon_h)
