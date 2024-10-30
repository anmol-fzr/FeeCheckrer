import { Hono } from "hono";
import { startup } from "./helper";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import {
  authRouter,
  clerkRouter,
  hodRouter,
  studentRouter,
  studentsRouter,
  feesRouter,
} from "./router";
import { logger } from "hono/logger";
import { xRespTime, httpCacheControll } from "./middleware";

startup();

const app = new Hono();

app.use(xRespTime);

app.use(
  cors({
    origin: "*",
  }),
);

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app
  .route("/auth", authRouter)
  .route("/hod", hodRouter)
  .route("/clerk", clerkRouter)
  .route("/student", studentRouter)
  .route("/students", studentsRouter)
  .route("/fees", feesRouter);

//app.get("/meta", ...getMetaHndlr);

export default app;
