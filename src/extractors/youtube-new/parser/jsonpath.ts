import type { ObjectToParse, ArrayToParse, PipelineItem, PipelineFn } from './types';
import { isObject, isArray } from './typeguards';

export const unwrapJsonpath: PipelineFn = function (item: PipelineItem) {
  // TODO: Implement jsonpath
  return item;
};
