import { urlEscaper, zip, statusMessage } from '../src/util';

describe('test util', () => {
  describe('test pure functions in util', () => {
    it('should return escaped https url', () => {
      const actualUrl = 'https://abcöd%f&/?get=hi';
      const expectedUrl = 'abc_d_f___get_hi';
      expect(urlEscaper(actualUrl)).toBe(expectedUrl);
    });

    it('should return escaped http url', () => {
      const actualUrl = 'https://abcöd%f&/?get=hi';
      const expectedUrl = 'abc_d_f___get_hi';
      expect(urlEscaper(actualUrl)).toBe(expectedUrl);
    });

    it('should zip together two arrays', () => {
      const input = [[0, 1, 2, 3], [4, 5, 6, 7]];
      const expected = [[0, 4], [1, 5], [2, 6], [3, 7]];
      expect(zip(input)).toStrictEqual(expected);
    });
  });

  describe('test functions with side-effects in util', () => {
    let stdoutOutput = '';
    const stdoutWrite = process.stdout.write;

    beforeEach(() => {
      process.stdout.write = (x) => {
        stdoutOutput += x;
      };
      stdoutOutput = '';
    });

    afterEach(() => {
      process.stdout.write = stdoutWrite;
    });

    it('should write success message if no error', () => {
      const expectedSuccessMessage = 'success';
      statusMessage(expectedSuccessMessage, 'error', undefined);
      expect(stdoutOutput).toBe(expectedSuccessMessage);
    });

    it('should not write a success metric if error is thrown', () => {
      const expectedErrorMessage = 'error';
      expect(() => {
        statusMessage('success', expectedErrorMessage, 'error');
      }).toThrow(new Error(expectedErrorMessage));
      expect(stdoutOutput).toBe('');
    });
  });
});
