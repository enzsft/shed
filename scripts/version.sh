#!/bin/sh

pnpm changeset version
pnpm install --lockfile-only
