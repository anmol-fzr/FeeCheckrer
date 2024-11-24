import type { Context } from "hono";
import { getChildLogger } from "@/utils";
import type { BlankEnv, BlankPath } from "../types";

type Ctx = Context<BlankEnv, BlankPath>;

const badReq = (c: Ctx, message: string, error?: unknown) => {
	const requestId = c.get("requestId");

	const logger = getChildLogger(requestId);

	logger.error(message, {
		error,
	});

	return c.json(
		{
			error,
			data: null,
			message,
		},
		400,
	);
};

const unauth = (c: Ctx) => {
	const requestId = c.get("requestId");

	const logger = getChildLogger(requestId);
	const message = "Unauthorized";

	logger.error(message, {
		error: message,
	});

	return c.json(
		{
			data: null,
			message,
		},
		401,
	);
};

const notFound = (c: Ctx, message: string) => {
	return c.json(
		{
			data: null,
			message,
		},
		404,
	);
};

const serverError = (c: Ctx, message: string, error?: unknown) => {
	return c.json(
		{
			error,
			data: null,
			message,
		},
		500,
	);
};

export { badReq, unauth, notFound, serverError };
