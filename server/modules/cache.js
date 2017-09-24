const redis = require('redis');
const Promise = require('bluebird');

const config = require('./config');

Promise.promisifyAll(redis.RedisClient.prototype);
const client = redis.createClient(config.redis);

exports.setValue = function setValue(key, value) {
  return client.setAsync(key, value);
};

exports.getValue = function getValue(key) {
  return client.getAsync(key);
};

exports.clear = function clear(id) {
  const key = `USER_${id}`;
  client.del(key);
};
