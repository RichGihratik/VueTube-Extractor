export const OBJ_SEP = '.';
export const ARRAY_SEP = ['[', ']'] as const;

type ParsedBrackets = {
  propName: string;
  indexes: (number | string)[];
};

export function parseBrackets(propKey: string): ParsedBrackets {
  const propName = propKey.endsWith(ARRAY_SEP[1]) ? propKey.split(ARRAY_SEP[0])[0] : propKey;
  const result: ParsedBrackets = { propName, indexes: [] };
  const propIndexes = propKey.slice(propName.length + 1, propKey.length - 1);

  if (propIndexes.length > 0) {
    result.indexes = propIndexes.split(
      ARRAY_SEP.slice()
               .reverse()
               .join('')
      ).map(item => (isNaN(+item) ? item : +item)
    );
  }

  return result;
}

export function jsonPathToObject(path: string, obj: any): unknown {
  const pathArray = path.split(OBJ_SEP);
  let current = obj;
  for (const key of pathArray) {
    if (current === undefined) {
      return undefined;
    } else {
      const parsedKey = parseBrackets(key);
      current = current[parsedKey.propName];
      for (const index of parsedKey.indexes) {
        if (current === undefined) return undefined;
        current = current[index];
      }
    }
  }
  return current;
}
