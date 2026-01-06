#!/bin/bash
set -e

curl -b cookies.txt -X PUT http://localhost:3000/api/profile/username \
  -H "Content-Type: application/json" \
  -d '{
    "newUsername": "ramez"
  }'
