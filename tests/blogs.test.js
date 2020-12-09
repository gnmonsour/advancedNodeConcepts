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
describe('When Logged In', () => {
  const selectorLogout = 'a[href="/auth/logout"]';
  beforeEach(async () => {
    await page.login(selectorLogout);
    await page.click('a.btn-floating');
  });
  test(`'New' blog form is visible`, async () => {
    const label = await page.getInnerHTMLOf('form label');

    expect(label).toEqual('Blog Title');
  });

  ///////////////////////////////////////////////////////////
  describe(' - using valid inputs', () => {
    const titleString = 'A Title';
    const contentString = 'Some Content';
    beforeEach(async () => {
      await page.type('.title input', titleString);
      await page.type('.content input', contentString);
      await page.click('button[type="submit"]');
    });

    test(`The 'Review' page appears with valid content`, async () => {
      const reviewTitle = await page.getInnerHTMLOf('h5');
      expect(reviewTitle).toEqual('Please confirm your entries');
    });

    test('Confirming with save adds entry to Blog page', async () => {
      await page.click('button.green');
      await page.waitForSelector('.card');

      const title = await page.getInnerHTMLOf('.card-title');
      const content = await page.getInnerHTMLOf('p');

      expect(title).toEqual(titleString);
      expect(content).toEqual(contentString);
    });
  });

  ///////////////////////////////////////////////////////////
  describe(' - using invalid inputs', () => {
    beforeEach(async () => {
      await page.click('button[type="submit"]');
    });
    test(`'New' blog form shows error message`, async () => {
      const errorTitle = await page.getInnerHTMLOf('form .title .red-text');
      const errorContent = await page.getInnerHTMLOf('form .content .red-text');

      expect(errorTitle).toEqual('You must provide a value');
      expect(errorContent).toEqual('You must provide a value');
    });
  });
});

///////////////////////////////////////////////////////////
describe('When NOT authorized', () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs',
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: { title: 'Mock Title', content: 'Mock Content' },
    },
  ];

  test(' - receive error for unauthorized blog actions', async () => {
    const results = await page.execRequests(actions);

    for (let result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }

    // test(' - unauthorized error message returned when posting blog', async () => {
    //   const result = await page.post('/api/blogs', {
    //     title: 'Mock Title',
    //     content: 'Mock Content',
    //   });
    //   expect(result).toEqual({ error: 'You must log in!' });
    // });

    // test(' - unauthorized error message returned when viewing blog', async () => {
    //   const result = await page.get('/api/blogs');
    //   expect(result).toEqual({ error: 'You must log in!' });
    // });
  });
});

///////////////////////////////////////////////////////////
