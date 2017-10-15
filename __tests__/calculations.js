const {get_average_score} = require('../lib/calculations');

(async function () {
  console.log(await get_average_score([
    {
      'Lighthouse Acc': 100,
      'Lighthouse Perf': 50
    }, {
      'Lighthouse Acc': 20,
      'Lighthouse Perf': 70
    }
  ]))
})();