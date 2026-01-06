#!/bin/bash
set -e

# Replace with your local image file path
IMAGE_PATH="/home/ramez/Desktop/ft_transcendence/backend/api_test/profile.png"

curl -b cookies.txt -X PUT http://localhost:3000/api/profile/picture \
  -F "file=@${IMAGE_PATH}"
