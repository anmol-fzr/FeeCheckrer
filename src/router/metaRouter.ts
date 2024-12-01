import { Hono } from "hono";
import { byRole, jwt } from "../middleware";
import { getFeeTypeHndlr, createFeeTypeHndlr } from "@/controller";

const metaRouter = new Hono();

metaRouter.use(jwt);

metaRouter.use("*", async (c, next) => {
	await next();
	c.res.headers.set("Cache-Control", "public, max-age=3600");
});

metaRouter
	.get("/fee-type", ...getFeeTypeHndlr)
	.use(byRole("superadmin"))
	.post(...createFeeTypeHndlr);

export { metaRouter };
