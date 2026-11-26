# Deploying Iridium

## What you need

- A Linux server (2 CPU, 4 GB RAM, 20 GB disk is enough for a small school) with Docker and Compose v2.24+.
- A domain name pointed at the server's IP (A/AAAA record). Ports 80 and 443 open.
- `openssl` and `curl` installed.

## Install

```bash
git clone https://github.com/iron-hands-team/iridium.git
cd iridium
./scripts/install.sh --production --domain school.example.com
```

The script creates `.env` with random secrets, configures file storage, starts everything and prints the admin password once. Log in as `admin`, change the password, then delete the `ADMIN_PASSWORD` line from `.env`.

Production differs from development: optimized frontend build, a single backend worker without auto-reload, no exposed database port, security headers and automatic HTTPS (Caddy), and **no demo accounts** (only the admin, a general channel and default settings are created).

## Updating

```bash
git pull
docker compose -f compose.yaml -f compose.prod.yaml up -d --build
```

Database migrations run automatically when the backend starts. Take a backup first.

## Backups

```bash
./scripts/backup.sh            # writes db-*.sql.gz and files-*.tar.gz into ./backups, keeps the newest 14
```

File storage is stopped for a few seconds during the backup. Run it nightly from cron and copy the folder off the server, for example:

```
15 3 * * * cd /opt/iridium && ./scripts/backup.sh >> backups/backup.log 2>&1
```

A backup stored only on the same disk will not survive losing the disk. Keep a copy somewhere else.

## Restoring

```bash
./scripts/restore.sh backups/db-<stamp>.sql.gz backups/files-<stamp>.tar.gz --production
```

This replaces the current database and files and asks you to type `restore` first. **Test a restore on a spare machine before you depend on your backups.**

## Checking health

- `https://your-domain/api/health` returns `{"status":"ok"}`
- `https://your-domain/api/health/db` and `/api/health/storage` check the database and file storage.
- `docker compose logs backend` shows migrations, startup warnings and errors.

## Good to know

- Moving an existing database (created before migrations existed) is handled automatically; the backend logs a warning if the stored schema differs from the models.
- The login rate limit is 5 attempts per minute per client address.
- Do not expose port 8000 or the database to the internet; the production compose files do not.
- Accounts lock for 15 minutes after 5 failed logins. An attacker can use this to lock a known username out temporarily; the audit log shows `account_locked` events.
- Admins should turn on 2FA from their profile page.
- Not yet included: email notifications, a parent role.
