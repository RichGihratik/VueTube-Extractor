import {arrayRule, conditionalFunction, conditionalRule, objectRule, propertyRule, Rule} from "./types";
import {ErrorMessages, utilityErrors} from "@utils";
import {ArrayRuleHelper, ObjectRuleHelper} from "./parserHelpers";

export {ObjectRuleHelper, ArrayRuleHelper} from "./parserHelpers";

interface GenericRuleParser {
    parse(): any;
}

/**
 * Class to parse object rules
 * @param {object} toParse - The object to parse according to the given rule
 * @param {objectRule} rule - The rule to parse the object with
 */
export class ObjectRuleParser implements GenericRuleParser {
    private readonly TO_PARSE: { [key: string]: any };
    private KEYMAP: { [key: string]: string };
    private readonly isStrict: boolean;
    private readonly condition: conditionalFunction | { [key: string]: conditionalRule };
    private readonly RULE_NAME: string;
    private readonly RULE_TYPE: string;
    private PROPERTIES: { [key: string]: propertyRule };
    private readonly PROCESSED_OBJECT: { [key: string]: any };
    private Helper: ObjectRuleHelper

    constructor(toParse: { [key: string]: any }, rule: objectRule) {
        this.TO_PARSE = toParse;
        this.RULE_TYPE = rule.type;
        this.RULE_NAME = rule.name || 'objectRule';
        this.PROPERTIES = rule.properties;
        this.guardClauses();
        this.Helper = new ObjectRuleHelper(rule);
        const filledRule = this.Helper.fillRule();
        this.KEYMAP = filledRule.keymap as { [key: string]: string };
        this.isStrict = filledRule.strict as boolean;
        this.condition = filledRule.condition as conditionalFunction | { [key: string]: conditionalRule };
        this.PROPERTIES = filledRule.properties;
        this.PROCESSED_OBJECT = {};
    }

    /**
     * Method to parse a basic property. Simply returns the value of the given key in TO_PARSE
     * @param {string} key - The key to parse
     * @param {propertyRule} rule - The rule to parse the key with
     * @param {boolean} isStrictlyRequired - Whether the key is required and the rule is strict
     * @returns {any | undefined} - The value of the key in TO_PARSE. If the key is not present and the rule is strict, returns undefined
     */
    private parseBasicProperty(key: string, rule: propertyRule, isStrictlyRequired: boolean): any | undefined {
        if (!(key in this.TO_PARSE)) {
            const errorMessage = ErrorMessages.missingRequired("key", key, "applyObjectRule");
            return this.Helper.checkStrictlyRequired(isStrictlyRequired, new utilityErrors.VueTubeExtractorError(errorMessage), rule.default);
        }
        if (!this.Helper.checkTypeGuard(this.TO_PARSE[key], rule.type)) {
            const errorMessage = ErrorMessages.typeGuardMismatch(rule.type, typeof this.TO_PARSE[key], key)
            return this.Helper.checkStrictlyRequired(isStrictlyRequired, new TypeError(errorMessage), rule.default);
        }
        return this.TO_PARSE[key];
    }

    /**
     * Method to parse a property that is a rule. Essentially, it recursively calls applyObjectRule on the value of the key in TO_PARSE
     * @param {string} key - The key to parse
     * @param {propertyRule} rule - The rule to parse the key with
     * @param {boolean} isStrictlyRequired - Whether the key is required and the rule is strict
     * @returns {any | undefined} - The parsed result. If the key is not present and the rule is strict, returns undefined
     */
    private parseRecursiveProperty(key: string, rule: propertyRule, isStrictlyRequired: boolean): any | undefined {
        if (!rule.rule) {
            throw new utilityErrors.VueTubeExtractorError(ErrorMessages.missingValuesInRule(key, 'rule'));
        }
        let SUB_RULE_RESULT
        try {
            SUB_RULE_RESULT = parseRule(this.TO_PARSE[key], rule.rule);
        } catch (error) {
            // TODO: Catch errors from sub-rules and add additional information from the parent rule
            // For now, just rethrow the error and note that it was from a sub-rule
            let message = `error from sub-rule ${key}`;
            if (error instanceof Error) message += `: ${error.message}`;
            throw new utilityErrors.VueTubeExtractorError(message);
        }
        const errorMessage = ErrorMessages.missingRequired("key", key, "applyObjectRule");
        SUB_RULE_RESULT ??= this.Helper.checkStrictlyRequired(isStrictlyRequired, new utilityErrors.VueTubeExtractorError(errorMessage), rule.default);
        return SUB_RULE_RESULT
    }

    /**
     * Identifies the type of rule and calls the appropriate method to parse the property
     * @param {string} key - The key to parse
     * @param {propertyRule} rule - The rule to parse the key with
     * @returns {any | undefined} - The parsed result. If the key is not present and the rule is strict, returns undefined
     */
    private parseProperty(key: string, rule: propertyRule): any | undefined {
        const isStrictlyRequired = rule.required as boolean && this.isStrict && !rule.default;
        if (rule.type === 'group' || rule.type === 'rule') {
            return this.parseRecursiveProperty(key, rule, isStrictlyRequired);
        }
        return this.parseBasicProperty(key, rule, isStrictlyRequired);
    }

    /**
     * A series of checks to determine if the given rule is valid and can be parsed. Throws an error if the rule is invalid
     * @returns {void}
     */
    private guardClauses(): void {
        const errorMessage: string[] = [];
        if (this.RULE_TYPE !== 'object') {
            errorMessage.push(ErrorMessages.invalidRuleType('object', this.RULE_TYPE))
        }
        if (!this.PROPERTIES) {
            errorMessage.push(ErrorMessages.missingValuesInRule(this.RULE_NAME || 'object', 'properties'))
        }
        if (typeof this.TO_PARSE !== 'object' || Array.isArray(this.TO_PARSE)) {
            errorMessage.push(ErrorMessages.ruleTypeMismatch('object', Array.isArray(this.TO_PARSE) ? "array" : typeof this.TO_PARSE))
        }
        if (errorMessage.length > 0) {
            throw new utilityErrors.VueTubeExtractorError(errorMessage.join('\n'));
        }
    }

    /**
     * Public method to parse the object. Returns the parsed object
     * @returns {any | undefined} - The parsed object. If for whatever reason the result is an empty object, returns undefined
     */
    public parse(): any {
        if (this.condition && !this.Helper.evaluateCondition(this.TO_PARSE, this.condition)) {
            return {};
        }
        for (const [key, value] of Object.entries(this.PROPERTIES)) {
            const parsedProperty = this.parseProperty(key, value);
            if (parsedProperty) this.PROCESSED_OBJECT[this.Helper.followKeymap(key)] = parsedProperty;
        }
        return this.PROCESSED_OBJECT;
    }
}

/**
 * Class to parse array rules
 * @param {Array} toParse - The object to parse
 * @param {arrayRule} rule - The rule to parse the object with
 */
export class ArrayRuleParser implements GenericRuleParser {
    private readonly TO_PARSE: Array<any>;
    private readonly ITEMS: Rule;
    private PROCESSED_ARRAY: Array<any> = [];
    private readonly RULE_TYPE: string;
    private readonly RULE_NAME: string;
    private isStrict: boolean;
    private readonly condition: conditionalFunction | { [p: string]: conditionalRule };
    private Helper: ArrayRuleHelper;

    constructor(toParse: Array<any>, rule: arrayRule) {
        this.TO_PARSE = toParse;
        this.RULE_TYPE = rule.type;
        this.ITEMS = rule.items;
        this.Helper = new ArrayRuleHelper(rule);
        this.guardClauses();
        const filledRule = this.Helper.fillRule();
        this.RULE_NAME = filledRule.name || 'arrayRule';
        this.isStrict = filledRule.strict as boolean;
        this.condition = filledRule.condition as conditionalFunction | { [key: string]: conditionalRule };
    }

    /**
     * A series of checks to determine if the given rule is valid and can be parsed. Throws an error if the rule is invalid
     * @returns {void}
     */
    private guardClauses(): void {
        const errorMessage: string[] = [];
        if (this.RULE_TYPE !== 'array') {
            errorMessage.push(ErrorMessages.invalidRuleType('array', this.RULE_TYPE))
        }
        if (!this.ITEMS) {
            errorMessage.push(ErrorMessages.missingValuesInRule(this.RULE_NAME || 'array', 'items'))
        }
        if (!Array.isArray(this.TO_PARSE)) {
            errorMessage.push(ErrorMessages.ruleTypeMismatch('array', typeof this.TO_PARSE))
        }
        if (errorMessage.length > 0) {
            throw new utilityErrors.VueTubeExtractorError(errorMessage.join('\n'));
        }
    }

    /**
     * Public method to parse the array. Returns the parsed array
     * @returns {Array | undefined} - The parsed array. If for whatever reason the result is an empty array, returns undefined
     */
    public parse(): Array<any> | undefined {
        for (const item of this.TO_PARSE) {
            if (!this.Helper.checkTypeGuard(item, this.ITEMS.type)) {
                const errorMessage = ErrorMessages.subRuleError(this.RULE_NAME, ErrorMessages.typeGuardMismatch(this.ITEMS.type, typeof item));
                if (this.Helper.checkStrictlyRequired(this.isStrict, new TypeError(errorMessage), true)) continue;
            }
            if (this.condition && !this.Helper.evaluateCondition(item, this.condition)) {
                continue;
            }
            try {
                const parsedItem = parseRule(item, this.ITEMS);
                if (parsedItem) this.PROCESSED_ARRAY.push(parsedItem);
            } catch (e) {
                let errMsg: string | undefined;
                if (!(e instanceof Error)) {
                    errMsg = ErrorMessages.subRuleError(this.RULE_NAME, e ? e.toString() : ErrorMessages.unknownError);
                } else {
                    errMsg = ErrorMessages.subRuleError(this.RULE_NAME, e.message);
                }
                throw new utilityErrors.VueTubeExtractorError(errMsg);
            }
        }
        return this.PROCESSED_ARRAY.length > 0 ? this.PROCESSED_ARRAY : undefined;
    }
}

/**
 * Function that selects the appropriate parser for the given rule type
 * @param {any} toParse - The object to parse
 * @param {Rule} rule - The rule to parse the object with
 * @returns {any | undefined} - The parsed object. If for whatever reason the result is an empty object, returns undefined
 */
export function parseRule(toParse: any, rule: Rule): any | undefined {
    let Parser: GenericRuleParser;
    if (rule.type === 'object') {
        Parser = new ObjectRuleParser(toParse, rule);

    } else if (rule.type === 'array') {
        Parser = new ArrayRuleParser(toParse, rule);
    } else {
        throw new utilityErrors.VueTubeExtractorError(ErrorMessages.invalidRuleType('object or group', (rule as Rule).type || 'undefined'));
    }
    return Parser.parse();
}