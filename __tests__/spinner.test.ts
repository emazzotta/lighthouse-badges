import { describe, it, expect } from 'bun:test';
import { createSpinner } from '../src/spinner';

const FRAME_INTERVAL_MS = 5;

const collectFrames = async (spin: (write: (text: string) => void) => void, waitMs: number): Promise<string[]> => {
  const written: string[] = [];
  spin((text) => { written.push(text); });
  await Bun.sleep(waitMs);
  return written;
};

describe('spinner', () => {
  it('should draw the message behind a cycling glyph on the same line', async () => {
    const written = await collectFrames((write) => {
      const spinner = createSpinner('Running Lighthouse, please wait...', { write, intervalMs: FRAME_INTERVAL_MS, isTTY: true });
      spinner.start();
      setTimeout(() => spinner.stop(), FRAME_INTERVAL_MS * 20);
    }, FRAME_INTERVAL_MS * 30);

    const frames = written.slice(0, -1);
    expect(frames.length).toBeGreaterThanOrEqual(6);
    expect(frames[0]).toBe('\x1b[0G  \x1b[96m◜ \x1b[90mRunning Lighthouse, please wait...\x1b[0m');
    expect(frames[1]).toBe('\x1b[0G  \x1b[96m◠ \x1b[90mRunning Lighthouse, please wait...\x1b[0m');
    expect(frames[6]).toBe(frames[0]);
  });

  it('should clear the line and stop drawing when stopped', async () => {
    const written = await collectFrames((write) => {
      const spinner = createSpinner('Running Lighthouse, please wait...', { write, intervalMs: FRAME_INTERVAL_MS, isTTY: true });
      spinner.start();
      setTimeout(() => spinner.stop(), FRAME_INTERVAL_MS * 3);
    }, FRAME_INTERVAL_MS * 20);

    expect(written.at(-1)).toBe('\x1b[0G\x1b[2K');
    expect(written.length).toBeLessThan(10);
  });

  it('should write nothing when the output is not a terminal', async () => {
    const written = await collectFrames((write) => {
      const spinner = createSpinner('Running Lighthouse, please wait...', { write, intervalMs: FRAME_INTERVAL_MS, isTTY: false });
      spinner.start();
      setTimeout(() => spinner.stop(), FRAME_INTERVAL_MS * 5);
    }, FRAME_INTERVAL_MS * 10);

    expect(written).toEqual([]);
  });
});
