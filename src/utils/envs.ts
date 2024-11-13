const env = process.env;

const envs = {
  AMQP_URI: process.env.AMQP_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT ?? 3000,
  MONGO_URI: process.env.MONGO_URI,

  REDIS: {
    PORT: env.REDIS_PORT ?? 6379,
    HOST: env.REDIS_HOST,
  },

  MINIO: {
    IP: env.MINIO_IP,
    HOST: env.MINIO_HOST,
    PORT: env.MINIO_PORT,
    ACCESS_KEY: env.MINIO_ACCESS_KEY,
    SECRET_KEY: env.MINIO_SECRET_KEY,
  },
};

export { envs };
