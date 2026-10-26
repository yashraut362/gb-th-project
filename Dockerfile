FROM oven/bun:1.2.8 AS frontend
WORKDIR /frontend
COPY gb-frontend/package.json gb-frontend/bun.lock ./
RUN bun install --frozen-lockfile
COPY gb-frontend/ ./
RUN bun run build

FROM python:3.13-slim
COPY --from=ghcr.io/astral-sh/uv:0.12.2 /uv /bin/uv
WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy PATH="/app/.venv/bin:$PATH"
COPY gb-backend/pyproject.toml gb-backend/uv.lock ./
RUN uv sync --frozen --no-dev
COPY gb-backend/app ./app
COPY --from=frontend /frontend/dist ./static
ENV PORT=8000
EXPOSE 8000
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
