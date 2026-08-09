SHELL := /bin/bash

COMPOSE := docker compose --env-file .env -f infra/docker-compose.dev.yml

.PHONY: up down ps config build

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

ps:
	$(COMPOSE) ps

config:
	$(COMPOSE) config --quiet

build:
	$(COMPOSE) build

rebuild-%:
	$(COMPOSE) build $*
	$(COMPOSE) up -d --no-deps $*

restart-%:
	$(COMPOSE) restart $*

stop-%:
	$(COMPOSE) stop $*

logs-%:
	$(COMPOSE) logs -f $*

build-%:
	$(COMPOSE) build $*
