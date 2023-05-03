import { type PipelineItem, type PipelineFn, type ArrayRule, type ObjectRule, EParserTypes as ETypes } from './types';

function applyToObject(rule: ObjectRule) {
  const keysArray = Object.keys(rule);

  for (const key in rule.properties) {
    const ruleProp = rule.properties[key];

    // Recursive rule application
    if (ruleProp.type === ETypes.Array) applyToArray(ruleProp);
    else if (ruleProp.type === ETypes.Object) applyToObject(ruleProp);

    ruleProp.aliases?.forEach(alias => {
      if (keysArray.includes(alias)) throw new Error('Repeated alias!');
      keysArray.push(alias);

      // Deep property clone
      rule.properties[alias] = structuredClone(ruleProp);
    });
  }
}

function applyToArray(rule: ArrayRule) {
  if (rule.items.type === ETypes.Array) applyToArray(rule.items);
  else applyToObject(rule.items);
}

// Transforms rule item with aliases

export const applyAliases: PipelineFn = function (item: PipelineItem) {
  const rule = structuredClone(item.rule);
  if (rule.type === ETypes.Array) applyToArray(rule);
  else applyToObject(rule);
  return { ...item, rule };
};
