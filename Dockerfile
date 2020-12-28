FROM node:15.5-alpine

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

# Update apk repositories & install chromium
RUN apk --update --no-cache add chromium

RUN mkdir -p /home/lighthouse
WORKDIR /home/lighthouse

# Add lighthouse
COPY src /home/lighthouse/src
COPY package.json /home/lighthouse/package.json
RUN npm install . && npm link && rm -rf /root/.npm

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
