export type BadgeStyle = 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social';

export interface ParsedArgs {
  single_badge: boolean;
  badge_style: BadgeStyle;
  output_path?: string;
  save_report: boolean;
  url: string;
}

export type LighthouseMetrics = Record<string, number>;

export type LighthouseReport = Record<string, string | false>;

export interface ProcessedLighthouseResult {
  metrics: LighthouseMetrics;
  report: LighthouseReport;
}

export interface LighthouseConfig {
  extends?: string;
  settings?: {
    extraHeaders?: Record<string, string>;
    onlyCategories?: string[];
    formFactor?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface LighthouseLHR {
  categories: Record<string, { score: number; [key: string]: unknown }>;
  [key: string]: unknown;
}

export interface Spinner {
  start: () => void;
  stop: () => void;
}
