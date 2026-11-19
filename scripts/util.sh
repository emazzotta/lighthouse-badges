#!/bin/bash
set -euo pipefail

readonly PACKAGE_NAMES=("@emazzotta/lighthouse-badges" "lighthouse-badges")

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
readonly PROJECT_ROOT

package_field() {
    jq -r ".$1" "$PROJECT_ROOT/package.json"
}

install_global() {
    cd "$PROJECT_ROOT/dist"
    bun link
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
    local name version published
    name=$(package_field name)
    version=$(package_field version)
    published=$(npm view "${name}@${version}" version 2>/dev/null || echo '')

    if [ "$published" = "$version" ]; then
        echo "${name}@${version} already published to ${registry}"
        return 0
    fi

    echo "Publishing ${name}@${version} to ${registry}..."
    bun run ci:publish
}

docker_tags() {
    local image="${1:-}"
    if [ -z "$image" ]; then
        echo "Usage: $(basename "$0") docker-tags <image>" >&2
        exit 1
    fi

    local version
    version=$(package_field version)
    echo "${image}:latest"
    echo "${image}:$(git -C "$PROJECT_ROOT" rev-parse --short HEAD)"
    if ! docker buildx imagetools inspect "${image}:${version}" >/dev/null 2>&1; then
        echo "${image}:${version}"
    fi
}

usage() {
    cat >&2 <<EOF
Usage: $(basename "$0") <command> [args...]

Commands:
  install                    Install the built package globally via bun
  uninstall                  Uninstall all global lighthouse-badges packages
  publish-if-new <registry>  Publish to <registry> unless it already has this version
  docker-tags <image>        Print the image tags to push; the version tag only if new
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
        docker-tags)    docker_tags "$@" ;;
        *)              usage ;;
    esac
}

main "$@"
