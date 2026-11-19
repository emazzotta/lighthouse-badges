import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import fs from 'fs';
import path from 'path';
import {
  buildChromeFlags,
  buildLighthouseFlags,
  metricsToSvg,
  processRawLighthouseResult,
  resolveOutputPath,
  saveArtifacts,
  saveHtmlReport,
} from '../src/lighthouse-badges';
import { parseArgs } from '../src/argparser';
import reportFixture from '../assets/report/emanuelemazzotta.com.json';
import type { LighthouseLHR, LighthouseMetrics } from '../src/types';

// Use a temporary directory for test outputs
const TEST_OUTPUT_DIR = path.join(process.cwd(), '__test_output__');

function cleanupTestFiles() {
  fs.rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
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

describe('lighthouse-badges', () => {
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
    const expectedMetrics = {
      'lighthouse performance': 98,
      'lighthouse pwa': 85,
      'lighthouse accessibility': 100,
      'lighthouse best-practices': 93,
      'lighthouse seo': 100,
    };

    it('should return integer percentages and no report', () => {
      const result = processRawLighthouseResult(reportFixture as LighthouseLHR, '', 'https://emanuelemazzotta.com', false);

      expect(result).toStrictEqual({ metrics: expectedMetrics });
    });

    it('should return the report for its url when it should be saved', () => {
      const url = 'https://emanuelemazzotta.com';
      const html = '<html>Fake report</html>';

      const result = processRawLighthouseResult(reportFixture as LighthouseLHR, html, url, true);

      expect(result).toStrictEqual({ metrics: expectedMetrics, report: { url, html } });
    });

    it('should round a fractional percentage', () => {
      const lhr = { categories: { performance: { score: 0.955 } } };

      expect(processRawLighthouseResult(lhr, '', 'https://example.org', false).metrics).toStrictEqual({ 'lighthouse performance': 96 });
    });

    it('should throw the lighthouse runtime error when the page could not be audited', () => {
      const lhr = {
        categories: { performance: { score: null } },
        runtimeError: { code: 'ERRORED_DOCUMENT_REQUEST', message: 'Lighthouse was unable to reliably load the page you requested.' },
      } as unknown as LighthouseLHR;

      expect(() => processRawLighthouseResult(lhr, '', 'https://unreachable.invalid', false)).toThrow(
        'Lighthouse could not audit https://unreachable.invalid (ERRORED_DOCUMENT_REQUEST): Lighthouse was unable to reliably load the page you requested.',
      );
    });

    it('should throw naming the categories without a score when an audit errored', () => {
      const lhr = { categories: { performance: { score: 0.9 }, seo: { score: null }, accessibility: { score: null } } } as unknown as LighthouseLHR;

      expect(() => processRawLighthouseResult(lhr, '', 'https://example.org', false)).toThrow(
        'Lighthouse returned no score for https://example.org in: seo, accessibility',
      );
    });

    it('should throw when lighthouse returns no categories', () => {
      const lhr = { categories: {} };

      expect(() => processRawLighthouseResult(lhr, '', 'https://example.org', false)).toThrow(
        'Lighthouse returned no categories for https://example.org',
      );
    });
  });

  describe('the chrome flags', () => {
    it('should keep the chrome sandbox by default', () => {
      expect(buildChromeFlags({})).not.toContain('--no-sandbox');
      expect(buildChromeFlags({})).toContain('--headless');
    });

    it('should disable the chrome sandbox when the environment asks for it', () => {
      expect(buildChromeFlags({ LIGHTHOUSE_BADGES_DISABLE_SANDBOX: 'true' })).toContain('--no-sandbox');
    });
  });

  describe('the lighthouse flags', () => {
    it('should ask for the html report only when it should be saved', () => {
      expect(buildLighthouseFlags(9222, true)).toStrictEqual({ logLevel: 'silent', output: 'html', port: 9222 });
      expect(buildLighthouseFlags(9222, false)).toStrictEqual({ logLevel: 'silent', output: 'json', port: 9222 });
    });
  });

  describe('the html report is saved correctly', () => {
    it('should save the report under the escaped url', async () => {
      await saveHtmlReport(TEST_OUTPUT_DIR, { url: 'https://emanuelemazzotta.com/cv', html: 'a report' });

      expect(getTestFiles()).toStrictEqual(['emanuelemazzotta_com_cv.html']);
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

  describe('the output path is resolved', () => {
    it('should default to the working directory', () => {
      const args = parseArgs(['--url', 'https://example.org']);

      expect(resolveOutputPath(args)).toBe(process.cwd());
    });
  });

  describe('the artifacts are saved for the parsed arguments', () => {
    it('should create the output path when it does not exist', async () => {
      const outputPath = path.join(TEST_OUTPUT_DIR, 'nested');
      const args = parseArgs(['--single-badge', '--url', 'https://example.org', '--output-path', outputPath]);

      await saveArtifacts(args, { metrics: { 'lighthouse performance': 90 } });

      expect(fs.readdirSync(outputPath)).toStrictEqual(['lighthouse.svg']);
    });

    it('should create single badge with report', async () => {
      const args = parseArgs([
        '--single-badge',
        '--save-report',
        '--url', 'https://example.org',
        '--output-path', TEST_OUTPUT_DIR,
      ]);

      const mockResult = await processRawLighthouseResult(reportFixture as LighthouseLHR, '<html>Fake report</html>', 'https://example.org', args.save_report);
      await saveArtifacts(args, mockResult);

      const files = getTestFiles();
      expect(files.length).toBe(2);
      expect(files.some(f => f.includes('lighthouse.svg'))).toBe(true);
      expect(files.some(f => f.includes('example_org.html'))).toBe(true);
    });

    it('should create multiple badges with report', async () => {
      const args = parseArgs([
        '--save-report',
        '--url', 'https://example.org',
        '--output-path', TEST_OUTPUT_DIR,
      ]);

      const mockResult = await processRawLighthouseResult(reportFixture as LighthouseLHR, '<html>Fake report</html>', 'https://example.org', args.save_report);
      await saveArtifacts(args, mockResult);

      const files = getTestFiles();
      expect(files.length).toBe(6);
    });

    it('should create single badge without report', async () => {
      const args = parseArgs([
        '--single-badge',
        '--url', 'https://example.org',
        '--output-path', TEST_OUTPUT_DIR,
      ]);

      const mockResult = await processRawLighthouseResult(reportFixture as LighthouseLHR, '', 'https://example.org', args.save_report);
      await saveArtifacts(args, mockResult);

      const files = getTestFiles();
      expect(files.length).toBe(1);
      expect(files.some(f => f.includes('lighthouse.svg'))).toBe(true);
    });

    it('should create multiple badges without report', async () => {
      const args = parseArgs([
        '--url', 'https://example.org',
        '--output-path', TEST_OUTPUT_DIR,
      ]);

      const mockResult = await processRawLighthouseResult(reportFixture as LighthouseLHR, '', 'https://example.org', args.save_report);
      await saveArtifacts(args, mockResult);

      const files = getTestFiles();
      expect(files.length).toBe(5);
    });
  });
});

