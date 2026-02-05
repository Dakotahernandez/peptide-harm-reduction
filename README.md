# Peptide Harm-Reduction Guide

Non-medical educational site for basic reconstitution math and storage reminders. Frontend uses React (Vite). Backend uses FastAPI.

## Quick start

### Backend (FastAPI)
1. `cd server`
2. `python3 -m pip install -r requirements.txt`
3. `uvicorn main:app --reload --host 0.0.0.0 --port 8000`

Endpoints: `/peptides`, `/peptides/{id}`, `/calculate`, `/disclaimer`, `/health`.
`/calculate` accepts mg and micrograms (mcg/ug/µg treated the same) for vial and dose units.

### Frontend (Vite + React)
1. `cd client`
2. `npm install` (already run once)
3. `npm run dev`

Open the printed localhost URL. The app expects the API at `http://localhost:8000`.

### One-shot dev script

- From repo root: `./start.sh`
- Starts FastAPI on port 8000 and Vite dev server on port 5173. Ctrl+C stops both.

## Testing

- Backend math tests: `cd server && python3 -m pytest`

## Notes

- Content is harm-reduction and research oriented; not medical advice.
- Add new peptides by extending the `peptides` list in `server/main.py`.
- Update the disclaimer text/date via `/disclaimer` in `server/main.py`.
- Calculator now supports mg / mcg inputs and converts to mg/mL concentration automatically.
