import Redis from "ioredis";
const redisKey = process.env.REDIS_KEY;
if (!redisKey) {
  throw new Error("REDIS_KEY environment variable is not defined");
}
export const redisClient = new Redis(redisKey);
