#!/bin/sh
rm -rf src/fa
mkdir src/fa
pnpm svgr \
  --template "./component-template.jsx" \
  --no-index \
  --typescript \
  --filename-case kebab \
  --jsx-runtime automatic \
  --svg-props fill=currentColor --svg-props viewBox="0 0 24 24" \
  --out-dir "src/fa" \
  "vendor/fa"
