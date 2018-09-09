FROM node:10-alpine

MAINTAINER Emanuele Mazzotta <hello@mazzotta.me>

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

LABEL org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.name="Lighthouse Badges" \
    org.label-schema.description="Generate gh-badges (shields.io) based on lighthouse performance." \
    org.label-schema.url="https://github.com/emazzotta/lighthouse-badges" \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.vcs-url="https://github.com/emazzotta/lighthouse-badges" \
    org.label-schema.vendor="Emanuele Mazzotta" \
    org.label-schema.version=$VERSION \
    org.label-schema.schema-version="1.0"

# Update apk repositories & install chromium
RUN apk --no-cache add \
    chromium \
    ttf-freefont \
    && rm -rf /var/lib/apt/lists/* \
    /var/cache/apk/* \
    /usr/share/man \
    /tmp/* \
    /usr/lib/node_modules/npm/man \
    /usr/lib/node_modules/npm/doc \
    /usr/lib/node_modules/npm/html \
    /usr/lib/node_modules/npm/scripts

# Add lighthouse
RUN mkdir -p /home/lighthouse
WORKDIR /home/lighthouse
COPY bin /home/lighthouse/bin
COPY lib /home/lighthouse/lib
COPY assets /home/lighthouse/assets
COPY package.json /home/lighthouse/package.json
RUN npm i -g .

# Add Chrome as a user
RUN addgroup -S chrome && adduser -S -g chrome chrome \
    && mkdir -p /home/chrome/reports && chown -R chrome:chrome /home/chrome

# Some place we can mount and view lighthouse reports
VOLUME /home/chrome/reports
WORKDIR /home/chrome/reports

# Run Chrome non-privileged
USER chrome
