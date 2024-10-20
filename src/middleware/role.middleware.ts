import { MiddlewareHandler } from "hono";
import { Role } from "../model";

const byRole = (allowedRole: Role | Role[]): MiddlewareHandler => {
  return async function roler(c, next) {
    const payload = c.get("jwtPayload");
    const role: Role = payload.role;

    if (Array.isArray(allowedRole)) {
      if (!allowedRole.includes(role)) {
        return c.json(
          {
            message: "Unauthorized",
          },
          401,
        );
      }
    } else if (role !== allowedRole) {
      return c.json(
        {
          message: "Unauthorized",
        },
        401,
      );
    }
    await next();
  };
};

export { byRole };
