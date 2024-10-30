import { Hono } from "hono";
import { loginHndlr, updateAccountHndlr } from "../controller";

const authRouter = new Hono();

authRouter.post("/login", ...loginHndlr).patch("/", ...updateAccountHndlr);

export { authRouter };
