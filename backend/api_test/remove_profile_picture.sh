#!/bin/bash
set -e

# Remove profile picture by sending empty multipart PUT request
curl -k -b cookies.txt -X PUT https://localhost:8443/api/profile/picture \
  -H "x-api-key: PONG_APP_SECRET_KEY_2026" \
  -F "file="
