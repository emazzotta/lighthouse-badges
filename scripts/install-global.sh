#!/bin/bash
# Cross-package-manager global installation script
# Tries canonical methods first, falls back to manual symlink if needed

set -e

cd dist

# Detect package manager and use canonical method
if command -v npm >/dev/null 2>&1; then
  echo "Installing with npm..."
  npm install -g . && exit 0
fi

if command -v bun >/dev/null 2>&1; then
  echo "Installing with bun..."
  bun install -g . 2>/dev/null && exit 0
fi

if command -v yarn >/dev/null 2>&1; then
  echo "Installing with yarn..."
  yarn global add . && exit 0
fi

if command -v pnpm >/dev/null 2>&1; then
  echo "Installing with pnpm..."
  pnpm add -g . && exit 0
fi

# Fallback: manual symlink creation
echo "No package manager found, using manual symlink..."
BIN_DIR=""
if command -v bun >/dev/null 2>&1; then
  BIN_DIR=$(bun pm bin -g 2>/dev/null || echo "")
elif command -v npm >/dev/null 2>&1; then
  BIN_DIR=$(npm bin -g 2>/dev/null || echo "")
fi

if [ -n "$BIN_DIR" ]; then
  mkdir -p "$BIN_DIR"
  ln -sf "$(pwd)/src/index.js" "$BIN_DIR/lighthouse-badges"
  chmod +x "$BIN_DIR/lighthouse-badges"
  echo "Installed via symlink to $BIN_DIR/lighthouse-badges"
  exit 0
fi

echo "Error: Could not determine global bin directory"
exit 1
