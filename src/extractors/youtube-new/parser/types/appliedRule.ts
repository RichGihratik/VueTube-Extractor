import type { PropertyRule, ObjectRule, ArrayRule, TypeMap, Rule, PrimitivePropertyRule } from "./common";
import type { RuleKeyRemap } from "./remap";
import type { ObjectProps } from "./objectProps";
import type { AppliedCondition } from "./condition";
import type { AppliedRuleAliases } from "./aliases";
import type { AppliedFlattenObjectRule } from "./flaten";
import type { Expand } from "./utils";

export type IndexType<Prop extends PropertyRule> = 
  Prop extends keyof TypeMap ?
  TypeMap[Prop] :
  Prop extends PrimitivePropertyRule ? 
  TypeMap[Prop['type']] :
  Prop extends ObjectRule ?
  AppliedObjectRule<Prop> :
  Prop extends ArrayRule ? 
  AppliedArrayRule<Prop> :
  never;

type AppliedObjectRuleWithoutCondition<Rule extends ObjectRule> = Expand<
  ObjectProps<
    AppliedFlattenObjectRule< 
    RuleKeyRemap<
    AppliedRuleAliases<
      Rule
    >>>
  >>;

export type AppliedObjectRule<Rule extends ObjectRule> = AppliedCondition<
  Rule,
  AppliedObjectRuleWithoutCondition<Rule>
>;

// If object condition is inside array rule, then have to remove object
// from the array, and it cant be nullable

export type AppliedArrayRule<Rule extends ArrayRule> =
  Rule['items'] extends ObjectRule ?
  AppliedObjectRuleWithoutCondition<Rule['items']>[] :
  Rule['items'] extends ArrayRule ?
  AppliedRule<Rule['items']>[] :
  IndexType<Rule['items']>[];

export type AppliedRule<RuleType extends Rule> = 
  RuleType extends ObjectRule ? 
  AppliedObjectRule<RuleType> :
  RuleType extends ArrayRule ?
  AppliedArrayRule<RuleType> : 
  never;
