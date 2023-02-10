import * as R from 'ramda';

export const percentageToColor = (percentage) => {
  if (percentage >= 95) return 'brightgreen';
  if (percentage >= 90) return 'green';
  if (percentage >= 75) return 'yellowgreen';
  if (percentage >= 60) return 'yellow';
  if (percentage >= 40) return 'orange';
  return 'red';
};

export const getAverageScore = async (metrics) => R.pipe(
  R.head,
  R.keys,
  R.map((category) => (
    { [category]: Math.round(R.sum(R.pluck(category, metrics)) / R.length(metrics)) })),
  R.mergeAll,
)(metrics);

export const getSquashedScore = async (metrics) => ({
  lighthouse: R.pipe(
    R.map((metric) => R.sum(R.values(metric))),
    R.sum,
    (x) => (x / (R.length(metrics) * R.length(R.keys(R.head(metrics))))),
    R.curry(Math.round),
  )(metrics),
});
