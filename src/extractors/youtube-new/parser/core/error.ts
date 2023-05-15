import { VueTubeExtractorError } from "@utils";

const STACK_SEPARATOR = "\n  at ";

export class CoreParserError extends VueTubeExtractorError {
  constructor(
    private readonly baseMsg: string
  ) {
    super(baseMsg);
    this.name = "CoreParserError";
  }

  private updateMessage() {
    this.baseMessage = this.baseMsg + STACK_SEPARATOR + this._locations.join(STACK_SEPARATOR);
  }

  private _locations: string[] = [];

  public get locations() {
    return [...this._locations];
  }

  public set locations(items: string[]) {
    this._locations = items;
    this.updateMessage();
  }
}