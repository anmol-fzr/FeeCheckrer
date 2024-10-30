import type { Aggregate } from "mongoose";

const getAggrForPagintn = (aggr: Aggregate<unknown>) =>
  structuredClone(aggr.pipeline());

export { getAggrForPagintn };
export * from "./regex";
export * from "./envs";
