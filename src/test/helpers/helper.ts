import { AssertionError } from "node:assert";
import * as td from 'testdouble';

export const when = td.when;

export function mock<T>(c: new (...args: any[]) => T): T {
  return new (td.constructor(c));
}

export function mockObject(...propNames: string[]) {
  return td.object(propNames);
}

/**
 * Assert if `value` contains `includes` string.
 * @param {string} value The value that should contain the `includes` string.
 * @param {string} includes The string that should be inside the `value`.
 * @returns True when `value` contains `includes` string. Otherwise will throw `AssertionError`.
 * @throws {AssertionError} Will throw `AssertionError` when assert is false.
 * @remarks Copied from @jerone/assert-includes with permission from @jerone.
 */
export function assertIncludes(value: string, includes: string) {
  const result = value.includes(includes);
  if (result === true) return true;

  throw new AssertionError({
    message: 'Expected value to contain "includes":',
    actual: value,
    expected: includes,
    operator: "assertIncludes",
  });
}
