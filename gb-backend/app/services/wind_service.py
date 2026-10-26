from datetime import date

import pandas as pd

from app.services.elexon import load_actuals, load_forecasts


def get_wind(start: date, end: date, horizon_h: int) -> dict:
    forecasts = load_forecasts()
    eligible = forecasts[forecasts["startTime"] - forecasts["publishTime"] >= pd.Timedelta(hours=horizon_h)]
    latest = eligible.drop_duplicates("startTime", keep="last")

    df = latest.merge(load_actuals(), on="startTime")
    df = df[df["startTime"].dt.date.between(start, end)].sort_values("startTime")
    error = df["actual"] - df["forecast"]

    return {
        "points": df.rename(columns={"startTime": "time", "publishTime": "published"}).to_dict("records"),
        "metrics": {
            "mae": round(error.abs().mean(), 1),
            "rmse": round((error**2).mean() ** 0.5, 1),
            "bias": round(error.mean(), 1),
            "p90_abs_error": round(error.abs().quantile(0.9), 1),
        }
        if len(df)
        else None,
    }
