const puppeteer = require('puppeteer');

const isDebugging = () => {
  const debuggin_mode = {
    headless: false,
    slowMo: 250,
    devtools: true
  };
  return process.env.NODE_ENV === 'debug' ? debuggin_mode : {};
};

describe('on page load', () => {
  it('h1 loads correctly', async () => {
    const browser = await puppeteer.launch(isDebugging());
    const page = await browser.newPage();

    page.emulate({
      viewport: {
        width: 500,
        height: 2400
      },
      userAgent: ''
    })
  });
});