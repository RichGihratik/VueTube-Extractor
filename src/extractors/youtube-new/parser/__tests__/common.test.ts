import { parse, parseToAny } from '../parser';
import { Rule, EParserTypes } from '../types';

describe('Common Parser Pipeline Tests', () => {
  it('Should not modify initial object and/or rule', () => {
    const rule = {
      type: EParserTypes.Object,
      keymap: {
        notAlias: 'remap',
        prop: 'notProp',
        'some.ridiculous.long[json][0][path]': 'simpleProp',
      },
      strict: false,
      flatten: true,
      properties: {
        'some.ridiculous.long[json][0][path]': {
          type: EParserTypes.Boolean,
        },
        prop: {
          type: EParserTypes.String,
          required: false,
        },
        nonPrimitive: {
          strict: false,
          type: EParserTypes.Object,
          aliases: ['someAlias', 'notAlias'],
          properties: {
            array: {
              type: EParserTypes.Array,
              items: {
                type: EParserTypes.Object,
                properties: {
                  prop: {
                    type: EParserTypes.Number,
                    aliases: ['another', 'nah'],
                  },
                },
              },
            },
          },
        },
      },
    } as const satisfies Rule;

    const item = { 
      prop: '', 
      some: {
        ridiculous: {
          long: {
            json: [{
              path: false,
            }]
          }
        }
      },
      nonPrimitive: {
        array: [
          {
            prop: 1,
            another: 2,
            nah: 3
          }
        ]
      }, 
      someAlias: {
        array: [
          {
            prop: 1,
            another: 2,
            nah: 3
          }
        ]
      }, 
      notAlias: {
        array: [
          {
            prop: 1,
            another: 2,
            nah: 3
          }
        ]
      }, 
      anotherProperty: {
        array: [
          {
            prop: 1,
            another: 2,
            nah: 3
          }
        ]
      } 
    };

    parse(item, rule);

    expect(rule).toStrictEqual(rule);
    expect(item).toStrictEqual(item);

    parseToAny(item, rule);

    expect(rule).toStrictEqual(rule);
    expect(item).toStrictEqual(item);
  });
});
