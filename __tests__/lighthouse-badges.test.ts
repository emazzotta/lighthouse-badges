import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import fs from 'fs';
import path from 'path';
import {
  htmlReportsToFile,
  metricsToSvg,
  processParameters,
  processRawLighthouseResult,
} from '../src/lighthouse-badges';
import parser from '../src/argparser';
import reportFixture from '../assets/report/emanuelemazzotta.com.json';
import type { LighthouseLHR, LighthouseMetrics, LighthouseReport, ProcessedLighthouseResult, LighthouseConfig } from '../src/types';

// Use a temporary directory for test outputs
const TEST_OUTPUT_DIR = path.join(process.cwd(), '__test_output__');

function cleanupTestFiles() {
  try {
    if (fs.existsSync(TEST_OUTPUT_DIR)) {
      const files = fs.readdirSync(TEST_OUTPUT_DIR);
      for (const file of files) {
        fs.unlinkSync(path.join(TEST_OUTPUT_DIR, file));
      }
      fs.rmdirSync(TEST_OUTPUT_DIR);
    }
  } catch {
    // Ignore cleanup errors
  }
}

function getTestFiles(): string[] {
  try {
    if (fs.existsSync(TEST_OUTPUT_DIR)) {
      return fs.readdirSync(TEST_OUTPUT_DIR);
    }
  } catch {
    // Ignore errors
  }
  return [];
}

describe('test lighthouse badges', () => {
  beforeEach(() => {
    cleanupTestFiles();
    if (!fs.existsSync(TEST_OUTPUT_DIR)) {
      fs.mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    cleanupTestFiles();
  });

  describe('the lighthouse command results are processed as expected', () => {
    it('should return correct metrics and no report', async () => {
      const url = 'https://emanuelemazzotta.com';
      const shouldSaveReport = false;
      const result = await processRawLighthouseResult(reportFixture as LighthouseLHR, '', url, shouldSaveReport);
      expect({
        metrics: {
          'lighthouse performance': 98,
          'lighthouse pwa': 85,
          'lighthouse accessibility': 100,
          'lighthouse best-practices': 93,
          'lighthouse seo': 100,
        },
        report: {
          [url]: false,
        },
      }).toStrictEqual(result);
    });

    it('should return correct metrics and a valid report', async () => {
      const expectedHtmlReport = '<html>Fake report</html>';
      const url = 'https://emanuelemazzotta.com';
      const shouldSaveReport = true;
      const result = await processRawLighthouseResult(
        reportFixture as LighthouseLHR,
        expectedHtmlReport,
        url,
        shouldSaveReport,
      );
      expect({
        metrics: {
          'lighthouse performance': 98,
          'lighthouse pwa': 85,
          'lighthouse accessibility': 100,
          'lighthouse best-practices': 93,
          'lighthouse seo': 100,
        },
        report: {
          [url]: expectedHtmlReport,
        },
      }).toStrictEqual(result);
    });
  });

  describe('the html reports are saved correctly', () => {
    it('should save html report', async () => {
      const htmlReports: LighthouseReport[] = [
        { 'https://emanuelemazzotta.com': 'a report' },
        { 'https://emanuelemazzotta.com/cv': 'another report' },
      ];
      await htmlReportsToFile(htmlReports, TEST_OUTPUT_DIR);

      const files = getTestFiles();
      expect(files.length).toBe(2);
      expect(files.some(f => f.includes('emanuelemazzotta_com'))).toBe(true);
      expect(files.some(f => f.includes('emanuelemazzotta_com_cv'))).toBe(true);
    });

    it('should not save html report if toggle is false', async () => {
      const htmlReports: LighthouseReport[] = [
        { 'https://example.com': false },
        { 'https://example2.com': false },
      ];
      await htmlReportsToFile(htmlReports, TEST_OUTPUT_DIR);
      expect(getTestFiles().length).toBe(0);
    });
  });

  describe('the svg files are saved correctly', () => {
    it('should save all svg files', async () => {
      const lighthouseMetrics: LighthouseMetrics = {
        'lighthouse performance': 100,
        'lighthouse pwa': 85,
        'lighthouse accessibility': 100,
        'lighthouse best-practices': 93,
        'lighthouse seo': 100,
      };

      const badgeStyle = 'flat';
      await metricsToSvg(lighthouseMetrics, badgeStyle, TEST_OUTPUT_DIR);

      const files = getTestFiles();
      expect(files.length).toBe(5);
      expect(files.some(f => f.includes('lighthouse_performance'))).toBe(true);
      expect(files.some(f => f.includes('lighthouse_accessibility'))).toBe(true);
    });
  });

  describe('test the main process function', () => {
    it('should create single badge with report', async () => {
      const args = parser.parse_args([
        '--single-badge',
        '--save-report',
        '--url', 'https://example.org',
        '--output-path', TEST_OUTPUT_DIR,
      ]);

      const mockResult = await processRawLighthouseResult(reportFixture as LighthouseLHR, '<html>Fake report</html>', 'https://example.org', args.save_report);
      const calculateLighthouseMetrics = mock(() => Promise.resolve(mockResult));
      await processParameters(args, calculateLighthouseMetrics as (url: string, shouldSaveReport: boolean, lighthouseParameters?: LighthouseConfig) => Promise<ProcessedLighthouseResult>);

      const files = getTestFiles();
      expect(files.length).toBe(2);
      expect(files.some(f => f.includes('lighthouse.svg'))).toBe(true);
      expect(files.some(f => f.includes('example_org.html'))).toBe(true);
    });

    it('should create multiple badges with report', async () => {
      const args = parser.parse_args([
        '--save-report',
        '--url', 'https://example.org',
        '--output-path', TEST_OUTPUT_DIR,
      ]);

      const mockResult = await processRawLighthouseResult(reportFixture as LighthouseLHR, '<html>Fake report</html>', 'https://example.org', args.save_report);
      const calculateLighthouseMetrics = mock(() => Promise.resolve(mockResult));
      await processParameters(args, calculateLighthouseMetrics as (url: string, shouldSaveReport: boolean, lighthouseParameters?: LighthouseConfig) => Promise<ProcessedLighthouseResult>);

      const files = getTestFiles();
      expect(files.length).toBe(6);
    });

    it('should create single badge without report', async () => {
      const args = parser.parse_args([
        '--single-badge',
        '--url', 'https://example.org',
        '--output-path', TEST_OUTPUT_DIR,
      ]);

      const mockResult = await processRawLighthouseResult(reportFixture as LighthouseLHR, '', 'https://example.org', args.save_report);
      const calculateLighthouseMetrics = mock(() => Promise.resolve(mockResult));
      await processParameters(args, calculateLighthouseMetrics as (url: string, shouldSaveReport: boolean, lighthouseParameters?: LighthouseConfig) => Promise<ProcessedLighthouseResult>);

      const files = getTestFiles();
      expect(files.length).toBe(1);
      expect(files.some(f => f.includes('lighthouse.svg'))).toBe(true);
    });

    it('should create multiple badges without report', async () => {
      const args = parser.parse_args([
        '--url', 'https://example.org',
        '--output-path', TEST_OUTPUT_DIR,
      ]);

      const mockResult = await processRawLighthouseResult(reportFixture as LighthouseLHR, '', 'https://example.org', args.save_report);
      const calculateLighthouseMetrics = mock(() => Promise.resolve(mockResult));
      await processParameters(args, calculateLighthouseMetrics as (url: string, shouldSaveReport: boolean, lighthouseParameters?: LighthouseConfig) => Promise<ProcessedLighthouseResult>);

      const files = getTestFiles();
      expect(files.length).toBe(5);
    });
  });
});

