// const mongoose = require("mongoose");
const { RateLimiterMemory } = require("rate-limiter-flexible");

const maxConsecutiveFailsByUsername = 5;
const maxByIp = 100;

const getRetryAfter = (limiter) =>
  String(Math.round(limiter.msBeforeNext / 1000)) || 1;

const consume = async (res, limiter, key) => {
  try {
    await limiter.consume(key);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).end();
    } else {
      res.set("Retry-After", getRetryAfter(error));
      return res.status(429).send("Too Many Requests");
    }
    return false;
  }
  return true;
};

const limiterConsecutiveFailsByUsername = new RateLimiterMemory({
  keyPrefix: "login_fail_consecutive_username",
  points: maxConsecutiveFailsByUsername,
  duration: 60 * 60 * 2, // Store number for two hours since first fail
  blockDuration: 60 * 15, //15 minutes
});
const SlowBruteByIP = new RateLimiterMemory({
  keyPrefix: "login_fail_ip_per_day",
  points: maxByIp,
  duration: 60 * 60 * 24, //one day
  blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
});

exports.SlowBruteByIP = SlowBruteByIP;
exports.maxByIp = maxByIp;
exports.limiterConsecutiveFailsByUsername = limiterConsecutiveFailsByUsername;
exports.maxConsecutiveFailsByUsername = maxConsecutiveFailsByUsername;
exports.consume = consume;
exports.getRetryAfter = getRetryAfter;
