import { Hono } from "hono";
import {
  getProfileHndlr,
  newProfileHndlr,
  updateProfileHndlr,
} from "../../controller";

const stuProfileRouter = new Hono();

stuProfileRouter
  .get("/", ...getProfileHndlr)
  .post(...newProfileHndlr)
  .patch(...updateProfileHndlr);

export { stuProfileRouter };
