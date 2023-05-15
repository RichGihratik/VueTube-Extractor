import type { IRuleIterator } from "./iterator";


// Collection of useful methods, also it makes possible to interact between different parts
// of pipeline 
export interface IPipelineContext {
  createRuleIterator(): IRuleIterator;
}