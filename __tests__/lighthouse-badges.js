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

describe('test lighthouse badges', () => {
  describe('the lighthouse command results are processed as expected', () => {
    it('should return correct metrics and no report', async () => {
      const url = 'https://emanuelemazzotta.com';
      const shouldSaveReport = false;
      const result = await processRawLighthouseResult(reportFixture, '', url, shouldSaveReport);
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
        reportFixture,
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
    let output;
    const { writeFile } = fs;

    beforeEach(() => {
      output = [];
      fs.writeFile = (path, content) => {
        output.push({ [path]: content });
      };
    });

    afterEach(() => {
      fs.writeFile = writeFile;
    });

    it('should save html report', async () => {
      const htmlReports = [
        { 'https://emanuelemazzotta.com': 'a report' },
        { 'https://emanuelemazzotta.com/cv': 'another report' },
      ];
      const outputPath = process.cwd();
      await htmlReportsToFile(htmlReports, outputPath);

      zip([output, htmlReports]).map((items) => {
        const [actual, expected] = items;
        return expect(Object.values(actual)).toStrictEqual(Object.values(expected));
      });

      expect(output.length).toBe(2);
    });

    it('should not save html report if toggle is false', async () => {
      const htmlReports = [false, false];
      await htmlReportsToFile(htmlReports);
      expect(output.length).toBe(0);
    });
  });

  describe('the svg files are saved correctly', () => {
    let output;
    const { writeFile } = fs;

    beforeEach(() => {
      output = [];
      fs.writeFile = (path, content) => {
        output.push({ [path]: content });
      };
    });

    afterEach(() => {
      fs.writeFile = writeFile;
    });

    it('should save all svg files', async () => {
      const lighthouseMetrics = {
        'lighthouse performance': 100,
        'lighthouse pwa': 85,
        'lighthouse accessibility': 100,
        'lighthouse best-practices': 93,
        'lighthouse seo': 100,
      };

      const badgeStyle = 'flat';
      const outputPath = process.cwd();
      await metricsToSvg(lighthouseMetrics, badgeStyle, outputPath);

      expect(output.length).toBe(5);
    });
  });

  describe('test the main process function', () => {
    let output;
    const { writeFile } = fs;

    beforeEach(() => {
      output = [];
      fs.writeFile = (path, content) => {
        output.push({ [path]: content });
      };
    });

    afterEach(() => {
      fs.writeFile = writeFile;
    });

    it('should create single badge with report', async () => {
      const args = parser.parse_args([
        '--single-badge',
        '--save-report',
        '--url', 'https://example.org',
      ]);

      const calculateLighthouseMetrics = jest.fn();
      calculateLighthouseMetrics.mockReturnValue(await processRawLighthouseResult(reportFixture, '<html>Fake report</html>', 'https://example.org', args.save_report));
      await processParameters(args, calculateLighthouseMetrics);

      expect(output.length).toBe(2);
    });

    it('should create multiple badges with report', async () => {
      const args = parser.parse_args([
        '--save-report',
        '--url', 'https://example.org',
      ]);

      const calculateLighthouseMetrics = jest.fn();
      calculateLighthouseMetrics.mockReturnValue(await processRawLighthouseResult(reportFixture, '<html>Fake report</html>', 'https://example.org', args.save_report));
      await processParameters(args, calculateLighthouseMetrics);

      expect(output.length).toBe(6);
    });

    it('should create single badge without report', async () => {
      const args = parser.parse_args([
        '--single-badge',
        '--url', 'https://example.org',
      ]);

      const calculateLighthouseMetrics = jest.fn();
      calculateLighthouseMetrics.mockReturnValue(await processRawLighthouseResult(reportFixture, null, 'https://example.org', args.save_report));
      await processParameters(args, calculateLighthouseMetrics);

      expect(output.length).toBe(1);
    });

    it('should create multiple badges without report', async () => {
      const args = parser.parse_args([
        '--url', 'https://example.org',
      ]);

      const calculateLighthouseMetrics = jest.fn();
      calculateLighthouseMetrics.mockReturnValue(await processRawLighthouseResult(reportFixture, null, 'https://example.org', args.save_report));
      await processParameters(args, calculateLighthouseMetrics);

      expect(output.length).toBe(5);
    });
  });
});
