FROM debian:sid

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

# Install deps + add Chrome Stable + purge all the things
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    --no-install-recommends \
  && curl -sSL https://deb.nodesource.com/setup_8.x | bash - \
  && curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update && apt-get install -y \
    google-chrome-stable \
    nodejs \
    --no-install-recommends \
  && npm --global install yarn \
  && apt-get purge --auto-remove -y curl gnupg \
  && rm -rf /var/lib/apt/lists/*

ARG CACHEBUST=1
RUN yarn global add lighthouse-badges

# Add Chrome as a user
RUN groupadd -r chrome && useradd -r -g chrome -G audio,video chrome \
    && mkdir -p /home/chrome/reports && chown -R chrome:chrome /home/chrome

# some place we can mount and view lighthouse reports
VOLUME /home/chrome/reports
WORKDIR /home/chrome/reports

# Run Chrome non-privileged
USER chrome

# Drop to cli
CMD ["/bin/bash"]
