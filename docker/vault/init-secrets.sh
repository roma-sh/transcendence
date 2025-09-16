#!/bin/bash

INIT_FILE=/vault/data/init.json



if vault kv get secret/db >/dev/null 2>&1; then
    echo "Vault is already setup"
else
    echo "Setting up vault"
    vault kv put secret/db POSTGRES_USER=trance POSTGRES_PASSWORD=secretpassword POSTGRES_DB=transcendence
fi
