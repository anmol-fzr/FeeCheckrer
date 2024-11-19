import { envSchema } from "../schema";
import { zodToTs, printNode } from "zod-to-ts";

function genTypeFile() {
  const envSchemaTs = zodToTs(envSchema);

  const envFileText = `declare module "bun" {
    interface Env ${printNode(envSchemaTs.node)} 
  }`;

  const path = "./src/global.d.ts";
  Bun.write(path, envFileText);

  console.log("Env Types Added Successfully");
}

export { genTypeFile };
