#!/usr/bin/env bash
# Restores a backup made by backup.sh. THIS REPLACES the current database and files.
#
#   ./scripts/restore.sh backups/db-<stamp>.sql.gz [backups/files-<stamp>.tar.gz]
#
# Add --production to use compose.prod.yaml (same as the install script).
set -euo pipefail
cd "$(dirname "$0")/.."

COMPOSE=(docker compose)
ARGS=()
for a in "$@"; do
  if [[ "$a" == "--production" ]]; then COMPOSE=(docker compose -f compose.yaml -f compose.prod.yaml); else ARGS+=("$a"); fi
done
DB_FILE="${ARGS[0]:-}"
FILES_FILE="${ARGS[1]:-}"
[[ -n "$DB_FILE" && -f "$DB_FILE" ]] || { echo "Usage: $0 <db-backup.sql.gz> [files-backup.tar.gz] [--production]" >&2; exit 1; }
[[ -z "$FILES_FILE" || -f "$FILES_FILE" ]] || { echo "File not found: $FILES_FILE" >&2; exit 1; }

DB_USER="$(grep -E '^DB_USER=' .env | head -1 | sed -E 's/^[^=]*="?([^"#]*)"?.*/\1/' | sed -E 's/[[:space:]]+$//')"
DB_PASSWORD="$(grep -E '^DB_PASSWORD=' .env | head -1 | sed -E 's/^[^=]*="?([^"#]*)"?.*/\1/' | sed -E 's/[[:space:]]+$//')"

echo "This will ERASE the current database${FILES_FILE:+ and uploaded files} and replace them with the backup."
read -r -p "Type 'restore' to continue: " answer
[[ "$answer" == "restore" ]] || { echo "Cancelled."; exit 1; }

"${COMPOSE[@]}" stop backend celery frontend

echo "Restoring the database..."
PSQL=(docker exec -i -e PGPASSWORD="$DB_PASSWORD" postgres-db psql -U "$DB_USER" -v ON_ERROR_STOP=1)
"${PSQL[@]}" -d postgres -c "DROP DATABASE IF EXISTS school_db WITH (FORCE)" -c "CREATE DATABASE school_db"
gunzip -c "$DB_FILE" | "${PSQL[@]}" -d school_db >/dev/null

if [[ -n "$FILES_FILE" ]]; then
  echo "Restoring uploaded files..."
  FILES_DIR="$(cd "$(dirname "$FILES_FILE")" && pwd)"
  docker stop garage-storage >/dev/null
  docker run --rm --volumes-from garage-storage -v "$FILES_DIR":/backup alpine:3 \
    sh -c "rm -rf /var/lib/garage/meta/* /var/lib/garage/data/* && tar xzf /backup/$(basename "$FILES_FILE") -C /var/lib/garage"
  docker start garage-storage >/dev/null
fi

"${COMPOSE[@]}" up -d
echo "Restore complete."
