import { Hono } from "hono";
import { stuAuthRouter, stuFeeRouter, stuProfileRouter } from "./student";

const studentRouter = new Hono();

studentRouter
  .route("/auth", stuAuthRouter)
  .route("/profile", stuProfileRouter)
  .route("/fee", stuFeeRouter);

export { studentRouter };
