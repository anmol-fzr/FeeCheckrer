import { Hono } from "hono";
import {
	createDefaultAdminHndlr,
	loginHndlr,
	updateAccountHndlr,
} from "../controller";

const authRouter = new Hono();

authRouter
	.post("/login", ...loginHndlr)
	.post("/new-admin", ...createDefaultAdminHndlr)
	.get("/login", async (c) => {
		return c.json({ message: "wow" });
	})
	.patch("/", ...updateAccountHndlr);

export { authRouter };
