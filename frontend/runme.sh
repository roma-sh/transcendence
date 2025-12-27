#!/bin/bash

set -euo pipefail

echo "Initializing Tailwind CLI (frontend)..."

if [ ! -f package.json ]; then
  npm init -y
fi

echo "Installing Tailwind CLI..."

# npm install -D tailwindcss @tailwindcss/cli

if [ ! -d "node_modules/tailwindcss" ] || [ ! -d "node_modules/@tailwindcss/cli" ]; then
  npm install -D tailwindcss @tailwindcss/cli
else
  echo "Tailwind packages already installed"
fi

npx @tailwindcss/cli -i ./styles/input.css -o ../public/styles/output.css --watch

echo "Done."
