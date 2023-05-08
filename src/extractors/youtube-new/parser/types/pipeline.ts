import { Rule } from "./common";

export type ObjectToParse = Record<string | number | symbol, unknown>;

export type ArrayToParse = Array<unknown>;

export type PipelineItem = { item?: ObjectToParse | ArrayToParse; rule: Rule };

export type PipelineFn = (item: PipelineItem) => PipelineItem;