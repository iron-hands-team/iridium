#!/usr/bin/env bash
# Backs up the database and uploaded files into ./backups (or the folder you pass).
#
#   ./scripts/backup.sh [folder]        KEEP=14 ./scripts/backup.sh   (keep the newest 14 of each kind)
#
# File storage is stopped for a few seconds so its metadata is copied consistently;
# uploads and downloads fail during that moment, everything else keeps working.
set -euo pipefail
cd "$(dirname "$0")/.."

[[ -f .env ]] || { echo ".env not found. Run this from the Iridium folder." >&2; exit 1; }
DB_USER="$(grep -E '^DB_USER=' .env | head -1 | sed -E 's/^[^=]*="?([^"#]*)"?.*/\1/' | sed -E 's/[[:space:]]+$//')"
DB_PASSWORD="$(grep -E '^DB_PASSWORD=' .env | head -1 | sed -E 's/^[^=]*="?([^"#]*)"?.*/\1/' | sed -E 's/[[:space:]]+$//')"

DEST="${1:-backups}"
KEEP="${KEEP:-14}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$DEST"
DEST="$(cd "$DEST" && pwd)"
umask 077

echo "Backing up the database..."
docker exec -e PGPASSWORD="$DB_PASSWORD" postgres-db pg_dump -U "$DB_USER" -d school_db --no-owner | gzip > "$DEST/db-$STAMP.sql.gz"

echo "Backing up uploaded files..."
trap 'docker start garage-storage >/dev/null 2>&1 || true' EXIT
docker stop garage-storage >/dev/null
docker run --rm --volumes-from garage-storage -v "$DEST":/backup alpine:3 tar czf "/backup/files-$STAMP.tar.gz" -C /var/lib/garage .
docker start garage-storage >/dev/null
trap - EXIT

# Keep only the newest $KEEP of each kind.
for prefix in db files; do
  # shellcheck disable=SC2012
  ls -1t "$DEST"/"$prefix"-*.gz 2>/dev/null | tail -n +"$((KEEP + 1))" | xargs -r rm -f
done

echo "Done:"
echo "  $DEST/db-$STAMP.sql.gz"
echo "  $DEST/files-$STAMP.tar.gz"
echo "Copy these off this machine. A backup on the same disk does not protect you from losing the disk."
