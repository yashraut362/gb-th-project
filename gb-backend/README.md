# gb-backend

FastAPI service for UK wind generation forecasts vs actuals (Elexon BMRS).

## Run locally

Requires [uv](https://docs.astral.sh/uv/).

```bash
uv sync
uv run fastapi dev app/main.py
```

- Health check: http://localhost:8000/api/health
- API docs: http://localhost:8000/docs

## Endpoint

`GET /api/wind?start=2026-01-01&end=2026-01-07&horizon_h=4`

For each hour in the range, returns the actual wind generation and the latest forecast
published at least `horizon_h` hours earlier, plus MAE, RMSE, bias and P90 absolute error
(error = actual − forecast, MW). Data is fetched from Elexon BMRS on first request and cached in memory.
