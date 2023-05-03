import type { Rule, AppliedRule, ObjectToParse, ArrayToParse, PipelineItem, PipelineFn } from './types';

import { applyCondition } from './condition';
import { applyAliases } from './aliases';
import { parseProps } from './props';
import { unwrapJsonpath } from './jsonpath';
import { applyRemap } from './remap';
import { applyFlatten } from './flatten';

// Define all pipeline functions here in order
const PIPELINE_FNS: PipelineFn[] = [
  applyCondition,
  applyAliases,
  unwrapJsonpath,
  parseProps,
  applyRemap,
  applyFlatten
];

export function parseToAny(item: ArrayToParse | ObjectToParse, rule: Rule): any {
  let transformedItem: PipelineItem = { item, rule };
  PIPELINE_FNS.forEach(fn => {
    transformedItem = fn(transformedItem);
  });
  return transformedItem.item;
}

export function parse<const RuleType extends Rule>(item: ObjectToParse | ArrayToParse, rule: RuleType): AppliedRule<RuleType> {
  return parseToAny(item, rule);
}
