#!/bin/bash
set -euo pipefail

main() {
    local registry_name="${1:-}"

    if [ -z "$registry_name" ]; then
        echo "Usage: $(basename "$0") <registry-name>" >&2
        exit 1
    fi

    local package_name current_version registry_version
    package_name=$(jq -r '.name' package.json)
    current_version=$(jq -r '.version' package.json)
    registry_version=$(npm show "$package_name" version 2>/dev/null || echo '')

    if [ "$registry_version" = "$current_version" ]; then
        echo "${package_name}@${current_version} already published to ${registry_name}"
        exit 0
    fi

    echo "Publishing ${package_name}@${current_version} to ${registry_name}..."
    bun run ci:publish
}

main "$@"
