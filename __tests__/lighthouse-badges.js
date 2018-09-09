import assert from 'assert';
import fs from 'fs';
import ReportGenerator from 'lighthouse/lighthouse-core/report/report-generator';
import { htmlReportsToFile, processRawLighthouseResult } from '../lib/lighthouse-badges';
import { zip } from '../lib/util';

const reportFixture = require('../assets/report/emanuelemazzotta.com.json');


describe('test lighthouse badges', () => {
  describe('the lighthouse command results are processed as expected', () => {
    it('should return correct metrics and no report', async () => {
      const url = 'https://emanuelemazzotta.com';
      const shouldSaveReport = false;
      const result = await processRawLighthouseResult(
        reportFixture, url, shouldSaveReport,
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
      const expectedHtmlReport = ReportGenerator.generateReportHtml(reportFixture);
      const url = 'https://emanuelemazzotta.com';
      const shouldSaveReport = true;
      const result = await processRawLighthouseResult(
        reportFixture, url, shouldSaveReport,
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
      await htmlReportsToFile(htmlReports);

      zip([output, htmlReports]).map((items) => {
        const [actual, expected] = items;
        return assert.deepEqual(Object.values(actual), Object.values(expected));
      });

      assert.equal(output.length, 2);
    });

    it('should not save html report if toggle is false', async () => {
      const htmlReports = [false, false];
      await htmlReportsToFile(htmlReports);
      assert.equal(output.length, 0);
    });
  });
});
