import assert from 'assert';
import { urlEscaper, zip } from '../lib/util';


describe('test util', () => {
  it('should return escaped https url', () => {
    const actualUrl = 'https://abcöd%f&/?get=hi';
    const expectedUrl = 'abc_d_f___get_hi';
    assert.equal(urlEscaper(actualUrl), expectedUrl);
  });

  it('should return escaped http url', () => {
    const actualUrl = 'http://abcöd%f&/?get=hi';
    const expectedUrl = 'abc_d_f___get_hi';
    assert.equal(urlEscaper(actualUrl), expectedUrl);
  });

  it('should zip together two arrays', () => {
    const input = [[0, 1, 2, 3], [4, 5, 6, 7]];
    const expected = [[0, 4], [1, 5], [2, 6], [3, 7]];
    assert.deepEqual(zip(input), expected);
  });
});
