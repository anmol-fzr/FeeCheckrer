import { sign } from "hono/jwt";
import { envs } from "../utils";
import { Role } from "../model";

type GetLoginTokenData = {
  _id: string;
  name: string;
  role: Role;
};

type GetStudentTokenData = {
  _id: string;
};

const jwtsHelper = {
  getLoginToken: async (payload: GetLoginTokenData) => {
    const token = await sign(payload, envs.JWT_SECRET);
    return token;
  },

  getStudentToken: async (payload: GetStudentTokenData) => {
    const token = await sign(payload, envs.JWT_SECRET);
    return token;
  },
};

export { jwtsHelper };
