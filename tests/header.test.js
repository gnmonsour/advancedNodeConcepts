const puppeteer = require('puppeteer');

///////////////////////////////////////////////////////////
let browser, page;

///////////////////////////////////////////////////////////
beforeEach(async () => {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto('localhost:3000');
});

///////////////////////////////////////////////////////////
afterEach(async () => {
  await browser.close();
});

///////////////////////////////////////////////////////////
test('logo is verified', async () => {
  const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);

  expect(text).toEqual('Blogster');
});

///////////////////////////////////////////////////////////
test('clicking login initiates auth workflow', async () => {
  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

///////////////////////////////////////////////////////////
test('logout button shows when logged in', async () => {
  const Buffer = require('safe-buffer').Buffer;
  const Keygrip = require('keygrip');
  const keys = require('../config/keys');

  const id = '5f4bbac6e2a27f3bd06a9ea1';
  const selectorLogout = 'a[href="/auth/logout"]';

  const sessionObject = { passport: { user: id } };
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
    'base64'
  );

  const keygrip = new Keygrip([keys.cookieKey]);
  const sessionSig = keygrip.sign(`session=${sessionString}`);

  await page.setCookie({ name: 'session', value: sessionString });
  await page.setCookie({ name: 'session.sig', value: sessionSig });
  await page.goto('localhost:3000');

  await page.waitForSelector(selectorLogout);

  const text = await page.$eval(selectorLogout, (el) => el.innerHTML);
  expect(text).toBeDefined();
  expect(text).toEqual('Logout');
});
