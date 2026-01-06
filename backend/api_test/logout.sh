#!/bin/bash
set -e

curl -b cookies.txt -X POST http://localhost:3000/api/auth/logout
