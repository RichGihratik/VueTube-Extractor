import {
  type ObjectToParse,
  type ArrayToParse,
  type PipelineFn,
  type ObjectRule,
  type ArrayRule,
  EParserTypes as ETypes,
  type PropertyRule,
  isObject,
  isArray,
  isPrimitiveKey,
  isPrimitive,
} from '../core';

import { jsonPathToObject } from './jsonpath';

const OBJ_STRICT_DEFAULT = true;
const REQUIRED_DEFAULT = true;
const ARR_STRICT_DEFAULT = false;

// function parseArray(array: ArrayToParse, rule: ArrayRule) {}

function parseObject(obj: ObjectToParse, rule: ObjectRule): ObjectToParse {
  const result: ObjectToParse = {};

  for (const key in rule.properties) {
    const property = rule.properties[key];

    if (isPrimitiveKey(property)) throw new TypeError('Unssupported syntax!'); // TODO: Implement property key unwrapping

    // Primitive property
    if (isPrimitiveKey(property.type)) {
      const value = jsonPathToObject(key, obj);

      if (!isPrimitive(value, property.type)) {
        const strict = rule.strict ?? OBJ_STRICT_DEFAULT;
        const required = property.required ?? REQUIRED_DEFAULT;
        if (strict && !required) throw new TypeError('Invalid property!'); // TODO: Make error system
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

export const parseProps: PipelineFn = function (ctx, item) {
  // TODO: Write props parsing
  return item;
};
