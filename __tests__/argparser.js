import assert from 'assert';
import { parser } from '../src/argparser';


describe('test argparser', () => {
  it('should return expected default values', () => {
    const actualArgs = parser.parseArgs(['--urls', 'https://emanuelemazzotta.com', 'https://emanuelemazzotta.com/cv']);
    assert.equal(actualArgs.single_badge, false);
    assert.equal(actualArgs.badge_style, 'flat');
    assert.equal(actualArgs.save_report, false);
    assert.deepEqual(actualArgs.urls, ['https://emanuelemazzotta.com', 'https://emanuelemazzotta.com/cv']);
  });

  it('should overwrite values', () => {
    const actualArgs = parser.parseArgs([
      '--single-badge',
      '--save-report',
      '--badge-style', 'flat-square',
      '--urls', 'https://emanuelemazzotta.com',
    ]);

    assert.equal(actualArgs.single_badge, true);
    assert.equal(actualArgs.badge_style, 'flat-square');
    assert.equal(actualArgs.save_report, true);
    assert.deepEqual(actualArgs.urls, ['https://emanuelemazzotta.com']);
  });
});
