import { Hono } from "hono";
import { startup } from "./helper";
import { cors } from "hono/cors";
import {
  authRouter,
  adminRouter,
  clerkRouter,
  deptRouter,
  courseRouter,
} from "./router";
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

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", authRouter);
app.route("/admin", adminRouter);
app.route("/clerk", clerkRouter);
app.route("/dept", deptRouter);
app.route("/course", courseRouter);
app.get("/meta", ...getMetaHndlr);

export default app;
