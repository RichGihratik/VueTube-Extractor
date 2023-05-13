import type { Rule } from "./rule";
import type { IPipelineContext } from "./context";

export type ObjectToParse = Record<string | number | symbol, unknown>;

export type ArrayToParse = Array<unknown>;

export type PipelineItem = { item?: ObjectToParse | ArrayToParse; rule: Rule };

export type PipelineFn = (ctx: IPipelineContext, item: PipelineItem) => PipelineItem;