#!/bin/bash
set -e

curl -c cookies.txt -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
	"email": "ramez@gmail.com",
    "username": "ramez",
    "password": "Abcabc123#"
  }'
