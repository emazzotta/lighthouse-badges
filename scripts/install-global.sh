#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/../dist"
bun install -g .
