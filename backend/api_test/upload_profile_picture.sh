#!/bin/bash
set -e

# Replace with your local image file path
IMAGE_PATH="/home/ramez/Desktop/ft_transcendence/backend/api_test/profile.png"

curl -k -b cookies.txt -X PUT https://localhost:8443/api/profile/picture \
  -H "x-api-key: PONG_APP_SECRET_KEY_2026" \
  -F "file=@${IMAGE_PATH}"
