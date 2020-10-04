import { parser } from '../src/argparser';

describe('test argparser', () => {
  it('should return expected default values', () => {
    const actualArgs = parser.parse_args(['--urls', 'https://emanuelemazzotta.com', 'https://emanuelemazzotta.com/cv']);
    expect(actualArgs.single_badge).toBe(false);
    expect(actualArgs.badge_style).toBe('flat');
    expect(actualArgs.save_report).toBe(false);
    expect(actualArgs.urls).toStrictEqual(['https://emanuelemazzotta.com', 'https://emanuelemazzotta.com/cv']);
  });

  it('should overwrite values', () => {
    const actualArgs = parser.parse_args([
      '--single-badge',
      '--save-report',
      '--badge-style', 'flat-square',
      '--urls', 'https://emanuelemazzotta.com',
    ]);

    expect(actualArgs.single_badge).toBe(true);
    expect(actualArgs.badge_style).toBe('flat-square');
    expect(actualArgs.save_report).toBe(true);
    expect(actualArgs.urls).toStrictEqual(['https://emanuelemazzotta.com']);
  });
});
