# Utilise ton fichier .env pour définir les variables d'environnement nécessaires
include .env
export

.PHONY: all setup start_services dev

# La commande par défaut qui sera exécutée quand tu lances 'make'
all: setup start_services

# Crée le fichier .env et génère le secret JWT si nécessaire
setup:
	@echo "Checking and updating JWT_SECRET in .env if necessary"
	@if grep -q "JWT_SECRET" .env; then \
		echo "JWT_SECRET exists in .env"; \
	else \
		echo "JWT_SECRET=$(shell openssl rand -base64 32)" >> .env; \
		echo "JWT_SECRET added to .env"; \
	fi

# Installe les dépendances et lance les services en production
start_services:
	@echo "KILLALL NODEJS PROCESS..."
	killall node || true

	@echo "Starting MongoDB with Docker Compose..."
	docker-compose up -d
	@echo "Starting services..."
	@echo "Starting - Middleware"
	npm install && npm start &

	@echo "Starting - Auth Service"
	cd services/auth && npm install && npm start &
	
	@echo "All services have been started."

# Commande pour le développement utilisant nodemon
dev: setup
	npm install -g nodemon
	@echo "Starting MongoDB with Docker Compose..."
	docker-compose up -d
	@echo "Starting services with nodemon for development..."
	@echo "Starting - Middleware with Nodemon"
	cd services/middleware && npm install && nodemon middleware.js &

	@echo "Starting - Auth Service with Nodemon"
	cd services/auth && npm install && nodemon authService.js &
	
	@echo "All services have been started in development mode."
