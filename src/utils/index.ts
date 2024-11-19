import type { Aggregate } from "mongoose";

const getAggrForPagintn = (aggr: Aggregate<unknown>) =>
  structuredClone(aggr.pipeline());

const getRand = (a: number, b: number) =>
  Math.floor(Math.random() * (b - a + a) + a);

function genOtp() {
  const otp = getRand(123_987, 987_123);
  return otp;
}

export { getAggrForPagintn, getRand, genOtp };
export * from "./regex";
export * from "./envs";
export * from "./logger";
