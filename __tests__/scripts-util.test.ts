import { describe, it, expect, afterEach } from 'bun:test';
import fs from 'fs';
import os from 'os';
import path from 'path';

const UTIL_SCRIPT = path.join(import.meta.dir, '..', 'scripts', 'util.sh');
const PUBLISHED_VERSIONS = ['1.5.6', '1.5.7'];
const LATEST_VERSION = '1.5.7';

const NPM_STUB = `case "$1 $2" in
  "show lighthouse-badges"|"view lighthouse-badges") echo ${LATEST_VERSION} ;;
  ${PUBLISHED_VERSIONS.map((version) => `"view lighthouse-badges@${version}"`).join('|')}) echo "\${2#*@}" ;;
  *) exit 1 ;;
esac`;

const projects: string[] = [];

const createProject = (version: string, stubs: Readonly<Record<string, string>>): string => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lighthouse-badges-util-'));
  projects.push(root);
  fs.mkdirSync(path.join(root, 'scripts'));
  fs.mkdirSync(path.join(root, 'bin'));
  fs.copyFileSync(UTIL_SCRIPT, path.join(root, 'scripts', 'util.sh'));
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'lighthouse-badges', version }));
  for (const [command, body] of Object.entries(stubs)) {
    const stub = path.join(root, 'bin', command);
    fs.writeFileSync(stub, `#!/bin/sh\necho "${command} $*" >> "${root}/calls.log"\n${body}\n`);
    fs.chmodSync(stub, 0o755);
  }
  return root;
};

const runUtil = (root: string, ...args: string[]) =>
  Bun.spawnSync(['bash', path.join(root, 'scripts', 'util.sh'), ...args], {
    env: { ...process.env, PATH: `${path.join(root, 'bin')}:${process.env.PATH}` },
  });

const readCalls = (root: string): string[] => {
  const log = path.join(root, 'calls.log');
  return fs.existsSync(log) ? fs.readFileSync(log, 'utf8').trim().split('\n') : [];
};

describe('scripts/util.sh', () => {
  afterEach(() => {
    projects.splice(0).forEach((root) => fs.rmSync(root, { recursive: true, force: true }));
  });

  describe('publish-if-new', () => {
    it('should skip a version that is published but not the latest', () => {
      const root = createProject('1.5.6', { npm: NPM_STUB, bun: '' });

      const result = runUtil(root, 'publish-if-new', 'npm.js');

      expect(result.exitCode).toBe(0);
      expect(readCalls(root)).not.toContain('bun run ci:publish');
    });

    it('should skip the latest published version', () => {
      const root = createProject(LATEST_VERSION, { npm: NPM_STUB, bun: '' });

      const result = runUtil(root, 'publish-if-new', 'npm.js');

      expect(result.exitCode).toBe(0);
      expect(readCalls(root)).not.toContain('bun run ci:publish');
    });

    it('should publish a version the registry does not have', () => {
      const root = createProject('1.5.8', { npm: NPM_STUB, bun: '' });

      const result = runUtil(root, 'publish-if-new', 'npm.js');

      expect(result.exitCode).toBe(0);
      expect(readCalls(root)).toContain('bun run ci:publish');
    });
  });
});
