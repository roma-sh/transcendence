GREEN=\033[0;32m
BLUE=\033[0;34m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m

COMPOSE		= docker/docker-compose.yml
CHECKFILE	= .checkfile  
ENV_FILE	= docker/.env
SSL_DIR		= ./docker/proxy/certs
SSL_CERT	= $(SSL_DIR)/selfsigned.crt
SSL_KEY		= $(SSL_DIR)/selfsigned.key
GOINFRE_PATH = $(HOME)/goinfre/transcendence



# re only recreates the instance and keeps the DB
# to delete the database fclean and all is needed seperately to reset completely

.SILENT:

all: build up

build:
	if [ ! -f $(CHECKFILE) ]; then \
		echo "$(RED)Please set up the enviroment first !$(NC)" ; \
		echo "Please run 'make setup'"; \
		exit 1; \
	fi
	echo "$(BLUE)Installing backend dependencies (includes 2FA/JWT packages)...$(NC)"
	npm --prefix backend install
	echo "$(BLUE)Installing blockchain dependencies$(NC) . . ."
	npm --prefix blockchain install
	echo "$(BLUE)Compiling and deploying blockchain (Hardhat / Avalanche Fuji)...$(NC)"
	npm run chain:compile
	npm run chain:deploy:fuji
	echo "$(BLUE)Building$(NC) . . ."
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE) build

up:
	echo "$(GREEN)Starting$(NC) . . ."
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE) up -d

down:
	echo "$(BLUE)Stopping$(NC) . . ."
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE) down

re: down clean build up

clean: down
	echo "$(YELLOW)Cleaning chache$(NC) . . ."
	docker system prune -f

fclean: clean
	echo "$(RED)Cleaning everything now$(NC) . . ."
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE) down -v
	rm -rf $(SSL_DIR)
	rm -rf $(CHECKFILE)
	rm -rf $(GOINFRE_PATH)/db/*
	rm -rf $(GOINFRE_PATH)/grafana/*
	rm -rf $(GOINFRE_PATH)/prometheus/*

logs:
	docker compose -f $(COMPOSE) logs --tail=150

logs-f:
	docker compose -f $(COMPOSE) logs -f --tail=150

setup:
	echo "Creating project goinfre directories..."; \
	mkdir -p $(GOINFRE_PATH)/db; \
	mkdir -p $(GOINFRE_PATH)/grafana; \
	mkdir -p $(GOINFRE_PATH)/prometheus; \

	if [ ! -f $(ENV_FILE) ]; then \
		echo "#APPLICATION" >> $(ENV_FILE); \
		echo "GOINFRE_PATH=$(GOINFRE_PATH)" >> $(ENV_FILE); \
		echo "NODE_ENV=" >> $(ENV_FILE); \
		echo "PORT=" >> $(ENV_FILE); \
		echo "HOST=" >> $(ENV_FILE); \
		echo "DB_PATH=" >> $(ENV_FILE); \
		echo "ALLOWED_ORIGINS=" >> $(ENV_FILE); \
		echo "#SECURITY" >> $(ENV_FILE); \
		echo "SESSION_SECRET=<put 32 chars here>" >> $(ENV_FILE); \
		echo "API_KEY=" >> $(ENV_FILE); \
		echo "#GRAFANA" >> $(ENV_FILE); \
		echo "GF_SECURITY_ADMIN=" >> $(ENV_FILE); \
		echo "GF_SECURITY_ADMIN_PASSWORD=" >> $(ENV_FILE); \
		echo "#OAUTH" >> $(ENV_FILE); \
		echo "CLIENT_ID=" >> $(ENV_FILE); \
		echo "CLIENT_SECRET=" >> $(ENV_FILE); \
		echo "GOOGLE_REDIRECT_URL=" >> $(ENV_FILE); \
		echo "#BLOCKCHAIN" >> $(ENV_FILE); \
		echo "FUJI_RPC_URL=" >> $(ENV_FILE); \
		echo "PRIVATE_KEY=" >> $(ENV_FILE); \
		echo "Please fill out the env file :D"; \
	fi
	if [ ! -d $(SSL_DIR) ]; then \
		mkdir -p $(SSL_DIR); \
	fi
	if [ ! -f $(SSL_CERT) ] || [ ! -f $(SSL_KEY) ]; then \
		openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
			-keyout $(SSL_KEY) \
			-out $(SSL_CERT) \
			-subj "/CN=localhost"; \
	fi
	touch $(CHECKFILE)

.PHONY: all build up down re clean fclean db-reset logs logs-f setup
