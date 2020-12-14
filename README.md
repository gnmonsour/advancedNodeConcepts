# Advanced Node Concepts

Tutorial at Udemy by Stephen Grinder

## Caching

Using Redis

### flushing the cache

```cmd
c:\dev\cache> node
> const redis = require('redis')
> const redisUrl = `redis://127.0.0.1:6379`
> const client = redis.createClient(redisUrl)
> client.flushall()

```

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

## Continuous Integration | `CI`

**System of merging code changes into a single main branch**

_**CI Server:** A server that runs automatic tests the codebase to ensure against broken or regressive behaviour_

Greatest benefit comes in scenarios where there are multiple developers or a complex codebase.

The CI system flow:

- Developer pushes code to repository s/a github
- CI server detects the push
- CI server clones project to cloud-based virtual machine
- CI server runs all tests
- If all tests pass CI server marks the build as 'passing' and follows-up with _messaging | deployment | prescribed actions_

### CI Setup

#### Requirements

- github
- git command knowledge
- patience

#### Providers

- Travis CI
- Circle CI
- Codeship
- AWS Codebuild

Travis & Circle are very similar, Travis is most popular.

AWS Codebuild generally used with AWS suite and repository. Codeship is also an enterprise level product.

### Working with Travis

- Detects pushed code
- Clones project
- Runs tests based on `.travis.yml` configuration file
- Sends and email

#### YAML

YAML is a simple way to write JSON `name-value` pairs. There are online automatic convertors. Use these to see equivalents.

Simple syntax

- using indents to nest
- arrays use dashes for values

#### Travis YAML

READ the DOCS!! docs.travis-ci.com

Start with `.travis.yml` at root of project.

Contents

1. start with language
2. next version of language
3. distribution
   - _(for our purpose we use a small linux dist known as `trusty`)_
4. services
   - _s/a mongodb, redis ..._
5. env
   - _environment specific needs_
6. cache
   - _avoid rebuilding node_modules every time the clone occurs_

```yml
language: node_js
node_js:
  - '8'
dist: trusty
services:
  - mongodb
  - redis-server
env:
  - NODE_ENV=ci
cache:
  directories:
    - node_modules
    - client/node_modules
install:
  - npm install
  - npm run build # used for production & ci environment
script:
  - nohup npm run start & # doesn't work in window n
  - sleep 3 # wait for server to start
  - npm run test
```

`nohup` - if shell is closed don't kill running process
`&` - run subshell

- Altered the environment keys to faciliate the `ci` enviroment and fulfill the others.
- Added `ci` environment to the express server path includes so `client/build` path is visible.
- Ensured all urls for services include prefix `http://`.
- Switched puppeteer launch to `headless: true` and added `args: ['--no-sandbox']` to the pageProxy build statement.

## AWS setup

Aim: do not store credentials

bucket name: blogster-dev
region: ca-central-1

policy: blogster-s3-policy
user: s3-blogster-dev

access-key id and secret access-key hidden in dev config (not uploaded)

install aws-sdk

create route to get the pre-signed url

- s3.getSignedUrl('putObject', {}, )
