const PageProxy = require('./helpers/pageProxy');

///////////////////////////////////////////////////////////
let page;

///////////////////////////////////////////////////////////
beforeEach(async () => {
  page = await PageProxy.build();
  await page.goto('localhost:3000');
});

///////////////////////////////////////////////////////////
afterEach(async () => {
  await page.close();
});

///////////////////////////////////////////////////////////
test('logo is verified', async () => {
  const text = await page.getInnerHTMLOf('a.brand-logo');

  expect(text).toEqual('Blogster');
});

///////////////////////////////////////////////////////////
test('clicking login initiates auth workflow', async () => {
  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

///////////////////////////////////////////////////////////
test('logout button selector shows when logged in', async () => {
  const selectorLogout = 'a[href="/auth/logout"]';
  await page.login(selectorLogout);
  const text = await page.getInnerHTMLOf(selectorLogout);
  expect(text).toBeDefined();
  expect(text).toEqual('Logout');
});
