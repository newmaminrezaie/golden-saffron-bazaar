#!/usr/bin/env bash
# Step 2 — deploy khajavisaffron to the VPS.
# ONLY touches /var/www/khajavisaffron and the khajavi-backend PM2 process.
# gandomak-backend, zarintajkavir-app and their Nginx configs are never touched.
#
# Usage:  bash deploy/deploy.sh
# Requires: ssh access  root@87.107.12.53 -p 9011
set -euo pipefail

cd "$(dirname "$0")/.."

SERVER="root@87.107.12.53"
PORT="9011"
REMOTE_DIR="/var/www/khajavisaffron"
PM2_APP="khajavi-backend"

# Uses only ssh + tar (no rsync) so it works on Windows Git Bash too.
SSH="ssh -p ${PORT}"

# --- safety checks ---------------------------------------------------------
if [ ! -s dist/client/index.html ]; then
  echo "ERROR: dist/client is missing or empty. Run: bash deploy/build.sh first." >&2
  exit 1
fi

echo "==> Checking server is reachable..."
${SSH} -o ConnectTimeout=10 ${SERVER} "test -d ${REMOTE_DIR} && echo remote-ok"

# --- 1) frontend (static files) --------------------------------------------
# Upload to a staging folder, then swap it in one step so the site is never
# half-updated. Old version is kept as client.old (previous one is removed).
echo "==> Uploading frontend to ${REMOTE_DIR}/dist/client ..."
${SSH} ${SERVER} "rm -rf ${REMOTE_DIR}/dist/client.new ${REMOTE_DIR}/dist/client.old"
tar -czf - -C dist client | ${SSH} ${SERVER} \
  "mkdir -p ${REMOTE_DIR}/dist/client.new && tar -xzf - -C ${REMOTE_DIR}/dist/client.new --strip-components=1"
# Preserve server-side images: copy any existing images the new build lacks (never overwrite newer build files).
${SSH} ${SERVER} "if [ -d ${REMOTE_DIR}/dist/client/images ]; then mkdir -p ${REMOTE_DIR}/dist/client.new/images && cp -rn ${REMOTE_DIR}/dist/client/images/. ${REMOTE_DIR}/dist/client.new/images/; fi"
${SSH} ${SERVER} "mv ${REMOTE_DIR}/dist/client ${REMOTE_DIR}/dist/client.old && mv ${REMOTE_DIR}/dist/client.new ${REMOTE_DIR}/dist/client"

# --- 2) backend code -------------------------------------------------------
# Uploads only server source code. Excludes everything that must stay on the
# server untouched: .env (secrets), node_modules, uploads/ (product images),
# and any SQLite data files (products/orders/settings live there).
echo "==> Uploading backend code to ${REMOTE_DIR}/server ..."
tar -czf - -C server \
  --exclude='.env' \
  --exclude='node_modules' \
  --exclude='uploads' \
  --exclude='*.db' --exclude='*.sqlite' --exclude='*.sqlite3' \
  --exclude='data' \
  . | ${SSH} ${SERVER} "tar -xzf - -C ${REMOTE_DIR}/server"

# --- 3) install deps + restart ONLY khajavi-backend ------------------------
echo "==> Installing backend dependencies and restarting ${PM2_APP} ..."
${SSH} ${SERVER} bash -s <<EOF
set -e
cd ${REMOTE_DIR}/server
npm install --omit=dev
pm2 restart ${PM2_APP}
pm2 save
EOF

# --- 4) verify -------------------------------------------------------------
echo "==> Verifying backend is up..."
${SSH} ${SERVER} "pm2 describe ${PM2_APP} | grep -E 'status|uptime' ; curl -sf -o /dev/null -w 'api status: %{http_code}\n' http://127.0.0.1:3002/api/products || echo 'WARN: api check failed'"

echo "==> Deploy complete: https://khajavisaffron.ir"
