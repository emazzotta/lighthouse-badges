#!/bin/bash
set -euo pipefail

detect_package_manager() {
    for manager in npm bun yarn pnpm; do
        if command -v "$manager" &>/dev/null; then
            echo "$manager"
            return 0
        fi
    done
    return 1
}

install_with_package_manager() {
    local manager="$1"

    case "$manager" in
        npm)
            npm install -g .
            ;;
        bun)
            bun install -g . 2>/dev/null
            ;;
        yarn)
            yarn global add .
            ;;
        pnpm)
            pnpm add -g .
            ;;
        *)
            return 1
            ;;
    esac
}

determine_global_bin_directory() {
    local bin_dir=""

    if command -v bun &>/dev/null; then
        bin_dir=$(bun pm bin -g 2>/dev/null || echo "")
    elif command -v npm &>/dev/null; then
        bin_dir=$(npm bin -g 2>/dev/null || echo "")
    fi

    echo "$bin_dir"
}

install_via_symlink() {
    local bin_dir
    bin_dir=$(determine_global_bin_directory)

    if [ -z "$bin_dir" ]; then
        echo "Error: Could not determine global bin directory" >&2
        exit 1
    fi

    mkdir -p "$bin_dir"
    ln -sf "$(pwd)/src/index.js" "$bin_dir/lighthouse-badges"
    chmod +x "$bin_dir/lighthouse-badges"
    echo "Installed via symlink to $bin_dir/lighthouse-badges"
}

main() {
    cd dist

    local manager
    if manager=$(detect_package_manager); then
        echo "Installing with $manager..."
        install_with_package_manager "$manager"
    else
        echo "No package manager found, using manual symlink..."
        install_via_symlink
    fi
}

main
