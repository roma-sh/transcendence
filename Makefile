GREEN=\033[0;32m
BLUE=\033[0;34m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m

COMPOSE = docker/docker-compose.yml
SECRETS_DIR = ./docker/secrets
SECRETS_CHECKFILE = $(SECRETS_DIR)/.check
SSL_DIR =./docker/proxy/certs
SSL_CERT = $(SSL_DIR)/selfsigned.crt
SSL_KEY = $(SSL_DIR)/selfsigned.key


# re only recreates the instance and keeps the DB
# to delete the database fclean and all is needed seperately to reset completely
# db-reset only resets the database

.SILENT:

all: build up

build:
	echo "$(BLUE)Building$(NC) . . ."
	docker compose -f $(COMPOSE) build

up:
	echo "$(GREEN)Starting$(NC) . . ."#
	docker compose -f $(COMPOSE) up -d

down:
	echo "$(BLUE)Stopping$(NC) . . ."#
	docker compose -f $(COMPOSE) down

re: down clean build up

clean: down
	echo "$(YELLOW)Cleaning chache$(NC) . . ."
	docker system prune -f

fclean: clean
	echo "$(RED)Cleaning everything now$(NC) . . ."
	docker compose -f $(COMPOSE) down -v

db-reset: down
	echo "$(RED)Database reset !$(NC)"
	docker volume rm -f ft_transcendence_postgres_data || true

logs:
	docker compose -f $(COMPOSE) logs --tail=150

logs-f:
	docker compose -f $(COMPOSE) logs -f --tail=150

setup: # add deletion for fclean
	if [ ! -d $(SECRETS_DIR) ]; then \
		mkdir -p $(SECRETS_DIR);
	fi

	if [ ! -f $(SECRETS_CHECKFILE) ]; then \
		touch $(SECRETS_DIR)/POSTGRES_USER.txt; \
		touch $(SECRETS_DIR)/POSTGRES_PASSWORD.txt; \
		touch $(SECRETS_DIR)/POSTGRES_DB.txt; \
		touch $(SECRETS_DIR)/GRAFANA_ADMIN_USER.txt; \
		touch $(SECRETS_DIR)/GRAFANA_ADMIN_PASSWORD.txt; \
		echo "postgresql://<username>:<password>@<host>:5432/<database>?sslmode=disable" > $(SECRETS_DIR)/POSTGRES_EXPORTER_DATASOURCE.txt; \
		echo "please fill the postgres exporter datasource with the accordingly"; \
		echo "checkfile created"; \
		touch $(SECRETS_CHECKFILE); \
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


.PHONY: all build up down re clean fclean db-reset logs logs-f setup
