import * as Types from '../types/Types';

export function snakeCaseToCamelCase(input: string): string {
  return (
    input
      .split("_")
      .reduce(
        (res, word, i) =>
          i === 0
            ? word.toLowerCase()
            : `${res}${word.charAt(0).toUpperCase()}${word
              .substr(1)
              .toLowerCase()}`,
        ""
      ));
}


export function snakeObjToCamelObj(obj: Types.Data): Types.Data {
  const snakeKeys: string[] = Object.keys(obj);
  const camelKeys: string[] = snakeKeys.map((key: string): string => snakeCaseToCamelCase(key));
  const result: Types.Data = {};

  for (let i = 0; i < camelKeys.length; i++) {
    const key = camelKeys[i];
    result[camelKeys[i]] = obj[snakeKeys[i]];
  }

  return result;
}