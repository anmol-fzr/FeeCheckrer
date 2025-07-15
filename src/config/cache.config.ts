import { createCache, CacheType } from "node-cache-engine";

const cache = createCache({
	size: 100,
	engine: CacheType.LRU,
});

export { cache as cacheClient };
