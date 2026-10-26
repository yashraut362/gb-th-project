import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services import wind_service

client = TestClient(app)


@pytest.fixture
def fake_service(monkeypatch):
    calls = []

    def get_wind(start, end, horizon_h):
        calls.append((str(start), str(end), horizon_h))
        return {"points": [], "metrics": None}

    monkeypatch.setattr(wind_service, "get_wind", get_wind)
    return calls


def test_health():
    assert client.get("/api/health").json() == {"status": "ok"}


def test_wind_passes_params_to_service(fake_service):
    response = client.get("/api/wind?start=2026-01-05&end=2026-01-06&horizon_h=24")

    assert response.status_code == 200
    assert fake_service == [("2026-01-05", "2026-01-06", 24)]


def test_wind_defaults(fake_service):
    client.get("/api/wind")

    assert fake_service == [("2026-01-01", "2026-01-07", 4)]


@pytest.mark.parametrize(
    "query",
    ["start=2026-01-05&end=2026-01-02", "start=2025-12-31", "end=2026-02-02"],
)
def test_wind_rejects_dates_outside_window(fake_service, query):
    assert client.get(f"/api/wind?{query}").status_code == 400
    assert fake_service == []


@pytest.mark.parametrize("horizon", [-1, 49])
def test_wind_rejects_horizon_out_of_range(fake_service, horizon):
    assert client.get(f"/api/wind?horizon_h={horizon}").status_code == 422
