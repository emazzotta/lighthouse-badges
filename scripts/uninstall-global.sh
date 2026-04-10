#!/bin/bash
set -euo pipefail

bun uninstall -g @emazzotta/lighthouse-badges 2>/dev/null || true
bun uninstall -g lighthouse-badges 2>/dev/null || true
