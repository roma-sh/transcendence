#!/bin/bash
set -e

curl -b cookies.txt -X PUT http://localhost:3000/api/profile/password \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Abcabc123#",
    "newPassword": "NewPass456!"
  }'
