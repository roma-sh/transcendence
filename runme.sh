#!/bin/bash

echo "Initializing the project..."

# Step 1: Init npm and install dependencies
npm init -y
npm install fastify @fastify/static sqlite3

echo "npm initialized and packages installed"

# Step 2: Create required folders
mkdir -p public/scripts
mkdir -p public/styles

echo "Ensured public folders exist"

# Step 3: Copy HTML file from frontend to public
cp frontend/pong.html public/index.html
echo "Copied pong.html to public/index.html"

# Step 4: Compile TypeScript
echo "Compiling TypeScript..."
tsc --project frontend/scripts/tsconfig.json

# Step 5: Copy CSS files
cp frontend/styles/*.css public/styles/
echo "CSS copied to public"

# Step 6: Start the server
echo "Starting the server..."
node server.js
