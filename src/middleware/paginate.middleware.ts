import { Factory } from "hono/factory";

const { createMiddleware } = new Factory();

const paginator = createMiddleware(async (c, next) => {
	const size = Number.parseInt(c.req.query("size") ?? "10") || 10;
	const page = Number.parseInt(c.req.query("page") ?? "1") || 1;

	c.set("paginator", {
		limit: size,
		skip: (page - 1) * size,
		page,
	});

	await next();
});

export { paginator };
