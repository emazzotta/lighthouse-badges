import type { Config } from 'lighthouse';

export const BADGE_STYLES = ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'] as const;

export type BadgeStyle = (typeof BADGE_STYLES)[number];

export interface ParsedArgs {
  readonly single_badge: boolean;
  readonly badge_style: BadgeStyle;
  readonly output_path?: string;
  readonly save_report: boolean;
  readonly url: string;
}

export type LighthouseMetrics = Readonly<Record<string, number>>;

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
  readonly score: number | null;
}

export interface LighthouseLHR {
  readonly categories: Readonly<Record<string, LighthouseCategory>>;
  readonly runtimeError?: { readonly code: string; readonly message: string };
}

export interface Spinner {
  readonly start: () => void;
  readonly stop: () => void;
}
