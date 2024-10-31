import { Hono } from "hono";
import { getProfileHndlr, updateProfileHndlr } from "../../controller";

const stuProfileRouter = new Hono();

stuProfileRouter.get("/", ...getProfileHndlr).patch(...updateProfileHndlr);

export { stuProfileRouter };
