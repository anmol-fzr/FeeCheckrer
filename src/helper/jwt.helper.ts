import { sign } from "hono/jwt";
import { envs } from "../utils";
import { Role } from "../model";

type GetLoginTokenData = {
  _id: string;
  name: string;
  role: Role;
};

type GetStudentLoginTokenData = {
  email: string;
};

type GetStudentFullTokenData = {
  studentId: string;
};

const jwtsHelper = {
  getLoginToken: async (payload: GetLoginTokenData) => {
    const token = await sign(payload, envs.JWT_SECRET);
    return token;
  },

  student: {
    getLoginToken: async (payload: GetStudentLoginTokenData) => {
      const token = await sign(
        { ...payload, role: "student" },
        envs.JWT_SECRET,
      );
      return token;
    },

    getFullToken: async (payload: GetStudentFullTokenData) => {
      const token = await sign(
        { ...payload, role: "student" },
        envs.JWT_SECRET,
      );
      return token;
    },
  },
};

export { jwtsHelper };
