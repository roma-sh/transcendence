#!/bin/bash
set -e

curl -k -c cookies.txt -X POST https://localhost:8443/api/auth/login \
  -H "Content-Type: application/json" \
  -H "x-api-key: PONG_APP_SECRET_KEY_2026" \
  -d '{
    "username": "rami",
    "password": "Ra1991mez1991!"
  }'
