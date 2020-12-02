const mongoose = require('mongoose');
const util = require('util');
const redis = require('redis');

///////////////////////////////////////////////////////////
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

///////////////////////////////////////////////////////////
const { exec } = mongoose.Query.prototype;

///////////////////////////////////////////////////////////
mongoose.Query.prototype.cache = function (options = {}) {
  console.log('cache flag on');
  this.useCache = true;
  this.topLevelHashKey = JSON.stringify(options.key || '');
  return this; // make chainable
};

///////////////////////////////////////////////////////////
mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    // console.log('direct query');
    return await exec.apply(this, arguments); // call original saved above
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );
  console.log('key', key);
  // does 'key' exist in redis
  const cacheValue = await client.hget(this.topLevelHashKey, key);

  // yes? return hydrated cache
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    // document may be an array of objects
    return Array.isArray(doc)
      ? doc.map((one) => new this.model(one))
      : new this.model(doc);
  }

  // no, issue query and store result in redis at key
  const results = await exec.apply(this, arguments);
  // console.log(results);

  client.hset(this.topLevelHashKey, key, JSON.stringify(results));

  return results;
};

module.exports = {
  clearHashCache(hashKey) {
    // console.log('clearing cache', hashKey);
    client.del(JSON.stringify(hashKey));
  },
};
