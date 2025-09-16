GREEN=\033[0;32m
BLUE=\033[0;34m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m

COMPOSE = docker/docker-compose.yml
DB_DIR = /goinfre/$USER/ft_transcendence/db_data

# re only recreates the instance and keeps the DB
# to delete the database fclean and all is needed seperately to reset completely
# db-reset only resets the database

.SILENT:

all: setup build up

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
	docker volume prune -f
	rm -rf $(DB_DIR)
	$(MAKE) setup

db-reset: down
	rm -rf $(DB_DIR)
	docker volume prune -f
	$(MAKE) setup
	echo "$(RED)Database reset !$(NC)"

logs:
	docker compose -f $(COMPOSE) logs --tail=150

logs-f:
	docker compose -f $(COMPOSE) logs -f --tail=150

setup:
	mkdir -p $(DB_DIR)

.PHONY: all build up down re clean fclean db-reset logs logs-f setup
