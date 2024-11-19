import { Factory } from "hono/factory";
import * as Utils from "@/utils";

const { createMiddleware } = new Factory();

const logger = createMiddleware(async (c, next) => {
  Utils.logger.info("REQUEST", {
    req: {
      path: c.req.path,
      requestId: c.get("requestId"),
    },
  });
  await next();
});

export { logger };
