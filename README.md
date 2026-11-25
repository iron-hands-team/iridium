# [Iridium](https://iridium.tonymac.net)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

![Website homepage screenshot](/banner.png)

**Access the deployed demo version [here](https://iridium.tonymac.net) with username `admin` and password `admin123`. This is a demo only; real installs never ship with demo accounts.**

Iridium is an easy to use online platform for schools to post announcements, view schedules, and manage students and staff, inspired by [TJHSST](https://tjhsst.fcps.edu)'s intranet [Ion](https://github.com/tjcsl/ion).

## Pages

- Homepage: shows announcements, customizable widgets, and other important information
- _more coming soon_

## Architecture

- Frontend: [Next.js](https://nextjs.org) as the frontend framework with the technologies [React](https://react.dev), [TypeScript](https://typescriptlang.org), and [Tailwind](https://tailwindcss.com).
- Backend: [FastAPI](https://fastapi.tiangolo.com) as the backend [Python](https://python.org) framework for the API and server operations, which connects to the [PostgreSQL](https://postgresql.org) database and the [Garage](https://garagehq.deuxfleurs.fr/) object storage.
- Scheduler: [Celery](https://docs.celeryq.dev/en/stable/), which uses [Redis](https://redis.io/) as its broker, performs backend automated cron jobs based on platform settings.
- Reverse proxy: Iridium uses [Caddy](https://caddyserver.com/) as both a reverse proxy and a TLS certificate manager to resolve server and frontend requests.
- Environment: the entire app is [dockerized](https://docker.com) into 7 containers: caddy, garage, redis, celery, db, backend, and frontend, with all the dependencies and environment variables set up.

## Quick start

You need Docker with Compose v2.24 or newer, plus `openssl` and `curl`.

```bash
git clone https://github.com/iron-hands-team/iridium.git
cd iridium
./scripts/install.sh
```

This creates `.env` with random secrets, sets up Garage storage, starts everything and prints the admin password. Open https://localhost (accept the local certificate warning).

### Production

```bash
./scripts/install.sh --production --domain school.example.com
```

Point your domain's DNS at the server first; Caddy gets the HTTPS certificate automatically. Production runs the optimized frontend build, no demo accounts, and no exposed database port. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for backups, updates and restores, [SECURITY.md](SECURITY.md), [docs/PRIVACY.md](docs/PRIVACY.md) and [docs/DPA-TEMPLATE.md](docs/DPA-TEMPLATE.md).

### Manual setup

If you prefer to do it by hand, copy `.env.example` to `.env`, fill in the secrets, run `docker compose up -d garage`, then configure Garage:

```bash
docker exec garage-storage /garage status
docker exec garage-storage /garage layout assign <ID_FROM_PREV_COMMAND> -c 5G -z garage
docker exec garage-storage /garage layout apply --version 1
docker exec garage-storage /garage key create iridium-key
docker exec garage-storage /garage bucket create iridium-uploads
docker exec garage-storage /garage bucket allow --read --write iridium-uploads --key iridium-key
docker exec garage-storage /garage bucket website --allow iridium-uploads
```

Put the key and secret in `.env` (`GARAGE_ACCESS_KEY`, `GARAGE_SECRET_KEY`) and run `docker compose up -d`.

> **Note**: the Celery service doesn't hot reload, run `docker compose up -d --build celery` to apply changes.

## Database migrations

The schema is managed with [Alembic](https://alembic.sqlalchemy.org) and applied automatically when the backend starts. An existing database created before migrations were added is adopted automatically. To change a model:

```bash
cd backend
alembic revision --autogenerate -m "describe the change"   # review the generated file
```

## Tests

Tests run against a real PostgreSQL database and drop and recreate its schema, so use a throwaway database:

```bash
cd backend
pip install -r requirements-dev.txt
export TEST_DATABASE_URL=postgresql://user:password@localhost:5432/iridium_test
pytest
cd celery && pytest   # the Celery tasks run in their own process
```

CI runs both suites on every push and pull request.

## Contribution

Any kind of contribution is welcome, but please follow the guideline below!

- Submit an issue if there's a bug/issue or if you want to suggest new features/subscriptions to be added.
- Submit a pull request if you want to add or improve the code base!
- Commit messages should be specific and address the issue
- Please don't submit random issues that aren't specific
- Please don't submit pull requests that "fix typo" or "improve formatting"
