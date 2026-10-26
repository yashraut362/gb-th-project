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
