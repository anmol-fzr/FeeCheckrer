import { Factory } from "hono/factory";

const { createMiddleware } = new Factory();

const xRespTime = createMiddleware(async (c, next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  c.res.headers.set("X-Response-Time", `${end - start}`);
});

export { xRespTime };
