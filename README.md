# Budget Tracker

A simple personal budget tracker with a Django REST backend and a Vite + React frontend.

**Tech stack:**
- **Backend:** Django 5.2, Django REST Framework, Token Authentication, SQLite (default)
- **Frontend:** React (Vite), Axios, Tailwind CSS

**Repository layout**
- `backend/`: Django project and apps (`finance`, `users`) with `run.sh` and `setup.sh`.
- `frontend/`: Vite + React single-page application.

**Quick overview**
- The Django backend exposes API routes under `/api/` and authentication under `/api/auth/`.
- The frontend talks to the backend via `VITE_API_URL` and stores the token in `localStorage` (key: `token`).

**Local development — Backend**

1. Create and activate a Python virtual environment (recommended):

```bash
python -m venv .venv
source .venv/bin/activate
```

2. Install dependencies and run setup (script available):

```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
./setup.sh
```

3. Run development server:

```bash
# Simple Django dev server
python manage.py runserver 0.0.0.0:8000

# Or use the provided run script (used in deployments like Render)
export PORT=8000
./run.sh
```

Notes:
- Default DB in `settings.py` is SQLite (`db.sqlite3`) for quick local usage.
- REST framework uses Token Authentication and requires tokens for protected endpoints.

**Local development — Frontend**

1. Install dependencies and start dev server:

```bash
cd frontend
npm install
# set API URL for dev, for example:
export VITE_API_URL=http://127.0.0.1:8000/api
npm run dev
```

2. Production build:

```bash
npm run build
npm run preview
```

Frontend notes:
- The frontend uses `VITE_API_URL` to configure Axios (`frontend/src/services/api.js`).
- Authentication: frontend sends `Authorization: Token <token>` header when `localStorage.token` exists.

**API reference (important endpoints)**

Base API path: `/api/`

- Authentication (under `/api/auth/`):
  - `POST /api/auth/login/` — login, returns token (used by frontend `login` call)
  - `POST /api/auth/logout/` — logout

- Finance app (registered under `/api/`):
  - `GET /api/dashboard/` — summary/dashboard view
  - Resource routes (DRF router):
    - `GET/POST /api/categories/`, `PUT/PATCH/DELETE /api/categories/<id>/`
    - `GET/POST /api/transactions/`, `PUT/PATCH/DELETE /api/transactions/<id>/`
    - `GET/POST /api/budgets/`, `PUT/PATCH/DELETE /api/budgets/<id>/`

Examples (frontend uses these via `frontend/src/services/api.js`):
- `POST /api/auth/login/` — login
- `GET /api/dashboard/` — getSummary
- `GET /api/transactions/` — getTransactions
- `POST /api/transactions/` — createTransaction

**Env / config**
- Backend: configure `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, and DB settings in `backend/budget_backend/settings.py` or via environment variables as you externalize config.
- Frontend: set `VITE_API_URL` before starting Vite (eg. `http://127.0.0.1:8000/api`).

**Testing & Admin**
- Create a superuser for Django admin:

```bash
cd backend
python manage.py createsuperuser
```

- Run tests (if any):

```bash
cd backend
python manage.py test
```

**Deployment hints**
- `run.sh` runs Gunicorn and listens on `$PORT` (suited for Render-like platforms).
- `setup.sh` installs dependencies, runs migrations, and collects static files.

**Where to look for code**
- Backend apps:
  - `backend/finance/` — models, serializers, views, and router registrations
  - `backend/users/` — auth endpoints
- Frontend:
  - `frontend/src/services/api.js` — API client and endpoint list
  - `frontend/src/pages` and `frontend/src/components` — UI

**Assessment Submission**

- **Frontend (hosted):** `https://budget-tracker-mtgy.vercel.app/dashboard`
- **Backend (hosted / API):** `https://dashboard.render.com/web/srv-d49ono2dbo4c73ac8jsg`

- **Test user credentials** (please include these when submitting the form):
  - `username`: `testuser`
  - `password`: `testpass123`

**Contact**
- For questions, reach out via email at vipullahepatil@gmail.com
