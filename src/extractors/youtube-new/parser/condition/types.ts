import type { HasCondition, ObjectRule } from '../core';

export type AppliedCondition<Rule, Type> = Rule extends ObjectRule ? HasCondition<Rule, Type | undefined, Type> : never;
