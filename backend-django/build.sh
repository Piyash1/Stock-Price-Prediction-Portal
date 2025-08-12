#!/usr/bin/env bash
set -euo pipefail

# Install dependencies (Render runs buildCommand in a clean environment)
pip install -r requirements.txt

# Run database migrations if DATABASE_URL is present
if [[ -n "${DATABASE_URL:-}" ]]; then
  python manage.py migrate --noinput
else
  echo "DATABASE_URL is not set; skipping migrate."
fi

# Collect static files
python manage.py collectstatic --noinput
