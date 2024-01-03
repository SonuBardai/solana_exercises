NPM := $(shell which npm)
PYTHON := $(shell which python3)

build:
	$(NPM) run build

serve:
	$(PYTHON) server.py

run: build serve
