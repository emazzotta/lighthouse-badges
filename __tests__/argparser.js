import assert from 'assert';
import { parser } from '../lib/argparser';
import { objectAttributesToObject } from '../lib/util';


describe('test argparser', () => {
  it('should return expected default values', () => {
    const actualArgs = parser.parseArgs(['--urls', 'https://emanuelemazzotta.com', 'https://emanuelemazzotta.com/cv']);
    assert.deepEqual({
      single_badge: false,
      badge_style: 'flat',
      save_report: false,
      urls: [
        'https://emanuelemazzotta.com',
        'https://emanuelemazzotta.com/cv',
      ],
    }, objectAttributesToObject(actualArgs));
  });

  it('should overwrite values', () => {
    const actualArgs = parser.parseArgs([
      '--single-badge',
      '--save-report',
      '--badge-style', 'flat-square',
      '--urls', 'https://emanuelemazzotta.com',
    ]);
    assert.deepEqual({
      single_badge: true,
      badge_style: 'flat-square',
      save_report: true,
      urls: [
        'https://emanuelemazzotta.com',
      ],
    }, objectAttributesToObject(actualArgs));
  });
});
