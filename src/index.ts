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
} from "@/router";
import { xRespTime, httpCacheControll, logger } from "@/middleware";
import { requestId } from "hono/request-id";
import { envs } from "./utils";

startup();

const {
	APP_URI: { ADMIN, STUDENT },
	PORT,
} = envs;

const app = new Hono();

app.use(xRespTime);
app.use(etag());

app.use(
	cors({
		origin: [ADMIN, STUDENT],
	}),
);

app.use(requestId());
app.use(logger);

app.on("GET", ["/", "/health"], (c) => c.text("Hello FeeCheckrer!"));

app
	.route("/auth", authRouter)
	.route("/hod", hodRouter)
	.route("/clerk", clerkRouter)
	.route("/students", studentsRouter)
	.route("/fees", feesRouter);

app.use(httpCacheControll);
app.route("/student", studentRouter);

export default {
	port: PORT,
	fetch: app.fetch,
};
