#!/bin/bash

echo "Initializing the project..."

# Step 1: Init npm and install dependencies
if [ ! -f package.json ]; then
    npm init -y
fi
npm install fastify @fastify/static @fastify/cors @fastify/session @fastify/cookie sqlite3 dotenv

echo "npm initialized and packages installed"


# Step 2: Ensure public folders exist (inside backend/../public)
mkdir -p ../public/scripts
mkdir -p ../public/styles

echo "Ensured public folders exist"


# Step 3: Copy frontend HTML → public/index.html
if [ -f ../frontend/pong.html ]; then
    cp ../frontend/pong.html ../public/index.html
    echo "Copied pong.html → public/index.html"
else
    echo "WARNING: ../frontend/pong.html not found — skipping."
fi


# Step 4: Compile TypeScript (if TypeScript exists)
if [ -f ../frontend/scripts/tsconfig.json ]; then
    echo "Compiling TypeScript..."
    tsc --project ../frontend/scripts/tsconfig.json
else
    echo "WARNING: TypeScript config missing — skipping TS build."
fi


# Step 5: Copy CSS files
if compgen -G "../frontend/styles/*.css" > /dev/null; then
    cp ../frontend/styles/*.css ../public/styles/
    echo "CSS copied to public"
else
    echo "WARNING: No CSS files found."
fi


# Step 6: Start the server
echo "Starting the server..."
node server.js
