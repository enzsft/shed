#!/bin/sh

find . -name node_modules | xargs rm -rf
find . -name coverage | xargs rm -rf
find . -name dist | xargs rm -rf
find . -name storybook-static | xargs rm -rf
find . -name .turbo | xargs rm -rf
find . -name tsconfig.types.tsbuildinfo | xargs rm -rf
