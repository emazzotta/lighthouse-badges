import { describe, it, expect } from 'bun:test';
import { urlEscaper } from '../src/util';

describe('urlEscaper', () => {
  it('strips the https scheme and replaces non-alphanumerics', () => {
    expect(urlEscaper('https://abcöd%f&/?get=hi')).toBe('abc_d_f___get_hi');
  });

  it('strips the http scheme and replaces non-alphanumerics', () => {
    expect(urlEscaper('http://abcöd%f&/?get=hi')).toBe('abc_d_f___get_hi');
  });

  it('lowercases the result', () => {
    expect(urlEscaper('HTTPS://Example.COM/Path')).toBe('example_com_path');
  });
});
