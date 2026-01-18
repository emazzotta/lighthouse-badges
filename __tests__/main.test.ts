import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import type { Spinner, ParsedArgs } from '../src/types';
import handleUserInput from '../src/main.js';

describe('test index', () => {
  let stderrOutput = '';
  const spinnerFake: Spinner = { start: () => null, stop: () => null };
  const stderrWrite = process.stderr.write;
  const processExit = process.exit;

  beforeEach(() => {
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
  });

  it('should invoke parse args and process parameters', async () => {
    const mockParseArgs = mock(() =>
      Promise.resolve({ url: 'https://example.org', single_badge: false, badge_style: 'flat', save_report: false } as ParsedArgs)
    );
    const mockProcessParameters = mock(() => Promise.resolve());

    await handleUserInput(spinnerFake, {
      parseArgs: mockParseArgs,
      processParameters: mockProcessParameters,
    });

    expect(mockParseArgs).toHaveBeenCalledTimes(1);
    expect(mockProcessParameters).toHaveBeenCalledTimes(1);
    expect(stderrOutput).toBe('');
  });

  it('should handle parse errors gracefully', async () => {
    const mockParseArgs = mock(() =>
      Promise.reject(new Error('the following arguments are required: -u/--url'))
    );

    await handleUserInput(spinnerFake, {
      parseArgs: mockParseArgs,
    });

    expect(stderrOutput.includes('the following arguments are required: -u/--url')).toBe(true);
  });

  it('should handle processing errors gracefully', async () => {
    const mockParseArgs = mock(() =>
      Promise.resolve({ url: 'https://example.org', single_badge: false, badge_style: 'flat', save_report: false } as ParsedArgs)
    );
    const mockProcessParameters = mock(() => Promise.reject(new Error('Async error')));

    await handleUserInput(spinnerFake, {
      parseArgs: mockParseArgs,
      processParameters: mockProcessParameters,
    });

    expect(stderrOutput.includes('Error: Async error')).toBe(true);
  });
});

