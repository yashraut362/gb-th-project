from functools import lru_cache

import httpx
import pandas as pd

BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1/datasets"


def _fetch(dataset: str, params: dict) -> pd.DataFrame:
    response = httpx.get(f"{BASE_URL}/{dataset}/stream", params=params, timeout=60)
    response.raise_for_status()
    df = pd.DataFrame(response.json())
    df["publishTime"] = pd.to_datetime(df["publishTime"], utc=True)
    df["startTime"] = pd.to_datetime(df["startTime"], utc=True)
    return df


@lru_cache
def load_actuals() -> pd.DataFrame:
    df = _fetch("FUELHH", {"settlementDateFrom": "2026-01-01", "settlementDateTo": "2026-02-01", "fuelType": "WIND"})
    return df[["startTime", "generation"]].rename(columns={"generation": "actual"})


@lru_cache
def load_forecasts() -> pd.DataFrame:
    df = _fetch("WINDFOR", {"publishDateTimeFrom": "2025-12-29T00:00:00Z", "publishDateTimeTo": "2026-02-01T23:59:59Z"})
    df = df[["publishTime", "startTime", "generation"]].rename(columns={"generation": "forecast"})
    return df[df["startTime"] > df["publishTime"]].sort_values("publishTime")
