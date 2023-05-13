import type { ObjectRule, ObjectRuleProps, RuleKeymap } from "../core"; 

type RuleRemap<Rule extends ObjectRule> =
  Omit<Rule, 'properties'> & 
    {
      properties: {
      [ 
        Key in keyof ObjectRuleProps<Rule> as 
        Key extends keyof RuleKeymap<Rule> ? 
        RuleKeymap<Rule>[Key] extends string ? 
        RuleKeymap<Rule>[Key] : 
        Key : 
        Key
      ]: ObjectRuleProps<Rule>[Key] extends ObjectRule ? // Remap done recursively for flat to work correctly
      RuleRemap<ObjectRuleProps<Rule>[Key]> :
      ObjectRuleProps<Rule>[Key];
    }
  }

export type RuleKeyRemap<Rule> = 
  Rule extends ObjectRule ?
  RuleRemap<Rule> :
  never;