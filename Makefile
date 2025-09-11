# Add better messages maybe with some color :)

COMPOSE = docker/docker-compose.yml

#silent

#all

build:
	echo "Building . . ."
	docker-compose -f $(COMPOSE) build

up:
	echo "Starting . . ."#
	docker-compose -f $(COMPOSE) up -d

down:
	echo "Stopping . . ."#
	docker-compose -f $(COMPOSE) down

#re

logs:
	docker-compose -f $(COMPOSE) logs -f --tail=150

clean:
	echo "Cleaning . . ."
	docker system prune -f

setup:
	mkdir -p /goinfre/$USER/ft_transcendence/db_data

#fclean