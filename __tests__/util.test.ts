import { describe, it, expect } from 'bun:test';
import { urlEscaper } from '../src/util';

describe('urlEscaper', () => {
  it('should strip the https scheme and replace non-alphanumerics', () => {
    expect(urlEscaper('https://abcöd%f&/?get=hi')).toBe('abc_d_f___get_hi');
  });

  it('should strip the http scheme and replace non-alphanumerics', () => {
    expect(urlEscaper('http://abcöd%f&/?get=hi')).toBe('abc_d_f___get_hi');
  });

  it('should lowercase the result', () => {
    expect(urlEscaper('HTTPS://Example.COM/Path')).toBe('example_com_path');
  });
});
