import * as Types from '../types/Types';
import crypto from "crypto";

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

export function encryptPassword(password: string): Types.EncryptPassword {
  const saltBuf = crypto.randomBytes(64);
  const salt = saltBuf.toString("base64");

  const hashPasswordBuf = crypto.pbkdf2Sync(
    password,
    salt,
    100000,
    64,
    "sha512"
  );

  return {
    salt,
    password: hashPasswordBuf.toString("base64")
  }
}


export function encryptPasswordBySalt(password: string, salt: string): string {
  const hashPasswordBuf = crypto.pbkdf2Sync(
    password,
    salt,
    100000,
    64,
    "sha512"
  );

  return hashPasswordBuf.toString("base64");
}
