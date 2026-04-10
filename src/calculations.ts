import type { LighthouseMetrics } from './types.js';

const COLOR_THRESHOLDS: ReadonlyArray<readonly [number, string]> = [
  [95, 'brightgreen'],
  [90, 'green'],
  [75, 'yellowgreen'],
  [60, 'yellow'],
  [40, 'orange'],
];

const POOR_COLOR = 'red';

export const percentageToColor = (percentage: number): string =>
  COLOR_THRESHOLDS.find(([threshold]) => percentage >= threshold)?.[1] ?? POOR_COLOR;

const averageByCategory = (category: string, metrics: LighthouseMetrics[]): number => {
  const sum = metrics.reduce((total, metric) => total + (metric[category] ?? 0), 0);
  return Math.round(sum / metrics.length);
};

export const getAverageScore = (metrics: LighthouseMetrics[]): LighthouseMetrics => {
  const [head] = metrics;
  if (!head) return {};

  return Object.fromEntries(
    Object.keys(head).map((category) => [category, averageByCategory(category, metrics)]),
  );
};

export const getSquashedScore = (metrics: LighthouseMetrics[]): LighthouseMetrics => {
  const [head] = metrics;
  if (!head) return { lighthouse: 0 };

  const totalScore = metrics.reduce(
    (sum, metric) => sum + Object.values(metric).reduce((a, b) => a + b, 0),
    0,
  );
  const totalCategories = Object.keys(head).length;
  const averageScore = totalScore / (metrics.length * totalCategories);

  return { lighthouse: Math.round(averageScore) };
};
