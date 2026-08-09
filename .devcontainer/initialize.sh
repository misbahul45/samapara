#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ROOT_ENV="$ROOT_DIR/.env"
TARGET_DIR="$(realpath -m "${1:-$ROOT_DIR/infra}")"

if [ ! -f "$ROOT_ENV" ]; then
  echo "ERROR: $ROOT_ENV tidak ditemukan." >&2
  echo "Jalankan: cp .env.example .env" >&2
  exit 1
fi

case "$TARGET_DIR/" in
  "$ROOT_DIR"/*) ;;
  *)
    echo "ERROR: target environment harus berada di dalam $ROOT_DIR." >&2
    exit 1
    ;;
esac

mkdir -p "$TARGET_DIR"

TARGET_ENV="$TARGET_DIR/.env"

if [ -e "$TARGET_ENV" ] && [ ! -L "$TARGET_ENV" ]; then
  echo "ERROR: $TARGET_ENV sudah ada dan bukan symlink." >&2
  exit 1
fi

RELATIVE_ENV="$(realpath --relative-to="$TARGET_DIR" "$ROOT_ENV")"
ln -sfn "$RELATIVE_ENV" "$TARGET_ENV"

echo "Sampara environment ready: $TARGET_ENV"
