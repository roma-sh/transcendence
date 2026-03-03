#!/bin/bash
set -e

curl -k -b cookies.txt -X DELETE https://localhost:8443/api/account/delete \
  -H "x-api-key: PONG_APP_SECRET_KEY_2026"
