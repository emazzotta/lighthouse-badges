import * as R from 'ramda';
import type { LighthouseMetrics } from './types.js';

export const percentageToColor = (percentage: number): string => {
  if (percentage >= 95) return 'brightgreen';
  if (percentage >= 90) return 'green';
  if (percentage >= 75) return 'yellowgreen';
  if (percentage >= 60) return 'yellow';
  if (percentage >= 40) return 'orange';
  return 'red';
};

export const getAverageScore = async (metrics: LighthouseMetrics[]): Promise<LighthouseMetrics> => {
  const headMetric = R.head(metrics);
  if (!headMetric) {
    return {};
  }
  const categories = R.keys(headMetric);
  const scoreObjects = categories.map((category: string) => ({
    [category]: Math.round(R.sum(R.pluck(category, metrics)) / R.length(metrics))
  }));
  return R.mergeAll(scoreObjects) as LighthouseMetrics;
};

export const getSquashedScore = async (metrics: LighthouseMetrics[]): Promise<LighthouseMetrics> => {
  const headMetric = R.head(metrics);
  if (!headMetric) {
    return { lighthouse: 0 };
  }
  const score = R.pipe(
    R.map((metric: LighthouseMetrics) => R.sum(R.values(metric))),
    R.sum,
    (x: number) => (x / (R.length(metrics) * R.length(R.keys(headMetric)))),
    Math.round,
  )(metrics);
  return {
    lighthouse: score,
  };
};

