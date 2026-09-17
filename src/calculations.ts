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

export const squashScores = (metrics: LighthouseMetrics): LighthouseMetrics => {
  const scores = Object.values(metrics);
  return { lighthouse: scores.length === 0 ? 0 : average(scores) };
};
