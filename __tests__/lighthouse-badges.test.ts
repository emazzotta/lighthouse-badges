import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import fs from 'fs';
import {
  htmlReportsToFile,
  metricsToSvg,
  processParameters,
  processRawLighthouseResult,
} from '../src/lighthouse-badges';
import { zip } from '../src/util';
import parser from '../src/argparser';
import reportFixture from '../assets/report/emanuelemazzotta.com.json';
import type { LighthouseLHR, LighthouseMetrics, LighthouseReport, ProcessedLighthouseResult, LighthouseConfig } from '../src/types';

// Global mock output storage
let mockOutput: Array<Record<string, string>> = [];
const originalWriteFile = fs.writeFile;

describe('test lighthouse badges', () => {
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
    beforeEach(() => {
      mockOutput = [];
      fs.writeFile = ((path: fs.PathLike, content: string | NodeJS.ArrayBufferView, callback?: (err: NodeJS.ErrnoException | null) => void) => {
        mockOutput.push({ [path.toString()]: content.toString() });
        if (callback) callback(null);
        return undefined as any;
      }) as typeof fs.writeFile;
    });

    afterEach(() => {
      fs.writeFile = originalWriteFile;
      mockOutput = [];
    });

    it('should save html report', async () => {
      const htmlReports: LighthouseReport[] = [
        { 'https://emanuelemazzotta.com': 'a report' },
        { 'https://emanuelemazzotta.com/cv': 'another report' },
      ];
      const outputPath = process.cwd();
      await htmlReportsToFile(htmlReports, outputPath);

      zip([mockOutput, htmlReports]).map((items) => {
        const [actual, expected] = items;
        return expect(Object.values(actual)).toStrictEqual(Object.values(expected));
      });

      expect(mockOutput.length).toBe(2);
    });

    it('should not save html report if toggle is false', async () => {
      const htmlReports: LighthouseReport[] = [
        { 'https://example.com': false },
        { 'https://example2.com': false },
      ];
      await htmlReportsToFile(htmlReports, process.cwd());
      expect(mockOutput.length).toBe(0);
    });
  });

  describe('the svg files are saved correctly', () => {
    beforeEach(() => {
      mockOutput = [];
      fs.writeFile = ((path: fs.PathLike, content: string | NodeJS.ArrayBufferView, callback?: (err: NodeJS.ErrnoException | null) => void) => {
        mockOutput.push({ [path.toString()]: content.toString() });
        if (callback) callback(null);
        return undefined as any;
      }) as typeof fs.writeFile;
    });

    afterEach(() => {
      fs.writeFile = originalWriteFile;
      mockOutput = [];
    });

    it('should save all svg files', async () => {
      const lighthouseMetrics: LighthouseMetrics = {
        'lighthouse performance': 100,
        'lighthouse pwa': 85,
        'lighthouse accessibility': 100,
        'lighthouse best-practices': 93,
        'lighthouse seo': 100,
      };

      const badgeStyle = 'flat';
      const outputPath = process.cwd();
      await metricsToSvg(lighthouseMetrics, badgeStyle, outputPath);

      expect(mockOutput.length).toBe(5);
    });
  });

  describe('test the main process function', () => {
    beforeEach(() => {
      mockOutput = [];
      fs.writeFile = ((path: fs.PathLike, content: string | NodeJS.ArrayBufferView, callback?: (err: NodeJS.ErrnoException | null) => void) => {
        mockOutput.push({ [path.toString()]: content.toString() });
        if (callback) callback(null);
        return undefined as any;
      }) as typeof fs.writeFile;
    });

    afterEach(() => {
      fs.writeFile = originalWriteFile;
      mockOutput = [];
    });

    it('should create single badge with report', async () => {
      const args = parser.parse_args([
        '--single-badge',
        '--save-report',
        '--url', 'https://example.org',
      ]);

      const mockResult = await processRawLighthouseResult(reportFixture as LighthouseLHR, '<html>Fake report</html>', 'https://example.org', args.save_report);
      const calculateLighthouseMetrics = mock(() => Promise.resolve(mockResult));
      await processParameters(args, calculateLighthouseMetrics as (url: string, shouldSaveReport: boolean, lighthouseParameters?: LighthouseConfig) => Promise<ProcessedLighthouseResult>);

      expect(mockOutput.length).toBe(2);
    });

    it('should create multiple badges with report', async () => {
      const args = parser.parse_args([
        '--save-report',
        '--url', 'https://example.org',
      ]);

      const mockResult = await processRawLighthouseResult(reportFixture as LighthouseLHR, '<html>Fake report</html>', 'https://example.org', args.save_report);
      const calculateLighthouseMetrics = mock(() => Promise.resolve(mockResult));
      await processParameters(args, calculateLighthouseMetrics as (url: string, shouldSaveReport: boolean, lighthouseParameters?: LighthouseConfig) => Promise<ProcessedLighthouseResult>);

      expect(mockOutput.length).toBe(6);
    });

    it('should create single badge without report', async () => {
      const args = parser.parse_args([
        '--single-badge',
        '--url', 'https://example.org',
      ]);

      const mockResult = await processRawLighthouseResult(reportFixture as LighthouseLHR, '', 'https://example.org', args.save_report);
      const calculateLighthouseMetrics = mock(() => Promise.resolve(mockResult));
      await processParameters(args, calculateLighthouseMetrics as (url: string, shouldSaveReport: boolean, lighthouseParameters?: LighthouseConfig) => Promise<ProcessedLighthouseResult>);

      expect(mockOutput.length).toBe(1);
    });

    it('should create multiple badges without report', async () => {
      const args = parser.parse_args([
        '--url', 'https://example.org',
      ]);

      const mockResult = await processRawLighthouseResult(reportFixture as LighthouseLHR, '', 'https://example.org', args.save_report);
      const calculateLighthouseMetrics = mock(() => Promise.resolve(mockResult));
      await processParameters(args, calculateLighthouseMetrics as (url: string, shouldSaveReport: boolean, lighthouseParameters?: LighthouseConfig) => Promise<ProcessedLighthouseResult>);

      expect(mockOutput.length).toBe(5);
    });
  });
});

