#!/bin/bash

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
    echo "Le fichier .env n'existe pas à l'emplacement spécifié."
    exit 1
fi

SERVICES_DIR="services"

if [ ! -d "$SERVICES_DIR" ]; then
    echo "Le dossier services n'existe pas à l'emplacement spécifié."
    exit 1
fi

for service_dir in "$SERVICES_DIR"/*; do
    if [ -d "$service_dir" ]; then
        echo "Copie du fichier .env dans $service_dir"
        cp "$ENV_FILE" "$service_dir"
    fi
done

echo "La copie du fichier .env dans les dossiers services est terminée."