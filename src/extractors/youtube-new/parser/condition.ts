import type { ObjectToParse, ArrayToParse, PipelineItem, PipelineFn } from './types';
import { isObject, isArray } from './typeguards';

export const applyCondition: PipelineFn = function (item: PipelineItem) {

  // TODO: Write conditions
  return item;
};
