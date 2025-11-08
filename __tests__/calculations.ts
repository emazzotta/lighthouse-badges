import { getAverageScore, getSquashedScore, percentageToColor } from '../src/calculations';

describe('calculations', () => {
  describe('percentageToColor', () => {
    it('should return brightgreen for very high number', () => {
      expect(percentageToColor(97)).toBe('brightgreen');
    });

    it('should return green for high number', () => {
      expect(percentageToColor(92)).toBe('green');
    });

    it('should return yellowgreen for medium high number', () => {
      expect(percentageToColor(85)).toBe('yellowgreen');
    });

    it('should return yellow for medium number', () => {
      expect(percentageToColor(62)).toBe('yellow');
    });

    it('should return orange for low number', () => {
      expect(percentageToColor(45)).toBe('orange');
    });

    it('should return red for very low number', () => {
      expect(percentageToColor(23)).toBe('red');
    });
  });

  describe('getAverageScore', () => {
    it('should calculate the expected average', () => {
      const expectedResult = {
        'lighthouse accessibility': 60,
        'lighthouse performance': 51,
      };
      const input = [
        { 'lighthouse accessibility': 100, 'lighthouse performance': 52 },
        { 'lighthouse accessibility': 20, 'lighthouse performance': 50 },
      ];
      const actualResult = getAverageScore(input);
      expect(expectedResult).toStrictEqual(actualResult);
    });

    it('should round the expected average correctly', () => {
      const expectedResult = {
        'lighthouse accessibility': 99,
        'lighthouse performance': 99,
        'lighthouse progressive web app': 99,
        'lighthouse best practices': 99,
      };
      const input = [
        {
          'lighthouse accessibility': 100,
          'lighthouse performance': 100,
          'lighthouse progressive web app': 100,
          'lighthouse best practices': 100,
        },
        {
          'lighthouse accessibility': 98.9,
          'lighthouse performance': 98.9,
          'lighthouse progressive web app': 98.9,
          'lighthouse best practices': 98.9,
        },
      ];
      const actualResult = getAverageScore(input);
      expect(expectedResult).toStrictEqual(actualResult);
    });

    it('should return empty object for empty input', () => {
      const result = getAverageScore([]);
      expect(result).toStrictEqual({});
    });
  });

  describe('getSquashedScore', () => {
    it('should calculate the expected squashed average', () => {
      const expectedResult = { lighthouse: 50 };
      const input = [
        { 'lighthouse accessibility': 100, 'lighthouse performance': 60 },
        { 'lighthouse accessibility': 20, 'lighthouse performance': 20 },
      ];
      const actualResult = getSquashedScore(input);
      expect(expectedResult).toStrictEqual(actualResult);
    });

    it('should round the expected squashed average correctly', () => {
      const expectedResult = { lighthouse: 83 };
      const input = [
        {
          'lighthouse accessibility': 100,
          'lighthouse performance': 100,
          'lighthouse progressive web app': 55,
          'lighthouse best practices': 75,
        },
      ];
      const actualResult = getSquashedScore(input);
      expect(expectedResult).toStrictEqual(actualResult);
    });

    it('should return zero score for empty input', () => {
      const result = getSquashedScore([]);
      expect(result).toStrictEqual({ lighthouse: 0 });
    });
  });
});
