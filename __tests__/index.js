import assert from 'assert';
import { parser } from '../lib/argparser';
import { handleUserInput } from '../bin';
import * as lighthouseBadges from '../lib/lighthouse-badges';

jest.mock('../lib/lighthouse-badges');

describe('test index', () => {
  let stdoutOutput = '';
  let stderrOutput = '';
  let parseMock;
  let processMock;
  const stdoutWrite = process.stdout.write;
  const stderrWrite = process.stderr.write;

  beforeEach(() => {
    parseMock = jest.spyOn(parser, 'parseArgs');
    processMock = jest.spyOn(lighthouseBadges, 'processParameters');
    process.stdout.write = (x) => {
      stdoutOutput += `${x}\n`;
    };
    process.stderr.write = (x) => {
      stderrOutput += `${x}\n`;
    };
    stdoutOutput = '';
    stderrOutput = '';
  });

  afterEach(() => {
    process.stdout.write = stdoutWrite;
    process.stderr.write = stderrWrite;
    parseMock.mockRestore();
    processMock.mockRestore();
  });

  it('should invoke parse args and process parameters', async () => {
    parseMock.mockReturnValue(undefined);
    processMock.mockReturnValue(undefined);

    await handleUserInput();

    assert.equal(parser.parseArgs.mock.calls.length, 1);
    assert.equal(lighthouseBadges.processParameters.mock.calls.length, 1);
    assert.equal(stdoutOutput !== '', true);
  });


  it('should handle parse errors gracefully', async () => {
    await handleUserInput();
    assert.equal(stdoutOutput === '', true);
    assert.equal(stderrOutput.includes('Argument "-u/--urls" is required\n\n\n'), true);
  });

  it('should handle processing errors gracefully', async () => {
    parseMock.mockReturnValue(['--urls', 'http://example.org']);
    processMock.mockRejectedValue(new Error('Async error'));

    await handleUserInput();
    assert.equal(stdoutOutput === '', true);
    assert.equal(stderrOutput, 'Error: Async error\n\n');
  });
});
