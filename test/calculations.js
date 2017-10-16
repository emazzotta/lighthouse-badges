const assert = require('assert');
const {get_average_score} = require('../lib/calculations');

describe('Calculations work', function () {
  describe('the average is calculated correctly', function () {
    it('should contain the expected average', async function () {
      const expected_result = {'Lighthouse Acc': 60, 'Lighthouse Perf': 51};
      const input = [
        {'Lighthouse Acc': 100, 'Lighthouse Perf': 52},
        {'Lighthouse Acc': 20, 'Lighthouse Perf': 50}
      ];
      const actual_result = await get_average_score(input);
      assert.deepEqual(expected_result, actual_result)
    });
  });
});
