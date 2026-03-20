#!/bin/bash
set -e

curl -k -b cookies.txt -X POST https://localhost:8443/api/game/total-games \
  -H "x-api-key: PONG_APP_SECRET_KEY_2026"