PROGRAM_NAME ?= helloworld_program

CARGO := $(shell which cargo)
CARGO_TOML_PATH ?= ./Cargo.toml
OUT_PATH ?= dist/program

SOLANA := $(shell which solana)

build:
	$(CARGO) build-bpf --manifest-path=${CARGO_TOML_PATH} --bpf-out-dir=${OUT_PATH}

deploy:
	$(SOLANA) program deploy ./${OUT_PATH}/${PROGRAM_NAME}.so
