import type { LighthouseMetrics } from './types.js';

const COLOR_THRESHOLDS: ReadonlyArray<readonly [number, string]> = [
  [95, 'brightgreen'],
  [90, 'green'],
  [75, 'yellowgreen'],
  [60, 'yellow'],
  [40, 'orange'],
];

const sum = (values: number[]): number => values.reduce((a, b) => a + b, 0);

const average = (values: number[]): number => Math.round(sum(values) / values.length);

export const percentageToColor = (percentage: number): string =>
  COLOR_THRESHOLDS.find(([threshold]) => percentage >= threshold)?.[1] ?? 'red';

export const getAverageScore = (metrics: LighthouseMetrics[]): LighthouseMetrics => {
  const [head] = metrics;
  if (!head) return {};

  return Object.fromEntries(
    Object.keys(head).map((category) => [category, average(metrics.map((m) => m[category] ?? 0))]),
  );
};

export const getSquashedScore = (metrics: LighthouseMetrics[]): LighthouseMetrics => {
  const allScores = metrics.flatMap((m) => Object.values(m));
  return { lighthouse: allScores.length === 0 ? 0 : average(allScores) };
};
