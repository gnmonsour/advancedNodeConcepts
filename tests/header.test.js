const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');

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
  const selectorLogout = 'a[href="/auth/logout"]';
  const user = await userFactory();
  const { session, sig } = sessionFactory(user);

  await page.setCookie({ name: 'session', value: session });
  await page.setCookie({ name: 'session.sig', value: sig });
  await page.goto('localhost:3000');

  await page.waitForSelector(selectorLogout);

  const text = await page.$eval(selectorLogout, (el) => el.innerHTML);
  expect(text).toBeDefined();
  expect(text).toEqual('Logout');
});
