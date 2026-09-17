import { describe, it, expect } from 'bun:test';
import { parseArgs } from '../src/argparser';

describe('parseArgs', () => {
  const baseUrl = 'https://emanuelemazzotta.com';

  it('should apply the default values', () => {
    const actualArgs = parseArgs(['--url', baseUrl]);
    expect(actualArgs.single_badge).toBe(false);
    expect(actualArgs.badge_style).toBe('flat');
    expect(actualArgs.save_report).toBe(false);
    expect(actualArgs.url).toStrictEqual(baseUrl);
  });

  it('should take the values given on the command line', () => {
    const actualArgs = parseArgs([
      '--single-badge',
      '--save-report',
      '--badge-style', 'flat-square',
      '--url', baseUrl,
    ]);

    expect(actualArgs.single_badge).toBe(true);
    expect(actualArgs.badge_style).toBe('flat-square');
    expect(actualArgs.save_report).toBe(true);
    expect(actualArgs.url).toStrictEqual(baseUrl);
  });
});

