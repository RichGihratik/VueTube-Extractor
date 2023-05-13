// Util type that makes result of type intersection visible in intellisense

export type Expand<T> = T extends object
  ? T extends infer O
    ? { -readonly [K in keyof O]: O[K] }
    : never
  : T

export type PickNever<T> = {
	[Key in keyof T as T[Key] extends never ? Key: never]: T[Key];
}

// Util type from https://github.com/sindresorhus/type-fest/blob/main/source/union-to-intersection.d.ts

export type UnionToIntersection<Union> = (
	Union extends unknown
		? (distributedUnion: Union) => void
		: never
) extends ((mergedIntersection: infer Intersection) => void)
	? Intersection
	: never;