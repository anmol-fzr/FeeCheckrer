import { envSchema } from "../schema";
import { genTypeFile } from "./gen-types";

const rawEnv = process.env;

envSchema
  .parseAsync(rawEnv)
  .then(() => {
    console.log("Envs Validated Successfully");
    genTypeFile();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
