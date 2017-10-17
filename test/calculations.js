const assert = require('assert');
const { getAverageScore, getSquashedScore } = require('../lib/calculations');

describe('Calculations work', () => {
  describe('the average is calculated correctly', () => {
    it('should contain the expected average', async () => {
      const expectedResult = { 'lighthouse accessibility': 60, 'lighthouse performance': 51 };
      const input = [
        { 'lighthouse accessibility': 100, 'lighthouse performance': 52 },
        { 'lighthouse accessibility': 20, 'lighthouse performance': 50 },
      ];
      const actualResult = await getAverageScore(input);
      assert.deepEqual(expectedResult, actualResult);
    });
  });

  describe('the average is calculated correctly for squashed score', () => {
    it('should contain the expected squashed average', async () => {
      const expectedResult = { lighthouse: 56 };
      const input = [
        { 'lighthouse accessibility': 100, 'lighthouse performance': 52 },
        { 'lighthouse accessibility': 20, 'lighthouse performance': 50 },
      ];
      const actualResult = await getSquashedScore(input);
      assert.deepEqual(expectedResult, actualResult);
    });
  });
});
