#!/usr/bin/env bash
set -euo pipefail

# Backup diário automatizado do PostgreSQL (Docker Compose)
# Agende no cron com: crontab -e
# 0 3 * * * /home/ubuntu/labriot-website/deploy/backup-db.sh >> /var/log/labriot-backup.log 2>&1

APP_DIR="${APP_DIR:-/home/ubuntu/labriot-website}"
BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"

mkdir -p "$BACKUP_DIR"

# Carrega POSTGRES_USER e POSTGRES_DB do .env se existir
if [ -f "$APP_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$APP_DIR/.env"
  set +a
fi

PG_USER="${POSTGRES_USER:-labriot}"
PG_DB="${POSTGRES_DB:-labriot}"
OUT_FILE="$BACKUP_DIR/${PG_DB}_${TIMESTAMP}.sql.gz"

echo "[$(date -Iseconds)] Iniciando backup de '$PG_DB'..."
docker exec labriot-postgres pg_dump -U "$PG_USER" -d "$PG_DB" | gzip > "$OUT_FILE"
chmod 600 "$OUT_FILE"

echo "[$(date -Iseconds)] Backup concluído: $OUT_FILE"
find "$BACKUP_DIR" -name "*.sql.gz" -type f -mtime +"$RETENTION_DAYS" -delete
echo "[$(date -Iseconds)] Backups mais antigos que $RETENTION_DAYS dias removidos."
