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

export const rateLimitMiddleware = async (req, res, next) => {
  if (!redis) {
    return next();
  }
  
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const key = `rate_limit_playground_${ip}`;
  const limit = 10;
  const windowMs = 60000;

  try {
    const [response] = await redis.pipeline()
      .incr(key)
      .expire(key, windowMs / 1000)
      .exec();
    
    if (response > limit) {
      return res.status(429).json({ error: "Too many requests, please try again later." });
    }
    next();
  } catch (error) {
    console.error("Redis rate limit error:", error);
    next();
  }
};
