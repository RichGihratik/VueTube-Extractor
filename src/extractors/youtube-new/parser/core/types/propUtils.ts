import type { PropertyRule, IndexTypeMap, PrimitivePropertyRule, ObjectRule, ConditionalFn, ArrayRule } from './rule';

export type ObjectRuleProps<Rule extends ObjectRule> = Rule['properties'];

export type RuleKeymap<Rule extends ObjectRule> = Rule['keymap']; 

export type ArrayItemType<Rule extends ArrayRule> = Rule['items'];

export type PropDefaultSet<Prop extends PropertyRule, First, Second> = Prop extends PrimitivePropertyRule
  ? Prop extends { default: IndexTypeMap<Prop['type']> }
    ? First
    : Second
  : Second;

export type RuleStrictMode<Rule extends ObjectRule, First, Second> = Rule extends { strict: false } ? Second : First;

export type PropRequired<Prop extends PropertyRule, First, Second> = Prop extends { required: false } ? Second : First;

type ConditionalKeysSet<Rule extends ObjectRule> = keyof {
  [Key in keyof ObjectRuleProps<Rule> as ObjectRuleProps<Rule>[Key] extends PrimitivePropertyRule
    ? ObjectRuleProps<Rule>[Key] extends { expected: IndexTypeMap<ObjectRuleProps<Rule>[Key]['type']> }
      ? Key
      : never
    : never]: unknown;
};

type HasConditionalKeysSet<Rule extends ObjectRule, First, Second> = ConditionalKeysSet<Rule> extends never ? Second : First;

export type HasCondition<Rule extends ObjectRule, First, Second> = Rule extends { condition: ConditionalFn }
  ? First
  : HasConditionalKeysSet<Rule, First, Second>;
