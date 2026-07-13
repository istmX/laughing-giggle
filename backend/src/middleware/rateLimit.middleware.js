import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || "";
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || "";

let redis = null;
if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
}

export const globalRateLimiter = async (req, res, next) => {
  if (!redis) {
    return next();
  }
  
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const key = `rate_limit_api_${ip}`;
  const limit = 100; // 100 requests per window
  const windowMs = 60000; // 1 minute window

  try {
    const [response] = await redis.pipeline()
      .incr(key)
      .expire(key, windowMs / 1000)
      .exec();
    
    if (response > limit) {
      return res.status(429).json({ error: "Too many requests, please try again later." });
    }
    
    res.set({
      'RateLimit-Limit': limit,
      'RateLimit-Remaining': Math.max(0, limit - response),
      'RateLimit-Reset': Math.ceil(Date.now() / 1000) + (windowMs / 1000)
    });

    next();
  } catch (error) {
    console.error("Redis rate limit error:", error);
    next();
  }
};
