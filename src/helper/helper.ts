import { connnectMongo } from "../config";
import { connectRedis } from "../config/redis.config";

const startup = () => {
  connnectMongo();
  connectRedis();
};

export { startup };
