import { Hono } from "hono";
import { loginHndlr } from "../controller";

const authRouter = new Hono();

authRouter.post("/login", ...loginHndlr);

export { authRouter };
