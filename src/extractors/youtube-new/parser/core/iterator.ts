import { 
  type ArrayRule, 
  EParserTypes,  
  type IRuleVisitor, 
  type ObjectRule, 
  type Rule, 
  type IRuleIterator,
} from "./types";

import { VisitorContext } from "./visitorContext";
import { isSimplePrimitiveForm } from "./typeguards";
import { CoreParserError } from "./error";

class RuleIteratorError extends CoreParserError {
  constructor() {
    super("Invalid rule type!")
    this.name = "RuleIteratorError";
  }
}

const subruleLocation = (key: string | number) => `subrule at property "${key}"`;

const arraySubruleLocation = () => `array subrule`;

export class RuleIterator implements IRuleIterator {
  private isBreaked = false;

  constructor(
    private path: (number | string)[] = [], 
    private traceLocation: string[] = []
  ) {}

  // Path and trace methods
  // ========================

  private pushSubrule(key?: string | number) {
    this.traceLocation.push(!key ? arraySubruleLocation() : subruleLocation(key));
    if (key) this.path.push(key);
  }

  private popSubrule(isArray: boolean) {
    this.traceLocation.pop();
    if (isArray) this.path.pop();
  }

  // Iterator methods
  // ========================

  private call(callback: () => void) {
    try {
      callback();
    }
    catch(e) {
      if (e instanceof CoreParserError) {
        e.locations = e.locations.concat(this.traceLocation);
        throw e;
      } else if (e instanceof Error){
        const error =  new CoreParserError(e.message);
        error.locations = [...this.traceLocation];
        throw error;
      } else {
        const error =  new CoreParserError(String(e));
        error.locations = [...this.traceLocation];
        throw error;
      }
    }
  }

  private visitObject(visitor: IRuleVisitor, rule: ObjectRule): void {
    const ctx = new VisitorContext(
      visitor, 
      [...this.path], 
      RuleIterator
    );

    this.call(() => visitor.visitObjectRule(ctx, rule));

    this.isBreaked = ctx.isBreaked;

    if (ctx.isSkipped || this.isBreaked) {
      this.path.pop();
      return;
    }

    for (const [key, value] of Object.entries(rule.properties)) {
      if (this.isBreaked) break;

      if (isSimplePrimitiveForm(value)) continue;
      
      if (value.type === EParserTypes.Object) {
        this.pushSubrule(key);
        this.visitObject(visitor, value);
        this.popSubrule(false);
      } 

      if (value.type === EParserTypes.Array) {
        this.pushSubrule(key);
        this.visitArray(visitor, value);
        this.popSubrule(false);
      }
    }

    this.path.pop();
  }

  private visitArray(visitor: IRuleVisitor, rule: ArrayRule): void {
    const ctx = new VisitorContext(
      visitor, 
      [...this.path], 
      RuleIterator
    );

    this.call(() => visitor.visitArrayRule(ctx, rule));
    
    this.isBreaked = ctx.isBreaked;

    if (ctx.isSkipped || this.isBreaked) return;

    if (isSimplePrimitiveForm(rule.items)) return;

    if (rule.items.type === EParserTypes.Object) {
      this.pushSubrule();
      this.visitObject(visitor, rule.items);
      this.popSubrule(true);
    }
    if (rule.items.type === EParserTypes.Array) {
      this.pushSubrule();
      this.visitArray(visitor, rule.items);
      this.popSubrule(true);
    }   
  }

  traverseRule(rule: Rule, visitor: IRuleVisitor): void {
    if (rule.type === EParserTypes.Object) this.visitObject(visitor, rule);
    else if (rule.type === EParserTypes.Array) this.visitArray(visitor, rule);
    else throw new RuleIteratorError();
  }
}

