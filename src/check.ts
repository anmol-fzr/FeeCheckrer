import {} from "zod";
import { envSchema } from "./schema";

const rawEnv = process.env;

envSchema
  .parseAsync(rawEnv)
  .then((res) => {
    console.log(res);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
