import { Redis } from "ioredis";

const redis = new Redis({
  host: "redis",
  port: 6379,
});

const connectRedis = () => {
  redis.on("connect", () => {
    console.log("Redis Connected");
  });
};

export { redis as redisClient, connectRedis };
