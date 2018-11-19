import assert from 'assert';
import { parser } from '../src/argparser';
import { handleUserInput } from '../src/index';
import * as lighthouseBadges from '../src/lighthouse-badges';

jest.mock('../src/lighthouse-badges');

describe('test index', () => {
  let stderrOutput = '';
  let parseMock;
  let processMock;
  const stderrWrite = process.stderr.write;
  const processExit = process.exit;

  beforeEach(() => {
    parseMock = jest.spyOn(parser, 'parseArgs');
    processMock = jest.spyOn(lighthouseBadges, 'processParameters');
    process.stderr.write = (x) => {
      stderrOutput += `${x}\n`;
    };
    process.exit = () => {};
    stderrOutput = '';
  });

  afterEach(() => {
    process.stderr.write = stderrWrite;
    process.exit = processExit;
    parseMock.mockRestore();
    processMock.mockRestore();
  });

  it('should invoke parse args and process parameters', async () => {
    parseMock.mockReturnValue(undefined);
    processMock.mockReturnValue(undefined);

    await handleUserInput();

    assert.equal(parser.parseArgs.mock.calls.length, 1);
    assert.equal(lighthouseBadges.processParameters.mock.calls.length, 1);
    assert.equal(stderrOutput, '');
  });


  it('should handle parse errors gracefully', async () => {
    await handleUserInput();
    assert.equal(stderrOutput.includes('Argument "-u/--urls" is required'), true);
  });

  it('should handle processing errors gracefully', async () => {
    parseMock.mockReturnValue(['--urls', 'http://example.org']);
    processMock.mockRejectedValue(new Error('Async error'));

    await handleUserInput();
    assert.equal(stderrOutput.includes('Error: Async error'), true);
  });
});
