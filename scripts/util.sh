#!/bin/bash
set -euo pipefail

readonly PACKAGE_NAMES=("@emazzotta/lighthouse-badges" "lighthouse-badges")

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
readonly PROJECT_ROOT

install_global() {
    cd "$PROJECT_ROOT/dist"
    bun install -g .
}

uninstall_global() {
    local name
    for name in "${PACKAGE_NAMES[@]}"; do
        bun uninstall -g "$name" 2>/dev/null || true
    done
}

publish_if_new() {
    local registry="${1:-}"
    if [ -z "$registry" ]; then
        echo "Usage: $(basename "$0") publish-if-new <registry>" >&2
        exit 1
    fi

    cd "$PROJECT_ROOT"
    local name version remote
    name=$(jq -r '.name' package.json)
    version=$(jq -r '.version' package.json)
    remote=$(npm show "$name" version 2>/dev/null || echo '')

    if [ "$remote" = "$version" ]; then
        echo "${name}@${version} already published to ${registry}"
        return 0
    fi

    echo "Publishing ${name}@${version} to ${registry}..."
    bun run ci:publish
}

usage() {
    cat >&2 <<EOF
Usage: $(basename "$0") <command> [args...]

Commands:
  install                    Install the built package globally via bun
  uninstall                  Uninstall all global lighthouse-badges packages
  publish-if-new <registry>  Publish to <registry> if version differs from remote
EOF
    exit 1
}

main() {
    local cmd="${1:-}"
    shift || true
    case "$cmd" in
        install)        install_global ;;
        uninstall)      uninstall_global ;;
        publish-if-new) publish_if_new "$@" ;;
        *)              usage ;;
    esac
}

main "$@"
