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

const now = () => Math.floor(Date.now() / 1000);

function getCommons() {
  return {
    iat: now(),
  };
}

const jwtsHelper = {
  user: {
    getLoginToken: async (payload: GetLoginTokenData) => {
      const token = await sign(payload, envs.JWT_SECRET);
      return token;
    },
  },
  student: {
    getRefreshToken: async (payload: GetStudentLoginTokenData) => {
      const common = getCommons();
      const token = await sign(
        {
          ...common,
          ...payload,
          aud: "STUDENT_REFRESH",
          role: "student",
        },
        envs.JWT_SECRET,
      );
      return token;
    },

    getLoginToken: async (payload: GetStudentLoginTokenData) => {
      const common = getCommons();
      const token = await sign(
        {
          ...common,
          ...payload,
          aud: "STUDENT_OTP_VERIFIED",
          role: "student",
        },
        envs.JWT_SECRET,
      );
      return token;
    },

    getFullToken: async (payload: GetStudentFullTokenData) => {
      const common = getCommons();
      const token = await sign(
        {
          ...common,
          ...payload,
          aud: "STUDENT_FULL",
          role: "student",
        },
        envs.JWT_SECRET,
      );
      return token;
    },
  },
};

export { jwtsHelper };
