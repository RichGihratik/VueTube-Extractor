import { type TypeMap, EParserTypes, type ArrayToParse, type ObjectToParse  } from "./types";

export function isArray(item: unknown): item is ArrayToParse {
  return Array.isArray(item);
}

export function isObject(item: unknown): item is ObjectToParse {
  return typeof item === 'object' && item !== null;
}

export function isPrimitive(item: unknown, key: keyof TypeMap): boolean {
  return key === 'any' || typeof item === key;
} 

export function isPrimitiveKey(item: unknown): item is keyof TypeMap {
  return typeof item === 'string' && 
  Object.keys(EParserTypes).filter((key) => key === EParserTypes.Object || key === EParserTypes.Array).includes(item);
}
