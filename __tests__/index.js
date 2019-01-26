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

    expect(parser.parseArgs.mock.calls.length).toBe(1);
    expect(lighthouseBadges.processParameters.mock.calls.length).toBe(1);
    expect(stderrOutput).toBe('');
  });


  it('should handle parse errors gracefully', async () => {
    await handleUserInput();
    expect(stderrOutput.includes('Argument "-u/--urls" is required')).toBe(true);
  });

  it('should handle processing errors gracefully', async () => {
    parseMock.mockReturnValue(['--urls', 'http://example.org']);
    processMock.mockRejectedValue(new Error('Async error'));

    await handleUserInput();
    expect(stderrOutput.includes('Error: Async error')).toBe(true);
  });
});
