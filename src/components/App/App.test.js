const puppeteer = require('puppeteer');
const iPhone6 = require('puppeteer/DeviceDescriptors')['iPhone 6']
const faker = require('faker');

const user = {
  email: faker.internet.email(),
  password: 'test',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName()
}

const isDebugging = () => {
  const debuggin_mode = {
    headless: false,
    slowMo: 50,
    devtools: true
  };
  return process.env.NODE_ENV === 'debug' ? debuggin_mode : {};
};

let browser;
let page;
let iPhonePage;
let logs = [];
let errors = [];
beforeAll(async () => {
  browser = await puppeteer.launch(isDebugging());
  page = await browser.newPage();
  await page.setViewport({
    width: 500,
    height: 2400
  });

  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    if (interceptedRequest.url().includes('swapi')) {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  });

  page.on('console', c => logs.push(c.text()));
  page.on('pageerror', e => errors.push(e.message || e.text()));

  iPhonePage = await browser.newPage();
  await iPhonePage.emulate(iPhone6);
  iPhonePage.on('console', c => logs.push(c.text()));
  iPhonePage.on('pageerror', e => errors.push(e.text()));

  await iPhonePage.goto('http://localhost:3000');
  await page.goto('http://localhost:3000');
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

    if (listItems.length !== 4) {
      await page.screenshot({ path: 'navbar-fail.screen.png' });
    }
    expect(listItems).toHaveLength(4);
  });

  it('login form works on desktop with keyboard', async () => {
    const firstNameSelector = '[data-test-id="firstName"]';
    await page.click(firstNameSelector)
    await page.type(firstNameSelector, user.firstName);

    const lastNameSelector = '[data-test-id="lastName"]'
    await page.click(lastNameSelector);
    await page.type(lastNameSelector, user.lastName);

    await page.keyboard.press('Tab');
    await page.keyboard.type(user.email);

    await page.keyboard.press('Tab');
    await page.keyboard.type(user.password);

    await iPhonePage.setCookie({ name: 'JWT', value: 'asd' });

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    await page.waitForSelector('[data-test-id="success"');
  }, 15000);

  describe('login form', () => {
    it('login form works on iPhone 6', async () => {
      const firstName = await iPhonePage.$('[data-test-id="firstName"]');
      const lastName = await iPhonePage.$('[data-test-id="lastName"]');
      const email = await iPhonePage.$('[data-test-id="email"]');
      const password = await iPhonePage.$('[data-test-id="password"]');
      const submit = await iPhonePage.$('[data-test-id="submit"]');

      await firstName.tap();
      await iPhonePage.keyboard.type(user.firstName);

      await lastName.tap();
      await lastName.type(user.lastName);

      await email.tap();
      await iPhonePage.keyboard.type(user.email);

      await password.tap();
      await iPhonePage.keyboard.type(user.password);

      await iPhonePage.setCookie({ name: 'JWT', value: 'asd' });
      await submit.tap();

      await iPhonePage.waitForSelector('[data-test-id="success"');
    }, 15000);

    it('sets firstName cookie', async () => {
      const cookies = await iPhonePage.cookies();
      const firstNameCookie = cookies.find(c => c.name === 'firstName' && c.value === user.firstName);

      expect(firstNameCookie).not.toBeUndefined();
    });

    it('have no logs', () => {
      const filteredLogs = logs.filter(l => l.indexOf('%cDownload the React DevTools') === -1);
      expect(filteredLogs).toHaveLength(0);
    });

    it('has no errors', () => {
      expect(errors).toHaveLength(1);
    });

    it('fails to get StarWars data', async () => {
      const h3 = await page.$eval('[data-test-id="starWars"]', el => el.innerHTML);
      expect(h3).toBe('The Dark Side is Winning');
    });
  });
});