import type { ObjectRule, PropertyRule, ObjectRuleProps, PropertyBase } from './common';
import type { UnionToIntersection, PickNever } from './utils';

type PropAliases<Prop extends PropertyRule> = Prop extends PropertyBase ? Prop['aliases'] : never;

type AliasesUnion<Prop extends PropertyRule> = PropAliases<Prop> extends readonly string[]
  ? {
      [Key in keyof PropAliases<Prop>]: PropAliases<Prop>[Key];
    }[number]
  : never;

type ApplyAliasToProp<PropKeys extends string | number | symbol, Prop extends PropertyRule> = {
  [Key in AliasesUnion<Prop>]: Key extends PropKeys ? never: Prop;
};

type AppliedRuleAliasesWithNever<Rule extends ObjectRule> = Omit<Rule, 'properties'> & {
  properties: RecursiveAliases<Rule> &
    UnionToIntersection<
      {
        [Key in keyof ObjectRuleProps<Rule>]: ApplyAliasToProp<keyof ObjectRuleProps<Rule>, RecursiveAliases<Rule>[Key]>;
      }[keyof ObjectRuleProps<Rule>]
    >;
};

type RecursiveAliases<Rule extends ObjectRule> = {
  [Key in keyof ObjectRuleProps<Rule>]: ObjectRuleProps<Rule>[Key] extends ObjectRule
    ? AppliedRuleAliases<ObjectRuleProps<Rule>[Key]>
    : ObjectRuleProps<Rule>[Key];
};

export type AppliedRuleAliases<Rule> = Rule extends ObjectRule
  ? keyof PickNever<ObjectRuleProps<AppliedRuleAliasesWithNever<Rule>>> extends never
    ? AppliedRuleAliasesWithNever<Rule>
    : never
  : never;
