const { RateLimiterRedis } = require("rate-limiter-flexible");
const {
  responseStatus,
  msgConstant,
  ipLimiterConfig,
} = require("./appConstants");
const utils = require("./utils");
const Redis = require("ioredis");

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

function createTokenBucketLimiter({
  keyPrefix = "tb",
  capacity,
  refillIntervalMs = 60000,
  keyGenerator = (req) => req.ip,
}) {
  const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix,
    points: capacity,
    duration: refillIntervalMs / 1000,
  });

  return async (req, res, next) => {
    const key = keyGenerator(req);

    const blockKey = `block:${key}`;
    const violKey = `viol:${key}`;

    //  Check if blocked
    const ttl = await redisClient.ttl(blockKey);
    if (ttl > 0) {
      return res.status(responseStatus.tooManyRequests).json(
        utils.createErrorResponse(req, {
          message: msgConstant.blockedIp,
          blockedFor: ttl,
        }),
      );
    }

    try {
      const resLimit = await limiter.consume(key, 1);

      res.setHeader("X-RateLimit-Limit", capacity);
      res.setHeader("X-RateLimit-Remaining", resLimit.remainingPoints);

      next();
    } catch (rejRes) {
      if (rejRes instanceof Error) return next(rejRes);

      // Increment violations
      const violations = await redisClient.incr(violKey);
      await redisClient.expire(violKey, 3600);

      // Block after 5 violations
      if (violations >= ipLimiterConfig.maxViolations) {
        await redisClient.set(blockKey, 1, "EX", ipLimiterConfig.blockDuration);
        await redisClient.del(violKey);
      }

      return res.status(responseStatus.tooManyRequests).json(
        utils.createErrorResponse(req, {
          message: msgConstant.tooManyRequests,
          violations,
          blockedFor:
            violations >= ipLimiterConfig.maxViolations
              ? ipLimiterConfig.blockDuration
              : 0,
        }),
      );
    }
  };
}

module.exports = { createTokenBucketLimiter };
