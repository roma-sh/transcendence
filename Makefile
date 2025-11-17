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


# re only recreates the instance and keeps the DB
# to delete the database fclean and all is needed seperately to reset completely

.SILENT:

all: build up

build:
	if [ ! -f $(CHECKFILE) ]; then \
		echo "$(RED)Please set up the enviroment first !$(NC)" ;\
		echo "Please run 'make setup'"; \
		exit 1; \
	fi
	echo "$(BLUE)Building$(NC) . . ."
	docker compose -f $(COMPOSE) build

up:
	echo "$(GREEN)Starting$(NC) . . ."
	docker compose -f $(COMPOSE) up -d

down:
	echo "$(BLUE)Stopping$(NC) . . ."
	docker compose -f $(COMPOSE) down

re: down clean build up

clean: down
	echo "$(YELLOW)Cleaning chache$(NC) . . ."
	docker system prune -f

fclean: clean
	echo "$(RED)Cleaning everything now$(NC) . . ."
	docker compose -f $(COMPOSE) down -v
	rm -rf $(SSL_DIR)
	rm -rf $(ENV_FILE)
	rm -rf $(CHECKFILE)

logs:
	docker compose -f $(COMPOSE) logs --tail=150

logs-f:
	docker compose -f $(COMPOSE) logs -f --tail=150

setup:
	if [ ! -f $(ENV_FILE) ]; then \
		echo "POSTGRES_USER=" > $(ENV_FILE); \
		echo "POSTGRES_PASSWORD=" >> $(ENV_FILE); \
		echo "POSTGRES_DB=" >> $(ENV_FILE); \
		echo "DATABASE_URL=postgresql://<username>:<password>@database:5432/<database>?sslmode=disable" >> $(ENV_FILE); \
		echo "GF_SECURITY_ADMIN=" >> $(ENV_FILE); \
		echo "GF_SECURITY_ADMIN_PASSWORD=" >> $(ENV_FILE); \
		echo "DATA_SOURCE_NAME=postgresql://<username>:<password>@database:5432/<database>?sslmode=disable" >> $(ENV_FILE); \
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
