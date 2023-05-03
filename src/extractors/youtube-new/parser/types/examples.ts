import { type Rule, EParserTypes } from "./common";
import type { AppliedRule } from "./appliedRule";

// Rewritten continuation rule from "../../rules/continuations.const.ts"

const continuation = {
  type: EParserTypes.Object,
  properties: {
    continuation: {
      type: EParserTypes.String,
    },
  },
} as const satisfies Rule;

export const CONTINUATIONS = {
  type: EParserTypes.Array,
  items: {
    type: EParserTypes.Object,
    properties: {
      nextContinuationData: {
        ...continuation,
        aliases: ['reloadContinuationData']
      }
    },
  },
} as const satisfies Rule;

// Examples

const subRule = {
  type: EParserTypes.Object,
  properties: {
    item: {
      type: EParserTypes.Number,
      default: 3,
    },
    item2: {
      required: true,
      type: EParserTypes.Object,
      properties: {
        prop1: {
          type: EParserTypes.String,
          default: 'someDefault',
        },
        prop2: {
          type: EParserTypes.Object,
          properties: {
            prop: {
              type: EParserTypes.Number,
              default: 4
            }
          }
        }
      }
    }
  }
} as const satisfies Rule;

const rule = {
  type: EParserTypes.Object,
  flatten: true,
  keymap: {
    continuation: 'remapedContuniation',
    nonPrimitive: 'remapedNonPrimitive',
  },
  properties: {
    "obj.another.arr[0].obj": {
      type: EParserTypes.String,
      required: true,
    },
    obj: {
      type: EParserTypes.Object,
      properties: {
        prop: {
          type: EParserTypes.Number
        }
      }
    },
    continuation: {
      aliases: ['contAlias'],
      type: EParserTypes.String,
      required: true,
      default: '',
    },
    reloadContinuationData: {
      type: EParserTypes.Number,
      required: false,
    },
    nonPrimitive: {
      ...subRule,
      required: false,
      flatten: true,
    },
  },
} as const satisfies Rule;

function typedFunc<const RuleType extends Rule>(obj: any, rule: RuleType): AppliedRule<RuleType> {
  // ...
  return obj;
}

// Here you can analyse what properties item will have after rule is applied

const item = typedFunc({}, rule);
