#!/bin/bash
set -e

curl -b cookies.txt -X GET http://localhost:3000/api/profile

