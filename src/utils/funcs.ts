import type { Aggregate } from "mongoose";

function getAggrForPagintn<T extends unknown>(aggr: Aggregate<T>) {
	return structuredClone(aggr.pipeline());
}

function getRand(a: number, b: number) {
	return Math.floor(Math.random() * (b - a + a) + a);
}

function genOtp() {
	const otp = getRand(123_987, 987_123);
	return otp;
}

export { getAggrForPagintn, getRand, genOtp };
