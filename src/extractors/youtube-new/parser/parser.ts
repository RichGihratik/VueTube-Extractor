import type { Rule, AppliedRule, ObjectToParse, ArrayToParse, PipelineItem, PipelineFn } from './types';

import { parseProps } from './core';

import { applyCondition } from './condition';
import { applyAliases } from './aliases';
import { applyRemap } from './remap';
import { applyFlatten } from './flatten';

// Define all pipeline functions here in order
const PIPELINE_FNS: PipelineFn[] = [
  applyAliases,
  parseProps,
  applyCondition,
  applyRemap,
  applyFlatten
];

export function parseToAny(item: ArrayToParse | ObjectToParse, rule: Rule): any {
  let transformedItem: PipelineItem = { item: structuredClone(item), rule: structuredClone(rule) };
  PIPELINE_FNS.forEach(fn => {
    transformedItem = fn(transformedItem);
  });
  return transformedItem.item;
}

export function parse<const RuleType extends Rule>(item: ObjectToParse | ArrayToParse, rule: RuleType): AppliedRule<RuleType> {
  return parseToAny(item, rule);
}
