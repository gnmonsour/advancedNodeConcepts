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
      headless: true,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();

    // instantiate this
    const pageProxy = new PageProxy(page);

    // wrap this in a meta object
    return new Proxy(pageProxy, {
      get: function (target, property) {
        if (property === 'close' && pageProxy.user !== undefined) {
          // console.log(`close called, deleting user: ${pageProxy.user._id}`);
          userFactory.deleteUser(pageProxy.user._id);
        }
        // order is important, consider condition test of property if result slides
        return pageProxy[property] || browser[property] || page[property];
      },
    });
  }

  ///////////////////////////////////////////////////////////
  async login(selectorLogout) {
    this.user = await userFactory.createUser();
    const { session, sig } = sessionFactory(this.user);

    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('http://localhost:3000/blogs/');

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

  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  }
}

///////////////////////////////////////////////////////////
module.exports = PageProxy;
