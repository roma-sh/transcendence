#!/bin/sh

#_EXPLANATION_
#- creates env variables according to file names with according content

echo "INITALIZING VARIABLES . . ."

SECRETS_DIR=/run/secrets

if [ -d "$SECRETS_DIR" ]; then
    for file in "$SECRETS_DIR"/*; do
        if [ -f "$file" ]; then
            VAR_NAME=$(basename "$file")
            export "$VAR_NAME"="$(cat "$file")"
        fi
    done
fi

echo "VARIABLE INITALIZATION COMPLETE !"

exec "$@"
