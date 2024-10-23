import { Hono } from "hono";
import { startup } from "./helper";
import { cors } from "hono/cors";
import { authRouter, clerkRouter, hodRouter } from "./router";
import { logger } from "hono/logger";
import { getMetaHndlr } from "./controller";

startup();

const app = new Hono();
app.use(
  cors({
    origin: "*",
  }),
);

app.use(logger());

// Health Route
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", authRouter);
app.route("/hod", hodRouter);
app.route("/clerk", clerkRouter);
app.get("/meta", ...getMetaHndlr);

export default app;
