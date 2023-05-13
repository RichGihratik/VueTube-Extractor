import {arrayRule, objectRule} from "../types-old";
import {ArrayRuleHelper, ObjectRuleHelper} from "../parserHelpers";

describe("Helper Tests", () => {
    describe("ObjectRuleHelper Tests", () => {
        test("if fillRule correctly defaults a given rule", () => {
            // @ts-expect-error no name
            const rule: objectRule = {
                type: "object",
                properties: {
                    test: {
                        type: "string",
                    },
                },
            };
            const Helper = new ObjectRuleHelper(rule);
            expect(Helper.fillRule()).toEqual({
                type: "object",
                flatten: false,
                properties: {
                    test: {
                        type: "string",
                        required: true,
                    },
                },
                strict: true,
                keymap: {},
                condition: expect.any(Function),
            });
        })
        test("if flattenObject correctly flattens a given object", () => {
            // @ts-expect-error no name
            const Helper = new ObjectRuleHelper({
                type: "object",
                properties: {
                    test: {
                        type: "string",
                    },
                },
            });
            expect(Helper.flattenConvertObject({
                test: {
                    test: "test",
                },
            })).toEqual({
                "test-test": "test",
            });
        });
        test("if flattenObject correctly flattens a given object with a keymap", () => {
            // @ts-expect-error no name
            const Helper = new ObjectRuleHelper({
                type: "object",
                properties: {
                    test: {
                        type: "string",
                    },
                },
                keymap: {
                    "test-test": "test2",
                },
            });
            expect(Helper.flattenConvertObject({
                test: {
                    test: "test",
                },
            })).toEqual({
                "test2": "test",
            });
        });
        test("if jsonPathToObject functions as expected", () => {
            // @ts-expect-error no name
            const Helper = new ObjectRuleHelper({
                type: "object",
                properties: {
                    test: {
                        type: "string",
                    }
                }
            })
            const jsonPath = "test.test[0]"
            const invalidJsonPath = "test.test[0].test"
            const testObject = {
                test: {
                    test: ["test"]
                }
            }
            expect(Helper.jsonPathToObject(jsonPath, testObject)).toEqual("test")
            expect(Helper.jsonPathToObject(invalidJsonPath, testObject)).toEqual(undefined)
        });
    });
    describe("ArrayRuleHelper Tests", () => {
        test("if fillRule correctly defaults a given rule", () => {
            const rule: arrayRule = {
                type: "array",
                // @ts-expect-error no name
                items: {
                    type: "object",
                    properties: {
                        test: {
                            type: "string",
                        }
                    }
                },
            };
            const Helper = new ArrayRuleHelper(rule);
            expect(Helper.fillRule()).toEqual({
                type: "array",
                limit: 0,
                items: {
                    type: "object",
                    properties: {
                        test: {
                            type: "string",
                        }
                    }
                },
                strict: true,
                condition: expect.any(Function),
            });
        });
    });
    describe("General Helper Tests", () => {
        let Helper: ObjectRuleHelper;
        beforeAll(() => {
            // @ts-expect-error no name
            const rule: objectRule = {
                type: "object",
                properties: {
                    test: {
                        type: "string",
                    },
                },
                keymap: {
                    test: "test2",
                }
            };
            Helper = new ObjectRuleHelper(rule);
        });
        test("if checkTypeGuard correctly checks a type guard", () => {
            expect(Helper.checkTypeGuard("test", "string")).toBe(true);
            expect(Helper.checkTypeGuard(1, "string")).toBe(false);
            expect(Helper.checkTypeGuard(1, "any")).toBe(true);
            expect(Helper.checkTypeGuard([], "object")).toBe(false);
            expect(Helper.checkTypeGuard([], "array")).toBe(true);
        });
        test("if followKeymap correctly follows a keymap", () => {
            expect(Helper.followKeymap("test")).toBe("test2");
            expect(Helper.followKeymap("test2")).toBe("test2");
        })
    });
});