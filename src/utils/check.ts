import { envSchema } from "../schema";
// import { genTypeFile } from "./gen-types";
import { validateEnv } from "@universal-env/core";

const rawEnv = process.env;

(async function () {
	await validateEnv(envSchema, rawEnv, "./file.d.ts");
})();

console.log(rawEnv);

// envSchema
// 	.parseAsync(rawEnv)
// 	.then(() => {
// 		console.log("Envs Validated Successfully");
// 		genTypeFile();
// 		process.exit(0);
// 	})
// 	.catch((err) => {
// 		console.error(err);
// 		process.exit(1);
// 	});
