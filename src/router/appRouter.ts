import { Hono } from "hono";
import { ref, child, get } from "firebase/database";
import { fbRealTimeDB } from "../config";

const appRouter = new Hono();

appRouter.patch("/", async (c) => {
  const dbRef = ref(fbRealTimeDB);
  const snapshot = await get(child(dbRef, `settings`));
  const settings = snapshot.val();

  c.res.headers.set("Cache-Control", `only-if-cached, public, max-age=3600`);

  return c.json({
    data: settings,
  });
});

export { appRouter };
