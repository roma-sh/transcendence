#!/bin/bash
set -e

# Remove profile picture by sending empty multipart PUT request
curl -b cookies.txt -X PUT http://localhost:3000/api/profile/picture \
  -F "file="
