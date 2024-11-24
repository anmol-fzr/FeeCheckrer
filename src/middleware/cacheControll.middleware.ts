import { Factory } from "hono/factory";

const { createMiddleware } = new Factory();

const httpCacheControll = createMiddleware(async (c, next) => {
	await next();
	const cacheControll = c.res.headers.get("Cache-Control");
	if (!cacheControll) {
		c.res.headers.set("Cache-Control", "only-if-cached, public, max-age=30");
	}
});

export { httpCacheControll };
