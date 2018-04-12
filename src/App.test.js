const puppeteer = require('puppeteer');

const isDebugging = () => {
  const debuggin_mode = {
    headless: false,
    slowMo: 250,
    devtools: true
  };
  return process.env.NODE_ENV === 'debug' ? debuggin_mode : {};
};

let browser;
let page;
beforeAll(async () => {
  browser = await puppeteer.launch(isDebugging());
  page = await browser.newPage();

  await page.goto('http://localhost:3000');

  page.setViewport({
    width: 500,
    height: 2400
  })
});

afterAll(() => {
  if (isDebugging()) {
    browser.close();
  }
})

describe('on page load', () => {
  it('h1 loads correctly', async () => {
    const html = await page.$eval('[data-test-id="h1"]', el => el.innerHTML);
    expect(html).toBe('Welcome to React');
  });

  it('navbar loads correctly', async () => {
    const navbar = await page.$eval('[data-test-id="navbar"]', el => !!el);
    const listItems = await page.$$('[data-test-id="navbar-li"]');

    expect(navbar).toBe(true);
    expect(listItems).toHaveLength(4);
  });
});