import parser from '../src/argparser';
import handleUserInput from '../src/main.js';
import * as lighthouseBadges from '../src/lighthouse-badges';

jest.mock('../src/lighthouse-badges');

describe('test index', () => {
  let stderrOutput = '';
  let parseMock;
  let processMock;
  const spinnerFake = { start: () => null, stop: () => null };
  const stderrWrite = process.stderr.write;
  const processExit = process.exit;

  beforeEach(() => {
    parseMock = jest.spyOn(parser, 'parse_args');
    processMock = jest.spyOn(lighthouseBadges, 'processParameters');
    process.stderr.write = (x) => {
      stderrOutput += `${x}\n`;
    };
    process.exit = () => {
    };
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

    await handleUserInput(spinnerFake);

    expect(parser.parse_args.mock.calls.length).toBe(1);
    expect(lighthouseBadges.processParameters.mock.calls.length).toBe(1);
    expect(stderrOutput).toBe('');
  });

  it('should handle parse errors gracefully', async () => {
    await handleUserInput(spinnerFake);
    expect(stderrOutput.includes('the following arguments are required: -u/--url')).toBe(true);
  });

  it('should handle processing errors gracefully', async () => {
    parseMock.mockReturnValue(['--url', 'https://example.org']);
    processMock.mockRejectedValue(new Error('Async error'));

    await handleUserInput(spinnerFake);
    expect(stderrOutput.includes('Error: Async error')).toBe(true);
  });
});
