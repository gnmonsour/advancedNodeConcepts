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
test(`login and find 'New' blog form`, async () => {
  const selectorLogout = 'a[href="/auth/logout"]';
  await page.login(selectorLogout);
  await page.waitForSelector('a.btn-floating');

  await page.click('a.btn-floating');
  // await page.click('a[href="/blogs/new"]');

  const label = await page.getInnerHTMLOf('form label');

  expect(label).toEqual('Blog Title');
});

///////////////////////////////////////////////////////////
