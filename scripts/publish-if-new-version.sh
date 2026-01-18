#!/bin/bash
set -euo pipefail

validate_arguments() {
    local registry_name="${1:-}"

    if [ -z "$registry_name" ]; then
        echo "Usage: $(basename "$0") <registry-name>" >&2
        exit 1
    fi
}

extract_package_name() {
    jq -r '.name' package.json
}

extract_current_version() {
    jq -r '.version' package.json
}

fetch_registry_version() {
    local package_name="$1"
    npm show "$package_name" version 2>/dev/null || echo ''
}

version_already_published() {
    local registry_version="$1"
    local current_version="$2"

    [ "$registry_version" = "$current_version" ]
}

publish_package() {
    local package_name="$1"
    local current_version="$2"
    local registry_name="$3"

    echo "Publishing ${package_name}@${current_version} to ${registry_name}..."
    bun run ci:publish
}

main() {
    local registry_name="$1"

    validate_arguments "$registry_name"

    local package_name current_version registry_version
    package_name=$(extract_package_name)
    current_version=$(extract_current_version)
    registry_version=$(fetch_registry_version "$package_name")

    if version_already_published "$registry_version" "$current_version"; then
        echo "Current version ${current_version} already published to ${registry_name}"
        exit 0
    fi

    publish_package "$package_name" "$current_version" "$registry_name"
}

main "$@"
