import { Context } from "hono";
import { getChildLogger } from "@/utils";

const badReq = (c: Context<any, any>, message: string, error?: any) => {
  const requestId = c.get("requestId");

  const logger = getChildLogger(requestId);

  logger.error(message, {
    error,
  });

  return c.json(
    {
      error,
      data: null,
      message,
    },
    400,
  );
};

const unauth = (c: Context<any, any>) => {
  const requestId = c.get("requestId");

  const logger = getChildLogger(requestId);
  const message = "Unauthorized";

  logger.error(message, {
    error: message,
  });

  return c.json(
    {
      data: null,
      message,
    },
    401,
  );
};

const notFound = (c: Context<any, any>, message: string) => {
  return c.json(
    {
      data: null,
      message,
    },
    404,
  );
};

const serverError = (c: Context<any, any>, message: string, error?: any) => {
  return c.json(
    {
      error,
      data: null,
      message,
    },
    500,
  );
};

export { badReq, unauth, notFound, serverError };
