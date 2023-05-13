import { jsonPathToObject, parseBrackets } from '../jsonpath';

const mockItem = {
  item: {
    subEntry: {
      array: [
        3,
        5,
        7,
        {
          value: 4,
        },
      ],
      emptyArray: [],
    },
  },
  simpleFieldStr: 'testStr',
  simpleFieldNum: 4,
} as const;

describe('JSONPath Tests for Parser', () => {
  describe('Brackets Parser Tests', () => {
    it('Should not change initial property if brackets is not present', () => {
      let propKey = 'someProp';
      expect(parseBrackets(propKey).propName).toBe(propKey);

      propKey = '332ffsa';
      expect(parseBrackets(propKey).propName).toBe(propKey);

      propKey = '332f<>sa';
      expect(parseBrackets(propKey).propName).toBe(propKey);
    });

    it('Should not change initial property if brackets cannot be parsed correctly', () => {
      let propKey = 'someProp[';
      expect(parseBrackets(propKey).propName).toBe(propKey);

      propKey = 'someProp]]]';
      expect(parseBrackets(propKey).propName).toBe(propKey);

      propKey = 'som[eProp[[[[';
      expect(parseBrackets(propKey).propName).toBe(propKey);

      propKey = 'someProp]]][[[';
      expect(parseBrackets(propKey).propName).toBe(propKey);

      propKey = 'someP]][[][[]rop';
      expect(parseBrackets(propKey).propName).toBe(propKey);
    });

    it('Should return correct indexes', () => {
      const numIndex = 45;
      const strIndex = 'tes.plppot';
      const propName = 'someP]rop';
      let propKey = `${propName}[${numIndex}]`;

      let result = parseBrackets(propKey);
      expect(result.propName).toBe(propName);
      expect(result.indexes).toStrictEqual([numIndex]);

      propKey = `${propName}[${strIndex}]`;
      result = parseBrackets(propKey);
      expect(result.propName).toBe(propName);
      expect(result.indexes).toStrictEqual([strIndex]);

      propKey = `${propName}[${strIndex}][${numIndex}]`;
      result = parseBrackets(propKey);
      expect(result.propName).toBe(propName);
      expect(result.indexes).toStrictEqual([strIndex, numIndex]);

      propKey = `${propName}[${strIndex}][][[]]`;
      result = parseBrackets(propKey);
      expect(result.propName).toBe(propName);
      expect(result.indexes).toStrictEqual([strIndex, '', '[]']);
    });
  });

  it('Should return undefined, if path does not exist', () => {
    const nonExistingKey = 'some.super.complicated[path][without].sense';
    const emptyArrayKey = 'emptyArray[4]';

    expect(jsonPathToObject(nonExistingKey, mockItem)).toBe(undefined);
    expect(jsonPathToObject(emptyArrayKey, mockItem)).toBe(undefined);
  });

  it('Should correctly get items from object without path', () => {
    const keys = Object.keys(mockItem);

    for (const key of keys) {
      expect(jsonPathToObject(key, mockItem)).toEqual(mockItem[key as keyof typeof mockItem]);
    }
  });

  it('Should correctly get items from object with dot path', () => {
    const key = 'item';
    const subKey = 'subEntry';

    expect(jsonPathToObject(`${key}.${subKey}`, mockItem)).toStrictEqual(mockItem[key][subKey]);
  });

  it('Should correctly get items from arrays and brackets path', () => {
    const key = 'item';
    const subKey = 'subEntry';
    const arrayKey = 'array';
    const index = 3;
    const subArrayKey = 'value';

    expect(jsonPathToObject(`${key}[${subKey}].${arrayKey}[${index}].${subArrayKey}`, mockItem)).toEqual(
      mockItem[key][subKey][arrayKey][index][subArrayKey]
    );
  });
});
