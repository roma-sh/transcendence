#!/bin/bash
set -e

curl -k -b cookies.txt -X PUT https://localhost:8443/api/profile/email \
  -H "Content-Type: application/json" \
  -H "x-api-key: PONG_APP_SECRET_KEY_2026" \
  -d '{
    "newEmail": "newemail@gmail.com"
  }'
