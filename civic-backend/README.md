# JanSetu – Civic Issue Reporting Platform (Backend)

Backend API built with Node.js (Express 5) and Sequelize (PostgreSQL).

## Features
- REST API for Issues: create, list, get, update, delete, stats
- File uploads (images, optional audio) via multer
- Security middlewares (helmet, rate limit, sanitize, xss, hpp)
- CORS with credentials and origin reflection or allowlist
- Logging with morgan, compression

## Requirements
- Node.js 18+
- PostgreSQL 13+ running and reachable

## Setup
1. Install dependencies
```bash
npm install
```
2. Configure environment
```bash
cp .env.example .env
# edit .env to set DATABASE_URL or PG* vars, PORT, etc.
```
3. Run in development
```bash
npm run dev
```
4. Production
```bash
npm start
```

## Environment Variables
See `.env.example` for all options. Key ones:
- `DATABASE_URL` or `PGHOST/PGUSER/PGPASSWORD/PGDATABASE/PGPORT`
- `PORT` (default 4000)
- `CORS_ALLOWED_ORIGINS` (CSV list; if omitted, origin is reflected)
- `UPLOAD_DIR` (default `uploads`)
- `DB_SSL` / `DB_SSL_REJECT_UNAUTHORIZED`

## API Endpoints
- POST `/api/issues` – Create (multipart form; fields: category, description, priority, location JSON string, reportedBy, contactInfo JSON string; files: images[], audioNote)
- GET `/api/issues` – List with pagination and filters (page, limit, status, category, priority, q, sort, order)
- GET `/api/issues/:id` – Get by id
- PUT `/api/issues/:id` – Update issue (same fields as create; can append files)
- DELETE `/api/issues/:id` – Delete issue
- GET `/api/issues/stats` – Aggregate counts by status and category

## Database
- Uses Sequelize with PostgreSQL. By default, in development the server runs `sequelize.sync({ alter: true })` to keep the schema in sync.
- For production, prefer running migrations with `sequelize-cli`.

## Sequelize CLI (optional)
A basic CLI setup is included:
- `.sequelizerc` points to `civic-backend/config/config.js`, `migrations/`, `models/` (not used by runtime) and `seeders/`.
- Run migrations:
```bash
npx sequelize-cli db:migrate
```

## Notes
- Static upload files are served at `/uploads/<filename>`.
- Tracking ID is auto-generated like `JS-1A2B3C`.
