import { Hono } from "hono";
import { loginStuHndlr, registerStuHndlr } from "../../controller";

const stuAuthRouter = new Hono();

stuAuthRouter
	.post("/login", ...loginStuHndlr)
	.post("/register", ...registerStuHndlr);

export { stuAuthRouter };
