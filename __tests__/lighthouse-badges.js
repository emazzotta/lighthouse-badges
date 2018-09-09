import fs from 'fs';
import assert from 'assert';
import ReportGenerator from 'lighthouse/lighthouse-core/report/report-generator';
import { processRawLighthouseResult } from '../lib/lighthouse-badges';


describe('test lighthouse badges', () => {
  describe('the lighthouse command results are processed as expected', () => {
    it('should return correct metrics and no report', async () => {
      const lighthouseCommandResult = JSON.parse(fs.readFileSync('assets/report/emanuelemazzotta.com.json', 'utf8'));
      const url = 'https://emanuelemazzotta.com';
      const shouldSaveReport = false;
      const result = await processRawLighthouseResult(
        lighthouseCommandResult, url, shouldSaveReport,
      );
      assert.deepEqual({
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
      }, result);
    });

    it('should return correct metrics and a valid report', async () => {
      const lighthouseCommandResult = JSON.parse(fs.readFileSync('assets/report/emanuelemazzotta.com.json', 'utf8'));
      const expectedHtmlReport = ReportGenerator.generateReportHtml(lighthouseCommandResult);
      const url = 'https://emanuelemazzotta.com';
      const shouldSaveReport = true;
      const result = await processRawLighthouseResult(
        lighthouseCommandResult, url, shouldSaveReport,
      );
      assert.deepEqual({
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
      }, result);
    });
  });
});
