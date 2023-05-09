import type { PropertyRule, IndexTypeMap, PrimitivePropertyRule } from './common';

export type PropDefaultSet<Prop extends PropertyRule, First, Second> = Prop extends PrimitivePropertyRule
  ? Prop extends { default: IndexTypeMap<Prop['type']> }
    ? First
    : Second
  : Second;
