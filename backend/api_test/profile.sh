#!/bin/bash
set -e

curl -k -b cookies.txt -X GET https://localhost:8443/api/profile \
  -H "x-api-key: PONG_APP_SECRET_KEY_2026"

