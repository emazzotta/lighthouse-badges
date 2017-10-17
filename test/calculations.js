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

    it('should round the expected average correctly', async () => {
      const expectedResult = {
        'lighthouse accessibility': 99.5,
        'lighthouse performance': 99.5,
        'lighthouse progressive web app': 99.5,
        'lighthouse best practices': 99.5,
      };
      const input = [{
        'lighthouse accessibility': 100,
        'lighthouse performance': 100,
        'lighthouse progressive web app': 100,
        'lighthouse best practices': 100,
      },{
        'lighthouse accessibility': 99,
        'lighthouse performance': 99,
        'lighthouse progressive web app': 99,
        'lighthouse best practices': 99,
      },];
      const actualResult = await getAverageScore(input);
      assert.deepEqual(expectedResult, actualResult);
    });
  });

  describe('the average is calculated correctly for squashed score', () => {
    it('should contain the expected squashed average', async () => {
      const expectedResult = { lighthouse: 60 };
      const input = [
        { 'lighthouse accessibility': 100, 'lighthouse performance': 65 },
        { 'lighthouse accessibility': 20, 'lighthouse performance': 55 },
      ];
      const actualResult = await getSquashedScore(input);
      assert.deepEqual(expectedResult, actualResult);
    });

    it('should round the expected squashed average correctly', async () => {
      const expectedResult = { lighthouse: 82.5 };
      const input = [{
        'lighthouse accessibility': 100,
        'lighthouse performance': 100,
        'lighthouse progressive web app': 55,
        'lighthouse best practices': 75
      },];
      const actualResult = await getSquashedScore(input);
      assert.deepEqual(expectedResult, actualResult);
    });
  });
});
