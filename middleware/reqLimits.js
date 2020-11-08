const {
  maxByIp,
  SlowBruteByIP,
  consume,
  getRetryAfter,
  limiterConsecutiveFailsByUsername,
} = require("../utilities/limiter");

const byIp = async (req, res, next) => {
  const ip = req.ip;
  const numTries = await SlowBruteByIP.get(ip);
  if (numTries && numTries.consumedPoints > maxByIp) {
    res.set("Retry-After", getRetryAfter(numTries));
    return res.status(429).send("Too Many Requests");
  }
  const succuss = await consume(res, SlowBruteByIP, ip);
  if (succuss) next();
};

const byUsername = async (req, res, next) => {
  const userLimiter = await limiterConsecutiveFailsByUsername.get(req.email);
  const limitReached =
    userLimiter && userLimiter.consumedPoints > maxConsecutiveFailsByUsername;
  if (limitReached) {
    const retrySecs = Math.round(userLimiter.msBeforeNext / 1000) || 1;
    res.set("Retry-After", String(retrySecs));
    return res.status(429).send("Too Many Requests");
  }
  req.userLimiter = userLimiter;
  next();
};

module.exports.byUsername = byUsername;
module.exports.byIp = byIp;
