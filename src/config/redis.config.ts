import { Redis } from "ioredis";
import { envs } from "../utils";

const redis = new Redis({
  host: envs.REDIS.HOST,
  port: envs.REDIS.PORT,
});

const connectRedis = () => {
  redis.on("connect", () => {
    console.log("Redis Connected");
  });
};

export { redis as redisClient, connectRedis };
