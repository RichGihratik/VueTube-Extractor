import type { ObjectToParse, ArrayToParse, PipelineItem, PipelineFn } from './types';
import { isObject, isArray } from './typeguards';

export const applyAliases: PipelineFn = function (item: PipelineItem) {
  // TODO: Write aliases
  return item;
};
