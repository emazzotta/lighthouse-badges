#!/bin/bash
set -euo pipefail

readonly PACKAGE_NAMES=("@emazzotta/lighthouse-badges" "lighthouse-badges")

uninstall_with_npm() {
    if command -v npm &>/dev/null; then
        npm uninstall -g "${PACKAGE_NAMES[@]}" 2>/dev/null || true
    fi
}

uninstall_with_yarn() {
    if command -v yarn &>/dev/null; then
        yarn global remove "${PACKAGE_NAMES[@]}" 2>/dev/null || true
    fi
}

uninstall_with_pnpm() {
    if command -v pnpm &>/dev/null; then
        pnpm remove -g "${PACKAGE_NAMES[@]}" 2>/dev/null || true
    fi
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

remove_symlink() {
    local bin_dir
    bin_dir=$(determine_global_bin_directory)

    if [ -n "$bin_dir" ] && [ -f "$bin_dir/lighthouse-badges" ]; then
        rm -f "$bin_dir/lighthouse-badges"
        echo "Removed symlink from $bin_dir/lighthouse-badges"
    fi
}

main() {
    uninstall_with_npm
    uninstall_with_yarn
    uninstall_with_pnpm
    remove_symlink
}

main
