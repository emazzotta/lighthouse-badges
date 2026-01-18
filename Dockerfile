FROM oven/bun:alpine

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

RUN apk --update --no-cache add chromium && \
    mkdir -p /home/lighthouse

# Add lighthouse
COPY dist /home/lighthouse/
WORKDIR /home/lighthouse

# Install dependencies and global binary
RUN bun install . && \
    (bun install -g . 2>/dev/null || \
     (BIN_DIR=$(bun pm bin -g) && \
      mkdir -p "$BIN_DIR" && \
      ln -sf "/home/lighthouse/src/index.js" "$BIN_DIR/lighthouse-badges" && \
      chmod +x "$BIN_DIR/lighthouse-badges")) && \
    rm -rf /root/.bun

# Set Chromium bin path
ENV CHROME_PATH=/usr/bin/chromium-browser

# Add Chrome as a user
RUN addgroup -S chrome && adduser -S -g chrome chrome \
    && mkdir -p /home/chrome/reports && chown -R chrome:chrome /home/chrome

# Some place we can mount and view lighthouse reports
VOLUME /home/chrome/reports
WORKDIR /home/chrome/reports

# Run Chrome non-privileged
USER chrome
