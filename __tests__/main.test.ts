import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import type { Spinner, ParsedArgs, ProcessedLighthouseResult } from '../src/types';
import handleUserInput from '../src/main.js';

describe('handleUserInput', () => {
  let stderrOutput = '';
  let events: string[] = [];
  const spinnerFake: Spinner = {
    start: () => events.push('spinner.start'),
    stop: () => events.push('spinner.stop'),
  };
  const args: ParsedArgs = { url: 'https://example.org', single_badge: false, badge_style: 'flat', save_report: false };
  const result: ProcessedLighthouseResult = { metrics: { 'lighthouse performance': 100 }, report: { 'https://example.org': false } };
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
    events = [];
  });

  afterEach(() => {
    process.stderr.write = stderrWrite;
    process.exit = processExit;
  });

  it('should run lighthouse and save the artifacts', async () => {
    const parseArgs = mock(() => Promise.resolve(args));
    const calculateLighthouseMetrics = mock(() => Promise.resolve(result));
    const saveArtifacts = mock(() => Promise.resolve());

    await handleUserInput(spinnerFake, { parseArgs, calculateLighthouseMetrics, saveArtifacts });

    expect(parseArgs).toHaveBeenCalledTimes(1);
    expect(calculateLighthouseMetrics).toHaveBeenCalledTimes(1);
    expect(saveArtifacts).toHaveBeenCalledTimes(1);
    expect(stderrOutput).toBe('');
  });

  it('should stop the spinner before the artifacts are saved', async () => {
    const parseArgs = mock(() => Promise.resolve(args));
    const calculateLighthouseMetrics = mock(() => {
      events.push('calculate');
      return Promise.resolve(result);
    });
    const saveArtifacts = mock(() => {
      events.push('save');
      return Promise.resolve();
    });

    await handleUserInput(spinnerFake, { parseArgs, calculateLighthouseMetrics, saveArtifacts });

    expect(events).toEqual(['spinner.start', 'calculate', 'spinner.stop', 'save']);
  });

  it('should stop the spinner when lighthouse fails', async () => {
    const parseArgs = mock(() => Promise.resolve(args));
    const calculateLighthouseMetrics = mock(() => Promise.reject(new Error('Async error')));
    const saveArtifacts = mock(() => Promise.resolve());

    await handleUserInput(spinnerFake, { parseArgs, calculateLighthouseMetrics, saveArtifacts });

    expect(events).toEqual(['spinner.start', 'spinner.stop']);
    expect(saveArtifacts).not.toHaveBeenCalled();
    expect(stderrOutput.includes('Error: Async error')).toBe(true);
  });

  it('should handle parse errors gracefully', async () => {
    const parseArgs = mock(() => Promise.reject(new Error('the following arguments are required: -u/--url')));

    await handleUserInput(spinnerFake, { parseArgs });

    expect(stderrOutput.includes('the following arguments are required: -u/--url')).toBe(true);
  });
});
