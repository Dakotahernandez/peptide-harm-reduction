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

## Production setup (reconstitutionsafety.com)

### Backend API hardening (already wired in code)

`server/main.py` now supports production-safe config by environment variables:

- `ALLOWED_ORIGINS` (CSV)  
  Example: `https://reconstitutionsafety.com,https://www.reconstitutionsafety.com`
- `ALLOWED_HOSTS` (CSV)  
  Example: `api.reconstitutionsafety.com,reconstitutionsafety.com,www.reconstitutionsafety.com,localhost,127.0.0.1`
- `PROXY_TRUSTED_HOSTS` (CSV)  
  Example: `127.0.0.1,10.0.0.0/8`
- `ENABLE_PROXY_HEADERS` (`true`/`false`)
- `UVICORN_RELOAD` (`false` in production)
- `HOST`, `PORT`

The API also adds common security headers and trusted-host checks.

Example production run:

```bash
cd server
export ALLOWED_ORIGINS="https://reconstitutionsafety.com,https://www.reconstitutionsafety.com"
export ALLOWED_HOSTS="api.reconstitutionsafety.com,reconstitutionsafety.com,www.reconstitutionsafety.com"
export UVICORN_RELOAD="false"
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend production API target

The frontend reads `VITE_API_BASE`.  
If not set, production fallback is `https://api.reconstitutionsafety.com`.

Set before build:

```bash
cd client
cp .env.production.example .env.production
npm run build
```

### Squarespace DNS instructions

1. Decide canonical web host (`www.reconstitutionsafety.com` recommended).
2. In your frontend host, add custom domains:
   - `www.reconstitutionsafety.com`
   - optional apex redirect from `reconstitutionsafety.com` to `www`
3. In your backend host, add custom domain:
   - `api.reconstitutionsafety.com`
4. In Squarespace DNS, create:
   - `CNAME` for `www` -> target provided by frontend host
   - `CNAME` for `api` -> target provided by backend host
5. For apex/root (`@`), use Squarespace forwarding or provider-specific `A/ALIAS` records to point root to your frontend.
6. Enable SSL/HTTPS in both hosting dashboards.
7. Verify:
   - `https://www.reconstitutionsafety.com` loads frontend
   - `https://api.reconstitutionsafety.com/health` returns `{"status":"ok"}`
   - Browser network calls from frontend go to `https://api.reconstitutionsafety.com`

## Notes

- Content is harm-reduction and research oriented; not medical advice.
- Add new peptides by extending the list in `server/peptides_data.py`.
- **Future data migration**: Move peptide data from Python into JSON files (`server/data/peptides.json`) to separate data from code. When the project needs an admin UI, user accounts, or dynamic pricing, migrate to PostgreSQL.
- Update the disclaimer text via `/disclaimer` in `server/main.py`.
- Calculator now supports mg / mcg inputs and converts to mg/mL concentration automatically.
- Peptide profiles include `typical_protocols` and per-fact `citations` (shown via “View citations” in the UI).

## Sources (Handling & Storage)

Handling and storage depend on sequence, concentration, solvent, sterility, and temperature.
This project cites general laboratory handling guidance and example supplier handling notes.

- AAPPTEC: "Handling and Storage of Peptides" (general handling and short solution-storage guidance)
  https://www.peptide.com/faqs/handling-and-storage-of-peptides/
- GenScript: "Peptide Storage and Handling Guidelines" (recommends avoiding long-term storage in solution)
  https://www.genscript.com/peptide_storage_and_handling.html
- ProSpec product pages (example supplier handling/storage notes)
  https://www.prospecbio.com/bpc-157
  https://www.prospecbio.com/ipamorelin
- Bachem: "Reconstitution of Peptides" (general reconstitution + storage guidance; avoid long-term storage in solution)
  https://www.bachem.com/knowledge-center/technologies/reconstitution-of-peptides/
