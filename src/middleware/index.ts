import { createFactory } from "hono/factory";
import { jwt as rawJwt } from "hono/jwt";
import { envs } from "../utils";

const { createMiddleware } = createFactory();

const jwt = createMiddleware(async (c, next) => {
  const jwtMiddleware = rawJwt({
    secret: envs.JWT_SECRET,
  });
  return jwtMiddleware(c, next);
});

export { jwt };
export * from "./role.middleware";
export * from "./paginate.middleware";
export * from "./respTime.middleware";
export * from "./cacheControll.middleware";
export * from "./logger.middleware";
