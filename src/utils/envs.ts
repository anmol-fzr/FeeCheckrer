const env = process.env;

const envs = {
  AMQP_URI: process.env.AMQP_URI ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  PORT: process.env.PORT ?? 3000,
  MONGO_URI: process.env.MONGO_URI ?? "",

  REDIS: {
    PORT: Number(env.REDIS_PORT) ?? 6379,
    HOST: env.REDIS_HOST ?? "redis",
  },
};

export { envs };
