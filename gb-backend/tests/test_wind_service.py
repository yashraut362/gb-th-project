from datetime import date

import pandas as pd
import pytest

from app.services import elexon, wind_service


def ts(value):
    return pd.Timestamp(value, tz="UTC")


@pytest.fixture
def data(monkeypatch):
    actuals = pd.DataFrame(
        {
            "startTime": [ts("2026-01-02 12:00"), ts("2026-01-02 12:30"), ts("2026-01-03 12:00")],
            "actual": [1000, 1100, 2000],
        }
    )
    forecasts = pd.DataFrame(
        {
            "publishTime": [ts("2026-01-02 06:00"), ts("2026-01-02 10:00"), ts("2026-01-02 22:00")],
            "startTime": [ts("2026-01-02 12:00"), ts("2026-01-02 12:00"), ts("2026-01-03 12:00")],
            "forecast": [1100, 900, 2300],
        }
    )
    monkeypatch.setattr(wind_service, "load_actuals", lambda: actuals)
    monkeypatch.setattr(wind_service, "load_forecasts", lambda: forecasts)


def test_uses_latest_forecast_published_before_horizon(data):
    short = wind_service.get_wind(date(2026, 1, 2), date(2026, 1, 2), horizon_h=0)
    long = wind_service.get_wind(date(2026, 1, 2), date(2026, 1, 2), horizon_h=4)

    assert short["points"][0]["forecast"] == 900
    assert long["points"][0]["forecast"] == 1100
    assert long["points"][0]["published"] == ts("2026-01-02 06:00")


def test_skips_hours_without_a_forecast_old_enough(data):
    result = wind_service.get_wind(date(2026, 1, 2), date(2026, 1, 3), horizon_h=12)

    assert [p["time"] for p in result["points"]] == [ts("2026-01-03 12:00")]


def test_only_joins_on_the_hour_actuals(data):
    result = wind_service.get_wind(date(2026, 1, 2), date(2026, 1, 3), horizon_h=0)

    assert [p["actual"] for p in result["points"]] == [1000, 2000]


def test_metrics(data):
    metrics = wind_service.get_wind(date(2026, 1, 2), date(2026, 1, 3), horizon_h=0)["metrics"]

    assert metrics == {"mae": 200.0, "rmse": 223.6, "bias": -100.0, "p90_abs_error": 280.0}


def test_no_points_gives_no_metrics(data):
    result = wind_service.get_wind(date(2026, 1, 10), date(2026, 1, 11), horizon_h=0)

    assert result == {"points": [], "metrics": None}


def test_load_forecasts_drops_hours_already_past(monkeypatch):
    raw = pd.DataFrame(
        {
            "publishTime": [ts("2026-01-02 10:00")] * 3,
            "startTime": [ts("2026-01-02 09:00"), ts("2026-01-02 10:00"), ts("2026-01-02 11:00")],
            "generation": [1, 2, 3],
        }
    )
    monkeypatch.setattr(elexon, "_fetch", lambda dataset, params: raw)
    elexon.load_forecasts.cache_clear()

    forecasts = elexon.load_forecasts()
    elexon.load_forecasts.cache_clear()

    assert forecasts["forecast"].tolist() == [3]
