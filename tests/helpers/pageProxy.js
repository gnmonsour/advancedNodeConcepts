const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');
///////////////////////////////////////////////////////////
class PageProxy {
  constructor(page) {
    this.page = page;
  }

  ///////////////////////////////////////////////////////////
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();

    // instantiate this
    const pageProxy = new PageProxy(page);

    // wrap this in a meta object
    return new Proxy(pageProxy, {
      get: function (target, property) {
        // order is important, consider condition test of property if result slides
        return pageProxy[property] || browser[property] || page[property];
      },
    });
  }

  ///////////////////////////////////////////////////////////
  async login(selectorLogout) {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('localhost:3000/blogs/');

    await this.page.waitForSelector(selectorLogout);
  }

  ///////////////////////////////////////////////////////////i
  getInnerHTMLOf(selector) {
    // returns promise
    return this.page.$eval(selector, (el) => el.innerHTML);
  }

  ///////////////////////////////////////////////////////////
  // in the following methods, incoming arguments are passed in to the
  // 'evaluate' call signature starting with the second position on
  get(path) {
    return this.page.evaluate((route) => {
      return fetch(route, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());
    }, path);
  }

  post(path, data) {
    return this.page.evaluate(
      (route, body) => {
        return fetch(route, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }).then((res) => res.json());
      },
      path,
      data
    );
  }
}

///////////////////////////////////////////////////////////
module.exports = PageProxy;
