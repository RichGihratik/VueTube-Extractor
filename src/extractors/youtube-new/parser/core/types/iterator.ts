import type { Rule, ObjectRule, ArrayRule } from "./rule";

// TODO: Add JSDoc

export type TraverseOptions = {
  location?: string[];
  visitor?: IRuleVisitor;
}

// Object to control iterator
export interface IRuleVisitorContext {
  // Path to property
  readonly fullPath: (string | number)[];

  // Adds additional info to error
  error(message: string): void;
  
  // For manual traversing, it will use current visitor if not specified, but new iterator
  // location for stacktrace to debug, each item will be new line
  traverse(rule: Rule, options?: TraverseOptions): void; 

  // Skips all the childs of current node
  skip(): void; 

  // Prevents current iterator immediately even for current childs
  break(): void; 
}

export interface IRuleVisitor {
  visitObjectRule(ctx: IRuleVisitorContext, rule: ObjectRule): void;
  visitArrayRule(ctx: IRuleVisitorContext, rule: ArrayRule): void;
}

export interface IRuleIterator {
  traverseRule(rule: Rule, visitor: IRuleVisitor): void;
}
