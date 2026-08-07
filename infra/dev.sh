#!/usr/bin/env bash
# ============================================================
# SAMPARA — dev helper (pola infra/dev.sh dari bemunair2026)
#
# Pemakaian (dari root repo):
#   infra/dev.sh up          -> build + start semua service (detached)
#   infra/dev.sh down        -> stop semua service
#   infra/dev.sh restart     -> restart semua service
#   infra/dev.sh logs        -> ikuti log semua service
#   infra/dev.sh ps          -> status container
#   infra/dev.sh config      -> validasi compose file
# ============================================================
set -euo pipefail

COMPOSE_FILE="infra/docker-compose.dev.yml"
ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE tidak ditemukan." >&2
  echo "Jalankan dulu:  cp .env.example .env" >&2
  exit 1
fi

COMPOSE="docker compose --env-file $ENV_FILE -f $COMPOSE_FILE"

cmd="${1:-up}"
case "$cmd" in
  up)      $COMPOSE up -d --build ;;
  down)    $COMPOSE down ;;
  restart) $COMPOSE restart ;;
  logs)    $COMPOSE logs -f ;;
  ps)      $COMPOSE ps ;;
  config)  $COMPOSE config ;;
  *)
    echo "Usage: $0 {up|down|restart|logs|ps|config}" >&2
    exit 1
    ;;
esac
