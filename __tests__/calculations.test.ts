import { describe, it, expect } from 'bun:test';
import { squashScores, percentageToColor } from '../src/calculations';

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

  describe('squashScores', () => {
    it('should average all categories into one score', () => {
      expect(squashScores({ 'lighthouse accessibility': 100, 'lighthouse performance': 60 })).toStrictEqual({ lighthouse: 80 });
    });

    it('should round the average to the nearest integer', () => {
      const metrics = {
        'lighthouse accessibility': 100,
        'lighthouse performance': 100,
        'lighthouse seo': 55,
        'lighthouse best-practices': 75,
      };

      expect(squashScores(metrics)).toStrictEqual({ lighthouse: 83 });
    });

    it('should return a zero score when there are no categories', () => {
      expect(squashScores({})).toStrictEqual({ lighthouse: 0 });
    });
  });
});
