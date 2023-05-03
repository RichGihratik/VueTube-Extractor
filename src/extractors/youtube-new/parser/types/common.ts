export enum EParserTypes {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Any = 'any',
  Object = 'object',
  Array = 'array'
} 

export type TypeMap = {
  [EParserTypes.String]: string;
  [EParserTypes.Number]: number;
  [EParserTypes.Boolean]: boolean;
  [EParserTypes.Any]: any;
};

export type IndexTypeMap<Key> = 
  Key extends keyof TypeMap ?
  TypeMap[Key] :
  never;

export type ConditionalFn = (item: any) => boolean;

export interface ObjectRule {
  type: EParserTypes.Object;
  strict?: boolean;
  flatten?: boolean;
  flattenAll?: boolean;
  properties: Record<string, PropertyRule>;
  keymap?: Record<string, string>;
  condition?: ConditionalFn;
}

export interface ArrayRule {
  type: EParserTypes.Array;
  limit?: number;
  strict?: boolean;
  items: Rule;
  condition?: ConditionalFn;
}

export type Rule = ObjectRule | ArrayRule;

type PropertyBase = {
  required?: boolean;
  aliases?: readonly string[];
}

type MappedPrimitive<Key extends keyof TypeMap> = PropertyBase & ({
  type: Key;
  default: TypeMap[Key];
  expected?: never;
} | {
  type: Key;
  default?: never;
  expected: TypeMap[Key];
} | {
  type: Key;
  default?: never;
  expected?: never;
});

type PrimitivePropertyRule = {
  [Key in keyof TypeMap]: MappedPrimitive<Key>
}[keyof TypeMap];

export type ObjectPropertyRule  = ObjectRule & PropertyBase;

type ArrayPropertyRule = ArrayRule & PropertyBase;

export type PropertyRule = ArrayPropertyRule | ObjectPropertyRule | PrimitivePropertyRule;

export type ObjectRuleProps<Rule extends ObjectRule> = Rule['properties'];
