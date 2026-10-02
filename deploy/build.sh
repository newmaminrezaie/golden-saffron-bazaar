#!/usr/bin/env bash
# Step 1 — build the static site locally (run from the project root).
# Output goes to dist/client, ready for deploy.sh to upload.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Installing dependencies (if needed)..."
if [ ! -d node_modules ]; then
  npm install
fi

echo "==> Building static site..."
npm run build

if [ ! -s dist/client/index.html ]; then
  echo "ERROR: dist/client/index.html is missing or empty — build failed." >&2
  exit 1
fi

echo "==> Build OK. Now run: bash deploy/deploy.sh"
