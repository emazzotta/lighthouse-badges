import parser from '../src/argparser';

describe('test argparser', () => {
  const baseUrl = 'https://emanuelemazzotta.com';

  it('should return expected default values', () => {
    const actualArgs = parser.parse_args(['--urls', baseUrl, `${baseUrl}/cv`]);
    expect(actualArgs.single_badge).toBe(false);
    expect(actualArgs.badge_style).toBe('flat');
    expect(actualArgs.save_report).toBe(false);
    expect(actualArgs.urls).toStrictEqual([baseUrl, `${baseUrl}/cv`]);
  });

  it('should overwrite values', () => {
    const actualArgs = parser.parse_args([
      '--single-badge',
      '--save-report',
      '--badge-style', 'flat-square',
      '--urls', baseUrl,
    ]);

    expect(actualArgs.single_badge).toBe(true);
    expect(actualArgs.badge_style).toBe('flat-square');
    expect(actualArgs.save_report).toBe(true);
    expect(actualArgs.urls).toStrictEqual([baseUrl]);
  });
});
