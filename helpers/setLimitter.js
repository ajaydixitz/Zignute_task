const { createTokenBucketLimiter } = require("./limiter");

// 1 Per-User
const freeUserLimiter = createTokenBucketLimiter({
  keyPrefix: "tb:user:free",
  capacity: process.env.FREE_USER_MAX_REQUESTS || 100,
  refillAmount: process.env.FREE_USER_MAX_REQUESTS || 100,
  refillIntervalMs: 60 * 1000,
  keyGenerator: (req) => `user:${req.user?._id}`,
});

const paidUserLimiter = createTokenBucketLimiter({
  keyPrefix: "tb:user:paid",
  capacity: process.env.PREMIUM_USER_MAX_REQUESTS || 1000,
  refillAmount: process.env.PREMIUM_USER_MAX_REQUESTS || 1000,
  refillIntervalMs: 60 * 1000,
  keyGenerator: (req) => `user:${req.user?._id}`,
});

// 2 Per IP
const ipLimiter = createTokenBucketLimiter({
  keyPrefix: "tb:ip",
  capacity: process.env.MAX_REQUESTS_PER_IP || 200,
  refillAmount: process.env.MAX_REQUESTS_PER_IP || 200,
  refillIntervalMs: 60 * 1000,
  keyGenerator: (req) => `ip:${req.ip}`,
});

// 3️ Login
const loginLimiter = createTokenBucketLimiter({
  keyPrefix: "tb:login",
  capacity: process.env.LOGIN_RETRY_LIMIT || 10,
  refillAmount: process.env.LOGIN_RETRY_LIMIT || 10,
  refillIntervalMs: 60 * 1000,
  keyGenerator: (req) => `login:${req.ip}`,
});

const dynamicUserLimiter = (req, res, next) => {
  // Decide limiter
  if (req?.admin) return next();
  console.log("User in dynamic limiter:", req?.user);
  const limiter = req.user.isPaid ? paidUserLimiter : freeUserLimiter;
  limiter(req, res, next);
};

module.exports = {
  ipLimiter,
  loginLimiter,
  dynamicUserLimiter,
};
