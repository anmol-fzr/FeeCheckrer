import type { Aggregate } from "mongoose";

const getAggrForPagintn = (aggr: Aggregate<unknown>) =>
  structuredClone(aggr.pipeline());

const getRand = (a: number, b: number) =>
  Math.floor(Math.random() * (b - a + a) + a);

export { getAggrForPagintn, getRand };
export * from "./regex";
export * from "./envs";
