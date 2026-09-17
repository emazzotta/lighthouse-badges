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
      const spinner = createSpinner('Running Lighthouse, please wait...', { write, intervalMs: FRAME_INTERVAL_MS });
      spinner.start();
      setTimeout(() => spinner.stop(), FRAME_INTERVAL_MS * 20);
    }, FRAME_INTERVAL_MS * 30);

    const frames = written.slice(0, -1);
    expect(frames.length).toBeGreaterThanOrEqual(6);
    expect(frames[0]).toBe('[0G  [96m◜ [90mRunning Lighthouse, please wait...[0m');
    expect(frames[1]).toBe('[0G  [96m◠ [90mRunning Lighthouse, please wait...[0m');
    expect(frames[6]).toBe(frames[0]);
  });

  it('should clear the line and stop drawing when stopped', async () => {
    const written = await collectFrames((write) => {
      const spinner = createSpinner('Running Lighthouse, please wait...', { write, intervalMs: FRAME_INTERVAL_MS });
      spinner.start();
      setTimeout(() => spinner.stop(), FRAME_INTERVAL_MS * 3);
    }, FRAME_INTERVAL_MS * 20);

    expect(written.at(-1)).toBe('[0G[2K');
    expect(written.length).toBeLessThan(10);
  });
});
