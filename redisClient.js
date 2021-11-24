const IORedis = require('ioredis');
const config = require('config')

const redis = new IORedis(config.redis);

module.exports = { redis }