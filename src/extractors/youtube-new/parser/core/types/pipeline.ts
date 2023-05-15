import type { Rule } from "./rule";
import type { IPipelineContext } from "./context";

export type ObjectToParse = Record<string | number, unknown>;

export type ArrayToParse = Array<unknown>;

export type PipelineItem = { item: unknown; rule: Rule };

export type PipelineFn = (ctx: IPipelineContext, item: PipelineItem) => PipelineItem;