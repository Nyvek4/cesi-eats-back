#!/bin/bash

# Vérifie si le répertoire /var/app existe, sinon le crée
if [ ! -d "/var/app" ]; then
    echo "Le répertoire /var/app n'existe pas. Création..."
    sudo mkdir -p /var/app
    sudo chown $USER:$USER /var/app
fi

# Vérifie si le répertoire /var/app/node existe, sinon le crée
if [ ! -d "/var/app/node" ]; then
    echo "Le répertoire /var/app/node n'existe pas. Création..."
    sudo mkdir -p /var/app/node
    sudo chown $USER:$USER /var/app/node
fi

# Répertoire du projet
project_dir="/var/app/node/cesi-eats-back"

# Vérifie si le répertoire existe
if [ ! -d "$project_dir" ]; then
    echo "Le répertoire $project_dir n'existe pas. Clonage du dépôt..."
    # Crée le répertoire et clone le dépôt
    sudo mkdir -p "$project_dir"
    sudo chown $USER:$USER "$project_dir"
    git clone https://github.com/Nyvek4/cesi-eats-back.git "$project_dir"
else
    echo "Le répertoire $project_dir existe. Mise à jour du dépôt..."
    # Accéder au répertoire et effectuer un pull
    cd "$project_dir"
    git pull
fi