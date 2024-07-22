const Redis = require("ioredis");
const redis = new Redis({
  port: 10235,
  host: "redis-10235.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com",
  username: "default",
  password: process.env.PASSWORD_REDIS,
});

module.exports = redis;
