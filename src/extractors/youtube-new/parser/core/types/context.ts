import type { Rule, ObjectRule, ArrayRule } from "./rule";

export interface IRuleIteratorContext {
  readonly key: string;
  readonly fullPath: (string | number)[]
  error(message: string): void; // Useful for multiple errors. Prevent further deep propagation
  skip(): void; // Skips all the childs of current node
  break(): void; // Prevents immediately even for current childs
}

export interface IRuleIterator {
  visitObjectRule(ctx: IRuleIteratorContext, rule: ObjectRule): void;
  visitArrayRule(ctx: IRuleIteratorContext, rule: ArrayRule): void;
}

export interface IPipelineContext {
  traverseRule(iterator: IRuleIterator, rule: Rule): void;
}