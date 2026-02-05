#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
API_PORT=8000
WEB_PORT=5173

# Start backend
(
  cd "$ROOT/server" &&
  echo "[backend] Starting FastAPI on :$API_PORT" &&
  python3 -m uvicorn main:app --reload --host 0.0.0.0 --port "$API_PORT"
) &
API_PID=$!

# Start frontend
(
  cd "$ROOT/client" &&
  echo "[frontend] Starting Vite dev server on :$WEB_PORT" &&
  npm run dev -- --host --port "$WEB_PORT"
) &
WEB_PID=$!

cleanup() {
  echo "\nShutting down..."
  kill $API_PID $WEB_PID 2>/dev/null || true
}

trap cleanup INT TERM

wait $API_PID $WEB_PID
