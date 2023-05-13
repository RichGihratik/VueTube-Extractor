import type { ObjectRule, PropertyRule } from "./rule";
import type { IndexType } from "../../appliedRule";
import type { PropDefaultSet, RuleStrictMode, PropRequired, ObjectRuleProps } from "./propUtils";

type PropNonNullable<Rule extends ObjectRule, Prop extends PropertyRule, KeyType> = PropDefaultSet<
  Prop, 
  KeyType, 
  RuleStrictMode<
    Rule,
    PropRequired<
      Prop,
      KeyType,
      never
    >,
    never
  >
>;

type PropNullable<Rule extends ObjectRule, Prop extends PropertyRule, KeyType> = PropDefaultSet<
  Prop, 
  never, 
  RuleStrictMode<
    Rule,
    PropRequired<
      Prop,
      never,
      KeyType
    >,
    KeyType
  >
>;

type NonNullableProps<Rule extends ObjectRule> = {
  [Key in keyof ObjectRuleProps<Rule> as PropNonNullable<Rule, ObjectRuleProps<Rule>[Key], Key>]: IndexType<ObjectRuleProps<Rule>[Key]>;
};

type NullableProps<Rule extends ObjectRule> = {
  [Key in keyof ObjectRuleProps<Rule> as PropNullable<Rule, ObjectRuleProps<Rule>[Key], Key>]?: IndexType<ObjectRuleProps<Rule>[Key]>;
};

export type ObjectProps<Rule> = 
  Rule extends ObjectRule ?
  NonNullableProps<Rule> & NullableProps<Rule> :
  never
;