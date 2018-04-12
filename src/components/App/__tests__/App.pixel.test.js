const puppeteer = require('puppeteer');
const pixelmatch = require('pixelmatch');
const iPhone = require('puppeteer/DeviceDescriptors')['iPhone 6'];
const { compareScreenshots, makeScreenshot } = require('../../../utils/diff-images')(__dirname);

let browser;
let page;
beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.emulate(iPhone);
  await page.goto('http://localhost:3000');
});

afterAll(() => browser.close());

describe('screenshots are correct', () => {
  it('App', async () => {
    await makeScreenshot(page, 'App');
    await compareScreenshots('App');
  }, 15000);
});