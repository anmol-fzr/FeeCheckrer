import { createFactory } from "hono/factory";

const { createHandlers } = createFactory();

const getMetaHndlr = createHandlers(async (c) => {
	return c.json({
		data: [],
	});
});

export { getMetaHndlr };
