NAME	:= pong

all: $(NAME)

$(NAME):
	@echo compile ts files to js
	tsc --project ./scripts/tsconfig.json

rm:
	rm -rf ./scripts/js/*

.PHONY: all rm
