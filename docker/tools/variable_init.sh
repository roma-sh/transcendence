#!bin/bash

#_EXPLANATION_
#- creates env variables according to file names with according content

SECRETS_DIR = /run/secrets

if [ -d "$SECRETS_DIR" ]; then
    for file in "$SECRETS_DIR"/*; do
        if [ -f "$file" ]; then
        VAR_NAME=$(basename "$file")
        export "$VAR_NAME"="$(cat "$file)"
        fi
    done
fi

exec "$@"
