# Détection du système d'exploitation
OS := $(shell uname -s)

# Utilise ton fichier .env pour définir les variables d'environnement nécessaires
include .env
export

.PHONY: all setup kill_all_node start_services dev

# La commande par défaut qui sera exécutée quand tu lances 'make'
all: setup kill_all_node start_services

# Crée le fichier .env et génère le secret JWT si nécessaire
setup:
	@echo "Checking and updating JWT_SECRET in .env if necessary"
	@if grep -q "JWT_SECRET" .env; then \
		echo "JWT_SECRET exists in .env"; \
	else \
		echo "JWT_SECRET=$(shell openssl rand -base64 32)" >> .env; \
		echo "JWT_SECRET added to .env"; \
	fi

# Tuer tous les processus Node.js en cours d'exécution
kill_all_node:
ifeq ($(OS),Linux)
	@killall node || true
else ifeq ($(OS),Darwin)
	@killall node || true
else
	@echo "Killing all Node processes on Windows..."
	@taskkill /F /IM node.exe || true
endif

# Installe les dépendances et lance les services en production
start_services:
	@echo "Starting MongoDB with Docker Compose..."
	docker-compose up -d
	@echo "Starting services..."
	npm install && npm start &

	@echo "Starting - Auth Service"
	cd services/auth && npm install && npm start &
	
	@echo "All services have been started."

# Commande pour le développement utilisant nodemon
dev: setup kill_all_node
	@echo "Starting MongoDB with Docker Compose..."
	docker-compose up -d
	@echo "Starting services with nodemon for development..."
	npm install && npx nodemon middleware.js &

	@echo "Starting - Auth Service with Nodemon"
	cd services/auth && npm install && npx nodemon authService.js &
	
	@echo "All services have been started in development mode."
