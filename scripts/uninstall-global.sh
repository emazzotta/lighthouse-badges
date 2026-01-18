#!/bin/bash
# Cross-package-manager global uninstallation script

set -e

# Try canonical uninstall methods first
if command -v npm >/dev/null 2>&1; then
  npm uninstall -g @emazzotta/lighthouse-badges lighthouse-badges 2>/dev/null || true
fi

if command -v yarn >/dev/null 2>&1; then
  yarn global remove @emazzotta/lighthouse-badges lighthouse-badges 2>/dev/null || true
fi

if command -v pnpm >/dev/null 2>&1; then
  pnpm remove -g @emazzotta/lighthouse-badges lighthouse-badges 2>/dev/null || true
fi

# Fallback: remove symlink manually
BIN_DIR=""
if command -v bun >/dev/null 2>&1; then
  BIN_DIR=$(bun pm bin -g 2>/dev/null || echo "")
elif command -v npm >/dev/null 2>&1; then
  BIN_DIR=$(npm bin -g 2>/dev/null || echo "")
fi

if [ -n "$BIN_DIR" ] && [ -f "$BIN_DIR/lighthouse-badges" ]; then
  rm -f "$BIN_DIR/lighthouse-badges"
  echo "Removed symlink from $BIN_DIR/lighthouse-badges"
fi
