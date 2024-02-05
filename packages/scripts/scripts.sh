#!/bin/bash

# get directory of script

CONFIGS_DIR="$(git rev-parse --show-toplevel)/configs"

# get command to execute and the args to forward args

COMMAND="$1"
shift
ARGS="$@"

# switch through commands
case "$COMMAND" in
  "build-esm")
    pnpm swc ./src -d ./dist/esm --strip-leading-paths --config-file="$CONFIGS_DIR/swc-esm/.swcrc" $ARGS
    ;;
  "build-cjs")
    pnpm swc ./src -d ./dist/cjs --strip-leading-paths --config-file="$CONFIGS_DIR/swc-cjs/.swcrc" $ARGS
    ;;
  "generate-types")
    pnpm tsc -p ./tsconfig.types.json $ARGS
    ;;
  "build-library")
    pnpm scripts build-esm && pnpm scripts build-cjs && pnpm scripts generate-types
    ;;
  "test")
    pnpm jest --config "$CONFIGS_DIR/jest.config.js" $ARGS
    ;;
  "typecheck")
    pnpm tsc -p "$CONFIGS_DIR/tsconfig.json" --noEmit $ARGS
    ;;
  *)
    cat << EOF
usage: Usage: scripts [command] [args?]

commands:
  build-esm        Build the library in ESM format, args are passed directly to swc
  build-cjs        Build the library in CJS format, args are passed directly to swc
  generate-types   Generate types, args are passed directly to tsc
  build-library    Build the library in both ESM and CJS formats with types
  test             Run tests, args are passed directly to jest
  typecheck        Run typecheck, args are passed directly to tsc
EOF
    ;;
esac
