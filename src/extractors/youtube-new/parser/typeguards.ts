import type { ArrayToParse, ObjectToParse, TypeMap } from "./types";

export function isArray(item: unknown): item is ArrayToParse {
  return Array.isArray(item);
}

export function isObject(item: unknown): item is ObjectToParse {
  return typeof item === 'object' && item !== null;
}

export function isPrimitive<TypeKey extends keyof TypeMap>(item: unknown, key: TypeKey): item is TypeMap[TypeKey] {
  return key === 'any' || typeof item === key;
} 
