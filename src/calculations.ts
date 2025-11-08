import * as R from 'ramda';
import type { LighthouseMetrics } from './types.js';

const PERCENTAGE_THRESHOLDS = {
  EXCELLENT: 95,
  GOOD: 90,
  ABOVE_AVERAGE: 75,
  AVERAGE: 60,
  BELOW_AVERAGE: 40,
} as const;

const COLOR_MAP = {
  EXCELLENT: 'brightgreen',
  GOOD: 'green',
  ABOVE_AVERAGE: 'yellowgreen',
  AVERAGE: 'yellow',
  BELOW_AVERAGE: 'orange',
  POOR: 'red',
} as const;

export const percentageToColor = (percentage: number): string => {
  if (percentage >= PERCENTAGE_THRESHOLDS.EXCELLENT) return COLOR_MAP.EXCELLENT;
  if (percentage >= PERCENTAGE_THRESHOLDS.GOOD) return COLOR_MAP.GOOD;
  if (percentage >= PERCENTAGE_THRESHOLDS.ABOVE_AVERAGE) return COLOR_MAP.ABOVE_AVERAGE;
  if (percentage >= PERCENTAGE_THRESHOLDS.AVERAGE) return COLOR_MAP.AVERAGE;
  if (percentage >= PERCENTAGE_THRESHOLDS.BELOW_AVERAGE) return COLOR_MAP.BELOW_AVERAGE;
  return COLOR_MAP.POOR;
};

const calculateCategoryAverage = (
  category: string,
  metrics: LighthouseMetrics[],
): number => {
  const categoryScores = R.pluck(category, metrics);
  const sum = R.sum(categoryScores);
  const count = R.length(metrics);
  return Math.round(sum / count);
};

export const getAverageScore = (metrics: LighthouseMetrics[]): LighthouseMetrics => {
  if (metrics.length === 0) {
    return {};
  }

  const headMetric = R.head(metrics);
  if (!headMetric) {
    return {};
  }

  const categories = R.keys(headMetric);
  const scoreObjects = categories.map((category: string) => ({
    [category]: calculateCategoryAverage(category, metrics),
  }));

  return R.mergeAll(scoreObjects) as LighthouseMetrics;
};

const calculateTotalScore = (metrics: LighthouseMetrics[]): number => {
  const sumOfAllScores = R.pipe(
    R.map((metric: LighthouseMetrics) => R.sum(R.values(metric))),
    R.sum,
  )(metrics);
  return sumOfAllScores;
};

const calculateTotalCategories = (headMetric: LighthouseMetrics): number => {
  return R.length(R.keys(headMetric));
};

export const getSquashedScore = (metrics: LighthouseMetrics[]): LighthouseMetrics => {
  if (metrics.length === 0) {
    return { lighthouse: 0 };
  }

  const headMetric = R.head(metrics);
  if (!headMetric) {
    return { lighthouse: 0 };
  }

  const totalScore = calculateTotalScore(metrics);
  const totalCategories = calculateTotalCategories(headMetric);
  const totalMetrics = R.length(metrics);
  const averageScore = totalScore / (totalMetrics * totalCategories);

  return {
    lighthouse: Math.round(averageScore),
  };
};
