# Code Guidelines

## Versioning

- Any commit that changes `version` in `package.json` must be tagged with that exact version.
- Tags are lightweight and carry no `v` prefix: `1.5.6`, not `v1.5.6`.
- Tag the commit that contains the bump, not a later one: `git tag 1.5.6 <sha>`.
- Pushing the version bump to `master` cuts the release: every master push runs the `npm-publish` job, which publishes any version the registries do not have yet. Never push a version bump without explicit confirmation. A tag push starts no CI run.
