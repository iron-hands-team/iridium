#!/usr/bin/env bash
# Sets up Iridium: creates .env with random secrets, configures Garage storage, starts everything.
#
#   ./scripts/install.sh                                        local / development
#   ./scripts/install.sh --production --domain school.example.com
#
# Safe to run again: it keeps an existing .env and skips Garage steps that are already done.
set -euo pipefail
cd "$(dirname "$0")/.."

PROD=0
DOMAIN=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --production) PROD=1 ;;
    --domain) DOMAIN="${2:-}"; shift ;;
    -h|--help) sed -n '2,8p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
  shift
done

if (( PROD )) && [[ -z "$DOMAIN" ]]; then
  echo "Production needs your domain: ./scripts/install.sh --production --domain school.example.com" >&2
  exit 1
fi

for tool in docker openssl curl; do
  command -v "$tool" >/dev/null || { echo "Missing required tool: $tool" >&2; exit 1; }
done
docker compose version >/dev/null 2>&1 || { echo "Docker Compose v2 is required." >&2; exit 1; }

COMPOSE=(docker compose)
(( PROD )) && COMPOSE=(docker compose -f compose.yaml -f compose.prod.yaml)
GARAGE=(docker exec garage-storage /garage)

set_env() { # set_env KEY VALUE  (replaces the KEY=... line, adds it if missing)
  local key="$1" value="$2"
  if grep -qE "^${key}=" .env; then
    sed -i.bak -E "s|^${key}=.*|${key}=\"${value}\"|" .env && rm -f .env.bak
  else
    printf '%s="%s"\n' "$key" "$value" >> .env
  fi
}
get_env() { grep -E "^$1=" .env | head -1 | sed -E 's/^[^=]*="?([^"#]*)"?.*/\1/' | sed -E 's/[[:space:]]+$//'; }

ADMIN_PASSWORD_SHOWN=""
if [[ ! -f .env ]]; then
  echo "Creating .env with random secrets..."
  cp .env.example .env
  set_env DB_PASSWORD "$(openssl rand -hex 16)"
  set_env JWT_SECRET_KEY "$(openssl rand -hex 32)"
  set_env GARAGE_RPC_SECRET "$(openssl rand -hex 32)"
  ADMIN_PASSWORD_SHOWN="$(openssl rand -base64 18 | tr -d '/+=' | cut -c1-20)"
  set_env ADMIN_PASSWORD "$ADMIN_PASSWORD_SHOWN"
  if (( PROD )); then
    set_env ENVIRONMENT "production"
    set_env SITE_ADDRESS "$DOMAIN"
    set_env FRONTEND_URL "https://$DOMAIN"
  fi
else
  echo "Keeping your existing .env"
fi
chmod 600 .env

echo "Starting Garage (file storage)..."
"${COMPOSE[@]}" up -d garage
for _ in $(seq 1 30); do
  "${GARAGE[@]}" status >/dev/null 2>&1 && break
  sleep 2
done
"${GARAGE[@]}" status >/dev/null 2>&1 || { echo "Garage did not start. Check: docker compose logs garage" >&2; exit 1; }

if "${GARAGE[@]}" status | grep -q "NO ROLE ASSIGNED"; then
  NODE_ID="$("${GARAGE[@]}" status | grep -oE '\b[0-9a-f]{16}\b' | head -1)"
  [[ -n "$NODE_ID" ]] || { echo "Could not read the Garage node ID." >&2; exit 1; }
  echo "Configuring Garage layout for node $NODE_ID..."
  "${GARAGE[@]}" layout assign "$NODE_ID" -c 5G -z garage
  "${GARAGE[@]}" layout apply --version 1
fi

if ! "${GARAGE[@]}" bucket info iridium-uploads >/dev/null 2>&1; then
  "${GARAGE[@]}" bucket create iridium-uploads
fi

ACCESS_KEY="$(get_env GARAGE_ACCESS_KEY)"
if [[ -z "$ACCESS_KEY" || "$ACCESS_KEY" == YOUR_* ]]; then
  echo "Creating the storage access key..."
  KEY_OUTPUT="$("${GARAGE[@]}" key create iridium-key)"
  KEY_ID="$(grep -oE 'GK[0-9a-f]{24}' <<<"$KEY_OUTPUT" | head -1)"
  KEY_SECRET="$(grep -oE '\b[0-9a-f]{64}\b' <<<"$KEY_OUTPUT" | head -1)"
  if [[ -z "$KEY_ID" || -z "$KEY_SECRET" ]]; then
    echo "Could not read the new key from Garage's output. Set GARAGE_ACCESS_KEY and GARAGE_SECRET_KEY in .env by hand:" >&2
    echo "$KEY_OUTPUT" | sed -E 's/[0-9a-f]{64}/<secret hidden>/' >&2
    exit 1
  fi
  set_env GARAGE_ACCESS_KEY "$KEY_ID"
  set_env GARAGE_SECRET_KEY "$KEY_SECRET"
fi
"${GARAGE[@]}" bucket allow --read --write iridium-uploads --key iridium-key
"${GARAGE[@]}" bucket website --allow iridium-uploads

echo "Starting Iridium..."
"${COMPOSE[@]}" up -d --build

echo "Waiting for the backend..."
for _ in $(seq 1 60); do
  curl -fsS http://127.0.0.1:8000/health >/dev/null 2>&1 && READY=1 && break
  sleep 3
done
[[ "${READY:-0}" == 1 ]] || { echo "Backend is not healthy yet. Check: docker compose logs backend" >&2; exit 1; }

echo
if (( PROD )); then
  echo "Iridium is running at https://$DOMAIN"
else
  echo "Iridium is running at https://localhost"
fi
if [[ -n "$ADMIN_PASSWORD_SHOWN" ]]; then
  echo "Admin login:  admin / $ADMIN_PASSWORD_SHOWN"
  echo "(Saved in .env as ADMIN_PASSWORD. Change it after your first login and then remove that line.)"
fi
echo "Back up regularly with ./scripts/backup.sh (see docs/DEPLOYMENT.md)."
