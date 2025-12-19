#!/bin/bash
set -e

curl -b cookies.txt -X PUT http://localhost:3000/api/profile/email \
  -H "Content-Type: application/json" \
  -d '{
    "newEmail": "newemail@gmail.com"
  }'
