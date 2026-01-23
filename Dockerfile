FROM oven/bun:alpine AS chrome-base

RUN apk --update --no-cache add \
    chromium \
    && rm -rf /var/cache/apk/* /tmp/*

FROM chrome-base AS app

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

LABEL maintainer="hello@mazzotta.me" \
    org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.name="Lighthouse Badges" \
    org.label-schema.description="Generate gh-badges (shields.io) based on lighthouse performance." \
    org.label-schema.url="https://github.com/emazzotta/lighthouse-badges" \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.vcs-url="https://github.com/emazzotta/lighthouse-badges" \
    org.label-schema.vendor="Emanuele Mazzotta" \
    org.label-schema.version=$VERSION \
    org.label-schema.schema-version="1.0"

WORKDIR /home/lighthouse

COPY dist/package.json dist/bun.lockb* ./
RUN bun install --frozen-lockfile && \
    rm -rf /root/.bun

COPY dist .

RUN BIN_DIR="/usr/local/bin" && \
    mkdir -p "$BIN_DIR" && \
    ln -sf "/home/lighthouse/src/index.js" "$BIN_DIR/lighthouse-badges" && \
    chmod +x "$BIN_DIR/lighthouse-badges"

ENV CHROME_PATH=/usr/bin/chromium-browser

RUN addgroup -S chrome && adduser -S -g chrome chrome \
    && mkdir -p /home/chrome/reports && chown -R chrome:chrome /home/chrome

VOLUME /home/chrome/reports
WORKDIR /home/chrome/reports

USER chrome
