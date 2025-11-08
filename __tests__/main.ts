import { jest } from '@jest/globals';
import parser from '../src/argparser';
import type { Spinner } from '../src/types';

const mockProcessParameters = jest.fn<() => Promise<void>>();

jest.unstable_mockModule('../src/lighthouse-badges', () => ({
  processParameters: mockProcessParameters,
  calculateLighthouseMetrics: jest.fn(),
  processRawLighthouseResult: jest.fn(),
  metricsToSvg: jest.fn(),
  htmlReportsToFile: jest.fn(),
}));

const handleUserInput = (await import('../src/main.js')).default;

describe('test index', () => {
  let stderrOutput = '';
  let parseMock: ReturnType<typeof jest.spyOn>;
  const spinnerFake: Spinner = { start: () => null, stop: () => null };
  const stderrWrite = process.stderr.write;
  const processExit = process.exit;

  beforeEach(() => {
    parseMock = jest.spyOn(parser, 'parse_args');
    process.stderr.write = (x: string | Uint8Array) => {
      stderrOutput += `${x}\n`;
      return true;
    };
    process.exit = (() => {
      // Mock exit
    }) as typeof process.exit;
    stderrOutput = '';
  });

  afterEach(() => {
    process.stderr.write = stderrWrite;
    process.exit = processExit;
    parseMock.mockRestore();
  });

  it('should invoke parse args and process parameters', async () => {
    parseMock.mockReturnValue({ url: 'https://example.org', single_badge: false, badge_style: 'flat', save_report: false } as never);
    mockProcessParameters.mockResolvedValue(undefined);

    await handleUserInput(spinnerFake);

    expect(parser.parse_args).toHaveBeenCalledTimes(1);
    expect(mockProcessParameters).toHaveBeenCalledTimes(1);
    expect(stderrOutput).toBe('');
  });

  it('should handle parse errors gracefully', async () => {
    await handleUserInput(spinnerFake);
    expect(stderrOutput.includes('the following arguments are required: -u/--url')).toBe(true);
  });

  it('should handle processing errors gracefully', async () => {
    parseMock.mockReturnValue({ url: 'https://example.org', single_badge: false, badge_style: 'flat', save_report: false } as never);
    mockProcessParameters.mockRejectedValue(new Error('Async error'));

    await handleUserInput(spinnerFake);
    expect(stderrOutput.includes('Error: Async error')).toBe(true);
  });
});

