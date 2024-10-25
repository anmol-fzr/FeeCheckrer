import { Hono } from "hono";
import { stuAuthRouter, stuProfileRouter } from "./student";

const studentRouter = new Hono();

studentRouter.route("/profile", stuProfileRouter).route("/auth", stuAuthRouter);

export { studentRouter };
