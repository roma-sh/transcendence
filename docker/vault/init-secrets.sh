#!/bin/bash

set -e

INIT_FILE=/vault/data/init.json

if [ ! -f "$INIT_FILE" ]; then
    echo "Vault not initialized, initializing . . ."
    vault operator init -key-shares=1 -key-threshold=1 -format=json > "$INIT_FILE"
else
    echo "Vault is already set "
fi

UNSEAL_KEY=$(jq -r '.unseal_keys_b64[0]' "$INIT_FILE")
echo "unsealing vault"

vault operator unseal "$UNSEAL_KEY"

export VAULT_TOKEN=$(jq -r '.root_token' "$INIT_FILE")
echo "Root token got exported"

if vault kv get secret/db >/dev/null 2>&1; then
    echo "Vault is already setup"
else
    echo "Setting up vault"
    vault kv put secret/db POSTGRES_USER=trance POSTGRES_PASSWORD=secretpassword POSTGRES_DB=transcendence
fi
