import { type PipelineItem, type PipelineFn, type ArrayRule, type ObjectRule, EParserTypes as ETypes } from './types';
import { isPrimitiveKey } from "./typeguards";

function applyToObject(rule: ObjectRule) {
  const keysArray = Object.keys(rule);

  for (const ruleProp of Object.values(rule.properties)) {
    if (isPrimitiveKey(ruleProp)) continue;

    // Recursive rule application
    if (ruleProp.type === ETypes.Array) applyToArray(ruleProp);
    else if (ruleProp.type === ETypes.Object) applyToObject(ruleProp);

    ruleProp.aliases?.forEach(alias => {
      // TODO: Implement Error handling
      if (keysArray.includes(alias)) throw new Error('Repeated alias!');
      keysArray.push(alias);

      // Deep property clone
      rule.properties[alias] = structuredClone(ruleProp);
    });
  }
}

function applyToArray(rule: ArrayRule) {
  if (isPrimitiveKey(rule.items)) return;

  if (rule.items.type === ETypes.Array) applyToArray(rule.items);
  else if (rule.items.type === ETypes.Object) applyToObject(rule.items);
}

// Transforms rule item with aliases

export const applyAliases: PipelineFn = function (item: PipelineItem) {
  const rule = structuredClone(item.rule);
  if (rule.type === ETypes.Array) applyToArray(rule);
  else applyToObject(rule);
  return { ...item, rule };
};
