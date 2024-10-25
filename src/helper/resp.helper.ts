import { Context } from "hono";

const unauth = (c: Context<any, any>) => {
  return c.json(
    {
      data: null,
      message: "Unauthorized",
    },
    401,
  );
};

export { unauth };
