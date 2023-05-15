import { 
  type IRuleVisitor, 
  type IRuleVisitorContext, 
  type Rule, 
  type IRuleIterator,
  type TraverseOptions
} from "./types";

export type IteratorCtor =  new (path?: (string | number)[], locations?: string[]) => IRuleIterator

export class VisitorContext implements IRuleVisitorContext {
  constructor(
    private visitor: IRuleVisitor,
    private path: (string | number)[],
    private iteratorClass: IteratorCtor
  ) {}

  traverse(rule: Rule, options?: TraverseOptions): void {
    const location =  options?.location ? [...options.location] : undefined;
    const ctx = new this.iteratorClass(this.fullPath, location);
    ctx.traverseRule(rule, options?.visitor ?? this.visitor);
  }

  get fullPath(): (string | number)[] {
    return [...this.path];
  }

  isSkipped = false;
  isBreaked = false;

  private _errors: string[];

  get errors(): string[] {
    return [...this._errors];
  }

  error(message: string): void {
    this.isSkipped = true;
    this._errors.push(message);
  }

  skip(): void {
    this.isSkipped = true;
  }

  break(): void {
    this.isBreaked = true;
  }
}
