# Advanced Node Concepts

Tutorial at Udemy by Stephen Grinder

## Testing

Using jest and puppeteer

Interaction with browser includes

- clicking,
- verifying selectors content,
- mocking login with session cookies

Centralize authentication logic into a factory function.

Factory: function that generates a resource for testing.

One factory for session (session and signature). Another for users.

Added setup for jest configuration

Added cleanup of mock user

MongoDB cleanup commands:

```js
db.users.deleteMany({ googleId: { $exists: 0 } }); // where the id is mocked

db.blogs.deleteMany({ title: { $eq: 'A Title' } }); // the mock blog title field
```
