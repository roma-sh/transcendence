#!/bin/bash

echo "Initializing the project..."

# Step 1: Init npm and install dependencies
if [ ! -f package.json ]; then
    npm init -y
fi
npm install fastify \
    @fastify/static \
    @fastify/cors \
    @fastify/session \
    @fastify/cookie \
    @fastify/multipart \
    @fastify/rate-limit \
    sqlite3 \
    dotenv

echo "npm initialized and packages installed"


# Step 2: Ensure uploads folder exists for profile images
mkdir -p ../public/uploads/profiles

echo "Ensured uploads folders exist"


# Step 3: Compile TypeScript (if TypeScript exists)
if [ -f ../frontend/scripts/tsconfig.json ]; then
    echo "Compiling TypeScript..."
    tsc --project ../frontend/scripts/tsconfig.json
else
    echo "WARNING: TypeScript config missing — skipping TS build."
fi

# Step 4: Start the server
echo "Starting the server..."
node server.js
