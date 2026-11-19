FROM oven/bun:1.4.4-alpine

RUN apk --update --no-cache add chromium && \
    mkdir -p /home/lighthouse

WORKDIR /home/lighthouse

COPY dist/package.json dist/bun.lock ./
RUN bun install --frozen-lockfile --production && \
    rm -rf /root/.bun

COPY dist .

RUN BIN_DIR="/usr/local/bin" && \
    mkdir -p "$BIN_DIR" && \
    ln -sf "/home/lighthouse/src/index.js" "$BIN_DIR/lighthouse-badges" && \
    chmod +x "$BIN_DIR/lighthouse-badges"

ENV CHROME_PATH=/usr/bin/chromium-browser \
    LIGHTHOUSE_BADGES_DISABLE_SANDBOX=true

RUN addgroup -S chrome && adduser -S -g chrome chrome \
    && mkdir -p /home/chrome/reports && chown -R chrome:chrome /home/chrome

VOLUME /home/chrome/reports
WORKDIR /home/chrome/reports

USER chrome

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

LABEL org.opencontainers.image.title="Lighthouse Badges" \
    org.opencontainers.image.description="Generate gh-badges (shields.io) based on lighthouse performance." \
    org.opencontainers.image.url="https://github.com/emazzotta/lighthouse-badges" \
    org.opencontainers.image.source="https://github.com/emazzotta/lighthouse-badges" \
    org.opencontainers.image.vendor="Emanuele Mazzotta" \
    org.opencontainers.image.authors="hello@mazzotta.me" \
    org.opencontainers.image.licenses="MIT" \
    org.opencontainers.image.created=$BUILD_DATE \
    org.opencontainers.image.revision=$VCS_REF \
    org.opencontainers.image.version=$VERSION
