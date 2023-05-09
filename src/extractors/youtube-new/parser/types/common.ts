// Available types enum
// =======================

export enum EParserTypes {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Any = 'any',
  Object = 'object',
  Array = 'array'
} 


// Common rule
// =======================

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
  items: Rule | Primitive;
  condition?: ConditionalFn;
}

export type Rule = ObjectRule | ArrayRule;


// Primitives
// =======================

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

type PrimitiveBase<Key extends keyof TypeMap> = { type: Key }; 

type Primitive = { [Key in keyof TypeMap]: PrimitiveBase<Key> }[keyof TypeMap] | keyof TypeMap;


// Property rules
// =======================

type PropertyBase = {
  required?: boolean;
  aliases?: readonly string[];
}

type MappedPrimitive<Key extends keyof TypeMap> = PropertyBase & PrimitiveBase<Key> & ({
  default: TypeMap[Key];
  expected?: never;
} | {
  default?: never;
  expected: TypeMap[Key];
} | {
  default?: never;
  expected?: never;
});

export type PrimitivePropertyRule = {
  [Key in keyof TypeMap]: MappedPrimitive<Key>
}[keyof TypeMap];

export type ObjectPropertyRule  = ObjectRule & PropertyBase;

type ArrayPropertyRule = ArrayRule & PropertyBase;

export type PropertyRule = ArrayPropertyRule | ObjectPropertyRule | PrimitivePropertyRule | keyof TypeMap;

export type ObjectRuleProps<Rule extends ObjectRule> = Rule['properties'];
