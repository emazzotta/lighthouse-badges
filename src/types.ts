import type { Config } from 'lighthouse';

export const BADGE_STYLES = ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'] as const;

export type BadgeStyle = (typeof BADGE_STYLES)[number];

export interface ParsedArgs {
  single_badge: boolean;
  badge_style: BadgeStyle;
  output_path?: string;
  save_report: boolean;
  url: string;
}

export type LighthouseMetrics = Record<string, number>;

export interface HtmlReport {
  readonly url: string;
  readonly html: string;
}

export interface ProcessedLighthouseResult {
  readonly metrics: LighthouseMetrics;
  readonly report?: HtmlReport;
}

export type LighthouseConfig = Config;

export interface LighthouseCategory {
  score: number | null;
}

export interface LighthouseLHR {
  categories: Record<string, LighthouseCategory>;
  runtimeError?: { code: string; message: string };
}

export interface Spinner {
  start: () => void;
  stop: () => void;
}
