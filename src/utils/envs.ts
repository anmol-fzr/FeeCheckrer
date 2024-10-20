const envs = {
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  PORT: process.env.PORT ?? 3000,
  MONGO_URI: process.env.MONGO_URI ?? "",
};

export { envs };
