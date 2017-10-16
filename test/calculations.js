const assert = require('assert');
const { getAverageScore } = require('../lib/calculations');

describe('Calculations work', () => {
  describe('the average is calculated correctly', () => {
    it('should contain the expected average', async () => {
      const expectedResult = { 'Lighthouse Acc': 60, 'Lighthouse Perf': 51 };
      const input = [
        { 'Lighthouse Acc': 100, 'Lighthouse Perf': 52 },
        { 'Lighthouse Acc': 20, 'Lighthouse Perf': 50 },
      ];
      const actualResult = await getAverageScore(input);
      assert.deepEqual(expectedResult, actualResult);
    });
  });
});
