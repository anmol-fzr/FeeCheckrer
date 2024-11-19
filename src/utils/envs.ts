const env = process.env;

const envs = Object.freeze({
  isDev: env.MODE === "DEV",

  AMQP_URI: env.AMQP_URI,
  JWT_SECRET: env.JWT_SECRET,
  PORT: env.PORT ?? 3000,
  MONGO_URI: env.MONGO_URI,

  REDIS: Object.freeze({
    PORT: env.REDIS_PORT ?? 6379,
    HOST: env.REDIS_HOST,
  }),

  MINIO: Object.freeze({
    IP: env.MINIO_IP,
    HOST: env.MINIO_HOST,
    PORT: env.MINIO_PORT,
    ACCESS_KEY: env.MINIO_ACCESS_KEY,
    SECRET_KEY: env.MINIO_SECRET_KEY,
  }),
});

export { envs };
