#!/bin/bash
set -e

curl -k -b cookies.txt -X PUT https://localhost:8443/api/profile/password \
  -H "Content-Type: application/json" \
  -H "x-api-key: PONG_APP_SECRET_KEY_2026" \
  -d '{
    "currentPassword": "Abcabc123#",
    "newPassword": "NewPass456!"
  }'
