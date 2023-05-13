import type { PropertyRule, ObjectRule, ArrayRule, TypeMap, Rule, PrimitivePropertyRule, ObjectProps, ArrayItemType } from './core';
import type { RuleKeyRemap } from './remap';
import type { AppliedCondition } from './condition';
import type { AppliedRuleAliases } from './aliases';
import type { AppliedFlattenObjectRule } from './flatten';
import type { Expand } from './utils';

export type IndexType<Prop extends PropertyRule> = Prop extends keyof TypeMap
  ? TypeMap[Prop]
  : Prop extends PrimitivePropertyRule
  ? TypeMap[Prop['type']]
  : Prop extends ObjectRule
  ? AppliedObjectRule<Prop>
  : Prop extends ArrayRule
  ? AppliedArrayRule<Prop>
  : never;

type AppliedObjectRuleWithoutCondition<Rule extends ObjectRule> = Expand<
  ObjectProps<AppliedFlattenObjectRule<RuleKeyRemap<AppliedRuleAliases<Rule>>>>
>;

export type AppliedObjectRule<Rule extends ObjectRule> = AppliedCondition<Rule, AppliedObjectRuleWithoutCondition<Rule>>;

// If object condition is inside array rule, then have to remove object
// from the array, and it cant be nullable

export type AppliedArrayRule<Rule extends ArrayRule> = ArrayItemType<Rule> extends ObjectRule
  ? AppliedObjectRuleWithoutCondition<ArrayItemType<Rule>>[]
  : ArrayItemType<Rule> extends ArrayRule
  ? AppliedRule<ArrayItemType<Rule>>[]
  : IndexType<ArrayItemType<Rule>>[];

export type AppliedRule<RuleType extends Rule> = RuleType extends ObjectRule
  ? AppliedObjectRule<RuleType>
  : RuleType extends ArrayRule
  ? AppliedArrayRule<RuleType>
  : never;
